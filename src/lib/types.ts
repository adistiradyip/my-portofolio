export type Profile = {
  id: string;
  full_name: string;
  headline: string;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  cv_url: string | null;
  updated_at: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  image_url: string | null;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  sort_order: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  sort_order: number;
  created_at?: string;
};

export type ServiceIcon = "layout" | "box" | "monitor" | "sparkles";

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: ServiceIcon;
  sort_order: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
  sort_order: number;
  created_at?: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  sort_order: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  external_url: string | null;
  published_at: string;
  sort_order: number;
  status: "draft" | "published";
  coming_soon: boolean;
  created_at: string;
  updated_at: string;
};
