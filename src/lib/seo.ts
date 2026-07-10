import type { Metadata } from "next";
import type { BlogPost, Profile } from "@/lib/types";
import { toIsoDate } from "@/lib/utils";

const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=630&fit=crop";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function resolveOgImage(imageUrl?: string | null, alt?: string) {
  const siteUrl = getSiteUrl();

  if (imageUrl) {
    const url = imageUrl.startsWith("http") ? imageUrl : `${siteUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
    return { url, width: 1200, height: 630, alt: alt || "Portfolio" };
  }

  return { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: alt || "Portfolio" };
}

export function buildHomeMetadata(profile: Profile | null): Metadata {
  const siteUrl = getSiteUrl();
  const name = profile?.full_name || "Adistira";
  const headline = profile?.headline || "Full Stack Developer";
  const title = `${name} — ${headline}`;
  const description =
    profile?.bio?.replace(/\s+/g, " ").trim().slice(0, 160) ||
    "Personal developer portfolio — projects, skills, work experience, and articles.";
  const image = resolveOgImage(profile?.avatar_url, name);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: siteUrl },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: name,
      type: "website",
      locale: "en_US",
      alternateLocale: ["id_ID"],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export function buildBlogMetadata(post: BlogPost, profile: Profile | null): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/blog/${post.slug}`;
  const author = post.author || profile?.full_name || "Adistira";
  const description =
    post.excerpt?.replace(/\s+/g, " ").trim().slice(0, 160) ||
    post.content?.replace(/\s+/g, " ").trim().slice(0, 160) ||
    `Read ${post.title} by ${author}.`;
  const image = resolveOgImage(post.image_url, post.title);

  const publishedTime = toIsoDate(post.published_at);
  const modifiedTime = toIsoDate(post.updated_at) ?? publishedTime;

  return {
    title: post.title,
    description,
    authors: [{ name: author }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      siteName: profile?.full_name || "Adistira",
      type: "article",
      locale: "en_US",
      alternateLocale: ["id_ID"],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      authors: [author],
      section: post.category,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image.url],
    },
  };
}
