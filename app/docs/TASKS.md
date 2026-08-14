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
- [x] Registration form with `action()` (hash + insert user) — schema fix deployed v1.0.0.2
- [x] Profile page (load user data, edit fields, save)
- [ ] Change password on profile page
- [ ] Password recovery feature
- [ ] Forced password reset flow
- [ ] Add phone_number field to User table
- [ ] Email / SMS MFA
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
- [x] Success message after registration — Alert component on `/?registered=true`
- [ ] Redirect to dashboard after registration (optional)
- [x] Add version/release number to app footer
- [ ] Mobile screen size testing

## 🌐 Domain & Infrastructure (Phase 2 — P2_01_DOMAIN_SETUP.md)
- [x] Choose domain — `mjmdg.org` selected (mjdg.com listed for sale on Spaceship)
- [x] Register domain on Cloudflare Registrar (~$12/yr, at-cost)
- [x] Enable auto-renew on domain
- [x] Enable WHOIS privacy
- [x] Set up Cloudflare Email Routing — 6 aliases (general, school, gaming, usa, pro, w) all forwarding to Gmail
- [x] Document email strategy — domain vs real Gmail (see P2_01_DOMAIN_SETUP.md §8)
- [x] Create AWS account using Gmail (not domain email — recovery-critical)
- [x] Enable MFA on AWS root account
- [x] Create IAM user for day-to-day use (EC2Admin — AmazonEC2FullAccess, IAMUserChangePassword)
- [x] Enable MFA on EC2Admin IAM user
- [x] Set billing alarm ($15 budget, 3 alerts — actual 85%, actual 100%, forecasted 100%)
- [x] Delete root user access key

## 🚀 Deployment (Phase 2)

### AWS Console — Setup
- [x] Create IAM user with EC2 + key pair permissions (console) — EC2Admin
- [x] Launch EC2 instance — Ubuntu 24.04, t3.micro, ca-west-1 Calgary (t2.micro not available in ca-west-1)
- [x] Create and download key pair `.pem` file (ED25519, .pem format)
- [x] Configure Security Group: mjmdg group (22/80/443 inbound) + default group (outbound)
- [x] Allocate and associate an Elastic IP to the instance — 40.177.197.204
- [x] Verify instance is running and note public IP — 40.177.197.204

### Terminal — Server Setup
- [x] `chmod 400 /opt/master/keys/MJMDG_MASTER.pem` and SSH into EC2: `ssh -i /opt/master/keys/MJMDG_MASTER.pem ubuntu@40.177.197.204`
- [x] Custom MOTD set at `/etc/motd`
- [x] `sudo apt update && sudo apt upgrade -y`
- [x] Install nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash` then `source ~/.bashrc`
- [x] `nvm install --lts && nvm use --lts`
- [x] `npm install -g yarn pm2` — Yarn 1.22.22, PM2 7.0.3
- [x] `npm config set allow-scripts=yarn --location=user` — allow yarn install scripts permanently
- [x] `sudo apt install -y nginx postgresql postgresql-contrib`

### Terminal — Database Setup on EC2
- [x] `sudo -u postgres psql` — create `mjdg` role and `mjdg-db01` database
- [x] Set password for `mjdg` user in psql
- [x] Granted mjdg full privileges on User table and sequence, changed owner to mjdg
- [x] Run `CREATE TABLE` for `User` table (match local schema)
- [x] Verify connection: `psql -U mjdg -d mjdg-db01 -h localhost` — SSL enabled (TLSv1.3)

### Terminal — App Deployment
- [x] Add GitHub SSH key to EC2 (`ssh-keygen -t ed25519`, add public key to GitHub)
- [x] `git clone git@github.com:marximillion/mjdg-web.git` — cloned to ~/mjdg-web
- [x] Create `.env` file on EC2 with `DATABASE_URL`, `SESSION_SECRET`, `DEEPAI_API_KEY`
- [x] `yarn install && yarn build` — build successful
- [x] Start with PM2: `pm2 start npm --name mjdg-web -- run start`
- [x] `pm2 startup` and `pm2 save` (auto-restart on reboot)
- [x] Verify app is running: `pm2 status` and `curl http://localhost:3000`

### Terminal — Nginx + HTTPS
- [x] Configure nginx reverse proxy: proxy `localhost:3000` on port 80
- [x] `sudo nginx -t && sudo systemctl reload nginx`
- [x] Removed default nginx site — `sudo rm /etc/nginx/sites-enabled/default`
- [x] Verify HTTP access via Elastic IP in browser
- [x] Point domain DNS A records to Elastic IP — mjmdg.org, www.mjmdg.org, staging.mjmdg.org
- [x] Cloudflare SSL set to Flexible (temporary until Certbot installed)
- [ ] Install Certbot: `sudo snap install --classic certbot`
- [ ] `sudo certbot --nginx -d mjmdg.org -d www.mjmdg.org` — provision SSL cert
- [ ] Switch Cloudflare SSL back to Full after Certbot installed
- [ ] Verify HTTPS in browser

## 🧪 Test Automation (Phase 2)
- [ ] Scaffold mjdg-automation project structure
- [ ] Write Playwright BAT tests based on TEST_CASES.md (auth, registration, alerts, dashboard, footer)
- [ ] Write Appium mobile tests (iOS + Android)
- [ ] Integrate test suite into CI/CD pipeline

## 🎨 Redesign (Phase 2)
- [x] Finalise MJMDG mark — 8B chosen (red/gold/blue geometric polygon)
- [x] Export mark assets to `/assets/images/logos/v1.0.1.6/` (white-1.png, white-text-1.png, black-1.png, black-text-1.png)
- [x] Update CSS variables — MJMDG brand palette (--brand-red, --brand-gold, --brand-blue, neutral bg/text tokens)
- [x] Hero section — "Build. Own. Operate." with LAB<3 eyebrow and subtext
- [x] Nav redesign — mark + wordmark logo, clean minimal, brand-red hover underline
- [x] Mobile nav — mark + wordmark logo, clean menu with brand-red logout
- [x] Component updates — buttons (brand-red), inputs (elevated bg), cards (panel bg, subtle borders)
- [x] Update fonts — Archivo (400/500/600) + JetBrains Mono; Black Ops One removed (preserved as commented import)
- [x] Dashboard page — `.page-content` layout, page header
- [x] Catalogue page — `.page-content` layout, page header
- [x] Register page — "Create Account" heading, Easter egg submit button (bald icon when fields filled)
- [ ] Dashboard card grid — stat callouts, module placeholders
- [ ] Portfolio page redesign — still uses old synthwave variables, needs brand update
- [ ] Visual refresh — current design feels too minimal/corporate; consider reintroducing selective synthwave elements for vibrancy (neon accents, subtle gradients, glows)
- [ ] Light mode — implement soon; assets ready (black-1.png / white-1.png), swap CSS variables + logo on toggle

## 🔄 CI/CD (Phase 2)
- [ ] Add EC2 SSH private key as a GitHub secret
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Auto-deploy on push to `main`

## 📣 SNS Integration (Phase 3)
- [ ] Wire AWS SNS into mjdg-web for billing alert notifications
- [ ] Push threshold alerts to app dashboard
- [ ] Explore SMS alerts and Lambda triggers via SNS

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
