# Upstash Redis Setup

This project uses Upstash Redis for storing email subscriptions and chapter lead applications.

## Environment Variables

You need three environment variables configured in Vercel:

| Variable | Purpose |
|----------|---------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis authentication token |
| `ADMIN_API_KEY` | Secret key for retrieving applications via `GET /api/lead` |

## Setup Steps

### 1. Create Upstash Redis Database

Go to [console.upstash.com](https://console.upstash.com/) and create a new Redis database.

### 2. Copy Credentials

From the Upstash console, copy:
- **REST URL** → use as `UPSTASH_REDIS_REST_URL`
- **REST Token** → use as `UPSTASH_REDIS_REST_TOKEN`

### 3. Generate Admin API Key

Create a secure random string for `ADMIN_API_KEY`. This protects the endpoint that retrieves submitted applications.

```bash
# Generate a secure key
openssl rand -hex 32
```

### 4. Add to Vercel

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
ADMIN_API_KEY=your-generated-secret
```

### 5. Deploy

Push to your branch or trigger a deployment. Vercel will use the new environment variables.

## Local Development

**You don't need Redis credentials for local development.** The API endpoints automatically detect when credentials are missing and switch to dev mode:

- Form submissions log to console instead of Redis
- No rate limiting applied
- Full UI flow works for testing

To test with real Redis locally, create `.env.local`:

```bash
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
ADMIN_API_KEY=your-secret
```

## API Endpoints

### POST /api/lead
Submit a chapter lead application. Rate limited to 3 requests/hour per IP.

### GET /api/lead
Retrieve all submitted applications. Requires authentication.

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_API_KEY" \
  https://shiphaus.org/api/lead
```

### POST /api/subscribe
Subscribe an email to the newsletter. Rate limited to 5 requests/hour per IP.

## Viewing Data

### Via API
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_API_KEY" \
  https://shiphaus.org/api/lead
```

### Via Upstash Console
Go to [console.upstash.com](https://console.upstash.com/) → Your Database → Data Browser

Data keys:
- `lead_applications` - list of application IDs
- `lead_emails` - set of submitted emails (for duplicate prevention)
- `lead_*` - individual application records
- `subscribers` - set of newsletter emails

## Troubleshooting

**Form works locally but not in production?**
- Check that all three env vars are set in Vercel
- Verify there are no typos in the Upstash URL/token
- Check Vercel function logs for errors

**Getting 429 Too Many Requests?**
- Rate limiting is active: 3/hour for lead applications, 5/hour for subscriptions
- Wait an hour or test from a different IP

**Getting 401 Unauthorized on GET /api/lead?**
- Ensure `ADMIN_API_KEY` is set in Vercel
- Use `Authorization: Bearer YOUR_KEY` header (not just the key)
