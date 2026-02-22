import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { auth } from '@/lib/auth';
import { generateCliToken } from '@/lib/cli-tokens';

const RATE_LIMIT_WINDOW = 300; // 5 minutes
const RATE_LIMIT_MAX = 10;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const rateLimitKey = `ratelimit:cli-token:${ip}`;
  const current = await redis.incr(rateLimitKey);
  if (current === 1) await redis.expire(rateLimitKey, RATE_LIMIT_WINDOW);
  if (current > RATE_LIMIT_MAX) {
    return NextResponse.json({ error: 'Too many token requests. Try again later.' }, { status: 429 });
  }

  const email = session.user.email;
  const builderName = session.user.name || email;

  const { token, expiresAt } = await generateCliToken({
    email,
    name: builderName,
    avatar: session.user.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(builderName)}&backgroundColor=c0aede`,
    image: session.user.image || '',
  });

  return NextResponse.json({ token, expiresAt });
}
