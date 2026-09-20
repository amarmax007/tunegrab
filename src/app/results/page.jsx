'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StudioSidebar from '@/components/studio/StudioSidebar';
import StudioTopBar from '@/components/studio/StudioTopBar';
import StudioTrackList from '@/components/studio/StudioTrackList';
import NowPlayingPanel from '@/components/studio/NowPlayingPanel';
import BottomWaveformPlayer from '@/components/studio/BottomWaveformPlayer';
import PlaylistBatchDownload from '@/components/PlaylistBatchDownload';
import AudioPreviewModal from '@/components/AudioPreviewModal';
import AdSlot from '@/components/AdSlot';
import { 
  Loader2, 
  AlertCircle, 
  Music, 
  Search, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

function ResultsContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || searchParams.get('url') || '';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [previewTrack, setPreviewTrack] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    if (!queryParam.trim()) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const isUrl = /^https?:\/\//i.test(queryParam);
        const endpoint = isUrl
          ? `/api/spotify?url=${encodeURIComponent(queryParam)}`
          : `/api/spotify?q=${encodeURIComponent(queryParam)}`;

        const res = await fetch(endpoint);
        const result = await res.json();

        if (!res.ok || result.error) {
          throw new Error(result.error || 'Could not fetch music data.');
        }

        setData(result);
      } catch (err) {
        console.error('Fetch results error:', err);
        setError(err.message || 'Something went wrong. Please check your query or music link.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryParam]);

  const items = data?.items || [];
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.artist.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#111215] text-zinc-100 flex items-center justify-center p-0 sm:p-4 lg:p-8 font-sans studio-bg selection:bg-[#f0fc54] selection:text-black">
      {/* Studio Container Window */}
      <div suppressHydrationWarning className="w-full max-w-7xl min-h-[92vh] bg-[#1a1b22] rounded-none sm:rounded-[36px] border-0 sm:border border-white/10 shadow-2xl overflow-hidden flex flex-col relative pb-24">
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <StudioSidebar className="hidden md:flex" />

          {/* Center Main Dashboard */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#16171d] overflow-y-auto">
            {/* Top Bar */}
            <StudioTopBar 
              initialQuery={/^https?:\/\//i.test(queryParam) ? '' : queryParam} 
              breadcrumb={data?.meta?.title || 'Universal Music 2026'}
              onSearch={(q) => router.push(`/results?q=${encodeURIComponent(q)}`)} 
            />

            {/* Content Body */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
              {/* Back to Browse */}
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-[#f0fc54] transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Studio Browse
                </Link>
                {data && (
                  <span className="text-xs font-semibold text-zinc-400">
                    Found {items.length} track{items.length !== 1 ? 's' : ''} (320kbps Ready)
                  </span>
                )}
              </div>

              {/* Ad Banner */}
              <AdSlot type="banner" />

              {/* Loading State */}
              {loading && (
                <div className="py-24 text-center space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-[#f0fc54]/20 border-t-[#f0fc54] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-[#f0fc54]">
                      <Music className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    Resolving Audio Streams...
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Fetching high-resolution metadata, album art, and preparing high-speed 320kbps audio conversion.
                  </p>
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-8 text-center max-w-lg mx-auto my-12">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-rose-400 mb-2">Could Not Load Music</h3>
                  <p className="text-xs text-zinc-300 mb-6">{error}</p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold px-6 py-2.5 rounded-2xl text-xs transition shadow-lg"
                  >
                    Try Another Song or Link
                  </Link>
                </div>
              )}

              {/* Results Content */}
              {!loading && data && (
                <div className="space-y-6">
                  {/* If Playlist, Album, or Artist: Batch ZIP Drawer */}
                  {(data.type === 'playlist' || data.type === 'album' || data.type === 'artist') && (
                    <PlaylistBatchDownload
                      meta={data.meta}
                      items={data.items}
                      type={data.type}
                    />
                  )}

                  {/* Filter Search */}
                  {items.length > 3 && (
                    <div className="relative max-w-md">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Filter tracks by title or artist..."
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#24252f] border border-white/5 text-xs text-white placeholder-zinc-500 focus:border-[#f0fc54] outline-none transition"
                      />
                    </div>
                  )}

                  {/* Clean Formatted Heading */}
                  {(() => {
                    const isUrl = /^https?:\/\//i.test(queryParam);
                    const cleanHeading = data.meta?.title 
                      ? (data.type === 'playlist' || data.type === 'album' 
                          ? `${data.meta.title} (${data.type.toUpperCase()})` 
                          : `Download: ${data.meta.title} – ${data.meta.artist || ''}`)
                      : (isUrl ? 'Download Ready (320kbps MP3)' : `Search: "${queryParam}"`);

                    return (
                      <StudioTrackList
                        tracks={filteredItems}
                        title={cleanHeading}
                      />
                    );
                  })()}

                  {filteredItems.length === 0 && (
                    <p className="text-center text-xs text-zinc-500 py-12">
                      No songs match your filter &ldquo;{filterQuery}&rdquo;.
                    </p>
                  )}
                </div>
              )}
            </div>
          </main>

          {/* Right Now Playing Dock */}
          <NowPlayingPanel className="hidden xl:flex" />
        </div>

        {/* Bottom Waveform Player */}
        <BottomWaveformPlayer />
      </div>

      {/* Audio Preview Modal */}
      {previewTrack && (
        <AudioPreviewModal
          track={previewTrack}
          onClose={() => setPreviewTrack(null)}
        />
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#111215] text-[#f0fc54]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
