'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Users, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ChapterCard } from '@/components/ChapterCard';
import { ProjectCard } from '@/components/ProjectCard';
import { TestimonialCard } from '@/components/TestimonialCard';
import { chapters, projects, testimonials } from '@/lib/data';
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
              Ship Your Side Project <span className="text-[var(--accent)]">Today</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-[var(--text-secondary)] font-body leading-relaxed mb-8 max-w-xl"
            >
              Stop dreaming. Start building. Industry experts and motivated builders have your back.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="#chapters" className="btn-primary inline-flex items-center gap-2">
                Join the Next Event
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-[var(--border-subtle)]"
            >
              {[
                { label: 'Projects Shipped', value: '20' },
                { label: 'Active Chapters', value: '4' },
                { label: 'Build Events', value: '2' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-[var(--text-muted)] text-sm">{stat.label}</p>
                </div>
              ))}
            </motion.div>
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
                <p className="text-sm font-semibold">Zero to One Day</p>
                <p className="text-xs text-[var(--text-muted)]">14 builders, 14 projects</p>
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
      icon: Zap,
      title: 'Ship in 8 Hours',
      description: 'AI tools let you build what used to take weeks. The deadline isn\'t a constraint — it\'s your unfair advantage.',
    },
    {
      icon: Users,
      title: 'Accountability That Works',
      description: 'A room full of builders, heads down, shipping. No Slack. No meetings. Just focused work and real deadlines.',
    },
    {
      icon: Globe,
      title: 'Growing Global',
      description: 'Started in NYC. Expanding soon. Same energy everywhere: less talk, more build.',
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
              <div className="inline-flex p-3 rounded-xl bg-white border border-[var(--border-subtle)] mb-4">
                <prop.icon className="w-6 h-6 text-[var(--accent)]" />
              </div>
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
  const featured = projects.slice(0, 6);

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
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Don&apos;t Take Our Word For It</h2>
          <p className="text-[var(--text-secondary)] font-body text-lg max-w-xl mx-auto">
            Hear from builders who&apos;ve shipped at Shiphaus.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-[var(--text-primary)] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Rocket className="w-12 h-12 mx-auto mb-6 text-[var(--accent)]" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Next Project is One Day Away</h2>
          <p className="text-white/70 font-body text-lg mb-8 max-w-xl mx-auto">
            Stop sitting on that idea. Join the next Shiphaus and launch it.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#chapters"
              className="bg-[var(--accent)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors inline-flex items-center gap-2"
            >
              Join the Next Event
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:hello@shiphaus.org"
              className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              Start a Chapter
            </a>
          </div>
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
      <ProjectsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
