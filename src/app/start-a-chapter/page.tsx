'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold hover:text-yellow-400 transition-colors">
            Shiphaus
          </Link>
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-5xl font-bold mb-6">Run Shiphaus in Your City</h1>
            <p className="text-xl text-gray-400">
              Curate the builders. Find a space. Watch magic happen.
            </p>
          </motion.div>

          {/* Why Lead */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Why Lead</h2>
            <ul className="space-y-4">
              {[
                'You curate the room',
                'You watch ideas ship in 7 hours',
                'You make friends by making things',
                "You're connected to leads across cities",
                "You're early",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-yellow-400 text-xl">→</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6">Apply to Lead</h2>
            <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8 bg-white/5 border border-white/10 rounded-2xl">
                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Where would you run Shiphaus?"
                  />
                </div>

                {/* Twitter and LinkedIn */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium mb-2">
                      Twitter
                    </label>
                    <input
                      type="text"
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="@handle"
                    />
                  </div>
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="linkedin.com/in/..."
                    />
                  </div>
                </div>

                {/* What do you build */}
                <div>
                  <label htmlFor="whatYouBuild" className="block text-sm font-medium mb-2">
                    What do you build? *
                  </label>
                  <textarea
                    id="whatYouBuild"
                    name="whatYouBuild"
                    value={formData.whatYouBuild}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows={2}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Apps, hardware, content, communities..."
                  />
                </div>

                {/* Why do you want to run a chapter */}
                <div>
                  <label htmlFor="why" className="block text-sm font-medium mb-2">
                    Why do you want to run a chapter? *
                  </label>
                  <textarea
                    id="why"
                    name="why"
                    value={formData.why}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Why do you want to run a chapter?"
                  />
                </div>

                {/* Who would you invite */}
                <div>
                  <label htmlFor="whoYouInvite" className="block text-sm font-medium mb-2">
                    Who would you invite?
                  </label>
                  <textarea
                    id="whoYouInvite"
                    name="whoYouInvite"
                    value={formData.whoYouInvite}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    rows={2}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Doesn't have to be names — types of people, communities, etc."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Let's chat"}
                </motion.button>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
              </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
