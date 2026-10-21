import { NextResponse } from "next/server";

// Delivers contact-form messages by email through Resend.
// The destination address comes from the environment, so it never appears in the site's source.

const TOPICS = new Set(["Full-time role", "Freelance project", "Something else"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort per-instance throttle; enough to blunt casual spam on a portfolio.
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function throttled(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const topic = clean(body.topic, 40);
  const message = clean(body.message, 5000);

  if (!name || !EMAIL_RE.test(email) || !TOPICS.has(topic) || message.length < 10) {
    return NextResponse.json({ error: "Please fill in every field with a valid email and a short message." }, { status: 422 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error("contact: RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL is not set");
    return NextResponse.json({ error: "The contact form isn't available right now. Please try again later." }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `New inquiry: ${topic} from ${name}`,
      text: `${topic}\n\nFrom: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error("contact: Resend responded", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "Your message couldn't be sent. Please try again in a moment." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
