# CLAUDE.md — mjdg-web

## Project Overview
Main web application for the MJDG platform. Built with React Router 7 (SSR), TypeScript, TailwindCSS, and PostgreSQL. Local dev runs at `https://localhost:5173`.

## Tech Stack
- React Router 7.9.2 (SSR) + Vite 7.1.7
- TypeScript 5.9.2
- TailwindCSS 4.1.13
- PostgreSQL 18 — local DB: `mjdg-db01`, user: `mjdg`
- Session-based auth (cookies) with bcryptjs
- Yarn (package manager)

## Key Directories
```
app/
├── routes/        # Page components (home, portfolio, dashboard, catalogue, profile, register)
├── components/    # PageLayout, NavigationBar, Loader
├── db/            # db.server.ts (pool), session.server.ts, seed.ts
├── styles/        # app.css (brand design system + loader CSS)
├── assets/        # images, data
└── docs/          # ROADMAP.md, BACKLOG.md, DEFECTS.md, TEST_CASES.md, TASKS.md (legacy)
tests/             # Playwright E2E — navigation.spec.ts
playwright.config.ts
```

## CSS Theme Variables

> ⚠️ Invalid as of v1.0.1.6 — replaced with MJMDG brand design system. See app/styles/app.css for current variables.
```css
--bg-main: #0A0A13
--bg-panel: #191F4A
--purple: #9F00FF
--cyan: #00E5FF
--crt-green: #C4F90F
--neon-pink: #FF3EFF
--text-primary: #E6E6F0
--text-muted: #9CA0C8
--accent-orange: #FF8C42
```

> Updated v1.0.1.6 — MJMDG brand design system (dark + light themes)
> Updated v1.1.1.8 — brand colors updated to Honda paint codes

**Dark (default)**
```css
--bg-main: #0E0F10
--bg-panel: #1C1D20
--bg-elevated: #252629
--brand-red: #CC1E26   /* Honda R-513 Rallye Red FL5 */
--brand-gold: #FFD100  /* Honda Y-82 Phoenix Yellow FK8 */
--brand-blue: #1562C8  /* Honda B-561P Dyno Blue Pearl */
--text-primary: #F4F3F1
--text-muted: #8A8C90
--text-subtle: #55575B
```

**Light**
```css
--bg-main: #E8E4DC
--bg-panel: #DEDAD2
--bg-elevated: #D4CFC6
--brand-red: #B01B22
--brand-gold: #D4A800
--brand-blue: #0F52A8
--text-primary: #18191A
--text-muted: #4A4C50
--text-subtle: #8A8C90
```

Fonts: Archivo (400/500/600) + JetBrains Mono. Toggle persisted to localStorage via `ThemeToggle.tsx`.

## Auth Flow
- Login: `app/routes/home.tsx` → `action()` → bcrypt compare → set session cookie
- Logout: `app/routes/logout.ts` → destroy session → redirect `/`
- Protected routes: `loader()` checks session, redirects to `/` if not authenticated
- Registration: `app/routes/register.tsx` → hash password → insert user

### Network request sequence on login (React Router 7 SSR)
1. `POST /_root.data` — form submission with credentials; server validates, responds with `Set-Cookie`
2. `GET /__manifest?paths=%2Fdashboard` — React Router prefetches dashboard route chunks
3. `GET /dashboard.data` — dashboard loader runs with session cookie attached; server returns user data
4. `GET /__manifest?paths=%2Fcatalogue%2C%2Flogout%2C%2Fprofile` — prefetches nav link routes

### Cookie structure
Cookie name: `mjdg_session`
Value format: `[base64_payload].[signature]`
- Payload (`eyJ1c2VySWQiOjh9`) is base64-encoded JSON — decodes to `{"userId":8}`. Readable but not forgeable.
- Signature is an HMAC using `SESSION_SECRET` — prevents tampering
- Cookie is `HttpOnly` (JS cannot read it) and `Secure` (HTTPS only)
- No `MaxAge` currently set — session lives until logout or browser close. Session expiry planned v1.2.6.

