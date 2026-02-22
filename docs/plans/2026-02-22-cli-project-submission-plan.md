# CLI Project Submission via Claude Code — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let builders submit projects to Shiphaus from Claude Code by pasting a prompt copied from the website.

**Architecture:** Three new API routes under `/api/cli/` (token, upload, submit) authenticated via short-lived Redis tokens instead of session cookies. A "Submit via Claude Code" button on the chapter page generates the token and copies a self-contained prompt to clipboard. No changes to existing submission flow.

**Tech Stack:** Next.js API routes, Upstash Redis, Vercel Blob, `crypto.randomBytes` for tokens

**Design Doc:** `docs/plans/2026-02-22-cli-project-submission-design.md`

---

### Task 1: CLI Token Helpers

Create a utility module for generating, validating, and consuming CLI tokens.

**Files:**
- Create: `src/lib/cli-tokens.ts`

**Step 1: Create the token utility file**

```typescript
import { redis } from '@/lib/redis';
import { randomBytes } from 'crypto';

const TOKEN_PREFIX = 'sh_cli_';
const TOKEN_TTL = 1800; // 30 minutes
const REDIS_KEY_PREFIX = 'shiphaus:cli-token:';

interface TokenData {
  email: string;
  name: string;
  avatar: string;
  image: string;
}

export async function generateCliToken(user: TokenData): Promise<{ token: string; expiresAt: string }> {
  const token = TOKEN_PREFIX + randomBytes(24).toString('hex');
  const key = REDIS_KEY_PREFIX + token;
  const expiresAt = new Date(Date.now() + TOKEN_TTL * 1000).toISOString();

  await redis.hset(key, {
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    image: user.image,
    expires: expiresAt,
  });
  await redis.expire(key, TOKEN_TTL);

  return { token, expiresAt };
}

export async function validateCliToken(token: string): Promise<TokenData | null> {
  if (!token.startsWith(TOKEN_PREFIX)) return null;
  const key = REDIS_KEY_PREFIX + token;
  const data = await redis.hgetall(key) as Record<string, string> | null;
  if (!data || !data.email) return null;
  return { email: data.email, name: data.name, avatar: data.avatar, image: data.image };
}

export async function consumeCliToken(token: string): Promise<void> {
  await redis.del(REDIS_KEY_PREFIX + token);
}
```

**Step 2: Verify it compiles**

Run: `cd /Users/slobo/Documents/coding/shiphaus.org && npx tsc --noEmit src/lib/cli-tokens.ts 2>&1 || true`

If type errors, fix them. The `redis.hgetall` return type may need a cast.

**Step 3: Commit**

```bash
git add src/lib/cli-tokens.ts
git commit -m "add CLI token helpers for Claude Code submission"
```

---

### Task 2: Token Generation Endpoint

**Files:**
- Create: `src/app/api/cli/token/route.ts`

