import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import axios from 'axios';

function isSafeStreamUrl(urlStr) {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    const hostname = parsed.hostname.toLowerCase();
    const blocked = ['localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254', '::1'];
    if (blocked.some((b) => hostname === b || hostname.startsWith('10.') || hostname.startsWith('192.168.'))) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function POST(request) {
  const rateLimit = checkRateLimit(request, { limit: 120, windowMs: 60000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Batch download rate limit exceeded. Please wait or activate VIP.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'Download URL is required.' }, { status: 400 });
    }

    if (!isSafeStreamUrl(url)) {
      return NextResponse.json({ error: 'Invalid or blocked stream target.' }, { status: 403 });
    }

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      timeout: 30000,
      maxContentLength: 80 * 1024 * 1024,
    });

    return new Response(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('ZIP buffer fetch error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch audio stream' }, { status: 500 });
  }
}
