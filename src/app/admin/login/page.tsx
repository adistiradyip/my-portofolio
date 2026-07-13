"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminLanguage } from "@/components/admin/admin-language-provider";
import { useAdminTheme } from "@/components/admin/admin-theme-provider";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { t, locale, toggleLocale } = useAdminLanguage();
  const { theme, toggleTheme } = useAdminTheme();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        "admin-theme relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#e8f4fc] via-[#f3effa] to-[#ebe4f7] px-4 py-10",
        theme === "dark" && "dark bg-gradient-to-br dark:from-background dark:via-background dark:to-muted/30",
      )}
    >
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 sm:right-6 sm:top-6">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card/80 text-muted-foreground backdrop-blur-sm transition hover:border-primary hover:text-primary"
          aria-label={theme === "light" ? t.topbar.darkMode : t.topbar.lightMode}
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={toggleLocale}
          className="rounded-md border border-border bg-card/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground backdrop-blur-sm transition hover:border-primary hover:text-primary"
        >
          {locale === "en" ? "ID" : "EN"}
        </button>
      </div>

      <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="grid min-h-[min(88vh,720px)] lg:grid-cols-2">
          {/* Kiri — ilustrasi */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#6ad0fb] via-[#6783d6] to-[#6336b2] lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
            <p className="absolute left-8 top-8 text-xl font-extrabold tracking-wide text-white">
              <span className="text-white/90">A</span>distira
            </p>
            <Image
              src="/login.svg"
              alt="Login illustration"
              width={520}
              height={520}
              priority
              unoptimized
              className="relative z-10 h-auto w-full max-w-[min(100%,460px)] object-contain drop-shadow-lg"
            />
          </div>

          {/* Kanan — form */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 text-center lg:text-left">
                <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                  <span className="text-red-600">A</span>distira CMS
                </h1>
                <p className="mt-2 text-base text-muted-foreground sm:text-lg">{t.login.subtitle}</p>
              </div>

              <form action={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    {t.login.email}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="admin@example.com"
                    className="h-11 px-3.5 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold">
                    {t.login.password}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="h-11 px-3.5 pr-11 text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-11 w-full text-base font-bold bg-primary hover:bg-primary/90"
                >
                  {isPending ? t.login.loading : t.login.submit}
                </Button>
              </form>

              <div className="mt-6 text-center lg:text-left">
                <Link
                  href="/"
                  className="text-sm font-semibold text-muted-foreground transition hover:text-primary"
                >
                  {t.login.back}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
