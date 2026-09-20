'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldAlert, CheckCircle2, Send, AlertTriangle } from 'lucide-react';

export default function DmcaPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', url: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">
            <ShieldAlert className="w-3.5 h-3.5" />
            DMCA & Copyright Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Digital Millennium Copyright Act (DMCA) Notice</h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            TuneGrab is a client-side search indexing and media backup utility. We respect the intellectual property rights of copyright holders worldwide and strictly comply with the Digital Millennium Copyright Act (17 U.S.C. § 512).
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Disclaimer & Non-Hosting Policy
          </h2>
          <p>
            TuneGrab does not host, store, broadcast, or retain any copyrighted audio or video files on its web servers. All media streamed or converted via this tool is pulled on-demand directly from publicly available sources on the internet for personal backup and educational purposes.
          </p>
          <p>
            If you are a copyright owner or an authorized agent thereof and believe that any content indexed through our service infringes upon your copyright, you may submit a formal notification pursuant to the DMCA.
          </p>
        </div>

        {/* DMCA Takedown Notice Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-6">
          <h2 className="text-lg font-bold text-white">Submit a Copyright Takedown Request</h2>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Notice Received Successfully</h3>
              <p className="text-xs text-zinc-300">
                Your DMCA takedown notice has been logged. Our legal compliance team typically processes verified requests within 24 to 48 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Your Name / Organization *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Universal Music Group Legal Rep"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-200 focus:border-red-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Official Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="legal@yourdomain.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-200 focus:border-red-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Infringing URL or Material Link *</label>
                <input
                  type="text"
                  required
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://open.spotify.com/track/... or artist page"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-200 focus:border-red-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Description of Copyright Infringement *</label>
                <textarea
                  rows="4"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Please specify copyright registration details, proof of ownership, and exact items to be delisted..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-200 focus:border-red-400 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Formal DMCA Notice
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
