import { NextRequest, NextResponse } from 'next/server';
import { approveSubmission, rejectSubmission, deleteSubmission, deleteProject, getSubmissionById } from '@/lib/redis-data';
import { auth } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const { action, chapterId, eventId } = await request.json();

    if (action === 'approve') {
      const project = await approveSubmission(id, session?.user?.email || 'admin', chapterId, eventId);
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = await getSubmissionById(id);
    if (!submission) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await deleteSubmission(id);

    // Also delete the auto-created project
    const projectId = `proj-${id.replace('sub-', '')}`;
    await deleteProject(projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submission delete error:', error);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
