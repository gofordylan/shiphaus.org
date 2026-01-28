export interface ChapterLead {
  name: string;
  handle: string;
  avatar: string;
  x?: string;
  website?: string;
}

export interface Chapter {
  id: string;
  city: string;
  country: string;
  lead: ChapterLead;
  color: string;
  projectCount: number;
  eventCount: number;
}

export interface Event {
  id: string;
  chapterId: string;
  name: string;
  date: string;
  location: string;
  attendeeCount: number;
  projectCount: number;
  photos: string[];
}

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
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  chapterId?: string;
}
