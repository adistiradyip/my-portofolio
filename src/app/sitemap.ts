import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/queries";
import { getSiteUrl } from "@/lib/seo";
import { toIsoDate } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const posts = await getBlogPosts();

  const blogEntries: MetadataRoute.Sitemap = posts
    .filter((post) => !post.coming_soon && post.slug)
    .map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: toIsoDate(post.updated_at) ?? toIsoDate(post.published_at) ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...blogEntries,
  ];
}
