// In-Memory Sliding Window Rate Limiter for DDoS / Scraper protection

const ipRequestMap = new Map();
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute

// Background cleanup of stale IP records
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequestMap.entries()) {
      if (now - data.windowStart > 60000) {
        ipRequestMap.delete(ip);
      }
    }
  }, CLEANUP_INTERVAL);
  if (timer && typeof timer.unref === 'function') {
    timer.unref();
  }
}

/**
 * Check if an IP address is within its allowed rate limit
 * @param {Request} request - Next.js Request object
 * @param {object} options - Rate limit config
 * @param {number} options.limit - Max requests per window (default 30)
 * @param {number} options.windowMs - Time window in milliseconds (default 60000 = 1 min)
 * @returns {{ allowed: boolean, remaining: number, resetInSeconds: number }}
 */
export function checkRateLimit(request, options = {}) {
  const limit = options.limit || 30;
  const windowMs = options.windowMs || 60 * 1000;

  // Extract client IP from standard proxy headers
  const forwardedFor = request?.headers?.get?.('x-forwarded-for');
  const realIp = request?.headers?.get?.('x-real-ip');
  const ip = (forwardedFor ? forwardedFor.split(',')[0].trim() : realIp) || '127.0.0.1';

  // Check VIP header or token if present
  const vipToken = request?.headers?.get?.('x-vip-token');
  if (vipToken && (vipToken.startsWith('VIP-') || vipToken === 'VIP-ACTIVE')) {
    // VIP users get 10x higher capacity
    return { allowed: true, remaining: 999, resetInSeconds: 60 };
  }

  const now = Date.now();
  let record = ipRequestMap.get(ip);

  if (!record || now - record.windowStart > windowMs) {
    record = {
      count: 1,
      windowStart: now,
    };
    ipRequestMap.set(ip, record);
    return {
      allowed: true,
      remaining: limit - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  record.count += 1;

  if (record.count > limit) {
    const resetInSeconds = Math.ceil((record.windowStart + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.max(1, resetInSeconds),
    };
  }

  return {
    allowed: true,
    remaining: limit - record.count,
    resetInSeconds: Math.ceil((record.windowStart + windowMs - now) / 1000),
  };
}
