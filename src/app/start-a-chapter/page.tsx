'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function StartAChapter() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    twitter: '',
    linkedin: '',
    whatYouBuild: '',
    why: '',
    whoYouInvite: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Didn't work. Try again?");
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError("Didn't work. Try again?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] hero-pattern relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 right-[10%] w-96 h-96 bg-gradient-to-br from-[var(--accent)]/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-20 left-[15%] w-[500px] h-[500px] bg-gradient-to-tr from-[var(--chapter-ny)]/15 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <main className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)]/20">
                <span className="text-2xl">🚀</span>
                <span className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wide">Chapter Lead Application</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
              Run Shiphaus in<br/>
              <span className="text-[var(--accent)]">Your City</span>
            </h1>

            <p className="text-2xl text-[var(--text-secondary)] font-body leading-relaxed max-w-2xl mx-auto">
              Curate the builders. Find a space. Watch magic happen.
            </p>
          </motion.div>

          {/* Why Lead - more compact, energy-focused */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🎯', title: 'You curate', desc: 'the room' },
                { icon: '⚡', title: 'Ideas ship', desc: 'in 7 hours' },
                { icon: '🤝', title: 'Make friends', desc: 'by making things' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="card p-6 text-center hover:shadow-lg transition-all"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="text-lg font-bold">{item.title}</div>
                  <div className="text-[var(--text-secondary)] font-body">{item.desc}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="mt-6 flex flex-wrap justify-center gap-4 text-[var(--text-muted)] text-sm font-body"
            >
              <div className="flex items-center gap-2">
                <span className="text-[var(--accent)]">→</span>
                <span>Connected to leads across cities</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--accent)]">→</span>
                <span>You're early</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Application Form / Success State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="card p-8 md:p-10 shadow-lg relative overflow-hidden"
                >
                  {/* Accent corner decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--accent)]/10 to-transparent rounded-bl-[100px]" />

                  <div className="relative">
                    <h2 className="text-3xl font-bold mb-2">Apply to Lead</h2>
                    <p className="text-[var(--text-secondary)] font-body mb-8 text-lg">Tell us about yourself and your city</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name and Email */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-bold mb-2 text-[var(--text-primary)]">
                            Name <span className="text-[var(--accent)]">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 bg-white border-2 border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[var(--text-primary)] font-medium"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-bold mb-2 text-[var(--text-primary)]">
                            Email <span className="text-[var(--accent)]">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 bg-white border-2 border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[var(--text-primary)] font-medium"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <label htmlFor="city" className="block text-sm font-bold mb-2 text-[var(--text-primary)]">
                          City <span className="text-[var(--accent)]">*</span>
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 bg-white border-2 border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[var(--text-primary)] font-medium"
                          placeholder="Where would you run Shiphaus?"
                        />
                      </div>

                      {/* Twitter and LinkedIn */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="twitter" className="block text-sm font-bold mb-2 text-[var(--text-primary)]">
                            Twitter
                          </label>
                          <input
                            type="text"
                            id="twitter"
                            name="twitter"
                            value={formData.twitter}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 bg-white border-2 border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[var(--text-primary)] font-medium"
                            placeholder="@handle"
                          />
                        </div>
                        <div>
                          <label htmlFor="linkedin" className="block text-sm font-bold mb-2 text-[var(--text-primary)]">
                            LinkedIn
                          </label>
                          <input
                            type="text"
                            id="linkedin"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 bg-white border-2 border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[var(--text-primary)] font-medium"
                            placeholder="linkedin.com/in/..."
                          />
                        </div>
                      </div>

                      {/* What do you build */}
                      <div>
                        <label htmlFor="whatYouBuild" className="block text-sm font-bold mb-2 text-[var(--text-primary)]">
                          What do you build? <span className="text-[var(--accent)]">*</span>
                        </label>
                        <textarea
                          id="whatYouBuild"
                          name="whatYouBuild"
                          value={formData.whatYouBuild}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                          rows={3}
                          className="w-full px-4 py-3 bg-white border-2 border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[var(--accent)] resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all font-body text-[var(--text-primary)]"
                          placeholder="Apps, hardware, content, communities..."
                        />
                      </div>

                      {/* Why do you want to run a chapter */}
                      <div>
                        <label htmlFor="why" className="block text-sm font-bold mb-2 text-[var(--text-primary)]">
                          Why do you want to run a chapter? <span className="text-[var(--accent)]">*</span>
                        </label>
                        <textarea
                          id="why"
                          name="why"
                          value={formData.why}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                          rows={4}
                          className="w-full px-4 py-3 bg-white border-2 border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[var(--accent)] resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all font-body text-[var(--text-primary)]"
                          placeholder="Why do you want to run a chapter?"
                        />
                      </div>

                      {/* Who would you invite */}
                      <div>
                        <label htmlFor="whoYouInvite" className="block text-sm font-bold mb-2 text-[var(--text-primary)]">
                          Who would you invite?
                        </label>
                        <textarea
                          id="whoYouInvite"
                          name="whoYouInvite"
                          value={formData.whoYouInvite}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          rows={3}
                          className="w-full px-4 py-3 bg-white border-2 border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[var(--accent)] resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all font-body text-[var(--text-primary)]"
                          placeholder="Doesn't have to be names — types of people, communities, etc."
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                          className="btn-primary w-full text-lg py-4 shadow-lg"
                        >
                          {isSubmitting ? 'Submitting...' : "Let's chat →"}
                        </motion.button>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-red-50 border-2 border-red-200 rounded-lg"
                        >
                          <p className="text-red-600 text-sm font-semibold">{error}</p>
                        </motion.div>
                      )}
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="card text-center p-12 md:p-16 shadow-xl relative overflow-hidden"
                >
                  {/* Celebration gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--chapter-ny)]/5" />

                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-7xl mb-6"
                    >
                      🚀
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">You're in!</h2>
                    <p className="text-xl text-[var(--text-secondary)] font-body mb-8 max-w-lg mx-auto leading-relaxed">
                      We'll reach out soon to chat about bringing Shiphaus to <span className="text-[var(--accent)] font-bold">{formData.city}</span>.
                    </p>
                    <Link href="/" className="btn-primary inline-block text-lg">
                      ← Back to Home
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
