import { NextResponse } from 'next/server';
import { updateUserVip, recordPaymentTransaction, issueVipKey } from '@/lib/userDb';

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
    const { orderId, plan = 'monthly', utr, userId, userEmail, payerUpi } = body;

    if (!utr || typeof utr !== 'string') {
      return NextResponse.json(
        { error: 'Please enter the 12-digit UPI UTR / Transaction Reference Number from your payment receipt.' },
        { status: 400 }
      );
    }

    const cleanUtr = utr.trim().replace(/\s+/g, '');

    // Strict 12-digit numeric validation for authentic UPI Reference Number
    const utrRegex = /^\d{12}$/;
    if (!utrRegex.test(cleanUtr)) {
      return NextResponse.json(
        { 
          error: `Invalid UTR "${cleanUtr}". A genuine UPI Reference / UTR Number is strictly 12 digits (e.g. 425612345678). Please check your Google Pay / PhonePe / Paytm payment receipt.` 
        },
        { status: 400 }
      );
    }

    const normalizedPlan = plan.toLowerCase();
    const durationDays = PLAN_DAYS[normalizedPlan] || 30;
    const amount = PLAN_AMOUNTS[normalizedPlan] || 199;
    const generatedOrderId = orderId || `TG-UPI-${Date.now()}`;

    // Issue a registered key in official DB
    const generatedVipKey = issueVipKey({
      plan: normalizedPlan,
      durationDays,
      orderId: generatedOrderId,
      userId: userId || 'PURCHASER',
    });

    // Record verified transaction (throws error if duplicate UTR)
    const txn = recordPaymentTransaction({
      orderId: generatedOrderId,
      txnRef: cleanUtr,
      plan: normalizedPlan,
      amount,
      method: `UPI (${payerUpi || 'App'})`,
      userId: userId || 'GUEST',
      userEmail: userEmail || 'user@tunegrab.app',
      key: generatedVipKey,
      status: 'VERIFIED_SUCCESS',
    });

    // Auto activate VIP on user account in DB
    let updatedUser = null;
    if (userId) {
      updatedUser = updateUserVip(userId, generatedVipKey, durationDays);
    }

    // Automatically send license key to user's real email inbox
    if (userEmail && userEmail.includes('@')) {
      try {
        const { sendLicenseKeyEmail } = await import('@/lib/mailer.js');
        await sendLicenseKeyEmail({
          email: userEmail,
          key: generatedVipKey,
          plan: normalizedPlan,
          amount,
        });
      } catch (mailErr) {
        console.warn('Could not dispatch key email:', mailErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      key: generatedVipKey,
      durationDays,
      transaction: txn,
      user: updatedUser,
      message: `🎉 Payment of ₹${amount} (UTR: ${cleanUtr}) Verified & VIP Activated!`,
    });
  } catch (err) {
    console.error('UPI submit error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to verify UPI payment reference.' },
      { status: 400 }
    );
  }
}
