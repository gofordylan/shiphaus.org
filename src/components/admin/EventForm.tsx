'use client';

import { useState, FormEvent } from 'react';
import { chapters } from '@/lib/data';
import { Event } from '@/types';

interface EventFormProps {
  event?: Event;
  onSave: () => void;
  onCancel: () => void;
}

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [name, setName] = useState(event?.name || '');
  const [chapterId, setChapterId] = useState(event?.chapterId || '');
  const [date, setDate] = useState(event?.date || '');
  const [location, setLocation] = useState(event?.location || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !chapterId || !date || !location) {
      setError('All fields are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = event ? `/api/admin/events/${event.id}` : '/api/admin/events';
      const method = event ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, chapterId, date, location }),
      });

      if (res.ok) {
        onSave();
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 border border-[var(--border-subtle)] space-y-4">
      <h3 className="font-semibold">{event ? 'Edit Event' : 'Create Event'}</h3>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border-strong)] text-sm"
          placeholder="Shiphaus NYC #4"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Chapter</label>
          <select
            value={chapterId}
            onChange={(e) => setChapterId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border-strong)] text-sm bg-white"
          >
            <option value="">Select...</option>
            {chapters.map(c => (
              <option key={c.id} value={c.id}>{c.city}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border-strong)] text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border-strong)] text-sm"
          placeholder="New York"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? 'Saving...' : event ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] text-sm font-medium hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
