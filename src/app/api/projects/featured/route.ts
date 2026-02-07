import { NextResponse } from 'next/server';
import { getFeaturedProjects } from '@/lib/redis-data';

export async function GET() {
  try {
    const projects = await getFeaturedProjects();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
