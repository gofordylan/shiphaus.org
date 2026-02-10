'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Cpu,
  Terminal,
  Copy,
  Check,
  ChevronDown,
  Search,
  FolderOpen,
  Sparkles,
  CreditCard,
  LogIn,
  Rocket,
  Apple,
  Monitor,
} from 'lucide-react';

type Platform = 'mac' | 'windows';

const CURL_COMMAND = 'curl -fsSL https://shiphaus.org/setup.sh | bash';
const WINDOWS_COMMAND = 'irm https://shiphaus.org/setup.ps1 | iex';

const macTools = [
  {
    icon: Package,
    name: 'Homebrew',
    description:
      'A tool that helps install other tools on your Mac. Think of it like an app store for your terminal, except everything is free.',
  },
  {
    icon: Cpu,
    name: 'Node.js',
    description:
      'The engine that powers Claude Code behind the scenes. You won\'t interact with it directly, but it needs to be there.',
  },
  {
    icon: Terminal,
    name: 'Claude Code',
    description:
      'The AI assistant itself. Once installed, you\'ll type "claude" in your terminal and start building things through conversation.',
  },
];

const windowsTools = [
  {
    icon: Cpu,
    name: 'Node.js',
    description:
      'The engine that powers Claude Code behind the scenes. You won\'t interact with it directly, but it needs to be there.',
  },
  {
    icon: Terminal,
    name: 'Claude Code',
    description:
      'The AI assistant itself. Once installed, you\'ll type "claude" in your terminal and start building things through conversation.',
  },
];

const macSteps = [
  {
    number: '1',
    title: 'Open Terminal',
    description: (
      <>
        Press <kbd className="inline-block px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-sm font-mono border border-[var(--border-strong)]">Cmd</kbd> + <kbd className="inline-block px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-sm font-mono border border-[var(--border-strong)]">Space</kbd> to
        open Spotlight, then type <strong>Terminal</strong> and hit Enter. You can also find it
        in Applications &rarr; Utilities &rarr; Terminal.
      </>
    ),
    icon: Search,
  },
  {
    number: '2',
    title: 'Paste the Setup Command',
    description:
      'Copy the command below and paste it into your terminal window. It will check what you already have and only install what\'s missing.',
    icon: Copy,
    hasCommand: true,
  },
  {
    number: '3',
    title: 'Let It Run',
    description:
      'The script will take care of everything. It might ask for your Mac password. That\'s totally normal. Just type it in (you won\'t see the characters) and press Enter.',
    icon: FolderOpen,
  },
  {
    number: '4',
    title: 'Launch Claude Code',
    description: (
      <>
        Once everything is installed, type <code className="inline-block px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-sm font-mono border border-[var(--border-strong)]">claude</code> in
        your terminal and press Enter. That&apos;s it, you&apos;re in!
      </>
    ),
    icon: Sparkles,
  },
];

const windowsSteps = [
  {
    number: '1',
    title: 'Open PowerShell',
    description: (
      <>
        Press <kbd className="inline-block px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-sm font-mono border border-[var(--border-strong)]">Win</kbd> + <kbd className="inline-block px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-sm font-mono border border-[var(--border-strong)]">X</kbd> and
        select <strong>Terminal</strong> or <strong>PowerShell</strong>. You can also search for &quot;PowerShell&quot; in the Start menu.
      </>
    ),
    icon: Search,
  },
  {
    number: '2',
    title: 'Paste the Setup Command',
    description:
      'Copy the command below and paste it into PowerShell. It will check what you already have and only install what\'s missing.',
    icon: Copy,
    hasCommand: true,
  },
  {
    number: '3',
    title: 'Let It Run',
    description:
      'The script will take care of everything. If it asks for permission to install something, just click Yes or type Y and press Enter.',
    icon: FolderOpen,
  },
  {
    number: '4',
    title: 'Launch Claude Code',
    description: (
      <>
        Once everything is installed, type <code className="inline-block px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-sm font-mono border border-[var(--border-strong)]">claude</code> in
        your terminal and press Enter. That&apos;s it, you&apos;re in!
      </>
    ),
    icon: Sparkles,
  },
];

const afterSetupItems = [
  {
    icon: CreditCard,
    title: 'Get a Claude Pro subscription',
    description: (
      <>
        Claude Code requires a{' '}
        <a
          href="https://claude.ai/upgrade"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:underline"
        >
          Claude Pro plan
        </a>{' '}
        ($20/month). Sign up at{' '}
        <a
          href="https://claude.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:underline"
        >
          claude.ai
        </a>{' '}
        if you don&apos;t have one yet.
      </>
    ),
  },
  {
    icon: LogIn,
    title: 'Sign in with your Claude account',
    description:
      'The first time you run Claude Code, it\'ll open a browser window to sign in. Use your Claude account (the same one from claude.ai). Don\'t use an API key.',
  },
  {
    icon: Rocket,
    title: 'You\'re ready for the workshop!',
    description:
      'Show up, sit down, and start building. We\'ll take it from there.',
  },
];

