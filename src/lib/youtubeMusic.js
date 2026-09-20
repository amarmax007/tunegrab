import axios from 'axios';
import * as cheerio from 'cheerio';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

/**
 * Parses YouTube / YouTube Music URLs
 */
export function parseYouTubeUrl(input) {
  if (!input || typeof input !== 'string') return { isYouTube: false };
  const trimmed = input.trim();

  // Watch URL (video/track)
  const watchRegex = /(?:https?:\/\/)?(?:music\.|www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|v\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = trimmed.match(watchRegex);

  // Playlist URL
  const playlistRegex = /(?:https?:\/\/)?(?:music\.|www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/i;
  const plMatch = trimmed.match(playlistRegex);

  if (plMatch) {
    return {
      isYouTube: true,
      type: 'playlist',
      id: plMatch[1],
      rawUrl: trimmed
    };
  }

  if (match) {
    return {
      isYouTube: true,
      type: 'track',
      id: match[1],
      rawUrl: trimmed
    };
  }

  return { isYouTube: false };
}

/**
 * Resolves metadata for YouTube / YouTube Music URL
 */
export async function getYouTubeMusicData(input) {
  const parsed = parseYouTubeUrl(input);
  if (!parsed.isYouTube) throw new Error('Invalid YouTube URL.');

  const { type, id, rawUrl } = parsed;

  if (type === 'track') {
    try {
      const oembedRes = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, {
        timeout: 7000
      });
      const data = oembedRes.data;
      const title = data.title || 'YouTube Track';
      const artist = data.author_name || 'YouTube Music';
      const thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

      return {
        platform: 'youtube-music',
        type: 'track',
        meta: {
          title,
          artist,
          thumbnail,
          total: 1
        },
        items: [{
          id: id,
          title,
          artist,
          album: 'YouTube Music',
          thumbnail,
          duration: 210,
          previewUrl: null
        }]
      };
    } catch (e) {
      // Fallback
      return {
        platform: 'youtube-music',
        type: 'track',
        meta: {
          title: 'YouTube Track',
          artist: 'Artist',
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          total: 1
        },
        items: [{
          id: id,
          title: 'YouTube Track',
          artist: 'Artist',
          album: 'YouTube Music',
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          duration: 210,
          previewUrl: null
        }]
      };
    }
  }

  if (type === 'playlist') {
    try {
      const res = await axios.get(rawUrl, { headers: HEADERS, timeout: 10000 });
      const html = res.data;
      const jsonMatch = html.match(/var ytInitialData\s*=\s*({.+?});<\/script>/s);
      if (jsonMatch && jsonMatch[1]) {
        const data = JSON.parse(jsonMatch[1]);
        const plTitle = data.metadata?.playlistMetadataRenderer?.title || 'YouTube Playlist';
        const section = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer;
        const contents = section?.contents || [];

        const items = [];
        for (const item of contents) {
          const v = item.playlistVideoRenderer;
          if (v && v.videoId) {
            items.push({
              id: v.videoId,
              title: v.title?.runs?.[0]?.text || 'Track',
              artist: v.shortBylineText?.runs?.[0]?.text || 'Artist',
              album: plTitle,
              thumbnail: v.thumbnail?.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
              duration: parseInt(v.lengthSeconds || '200', 10),
              previewUrl: null
            });
          }
        }

        if (items.length > 0) {
          return {
            platform: 'youtube-music',
            type: 'playlist',
            meta: {
              title: plTitle,
              artist: 'YouTube Music',
              thumbnail: items[0]?.thumbnail || '',
              total: items.length
            },
            items
          };
        }
      }
    } catch (e) {
      console.warn('YouTube playlist scraping fallback:', e.message);
    }
  }

  throw new Error('Could not fetch YouTube Music track details.');
}
