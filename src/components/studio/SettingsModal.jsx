'use client';

import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Sliders, 
  Music, 
  HardDrive, 
  Sparkles, 
  Check, 
  Trash2, 
  ShieldCheck, 
  Volume2,
  FileAudio
} from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [bitrate, setBitrate] = useState('320');
  const [filenamePattern, setFilenamePattern] = useState('title-artist');
  const [embedTags, setEmbedTags] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [clearedMsg, setClearedMsg] = useState(false);

  if (!isOpen) return null;

  const handleClearCache = () => {
    try {
      localStorage.removeItem('recently_played_tracks');
      setClearedMsg(true);
      setTimeout(() => setClearedMsg(false), 2000);
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#1a1b22] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-[#20212b] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#2e303d] text-[#f0fc54]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Studio Settings & Preferences</h3>
              <p className="text-[11px] text-zinc-400">Customize audio quality, format and downloader behavior</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300">
          {/* Setting 1: Audio Bitrate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-white flex items-center gap-1.5">
                <FileAudio className="w-4 h-4 text-[#f0fc54]" />
                Audio Bitrate & Quality
              </label>
              <span className="text-[10px] font-bold text-[#f0fc54] uppercase">Recommended: 320kbps</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: '128', label: '128 kbps', desc: 'Standard' },
                { id: '320', label: '320 kbps', desc: 'HQ Studio' },
                { id: 'flac', label: 'FLAC', desc: 'Lossless (VIP)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setBitrate(opt.id)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    bitrate === opt.id
                      ? 'border-[#f0fc54] bg-[#f0fc54]/10 text-white'
                      : 'border-white/5 bg-[#24252f] text-zinc-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{opt.label}</span>
                    {bitrate === opt.id && <Check className="w-3.5 h-3.5 text-[#f0fc54]" />}
                  </div>
                  <span className="text-[10px] text-zinc-400">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Setting 2: Filename Format */}
          <div className="space-y-2">
            <label className="font-bold text-white flex items-center gap-1.5">
              <Music className="w-4 h-4 text-[#f0fc54]" />
              Downloaded Filename Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFilenamePattern('title-artist')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition ${
                  filenamePattern === 'title-artist'
                    ? 'border-[#f0fc54] bg-[#f0fc54]/10 text-white'
                    : 'border-white/5 bg-[#24252f] text-zinc-400'
                }`}
              >
                Song Name - Artist.mp3
              </button>
              <button
                onClick={() => setFilenamePattern('artist-title')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition ${
                  filenamePattern === 'artist-title'
                    ? 'border-[#f0fc54] bg-[#f0fc54]/10 text-white'
                    : 'border-white/5 bg-[#24252f] text-zinc-400'
                }`}
              >
                Artist - Song Name.mp3
              </button>
            </div>
          </div>

          {/* Setting 3: Toggles */}
          <div className="space-y-2">
            <label className="font-bold text-white">Metadata & Player Behavior</label>
            <div className="space-y-2 rounded-2xl bg-[#24252f] border border-white/5 p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white text-xs">Embed ID3 Tags & HD Album Artwork</p>
                  <p className="text-[10px] text-zinc-400">Includes title, artist, album, and high-res cover art in MP3</p>
                </div>
                <input
                  type="checkbox"
                  checked={embedTags}
                  onChange={(e) => setEmbedTags(e.target.checked)}
                  className="w-4 h-4 accent-[#f0fc54] rounded cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white text-xs">Autoplay Preview on Track Selection</p>
                  <p className="text-[10px] text-zinc-400">Starts waveform preview when clicking any song</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="w-4 h-4 accent-[#f0fc54] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Setting 4: Clear Cache */}
          <div className="p-3.5 rounded-2xl bg-[#24252f] border border-white/5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white text-xs">Clear Local Stream Cache</p>
              <p className="text-[10px] text-zinc-400">Resets recently played history in your browser</p>
            </div>
            <button
              onClick={handleClearCache}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
              {clearedMsg ? 'Cleared!' : 'Clear Cache'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#14151a] border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
          <span>TuneGrab Studio Engine v2.5</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#f0fc54] text-black font-extrabold text-xs"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
