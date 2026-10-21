"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { deployScene } from "@/content/profile";
import { DrawRule, EASE, MaskedWords } from "./motion";

const STAGES = deployScene.stages;
const N = STAGES.length;

function clock(p: number) {
  const s = Math.round(p * 184);
  return `T+${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * Pinned scroll scene: one commit travels the pipeline as you scroll. The beam fills, each stage
 * ignites as the packet reaches it, the log streams, and on release a sunset horizon rises.
 */
export function DeployScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Travel happens across the middle of the hold; the ends give the reader time to arrive and leave.
  const travel = useTransform(scrollYProgress, [0.1, 0.85], [0, 1], { clamp: true });
  const smooth = useSpring(travel, { stiffness: 120, damping: 26, restDelta: 0.0005 });
  const beam = useTransform(smooth, (v) => `${v * 100}%`);
  const horizon = useTransform(scrollYProgress, [0.78, 0.97], [0, 1]);
  const horizonY = useTransform(scrollYProgress, [0.78, 0.97], [120, 0]);

  const [step, setStep] = useState(-1);
  const [t, setT] = useState("T+00:00");
  useMotionValueEvent(smooth, "change", (v) => {
    setT(clock(v));
    const next = v <= 0.001 ? -1 : Math.min(N - 1, Math.floor(v * (N - 1) + 0.02));
    setStep((s) => (s === next ? s : next));
  });
  const live = step === N - 1;

  return (
    <section ref={ref} id="pipeline" aria-labelledby="pipeline-title" className="relative h-[420vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* Release horizon: sunset rising into dusk once the deploy verifies. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[75%] [mask-image:linear-gradient(to_top,transparent,#000_35%)]"
          style={{
            opacity: horizon,
            y: horizonY,
            background:
              "radial-gradient(110% 80% at 50% 85%, rgb(255 122 23 / 0.42) 0%, rgb(124 58 237 / 0.22) 38%, rgb(13 23 38 / 0) 70%)",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-[1200px] flex-1 grid-rows-[auto_1fr_auto] gap-6 px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <DrawRule className="h-px w-6" />
                Pipeline · scroll to deploy
              </p>
              <MaskedWords id="pipeline-title" className="display-lg mt-5 max-w-[16ch]" text={deployScene.title} />
            </div>
            <p className="max-w-[44ch] text-[17px] leading-relaxed text-ink-muted lg:justify-self-end">{deployScene.lead}</p>
          </div>

          {/* Live readout */}
          <div className="grid content-center gap-6 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-tertiary">elapsed</p>
              <p className="mt-2 font-mono text-[clamp(3rem,9vw,7.5rem)] leading-none tracking-[-0.06em] tabular-nums text-ink">
                {t}
              </p>
              <div className="mt-4 flex h-8 items-center gap-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={live ? "live" : step}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[12px] uppercase tracking-[0.1em] ${
                      live ? "border-success/60 text-success" : "border-white/20 text-ink-muted"
                    }`}
                  >
                    <span className={`size-1.5 rounded-full ${live ? "bg-success animate-pulse-dot" : "bg-primary"}`} />
                    {live ? "live in production" : step < 0 ? "waiting for push" : `${STAGES[step].name} · running`}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="panel min-h-[120px] overflow-hidden bg-canvas/70 p-4 font-mono text-[12px] leading-7 backdrop-blur-sm max-md:[&>p:nth-last-child(n+4)]:hidden md:min-h-[196px] md:text-[12.5px]" aria-hidden>
              <p className="text-ink-tertiary">$ git push origin main</p>
              <AnimatePresence initial={false}>
                {STAGES.slice(0, step + 1).map((s, i) => (
                  <motion.p
                    key={s.name}
                    initial={{ opacity: 0, x: -10, clipPath: "inset(0 100% 0 0)" }}
                    animate={{ opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className={`truncate ${i === step && !live ? "text-ink" : "text-ink-subtle"}`}
                  >
                    <span className="text-primary">▸</span> {s.log}
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Track */}
          <div className="relative pt-2">
            <div className="relative mx-[14px] h-px bg-white/12">
              <motion.div className="absolute inset-0 origin-left bg-primary" style={{ scaleX: smooth }} />
              <motion.div className="absolute top-1/2 -translate-y-1/2" style={{ left: beam }}>
                <span className="block size-3 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_0_6px_rgb(255_122_23_/_0.18),0_0_32px_8px_rgb(255_122_23_/_0.55)]" />
              </motion.div>
            </div>
            <ol className="relative mt-[-7px] flex justify-between" aria-label="Pipeline stages">
              {STAGES.map((s, i) => {
                const reached = i <= step;
                const current = i === step;
                return (
                  <li key={s.name} className="flex w-7 flex-col items-center">
                    <motion.span
                      className="grid size-[14px] place-items-center rounded-full border"
                      animate={{
                        scale: current ? 1.35 : 1,
                        borderColor: reached ? "rgba(255,122,23,1)" : "rgba(255,255,255,0.25)",
                        backgroundColor: reached ? "rgba(255,122,23,1)" : "rgba(10,10,10,1)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    />
                    <span
                      className={`mt-4 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-300 sm:text-[11px] ${
                        reached ? "text-ink" : "text-ink-tertiary"
                      } ${current ? "" : "max-sm:opacity-0"}`}
                    >
                      {s.name}
                    </span>
                    <span
                      className={`mt-1 hidden whitespace-nowrap text-[11px] text-ink-tertiary transition-opacity duration-300 xl:block ${
                        current ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {s.detail}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
