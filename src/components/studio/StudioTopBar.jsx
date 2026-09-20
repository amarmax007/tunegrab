'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Settings, 
  Bell, 
  ChevronRight, 
  Shuffle, 
  Crown, 
  X,
  User 
} from 'lucide-react';
import { useVip } from '@/context/VipContext';
import { useAuth } from '@/context/AuthContext';
import ProfileModal from '@/components/studio/ProfileModal';
import SettingsModal from '@/components/studio/SettingsModal';

export default function StudioTopBar({ initialQuery = '', onSearch, breadcrumb = 'Universal Music 2026' }) {
  const [query, setQuery] = useState(initialQuery);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();
  const { isVip, openVipModal } = useVip();
  const { user, isAuthenticated } = useAuth();

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
            className="w-full bg-[#24252f] text-xs text-white placeholder-zinc-500 pl-11 pr-10 py-3 rounded-full border border-white/5 focus:border-[#f0fc54]/50 focus:bg-[#2a2b36] focus:outline-none transition shadow-inner"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
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
              className="hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition"
            >
              New Releases
            </button>
            <button 
              onClick={() => router.push('/results?q=Global%20Charts')}
              className="hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition"
            >
              New Feed
            </button>
            <button 
              onClick={() => router.push('/results?q=Top%20Party%20Mix')}
              className="hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition flex items-center gap-1"
            >
              <Shuffle className="w-3 h-3 text-[#f0fc54]" />
              Shuffle Play
            </button>
          </div>

          {/* Separator */}
          <div className="hidden lg:block w-px h-5 bg-white/10" />

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Studio Settings"
              className="w-9 h-9 rounded-full bg-[#24252f] hover:bg-[#2f303c] text-zinc-400 hover:text-white flex items-center justify-center transition border border-white/5 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={openVipModal}
              title="VIP Turbo Club"
              className="relative w-9 h-9 rounded-full bg-[#24252f] hover:bg-[#2f303c] text-zinc-400 hover:text-white flex items-center justify-center transition border border-white/5 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f0fc54] ring-2 ring-[#24252f]" />
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={() => setIsProfileOpen(true)}
              title="My Profile & Stats"
              className={`w-9 h-9 rounded-full overflow-hidden border-2 transition cursor-pointer flex items-center justify-center ${
                isVip ? 'border-amber-400 shadow-md shadow-amber-400/20 bg-gradient-to-br from-amber-500 to-orange-600' : 'border-zinc-700 hover:border-zinc-400 bg-gradient-to-br from-violet-500 to-indigo-600'
              }`}
            >
              {isAuthenticated && user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : isAuthenticated && user?.name ? (
                <span className="text-white font-bold text-xs select-none">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="w-4 h-4 text-white/80" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
