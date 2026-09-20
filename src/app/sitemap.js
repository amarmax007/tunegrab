export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tunegrab-nine.vercel.app';

  const routes = [
    '',
    '/spotify-track-downloader',
    '/spotify-playlist-downloader',
    '/spotify-album-downloader',
    '/spotify-to-mp3',
    '/apple-music-downloader',
    '/pricing',
    '/faq',
    '/dmca',
    '/privacy',
    '/terms',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.includes('downloader') ? 0.8 : 0.5,
  }));
}
