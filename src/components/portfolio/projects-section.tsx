"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project, Skill } from "@/lib/types";
import { SectionHeader } from "@/components/portfolio/section-header";
import { Reveal } from "@/components/portfolio/reveal";
import { useLanguage } from "@/components/portfolio/language-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, Code2, ExternalLink } from "lucide-react";

const INITIAL_VISIBLE = 3;

function sortProjectsForDisplay(projects: Project[]) {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) {
      return Number(b.featured) - Number(a.featured);
    }
    if (a.sort_order !== b.sort_order) {
      return a.sort_order - b.sort_order;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

function ProjectDetailModal({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useLanguage();

  if (!project) return null;

  const detailText = project.content?.trim() || project.description?.trim() || t.projects.noDetails;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-pf-border bg-pf-surface p-0 sm:max-w-2xl">
        <div className="border-b border-pf-border bg-gradient-to-br from-pf-accent-soft to-pf-surface p-6 sm:p-8">
          <DialogHeader className="gap-3 text-left">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pf-bg text-2xl font-extrabold text-[#ff5722] shadow-sm">
              {project.title.charAt(0).toUpperCase()}
            </div>
            <DialogTitle className="text-2xl font-extrabold text-pf-text">
              {project.title}
            </DialogTitle>
            {project.tech_stack?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-pf-bg px-3 py-1 text-xs font-semibold text-[#ff5722] shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </DialogHeader>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#ff5722]">
              {t.projects.badge}
            </h4>
            <p className="whitespace-pre-line text-sm leading-7 text-pf-muted">{detailText}</p>
          </div>

          {(project.live_url || project.github_url) && (
            <div className="flex flex-wrap gap-3 border-t border-pf-border pt-6">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[#ff5722] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64a19]"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t.projects.liveDemo}
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border-2 border-pf-text px-5 py-2.5 text-sm font-bold text-pf-text transition hover:bg-pf-text hover:text-pf-bg"
                >
                  <Code2 className="h-4 w-4" />
                  {t.projects.viewCode}
                </a>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectsSection({
  projects,
  skills,
  experienceCount,
}: {
  projects: Project[];
  skills: Skill[];
  experienceCount: number;
}) {
  const { t } = useLanguage();
  const allLabel = t.projects.all;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sortedProjects = useMemo(() => sortProjectsForDisplay(projects), [projects]);

  const categories = useMemo(() => {
    const tags = new Set<string>();
    sortedProjects.forEach((p) => p.tech_stack?.forEach((tag) => tags.add(tag)));
    return [allLabel, ...Array.from(tags)];
  }, [sortedProjects, allLabel]);

  const [active, setActive] = useState<string>(allLabel);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    setActive(allLabel);
  }, [allLabel]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [active]);

  const filtered =
    active === allLabel
      ? sortedProjects
      : sortedProjects.filter((p) => p.tech_stack?.includes(active));

  const visibleProjects = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;
  const canShowLess = visibleCount > INITIAL_VISIBLE;

  return (
    <section id="projects">
      <div className="bg-pf-soft py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
          <Reveal direction="up">
            <SectionHeader
              badge={t.projects.badge}
              title={t.projects.title}
              description={t.projects.description}
            />
          </Reveal>

          {sortedProjects.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-pf-border py-16 text-center text-pf-muted">
              {t.projects.empty}
            </p>
          ) : (
            <>
              <Reveal delay={0.05}>
                <ul className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-10 sm:gap-3">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => setActive(cat)}
                        className={`rounded-md px-4 py-2 text-sm font-bold transition sm:px-5 ${
                          active === cat
                            ? "bg-[#ff5722] text-white"
                            : "bg-pf-surface text-pf-muted hover:text-[#ff5722]"
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map((project, i) => (
                  <Reveal key={project.id} delay={i * 0.08} direction="scale">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="group flex h-full w-full flex-col rounded-2xl border border-pf-border bg-pf-surface p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#ff5722]/30 hover:shadow-lg"
                    >
                      <div className="mb-5 flex items-start justify-between gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pf-accent-soft text-lg font-extrabold text-[#ff5722] transition group-hover:bg-[#ff5722] group-hover:text-white">
                          {project.title.charAt(0).toUpperCase()}
                        </div>
                        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-pf-border transition group-hover:translate-x-0.5 group-hover:text-[#ff5722]" />
                      </div>

                      <h5 className="text-lg font-extrabold text-pf-text transition group-hover:text-[#ff5722]">
                        {project.title}
                      </h5>
                      <p className="mt-2 flex-1 line-clamp-3 text-sm leading-6 text-pf-muted">
                        {project.description ?? t.projects.fallbackDesc}
                      </p>

                      {project.tech_stack?.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.tech_stack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-pf-soft px-3 py-1 text-xs font-semibold text-pf-muted"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.tech_stack.length > 3 && (
                            <span className="rounded-full bg-pf-soft px-3 py-1 text-xs font-semibold text-pf-faint">
                              +{project.tech_stack.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[#ff5722]">
                        {t.projects.viewDetails}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </Reveal>
                ))}
              </div>

              {(hasMore || canShowLess) && (
                <Reveal delay={0.1}>
                  <div className="mt-10 flex flex-wrap justify-center gap-3">
                    {canShowLess && (
                      <button
                        type="button"
                        onClick={() => setVisibleCount(INITIAL_VISIBLE)}
                        className="rounded-md border-2 border-pf-border px-8 py-3 text-sm font-bold text-pf-muted transition hover:border-pf-text hover:text-pf-text"
                      >
                        {t.projects.showLess}
                      </button>
                    )}
                    {hasMore && (
                      <button
                        type="button"
                        onClick={() => setVisibleCount((count) => count + INITIAL_VISIBLE)}
                        className="rounded-md border-2 border-pf-text px-8 py-3 text-sm font-bold text-pf-text transition hover:bg-pf-text hover:text-pf-bg"
                      >
                        {t.projects.loadMore}
                      </button>
                    )}
                  </div>
                </Reveal>
              )}
            </>
          )}
        </div>
      </div>

      <ProjectDetailModal
        project={selectedProject}
        open={Boolean(selectedProject)}
        onOpenChange={(open) => {
          if (!open) setSelectedProject(null);
        }}
      />

      <div className="bg-pf-stats py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal direction="left">
              <div className="flex flex-col sm:flex-row sm:items-end">
                <span className="text-5xl font-black text-[#ff5722] sm:text-6xl md:text-8xl">
                  {projects.length}+
                </span>
                <span className="mt-2 text-base font-bold uppercase tracking-wider text-gray-400 sm:ml-4 sm:mt-0 sm:text-lg">
                  {t.stats.projects}
                </span>
              </div>
              <h2 className="mt-6 text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
                {t.stats.title}
              </h2>
              <p className="mt-4 max-w-lg text-gray-400">{t.stats.description}</p>
            </Reveal>

            <Reveal delay={0.15} direction="right">
              <div className="grid gap-6 sm:grid-cols-2">
                <Reveal delay={0.2} direction="scale">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <p className="text-4xl font-black text-[#ff5722]">{skills.length || "—"}</p>
                  <h6 className="mt-2 text-sm font-bold uppercase tracking-wider text-gray-300">
                    {t.stats.skills}
                  </h6>
                </div>
                </Reveal>
                <Reveal delay={0.28} direction="scale">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <p className="text-4xl font-black text-[#ff5722]">{experienceCount || "—"}</p>
                  <h6 className="mt-2 text-sm font-bold uppercase tracking-wider text-gray-300">
                    {t.stats.experience}
                  </h6>
                </div>
                </Reveal>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
