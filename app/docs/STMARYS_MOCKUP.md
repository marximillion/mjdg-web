# St. Mary's Cathedral — Home Page Mockup (within mjdg-web)

Status: Planning
Related: `C:\opt\projects\stmarys-cathedral\docs\WORKPLAN.md` (Phase 3 — Design)

## Why this lives in mjdg-web, not the new repo

Before committing to the full rebuild (new repo, DB schema, admin panel — see the main workplan),
mock up the visual direction here first, the same way the Pit Lane concept was proved out as a preview
route before deciding whether to adopt it. Cheap to iterate, easy to show for feedback, throwaway if a
direction doesn't land. Whatever direction gets picked here feeds Phase 3 (Design) of the main
`stmarys-cathedral` workplan — this doc doesn't replace that one, it feeds it.

Precedent to follow: `/portfolio/dev` (now removed, logic moved into `/automotive`'s Pit Lane scene) —
noindex, not linked from nav, self-contained.

## Scope for this pass

- **Home page only**, fully designed — the other core pages (Sacraments, Giving, Events, Bulletin
  archive, Staff/Contact) are stubbed with a shared "Coming Soon" placeholder so the nav/IA reads as a
  real site, without spending design time on pages we're not evaluating yet
- **Two visual directions**, switchable live via a tab control at the top of the page — not separate
  links to click between, an actual switcher so comparison is immediate
- **Static mockup** — real layout, real copy, real design, no DB/auth/working forms. Exception: as we
  go deeper on Home specifically, also work out the actual UX structure (what sections exist, what
  order, what each one needs to communicate) — that structural thinking is real IA work, not just skin

## Confirmed: no reusable "Coming Soon" component exists yet

Checked the pulled code — the only "coming soon" text in the repo is an inline label on the disabled
password field in `/profile` (`app/routes/profile.tsx:112`, `.field-coming-soon` CSS class). Nothing
reusable as a stub page. This mockup will need a small `ComingSoon` component built for it.

## Plan

**Phase 1 — Scaffold**
- New routes under `/mockups/stmarys` (noindex, not linked from mjdg-web's nav)
- Own minimal layout for this section — no MJMDG `NavBar`/`Footer`. This is a mockup of a *different*
  site; wrapping it in MJMDG's own chrome would undercut the preview
- `ComingSoon` component (shared) for the stub pages: Sacraments, Giving, Events, Bulletin, Contact
- Variant switcher: a small tab control (Variant A / Variant B) pinned at the top of the mockup section,
  swaps a CSS/data attribute so both stub and Home pages reflect whichever variant is active

**Phase 2 — Home page UX structure (content/IA, independent of visual skin)**
Work out before or alongside visual design:
- Hero — what's the one thing a visitor should see first (Mass times? a welcome message? both?)
- Quick-info bar — Mass/confession/adoration times, always visible without scrolling
- Welcome / mission statement block
- Upcoming event teaser (pulls from the real site's current "static image" approach — decide what
  replaces it)
- Giving CTA — how prominent, where it sits relative to the fold
- Footer nav — what belongs here vs. in the main nav

**Phase 3 — Variant A: "Stone & Stained Glass"**
- Warm stone neutrals, deep stained-glass jewel tones (ruby, sapphire, gold) as accents
- A serif display face for headings — evokes carved stone / traditional ecclesiastical lettering
- Traditional, reverent, leans into the building's actual architecture

**Phase 4 — Variant B: "Light & Sanctuary"**
- Bright, airy, photography-forward — natural light through windows as the dominant visual idea
- Clean modern sans-serif, generous whitespace, minimal chrome
- Contemporary parish-website feel, less ornamental than Variant A

*(Names/directions above are a starting proposal — easy to rename or swap once we're looking at them.)*

**Phase 5 — Review**
- Compare both variants live via the switcher
- Pick a direction (or a hybrid) before Phase 3 of the main `stmarys-cathedral` workplan locks it in

## Explicitly out of scope for this pass
- Any database, auth, or working form submission
- Sacraments/Giving/Events/Bulletin/Contact page design (stubbed only)
- Anything in the separate `stmarys-cathedral` repo — this is exploration inside mjdg-web only
