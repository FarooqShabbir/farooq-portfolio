"use client";

import { useEffect, useRef, useState } from "react";
import {
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Respects the visitor's reduced-motion setting for every animation below it. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      {children}
    </MotionConfig>
  );
}

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ delay = 0, y = 16, children, ...rest }: RevealProps) {
  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Thin accent bar across the top that tracks how far down the page you are. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-primary-hover"
      style={{ scaleX }}
    />
  );
}

/** Section headings rise word by word out of a mask. Stays readable if scripts fail. */
export function MaskedWords({ text, className = "", id }: { text: string; className?: string; id?: string }) {
  const words = text.split(" ");
  return (
    <h2 id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top">
            <motion.span
              data-reveal
              className="inline-block"
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.85, ease: EASE, delay: i * 0.05 }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </h2>
  );
}

/** The accent rule beside an eyebrow draws itself in. */
export function DrawRule({ className = "" }: { className?: string }) {
  return (
    <motion.span
      data-reveal
      aria-hidden
      className={`origin-left bg-primary ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE }}
    />
  );
}

/** A hairline that draws itself left to right when it enters view. */
export function DrawLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      data-reveal
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-hairline-strong"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    />
  );
}

/** Counts up to `to` once visible. Renders the final number with no JavaScript. */
export function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(to);
  const [armed, setArmed] = useState(false);

  useEffect(() => setArmed(!reduce), [reduce]);
  useEffect(() => {
    if (!armed) return;
    if (!inView) {
      setN(0);
      return;
    }
    const controls = animate(0, to, { duration: 1.4, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [armed, inView, to]);

  return (
    <span ref={ref} className={className}>
      {n}
    </span>
  );
}

/** Pulls its child a few pixels toward the pointer; springs back on leave. */
export function Magnetic({ children, strength = 0.22 }: { children: React.ReactNode; strength?: number }) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  return (
    <motion.span
      className="inline-flex"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Card whose border and surface light up under the pointer (see .spotlight in globals.css). */
export function Spotlight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`spotlight ${className}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}

/** Drifts its child against the scroll for a sense of depth. */
export function Parallax({ children, range = 28 }: { children: React.ReactNode; range?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}

/** Hero console starts tilted back and settles flat as it scrolls into the page. */
export function TiltIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 35%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  return (
    <div ref={ref} style={{ perspective: 1400 }}>
      <motion.div style={{ rotateX, scale, transformOrigin: "50% 100%" }}>{children}</motion.div>
    </div>
  );
}

/** Soft accent glow that eases toward the pointer across the hero; idle orbs drift otherwise. */
export function HeroGlow() {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0.5), { stiffness: 50, damping: 20 });
  const y = useSpring(useMotionValue(0.3), { stiffness: 50, damping: 20 });
  const left = useTransform(x, (v) => `${v * 100}%`);
  const top = useTransform(y, (v) => `${v * 100}%`);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX / window.innerWidth);
      y.set(Math.min(e.clientY / 900, 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <motion.div
        className="absolute size-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.14] blur-[120px]"
        style={{ left, top }}
      />
      <div className="absolute -right-24 top-24 size-[360px] animate-drift rounded-full bg-primary/[0.08] blur-[100px]" />
    </div>
  );
}
