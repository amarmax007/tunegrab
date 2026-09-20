import { NextResponse } from 'next/server';
import { verifyEmailOtp } from '@/lib/userDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, code, name } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const user = verifyEmailOtp(email, code, name);

    return NextResponse.json({
      success: true,
      user,
      message: `Verified successfully! Welcome ${user.name}.`,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'OTP verification failed.' }, { status: 400 });
  }
}
