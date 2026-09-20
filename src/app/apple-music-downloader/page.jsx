'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StudioLayout from '@/components/studio/StudioLayout';
import StudioTrackList from '@/components/studio/StudioTrackList';
import PopularArtistsCarousel from '@/components/studio/PopularArtistsCarousel';
import AdSlot from '@/components/AdSlot';
import { 
  Sparkles, 
  Search, 
  Download, 
  Play, 
  Check, 
  Clipboard, 
  Headphones, 
  Radio, 
  ShieldCheck, 
  Volume2, 
  Apple 
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

export default function AppleMusicPage() {
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

  const appleTopHits = [
    {
      id: 'ap-1',
      title: 'Snowfall',
      artist: 'Oneheart, reidenshi',
      duration: 122,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ac/98/63/ac9863eb-b027-332f-cfa2-90611eec1630/1963620796731_cover.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1e/35/a4/1e35a4e6-7400-1a60-d08b-33a9d68b8053/mzaf_4981520475692412372.plus.aac.p.m4a',
    },
    {
      id: 'ap-2',
      title: 'Kesariya (Brahmastra)',
      artist: 'Arijit Singh, Pritam',
      duration: 268,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a',
    },
    {
      id: 'ap-3',
      title: 'Mr. Right Now',
      artist: '21 Savage, Metro Boomin ft. Drake',
      duration: 193,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8d/18/2a/8d182a57-0a7a-efeb-6795-f830efba8d3b/26UMGIM65707.rgb.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/05/b5/00/05b500f8-b199-51b7-d898-3b1e9d9bf221/mzaf_1208100608739118268.plus.aac.p.m4a',
    },
    {
      id: 'ap-4',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      duration: 200,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/12/73/ca/1273ca46-233a-5331-189b-25ac1d656533/mzaf_976341070785891411.plus.aac.p.m4a',
    },
  ];

  return (
    <StudioLayout breadcrumb="Apple Music Downloader (320kbps & AAC)">
      {/* Dedicated Apple Music Crimson Rose Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#e11d48] via-[#9f1239] to-[#4c0519] text-white p-6 sm:p-8 flex flex-col gap-6 border border-rose-500/30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#fb7185]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Row */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 w-full">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#fecdd3] px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-rose-400/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#fb7185]" />
                APPLE MUSIC HD AUDIO ENGINE
              </span>
              <span className="text-[11px] font-bold text-zinc-200 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
                AAC & 320kbps MP3
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              APPLE MUSIC TO <span className="text-[#fb7185]">320kbps MP3</span>
            </h2>

            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-normal max-w-2xl">
              Download songs, albums, and playlists from <strong>Apple Music</strong> in studio-grade 320kbps MP3 or lossless 256kbps AAC audio with Apple Digital Master acoustic quality.
            </p>
          </div>

          {/* Right Preview Card */}
          <div className="relative shrink-0 w-full sm:w-64 lg:w-72 flex justify-center">
            <div className="relative group cursor-pointer w-48 sm:w-56 aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-rose-400/40 bg-black/40">
              <img
                src="https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ac/98/63/ac9863eb-b027-332f-cfa2-90611eec1630/1963620796731_cover.jpg/600x600bb.jpg"
                alt="Snowfall"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#fb7185] uppercase tracking-wider">Apple Global #1</span>
                    <p className="text-xs font-black text-white">Snowfall</p>
                    <p className="text-[10px] text-zinc-300">Oneheart, reidenshi</p>
                  </div>
                  <button
                    onClick={() => playTrack(appleTopHits[0])}
                    title="Play Preview"
                    className="w-9 h-9 rounded-full bg-[#fb7185] text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition"
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
              <Search className="w-5 h-5 text-rose-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste Apple Music URL (e.g. https://music.apple.com/...)..."
                className="w-full bg-black/60 backdrop-blur-md text-white placeholder:text-zinc-400 text-xs sm:text-sm pl-12 pr-28 py-4 rounded-2xl border-2 border-rose-500/40 focus:border-[#fb7185] focus:bg-black/80 focus:outline-none transition shadow-2xl font-medium"
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-zinc-100 text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer border border-white/10 shadow-sm active:scale-95"
              >
                {pasted ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5 text-[#fb7185]" />}
                <span>{pasted ? 'Pasted!' : 'Paste'}</span>
              </button>
            </div>

            <button
              type="submit"
              className="px-8 py-4 rounded-2xl bg-[#fb7185] hover:bg-[#f43f5e] text-black font-black text-xs sm:text-sm shadow-2xl transition active:scale-95 flex items-center justify-center gap-2.5 shrink-0 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Download Apple Music</span>
            </button>
          </form>
        </div>
      </div>

      <AdSlot type="banner" />

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#1e2028] border border-white/5 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-[#fb7185] flex items-center justify-center font-bold mb-2">
            <Volume2 className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">Apple Digital Master</h4>
          <p className="text-[11px] text-zinc-400">High acoustic precision audio with crystal-clear dynamic range.</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1e2028] border border-white/5 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-[#fb7185] flex items-center justify-center font-bold mb-2">
            <Headphones className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">Lossless AAC & MP3</h4>
          <p className="text-[11px] text-zinc-400">Export in universal 320kbps MP3 or native 256kbps AAC formats.</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1e2028] border border-white/5 space-y-1">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-[#fb7185] flex items-center justify-center font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">No Apple ID Required</h4>
          <p className="text-[11px] text-zinc-400">100% Free. No Apple Music subscription or iTunes login required.</p>
        </div>
      </div>

      {/* Popular Artists */}
      <PopularArtistsCarousel />

      {/* Apple Top Hits */}
      <StudioTrackList 
        title="Apple Music Top 100 Global" 
        tracks={appleTopHits}
      />

      <AdSlot type="native" slotId="apple-native" />
    </StudioLayout>
  );
}
