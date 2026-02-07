'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { SessionProvider, useSession, signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Calendar, MapPin, Layers, Plus,
  ExternalLink, Github, Settings, Check, X,
  Eye, ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { getChapter, getChapterEvents, getChapterProjects, chapterColorMap } from '@/lib/data';
import { SubmitProjectModal } from '@/components/SubmitProjectModal';
import { Project, Event, EventStatus } from '@/types';

function ChapterContent() {
  const params = useParams();
  const chapterId = params.id as string;
  const chapter = getChapter(chapterId);
  const staticEvents = getChapterEvents(chapterId);
  const staticProjects = getChapterProjects(chapterId);
  const { data: session } = useSession();
  const isAdmin = (session?.user as Record<string, unknown> | undefined)?.isAdmin === true;
  const [adminMode, setAdminMode] = useState(true);
  const showAdmin = isAdmin && adminMode;

  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [events, setEvents] = useState<Event[]>(staticEvents);
  const [submitModal, setSubmitModal] = useState<{ eventId: string; eventName: string } | null>(null);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    fetch(`/api/projects?chapter=${chapterId}`)
      .then(r => r.json())
      .then((data: Project[]) => { if (data.length > 0) setProjects(data); })
      .catch(() => {});
    fetch(`/api/events?chapter=${chapterId}`)
      .then(r => r.json())
      .then((data: Event[]) => { if (data.length > 0) setEvents(data); })
      .catch(() => {});
  }, [chapterId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
          <Link href="/" className="text-[var(--accent)] hover:underline">Return home</Link>
        </div>
      </div>
    );
  }

  const accentColor = chapterColorMap[chapter.color] || '#FF6B35';

  // Group projects by event
  function getEventProjects(eventId: string) {
    return projects.filter(p => p.eventId === eventId);
  }

  // Sort events: reverse chronological
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  async function toggleEventStatus(eventId: string, currentStatus: EventStatus | undefined) {
    const statusMap: Record<string, EventStatus> = {
      upcoming: 'active',
      active: 'closed',
      closed: 'upcoming',
    };
    const newStatus = statusMap[currentStatus || 'closed'] || 'upcoming';

    try {
      await fetch(`/api/admin/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
    } catch {}
  }

  async function handleCreateEvent(data: { name: string; date: string; location: string }) {
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, chapterId }),
      });
      if (res.ok) {
        const event = await res.json();
        setEvents(prev => [event, ...prev]);
        setShowNewEvent(false);
      }
    } catch {}
  }

  async function handleUpdateEvent(eventId: string, data: Partial<Event>) {
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setEvents(prev => prev.map(e => e.id === eventId ? updated : e));
        setEditingEvent(null);
      }
    } catch {}
  }

  function handleSubmitted() {
    setSubmitModal(null);
    setSuccessMessage('Project submitted! It will appear once approved.');
    setTimeout(() => setSuccessMessage(null), 5000);
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative pt-28 pb-16 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 50%), var(--bg-primary)` }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1.5 }}
            className="absolute top-10 right-[20%] w-80 h-80 rounded-full blur-3xl"
            style={{ backgroundColor: `${accentColor}15` }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link
            href="/#chapters"
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All Chapters
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-block w-2 h-12 rounded-full mb-4"
              style={{ backgroundColor: accentColor }}
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{chapter.city}</h1>
            <p className="text-[var(--text-muted)] text-lg mb-6 font-body">{chapter.country}</p>

            {/* Chapter lead card */}
            <div className="card p-4 inline-flex items-center gap-4">
              <img
                src={chapter.lead.avatar}
                alt={chapter.lead.name}
                className="w-12 h-12 rounded-full border-2 object-cover"
                style={{ borderColor: accentColor }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{chapter.lead.name}</span>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ color: accentColor, backgroundColor: `${accentColor}12` }}
                  >
                    {chapter.lead.isFounder ? 'Founder' : 'Lead'}
                  </span>
                </div>
                {chapter.lead.x ? (
                  <a
                    href={chapter.lead.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    {chapter.lead.handle}
                  </a>
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">{chapter.lead.handle}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success toast */}
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

      {/* Admin/User mode toggle */}
      {isAdmin && (
        <button
          onClick={() => setAdminMode((v) => !v)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg border transition-colors cursor-pointer text-sm font-semibold"
          style={{
            backgroundColor: adminMode ? 'var(--accent)' : 'white',
            color: adminMode ? 'white' : 'var(--text-secondary)',
            borderColor: adminMode ? 'var(--accent)' : 'var(--border-strong)',
          }}
        >
          {adminMode ? <ShieldCheck className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {adminMode ? 'Admin' : 'User'}
        </button>
      )}

      {/* Events Section */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-1">Events</h2>
              <p className="text-[var(--text-secondary)] font-body">
                {projects.length} project{projects.length !== 1 ? 's' : ''} shipped across {events.length} event{events.length !== 1 ? 's' : ''}
              </p>
            </motion.div>

            {showAdmin && (
              <button
                onClick={() => setShowNewEvent(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Event
              </button>
            )}
          </div>

          {/* New Event Form */}
          <AnimatePresence>
            {showNewEvent && showAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <EventForm
                  onSubmit={handleCreateEvent}
                  onCancel={() => setShowNewEvent(false)}
                  accentColor={accentColor}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Event list */}
          <div className="space-y-10">
            {sortedEvents.map((event, index) => {
              const eventProjects = getEventProjects(event.id);
              const status = event.status || 'closed';

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  {/* Event header */}
                  <div className="bg-white rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
                    <div className="p-6">
                      {/* Editing mode */}
                      {editingEvent === event.id && showAdmin ? (
                        <EventForm
                          initial={{ name: event.name, date: event.date, location: event.location }}
                          onSubmit={(data) => handleUpdateEvent(event.id, data)}
                          onCancel={() => setEditingEvent(null)}
                          accentColor={accentColor}
                          submitLabel="Save"
                        />
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold">{event.name}</h3>
                                <StatusBadge status={status} />
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
                                <span className="inline-flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                  {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                  {event.location}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                  {eventProjects.length} project{eventProjects.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>

                            {/* Admin controls */}
                            {showAdmin && (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => toggleEventStatus(event.id, event.status)}
                                  className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                                >
                                  {status === 'upcoming' && 'Open Submissions'}
                                  {status === 'active' && 'Close Submissions'}
                                  {status === 'closed' && 'Reopen'}
                                </button>
                                <button
                                  onClick={() => setEditingEvent(event.id)}
                                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                                  title="Edit event"
                                >
                                  <Settings className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Submit button for open events */}
                          {status === 'active' && (
                            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                              {session ? (
                                <button
                                  onClick={() => setSubmitModal({ eventId: event.id, eventName: event.name })}
                                  className="btn-primary text-sm !px-5 !py-2.5"
                                >
                                  Submit Your Project
                                </button>
                              ) : (
                                <button
                                  onClick={() => signIn(undefined, { callbackUrl: `/chapter/${chapterId}` })}
                                  className="text-sm font-medium text-[var(--accent)] hover:underline cursor-pointer"
                                >
                                  Sign in to submit a project
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Projects grid */}
                    {eventProjects.length > 0 && (
                      <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          {eventProjects.map((project) => (
                            <ProjectRow key={project.id} project={project} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Submit modal */}
      {submitModal && (
        <SubmitProjectModal
          eventId={submitModal.eventId}
          eventName={submitModal.eventName}
          chapterId={chapterId}
          onClose={() => setSubmitModal(null)}
          onSubmitted={handleSubmitted}
        />
      )}
    </div>
  );
}

/* ─── Subcomponents ────────────────────────────────────────── */

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

function ProjectRow({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border-subtle)] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <img
          src={project.builder.avatar}
          alt={project.builder.name}
          className="w-9 h-9 rounded-full border border-[var(--border-subtle)] object-cover mt-0.5 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{project.title}</h4>
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
                <ExternalLink className="w-3 h-3" /> Live
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
      </div>
    </div>
  );
}

function EventForm({
  initial,
  onSubmit,
  onCancel,
  accentColor,
  submitLabel = 'Create Event',
}: {
  initial?: { name: string; date: string; location: string };
  onSubmit: (data: { name: string; date: string; location: string }) => void;
  onCancel: () => void;
  accentColor: string;
  submitLabel?: string;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [date, setDate] = useState(initial?.date || '');
  const [location, setLocation] = useState(initial?.location || '');

  return (
    <div
      className="bg-white rounded-xl border-2 p-5 space-y-4"
      style={{ borderColor: `${accentColor}40` }}
    >
      <div className="grid sm:grid-cols-3 gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Event name"
          className="px-3 py-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="px-3 py-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => { if (name && date && location) onSubmit({ name, date, location }); }}
          className="btn-primary text-sm !px-5 !py-2"
        >
          {submitLabel}
        </button>
        <button
          onClick={onCancel}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ─── Page wrapper with SessionProvider ────────────────────── */

export default function ChapterPage() {
  return (
    <SessionProvider>
      <ChapterContent />
    </SessionProvider>
  );
}
