'use client';

import { useState } from 'react';
import { Star, Trash2, ExternalLink, Github } from 'lucide-react';
import { Project } from '@/types';

interface ProjectManageCardProps {
  project: Project;
  onUpdate: () => void;
}

export function ProjectManageCard({ project, onUpdate }: ProjectManageCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleFeatured = async () => {
    setIsProcessing(true);
    try {
      await fetch(`/api/admin/projects/${project.id}/feature`, { method: 'PATCH' });
      onUpdate();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    setIsProcessing(true);
    try {
      await fetch(`/api/admin/projects/${project.id}`, { method: 'DELETE' });
      onUpdate();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-[var(--border-subtle)]">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <img
            src={project.builder.avatar}
            alt={project.builder.name}
            className="w-8 h-8 rounded-full border border-[var(--border-subtle)] object-cover"
          />
          <div>
            <h3 className="font-semibold">{project.title}</h3>
            <p className="text-xs text-[var(--text-muted)]">{project.builder.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleFeatured}
            disabled={isProcessing}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              project.featured
                ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]'
            }`}
            title={project.featured ? 'Unfeature' : 'Feature'}
          >
            <Star className="w-4 h-4" fill={project.featured ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isProcessing}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-sm text-[var(--text-secondary)] font-body mb-3 line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)]">
          {project.chapterId}
        </span>
        {project.type && (
          <span className="px-2 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)]">
            {project.type}
          </span>
        )}
        {project.deployedUrl && (
          <a href={project.deployedUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline inline-flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> Live
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:underline inline-flex items-center gap-1">
            <Github className="w-3 h-3" /> Source
          </a>
        )}
      </div>
    </div>
  );
}
