import { NextResponse } from 'next/server';
import { resolveUniversalMusic } from '@/lib/musicResolver';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeAndValidateInput } from '@/lib/security';

export async function GET(request) {
  // 1. Rate Limiting Check
  const rateLimit = checkRateLimit(request, { limit: 40, windowMs: 60000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Please wait ${rateLimit.resetInSeconds}s or upgrade to VIP.` },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.resetInSeconds),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const query = searchParams.get('q');

    const input = url || query;
    if (!input || !input.trim()) {
      return NextResponse.json(
        { error: 'Please provide a valid music URL or search term.' },
        { status: 400 }
      );
    }

    // 2. SSRF & Security Validation
    const validation = sanitizeAndValidateInput(input);
    if (!validation.safe) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const data = await resolveUniversalMusic(validation.sanitized);
    return NextResponse.json(data, {
      headers: {
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (error) {
    console.error('Universal Music API error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch music data. Please check the URL and try again.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  // 1. Rate Limiting Check
  const rateLimit = checkRateLimit(request, { limit: 40, windowMs: 60000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Please wait ${rateLimit.resetInSeconds}s or upgrade to VIP.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const input = body.url || body.query || body.q;

    if (!input || !input.trim()) {
      return NextResponse.json(
        { error: 'Please provide a valid music URL or search query.' },
        { status: 400 }
      );
    }

    // 2. SSRF & Security Validation
    const validation = sanitizeAndValidateInput(input);
    if (!validation.safe) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const data = await resolveUniversalMusic(validation.sanitized);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Universal Music API POST error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch music data.' },
      { status: 500 }
    );
  }
}
