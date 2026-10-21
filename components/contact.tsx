"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/content/profile";
import { Reveal } from "./motion";

const TOPICS = [
  {
    label: "Freelance project",
    subject: "Freelance project enquiry",
    body: "Hi Farooq,\n\nWhat I need:\n\nCurrent setup:\n\nTimeline:\n",
  },
  {
    label: "Full-time role",
    subject: "Full-time role opportunity",
    body: "Hi Farooq,\n\nRole and team:\n\nWhat we're building:\n\nLocation / remote:\n",
  },
] as const;

const mailto = (subject?: string, body?: string) => {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${profile.email}${query ? `?${query}` : ""}`;
};

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the address is still visible and selectable.
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-hairline py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="panel overflow-hidden rounded-2xl">
          <div className="grid lg:grid-cols-[1fr_1.15fr]">
            <Reveal className="relative border-b border-hairline p-8 sm:p-12 lg:border-b-0 lg:border-r">
              <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
              <div className="relative">
                <p className="eyebrow flex items-center gap-2">
                  <span className="h-px w-6 bg-primary" aria-hidden />
                  Contact
                </p>
                <h2 id="contact-title" className="display-lg mt-4">
                  Let&apos;s build something reliable.
                </h2>
                <p className="mt-5 max-w-[42ch] text-[17px] leading-relaxed text-ink-subtle">
                  Hiring for a DevOps or full-stack role, or need a pipeline, cloud setup or AI feature shipped? Send an
                  email and I&apos;ll reply personally.
                </p>
                <ul className="mt-8 space-y-3 text-[14px] text-ink-muted">
                  {["Open to full-time roles and freelance work", "Remote from Lahore, Pakistan (UTC+5)"].map((t) => (
                    <li key={t} className="flex items-center gap-3">
                      <span className="size-1.5 rounded-full bg-primary-hover" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="flex flex-col justify-center p-8 sm:p-12">
              <p className="text-[13px] font-medium text-ink-muted">Email</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={mailto()}
                  className="break-all text-[22px] font-medium tracking-[-0.02em] text-ink underline decoration-hairline-strong underline-offset-[6px] transition-colors hover:decoration-primary-hover sm:text-[28px]"
                >
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="btn btn-secondary relative min-w-[96px]"
                  aria-label={copied ? "Email address copied" : "Copy email address"}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? "copied" : "copy"}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className={copied ? "text-success" : ""}
                    >
                      {copied ? "✓ Copied" : "Copy"}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>

              <p className="mt-10 text-[13px] font-medium text-ink-muted">Or start with a ready-made email</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {TOPICS.map((t) => (
                  <a
                    key={t.label}
                    href={mailto(t.subject, t.body)}
                    className="group flex items-center justify-between rounded-lg border border-hairline bg-canvas/50 px-4 py-4 transition-colors hover:border-hairline-strong hover:bg-surface-2"
                  >
                    <span>
                      <span className="block text-[15px] font-medium text-ink">{t.label}</span>
                      <span className="mt-0.5 block text-[13px] text-ink-subtle">Opens your mail app</span>
                    </span>
                    <span aria-hidden className="text-ink-tertiary transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
