'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Settings, 
  ChevronRight, 
  Shuffle, 
  Zap, 
  X,
  CheckCircle2
} from 'lucide-react';
import { useVip } from '@/context/VipContext';
import SettingsModal from '@/components/studio/SettingsModal';

export default function StudioTopBar({ initialQuery = '', onSearch, breadcrumb = 'Universal Music 2026' }) {
  const [query, setQuery] = useState(initialQuery);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();
  const { isVip, openVipModal } = useVip();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (onSearch) {
      onSearch(query.trim());
    } else {
      router.push(`/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <header className="px-6 py-4 border-b border-white/5 bg-[#1a1b22]/90 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 w-full md:w-auto">
          <span 
            onClick={() => router.push('/')}
            className="text-zinc-500 hover:text-white cursor-pointer transition"
          >
            Studio
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-white font-bold">{breadcrumb}</span>
        </div>

        {/* Center Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Paste Spotify, Apple, YouTube, JioSaavn link or search song..."
            className="w-full bg-[#24252f] text-xs text-white placeholder-zinc-500 pl-11 pr-10 py-3 rounded-full border border-white/5 focus:border-emerald-500 focus:bg-[#2a2b36] focus:outline-none transition shadow-inner"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Right Controls & Quick Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Quick Nav Pills */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-zinc-400">
            <button 
              onClick={() => router.push('/results?q=New%20Releases')}
              className="hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
            >
              New Releases
            </button>
            <button 
              onClick={() => router.push('/results?q=Global%20Charts')}
              className="hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
            >
              Charts
            </button>
            <button 
              onClick={() => router.push('/results?q=Top%20Party%20Mix')}
              className="hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition flex items-center gap-1 cursor-pointer"
            >
              <Shuffle className="w-3 h-3 text-[#f0fc54]" />
              Shuffle
            </button>
          </div>

          <div className="hidden lg:block w-px h-5 bg-white/10" />

          {/* Action Icons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Studio Settings"
              className="w-9 h-9 rounded-full bg-[#24252f] hover:bg-[#2f303c] text-zinc-400 hover:text-white flex items-center justify-center transition border border-white/5 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* High Converting Spotsaver-Style Premium Button */}
            {isVip ? (
              <button
                onClick={openVipModal}
                className="py-2 px-3.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ad-Free Active</span>
              </button>
            ) : (
              <button
                onClick={openVipModal}
                className="py-2 px-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Get Premium</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
