'use client';

import React, { useState, useEffect } from 'react';
import { useVip } from '@/context/VipContext';
import { 
  X, 
  Zap, 
  Check, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  Key, 
  CheckCircle2, 
  Loader2,
  Lock,
  ArrowRight,
  Copy,
  Mail,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function VipModal() {
  const { isVip, vipKey, vipExpiry, isModalOpen, closeVipModal, activateVip, deactivateVip } = useVip();
  
  // Tabs: 'buy' | 'restore'
  const [activeTab, setActiveTab] = useState('buy');
  
  // Plans
  const plans = [
    {
      id: 'monthly',
      name: '30-Day Pass',
      price: 199,
      priceStr: '₹199',
      usdPrice: '$2.50',
      description: 'Ad-Free • ZIP Download • Fast Downloads',
      days: 30,
      popular: true,
    },
    {
      id: 'lifetime',
      name: 'Lifetime Pass',
      price: 499,
      priceStr: '₹499',
      usdPrice: '$6.00',
      description: 'Permanent Ad-Free • Unlimited Batch ZIP',
      days: 3650,
      popular: false,
    },
    {
      id: 'weekly',
      name: '7-Day Pass',
      price: 99,
      priceStr: '₹99',
      usdPrice: '$1.20',
      description: 'Ad-Free Access for 1 Week',
      days: 7,
      popular: false,
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  
  // Payment step state
  const [upiUtr, setUpiUtr] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Restore tab state
  const [restoreKey, setRestoreKey] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [issuedVoucher, setIssuedVoucher] = useState(null);

  const merchantUpi = process.env.NEXT_PUBLIC_UPI_ID || 'amarmax.me@okhdfcbank';
  const merchantName = 'Amar Max';

  // Reset state when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setStatusMsg({ type: '', text: '' });
      setShowPaymentStep(false);
      setUpiUtr('');
      setIssuedVoucher(null);
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Step 1: Proceed to Payment View
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    const cleanEmail = buyerEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid email address for license key delivery.' });
      return;
    }

    setShowPaymentStep(true);
  };

  // Step 2: Verify UTR & Issue License Key
  const handleVerifyPayment = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    const cleanUtr = upiUtr.trim().replace(/\s+/g, '');
    const utrRegex = /^\d{12}$/;
    if (!utrRegex.test(cleanUtr)) {
      setStatusMsg({ 
        type: 'error', 
        text: 'Invalid UTR. Please enter the genuine 12-digit numeric Reference Number from your Google Pay / PhonePe / Paytm payment.' 
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/payment/upi-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan.id,
          utr: cleanUtr,
          userEmail: buyerEmail.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setStatusMsg({ type: 'error', text: data.error || 'Payment verification failed.' });
      } else {
        activateVip(data.key, data.durationDays);
        setIssuedVoucher({
          key: data.key,
          plan: selectedPlan.name,
          amount: selectedPlan.priceStr,
          email: buyerEmail.trim().toLowerCase(),
          utr: cleanUtr,
        });
        setStatusMsg({ 
          type: 'success', 
          text: `🎉 License Key generated & activated! Key sent to ${buyerEmail}.` 
        });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Verification service temporarily unavailable.' });
    } finally {
      setLoading(false);
    }
  };

  // Tab 2: Restore License Key
  const handleRestoreKey = async (e) => {
    e.preventDefault();
    if (!restoreKey.trim()) return;

    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/vip/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          key: restoreKey.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setStatusMsg({ type: 'error', text: data.error || 'Invalid or unverified VIP license key.' });
      } else {
        activateVip(data.key, data.durationDays);
        setStatusMsg({ type: 'success', text: '🎉 Ad-Free Restored Successfully!' });
        setTimeout(() => {
          closeVipModal();
        }, 1600);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Network error restoring license key.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#121316] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-scaleUp text-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header (SpotSaver Style) */}
        <div className="p-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
              <Zap className="w-5 h-5 fill-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">Get Premium</h3>
              <p className="text-xs text-zinc-400">Pay using UPI, QR, GPay & Cards</p>
            </div>
          </div>

          <button
            onClick={closeVipModal}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SpotSaver 2-Tab Navigation */}
        <div className="px-6">
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#1a1b20] rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('buy');
                setShowPaymentStep(false);
                setStatusMsg({ type: '', text: '' });
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'buy'
                  ? 'bg-[#262830] text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Buy Ad-Free
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('restore');
                setStatusMsg({ type: '', text: '' });
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'restore'
                  ? 'bg-[#262830] text-white shadow border border-blue-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              I already paid
            </button>
          </div>
        </div>

        <div className="p-6 pt-4 space-y-4">
          {/* Active Premium Status Badge */}
          {isVip && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Premium is Active (<strong>{vipKey || 'Active'}</strong>)</span>
              </div>
              <button
                onClick={deactivateVip}
                className="text-zinc-400 hover:text-red-400 underline cursor-pointer text-[11px]"
              >
                Log Out
              </button>
            </div>
          )}

          {/* Status Alerts */}
          {statusMsg.text && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* TAB 1: BUY AD-FREE */}
          {activeTab === 'buy' && (
            <div>
              {/* Issued Success Voucher */}
              {issuedVoucher ? (
                <div className="p-5 rounded-3xl bg-[#1c1d24] border border-emerald-500/40 text-center space-y-3 animate-fadeIn">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                  <div>
                    <h4 className="text-base font-bold text-white">Payment Verified!</h4>
                    <p className="text-xs text-zinc-400">Your site is now 100% Ad-Free.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#121316] border border-white/5 text-left text-xs font-mono space-y-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span>Plan:</span>
                      <span className="text-white font-bold">{issuedVoucher.plan} ({issuedVoucher.amount})</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Sent To:</span>
                      <span className="text-emerald-400">{issuedVoucher.email}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/5">
                      <span className="text-emerald-400 font-bold">License Key:</span>
                      <span className="text-white font-black select-all">{issuedVoucher.key}</span>
                    </div>
                  </div>

                  <button
                    onClick={closeVipModal}
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg transition cursor-pointer"
                  >
                    Done & Continue
                  </button>
                </div>
              ) : !showPaymentStep ? (
                /* Step 1: Select Plan & Enter Email */
                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  {/* Plan Cards */}
                  <div className="space-y-2">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedPlan.id === plan.id
                            ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30'
                            : 'border-white/5 bg-[#1a1b20] hover:border-white/10'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                            {plan.popular && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                Most Popular
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-black text-emerald-400">{plan.priceStr}</p>
                          <span className="text-[10px] text-zinc-500">{plan.usdPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Email address <span className="text-emerald-400">*</span> <span className="text-zinc-500 font-normal">(for license key delivery & recovery)</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full bg-[#1a1b20] text-xs text-white px-4 py-3 rounded-2xl border border-white/10 focus:border-emerald-500 outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Continue to Payment ({selectedPlan.priceStr} Pass)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Step 2: UPI QR Code & 12-Digit UTR */
                <form onSubmit={handleVerifyPayment} className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-[#1a1b20] border border-white/5 text-center space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>Plan: <strong className="text-white">{selectedPlan.name}</strong></span>
                      <span className="text-emerald-400 font-bold">{selectedPlan.priceStr}</span>
                    </div>

                    {/* QR Code */}
                    <div className="inline-block p-2 bg-white rounded-2xl shadow-xl">
                      <img 
                        src="/upi_qr.jpg" 
                        alt="Amar Max Google Pay QR" 
                        className="w-40 h-auto object-contain rounded-xl"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-zinc-400">Payee: <strong className="text-white">{merchantName}</strong></p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-mono text-zinc-300 font-bold bg-[#121316] px-2.5 py-1 rounded-lg border border-white/5 select-all">
                          {merchantUpi}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-zinc-300">
                        12-Digit UPI UTR / Transaction Ref <span className="text-emerald-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPaymentStep(false)}
                        className="text-[10px] text-zinc-400 hover:text-white underline cursor-pointer"
                      >
                        Change Email / Plan
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={12}
                      required
                      value={upiUtr}
                      onChange={(e) => setUpiUtr(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 423589123456 (12 digits)"
                      className="w-full bg-[#1a1b20] text-center font-mono text-sm text-emerald-400 py-3 rounded-2xl border border-white/10 focus:border-emerald-500 outline-none transition tracking-wider"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || upiUtr.length !== 12}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying & Sending License...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm Payment & Get License Key</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: I ALREADY PAID (RESTORE AD-FREE) */}
          {activeTab === 'restore' && (
            <form onSubmit={handleRestoreKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  License Key
                </label>
                <input
                  type="text"
                  required
                  value={restoreKey}
                  onChange={(e) => setRestoreKey(e.target.value)}
                  placeholder="TG-XXXX-XXXX-XXXX"
                  className="w-full bg-[#1a1b20] text-xs font-mono text-white px-4 py-3 rounded-2xl border border-white/10 focus:border-emerald-500 outline-none transition uppercase"
                />
                <p className="text-[11px] text-zinc-500 leading-normal pt-1">
                  Check your email for the license key sent at checkout. This does not accept a Transaction Hash.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !restoreKey.trim()}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Restore Ad-Free</span>
              </button>
            </form>
          )}

          <div className="text-center pt-1 text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Cloud Sync • Ad-Free on All Browsers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
