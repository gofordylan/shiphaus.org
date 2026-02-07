'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Users, Layers, Trash2, Edit2 } from 'lucide-react';
import { EventForm } from '@/components/admin/EventForm';
import { Event } from '@/types';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);

  const fetchEvents = () => {
    setLoading(true);
    fetch('/api/admin/events')
      .then(r => r.json())
      .then((data: Event[]) => setEvents(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchEvents, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete event "${name}"?`)) return;
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/admin/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchEvents();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Events</h1>
          <p className="text-sm text-[var(--text-muted)]">{events.length} total</p>
        </div>
        <button
          onClick={() => { setEditingEvent(undefined); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <EventForm
            event={editingEvent}
            onSave={() => { setShowForm(false); fetchEvents(); }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl p-8 border border-[var(--border-subtle)] text-center">
          <p className="text-[var(--text-muted)]">Loading...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-xl p-5 border border-[var(--border-subtle)]">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold">{event.name}</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setEditingEvent(event); setShowForm(true); }}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id, event.name)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-sm text-[var(--text-secondary)] mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>{event.builderCount} builders</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>{event.projectCount} projects</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  event.status === 'active' ? 'bg-green-100 text-green-700' :
                  event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {event.status || 'closed'}
                </span>
                <div className="flex-1" />
                {event.status !== 'closed' && (
                  <button
                    onClick={() => handleStatusChange(event.id, 'closed')}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Close
                  </button>
                )}
                {event.status !== 'active' && event.status !== 'closed' && (
                  <button
                    onClick={() => handleStatusChange(event.id, 'active')}
                    className="text-xs text-green-600 hover:text-green-700 cursor-pointer"
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 border border-[var(--border-subtle)] text-center">
          <p className="text-[var(--text-muted)]">No events yet. Create one to get started.</p>
        </div>
      )}
    </div>
  );
}
