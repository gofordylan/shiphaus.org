'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ShiphausLogo } from '@/components/ShiphausLogo';
import Link from 'next/link';
import Image from 'next/image';
import { ChapterCard } from '@/components/ChapterCard';
import { ProjectCard } from '@/components/ProjectCard';
import { EmailCapture } from '@/components/EmailCapture';
import { chapters, projects as staticProjects, events, testimonials } from '@/lib/data';
import { Project } from '@/types';

function HeroSection() {
  return (
    <section className="hero-pattern relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 right-[15%] w-72 h-72 bg-gradient-to-br from-[var(--accent)]/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-10 left-[10%] w-96 h-96 bg-gradient-to-tr from-[var(--chapter-ny)]/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]"
            >
              Ideate, Plan, and <span className="text-[var(--accent)]">Ship</span>, all in one day.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[var(--text-secondary)] font-body leading-relaxed mb-8 max-w-xl"
            >
              Builders will help you along the way.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold">Next Event: NYC February</span>
                <span className="text-[var(--text-secondary)] font-body">
                  Interested? Reach out to{' '}
                  <a href="https://x.com/AlexSlobodnik" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">@AlexSlobodnik</a>
                </span>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10 mt-12 pt-8 border-t border-[var(--border-strong)]">
              {[
                { label: 'Projects Shipped', value: String(staticProjects.length) },
                { label: 'Chapters', value: String(chapters.length) },
                { label: 'Build Events', value: String(events.length) },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                  className="pl-4 border-l-2 border-[var(--accent)]"
                >
                  <p className="text-3xl font-bold font-body">{stat.value}</p>
                  <p className="text-[var(--text-muted)] text-xs tracking-widest uppercase mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hero Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="relative w-[480px] h-[480px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/photo.jpeg"
                  alt="Builders at Shiphaus event"
                  width={480}
                  height={480}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-3 -left-3 bg-white rounded-xl p-3 shadow-lg border border-[var(--border-subtle)]">
                <p className="text-sm font-semibold">Shiphaus NY #1</p>
                <p className="text-xs text-[var(--text-muted)]">14 builders. 14 products. One day.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ValuePropsSection() {
  const props = [
    {
      icon: '/icons/speed-icon.png',
      title: 'Weeks of Work. One Day.',
      description: 'AI handles the grunt work. The deadline handles your excuses. The room handles the rest.',
    },
    {
      icon: '/icons/together-icon.png',
      title: 'Built Together',
      description: 'Nobody ships alone here. Engineers help designers. Founders help first-timers. Everyone leaves with something live.',
    },
    {
      icon: '/icons/ships-icon.png',
      title: 'Everyone Ships. No One Quits.',
      description: 'Everyone ships something. Big or small, we all get through it.',
    },
  ];

  return (
    <section className="py-20 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {props.map((prop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center md:text-left"
            >
              <img src={prop.icon} alt="" className="w-16 h-16 object-contain mb-5 rounded-xl mx-auto md:mx-0" />
              <h3 className="text-lg font-semibold mb-2">{prop.title}</h3>
              <p className="text-[var(--text-secondary)] font-body">{prop.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChaptersSection() {
  return (
    <section id="chapters" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your City</h2>
          <p className="text-[var(--text-secondary)] font-body text-lg max-w-2xl">
            Pick a chapter. Show up. Ship something. It&apos;s that simple.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {chapters.map((chapter, index) => (
            <ChapterCard key={chapter.id} chapter={chapter} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const [featured, setFeatured] = useState<Project[]>(staticProjects.slice(0, 6));

  useEffect(() => {
    fetch('/api/projects/featured')
      .then(r => r.json())
      .then((data: Project[]) => {
        if (data.length > 0) setFeatured(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built in a Day</h2>
            <p className="text-[var(--text-secondary)] font-body text-lg max-w-xl">
              Live products. Single-day builds. No exceptions.
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden md:inline-flex items-center gap-2 text-[var(--accent)] font-medium hover:gap-3 transition-all"
          >
            View all projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="masonry-grid">
          {featured.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[var(--accent)] font-medium"
          >
            View all projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const hero = testimonials[0];
  const supporting = testimonials.slice(1);

  return (
    <section className="py-20 md:py-28 bg-[var(--text-primary)] text-white relative overflow-hidden">
      {/* Subtle radial glow behind the quote */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[var(--accent)]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-white/40 text-sm font-semibold tracking-widest uppercase mb-16 text-center"
        >
          Straight From the Room
        </motion.p>

        {/* Hero quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block">
            <span className="absolute -top-8 -left-4 md:-top-10 md:-left-8 font-body text-[6rem] md:text-[8rem] leading-none text-[var(--accent)] opacity-25 select-none">&ldquo;</span>
            <blockquote className="font-body italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug md:leading-tight text-white/95 max-w-4xl">
              {hero.quote}
            </blockquote>
          </div>
          <div className="flex items-center justify-center gap-3 mt-10">
            <img
              src={hero.avatar}
              alt={hero.author}
              className="w-11 h-11 rounded-full border-2 border-white/20 object-cover"
            />
            <div className="text-left">
              <p className="font-semibold text-sm text-white/90">{hero.author}</p>
              <p className="text-white/40 text-sm">{hero.role}</p>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mx-auto mb-12" />

        {/* Supporting quotes */}
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
          {supporting.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <img
                src={t.avatar}
                alt={t.author}
                className="w-9 h-9 rounded-full border border-white/10 object-cover shrink-0"
              />
              <p className="text-white/60 font-body italic text-base">
                &ldquo;{t.quote}&rdquo;{' '}
                <span className="text-white/30 not-italic text-sm">&mdash; {t.author}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-[#111111] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <ShiphausLogo size={96} className="mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Next Event: NYC February</h2>
          <p className="text-white/70 font-body text-lg mb-8 max-w-xl mx-auto">
            Details coming soon. Want to start a chapter in your city?
          </p>
          <Link
            href="/start-a-chapter"
            className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors inline-block"
          >
            Start a Chapter
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <ValuePropsSection />
      <ChaptersSection />
      <EmailCapture />
      <ProjectsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
