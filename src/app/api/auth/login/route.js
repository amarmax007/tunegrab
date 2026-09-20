import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/userDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'User ID / Email and Password are required.' },
        { status: 400 }
      );
    }

    const user = loginUser({ identifier, password });

    return NextResponse.json({
      success: true,
      user,
      message: `Welcome back, ${user.name}! Cloud data synced.`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Login failed.' },
      { status: 401 }
    );
  }
}
