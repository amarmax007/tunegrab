import axios from 'axios';
import * as cheerio from 'cheerio';

const SPOTIFY_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
};

/**
 * Parses Spotify URL or determines if it is a search query.
 */
export function parseSpotifyInput(input) {
  if (!input || typeof input !== 'string') return { isUrl: false, query: '' };
  const trimmed = input.trim();

  // Check if it's a Spotify URL
  const spotifyRegex = /(?:https?:\/\/)?(?:open\.)?spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)/i;
  const match = trimmed.match(spotifyRegex);

  if (match) {
    return {
      isUrl: true,
      type: match[1].toLowerCase(),
      id: match[2],
      cleanUrl: `https://open.spotify.com/${match[1].toLowerCase()}/${match[2]}`
    };
  }

  // Short URL format spotify.link / spoti.fi
  const shortRegex = /(?:https?:\/\/)?(?:spotify\.link|spoti\.fi)\/([a-zA-Z0-9]+)/i;
  const shortMatch = trimmed.match(shortRegex);
  if (shortMatch) {
    return {
      isUrl: true,
      isShortUrl: true,
      cleanUrl: trimmed
    };
  }

  return {
    isUrl: false,
    query: trimmed
  };
}

/**
 * Gets Spotify public token for web API calls
 */
let cachedToken = null;
let tokenExpiresAt = 0;

async function getSpotifyAnonymousToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const res = await axios.get('https://open.spotify.com/get_access_token?reason=transport&productType=web_player', {
      headers: SPOTIFY_HEADERS,
      timeout: 8000
    });
    if (res.data?.accessToken) {
      cachedToken = res.data.accessToken;
      tokenExpiresAt = (res.data.accessTokenExpirationTimestampMs || now + 3000000) - 60000;
      return cachedToken;
    }
  } catch (err) {
    console.warn('Could not get anonymous Spotify access token directly:', err.message);
  }

  return null;
}

/**
 * Fetches Spotify metadata for track, playlist, album, artist or search
 */
export async function getSpotifyData(input) {
  const parsed = parseSpotifyInput(input);

  // If short URL, resolve redirect first
  if (parsed.isShortUrl) {
    try {
      const resp = await axios.get(parsed.cleanUrl, {
        headers: SPOTIFY_HEADERS,
        maxRedirects: 5,
        validateStatus: null
      });
      const finalUrl = resp.request?.res?.responseUrl || resp.config?.url;
      if (finalUrl) {
        return getSpotifyData(finalUrl);
      }
    } catch (e) {
      console.warn('Failed resolving short url:', e.message);
    }
  }

  // If search query (not URL)
  if (!parsed.isUrl) {
    return searchSpotify(parsed.query);
  }

  const { type, id, cleanUrl } = parsed;

  // Method 1: Fetch via HTML Embed / OEmbed scraper
  try {
    const embedUrl = `https://open.spotify.com/embed/${type}/${id}`;
    const embedRes = await axios.get(embedUrl, {
      headers: SPOTIFY_HEADERS,
      timeout: 8000
    });

    const $ = cheerio.load(embedRes.data);
    const nextDataRaw = $('script#__NEXT_DATA__').html();

    if (nextDataRaw) {
      const nextData = JSON.parse(nextDataRaw);
      const entity = nextData?.props?.pageProps?.state?.data?.entity;

      if (entity) {
        const formatted = formatEntityData(type, entity);
        if (formatted && formatted.items && formatted.items.length > 0) {
          return formatted;
        }
      }
    }
  } catch (err) {
    console.warn('Embed scraping fallback triggered for Spotify:', err.message);
  }

  // Method 2: SpotSaver direct metadata fallback
  try {
    const fallbackRes = await axios.get(`https://spotsaver.net/api/spotify/?url=${encodeURIComponent(cleanUrl)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      },
      timeout: 8000
    });
    if (fallbackRes.data && fallbackRes.data.items && fallbackRes.data.items.length > 0) {
      return fallbackRes.data;
    }
  } catch (spotsaverErr) {
    console.warn('SpotSaver metadata API fallback error:', spotsaverErr.message);
  }

  // Method 3: Spotify Web API using anonymous token
  const token = await getSpotifyAnonymousToken();
  if (token) {
    try {
      let apiEndpoint = '';
      if (type === 'track') apiEndpoint = `https://api.spotify.com/v1/tracks/${id}`;
      else if (type === 'album') apiEndpoint = `https://api.spotify.com/v1/albums/${id}`;
      else if (type === 'playlist') apiEndpoint = `https://api.spotify.com/v1/playlists/${id}`;
      else if (type === 'artist') apiEndpoint = `https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`;

      const apiRes = await axios.get(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...SPOTIFY_HEADERS
        },
        timeout: 8000
      });

      const formatted = formatApiResponse(type, apiRes.data);
      if (formatted && formatted.items && formatted.items.length > 0) {
        return formatted;
      }
    } catch (apiErr) {
      console.warn('Spotify API request error:', apiErr.message);
    }
  }

  // Method 4: Fallback OEmbed + Scrape Open Graph tags
  try {
    const pageRes = await axios.get(cleanUrl, {
      headers: SPOTIFY_HEADERS,
      timeout: 8000
    });
    const $ = cheerio.load(pageRes.data);
    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || 'Unknown Title';
    const description = $('meta[property="og:description"]').attr('content') || '';
    const image = $('meta[property="og:image"]').attr('content') || '';

    let artist = '';
    if (description.includes('· Song ·')) {
      artist = description.split('·')[0].trim();
    } else if (title.includes(' - song and lyrics by ')) {
      const parts = title.split(' - song and lyrics by ');
      artist = parts[1]?.replace(' | Spotify', '')?.trim();
    }

    return {
      type: type || 'track',
      meta: {
        title: title.replace(' | Spotify', '').trim(),
        artist: artist || 'Various Artists',
        thumbnail: image,
        total: 1
      },
      items: [
        {
          id: id || 'custom-' + Date.now(),
          title: title.replace(/ \| Spotify| - song and lyrics by .*/gi, '').trim(),
          artist: artist || 'Artist',
          album: '',
          thumbnail: image,
          duration: 180,
          previewUrl: null
        }
      ]
    };
  } catch (ogErr) {
    throw new Error('Could not retrieve Spotify track details. Please check the link or search query.');
  }
}

