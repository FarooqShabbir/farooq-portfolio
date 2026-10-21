# farooqshabbir.online

Source for the personal website of **Farooq Shabbir**, Full Stack DevOps Engineer (AI First). The site serves two audiences, hiring teams and freelance clients, and is deployed on Vercel at **https://farooqshabbir.online**.

> This repository is private. Only the built website is public.

---

## Contents

- [Overview](#overview)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Local development](#local-development)
- [Updating content](#updating-content)
- [Design system](#design-system)
- [Contact form](#contact-form)
- [Deployment](#deployment)
- [Domains](#domains)
- [SEO](#seo)
- [Maintenance checklist](#maintenance-checklist)

---

## Overview

A single-page site with these sections, in order:

| Section | Anchor | Purpose |
|---|---|---|
| Hero | `#top` | Positioning, availability and an animated CI/CD run |
| Selected work | `#work` | Four case studies with animated, code-built visuals |
| Experience | `#experience` | Roles, summaries and expandable highlights |
| Freelance services | `#services` | Six service offerings and the engagement process |
| Stack | `#stack` | Tools grouped by area, with a scrolling marquee |
| About | `#about` | Background, education, certifications and award |
| Contact | `#contact` | Form that delivers enquiries by email |

**Privacy rule:** no email address, phone number or social handle is published anywhere on the site. Enquiries reach the owner only through the contact form.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 with design tokens in `app/globals.css` |
| Animation | Motion (`motion/react`), respecting the visitor's reduced-motion setting |
| Fonts | Geist Sans and Geist Mono, self-hosted via the `geist` package |
| Email | Resend REST API, called from a Next.js route handler |
| Hosting | Vercel |

Requires **Node.js 20.9 or later**.

## Project structure

```
app/
  layout.tsx             Root layout, metadata, fonts, structured data
  page.tsx               Assembles the page sections
  globals.css            Design tokens and shared component classes
  api/contact/route.ts   Contact form endpoint (validation, throttling, Resend)
  opengraph-image.tsx    Social share image, generated at build time
  sitemap.ts, robots.ts  SEO files
  icon.svg               Favicon
  not-found.tsx          404 page
components/
  nav.tsx                Sticky navigation, mobile menu, active-section tracking
  hero.tsx               Hero section and stats
  pipeline-console.tsx   Animated CI/CD run shown in the hero
  sections.tsx           Work, Experience, Services, Stack, About
  visuals.tsx            Animated case-study panels
  contact.tsx            Contact form (client side)
  footer.tsx             Footer
  motion.tsx             Motion provider and scroll-reveal helper
content/
  profile.ts             All site copy: profile, experience, work, services, skills
design-md/               Brand design references (see Design system)
next.config.ts           Redirects and security headers
vercel.json              Pins the Vercel framework preset to Next.js
.env.example             Template for local environment variables
```

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command | Purpose |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build locally |
| `npm run typecheck` | TypeScript check only |

To test the contact form locally, copy `.env.example` to `.env.local` and fill in the values from [Contact form](#contact-form). `.env.local` is git-ignored. Never put real values in `.env.example`.

## Updating content

All text lives in **`content/profile.ts`**; components only render it.

| To change | Edit |
|---|---|
| Name, role, headline, intro, availability | `profile` |
| Jobs and highlights | `experience` |
| Case studies | `caseStudies` (the `id` selects the visual in `components/visuals.tsx`) |
| Freelance services | `services` |
| Skills | `skillGroups` |
| Education, certifications, award | `education`, `certifications`, `award` |
| Hero numbers | `stats` |

After editing, run `npm run build` to confirm nothing broke, then push. Vercel deploys automatically.

## Design system

The visual language follows the Linear reference at `design-md/awesome-design-md/design-md/linear.app/DESIGN.md`:

- Near-black canvas (`#010102`) with a four-step surface ladder and 1px hairline borders
- A single lavender accent (`#5e6ad2`) for the brand mark, primary actions and focus rings
- Display type at weight 600 with tight negative tracking
- Code-built "product screenshots" instead of stock imagery

Tokens are defined once in the `@theme` block of `app/globals.css` and used as Tailwind classes (`bg-surface-1`, `text-ink-subtle`, `border-hairline`, …). Other brand references are available in `design-md/` for future redesigns.

**Accessibility conventions**

- All animation runs under `MotionConfig reducedMotion="user"`.
- Scroll-revealed elements carry `data-reveal`, so they remain visible if JavaScript fails.
- Skip link, visible focus rings, labelled navigation and keyboard-closable mobile menu.

## Contact form

The form posts to `app/api/contact/route.ts`, which validates the input, rejects bots with a honeypot field, throttles repeat submissions and sends the message through Resend. The recipient address exists only as an environment variable, never in the page source.

Each message arrives as:

- **From:** the configured sender, e.g. *Farooq Shabbir · Website*
- **Subject:** `New inquiry: <topic> from <visitor's name>`
- **Reply-To:** the visitor's email, so replying from the inbox reaches them directly

### Environment variables

Set in **Vercel → Project → Settings → Environment Variables** (Production), then redeploy:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Resend API key with **Sending access** only |
| `CONTACT_TO_EMAIL` | Inbox that receives enquiries |
| `CONTACT_FROM_EMAIL` | `Farooq Shabbir · Website <inquiries@mail.farooqshabbir.online>` |

If any variable is missing, the form shows a "not available right now" message and the reason is logged in Vercel's function logs.

### Resend setup

1. In Resend, add the domain **`mail.farooqshabbir.online`** and enable **Sending** only (leave Receiving off).
2. Add the DNS records Resend lists (DKIM `TXT`, `MX` and SPF `TXT` on `send.mail`, optional DMARC) wherever the domain's DNS is managed: Hostinger's DNS editor, or Vercel's if the nameservers point to Vercel. Enter only the host part (for example `resend._domainkey.mail`).
3. Click **Verify** in Resend.
4. Any address on `@mail.farooqshabbir.online` can then be used as the sender. No mailbox is needed.

Using the `mail.` subdomain keeps the website's sending reputation separate from the root domain, which stays free for a real mailbox later.

## Deployment

Vercel builds and deploys on every push:

- **`main`** → production at https://farooqshabbir.online
- **Any other branch** → a preview URL, shown on the pull request

`vercel.json` pins the framework preset to Next.js. If the project was originally created as a static site, make sure no custom *Output Directory* is set under Settings → Build & Deployment.

## Domains

| Domain | Role |
|---|---|
| `farooqshabbir.online` | Primary (canonical) |
| `www.farooqshabbir.online` | Redirects to the primary domain (set in Vercel) |
| `farooqshabbir.site`, `www.farooqshabbir.site` | Legacy; redirect to the same path on the primary domain with a permanent 308 (`next.config.ts`) |

Old page URLs from the previous static site (`/about.html`, `/projects.html`, `/services.html`, `/contact.html`) redirect to the matching section.

### DNS for `farooqshabbir.online`

Use the exact values shown in Vercel → Project → Settings → Domains. They are typically:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Remove any other `A` or `CNAME` records for `@` and `www`. Vercel issues HTTPS certificates automatically once DNS resolves. Keep `farooqshabbir.site` attached to the project and renewed so existing links keep working.

## SEO

- Canonical URL, Open Graph and Twitter metadata in `app/layout.tsx`
- `ProfilePage` / `Person` structured data (JSON-LD), without contact details
- Generated `sitemap.xml`, `robots.txt` and social share image
- After the domain move: add `farooqshabbir.online` in Google Search Console, submit `https://farooqshabbir.online/sitemap.xml`, and use **Change of address** from the `farooqshabbir.site` property

## Maintenance checklist

- [ ] Update `content/profile.ts` after each new role, project or certification
- [ ] Run `npm run build` before pushing
- [ ] Send a test message through the live contact form after changing environment variables
- [ ] Renew `farooqshabbir.online` and `farooqshabbir.site`
- [ ] Rotate the Resend API key if it is ever exposed
- [ ] Update dependencies periodically (`npm outdated`, then `npm update`) and rebuild
