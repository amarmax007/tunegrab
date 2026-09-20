'use client';

import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Download, 
  HardDrive, 
  Sparkles, 
  User, 
  Mail, 
  Calendar, 
  LogOut,
  Play,
  Heart,
  History,
  Copy,
  CheckCircle2,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useVip } from '@/context/VipContext';
import { usePlayer } from '@/context/PlayerContext';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { isVip, vipKey, openVipModal } = useVip();
  const { playTrack } = usePlayer();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'history' | 'favorites'
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleReDownload = async (track) => {
    try {
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
      if (!matchData.videoId) return;

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
      if (!targetUrl) return;

      const safeFilename = `${track.title} - ${track.artist}.mp3`.replace(/[/\\?%*:|"<>]/g, '');
      const a = document.createElement('a');
      a.href = `/api/download?url=${encodeURIComponent(targetUrl)}&name=${encodeURIComponent(safeFilename)}`;
      a.download = safeFilename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.warn('Re-download error:', e);
    }
  };

  const downloads = user?.downloads || [];
  const favorites = user?.favorites || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#1a1b22] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-[#be5c2b] via-[#8f3e17] to-[#252630] border-b border-white/5 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-black/40">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isVip && (
                <div className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-amber-400 text-black shadow-md">
                  <Crown className="w-3.5 h-3.5 fill-black" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {isAuthenticated ? user.name : 'Guest User'}
                </h3>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  isVip 
                    ? 'bg-amber-400 text-black shadow-sm' 
                    : 'bg-black/30 text-zinc-300 border border-white/10'
                }`}>
                  {isVip ? 'VIP Turbo' : isAuthenticated ? 'Free Member' : 'Not Logged In'}
                </span>
              </div>

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono bg-black/40 text-[#f0fc54] px-2 py-0.5 rounded-md font-bold">
                      User ID: {user.userId}
                    </span>
                    <button
                      onClick={() => handleCopy(user.userId, 'id')}
                      className="text-[10px] text-zinc-300 hover:text-white underline"
                    >
                      {copiedId ? 'Copied!' : 'Copy ID'}
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-300 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-zinc-400" /> {user.email}
                  </p>
                </>
              ) : (
                <p className="text-xs text-zinc-300 mt-1">
                  Sign in or create a free account to sync your library across any computer!
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-300 hover:text-white rounded-full hover:bg-black/30 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Not Logged In -> Prompt Auth Box */}
        {!isAuthenticated ? (
          <div className="p-8 text-center space-y-6">
            <div className="max-w-md mx-auto space-y-2">
              <h4 className="text-base font-bold text-white">Save & Sync Across Any Device</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Create a free account or log in with your unique <strong>User ID</strong> to access your download history, favorites, and VIP license anytime from any system.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs mx-auto">
              <button
                onClick={() => {
                  onClose();
                  openAuthModal('login');
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#282935] hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={() => {
                  onClose();
                  openAuthModal('register');
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-lg"
              >
                <UserPlus className="w-4 h-4" />
                Register Free
              </button>
            </div>
          </div>
        ) : (
          /* LOGGED IN USER INTERFACE */
          <>
            {/* Tab Switcher */}
            <div className="flex border-b border-white/5 bg-[#16171d] p-1.5 gap-1.5">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'overview'
                    ? 'bg-[#f0fc54] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Overview & VIP
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-[#f0fc54] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Downloads ({downloads.length})
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'favorites'
                    ? 'bg-[#f0fc54] text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                Favorites ({favorites.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-300">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#24252f] border border-white/5 text-center">
                      <Download className="w-4 h-4 text-[#f0fc54] mx-auto mb-1" />
                      <p className="text-base font-black text-white">{downloads.length || 12}</p>
                      <p className="text-[10px] text-zinc-400 uppercase font-medium">Tracks Saved</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#24252f] border border-white/5 text-center">
                      <Heart className="w-4 h-4 text-[#f0fc54] mx-auto mb-1" />
                      <p className="text-base font-black text-white">{favorites.length || 4}</p>
                      <p className="text-[10px] text-zinc-400 uppercase font-medium">Favorites</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#24252f] border border-white/5 text-center">
                      <Sparkles className="w-4 h-4 text-[#f0fc54] mx-auto mb-1" />
                      <p className="text-base font-black text-white">320k</p>
                      <p className="text-[10px] text-zinc-400 uppercase font-medium">Audio Bitrate</p>
                    </div>
                  </div>

                  {/* VIP License Card */}
                  <div className="p-4 rounded-2xl bg-[#24252f] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white text-xs">VIP Turbo Membership</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isVip ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {isVip ? 'ACTIVE VIP' : 'FREE PLAN'}
                      </span>
                    </div>

                    {isVip ? (
                      <div className="space-y-2">
                        <p className="text-[11px] text-zinc-400">
                          Your active license key is tied to your account across all systems.
                        </p>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1a1b22] border border-white/5">
                          <span className="font-mono text-amber-300 text-xs font-semibold">{vipKey || 'VIP-ACTIVE'}</span>
                          <button
                            onClick={() => handleCopy(vipKey || 'VIP-ACTIVE', 'key')}
                            className="text-[11px] font-semibold text-[#f0fc54] hover:underline"
                          >
                            {copiedKey ? 'Copied!' : 'Copy Key'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-zinc-400 max-w-[260px]">
                          Get 100% ad-free experience, 3x turbo batch ZIP, and FLAC audio.
                        </p>
                        <button
                          onClick={() => {
                            onClose();
                            openVipModal();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#f0fc54] hover:bg-[#e4ef4a] text-black font-extrabold text-[11px] transition shadow"
                        >
                          Upgrade (₹99)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: DOWNLOAD HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {downloads.length === 0 ? (
                    <div className="py-12 text-center text-zinc-500 space-y-2">
                      <Download className="w-8 h-8 mx-auto text-zinc-600" />
                      <p>No downloads recorded yet. Paste any song URL to start downloading!</p>
                    </div>
                  ) : (
                    downloads.map((track, i) => (
                      <div
                        key={track.id || i}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#24252f] border border-white/5 hover:border-white/10 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-black/40 shrink-0">
                            {track.thumbnail && <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{track.title}</p>
                            <p className="text-[10px] text-zinc-400 truncate">{track.artist}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleReDownload(track)}
                          title="Re-download MP3"
                          className="p-2 rounded-xl bg-[#1a1b22] hover:bg-[#f0fc54] hover:text-black text-zinc-300 transition shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: FAVORITES */}
              {activeTab === 'favorites' && (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {favorites.length === 0 ? (
                    <div className="py-12 text-center text-zinc-500 space-y-2">
                      <Heart className="w-8 h-8 mx-auto text-zinc-600" />
                      <p>No favorite tracks added yet. Click the heart icon on any song to save it!</p>
                    </div>
                  ) : (
                    favorites.map((track, i) => (
                      <div
                        key={track.id || i}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#24252f] border border-white/5 hover:border-white/10 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-black/40 shrink-0">
                            {track.thumbnail && <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{track.title}</p>
                            <p className="text-[10px] text-zinc-400 truncate">{track.artist}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => playTrack(track)}
                            title="Play Song"
                            className="p-2 rounded-xl bg-[#1a1b22] hover:bg-[#f0fc54] hover:text-black text-zinc-300 transition"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <button
                            onClick={() => handleReDownload(track)}
                            title="Download MP3"
                            className="p-2 rounded-xl bg-[#1a1b22] hover:bg-[#f0fc54] hover:text-black text-zinc-300 transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Footer with Logout */}
            <div className="p-4 bg-[#14151a] border-t border-white/5 flex items-center justify-between text-[11px]">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="text-red-400 hover:text-red-300 flex items-center gap-1.5 font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out from this Device
              </button>
              <button onClick={onClose} className="text-zinc-400 hover:text-white">
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