### Password visibility in DevTools
Passwords are visible in the Network tab of any browser DevTools on the machine that sent the request. This is browser behavior and cannot be controlled at the application level. Mitigations:
- HTTPS encrypts the password in transit — DevTools shows the local decrypted version only
- Session expiry (v1.2.6) limits the damage window if a machine is left unattended
- Nothing the server can do to hide credentials from the local browser's own DevTools

## Database Schema
```sql
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR
);
```

## Current Status
> Updated v1.1.2.8 (deploying — 2026-09-14)
- **Portfolio page complete (pending resume)** — all sections wired: project cards with images, vertical mobile timeline, About Me photo, contact section
- **Project cards redesigned**:
  - MJMDG: theme-aware logo (white/black PNG) + "MJMDG" wordmark in `pf2-project-img--brand` flex container
  - Pipeline (WFCA): `schulich-geo.png` fill/stretch with white bg + bottom border separator
  - DeepRacer: `object-fit: contain` + `bg-elevated` padding, arrow links to `https://deepracer-website.web.app/`
- **Global theme-aware logo CSS** — `.theme-logo--dark` / `.theme-logo--light` utilities in `app.css`, no per-component JS, cover all 3 theme states (data-theme explicit + prefers-color-scheme)
- **Vertical timeline on mobile** — activates at ≤900px; `data-year` / `::before` pseudo-element labels, `::after` dot markers, NOW tag on active card; most-recent-first via `experience.slice().reverse()`
- **About Me photo** — `mdg-baguio-portfolio.png`, `object-position: center 72%` to show full horse
- **Terminal cursor** — `--brand-green` (was `--brand-blue`)
- **"About me" CTA** — `href="#about"` scroll anchor
- **DEF-003 fixed** — experience card key was `e.id ?? ...`; changed to `e.company + e.role`
- **Resume PDF** — created at `app/assets/data/MarkDeGuzman_Resume-2024.pdf`; HTML source at scratchpad `resume.html`; resume import + both CTA buttons **commented out pending finalization**

> Updated v1.1.3 (local, not yet deployed — 2026-09-14)
- **Home hero redesign** — Nunavut.jpg full-bleed background; 3-equal-column grid (form | headline | branding); top/bottom image fade overlay; light-mode overlay softened; nav wordmark (JetBrains Mono) appears ≤900px when hero branding hides; `page-home` class locks screenContainer to `100dvh` on desktop only
- **Brand token** — `--brand-green: #3B6E35` (dark) / `#2E5829` (light) added — Honda G95P Clover Green Pearl approximation, pending tweak
- **Alert system standardised** — `Alert` component gains `variant="success|error|warning"` prop; success=green, error=red, warning=gold; replaces all raw `<p style={{ color: "red" }}>` in home.tsx and register.tsx; all alerts rendered at consistent location (above submit button)
- **Login UX** — loader animation aborted on failed login (no longer shows "All set." on bad credentials); banners (registered/loggedOut) dismiss on first keypress + URL cleaned on mount so refresh doesn't re-show them; auto-clear timer removed (keypress-only dismiss)
- **Profile buttons** — Edit=gold, Cancel=red, Save=blue; standardised across login/register/profile
- **Catalogue** — Financial tile disabled (`.catalogue-tile--disabled`); non-clickable, 40% opacity
- **Nav cleanup** — wordmark image (`logoText`) replaced with CSS text span (`nav-brand-wordmark`) in both NavigationBar and MobileNav; dead `darkLogoText`/`lightLogoText` imports removed
- **Hero tagline** — `color: var(--brand-gold)`
- **Submit buttons** — login and register submit buttons set to `--brand-blue`

> Updated v1.1.1.8
- Pit Lane WebGL scene moved from `/portfolio/dev` to `/automotive` — Three.js scroll-driven scene, theme-aware (dark/light), spec-sheet copy per project. See `app/components/PitLaneScene.tsx`, `app/routes/automotive.tsx`
- `portfolio.dev.tsx` deleted; `/portfolio/dev` route removed
- Personal garage section added to `/automotive` — 4 cars (CAR-01 CSX, CAR-02 CR-V, CAR-03 Odyssey RB1, CAR-04 CSX Type S) with images; car data in `app/assets/data/garage.json`, images in `app/assets/images/cars/`
- Software builds section (WEB-01 → ARC-04) currently commented out in automotive.tsx — pending layout decision

