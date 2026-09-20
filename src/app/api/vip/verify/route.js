import { NextResponse } from 'next/server';
import { verifyAndRedeemKey } from '@/lib/userDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { key, userId } = body;

    if (!key || typeof key !== 'string' || key.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please enter a valid VIP license key.' },
        { status: 400 }
      );
    }

    const cleanKey = key.trim().toUpperCase();

    // Verify key strictly in DB
    const redemptionResult = verifyAndRedeemKey(cleanKey, userId || null);

    return NextResponse.json({
      success: true,
      key: redemptionResult.key,
      plan: redemptionResult.plan,
      durationDays: redemptionResult.durationDays,
      message: `🎉 VIP License (${redemptionResult.plan.toUpperCase()}) Verified Successfully! 100% Ad-Free & Unlimited 320kbps Batch Downloads Enabled.`,
    });
  } catch (error) {
    console.error('VIP verify error:', error);
    return NextResponse.json(
      { error: error.message || 'Invalid or unverified VIP license key.' },
      { status: 400 }
    );
  }
}
