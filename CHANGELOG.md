# Changelog

All notable changes to mjdg-web are documented here.
Format: [Semantic Versioning](https://semver.org/) — MAJOR.MINOR.PATCH

---

## [v1.0.0] — 2026-08-04

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
