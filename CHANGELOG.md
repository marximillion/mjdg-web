# Changelog

All notable changes to mjdg-web are documented here.
Format: MAJOR.MINOR.PATCH.BUILD — build increments with every deployment

---

## [Unreleased]

[FEATURE] Pit Lane portfolio hero — preview
- New route `/portfolio/dev` (noindex) — scroll-driven WebGL hero concept for the portfolio page, not linked from nav
- `app/components/PitLaneScene.tsx` — Three.js scene: pit-lane grid floor, light beams, dust particles, four project "plaques" (WEB-01/QA-02/DB-03/ARC-04) that come into focus as the camera dollies forward on scroll
- Theme-aware — reads `--brand-red/gold/blue`, `--bg-main` etc. directly and recolors live on dark/light toggle (dark = night garage, light = daylight showroom)
- Spec-sheet copy pulls real platform data — stack, deployment, dyno score (scorecard rating) per project
- [PACKAGE] Added `three` 0.186.0 + `@types/three` — route-level code-split, not loaded on the live `/portfolio` page
- Not yet decided whether this replaces the current hero, becomes a new section, or stays a one-off — see `app/docs/BACKLOG.md`

---

## [v1.1.2.8] — 2026-09-14

[FEAT] Portfolio page v2 — full redesign
- New layout: hero with code card, Selected Work cards, Tech Stack grid, Experience timeline, About Me, Contact
- Three project cards with images: MJMDG Platform (brand logo card), Pipeline WFCA (Schulich Geo fill), AWS DeepRacer (contain + bg-elevated); DeepRacer links to `https://deepracer-website.web.app/`
- Pipeline card: `object-fit: fill`, white background, bottom border separator
- `.pf2-project-download` pill button (gold border) for report downloads
- Global theme-aware logo CSS utilities: `.theme-logo--dark` / `.theme-logo--light` — covers all 3 theme states via `data-theme` + `prefers-color-scheme`, no per-component JS
- Vertical mobile timeline at ≤900px — `data-year` + `::before`/`::after` pseudo-elements for year labels and dot markers; NOW tag on active card; most-recent-first ordering
- About Me photo: `mdg-baguio-portfolio.png`, `object-position: center 72%`
- Terminal cursor switched to `--brand-green`
- "About me" hero CTA: `href="#about"`
- DEF-003 fixed — experience card key was `e.id ?? ...`; changed to `e.company + e.role`
- Resume PDF: `app/assets/data/MarkDeGuzman_Resume-2024.pdf`; import + both CTA buttons commented out pending profile copy finalization

[FEAT] Home hero redesign
- Full-bleed `Nunavut.jpg` background with top/bottom image fade overlays
- 3-equal-column grid layout: form | headline | branding
- Light-mode overlay softened; nav wordmark appears ≤900px when hero branding hides
- `page-home` class locks screenContainer to `100dvh` on desktop only
- Hero tagline: `color: var(--brand-gold)`

[FEAT] Brand token — `--brand-green`
- `#3B6E35` (dark) / `#2E5829` (light) — Honda G95P Clover Green Pearl approximation, pending spec confirmation

[FEAT] Alert system standardised
- `Alert` component with `variant="success|error|warning"` prop (success=green, error=red, warning=gold)
- Replaces all raw `<p style={{ color: "red" }}>` in home.tsx and register.tsx

[FEAT] Login UX improvements
- Loader animation aborted on failed login — no longer shows "All set." on bad credentials
- Banners (registered/loggedOut) dismiss on first keypress; URL cleaned on mount; auto-clear timer removed

[FEAT] Profile button styling
- Edit=gold, Cancel=red, Save=blue; standardised across login/register/profile

[FEAT] Catalogue — Financial tile disabled
- `.catalogue-tile--disabled` — non-clickable, 40% opacity

[REFACTOR] Nav wordmark — CSS text
- `logoText` image replaced with CSS `nav-brand-wordmark` span in NavigationBar and MobileNav; dead image imports removed

[FEAT] Automotive page — `/automotive`
- HighwayScene (`app/components/scenes/HighwayScene.tsx`) — Three.js night highway
- PitLaneScene moved to `app/components/scenes/`
- Personal garage: 4 cars (CSX, CR-V, Odyssey RB1, CSX Type S) — data from `garage.json` + `carImageMap`
- Software builds section commented out pending layout decision

[FEAT] Financial dashboard — `/financial`
- Chart.js 4.5.1, KPI tiles, monthly donut, setup costs, tax comparison
- Auth-gated (admin gating deferred until RBAC ships)

[FEAT] Custom error page
- `app/components/ErrorPage.tsx` — 400/401/403/404/500/503 with bald icon; replaces default RR7 ErrorBoundary

[FEAT] Page loader
- `app/components/Loader.tsx` — FD5 car approach animation, fires on login/logout

[FEAT] Brand colors — Honda paint codes
- `--brand-red`: R-513 Rallye Red FL5
- `--brand-gold`: Y-82 Phoenix Yellow FK8
- `--brand-blue`: B-561P Dyno Blue Pearl
- Updated dark + light theme tokens

