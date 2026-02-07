'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { SessionProvider, useSession, signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Layers, Plus,
  ExternalLink, Github, Settings, Check,
  Eye, ShieldCheck, Image as ImageIcon, Link2,
  Trash2, ChevronDown, ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import { getChapter, getChapterEvents, getChapterProjects, chapterColorMap } from '@/lib/data';
import { SubmitProjectModal } from '@/components/SubmitProjectModal';
import { Project, Event, EventStatus, Submission } from '@/types';

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
  const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});
  const [userSubmissions, setUserSubmissions] = useState<Submission[]>([]);
  const [submitModal, setSubmitModal] = useState<{ eventId: string; eventTitle: string; editSubmission?: Submission } | null>(null);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedSubmissions, setExpandedSubmissions] = useState<Record<string, boolean>>({});

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

  const fetchUserSubmissions = useCallback(() => {
    if (!session?.user?.email) return;
    fetch('/api/submissions')
      .then(r => r.json())
      .then((data: Submission[]) => setUserSubmissions(data))
      .catch(() => {});
  }, [session?.user?.email]);

  const fetchEventSubmissions = useCallback((eventId: string) => {
    fetch(`/api/admin/submissions?event=${eventId}`)
      .then(r => r.json())
      .then((data: Submission[]) => {
        setSubmissions(prev => ({ ...prev, [eventId]: data }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchUserSubmissions(); }, [fetchUserSubmissions]);

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

  function getEventProjects(eventId: string) {
    return projects.filter(p => p.eventId === eventId);
  }

  function getUserSubmissionsForEvent(eventId: string) {
    return userSubmissions.filter(s => s.eventId === eventId);
  }

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

  async function handleCreateEvent(data: EventFormData) {
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

  async function handleUpdateEvent(eventId: string, data: EventFormData) {
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

  async function handleDeleteSubmission(submissionId: string, eventId: string) {
    try {
      await fetch(`/api/admin/submissions/${submissionId}`, { method: 'DELETE' });
      fetchEventSubmissions(eventId);
      fetchData();
    } catch {}
  }

  async function handleDeleteUserSubmission(submissionId: string) {
    try {
      await fetch(`/api/submissions/${submissionId}`, { method: 'DELETE' });
      fetchUserSubmissions();
      fetchData();
      setSuccessMessage('Project removed.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {}
  }

  function handleSubmitted() {
    setSubmitModal(null);
    setSuccessMessage('Project submitted!');
    setTimeout(() => setSuccessMessage(null), 5000);
    fetchUserSubmissions();
    fetchData();
  }

  function toggleSubmissions(eventId: string) {
    const isExpanded = expandedSubmissions[eventId];
    setExpandedSubmissions(prev => ({ ...prev, [eventId]: !isExpanded }));
    if (!isExpanded && !submissions[eventId]) {
      fetchEventSubmissions(eventId);
    }
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

  return (
    <div className="min-h-screen">

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
      <section className="pt-16 pb-16 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-1">{chapter.city} Events</h2>
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
              const mySubmissions = getUserSubmissionsForEvent(event.id);
              const eventSubs = submissions[event.id] || [];
              const isSubmissionsExpanded = expandedSubmissions[event.id];

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="bg-white rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
                    {/* Event image */}
                    {event.imageUrl && (
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      {/* Editing mode */}
                      {editingEvent === event.id && showAdmin ? (
                        <EventForm
                          initial={{
                            title: event.title,
                            date: event.date,
                            location: event.location,
                            lumaUrl: event.lumaUrl || '',
                            imageUrl: event.imageUrl || '',
                          }}
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
                                <h3 className="text-xl font-bold">{event.title}</h3>
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
                                {status === 'closed' && eventProjects.length > 0 && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                    {eventProjects.length} project{eventProjects.length !== 1 ? 's' : ''}
                                  </span>
                                )}
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
                                  onClick={() => setSubmitModal({ eventId: event.id, eventTitle: event.title })}
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

                          {/* User's own submissions for this event */}
                          {!showAdmin && mySubmissions.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Your Projects</p>
                              <div className="space-y-2">
                                {mySubmissions.map(sub => (
                                  <div key={sub.id} className="flex items-center justify-between bg-[var(--bg-secondary)] rounded-lg px-4 py-3">
                                    <div className="flex-1 min-w-0">
                                      <span className="font-medium text-sm truncate">{sub.title}</span>
                                      <p className="text-xs text-[var(--text-muted)] truncate">{sub.description}</p>
                                    </div>
                                    <div className="flex items-center gap-1 ml-3 shrink-0">
                                      <button
                                        onClick={() => handleDeleteUserSubmission(sub.id)}
                                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-white transition-colors cursor-pointer"
                                        title="Remove"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Admin: inline submission management */}
                          {showAdmin && (
                            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                              <button
                                onClick={() => toggleSubmissions(event.id)}
                                className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text-primary)] cursor-pointer transition-colors"
                              >
                                Submissions ({eventSubs.length + eventProjects.length})
                                {isSubmissionsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>

                              {isSubmissionsExpanded && (
                                <div className="mt-3 space-y-2">
                                  {eventSubs.length === 0 && eventProjects.length === 0 ? (
                                    <p className="text-sm text-[var(--text-muted)] italic">No submissions yet</p>
                                  ) : (
                                    <>
                                      {eventSubs.map(sub => (
                                        <div key={sub.id} className="flex items-center justify-between bg-[var(--bg-secondary)] rounded-lg px-4 py-3">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                              <span className="font-medium text-sm truncate">{sub.title}</span>
                                            </div>
                                            <p className="text-xs text-[var(--text-muted)]">
                                              {sub.builderName} &middot; {sub.submittedBy || 'unknown'}
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-1 ml-3 shrink-0">
                                            <button
                                              onClick={() => handleDeleteSubmission(sub.id, event.id)}
                                              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-white transition-colors cursor-pointer"
                                              title="Delete"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                      {eventProjects.length > 0 && (
                                        <div className="grid sm:grid-cols-2 gap-4 mt-3">
                                          {eventProjects.map((project) => (
                                            <ProjectRow key={project.id} project={project} />
                                          ))}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Non-admin: show projects in collapsible section */}
                          {!showAdmin && eventProjects.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                              <button
                                onClick={() => toggleSubmissions(event.id)}
                                className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text-primary)] cursor-pointer transition-colors"
                              >
                                Projects ({eventProjects.length})
                                {isSubmissionsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>

                              {isSubmissionsExpanded && (
                                <div className="grid sm:grid-cols-2 gap-4 mt-3">
                                  {eventProjects.map((project) => (
                                    <ProjectRow key={project.id} project={project} />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chapter Lead */}
      <section className="py-6 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <img
              src={chapter.lead.avatar}
              alt={chapter.lead.name}
              className="w-10 h-10 rounded-full border-2 object-cover shrink-0"
              style={{ borderColor: accentColor }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{chapter.lead.name}</p>
                <span className="text-xs text-[var(--text-muted)]">
                  Chapter {chapter.lead.isFounder ? 'Founder' : 'Lead'}
                </span>
              </div>
              {chapter.lead.x ? (
                <a
                  href={chapter.lead.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  {chapter.lead.handle}
                </a>
              ) : (
                <p className="text-xs text-[var(--text-muted)]">{chapter.lead.handle}</p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {chapter.lead.x && (
                <a
                  href={chapter.lead.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {chapter.lead.github && (
                <a
                  href={chapter.lead.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {chapter.lead.website && (
                <a
                  href={chapter.lead.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Submit modal */}
      {submitModal && (
        <SubmitProjectModal
          eventId={submitModal.eventId}
          eventName={submitModal.eventTitle}
          chapterId={chapterId}
          initialData={submitModal.editSubmission}
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

interface EventFormData {
  title: string;
  date: string;
  location: string;
  lumaUrl?: string;
  imageUrl?: string;
}

function EventForm({
  initial,
  onSubmit,
  onCancel,
  accentColor,
  submitLabel = 'Create Event',
}: {
  initial?: EventFormData;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  accentColor: string;
  submitLabel?: string;
}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [date, setDate] = useState(initial?.date || '');
  const [location, setLocation] = useState(initial?.location || '');
  const [lumaUrl, setLumaUrl] = useState(initial?.lumaUrl || '');
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const { url } = await res.json();
        setImageUrl(url);
      }
    } catch {} finally {
      setUploading(false);
    }
  }

  return (
    <div
      className="bg-white rounded-xl border-2 p-5 space-y-4"
      style={{ borderColor: `${accentColor}40` }}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          className="px-3 py-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <input
          type="datetime-local"
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
        <input
          type="url"
          value={lumaUrl}
          onChange={(e) => setLumaUrl(e.target.value)}
          placeholder="Luma URL (optional)"
          className="px-3 py-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      {/* Image upload */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-strong)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer disabled:opacity-50"
        >
          <ImageIcon className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        {imageUrl && (
          <div className="flex items-center gap-2">
            <img src={imageUrl} alt="Preview" className="w-10 h-10 rounded object-cover" />
            <button
              onClick={() => setImageUrl('')}
              className="text-xs text-red-500 hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => { if (title && date && location) onSubmit({ title, date, location, lumaUrl: lumaUrl || undefined, imageUrl: imageUrl || undefined }); }}
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
