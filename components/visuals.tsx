"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "./motion";

/** Cycles 0..count-1 every `ms` while the element is on screen. */
function useCycle(count: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % count), ms);
    return () => clearInterval(t);
  }, [inView, reduce, count, ms]);
  return { ref, i };
}

function Frame({ title, meta, children }: { title: string; meta?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="panel overflow-hidden rounded-xl">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2.5">
        <span className="truncate font-mono text-[12px] text-ink-subtle">{title}</span>
        {meta}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

/* ───────────────────────── Release: signed self-update ───────────────────────── */

const UPDATE_STEPS = [
  { label: "fetch manifest.json", note: "over HTTPS" },
  { label: "verify Ed25519 signature", note: "public key pinned in agent" },
  { label: "download + SHA-256 check", note: "hash must match manifest" },
  { label: "stage and swap binary", note: "single-instance lock held" },
  { label: "health check new build", note: "start within timeout" },
];

export function ReleaseVisual() {
  // Phases 1..5 tick through the steps, then the result holds until the loop restarts.
  const { ref, i } = useCycle(14, 700);
  const phase = Math.min(i, 6);
  const outcomeShown = phase >= 6;

  return (
    <div ref={ref}>
      <Frame
        title="agent · self-update"
        meta={
          <span className={`chip font-mono ${outcomeShown ? "!text-success" : ""}`}>
            {outcomeShown ? "updated" : "checking"}
          </span>
        }
      >
        <ol className="relative space-y-2">
          <span className="absolute bottom-3 left-[11px] top-3 w-px bg-hairline" aria-hidden />
          {UPDATE_STEPS.map((s, idx) => {
            const reached = phase > idx;
            const current = phase === idx + 1 && !outcomeShown;
            return (
              <li key={s.label} className="relative flex items-start gap-3">
                <motion.span
                  className="relative z-10 mt-0.5 grid size-[23px] shrink-0 place-items-center rounded-full border"
                  animate={{
                    backgroundColor: reached ? "rgb(255 122 23 / 0.18)" : "rgb(25 25 25 / 1)",
                    borderColor: reached ? "#ff7a17" : "#3a3c41",
                  }}
                  transition={{ duration: 0.35 }}
                >
                  <span className={`size-1.5 rounded-full ${reached ? "bg-primary-hover" : "bg-hairline-strong"}`} />
                </motion.span>
                <div className={`rounded-md px-2 py-1 transition-colors ${current ? "bg-surface-2" : ""}`}>
                  <p className={`font-mono text-[13px] ${reached ? "text-ink" : "text-ink-tertiary"}`}>{s.label}</p>
                  <p className="text-[12px] text-ink-tertiary">{s.note}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[12px]">
          <div className="rounded-md border border-hairline bg-canvas/60 px-3 py-2 text-ink-subtle">
            <span className="text-success">✓</span> healthy → keep
          </div>
          <div className="rounded-md border border-hairline bg-canvas/60 px-3 py-2 text-ink-subtle">
            <span className="text-primary-hover">↺</span> fails → auto-rollback
          </div>
        </div>
      </Frame>
    </div>
  );
}

/* ───────────────────────── Voice: latency waterfall ───────────────────────── */

type Bar = { label: string; before: [number, number]; after: [number, number] };

// Illustrative relative timings (start, end as % of the original turn), not measurements.
const BARS: Bar[] = [
  { label: "speech → text", before: [0, 22], after: [0, 22] },
  { label: "save answer", before: [22, 40], after: [22, 34] },
  { label: "redis pre-check", before: [40, 48], after: [22, 26] },
  { label: "LLM first token", before: [48, 74], after: [26, 50] },
  { label: "text → speech", before: [74, 100], after: [44, 62] },
];

export function VoiceVisual() {
  const { ref, i } = useCycle(2, 3200);
  const optimised = i === 1;

  return (
    <div ref={ref}>
      <Frame
        title="voice-interview · one turn"
        meta={
          <div className="flex rounded-full border border-hairline bg-canvas p-0.5 font-mono text-[11px]" aria-hidden>
            <span className={`rounded-full px-2 py-0.5 transition-colors ${!optimised ? "bg-surface-3 text-ink" : "text-ink-tertiary"}`}>
              before
            </span>
            <span className={`rounded-full px-2 py-0.5 transition-colors ${optimised ? "bg-surface-3 text-ink" : "text-ink-tertiary"}`}>
              after
            </span>
          </div>
        }
      >
        <div className="space-y-3">
          {BARS.map((b) => {
            const [s, e] = optimised ? b.after : b.before;
            return (
              <div key={b.label} className="grid grid-cols-[110px_1fr] items-center gap-3 sm:grid-cols-[130px_1fr]">
                <span className="truncate font-mono text-[12px] text-ink-subtle">{b.label}</span>
                <div className="relative h-5 rounded bg-canvas/70">
                  <motion.div
                    className="absolute inset-y-0 rounded bg-primary/70 ring-1 ring-inset ring-primary-hover/40"
                    animate={{ left: `${s}%`, width: `${e - s}%` }}
                    transition={{ duration: 0.9, ease: EASE }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 grid grid-cols-[110px_1fr] items-center gap-3 border-t border-hairline pt-4 sm:grid-cols-[130px_1fr]">
          <span className="font-mono text-[12px] text-ink">reply audible</span>
          <div className="relative h-2">
            <motion.div
              className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-success shadow-[0_0_0_4px_rgb(39_166_68_/_0.18)]"
              animate={{ left: optimised ? "44%" : "74%" }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </div>
        </div>
        <p className="mt-4 text-[12px] text-ink-tertiary">
          Illustrative: work that used to run in sequence now overlaps, so the reply starts sooner.
        </p>
      </Frame>
    </div>
  );
}

/* ───────────────────────── Infra: AWS VPC diagram ───────────────────────── */

function Node({ x, y, w = 120, label, sub }: { x: number; y: number; w?: number; label: string; sub?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={sub ? 44 : 32} rx={7} fill="#1a1c20" stroke="#3a3c41" />
      <text x={x + w / 2} y={y + (sub ? 19 : 20)} textAnchor="middle" fill="#ffffff" fontSize="11.5" fontFamily="var(--font-mono)">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + 34} textAnchor="middle" fill="#7d8187" fontSize="10" fontFamily="var(--font-mono)">
          {sub}
        </text>
      )}
    </g>
  );
}

function Flow({ d, delay = 0 }: { d: string; delay?: number }) {
  return (
    <g>
      <path d={d} fill="none" stroke="#212327" strokeWidth="1.5" />
      <path
        d={d}
        fill="none"
        stroke="#ffc285"
        strokeWidth="1.5"
        strokeDasharray="4 10"
        className="flow-dash"
        style={{ animationDelay: `${delay}s` }}
      />
    </g>
  );
}

export function InfraVisual() {
  return (
    <Frame title="vpc · production" meta={<span className="chip font-mono">public + private tiers</span>}>
      <svg viewBox="0 0 440 330" className="h-auto w-full" role="img" aria-label="Diagram: users reach an Application Load Balancer in public subnets, which routes to an Auto Scaling Group of EC2 instances in private subnets that reach the internet through a NAT gateway. Route 53 handles DNS and ACM provides TLS.">
        <Node x={160} y={6} label="users · HTTPS" />
        <Node x={10} y={6} w={120} label="Route 53" sub="DNS delegation" />
        <Node x={310} y={6} w={120} label="ACM" sub="TLS certificate" />

        <rect x={8} y={70} width={424} height={252} rx={12} fill="none" stroke="#4a4d52" strokeDasharray="3 4" />
        <text x={20} y={88} fill="#a1a5ab" fontSize="10.5" fontFamily="var(--font-mono)">VPC</text>

        <rect x={22} y={98} width={396} height={66} rx={9} fill="rgb(255 122 23 / 0.05)" stroke="#212327" />
        <text x={34} y={114} fill="#7d8187" fontSize="10" fontFamily="var(--font-mono)">public subnets</text>
        <Node x={150} y={116} w={140} label="ALB" sub="path routing · health" />
        <Node x={330} y={122} w={78} label="NAT GW" />
        <Node x={32} y={122} w={78} label="IGW" />

        <rect x={22} y={180} width={396} height={130} rx={9} fill="rgb(255 255 255 / 0.015)" stroke="#212327" />
        <text x={34} y={196} fill="#7d8187" fontSize="10" fontFamily="var(--font-mono)">private subnets · auto scaling group</text>
        <Node x={40} y={212} w={110} label="EC2" sub="custom AMI" />
        <Node x={165} y={212} w={110} label="EC2" sub="custom AMI" />
        <Node x={290} y={212} w={110} label="EC2" sub="scaling…" />
        <text x={40} y={290} fill="#7d8187" fontSize="9.5" fontFamily="var(--font-mono)">IAM role per instance · SSM, no SSH · Secrets Manager</text>

        <Flow d="M220 38 V116" />
        <Flow d="M190 160 C190 190, 95 190, 95 212" delay={0.3} />
        <Flow d="M220 160 V212" delay={0.6} />
        <Flow d="M250 160 C250 190, 345 190, 345 212" delay={0.9} />
        <Flow d="M369 212 V146" delay={1.2} />
      </svg>
    </Frame>
  );
}

/* ───────────────────────── CI/CD: fail-fast gates ───────────────────────── */

const GATES = ["trigger", "build", "sanity", "deploy", "verify"];

export function PipelineVisual() {
  const { ref, i } = useCycle(12, 650);
  // Ticks through the gates, then holds on the verified state before restarting.
  const run = i;
  const reached = Math.min(run, GATES.length);

  return (
    <div ref={ref}>
      <Frame title="pipeline · commit → production" meta={<span className="chip font-mono">self-hosted agent</span>}>
        <div className="flex items-center">
          {GATES.map((g, idx) => {
            const done = idx < reached;
            const active = idx === reached && run < GATES.length;
            return (
              <div key={g} className="flex min-w-0 flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    className="grid size-8 place-items-center rounded-lg border font-mono text-[11px] sm:size-9"
                    animate={{
                      borderColor: done ? "#27a644" : active ? "#ffc285" : "#3a3c41",
                      backgroundColor: done ? "rgb(39 166 68 / 0.12)" : active ? "rgb(255 122 23 / 0.16)" : "#191919",
                      scale: active ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {done ? <span className="text-success">✓</span> : <span className="text-ink-tertiary">{idx + 1}</span>}
                  </motion.div>
                  <span className={`font-mono text-[10px] sm:text-[11px] ${done || active ? "text-ink" : "text-ink-tertiary"}`}>{g}</span>
                </div>
                {idx < GATES.length - 1 && (
                  <div className="relative mx-1 mb-6 h-px min-w-2 flex-1 bg-hairline sm:mx-1.5">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-success"
                      animate={{ width: idx < reached ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 space-y-1.5 rounded-lg border border-hairline bg-canvas/60 p-3 font-mono text-[12px] leading-relaxed text-ink-subtle">
          <p>
            <span className="text-ink-tertiary">on:</span> push · paths: [&quot;api/**&quot;, &quot;infra/**&quot;]
          </p>
          <p>
            <span className="text-ink-tertiary">verify:</span> poll /healthz every 10s
          </p>
          <p>
            <span className="text-ink-tertiary">fail_if:</span> error <span className="text-ink-tertiary">||</span> timeout 300s
          </p>
          <p className={reached >= GATES.length ? "text-success" : "text-ink-tertiary"}>
            {reached >= GATES.length ? "✓ deployment verified" : "… waiting on stages"}
          </p>
        </div>
      </Frame>
    </div>
  );
}
