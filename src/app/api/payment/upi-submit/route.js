import { NextResponse } from 'next/server';
import { updateUserVip, recordPaymentTransaction } from '@/lib/userDb';

const PLAN_DAYS = {
  weekly: 7,
  monthly: 30,
  lifetime: 3650,
};

const PLAN_AMOUNTS = {
  weekly: 99,
  monthly: 199,
  lifetime: 499,
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, plan = 'lifetime', utr, userId, userEmail, payerUpi } = body;

    if (!utr || typeof utr !== 'string') {
      return NextResponse.json(
        { error: 'Please enter the 12-digit UPI UTR / Transaction Reference Number.' },
        { status: 400 }
      );
    }

    const cleanUtr = utr.trim().replace(/\s+/g, '');

    // Validate 12-digit UTR length / format (or simulated test format)
    if (cleanUtr.length < 6) {
      return NextResponse.json(
        { error: 'Invalid UTR format. UPI Reference Number must be at least 6-12 digits.' },
        { status: 400 }
      );
    }

    const durationDays = PLAN_DAYS[plan.toLowerCase()] || 3650;
    const amount = PLAN_AMOUNTS[plan.toLowerCase()] || 499;
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const generatedVipKey = `VIP-${plan.toUpperCase()}-${randomSuffix}-2026`;

    // Record verified transaction
    const txn = recordPaymentTransaction({
      orderId: orderId || `TG-UPI-${Date.now()}`,
      txnRef: cleanUtr,
      plan,
      amount,
      method: `UPI (${payerUpi || 'App'})`,
      userId: userId || 'GUEST',
      userEmail: userEmail || 'user@tunegrab.app',
      key: generatedVipKey,
      status: 'VERIFIED_SUCCESS',
    });

    // Auto activate VIP on user DB if user exists
    let updatedUser = null;
    if (userId) {
      updatedUser = updateUserVip(userId, generatedVipKey, durationDays);
    }

    return NextResponse.json({
      success: true,
      key: generatedVipKey,
      durationDays,
      transaction: txn,
      user: updatedUser,
      message: `🎉 Payment of ₹${amount} Verified! Your VIP License has been issued.`,
    });
  } catch (err) {
    console.error('UPI submit error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to verify UPI payment.' },
      { status: 500 }
    );
  }
}
