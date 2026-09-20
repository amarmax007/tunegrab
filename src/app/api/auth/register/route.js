import { NextResponse } from 'next/server';
import { requestRegistrationOtp, completeRegistrationWithOtp } from '@/lib/userDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action = 'request', name, email, password, code } = body;

    // Step 2: Complete registration with verified 6-digit OTP code
    if (action === 'verify' || code) {
      if (!email || !code) {
        return NextResponse.json(
          { error: 'Email address and 6-digit verification code are required.' },
          { status: 400 }
        );
      }

      const verifiedUser = completeRegistrationWithOtp({ email, code });
      return NextResponse.json({
        success: true,
        user: verifiedUser,
        message: '🎉 Email verified successfully! Your account has been created.',
      });
    }

    // Step 1: Validate registration details and dispatch OTP code
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, valid email, and password (min 6 characters) are required.' },
        { status: 400 }
      );
    }

    const result = await requestRegistrationOtp({ name, email, password });

    return NextResponse.json({
      success: true,
      requiresOtp: true,
      email: result.email,
      expiresInSeconds: result.expiresInSeconds,
      message: result.message,
    });
  } catch (err) {
    console.error('Registration API error:', err);
    return NextResponse.json(
      { error: err.message || 'Registration failed.' },
      { status: 400 }
    );
  }
}
