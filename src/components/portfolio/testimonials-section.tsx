"use client";

import { useEffect, useMemo, useState } from "react";
import type { Testimonial } from "@/lib/types";
import { SectionHeader } from "@/components/portfolio/section-header";
import { Reveal } from "@/components/portfolio/reveal";
import { useLanguage } from "@/components/portfolio/language-provider";
import { Quote } from "lucide-react";

const AUTO_PLAY_MS = 5000;

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const { locale, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const items = useMemo(() => {
    if (testimonials.length > 0) {
      return testimonials.map((item) => ({
        id: item.id,
        quote: item.quote,
        author: item.author,
        role: item.role,
      }));
    }
    return t.testimonials.items;
  }, [testimonials, t.testimonials.items]);

  const current = items[index];

  useEffect(() => {
    setIndex(0);
  }, [locale, items.length]);

  useEffect(() => {
    if (paused || items.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, items.length, locale]);

  if (items.length === 0) {
    return (
      <section id="testimonials" className="bg-pf-bg py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
          <Reveal direction="up">
            <SectionHeader
              badge={t.testimonials.badge}
              title={t.testimonials.title}
              description={t.testimonials.description}
            />
            <p className="mt-8 rounded-2xl border border-dashed border-pf-border py-16 text-center text-pf-muted">
              {t.testimonials.empty}
            </p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="bg-pf-bg py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <Reveal direction="up">
          <SectionHeader
            badge={t.testimonials.badge}
            title={t.testimonials.title}
            description={t.testimonials.description}
          />
        </Reveal>

        <Reveal delay={0.12} direction="scale">
          <div
            className="relative mx-auto max-w-3xl rounded-3xl border border-pf-border bg-pf-soft p-6 sm:p-10 md:p-14"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <Quote className="absolute right-4 top-4 h-8 w-8 text-[#ff5722]/20 sm:right-8 sm:top-8 sm:h-10 sm:w-10" />
            {current && (
              <div key={current.id} className="animate-in fade-in duration-500">
                <p className="pr-10 text-lg leading-relaxed text-pf-subtle sm:pr-14 md:text-xl">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <div className="mt-8">
                  <h4 className="font-extrabold text-pf-text">{current.author}</h4>
                  <p className="text-sm text-[#ff5722]">{current.role}</p>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center gap-2">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-[#ff5722]" : "w-2.5 bg-pf-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
