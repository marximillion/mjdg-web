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

## Automotive / Pit Lane
- [ ] Software builds section (WEB-01 → ARC-04) — currently commented out; decide final layout and re-enable or redesign
- [ ] Wire software stop CTAs to real per-project links/screenshots instead of placeholder repo links
- [ ] Garage section — add car detail/mod specs as they become known (CAR-01 CSX, CAR-02 CR-V, CAR-03 Odyssey, CAR-04 CSX Type S)
- [ ] Revisit mobile layout — panels currently stack full-width but the WebGL scene itself isn't tuned for narrow viewports

---

## Admin & Access Control
- [ ] Admin role UI — promote/demote users via `/admin/users` (no UI yet; promotion is DB-level for now)
- [ ] Financial page — currently stubs auth check only; needs `requireAdmin` gate once RBAC ships
- [ ] Future admin routes: `/admin/garage` (car CRUD), `/admin/portfolio` (content editing post-portfolio DB migration)

---

## Ideas / Under Consideration
Add items here as they come up.
