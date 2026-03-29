# mjdg-web — Launch Roadmap

Suggested Order of Attack

[] Set up RDS or Supabase, create users table

[x] Install Prisma, connect to DB

[x] Wire up your login form with a Route action()

[x] Add bcrypt + session handling

[x] Test locally end to end

[x] Launch EC2, deploy manually first

[x] Add GitHub Action for auto-deploy

## 🗄️ Database Setup
- [ ] Choose database provider (AWS RDS or Supabase)
- [ ] Create PostgreSQL instance
- [ ] Create `users` table (`id`, `email`, `password_hash`, `created_at`)
- [ ] Whitelist EC2 IP in DB security group / firewall rules

## 🔧 Backend / Auth
- [ ] Install Prisma and initialize (`npx prisma init`)
- [ ] Configure `DATABASE_URL` in `.env`
- [ ] Define `User` model in `schema.prisma`
- [ ] Run first migration (`npx prisma migrate dev`)
- [ ] Install `bcrypt` for password hashing
- [ ] Wire login form to a React Router `action()`
- [ ] Hash password on register, compare on login
- [ ] Set up session storage (`createCookieSessionStorage`)
- [ ] Protect routes that require authentication
- [ ] Test login flow locally end to end

## 🚀 EC2 Setup
- [ ] Launch EC2 instance (Ubuntu, t3.micro)
- [ ] Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS) in security group
- [ ] SSH into instance and install Node.js + yarn
- [ ] Install PM2 globally (`npm install -g pm2`)
- [ ] Install nginx
- [ ] Clone repo from GitHub onto EC2
- [ ] Add `.env` file with production secrets on EC2
- [ ] Run `yarn install` and `yarn build`
- [ ] Start app with PM2 (`pm2 start`)
- [ ] Configure nginx as reverse proxy to app port
- [ ] Test app loads over HTTP

## 🌐 Domain & HTTPS (optional but recommended)
- [ ] Point domain DNS to EC2 public IP
- [ ] Install Certbot (`sudo apt install certbot`)
- [ ] Generate SSL certificate (`sudo certbot --nginx`)
- [ ] Confirm app loads over HTTPS

## 🔄 CI/CD (GitHub Actions)
- [ ] Add EC2 SSH private key as a GitHub secret
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Configure action to trigger on push to `main`
- [ ] Action: SSH into EC2, pull latest, rebuild, restart PM2
- [ ] Test by pushing a change and confirming auto-deploy

## ✅ Pre-Launch Checklist
- [ ] `.env` secrets are not committed to GitHub
- [ ] `.gitignore` includes `.env`, `node_modules`, `.react-router`
- [ ] Error handling on login (wrong password, user not found)
- [ ] Basic rate limiting or brute-force protection on login
- [ ] App tested on mobile screen size
- [ ] PM2 set to auto-restart on reboot (`pm2 startup`)