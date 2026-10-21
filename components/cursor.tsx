"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

/**
 * Desktop cursor: an exact dot plus a trailing ring. The ring swells over interactive elements
 * and turns into a label over anything marked `data-cursor="Label"`. Fine pointers only.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    const root = document.documentElement;
    root.classList.add("has-cursor");

    // Re-read what is under the pointer on move and on scroll (content slides under a still pointer).
    let px = -100;
    let py = -100;
    const sense = (t: Element | null) => {
      setHidden(!!t?.closest("input, textarea, select"));
      setLabel(t?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null);
      setHover(!!t?.closest("a, button, summary, label, [role=button]"));
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      x.set(px);
      y.set(py);
      sense(e.target as Element | null);
    };
    const onScroll = () => sense(document.elementFromPoint(px, py));
    const onLeave = () => setHidden(true);
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = label ? 84 : hover ? 56 : 34;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]" style={{ opacity: hidden ? 0 : 1, transition: "opacity 200ms" }}>
      <motion.div className="absolute left-0 top-0" style={{ x: rx, y: ry }}>
        <motion.div
          className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border"
          animate={{
            width: size,
            height: size,
            scale: down ? 0.82 : 1,
            backgroundColor: label ? "rgba(255,122,23,0.95)" : hover ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0)",
            borderColor: label ? "rgba(255,122,23,1)" : hover ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-canvas"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <div
          className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-opacity"
          style={{ opacity: label ? 0 : 1 }}
        />
      </motion.div>
    </div>
  );
}
