# mjdg-web — Launch Roadmap

## 🗄️ Database Setup
- [x] Install PostgreSQL 18 locally
- [x] Create database `mjdg`
- [x] Create user `mjdg_user` with password
- [x] Grant privileges to `mjdg_user`
- [x] Install Prisma and initialize (`npx prisma init`)
- [x] Configure `DATABASE_URL` in `.env`
- [x] Define `User` model in `schema.prisma`
- [x] Run first migration (`npx prisma migrate dev`)

## 🔧 Backend / Auth
- [ ] Install `bcrypt` for password hashing
- [ ] Wire login form to a React Router `action()`
- [ ] Compare hashed password on login
- [ ] Set up session storage (`createCookieSessionStorage`)
- [ ] Protect routes that require authentication
- [ ] Test login flow locally end to end

## 🎨 Frontend
- [ ] Fix login form (button inside form, correct field names)
- [ ] Add error display (wrong password, user not found)
- [ ] Test on mobile screen size

## 🚀 Deployment (Phase 2)
- [ ] Launch EC2 instance (Ubuntu)
- [ ] Install Node.js, yarn, PM2, nginx on EC2
- [ ] Clone repo from GitHub onto EC2
- [ ] Add `.env` file with production secrets on EC2
- [ ] Run `yarn install` and `yarn build`
- [ ] Start app with PM2
- [ ] Configure nginx as reverse proxy
- [ ] Set up PostgreSQL on EC2 (or migrate to RDS)
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