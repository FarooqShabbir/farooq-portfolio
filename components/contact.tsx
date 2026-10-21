"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DrawRule, Magnetic, MaskedWords, Reveal } from "./motion";

const TOPICS = ["Freelance project", "Full-time role", "Something else"] as const;

type Status = { kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string };

export function Contact() {
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("Freelance project");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, topic }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      form.reset();
      setStatus({ kind: "sent" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
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
                  <DrawRule className="h-px w-6" />
                  Contact
                </p>
                <MaskedWords id="contact-title" className="display-lg mt-5" text="Let's build something reliable." />
                <p className="mt-5 max-w-[42ch] text-[17px] leading-relaxed text-ink-subtle">
                  Hiring for a DevOps or full-stack role, or need a pipeline, cloud setup or AI feature shipped? Send a
                  note and I&apos;ll reply personally.
                </p>
                <ul className="mt-8 space-y-3 text-[14px] text-ink-muted">
                  {[
                    "Open to full-time roles and freelance work",
                    "Remote from Lahore, Pakistan (UTC+5)",
                    "Your details are only used to reply to you",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-3">
                      <span className="size-1.5 rounded-full bg-primary-hover" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="p-8 sm:p-12">
              <AnimatePresence mode="wait">
                {status.kind === "sent" ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full min-h-[360px] flex-col items-start justify-center"
                    role="status"
                  >
                    <motion.span
                      className="grid size-12 place-items-center rounded-full bg-success/15 text-success"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    >
                      ✓
                    </motion.span>
                    <h3 className="mt-5 text-[24px] tracking-[-0.02em]">Message sent.</h3>
                    <p className="mt-2 text-ink-subtle">Thanks for reaching out. I&apos;ll get back to you soon.</p>
                    <button type="button" className="btn btn-secondary mt-8" onClick={() => setStatus({ kind: "idle" })}>
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={onSubmit} className="space-y-5" exit={{ opacity: 0 }}>
                    <fieldset>
                      <legend className="mb-2.5 text-[13px] text-ink-muted">I&apos;m reaching out about</legend>
                      <div className="flex flex-wrap gap-2">
                        {TOPICS.map((t) => (
                          <label
                            key={t}
                            className={`cursor-pointer rounded-full border px-3.5 py-2 text-[13px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-focus ${
                              topic === t
                                ? "border-primary bg-primary/15 text-ink"
                                : "border-hairline text-ink-subtle hover:border-hairline-strong"
                            }`}
                          >
                            <input
                              type="radio"
                              name="topic-choice"
                              value={t}
                              checked={topic === t}
                              onChange={() => setTopic(t)}
                              className="sr-only"
                            />
                            {t}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[13px] text-ink-muted">Name</span>
                        <input name="name" required maxLength={120} autoComplete="name" className="field" placeholder="Your name" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[13px] text-ink-muted">Email</span>
                        <input
                          name="email"
                          type="email"
                          required
                          maxLength={200}
                          autoComplete="email"
                          className="field"
                          placeholder="you@company.com"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-[13px] text-ink-muted">
                        {topic === "Full-time role" ? "Role and team" : "What do you need?"}
                      </span>
                      <textarea
                        name="message"
                        required
                        minLength={10}
                        maxLength={5000}
                        rows={5}
                        className="field resize-y"
                        placeholder={
                          topic === "Full-time role"
                            ? "The role, the team and what you're building."
                            : "The project, your current setup and your timeline."
                        }
                      />
                    </label>

                    {/* Honeypot for bots; hidden from people and assistive tech. */}
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <Magnetic>
                        <button
                          type="submit"
                          data-cursor="Send"
                          className="btn btn-primary min-w-[140px]"
                          disabled={status.kind === "sending"}
                        >
                          {status.kind === "sending" ? "Sending…" : "Send message"}
                        </button>
                      </Magnetic>
                      <p className="text-[13px] text-ink-tertiary" role="alert" aria-live="assertive">
                        {status.kind === "error" ? <span className="text-ink-muted">{status.message}</span> : null}
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
