"use client";

import type { Profile } from "@/lib/types";
import { Reveal } from "@/components/portfolio/reveal";
import { useLanguage } from "@/components/portfolio/language-provider";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      <Image
        src="/hero.svg"
        alt="Developer illustration"
        width={400}
        height={400}
        priority
        unoptimized
        className="h-auto w-full bg-transparent"
      />
    </div>
  );
}

export function HeroSection({ profile }: { profile: Profile }) {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden bg-pf-bg pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-24">
      <div className="pointer-events-none absolute -right-20 top-0 h-[400px] w-[400px] rounded-full bg-pf-hero-blob sm:-right-24 sm:h-[500px] sm:w-[500px] lg:-right-32 lg:h-[600px] lg:w-[600px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:gap-12 sm:px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal className="order-2 lg:order-1" direction="scale" delay={0.15}>
          <HeroVisual />
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal delay={0.05}>
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#ff5722]">
              {t.hero.badge}
            </span>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.15] text-pf-text">
              {t.hero.greeting}{" "}
              <span className="text-[#ff5722]">{profile.full_name}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-lg font-bold text-pf-subtle sm:text-xl">{profile.headline}</p>
            <p className="mt-4 max-w-lg text-base leading-7 text-pf-muted">
              {profile.bio ?? t.hero.defaultBio}
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-md bg-[#ff5722] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#e64a19]"
              >
                {t.hero.contactMe}
                <ArrowRight className="h-4 w-4" />
              </a>
              {profile.cv_url && (
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border-2 border-pf-text px-7 py-3.5 text-sm font-bold text-pf-text transition hover:bg-pf-text hover:text-pf-bg"
                >
                  {t.hero.downloadCv}
                </a>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4 lg:mt-10">
              {[
                { label: "GitHub", href: profile.github_url },
                { label: "LinkedIn", href: profile.linkedin_url },
                { label: "Twitter", href: profile.twitter_url },
              ]
                .filter((s) => s.href)
                .map((social) => (
                  <Link
                    key={social.label}
                    href={social.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-pf-faint transition hover:text-[#ff5722]"
                  >
                    {social.label}
                  </Link>
                ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
