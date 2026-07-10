"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions";
import { useAdminShell } from "@/components/admin/admin-shell";
import { useAdminLanguage } from "@/components/admin/admin-language-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Code2,
  User,
  Briefcase,
  Mail,
  LogOut,
  ExternalLink,
  X,
  MessageSquareQuote,
  Newspaper,
  Layers,
} from "lucide-react";

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const { closeMobile } = useAdminShell();
  const { t } = useAdminLanguage();

  const navItems = [
    { href: "/admin", label: t.nav.dashboard, icon: LayoutDashboard, exact: true },
    { href: "/admin/profile", label: t.nav.profile, icon: User },
    { href: "/admin/projects", label: t.nav.projects, icon: FolderKanban },
    { href: "/admin/services", label: t.nav.services, icon: Layers },
    { href: "/admin/skills", label: t.nav.skills, icon: Code2 },
    { href: "/admin/experiences", label: t.nav.experience, icon: Briefcase },
    { href: "/admin/testimonials", label: t.nav.testimonials, icon: MessageSquareQuote },
    { href: "/admin/blog", label: t.nav.blog, icon: Newspaper },
    { href: "/admin/messages", label: t.nav.messages, icon: Mail },
  ];

  return (
    <>
      <div className={cn("mb-8", collapsed && "mb-6 text-center")}>
        {collapsed ? (
          <p className="text-2xl font-extrabold text-red-600">A</p>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-foreground">
              <span className="text-red-600">A</span>distira
            </h1>
            <p className="text-sm font-semibold text-primary">{t.nav.cmsTitle}</p>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              onClick={closeMobile}
              className={cn(
                "flex items-center rounded-lg text-sm font-semibold transition",
                collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
                active
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-border pt-4">
        <Link
          href="/"
          target="_blank"
          title={collapsed ? t.nav.viewWebsite : undefined}
          className={cn(
            "flex items-center rounded-lg text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-primary",
            collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
          )}
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!collapsed && t.nav.viewWebsite}
        </Link>
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            title={collapsed ? t.nav.logout : undefined}
            className={cn(
              "w-full text-muted-foreground hover:bg-accent hover:text-primary",
              collapsed ? "justify-center px-2" : "justify-start gap-3",
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && t.nav.logout}
          </Button>
        </form>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const { collapsed, mobileOpen, closeMobile } = useAdminShell();

  return (
    <>
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-border bg-card p-4 shadow-sm transition-all duration-300 md:flex",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={closeMobile}
            aria-label="Close sidebar"
          />
          <aside className="relative flex h-full w-[min(16rem,85vw)] flex-col overflow-y-auto bg-card p-6 shadow-xl">
            <button
              type="button"
              onClick={closeMobile}
              className="absolute right-4 top-4 text-muted-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent collapsed={false} />
          </aside>
        </div>
      )}
    </>
  );
}
