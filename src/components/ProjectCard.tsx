'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="masonry-item"
    >
      <div className="card p-5 group h-full flex flex-col">
        {/* Builder info */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={project.builder.avatar}
            alt={project.builder.name}
            className="w-10 h-10 rounded-full border border-[var(--border-subtle)] object-cover"
          />
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {project.builder.name}
          </span>
        </div>

        {/* Project info */}
        <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
          {project.title}
        </h3>
        <p className="text-[var(--text-secondary)] text-sm font-body leading-relaxed mb-4 flex-grow">
          {project.description}
        </p>

        {/* Links */}
        <div className="flex items-center gap-3 pt-3 border-t border-[var(--border-subtle)]">
          {project.deployedUrl && (
            <a
              href={project.deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Github className="w-4 h-4" />
              Source
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
