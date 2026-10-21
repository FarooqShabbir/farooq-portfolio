# Farooq Portfolio

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Motion. Single-page site at `app/page.tsx`; sections live in `components/`, and all copy lives in `content/profile.ts`. Deployed on Vercel at https://farooqshabbir.online.

- `npm run dev`, `npm run build`, `npm run typecheck`
- Never publish contact details (email, phone, social handles) anywhere in the site. The contact form delivers via `app/api/contact/route.ts` using environment variables.
- Keep animations behind `MotionConfig reducedMotion="user"` and mark scroll-revealed elements with `data-reveal` so they stay visible without JavaScript.

## Design references

Brand design systems live at `design-md/awesome-design-md/design-md/<brand>/DESIGN.md` (for example `design-md/awesome-design-md/design-md/airtable`). The current site follows `x.ai`; its tokens are in `app/globals.css`.
