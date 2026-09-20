'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, X, Music, Disc } from 'lucide-react';

export default function AudioPreviewModal({ track, onClose }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    if (audioRef.current && track?.previewUrl) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [track]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 30);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!track) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#181818] text-white border border-white/10 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Track Cover Art */}
        <div className="relative w-44 h-44 mx-auto mb-5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 group">
          {track.thumbnail ? (
            <img
              src={track.thumbnail}
              alt={track.title}
              className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : ''}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#282828] text-slate-500">
              <Disc className="w-16 h-16 animate-spin" />
            </div>
          )}

          {/* Playing animation overlay */}
          {isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-1.5">
              <span className="w-1.5 bg-[#1db954] rounded-full wave-bar-1" />
              <span className="w-1.5 bg-[#1db954] rounded-full wave-bar-2" />
              <span className="w-1.5 bg-[#1db954] rounded-full wave-bar-3" />
              <span className="w-1.5 bg-[#1db954] rounded-full wave-bar-4" />
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="text-center mb-5">
          <h4 className="font-bold text-lg text-white truncate">{track.title}</h4>
          <p className="text-sm text-slate-400 truncate">{track.artist}</p>
          <span className="inline-block mt-1 text-[11px] font-semibold text-[#1db954] bg-[#1db954]/10 px-2.5 py-0.5 rounded-full">
            Spotify 30s Preview
          </span>
        </div>

        {/* Audio Element */}
        {track.previewUrl ? (
          <audio
            ref={audioRef}
            src={track.previewUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            autoPlay
          />
        ) : (
          <p className="text-xs text-center text-amber-400 mb-4">
            Direct Spotify audio preview unavailable. You can proceed with full MP3 download.
          </p>
        )}

        {/* Progress bar */}
        <div className="space-y-1 mb-5">
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#1db954] h-full transition-all duration-200"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={togglePlay}
            disabled={!track.previewUrl}
            className="w-12 h-12 rounded-full bg-[#1db954] hover:bg-[#1ed760] disabled:opacity-40 text-black flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-[#1db954]/30 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
