"use client";

import Image from "next/image";
import { useLanguage } from "@/components/portfolio/language-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

type BlogItem = {
  id: string;
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

export function BlogDetailModal({
  post,
  open,
  onOpenChange,
}: {
  post: BlogItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useLanguage();

  if (!post) return null;

  const body = post.content?.trim() || post.excerpt?.trim() || t.blog.noContent;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden border-pf-border bg-pf-surface p-0 sm:max-w-3xl lg:max-w-4xl">
        <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-52 lg:h-60">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="border-b border-pf-border px-6 py-5 sm:px-8 sm:py-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff5722]">
              {post.category}
            </span>
            <DialogHeader className="mt-2 space-y-0 text-left">
              <DialogTitle className="text-2xl font-extrabold leading-snug text-pf-text sm:text-3xl">
                {post.title}
              </DialogTitle>
            </DialogHeader>
            <p className="mt-3 text-sm text-pf-muted">
              {t.blog.by}{" "}
              <span className="font-semibold text-pf-subtle">{post.author}</span>
              {" · "}
              {post.date}
            </p>
          </div>

          <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#ff5722]">
                {t.blog.badge}
              </h4>
              <p className="whitespace-pre-line text-base leading-8 text-pf-muted">{body}</p>
            </div>

            {post.url && (
              <div className="border-t border-pf-border pt-6">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[#ff5722] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64a19]"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t.blog.readFullArticle}
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
