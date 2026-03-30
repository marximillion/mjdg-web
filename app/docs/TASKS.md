# mjdg-web — Launch Roadmap

## 🗄️ Database Setup
- [x] Install PostgreSQL 18 locally
- [x] Create database `mjdg-db01`
- [x] Create `mjdg` user (superuser)
- [x] Set up pgAdmin for DB GUI
- [x] Create `User` table
- [x] Add `username` column (unique)
- [x] Add `hashed_password` column
- [x] Rename `firstName` → `first_name`, `lastName` → `last_name`
- [x] Set correct nullable/not null constraints
- [x] Create seed script (`app/db/seed.ts`)

## 🔧 Backend / Auth
- [x] Install `pg` and `@types/pg`
- [x] Create `app/db/db.server.ts` (connection pool)
- [x] Install `bcryptjs` for password hashing
- [x] Wire login form to React Router `action()`
- [x] Compare hashed password on login
- [x] Set up session storage (`createCookieSessionStorage`)
- [x] Set session on successful login
- [x] Protect authenticated routes (redirect to `/` if not logged in)
- [x] Redirect logged in users away from public routes
- [x] Wire up logout (destroy session, redirect to `/`)
- [x] Registration form with `action()` (hash + insert user)
- [x] Profile page (load user data, edit fields, save)
- [ ] Change password on profile page
- [ ] Email validation
- [ ] Rate limiting / brute force protection on login

## 🎨 Frontend / UI
- [x] Home page with login form
- [x] Registration page (`/register`)
- [x] Dashboard page (`/dashboard`)
- [x] Portfolio page (`/portfolio`)
- [x] Catalogue page (`/catalogue`)
- [x] Profile page (`/profile`)
- [x] `PageLayout` base template component
- [x] `NavBar` component with active state
- [x] Nav shows different links when logged in vs logged out
- [x] Logout button styled to match nav links
- [x] Register link pushed to far right when logged out
- [x] Profile button in authenticated nav
- [x] Logout button pushed to far right in authenticated nav
- [x] Show/hide password toggle on registration form
- [x] Disabled button until form fields filled
- [x] Error display on login and registration forms
- [x] Spawn animation easter egg on home page
- [ ] Success message after registration
- [ ] Redirect to dashboard after registration (optional)
- [ ] Mobile screen size testing

## 🚀 Deployment (Phase 2)
- [ ] Launch EC2 instance (Ubuntu)
- [ ] Install Node.js, yarn, PM2, nginx on EC2
- [ ] Clone repo from GitHub onto EC2
- [ ] Add `.env` file with production secrets on EC2
- [ ] Run `yarn install` and `yarn build`
- [ ] Start app with PM2
- [ ] Configure nginx as reverse proxy
- [ ] Set up PostgreSQL on EC2
- [ ] Add domain + HTTPS via Certbot

## 🔄 CI/CD (Phase 2)
- [ ] Add EC2 SSH private key as a GitHub secret
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Auto-deploy on push to `main`

## ✅ Pre-Launch Checklist
- [ ] `.env` is in `.gitignore` and not committed
- [ ] Error handling on all auth flows
- [ ] Basic brute-force protection on login
- [ ] PM2 set to auto-restart on reboot (`pm2 startup`)
- [ ] App tested on mobile screen size