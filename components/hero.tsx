"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { profile, stats } from "@/content/profile";
import { Constellation } from "./constellation";
import { DecodeText } from "./decode";
import { CountUp, EASE, Magnetic, bootDelay } from "./motion";

export function Hero() {
  // Hero choreography waits for the boot intro when it is playing (set before first paint).
  const [base] = useState(bootDelay);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const fieldScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: EASE, delay: base + delay },
  });

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <motion.div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_62%_75%_at_80%_45%,#000_30%,transparent_100%)] max-md:[mask-image:radial-gradient(ellipse_100%_60%_at_70%_30%,#000_20%,transparent_100%)]"
        style={{ scale: fieldScale, opacity: fieldOpacity }}
      >
        <motion.div className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: base }}>
          <Constellation className="max-md:opacity-55" />
        </motion.div>
      </motion.div>

      <motion.div
        className="relative mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 pb-8 pt-24 sm:px-6 sm:pt-28"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.a
          data-reveal
          href="#contact"
          {...rise(0)}
          data-cursor="Hire"
          className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/20 py-1.5 pl-2.5 pr-3.5 text-[13px] text-ink-muted transition-colors hover:border-white/50"
        >
          <span className="size-1.5 rounded-full bg-success animate-pulse-dot" aria-hidden />
          {profile.availability}
          <span aria-hidden className="text-ink-tertiary transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </motion.a>

        <motion.p data-reveal {...rise(0.1)} className="eyebrow mt-8">
          {profile.role} <span className="text-primary">/</span> {profile.roleTag}
        </motion.p>

        <h1 className="display-xl mt-5 max-w-[14ch] pointer-events-none">
          <DecodeText text={profile.headline} delay={base + 0.15} />
        </h1>

        <motion.p data-reveal {...rise(0.9)} className="mt-7 max-w-[56ch] text-[17px] leading-relaxed text-ink-muted sm:text-lg">
          {profile.intro}
        </motion.p>

        <motion.div data-reveal {...rise(1.05)} className="mt-9 flex flex-wrap items-center gap-3">
          <Magnetic>
            <a href="#contact" className="btn btn-primary">
              Start a project
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#work" className="btn btn-secondary">
              See selected work
            </a>
          </Magnetic>
          <span className="ml-1 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-tertiary">
            {profile.location} · remote
          </span>
        </motion.div>

        <dl className="mt-auto grid grid-cols-2 gap-x-6 gap-y-8 pt-12 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              data-reveal
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: base + 1.2 + i * 0.08 }}
              className="border-t border-white/15 pt-4"
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-[40px] leading-none tracking-[-0.04em] tabular-nums text-ink">
                <CountUp to={Number(s.value)} delay={base + 1.2 + i * 0.08} />
              </dd>
              <dd className="mt-3 max-w-[24ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.1em] text-ink-subtle">
                {s.label}
              </dd>
            </motion.div>
          ))}
        </dl>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-4 top-24 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-tertiary sm:right-6 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: base + 2, duration: 1 }}
      >
        Click the map to send traffic
        <span className="relative block h-8 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-3 bg-primary"
            animate={{ y: [-12, 32] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
