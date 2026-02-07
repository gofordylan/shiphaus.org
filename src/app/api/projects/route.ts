import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, getProjectsByChapter, getProjectsByEvent } from '@/lib/redis-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chapter = searchParams.get('chapter');
    const event = searchParams.get('event');

    let projects;
    if (chapter) {
      projects = await getProjectsByChapter(chapter);
    } else if (event) {
      projects = await getProjectsByEvent(event);
    } else {
      projects = await getAllProjects();
    }

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
