'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StudioLayout from '@/components/studio/StudioLayout';
import StudioTrackList from '@/components/studio/StudioTrackList';
import PopularArtistsCarousel from '@/components/studio/PopularArtistsCarousel';
import AdSlot from '@/components/AdSlot';
import { 
  Music, 
  Search, 
  Download, 
  Sparkles, 
  Play, 
  Check, 
  Clipboard, 
  ShieldCheck, 
  Sliders, 
  Disc, 
  CheckCircle2, 
  Zap 
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

export default function SpotifyTrackPage() {
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

  const spotifyTrendingTracks = [
    {
      id: 'sp-1',
      title: 'Die With A Smile',
      artist: 'Lady Gaga & Bruno Mars',
      duration: 251,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/91/9f/62/919f626c-d2c2-8419-f027-e431ffca2066/24UMGIM89622.rgb.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/12/73/ca/1273ca46-233a-5331-189b-25ac1d656533/mzaf_976341070785891411.plus.aac.p.m4a',
    },
    {
      id: 'sp-2',
      title: 'Birds of a Feather',
      artist: 'Billie Eilish',
      duration: 190,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bf/16/d2/bf16d2f3-33e9-a352-73a7-53531b7908b8/24UMGIM36577.rgb.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/05/b5/00/05b500f8-b199-51b7-d898-3b1e9d9bf221/mzaf_1208100608739118268.plus.aac.p.m4a',
    },
    {
      id: 'sp-3',
      title: 'Espresso',
      artist: 'Sabrina Carpenter',
      duration: 175,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/64/73/f8/6473f8d9-2475-e8d1-d241-d6021e8e29a9/24UMGIM33947.rgb.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1e/35/a4/1e35a4e6-7400-1a60-d08b-33a9d68b8053/mzaf_4981520475692412372.plus.aac.p.m4a',
    },
    {
      id: 'sp-4',
      title: 'Starboy',
      artist: 'The Weeknd ft. Daft Punk',
      duration: 230,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/71/d6/1171d6ad-3c96-e027-2af6-58028426588c/mzaf_15137631797407745471.plus.aac.p.m4a',
    },
  ];

  return (
    <StudioLayout breadcrumb="Spotify Track Downloader (320kbps)">
      {/* Dedicated Emerald Spotify Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#10723a] via-[#0b4d27] to-[#062413] text-white p-6 sm:p-8 flex flex-col gap-6 border border-emerald-500/20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1ed760]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Row */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 w-full">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#1ed760] px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-[#1ed760]/30 flex items-center gap-1.5 shadow-sm">
                <Music className="w-3.5 h-3.5" />
                SPOTIFY 320KBPS MP3 ENGINE
              </span>
              <span className="text-[11px] font-bold text-zinc-200 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
                Full ID3 Meta & Cover Art
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              DOWNLOAD ANY <span className="text-[#1ed760]">SPOTIFY SONG</span> TO MP3
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
              Convert Spotify tracks into crystal-clear <strong>320kbps MP3 audio files</strong>. Keep original album artwork, artist credits, lyrics metadata, and track numbers permanently offline.
            </p>
          </div>

          {/* Right Preview Card */}
          <div className="relative shrink-0 w-full sm:w-64 lg:w-72 flex justify-center">
            <div className="relative group cursor-pointer w-48 sm:w-56 aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-400/30 bg-black/40">
              <img
                src="https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/91/9f/62/919f626c-d2c2-8419-f027-e431ffca2066/24UMGIM89622.rgb.jpg/600x600bb.jpg"
                alt="Die With A Smile"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#1ed760] uppercase tracking-wider">Spotify #1 Global</span>
                    <p className="text-xs font-black text-white">Die With A Smile</p>
                    <p className="text-[10px] text-zinc-300">Lady Gaga & Bruno Mars</p>
                  </div>
                  <button
                    onClick={() => playTrack(spotifyTrendingTracks[0])}
                    title="Play Preview"
                    className="w-9 h-9 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition"
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
              <Search className="w-5 h-5 text-emerald-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste Spotify track URL (e.g. https://open.spotify.com/track/...) or song name..."
                className="w-full bg-black/60 backdrop-blur-md text-white placeholder:text-zinc-400 text-xs sm:text-sm pl-12 pr-28 py-4 rounded-2xl border-2 border-emerald-500/30 focus:border-[#1ed760] focus:bg-black/80 focus:outline-none transition shadow-2xl font-medium"
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-zinc-100 text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer border border-white/10 shadow-sm active:scale-95"
              >
                {pasted ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5 text-[#1ed760]" />}
                <span>{pasted ? 'Pasted!' : 'Paste'}</span>
              </button>
            </div>

            <button
              type="submit"
              className="px-8 py-4 rounded-2xl bg-[#1ed760] hover:bg-[#1bc456] text-black font-black text-xs sm:text-sm shadow-2xl transition active:scale-95 flex items-center justify-center gap-2.5 shrink-0 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Download Spotify MP3</span>
            </button>
          </form>
        </div>
      </div>

      <AdSlot type="banner" />

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#1e2028] border border-white/5 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#1ed760] flex items-center justify-center font-bold mb-2">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">Direct 320kbps MP3</h4>
          <p className="text-[11px] text-zinc-400">High-bitrate studio quality extracted directly without audio loss.</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1e2028] border border-white/5 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#1ed760] flex items-center justify-center font-bold mb-2">
            <Disc className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">Full ID3 Tags Included</h4>
          <p className="text-[11px] text-zinc-400">Title, Artist, Album, Year, and HD Cover Artwork automatically embedded.</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1e2028] border border-white/5 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#1ed760] flex items-center justify-center font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">No Spotify Account Needed</h4>
          <p className="text-[11px] text-zinc-400">100% Free forever. No Premium account or login required.</p>
        </div>
      </div>

      {/* Popular Artists */}
      <PopularArtistsCarousel />

      {/* Track List */}
      <StudioTrackList 
        title="Trending Spotify Charts 2026" 
        tracks={spotifyTrendingTracks}
      />
    </StudioLayout>
  );
}
