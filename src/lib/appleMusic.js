import axios from 'axios';
import * as cheerio from 'cheerio';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

/**
 * Checks if input is an Apple Music URL and parses it.
 */
export function parseAppleMusicUrl(input) {
  if (!input || typeof input !== 'string') return { isAppleMusic: false };
  const trimmed = input.trim();

  const appleMusicRegex = /(?:https?:\/\/)?music\.apple\.com\/([a-z]{2})\/(song|album|playlist|artist)\/(?:[^/]+\/)?([a-zA-Z0-9.\-_]+)(?:\?i=([0-9]+))?/i;
  const match = trimmed.match(appleMusicRegex);

  if (!match) return { isAppleMusic: false };

  const country = match[1];
  let type = match[2].toLowerCase();
  const mainId = match[3];
  const trackIdParam = match[4];

  // If URL has ?i=TRACK_ID, it's a specific song inside an album
  if (trackIdParam) {
    return {
      isAppleMusic: true,
      country,
      type: 'track',
      id: trackIdParam,
      collectionId: mainId,
      rawUrl: trimmed
    };
  }

  if (type === 'song') type = 'track';

  return {
    isAppleMusic: true,
    country,
    type,
    id: mainId,
    rawUrl: trimmed
  };
}

/**
 * Main fetcher for Apple Music URLs
 */
export async function getAppleMusicData(input) {
  const parsed = parseAppleMusicUrl(input);
  if (!parsed.isAppleMusic) {
    throw new Error('Not a valid Apple Music URL.');
  }

  const { type, id, country, rawUrl } = parsed;

  // Case 1: Numeric ID (Tracks, Albums, Artists) via iTunes Lookup API
  if (/^\d+$/.test(id)) {
    try {
      const itunesRes = await axios.get(`https://itunes.apple.com/lookup?id=${id}&country=${country || 'us'}&entity=song`, {
        headers: HEADERS,
        timeout: 8000
      });

      const results = itunesRes.data?.results || [];
      if (results.length > 0) {
        if (type === 'track') {
          const track = results.find(r => r.wrapperType === 'track') || results[0];
          const hdThumb = (track.artworkUrl100 || '').replace('100x100bb', '600x600bb');
          return {
            platform: 'apple-music',
            type: 'track',
            meta: {
              title: track.trackName || track.collectionName,
              artist: track.artistName,
              thumbnail: hdThumb,
              total: 1
            },
            items: [{
              id: `apple_${track.trackId}`,
              title: track.trackName,
              artist: track.artistName,
              album: track.collectionName || '',
              thumbnail: hdThumb,
              duration: Math.round((track.trackTimeMillis || 0) / 1000),
              previewUrl: track.previewUrl || null
            }]
          };
        }

        if (type === 'album') {
          const collection = results.find(r => r.wrapperType === 'collection') || results[0];
          const tracks = results.filter(r => r.wrapperType === 'track');
          const hdThumb = (collection.artworkUrl100 || '').replace('100x100bb', '600x600bb');

          return {
            platform: 'apple-music',
            type: 'album',
            meta: {
              title: collection.collectionName,
              artist: collection.artistName,
              thumbnail: hdThumb,
              total: tracks.length
            },
            items: tracks.map((t, idx) => ({
              id: `apple_${t.trackId || idx}`,
              title: t.trackName,
              artist: t.artistName,
              album: collection.collectionName,
              thumbnail: (t.artworkUrl100 || collection.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
              duration: Math.round((t.trackTimeMillis || 0) / 1000),
              previewUrl: t.previewUrl || null
            }))
          };
        }

        if (type === 'artist') {
          const artist = results.find(r => r.wrapperType === 'artist') || results[0];
          const tracks = results.filter(r => r.wrapperType === 'track');
          const hdThumb = tracks[0]?.artworkUrl100?.replace('100x100bb', '600x600bb') || '';

          return {
            platform: 'apple-music',
            type: 'artist',
            meta: {
              title: artist.artistName,
              artist: artist.artistName,
              thumbnail: hdThumb,
              total: tracks.length
            },
            items: tracks.map((t, idx) => ({
              id: `apple_${t.trackId || idx}`,
              title: t.trackName,
              artist: t.artistName,
              album: t.collectionName || '',
              thumbnail: (t.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
              duration: Math.round((t.trackTimeMillis || 0) / 1000),
              previewUrl: t.previewUrl || null
            }))
          };
        }
      }
    } catch (itunesErr) {
      console.warn('iTunes lookup API error:', itunesErr.message);
    }
  }

  // Case 2: Web Scraping for Playlists (`pl.xxx`) or Fallback
  try {
    const pageRes = await axios.get(rawUrl, { headers: HEADERS, timeout: 10000 });
    const $ = cheerio.load(pageRes.data);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || 'Apple Music Collection';
    const image = $('meta[property="og:image"]').attr('content') || '';
    const description = $('meta[property="og:description"]').attr('content') || '';

    // Check JSON-LD Schema
    const script = $('script[type="application/ld+json"]').html();
    if (script) {
      try {
        const schema = JSON.parse(script);
        const rawTracks = schema.track || schema.tracks || [];

        if (rawTracks.length > 0) {
          return {
            platform: 'apple-music',
            type: type || 'playlist',
            meta: {
              title: schema.name || title,
              artist: schema.byArtist?.name || 'Apple Music',
              thumbnail: image,
              total: rawTracks.length
            },
            items: rawTracks.map((t, idx) => {
              const artistName = typeof t.byArtist === 'object' ? t.byArtist?.name : (t.byArtist || 'Apple Music');
              return {
                id: `apple_pl_${idx}`,
                title: t.name,
                artist: artistName,
                album: schema.name || title,
                thumbnail: image,
                duration: 200,
                previewUrl: null
              };
            })
          };
        }
      } catch (e) {}
    }

    // Fallback single track representation
    return {
      platform: 'apple-music',
      type: type || 'track',
      meta: {
        title: title.replace(' on Apple Music', '').trim(),
        artist: description.split(' - Album by ')?.[1] || 'Apple Music Artist',
        thumbnail: image,
        total: 1
      },
      items: [{
        id: `apple_custom_${Date.now()}`,
        title: title.replace(' on Apple Music', '').trim(),
        artist: description.split(' - Album by ')?.[1] || 'Artist',
        album: '',
        thumbnail: image,
        duration: 180,
        previewUrl: null
      }]
    };
  } catch (err) {
    throw new Error('Could not fetch Apple Music track details. Please check the URL.');
  }
}
