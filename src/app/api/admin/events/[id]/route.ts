import { NextRequest, NextResponse } from 'next/server';
import { updateEvent, deleteEvent, getEventById } from '@/lib/redis-data';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    await updateEvent(id, updates);
    const event = await getEventById(id);
    return NextResponse.json(event);
  } catch (error) {
    console.error('Event update error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteEvent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event delete error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
