"use client";

import { motion } from "motion/react";
import { profile } from "@/content/profile";
import { EASE, Magnetic } from "./motion";
import { BrandMark } from "./nav";

/** Curtain footer: it sits under the page and is uncovered as the last section scrolls away. */
export function Footer() {
  const letters = Array.from(profile.name);
  return (
    <footer className="sticky bottom-0 z-0 overflow-hidden bg-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={{ background: "radial-gradient(90% 100% at 50% 100%, rgb(255 122 23 / 0.16), rgb(124 58 237 / 0.08) 45%, transparent 75%)" }}
      />
      <div className="relative mx-auto max-w-[1200px] px-4 pt-20 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark size={28} />
            <div>
              <p className="text-[14px]">{profile.name}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-tertiary">
                {profile.role} · {profile.roleTag}
              </p>
            </div>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-3 gap-x-8 gap-y-2 text-[14px] text-ink-subtle">
            {["work", "pipeline", "experience", "services", "stack", "about", "contact"].map((id) => (
              <a key={id} href={`#${id}`} className="capitalize transition-colors hover:text-ink">
                {id}
              </a>
            ))}
          </nav>
          <Magnetic>
            <a href="#top" className="btn btn-secondary" data-cursor="Top">
              Back to top ↑
            </a>
          </Magnetic>
        </div>
      </div>

      <motion.p
        aria-hidden
        className="relative mt-16 select-none whitespace-nowrap px-2 text-center text-[13.6vw] leading-[0.8] tracking-[-0.065em] text-ink"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {letters.map((ch, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
            <motion.span
              data-reveal
              className="inline-block"
              variants={{
                hidden: { y: "100%" },
                show: { y: "0%", transition: { duration: 1.1, ease: EASE, delay: i * 0.035 } },
              }}
            >
              {ch === " " ? "\u00a0" : ch}
            </motion.span>
          </span>
        ))}
      </motion.p>
      <div className="relative mx-auto flex max-w-[1200px] justify-between px-4 pb-6 pt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-tertiary sm:px-6">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Lahore · UTC+5</span>
      </div>
    </footer>
  );
}
