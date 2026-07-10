import { createClient } from "@/lib/supabase/server";
import type { BlogPost, Experience, Profile, Project, Service, Skill, Testimonial } from "@/lib/types";

const fallbackProfile: Profile = {
  id: "local",
  full_name: "Your Name",
  headline: "Full Stack Developer",
  bio: "Passionate developer building modern web applications with Next.js, React, and Supabase.",
  avatar_url: null,
  email: "hello@example.com",
  phone: null,
  location: "Jakarta, Indonesia",
  github_url: null,
  linkedin_url: null,
  twitter_url: null,
  cv_url: null,
  updated_at: new Date().toISOString(),
};

export async function getProfile(): Promise<Profile> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("profiles").select("*").limit(1).single();
    return data ?? fallbackProfile;
  } catch {
    return fallbackProfile;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("coming_soon", { ascending: true })
      .order("published_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function getPublishedBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return posts.filter((post) => !post.coming_soon && post.slug).map((post) => post.slug);
}

export async function getAdminServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("created_at", { ascending: false })
    .order("sort_order", { ascending: false });

  if (error) {
    const fallback = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("id", { ascending: false });
    return fallback.data ?? [];
  }

  return data ?? [];
}

export async function getAdminExperiences(): Promise<Experience[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("created_at", { ascending: false })
    .order("sort_order", { ascending: false });

  if (error) {
    const fallback = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("id", { ascending: false });
    return fallback.data ?? [];
  }

  return data ?? [];
}

export async function getAdminProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    const fallback = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("id", { ascending: false });
    return fallback.data ?? [];
  }

  return data ?? [];
}

export async function getAdminStats() {
  const supabase = await createClient();
  const [projects, skills, messages] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("skills").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
  ]);

  const { count: unread } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("read", false);

  return {
    projects: projects.count ?? 0,
    skills: skills.count ?? 0,
    messages: messages.count ?? 0,
    unread: unread ?? 0,
  };
}
