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

### AWS Console — Setup
- [ ] Create IAM user with EC2 + key pair permissions (console)
- [ ] Launch EC2 instance — Ubuntu 24.04, t2.micro or t3.small (console)
- [ ] Create and download key pair `.pem` file (console)
- [ ] Configure Security Group: open ports 22 (SSH), 80 (HTTP), 443 (HTTPS) (console)
- [ ] Allocate and associate an Elastic IP to the instance (console)
- [ ] Verify instance is running and note public IP (console)

### Terminal — Server Setup
- [ ] `chmod 400 <key>.pem` and SSH into EC2: `ssh -i <key>.pem ubuntu@<ip>`
- [ ] `sudo apt update && sudo apt upgrade -y`
- [ ] Install Node.js via nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
- [ ] `nvm install --lts && nvm use --lts`
- [ ] `npm install -g yarn pm2`
- [ ] `sudo apt install -y nginx postgresql postgresql-contrib`

### Terminal — Database Setup on EC2
- [ ] `sudo -u postgres psql` — create `mjdg` role and `mjdg-db01` database
- [ ] Set password for `mjdg` user in psql
- [ ] Run `CREATE TABLE` for `User` table (match local schema)
- [ ] Verify connection: `psql -U mjdg -d mjdg-db01 -h localhost`

### Terminal — App Deployment
- [ ] Add GitHub SSH key to EC2 (`ssh-keygen`, add public key to GitHub)
- [ ] `git clone git@github.com:<user>/mjdg-web.git`
- [ ] Create `.env` file on EC2 with `DATABASE_URL` and `SESSION_SECRET`
- [ ] `yarn install && yarn build`
- [ ] Start with PM2: `pm2 start npm --name mjdg-web -- run start`
- [ ] `pm2 startup` and `pm2 save` (auto-restart on reboot)
- [ ] Verify app is running: `pm2 status` and `curl http://localhost:3000`

### Terminal — Nginx + HTTPS
- [ ] Configure nginx reverse proxy: proxy `localhost:3000` on port 80
- [ ] `sudo nginx -t && sudo systemctl reload nginx`
- [ ] Verify HTTP access via Elastic IP in browser
- [ ] Point domain DNS A record to Elastic IP (registrar)
- [ ] Install Certbot: `sudo snap install --classic certbot`
- [ ] `sudo certbot --nginx -d <domain>` — provision SSL cert
- [ ] Verify HTTPS in browser

## 🔄 CI/CD (Phase 2)
- [ ] Add EC2 SSH private key as a GitHub secret
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Auto-deploy on push to `main`

## 🐳 Docker (Phase 3)
- [ ] Write `Dockerfile` (multi-stage: build → production)
- [ ] Write `.dockerignore`
- [ ] Write `docker-compose.yml` (app + postgres services)
- [ ] Test local Docker build and run
- [ ] Push image to ECR (or Docker Hub)
- [ ] Update EC2 deployment to run containerized app
- [ ] Update CI/CD pipeline to build and push Docker image on deploy

## ✅ Pre-Launch Checklist
- [ ] `.env` is in `.gitignore` and not committed
- [ ] Error handling on all auth flows
- [ ] Basic brute-force protection on login
- [ ] PM2 set to auto-restart on reboot (`pm2 startup`)
- [ ] App tested on mobile screen size