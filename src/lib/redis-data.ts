import { redis } from './redis';
import { Project, Event } from '@/types';

// ─── Key Helpers ─────────────────────────────────────────────

const KEYS = {
  projects: 'shiphaus:projects',
  project: (id: string) => `shiphaus:project:${id}`,
  projectsByChapter: (chapterId: string) => `shiphaus:projects:chapter:${chapterId}`,
  projectsByEvent: (eventId: string) => `shiphaus:projects:event:${eventId}`,
  featuredProjects: 'shiphaus:projects:featured',
  events: 'shiphaus:events',
  event: (id: string) => `shiphaus:event:${id}`,
  eventsByChapter: (chapterId: string) => `shiphaus:events:chapter:${chapterId}`,
};

// ─── Serialization helpers ───────────────────────────────────

function serializeProject(project: Project): Record<string, string> {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    deployedUrl: project.deployedUrl || '',
    githubUrl: project.githubUrl || '',
    createdAt: project.createdAt,
    chapterId: project.chapterId,
    eventId: project.eventId || '',
    builder: JSON.stringify(project.builder),
    type: project.type || '',
    featured: project.featured ? '1' : '0',
    submittedBy: project.submittedBy || '',
    screenshotUrl: project.screenshotUrl || '',
  };
}

function deserializeProject(data: Record<string, unknown>): Project {
  // Upstash auto-deserializes JSON strings, so builder may be object or string
  const builder = typeof data.builder === 'string' ? JSON.parse(data.builder) : data.builder;
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    deployedUrl: data.deployedUrl || undefined,
    githubUrl: data.githubUrl || undefined,
    createdAt: data.createdAt,
    chapterId: data.chapterId,
    eventId: data.eventId || undefined,
    builder,
    type: data.type || undefined,
    featured: data.featured === '1' || data.featured === 1,
    submittedBy: data.submittedBy || data.approvedBy || undefined,
    screenshotUrl: data.screenshotUrl || undefined,
  } as Project;
}

function serializeEvent(event: Event): Record<string, string> {
  return {
    id: event.id,
    chapterId: event.chapterId,
    title: event.title,
    date: event.date,
    location: event.location,
    builderCount: String(event.builderCount),
    projectCount: String(event.projectCount),
    status: event.status || 'closed',
    lumaUrl: event.lumaUrl || '',
    imageUrl: event.imageUrl || '',
  };
}

function deserializeEvent(data: Record<string, string>): Event {
  return {
    id: data.id,
    chapterId: data.chapterId,
    // Backward compat: fall back to `name` if `title` missing
    title: data.title || data.name || '',
    date: data.date,
    location: data.location,
    builderCount: parseInt(data.builderCount, 10),
    projectCount: parseInt(data.projectCount, 10),
    status: data.status || undefined,
    lumaUrl: data.lumaUrl || undefined,
    imageUrl: data.imageUrl || undefined,
  } as Event;
}

// ─── Projects ────────────────────────────────────────────────

export async function getAllProjects(): Promise<Project[]> {
  const ids = await redis.smembers(KEYS.projects);
  if (!ids.length) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(KEYS.project(id));
  }
  const results = await pipeline.exec();
  return results
    .filter((r): r is Record<string, unknown> => r !== null && typeof r === 'object')
    .map(deserializeProject);
}

export async function getProjectsByChapter(chapterId: string): Promise<Project[]> {
  const ids = await redis.smembers(KEYS.projectsByChapter(chapterId));
  if (!ids.length) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(KEYS.project(id));
  }
  const results = await pipeline.exec();
  return results
    .filter((r): r is Record<string, unknown> => r !== null && typeof r === 'object')
    .map(deserializeProject);
}

export async function getProjectsByEvent(eventId: string): Promise<Project[]> {
  const ids = await redis.smembers(KEYS.projectsByEvent(eventId));
  if (!ids.length) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(KEYS.project(id));
  }
  const results = await pipeline.exec();
  return results
    .filter((r): r is Record<string, unknown> => r !== null && typeof r === 'object')
    .map(deserializeProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const ids = await redis.smembers(KEYS.featuredProjects);
  if (!ids.length) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(KEYS.project(id));
  }
  const results = await pipeline.exec();
  return results
    .filter((r): r is Record<string, unknown> => r !== null && typeof r === 'object')
    .map(deserializeProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const data = await redis.hgetall(KEYS.project(id));
  if (!data || Object.keys(data).length === 0) return null;
  return deserializeProject(data as Record<string, unknown>);
}

