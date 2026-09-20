import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY
  ? path.join('/tmp', 'tunegrab_data')
  : path.join(process.cwd(), 'data');

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
const VIP_KEYS_FILE = path.join(DATA_DIR, 'vip_keys.json');

// In-Memory OTP Store: email -> { code, expiresAt, attempts }
const otpStore = new Map();

// In-Memory Caches for serverless lambdas
let memoryUsersCache = null;
let memoryTransactionsCache = null;
let memoryVipKeysCache = null;

// Preset initial master VIP keys for testing & admin
const INITIAL_MASTER_KEYS = [
  { key: 'VIP-PRO-2026', plan: 'lifetime', durationDays: 3650, isRedeemed: false, redeemedBy: null },
  { key: 'TG-VIP-PREMIUM320', plan: 'monthly', durationDays: 30, isRedeemed: false, redeemedBy: null },
  { key: 'TG-VIP-AMARMAX', plan: 'lifetime', durationDays: 3650, isRedeemed: false, redeemedBy: null },
];

function ensureDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
    if (!fs.existsSync(TRANSACTIONS_FILE)) {
      fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
    if (!fs.existsSync(VIP_KEYS_FILE)) {
      fs.writeFileSync(VIP_KEYS_FILE, JSON.stringify(INITIAL_MASTER_KEYS, null, 2), 'utf-8');
    }
  } catch (err) {
    // Read-only environment fallback
  }
}

function readUsers() {
  ensureDb();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      const parsed = JSON.parse(raw) || [];
      memoryUsersCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn('Users DB read warning:', err?.message);
  }
  return memoryUsersCache || [];
}

function writeUsers(users) {
  memoryUsersCache = users;
  ensureDb();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Users DB write warning:', err?.message);
  }
}

function readTransactions() {
  ensureDb();
  try {
    if (fs.existsSync(TRANSACTIONS_FILE)) {
      const raw = fs.readFileSync(TRANSACTIONS_FILE, 'utf-8');
      const parsed = JSON.parse(raw) || [];
      memoryTransactionsCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn('Transactions DB read warning:', err?.message);
  }
  return memoryTransactionsCache || [];
}

function writeTransactions(txs) {
  memoryTransactionsCache = txs;
  ensureDb();
  try {
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(txs, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Transactions DB write warning:', err?.message);
  }
}

function readVipKeys() {
  ensureDb();
  try {
    if (fs.existsSync(VIP_KEYS_FILE)) {
      const raw = fs.readFileSync(VIP_KEYS_FILE, 'utf-8');
      const parsed = JSON.parse(raw) || [];
      memoryVipKeysCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn('VIP Keys DB read warning:', err?.message);
  }
  return memoryVipKeysCache || INITIAL_MASTER_KEYS;
}

function writeVipKeys(keys) {
  memoryVipKeysCache = keys;
  ensureDb();
  try {
    fs.writeFileSync(VIP_KEYS_FILE, JSON.stringify(keys, null, 2), 'utf-8');
  } catch (err) {
    console.warn('VIP Keys DB write warning:', err?.message);
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password) + '_tunegrab_secure_salt_2026').digest('hex');
}

function generateUserId() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `TG-${num}`;
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(clean)) return false;
  
  const domain = clean.split('@')[1];
  if (!domain || !domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) {
    return false;
  }
  return true;
}

/**
 * Generates and securely stores a 6-digit OTP verification PIN
 */
export function generateEmailOtp(email) {
  const cleanEmail = String(email).trim().toLowerCase();
  if (!validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address (e.g. name@gmail.com).');
  }

  // Generate 6-digit PIN
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  otpStore.set(cleanEmail, { code, expiresAt, attempts: 0 });

  // Log on server for administration / debugging
  console.log(`[TuneGrab Security OTP] Generated code for ${cleanEmail}: ${code}`);

  return {
    email: cleanEmail,
    code, // Returned for server mailers/logging, NOT sent directly to public UI
    expiresInSeconds: 600,
  };
}

/**
 * Verifies the 6-digit OTP PIN and logs in or creates the account
 */
