import { NextResponse } from 'next/server';
import { getDownloadUrl } from '@/lib/downloadStream';
import { checkRateLimit } from '@/lib/rateLimit';
import axios from 'axios';

// Check if a target download stream URL is safe from SSRF attacks
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
  // Rate limit
  const rateLimit = checkRateLimit(request, { limit: 50, windowMs: 60000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Too many download conversions. Please wait ${rateLimit.resetInSeconds}s.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { videoId, title, candidateIds } = body;

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required.' }, { status: 400 });
    }

    // Sanitize videoId
    const safeVideoId = String(videoId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
    if (!safeVideoId) {
      return NextResponse.json({ error: 'Invalid Video ID.' }, { status: 400 });
    }

    const result = await getDownloadUrl(safeVideoId, title, candidateIds);
    return NextResponse.json({
      success: 1,
      status: 'ready',
      downloadUrl: result.downloadUrl,
      mediaUrl: result.downloadUrl,
      url: result.downloadUrl,
      filename: result.filename,
      duration: result.duration,
      bitrate: result.bitrate,
    });
  } catch (error) {
    console.error('Download converter error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to generate MP3 download stream.' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  // Rate limit
  const rateLimit = checkRateLimit(request, { limit: 60, windowMs: 60000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Download limit reached for this minute. Please wait.' },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const downloadUrl = searchParams.get('url');
    const filename = searchParams.get('name') || 'Spotify_Track.mp3';

    if (!downloadUrl) {
      return NextResponse.json({ error: 'URL parameter is required.' }, { status: 400 });
    }

    // SSRF Check
    if (!isSafeStreamUrl(downloadUrl)) {
      return NextResponse.json({ error: 'Invalid or unauthorized stream URL.' }, { status: 403 });
    }

    // Stream download through proxy to prevent CORS issues
    const response = await axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      timeout: 30000,
      maxContentLength: 100 * 1024 * 1024, // max 100MB
    });

    const safeCleanFilename = filename.replace(/[\\/:*?"<>|]/g, '').trim() || 'Track';
    const safeFilename = encodeURIComponent(
      safeCleanFilename.endsWith('.mp3') ? safeCleanFilename : `${safeCleanFilename}.mp3`
    );

    return new Response(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('Audio stream proxy error:', err.message);
    return NextResponse.json({ error: 'Failed to stream audio file.' }, { status: 500 });
  }
}
