import { notFound } from "next/navigation";
import { PortfolioProviders } from "@/components/portfolio/portfolio-providers";
import { BlogArticlePage } from "@/components/portfolio/blog-article-page";
import { getBlogPostBySlug, getProfile, getPublishedBlogSlugs } from "@/lib/queries";
import { buildBlogMetadata, getSiteUrl } from "@/lib/seo";
import type { BlogPost } from "@/lib/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPublishedBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || post.coming_soon) return {};

  const profile = await getProfile();
  return buildBlogMetadata(post, profile);
}

function buildArticleJsonLd(post: BlogPost, profileName: string) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.content?.slice(0, 160),
    image: post.image_url || undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author || profileName,
    },
    publisher: {
      "@type": "Person",
      name: profileName,
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, profile] = await Promise.all([getBlogPostBySlug(slug), getProfile()]);

  if (!post || post.coming_soon) {
    notFound();
  }

  const jsonLd = buildArticleJsonLd(post, profile.full_name);

  return (
    <PortfolioProviders>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogArticlePage post={post} profile={profile} />
    </PortfolioProviders>
  );
}
