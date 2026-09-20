'use client';

import React from 'react';
import StudioLayout from '@/components/studio/StudioLayout';
import { useVip } from '@/context/VipContext';
import { Crown, Check, X, Sparkles, Zap } from 'lucide-react';

export default function PricingPage() {
  const { isVip, openVipModal } = useVip();

  return (
    <StudioLayout breadcrumb="VIP Pricing & Membership Plans">
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0fc54]/10 border border-[#f0fc54]/30 text-[#f0fc54] text-xs font-bold">
            <Crown className="w-3.5 h-3.5" />
            Simple, Transparent Studio Pricing
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Upgrade to <span className="text-[#f0fc54]">VIP Turbo Club</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Enjoy 100% ad-free experience, ultra-fast 3x batch ZIP downloads, true 320kbps MP3s, and FLAC lossless audio with zero countdowns.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="p-6 rounded-3xl bg-[#24252f]/60 border border-white/5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Free Basic</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">₹0</span>
                <span className="text-xs text-zinc-400">/ forever</span>
              </div>
              <p className="text-xs text-zinc-400">Essential music downloader for everyday single track listeners.</p>

              <ul className="space-y-2.5 pt-4 border-t border-white/5 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  320kbps MP3 Downloads
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  All 5 Platforms Supported
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Audio Preview Player
                </li>
                <li className="flex items-center gap-2 text-zinc-400">
                  <X className="w-4 h-4 text-zinc-400" />
                  Ad-Free Experience
                </li>
                <li className="flex items-center gap-2 text-zinc-400">
                  <X className="w-4 h-4 text-zinc-400" />
                  Batch ZIP Turbo Speed
                </li>
              </ul>
            </div>

            <button
              disabled
              className="w-full py-2.5 rounded-2xl bg-zinc-800 text-zinc-400 font-bold text-xs"
            >
              Current Active Tier
            </button>
          </div>

          {/* Monthly Plan */}
          <div className="p-6 rounded-3xl bg-[#24252f]/80 border border-white/10 flex flex-col justify-between space-y-6 hover:border-white/20 transition">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Monthly Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#f0fc54]">₹199</span>
                <span className="text-xs text-zinc-400">/ 30 days</span>
              </div>
              <p className="text-xs text-zinc-400">Great for binge downloading playlists and albums.</p>

              <ul className="space-y-2.5 pt-4 border-t border-white/5 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#f0fc54]" />
                  <strong>100% Ad-Free UI</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#f0fc54]" />
                  <strong>1-Click Turbo Batch ZIP</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#f0fc54]" />
                  FLAC Lossless & 320kbps
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#f0fc54]" />
                  0s Waiting Countdown
                </li>
              </ul>
            </div>

            <button
              onClick={openVipModal}
              className="w-full py-2.5 rounded-2xl bg-[#f0fc54]/10 hover:bg-[#f0fc54]/20 text-[#f0fc54] border border-[#f0fc54]/30 font-extrabold text-xs transition"
            >
              Select Monthly (₹199)
            </button>
          </div>

          {/* Lifetime Plan */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-b from-[#be5c2b]/30 via-[#24252f] to-[#1e1f26] border-2 border-amber-400 shadow-xl flex flex-col justify-between space-y-6">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-amber-400 text-black font-extrabold text-[10px] uppercase tracking-wider shadow">
              Best Value
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Lifetime VIP
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-amber-400">₹499</span>
                <span className="text-xs text-zinc-400">/ one-time</span>
              </div>
              <p className="text-xs text-zinc-300">Pay once, enjoy VIP features forever with no recurring fees.</p>

              <ul className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-zinc-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  <strong>Lifetime Ad-Free Access</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  <strong>Unlimited 3x Turbo Batch ZIP</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  Lossless FLAC + 320kbps Audio
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  VIP Customer Support
                </li>
              </ul>
            </div>

            <button
              onClick={openVipModal}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 fill-black" />
              {isVip ? 'Manage VIP License' : 'Get Lifetime Access (₹499)'}
            </button>
          </div>
        </div>
      </div>
    </StudioLayout>
  );
}
