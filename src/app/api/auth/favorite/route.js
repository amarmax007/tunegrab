import { NextResponse } from 'next/server';
import { toggleUserFavorite } from '@/lib/userDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, track } = body;

    if (!userId || !track) {
      return NextResponse.json({ error: 'User ID and track are required' }, { status: 400 });
    }

    const updatedUser = toggleUserFavorite(userId, track);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}
