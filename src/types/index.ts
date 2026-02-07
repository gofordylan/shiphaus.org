export interface ChapterLead {
  name: string;
  handle: string;
  avatar: string;
  x?: string;
  github?: string;
  website?: string;
  isFounder?: boolean;
}

export interface Chapter {
  id: string;
  city: string;
  country: string;
  lead: ChapterLead;
  color: string;
}

export type EventStatus = 'upcoming' | 'active' | 'closed';

export interface Event {
  id: string;
  chapterId: string;
  name: string;
  date: string;
  location: string;
  builderCount: number;
  projectCount: number;
  status?: EventStatus;
}

export type ProjectType = 'website' | 'application' | 'devtool' | 'video' | 'other';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface Project {
  id: string;
  title: string;
  description: string;
  deployedUrl?: string;
  githubUrl?: string;
  createdAt: string;
  chapterId: string;
  eventId?: string;
  builder: {
    name: string;
    avatar: string;
    uid: string;
  };
  type?: ProjectType;
  featured?: boolean;
  status?: SubmissionStatus;
  approvedAt?: string;
  approvedBy?: string;
}

export interface Submission {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  deployedUrl?: string;
  githubUrl?: string;
  builderName: string;
  chapterId?: string;
  eventId?: string;
  submittedAt: string;
  status: SubmissionStatus;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  chapterId?: string;
}
