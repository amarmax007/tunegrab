'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Sparkles } from 'lucide-react';

const ARTIST_GRADIENTS = [
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-blue-500 to-indigo-600',
  'from-cyan-500 to-sky-600',
  'from-red-500 to-rose-600',
];

export default function PopularArtistsCarousel({ onSelectArtist }) {
  const router = useRouter();

  const artists = [
    { id: 'arijit-singh', name: 'Arijit Singh', query: 'Arijit Singh' },
    { id: 'the-weeknd', name: 'The Weeknd', query: 'The Weeknd' },
    { id: 'drake', name: 'Drake', query: 'Drake' },
    { id: 'billie-eilish', name: 'Billie Eilish', query: 'Billie Eilish' },
    { id: 'ap-dhillon', name: 'AP Dhillon', query: 'AP Dhillon' },
    { id: 'dua-lipa', name: 'Dua Lipa', query: 'Dua Lipa' },
    { id: 'travis-scott', name: 'Travis Scott', query: 'Travis Scott' },
  ];

  const handleArtistClick = (artist) => {
    if (onSelectArtist) {
      onSelectArtist(artist.query);
    } else {
      router.push(`/results?q=${encodeURIComponent(artist.query)}`);
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          Popular artists
          <Sparkles className="w-3.5 h-3.5 text-[#f0fc54]" />
        </h3>
        <button
          onClick={() => router.push('/results?q=Top%20Artists%202026')}
          className="text-xs font-semibold text-zinc-400 hover:text-white transition flex items-center gap-0.5"
        >
          See all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Artists Horizontal Scroll / Row */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4 overflow-x-auto pb-2">
        {artists.map((artist, idx) => {
          const initials = artist.name.split(' ').map(w => w[0]).join('').slice(0, 2);
          const gradient = ARTIST_GRADIENTS[idx % ARTIST_GRADIENTS.length];

          return (
            <div
              key={artist.id}
              onClick={() => handleArtistClick(artist)}
              className="group flex flex-col items-center text-center cursor-pointer transition p-2 rounded-2xl hover:bg-white/5"
            >
              <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 border-2 border-transparent group-hover:border-[#f0fc54] transition-all shadow-md group-hover:shadow-lg group-hover:shadow-[#f0fc54]/20 group-hover:scale-105 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <span className="text-white font-black text-lg sm:text-xl drop-shadow-md select-none">
                  {initials}
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-300 group-hover:text-white truncate max-w-[85px]">
                {artist.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

