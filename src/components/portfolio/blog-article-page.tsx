"use client";

import Image from "next/image";
import Link from "next/link";
import type { BlogPost, Profile } from "@/lib/types";
import { PortfolioNavbar } from "@/components/portfolio/portfolio-navbar";
import { PortfolioFooter } from "@/components/portfolio/portfolio-footer";
import { ScrollToTop } from "@/components/portfolio/scroll-to-top";
import { useLanguage } from "@/components/portfolio/language-provider";
import { ExternalLink, ArrowLeft, ChevronRight } from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop";

function formatBlogDate(date: string, locale: "en" | "id") {
  const normalized = date.includes(" ") ? date.replace(" ", "T") : date;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function BackButton({ label }: { label: string }) {
  return (
    <Link
      href="/#blog"
      className="inline-flex items-center gap-2 rounded-full border border-pf-border bg-pf-surface px-4 py-2 text-sm font-semibold text-pf-text shadow-sm transition hover:border-[#ff5722] hover:text-[#ff5722]"
    >
      <ArrowLeft className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

export function BlogArticlePage({
  post,
  profile,
}: {
  post: BlogPost;
  profile: Profile;
}) {
  const { locale, t } = useLanguage();
  const image = post.image_url || FALLBACK_IMAGE;
  const body = post.content?.trim() || post.excerpt?.trim() || t.blog.noContent;

  return (
    <main className="bg-pf-bg text-pf-text">
      <PortfolioNavbar brandName={profile.full_name} />

      {/* Spacer + sticky sub-nav below fixed header */}
      <div className="pt-[4.25rem] sm:pt-[4.75rem]">
        <div className="sticky top-[4.25rem] z-40 border-b border-pf-border bg-pf-bg/95 backdrop-blur-sm sm:top-[4.75rem]">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <BackButton label={t.blog.backToBlog} />

            <nav
              aria-label="Breadcrumb"
              className="hidden items-center gap-1.5 text-xs text-pf-faint sm:flex"
            >
              <Link href="/" className="font-medium transition hover:text-[#ff5722]">
                {t.nav.home}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/#blog" className="font-medium transition hover:text-[#ff5722]">
                {t.nav.blog}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="max-w-[12rem] truncate font-semibold text-pf-subtle">
                {post.title}
              </span>
            </nav>
          </div>
        </div>

        <article className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-pf-border shadow-sm">
            <Image
              src={image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>

          <header className="mt-8 border-b border-pf-border pb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff5722]">
              {post.category}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-pf-text sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-pf-muted">
              {t.blog.by}{" "}
              <span className="font-semibold text-pf-subtle">{post.author}</span>
              {" · "}
              {formatBlogDate(post.published_at, locale)}
            </p>
          </header>

          <div className="prose-pf mt-8 whitespace-pre-line text-base leading-8 text-pf-muted">
            {body}
          </div>

          {post.external_url && (
            <div className="mt-10 border-t border-pf-border pt-8">
              <a
                href={post.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#ff5722] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64a19]"
              >
                <ExternalLink className="h-4 w-4" />
                {t.blog.readFullArticle}
              </a>
            </div>
          )}

          <div className="mt-12 flex flex-col items-center gap-4 border-t border-pf-border pt-10 sm:flex-row sm:justify-between">
            <BackButton label={t.blog.backToBlog} />
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff5722] transition hover:text-[#e64a19]"
            >
              {t.nav.contactCta}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </div>

      <PortfolioFooter profile={profile} />
      <ScrollToTop />
    </main>
  );
}
