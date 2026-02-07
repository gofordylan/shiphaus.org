import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX = 5; // max requests per window per IP

async function isRateLimited(ip: string): Promise<boolean> {
  const key = `ratelimit:subscribe:${ip}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW);
  }

  return current > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (await isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Try again later.' },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Need a valid email' },
        { status: 400 }
      );
    }

    // Check for duplicates
    const exists = await redis.sismember('subscribers', email);
    if (exists) {
      return NextResponse.json(
        { error: 'Already subscribed' },
        { status: 400 }
      );
    }

    // Add subscriber to set
    await redis.sadd('subscribers', email);

    // Store timestamp
    await redis.hset(`subscriber:${email}`, {
      email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: "Didn't work. Try again?" },
      { status: 500 }
    );
  }
}
