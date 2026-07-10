"use client";

import { AdminLanguageProvider } from "@/components/admin/admin-language-provider";
import { AdminThemeProvider } from "@/components/admin/admin-theme-provider";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminLanguageProvider>{children}</AdminLanguageProvider>
    </AdminThemeProvider>
  );
}
