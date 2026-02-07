'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';
import { ProjectCard } from '@/components/ProjectCard';
import { projects as staticProjects, chapters } from '@/lib/data';
import { Project } from '@/types';

export default function ProjectsPage() {
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [allProjects, setAllProjects] = useState<Project[]>(staticProjects);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then((data: Project[]) => {
        if (data.length > 0) setAllProjects(data);
      })
      .catch(() => {});
  }, []);

  const filteredProjects = selectedChapter === 'all'
    ? allProjects
    : allProjects.filter(p => p.chapterId === selectedChapter);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Everything Shipped</h1>
          <p className="text-[var(--text-secondary)] font-body text-lg max-w-2xl">
            Every product. Built in a day. Live right now.
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mb-8 overflow-x-auto pb-2"
        >
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter:</span>
          </div>
          <button
            onClick={() => setSelectedChapter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedChapter === 'all'
                ? 'bg-[var(--text-primary)] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            All Chapters
          </button>
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => setSelectedChapter(chapter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedChapter === chapter.id
                  ? 'bg-[var(--text-primary)] text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {chapter.city}
            </button>
          ))}
        </motion.div>

        {/* Projects count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-[var(--text-muted)] mb-6"
        >
          Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </motion.p>

        {/* Projects Grid */}
        <div className="masonry-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">No projects found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
