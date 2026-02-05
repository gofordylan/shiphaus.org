import { Chapter, Event, Project, Testimonial } from '@/types';

export const chapterColorMap: Record<string, string> = {
  'chapter-ny': '#2D5BFF',
  'chapter-chicago': '#8B5CF6',
  'chapter-boulder': '#10B981',
  'chapter-malaysia': '#F59E0B',
};

export const chapters: Chapter[] = [
  {
    id: 'new-york',
    city: 'New York',
    country: 'USA',
    lead: {
      name: 'Slobo',
      handle: '@AlexSlobodnik',
      avatar: '/avatars/slobo.jpeg',
      x: 'https://x.com/AlexSlobodnik',
      github: 'https://github.com/aslobodnik',
      website: 'https://justslobo.com',
      isFounder: true,
    },
    color: 'chapter-ny',
  },
  {
    id: 'chicago',
    city: 'Chicago',
    country: 'USA',
    lead: {
      name: 'Kirill Polevoy',
      handle: '@polevoy_kirill',
      avatar: 'https://pbs.twimg.com/profile_images/1475225953563561984/7YiRwkGF_400x400.jpg',
      x: 'https://x.com/polevoy_kirill',
      github: 'https://github.com/kirillpolevoy',
    },
    color: 'chapter-chicago',
  },
  {
    id: 'boulder',
    city: 'Boulder',
    country: 'USA',
    lead: {
      name: 'Dawson Botsford',
      handle: '@DawsonBotsford',
      avatar: 'https://pbs.twimg.com/profile_images/1557792534734069760/MS04axwE_400x400.png',
      x: 'https://x.com/DawsonBotsford',
      github: 'https://github.com/dawsbot',
      website: 'https://dawsonbotsford.com',
    },
    color: 'chapter-boulder',
  },
  {
    id: 'malaysia',
    city: 'Network School',
    country: 'Malaysia',
    lead: {
      name: 'Dylan',
      handle: '@gofordylan',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIqSddDDj3zpXMWiIHz7It2SXAf3baAv2nWspKsbMo4l2fkFiJ9qA=s96-c',
      x: 'https://x.com/gofordylan',
      github: 'https://github.com/gofordylan',
      website: 'https://dylanbrodeur.org',
      isFounder: true,
    },
    color: 'chapter-malaysia',
  },
];

export const events: Event[] = [
  {
    id: 'ny-zero-to-one',
    chapterId: 'new-york',
    name: 'Zero to One Day',
    date: '2026-01-11',
    location: 'New York',
    builderCount: 14,
    projectCount: 14,
  },
  {
    id: 'ny-shiphaus-jan-2026',
    chapterId: 'new-york',
    name: 'Shiphaus NY #2',
    date: '2026-01-24',
    location: 'Upstate New York',
    builderCount: 6,
    projectCount: 6,
  },
];

