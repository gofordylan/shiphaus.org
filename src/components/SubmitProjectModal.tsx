'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ProjectType } from '@/types';

interface SubmitProjectModalProps {
  eventId: string;
  eventName: string;
  chapterId: string;
  onClose: () => void;
  onSubmitted: () => void;
}

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'application', label: 'Application' },
  { value: 'devtool', label: 'Dev Tool' },
  { value: 'video', label: 'Video' },
  { value: 'other', label: 'Other' },
];

export function SubmitProjectModal({ eventId, eventName, chapterId, onClose, onSubmitted }: SubmitProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProjectType>('website');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [builderName, setBuilderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type,
          deployedUrl: deployedUrl || undefined,
          githubUrl: githubUrl || undefined,
          builderName,
          chapterId,
          eventId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onSubmitted();
      } else {
        setError(data.error || 'Something went wrong.');
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
              <h2 className="text-lg font-bold">Submit Your Project</h2>
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
              <label className="block text-sm font-semibold mb-1.5">Your Name</label>
              <input
                type="text"
                value={builderName}
                onChange={(e) => setBuilderName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-body text-sm"
              />
            </div>

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
              <label className="block text-sm font-semibold mb-1.5">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-body text-sm cursor-pointer"
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Live URL <span className="font-normal text-[var(--text-muted)]">(optional)</span>
              </label>
              <input
                type="url"
                value={deployedUrl}
                onChange={(e) => setDeployedUrl(e.target.value)}
                placeholder="https://myproject.com"
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
              {isSubmitting ? 'Submitting...' : 'Submit Project'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
