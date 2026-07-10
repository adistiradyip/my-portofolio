"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkContactSpam } from "@/lib/spam-protection";
import type { BlogPost, Experience, Profile, Project, Service, Skill, Testimonial } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin");
  redirect("/admin/login");
}

export async function updateProfile(data: Partial<Profile>) {
  const supabase = await createClient();
  const { data: existing } = await supabase.from("profiles").select("id").limit(1).single();

  if (existing) {
    const { error } = await supabase
      .from("profiles")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("profiles").insert(data);
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/profile");
  return { success: true };
}

export async function saveProject(data: Partial<Project> & { title: string }) {
  const supabase = await createClient();
  const slug = data.slug || slugify(data.title);
  const payload = { ...data, slug, updated_at: new Date().toISOString() };

  if (data.id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("projects").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function saveSkill(data: Partial<Skill> & { name: string }) {
  const supabase = await createClient();

  if (data.id) {
    const { error } = await supabase.from("skills").update(data).eq("id", data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("skills").insert(data);
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true };
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { success: true };
}

export async function saveExperience(data: Partial<Experience> & { company: string; role: string }) {
  const supabase = await createClient();

  if (data.id) {
    const { error } = await supabase.from("experiences").update(data).eq("id", data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("experiences").insert(data);
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/experiences");
  return { success: true };
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/experiences");
  return { success: true };
}

export async function sendContactMessage(formData: FormData) {
  const headerList = await headers();
  const clientIp =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  const spamCheck = checkContactSpam(formData, clientIp);
  if (!spamCheck.ok) {
    return { error: spamCheck.code };
  }

  const supabase = await createClient();
  const name = (formData.get("name") as string).trim();
  const email = (formData.get("email") as string).trim();
  const message = (formData.get("message") as string).trim();

  const { error } = await supabase.from("contact_messages").insert({ name, email, message });
  if (error) return { error: "generic" };
  return { success: true };
}

export async function markMessageRead(id: string, read: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").update({ read }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function saveService(
  data: Partial<Service> & { title: string; description: string },
) {
  const supabase = await createClient();
  const payload = { ...data, updated_at: new Date().toISOString() };

  if (data.id) {
    const { error } = await supabase.from("services").update(payload).eq("id", data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("services").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/services");
  return { success: true };
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/services");
  return { success: true };
}

export async function saveTestimonial(
  data: Partial<Testimonial> & { quote: string; author: string; role: string },
) {
  const supabase = await createClient();
  const payload = { ...data, updated_at: new Date().toISOString() };

  if (data.id) {
    const { error } = await supabase.from("testimonials").update(payload).eq("id", data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("testimonials").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function saveBlogPost(data: Partial<BlogPost> & { title: string }) {
  const supabase = await createClient();
  const slug = data.slug || slugify(data.title);
  const payload = {
    ...data,
    slug,
    updated_at: new Date().toISOString(),
  };

  if (data.id) {
    const { error } = await supabase.from("blog_posts").update(payload).eq("id", data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("blog_posts").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/blog");
  revalidatePath(`/blog/${slug}`);
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  const { data: post } = await supabase.from("blog_posts").select("slug").eq("id", id).maybeSingle();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/blog");
  if (post?.slug) revalidatePath(`/blog/${post.slug}`);
  return { success: true };
}
