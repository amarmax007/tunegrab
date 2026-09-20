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
  
  // Tabs: 'register' | 'otp' | 'password' | 'forgot'
  const [tab, setTab] = useState(authMode === 'register' ? 'register' : 'otp');
  
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
  const [incomingCodeBanner, setIncomingCodeBanner] = useState('');
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
      setTab(authMode === 'register' ? 'register' : 'otp');
      setError('');
      setSuccessData(null);
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

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (regPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);

    try {
      const user = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
      });
      setSuccessData(user);
      setTimeout(() => {
        closeAuthModal();
      }, 2200);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await sendOtp(emailForOtp);
      setOtpSent(true);
      setResendTimer(60);
      if (res.code) {
        setIncomingCodeBanner(res.code);
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await verifyOtp({
        email: emailForOtp,
        code: otpCode,
        name: nameForOtp,
      });
      setSuccessData(user);
      setTimeout(() => {
        closeAuthModal();
      }, 2200);
    } catch (err) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ identifier: loginIdentifier, password: loginPassword });
      setSuccessData(user);
      setTimeout(() => {
        closeAuthModal();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Invalid User ID/Email or Password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await sendOtp(forgotEmail);
      setForgotOtpSent(true);
      setResendTimer(60);
      if (res.code) {
        setIncomingCodeBanner(res.code);
      }
    } catch (err) {
      setError(err.message || 'Failed to send recovery code.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await resetPassword({
        email: forgotEmail,
        code: forgotCode,
        newPassword: forgotNewPassword,
      });
      setSuccessData(user);
      setTimeout(() => {
        closeAuthModal();
      }, 2200);
    } catch (err) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const targetEmail = regEmail || emailForOtp || loginIdentifier;
      if (!targetEmail || !targetEmail.includes('@')) {
        throw new Error('Please enter your email in the field below to continue with Google.');
      }
      const googleUser = await loginWithGoogle({
        email: targetEmail,
        name: regName || nameForOtp || targetEmail.split('@')[0],
        avatar: '',
      });
      setSuccessData(googleUser);
      setTimeout(() => {
        closeAuthModal();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Google Sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#1a1b22] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#be5c2b]/40 via-[#252630] to-[#1a1b22] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f0fc54] text-black flex items-center justify-center font-black shadow-lg shadow-[#f0fc54]/20">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                TuneGrab Account Hub
              </h3>
              <p className="text-[11px] text-zinc-400">Sync library, history & VIP across devices</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/5 bg-[#16171d] p-1.5 gap-1">
          <button
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              tab === 'register'
                ? 'bg-[#f0fc54] text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
          <button
            onClick={() => {
              setTab('otp');
              setError('');
              setOtpSent(false);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              tab === 'otp'
                ? 'bg-[#f0fc54] text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Email OTP</span>
          </button>
          <button
            onClick={() => {
              setTab('password');
              setError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              tab === 'password'
                ? 'bg-[#f0fc54] text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Box */}
          {successData && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-3 text-center animate-fadeIn">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
              <div>
                <p className="font-extrabold text-base text-white">Authentication Verified!</p>
                <p className="text-[11px] text-zinc-300 mt-0.5">Welcome, <strong>{successData.name}</strong></p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-emerald-500/30 font-mono text-xs text-[#f0fc54]">
                Permanent User ID: <strong>{successData.userId}</strong>
              </div>
              <p className="text-[10px] text-zinc-400">
                Logged in successfully. Restoring your download history & favorites...
              </p>
            </div>
          )}

          {/* TAB 1: SIGN UP (NEW ACCOUNT) */}
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

              <div className="grid grid-cols-2 gap-2">
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
                      placeholder="••••••••"
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
                      placeholder="••••••••"
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
                    onClick={() => setTab('password')}
                    className="text-[#f0fc54] hover:underline font-bold"
                  >
                    Sign In here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: 6-DIGIT EMAIL OTP VERIFICATION */}
          {tab === 'otp' && !successData && (
            <div className="space-y-4">
              {/* Google Fast Auth */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-[#24252f] hover:bg-[#2e2f3b] text-white font-bold text-xs flex items-center justify-center gap-2.5 border border-white/10 transition shadow-sm active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">OR 6-Digit Email Code</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Step 1: Request OTP */}
              {!otpSent ? (
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
                    <span>Send 6-Digit Security Code</span>
                  </button>
                </form>
              ) : (
                /* Step 2: Enter 6-Digit OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                  {incomingCodeBanner && (
                    <div 
                      onClick={() => setOtpCode(incomingCodeBanner)}
                      className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between cursor-pointer hover:bg-amber-500/15 transition"
                      title="Click to Auto-fill Code"
                    >
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-amber-400" />
                        <span>Security Code: <strong className="font-mono text-white text-sm">{incomingCodeBanner}</strong></span>
                      </div>
                      <span className="text-[10px] underline font-bold text-[#f0fc54]">Auto-Fill</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-zinc-300">
                        Enter 6-Digit Code sent to <strong>{emailForOtp}</strong>
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[10px] text-zinc-400 hover:text-white underline"
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
                    <span>Verify Code & Log In</span>
                  </button>

                  <div className="text-center pt-1">
                    {resendTimer > 0 ? (
                      <span className="text-[11px] text-zinc-500">Resend code in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[11px] text-[#f0fc54] hover:underline font-bold inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Resend Code
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: USER ID / PASSWORD LOGIN */}
          {tab === 'password' && !successData && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Permanent User ID (e.g. TG-8924) or Registered Email
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
                    className="text-[10px] text-[#f0fc54] hover:underline"
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
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Sign In with Password</span>
              </button>

              <div className="text-center pt-1">
                <p className="text-[11px] text-zinc-400">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    className="text-[#f0fc54] hover:underline font-bold"
                  >
                    Create one now
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 4: FORGOT PASSWORD RECOVERY */}
          {tab === 'forgot' && !successData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">Reset Account Password</h4>
                <button
                  type="button"
                  onClick={() => setTab('password')}
                  className="text-[10px] text-zinc-400 hover:text-white underline"
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
                    className="w-full py-3 rounded-2xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    <span>Send Password Reset OTP</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotReset} className="space-y-3.5">
                  {incomingCodeBanner && (
                    <div 
                      onClick={() => setForgotCode(incomingCodeBanner)}
                      className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between cursor-pointer hover:bg-amber-500/15 transition"
                    >
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-amber-400" />
                        <span>Code: <strong className="font-mono text-white text-sm">{incomingCodeBanner}</strong></span>
                      </div>
                      <span className="text-[10px] underline font-bold text-[#f0fc54]">Auto-Fill</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-zinc-300">
                      6-Digit Code
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
                      New Password
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
                    className="w-full py-3 rounded-2xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Update Password & Log In</span>
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="pt-2 text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted • Permanent User ID Cloud Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
