'use client';

import React, { useState } from 'react';
import StudioSidebar from '@/components/studio/StudioSidebar';
import StudioTopBar from '@/components/studio/StudioTopBar';
import StudioHeroBanner from '@/components/studio/StudioHeroBanner';
import PopularArtistsCarousel from '@/components/studio/PopularArtistsCarousel';
import StudioTrackList from '@/components/studio/StudioTrackList';
import NowPlayingPanel from '@/components/studio/NowPlayingPanel';
import BottomWaveformPlayer from '@/components/studio/BottomWaveformPlayer';
import AdSlot from '@/components/AdSlot';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (q) => {
    router.push(`/results?q=${encodeURIComponent(q)}`);
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#111215] text-zinc-100 flex items-center justify-center p-0 sm:p-4 lg:p-8 font-sans studio-bg selection:bg-[#f0fc54] selection:text-black">
      {/* Studio Container Window (Exact frame from Figma reference) */}
      <div suppressHydrationWarning className="w-full max-w-7xl min-h-[92vh] bg-[#1a1b22] rounded-none sm:rounded-[36px] border-0 sm:border border-white/10 shadow-2xl overflow-hidden flex flex-col relative pb-24">
        
        {/* Main 3-Column Studio Grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <StudioSidebar className="hidden md:flex" />

          {/* Center Main Dashboard */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#16171d] overflow-y-auto">
            {/* Top Navigation */}
            <StudioTopBar onSearch={handleSearch} />

            {/* Canvas Body */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
              {/* Terracotta Curated Hero Banner */}
              <StudioHeroBanner />

              {/* Ad Banner slot (hidden for VIP) */}
              <AdSlot type="banner" />

              {/* Popular Artists Carousel */}
              <PopularArtistsCarousel onSelectArtist={handleSearch} />

              {/* Recently Played / Featured 320kbps MP3 Tracks */}
              <StudioTrackList 
                title="Trending Songs (Ready to Download)"
                onSeeAll={() => router.push('/results?q=Trending%20Global%20Hits')}
              />
            </div>
          </main>

          {/* Right Now Playing Panel */}
          <NowPlayingPanel className="hidden xl:flex" />
        </div>

        {/* Floating Bottom Waveform Player */}
        <BottomWaveformPlayer />
      </div>
    </div>
  );
}
