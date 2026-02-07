import { NextRequest, NextResponse } from 'next/server';
import { approveSubmission, rejectSubmission } from '@/lib/redis-data';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action, chapterId, eventId } = await request.json();

    if (action === 'approve') {
      const project = await approveSubmission(id, 'admin', chapterId, eventId);
      return NextResponse.json(project);
    } else if (action === 'reject') {
      await rejectSubmission(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Submission action error:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
