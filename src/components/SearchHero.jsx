'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Clipboard, 
  Download, 
  Loader2, 
  Music, 
  Layers, 
  Disc, 
  Headphones, 
  Check,
  Sparkles
} from 'lucide-react';

export default function SearchHero({ 
  initialQuery = '', 
  activeTab = 'all', 
  title = 'Spotify Downloader',
  subtitle = 'Download Tracks, Playlists & Albums from Spotify in High Quality MP3 (320kbps)'
}) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setQuery(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.warn('Clipboard access denied or unavailable');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    router.push(`/results?q=${encodeURIComponent(query.trim())}`);
  };

  const tabs = [
    { name: 'Spotify Track', href: '/spotify-track-downloader', icon: Music, id: 'track' },
    { name: 'Playlist', href: '/spotify-playlist-downloader', icon: Layers, id: 'playlist' },
    { name: 'Album', href: '/spotify-album-downloader', icon: Disc, id: 'album' },
    { name: 'Apple Music', href: '/apple-music-downloader', icon: Sparkles, id: 'apple' },
    { name: 'Spotify to MP3', href: '/spotify-to-mp3', icon: Headphones, id: 'mp3' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#121212] via-[#161616] to-[#121212] text-white py-16 sm:py-24 border-b border-white/5">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-64 bg-[#1db954]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Category switcher pill */}
        <div className="inline-flex items-center justify-center p-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md mb-8 max-w-full overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                href={tab.href}
                className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#1db954] text-black shadow-md shadow-[#1db954]/30'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </a>
            );
          })}
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight leading-tight text-white">
          {title}
        </h1>
        <p className="text-sm sm:text-lg mb-10 max-w-2xl mx-auto text-slate-300">
          {subtitle}
        </p>

        {/* Search & URL Input Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#242424]/90 p-2 sm:p-2.5 rounded-2xl border border-white/15 shadow-2xl backdrop-blur-md focus-within:border-[#1db954] focus-within:ring-2 focus-within:ring-[#1db954]/30 transition-all">
            <div className="flex-1 flex items-center gap-3 w-full pl-3 pr-2">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Paste Spotify / Apple Music song, playlist, album link or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm sm:text-base text-white placeholder-slate-400 outline-none"
                required
              />
              
              {/* Quick Paste Button */}
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="p-2 text-[#1db954] hover:bg-[#1db954]/15 rounded-xl transition-all flex items-center gap-1 text-xs font-bold cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline text-emerald-400">Pasted!</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Paste</span>
                  </>
                )}
              </button>
            </div>

            {/* Download Action Button */}
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto bg-[#1db954] hover:bg-[#1ed760] disabled:opacity-60 text-black font-extrabold px-7 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#1db954]/25 active:scale-95 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-[#1db954]" /> Try searching:</span>
          {['Ed Sheeran Shape of You', 'Today\'s Top Hits', 'Arijit Singh', 'Blinding Lights'].map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setQuery(example);
                router.push(`/results?q=${encodeURIComponent(example)}`);
              }}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
