import { NextResponse } from 'next/server';

// Preset VIP master keys and dynamic pattern validator
const VALID_PROMO_KEYS = new Set([
  'VIP-PRO-2026',
  'PREMIUM320',
  'TURBO-MUSIC-VIP',
  'SPOTISAVER-VIP',
  'UNLIMITED-2026',
]);

export async function POST(request) {
  try {
    const body = await request.json();
    const { key, action } = body;

    // Simulated Checkout payment key generator
    if (action === 'generate_key') {
      const plan = body.plan || 'monthly';
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const generatedKey = `VIP-${plan.toUpperCase()}-${randomPart}-${Date.now().toString(36).toUpperCase()}`;
      const durationDays = plan === 'weekly' ? 7 : plan === 'yearly' ? 365 : plan === 'lifetime' ? 3650 : 30;

      return NextResponse.json({
        success: true,
        key: generatedKey,
        durationDays,
        message: 'VIP Key generated and activated successfully!',
      });
    }

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'Please enter a valid VIP license key.' }, { status: 400 });
    }

    const cleanKey = key.trim().toUpperCase();

    // Check preset keys
    if (VALID_PROMO_KEYS.has(cleanKey)) {
      return NextResponse.json({
        success: true,
        key: cleanKey,
        durationDays: 365,
        plan: 'PRO Lifetime',
        message: 'VIP License Activated! Enjoy 100% Ad-Free & Unlimited Batch Downloads.',
      });
    }

    // Check dynamic VIP pattern: VIP-PLAN-RANDOM-TIMESTAMP
    if (cleanKey.startsWith('VIP-')) {
      const parts = cleanKey.split('-');
      if (parts.length >= 3) {
        return NextResponse.json({
          success: true,
          key: cleanKey,
          durationDays: parts[1] === 'WEEKLY' ? 7 : parts[1] === 'LIFETIME' ? 3650 : 30,
          plan: parts[1] || 'PRO',
          message: 'VIP License Verified Successfully!',
        });
      }
    }

    return NextResponse.json(
      { error: 'Invalid or expired VIP license key. Please check or purchase a new key.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('VIP verify error:', error);
    return NextResponse.json({ error: 'Failed to process VIP key' }, { status: 500 });
  }
}
