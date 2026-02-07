import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const isDevelopment =
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.UPSTASH_REDIS_REST_URL.includes('your_url_here') ||
  process.env.UPSTASH_REDIS_REST_TOKEN.includes('your_token_here');

let redis: Redis | null = null;

if (!isDevelopment) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.ADMIN_API_KEY}`;

    if (!process.env.ADMIN_API_KEY || authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (isDevelopment || !redis) {
      return NextResponse.json({ count: 0, subscribers: [], note: 'Development mode - no storage' });
    }

    const emails = await redis.smembers('subscribers');

    const pipeline = redis.pipeline();
    emails.forEach((email) => pipeline.hgetall(`subscriber:${email}`));
    const results = await pipeline.exec();

    const subscribers = results
      .filter((r): r is Record<string, string> => r !== null && typeof r === 'object')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}
