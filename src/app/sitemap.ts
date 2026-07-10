import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/queries";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const posts = await getBlogPosts();

  const blogEntries: MetadataRoute.Sitemap = posts
    .filter((post) => !post.coming_soon && post.slug)
    .map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updated_at || post.published_at,
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
