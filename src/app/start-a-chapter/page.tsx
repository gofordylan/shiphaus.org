'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const XLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function StartAChapter() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest uppercase bg-[var(--text-primary)] text-white rounded-lg">
              Chapter Lead
            </span>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Run Shiphaus<br />
              in <span className="italic text-[var(--accent)]">your</span> city
            </h1>

            <p className="text-xl text-[var(--text-secondary)] font-body leading-relaxed mb-8 max-w-2xl">
              You know who ships in your city. Bring them together.
            </p>

            <div className="inline-flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Active chapters
              </span>
              <div className="flex flex-wrap gap-2">
                {['NYC', 'Chicago', 'Boulder', 'Singapore'].map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1.5 bg-[var(--text-primary)] text-white text-sm font-medium rounded-lg"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Your Role */}
      <section className="py-20 bg-[var(--text-primary)] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold tracking-widest uppercase mb-8 text-white/40">
              Your Role
            </h2>

            <div className="space-y-6 text-2xl md:text-3xl font-body leading-relaxed">
              <div className="flex gap-6">
                <span className="text-[var(--accent)] font-bold shrink-0">01</span>
                <p><strong className="font-bold text-white">Invite anyone who builds.</strong> No resume required.</p>
              </div>
              <div className="flex gap-6">
                <span className="text-[var(--accent)] font-bold shrink-0">02</span>
                <p><strong className="font-bold text-white">Find a room.</strong> Loft, office, coffee shop -- anywhere with wifi and outlets.</p>
              </div>
              <div className="flex gap-6">
                <span className="text-[var(--accent)] font-bold shrink-0">03</span>
                <p><strong className="font-bold text-white">Lead the room.</strong> Keep energy up. Keep people shipping.</p>
              </div>
              <div className="flex gap-6">
                <span className="text-[var(--accent)] font-bold shrink-0">04</span>
                <p><strong className="font-bold text-white">Repeat.</strong> Each one gets better. So does your network.</p>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-white/10">
              <p className="text-lg text-white/60 font-body">
                You run the day. We bring the brand and the playbook. You bring the people.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111111] text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Next chapter starts with a DM.
            </h2>
            <p className="text-lg text-white/50 font-body">
              Tell us your city. We&apos;ll take it from there.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              { name: 'Dylan', handle: '@gofordylan', url: 'https://x.com/gofordylan' },
              { name: 'Slobo', handle: '@AlexSlobodnik', url: 'https://x.com/AlexSlobodnik' },
            ].map((person) => (
              <a
                key={person.handle}
                href={person.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 p-5 sm:p-6 rounded-xl border border-white/8 hover:border-[var(--accent)]/40 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300"
              >
                <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                    <XLogo className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-lg sm:text-xl leading-tight">{person.name}</p>
                    <p className="text-[var(--accent)] text-sm font-body">{person.handle}</p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="hidden sm:inline text-sm font-medium text-white/40 group-hover:text-[var(--accent)] transition-colors">
                    DM on X
                  </span>
                  <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
