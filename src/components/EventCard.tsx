'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Layers } from 'lucide-react';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card overflow-hidden"
    >
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-3">{event.name}</h3>

        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--accent)]" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--accent)]" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-[var(--text-secondary)]">
              <strong>{event.builderCount}</strong> builders
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Layers className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-[var(--text-secondary)]">
              <strong>{event.projectCount}</strong> projects
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
