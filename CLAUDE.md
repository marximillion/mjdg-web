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
├── components/    # PageLayout, NavigationBar
├── db/            # db.server.ts (pool), session.server.ts, seed.ts
├── styles/        # app.css (synthwave theme, CSS variables)
├── assets/        # images, data
└── docs/          # TASKS.md (launch roadmap)
```

## CSS Theme Variables
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

## Auth Flow
- Login: `app/routes/home.tsx` → `action()` → bcrypt compare → set session cookie
- Logout: `app/routes/logout.ts` → destroy session → redirect `/`
- Protected routes: `loader()` checks session, redirects to `/` if not authenticated
- Registration: `app/routes/register.tsx` → hash password → insert user

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
- Auth (login, register, logout, profile edit) — complete
- All pages built and styled
- Portfolio page displays Mark's resume in synthwave docs format
- Local dev working, deployment next

## What's Deferred
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
