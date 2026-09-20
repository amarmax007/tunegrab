'use client';

import React from 'react';
import Link from 'next/link';
import { Music, Heart, Shield, Crown } from 'lucide-react';
import { useVip } from '@/context/VipContext';

export default function Footer() {
  const { openVipModal } = useVip();

  return (
    <footer className="bg-slate-100 dark:bg-[#0c0c0c] border-t border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1db954] flex items-center justify-center text-black font-black">
                <Music className="w-4 h-4 text-black" />
              </div>
              <span className="font-black text-xl text-slate-900 dark:text-white">
                <span className="text-[#1db954]">Tune</span>Grab
              </span>
            </Link>
            <p className="text-xs leading-relaxed">
              TuneGrab is a free universal music downloader supporting Spotify, Apple Music, YouTube Music, SoundCloud, and JioSaavn in HD 320kbps MP3 audio.
            </p>
            <button
              onClick={openVipModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition"
            >
              <Crown className="w-3.5 h-3.5" />
              Get VIP License
            </button>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Music Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/spotify-track-downloader" className="hover:text-[#1db954] transition-colors">
                  Spotify Track Downloader
                </Link>
              </li>
              <li>
                <Link href="/spotify-playlist-downloader" className="hover:text-[#1db954] transition-colors">
                  Spotify Playlist Downloader
                </Link>
              </li>
              <li>
                <Link href="/spotify-album-downloader" className="hover:text-[#1db954] transition-colors">
                  Spotify Album Downloader
                </Link>
              </li>
              <li>
                <Link href="/apple-music-downloader" className="hover:text-[#1db954] transition-colors">
                  Apple Music Downloader
                </Link>
              </li>
              <li>
                <Link href="/spotify-to-mp3" className="hover:text-[#1db954] transition-colors">
                  Spotify to MP3 Converter
                </Link>
              </li>
            </ul>
          </div>

          {/* Links & Pricing */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pricing" className="hover:text-[#1db954] transition-colors">
                  VIP Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#1db954] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#1db954] transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dmca" className="hover:text-[#1db954] transition-colors">
                  DMCA Copyright Notice
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#1db954] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#1db954] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                Non-hosting educational backup tool. Not affiliated with Spotify, Apple, Google, or JioSaavn.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SpotSaver. Built with 256-bit Security & SSL Encryption.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for music lovers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
