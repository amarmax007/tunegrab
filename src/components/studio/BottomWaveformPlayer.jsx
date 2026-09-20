'use client';

import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  ListMusic, 
  Volume2, 
  Download, 
  Music, 
  Sparkles 
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

export default function BottomWaveformPlayer() {
  const { currentTrack, isPlaying, togglePlay, currentTime, duration, volume, changeVolume } = usePlayer();

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDownload = async () => {
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
    } catch (e) {
      console.warn('Download player error:', e);
    }
  };

  // 36 bars for realistic waveform visualizer
  const waveBars = [
    12, 18, 26, 14, 30, 22, 16, 28, 34, 20, 15, 29, 36, 24, 18, 30, 25, 14,
    20, 28, 32, 16, 24, 30, 18, 12, 22, 26, 15, 20, 28, 18, 12, 16, 20, 14,
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="bg-[#24252e]/95 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3 shadow-2xl flex items-center justify-between gap-4 text-white">
        {/* Left: Thumbnail & Info */}
        <div className="flex items-center gap-3 min-w-0 max-w-[200px] sm:max-w-[240px]">
          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/10 shadow-md">
            {currentTrack?.thumbnail ? (
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                <Music className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate" title={currentTrack?.title}>
              {currentTrack?.title || 'Snowfall'}
            </h4>
            <p className="text-[10px] text-zinc-400 truncate">
              {currentTrack?.artist || 'Oneheart'}
            </p>
          </div>
        </div>

        {/* Center-Left: Play Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="text-zinc-400 hover:text-white transition p-1.5">
            <SkipBack className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-[#f0fc54] text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>
          <button className="text-zinc-400 hover:text-white transition p-1.5">
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Center: Glowing Waveform Visualizer (Exact match from reference) */}
        <div className="hidden md:flex items-center gap-1 flex-1 max-w-sm px-3">
          {waveBars.map((height, i) => {
            const isPlayed = i < Math.floor((currentTime / (duration || 200)) * waveBars.length);
            return (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isPlayed || (isPlaying && i % 2 === 0)
                    ? 'bg-[#f0fc54] shadow-sm shadow-[#f0fc54]/50'
                    : 'bg-zinc-600'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(6, Math.min(32, height + Math.sin(i) * 6))}px` : `${Math.max(6, height * 0.5)}px`,
                }}
              />
            );
          })}
        </div>

        {/* Time Stamp */}
        <span className="text-xs font-mono text-zinc-400 hidden sm:inline-block shrink-0">
          {formatTime(currentTime || 192)}
        </span>

        {/* Right Actions: Shuffle, Volume & 1-Click Download */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="text-zinc-400 hover:text-white transition hidden lg:block">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="text-zinc-400 hover:text-white transition hidden lg:block">
            <ListMusic className="w-4 h-4" />
          </button>
          <button className="text-zinc-400 hover:text-white transition hidden sm:block">
            <Volume2 className="w-4 h-4" />
          </button>

          {/* 1-Click MP3 Download Button in Player */}
          <button
            onClick={handleDownload}
            title="Download MP3 (320kbps)"
            className="px-3 py-1.5 rounded-full bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MP3</span>
          </button>
        </div>
      </div>
    </div>
  );
}
