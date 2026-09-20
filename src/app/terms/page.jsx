'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <FileText className="w-3.5 h-3.5" />
            Terms of Service
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Terms of Use & Fair Policy</h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Please read these terms carefully before utilizing our music indexing & conversion service.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using TuneGrab, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you may not use our service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. Permitted Use & Personal Backup</h2>
            <p>
              This utility is provided strictly for personal, non-commercial backup, and fair-use archiving of audio tracks you have the legal right or license to listen to. You agree not to redistribute, resell, or publicly broadcast any downloaded media for commercial profit.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Fair Usage & Anti-Abuse Rules</h2>
            <p>
              Automated crawling, bot spamming, script-based scraping, or overloading our servers via high-frequency requests is strictly prohibited and subject to automated IP banning and rate limiting.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. VIP License Keys & Refunds</h2>
            <p>
              VIP License keys are granted for personal access to premium features (ad removal, turbo batch ZIP). Since digital keys provide immediate full-feature access upon redemption, key activation is considered final.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
