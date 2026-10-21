# farooqshabbir.online

Portfolio of Farooq Shabbir, Full Stack DevOps Engineer (AI First). Built for two audiences: hiring teams and freelance clients.

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Geist fonts
- **Design:** follows the Linear reference in `design-md/awesome-design-md/design-md/linear.app/DESIGN.md` (near-black canvas, surface ladder, hairline borders, one lavender accent). The "product screenshots" are code-built, animated panels of real work: a CI/CD run, a signed self-updater, a voice-AI latency waterfall and an AWS VPC diagram.
- **Content:** all copy lives in `content/profile.ts`. No email, phone or social handles are published anywhere on the site.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

## Contact form

The form posts to `app/api/contact/route.ts`, which emails the message through [Resend](https://resend.com). The destination address is read from an environment variable, so it never appears in the page source. Set these in **Vercel → Project → Settings → Environment Variables** (see `.env.example`):

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | API key from Resend |
| `CONTACT_TO_EMAIL` | Inbox that should receive messages |
| `CONTACT_FROM_EMAIL` | Sender on a domain verified in Resend, e.g. `Farooq Shabbir · Website <inquiries@mail.farooqshabbir.online>` |

Until they're set, the form shows a polite "not available right now" message.

## Moving from farooqshabbir.site to farooqshabbir.online

The code already treats `farooqshabbir.online` as the canonical domain (metadata, sitemap, robots, structured data), and `next.config.ts` sends every request on `farooqshabbir.site` / `www.farooqshabbir.site` to the same path on `farooqshabbir.online` with a permanent 308 redirect. Old URLs such as `/about.html` also redirect to the matching section.

1. **Add the new domain in Vercel.** Project → Settings → Domains → add `farooqshabbir.online`, then add `www.farooqshabbir.online` and choose *Redirect to farooqshabbir.online*. Keep the apex (no `www`) as the primary domain.
2. **Point DNS at Vercel** where you bought `farooqshabbir.online` (e.g. Hostinger → Domains → DNS / Nameservers). Use the exact records Vercel shows on the Domains page; they are usually:
   - `A` record, name `@` → `76.76.21.21`
   - `CNAME` record, name `www` → `cname.vercel-dns.com`

   Delete any existing `A`/`CNAME` records for `@` and `www` that point elsewhere (for example a parked page). Alternatively, switch the domain's nameservers to Vercel's.
3. **Keep `farooqshabbir.site` attached** to the same Vercel project and its DNS unchanged. The app redirects it to the new domain, which preserves search rankings and old links. Keep renewing it for at least a year.
4. **Wait for verification.** Vercel issues HTTPS certificates automatically once DNS resolves (minutes to a few hours).
5. **Tell Google.** In Google Search Console, add `farooqshabbir.online` as a property and submit `https://farooqshabbir.online/sitemap.xml`. Then, in the old `farooqshabbir.site` property, use *Settings → Change of address* to point at the new domain.
6. **Framework preset.** `vercel.json` sets the framework to Next.js. If the project was created as a static site, also check Settings → Build & Deployment and clear any custom *Output Directory* override.
