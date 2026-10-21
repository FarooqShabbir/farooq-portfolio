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
  type MotionValue,
} from "motion/react";
import { BootScreen } from "./boot";
import { Cursor } from "./cursor";
import { SmoothScroll } from "./smooth-scroll";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

/** Seconds the first-visit boot intro covers the page; hero choreography waits this long. */
export function bootDelay() {
  if (typeof document === "undefined") return 0;
  return document.documentElement.classList.contains("booting") ? 1.9 : 0;
}

/** Respects the visitor's reduced-motion setting for every animation below it. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <BootScreen />
      <Cursor />
      <ScrollProgress />
      {children}
    </MotionConfig>
  );
}

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ delay = 0, y = 24, children, ...rest }: RevealProps) {
  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Thin sunset bar across the top that tracks how far down the page you are. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-primary"
      style={{ scaleX }}
    />
  );
}

const wordRise = {
  hidden: { y: "115%", rotate: 6 },
  show: (i: number) => ({ y: "0%", rotate: 0, transition: { duration: 1, ease: EASE, delay: i * 0.045 } }),
};

/**
 * Section headings rise word by word out of a mask, with a slight rotation that settles.
 * The in-view trigger sits on the unclipped wrapper; each word inherits it through variants.
 */
export function MaskedWords({
  text,
  className = "",
  id,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  id?: string;
  as?: "h2" | "h3";
}) {
  const words = text.split(" ");
  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      >
        {words.map((w, i) => (
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-top">
              <motion.span data-reveal className="inline-block origin-bottom-left" variants={wordRise} custom={i}>
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** The accent rule beside a caption draws itself in. */
export function DrawRule({ className = "" }: { className?: string }) {
  return (
    <motion.span
      data-reveal
      aria-hidden
      className={`origin-left bg-primary ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: EASE }}
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
      transition={{ duration: 1.3, ease: EASE, delay }}
    />
  );
}

/** Counts up to `to` once visible. Renders the final number with no JavaScript. */
export function CountUp({ to, delay = 0, className }: { to: number; delay?: number; className?: string }) {
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
    const controls = animate(0, to, { duration: 1.6, delay, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [armed, inView, to, delay]);

  return (
    <span ref={ref} className={className}>
      {String(n).padStart(2, "0")}
    </span>
  );
}

/** Pulls its child toward the pointer; springs back on leave. */
export function Magnetic({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.4 });
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
export function Parallax({ children, range = 40 }: { children: React.ReactNode; range?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}

function InkWord({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [i / n, (i + 1) / n], [0.16, 1]);
  return (
    <motion.span data-reveal style={{ opacity }}>
      {word}{" "}
    </motion.span>
  );
}

/** A statement whose words fill to full ink one by one as it rises through the screen. */
export function InkFill({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <InkWord key={i} word={w} i={i} n={words.length} progress={scrollYProgress} />
      ))}
    </p>
  );
}
