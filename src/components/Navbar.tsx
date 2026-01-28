'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket } from 'lucide-react';
import { useState } from 'react';
import { chapters } from '@/lib/data';
import { NavCityLink } from './NavCityLink';
import { TaxiDoodle, WindDoodle, FlatironsDoodle, NetworkDoodle } from './doodles';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Rocket className="w-7 h-7 text-[var(--accent)]" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">Shiphaus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {chapters.map((chapter) => (
                <NavCityLink
                  key={chapter.id}
                  href={`/chapter/${chapter.id}`}
                  chapterId={chapter.id}
                  chapterColor={chapter.color}
                >
                  {chapter.city}
                </NavCityLink>
              ))}
            </div>

            <div className="flex items-center gap-3">
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[var(--text-secondary)] cursor-pointer"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]"
          >
            <div className="px-4 py-4 space-y-3">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/chapter/${chapter.id}`}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
                >
                  {chapter.city}
                </Link>
              ))}
              <hr className="border-[var(--border-subtle)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preload doodles - hidden render to warm browser cache */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          width: 0,
          height: 0,
        }}
      >
        <TaxiDoodle />
        <WindDoodle />
        <FlatironsDoodle />
        <NetworkDoodle />
      </div>
    </nav>
  );
}
