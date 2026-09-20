import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/userDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and Password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters long.' },
        { status: 400 }
      );
    }

    const user = registerUser({ name, email, password });

    return NextResponse.json({
      success: true,
      user,
      message: `Account created successfully! Your permanent User ID is ${user.userId}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Registration failed.' },
      { status: 400 }
    );
  }
}
