import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { createProject } from '@/lib/redis-data';
import { validateCliToken, consumeCliToken } from '@/lib/cli-tokens';
import { Project } from '@/types';

const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX = 3;

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

async function isRateLimited(ip: string): Promise<boolean> {
  const key = `ratelimit:cli-submit:${ip}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW);
  }
  return current > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Missing token.' }, { status: 401 });
    }

    const user = await validateCliToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (await isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { title, description, deployedUrl, githubUrl, chapterId, eventId, screenshotUrl } = body;

    if (!title || title.length < 3 || title.length > 100) {
      return NextResponse.json({ error: 'Title must be 3-100 characters.' }, { status: 400 });
    }
    if (!description || description.length < 10 || description.length > 500) {
      return NextResponse.json({ error: 'Description must be 10-500 characters.' }, { status: 400 });
    }
    if (!deployedUrl || !isValidUrl(deployedUrl)) {
      return NextResponse.json({ error: 'A valid live URL is required.' }, { status: 400 });
    }
    if (githubUrl && !isValidUrl(githubUrl)) {
      return NextResponse.json({ error: 'Invalid source link URL.' }, { status: 400 });
    }
    if (screenshotUrl && !isValidUrl(screenshotUrl)) {
      return NextResponse.json({ error: 'Invalid screenshot URL.' }, { status: 400 });
    }

    const builderName = user.name;

    const project: Project = {
      id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      description: description.trim(),
      deployedUrl: deployedUrl.trim(),
      githubUrl: githubUrl?.trim() || undefined,
      createdAt: new Date().toISOString(),
      chapterId: chapterId || '',
      eventId: eventId || undefined,
      builder: {
        name: builderName,
        avatar: user.avatar,
        uid: builderName.toLowerCase().replace(/\s+/g, '-'),
      },
      type: 'other',
      featured: false,
      submittedBy: user.email,
      screenshotUrl: screenshotUrl?.trim() || undefined,
    };

    await createProject(project);

    redis.sadd('subscribers', user.email).catch(() => {});
    redis.hset(`subscriber:${user.email}`, {
      email: user.email,
      timestamp: new Date().toISOString(),
    }).catch(() => {});

    await consumeCliToken(token);

    return NextResponse.json({
      success: true,
      project,
      url: `https://shiphaus.org/chapter/${project.chapterId}`,
    });
  } catch (error) {
    console.error('CLI submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Try again?' },
      { status: 500 }
    );
  }
}
