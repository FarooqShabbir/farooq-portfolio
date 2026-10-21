"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
  type MotionValue,
} from "motion/react";
import { caseStudies } from "@/content/profile";
import { EASE } from "./motion";
import { InfraVisual, PipelineVisual, ReleaseVisual, VoiceVisual } from "./visuals";

const VISUALS: Record<string, React.ComponentType> = {
  release: ReleaseVisual,
  voice: VoiceVisual,
  infra: InfraVisual,
  pipeline: PipelineVisual,
};

/* ───────────── Work: case studies that stack as sticky cards ───────────── */

function StackCard({ idx, total, progress }: { idx: number; total: number; progress: MotionValue<number> }) {
  const cs = caseStudies[idx];
  const Visual = VISUALS[cs.id];
  // Once the next card starts covering this one, it recedes: scales back and dims.
  // Card i settles at roughly progress i/(total-1); it recedes while the next one slides over it.
  const span = 1 / Math.max(1, total - 1);
  const start = idx * span;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - idx - 1) * 0.045]);
  const dim = useTransform(progress, [start, Math.min(1, start + span)], [0, idx === total - 1 ? 0 : 0.6]);

  return (
    <div className="lg:sticky lg:h-[calc(100svh-96px)] lg:pt-2" style={{ top: `${88 + idx * 18}px` }}>
      <motion.article
        style={{ scale, transformOrigin: "50% 0%" }}
        className="panel relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 overflow-hidden bg-surface-1 p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-12"
      >
        <motion.div
          data-reveal
          className="min-w-0"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-primary">
            0{idx + 1} <span className="text-ink-tertiary">/ 0{total}</span> · {cs.kicker}
          </p>
          <h3 className="display-md mt-4">{cs.title}</h3>
          <p className="mt-5 text-[16px] leading-relaxed text-ink-muted">{cs.body}</p>
          <ul className="mt-6 space-y-2.5">
            {cs.bullets.map((b, i) => (
              <motion.li
                key={b}
                data-reveal
                className="flex gap-3 text-[15px] text-ink-muted"
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.25 + i * 0.07 }}
              >
                <span className="mt-[9px] size-1 shrink-0 rounded-full bg-primary" aria-hidden />
                {b}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          data-reveal
          className="min-w-0"
          initial={{ opacity: 0, clipPath: "inset(12% 12% 12% 12% round 12px)", scale: 1.06 }}
          whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 10px)", scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
        >
          <Visual />
        </motion.div>
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-canvas" style={{ opacity: dim }} />
      </motion.article>
    </div>
  );
}

export function WorkStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className="mt-16 space-y-8 sm:mt-20 lg:space-y-0">
      {caseStudies.map((cs, idx) => (
        <StackCard key={cs.id} idx={idx} total={caseStudies.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}

/* ───────────── Stack: marquees that react to scroll velocity ───────────── */

export function VelocityMarquee({ items, base = 2.2, className = "" }: { items: string[]; base?: number; className?: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-2500, 0, 2500], [-6, 0, 6], { clamp: false });
  const skewX = useTransform(velocity, [-2500, 2500], [10, -10], { clamp: true });
  const dir = useRef(1);
  const pct = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    // Scrolling down pushes the row forward, scrolling up reverses it; speed grows with velocity.
    const f = factor.get();
    if (f < -0.01) dir.current = -1;
    else if (f > 0.01) dir.current = 1;
    const move = base * dir.current * (delta / 1000) * (1 + Math.abs(f));
    x.set(x.get() - move);
  });

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <motion.div className="flex w-max" style={{ x: pct, skewX }}>
        {[0, 1].map((k) => (
          <span key={k} className="flex shrink-0">
            {items.map((t) => (
              <span key={`${k}-${t}`} className="flex items-center">
                <span className="px-5 sm:px-8">{t}</span>
                <span className="size-2 rounded-full bg-primary/80 sm:size-2.5" />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ───────────── Experience: a beam that fills as you read down the timeline ───────────── */

export function TimelineBeam({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const headY = useTransform(scaleY, (v) => `${v * 100}%`);
  return (
    <div ref={ref} className="relative pl-8 sm:pl-14">
      <div aria-hidden className="absolute bottom-0 left-[5px] top-0 w-px bg-hairline sm:left-[11px]">
        <motion.div className="absolute inset-0 origin-top bg-primary" style={{ scaleY }} />
        <motion.div className="absolute left-1/2 top-0" style={{ top: headY }}>
          <span className="block size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_24px_6px_rgb(255_122_23_/_0.5)]" />
        </motion.div>
      </div>
      {children}
    </div>
  );
}

/** A timeline node that ignites when the reader reaches it. */
export function TimelineNode() {
  return (
    <motion.span
      aria-hidden
      className="absolute -left-8 top-[46px] size-[11px] rounded-full border sm:-left-14 sm:translate-x-[6px]"
      initial={{ backgroundColor: "rgba(10,10,10,1)", borderColor: "rgba(255,255,255,0.25)", scale: 1 }}
      whileInView={{ backgroundColor: "rgba(255,122,23,1)", borderColor: "rgba(255,122,23,1)", scale: [1, 1.6, 1] }}
      viewport={{ once: true, margin: "0px 0px -40% 0px" }}
      transition={{ duration: 0.6, ease: EASE }}
    />
  );
}
