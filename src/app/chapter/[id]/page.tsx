'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Calendar, MapPin, Users, Layers, Github } from 'lucide-react';
import Link from 'next/link';
import { getChapter, getChapterEvents, getChapterProjects, getChapterTestimonials, chapterColorMap } from '@/lib/data';
import { ProjectCard } from '@/components/ProjectCard';
import { EventCard } from '@/components/EventCard';
import { TestimonialCard } from '@/components/TestimonialCard';
import { XIcon } from '@/components/XIcon';

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

  // Derive stats from actual data
  const uniqueBuilders = new Set(projects.map(p => p.builder.uid)).size;

  const stats = [
    { value: String(projects.length), label: 'projects', icon: Layers },
    { value: String(uniqueBuilders), label: 'builders', icon: Users },
    { value: String(events.length), label: 'events', icon: Calendar },
  ];

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

              {/* Stats grid */}
              {stats.length > 0 && stats[0].value !== '0' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                      className="bg-white rounded-xl p-4 border border-[var(--border-subtle)]"
                    >
                      <stat.icon className="w-4 h-4 mb-2" style={{ color: accentColor }} />
                      <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                      <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Chapter Lead */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="card p-5"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={chapter.lead.avatar}
                    alt={chapter.lead.name}
                    className="w-14 h-14 rounded-full border-2 object-cover"
                    style={{ borderColor: accentColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{chapter.lead.name}</h3>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: accentColor, backgroundColor: `${accentColor}12` }}>
                        {chapter.lead.isFounder ? 'Founder' : 'Lead'}
                      </span>
                    </div>
                    {chapter.lead.x ? (
                      <a
                        href={chapter.lead.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                      >
                        {chapter.lead.handle}
                      </a>
                    ) : (
                      <p className="text-sm text-[var(--text-muted)]">{chapter.lead.handle}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {chapter.lead.x && (
                      <a
                        href={chapter.lead.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                        title="X"
                      >
                        <XIcon className="w-4 h-4" />
                      </a>
                    )}
                    {chapter.lead.github && (
                      <a
                        href={chapter.lead.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {chapter.lead.website && (
                      <a
                        href={chapter.lead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                        title="Website"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>

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
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Build Days</h2>
              <p className="text-[var(--text-secondary)] font-body">
                Build days hosted by the {chapter.city} chapter
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: events.length * 0.1 }}
                className="rounded-2xl border-2 border-dashed border-[var(--border-strong)] overflow-hidden"
              >
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[var(--text-muted)] mb-3">Shiphaus NYC #3</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <Calendar className="w-4 h-4 opacity-40" />
                      <span>February 2026</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <MapPin className="w-4 h-4 opacity-40" />
                      <span>New York</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-dashed border-[var(--border-subtle)]">
                    <span className="text-sm font-body italic text-[var(--text-muted)]">Details coming soon</span>
                  </div>
                </div>
              </motion.div>
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
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Shipped in {chapter.city}</h2>
              <p className="text-[var(--text-secondary)] font-body">
                Every project shipped at a {chapter.city} build day.
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
              <h2 className="text-2xl md:text-3xl font-bold mb-2">From the Builders</h2>
              <p className="text-[var(--text-secondary)] font-body">
                What they said after shipping.
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

    </div>
  );
}
