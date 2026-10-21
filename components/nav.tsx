"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "./motion";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "services", label: "Services" },
  { id: "stack", label: "Stack" },
  { id: "about", label: "About" },
];

export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="grid place-items-center rounded-md bg-primary font-mono text-[11px] font-semibold tracking-tight text-white"
      style={{ width: size, height: size }}
    >
      FS
    </span>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of LINKS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-hairline bg-canvas/80 backdrop-blur-xl" : "border-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 text-sm font-medium" onClick={() => setOpen(false)}>
          <BrandMark />
          <span>Farooq Shabbir</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors hover:text-ink ${
                  active === id ? "text-ink" : "text-ink-subtle"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#contact" className="btn btn-primary hidden sm:inline-flex">
            Hire me
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-md border border-hairline md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-4 bg-ink transition-transform duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-ink transition-transform duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-t border-hairline md:hidden"
          >
            <ul className="px-4 py-3">
              {[...LINKS, { id: "contact", label: "Contact" }].map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center border-b border-hairline text-base text-ink-muted last:border-none"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
