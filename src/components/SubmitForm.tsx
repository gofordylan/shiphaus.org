'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chapters, events as staticEvents } from '@/lib/data';
import { Event } from '@/types';

const PROJECT_TYPES = [
  { value: 'website', label: 'Website' },
  { value: 'application', label: 'Application' },
  { value: 'devtool', label: 'Dev Tool' },
  { value: 'video', label: 'Video' },
  { value: 'other', label: 'Other' },
];

export function SubmitForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [builderName, setBuilderName] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [eventId, setEventId] = useState('');
  const [events, setEvents] = useState<Event[]>(staticEvents);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from API
  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then((data: Event[]) => {
        if (data.length > 0) setEvents(data);
      })
      .catch(() => {});
  }, []);

  const filteredEvents = chapterId
    ? events.filter(e => e.chapterId === chapterId)
    : events;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || title.length < 3) {
      setError('Project name must be at least 3 characters.');
      return;
    }
    if (!description || description.length < 10) {
      setError('Description must be at least 10 characters.');
      return;
    }
    if (!type) {
      setError('Please select a project type.');
      return;
    }
    if (!builderName || builderName.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, description, type,
          deployedUrl: deployedUrl || undefined,
          githubUrl: githubUrl || undefined,
          builderName,
          chapterId: chapterId || undefined,
          eventId: eventId || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.error || "Something went wrong. Try again?");
      }
    } catch {
      setError("Something went wrong. Try again?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Project Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">Project Name *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What did you build?"
                maxLength={100}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does it do? Who is it for?"
                maxLength={500}
                rows={3}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50 resize-none"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1 text-right">
                {description.length}/500
              </p>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold mb-2">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50 bg-white"
              >
                <option value="">Select type...</option>
                {PROJECT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* URLs */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Live Link</label>
                <input
                  type="url"
                  value={deployedUrl}
                  onChange={(e) => setDeployedUrl(e.target.value)}
                  placeholder="https://..."
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Source Link</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Builder Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">Your Name *</label>
              <input
                type="text"
                value={builderName}
                onChange={(e) => setBuilderName(e.target.value)}
                placeholder="How should we credit you?"
                maxLength={50}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50"
              />
            </div>

            {/* Chapter + Event */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Chapter</label>
                <select
                  value={chapterId}
                  onChange={(e) => { setChapterId(e.target.value); setEventId(''); }}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50 bg-white"
                >
                  <option value="">Select chapter...</option>
                  {chapters.map(c => (
                    <option key={c.id} value={c.id}>{c.city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Event</label>
                <select
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  disabled={isSubmitting || filteredEvents.length === 0}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50 bg-white"
                >
                  <option value="">Select event...</option>
                  {filteredEvents.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Project'}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-2">Project Submitted!</h3>
            <p className="text-[var(--text-secondary)] font-body">
              Your project is under review. Once approved, it&apos;ll appear on the site.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
