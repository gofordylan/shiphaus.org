import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    const emails = await redis.smembers('subscribers');
    if (!emails.length) return NextResponse.json([]);

    const pipeline = redis.pipeline();
    for (const email of emails) {
      pipeline.hgetall(`subscriber:${email}`);
    }
    const results = await pipeline.exec();

    const subscribers = results
      .map((r, i) => {
        if (r && typeof r === 'object' && 'email' in (r as Record<string, string>)) {
          return r as { email: string; timestamp: string };
        }
        return { email: emails[i] as string, timestamp: '' };
      })
      .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));

    return NextResponse.json(subscribers);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}
