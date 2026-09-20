# 🎵 TuneGrab — 5-in-1 Universal Music Hub & Downloader

**TuneGrab** is a music studio platform and downloader supporting **Spotify, Apple Music, YouTube, YouTube Music, and SoundCloud**. Convert and download high-bitrate 320kbps MP3 tracks, albums, and entire playlists with ZIP batch export.

---

## ⚡ Live Features

- 🎧 **Multi-Platform Support**: Spotify, Apple Music, YouTube, YouTube Music, SoundCloud.
- 🚀 **100% Real Live Resolver**: Real-time metadata scraping, track discovery, and direct audio stream resolution.
- 📦 **Batch ZIP Playlist Download**: Download entire albums and playlists in a single compressed ZIP file.
- 🎛️ **Studio Audio Previewer**: Waveform player with live scrubbing, time controls, and direct downloads.
- 👤 **Real Authentication & History**: OTP login, password auth, favorite tracks, and user download history.
- 🔒 **Enterprise Security**: SSRF domain whitelist protection, in-memory rate limiting, and CORS security headers.

---

## 🚀 100% Free 1-Click Deployment Guide

You can deploy TuneGrab to the web for **100% FREE** with zero server costs using **Vercel** (the creators of Next.js).

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "TuneGrab v1.0 Production Launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tunegrab.git
git push -u origin main
```

### Step 2: Deploy on Vercel (Free Forever)
1. Go to [https://vercel.com/new](https://vercel.com/new) and log in with your GitHub account.
2. Select your `tunegrab` repository and click **Import**.
3. Framework Preset will automatically detect **Next.js**.
4. Click **Deploy**.
5. Your live website URL will be ready in under 60 seconds (e.g., `https://tunegrab.vercel.app`).

### Step 3: Connect Your Free or Custom Domain (Optional)
1. In your Vercel Dashboard, go to **Settings > Domains**.
2. Type your domain name (e.g., `tunegrab.com` or any free domain).
3. Add the CNAME / A records provided by Vercel to your domain registrar (GoDaddy, Namecheap, Cloudflare).
4. Vercel will automatically generate a **Free SSL Certificate (HTTPS)** for you!

---

## 💻 Local Development

Run the development server locally:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

```bash
npm run build
npm start
```
