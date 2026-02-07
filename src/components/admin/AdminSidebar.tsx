'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Inbox, Layers, Calendar } from 'lucide-react';
import { ShiphausLogo } from '@/components/ShiphausLogo';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/submissions', label: 'Submissions', icon: Inbox, badge: true },
  { href: '/admin/projects', label: 'Projects', icon: Layers },
  { href: '/admin/events', label: 'Events', icon: Calendar },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => setPendingCount(data.pendingSubmissions || 0))
      .catch(() => {});
  }, []);

  return (
    <aside className="w-64 bg-[#1A1A1A] text-white flex flex-col shrink-0">
      <div className="p-4 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <ShiphausLogo size={40} />
          <span className="font-bold text-lg">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge && pendingCount > 0 && (
                <span className="bg-[var(--accent)] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-white/70 transition-colors"
        >
          View Site
        </Link>
      </div>
    </aside>
  );
}
