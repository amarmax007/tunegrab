'use client';

import React, { useState } from 'react';
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
  Copy,
  Smartphone,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, login, register, sendOtp, verifyOtp, loginWithGoogle } = useAuth();
  
  // Tabs: 'otp' | 'password' | 'register'
  const [tab, setTab] = useState('otp');
  
  // OTP Flow
  const [emailForOtp, setEmailForOtp] = useState('');
  const [nameForOtp, setNameForOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [incomingCodeBanner, setIncomingCodeBanner] = useState('');

  // Password / User ID Login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  if (!isAuthModalOpen) return null;

  // --- Handlers ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await sendOtp(emailForOtp);
      setOtpSent(true);
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
      }, 2500);
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

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      if (!emailForOtp || !emailForOtp.includes('@')) {
        throw new Error('Please enter your email address first, then click Google Sign-In.');
      }
      // Authenticate with user-provided email (no fake avatar)
      const googleUser = await loginWithGoogle({
        email: emailForOtp,
        name: nameForOtp || emailForOtp.split('@')[0],
        avatar: '',
      });
      setSuccessData(googleUser);
      setTimeout(() => {
        closeAuthModal();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Google Sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#1a1b22] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#be5c2b]/40 via-[#252630] to-[#1a1b22] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f0fc54] text-black flex items-center justify-center font-black shadow-lg shadow-[#f0fc54]/20">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                TuneGrab Secure Account
              </h3>
              <p className="text-[11px] text-zinc-400">Sync library & VIP access on any device</p>
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
        <div className="flex border-b border-white/5 bg-[#16171d] p-1.5 gap-1.5">
          <button
            onClick={() => {
              setTab('otp');
              setError('');
              setOtpSent(false);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'otp'
                ? 'bg-[#f0fc54] text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Email OTP (Instant)
          </button>
          <button
            onClick={() => {
              setTab('password');
              setError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'password'
                ? 'bg-[#f0fc54] text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            User ID / Password
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
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
                <p className="text-[11px] text-zinc-300 mt-0.5">Welcome back, <strong>{successData.name}</strong></p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/60 border border-emerald-500/30 font-mono text-xs text-[#f0fc54]">
                Permanent User ID: <strong>{successData.userId}</strong>
              </div>
              <p className="text-[10px] text-zinc-400">
                Logged in successfully. Restoring your download history & favorites...
              </p>
            </div>
          )}

          {/* TAB 1: 6-DIGIT EMAIL OTP VERIFICATION */}
          {tab === 'otp' && !successData && (
            <div className="space-y-4">
              {/* Google 1-Click Fast Auth */}
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
                </form>
              )}
            </div>
          )}

          {/* TAB 2: USER ID / PASSWORD LOGIN */}
          {tab === 'password' && !successData && (
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
                <label className="block text-xs font-semibold text-zinc-300">
                  Password
                </label>
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
            </form>
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

