'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  Archive, 
  Loader2, 
  Check, 
  Layers, 
  Disc, 
  Sparkles,
  AlertCircle,
  Crown,
  Zap
} from 'lucide-react';
import { useVip } from '@/context/VipContext';

export default function PlaylistBatchDownload({ meta, items = [], type = 'playlist' }) {
  const { isVip, openVipModal } = useVip();
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: items.length, text: '' });
  const [zipSuccess, setZipSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDownloadAllZip = async () => {
    if (!items || items.length === 0) return;

    try {
      setDownloading(true);
      setZipSuccess(false);
      setErrorMsg('');
      const zip = new JSZip();
      const folderName = (meta?.title || 'Universal_Music').replace(/[/\\?%*:|"<>]/g, '');
      const folder = zip.folder(folderName) || zip;

      // VIP users get parallel turbo processing (chunks of 3 concurrently)
      const concurrency = isVip ? 3 : 1;
      let completedCount = 0;

      for (let i = 0; i < items.length; i += concurrency) {
        const chunk = items.slice(i, i + concurrency);

        await Promise.all(
          chunk.map(async (item, chunkIdx) => {
            const actualIndex = i + chunkIdx;
            setProgress({
              current: completedCount + 1,
              total: items.length,
              text: `[${completedCount + 1}/${items.length}] ${isVip ? '⚡ Turbo Converting' : 'Converting'} "${item.title}"...`,
            });

            try {
              // 1. Match audio
              const matchRes = await fetch('/api/get-id', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: item.title,
                  artist: item.artist,
                  duration: item.duration,
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
                  title: `${item.title} - ${item.artist}`,
                  candidateIds: matchData.candidateIds || [],
                }),
              });
              const dlData = await dlRes.json();
              const targetUrl = dlData.downloadUrl || dlData.url;
              if (!targetUrl) return;

              // 3. Fetch MP3 stream buffer via backend
              const bufferRes = await fetch('/api/download-zip', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  ...(isVip ? { 'X-VIP-Token': 'VIP-ACTIVE' } : {})
                },
                body: JSON.stringify({ url: targetUrl }),
              });

              if (bufferRes.ok) {
                const arrayBuffer = await bufferRes.arrayBuffer();
                const trackIndex = (actualIndex + 1).toString().padStart(2, '0');
                const cleanTitle = `${trackIndex}. ${item.title} - ${item.artist}.mp3`.replace(/[/\\?%*:|"<>]/g, '');
                folder.file(cleanTitle, arrayBuffer);
              }
            } catch (songErr) {
              console.warn(`Could not include song ${item.title}:`, songErr);
            } finally {
              completedCount++;
              setProgress({
                current: completedCount,
                total: items.length,
                text: `[${completedCount}/${items.length}] Processing batch bundle...`,
              });
            }
          })
        );
      }

      setProgress({
        current: items.length,
        total: items.length,
        text: 'Compressing and generating high-speed ZIP file...',
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(zipBlob);
      downloadLink.download = `${folderName}.zip`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 6000);
    } catch (err) {
      console.error('Batch zip download error:', err);
      setErrorMsg(err.message || 'Failed generating ZIP archive');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#181818] to-[#222222] border border-white/10 rounded-3xl p-6 mb-8 text-white shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-[#1db954]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Playlist / Album Banner & Meta */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/10 shadow-2xl">
            {meta?.thumbnail ? (
              <img src={meta.thumbnail} alt={meta.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#1db954]">
                {type === 'album' ? <Disc className="w-10 h-10" /> : <Layers className="w-10 h-10" />}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1db954] bg-[#1db954]/10 px-3 py-0.5 rounded-full inline-block">
                {type.toUpperCase()} COLLECTION
              </span>
              {isVip && (
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-amber-400" />
                  Turbo 3x Mode
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white truncate" title={meta?.title}>
              {meta?.title || 'Collection'}
            </h2>
            <p className="text-sm text-slate-400 truncate">
              {meta?.artist || meta?.owner || 'Music Collection'} • <span className="text-slate-300 font-semibold">{items.length} Tracks</span>
            </p>
          </div>
        </div>

        {/* Batch Action Button */}
        <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-2">
          <button
            onClick={handleDownloadAllZip}
            disabled={downloading || items.length === 0}
            className={`w-full md:w-auto px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
              zipSuccess
                ? 'bg-emerald-500 text-white'
                : downloading
                ? 'bg-slate-700 text-white cursor-wait'
                : 'bg-[#1db954] hover:bg-[#1ed760] text-black shadow-[#1db954]/25 hover:scale-105 active:scale-95'
            }`}
          >
            {downloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Downloading ZIP...</span>
              </>
            ) : zipSuccess ? (
              <>
                <Check className="w-5 h-5" />
                <span>ZIP Download Complete!</span>
              </>
            ) : (
              <>
                <Archive className="w-5 h-5" />
                <span>Download All as ZIP (320kbps)</span>
              </>
            )}
          </button>

          {!isVip ? (
            <button
              onClick={openVipModal}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Crown className="w-3 h-3" /> Upgrade to VIP for 3x Turbo Parallel ZIP
            </button>
          ) : (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3" /> VIP Turbo Active — Max Download Speed
            </span>
          )}
        </div>
      </div>

      {/* Live Download Progress Indicator */}
      {downloading && (
        <div className="mt-6 pt-4 border-t border-white/10 space-y-2 animate-fadeIn">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span className="truncate max-w-md">{progress.text}</span>
            <span className="font-mono">{Math.round((progress.current / progress.total) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#1db954] h-full transition-all duration-300 rounded-full shadow-md shadow-[#1db954]"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
