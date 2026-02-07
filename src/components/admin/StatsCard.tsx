import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

export function StatsCard({ label, value, icon: Icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-[var(--border-subtle)]">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
          <Icon className="w-4 h-4 text-[var(--text-muted)]" />
        </div>
        <span className="text-sm text-[var(--text-muted)]">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
