import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { auth } from '@/lib/auth';
import { createSubmission, approveSubmission } from '@/lib/redis-data';
import { Submission } from '@/types';

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
  const key = `ratelimit:submit:${ip}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW);
  }
  return current > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
    // Require auth
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Sign in to submit a project.' }, { status: 401 });
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
    const { title, description, deployedUrl, githubUrl, chapterId, eventId } = body;
    const builderName = session.user.name || session.user.email;

    // Validate required fields
    if (!title || title.length < 3 || title.length > 100) {
      return NextResponse.json({ error: 'Title must be 3-100 characters.' }, { status: 400 });
    }
    if (!description || description.length < 10 || description.length > 500) {
      return NextResponse.json({ error: 'Description must be 10-500 characters.' }, { status: 400 });
    }
    if (!deployedUrl || !isValidUrl(deployedUrl)) {
      return NextResponse.json({ error: 'A valid live URL is required.' }, { status: 400 });
    }

    // Validate optional URLs
    if (githubUrl && !isValidUrl(githubUrl)) {
      return NextResponse.json({ error: 'Invalid source link URL.' }, { status: 400 });
    }

    const submission: Submission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      description: description.trim(),
      type: 'other',
      deployedUrl: deployedUrl.trim(),
      githubUrl: githubUrl?.trim() || undefined,
      builderName,
      builderAvatar: session.user.image || undefined,
      submittedBy: session.user.email,
      chapterId: chapterId || undefined,
      eventId: eventId || undefined,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    await createSubmission(submission);

    // Auto-subscribe submitter
    redis.sadd('subscribers', session.user.email).catch(() => {});
    redis.hset(`subscriber:${session.user.email}`, {
      email: session.user.email,
      timestamp: new Date().toISOString(),
    }).catch(() => {});

    // Auto-approve: immediately create the project
    const project = await approveSubmission(
      submission.id,
      session.user.email,
      submission.chapterId,
      submission.eventId,
    );

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: "Something went wrong. Try again?" },
      { status: 500 }
    );
  }
}
