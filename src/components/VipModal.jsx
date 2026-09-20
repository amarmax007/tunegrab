'use client';

import React, { useState, useEffect } from 'react';
import { useVip } from '@/context/VipContext';
import { useAuth } from '@/context/AuthContext';
import { 
  X, 
  Crown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  QrCode, 
  CreditCard, 
  Key, 
  CheckCircle2, 
  Loader2,
  Lock,
  ArrowRight,
  Copy,
  ExternalLink,
  Smartphone,
  Download,
  Receipt
} from 'lucide-react';

export default function VipModal() {
  const { isVip, vipKey, vipExpiry, isModalOpen, closeVipModal, activateVip, deactivateVip } = useVip();
  const { user, syncUserWithVip } = useAuth();
  
  const [activeTab, setActiveTab] = useState('plans'); // 'plans' | 'checkout' | 'redeem' | 'receipt'
  const [selectedPlan, setSelectedPlan] = useState({ id: 'monthly', name: 'Monthly Pro', price: 199, priceStr: '₹199', period: '30 Days', days: 30 });
  const [redeemKey, setRedeemKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card'

  // UPI payment state
  const [upiUtr, setUpiUtr] = useState('');
  const [payerUpiId, setPayerUpiId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Merchant details
  const merchantUpi = process.env.NEXT_PUBLIC_UPI_ID || 'amarmax.me@okhdfcbank';
  const merchantName = 'Amar Max';

  if (!isModalOpen) return null;

  const plans = [
    {
      id: 'weekly',
      name: 'Weekly Pass',
      price: 99,
      priceStr: '₹99',
      period: '7 Days',
      days: 7,
      badge: 'Starter',
      popular: false,
    },
    {
      id: 'monthly',
      name: 'Monthly Pro',
      price: 199,
      priceStr: '₹199',
      period: '30 Days',
      days: 30,
      badge: 'Popular',
      popular: true,
    },
    {
      id: 'lifetime',
      name: 'Lifetime VIP',
      price: 499,
      priceStr: '₹499',
      period: 'Permanent Access',
      days: 3650,
      badge: 'Best Value',
      popular: false,
    },
  ];

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!redeemKey.trim()) return;

    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/vip/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          key: redeemKey.trim(),
          userId: user?.userId || null,
        }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setStatusMsg({ type: 'error', text: data.error || 'Invalid VIP license key.' });
      } else {
        activateVip(data.key, data.durationDays);
        if (user) {
          syncUserWithVip(data.key, Date.now() + (data.durationDays || 30) * 86400000);
        }
        setStatusMsg({ type: 'success', text: '🎉 ' + (data.message || 'VIP License Activated Successfully!') });
        setTimeout(() => {
          closeVipModal();
        }, 1800);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Network error verifying key.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUpiPayment = async (e) => {
    e.preventDefault();
    const cleanUtr = upiUtr.trim().replace(/\s+/g, '');

    // Strict 12-digit numeric validation on client side first
    const utrRegex = /^\d{12}$/;
    if (!utrRegex.test(cleanUtr)) {
      setStatusMsg({ 
        type: 'error', 
        text: 'Invalid UTR format. A valid UPI Reference Number (UTR) is strictly 12 numeric digits (e.g. 425612345678). Please verify from your GPay / PhonePe / Paytm receipt.' 
      });
      return;
    }

    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/payment/upi-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan.id,
          utr: cleanUtr,
          payerUpi: payerUpiId.trim() || 'UPI App',
          userId: user?.userId || null,
          userEmail: user?.email || null,
        }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setStatusMsg({ type: 'error', text: data.error || 'Verification failed. Please verify your UTR.' });
      } else {
        activateVip(data.key, data.durationDays);
        if (user) {
          syncUserWithVip(data.key, Date.now() + (data.durationDays || 30) * 86400000);
        }
        setActiveReceipt({
          key: data.key,
          plan: selectedPlan.name,
          amount: selectedPlan.priceStr,
          utr: cleanUtr,
          date: new Date().toLocaleString(),
        });
        setActiveTab('receipt');
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'UPI verification service unavailable.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGatewayPayment = async (e) => {
    e.preventDefault();
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid 16-digit card number.' });
      return;
    }
    if (!cardExpiry || !cardExpiry.includes('/')) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid card expiry (MM/YY).' });
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid 3-digit CVV.' });
      return;
    }

    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: selectedPlan.id,
          amount: selectedPlan.price,
          method: 'CARD / ONLINE GATEWAY',
          userId: user?.userId || null,
          userEmail: user?.email || null,
        }),
      });
      const data = await res.json();

      if (data.success && data.key) {
        activateVip(data.key, data.durationDays);
        if (user) {
          syncUserWithVip(data.key, Date.now() + (data.durationDays || 30) * 86400000);
        }
        setActiveReceipt({
          key: data.key,
          plan: selectedPlan.name,
          amount: selectedPlan.priceStr,
          utr: `GATEWAY-${Date.now().toString(36).toUpperCase()}`,
          date: new Date().toLocaleString(),
        });
        setActiveTab('receipt');
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Payment gateway failed.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Payment gateway error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#1a1b22] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Glowing Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-[#1a1b22] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-black shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                VIP Premium Member
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  TURBO PRO
                </span>
              </h3>
              <p className="text-xs text-zinc-400">Unlock 100% Ad-Free, FLAC Lossless & Unlimited 3x Batch ZIP</p>
            </div>
          </div>
          <button
            onClick={closeVipModal}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/5 bg-[#16171d] p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'plans'
                ? 'bg-amber-400 text-black shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Plans</span>
          </button>
          <button
            onClick={() => setActiveTab('checkout')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'checkout'
                ? 'bg-amber-400 text-black shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Instant Checkout</span>
          </button>
          <button
            onClick={() => setActiveTab('redeem')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'redeem'
                ? 'bg-amber-400 text-black shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Redeem Key</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active VIP Banner */}
          {isVip && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Your VIP Membership is Active!</p>
                  <p className="text-xs text-zinc-400">
                    Key: <span className="font-mono text-amber-300 font-bold">{vipKey || 'Active'}</span>
                    {vipExpiry && ` (Valid until: ${new Date(vipExpiry).toLocaleDateString()})`}
                  </p>
                </div>
              </div>
              <button
                onClick={deactivateVip}
                className="text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
              >
                Log Out VIP
              </button>
            </div>
          )}

          {/* Status Message */}
          {statusMsg.text && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 font-medium ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-300 border border-red-500/30'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <X className="w-4 h-4 shrink-0" />
              )}
              {statusMsg.text}
            </div>
          )}

          {/* TAB 1: PLANS */}
          {activeTab === 'plans' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`relative p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedPlan.id === plan.id
                        ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-500/20'
                        : 'border-white/5 bg-[#24252f]/40 hover:border-white/10'
                    }`}
                  >
                    {plan.badge && (
                      <span
                        className={`absolute -top-2.5 right-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          plan.popular
                            ? 'bg-amber-400 text-black shadow'
                            : 'bg-[#1a1b22] text-zinc-300 border border-white/10'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{plan.name}</h4>
                      <p className="text-2xl font-black text-amber-400">{plan.priceStr}</p>
                      <p className="text-[11px] text-zinc-400 mb-3">{plan.period}</p>
                    </div>
                    <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      All VIP Turbo Features
                    </div>
                  </div>
                ))}
              </div>

              {/* VIP Benefits */}
              <div className="p-4 rounded-2xl bg-[#24252f]/60 border border-white/5 space-y-2.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Included VIP Turbo Privileges:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>100% Ad-Free UI</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>3x Turbo Batch ZIP Downloads</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>True 320kbps & FLAC Lossless</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>0s Instant Download Countdown</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('checkout')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Proceed to Checkout ({selectedPlan.priceStr} - {selectedPlan.name})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 2: INSTANT CHECKOUT */}
          {activeTab === 'checkout' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#24252f] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-400">Selected VIP Plan:</p>
                  <p className="text-sm font-bold text-white">{selectedPlan.name} ({selectedPlan.priceStr})</p>
                </div>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="text-xs text-amber-400 hover:underline cursor-pointer"
                >
                  Change Plan
                </button>
              </div>

              {/* Payment Method Switch */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                      : 'border-white/5 bg-[#24252f] text-zinc-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI / QR / GPay / Paytm</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                      : 'border-white/5 bg-[#24252f] text-zinc-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card / NetBanking</span>
                </button>
              </div>

              {/* UPI QR & UTR FORM */}
              {paymentMethod === 'upi' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-3xl bg-[#24252f] border border-white/5 text-center space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>Amount Payable: <strong className="text-white font-mono text-sm">{selectedPlan.priceStr}</strong></span>
                      <span className="text-[10px] text-emerald-400 font-bold">● Live Instant UPI Gateway</span>
                    </div>

                    {/* Official Google Pay UPI QR Code */}
                    <div className="inline-block p-2.5 bg-white rounded-3xl shadow-2xl border-2 border-amber-400/40">
                      <div className="w-48 sm:w-56 overflow-hidden rounded-2xl bg-white flex flex-col items-center">
                        <img 
                          src="/upi_qr.jpg" 
                          alt="Amar Max Google Pay UPI QR Code" 
                          className="w-full h-auto object-contain rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                        <span>● Verified Payee: <strong>Amar Max</strong></span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                      <span className="text-xs font-mono text-zinc-200 font-bold bg-[#1a1b22] px-3.5 py-2 rounded-xl border border-white/10 select-all">
                        {merchantUpi}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-3.5 py-2 bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedUpi ? 'Copied!' : 'Copy UPI ID'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-zinc-400">
                      Scan with <strong>Google Pay, PhonePe, Paytm, BHIM, or any Banking App</strong>.
                    </p>
                  </div>

                  {/* Step 2: Enter 12-Digit UTR Number */}
                  <form onSubmit={handleVerifyUpiPayment} className="space-y-3 p-4 rounded-3xl bg-[#24252f] border border-white/5">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-white">
                        Enter 12-Digit UPI UTR / Transaction Reference Number <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={12}
                        value={upiUtr}
                        onChange={(e) => setUpiUtr(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 423589123456 (12 digits)"
                        className="w-full bg-[#1a1b22] text-xs sm:text-sm text-white font-mono px-4 py-3 rounded-2xl border border-white/10 focus:border-[#f0fc54] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || upiUtr.length !== 12}
                      className="w-full py-3.5 rounded-2xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs sm:text-sm shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying UPI UTR...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify UTR & Activate VIP Turbo</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* Card & Online Gateway Checkout */
                <form onSubmit={handleGatewayPayment} className="p-4 rounded-3xl bg-[#24252f] border border-white/5 space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs text-zinc-400">Card Number (16 Digits)</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8892"
                      className="w-full bg-[#1a1b22] border border-white/10 rounded-2xl px-4 py-3 text-xs text-zinc-300 font-mono focus:border-amber-400 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-xs text-zinc-400">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full bg-[#1a1b22] border border-white/10 rounded-2xl px-4 py-3 text-xs text-zinc-300 font-mono focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs text-zinc-400">CVV (3 Digits)</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="888"
                        className="w-full bg-[#1a1b22] border border-white/10 rounded-2xl px-4 py-3 text-xs text-zinc-300 font-mono focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay {selectedPlan.priceStr} & Unlock VIP Turbo</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: REDEEM LICENSE KEY */}
          {activeTab === 'redeem' && (
            <form onSubmit={handleRedeem} className="space-y-4">
              <div className="p-4 rounded-3xl bg-[#24252f] border border-white/5 space-y-3">
                <label className="block text-xs font-bold text-white">
                  Enter your VIP License Key:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={redeemKey}
                    onChange={(e) => setRedeemKey(e.target.value)}
                    placeholder="e.g. VIP-PRO-2026 or TG-VIP-..."
                    className="flex-1 bg-[#1a1b22] border border-white/10 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs text-white font-mono placeholder:text-zinc-500 outline-none uppercase"
                  />
                  <button
                    type="submit"
                    disabled={loading || !redeemKey.trim()}
                    className="px-5 py-3 bg-[#f0fc54] hover:bg-[#e4ef4a] disabled:opacity-50 text-black font-extrabold text-xs rounded-2xl shadow transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Activate</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#24252f]/40 border border-white/5 text-[11px] text-zinc-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Keys are authenticated strictly against the official registry database.</span>
              </div>
            </form>
          )}

          {/* TAB 4: RECEIPT / SUCCESS VOUCHER */}
          {activeTab === 'receipt' && activeReceipt && (
            <div className="p-6 rounded-3xl bg-[#24252f] border border-emerald-500/30 text-center space-y-4 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <div>
                <h4 className="text-lg font-black text-white">Payment Verified & VIP Activated!</h4>
                <p className="text-xs text-zinc-400 mt-1">Thank you for supporting TuneGrab Studio.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1a1b22] border border-white/5 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between border-b border-white/5 pb-1 text-zinc-400">
                  <span>VIP Plan:</span>
                  <span className="text-white font-bold">{activeReceipt.plan}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1 text-zinc-400">
                  <span>Amount:</span>
                  <span className="text-emerald-400 font-bold">{activeReceipt.amount}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1 text-zinc-400">
                  <span>UTR / Txn Ref:</span>
                  <span className="text-zinc-200">{activeReceipt.utr}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-amber-400 font-bold">VIP License Key:</span>
                  <span className="text-[#f0fc54] font-black">{activeReceipt.key}</span>
                </div>
              </div>

              <button
                onClick={closeVipModal}
                className="w-full py-3.5 rounded-2xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs shadow-lg transition cursor-pointer"
              >
                Start Using VIP Turbo Features
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#14151a] border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
          <span>🔒 256-bit Encrypted & Automated Verification</span>
          <button onClick={closeVipModal} className="hover:text-zinc-200 cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
