"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminLanguage } from "@/components/admin/admin-language-provider";
import { useAdminTheme } from "@/components/admin/admin-theme-provider";
import { toast } from "sonner";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { t, locale, toggleLocale } = useAdminLanguage();
  const { theme, toggleTheme } = useAdminTheme();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await signIn(formData);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success(t.toast.loginSuccess);
        router.push("/admin");
        router.refresh();
      }
    });
  }

  return (
    <div
      className={cn(
        "admin-theme flex min-h-screen items-center justify-center px-4",
        theme === "dark" && "dark",
      )}
    >
      <div className="absolute right-4 top-4 flex items-center gap-2">
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
        >
          {locale === "en" ? "ID" : "EN"}
        </button>
      </div>

      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold text-foreground">
            <span className="text-red-600">A</span>distira CMS
          </CardTitle>
          <CardDescription className="text-muted-foreground">{t.login.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.login.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.login.password}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90">
              {isPending ? t.login.loading : t.login.submit}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-muted-foreground hover:text-primary"
            >
              {t.login.back}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
