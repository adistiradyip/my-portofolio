"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-pf-text/90 text-pf-bg shadow-lg backdrop-blur-sm transition hover:bg-pf-text xl:bottom-6 xl:left-auto xl:right-6 xl:rounded-md xl:bg-[#ff5722] xl:text-white xl:hover:bg-[#e64a19]"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
