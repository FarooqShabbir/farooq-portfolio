# Farooq Portfolio

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Motion. Single-page site at `app/page.tsx`; sections live in `components/`, and all copy lives in `content/profile.ts`. Deployed on Vercel at https://farooqshabbir.online.

- `npm run dev`, `npm run build`, `npm run typecheck`
- The only published contact detail is the email in `content/profile.ts`. Never publish the phone number or social handles.
- Keep animations behind `MotionConfig reducedMotion="user"` and mark scroll-revealed elements with `data-reveal` so they stay visible without JavaScript.

## Design references

Brand design systems live at `design-md/awesome-design-md/design-md/<brand>/DESIGN.md` (for example `design-md/awesome-design-md/design-md/airtable`). The current site follows `linear.app`; its tokens are in `app/globals.css`.
