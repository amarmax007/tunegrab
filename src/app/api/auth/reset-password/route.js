import { NextResponse } from 'next/server';
import { resetPasswordWithOtp } from '@/lib/userDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: 'Email, OTP code, and new password are required.' },
        { status: 400 }
      );
    }

    const updatedUser = resetPasswordWithOtp({ email, code, newPassword });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Password reset successfully! You are now logged in.',
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Password reset failed.' },
      { status: 400 }
    );
  }
}
