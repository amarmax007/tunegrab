import { NextResponse } from 'next/server';
import { matchYouTubeVideo } from '@/lib/youtubeMatch';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, artist, duration } = body;

    if (!title) {
      return NextResponse.json({ error: 'Song title is required.' }, { status: 400 });
    }

    const match = await matchYouTubeVideo(title, artist, duration);
    return NextResponse.json({
      success: true,
      videoId: match.videoId,
      candidateIds: match.candidateIds || [],
      title: match.title
    });
  } catch (error) {
    console.error('Match video error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to match song audio stream.' },
      { status: 500 }
    );
  }
}
