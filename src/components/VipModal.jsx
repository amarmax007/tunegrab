'use client';

import React, { useState } from 'react';
import { useVip } from '@/context/VipContext';
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
  ArrowRight
} from 'lucide-react';

export default function VipModal() {
  const { isVip, vipKey, vipExpiry, isModalOpen, closeVipModal, activateVip, deactivateVip } = useVip();
  
  const [activeTab, setActiveTab] = useState('plans'); // 'plans' | 'redeem' | 'checkout'
  const [selectedPlan, setSelectedPlan] = useState({ id: 'lifetime', name: 'Lifetime VIP', price: '₹499', period: 'one-time', days: 3650 });
  const [redeemKey, setRedeemKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card'

  if (!isModalOpen) return null;

  const plans = [
    {
      id: 'weekly',
      name: 'Weekly Pass',
      price: '₹99',
      period: '7 Days',
      days: 7,
      badge: 'Starter',
      popular: false,
    },
    {
      id: 'monthly',
      name: 'Monthly Pro',
      price: '₹199',
      period: '30 Days',
      days: 30,
      badge: 'Popular',
      popular: false,
    },
    {
      id: 'lifetime',
      name: 'Lifetime VIP',
      price: '₹499',
      period: 'Permanent Access',
      days: 3650,
      badge: 'Best Value',
      popular: true,
    },
  ];

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!redeemKey.trim()) return;

    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/vip/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: redeemKey.trim() }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setStatusMsg({ type: 'error', text: data.error || 'Invalid VIP license key.' });
      } else {
        activateVip(data.key, data.durationDays);
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

  const handleSimulatePayment = async () => {
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/vip/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_key', plan: selectedPlan.id }),
      });
      const data = await res.json();

      if (data.success && data.key) {
        activateVip(data.key, data.durationDays);
        setStatusMsg({ 
          type: 'success', 
          text: `🎉 Payment Successful! Key: ${data.key} has been activated.` 
        });
        setTimeout(() => {
          closeVipModal();
        }, 2000);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Payment simulation error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Glowing Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-black shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                VIP Premium Member
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Turbo Pro
                </span>
              </h3>
              <p className="text-xs text-zinc-400">Unlock 100% Ad-Free, FLAC Lossless & Unlimited Turbo Downloads</p>
            </div>
          </div>
          <button
            onClick={closeVipModal}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${
              activeTab === 'plans'
                ? 'bg-amber-500 text-black shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            VIP Plans
          </button>
          <button
            onClick={() => setActiveTab('checkout')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${
              activeTab === 'checkout'
                ? 'bg-amber-500 text-black shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Instant Checkout
          </button>
          <button
            onClick={() => setActiveTab('redeem')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${
              activeTab === 'redeem'
                ? 'bg-amber-500 text-black shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Redeem License Key
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
                    Key: <span className="font-mono text-amber-300">{vipKey || 'Active'}</span>
                    {vipExpiry && ` (Expires: ${new Date(vipExpiry).toLocaleDateString()})`}
                  </p>
                </div>
              </div>
              <button
                onClick={deactivateVip}
                className="text-xs text-red-400 hover:text-red-300 underline"
              >
                Log Out VIP
              </button>
            </div>
          )}

          {/* Status Message */}
          {statusMsg.text && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 font-medium ${
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
                        : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                    }`}
                  >
                    {plan.badge && (
                      <span
                        className={`absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          plan.popular
                            ? 'bg-amber-500 text-black shadow'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{plan.name}</h4>
                      <p className="text-2xl font-black text-amber-400">{plan.price}</p>
                      <p className="text-[11px] text-zinc-400 mb-3">{plan.period}</p>
                    </div>
                    <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      All VIP Features
                    </div>
                  </div>
                ))}
              </div>

              {/* VIP Benefits */}
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-2.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Included VIP Privileges:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>100% Ad-Free Experience</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Turbo Batch ZIP Downloads</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>True 320kbps & FLAC Lossless</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>No Waiting Countdown Timer</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('checkout')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                Proceed to Checkout ({selectedPlan.price} - {selectedPlan.name})
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 2: INSTANT CHECKOUT */}
          {activeTab === 'checkout' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-400">Selected VIP Plan:</p>
                  <p className="text-sm font-bold text-white">{selectedPlan.name} ({selectedPlan.price})</p>
                </div>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Change Plan
                </button>
              </div>

              {/* Payment Method Switch */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    paymentMethod === 'upi'
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                      : 'border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  UPI / GPay / Paytm QR
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    paymentMethod === 'card'
                      ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                      : 'border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Debit / Credit Card / NetBanking
                </button>
              </div>

              {/* Payment Display */}
              {paymentMethod === 'upi' ? (
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center space-y-3">
                  <p className="text-xs text-zinc-300 font-medium">Scan to Pay via Any UPI App:</p>
                  <div className="inline-block p-3 bg-white rounded-2xl shadow-lg">
                    {/* Simulated Clean QR Code display */}
                    <div className="w-36 h-36 border-2 border-dashed border-zinc-400 flex flex-col items-center justify-center bg-zinc-100 rounded-xl text-zinc-800">
                      <QrCode className="w-16 h-16 text-zinc-900 mb-1" />
                      <span className="text-[10px] font-bold tracking-wider">UPI / GPAY QR</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    UPI ID: <span className="font-mono text-zinc-200 font-semibold">musicdownloader@upi</span>
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8892"
                      disabled
                      value="4532 •••• •••• 8892"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        disabled
                        value="12/28"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        disabled
                        value="888"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Complete Activation Button */}
              <button
                onClick={handleSimulatePayment}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Activating VIP License...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Complete & Activate VIP ({selectedPlan.price})
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: REDEEM LICENSE KEY */}
          {activeTab === 'redeem' && (
            <form onSubmit={handleRedeem} className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                <label className="block text-xs font-semibold text-zinc-300">
                  Enter your VIP License Key or Promo Code:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={redeemKey}
                    onChange={(e) => setRedeemKey(e.target.value)}
                    placeholder="e.g. VIP-PRO-2026 or PREMIUM320"
                    className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-zinc-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading || !redeemKey.trim()}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Activate
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">
                  💡 Tip: You can try sample promo code <code className="text-amber-400 bg-zinc-900 px-1.5 py-0.5 rounded">VIP-PRO-2026</code> or <code className="text-amber-400 bg-zinc-900 px-1.5 py-0.5 rounded">PREMIUM320</code>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                Keys are authenticated securely and stored safely in your browser session.
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
          <span>🔒 256-bit Encrypted & Secure Checkout</span>
          <button onClick={closeVipModal} className="hover:text-zinc-200">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
