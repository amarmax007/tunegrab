import axios from 'axios';
import * as cheerio from 'cheerio';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

/**
 * Searches for a YouTube video ID matching the Spotify song
 */
export async function matchYouTubeVideo(title, artist = '', duration = 0) {
  const cleanTitle = (title || '').replace(/\([^)]*\)|\[[^\]]*\]/g, '').trim();
  const cleanArtist = (artist || '').trim();
  const searchQuery = `${cleanTitle} ${cleanArtist} official audio`.trim();

  // Method 1: SpotSaver / Yt1s fast get-id endpoint
  try {
    const spotsaverRes = await axios.post('https://spotsaver.net/api/get-id/', {
      title: title,
      artist: artist
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      },
      timeout: 5000
    });

    if (spotsaverRes.data?.success && spotsaverRes.data?.videoId) {
      return {
        videoId: spotsaverRes.data.videoId,
        title: `${title} - ${artist}`,
        candidateIds: spotsaverRes.data.candidateIds || []
      };
    }
  } catch (err) {
    // Continue to next method
  }

  // Method 2: Direct YouTube search scraping (Fast initialData extraction)
  try {
    const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    const ytRes = await axios.get(ytUrl, { headers: HEADERS, timeout: 7000 });
    const html = ytRes.data;

    // Search for ytInitialData JSON
    const jsonMatch = html.match(/var ytInitialData\s*=\s*({.+?});<\/script>/s) || html.match(/window\["ytInitialData"\]\s*=\s*({.+?});<\/script>/s);
    if (jsonMatch && jsonMatch[1]) {
      const data = JSON.parse(jsonMatch[1]);
      const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];

      const candidateIds = [];
      for (const item of contents) {
        const videoRenderer = item.videoRenderer;
        if (videoRenderer && videoRenderer.videoId) {
          candidateIds.push(videoRenderer.videoId);
        }
      }

      if (candidateIds.length > 0) {
        return {
          videoId: candidateIds[0],
          title: `${title} - ${artist}`,
          candidateIds: candidateIds.slice(1, 5)
        };
      }
    }

    // Direct regex videoId extraction fallback
    const idMatches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
    const uniqueIds = [...new Set(idMatches.map(m => m[1]))];
    if (uniqueIds.length > 0) {
      return {
        videoId: uniqueIds[0],
        title: `${title} - ${artist}`,
        candidateIds: uniqueIds.slice(1, 5)
      };
    }
  } catch (ytErr) {
    console.warn('YouTube scraping fallback triggered:', ytErr.message);
  }

  // Method 3: Invidious / Piped public instance search fallback
  try {
    const pipedRes = await axios.get(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(searchQuery)}&filter=videos`, {
      timeout: 5000
    });
    if (pipedRes.data?.items && pipedRes.data.items.length > 0) {
      const videoId = pipedRes.data.items[0].url?.replace('/watch?v=', '');
      if (videoId) {
        return {
          videoId,
          title: `${title} - ${artist}`,
          candidateIds: pipedRes.data.items.slice(1, 5).map(i => i.url?.replace('/watch?v=', '')).filter(Boolean)
        };
      }
    }
  } catch (pipedErr) {
    // Continue
  }

  throw new Error(`Could not find audio match for "${title} - ${artist}"`);
}
