import { NextRequest, NextResponse } from 'next/server';
import { resetCurrentVideo } from '@/app/lib/video-store';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (password !== 'merry') {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    
    // Reset the current video from in-memory store only
    // Don't delete videos from blob storage - just clear the in-memory reference
    resetCurrentVideo();
    
    return NextResponse.json({ success: true, message: 'Video reset successfully' });
  } catch (error) {
    console.error('Error resetting video:', error);
    return NextResponse.json(
      { error: 'Failed to reset' },
      { status: 500 }
    );
  }
}

