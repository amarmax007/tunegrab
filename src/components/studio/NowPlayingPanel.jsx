'use client';

import React from 'react';
import { 
  Volume2, 
  ListMusic, 
  Play, 
  Download, 
  Sparkles, 
  Music,
  Heart,
  ExternalLink
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useAuth } from '@/context/AuthContext';

export default function NowPlayingPanel({ className = '' }) {
  const { currentTrack, isPlaying, playTrack, queue } = usePlayer();
  const { recordDownload, toggleFavorite, isFavorite } = useAuth();

  const handleDownloadCurrent = async () => {
    if (!currentTrack) return;
    try {
      // 1. Match audio
      const matchRes = await fetch('/api/get-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentTrack.title,
          artist: currentTrack.artist,
          duration: currentTrack.duration,
        }),
      });
      const matchData = await matchRes.json();
      if (!matchData.videoId) return;

      // 2. Convert to MP3
      const dlRes = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: matchData.videoId,
          title: `${currentTrack.title} - ${currentTrack.artist}`,
          candidateIds: matchData.candidateIds || [],
        }),
      });
      const dlData = await dlRes.json();
      const targetUrl = dlData.downloadUrl || dlData.url;
      if (!targetUrl) return;

      const safeFilename = `${currentTrack.title} - ${currentTrack.artist}.mp3`.replace(/[/\\?%*:|"<>]/g, '');
      const a = document.createElement('a');
      a.href = `/api/download?url=${encodeURIComponent(targetUrl)}&name=${encodeURIComponent(safeFilename)}`;
      a.download = safeFilename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (recordDownload) {
        recordDownload(currentTrack);
      }
    } catch (e) {
      console.warn('Direct download error:', e);
    }
  };

  const isFavorited = currentTrack ? isFavorite(currentTrack.id || currentTrack.title) : false;

  return (
    <div className={`w-80 bg-[#191a20] text-zinc-300 p-6 flex flex-col justify-between shrink-0 border-l border-white/5 select-none ${className}`}>
      <div className="space-y-6">
        {/* Header with Equalizer Icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            {/* Animated mini sound bars */}
            <div className="flex items-end gap-0.5 h-3.5">
              <span className={`w-1 rounded-full bg-[#f0fc54] ${isPlaying ? 'h-3.5 animate-pulse' : 'h-1.5'}`} />
              <span className={`w-1 rounded-full bg-[#f0fc54] ${isPlaying ? 'h-2.5 animate-bounce' : 'h-3'}`} />
              <span className={`w-1 rounded-full bg-[#f0fc54] ${isPlaying ? 'h-3.5 animate-pulse' : 'h-2'}`} />
            </div>
            <span>Now Playing</span>
          </div>

          <button 
            onClick={handleDownloadCurrent}
            title="Download this track"
            className="p-1.5 rounded-lg bg-[#24252f] hover:bg-[#f0fc54] hover:text-black text-zinc-300 transition"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Large Album Cover Art */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-2xl bg-black/40 border border-white/10 group">
          {currentTrack?.thumbnail ? (
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500">
              <Music className="w-12 h-12" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span className="text-[11px] font-semibold text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
              HD 320kbps Audio
            </span>
          </div>
        </div>

        {/* Track Title & Artist */}
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white truncate" title={currentTrack?.title}>
              {currentTrack?.title || 'Snowfall'}
            </h3>
            <p className="text-xs text-zinc-400 truncate">
              {currentTrack?.artist || 'Oneheart'}
            </p>
          </div>
          <button 
            onClick={() => currentTrack && toggleFavorite(currentTrack)}
            title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
            className={`p-1.5 rounded-xl transition ${
              isFavorited 
                ? 'text-rose-500 bg-rose-500/10' 
                : 'text-zinc-400 hover:text-rose-500 hover:bg-white/5'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Queue / Up Next Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
            <span className="uppercase tracking-wider">Up Next</span>
            <ListMusic className="w-3.5 h-3.5 text-zinc-500" />
          </div>

          <div className="space-y-2">
            {queue.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => playTrack(item)}
                className="group flex items-center justify-between gap-3 p-2 rounded-xl bg-[#22232a]/40 hover:bg-[#282933] cursor-pointer transition border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-200 group-hover:text-[#f0fc54] truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {item.artist}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                  2:02
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Direct 320kbps Download Banner at bottom of panel */}
      <div className="pt-4 border-t border-white/5">
        <button
          onClick={handleDownloadCurrent}
          className="w-full py-2.5 rounded-2xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          Download Playing Track (MP3)
        </button>
      </div>
    </div>
  );
}
