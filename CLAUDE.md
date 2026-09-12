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
> Unreleased — not yet a version bump, not deployed
- Pit Lane portfolio hero preview at `/portfolio/dev` (noindex, not linked from nav) — Three.js scroll-driven scene, theme-aware (dark/light), spec-sheet copy per project. See `app/components/PitLaneScene.tsx`, `app/routes/portfolio.dev.tsx`
- Adds `three` 0.186.0 as a dependency — route-level code-split, no impact on the live `/portfolio` bundle
- Decision pending on whether it replaces the current `/portfolio` hero — tracked in `app/docs/BACKLOG.md`

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
> Updated v1.1.1.8
- Run Playwright tests (need TEST_USERNAME/TEST_PASSWORD + `npx playwright install chromium`)
- ThemeToggle.tsx — FA icon prefix type conflict (duplicate @fortawesome/fontawesome-common-types versions), non-blocking
- portfolio.tsx:290 — `e.id` on experience array objects without id field, non-blocking

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
