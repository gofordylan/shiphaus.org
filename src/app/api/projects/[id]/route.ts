import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getProjectById, updateProject, deleteProject } from '@/lib/redis-data';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isAdmin = (session.user as Record<string, unknown>).isAdmin === true;
    const isOwner = project.submittedBy === session.user.email;
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, deployedUrl, githubUrl } = body;

    await updateProject(id, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(deployedUrl !== undefined && { deployedUrl }),
      ...(githubUrl !== undefined && { githubUrl }),
    });

    const updated = await getProjectById(id);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isAdmin = (session.user as Record<string, unknown>).isAdmin === true;
    const isOwner = project.submittedBy === session.user.email;
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
