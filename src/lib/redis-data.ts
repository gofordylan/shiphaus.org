import { redis } from './redis';
import { Project, Event, Submission, SubmissionStatus } from '@/types';

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
  submissions: 'shiphaus:submissions:pending',
  submission: (id: string) => `shiphaus:submission:${id}`,
  submissionsByEvent: (eventId: string) => `shiphaus:submissions:event:${eventId}`,
  submissionsByUser: (email: string) => `shiphaus:submissions:user:${email}`,
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
    status: project.status || 'approved',
    approvedAt: project.approvedAt || '',
    approvedBy: project.approvedBy || '',
  };
}

function deserializeProject(data: Record<string, string>): Project {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    deployedUrl: data.deployedUrl || undefined,
    githubUrl: data.githubUrl || undefined,
    createdAt: data.createdAt,
    chapterId: data.chapterId,
    eventId: data.eventId || undefined,
    builder: JSON.parse(data.builder),
    type: data.type || undefined,
    featured: data.featured === '1',
    status: (data.status as SubmissionStatus) || undefined,
    approvedAt: data.approvedAt || undefined,
    approvedBy: data.approvedBy || undefined,
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

function serializeSubmission(sub: Submission): Record<string, string> {
  return {
    id: sub.id,
    title: sub.title,
    description: sub.description,
    type: sub.type,
    deployedUrl: sub.deployedUrl || '',
    githubUrl: sub.githubUrl || '',
    builderName: sub.builderName,
    builderAvatar: sub.builderAvatar || '',
    submittedBy: sub.submittedBy || '',
    chapterId: sub.chapterId || '',
    eventId: sub.eventId || '',
    submittedAt: sub.submittedAt,
    status: sub.status,
  };
}

function deserializeSubmission(data: Record<string, string>): Submission {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    type: data.type,
    deployedUrl: data.deployedUrl || undefined,
    githubUrl: data.githubUrl || undefined,
    builderName: data.builderName,
    builderAvatar: data.builderAvatar || undefined,
    submittedBy: data.submittedBy || '',
    chapterId: data.chapterId || undefined,
    eventId: data.eventId || undefined,
    submittedAt: data.submittedAt,
    status: data.status as SubmissionStatus,
  } as Submission;
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
    .filter((r): r is Record<string, string> => r !== null && typeof r === 'object')
    .map(deserializeProject)
    .filter(p => p.status === 'approved' || !p.status);
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
    .filter((r): r is Record<string, string> => r !== null && typeof r === 'object')
    .map(deserializeProject)
    .filter(p => p.status === 'approved' || !p.status);
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
    .filter((r): r is Record<string, string> => r !== null && typeof r === 'object')
    .map(deserializeProject)
    .filter(p => p.status === 'approved' || !p.status);
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
    .filter((r): r is Record<string, string> => r !== null && typeof r === 'object')
    .map(deserializeProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const data = await redis.hgetall(KEYS.project(id));
  if (!data || Object.keys(data).length === 0) return null;
  return deserializeProject(data as Record<string, string>);
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

// ─── All Projects (admin, includes non-approved) ─────────────

export async function getAllProjectsAdmin(): Promise<Project[]> {
  const ids = await redis.smembers(KEYS.projects);
  if (!ids.length) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(KEYS.project(id));
  }
  const results = await pipeline.exec();
  return results
    .filter((r): r is Record<string, string> => r !== null && typeof r === 'object')
    .map(deserializeProject);
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

// ─── Submissions ─────────────────────────────────────────────

export async function createSubmission(submission: Submission): Promise<void> {
  const pipeline = redis.pipeline();
  pipeline.hset(KEYS.submission(submission.id), serializeSubmission(submission));
  pipeline.zadd(KEYS.submissions, {
    score: new Date(submission.submittedAt).getTime(),
    member: submission.id,
  });
  if (submission.eventId) {
    pipeline.sadd(KEYS.submissionsByEvent(submission.eventId), submission.id);
  }
  if (submission.submittedBy) {
    pipeline.sadd(KEYS.submissionsByUser(submission.submittedBy), submission.id);
  }
  await pipeline.exec();
}

export async function getPendingSubmissions(): Promise<Submission[]> {
  const ids = await redis.zrange(KEYS.submissions, 0, -1);
  if (!ids.length) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(KEYS.submission(id as string));
  }
  const results = await pipeline.exec();
  return results
    .filter((r): r is Record<string, string> => r !== null && typeof r === 'object')
    .map(deserializeSubmission)
    .filter(s => s.status === 'pending');
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const data = await redis.hgetall(KEYS.submission(id));
  if (!data || Object.keys(data).length === 0) return null;
  return deserializeSubmission(data as Record<string, string>);
}

export async function getSubmissionsByEvent(eventId: string): Promise<Submission[]> {
  const ids = await redis.smembers(KEYS.submissionsByEvent(eventId));
  if (!ids.length) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(KEYS.submission(id));
  }
  const results = await pipeline.exec();
  return results
    .filter((r): r is Record<string, string> => r !== null && typeof r === 'object')
    .map(deserializeSubmission);
}