> Updated v1.1.2 (local, not yet deployed)
- HighwayScene (`app/components/scenes/HighwayScene.tsx`) — Three.js night highway on `/automotive`; PitLaneScene moved to `app/components/scenes/`
- Personal garage section on `/automotive` — 4 cars with images; data from `app/assets/data/garage.json` + `carImageMap`; software builds section commented out pending layout decision
- Financial dashboard (`/financial`) — Chart.js 4.5.1, KPI tiles, monthly donut, setup costs, tax comparison; admin-gated once RBAC ships
- Custom error page (`app/components/ErrorPage.tsx`) — 400/401/403/404/500/503 with bald icon; replaces default RR7 ErrorBoundary in root.tsx
- `tsconfig.json` — removed deprecated `baseUrl`; fixed `app/styles/app.css` → `~/styles/app.css` in root.tsx
- Data modelling standards established — see `/opt/master/lib/MJDG_DATA_MODELLING.md`, `MJDG_AUTOMOTIVE_SPEC.md`, `MJDG_RBAC_SPEC.md`

> Updated v1.1.1.8
- Brand colors updated to Honda paint codes (R-513, Y-82, B-561P) — dark + light themes
- Page loader component (`app/components/Loader.tsx`) — FD5 car approach animation, fires on login and logout
- Loader CSS appended to app.css (`loader-` prefix, blinker blobs, hazard flash, progress bar)
- Login error message auto-dismisses after 4s or on keypress
- Profile — password field (disabled, "coming soon"), editing mode indicator (gold border + EDITING badge)
- Automotive route stubbed at `/automotive` — authenticated, blank slate
- Catalogue — Automotive tile (`🚗`) added
- Playwright E2E navigation tests — `tests/navigation.spec.ts`, `playwright.config.ts`
- SSL & security hardening deployed — v1.1.1.7

> Updated v1.0.1.6
- Auth (login, register, logout, profile edit) — complete
- MJMDG brand redesign complete — dark/light theme toggle, new CSS design system
- Portfolio page with contact pills, FA icons, Google Maps link
- Favicon set to MJMDG logo, page title "MJMDG"
- Local dev working, v1.0.1.6 deployed to EC2 2026-08-15

> As of v1.0.0.5
- Auth (login, register, logout, profile edit) — complete
- All pages built and styled
- Portfolio page displays resume in synthwave docs format
- Local dev working, deployment next

## What's Deferred
> Updated v1.1.2.8
- Run Playwright tests (need TEST_USERNAME/TEST_PASSWORD + `npx playwright install chromium`)
- Software builds section (WEB-01 → ARC-04) on `/automotive` — commented out pending layout decision
- `/financial` admin gating — currently auth-only; needs `requireAdmin` once RBAC migration ships
- **Resume** — PDF at `app/assets/data/MarkDeGuzman_Resume-2024.pdf`; HTML source at scratchpad `resume.html`; import + both CTA buttons commented out in `portfolio.tsx` pending profile copy finalization
- **"View all projects" link** — `href="#"` placeholder, no destination yet
- `--brand-green` hex pending confirmation against Honda G95P Clover Green Pearl spec sheet

> Updated v1.0.1.6
- Change password on profile page
- Email validation
- Rate limiting on login
- Mobile screen size testing
- Dashboard card grid
- Portfolio page full brand redesign (still uses some old variables)
- Synthwave as a third selectable theme

> As of v1.0.0.5
- Change password on profile page
- Email validation
- Rate limiting on login
- Success message after registration
- Mobile screen size testing

## Deployment (Next)
See `app/docs/TASKS.md` — EC2 + PM2 + nginx, manual terminal-based.
Docker is Phase 3 (after stable EC2 deployment).

## Future Direction
Web3 integration planned — Solidity smart contracts, ethers.js, MetaMask wallet auth.
