"use client";

import { LanguageProvider } from "@/components/portfolio/language-provider";
import { ThemeProvider } from "@/components/portfolio/theme-provider";

export function PortfolioProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
