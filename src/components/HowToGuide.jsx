'use client';

import React from 'react';
import { Copy, Link2, Download, Search, ArrowRight } from 'lucide-react';

export default function HowToGuide() {
  const steps = [
    {
      step: '01',
      title: 'Copy Spotify Link',
      desc: 'Open Spotify app or web player. Click the 3 dots (•••) on any song, playlist, or album, select "Share" and "Copy Link".',
      icon: Copy,
    },
    {
      step: '02',
      title: 'Paste Link in TuneGrab',
      desc: 'Paste the music URL in the search box above or type any artist or song name.',
      icon: Search,
    },
    {
      step: '03',
      title: 'Instant MP3 / ZIP Download',
      desc: 'TuneGrab instantly matches and converts the track with full ID3 tags & HD album art. Enjoy offline music anytime!',
      icon: Download,
    },
  ];

  return (
    <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">
          How to Download Spotify Music to MP3?
        </h2>
        <div className="h-1.5 w-16 bg-[#1db954] mx-auto rounded-full mb-4" />
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Save your favourite Spotify music in 3 easy steps on any mobile, tablet or computer.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative group bg-white dark:bg-[#181818] rounded-2xl p-8 border border-black/5 dark:border-white/10 hover:border-[#1db954]/40 shadow-lg hover:shadow-2xl hover:shadow-[#1db954]/10 transition-all duration-300 flex flex-col items-center text-center"
            >
              {/* Step number badge */}
              <div className="w-12 h-12 rounded-2xl bg-[#1db954]/15 text-[#1db954] font-black text-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-[#1db954] mb-2">
                Step {item.step}
              </span>

              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                {item.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
