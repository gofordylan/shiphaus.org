'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>

      {/* Grain texture overlay */}
      <div className="fixed inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")' }} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent hover:from-yellow-200 hover:via-yellow-300 hover:to-yellow-200 transition-all duration-300"
          >
            Shiphaus
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Be a chapter lead</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent leading-[1.1]">
              Run Shiphaus in<br/>Your City
            </h1>

            <p className="text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Curate the builders. Find a space.<br/>
              Watch magic happen.
            </p>
          </motion.div>

          {/* Why Lead */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-white">Why Lead</h2>
            <div className="grid gap-4">
              {[
                'You curate the room',
                'You watch ideas ship in 7 hours',
                'You make friends by making things',
                "You're connected to leads across cities",
                "You're early",
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-500/20 group-hover:border-yellow-500/30 transition-all">
                    <span className="text-lg">→</span>
                  </div>
                  <span className="text-lg text-zinc-200 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Application Form / Success State */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 md:p-10 shadow-2xl"
                >
                  <h2 className="text-3xl font-bold mb-2 text-white">Apply to Lead</h2>
                  <p className="text-zinc-400 mb-8">Tell us about yourself and your city</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold mb-3 text-zinc-200">
                          Name <span className="text-yellow-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-3 text-zinc-200">
                          Email <span className="text-yellow-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-semibold mb-3 text-zinc-200">
                        City <span className="text-yellow-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        placeholder="Where would you run Shiphaus?"
                      />
                    </div>

                    {/* Twitter and LinkedIn */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="twitter" className="block text-sm font-semibold mb-3 text-zinc-200">
                          Twitter
                        </label>
                        <input
                          type="text"
                          id="twitter"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          placeholder="@handle"
                        />
                      </div>
                      <div>
                        <label htmlFor="linkedin" className="block text-sm font-semibold mb-3 text-zinc-200">
                          LinkedIn
                        </label>
                        <input
                          type="text"
                          id="linkedin"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          placeholder="linkedin.com/in/..."
                        />
                      </div>
                    </div>

                    {/* What do you build */}
                    <div>
                      <label htmlFor="whatYouBuild" className="block text-sm font-semibold mb-3 text-zinc-200">
                        What do you build? <span className="text-yellow-400">*</span>
                      </label>
                      <textarea
                        id="whatYouBuild"
                        name="whatYouBuild"
                        value={formData.whatYouBuild}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        rows={3}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        placeholder="Apps, hardware, content, communities..."
                      />
                    </div>

                    {/* Why do you want to run a chapter */}
                    <div>
                      <label htmlFor="why" className="block text-sm font-semibold mb-3 text-zinc-200">
                        Why do you want to run a chapter? <span className="text-yellow-400">*</span>
                      </label>
                      <textarea
                        id="why"
                        name="why"
                        value={formData.why}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        rows={4}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        placeholder="What excites you about leading a chapter?"
                      />
                    </div>

                    {/* Who would you invite */}
                    <div>
                      <label htmlFor="whoYouInvite" className="block text-sm font-semibold mb-3 text-zinc-200">
                        Who would you invite?
                      </label>
                      <textarea
                        id="whoYouInvite"
                        name="whoYouInvite"
                        value={formData.whoYouInvite}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        rows={3}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        placeholder="Doesn't have to be names — types of people, communities, etc."
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className="w-full px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Let's chat →"
                      )}
                    </motion.button>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                      >
                        <p className="text-red-400 text-sm font-medium">{error}</p>
                      </motion.div>
                    )}
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-12 md:p-16 text-center shadow-2xl"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-7xl mb-6"
                  >
                    🚀
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-4 text-white">You're in!</h2>
                  <p className="text-xl text-zinc-300 mb-10 max-w-md mx-auto leading-relaxed">
                    We'll reach out soon to chat about bringing Shiphaus to <span className="text-yellow-400 font-semibold">{formData.city}</span>.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
