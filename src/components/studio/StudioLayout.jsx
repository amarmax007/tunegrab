'use client';

import React from 'react';
import StudioSidebar from '@/components/studio/StudioSidebar';
import StudioTopBar from '@/components/studio/StudioTopBar';
import NowPlayingPanel from '@/components/studio/NowPlayingPanel';
import BottomWaveformPlayer from '@/components/studio/BottomWaveformPlayer';

export default function StudioLayout({ children, breadcrumb = 'Universal Music 2026', initialQuery = '' }) {
  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#111215] text-zinc-100 flex items-center justify-center p-0 sm:p-4 lg:p-8 font-sans studio-bg selection:bg-[#f0fc54] selection:text-black">
      {/* Studio Container Window (Exact frame from Figma reference) */}
      <div suppressHydrationWarning className="w-full max-w-7xl min-h-[92vh] bg-[#1a1b22] rounded-none sm:rounded-[36px] border-0 sm:border border-white/10 shadow-2xl overflow-hidden flex flex-col relative pb-24">
        
        {/* Main 3-Column Studio Grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <StudioSidebar className="hidden md:flex" />

          {/* Center Main Dashboard Canvas */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#16171d] overflow-y-auto">
            {/* Top Navigation */}
            <StudioTopBar breadcrumb={breadcrumb} initialQuery={initialQuery} />

            {/* Canvas Body */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
              {children}
            </div>
          </main>

          {/* Right Now Playing Dock */}
          <NowPlayingPanel className="hidden xl:flex" />
        </div>

        {/* Floating Bottom Waveform Player */}
        <BottomWaveformPlayer />
      </div>
    </div>
  );
}
