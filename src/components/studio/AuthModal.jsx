'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Key, 
  ArrowRight,
  UserPlus,
  LogIn,
  Smartphone,
  RefreshCw,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authMode, 
    login, 
    register, 
    sendOtp, 
    verifyOtp, 
    resetPassword,
    loginWithGoogle 
  } = useAuth();
  
  // Tabs: 'login' | 'register' | 'otp' | 'forgot'
  const [tab, setTab] = useState(authMode === 'register' ? 'register' : 'login');
  
  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // OTP Flow
  const [emailForOtp, setEmailForOtp] = useState('');
  const [nameForOtp, setNameForOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Password / User ID Login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot Password Flow
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Sync tab with initial authMode when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setTab(authMode === 'register' ? 'register' : 'login');
      setError('');
      setSuccessData(null);
      setOtpSent(false);
      setOtpCode('');
      setForgotOtpSent(false);
      setForgotCode('');
    }
  }, [isAuthModalOpen, authMode]);

  // Resend Timer effect
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!isAuthModalOpen) return null;

  // --- Handlers ---

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!regName || regName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!regEmail || !regEmail.includes('@') || !regEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const user = await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });
      setSuccessData(user);
      setTimeout(() => {
        closeAuthModal();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setError('Please enter your User ID/Email and password.');
      return;
    }

    setLoading(true);

    try {
      const user = await login({ 
        identifier: loginIdentifier.trim(), 
        password: loginPassword 
      });
      setSuccessData(user);
      setTimeout(() => {
        closeAuthModal();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Invalid User ID / Email or Password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailForOtp || !emailForOtp.includes('@') || !emailForOtp.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      await sendOtp(emailForOtp.trim());
      setOtpSent(true);
      setResendTimer(60);
    } catch (err) {
      setError(err.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const user = await verifyOtp({
        email: emailForOtp.trim(),
        code: otpCode.trim(),
        name: nameForOtp.trim(),
      });
      setSuccessData(user);
      setTimeout(() => {
        closeAuthModal();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Incorrect verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);

    try {
      await sendOtp(forgotEmail.trim());
      setForgotOtpSent(true);
      setResendTimer(60);
    } catch (err) {
      setError(err.message || 'Failed to send password recovery code.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    setError('');

    if (!forgotCode || forgotCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const user = await resetPassword({
        email: forgotEmail.trim(),
        code: forgotCode.trim(),
        newPassword: forgotNewPassword,
      });
      setSuccessData(user);
      setTimeout(() => {
        closeAuthModal();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#18191f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#f0fc54] via-emerald-400 to-[#f0fc54]" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 md:p-8 space-y-5">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0fc54]/10 border border-[#f0fc54]/20 text-[#f0fc54] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>TuneGrab Cloud Studio</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {tab === 'login' && 'Welcome Back'}
              {tab === 'register' && 'Create Your Account'}
              {tab === 'otp' && 'Email Verification'}
              {tab === 'forgot' && 'Reset Password'}
            </h3>
            <p className="text-xs text-zinc-400">
              {tab === 'login' && 'Sign in to access your saved downloads and VIP license'}
              {tab === 'register' && 'Join TuneGrab for high-speed 320kbps music conversion'}
              {tab === 'otp' && 'Instant sign in with a 6-digit security code'}
              {tab === 'forgot' && 'Enter your registered email to set a new password'}
            </p>
          </div>

          {/* Tab Navigation */}
          {tab !== 'forgot' && !successData && (
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#24252f] rounded-2xl border border-white/5">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  tab === 'login'
                    ? 'bg-[#f0fc54] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  tab === 'register'
                    ? 'bg-[#f0fc54] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTab('otp');
                  setError('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  tab === 'otp'
                    ? 'bg-[#f0fc54] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>OTP Code</span>
              </button>
            </div>
          )}

          {/* Success Banner */}
          {successData && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 animate-bounce" />
              <div className="font-extrabold text-sm text-white">Authenticated Successfully!</div>
              <div className="text-xs text-zinc-300">
                Welcome, <strong>{successData.name}</strong> ({successData.userId})
              </div>
              <p className="text-[11px] text-zinc-400">Loading your music studio workspace...</p>
            </div>
          )}

          {/* Error Banner */}
          {error && !successData && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN (EMAIL / USER ID + PASSWORD) */}
          {tab === 'login' && !successData && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  User ID (e.g. TG-8924) or Registered Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="TG-8924 or your@email.com"
                    className="w-full bg-[#24252f] text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-white/5 focus:border-[#f0fc54] outline-none transition font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot');
                      setError('');
                    }}
                    className="text-[10px] text-[#f0fc54] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#24252f] text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-white/5 focus:border-[#f0fc54] outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                <span>Sign In to Studio</span>
              </button>

              <div className="text-center pt-1">
                <p className="text-[11px] text-zinc-400">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setTab('register');
                      setError('');
                    }}
                    className="text-[#f0fc54] hover:underline font-bold cursor-pointer"
                  >
                    Create one now
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP (CREATE ACCOUNT) */}
          {tab === 'register' && !successData && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Amar Max"
                    className="w-full bg-[#24252f] text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-white/5 focus:border-[#f0fc54] outline-none transition font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-[#24252f] text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-white/5 focus:border-[#f0fc54] outline-none transition font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full bg-[#24252f] text-white text-xs pl-8 pr-3 py-3 rounded-2xl border border-white/5 focus:border-[#f0fc54] outline-none transition font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Confirm Pass
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat pass"
                      className="w-full bg-[#24252f] text-white text-xs pl-8 pr-3 py-3 rounded-2xl border border-white/5 focus:border-[#f0fc54] outline-none transition font-medium"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                <span>Create Free Studio Account</span>
              </button>

              <div className="text-center pt-1">
                <p className="text-[11px] text-zinc-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      setError('');
                    }}
                    className="text-[#f0fc54] hover:underline font-bold cursor-pointer"
                  >
                    Sign In here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 3: 6-DIGIT EMAIL OTP VERIFICATION */}
          {tab === 'otp' && !successData && (
            <div className="space-y-4">
              {!otpSent ? (
                /* Step 1: Request OTP */
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Your Full Name (Optional)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={nameForOtp}
                        onChange={(e) => setNameForOtp(e.target.value)}
                        placeholder="e.g. Amar Max"
                        className="w-full bg-[#24252f] text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-white/5 focus:border-[#f0fc54] outline-none transition font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={emailForOtp}
                        onChange={(e) => setEmailForOtp(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-[#24252f] text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-white/5 focus:border-[#f0fc54] outline-none transition font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    <span>Send 6-Digit Verification Code</span>
                  </button>
                </form>
              ) : (
                /* Step 2: Enter 6-Digit OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-zinc-300">
                        Enter 6-Digit Code for <strong>{emailForOtp}</strong>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode('');
                          setError('');
                        }}
                        className="text-[10px] text-zinc-400 hover:text-white underline cursor-pointer"
                      >
                        Change Email
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full bg-[#24252f] text-center text-xl font-mono tracking-widest text-[#f0fc54] py-3.5 rounded-2xl border-2 border-white/10 focus:border-[#f0fc54] outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full py-3.5 rounded-2xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Verify Code & Sign In</span>
                  </button>

                  <div className="text-center pt-1">
                    {resendTimer > 0 ? (
                      <span className="text-[11px] text-zinc-500">Resend code in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[11px] text-[#f0fc54] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Resend Code
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: FORGOT PASSWORD RECOVERY */}
          {tab === 'forgot' && !successData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">Reset Account Password</h4>
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setError('');
                  }}
                  className="text-[10px] text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>

              {!forgotOtpSent ? (
                <form onSubmit={handleForgotSendOtp} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Enter Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-[#24252f] text-white text-xs pl-10 pr-4 py-3 rounded-2xl border border-white/5 focus:border-[#f0fc54] outline-none transition font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    <span>Send Password Reset OTP</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotReset} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-zinc-300">
                      6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full bg-[#24252f] text-center font-mono text-lg text-[#f0fc54] py-2.5 rounded-2xl border border-white/10 focus:border-[#f0fc54] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-zinc-300">
                      New Password (Min 6 chars)
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-[#24252f] text-white text-xs px-4 py-2.5 rounded-2xl border border-white/5 focus:border-[#f0fc54] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || forgotCode.length < 6}
                    className="w-full py-3.5 rounded-2xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Update Password & Sign In</span>
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="pt-2 text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SHA Encrypted • Verified User ID Cloud Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
