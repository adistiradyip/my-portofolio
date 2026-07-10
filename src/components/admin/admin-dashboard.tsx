"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Code2, Mail, MailWarning } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdminLanguage } from "@/components/admin/admin-language-provider";

type Stats = {
  projects: number;
  skills: number;
  messages: number;
  unread: number;
};

export function AdminDashboard({ stats }: { stats: Stats }) {
  const { t } = useAdminLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cards = [
    { title: t.dashboard.totalProjects, value: stats.projects, icon: FolderKanban },
    { title: t.dashboard.totalSkills, value: stats.skills, icon: Code2 },
    { title: t.dashboard.totalMessages, value: stats.messages, icon: Mail },
    { title: t.dashboard.unreadMessages, value: stats.unread, icon: MailWarning },
  ];

  if (!mounted) return null;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-extrabold text-foreground sm:text-3xl">{t.dashboard.title}</h1>
      <p className="mb-6 text-muted-foreground sm:mb-8">{t.dashboard.subtitle}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-foreground sm:text-3xl">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-4 shadow-sm sm:mt-10 sm:p-6">
        <h2 className="mb-4 text-lg font-extrabold text-foreground">{t.dashboard.quickStart}</h2>
        <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
          {t.dashboard.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
