"use client";

import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { SectionHeader } from "@/components/portfolio/section-header";
import { Reveal } from "@/components/portfolio/reveal";
import { useLanguage } from "@/components/portfolio/language-provider";
import { BlogDetailModal } from "@/components/portfolio/blog-detail-modal";
import { useMemo, useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop";

function formatBlogDate(date: string, locale: "en" | "id") {
  return new Date(date).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    month: "short",
    year: "numeric",
  });
}

type BlogItem = {
  id: string;
  slug: string | null;
  category: string;
  title: string;
  author: string;
  date: string;
  image: string;
  url: string | null;
  comingSoon: boolean;
  excerpt: string | null;
  content: string | null;
};

function BlogCardContent({
  blog,
  t,
}: {
  blog: BlogItem;
  t: ReturnType<typeof useLanguage>["t"];
}) {
  return (
    <>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className={`object-cover transition duration-500 ${
            blog.comingSoon ? "brightness-75" : "group-hover:scale-105"
          }`}
          unoptimized
        />
        {blog.comingSoon && (
          <span className="absolute left-4 top-4 rounded-full bg-[#ff5722] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
            {t.blog.comingSoon}
          </span>
        )}
      </div>
      <div className="p-5 sm:p-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#ff5722]">
          {blog.category}
        </span>
        <h2
          className={`mt-3 text-lg font-extrabold leading-snug text-pf-text ${
            blog.comingSoon ? "" : "transition group-hover:text-[#ff5722]"
          }`}
        >
          {blog.title}
        </h2>
        <p className="mt-4 text-sm text-pf-faint">
          {t.blog.by}{" "}
          <span className="font-semibold text-pf-subtle">{blog.author}</span>
          {" · "}
          {blog.date}
        </p>
        {!blog.comingSoon && (
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#ff5722]">
            {t.blog.readArticle}
          </p>
        )}
      </div>
    </>
  );
}

export function BlogsSection({ posts }: { posts: BlogPost[] }) {
  const { locale, t } = useLanguage();
  const [selectedPost, setSelectedPost] = useState<BlogItem | null>(null);

  const items = useMemo<BlogItem[]>(() => {
    if (posts.length > 0) {
      return [...posts]
        .sort((a, b) => {
          if (a.coming_soon !== b.coming_soon) {
            return Number(a.coming_soon) - Number(b.coming_soon);
          }
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        })
        .map((post) => ({
          id: post.id,
          slug: post.slug,
          category: post.category,
          title: post.title,
          author: post.author,
          date: formatBlogDate(post.published_at, locale),
          image: post.image_url || FALLBACK_IMAGE,
          url: post.external_url,
          comingSoon: post.coming_soon,
          excerpt: post.excerpt,
          content: post.content,
        }));
    }
    return t.blog.items.map((item) => ({
      id: item.id,
      slug: null as string | null,
      category: item.category,
      title: item.title,
      author: item.author,
      date: item.date,
      image: item.image,
      url: null as string | null,
      comingSoon: false,
      excerpt: null,
      content: null,
    }));
  }, [posts, locale, t.blog.items]);

  if (items.length === 0) {
    return (
      <section id="blog" className="bg-pf-bg py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
          <Reveal direction="up">
            <SectionHeader
              badge={t.blog.badge}
              title={t.blog.title}
              description={t.blog.description}
            />
            <p className="mt-8 rounded-2xl border border-dashed border-pf-border py-16 text-center text-pf-muted">
              {t.blog.empty}
            </p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="bg-pf-bg py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <Reveal direction="up">
          <SectionHeader
            badge={t.blog.badge}
            title={t.blog.title}
            description={t.blog.description}
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {items.map((blog, i) => {
            const hasSlugPage = Boolean(blog.slug) && !blog.comingSoon;
            const cardClass = `group overflow-hidden rounded-2xl border border-pf-border bg-pf-soft transition ${
              blog.comingSoon
                ? "cursor-default"
                : "cursor-pointer hover:-translate-y-1 hover:shadow-lg"
            }`;

            return (
              <Reveal key={blog.id} delay={i * 0.1} direction="up">
                {hasSlugPage ? (
                  <Link href={`/blog/${blog.slug}`} className={`block ${cardClass}`}>
                    <BlogCardContent blog={blog} t={t} />
                  </Link>
                ) : (
                  <article
                    className={cardClass}
                    onClick={() => {
                      if (!blog.comingSoon) setSelectedPost(blog);
                    }}
                    onKeyDown={(e) => {
                      if (!blog.comingSoon && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        setSelectedPost(blog);
                      }
                    }}
                    role={blog.comingSoon ? undefined : "button"}
                    tabIndex={blog.comingSoon ? undefined : 0}
                  >
                    <BlogCardContent blog={blog} t={t} />
                  </article>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>

      <BlogDetailModal
        post={selectedPost}
        open={Boolean(selectedPost)}
        onOpenChange={(open) => {
          if (!open) setSelectedPost(null);
        }}
      />
    </section>
  );
}
