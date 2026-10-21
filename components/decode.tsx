"use client";

import { Fragment, useEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>_{}";

/**
 * Headline that resolves like a terminal decoding a message: each character cycles through
 * glyphs (in sunset, mono) before locking to its letter. Every glyph sits over its final
 * letter's width, so the line never reflows. Server-rendered as the plain final text.
 */
export function DecodeText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const slots = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-slot]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.classList.remove("decode-pending");
    if (reduce || !slots.length) return;

    const t0 = performance.now() + delay * 1000;
    const plan = slots.map((_, i) => ({ start: i * 22, end: 380 + i * 22 + Math.random() * 260 }));
    slots.forEach((s) => {
      s.textContent = "";
      s.previousElementSibling?.classList.add("opacity-0");
    });

    let raf = 0;
    let lastSwap = 0;
    const tick = (now: number) => {
      const t = now - t0;
      const swap = now - lastSwap > 45;
      if (swap) lastSwap = now;
      let done = true;
      slots.forEach((s, i) => {
        const p = plan[i];
        const letter = s.previousElementSibling as HTMLElement | null;
        if (t >= p.end) {
          if (s.textContent !== "") {
            s.textContent = "";
            letter?.classList.remove("opacity-0");
          }
          return;
        }
        done = false;
        if (t >= p.start && swap) s.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      });
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      slots.forEach((s) => {
        s.textContent = "";
        s.previousElementSibling?.classList.remove("opacity-0");
      });
    };
  }, [delay]);

  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={root} aria-hidden className="decode-pending">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, ci) => (
                <span key={ci} className="relative inline-block">
                  <span className="transition-opacity duration-150">{ch}</span>
                  <span
                    data-slot
                    className="absolute inset-0 flex items-center justify-center font-mono text-[0.7em] text-primary"
                  />
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
