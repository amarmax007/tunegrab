'use client';

import React, { useState, useEffect } from 'react';
import { useVip } from '@/context/VipContext';
import { Sparkles, Crown, ExternalLink, ShieldCheck, X, Volume2, Zap, ArrowRight, Radio } from 'lucide-react';

const SPONSORED_ADS = [
  {
    id: 'ad-nordvpn',
    title: 'Ultra-Fast Anonymous Music Streaming',
    brand: 'CyberShield VPN',
    description: 'Bypass ISP audio throttling & unlock geo-restricted Spotify/Apple music with 10Gbps encrypted speeds.',
    cta: 'Get 70% Off + 3 Mo Free',
    link: 'https://www.google.com/search?q=best+vpn+for+streaming',
    tag: 'SPONSORED',
    badge: '4.9 ★★★★★',
    iconColor: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'ad-audiobooster',
    title: 'Studio Bass & 8D Audio Equalizer',
    brand: 'SonicMaster Pro',
    description: 'Boost downloaded MP3 volume by 300% with true studio lossless spatial audio enhancer.',
    cta: 'Try Free Audio Plugin',
    link: 'https://www.google.com/search?q=studio+audio+equalizer',
    tag: 'FEATURED APP',
    badge: 'STUDIO GRADE',
    iconColor: 'from-amber-500 to-rose-600',
  },
  {
    id: 'ad-cloudstorage',
    title: '2TB Cloud Music Vault & Offline Player',
    brand: 'DriveSync Cloud',
    description: 'Auto-sync your TuneGrab downloaded MP3 playlists to cloud storage and stream from iOS/Android.',
    cta: 'Claim 2TB Free Storage',
    link: 'https://www.google.com/search?q=cloud+storage+for+music',
    tag: 'SPONSORED',
    badge: 'FREE TRIAL',
    iconColor: 'from-emerald-500 to-teal-600',
  },
];

export default function AdSlot({ type = 'banner', className = '', slotId = 'default' }) {
  const { isVip, openVipModal } = useVip();
  const [adIndex, setAdIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Pick deterministic ad based on slotId or random
    const idx = Math.floor(Math.random() * SPONSORED_ADS.length);
    setAdIndex(idx);
  }, [slotId]);

  // If user is VIP or ad is dismissed, do NOT show any ads!
  if (isVip || isDismissed) {
    return null;
  }

  const currentAd = SPONSORED_ADS[adIndex] || SPONSORED_ADS[0];

  // 1. LEADERBOARD / RESPONSIVE BANNER (728x90)
  if (type === 'banner') {
    return (
      <div className={`w-full my-4 flex flex-col items-center justify-center ${className}`}>
        <div className="w-full max-w-5xl p-3.5 sm:p-4 bg-gradient-to-r from-[#1e1f28] via-[#252632] to-[#1e1f28] border border-white/10 rounded-2xl sm:rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3.5 transition hover:border-[#f0fc54]/30">
          
          {/* Ad Info */}
          <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${currentAd.iconColor} text-white flex items-center justify-center font-black text-xs shadow-md shrink-0`}>
              <Radio className="w-5 h-5 text-white" />
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentAd.tag}
                </span>
                <span className="text-xs font-bold text-white truncate">{currentAd.brand}</span>
                <span className="text-[10px] text-zinc-400 hidden md:inline">{currentAd.badge}</span>
              </div>
              <p className="text-[11px] text-zinc-300 truncate max-w-md mt-0.5">
                {currentAd.description}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <a
              href={currentAd.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 transition active:scale-95 border border-white/10 shadow-sm"
            >
              <span>{currentAd.cta}</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>

            <button
              onClick={openVipModal}
              title="Remove ads permanently"
              className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-extrabold flex items-center gap-1 transition shrink-0 active:scale-95"
            >
              <Crown className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Remove Ads</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. NATIVE IN-FEED CARD
  if (type === 'native') {
    return (
      <div className={`p-4 rounded-2xl sm:rounded-3xl bg-[#24252f]/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 transition hover:border-[#f0fc54]/40 shadow-xl ${className}`}>
        <div className="flex items-center gap-3.5 min-w-0 w-full">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentAd.iconColor} text-white flex items-center justify-center font-black text-sm shadow-lg shrink-0`}>
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#f0fc54]/10 text-[#f0fc54] border border-[#f0fc54]/30">
                SPONSORED PARTNER
              </span>
              <span className="text-xs font-bold text-white">{currentAd.brand}</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white mt-1">{currentAd.title}</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{currentAd.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <a
            href={currentAd.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs flex items-center gap-1.5 transition shadow"
          >
            <span>{currentAd.cta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // 3. RECTANGLE / SIDEBAR UNIT (300x250)
  if (type === 'rectangle' || type === 'sidebar') {
    return (
      <div className={`p-4 rounded-3xl bg-[#20212b] border border-white/10 text-center flex flex-col justify-between space-y-3 shadow-xl ${className}`}>
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase">
          <span>Advertisement</span>
          <button onClick={() => setIsDismissed(true)} className="hover:text-zinc-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2 py-2">
          <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${currentAd.iconColor} flex items-center justify-center text-white shadow-lg`}>
            <Volume2 className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-white">{currentAd.title}</h4>
          <p className="text-[11px] text-zinc-400">{currentAd.description}</p>
        </div>

        <div className="space-y-2 pt-2 border-t border-white/5">
          <a
            href={currentAd.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs flex items-center justify-center gap-1 transition"
          >
            <span>{currentAd.cta}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={openVipModal}
            className="w-full text-[10px] text-amber-400 hover:underline flex items-center justify-center gap-1"
          >
            <Crown className="w-3 h-3" /> Remove Ads with VIP
          </button>
        </div>
      </div>
    );
  }

  // 4. FLOATING STICKY BOTTOM AD BAR
  if (type === 'sticky-bottom') {
    return (
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#16171d]/95 backdrop-blur-md border-t border-white/10 p-2 sm:p-3 shadow-2xl flex items-center justify-between gap-4 animate-fadeIn">
        <div className="flex items-center gap-3 min-w-0 max-w-2xl">
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
            SPONSOR
          </span>
          <p className="text-xs text-zinc-200 truncate">
            <strong>{currentAd.brand}:</strong> {currentAd.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={currentAd.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs transition"
          >
            {currentAd.cta}
          </a>
          <button
            onClick={openVipModal}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition hidden sm:inline-flex items-center gap-1"
          >
            <Crown className="w-3 h-3" /> VIP Ad-Free
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
            title="Dismiss Ad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
