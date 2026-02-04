# Upstash Redis Setup Instructions

## Option 1: Direct Upstash Setup

### 1. Create Database at Upstash
Go to: https://console.upstash.com/ → Create Database → Choose region

### 2. Copy Environment Variables
From the Upstash console, copy:
- `UPSTASH_REDIS_REST_URL` → use as `KV_REST_API_URL`
- `UPSTASH_REDIS_REST_TOKEN` → use as `KV_REST_API_TOKEN`

### 3. Add to `.env.local`
```
KV_REST_API_URL=https://your-db.upstash.io
KV_REST_API_TOKEN=your-token
```

## Option 2: Via Vercel Integration

### 1. Add Upstash Integration
Go to: Vercel Dashboard → Integrations → Add Upstash Redis

### 2. Pull Environment Variables
```bash
vercel env pull .env.local
```

## Local Development

```bash
npm install
npm run dev
```

Submit an email at http://localhost:3000

## View Subscribers

**In Upstash Console:**
Go to: console.upstash.com → Your Database → Data Browser

Look for:
- `subscribers` (set of all emails)
- `subscriber:{email}` (details for each subscriber)

## Rate Limiting

The subscribe endpoint is rate limited to 5 requests per minute per IP address.
