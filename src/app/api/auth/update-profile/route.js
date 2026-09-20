import { NextResponse } from 'next/server';
import { updateUserProfile } from '@/lib/userDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, name, avatar } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const updatedUser = updateUserProfile(userId, { name, avatar });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully.',
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Profile update failed.' },
      { status: 400 }
    );
  }
}
