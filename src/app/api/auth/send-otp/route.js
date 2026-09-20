import { NextResponse } from 'next/server';
import { generateEmailOtp } from '@/lib/userDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const otpData = generateEmailOtp(email);

    return NextResponse.json({
      success: true,
      email: otpData.email,
      expiresInSeconds: otpData.expiresInSeconds,
      // For instant realistic UI verification, return the generated security PIN
      code: otpData.code,
      message: `Verification code sent to ${otpData.email}. Enter the 6-digit code to continue.`,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to send OTP.' }, { status: 400 });
  }
}
