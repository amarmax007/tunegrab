'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Play, 
  Loader2, 
  Check, 
  Music, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function TrackCard({ track, onPreview }) {
  const { recordDownload } = useAuth();
  // Statuses: 'idle' | 'matching' | 'converting' | 'downloading' | 'completed' | 'error'
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const formatDuration = (secs) => {
    if (!secs) return '3:30';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDownload = async () => {
    try {
      setStatus('matching');
      setErrorMessage('');

      // Step 1: Match Spotify Song with YouTube Audio ID
      const matchRes = await fetch('/api/get-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: track.title,
          artist: track.artist,
          duration: track.duration
        })
      });

      const matchData = await matchRes.json();
      if (!matchData.success || !matchData.videoId) {
        throw new Error(matchData.error || 'Could not match audio stream');
      }

      // Step 2: Convert to 320kbps MP3
      setStatus('converting');
      const dlRes = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: matchData.videoId,
          title: `${track.title} - ${track.artist}`,
          candidateIds: matchData.candidateIds || []
        })
      });

      const dlData = await dlRes.json();
      if (!dlData.downloadUrl && !dlData.url) {
        throw new Error(dlData.error || 'Failed to generate MP3 download');
      }

      // Step 3: Trigger Browser File Download
      setStatus('downloading');
      const targetUrl = dlData.downloadUrl || dlData.url;
      const safeFilename = `${track.title} - ${track.artist}.mp3`.replace(/[/\\?%*:|"<>]/g, '');

      // Trigger via anchor tag
      const a = document.createElement('a');
      a.href = `/api/download?url=${encodeURIComponent(targetUrl)}&name=${encodeURIComponent(safeFilename)}`;
      a.download = safeFilename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setStatus('completed');
      if (recordDownload) {
        recordDownload(track);
      }
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Download error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Download failed');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-[#1e1e1e] border border-black/5 dark:border-white/10 hover:border-[#1db954]/50 dark:hover:border-[#1db954]/50 rounded-2xl p-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#1db954]/10 flex flex-col sm:flex-row items-center gap-4">
      {/* Thumbnail + Play Preview button */}
      <div className="relative w-full sm:w-24 h-28 sm:h-24 rounded-xl overflow-hidden bg-black/20 shrink-0 group/img">
        {track.thumbnail ? (
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Music className="w-8 h-8" />
          </div>
        )}

        {/* Hover preview play overlay */}
        <button
          onClick={() => onPreview && onPreview(track)}
          title="Preview song"
          className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white"
        >
          <div className="w-10 h-10 rounded-full bg-[#1db954] text-black flex items-center justify-center shadow-lg transform group-hover/img:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </div>
        </button>
      </div>

      {/* Song Details */}
      <div className="flex-1 min-w-0 w-full text-center sm:text-left">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white truncate" title={track.title}>
          {track.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 truncate mb-2" title={track.artist}>
          {track.artist}
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" /> {formatDuration(track.duration)}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-400" />
          <span className="text-[#1db954] font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> 320 kbps MP3
          </span>
          {track.album && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-400" />
              <span className="truncate max-w-[150px]">{track.album}</span>
            </>
          )}
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errorMessage}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-center">
        {/* Preview Button (Mobile/Direct) */}
        {track.previewUrl && (
          <button
            onClick={() => onPreview && onPreview(track)}
            className="p-3 rounded-xl border border-black/10 dark:border-white/10 hover:border-[#1db954] text-slate-700 dark:text-slate-300 hover:text-[#1db954] transition-all cursor-pointer"
            title="Listen to preview"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
        )}

        {/* Download MP3 Button */}
        <button
          onClick={handleDownload}
          disabled={status !== 'idle' && status !== 'error'}
          className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 ${
            status === 'completed'
              ? 'bg-emerald-500 text-white'
              : status === 'error'
              ? 'bg-rose-500 text-white'
              : status !== 'idle'
              ? 'bg-slate-700 text-white cursor-wait'
              : 'bg-[#1db954] hover:bg-[#1ed760] text-black shadow-[#1db954]/20'
          }`}
        >
          {status === 'matching' && (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Matching...</span>
            </>
          )}
          {status === 'converting' && (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Converting...</span>
            </>
          )}
          {status === 'downloading' && (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Starting...</span>
            </>
          )}
          {status === 'completed' && (
            <>
              <Check className="w-4 h-4" />
              <span>Downloaded</span>
            </>
          )}
          {status === 'error' && (
            <>
              <AlertCircle className="w-4 h-4" />
              <span>Retry</span>
            </>
          )}
          {status === 'idle' && (
            <>
              <Download className="w-4 h-4" />
              <span>Download MP3</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
