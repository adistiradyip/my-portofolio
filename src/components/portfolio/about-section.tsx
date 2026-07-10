"use client";

import type { Experience, Profile, Skill } from "@/lib/types";
import { SectionHeader } from "@/components/portfolio/section-header";
import { Reveal } from "@/components/portfolio/reveal";
import { useLanguage } from "@/components/portfolio/language-provider";
import {
  formatExperienceDuration,
  formatExperiencePeriod,
} from "@/lib/experience-utils";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function AboutSection({
  profile,
  skills,
  experiences,
}: {
  profile: Profile;
  skills: Skill[];
  experiences: Experience[];
}) {
  const { locale, t } = useLanguage();
  const firstName = profile.full_name.split(" ")[0];

  return (
    <section className="bg-pf-bg pb-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div
          id="about"
          className="mt-10 scroll-mt-[7rem] sm:mt-12 md:mt-0 md:scroll-mt-28"
        >
        <div className="grid gap-10 md:gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal direction="left">
            <SectionHeader
              badge={t.about.badge}
              title={t.about.title(firstName)}
              description={profile.bio ?? t.about.defaultBio}
              align="left"
            />

            <ul className="space-y-6">
              {t.about.features.map((feature, i) => (
                <Reveal key={feature.id} delay={0.08 + i * 0.08} direction="left">
                  <li className="flex gap-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#ff5722]" />
                    <div>
                      <h4 className="font-extrabold text-pf-text">{feature.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-pf-muted">{feature.description}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.3} direction="left">
            <a
              href="#projects"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#ff5722] transition hover:gap-3"
            >
              {t.about.viewProjects} <ArrowRight className="h-4 w-4" />
            </a>
            </Reveal>
          </Reveal>

          <Reveal delay={0.12} direction="right">
            <div className="rounded-3xl bg-pf-soft p-6 sm:p-8 md:p-10">
              <h3 className="text-xl font-extrabold text-pf-text">{t.about.skillsTitle}</h3>

              {skills.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <Reveal key={skill.id} delay={0.1 + i * 0.04} direction="scale">
                      <span className="rounded-full bg-pf-surface px-4 py-2 text-sm font-semibold text-pf-subtle shadow-sm">
                        {skill.name}
                      </span>
                    </Reveal>
                  ))}
                </div>
              )}

              {experiences.length > 0 && (
                <div className="mt-8 space-y-4">
                  {experiences.slice(0, 3).map((exp, i) => (
                    <Reveal key={exp.id} delay={0.12 + i * 0.08} direction="right">
                    <div className="rounded-xl bg-pf-surface p-4 shadow-sm">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-pf-text">{exp.role}</p>
                          <p className="text-sm text-[#ff5722]">{exp.company}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-pf-accent-soft px-3 py-1 text-xs font-bold text-[#ff5722]">
                          {formatExperienceDuration(exp, locale)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-pf-faint">
                        {formatExperiencePeriod(exp, locale)}
                      </p>
                      {exp.description && (
                        <p className="mt-2 text-sm text-pf-muted">{exp.description}</p>
                      )}
                    </div>
                    </Reveal>
                  ))}
                </div>
              )}

              {skills.length === 0 && experiences.length === 0 && (
                <p className="mt-4 text-sm text-pf-muted">{t.about.emptyCms}</p>
              )}
            </div>
          </Reveal>
        </div>
        </div>
      </div>
    </section>
  );
}
