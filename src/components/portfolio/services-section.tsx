"use client";

import { useMemo } from "react";
import { Box, Layout, Monitor, Sparkles } from "lucide-react";
import type { Service, ServiceIcon } from "@/lib/types";
import { SectionHeader } from "@/components/portfolio/section-header";
import { Reveal } from "@/components/portfolio/reveal";
import { useLanguage } from "@/components/portfolio/language-provider";

const ICONS = {
  layout: Layout,
  box: Box,
  monitor: Monitor,
  sparkles: Sparkles,
} as const;

function resolveIcon(icon: string): ServiceIcon {
  if (icon in ICONS) return icon as ServiceIcon;
  return "layout";
}

export function ServicesSection({ services }: { services: Service[] }) {
  const { t } = useLanguage();

  const items = useMemo(() => {
    if (services.length > 0) {
      return services.map((service) => ({
        id: service.id,
        title: service.title,
        description: service.description,
        icon: resolveIcon(service.icon),
      }));
    }
    return t.services.items;
  }, [services, t.services.items]);

  return (
    <section id="services" className="bg-pf-soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <Reveal direction="up">
          <SectionHeader
            badge={t.services.badge}
            title={t.services.title}
            description={t.services.description}
          />
        </Reveal>

        {items.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-pf-border py-16 text-center text-pf-muted">
            {t.services.empty}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((service, i) => {
              const Icon = ICONS[service.icon];
              return (
                <Reveal key={service.id} delay={i * 0.08} direction="up">
                  <div className="group h-full rounded-2xl border border-pf-border bg-pf-surface p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#ff5722]/30 hover:shadow-xl sm:p-8">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-pf-accent-soft text-[#ff5722] transition group-hover:bg-[#ff5722] group-hover:text-white">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h4 className="text-lg font-extrabold text-pf-text">{service.title}</h4>
                    <p className="mt-3 text-sm leading-6 text-pf-muted">{service.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
