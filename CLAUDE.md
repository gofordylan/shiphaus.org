# Shiphaus

## Philosophy

Prefer the simplest solution that works. A DM link beats a form. A static page beats a database. Don't add infrastructure (APIs, databases, queues) when a link, a spreadsheet, or a manual process will do. Every dependency is a liability -- earn it with volume, not speculation.

Simple but not sloppy. Shiphaus is a personal brand vehicle for everyone involved -- credibility matters. Look for moments of magic and exceptional attention to detail. Use `/frontend-design` and `/copy-doctor` skills to push quality before shipping. An extra pass to tighten copy or refine a hover state is always worth it.

## Copy

All user-facing copy should be reviewed before shipping. Run `/copy-doctor` on any page with new or changed headlines, subheads, or CTAs.

**Voice:** Short parallel phrases. Period-separated beats over long clauses. The homepage sets the tone: "Start at 10. Ship by 5." / "Everyone Ships. No One Quits." / "14 builders. 14 products. One day." Match this rhythm everywhere.

**Rules:**
- Active voice, strong verbs, benefit-first
- Cut filler -- if a dash or comma can become a period, use a period
- No gatekeeping language -- Shiphaus is open to anyone who wants to build, not just experienced devs
- Specific beats vague -- "14 builders" not "many builders"

## Design System

Follow these guidelines for all UI work. The homepage (`src/app/page.tsx`) and `globals.css` are the source of truth.

## Color Tokens (CSS Variables)

```
--bg-primary: #FAFAF8        (warm off-white)
--bg-secondary: #F3F2EE      (light warm gray)
--bg-tertiary: #EBEAE5

--text-primary: #1A1A1A       (deep charcoal)
--text-secondary: #4A4A4A
--text-muted: #7A7A7A

--accent: #FF6B35              (vibrant orange)
--accent-hover: #E85A28
--accent-soft: #FFF0EB

--border-subtle: rgba(26,26,26,0.08)
--border-strong: rgba(26,26,26,0.15)
```

Section backgrounds alternate: `bg-primary` / `bg-secondary`. Dark sections use `bg-[var(--text-primary)]` with white text.

## Typography

- **Display font**: Instrument Sans (`font-display`) -- headings, UI chrome
- **Body font**: Newsreader (`font-body`) -- paragraphs, descriptions, quotes
- **H1**: `text-5xl md:text-6xl font-bold tracking-tight`
- **H2**: `text-3xl md:text-4xl font-bold`
- **Body text**: `font-body` class, `text-[var(--text-secondary)]`

## Spacing

- Sections: `py-20` (consistent, not `py-16 md:py-20`)
- Containers: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Section content gaps: `mb-12` between header and content

## Components

- **CTA buttons**: always use `.btn-primary` class (defined in globals.css). Never hand-roll button styles.
- **Cards**: use `.card` class. Includes `rounded-xl`, border, hover shadow.
- **Border radius**: `rounded-xl` or `rounded-2xl` for images, cards, and containers. Never use sharp corners (`rounded-sm`, `rounded-none`).

## Animations (Framer Motion)

- `initial={{ opacity: 0, y: 20 }}` -- standard fade-up
- `viewport={{ once: true }}` -- always set for scroll-triggered animations
- Duration: 0.5-0.6s for content, 0.8s max for hero elements
- Stagger: `delay: index * 0.1`
- **No custom cubic-bezier easing** -- use framer-motion defaults
- No spring physics or scale animations on content (reserve for micro-interactions)

## Grain Texture

The global `body::before` in `globals.css` handles the grain overlay. Never add duplicate grain textures in page components.

## Images

- Hero/feature images: `rounded-2xl overflow-hidden shadow-2xl`
- Avatars: `rounded-full`
- Always use `next/image` with explicit dimensions or `fill`
- Never reuse the same image on multiple pages -- better to have no image than a recycled one
- New pages must match the homepage's visual language. Check spacing, border-radius, animation patterns, and component classes before shipping.
