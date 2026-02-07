import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSubmissionById, updateSubmission, deleteSubmission, deleteProject } from '@/lib/redis-data';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const submission = await getSubmissionById(id);
  if (!submission) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const isAdmin = (session.user as unknown as Record<string, unknown>)?.isAdmin === true;
  if (submission.submittedBy !== session.user.email && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, type, deployedUrl, githubUrl, builderName } = body;

  await updateSubmission(id, {
    ...(title && { title }),
    ...(description && { description }),
    ...(type && { type }),
    ...(deployedUrl !== undefined && { deployedUrl: deployedUrl || undefined }),
    ...(githubUrl !== undefined && { githubUrl: githubUrl || undefined }),
    ...(builderName && { builderName }),
  });

  const updated = await getSubmissionById(id);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const submission = await getSubmissionById(id);
  if (!submission) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const isAdmin = (session.user as unknown as Record<string, unknown>)?.isAdmin === true;
  if (submission.submittedBy !== session.user.email && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await deleteSubmission(id);

  // Also delete the auto-created project
  const projectId = `proj-${id.replace('sub-', '')}`;
  await deleteProject(projectId);

  return NextResponse.json({ success: true });
}
