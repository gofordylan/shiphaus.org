'use client';

import { useState } from 'react';
import { Check, X, ExternalLink, Github } from 'lucide-react';
import { Submission } from '@/types';
import { chapters } from '@/lib/data';

interface SubmissionReviewCardProps {
  submission: Submission;
  onAction: () => void;
}

export function SubmissionReviewCard({ submission, onAction }: SubmissionReviewCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [chapterId, setChapterId] = useState(submission.chapterId || '');

  const handleAction = async (action: 'approve' | 'reject') => {
    setIsProcessing(true);
    try {
      await fetch(`/api/admin/submissions/${submission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, chapterId: chapterId || undefined }),
      });
      onAction();
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-[var(--border-subtle)]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{submission.title}</h3>
          <p className="text-sm text-[var(--text-muted)]">
            by {submission.builderName} &middot; {submission.type} &middot;{' '}
            {new Date(submission.submittedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <p className="text-sm text-[var(--text-secondary)] font-body mb-4">
        {submission.description}
      </p>

      <div className="flex items-center gap-3 mb-4">
        {submission.deployedUrl && (
          <a
            href={submission.deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Live
          </a>
        )}
        {submission.githubUrl && (
          <a
            href={submission.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:underline"
          >
            <Github className="w-3.5 h-3.5" /> Source
          </a>
        )}
      </div>

      {/* Chapter selector for approval */}
      <div className="mb-4">
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Chapter (for approval)</label>
        <select
          value={chapterId}
          onChange={(e) => setChapterId(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-strong)] bg-white"
        >
          <option value="">Select chapter...</option>
          {chapters.map(c => (
            <option key={c.id} value={c.id}>{c.city}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
        <button
          onClick={() => handleAction('approve')}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Check className="w-4 h-4" /> Approve
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X className="w-4 h-4" /> Reject
        </button>
      </div>
    </div>
  );
}