[FIX] tsconfig.json — removed deprecated `baseUrl`; fixed `~/styles/app.css` import path in root.tsx

[TEST] Playwright E2E — `tests/navigation.spec.ts`, `playwright.config.ts`

---

## [v1.1.1.7] — 2026-08-16

[INFRA] SSL — End-to-end HTTPS enabled
- Let's Encrypt TLS cert provisioned for `mjmdg.org` and `www.mjmdg.org` with auto-renewal
- Cloudflare SSL hardened — HSTS, TLS 1.2 minimum, security headers
- SSL Labs grade: **A+**

---

## [v1.0.1.6] — 2026-08-15

[FEAT] Light/dark theme toggle
- ThemeToggle component with FontAwesome lightbulb icons (outline = light, solid = dark)
- Light theme — warm cream palette (#E8E4DC), all UI tokens updated
- Logo swaps between dark/light assets on toggle
- Theme persisted to localStorage, blocking script prevents flash on load
- Circle outline on toggle hover, no underline

[FEAT] MJMDG logo in hero
- Replaced eyebrow text with MJMDG logo mark, theme-aware
- Hero subtitle updated to "Kalabaw Noon, Kabayo Ngayon."

[FEAT] Favicon + page title
- MJMDG logo set as browser favicon
- Home page title updated to "MJMDG"

[FEAT] Portfolio contact pills
- Phone, email, LinkedIn, Calgary converted to pill components with FA icons
- Brand-red hover state on contact pills
- Calgary links to Google Maps
- Skill pill hover removed (not interactive)

[FEAT] Footer redesign
- Copyright left-aligned, version right-aligned
- Mobile: stacked and centered
- Copyright updated to "© MJMDG — LAB<3 Developments 2026"

[FIX] Nav bar not sticky
- Removed overflow-x: hidden from .screenContainer — was creating a new scroll container, breaking position: sticky on nav

[REFACTOR] Remove personal name as CSS identifier
- Renamed mark/wordmark → logo/logoText across all components and CSS classes

[PACKAGE] Install @fortawesome/free-regular-svg-icons and @fortawesome/free-brands-svg-icons

[FEAT] Flappy Bird game
- Authenticated-only route at /game-flappy-bird
- Canvas-based game with gravity, pipes, collision detection
- Bald icon as the bird, clipped to circle, rotates with velocity
- Brand colours — pipes brand-blue, ground bg-elevated
- Score tracking, high score persisted to localStorage
- Space / click / tap controls, idle / playing / game over states
- Catalogue tile added

---

## [v1.0.0.5] — 2026-08-13
[DOCS] Update workplan and add test cases

---

## [v1.0.0.4] — 2026-08-06
[PACKAGE] - Add dotenv to load .en file automatically in production
[PACKAGE] - Add dotenv dependencies
[FEATURE] - Add username to Dashboard

---

## [v1.0.0.3] — 2026-08-06
[FIX] - MobileNav logout
[FEATURE] - Add version to footer
[FEATURE] - Add Alert component
  - on successful registration
  - on successful logout

---

## [v1.0.0.2] — 2026-08-04

### Bug Fix — Registration

**Fix**
- Removed `password` column from registration INSERT query
- Local database schema updated to match production (dropped `password` column)

**Root Cause**
Registration action was inserting into a `password` column that does not exist in the schema — only `hashed_password` is stored.

---

## [v1.0.0.1] — 2026-08-04

### Initial Production Release

**Infrastructure**
- Deployed to AWS EC2 t3.micro, ca-west-1 (Calgary)
- Elastic IP: 40.177.197.204
- nginx reverse proxy + Cloudflare DNS (mjmdg.org, www.mjmdg.org, staging.mjmdg.org)
- PM2 process manager with auto-restart on reboot
- PostgreSQL 18 on EC2 with SSL (TLSv1.3)

**Auth**
- Login with bcryptjs password hashing
- Session-based auth via signed cookies
- Registration with hashed password storage
- Protected routes — redirect to `/` if unauthenticated
- Logout (destroy session)
- Profile edit (first name, last name, email)

**Pages**
- `/` — Home + login form
- `/register` — Registration
- `/dashboard` — Authenticated dashboard
- `/portfolio` — Resume/portfolio in synthwave docs format
- `/catalogue` — App launcher
- `/profile` — Edit profile (authenticated)
- `/logout` — Logout handler

**UI / Theme**
- Synthwave CSS theme (dark bg, neon accents)
- PageLayout and NavigationBar components
- Responsive nav (logged in vs logged out states)
- Show/hide password toggle
- Disabled submit until form fields filled
- Error display on auth forms
- Spawn animation easter egg on home page

**Tech Stack**
- React Router 7.9.2 (SSR) + Vite 7.1.7
- TypeScript 5.9.2 + TailwindCSS 4.1.13
- Node.js LTS + Yarn 1.22.22 + PM2 7.0.3
- PostgreSQL 18 + pg 8.20.0 + bcryptjs 3.0.3

---