export async function createProject(project: Project): Promise<void> {
  const pipeline = redis.pipeline();
  pipeline.hset(KEYS.project(project.id), serializeProject(project));
  pipeline.sadd(KEYS.projects, project.id);
  pipeline.sadd(KEYS.projectsByChapter(project.chapterId), project.id);
  if (project.eventId) {
    pipeline.sadd(KEYS.projectsByEvent(project.eventId), project.id);
  }
  if (project.featured) {
    pipeline.sadd(KEYS.featuredProjects, project.id);
  }
  await pipeline.exec();
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<void> {
  const existing = await getProjectById(id);
  if (!existing) throw new Error(`Project ${id} not found`);

  const updated = { ...existing, ...updates };
  await redis.hset(KEYS.project(id), serializeProject(updated));
}

export async function deleteProject(id: string): Promise<void> {
  const project = await getProjectById(id);
  if (!project) return;

  const pipeline = redis.pipeline();
  pipeline.del(KEYS.project(id));
  pipeline.srem(KEYS.projects, id);
  pipeline.srem(KEYS.projectsByChapter(project.chapterId), id);
  pipeline.srem(KEYS.featuredProjects, id);
  if (project.eventId) {
    pipeline.srem(KEYS.projectsByEvent(project.eventId), id);
  }
  await pipeline.exec();
}

export async function toggleFeatured(id: string): Promise<boolean> {
  const isFeatured = await redis.sismember(KEYS.featuredProjects, id);
  if (isFeatured) {
    await redis.srem(KEYS.featuredProjects, id);
    await redis.hset(KEYS.project(id), { featured: '0' });
    return false;
  } else {
    await redis.sadd(KEYS.featuredProjects, id);
    await redis.hset(KEYS.project(id), { featured: '1' });
    return true;
  }
}

// ─── Events ──────────────────────────────────────────────────

export async function getAllEvents(): Promise<Event[]> {
  const ids = await redis.smembers(KEYS.events);
  if (!ids.length) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(KEYS.event(id));
  }
  const results = await pipeline.exec();
  return results
    .filter((r): r is Record<string, string> => r !== null && typeof r === 'object')
    .map(deserializeEvent);
}

export async function getEventsByChapter(chapterId: string): Promise<Event[]> {
  const ids = await redis.smembers(KEYS.eventsByChapter(chapterId));
  if (!ids.length) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(KEYS.event(id));
  }
  const results = await pipeline.exec();
  return results
    .filter((r): r is Record<string, string> => r !== null && typeof r === 'object')
    .map(deserializeEvent);
}

export async function getEventById(id: string): Promise<Event | null> {
  const data = await redis.hgetall(KEYS.event(id));
  if (!data || Object.keys(data).length === 0) return null;
  return deserializeEvent(data as Record<string, string>);
}

export async function createEvent(event: Event): Promise<void> {
  const pipeline = redis.pipeline();
  pipeline.hset(KEYS.event(event.id), serializeEvent(event));
  pipeline.sadd(KEYS.events, event.id);
  pipeline.sadd(KEYS.eventsByChapter(event.chapterId), event.id);
  await pipeline.exec();
}

export async function updateEvent(id: string, updates: Partial<Event>): Promise<void> {
  const existing = await getEventById(id);
  if (!existing) throw new Error(`Event ${id} not found`);

  const updated = { ...existing, ...updates };
  await redis.hset(KEYS.event(id), serializeEvent(updated));
}

export async function deleteEvent(id: string): Promise<void> {
  const event = await getEventById(id);
  if (!event) return;

  const pipeline = redis.pipeline();
  pipeline.del(KEYS.event(id));
  pipeline.srem(KEYS.events, id);
  pipeline.srem(KEYS.eventsByChapter(event.chapterId), id);
  await pipeline.exec();
}

// ─── Stats ───────────────────────────────────────────────────

export async function getStats(): Promise<{
  totalProjects: number;
  featuredProjects: number;
  totalEvents: number;
}> {
  const [totalProjects, featuredProjects, totalEvents] = await Promise.all([
    redis.scard(KEYS.projects),
    redis.scard(KEYS.featuredProjects),
    redis.scard(KEYS.events),
  ]);

  return {
    totalProjects,
    featuredProjects,
    totalEvents,
  };
}
