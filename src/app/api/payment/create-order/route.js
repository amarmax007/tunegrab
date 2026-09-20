import { NextResponse } from 'next/server';

const PLAN_PRICING = {
  weekly: { price: 99, durationDays: 7, name: 'Weekly Pass' },
  monthly: { price: 199, durationDays: 30, name: 'Monthly Pro' },
  lifetime: { price: 499, durationDays: 3650, name: 'Lifetime VIP' },
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { plan = 'lifetime', userId, userEmail } = body;

    const planDetails = PLAN_PRICING[plan.toLowerCase()] || PLAN_PRICING.lifetime;
    const orderId = `TG-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const upiId = process.env.NEXT_PUBLIC_UPI_ID || process.env.UPI_ID || 'tunegrab@upi';
    const amount = planDetails.price;

    // Standard NPCI UPI URI string
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=TuneGrab%20Music&am=${amount}&cu=INR&tn=TuneGrab%20${encodeURIComponent(planDetails.name)}%20${orderId}`;

    return NextResponse.json({
      success: true,
      orderId,
      plan: plan.toLowerCase(),
      planName: planDetails.name,
      amount,
      currency: 'INR',
      durationDays: planDetails.durationDays,
      upiId,
      upiUri,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || null,
      message: 'Order created successfully.',
    });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create payment order.' },
      { status: 500 }
    );
  }
}
