import { NextResponse } from 'next/server';
import { authenticateWithGoogle } from '@/lib/userDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, avatar } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Google email is required.' },
        { status: 400 }
      );
    }

    const user = authenticateWithGoogle({ email, name, avatar });

    return NextResponse.json({
      success: true,
      user,
      message: `Signed in with Google as ${user.name}`,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Google login failed.' }, { status: 400 });
  }
}
