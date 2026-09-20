import { NextResponse } from 'next/server';
import { updateUserVip, recordPaymentTransaction } from '@/lib/userDb';

const PLAN_DAYS = {
  weekly: 7,
  monthly: 30,
  lifetime: 3650,
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, plan = 'lifetime', amount, paymentId, signature, userId, userEmail, method = 'CARD_GATEWAY' } = body;

    const durationDays = PLAN_DAYS[plan.toLowerCase()] || 3650;
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const generatedVipKey = `VIP-${plan.toUpperCase()}-${randomSuffix}-2026`;

    // Record Transaction in database
    const txn = recordPaymentTransaction({
      orderId,
      txnRef: paymentId || `PAY-${Date.now()}`,
      plan,
      amount: amount || (plan === 'weekly' ? 99 : plan === 'monthly' ? 199 : 499),
      method,
      userId: userId || 'GUEST',
      userEmail: userEmail || 'user@tunegrab.app',
      key: generatedVipKey,
      status: 'SUCCESS',
    });

    // If userId provided, activate VIP on user account directly
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
      message: '🎉 VIP Turbo Membership Activated Successfully!',
    });
  } catch (err) {
    console.error('Payment verify error:', err);
    return NextResponse.json(
      { error: err.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
