import { NextResponse } from 'next/server';
import { generateEmailOtp } from '@/lib/userDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    const otpData = generateEmailOtp(email);

    return NextResponse.json({
      success: true,
      email: otpData.email,
      expiresInSeconds: otpData.expiresInSeconds,
      // Security: Never leak the plain verification code to the client response
      message: `A 6-digit security verification code has been dispatched to ${otpData.email}. Please enter it below.`,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to send OTP verification code.' }, { status: 400 });
  }
}
