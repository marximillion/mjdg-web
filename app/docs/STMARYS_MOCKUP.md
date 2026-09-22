# St. Mary's Cathedral — Home Page Mockup (within mjdg-web)

Status: Built (2026-09-22)
Related: `C:\opt\projects\stmarys-cathedral\docs\WORKPLAN.md` (Phase 3 — Design)
Entry point: `/dev-settings/mockups` (hidden — click the MJMDG logo 5x on the home page), not the catalogue

## Why this lives in mjdg-web, not the new repo

Before committing to the full rebuild (new repo, DB schema, admin panel — see the main workplan),
mock up the visual direction here first, the same way the Pit Lane concept was proved out as a preview
route before deciding whether to adopt it. Cheap to iterate, easy to show for feedback, throwaway if a
direction doesn't land. Whatever direction gets picked here feeds Phase 3 (Design) of the main
`stmarys-cathedral` workplan — this doc doesn't replace that one, it feeds it.

## Scope for this pass

- **Home page only**, fully designed — the other core pages (Sacraments, Giving, Events, Bulletin
  archive, Contact) are stubbed with the shared `ComingSoon` component so the nav/IA reads as a real
  site, without spending design time on pages we're not evaluating yet
- **Two visual directions**, switchable live via a tab control at the top of the page
- **Static mockup** — real layout, real copy, real design, no DB/working forms

## What's built

- `app/routes/mockups.stmarys.tsx` — Home mockup: quick-info bar (Mass/confession/adoration times),
  hero, sample event teaser, footer nav, and the A/B variant switcher
- `app/routes/mockups.stmarys.stub.tsx` — dynamic `:page` route for Sacraments/Giving/Events/Bulletin/
  Contact, each rendering the shared `ComingSoon` component (`app/components/ComingSoon.tsx`)
- Both wrapped in the normal `PageLayout` (MJMDG nav/footer) — not a standalone layout as first drafted;
  matches how `/automotive` and `/financial` do it
- No auth gate on either route — matches the rest of `/dev-settings*`; login isn't wired to a local DB
  in most dev environments right now, so a hard auth requirement would make these unreachable locally
- Entry point is `/dev-settings/mockups`, not `/catalogue` (that tile was added, then removed, once
  Developer Settings became the actual entry point)

**Variant A — "Stone & Stained Glass"**: warm stone neutrals, stained-glass jewel tones (ruby, sapphire,
gold) as accents, Cormorant Garamond serif display type (loaded route-locally via `links()`).

**Variant B — "Light & Sanctuary"**: bright, airy, Archivo (already loaded site-wide), generous
whitespace, less ornamental than A.

*(Names/directions are a starting proposal — easy to rename or redirect once reviewed.)*

## Next

- **Phase 2 — UX structure review**: confirm the home mockup's section order/content (hero, quick-info,
  event teaser, giving CTA placement) actually matches what the parish needs before picking a variant
- **Phase 5 — Review**: compare both variants, pick a direction (or hybrid) — feeds Phase 3 of the main
  `stmarys-cathedral` workplan

## Explicitly out of scope for this pass
- Any database or working form submission
- Sacraments/Giving/Events/Bulletin/Contact page design (stubbed only)
- Anything in the separate `stmarys-cathedral` repo — this is exploration inside mjdg-web only
