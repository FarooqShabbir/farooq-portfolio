"use client";

import { MotionConfig, motion, type HTMLMotionProps } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Respects the visitor's reduced-motion setting for every animation below it. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
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
