"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminShell } from "@/components/admin/admin-shell";
import { useAdminLanguage } from "@/components/admin/admin-language-provider";
import { useAdminTheme } from "@/components/admin/admin-theme-provider";

export function AdminTopbar() {
  const { toggleCollapsed, toggleMobile } = useAdminShell();
  const { locale, toggleLocale, t } = useAdminLanguage();
  const { theme, toggleTheme } = useAdminTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-card px-3 sm:gap-3 sm:px-4 md:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground hover:text-primary md:hidden"
        onClick={toggleMobile}
        aria-label={t.topbar.toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="hidden text-muted-foreground hover:text-primary md:inline-flex"
        onClick={toggleCollapsed}
        aria-label={t.topbar.toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <p className="min-w-0 truncate text-sm font-semibold text-muted-foreground md:hidden">
        {t.topbar.title}
      </p>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:border-primary hover:text-primary"
          aria-label={theme === "light" ? t.topbar.darkMode : t.topbar.lightMode}
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={toggleLocale}
          className="rounded-md border border-border px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-muted-foreground transition hover:border-primary hover:text-primary"
          aria-label={locale === "en" ? t.topbar.switchToId : t.topbar.switchToEn}
        >
          {locale === "en" ? "ID" : "EN"}
        </button>
      </div>
    </header>
  );
}
