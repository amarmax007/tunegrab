import './globals.css';
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import { VipProvider } from '@/context/VipContext';
import { AuthProvider } from '@/context/AuthContext';
import { PlayerProvider } from '@/context/PlayerContext';
import VipModal from '@/components/VipModal';
import AuthModal from '@/components/studio/AuthModal';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  title: 'TuneGrab – Free Universal Music Downloader (Spotify, Apple Music, YouTube, SoundCloud, JioSaavn)',
  description: 'TuneGrab is an ultra-premium universal music studio to download tracks, playlists, albums, and artists in high quality 320kbps MP3 from Spotify, Apple Music, YouTube Music, SoundCloud, and JioSaavn.',
  keywords: 'tunegrab, spotify downloader, apple music downloader, youtube music to mp3, soundcloud downloader, jiosaavn downloader, 320kbps mp3, music batch zip',
  openGraph: {
    title: 'TuneGrab – 5-in-1 Universal Music Downloader to 320kbps MP3',
    description: 'Download music from Spotify, Apple Music, YouTube, SoundCloud & JioSaavn in HD 320kbps MP3. Fast, free & batch ZIP support.',
    type: 'website',
    url: 'https://tunegrab.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TuneGrab – 5-in-1 Universal Music Downloader',
    description: 'Convert and download high-quality 320kbps audio from Spotify, Apple Music, YouTube, SoundCloud & JioSaavn.',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TuneGrab Universal Music Studio',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All (iOS, Android, Windows, Mac, Linux)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Free multi-platform music studio and downloader to convert tracks, albums, and playlists to 320kbps MP3 audio.',
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} dark`}>
      <head>
        {/* Suppress 3rd party Chrome extension errors & Bitdefender attribute hydration popups */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var _origError = console.error;
                  console.error = function() {
                    var msg = arguments[0];
                    if (typeof msg === 'string' && (
                      msg.indexOf('bis_skin_checked') !== -1 ||
                      msg.indexOf('A tree hydrated') !== -1 ||
                      msg.indexOf('hydration-mismatch') !== -1 ||
                      msg.indexOf('Hydration failed') !== -1
                    )) {
                      return;
                    }
                    _origError.apply(console, arguments);
                  };

                  window.addEventListener('error', function(e) {
                    if (e.filename && (e.filename.indexOf('chrome-extension:') !== -1 || e.filename.indexOf('moz-extension:') !== -1)) {
                      e.stopImmediatePropagation();
                      e.preventDefault();
                    }
                  }, true);

                  window.addEventListener('unhandledrejection', function(e) {
                    if (e.reason && e.reason.stack && (e.reason.stack.indexOf('chrome-extension:') !== -1 || e.reason.stack.indexOf('moz-extension:') !== -1)) {
                      e.stopImmediatePropagation();
                      e.preventDefault();
                    }
                  }, true);
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="google0706f257745e5716" />
        {/* Monetag Official Verification Meta Tag */}
        <meta name="monetag" content="0da3e3fe1271693335fba5ed48681abd" />
        {/* Monetag MultiTag Official High-CPM Ad Network Script */}
        <script
          src="https://quge5.com/88/tag.min.js"
          data-zone="283418"
          async
          data-cfasync="false"
        />
        {/* Google AdSense Official Script Integration */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6966661599294786"
          crossOrigin="anonymous"
        />
        {/* Monetag Push & Ad Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {});
                });
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-[#141416] text-white font-sans antialiased selection:bg-[#f0fc54] selection:text-black">
        <ThemeProvider>
          <VipProvider>
            <AuthProvider>
              <PlayerProvider>
                {children}
                <VipModal />
              </PlayerProvider>
            </AuthProvider>
          </VipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
