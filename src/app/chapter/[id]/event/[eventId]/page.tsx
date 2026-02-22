'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { SessionProvider, useSession, signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Layers, ExternalLink, Github, Link2,
  ChevronLeft, Check, Pencil, Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { getChapter, getEvent, getProjectsByEvent } from '@/lib/data';
import { SubmitProjectModal } from '@/components/SubmitProjectModal';
import { buildCliPrompt } from '@/lib/cli-prompt';
import { Project, Event, EventStatus } from '@/types';

function EventContent() {
  const params = useParams();
  const chapterId = params.id as string;
  const eventId = params.eventId as string;
  const chapter = getChapter(chapterId);
  const staticEvent = getEvent(eventId);
  const staticProjects = getProjectsByEvent(eventId);
  const { data: session } = useSession();
  const isAdmin = (session?.user as Record<string, unknown> | undefined)?.isAdmin === true;

  const [event, setEvent] = useState<Event | null>(staticEvent || null);
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [submitModal, setSubmitModal] = useState<{ eventId: string; eventTitle: string; editProject?: Project } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cliCopied, setCliCopied] = useState(false);
  const refreshRef = useRef<() => void>(() => {});

  const loadData = useCallback(async (signal?: AbortSignal) => {
    const opts = signal ? { signal } : {};
    try {
      const [projectsRes, eventsRes] = await Promise.all([
        fetch(`/api/projects?event=${eventId}&t=${Date.now()}`, opts),
        fetch(`/api/events?chapter=${chapterId}&t=${Date.now()}`, opts),
      ]);
      const [projectsData, eventsData] = await Promise.all([
        projectsRes.json() as Promise<Project[]>,
        eventsRes.json() as Promise<Event[]>,
      ]);
      if (signal?.aborted) return;
      if (projectsData.length > 0) setProjects(projectsData);
      const apiEvent = eventsData.find((e) => e.id === eventId);
      if (apiEvent && staticEvent) {
        setEvent({ ...staticEvent, ...apiEvent, hostedBy: staticEvent.hostedBy ?? apiEvent.hostedBy });
      } else if (apiEvent) {
        setEvent(apiEvent);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        // Silent fail; static data already shown
      }
    }
  }, [chapterId, eventId, staticEvent]);

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    refreshRef.current = () => loadData();
    return () => controller.abort();
  }, [loadData]);

  async function handleCopyCliPrompt() {
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

  async function handleDeleteProject(projectId: string) {
    try {
      await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setSuccessMessage('Project removed.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {}
  }

  function handleSubmitted(project?: Project) {
    setSubmitModal(null);
    setSuccessMessage('Project submitted!');
    setTimeout(() => setSuccessMessage(null), 5000);
    if (project) setProjects((prev) => [...prev, project]);
    refreshRef.current();
  }

  function formatEventDate(date: string) {
    const d = new Date(date);
    const hasTime = date.includes('T');
    if (hasTime) {
      return d.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
      });
    }
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  if (!chapter || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <Link href={`/chapter/${chapterId}`} className="text-[var(--accent)] hover:underline">
            Back to {chapter?.city || 'chapter'}
          </Link>
        </div>
      </div>
    );
  }

  const status = event.status || 'closed';
  const myProject = projects.find(p => p.submittedBy === session?.user?.email);

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="pt-16 pb-20 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Link
              href={`/chapter/${chapterId}`}
              className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors font-medium text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to {chapter.city} Events
            </Link>
          </motion.div>

          {/* Event card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-[var(--border-subtle)] overflow-hidden"
          >
            {event.imageUrl && (
              <div className="w-full h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{event.title}</h1>
                    <StatusBadge status={status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      {formatEventDate(event.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      {event.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      {projects.length} project{projects.length !== 1 ? 's' : ''}
                    </span>
                    {event.lumaUrl && (
                      <a
                        href={event.lumaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[var(--accent)] hover:underline"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        RSVP
                      </a>
                    )}
                  </div>
                  {event.hostedBy && (
                    <p className="mt-2 text-sm text-[var(--text-muted)] font-body">
                      Hosted at{' '}
                      <a
                        href={event.hostedBy.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline font-medium"
                      >
                        {event.hostedBy.name}
                      </a>
                      {event.hostedBy.tagline && (
                        <span className="italic"> — {event.hostedBy.tagline}</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {status === 'active' && (
                    session ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        {myProject ? (
                          <button
                            onClick={() => setSubmitModal({ eventId: event.id, eventTitle: event.title, editProject: myProject })}
                            className="text-sm px-4 py-2 rounded-lg border border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                          >
                            Edit Project
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setSubmitModal({ eventId: event.id, eventTitle: event.title })}
                              className="btn-primary text-sm !px-5 !py-2"
                            >
                              Submit Project
                            </button>
                            <button
                              onClick={handleCopyCliPrompt}
                              className="text-sm px-4 py-2 rounded-lg border border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                              title="Copy a prompt to paste into Claude Code"
                            >
                              {cliCopied ? 'Copied!' : 'Claude Code'}
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => signIn('google', { callbackUrl: `/chapter/${chapterId}/event/${eventId}` })}
                        className="btn-primary text-sm !px-5 !py-2"
                      >
                        Submit a Project
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Projects */}
              <div className="pt-6 border-t border-[var(--border-subtle)]">
                <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                  Projects ({projects.length})
                </h2>
                {projects.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {projects.map((project) => {
                      const isOwner = session?.user?.email && project.submittedBy === session.user.email;
                      const canEdit = (isOwner && status === 'active') || isAdmin;
                      const canDelete = isOwner || isAdmin;
                      return (
                        <ProjectRow
                          key={project.id}
                          project={project}
                          onEdit={canEdit ? () => setSubmitModal({ eventId: event.id, eventTitle: event.title, editProject: project }) : undefined}
                          onDelete={canDelete ? () => handleDeleteProject(project.id) : undefined}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-muted)] font-body">No projects yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {submitModal && (
        <SubmitProjectModal
          eventId={submitModal.eventId}
          eventName={submitModal.eventTitle}
          chapterId={chapterId}
          initialData={submitModal.editProject}
          onClose={() => setSubmitModal(null)}
          onSubmitted={handleSubmitted}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: EventStatus }) {
  const config = {
    upcoming: { label: 'Upcoming', bg: 'bg-gray-100', text: 'text-gray-600' },
    active: { label: 'Open for Submissions', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    closed: { label: 'Closed', bg: 'bg-[var(--bg-secondary)]', text: 'text-[var(--text-muted)]' },
  };
  const c = config[status] || config.closed;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function ProjectRow({ project, onEdit, onDelete }: { project: Project; onEdit?: () => void; onDelete?: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border-subtle)] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.builder.avatar}
          alt={project.builder.name}
          className="w-9 h-9 rounded-full border border-[var(--border-subtle)] object-cover mt-0.5 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-sm">{project.title}</h4>
            {(onEdit || onDelete) && (
              <div className="flex items-center gap-0.5 shrink-0">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                    title="Edit project"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="p-1 rounded text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)] mb-1">{project.builder.name}</p>
          <p className="text-sm text-[var(--text-secondary)] font-body leading-relaxed line-clamp-2">
            {project.description}
          </p>
          <div className="flex items-center gap-3 mt-2">
            {project.deployedUrl && (
              <a
                href={project.deployedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline"
              >
                <ExternalLink className="w-3 h-3" /> Site
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <Github className="w-3 h-3" /> Source
              </a>
            )}
          </div>
        </div>
        {project.screenshotUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={project.screenshotUrl}
            alt={`${project.title} screenshot`}
            className="w-20 h-14 rounded-lg object-cover border border-[var(--border-subtle)] shrink-0 mt-0.5"
          />
        )}
      </div>
    </div>
  );
}

export default function EventPage() {
  return (
    <SessionProvider>
      <EventContent />
    </SessionProvider>
  );
}