export const projects: Project[] = [
  // Event 1: Zero to One Day (Jan 11, 2026)
  {
    id: 'proj-kings-game',
    title: 'Kings Game',
    description: 'A fast, constraint-based logic puzzle in the same family as Sudoku. Place exactly one King in every row, column, and region within a 8x8 grid.',
    deployedUrl: 'https://kings-puzzle.vercel.app/',
    githubUrl: 'https://github.com/gskrovina/kings-puzzle',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Garrett Skrovina',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKWgO70di1Sjskv7bR0UBh1kXRYW7ZXFWgcN9b-RGSBz6KNldHI=s96-c',
      uid: 'garrett-skrovina',
    },
  },
  {
    id: 'proj-browser-rpc',
    title: 'Browser RPC',
    description: 'A local RPC proxy that routes Ethereum transactions through your browser wallet for easier and more secure scripting.',
    deployedUrl: 'https://www.npmjs.com/package/browser-rpc',
    githubUrl: 'https://github.com/gskril/browser-rpc',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Greg Skriloff',
      avatar: 'https://pbs.twimg.com/profile_images/1134494299104731136/NQ0AB5DD_400x400.jpg',
      uid: 'greg-skriloff',
    },
  },
  {
    id: 'proj-stash-md-1',
    title: 'Stash MD',
    description: 'Extend what Claude can do. Install or share Claude skills in seconds.',
    deployedUrl: 'https://stash.md',
    githubUrl: 'https://github.com/aslobodnik/stashmd',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Alex Slobodnik',
      avatar: '/avatars/slobo.jpeg',
      uid: 'alex-slobodnik',
    },
  },
  {
    id: 'proj-matrix-site',
    title: 'Matrix Site',
    description: 'Personal portfolio site with a hand-built matrix animation that creates gravity wells distorting characters when you scroll.',
    deployedUrl: 'https://www.dereknelson.dev/',
    githubUrl: 'https://github.com/dereknelson/portfolio/',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Derek Nelson',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLJLLPP8wssdy_4YToPU-_V4odfQ2IAWUKLWdcBmM-t-fRU=s96-c',
      uid: 'derek-nelson',
    },
  },
  {
    id: 'proj-relate',
    title: 'Relate',
    description: 'Helps people make sense of relationship conflicts by showing what\'s really driving them emotionally, so they can move forward with clarity.',
    deployedUrl: 'https://relateapp.io/',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Chris Carlson',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIX80qDaO2pmOnxNi8zJlzeaxNlNUkdXW7MLt9KAobtxUb5OWf2=s96-c',
      uid: 'chris-carlson',
    },
  },
  {
    id: 'proj-slingshot',
    title: 'Slingshot',
    description: 'A high-signal directory of cracked builders.',
    deployedUrl: 'https://builders.slingshot.ac/',
    githubUrl: 'https://github.com/igoryuzo',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Igor Yuzovitskiy',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLw1SkzwZnMSs9IVER_3LkEUNAtpAnaeErDTYvwiZXqXDTI-qNrog=s96-c',
      uid: 'igor-yuzovitskiy',
    },
  },
  {
    id: 'proj-dillydally',
    title: 'Dillydally',
    description: 'Your detour guide: for when you don\'t want the fastest route, you want the funnest, most dynamic, interesting route.',
    deployedUrl: 'https://dillydally.today',
    githubUrl: 'https://github.com/leftwayai/dillydally',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Daniel James',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKpkg_1c12b754d8GpH1Uxz6RDEV5_QQTIqjggxLzmKvQhK78iIoQ=s96-c',
      uid: 'daniel-james',
    },
  },
  {
    id: 'proj-vitalik-reader',
    title: 'Vitalik Reader',
    description: 'Vitalik\'s posts for dumb people and more fun social and reading features.',
    deployedUrl: 'https://vitalikreader.xyz',
    githubUrl: 'https://github.com/pu5ha/vitalik-reader',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Jason Chaskin',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLGK3Ws_0tGRenGmP-WjTS2cuPRf-XSg6vyDYycN0grchPsl7k=s96-c',
      uid: 'jason-chaskin',
    },
  },
  {
    id: 'proj-gifto',
    title: 'Gifto',
    description: 'The key to thoughtful gift giving. Track who and what to get for friends and family and get reminded when to buy.',
    deployedUrl: 'https://gifto-plum.vercel.app/',
    githubUrl: 'https://github.com/dbro20/gifto',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Dylan Brodeur',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIqSddDDj3zpXMWiIHz7It2SXAf3baAv2nWspKsbMo4l2fkFiJ9qA=s96-c',
      uid: 'dylan-brodeur',
    },
  },
  {
    id: 'proj-prompt-arena',
    title: 'Prompt Arena',
    description: 'A weekly contest for creating memes as miniapps. Like Chopped or Yapster, but for viral miniapps.',
    deployedUrl: 'https://base.app/app/promptarena.xyz',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Dylan Steck',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJCzP9nEUDQ1xASfXQPeGkY6HgZW5VjJ1Cda_fO6r-41mrYIbaGhQ=s96-c',
      uid: 'dylan-steck',
    },
  },
  {
    id: 'proj-peeples-donuts',
    title: 'Peeples Donuts',
    description: 'Mining pool for the donut ecosystem.',
    deployedUrl: 'https://peeplesdonuts.shop',
    githubUrl: 'https://github.com/saltoriousSIG/peeples-web-app',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Saltorious',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocItib6nO88aNB4Vx6Twk3UKR26snRA_8CjwE9sP3T2QKR5HGA=s96-c',
      uid: 'saltorious',
    },
  },
  {
    id: 'proj-expedition-33',
    title: 'Expedition 33',
    description: 'Yearlong Personal OS.',
    deployedUrl: 'https://expedition-beta.vercel.app/',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Steen',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLbOyQ5BQolZtLkhfRGA5OuxMqLTsRJVTOVgygqMLsA9Xu4bDd8=s96-c',
      uid: 'steen',
    },
  },
  {
    id: 'proj-x407',
    title: 'x407 Prototype',
    description: 'A protocol for internet-native decentralized identity for humans and agents. Works alone or with x402.',
    deployedUrl: 'https://x407demo.vercel.app/',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Wayne Chang',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocK3863tlvCT_VsDLQnpdr25F0LrKdVRbY3LTYwoSYMHV8AuPfo=s96-c',
      uid: 'wayne-chang',
    },
  },
  {
    id: 'proj-dino-rest',
    title: 'Dino.rest',
    description: 'Competitive productivity.',
    deployedUrl: 'https://dino.rest/',
    githubUrl: 'https://github.com/bobbyslife/DinoTamagotchi',
    createdAt: '2026-01-11',
    chapterId: 'new-york',
    eventId: 'ny-zero-to-one',
    builder: {
      name: 'Bobby Thakkar',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLouzmoT4wJB02F0qX5Gqiire4JN2-u7ZfqWTbHOivR99qXSvAQ=s96-c',
      uid: 'bobby-thakkar',
    },
  },
  // Event 2: Shiphaus NY #2 (Jan 24, 2026)
  {
    id: 'proj-stash-md-2',
    title: 'Stash.md',
    description: 'Share Claude skills and see what they do.',
    deployedUrl: 'https://stash.md',
    githubUrl: 'https://github.com/aslobodnik/stashmd',
    createdAt: '2026-01-24',
    chapterId: 'new-york',
    eventId: 'ny-shiphaus-jan-2026',
    builder: {
      name: 'Alex Slobodnik',
      avatar: '/avatars/slobo.jpeg',
      uid: 'alex-slobodnik-2',
    },
  },
  {
    id: 'proj-amnesia',
    title: 'Amnesia',
    description: 'Notes app that deletes itself every 24 hours.',
    githubUrl: 'https://github.com/dawsbot/amnesia',
    createdAt: '2026-01-24',
    chapterId: 'new-york',
    eventId: 'ny-shiphaus-jan-2026',
    builder: {
      name: 'Dawson Botsford',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=DawsonBotsford&backgroundColor=d1f4d1',
      uid: 'dawson-botsford',
    },
  },
  {
    id: 'proj-numa',
    title: 'Numa',
    description: 'AI Assistants in WhatsApp.',
    createdAt: '2026-01-24',
    chapterId: 'new-york',
    eventId: 'ny-shiphaus-jan-2026',
    builder: {
      name: 'Igor Yuzo',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLw1SkzwZnMSs9IVER_3LkEUNAtpAnaeErDTYvwiZXqXDTI-qNrog=s96-c',
      uid: 'igor-yuzo',
    },
  },
  {
    id: 'proj-dune-downloader',
    title: 'Dune Downloader',
    description: 'Export Query Results from Dune for a small fee instead of expensive plan.',
    deployedUrl: 'https://dune.gregskril.com/',
    createdAt: '2026-01-24',
    chapterId: 'new-york',
    eventId: 'ny-shiphaus-jan-2026',
    builder: {
      name: 'Greg Skriloff',
      avatar: 'https://pbs.twimg.com/profile_images/1134494299104731136/NQ0AB5DD_400x400.jpg',
      uid: 'greg-skriloff-2',
    },
  },
  {
    id: 'proj-mochi',
    title: 'Mochi',
    description: 'AI assistant in iMessage.',
    createdAt: '2026-01-24',
    chapterId: 'new-york',
    eventId: 'ny-shiphaus-jan-2026',
    builder: {
      name: 'Dylan Brodeur',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIqSddDDj3zpXMWiIHz7It2SXAf3baAv2nWspKsbMo4l2fkFiJ9qA=s96-c',
      uid: 'dylan-brodeur-2',
    },
  },
  {
    id: 'proj-tumbleops',
    title: 'TumbleOps',
    description: 'Servicing SaaS for Laundromats.',
    githubUrl: 'https://github.com/kirillpolevoy/tumbleops',
    createdAt: '2026-01-24',
    chapterId: 'new-york',
    eventId: 'ny-shiphaus-jan-2026',
    builder: {
      name: 'Kirill Polevoy',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=KirillPolovey&backgroundColor=c0aede',
      uid: 'kirill-polovey',
    },
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    quote: "January 11th 2026 (Shiphaus NYC #1), changed the way I think forever.",
    author: 'Jason Chaskin',
    role: 'Ethereum Foundation',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLGK3Ws_0tGRenGmP-WjTS2cuPRf-XSg6vyDYycN0grchPsl7k=s96-c',
    chapterId: 'new-york',
  },
  {
    id: 'test-2',
    quote: "Fun Day!",
    author: 'Greg Skriloff',
    role: 'Software Engineer',
    avatar: 'https://pbs.twimg.com/profile_images/1134494299104731136/NQ0AB5DD_400x400.jpg',
    chapterId: 'new-york',
  },
  {
    id: 'test-3',
    quote: "How I spend my Sundays.",
    author: 'Igor Yuzovitskiy',
    role: 'Founder, Slingshot',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLw1SkzwZnMSs9IVER_3LkEUNAtpAnaeErDTYvwiZXqXDTI-qNrog=s96-c',
    chapterId: 'new-york',
  },
];

export function getChapter(id: string): Chapter | undefined {
  return chapters.find(c => c.id === id);
}

export function getChapterEvents(chapterId: string): Event[] {
  return events.filter(e => e.chapterId === chapterId);
}

export function getChapterProjects(chapterId: string): Project[] {
  return projects.filter(p => p.chapterId === chapterId);
}

export function getChapterTestimonials(chapterId: string): Testimonial[] {
  return testimonials.filter(t => t.chapterId === chapterId || !t.chapterId);
}

