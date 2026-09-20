'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Music, 
  Search, 
  Download, 
  Sparkles, 
  Play, 
  Zap, 
  Clipboard, 
  Archive, 
  Check, 
  Layers 
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

export default function StudioHeroBanner() {
  const [inputUrl, setInputUrl] = useState('');
  const [activePlatform, setActivePlatform] = useState('all');
  const [pasted, setPasted] = useState(false);
  const router = useRouter();
  const { playTrack } = usePlayer();

  const platforms = [
    { id: 'all', name: 'All Platforms', badge: '⚡', placeholder: 'Paste any Spotify, Apple, YouTube, SoundCloud or JioSaavn link...' },
    { id: 'spotify', name: 'Spotify', badge: '🟢', placeholder: 'https://open.spotify.com/track/... or /playlist/...' },
    { id: 'apple', name: 'Apple Music', badge: '🍎', placeholder: 'https://music.apple.com/.../album/... or /song/...' },
    { id: 'youtube', name: 'YouTube Music', badge: '🔴', placeholder: 'https://music.youtube.com/watch?v=... or playlist' },
    { id: 'soundcloud', name: 'SoundCloud', badge: '🟠', placeholder: 'https://soundcloud.com/artist/track-name' },
    { id: 'jiosaavn', name: 'JioSaavn', badge: '🔵', placeholder: 'https://www.jiosaavn.com/song/... or /album/...' },
  ];

  const currentPlaceholder = platforms.find((p) => p.id === activePlatform)?.placeholder || platforms[0].placeholder;

  const handleDownload = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    router.push(`/results?q=${encodeURIComponent(inputUrl.trim())}`);
  };

  const handlePasteClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text);
          setPasted(true);
          setTimeout(() => setPasted(false), 2000);
        }
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  const handlePlayFeatured = () => {
    playTrack({
      id: 'featured-blinding-lights',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 200,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/12/73/ca/1273ca46-233a-5331-189b-25ac1d656533/mzaf_976341070785891411.plus.aac.p.m4a',
    });
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#be5c2b] via-[#944018] to-[#361607] text-white p-6 sm:p-8 flex flex-col gap-6 border border-white/10">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#f0fc54]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-black/30 rounded-full blur-2xl pointer-events-none" />

      {/* Top Row: Left Details & Right Square Featured Album Preview */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 w-full">
        {/* Left: Badges & Headings */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#f0fc54] px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-[#f0fc54]/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              UNIVERSAL 5-IN-1 MUSIC STUDIO
            </span>
            <span className="text-[11px] font-bold text-zinc-200 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center gap-1">
              <Archive className="w-3.5 h-3.5 text-[#f0fc54]" />
              1-Click Bulk Playlist ZIP
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            PASTE ANY MUSIC LINK & DOWNLOAD <span className="text-[#f0fc54]">320kbps MP3</span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-100/90 leading-relaxed font-normal max-w-2xl">
            Works seamlessly with <strong>Spotify, Apple Music, YouTube Music, SoundCloud, and JioSaavn</strong>. Download single songs or complete 100+ track playlists in high-speed ZIP.
          </p>
        </div>

        {/* Right: Full Square Featured Track Card matching other tabs */}
        <div className="relative shrink-0 w-full sm:w-64 lg:w-72 flex justify-center">
          <div className="relative group cursor-pointer w-48 sm:w-56 aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-[#f0fc54]/30 bg-black/40">
            <img
              src="https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg"
              alt="The Weeknd - Blinding Lights"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#f0fc54] uppercase tracking-wider">Featured Track</span>
                  <p className="text-xs font-black text-white">Blinding Lights</p>
                  <p className="text-[10px] text-zinc-300">The Weeknd • After Hours</p>
                </div>
                <button
                  type="button"
                  onClick={handlePlayFeatured}
                  title="Play Preview"
                  className="w-9 h-9 rounded-full bg-[#f0fc54] text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition"
                >
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Platforms Arranged in a Clean Left-to-Right Horizontal Bar */}
      <div className="relative z-10 w-full flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {platforms.map((p) => {
          const isActive = activePlatform === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePlatform(p.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 shadow-sm active:scale-95 ${
                isActive
                  ? 'bg-white text-black font-extrabold shadow-lg scale-105'
                  : 'bg-black/35 hover:bg-black/55 text-zinc-200 border border-white/10 hover:border-white/20'
              }`}
            >
              <span>{p.badge}</span>
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Full-Width Search & Paste Downloader Bar */}
      <div className="relative z-10 w-full pt-1">
        <form onSubmit={handleDownload} className="w-full flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 w-full min-w-0">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder={currentPlaceholder}
              className="w-full bg-black/60 backdrop-blur-md text-white placeholder:text-zinc-400 text-xs sm:text-sm pl-12 pr-28 py-4 rounded-2xl border-2 border-white/20 focus:border-[#f0fc54] focus:bg-black/80 focus:outline-none transition shadow-2xl font-medium"
            />
            {/* Quick Paste from Clipboard Button */}
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-zinc-100 text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer border border-white/10 shadow-sm active:scale-95"
            >
              {pasted ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5 text-[#f0fc54]" />}
              <span>{pasted ? 'Pasted!' : 'Paste'}</span>
            </button>
          </div>

          <button
            type="submit"
            className="px-8 py-4 rounded-2xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-black text-xs sm:text-sm shadow-2xl transition active:scale-95 flex items-center justify-center gap-2.5 shrink-0 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>Start Download</span>
          </button>
        </form>
      </div>
    </div>
  );
}


