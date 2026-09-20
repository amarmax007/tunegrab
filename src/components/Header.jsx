'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useVip } from '@/context/VipContext';
import { 
  Music, 
  Sun, 
  Moon, 
  Crown, 
  Menu, 
  X, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  Disc, 
  Headphones,
  Tag
} from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { isVip, openVipModal } = useVip();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Spotify Track', href: '/spotify-track-downloader', icon: Music },
    { name: 'Playlist', href: '/spotify-playlist-downloader', icon: Layers },
    { name: 'Album', href: '/spotify-album-downloader', icon: Disc },
    { name: 'Apple Music', href: '/apple-music-downloader', icon: Sparkles },
    { name: 'Spotify to MP3', href: '/spotify-to-mp3', icon: Headphones },
    { name: 'Pricing', href: '/pricing', icon: Tag },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 transition-colors duration-300 glass-header border-b border-black/10 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-[#1db954] flex items-center justify-center text-black font-black shadow-md shadow-[#1db954]/30 group-hover:scale-105 transition-transform">
            <Music className="w-5 h-5 text-black" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            <span className="text-[#1db954]">Tune</span>Grab
          </span>
          {isVip && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider shadow">
              VIP PRO
            </span>
          )}
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-[#1db954] bg-[#1db954]/10 font-bold'
                    : 'text-slate-700 hover:text-black hover:bg-black/5 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* VIP Premium Button */}
          <button
            onClick={openVipModal}
            className={`flex items-center gap-1.5 font-bold text-xs rounded-full py-1.5 px-3.5 cursor-pointer transition-all shadow-md active:scale-95 ${
              isVip
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black ring-2 ring-amber-400/40'
                : 'bg-[#ffd700] hover:bg-[#e6c200] text-black shadow-amber-500/20'
            }`}
          >
            <Crown className="w-4 h-4 fill-black" />
            <span>{isVip ? 'VIP Active' : 'Get VIP'}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            suppressHydrationWarning
            className="p-2 rounded-lg text-slate-700 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Sun className="w-4 h-4 text-amber-400 hidden dark:block" />
            <Moon className="w-4 h-4 text-slate-700 block dark:hidden" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            aria-label="Open Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-black/10 dark:border-white/10 bg-white dark:bg-[#121212] px-4 py-4 space-y-1.5 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'text-[#1db954] bg-[#1db954]/10'
                    : 'text-slate-800 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 text-[#1db954]" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
