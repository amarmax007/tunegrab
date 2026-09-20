'use client';

import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Archive, 
  Infinity as InfinityIcon, 
  Smartphone, 
  Music2, 
  Headphones 
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      title: 'Studio Quality 320kbps MP3',
      desc: 'Download crystal clear, lossless studio audio quality up to 320kbps bitrate with all acoustic dynamics preserved.',
      icon: Sparkles,
    },
    {
      title: 'Full Playlist & Album ZIP Downloads',
      desc: 'Save entire Spotify playlists or full albums in a single click packed conveniently into an organized ZIP archive.',
      icon: Archive,
    },
    {
      title: '100% Free & Unlimited',
      desc: 'No subscription, no limits on number of songs, and no paywalls. Download as many Spotify songs as you desire.',
      icon: InfinityIcon,
    },
    {
      title: 'Safe, Secure & No Account Needed',
      desc: 'No Spotify login or account registration required. Zero tracking, zero ads malware, completely safe for all devices.',
      icon: ShieldCheck,
    },
    {
      title: 'Embedded ID3 Metadata & Album Art',
      desc: 'Every downloaded MP3 file automatically includes song title, artist, album name, year, and HD album cover artwork.',
      icon: Music2,
    },
    {
      title: 'Universal Device Compatibility',
      desc: 'Runs smoothly in all modern web browsers across iPhone, iPad, Android smartphones, Mac, Windows PC, and Linux.',
      icon: Smartphone,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#151515] border-y border-black/5 dark:border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">
            Why TuneGrab is the #1 Music Downloader
          </h2>
          <div className="h-1.5 w-16 bg-[#1db954] mx-auto rounded-full mb-4" />
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Packed with cutting-edge audio extraction algorithms for seamless offline music listening.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white dark:bg-[#1c1c1c] p-8 rounded-2xl border border-black/5 dark:border-white/10 hover:border-[#1db954]/40 shadow-sm hover:shadow-xl hover:shadow-[#1db954]/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1db954]/15 text-[#1db954] flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
