# mjdg-web — Backlog

Future ideas and items under consideration not yet assigned to a specific release. When an item is committed to a version, move it to ROADMAP.md and remove it here.

---

## Auth & Onboarding
- [ ] Redirect to dashboard after successful registration — currently lands on home page with success alert

---

## Home Page Redesign
- [ ] Split hero layout — text left, SVG tech-stack network graphic right (studiofish/orennia inspired)
- [ ] Sign In / Register modal using Radix UI `<Dialog>` — tabs for Sign In and Create Account
- [ ] Portfolio tease section — 2–3 featured project cards above the fold linking to `/portfolio`
- [ ] "Get in touch" CTA triggers modal instead of scroll to login form
- [ ] Mobile-first responsive: hero collapses to single column, modal to full-screen/bottom-sheet
- [ ] Mockup reference: `/Users/mjdg/Downloads/mjmdg_hero_redesign.html`

---

## Portfolio Hero Redesign
- [ ] Decide whether the Pit Lane WebGL hero (`/portfolio/dev` preview) replaces the current `/portfolio` hero, becomes a new "Selected Work" section further down the page, or stays a one-off
- [ ] If adopted: wire the four plaques to real per-project links/screenshots instead of the current placeholder repo links
- [ ] If adopted: revisit mobile layout — panels currently stack full-width but the WebGL scene itself isn't tuned for narrow viewports
- [ ] Preview: `app/routes/portfolio.dev.tsx`, `app/components/PitLaneScene.tsx`

---

## Ideas / Under Consideration
Add items here as they come up.
