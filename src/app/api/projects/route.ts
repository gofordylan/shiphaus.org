import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, getProjectsByChapter, getProjectsByEvent } from '@/lib/redis-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chapter = searchParams.get('chapter');
    const event = searchParams.get('event');

    if (chapter) {
      return NextResponse.json(await getProjectsByChapter(chapter));
    } else if (event) {
      return NextResponse.json(await getProjectsByEvent(event));
    } else {
      return NextResponse.json(await getAllProjects());
    }
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
