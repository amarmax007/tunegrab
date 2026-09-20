import axios from 'axios';
import * as cheerio from 'cheerio';
import { searchSpotify } from './spotify.js';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

/**
 * Parses JioSaavn URLs
 */
export function parseJioSaavnUrl(input) {
  if (!input || typeof input !== 'string') return { isJioSaavn: false };
  const trimmed = input.trim();

  const saavnRegex = /(?:https?:\/\/)?(?:www\.)?(?:jiosaavn\.com|saavn\.com)\/(song|album|featured|shows)\/([^/]+)(?:\/([^/?#]+))?/i;
  const match = trimmed.match(saavnRegex);

  if (match) {
    const rawType = match[1].toLowerCase();
    const slugName = match[2];
    const token = match[3] || '';

    return {
      isJioSaavn: true,
      type: rawType === 'featured' ? 'playlist' : (rawType === 'shows' ? 'podcast' : rawType),
      slug: slugName,
      token,
      rawUrl: trimmed
    };
  }

  return { isJioSaavn: false };
}

/**
 * Resolves metadata for JioSaavn URL
 */
export async function getJioSaavnData(input) {
  const parsed = parseJioSaavnUrl(input);
  if (!parsed.isJioSaavn) throw new Error('Invalid JioSaavn URL.');

  const { type, slug, rawUrl } = parsed;
  const cleanTitleFromSlug = slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Method 1: Web Scraper
  try {
    const res = await axios.get(rawUrl, {
      headers: HEADERS,
      maxRedirects: 5,
      timeout: 6000
    });

    const $ = cheerio.load(res.data);
    const ogTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || cleanTitleFromSlug;
    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    const ogDesc = $('meta[property="og:description"]').attr('content') || '';

    let songTitle = ogTitle.split(' - ')[0] || ogTitle;
    let artist = 'JioSaavn';

    if (ogDesc.includes('by ')) {
      const match = ogDesc.match(/by\s+([^,.]+)/i);
      if (match) artist = match[1].trim();
    } else if (ogTitle.includes('Song by')) {
      const parts = ogTitle.split('Song by');
      songTitle = parts[0].trim();
      artist = parts[1]?.replace(/on JioSaavn.*/i, '')?.trim() || 'Artist';
    }

    return {
      platform: 'jiosaavn',
      type: type || 'track',
      meta: {
        title: songTitle.replace(/\| JioSaavn/i, '').trim(),
        artist,
        thumbnail: ogImage,
        total: 1
      },
      items: [{
        id: `saavn_${Date.now()}`,
        title: songTitle.replace(/\| JioSaavn/i, '').trim(),
        artist,
        album: 'JioSaavn',
        thumbnail: ogImage,
        duration: 210,
        previewUrl: null
      }]
    };
  } catch (err) {
    console.warn('JioSaavn web scraping fallback to search query:', cleanTitleFromSlug);
  }

  // Method 2: Smart fallback using slug search
  const searchResults = await searchSpotify(cleanTitleFromSlug);
  return {
    platform: 'jiosaavn',
    type: 'track',
    meta: {
      title: searchResults.items[0]?.title || cleanTitleFromSlug,
      artist: searchResults.items[0]?.artist || 'JioSaavn Artist',
      thumbnail: searchResults.items[0]?.thumbnail || '',
      total: searchResults.items.length
    },
    items: searchResults.items
  };
}
