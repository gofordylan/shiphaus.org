'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !validateEmail(email)) {
      setError('Need a valid email');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setEmail('');
      } else {
        setError(data.error || "Didn't work. Try again?");
      }
    } catch (err) {
      setError("Didn't work. Try again?");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section className="relative py-12 md:py-16 bg-[var(--text-primary)] overflow-hidden">
      {/* Warm accent glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--accent)]/[0.06] rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Build with us
              </h2>
              <p className="text-white/60 font-body text-base mb-8 max-w-md mx-auto">
                Stay up-to-date with Shiphaus events, chapters, and builds.
              </p>

              <form
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto"
              >
                <div
                  className={`flex flex-col sm:flex-row gap-3 rounded-xl transition-all ${
                    error
                      ? 'sm:bg-[#F59E0B]/[0.06] sm:ring-1 sm:ring-[#F59E0B]/30 sm:p-1.5'
                      : ''
                  }`}
                >
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3.5 rounded-lg bg-white/10 border text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] focus:bg-white/[0.14] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        error
                          ? 'border-[#F59E0B]/40 sm:border-white/[0.12]'
                          : 'border-white/[0.12]'
                      }`}
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? 'Submitting...' : "I'm in"}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 text-sm text-[#F59E0B]/70 text-center font-body"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
              className="text-center py-2"
            >
              <p className="text-lg text-white/40 font-body mb-1">Welcome aboard</p>
              <p className="text-2xl font-bold text-white">
                You're in 🤝
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
