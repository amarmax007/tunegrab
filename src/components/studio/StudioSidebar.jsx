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
  Crown, 
  History, 
  Heart, 
  HelpCircle, 
  Tag, 
  Zap 
} from 'lucide-react';
import { useVip } from '@/context/VipContext';
import { useAuth } from '@/context/AuthContext';

export default function StudioSidebar({ className = '' }) {
  const pathname = usePathname();
  const { isVip, openVipModal } = useVip();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const libraryNav = [
    { name: 'Browse Studio', icon: Compass, href: '/', active: pathname === '/' },
    { name: 'Spotify MP3', icon: Music, href: '/spotify-track-downloader', active: pathname === '/spotify-track-downloader' },
    { name: 'Playlists (ZIP)', icon: Layers, href: '/spotify-playlist-downloader', active: pathname === '/spotify-playlist-downloader' },
    { name: 'Albums (ZIP)', icon: Disc, href: '/spotify-album-downloader', active: pathname === '/spotify-album-downloader' },
    { name: 'Apple Music', icon: Sparkles, href: '/apple-music-downloader', active: pathname === '/apple-music-downloader' },
  ];

  const toolsNav = [
    { name: 'VIP Pricing', icon: Tag, href: '/pricing', active: pathname === '/pricing' },
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
            <span className="text-[10px] text-zinc-400 font-medium">5-in-1 Music Hub</span>
          </div>
        </Link>

        {/* Section 1: Library */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-3">
            Downloader Engines
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

        {/* Section 2: Services & Pricing */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-3">
            Tools & Support
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

      {/* User Account / VIP Card */}
      <div className="pt-4">
        {isAuthenticated ? (
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#292a34] to-[#1e1f26] border border-white/10 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono bg-black/40 text-[#f0fc54] px-2 py-0.5 rounded-md font-bold">
                {user.userId}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isVip ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-zinc-300'
              }`}>
                {isVip ? 'VIP TURBO' : 'FREE TIER'}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={openVipModal}
              className="w-full py-2 rounded-xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-[11px] shadow transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5 fill-black" />
              {isVip ? 'Manage VIP License' : 'Upgrade VIP (₹99)'}
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#292a34] to-[#1e1f26] border border-amber-500/20 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold">
                <Crown className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRO ACCESS
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Save & Sync Library</h4>
              <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">
                Sign in to sync your download history across all computers.
              </p>
            </div>
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-2 rounded-xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-[11px] shadow transition active:scale-95 flex items-center justify-center gap-1"
            >
              Free Sign In / Sign Up
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
