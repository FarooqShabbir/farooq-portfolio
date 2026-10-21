import {
  award,
  caseStudies,
  certifications,
  education,
  experience,
  services,
  skillGroups,
} from "@/content/profile";
import { DrawLine, DrawRule, MaskedWords, Parallax, Reveal, Spotlight } from "./motion";
import { InfraVisual, PipelineVisual, ReleaseVisual, VoiceVisual } from "./visuals";

function SectionHeader({ id, eyebrow, title, lead }: { id: string; eyebrow: string; title: string; lead?: string }) {
  return (
    <Reveal className="max-w-[720px]">
      <p className="eyebrow flex items-center gap-2">
        <DrawRule className="h-px w-6" />
        {eyebrow}
      </p>
      <MaskedWords id={`${id}-title`} className="display-lg mt-4" text={title} />
      {lead && <p className="mt-5 text-[17px] leading-relaxed text-ink-subtle">{lead}</p>}
    </Reveal>
  );
}

function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">{children}</div>
    </section>
  );
}

const VISUALS: Record<string, React.ComponentType> = {
  release: ReleaseVisual,
  voice: VoiceVisual,
  infra: InfraVisual,
  pipeline: PipelineVisual,
};

export function Work() {
  return (
    <Section id="work">
      <SectionHeader
        id="work"
        eyebrow="Selected work"
        title="Systems I've designed, shipped and kept running."
        lead="Production work from the last year, from a desktop agent's release pipeline to real-time AI. Client names are kept private; the engineering is shown as it was built."
      />
      <div className="mt-16 space-y-24 sm:mt-20 sm:space-y-32">
        {caseStudies.map((cs, idx) => {
          const Visual = VISUALS[cs.id];
          const flip = idx % 2 === 1;
          return (
            <article key={cs.id} className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className={`min-w-0 ${flip ? "lg:order-2" : ""}`}>
                <p className="font-mono text-[12px] text-primary-hover">
                  0{idx + 1} <span className="text-ink-tertiary">/</span> {cs.kicker}
                </p>
                <h3 className="display-md mt-3">{cs.title}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-ink-subtle">{cs.body}</p>
                <ul className="mt-6 space-y-2.5">
                  {cs.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[15px] text-ink-muted">
                      <span className="mt-[9px] size-1 shrink-0 rounded-full bg-primary-hover" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1} y={28} className={`min-w-0 ${flip ? "lg:order-1" : ""}`}>
                <Parallax>
                  <Visual />
                </Parallax>
              </Reveal>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience" className="border-t border-hairline">
      <SectionHeader id="experience" eyebrow="Experience" title="Where I've done the work." />
      <ol className="relative mt-14 border-t border-hairline">
        {experience.map((job, idx) => (
          <li key={job.company} className="relative">
            <DrawLine />
            <Reveal delay={idx * 0.05} className="grid gap-6 py-10 md:grid-cols-[220px_1fr] md:gap-12">
              <div>
                <p className="font-mono text-[13px] text-ink-subtle">{job.period}</p>
                {job.current && (
                  <span className="chip mt-3 gap-1.5">
                    <span className="size-1.5 rounded-full bg-success" aria-hidden />
                    Current
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-[22px] font-medium tracking-[-0.02em]">
                  {job.role} <span className="text-ink-subtle">· {job.company}</span>
                </h3>
                <p className="mt-1 text-[13px] text-ink-tertiary">{job.place}</p>
                <p className="mt-4 max-w-[70ch] text-[16px] leading-relaxed text-ink-muted">{job.summary}</p>
                <details className="group mt-5">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-md text-[14px] font-medium text-primary-hover hover:text-ink [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">Show {job.points.length} highlights</span>
                    <span className="hidden group-open:inline">Hide highlights</span>
                    <span aria-hidden className="transition-transform group-open:rotate-90">›</span>
                  </summary>
                  <ul className="mt-4 max-w-[75ch] space-y-3">
                    {job.points.map((p) => (
                      <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-ink-subtle">
                        <span className="mt-[10px] size-1 shrink-0 rounded-full bg-ink-tertiary" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </details>
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
                  {job.stack.map((t) => (
                    <li key={t} className="chip tech-chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Services() {
  return (
    <Section id="services" className="border-t border-hairline">
      <SectionHeader
        id="services"
        eyebrow="Freelance services"
        title="Bring me in for the part that has to work."
        lead="Fixed-scope engagements or ongoing support for startups and teams. Every engagement ends with documentation another engineer can follow."
      />
      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, idx) => (
          <Reveal key={s.title} delay={(idx % 3) * 0.06} className="h-full">
            <Spotlight className="panel group flex h-full flex-col p-6 transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-surface-2">
              <span className="font-mono text-[12px] text-ink-tertiary">0{idx + 1}</span>
              <h3 className="mt-6 text-[20px] font-medium tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-subtle">{s.body}</p>
              <ul className="mt-6 flex flex-wrap gap-1.5 border-t border-hairline pt-4" aria-label="Deliverables">
                {s.deliverables.map((d) => (
                  <li key={d} className="font-mono text-[11.5px] text-ink-subtle after:ml-1.5 after:text-ink-tertiary after:content-['·'] last:after:content-['']">
                    {d}
                  </li>
                ))}
              </ul>
            </Spotlight>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px] text-ink-subtle">
        {["Discovery call", "Written plan and quote", "Build with weekly demos", "Handover and runbooks"].map((step, i) => (
          <span key={step} className="flex items-center gap-2.5">
            <span className="grid size-6 place-items-center rounded-full border border-hairline font-mono text-[11px] text-ink-muted">
              {i + 1}
            </span>
            {step}
          </span>
        ))}
      </Reveal>
    </Section>
  );
}

export function Stack() {
  const marquee = skillGroups.flatMap((g) => g.items);
  return (
    <Section id="stack" className="border-t border-hairline">
      <SectionHeader id="stack" eyebrow="Stack" title="Tools I use in production." />
      <div className="relative mt-12 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-hidden>
        <div className="flex w-max animate-marquee gap-2 hover:[animation-play-state:paused]">
          {[...marquee, ...marquee].map((t, i) => (
            <span key={i} className="rounded-md border border-hairline bg-surface-1 px-3 py-1.5 font-mono text-[13px] text-ink-muted">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="relative mt-2 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-hidden>
        <div className="flex w-max animate-marquee-reverse gap-2 hover:[animation-play-state:paused]">
          {[...marquee].reverse().concat([...marquee].reverse()).map((t, i) => (
            <span key={i} className="rounded-md border border-hairline bg-surface-1 px-3 py-1.5 font-mono text-[13px] text-ink-subtle">
              {t}
            </span>
          ))}
        </div>
      </div>
      <dl className="mt-12 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g) => (
          <div key={g.label} className="bg-canvas p-6">
            <dt className="eyebrow">{g.label}</dt>
            <dd className="mt-3 text-[15px] leading-relaxed text-ink-muted">{g.items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export function About() {
  return (
    <Section id="about" className="border-t border-hairline">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeader id="about" eyebrow="About" title="Engineer first. AI-first by workflow." />
          <Reveal delay={0.05} className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink-subtle">
            <p>
              I work across the whole path a product takes to reach users: the Python and FastAPI backend, the Next.js
              frontend, the cloud it runs on, the pipeline that ships it and the monitoring that tells you when it breaks.
            </p>
            <p>
              I build with Claude Code as part of my daily workflow, and pair that speed with strict review, testing
              and verification on every change. I&apos;m currently completing an MS in Computer Science at FAST alongside
              client work.
            </p>
          </Reveal>
        </div>

        <div className="space-y-3">
          <Reveal className="panel p-6">
            <h3 className="eyebrow">Education</h3>
            <ul className="mt-4 space-y-5">
              {education.map((e) => (
                <li key={e.degree} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <div>
                    <p className="text-[16px] font-medium text-ink">{e.degree}</p>
                    <p className="text-[14px] text-ink-subtle">{e.school}</p>
                  </div>
                  <p className="text-right font-mono text-[12px] text-ink-tertiary">
                    {e.period}
                    <span className="block">{e.note}</span>
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.06} className="panel p-6">
            <h3 className="eyebrow">Certifications</h3>
            <ul className="mt-4 space-y-2.5">
              {certifications.map((c) => (
                <li key={c} className="flex items-center gap-3 text-[15px] text-ink-muted">
                  <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-primary-hover" aria-hidden>
                    <path d="M8 1.5l1.8 1.3 2.2-.1.7 2.1 1.8 1.3-.7 2.1.7 2.1-1.8 1.3-.7 2.1-2.2-.1L8 14.5l-1.8-1.3-2.2.1-.7-2.1L1.5 9.9l.7-2.1-.7-2.1 1.8-1.3.7-2.1 2.2.1z" fill="currentColor" opacity="0.2" />
                    <path d="M5.5 8.2l1.7 1.7 3.3-3.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.12} className="panel p-6">
            <h3 className="eyebrow">Award</h3>
            <p className="mt-4 text-[16px] font-medium text-ink">{award.title}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-subtle">{award.body}</p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
