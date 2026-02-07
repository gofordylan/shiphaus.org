'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Users, Calendar } from 'lucide-react';
import { Chapter } from '@/types';
import { chapterColorMap, getChapterEvents, getChapterProjects } from '@/lib/data';

interface ChapterCardProps {
  chapter: Chapter;
  index?: number;
}

export function ChapterCard({ chapter, index = 0 }: ChapterCardProps) {
  const accentColor = chapterColorMap[chapter.color] || '#FF6B35';
  const chapterEvents = getChapterEvents(chapter.id);
  const chapterProjects = getChapterProjects(chapter.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={`/chapter/${chapter.id}`} className="block group h-full">
        <div className="card p-6 relative overflow-hidden h-full">
          {/* Colored accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: accentColor }}
          />

          {/* Chapter header */}
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="min-w-0">
              <h3 className="text-xl font-bold truncate group-hover:text-[var(--accent)] transition-colors">
                {chapter.city}
              </h3>
              <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{chapter.country}</span>
              </div>
            </div>
            <motion.div
              className="p-2 rounded-full bg-[var(--bg-secondary)] group-hover:bg-[var(--accent-soft)] transition-colors shrink-0"
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
            </motion.div>
          </div>

          {/* Lead info */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[var(--border-subtle)]">
            <img
              src={chapter.lead.avatar}
              alt={chapter.lead.name}
              className="w-10 h-10 rounded-full border-2 object-cover"
              style={{ borderColor: accentColor }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium">{chapter.lead.name}</p>
                {chapter.lead.isFounder && (
                  <span title="Founder" className="text-[var(--accent)] opacity-60">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)]">{chapter.lead.isFounder ? 'Founder' : 'Chapter Lead'}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Users className="w-4 h-4" style={{ color: accentColor }} />
              <span><strong>{chapterProjects.length}</strong> projects</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Calendar className="w-4 h-4" style={{ color: accentColor }} />
              <span><strong>{chapterEvents.length}</strong> events</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
