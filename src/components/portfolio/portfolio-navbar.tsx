"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import { BrandLogo } from "@/components/portfolio/brand-logo";
import { useLanguage } from "@/components/portfolio/language-provider";
import { useTheme } from "@/components/portfolio/theme-provider";

const NAV_SCROLL_OFFSET = 88;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

function toPageHref(hash: string) {
  return `/${hash}`;
}

export function PortfolioNavbar({ brandName }: { brandName: string }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isBlogPost = pathname.startsWith("/blog/");

  const { locale, t, toggleLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  const navItems = useMemo(
    () => [
      { label: t.nav.home, href: "#home" },
      { label: t.nav.about, href: "#about" },
      { label: t.nav.services, href: "#services" },
      { label: t.nav.projects, href: "#projects" },
      { label: t.nav.testimonials, href: "#testimonials" },
      { label: t.nav.blog, href: "#blog" },
      { label: t.nav.contact, href: "#contact" },
    ],
    [t],
  );

  useEffect(() => {
    if (!isLanding) {
      setActiveSection(isBlogPost ? "#blog" : "#home");
      return;
    }

    const hash = window.location.hash;
    if (hash && navItems.some((item) => item.href === hash)) {
      setActiveSection(hash);
      const id = hash.slice(1);
      requestAnimationFrame(() => scrollToSection(id));
    }
  }, [isLanding, isBlogPost, navItems]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isLanding) return;

    const sectionIds = navItems.map((item) => item.href.slice(1));
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveSection(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isLanding, navItems]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleNavClick(hash: string, e: React.MouseEvent<HTMLAnchorElement>) {
    setActiveSection(hash);
    setOpen(false);

    if (!isLanding) return;

    const id = hash.slice(1);
    if (document.getElementById(id)) {
      e.preventDefault();
      window.history.replaceState(null, "", hash);
      scrollToSection(id);
    }
  }

  const navLinkClass = (isActive: boolean) =>
    `relative text-sm font-semibold transition ${
      isActive
        ? "text-[#ff5722] after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[#ff5722]"
        : "text-pf-subtle hover:text-[#ff5722]"
    }`;

  const mobileNavClass = (isActive: boolean) =>
    `rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
      isActive
        ? "bg-pf-accent-soft text-[#ff5722]"
        : "text-pf-subtle hover:bg-pf-accent-soft hover:text-[#ff5722]"
    }`;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-pf-border bg-pf-bg/95 shadow-md backdrop-blur-sm"
          : "bg-pf-bg/90 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 lg:px-8">
        <Link href="/" className="min-w-0 shrink text-xl font-extrabold text-pf-text sm:text-2xl">
          <BrandLogo name={brandName} restClassName="text-pf-text" />
        </Link>

        <nav className="hidden items-center gap-8 xl:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            const pageHref = toPageHref(item.href);

            return isLanding ? (
              <a
                key={item.href}
                href={pageHref}
                onClick={(e) => handleNavClick(item.href, e)}
                className={navLinkClass(isActive)}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={pageHref}
                onClick={() => setActiveSection(item.href)}
                className={navLinkClass(isActive)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-pf-border text-pf-subtle transition hover:border-[#ff5722] hover:text-[#ff5722]"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={toggleLocale}
            className="rounded-md border border-pf-border px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-pf-subtle transition hover:border-[#ff5722] hover:text-[#ff5722]"
            aria-label={locale === "en" ? "Switch to Indonesian" : "Switch to English"}
          >
            {locale === "en" ? "ID" : "EN"}
          </button>
          {isLanding ? (
            <a
              href="/#contact"
              onClick={(e) => handleNavClick("#contact", e)}
              className="hidden items-center gap-2 rounded-md bg-[#ff5722] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64a19] sm:inline-flex"
            >
              {t.nav.contactCta}
              <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <Link
              href="/#contact"
              className="hidden items-center gap-2 rounded-md bg-[#ff5722] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64a19] sm:inline-flex"
            >
              {t.nav.contactCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </header>

    {/* Floating menu — di luar header agar fixed bottom relatif ke viewport */}
    <div className="xl:hidden">
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed right-4 z-[70] max-h-[min(70dvh,520px)] w-[min(288px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-pf-border bg-pf-bg p-3 shadow-2xl shadow-black/20"
            style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
          >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href;
                  const pageHref = toPageHref(item.href);

                  return isLanding ? (
                    <a
                      key={item.href}
                      href={pageHref}
                      className={mobileNavClass(isActive)}
                      onClick={(e) => handleNavClick(item.href, e)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={pageHref}
                      className={mobileNavClass(isActive)}
                      onClick={() => {
                        setActiveSection(item.href);
                        setOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-2 flex gap-2 border-t border-pf-border pt-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-pf-border px-3 py-2.5 text-sm font-semibold text-pf-subtle transition hover:border-[#ff5722] hover:text-[#ff5722]"
                >
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {theme === "light" ? "Dark" : "Light"}
                </button>
                <button
                  type="button"
                  onClick={toggleLocale}
                  className="flex-1 rounded-lg border border-pf-border px-3 py-2.5 text-sm font-semibold text-pf-subtle transition hover:border-[#ff5722] hover:text-[#ff5722]"
                >
                  {locale === "en" ? "ID" : "EN"}
                </button>
              </div>

              {isLanding ? (
                <a
                  href="/#contact"
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff5722] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e64a19]"
                  onClick={(e) => handleNavClick("#contact", e)}
                >
                  {t.nav.contactCta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href="/#contact"
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff5722] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e64a19]"
                  onClick={() => setOpen(false)}
                >
                  {t.nav.contactCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </motion.nav>
          )}
        </AnimatePresence>

      <motion.button
        type="button"
        className="fixed right-4 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#ff5722] text-white shadow-lg shadow-[#ff5722]/30 transition hover:bg-[#e64a19]"
        style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Menu className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
    </>
  );
}