**Step 1: Create the route**

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateCliToken } from '@/lib/cli-tokens';

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  }

  const user = session.user;
  const builderName = user.name || user.email;

  const { token, expiresAt } = await generateCliToken({
    email: user.email,
    name: builderName,
    avatar: user.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(builderName)}&backgroundColor=c0aede`,
    image: user.image || '',
  });

  return NextResponse.json({ token, expiresAt });
}
```

**Step 2: Verify it compiles**

Run: `cd /Users/slobo/Documents/coding/shiphaus.org && npx tsc --noEmit 2>&1 | head -20`

**Step 3: Commit**

```bash
git add src/app/api/cli/token/route.ts
git commit -m "add POST /api/cli/token endpoint"
```

---

### Task 3: CLI Upload Endpoint

Mirrors existing `src/app/api/upload/route.ts` but uses token auth instead of session.

**Files:**
- Create: `src/app/api/cli/upload/route.ts`

**Step 1: Create the route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { validateCliToken } from '@/lib/cli-tokens';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Missing token.' }, { status: 401 });
  }

  const user = await validateCliToken(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'File must be JPEG, PNG, or WebP.' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File must be under 5MB.' }, { status: 400 });
  }

  const blob = await put(`projects/${Date.now()}-${file.name}`, file, {
    access: 'public',
  });

  return NextResponse.json({ url: blob.url });
}
```

**Step 2: Verify it compiles**

Run: `cd /Users/slobo/Documents/coding/shiphaus.org && npx tsc --noEmit 2>&1 | head -20`

**Step 3: Commit**

```bash
git add src/app/api/cli/upload/route.ts
git commit -m "add POST /api/cli/upload endpoint with token auth"
```

---

### Task 4: CLI Submit Endpoint

Mirrors existing `src/app/api/submit/route.ts` but uses token auth. Builder identity comes from the token's stored data.

**Files:**
- Create: `src/app/api/cli/submit/route.ts`

**Step 1: Create the route**

Model this closely on the existing `src/app/api/submit/route.ts` (lines 28-107). Key differences:
- Auth via Bearer token instead of session
- Builder name/avatar from token data instead of session
- Consume the token on success

```typescript
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

    // Auto-subscribe submitter
    redis.sadd('subscribers', user.email).catch(() => {});
    redis.hset(`subscriber:${user.email}`, {
      email: user.email,
      timestamp: new Date().toISOString(),
    }).catch(() => {});

    // Consume the token (single-use)
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
```

**Step 2: Verify it compiles**

Run: `cd /Users/slobo/Documents/coding/shiphaus.org && npx tsc --noEmit 2>&1 | head -20`

**Step 3: Commit**

```bash
git add src/app/api/cli/submit/route.ts
git commit -m "add POST /api/cli/submit endpoint with token auth"
```

---

### Task 5: Prompt Builder Utility

A function that generates the clipboard prompt string with token, chapter, and event baked in.

**Files:**
- Create: `src/lib/cli-prompt.ts`

**Step 1: Create the prompt builder**

```typescript
interface CliPromptParams {
  token: string;
  chapterId: string;
  eventId: string;
  baseUrl: string;
}

export function buildCliPrompt({ token, chapterId, eventId, baseUrl }: CliPromptParams): string {
  return `Submit my project to Shiphaus.

Token: ${token}
API: ${baseUrl}/api/cli/submit
Upload: ${baseUrl}/api/cli/upload
Chapter: ${chapterId}
Event: ${eventId}

Ask me for:
1. Project name (required, 3-100 chars)
2. Short description of what I built (required, 10-500 chars)
3. Live URL where it's deployed (required)
4. GitHub repo URL (optional)
5. Screenshot file path (optional)

If I give a screenshot path, upload it first:
curl -s -X POST ${baseUrl}/api/cli/upload -H "Authorization: Bearer ${token}" -F "file=@{path}"
Parse the "url" field from the JSON response.

Then submit everything:
curl -s -X POST ${baseUrl}/api/cli/submit -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d '{"title":"...","description":"...","deployedUrl":"...","githubUrl":"...","screenshotUrl":"...","chapterId":"${chapterId}","eventId":"${eventId}"}'

Show me the result and the link to my project.`;
}
```

**Step 2: Commit**

```bash
git add src/lib/cli-prompt.ts
git commit -m "add CLI prompt builder utility"
```

---

### Task 6: Frontend — "Submit via Claude Code" Button

Add the button to the chapter page next to the existing "Submit Project" button. When clicked, it generates a token, builds the prompt, copies to clipboard, and shows a toast.

**Files:**
- Modify: `src/app/chapter/[id]/page.tsx`

**Context:** The submit buttons live in three places on this page:
1. **Admin mode, active event, no existing project** (line 327-332): `btn-primary` "Submit Project"
2. **Non-admin, active event, no existing project** (line 363-368): `btn-primary` "Submit Project"
3. **Not signed in** (line 372-377): `btn-primary` "Submit a Project" (triggers sign-in)

**Step 1: Add imports at the top of the file**

At the top of `src/app/chapter/[id]/page.tsx`, add:

```typescript
import { buildCliPrompt } from '@/lib/cli-prompt';
```

**Step 2: Add state and handler for clipboard copy**

Inside the component function (near the existing state declarations around lines 28-35), add:

```typescript
const [cliCopied, setCliCopied] = useState(false);

