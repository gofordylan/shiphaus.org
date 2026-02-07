import { NextResponse } from 'next/server';
import { getPendingSubmissions } from '@/lib/redis-data';

export async function GET() {
  try {
    const submissions = await getPendingSubmissions();
    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
