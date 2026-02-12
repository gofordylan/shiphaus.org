'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Project } from '@/types';

interface SubmitProjectModalProps {
  eventId: string;
  eventName: string;
  chapterId: string;
  initialData?: Project;
  onClose: () => void;
  onSubmitted: (project?: Project) => void;
}

export function SubmitProjectModal({ eventId, eventName, chapterId, initialData, onClose, onSubmitted }: SubmitProjectModalProps) {
  const isEdit = !!initialData;
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [deployedUrl, setDeployedUrl] = useState(initialData?.deployedUrl || '');
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isEdit) {
        const res = await fetch(`/api/projects/${initialData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            deployedUrl,
            githubUrl: githubUrl || undefined,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          onSubmitted();
        } else {
          setError(data.error || 'Something went wrong.');
        }
      } else {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            deployedUrl,
            githubUrl: githubUrl || undefined,
            chapterId,
            eventId,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          onSubmitted(data.project);
        } else {
          setError(data.error || 'Something went wrong.');
        }
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-2xl border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-lg font-bold">{isEdit ? 'Edit Project' : 'Submit Your Project'}</h2>
              <p className="text-sm text-[var(--text-muted)] font-body">{eventName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Project Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Cool Project"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-body text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does it do? (10-500 chars)"
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-body text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Live URL</label>
              <input
                type="url"
                value={deployedUrl}
                onChange={(e) => setDeployedUrl(e.target.value)}
                placeholder="https://myproject.com"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-body text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Source Code <span className="font-normal text-[var(--text-muted)]">(optional)</span>
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-body text-sm"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isSubmitting ? (isEdit ? 'Saving...' : 'Submitting...') : (isEdit ? 'Save Changes' : 'Submit Project')}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
