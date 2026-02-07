import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { createSubmission } from '@/lib/redis-data';
import { ProjectType, Submission } from '@/types';

const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX = 3;

const VALID_TYPES: ProjectType[] = ['website', 'application', 'devtool', 'video', 'other'];

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

async function isRateLimited(ip: string): Promise<boolean> {
  const key = `ratelimit:submit:${ip}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW);
  }
  return current > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
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
    const { title, description, type, deployedUrl, githubUrl, builderName, chapterId, eventId } = body;

    // Validate required fields
    if (!title || title.length < 3 || title.length > 100) {
      return NextResponse.json({ error: 'Title must be 3-100 characters.' }, { status: 400 });
    }
    if (!description || description.length < 10 || description.length > 500) {
      return NextResponse.json({ error: 'Description must be 10-500 characters.' }, { status: 400 });
    }
    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid project type.' }, { status: 400 });
    }
    if (!builderName || builderName.length < 2 || builderName.length > 50) {
      return NextResponse.json({ error: 'Name must be 2-50 characters.' }, { status: 400 });
    }

    // Validate optional URLs
    if (deployedUrl && !isValidUrl(deployedUrl)) {
      return NextResponse.json({ error: 'Invalid live link URL.' }, { status: 400 });
    }
    if (githubUrl && !isValidUrl(githubUrl)) {
      return NextResponse.json({ error: 'Invalid source link URL.' }, { status: 400 });
    }

    const submission: Submission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      description: description.trim(),
      type,
      deployedUrl: deployedUrl?.trim() || undefined,
      githubUrl: githubUrl?.trim() || undefined,
      builderName: builderName.trim(),
      chapterId: chapterId || undefined,
      eventId: eventId || undefined,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    await createSubmission(submission);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: "Something went wrong. Try again?" },
      { status: 500 }
    );
  }
}
