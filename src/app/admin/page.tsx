'use client';

import { useState, useEffect } from 'react';
import { Layers, Star, Calendar, Inbox } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { SubmissionReviewCard } from '@/components/admin/SubmissionReviewCard';
import { Submission } from '@/types';
import Link from 'next/link';

interface Stats {
  totalProjects: number;
  featuredProjects: number;
  totalEvents: number;
  pendingSubmissions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);

  const fetchData = () => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});

    fetch('/api/admin/submissions')
      .then(r => r.json())
      .then((data: Submission[]) => setRecentSubmissions(data.slice(0, 3)))
      .catch(() => {});
  };

  useEffect(fetchData, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Projects" value={stats?.totalProjects ?? 0} icon={Layers} />
        <StatsCard label="Featured" value={stats?.featuredProjects ?? 0} icon={Star} />
        <StatsCard label="Events" value={stats?.totalEvents ?? 0} icon={Calendar} />
        <StatsCard label="Pending Reviews" value={stats?.pendingSubmissions ?? 0} icon={Inbox} />
      </div>

      {/* Recent Submissions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Submissions</h2>
          <Link href="/admin/submissions" className="text-sm text-[var(--accent)] hover:underline">
            View all
          </Link>
        </div>

        {recentSubmissions.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {recentSubmissions.map(sub => (
              <SubmissionReviewCard key={sub.id} submission={sub} onAction={fetchData} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 border border-[var(--border-subtle)] text-center">
            <p className="text-[var(--text-muted)]">No pending submissions.</p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: '/admin/submissions', label: 'Review Submissions', icon: Inbox },
            { href: '/admin/projects', label: 'Manage Projects', icon: Layers },
            { href: '/admin/events', label: 'Manage Events', icon: Calendar },
            { href: '/', label: 'View Site', icon: Layers },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-xl p-4 border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:shadow-sm transition-all flex items-center gap-3"
            >
              <link.icon className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
