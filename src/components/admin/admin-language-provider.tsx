"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type AdminLocale,
  type AdminTranslation,
  adminTranslations,
} from "@/lib/i18n/admin-translations";

type AdminLanguageContextValue = {
  locale: AdminLocale;
  t: AdminTranslation;
  toggleLocale: () => void;
};

const AdminLanguageContext = createContext<AdminLanguageContextValue | null>(null);
const STORAGE_KEY = "admin-locale";

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<AdminLocale>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "id") {
      setLocale(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale((current) => (current === "en" ? "id" : "en"));
  }, []);

  const value = useMemo(
    () => ({
      locale,
      t: adminTranslations[locale],
      toggleLocale,
    }),
    [locale, toggleLocale],
  );

  return (
    <AdminLanguageContext.Provider value={value}>{children}</AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error("useAdminLanguage must be used within AdminLanguageProvider");
  }
  return context;
}
