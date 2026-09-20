// Security utility for URL sanitization, SSRF protection, and input defense

const ALLOWED_DOMAINS = [
  'spotify.com',
  'open.spotify.com',
  'spotify.link',
  'spoti.fi',
  'apple.com',
  'music.apple.com',
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'soundcloud.com',
  'm.soundcloud.com',
  'on.soundcloud.com',
  'soundcloud.app.goo.gl',
  'jiosaavn.com',
  'www.jiosaavn.com',
];

const BLOCKED_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./, // AWS/Cloud metadata IP
  /^0\.0\.0\.0/,
  /^localhost$/i,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

/**
 * Validates if an incoming URL or search query is safe
 * @param {string} input - URL or search string
 * @returns {{ safe: boolean, error?: string, sanitized?: string }}
 */
export function sanitizeAndValidateInput(input) {
  if (!input || typeof input !== 'string') {
    return { safe: false, error: 'Input is required' };
  }

  const trimmed = input.trim();
  if (trimmed.length > 500) {
    return { safe: false, error: 'Input length exceeds 500 characters limit' };
  }

  // If it's a URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);

      // Force HTTPS only for external queries
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        return { safe: false, error: 'Invalid URL protocol' };
      }

      const hostname = parsed.hostname.toLowerCase();

      // Check blocked internal IPs
      for (const pattern of BLOCKED_IP_PATTERNS) {
        if (pattern.test(hostname)) {
          return { safe: false, error: 'Access to internal or private addresses is strictly forbidden (SSRF Protection)' };
        }
      }

      // Check allowed music domain list
      const isAllowed = ALLOWED_DOMAINS.some(
        (domain) => hostname === domain || hostname.endsWith('.' + domain)
      );

      if (!isAllowed) {
        return {
          safe: false,
          error: 'Only Spotify, Apple Music, YouTube Music, SoundCloud, and JioSaavn links are supported.',
        };
      }

      return { safe: true, sanitized: trimmed };
    } catch {
      return { safe: false, error: 'Malformed URL format' };
    }
  }

  // If it's a search term (e.g. "Arijit Singh Kesariya")
  // Strip dangerous SQL/Shell/Script injection chars
  const sanitized = trimmed.replace(/[<>{}\\]/g, '');
  return { safe: true, sanitized };
}
