# Start a Chapter Page Design

**Date:** 2026-02-03
**Route:** `/start-a-chapter`
**Purpose:** Allow people to apply to become a Shiphaus chapter lead

## Overview

A standalone application page where prospective chapter leads can submit their information. Form submissions are stored in Vercel KV for review.

## Page Structure

### Header Component
- Fixed position at top
- Dark background with backdrop blur (matches existing site aesthetic)
- Left: "Shiphaus" logo/text that links to home (`/`)
- Right: "← Back" link to home
- Responsive padding and spacing

### Layout
- Single-column centered layout (max-w-2xl)
- Dark background (`#0a0a0a`)
- White text with gray-400 for secondary content
- Yellow-400 accent color for CTAs and highlights
- All sections use Framer Motion fade-in animations

### Main Sections (top to bottom)
1. Hero (headline + subhead)
2. Why Lead (5 bullet points)
3. Application Form
4. Success State (shown after submission)

## Hero Section

**Headline:** "Run Shiphaus in Your City"
- Styling: text-4xl or text-5xl, font-bold

**Subhead:** "Curate the builders. Find a space. Watch magic happen."
- Styling: text-xl, gray-400
- Spacing: mb-12 to mb-16 below

## Why Lead Section

**Title:** "Why Lead"
- Styling: text-2xl, font-bold, mb-6

**5 Bullet Points:**
Each with yellow arrow icon prefix (`→` or ArrowRight from lucide-react in yellow-400)

1. You curate the room
2. You watch ideas ship in 7 hours
3. You make friends by making things
4. You're connected to leads across cities
5. You're early

Styling: gap-4 between items, clean list presentation

## Application Form

### Container Styling
- Background: `bg-white/5`
- Border: `border-white/10`
- Rounded corners: rounded-xl or rounded-2xl
- Padding: p-6 md:p-8

### Input Styling (consistent across all fields)
- Background: `bg-white/5`
- Border: `border-white/10`
- Focus state: `focus:border-yellow-400/50`
- Text: white
- Placeholder: gray-500

### Form Fields

| Field | Name | Required | Type | Layout | Placeholder |
|-------|------|----------|------|--------|-------------|
| Name | `name` | Yes | text | 2-col grid with Email on md+ | — |
| Email | `email` | Yes | email | 2-col grid with Name on md+ | — |
| City | `city` | Yes | text | Full width | "Where would you run Shiphaus?" |
| Twitter/X | `twitter` | No | text | 2-col grid with LinkedIn on md+ | "@handle" |
| LinkedIn | `linkedin` | No | text | 2-col grid with Twitter on md+ | "linkedin.com/in/..." |
| What do you build? | `whatYouBuild` | Yes | textarea (2 rows) | Full width | "Apps, hardware, content, communities..." |
| Why do you want to run a chapter? | `why` | Yes | textarea (3 rows) | Full width | — |
| Who would you invite to your first event? | `whoYouInvite` | No | textarea (2 rows) | Full width | "Doesn't have to be names — types of people, communities, etc." |

### Submit Button
- Text: "Let's chat"
- Background: bg-yellow-400
- Text color: text-black
- Layout: Full width on mobile, auto width on desktop
- Animations: Hover/tap via Framer Motion
- Disabled state during submission

## Success State

Uses AnimatePresence to replace form (same pattern as EmailCapture component).

**Content (centered):**
- 🚀 emoji (text-4xl or larger)
- "You're in." (text-2xl, font-bold)
- "We'll reach out soon to chat about bringing Shiphaus to {city}." (text-lg, gray-400)
- "Back to Home" button (yellow styling, links to `/`)

**Animation:** Fade-in on appearance

## API Design

### POST `/api/lead`

**Request body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "city": "string (required)",
  "twitter": "string (optional)",
  "linkedin": "string (optional)",
  "whatYouBuild": "string (required)",
  "why": "string (required)",
  "whoYouInvite": "string (optional)"
}
```

**Process:**
1. Validate required fields (name, email, city, whatYouBuild, why)
2. Validate email format using regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
3. Generate unique ID: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
4. Store to Vercel KV:
   - Application data: `hset(id, { ...formData, timestamp })`
   - Add to list: `rpush('lead_applications', id)`
5. Return `{ success: true, id }`

**Response:**
```json
{
  "success": true,
  "id": "lead_1234567890_abc123"
}
```

**Error handling:**
- 400: Invalid or missing required fields
- 500: Server error with generic message

### GET `/api/lead`

**Purpose:** Admin endpoint to view all applications

**Process:**
1. Fetch all IDs from `lead_applications` list
2. Retrieve each full application from KV using the IDs
3. Return array of applications

**Response:**
```json
{
  "applications": [
    {
      "id": "lead_1234567890_abc123",
      "name": "...",
      "email": "...",
      "city": "...",
      "twitter": "...",
      "linkedin": "...",
      "whatYouBuild": "...",
      "why": "...",
      "whoYouInvite": "...",
      "timestamp": "2026-02-03T..."
    }
  ]
}
```

## Technical Implementation Notes

### Dependencies
- `@vercel/kv` - Already installed in package.json
- `framer-motion` - Already installed
- `lucide-react` - Already installed (for arrow icons)

### File Structure
```
src/
├── app/
│   ├── start-a-chapter/
│   │   └── page.tsx          # Main page component
│   └── api/
│       └── lead/
│           └── route.ts       # API endpoint
```

### Vercel KV Setup
- Database already exists (used for email subscriptions)
- No additional setup required
- Environment variables auto-injected by Vercel

## Design Principles

- **Standalone experience:** Minimal distractions, focused on the application
- **Consistent with site:** Uses same color palette, typography, and animations
- **Mobile-first:** Responsive grid for form fields
- **Progressive disclosure:** Success state only shown after submission
- **Clear validation:** Client-side validation before API call
- **Error handling:** Graceful error states with retry options
