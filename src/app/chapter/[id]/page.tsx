'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Calendar, MapPin, Users, Layers, Camera } from 'lucide-react';
import Link from 'next/link';
import { getChapter, getChapterEvents, getChapterProjects, getChapterTestimonials, chapterColorMap } from '@/lib/data';
import { ProjectCard } from '@/components/ProjectCard';
import { EventCard } from '@/components/EventCard';
import { TestimonialCard } from '@/components/TestimonialCard';

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ChapterPage() {
  const params = useParams();
  const chapterId = params.id as string;
  const chapter = getChapter(chapterId);
  const events = getChapterEvents(chapterId);
  const projects = getChapterProjects(chapterId);
  const testimonials = getChapterTestimonials(chapterId);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
          <Link href="/" className="text-[var(--accent)] hover:underline">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  const accentColor = chapterColorMap[chapter.color] || '#FF6B35';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 50%), var(--bg-primary)`,
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1.5 }}
            className="absolute top-10 right-[20%] w-80 h-80 rounded-full blur-3xl"
            style={{ backgroundColor: `${accentColor}15` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link
            href="/#chapters"
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All Chapters
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Chapter Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-block w-2 h-12 rounded-full mb-4"
                style={{ backgroundColor: accentColor }}
              />
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{chapter.city}</h1>
              <p className="text-[var(--text-muted)] text-lg mb-6">{chapter.country}</p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5" style={{ color: accentColor }} />
                  <span><strong>{chapter.projectCount}</strong> projects shipped</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" style={{ color: accentColor }} />
                  <span><strong>{chapter.eventCount}</strong> events held</span>
                </div>
              </div>

              {/* Chapter Lead Card */}
              <div className="card p-6">
                <p className="text-sm text-[var(--text-muted)] uppercase tracking-wide mb-4">Chapter Lead</p>
                <div className="flex items-center gap-4">
                  <img
                    src={chapter.lead.avatar}
                    alt={chapter.lead.name}
                    className="w-16 h-16 rounded-full border-2"
                    style={{ borderColor: accentColor }}
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{chapter.lead.name}</h3>
                    <p className="text-[var(--text-muted)]">{chapter.lead.handle}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 pt-4 border-t border-[var(--border-subtle)]">
                  {chapter.lead.x && (
                    <a
                      href={chapter.lead.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <XIcon className="w-4 h-4" />
                      X
                    </a>
                  )}
                  {chapter.lead.website && (
                    <a
                      href={chapter.lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Featured Event Photo */}
            {events.length > 0 && events[0].photos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={events[0].photos[0]}
                    alt={`${chapter.city} event`}
                    className="w-full h-80 object-cover"
                  />
                </div>
                <div
                  className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg border border-[var(--border-subtle)]"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Camera className="w-4 h-4" style={{ color: accentColor }} />
                    <span className="font-medium">{events[0].name}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Events Section */}
      {events.length > 0 && (
        <section className="py-16 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Past Events</h2>
              <p className="text-[var(--text-secondary)] font-body">
                Build days hosted by the {chapter.city} chapter
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Projects from {chapter.city}</h2>
              <p className="text-[var(--text-secondary)] font-body">
                Built by community members at {chapter.city} events
              </p>
            </motion.div>

            <div className="masonry-grid">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">What People Say</h2>
              <p className="text-[var(--text-secondary)] font-body">
                Builders share their Shiphaus experience
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photo Gallery Section */}
      {events.some(e => e.photos.length > 0) && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Photos</h2>
              <p className="text-[var(--text-secondary)] font-body">
                Moments from {chapter.city} build days
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {events.flatMap(event => event.photos).slice(0, 8).map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="aspect-square rounded-xl overflow-hidden group cursor-pointer"
                >
                  <img
                    src={photo}
                    alt={`${chapter.city} event photo`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