/**
 * Searches songs on Spotify or query resolver
 */
export async function searchSpotify(query) {
  const token = await getSpotifyAnonymousToken();

  if (token) {
    try {
      const searchRes = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...SPOTIFY_HEADERS
        },
        timeout: 8000
      });

      const tracks = searchRes.data?.tracks?.items || [];
      if (tracks.length > 0) {
        return {
          type: 'search',
          query,
          meta: {
            title: `Search results for "${query}"`,
            total: tracks.length,
            thumbnail: tracks[0]?.album?.images?.[0]?.url || ''
          },
          items: tracks.map(t => ({
            id: t.id,
            title: t.name,
            artist: t.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
            album: t.album?.name || '',
            thumbnail: t.album?.images?.[0]?.url || '',
            duration: Math.round((t.duration_ms || 0) / 1000),
            previewUrl: t.preview_url || null
          }))
        };
      }
    } catch (e) {
      console.warn('Spotify search API error:', e.message);
    }
  }

  // Fallback: search via iTunes API for rich metadata
  try {
    const itunesRes = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`, {
      timeout: 8000
    });
    const results = itunesRes.data?.results || [];

    return {
      type: 'search',
      query,
      meta: {
        title: `Search results for "${query}"`,
        total: results.length,
        thumbnail: results[0]?.artworkUrl100?.replace('100x100bb', '600x600bb') || ''
      },
      items: results.map(r => ({
        id: 'track_' + r.trackId,
        title: r.trackName,
        artist: r.artistName,
        album: r.collectionName || '',
        thumbnail: r.artworkUrl100?.replace('100x100bb', '600x600bb') || '',
        duration: Math.round((r.trackTimeMillis || 0) / 1000),
        previewUrl: r.previewUrl || null
      }))
    };
  } catch (err) {
    throw new Error('Search failed. Please try again with a specific song or artist name.');
  }
}

/**
 * Helpers to format entity data from Embed scraper
 */
function formatEntityData(type, entity) {
  const thumb = entity.coverArt?.sources?.[0]?.url || entity.visualIdentity?.image?.[0]?.url || '';
  const meta = {
    title: entity.name || entity.title || '',
    artist: entity.artists?.map(a => a.name).join(', ') || entity.subtitle || '',
    owner: entity.owner?.name || '',
    thumbnail: thumb,
    total: 1
  };

  let items = [];

  if (type === 'track') {
    items = [{
      id: entity.id || (entity.uri ? entity.uri.replace('spotify:track:', '') : 'track_0'),
      title: entity.name || entity.title || 'Unknown Title',
      artist: entity.artists?.map(a => a.name).join(', ') || entity.subtitle || 'Unknown Artist',
      album: entity.album?.name || '',
      thumbnail: meta.thumbnail,
      duration: Math.round((entity.duration || entity.duration_ms || 180000) / 1000),
      previewUrl: entity.audioPreview?.url || null
    }];
  } else if (type === 'album' || type === 'playlist' || type === 'artist') {
    const trackList = entity.trackList || entity.tracksList || entity.tracks?.items || entity.topTracks || [];
    meta.total = trackList.length;

    items = trackList.map((t, idx) => {
      const trackId = t.id || t.uid || (t.uri ? t.uri.replace('spotify:track:', '') : `track_${idx}`);
      return {
        id: trackId,
        title: t.title || t.name || 'Track ' + (idx + 1),
        artist: t.subtitle || t.artists?.map(a => a.name).join(', ') || meta.artist || meta.title || 'Unknown Artist',
        album: t.album?.name || meta.title || '',
        thumbnail: t.coverArt?.sources?.[0]?.url || meta.thumbnail,
        duration: Math.round((t.duration || t.duration_ms || 180000) / 1000),
        previewUrl: t.audioPreview?.url || t.preview_url || null
      };
    });
  }

  return {
    type,
    meta,
    items
  };
}

/**
 * Helper to format official Spotify API response
 */
function formatApiResponse(type, data) {
  if (type === 'track') {
    const thumb = data.album?.images?.[0]?.url || '';
    return {
      type: 'track',
      meta: {
        title: data.name,
        artist: data.artists?.map(a => a.name).join(', '),
        thumbnail: thumb,
        total: 1
      },
      items: [{
        id: data.id,
        title: data.name,
        artist: data.artists?.map(a => a.name).join(', '),
        album: data.album?.name || '',
        thumbnail: thumb,
        duration: Math.round(data.duration_ms / 1000),
        previewUrl: data.preview_url || null
      }]
    };
  }

  if (type === 'playlist') {
    const tracks = data.tracks?.items || [];
    const thumb = data.images?.[0]?.url || '';
    return {
      type: 'playlist',
      meta: {
        title: data.name,
        owner: data.owner?.display_name || 'Spotify',
        thumbnail: thumb,
        total: tracks.length
      },
      items: tracks.filter(t => t.track).map(t => ({
        id: t.track.id,
        title: t.track.name,
        artist: t.track.artists?.map(a => a.name).join(', '),
        album: t.track.album?.name || '',
        thumbnail: t.track.album?.images?.[0]?.url || thumb,
        duration: Math.round((t.track.duration_ms || 0) / 1000),
        previewUrl: t.track.preview_url || null
      }))
    };
  }

  if (type === 'album') {
    const tracks = data.tracks?.items || [];
    const thumb = data.images?.[0]?.url || '';
    const artist = data.artists?.map(a => a.name).join(', ') || '';
    return {
      type: 'album',
      meta: {
        title: data.name,
        artist,
        thumbnail: thumb,
        total: tracks.length
      },
      items: tracks.map(t => ({
        id: t.id,
        title: t.name,
        artist: t.artists?.map(a => a.name).join(', ') || artist,
        album: data.name,
        thumbnail: thumb,
        duration: Math.round((t.duration_ms || 0) / 1000),
        previewUrl: t.preview_url || null
      }))
    };
  }

  if (type === 'artist') {
    const tracks = data.tracks || data.items || [];
    const thumb = data.images?.[0]?.url || '';
    return {
      type: 'artist',
      meta: {
        title: data.name || 'Artist',
        artist: data.name || 'Artist',
        thumbnail: thumb,
        total: tracks.length
      },
      items: tracks.map(t => ({
        id: t.id,
        title: t.name,
        artist: t.artists?.map(a => a.name).join(', ') || data.name,
        album: t.album?.name || '',
        thumbnail: t.album?.images?.[0]?.url || thumb,
        duration: Math.round((t.duration_ms || 0) / 1000),
        previewUrl: t.preview_url || null
      }))
    };
  }

  return {
    type: 'unknown',
    meta: { title: 'Unknown', total: 0 },
    items: []
  };
}
