'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { DoodlePortal } from './doodles/DoodlePortal';
import { doodleMap } from './doodles';
import { chapterColorMap } from '@/lib/data';

interface NavCityLinkProps {
  href: string;
  chapterId: string;
  chapterColor: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function NavCityLink({ href, chapterId, chapterColor, children, onClick }: NavCityLinkProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isPrimed, setIsPrimed] = useState(false);
  const [showDoodle, setShowDoodle] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canHover, setCanHover] = useState(false);

  const linkRef = useRef<HTMLAnchorElement>(null);
  const primeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const revealTimerRef = useRef<NodeJS.Timeout | null>(null);

  const DoodleComponent = doodleMap[chapterId];

  // Check if device supports hover
  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover)');
    setCanHover(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const updatePosition = useCallback(() => {
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8,
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!canHover) return;

    setIsHovering(true);
    updatePosition();

    // Start prime timer (500ms)
    primeTimerRef.current = setTimeout(() => {
      setIsPrimed(true);
    }, 500);

    // Start reveal timer (1300ms)
    revealTimerRef.current = setTimeout(() => {
      updatePosition(); // Update position again in case of scroll
      setShowDoodle(true);
    }, 1300);
  }, [canHover, updatePosition]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsPrimed(false);
    setShowDoodle(false);

    if (primeTimerRef.current) {
      clearTimeout(primeTimerRef.current);
      primeTimerRef.current = null;
    }
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (primeTimerRef.current) clearTimeout(primeTimerRef.current);
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, []);

  const primedColor = chapterColorMap[chapterColor] || 'var(--accent)';

  return (
    <>
      <Link
        ref={linkRef}
        href={href}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="text-sm font-medium transition-colors duration-300"
        style={{
          color: isPrimed ? primedColor : 'var(--text-secondary)',
        }}
      >
        {children}
      </Link>

      {/* Doodle rendered via portal */}
      {canHover && DoodleComponent && (
        <DoodlePortal>
          <AnimatePresence>
            {showDoodle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  left: position.x,
                  top: position.y,
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <DoodleComponent animate={showDoodle} />
              </motion.div>
            )}
          </AnimatePresence>
        </DoodlePortal>
      )}
    </>
  );
}
