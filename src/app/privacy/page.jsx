'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Privacy & Data Protection
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Privacy Policy</h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Last updated: September 2026. Your privacy is paramount to us.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-emerald-400" />
              1. Information We Do NOT Collect
            </h2>
            <p>
              TuneGrab is built with a <strong>Zero-Logging Architecture</strong>. We do not require accounts, logins, credit card numbers, passwords, or personal identity verification for standard downloads. We do not maintain historical logs connecting IP addresses to specific songs downloaded.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              2. Cookies & Local Storage
            </h2>
            <p>
              We use standard browser <code className="text-zinc-200 bg-zinc-800 px-1 py-0.5 rounded">localStorage</code> solely to save your local UI preferences (such as Dark/Light theme mode, recent search history, and VIP License activation state). This data stays strictly inside your device and is never transmitted to external marketing brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Third-Party Advertising & Analytics</h2>
            <p>
              We may partner with trusted advertising networks (such as Google AdSense or privacy-compliant ad networks) to display relevant advertisements to free users. These partners may use cookies to serve ads based on prior visits. VIP users experience zero advertisements and zero tracking scripts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Security Measures</h2>
            <p>
              All traffic between your browser and TuneGrab is encrypted using modern 256-bit SSL/TLS encryption. We enforce Strict-Transport-Security, anti-SSRF protections, and secure HTTP response headers.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
