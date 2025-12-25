import { NextRequest, NextResponse } from 'next/server';
import { videoStore } from '@/app/api/upload-selfie/route';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const videoData = videoStore.get(id);

    if (!videoData) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({
      id,
      url: videoData.url,
      prompt: videoData.prompt,
      createdAt: videoData.createdAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