const faqs = [
  {
    question: 'Is this safe to run?',
    answer:
      'Yes! These are all standard developer tools used by millions of people every day. The setup script only installs well-known, trusted software.',
  },
  {
    question: 'What if something goes wrong?',
    answer:
      'Don\'t stress about it. If anything looks off or you get stuck, just stop and bring your laptop to the event. We\'ll troubleshoot together. That\'s what we\'re here for.',
  },
  {
    question: 'Do I need to know how to code?',
    answer:
      'Nope! That\'s the whole point of Claude Code. You describe what you want to build in plain English, and it writes the code for you. Zero experience required.',
  },
  {
    question: 'How long does the setup take?',
    answer:
      'Usually about 5 to 10 minutes, depending on your internet speed. Most of that time is just waiting for things to download.',
  },
  {
    question: 'Do I need to pay for Claude?',
    answer:
      'Yes, Claude Code requires a Claude Pro subscription ($20/month). You can sign up at claude.ai before the event.',
  },
];

function CopyButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-sm text-white/70 hover:text-white cursor-pointer"
      aria-label="Copy command to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function PlatformToggle({ platform, onChange }: { platform: Platform; onChange: (p: Platform) => void }) {
  return (
    <div className="inline-flex rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-1">
      <button
        onClick={() => onChange('mac')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
          platform === 'mac'
            ? 'bg-white text-[var(--text-primary)] shadow-sm'
            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
        }`}
      >
        <Apple className="w-4 h-4" />
        Mac
      </button>
      <button
        onClick={() => onChange('windows')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
          platform === 'windows'
            ? 'bg-white text-[var(--text-primary)] shadow-sm'
            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
        }`}
      >
        <Monitor className="w-4 h-4" />
        Windows
      </button>
    </div>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border-b border-[var(--border-subtle)]"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
      >
        <span className="text-lg font-semibold pr-4 group-hover:text-[var(--accent)] transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[var(--text-secondary)] font-body leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SetupPage() {
  const [platform, setPlatform] = useState<Platform>('mac');

  const tools = platform === 'mac' ? macTools : windowsTools;
  const steps = platform === 'mac' ? macSteps : windowsSteps;
  const command = platform === 'mac' ? CURL_COMMAND : WINDOWS_COMMAND;

  return (
    <>
      {/* Hero Section */}
      <section className="hero-pattern relative overflow-hidden">
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[var(--accent)] font-semibold text-sm tracking-widest uppercase mb-4">
              Workshop Prep
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Get Set Up with{' '}
              <span className="text-[var(--accent)]">Claude Code</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-[var(--text-secondary)] font-body leading-relaxed max-w-2xl mx-auto mb-8"
          >
            Everything you need before the Shiphaus build event. Follow these
            steps and you&apos;ll be ready to start building the moment you sit
            down.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <PlatformToggle platform={platform} onChange={setPlatform} />
          </motion.div>
        </div>
      </section>

      {/* What is Claude Code */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is Claude Code?
            </h2>
            <div className="max-w-3xl">
              <p className="text-lg text-[var(--text-secondary)] font-body leading-relaxed mb-4">
                Claude Code is an AI coding assistant that lives in your
                terminal. You tell it what you want to build in plain
                English, and it writes the code for you.
              </p>
              <p className="text-lg text-[var(--text-secondary)] font-body leading-relaxed">
                No coding experience needed. That&apos;s the whole point. You
                bring the idea, Claude Code handles the technical stuff.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What You'll Install */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What You&apos;ll Install
            </h2>
            <p className="text-[var(--text-secondary)] font-body text-lg max-w-2xl">
              {platform === 'mac' ? 'Three things' : 'Two things'}, all free, all trusted, and all taken care of by the
              setup script.
            </p>
          </motion.div>

          <div className={`grid ${platform === 'mac' ? 'sm:grid-cols-3' : 'sm:grid-cols-2 max-w-2xl'} gap-6`}>
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center mb-4">
                  <tool.icon className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                <p className="text-[var(--text-secondary)] font-body leading-relaxed text-sm">
                  {tool.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Set Up */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How to Set Up
            </h2>
            <p className="text-[var(--text-secondary)] font-body text-lg max-w-2xl">
              Four quick steps and you&apos;re done. The whole thing takes about
              5 to 10 minutes.
            </p>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={`${platform}-${step.number}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 sm:gap-6"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-[var(--text-secondary)] font-body leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {step.hasCommand && (
                    <div className="rounded-xl bg-[#1A1A1A] p-4 sm:p-5 flex items-center justify-between gap-4">
                      <code className="text-green-400 font-mono text-sm sm:text-base break-all">
                        {command}
                      </code>
                      <CopyButton command={command} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* After Setup */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              After Setup
            </h2>
            <p className="text-[var(--text-secondary)] font-body text-lg max-w-2xl">
              A few small things to wrap up before the workshop.
            </p>
          </motion.div>

          <div className="space-y-6">
            {afterSetupItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 sm:gap-5 items-start"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-[var(--text-secondary)] font-body leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Common Questions
            </h2>
            <p className="text-[var(--text-secondary)] font-body text-lg">
              Totally fair things to wonder about.
            </p>
          </motion.div>

          <div>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
