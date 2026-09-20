import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY
  ? path.join('/tmp', 'tunegrab_data')
  : path.join(process.cwd(), 'data');

const USERS_FILE = path.join(DATA_DIR, 'users.json');

// In-Memory OTP Store: email -> { code, expiresAt, purpose }
const otpStore = new Map();
// In-Memory Users Cache fallback for serverless environments
let memoryUsersCache = null;

// Ensure data directory and users.json exist
function ensureDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    // Read-only filesystem fallback
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
    console.warn('Filesystem read warning, using memory cache:', err?.message);
  }
  return memoryUsersCache || [];
}

function writeUsers(users) {
  memoryUsersCache = users;
  ensureDb();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem write warning, persisted to memory cache:', err?.message);
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + '_tunegrab_salt_2026').digest('hex');
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
  
  // Disallow suspicious / broken domains
  const domain = clean.split('@')[1];
  if (!domain || !domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) {
    return false;
  }
  return true;
}

/**
 * Generates and stores a 6-digit OTP verification PIN for an email
 */
export function generateEmailOtp(email) {
  const cleanEmail = String(email).trim().toLowerCase();
  if (!validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid, real email address (e.g. name@gmail.com).');
  }

  // Generate 6-digit PIN
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  otpStore.set(cleanEmail, { code, expiresAt });

  return {
    email: cleanEmail,
    code,
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

  const stored = otpStore.get(cleanEmail);
  if (!stored) {
    throw new Error('No OTP request found for this email. Please request a new code.');
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(cleanEmail);
    throw new Error('The OTP code has expired. Please request a new verification code.');
  }

  if (String(stored.code).trim() !== String(enteredCode).trim()) {
    throw new Error('Incorrect 6-digit verification code. Please check and try again.');
  }

  // OTP is verified! Consume it
  otpStore.delete(cleanEmail);

  // Check if user already exists
  const users = readUsers();
  let user = users.find((u) => u.email === cleanEmail);

  if (!user) {
    // Auto-create verified user
    let userId = generateUserId();
    while (users.some((u) => u.userId === userId)) {
      userId = generateUserId();
    }

    user = {
      userId,
      name: String(name).trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      passwordHash: hashPassword(cleanEmail + '_verified_otp'),
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
 * Authenticates with Google OAuth
 */
export function authenticateWithGoogle({ email, name, avatar }) {
  const cleanEmail = String(email).trim().toLowerCase();
  if (!validateEmail(cleanEmail)) {
    throw new Error('Invalid Google account email.');
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
      passwordHash: hashPassword(cleanEmail + '_google_oauth'),
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

export function registerUser({ name, email, password }) {
  const cleanEmail = String(email).trim().toLowerCase();
  if (!validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid, real email address (e.g. name@gmail.com).');
  }

  const users = readUsers();
  if (users.some((u) => u.email === cleanEmail)) {
    throw new Error('An account with this email already exists. Please sign in instead.');
  }

  if (!password || password.length < 4) {
    throw new Error('Password must be at least 4 characters.');
  }

  let userId = generateUserId();
  while (users.some((u) => u.userId === userId)) {
    userId = generateUserId();
  }

  const newUser = {
    userId,
    name: String(name).trim() || cleanEmail.split('@')[0],
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

export function loginUser({ identifier, password }) {
  const users = readUsers();
  const cleanId = String(identifier).trim().toLowerCase();

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      u.userId.toLowerCase() === cleanId
  );

  if (!user) {
    throw new Error('No account found with this User ID or Email. Please register first.');
  }

  const targetHash = hashPassword(password);
  if (user.passwordHash !== targetHash) {
    throw new Error('Incorrect password. Please verify and try again.');
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
    // If not found by userId, check if key is valid globally
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

/**
 * Resets user password after verifying 6-digit OTP code
 */
export function resetPasswordWithOtp({ email, code, newPassword }) {
  const cleanEmail = String(email).trim().toLowerCase();
  if (!validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  const stored = otpStore.get(cleanEmail);
  if (!stored) {
    throw new Error('No OTP request found for this email. Please request a new code.');
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(cleanEmail);
    throw new Error('The OTP code has expired. Please request a new verification code.');
  }

  if (String(stored.code).trim() !== String(code).trim()) {
    throw new Error('Incorrect 6-digit verification code. Please check and try again.');
  }

  if (!newPassword || newPassword.length < 4) {
    throw new Error('New password must be at least 4 characters long.');
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

/**
 * Updates user profile information
 */
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

const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
let memoryTransactionsCache = null;

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
    console.warn('Transactions read warning:', err?.message);
  }
  return memoryTransactionsCache || [];
}

function writeTransactions(txs) {
  memoryTransactionsCache = txs;
  ensureDb();
  try {
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(txs, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Transactions write warning:', err?.message);
  }
}

/**
 * Records a new payment / VIP transaction
 */
export function recordPaymentTransaction({ orderId, txnRef, plan, amount, method, userId, userEmail, key, status = 'SUCCESS' }) {
  const txs = readTransactions();
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
  writeTransactions(txs.slice(0, 200)); // keep last 200 transactions
  return newTxn;
}

/**
 * Fetches transactions for a user
 */
export function getPaymentTransactions(userId) {
  const txs = readTransactions();
  if (!userId) return txs;
  return txs.filter((t) => t.userId === userId || t.userEmail === userId);
}


