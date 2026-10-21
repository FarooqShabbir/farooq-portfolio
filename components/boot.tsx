"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimate } from "motion/react";

const LINES = [
  ["resolving infrastructure", "ok"],
  ["verifying signatures", "ok"],
  ["warming edge cache", "ok"],
  ["health checks", "200"],
] as const;

/**
 * First-visit intro: a short deploy log and counter, then the screen wipes upward to reveal the site.
 * Only shown when the inline head script set `html.booting` (JS on, no reduced motion, once per session).
 */
export function BootScreen() {
  const [scope, animateScope] = useAnimate();
  const counter = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("booting")) return;
    setActive(true);
    let cancelled = false;

    const timers = LINES.map((_, i) => setTimeout(() => setLines(i + 1), 180 + i * 260));
    const run = async () => {
      await animateScope(
        "[data-boot-bar]",
        { scaleX: [0, 1] },
        {
          duration: 1.3,
          ease: [0.65, 0, 0.35, 1],
          onUpdate: (v) => {
            if (counter.current) counter.current.textContent = String(Math.round(Number(v) * 100)).padStart(3, "0");
          },
        },
      );
      if (cancelled) return;
      await animateScope(scope.current, { clipPath: ["inset(0 0 0% 0)", "inset(0 0 100% 0)"] }, { duration: 0.75, ease: [0.76, 0, 0.24, 1] });
      root.classList.remove("booting");
      try {
        sessionStorage.setItem("fs-booted", "1");
      } catch {}
      window.dispatchEvent(new Event("fs:booted"));
      setActive(false);
    };
    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [animateScope, scope]);

  return (
    <div
      ref={scope}
      aria-hidden
      className="boot-screen fixed inset-0 z-[100] flex-col justify-between bg-canvas p-6 sm:p-10"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <p className="eyebrow">farooq@prod:~$ deploy --portfolio</p>
      <div className="font-mono text-[13px] leading-7 text-ink-subtle">
        {LINES.slice(0, active ? lines : 0).map(([label, ok]) => (
          <motion.p key={label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <span className="text-ink-tertiary">›</span> {label.padEnd(28, ".")} <span className="text-primary">{ok}</span>
          </motion.p>
        ))}
      </div>
      <div>
        <div className="flex items-end justify-between">
          <span className="eyebrow">Farooq Shabbir · DevOps</span>
          <span ref={counter} className="display-xl font-mono tabular-nums leading-none tracking-[-0.06em] text-ink">
            000
          </span>
        </div>
        <div className="mt-4 h-px w-full bg-hairline">
          <span data-boot-bar className="block h-full origin-left bg-primary" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
