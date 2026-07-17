export interface GalleryImage {
  id: string;
  url: string;
  storage_path: string;
  caption: string | null;
  alt: string | null;
  sort_order: number;
  published: boolean;
  media_type: "image" | "video";
  show_on_home: boolean;
  created_at: string;
  title: string | null;
  tags: string[];
}

export type BookingStatus = "new" | "contacted" | "scheduled" | "closed";

export interface Booking {
  id: string;
  slot: string;
  name: string;
  email: string;
  company: string | null;
  size: string | null;
  goal: string | null;
  status: BookingStatus;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectResult {
  label: string;
  value: string;
}

export type ProjectStatus = "completed" | "in-progress" | "coming-soon";

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  category: string | null;
  year: string | null;
  status: ProjectStatus;
  summary: string | null;
  description: string;
  cover_image: string | null;
  tags: string[];
  results: ProjectResult[];
  link: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
