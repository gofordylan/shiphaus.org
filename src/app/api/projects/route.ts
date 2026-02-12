import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, getProjectsByChapter, getProjectsByEvent, getSubmissionsByEvent, getEventsByChapter } from '@/lib/redis-data';
import { Project, ProjectType } from '@/types';

export const dynamic = 'force-dynamic';

// Convert an approved submission to a Project for display
function submissionToProject(sub: { id: string; title: string; description: string; deployedUrl?: string; githubUrl?: string; builderName: string; builderAvatar?: string; submittedBy?: string; chapterId?: string; eventId?: string; submittedAt: string; type: string }): Project {
  return {
    id: `proj-${sub.id.replace('sub-', '')}`,
    title: sub.title,
    description: sub.description,
    deployedUrl: sub.deployedUrl,
    githubUrl: sub.githubUrl,
    createdAt: sub.submittedAt,
    chapterId: sub.chapterId || '',
    eventId: sub.eventId,
    builder: {
      name: sub.builderName,
      avatar: sub.builderAvatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(sub.builderName)}`,
      uid: sub.builderName.toLowerCase().replace(/\s+/g, '-'),
    },
    type: sub.type as ProjectType,
    featured: false,
    status: 'approved',
    approvedBy: sub.submittedBy || '',
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chapter = searchParams.get('chapter');
    const event = searchParams.get('event');

    let projects: Project[];
    if (chapter) {
      projects = await getProjectsByChapter(chapter);

      // Also merge in approved submissions that may not have a matching project
      try {
        const events = await getEventsByChapter(chapter);
        for (const evt of events) {
          const subs = await getSubmissionsByEvent(evt.id);
          for (const sub of subs.filter(s => s.status === 'approved')) {
            const projId = `proj-${sub.id.replace('sub-', '')}`;
            if (!projects.some(p => p.id === projId)) {
              projects.push(submissionToProject(sub));
            }
          }
        }
      } catch {}
    } else if (event) {
      projects = await getProjectsByEvent(event);

      // Also merge in approved submissions for this event
      try {
        const subs = await getSubmissionsByEvent(event);
        for (const sub of subs.filter(s => s.status === 'approved')) {
          const projId = `proj-${sub.id.replace('sub-', '')}`;
          if (!projects.some(p => p.id === projId)) {
            projects.push(submissionToProject(sub));
          }
        }
      } catch {}
    } else {
      projects = await getAllProjects();
    }

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
