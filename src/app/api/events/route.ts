import { NextRequest, NextResponse } from 'next/server';
import { getAllEvents, getEventsByChapter } from '@/lib/redis-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chapter = searchParams.get('chapter');

    const events = chapter
      ? await getEventsByChapter(chapter)
      : await getAllEvents();

    return NextResponse.json(events);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