export async function getSubmissionsByUser(email: string): Promise<Submission[]> {
  const ids = await redis.smembers(KEYS.submissionsByUser(email));
  if (!ids.length) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(KEYS.submission(id));
  }
  const results = await pipeline.exec();
  return results
    .filter((r): r is Record<string, string> => r !== null && typeof r === 'object')
    .map(deserializeSubmission);
}

export async function updateSubmission(id: string, updates: Partial<Submission>): Promise<void> {
  const existing = await getSubmissionById(id);
  if (!existing) throw new Error(`Submission ${id} not found`);

  const updated = { ...existing, ...updates };
  await redis.hset(KEYS.submission(id), serializeSubmission(updated));
}

export async function deleteSubmission(id: string): Promise<void> {
  const submission = await getSubmissionById(id);
  if (!submission) return;

  const pipeline = redis.pipeline();
  pipeline.del(KEYS.submission(id));
  pipeline.zrem(KEYS.submissions, id);
  if (submission.eventId) {
    pipeline.srem(KEYS.submissionsByEvent(submission.eventId), id);
  }
  if (submission.submittedBy) {
    pipeline.srem(KEYS.submissionsByUser(submission.submittedBy), id);
  }
  await pipeline.exec();
}

export async function approveSubmission(
  submissionId: string,
  approvedBy: string,
  chapterId?: string,
  eventId?: string,
): Promise<Project> {
  const submission = await getSubmissionById(submissionId);
  if (!submission) throw new Error(`Submission ${submissionId} not found`);

  // Update submission status
  await redis.hset(KEYS.submission(submissionId), { status: 'approved' });
  await redis.zrem(KEYS.submissions, submissionId);

  // Create project from submission
  const projectId = `proj-${submissionId.replace('sub-', '')}`;
  const finalChapterId = chapterId || submission.chapterId || 'new-york';
  const project: Project = {
    id: projectId,
    title: submission.title,
    description: submission.description,
    deployedUrl: submission.deployedUrl,
    githubUrl: submission.githubUrl,
    createdAt: submission.submittedAt,
    chapterId: finalChapterId,
    eventId: eventId || submission.eventId,
    builder: {
      name: submission.builderName,
      avatar: submission.builderAvatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(submission.builderName)}&backgroundColor=c0aede`,
      uid: submission.builderName.toLowerCase().replace(/\s+/g, '-'),
    },
    type: submission.type,
    featured: false,
    status: 'approved',
    approvedAt: new Date().toISOString(),
    approvedBy,
  };

  await createProject(project);
  return project;
}

export async function rejectSubmission(submissionId: string): Promise<void> {
  await redis.hset(KEYS.submission(submissionId), { status: 'rejected' });
  await redis.zrem(KEYS.submissions, submissionId);
}

// ─── Stats ───────────────────────────────────────────────────

export async function getStats(): Promise<{
  totalProjects: number;
  featuredProjects: number;
  totalEvents: number;
  pendingSubmissions: number;
}> {
  const [totalProjects, featuredProjects, totalEvents, pendingSubmissions] = await Promise.all([
    redis.scard(KEYS.projects),
    redis.scard(KEYS.featuredProjects),
    redis.scard(KEYS.events),
    redis.zcard(KEYS.submissions),
  ]);

  return {
    totalProjects,
    featuredProjects,
    totalEvents,
    pendingSubmissions,
  };
}
