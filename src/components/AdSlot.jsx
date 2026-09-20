'use client';

import React from 'react';
import { useVip } from '@/context/VipContext';
import { Sparkles, Crown } from 'lucide-react';

export default function AdSlot({ type = 'banner', className = '' }) {
  const { isVip, openVipModal } = useVip();

  // If user is VIP, do NOT show any ads!
  if (isVip) {
    return null;
  }

  if (type === 'banner') {
    return (
      <div className={`w-full my-6 flex flex-col items-center justify-center ${className}`}>
        <div className="w-full max-w-4xl p-3 bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left transition hover:border-zinc-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-300">Sponsored Advertisement Space</p>
              <p className="text-[11px] text-zinc-400">Google AdSense / Monetag Responsive Banner (728x90)</p>
            </div>
          </div>
          <button
            onClick={openVipModal}
            className="px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition shrink-0"
          >
            <Crown className="w-3 h-3" />
            Remove Ads with VIP
          </button>
        </div>
      </div>
    );
  }

  if (type === 'native') {
    return (
      <div className={`p-4 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center gap-2 ${className}`}>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sponsored</span>
        <p className="text-xs text-zinc-300 font-medium">Enjoying High Quality 320kbps Downloads?</p>
        <button
          onClick={openVipModal}
          className="mt-1 text-xs text-amber-400 font-semibold hover:underline flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          Get Lifetime VIP & Remove All Ads
        </button>
      </div>
    );
  }

  return null;
}
