'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StudioLayout from '@/components/studio/StudioLayout';
import StudioTrackList from '@/components/studio/StudioTrackList';
import PopularArtistsCarousel from '@/components/studio/PopularArtistsCarousel';
import AdSlot from '@/components/AdSlot';
import { 
  Layers, 
  Search, 
  Download, 
  Sparkles, 
  Play, 
  Check, 
  Clipboard, 
  Archive, 
  FolderArchive, 
  Zap, 
  Clock, 
  FileCheck2 
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

export default function SpotifyPlaylistPage() {
  const [inputUrl, setInputUrl] = useState('');
  const [pasted, setPasted] = useState(false);
  const router = useRouter();
  const { playTrack } = usePlayer();

  const handleDownload = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    router.push(`/results?q=${encodeURIComponent(inputUrl.trim())}`);
  };

  const handlePaste = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text);
          setPasted(true);
          setTimeout(() => setPasted(false), 2000);
        }
      }
    } catch (e) {}
  };

  const topPlaylists = [
    {
      id: 'pl-1',
      title: "Today's Top Hits (50 Tracks)",
      artist: 'Spotify Editorial • 32M Followers',
      duration: 3600,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/12/73/ca/1273ca46-233a-5331-189b-25ac1d656533/mzaf_976341070785891411.plus.aac.p.m4a',
    },
    {
      id: 'pl-2',
      title: 'Hot Hits Hindi (Bollywood 2026)',
      artist: 'Spotify India • 8.4M Followers',
      duration: 4200,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a',
    },
    {
      id: 'pl-3',
      title: 'Deep Focus & Ambient Lofi (100 Tracks)',
      artist: 'Chill Beats Studio • 5.1M Followers',
      duration: 5400,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ac/98/63/ac9863eb-b027-332f-cfa2-90611eec1630/1963620796731_cover.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1e/35/a4/1e35a4e6-7400-1a60-d08b-33a9d68b8053/mzaf_4981520475692412372.plus.aac.p.m4a',
    },
  ];

  return (
    <StudioLayout breadcrumb="Spotify Playlist Downloader (1-Click ZIP)">
      {/* Dedicated Royal Violet Playlist Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#5b21b6] via-[#3b0764] to-[#1e053a] text-white p-6 sm:p-8 flex flex-col gap-6 border border-purple-500/30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#a855f7]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Row */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 w-full">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#d8b4fe] px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-purple-400/30 flex items-center gap-1.5 shadow-sm">
                <Archive className="w-3.5 h-3.5 text-[#c084fc]" />
                1-CLICK BULK PLAYLIST ZIP ENGINE
              </span>
              <span className="text-[11px] font-bold text-zinc-200 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
                100+ Songs Concurrency
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              DOWNLOAD FULL <span className="text-[#c084fc]">SPOTIFY PLAYLISTS</span> IN 1 ZIP
            </h2>

            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-normal max-w-2xl">
              Paste any Spotify playlist link. Download all songs in a single compressed <strong>.ZIP file</strong> with sequential track numbers, high-speed multi-threading, and zero corruption.
            </p>
          </div>

          {/* Right Playlist Stack Card */}
          <div className="relative shrink-0 w-full sm:w-64 lg:w-72 flex justify-center">
            <div className="relative group cursor-pointer w-48 sm:w-56 aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-400/40 bg-black/40">
              <img
                src="https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg"
                alt="Today's Top Hits"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider">Top 50 Playlist</span>
                    <p className="text-xs font-black text-white">Today's Top Hits</p>
                    <p className="text-[10px] text-zinc-300">50 Songs • 320kbps ZIP</p>
                  </div>
                  <button
                    onClick={() => playTrack(topPlaylists[0])}
                    title="Play Preview"
                    className="w-9 h-9 rounded-full bg-[#c084fc] text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition"
                  >
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Search Downloader Input Bar */}
        <div className="relative z-10 w-full pt-1">
          <form onSubmit={handleDownload} className="w-full flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 w-full min-w-0">
              <Search className="w-5 h-5 text-purple-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste Spotify playlist URL (e.g. https://open.spotify.com/playlist/...)..."
                className="w-full bg-black/60 backdrop-blur-md text-white placeholder:text-zinc-400 text-xs sm:text-sm pl-12 pr-28 py-4 rounded-2xl border-2 border-purple-500/40 focus:border-[#c084fc] focus:bg-black/80 focus:outline-none transition shadow-2xl font-medium"
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-zinc-100 text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer border border-white/10 shadow-sm active:scale-95"
              >
                {pasted ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5 text-[#c084fc]" />}
                <span>{pasted ? 'Pasted!' : 'Paste'}</span>
              </button>
            </div>

            <button
              type="submit"
              className="px-8 py-4 rounded-2xl bg-[#c084fc] hover:bg-[#b06cf7] text-black font-black text-xs sm:text-sm shadow-2xl transition active:scale-95 flex items-center justify-center gap-2.5 shrink-0 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Download Playlist ZIP</span>
            </button>
          </form>
        </div>
      </div>

      <AdSlot type="banner" />

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#1e2028] border border-white/5 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-[#c084fc] flex items-center justify-center font-bold mb-2">
            <FolderArchive className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">One Single ZIP Archive</h4>
          <p className="text-[11px] text-zinc-400">No need to click 100 times. All songs are packed into a single organized ZIP folder.</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1e2028] border border-white/5 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-[#c084fc] flex items-center justify-center font-bold mb-2">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">Sequential Track Order</h4>
          <p className="text-[11px] text-zinc-400">Song filenames maintain the exact 01, 02, 03 order from your original Spotify playlist.</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1e2028] border border-white/5 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-[#c084fc] flex items-center justify-center font-bold mb-2">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">Multi-Thread Concurrency</h4>
          <p className="text-[11px] text-zinc-400">5x faster bulk processing with simultaneous audio conversion streams.</p>
        </div>
      </div>

      {/* Popular Artists */}
      <PopularArtistsCarousel />

      {/* Featured Playlists */}
      <StudioTrackList 
        title="Popular Global Playlists (1-Click ZIP Available)" 
        tracks={topPlaylists}
      />
    </StudioLayout>
  );
}
