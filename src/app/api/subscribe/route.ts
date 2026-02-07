import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Check if we're in development mode (no real Upstash credentials)
const isDevelopment =
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.UPSTASH_REDIS_REST_URL.includes('your_url_here') ||
  process.env.UPSTASH_REDIS_REST_TOKEN.includes('your_token_here');

// Only initialize Redis if we have real credentials
let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

if (!isDevelopment) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
  });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (skip in development)
    if (!isDevelopment && ratelimit) {
      const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1';
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
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

    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim().slice(0, 254);

    if (isDevelopment) {
      // Development mode: just log to console
      console.log('[DEV MODE] New subscriber:', sanitizedEmail);
      console.log('Set up Upstash Redis credentials to enable real storage');
    } else if (redis) {
      // Check for duplicates (production only)
      const exists = await redis.sismember('subscribers', sanitizedEmail);
      if (exists) {
        return NextResponse.json(
          { error: 'Already subscribed' },
          { status: 400 }
        );
      }

      // Store using pipeline for efficiency
      const pipeline = redis.pipeline();
      pipeline.sadd('subscribers', sanitizedEmail);
      pipeline.hset(`subscriber:${sanitizedEmail}`, {
        email: sanitizedEmail,
        timestamp: new Date().toISOString(),
      });
      await pipeline.exec();

      console.log('New subscriber:', sanitizedEmail);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: "Didn't work. Try again?" },
      { status: 500 }
    );
  }
}
