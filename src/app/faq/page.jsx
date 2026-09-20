'use client';

import React from 'react';
import StudioLayout from '@/components/studio/StudioLayout';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';

export default function FaqPage() {
  return (
    <StudioLayout breadcrumb="Frequently Asked Questions">
      <div className="space-y-6">
        <div className="p-6 rounded-3xl bg-[#24252f] border border-white/5 space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Frequently Asked Questions & Help Center
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Find quick answers about audio quality, 5-in-1 platform support, VIP membership, and batch ZIP downloading on TuneGrab.
          </p>
        </div>

        <AdSlot type="banner" />

        <div className="rounded-3xl bg-[#1b1c23]/60 border border-white/5 p-4 sm:p-6">
          <FAQSection />
        </div>
      </div>
    </StudioLayout>
  );
}