async function handleCopyCliPrompt(eventId: string) {
  try {
    const res = await fetch('/api/cli/token', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to generate token');
    const { token } = await res.json();

    const baseUrl = window.location.origin;
    const prompt = buildCliPrompt({ token, chapterId, eventId, baseUrl });

    await navigator.clipboard.writeText(prompt);
    setCliCopied(true);
    setTimeout(() => setCliCopied(false), 3000);
  } catch (err) {
    console.error('CLI prompt copy failed:', err);
  }
}
```

**Step 3: Add the button next to each "Submit Project" button**

There are two places to add it (skip the admin section -- admins use the web form):

**Location 1** — Non-admin, signed in, active event, no existing project (after line 368):

After the existing "Submit Project" button (line 363-368), add a Claude Code button. Wrap both in a flex container:

Replace the block at lines 362-368:
```typescript
<button
  onClick={() => setSubmitModal({ eventId: event.id, eventTitle: event.title })}
  className="btn-primary text-sm !px-5 !py-2"
>
  Submit Project
</button>
```

With:
```typescript
<div className="flex items-center gap-2">
  <button
    onClick={() => setSubmitModal({ eventId: event.id, eventTitle: event.title })}
    className="btn-primary text-sm !px-5 !py-2"
  >
    Submit Project
  </button>
  <button
    onClick={() => handleCopyCliPrompt(event.id)}
    className="text-sm px-4 py-2 rounded-lg border border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
    title="Copy a prompt to paste into Claude Code"
  >
    {cliCopied ? 'Copied!' : 'Claude Code'}
  </button>
</div>
```

**Location 2** — Not signed in (line 372-377):

The "Submit a Project" button triggers sign-in. The Claude Code button should also trigger sign-in (they need a token, which requires a session). So no change needed here -- the sign-in CTA covers both flows. After signing in, they'll see both buttons.

**Step 4: Verify it compiles and renders**

Run: `cd /Users/slobo/Documents/coding/shiphaus.org && npm run build 2>&1 | tail -20`

Check the chapter page visually -- the "Claude Code" button should appear as a secondary outline button next to "Submit Project" for signed-in users on active events.

**Step 5: Commit**

```bash
git add src/app/chapter/[id]/page.tsx src/lib/cli-prompt.ts
git commit -m "add 'Submit via Claude Code' button to chapter page"
```

---

### Task 7: End-to-End Verification

**Step 1: Start dev server**

Run: `cd /Users/slobo/Documents/coding/shiphaus.org && npm run dev`

**Step 2: Test the full flow**

1. Sign in on a chapter page
2. Click "Claude Code" button on an active event
3. Verify clipboard contains the prompt with a valid `sh_cli_` token
4. In a terminal, test the submit endpoint with curl using the copied token:

```bash
# Extract token from clipboard and test:
curl -s -X POST http://localhost:3000/api/cli/submit \
  -H "Authorization: Bearer TOKEN_FROM_CLIPBOARD" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Project","description":"A test project submitted via CLI","deployedUrl":"https://example.com","chapterId":"chicago","eventId":"shiphaus-3"}'
```

Expected: `{ "success": true, "project": { ... }, "url": "..." }`

**Step 3: Verify token is consumed**

Run the same curl again. Expected: `{ "error": "Invalid or expired token." }` with 401 status.

**Step 4: Test screenshot upload**

Generate a new token (click the button again), then:

```bash
curl -s -X POST http://localhost:3000/api/cli/upload \
  -H "Authorization: Bearer NEW_TOKEN" \
  -F "file=@/path/to/some-image.png"
```

Expected: `{ "url": "https://..." }`

**Step 5: Final commit if any fixes needed**

```bash
git add -A && git commit -m "fix: address issues from e2e testing"
```
