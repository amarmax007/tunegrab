'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Download, 
  Loader2, 
  Check, 
  Plus, 
  Clock, 
  Sparkles,
  Music,
  AlertCircle
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useAuth } from '@/context/AuthContext';

export default function StudioTrackList({ tracks = [], title = 'Recently played', onSeeAll }) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { recordDownload } = useAuth();
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [completedIds, setCompletedIds] = useState(new Set());
  const [errorIds, setErrorIds] = useState(new Map());

  const formatDuration = (secs) => {
    if (!secs) return '3:30';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDownloadTrack = async (e, track) => {
    e.stopPropagation();
    const trackId = track.id || track.title;
    if (downloadingIds.has(trackId)) return;

    try {
      setDownloadingIds((prev) => new Set(prev).add(trackId));
      setErrorIds((prev) => {
        const next = new Map(prev);
        next.delete(trackId);
        return next;
      });

      // 1. Match audio
      const matchRes = await fetch('/api/get-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: track.title,
          artist: track.artist,
          duration: track.duration,
        }),
      });

      const matchData = await matchRes.json();
      if (!matchData.success || !matchData.videoId) {
        throw new Error(matchData.error || 'Could not match audio stream');
      }

      // 2. Convert to MP3
      const dlRes = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: matchData.videoId,
          title: `${track.title} - ${track.artist}`,
          candidateIds: matchData.candidateIds || [],
        }),
      });

      const dlData = await dlRes.json();
      const targetUrl = dlData.downloadUrl || dlData.url;
      if (!targetUrl) {
        throw new Error(dlData.error || 'Failed generating MP3 download');
      }

      // 3. Trigger Browser download
      const safeFilename = `${track.title} - ${track.artist}.mp3`.replace(/[/\\?%*:|"<>]/g, '');
      const a = document.createElement('a');
      a.href = `/api/download?url=${encodeURIComponent(targetUrl)}&name=${encodeURIComponent(safeFilename)}`;
      a.download = safeFilename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setCompletedIds((prev) => new Set(prev).add(trackId));
      if (recordDownload) {
        recordDownload(track);
      }
      setTimeout(() => {
        setCompletedIds((prev) => {
          const next = new Set(prev);
          next.delete(trackId);
          return next;
        });
      }, 5000);
    } catch (err) {
      console.error('Download track error:', err);
      setErrorIds((prev) => new Map(prev).set(trackId, err.message || 'Error downloading'));
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(trackId);
        return next;
      });
    }
  };

  const defaultTracks = [
    {
      id: 'dt-1',
      title: 'Mr. Right Now',
      artist: '21 Savage, Metro Boomin ft. Drake',
      duration: 193,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8d/18/2a/8d182a57-0a7a-efeb-6795-f830efba8d3b/26UMGIM65707.rgb.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/05/b5/00/05b500f8-b199-51b7-d898-3b1e9d9bf221/mzaf_1208100608739118268.plus.aac.p.m4a',
    },
    {
      id: 'dt-2',
      title: 'Snowfall',
      artist: 'Oneheart, reidenshi',
      duration: 122,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ac/98/63/ac9863eb-b027-332f-cfa2-90611eec1630/1963620796731_cover.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1e/35/a4/1e35a4e6-7400-1a60-d08b-33a9d68b8053/mzaf_4981520475692412372.plus.aac.p.m4a',
    },
    {
      id: 'dt-3',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      duration: 200,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/12/73/ca/1273ca46-233a-5331-189b-25ac1d656533/mzaf_976341070785891411.plus.aac.p.m4a',
    },
    {
      id: 'dt-4',
      title: 'Starboy',
      artist: 'The Weeknd ft. Daft Punk',
      duration: 230,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/71/d6/1171d6ad-3c96-e027-2af6-58028426588c/mzaf_15137631797407745471.plus.aac.p.m4a',
    },
    {
      id: 'dt-5',
      title: 'Kesariya (Brahmastra)',
      artist: 'Arijit Singh, Pritam',
      duration: 268,
      thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/600x600bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a',
    },
  ];

  const displayTracks = tracks.length > 0 ? tracks : defaultTracks;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          {title}
          <span className="text-[11px] font-semibold text-[#f0fc54] px-2 py-0.5 rounded-full bg-[#f0fc54]/10 border border-[#f0fc54]/20">
            320kbps MP3
          </span>
        </h3>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            See all
          </button>
        )}
      </div>

      {/* Track List Rows */}
      <div className="space-y-2">
        {displayTracks.map((track, idx) => {
          const trackId = track.id || track.title || idx;
          const isCurrent = currentTrack?.id === trackId || currentTrack?.title === track.title;
          const isDownloading = downloadingIds.has(trackId);
          const isDownloaded = completedIds.has(trackId);
          const hasError = errorIds.get(trackId);

          return (
            <div
              key={trackId}
              onClick={() => playTrack(track)}
              className={`group flex items-center justify-between gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                isCurrent
                  ? 'bg-[#24252f] border-[#f0fc54]/40 shadow-lg'
                  : 'bg-[#1b1c23]/60 border-white/5 hover:bg-[#22232b] hover:border-white/10'
              }`}
            >
              {/* Left: Thumbnail & Title */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black/40 shrink-0">
                  {track.thumbnail ? (
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <Music className="w-5 h-5" />
                    </div>
                  )}
                  {/* Play Overlay */}
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                    isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <Play className="w-4 h-4 fill-[#f0fc54] text-[#f0fc54] ml-0.5" />
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className={`text-xs sm:text-sm font-bold truncate ${
                    isCurrent ? 'text-[#f0fc54]' : 'text-white'
                  }`}>
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {track.artist}
                  </p>
                </div>
              </div>

              {/* Right: Duration & Download Action Button */}
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs font-mono text-zinc-400 hidden sm:inline-block">
                  {formatDuration(track.duration)}
                </span>

                {/* 1-Click Download Button */}
                <button
                  onClick={(e) => handleDownloadTrack(e, track)}
                  disabled={isDownloading}
                  title="Download 320kbps MP3"
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-90 ${
                    isDownloaded
                      ? 'bg-emerald-500 text-white'
                      : isDownloading
                      ? 'bg-zinc-700 text-white'
                      : 'bg-[#282935] hover:bg-[#f0fc54] hover:text-black text-zinc-300 shadow-sm border border-white/5'
                  }`}
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : isDownloaded ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
