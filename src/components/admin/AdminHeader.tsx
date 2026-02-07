'use client';

import { useSession, signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-[var(--border-subtle)] px-6 py-3 flex items-center justify-end gap-4">
      {session?.user && (
        <>
          <div className="flex items-center gap-3">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || ''}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="text-sm">
              <p className="font-medium">{session.user.name}</p>
              <p className="text-[var(--text-muted)] text-xs">{session.user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </>
      )}
    </header>
  );
}
