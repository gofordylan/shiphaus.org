# CLI Project Submission via Claude Code

## Problem

Builders at Shiphaus events spend all day in Claude Code. Switching to a web form to submit their project is unnecessary friction. Let them submit from where they already are.

## Solution

A "Submit via Claude Code" button on the projects page that copies a self-contained prompt to the clipboard. The prompt includes a short-lived auth token, API endpoints, and instructions for Claude Code to collect project details and submit via curl. No skill installation required -- just paste and answer questions.

## User Flow

1. Builder is signed in on the Shiphaus website (existing Google/GitHub OAuth)
2. On the projects page, clicks "Submit via Claude Code" (secondary button next to existing "Submit a Project")
3. Frontend generates a short-lived token via `POST /api/cli/token`
4. Prompt with token baked in is copied to clipboard. Toast confirms: "Copied to clipboard -- paste into Claude Code"
5. Builder pastes into Claude Code
6. Claude Code asks for: project name, description, live URL, GitHub URL (optional), screenshot path (optional)
7. If screenshot provided, Claude uploads it via curl to `/api/cli/upload`
8. Claude submits the project via curl to `/api/cli/submit`
9. Confirms success with a link to the project

## Auth: Short-Lived Tokens

- Token generated from existing OAuth session (user is already signed in)
- Stored in Redis: `shiphaus:cli-token:{token}` -> `{ email, name, avatar, expires }`
- 30-minute TTL
- Single-use: deleted after successful project submission (upload does not consume it)
- Format: `sh_cli_` prefix + random hex string

## New API Endpoints

### `POST /api/cli/token`

- Auth: NextAuth session required
- Creates token in Redis tied to user identity
- Returns: `{ token, expiresAt }`

### `POST /api/cli/upload`

- Auth: `Authorization: Bearer {token}` header
- Body: multipart form data with `file` field
- Validation: JPEG/PNG/WebP, max 5MB (same as existing upload)
- Uploads to Vercel Blob with `projects/` prefix
- Returns: `{ url }`
- Does NOT consume the token

### `POST /api/cli/submit`

- Auth: `Authorization: Bearer {token}` header
- Body: JSON `{ title, description, deployedUrl, githubUrl?, screenshotUrl?, chapterId, eventId? }`
- Validation: same rules as existing `/api/submit` (title 3-100 chars, description 10-500 chars, valid URLs)
- Creates project via existing `createProject()` in redis-data.ts
- Builder identity (name, avatar, email) comes from the token's stored user data
- Consumes the token on success
- Returns: `{ project, url }`

## The Copied Prompt

```
Submit my project to Shiphaus.

Token: sh_cli_xxxxxxxxxxxxxxxx
API: https://shiphaus.org/api/cli/submit
Upload: https://shiphaus.org/api/cli/upload
Chapter: {chapterId}
Event: {eventId}

Ask me for:
1. Project name (required, 3-100 chars)
2. Short description of what I built (required, 10-500 chars)
3. Live URL where it's deployed (required)
4. GitHub repo URL (optional)
5. Screenshot file path (optional)

If I give a screenshot path, upload it first:
curl -s -X POST {Upload} -H "Authorization: Bearer {Token}" -F "file=@{path}" | parse the url from response

Then submit everything:
curl -s -X POST {API} -H "Authorization: Bearer {Token}" -H "Content-Type: application/json" -d '{"title":"...","description":"...","deployedUrl":"...","githubUrl":"...","screenshotUrl":"...","chapterId":"...","eventId":"..."}'

Show me the result and the link to my project.
```

## Frontend Changes

### Projects Page

- Add "Submit via Claude Code" button next to existing "Submit a Project"
- Secondary/outlined style so it doesn't compete with the primary CTA
- If not signed in: trigger sign-in flow first, then generate token on return
- If signed in: generate token, build prompt, copy to clipboard, show toast

## Redis Key Schema Addition

```
shiphaus:cli-token:{token}    # hash - { email, name, avatar, image, expires }
                               # TTL: 1800 seconds (30 minutes)
```

## What Stays the Same

- Project data model (same fields)
- Redis storage (same `createProject()` function)
- Existing web form submission (unchanged)
- All existing API endpoints (unchanged)
- Validation rules (reused from existing submit logic)
