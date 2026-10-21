"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Stage = { name: string; detail: string; ms: number };

const STAGES: Stage[] = [
  { name: "checkout", detail: "path filter: api/**", ms: 900 },
  { name: "install", detail: "uv sync · npm ci", ms: 1300 },
  { name: "build", detail: "docker buildx · multi-stage", ms: 1700 },
  { name: "test", detail: "pytest · e2e on packaged build", ms: 1600 },
  { name: "sign", detail: "ed25519 manifest · sha-256", ms: 1100 },
  { name: "deploy", detail: "staging → production", ms: 1500 },
  { name: "verify", detail: "health checks · /healthz 200", ms: 1200 },
];

const LOG: string[] = [
  "▸ trigger  push to main · api/routes/agent.py",
  "▸ secrets  loaded from AWS Secrets Manager",
  "▸ image    ghcr.io/app/api:sha-4f1c2e9 pushed",
  "▸ tests    unit + e2e passed",
  "▸ signed   manifest.json  ed25519 ✓",
  "▸ alb      target group healthy",
  "▸ release  live · rollback armed",
];

function StatusIcon({ state }: { state: "done" | "running" | "queued" }) {
  if (state === "done")
    return (
      <svg viewBox="0 0 16 16" className="size-4 text-success" aria-hidden>
        <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.18" />
        <path d="M5 8.2l2 2 4-4.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (state === "running")
    return (
      <svg viewBox="0 0 16 16" className="size-4 animate-spin text-primary-hover" aria-hidden>
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.6" />
        <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 16 16" className="size-4 text-ink-tertiary" aria-hidden>
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2.4" />
    </svg>
  );
}

/** A looping, illustrative CI/CD run: the hero's "product screenshot". */
export function PipelineConsole() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? STAGES.length : 0);

  useEffect(() => {
    if (reduce) {
      setStep(STAGES.length);
      return;
    }
    const delay = step < STAGES.length ? STAGES[step].ms : 4200;
    const t = setTimeout(() => setStep((s) => (s < STAGES.length ? s + 1 : 0)), delay);
    return () => clearTimeout(t);
  }, [step, reduce]);

  const done = step >= STAGES.length;
  const progress = Math.min(step / STAGES.length, 1);

  return (
    <div className="panel overflow-hidden rounded-xl shadow-[0_40px_120px_-40px_rgb(94_106_210_/_0.35)]">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-surface-4 ring-1 ring-hairline-strong" />
          <span className="size-2.5 rounded-full bg-surface-4 ring-1 ring-hairline-strong" />
          <span className="size-2.5 rounded-full bg-surface-4 ring-1 ring-hairline-strong" />
        </div>
        <span className="font-mono text-[12px] text-ink-subtle">deploy.yml · main</span>
        <span
          className={`chip font-mono transition-colors ${done ? "!text-success" : ""}`}
          aria-live="polite"
        >
          {done ? "● passed" : "● running"}
        </span>
      </div>

      <div className="grid gap-0 sm:grid-cols-[1.05fr_1fr]">
        {/* Stage list */}
        <ol className="space-y-0.5 border-hairline p-3 sm:border-r" aria-label="Pipeline stages">
          {STAGES.map((stage, i) => {
            const state = i < step ? "done" : i === step ? "running" : "queued";
            return (
              <li
                key={stage.name}
                className={`flex items-center gap-3 rounded-md px-2.5 py-2 transition-colors duration-300 ${
                  state === "running" ? "bg-surface-2" : ""
                }`}
              >
                <StatusIcon state={state} />
                <span className={`font-mono text-[13px] ${state === "queued" ? "text-ink-tertiary" : "text-ink"}`}>
                  {stage.name}
                </span>
                <span className="ml-auto hidden truncate font-mono text-[11px] text-ink-tertiary lg:block">
                  {stage.detail}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Log tail */}
        <div className="flex min-h-[220px] flex-col justify-between border-t border-hairline bg-canvas/60 p-4 sm:border-t-0">
          <div className="space-y-1.5 font-mono text-[12px] leading-relaxed" aria-hidden>
            <AnimatePresence initial={false}>
              {LOG.slice(0, step).map((line) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="truncate text-ink-subtle"
                >
                  {line}
                </motion.p>
              ))}
            </AnimatePresence>
            {!done && <span className="inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-ink-subtle" />}
          </div>
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between font-mono text-[11px] text-ink-tertiary">
              <span>production</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-surface-3">
              <motion.div
                className={`h-full rounded-full ${done ? "bg-success" : "bg-primary"}`}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
