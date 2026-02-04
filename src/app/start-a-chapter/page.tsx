'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

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
        setError(data.error || 'Didn\'t work. Try again?');
        return;
      }

      setIsSuccess(true);
    } catch {
      setError('Didn\'t work. Try again?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {!isSuccess ? (
        <>
          {/* Hero Section - Editorial Style */}
          <section className="relative py-20 md:py-32 px-4 overflow-hidden">
            {/* Subtle grain texture overlay */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left: Copy */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase bg-[var(--text-primary)] text-white">
                      Chapter Lead
                    </span>
                  </div>

                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 tracking-tight">
                    Run Shiphaus<br/>
                    in <span className="italic text-[var(--accent)]">your</span> city
                  </h1>

                  <div className="space-y-6 text-xl md:text-2xl text-[var(--text-secondary)] font-body leading-relaxed mb-12">
                    <p>
                      You know the builders in your city. The ones who actually ship.
                    </p>
                    <p>
                      You&apos;ve wanted a reason to bring them together. This is it.
                    </p>
                  </div>

                  <div className="inline-flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      Active chapters
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['NYC', 'Chicago', 'Boulder', 'Forest City'].map((city) => (
                        <span
                          key={city}
                          className="px-3 py-1.5 bg-[var(--text-primary)] text-white text-sm font-medium"
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Right: Photo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
                    <Image
                      src="/photo.jpeg"
                      alt="Shiphaus builders collaborating"
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Dark overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
                  </div>

                  {/* Floating stat card */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl border border-[var(--border-subtle)] max-w-[200px]"
                  >
                    <div className="text-4xl font-bold text-[var(--accent)] mb-1">14/14</div>
                    <div className="text-sm text-[var(--text-secondary)] font-body leading-tight">
                      projects shipped at first NYC event
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* What You'll Actually Do - Brutally Clear */}
          <section className="py-20 md:py-28 bg-[var(--text-primary)] text-white relative overflow-hidden">
            {/* Subtle accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />

            <div className="max-w-4xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-sm font-bold tracking-widest uppercase mb-12 text-white/40">
                  Your Role
                </h2>

                <div className="space-y-8 text-2xl md:text-3xl font-body leading-relaxed">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex gap-6"
                  >
                    <span className="text-[var(--accent)] font-bold shrink-0">01</span>
                    <p>
                      <strong className="font-bold text-white">Curate 10-15 builders</strong> who you&apos;d trust to ship something real in a day
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex gap-6"
                  >
                    <span className="text-[var(--accent)] font-bold shrink-0">02</span>
                    <p>
                      <strong className="font-bold text-white">Find a space</strong> for 8-10 hours (coworking space, office, someone&apos;s loft)
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex gap-6"
                  >
                    <span className="text-[var(--accent)] font-bold shrink-0">03</span>
                    <p>
                      <strong className="font-bold text-white">Set the vibe</strong> — you&apos;re the energy in the room, the one people look to
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex gap-6"
                  >
                    <span className="text-[var(--accent)] font-bold shrink-0">04</span>
                    <p>
                      <strong className="font-bold text-white">Run it again</strong> — monthly or quarterly, you decide the cadence
                    </p>
                  </motion.div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10">
                  <p className="text-lg text-white/60 font-body">
                    We handle: branding, playbooks, intros to other chapter leads, and whatever else you need.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Social Proof - Chapter Leads */}
          <section className="py-20 md:py-28 px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-sm font-bold tracking-widest uppercase mb-3 text-[var(--text-muted)]">
                  Current Chapter Leads
                </h2>
                <p className="text-3xl md:text-4xl font-bold">
                  You&apos;d be joining this crew
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-12">
                {[
                  {
                    quote: "First event: 14 people showed up. 14 projects shipped. That's when I knew this was different.",
                    author: "Alex Slobodnik",
                    role: "NYC Chapter Lead",
                    city: "New York",
                  },
                  {
                    quote: "The energy is real. No one leaves without shipping. That's the rule.",
                    author: "Dylan Brodeur",
                    role: "Forest City Chapter Lead",
                    city: "Forest City",
                  },
                ].map((testimonial, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="relative"
                  >
                    <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-[var(--accent)] to-transparent opacity-30" />
                    <div className="pl-8">
                      <p className="text-xl md:text-2xl font-body italic leading-relaxed mb-6 text-[var(--text-primary)]">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">{testimonial.author}</p>
                          <p className="text-sm text-[var(--text-muted)] font-body">{testimonial.role} • {testimonial.city}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Application Form - Clean & Serious */}
          <section className="py-20 md:py-28 px-4 bg-[var(--bg-secondary)]">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Apply to lead
                </h2>
                <p className="text-xl text-[var(--text-secondary)] font-body">
                  This is a serious commitment. We want to know you&apos;re ready.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 md:p-12 shadow-sm border border-[var(--border-subtle)]"
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name and Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold mb-3 text-[var(--text-primary)] uppercase tracking-wide">
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
                        className="w-full px-4 py-3 bg-white border border-[var(--border-strong)] focus:outline-none focus:border-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--text-primary)] font-medium"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold mb-3 text-[var(--text-primary)] uppercase tracking-wide">
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
                        className="w-full px-4 py-3 bg-white border border-[var(--border-strong)] focus:outline-none focus:border-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--text-primary)] font-medium"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-bold mb-3 text-[var(--text-primary)] uppercase tracking-wide">
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
                      className="w-full px-4 py-3 bg-white border border-[var(--border-strong)] focus:outline-none focus:border-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--text-primary)] font-medium"
                      placeholder="Where would you run Shiphaus?"
                    />
                  </div>

                  {/* Twitter and LinkedIn */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-bold mb-3 text-[var(--text-primary)] uppercase tracking-wide">
                        Twitter
                      </label>
                      <input
                        type="text"
                        id="twitter"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-white border border-[var(--border-strong)] focus:outline-none focus:border-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--text-primary)] font-medium"
                        placeholder="@handle"
                      />
                    </div>
                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-bold mb-3 text-[var(--text-primary)] uppercase tracking-wide">
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-white border border-[var(--border-strong)] focus:outline-none focus:border-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--text-primary)] font-medium"
                        placeholder="linkedin.com/in/..."
                      />
                    </div>
                  </div>

                  {/* What do you build */}
                  <div>
                    <label htmlFor="whatYouBuild" className="block text-sm font-bold mb-3 text-[var(--text-primary)] uppercase tracking-wide">
                      What do you build? <span className="text-[var(--accent)]">*</span>
                    </label>
                    <p className="text-sm text-[var(--text-muted)] mb-3 font-body">
                      We want to see you ship. Links, repos, products — show us.
                    </p>
                    <textarea
                      id="whatYouBuild"
                      name="whatYouBuild"
                      value={formData.whatYouBuild}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-[var(--border-strong)] focus:outline-none focus:border-[var(--text-primary)] resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-body text-[var(--text-primary)]"
                      placeholder="Apps, hardware, content, communities..."
                    />
                  </div>

                  {/* Why do you want to run a chapter */}
                  <div>
                    <label htmlFor="why" className="block text-sm font-bold mb-3 text-[var(--text-primary)] uppercase tracking-wide">
                      Why do you want to run a chapter? <span className="text-[var(--accent)]">*</span>
                    </label>
                    <p className="text-sm text-[var(--text-muted)] mb-3 font-body">
                      Be honest. What&apos;s the real motivation here?
                    </p>
                    <textarea
                      id="why"
                      name="why"
                      value={formData.why}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      rows={5}
                      className="w-full px-4 py-3 bg-white border border-[var(--border-strong)] focus:outline-none focus:border-[var(--text-primary)] resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-body text-[var(--text-primary)]"
                      placeholder="Your answer here..."
                    />
                  </div>

                  {/* Who would you invite */}
                  <div>
                    <label htmlFor="whoYouInvite" className="block text-sm font-bold mb-3 text-[var(--text-primary)] uppercase tracking-wide">
                      Who would you invite to the first event?
                    </label>
                    <p className="text-sm text-[var(--text-muted)] mb-3 font-body">
                      Names, types of people, communities — give us a sense of your network.
                    </p>
                    <textarea
                      id="whoYouInvite"
                      name="whoYouInvite"
                      value={formData.whoYouInvite}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-[var(--border-strong)] focus:outline-none focus:border-[var(--text-primary)] resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-body text-[var(--text-primary)]"
                      placeholder="Your answer here..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                      className="w-full bg-[var(--text-primary)] text-white px-8 py-5 font-bold text-lg uppercase tracking-wide hover:bg-[var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </motion.button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border border-red-200"
                    >
                      <p className="text-red-600 text-sm font-semibold">{error}</p>
                    </motion.div>
                  )}
                </form>
              </motion.div>
            </div>
          </section>
        </>
      ) : (
        /* Success State */
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl mb-8"
            >
              ✓
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Application received
            </h2>

            <p className="text-2xl text-[var(--text-secondary)] font-body mb-4 leading-relaxed">
              We&apos;ll review your application and reach out soon about bringing Shiphaus to <strong className="text-[var(--accent)]">{formData.city}</strong>.
            </p>

            <p className="text-lg text-[var(--text-muted)] font-body mb-12">
              Expect to hear from us within a week.
            </p>

            <Link
              href="/"
              className="inline-block bg-[var(--text-primary)] text-white px-8 py-4 font-bold uppercase tracking-wide hover:bg-[var(--accent)] transition-colors"
            >
              Back to Home
            </Link>
          </motion.div>
        </section>
      )}
    </div>
  );
}
