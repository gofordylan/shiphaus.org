'use client';

import { useState, useEffect } from 'react';
import { ProjectManageCard } from '@/components/admin/ProjectManageCard';
import { Project } from '@/types';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = () => {
    setLoading(true);
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then((data: Project[]) => setProjects(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchProjects, []);

  const featured = projects.filter(p => p.featured);
  const regular = projects.filter(p => !p.featured);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Projects</h1>
        <p className="text-sm text-[var(--text-muted)]">
          {projects.length} total &middot; {featured.length} featured
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-8 border border-[var(--border-subtle)] text-center">
          <p className="text-[var(--text-muted)]">Loading...</p>
        </div>
      ) : (
        <>
          {featured.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Featured</h2>
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {featured.map(p => (
                  <ProjectManageCard key={p.id} project={p} onUpdate={fetchProjects} />
                ))}
              </div>
            </div>
          )}

          {regular.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">All Projects</h2>
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {regular.map(p => (
                  <ProjectManageCard key={p.id} project={p} onUpdate={fetchProjects} />
                ))}
              </div>
            </div>
          )}

          {projects.length === 0 && (
            <div className="bg-white rounded-xl p-12 border border-[var(--border-subtle)] text-center">
              <p className="text-[var(--text-muted)]">No projects yet. Approve some submissions or run the seed script.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
