import { NextResponse } from 'next/server';
import { getAllProjectsAdmin } from '@/lib/redis-data';

export async function GET() {
  try {
    const projects = await getAllProjectsAdmin();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
