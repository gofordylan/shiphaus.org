'use client';

import { useState, useEffect } from 'react';
import { SubmissionReviewCard } from '@/components/admin/SubmissionReviewCard';
import { Submission } from '@/types';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = () => {
    setLoading(true);
    fetch('/api/admin/submissions')
      .then(r => r.json())
      .then((data: Submission[]) => setSubmissions(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchSubmissions, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Submissions</h1>
        <p className="text-sm text-[var(--text-muted)]">
          {submissions.length} pending review{submissions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-8 border border-[var(--border-subtle)] text-center">
          <p className="text-[var(--text-muted)]">Loading...</p>
        </div>
      ) : submissions.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {submissions.map(sub => (
            <SubmissionReviewCard key={sub.id} submission={sub} onAction={fetchSubmissions} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 border border-[var(--border-subtle)] text-center">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-lg font-semibold mb-1">All caught up!</p>
          <p className="text-sm text-[var(--text-muted)]">No pending submissions to review.</p>
        </div>
      )}
    </div>
  );
}
