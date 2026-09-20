'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Compass, 
  Music, 
  Disc, 
  Layers, 
  Sparkles, 
  Zap, 
  HelpCircle, 
  Tag, 
  CheckCircle2
} from 'lucide-react';
import { useVip } from '@/context/VipContext';

export default function StudioSidebar({ className = '' }) {
  const pathname = usePathname();
  const { isVip, vipKey, openVipModal } = useVip();

  const libraryNav = [
    { name: 'Browse Studio', icon: Compass, href: '/', active: pathname === '/' },
    { name: 'Spotify MP3', icon: Music, href: '/spotify-track-downloader', active: pathname === '/spotify-track-downloader' },
    { name: 'Playlists (ZIP)', icon: Layers, href: '/spotify-playlist-downloader', active: pathname === '/spotify-playlist-downloader' },
    { name: 'Albums (ZIP)', icon: Disc, href: '/spotify-album-downloader', active: pathname === '/spotify-album-downloader' },
    { name: 'Apple Music', icon: Sparkles, href: '/apple-music-downloader', active: pathname === '/apple-music-downloader' },
  ];

  const toolsNav = [
    { name: 'Premium Plans', icon: Tag, href: '/pricing', active: pathname === '/pricing' },
    { name: 'FAQ & Help', icon: HelpCircle, href: '/faq', active: pathname === '/faq' },
  ];

  return (
    <aside suppressHydrationWarning className={`w-64 bg-[#18191e] text-zinc-300 flex flex-col justify-between p-6 select-none shrink-0 border-r border-white/5 ${className}`}>
      <div suppressHydrationWarning className="space-y-7">
        {/* Mac OS Window Dots */}
        <div suppressHydrationWarning className="flex items-center gap-2 mb-1">
          <div suppressHydrationWarning className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm hover:opacity-80 transition cursor-pointer" />
          <div suppressHydrationWarning className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm hover:opacity-80 transition cursor-pointer" />
          <div suppressHydrationWarning className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm hover:opacity-80 transition cursor-pointer" />
          <span className="text-[11px] font-bold text-zinc-500 tracking-wider ml-2 uppercase">TuneGrab Studio</span>
        </div>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-[#f0fc54] text-black flex items-center justify-center font-black shadow-lg shadow-[#f0fc54]/20 group-hover:scale-105 transition-transform">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">
              <span className="text-[#f0fc54]">Tune</span>Grab
            </h1>
            <span className="text-[10px] text-zinc-400 font-medium">Universal Music Studio</span>
          </div>
        </Link>

        {/* Section 1: Downloader Engines */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-3">
            Download Engines
          </h3>
          <nav className="space-y-1">
            {libraryNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    item.active
                      ? 'bg-[#282932] text-white shadow-sm ring-1 ring-white/10'
                      : 'text-zinc-400 hover:text-white hover:bg-[#22232a]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.active ? 'text-[#f0fc54]' : 'text-zinc-400'}`} />
                  <span>{item.name}</span>
                  {item.active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#f0fc54] shadow-sm shadow-[#f0fc54]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Tools & Pricing */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-3">
            Support & Tools
          </h3>
          <nav className="space-y-1">
            {toolsNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    item.active
                      ? 'bg-[#282932] text-white shadow-sm ring-1 ring-white/10'
                      : 'text-zinc-400 hover:text-white hover:bg-[#22232a]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.active ? 'text-[#f0fc54]' : 'text-zinc-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* SpotSaver Style Premium / Ad-Free Card */}
      <div className="pt-4">
        {isVip ? (
          <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-[#1e1f26] border border-emerald-500/30 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ad-Free Active</span>
              </div>
              <span className="text-[10px] font-mono bg-black/40 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                {vipKey ? vipKey.slice(0, 10) + '...' : 'ACTIVE'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              Enjoy 100% Ad-Free UI and fast 320kbps batch ZIP downloads.
            </p>
            <button
              onClick={openVipModal}
              className="w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] border border-emerald-500/30 transition active:scale-95 cursor-pointer"
            >
              Manage License Key
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#22242d] to-[#181920] border border-emerald-500/20 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-bold">
                <Zap className="w-4 h-4 fill-black" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                100% AD-FREE
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Get TuneGrab Premium</h4>
              <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">
                Download unlimited tracks & playlists with 0 ads and instant batch ZIP.
              </p>
            </div>
            <button
              onClick={openVipModal}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] shadow-lg shadow-emerald-600/20 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Get Premium (₹199)</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
