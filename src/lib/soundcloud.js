import axios from 'axios';
import * as cheerio from 'cheerio';

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

/**
 * Parses and normalizes SoundCloud URLs
 */
export function parseSoundCloudUrl(input) {
  if (!input || typeof input !== 'string') return { isSoundCloud: false };
  const trimmed = input.trim();

  // Check if it's a soundcloud domain
  if (!/soundcloud\.(?:com|app\.goo\.gl)/i.test(trimmed)) {
    return { isSoundCloud: false };
  }

  // Handle on.soundcloud.com or shortlinks
  const isShortlink = /on\.soundcloud\.com|soundcloud\.app\.goo\.gl/i.test(trimmed);

  // Extract clean path (strip query params and hashes)
  const urlWithoutQuery = trimmed.split('?')[0].split('#')[0];
  const match = urlWithoutQuery.match(/(?:https?:\/\/)?(?:www\.|m\.)?soundcloud\.com\/([a-zA-Z0-9-_]+)(?:\/([a-zA-Z0-9-_]+))?(?:\/([a-zA-Z0-9-_]+))?/i);

  if (match) {
    const isSet = match[2] === 'sets';
    return {
      isSoundCloud: true,
      isShortlink: false,
      isSet,
      artist: match[1],
      slug: isSet ? match[3] : match[2],
      cleanUrl: urlWithoutQuery,
      rawUrl: trimmed,
    };
  }

  if (isShortlink) {
    return {
      isSoundCloud: true,
      isShortlink: true,
      cleanUrl: trimmed,
      rawUrl: trimmed,
    };
  }

  return { isSoundCloud: true, rawUrl: trimmed, cleanUrl: urlWithoutQuery };
}

/**
 * Resolves metadata for SoundCloud URL with multi-layer fallback
 */
export async function getSoundCloudData(input) {
  const parsed = parseSoundCloudUrl(input);
  if (!parsed.isSoundCloud) throw new Error('Invalid SoundCloud URL.');

  let targetUrl = parsed.cleanUrl || parsed.rawUrl;

  // Layer 1: Direct HTML OpenGraph & Meta tag extraction (Most reliable)
  try {
    const response = await axios.get(targetUrl, {
      headers: BROWSER_HEADERS,
      timeout: 10000,
      maxRedirects: 5,
    });

    const finalUrl = response.request?.res?.responseUrl || targetUrl;
    const $ = cheerio.load(response.data);

    let ogTitle = $('meta[property="og:title"]').attr('content') || $('meta[name="twitter:title"]').attr('content') || '';
    let ogImage = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content') || '';
    let ogDesc = $('meta[property="og:description"]').attr('content') || '';
    let ogType = $('meta[property="og:type"]').attr('content') || 'music.song';

    // If title has fallback from <title> tag (e.g. "Stream Demons by rip37official | Listen online free on SoundCloud")
    if (!ogTitle) {
      const pageTitle = $('title').text() || '';
      ogTitle = pageTitle.replace(/Stream\s+/i, '').replace(/\|\s*Listen online.*$/i, '').trim();
    }

    // Extract artist from URL or meta
    let artist = parsed.artist || '';
    if (!artist) {
      const urlMatch = finalUrl.match(/soundcloud\.com\/([a-zA-Z0-9-_]+)\//i);
      if (urlMatch) artist = urlMatch[1];
    }

    // Clean title
    let cleanTitle = ogTitle || (parsed.slug ? parsed.slug.replace(/-/g, ' ') : 'SoundCloud Track');
    if (artist) {
      cleanTitle = cleanTitle.replace(new RegExp(` by ${artist}$`, 'i'), '').trim();
    }

    // Capitalize slug words if needed
    const formattedTitle = cleanTitle
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const formattedArtist = (artist || 'SoundCloud Artist')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    return {
      platform: 'soundcloud',
      type: parsed.isSet ? 'playlist' : 'track',
      meta: {
        title: formattedTitle,
        artist: formattedArtist,
        thumbnail: ogImage || '',
        total: 1,
      },
      items: [
        {
          id: `sc_${Date.now()}`,
          title: formattedTitle,
          artist: formattedArtist,
          album: 'SoundCloud Single',
          thumbnail: ogImage || '',
          duration: 210,
          previewUrl: null,
        },
      ],
    };
  } catch (htmlErr) {
    console.warn('SoundCloud HTML scraping failed, trying slug fallback:', htmlErr.message);
  }

  // Layer 2: Slug-based intelligent fallback (Guarantees 0 failure even if Cloudflare blocks)
  if (parsed.slug) {
    const rawTitle = parsed.slug.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const rawArtist = (parsed.artist || 'SoundCloud').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return {
      platform: 'soundcloud',
      type: 'track',
      meta: {
        title: rawTitle,
        artist: rawArtist,
        thumbnail: '',
        total: 1,
      },
      items: [
        {
          id: `sc_fallback_${Date.now()}`,
          title: rawTitle,
          artist: rawArtist,
          album: 'SoundCloud',
          thumbnail: '',
          duration: 210,
          previewUrl: null,
        },
      ],
    };
  }

  throw new Error('Could not fetch SoundCloud track details. Please check the URL.');
}

