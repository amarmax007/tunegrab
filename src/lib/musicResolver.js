import { getSpotifyData, searchSpotify } from './spotify.js';
import { getAppleMusicData, parseAppleMusicUrl } from './appleMusic.js';
import { getYouTubeMusicData, parseYouTubeUrl } from './youtubeMusic.js';
import { getSoundCloudData, parseSoundCloudUrl } from './soundcloud.js';
import { getJioSaavnData, parseJioSaavnUrl } from './jiosaavn.js';

/**
 * Universal Multi-Platform Music Resolver
 * Auto-detects:
 * 1. 🟢 Spotify
 * 2. 🍎 Apple Music
 * 3. 🔴 YouTube Music / YouTube
 * 4. 🟠 SoundCloud
 * 5. 🔵 JioSaavn
 * 6. 🔍 Raw text search queries
 */
export async function resolveUniversalMusic(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Please enter a valid song name or URL.');
  }

  const trimmed = input.trim();

  // 1. 🍎 Check Apple Music
  const appleParsed = parseAppleMusicUrl(trimmed);
  if (appleParsed.isAppleMusic) {
    return getAppleMusicData(trimmed);
  }

  // 2. 🔴 Check YouTube / YouTube Music
  const ytParsed = parseYouTubeUrl(trimmed);
  if (ytParsed.isYouTube) {
    return getYouTubeMusicData(trimmed);
  }

  // 3. 🟠 Check SoundCloud
  const scParsed = parseSoundCloudUrl(trimmed);
  if (scParsed.isSoundCloud) {
    return getSoundCloudData(trimmed);
  }

  // 4. 🔵 Check JioSaavn
  const saavnParsed = parseJioSaavnUrl(trimmed);
  if (saavnParsed.isJioSaavn) {
    return getJioSaavnData(trimmed);
  }

  // 5. 🟢 Spotify URL or universal text search query
  return getSpotifyData(trimmed);
}
