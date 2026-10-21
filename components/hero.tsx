"use client";

import { motion } from "motion/react";
import { profile, stats } from "@/content/profile";
import { EASE } from "./motion";
import { PipelineConsole } from "./pipeline-console";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

export function Hero() {
  const words = profile.headline.split(" ");

  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <motion.a
          data-reveal
          href="#contact"
          {...fadeUp(0)}
          className="group inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-1 py-1 pl-2 pr-3 text-[13px] text-ink-muted transition-colors hover:border-hairline-strong"
        >
          <span className="size-1.5 rounded-full bg-success animate-pulse-dot" aria-hidden />
          {profile.availability}
          <span aria-hidden className="text-ink-tertiary transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </motion.a>

        <motion.p data-reveal {...fadeUp(0.05)} className="eyebrow mt-8">
          {profile.role} <span className="text-ink-tertiary">·</span> {profile.roleTag}
        </motion.p>

        <h1 className="display-xl mt-4 max-w-[16ch]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              data-reveal
              className="inline-block whitespace-pre"
              initial={{ opacity: 0, y: "0.35em", filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.06 }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </h1>

        <motion.p data-reveal {...fadeUp(0.45)} className="mt-6 max-w-[60ch] text-[17px] leading-relaxed text-ink-subtle sm:text-lg">
          {profile.intro}
        </motion.p>

        <motion.div data-reveal {...fadeUp(0.55)} className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#contact" className="btn btn-primary">
            Start a project
          </a>
          <a href="#work" className="btn btn-secondary">
            See selected work
          </a>
          <span className="ml-1 text-[13px] text-ink-tertiary">
            {profile.location} · working remotely
          </span>
        </motion.div>
      </div>

      <motion.div
        data-reveal
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
        className="relative mx-auto mt-16 max-w-[1200px] px-4 sm:mt-20 sm:px-6"
      >
        <div className="dot-grid pointer-events-none absolute -inset-x-10 -inset-y-16" aria-hidden />
        <div className="relative mx-auto max-w-[980px]">
          <PipelineConsole />
        </div>
      </motion.div>

      <div className="mx-auto mt-16 max-w-[1200px] px-4 sm:px-6">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              data-reveal
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="bg-canvas px-5 py-6"
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-mono text-3xl font-medium tracking-tight text-ink">{s.value}</dd>
              <dd className="mt-1 text-[13px] leading-snug text-ink-subtle">{s.label}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
