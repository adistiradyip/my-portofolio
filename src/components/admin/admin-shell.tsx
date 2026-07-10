"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { useAdminTheme } from "@/components/admin/admin-theme-provider";
import { cn } from "@/lib/utils";

type AdminShellContextValue = {
  collapsed: boolean;
  mobileOpen: boolean;
  toggleCollapsed: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
};

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

const STORAGE_KEY = "admin-sidebar-collapsed";

export function useAdminShell() {
  const context = useContext(AdminShellContext);
  if (!context) {
    throw new Error("useAdminShell must be used within AdminShell");
  }
  return context;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { theme } = useAdminTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <AdminShellContext.Provider
      value={{
        collapsed,
        mobileOpen,
        toggleCollapsed,
        toggleMobile: () => setMobileOpen((prev) => !prev),
        closeMobile: () => setMobileOpen(false),
      }}
    >
      <div className={cn("admin-theme flex min-h-screen overflow-x-hidden", theme === "dark" && "dark")}>
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar />
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-10">{children}</main>
        </div>
      </div>
    </AdminShellContext.Provider>
  );
}
