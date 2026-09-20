'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Is TuneGrab completely free to use?',
      a: 'Yes! TuneGrab is 100% free to use with no daily download limits, no subscription fees, and no mandatory login.',
    },
    {
      q: 'Which platforms are supported by TuneGrab?',
      a: 'TuneGrab supports 5 major platforms: Spotify, Apple Music, YouTube Music, SoundCloud, and JioSaavn. Just paste any link or search by song name.',
    },
    {
      q: 'What is the audio quality of downloaded songs?',
      a: 'All songs are converted and delivered in true 320kbps high-bitrate MP3 format with embedded album art and ID3 metadata (lossless FLAC available for VIP members).',
    },
    {
      q: 'Can I download an entire playlist or album at once?',
      a: 'Yes! TuneGrab allows you to download full playlists or albums. You can either download individual songs or click "Download All as ZIP" to bundle all MP3 files into a single organized archive.',
    },
    {
      q: 'Do I need to install any app or extension?',
      a: 'No. TuneGrab is a 100% browser-based online web app. It works smoothly on iOS (Safari/Chrome), Android, macOS, Windows, and Linux without installing any external software.',
    },
    {
      q: 'Is it safe to use TuneGrab?',
      a: 'Absolutely. TuneGrab does not require downloading any suspicious executables or plugins. Everything processes securely in your browser.',
    },
  ];

  // Schema.org structured FAQ data for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
      {/* JSON-LD for Search Engines */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1db954]/15 text-[#1db954] mb-4">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="h-1.5 w-16 bg-[#1db954] mx-auto rounded-full mb-4" />
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Got questions? Here are the most common answers about TuneGrab.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-black/5 dark:border-white/10 rounded-2xl bg-white dark:bg-[#181818] overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full px-6 py-5 text-left font-bold text-base sm:text-lg flex items-center justify-between gap-4 text-slate-900 dark:text-white hover:text-[#1db954] dark:hover:text-[#1db954] cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[#1db954]' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed border-t border-black/5 dark:border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