export function verifyEmailOtp(email, enteredCode, name = '') {
  const cleanEmail = String(email).trim().toLowerCase();
  if (!validateEmail(cleanEmail)) {
    throw new Error('Invalid email address format.');
  }

  if (!enteredCode || String(enteredCode).trim().length !== 6) {
    throw new Error('Please enter a complete 6-digit verification code.');
  }

  const stored = otpStore.get(cleanEmail);
  if (!stored) {
    throw new Error('No OTP request found for this email. Please request a new verification code.');
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(cleanEmail);
    throw new Error('The OTP code has expired. Please request a new verification code.');
  }

  stored.attempts = (stored.attempts || 0) + 1;
  if (stored.attempts > 5) {
    otpStore.delete(cleanEmail);
    throw new Error('Too many invalid attempts. Please request a fresh OTP.');
  }

  if (String(stored.code).trim() !== String(enteredCode).trim()) {
    throw new Error('Incorrect 6-digit verification code. Please check and try again.');
  }

  // OTP verified! Clean it up
  otpStore.delete(cleanEmail);

  // Find or create user
  const users = readUsers();
  let user = users.find((u) => u.email === cleanEmail);

  if (!user) {
    let userId = generateUserId();
    while (users.some((u) => u.userId === userId)) {
      userId = generateUserId();
    }

    user = {
      userId,
      name: String(name).trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      passwordHash: hashPassword(cleanEmail + '_otp_verified_key'),
      createdAt: Date.now(),
      isVip: false,
      vipKey: null,
      vipExpiry: null,
      downloads: [],
      favorites: [],
      authProvider: 'email_otp',
    };

    users.push(user);
    writeUsers(users);
  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

/**
 * Register a new user with strict validations
 */
export function registerUser({ name, email, password }) {
  const cleanEmail = String(email).trim().toLowerCase();
  if (!validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address (e.g. name@gmail.com).');
  }

  if (!name || String(name).trim().length < 2) {
    throw new Error('Please enter your full name (at least 2 characters).');
  }

  if (!password || String(password).length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const users = readUsers();
  if (users.some((u) => u.email === cleanEmail)) {
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  let userId = generateUserId();
  while (users.some((u) => u.userId === userId)) {
    userId = generateUserId();
  }

  const newUser = {
    userId,
    name: String(name).trim(),
    email: cleanEmail,
    passwordHash: hashPassword(password),
    createdAt: Date.now(),
    isVip: false,
    vipKey: null,
    vipExpiry: null,
    downloads: [],
    favorites: [],
    authProvider: 'password',
  };

  users.push(newUser);
  writeUsers(users);

  const { passwordHash, ...safeUser } = newUser;
  return safeUser;
}

/**
 * Login user with strict credentials validation
 */
export function loginUser({ identifier, password }) {
  if (!identifier || !password) {
    throw new Error('Please enter your User ID/Email and password.');
  }

  const users = readUsers();
  const cleanId = String(identifier).trim().toLowerCase();

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      u.userId.toLowerCase() === cleanId
  );

  if (!user) {
    throw new Error('No registered account found with this User ID / Email. Please sign up first.');
  }

  const targetHash = hashPassword(password);
  if (user.passwordHash !== targetHash) {
    throw new Error('Incorrect password. Please verify and try again.');
  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

/**
 * Authenticates with Google OAuth / SSO
 */
export function authenticateWithGoogle({ email, name, avatar }) {
  const cleanEmail = String(email).trim().toLowerCase();
  if (!validateEmail(cleanEmail)) {
    throw new Error('Invalid Google account email address.');
  }

  const users = readUsers();
  let user = users.find((u) => u.email === cleanEmail);

  if (!user) {
    let userId = generateUserId();
    while (users.some((u) => u.userId === userId)) {
      userId = generateUserId();
    }

    user = {
      userId,
      name: String(name).trim() || 'Google User',
      email: cleanEmail,
      avatar: avatar || null,
      passwordHash: hashPassword(cleanEmail + '_google_auth_2026'),
      createdAt: Date.now(),
      isVip: false,
      vipKey: null,
      vipExpiry: null,
      downloads: [],
      favorites: [],
      authProvider: 'google',
    };

    users.push(user);
    writeUsers(users);
  } else if (avatar && !user.avatar) {
    user.avatar = avatar;
    writeUsers(users);
  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function getUserById(userId) {
  const users = readUsers();
  const user = users.find((u) => u.userId === userId);
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function recordUserDownload(userId, track) {
  const users = readUsers();
  const index = users.findIndex((u) => u.userId === userId);
  if (index === -1) return null;

  const user = users[index];
  if (!user.downloads) user.downloads = [];

  const cleanTrack = {
    id: track.id || Date.now().toString(),
    title: track.title,
    artist: track.artist,
    duration: track.duration || 180,
    thumbnail: track.thumbnail,
    downloadedAt: Date.now(),
  };

  user.downloads = [cleanTrack, ...user.downloads.filter((d) => d.title !== cleanTrack.title)].slice(0, 50);
  writeUsers(users);

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function toggleUserFavorite(userId, track) {
  const users = readUsers();
  const index = users.findIndex((u) => u.userId === userId);
  if (index === -1) return null;

  const user = users[index];
  if (!user.favorites) user.favorites = [];

  const exists = user.favorites.some((f) => f.title === track.title);
  if (exists) {
    user.favorites = user.favorites.filter((f) => f.title !== track.title);
  } else {
    user.favorites.unshift({
      id: track.id || Date.now().toString(),
      title: track.title,
      artist: track.artist,
      duration: track.duration || 180,
      thumbnail: track.thumbnail,
      previewUrl: track.previewUrl || null,
      favoritedAt: Date.now(),
    });
  }

  writeUsers(users);

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function updateUserVip(userId, key, durationDays = 30) {
  const users = readUsers();
  const index = users.findIndex((u) => u.userId === userId || u.email === userId);
  if (index === -1) {
    return { isVip: true, vipKey: key, vipExpiry: durationDays ? Date.now() + durationDays * 24 * 60 * 60 * 1000 : null };
  }

  const user = users[index];
  user.isVip = true;
  user.vipKey = key;
  user.vipExpiry = durationDays ? Date.now() + durationDays * 24 * 60 * 60 * 1000 : null;

  writeUsers(users);

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function resetPasswordWithOtp({ email, code, newPassword }) {
  const cleanEmail = String(email).trim().toLowerCase();
  if (!validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  if (!code || String(code).trim().length !== 6) {
    throw new Error('Please enter the 6-digit verification code.');
  }

  const stored = otpStore.get(cleanEmail);
  if (!stored) {
    throw new Error('No password reset OTP request found for this email. Please request a new code.');
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(cleanEmail);
    throw new Error('The OTP code has expired. Please request a new verification code.');
  }

  if (String(stored.code).trim() !== String(code).trim()) {
    throw new Error('Incorrect 6-digit verification code. Please check and try again.');
  }

  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  otpStore.delete(cleanEmail);

  const users = readUsers();
  const user = users.find((u) => u.email === cleanEmail);
  if (!user) {
    throw new Error('No account found associated with this email address.');
  }

  user.passwordHash = hashPassword(newPassword);
  writeUsers(users);

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function updateUserProfile(userId, { name, avatar }) {
  const users = readUsers();
  const index = users.findIndex((u) => u.userId === userId);
  if (index === -1) throw new Error('User not found.');

  const user = users[index];
  if (name && typeof name === 'string') {
    user.name = name.trim();
  }
  if (avatar !== undefined) {
    user.avatar = avatar;
  }

  writeUsers(users);

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

/**
 * Records a new payment / VIP transaction with duplicate UTR checking
 */
export function recordPaymentTransaction({ orderId, txnRef, plan, amount, method, userId, userEmail, key, status = 'SUCCESS' }) {
  const txs = readTransactions();

  // Strict duplicate UTR check
  if (txnRef) {
    const cleanRef = String(txnRef).trim();
    const existing = txs.find((t) => t.txnRef === cleanRef);
    if (existing) {
      throw new Error(`Duplicate Transaction: This UPI Reference (UTR ${cleanRef}) has already been submitted on ${new Date(existing.timestamp).toLocaleString()}.`);
    }
  }

  const newTxn = {
    id: `TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    orderId: orderId || `ORD-${Date.now()}`,
    txnRef: txnRef || null,
    plan: plan || 'monthly',
    amount: amount || 199,
    currency: 'INR',
    method: method || 'UPI',
    userId: userId || 'GUEST',
    userEmail: userEmail || 'guest@tunegrab.app',
    key: key || null,
    status,
    timestamp: Date.now(),
  };

  txs.unshift(newTxn);
  writeTransactions(txs.slice(0, 500));
  return newTxn;
}

export function getPaymentTransactions(userId) {
  const txs = readTransactions();
  if (!userId) return txs;
  return txs.filter((t) => t.userId === userId || t.userEmail === userId);
}

/**
 * Strict License Key Verification & Redemption
 */
export function verifyAndRedeemKey(rawKey, userId = null) {
  if (!rawKey || typeof rawKey !== 'string') {
    throw new Error('Please enter a valid VIP license key.');
  }

  const cleanKey = rawKey.trim().toUpperCase();
  const keys = readVipKeys();

  const foundKey = keys.find((k) => k.key.toUpperCase() === cleanKey);
  if (!foundKey) {
    throw new Error('Invalid VIP License Key. Key not found in official registry.');
  }

  if (foundKey.isRedeemed && foundKey.redeemedBy && foundKey.redeemedBy !== userId) {
    throw new Error(`This VIP License Key was already redeemed by user ${foundKey.redeemedBy}. Single-user license.`);
  }

  // Mark redeemed
  foundKey.isRedeemed = true;
  foundKey.redeemedBy = userId || 'USER';
  foundKey.redeemedAt = Date.now();
  writeVipKeys(keys);

  if (userId) {
    updateUserVip(userId, cleanKey, foundKey.durationDays || 30);
  }

  return {
    key: cleanKey,
    plan: foundKey.plan || 'PRO',
    durationDays: foundKey.durationDays || 30,
  };
}

/**
 * Issue and register a new legitimate VIP license key in the official store
 */
export function issueVipKey({ plan, durationDays, orderId, userId }) {
  const keys = readVipKeys();
  const randomCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  const newKey = `TG-VIP-${plan.toUpperCase()}-${randomCode}-${Math.floor(1000 + Math.random() * 9000)}`;

  const keyRecord = {
    key: newKey,
    plan,
    durationDays,
    orderId,
    isRedeemed: true,
    redeemedBy: userId || 'PURCHASER',
    createdAt: Date.now(),
    redeemedAt: Date.now(),
  };

  keys.unshift(keyRecord);
  writeVipKeys(keys);

  return newKey;
}
