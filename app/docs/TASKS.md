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

## 🧪 Testing

### Smoke Tests — Pre-Auth
Quick sanity checks to verify critical UI elements are present on public screens.

#### Home Screen (`/`)
- [ ] Navigation bar is visible
- [ ] Nav link: Home is present
- [ ] Nav link: Portfolio is present
- [ ] Nav link: Register is present
- [ ] LAB3 logo banner is present
- [ ] "Welcome" heading is present
- [ ] Username label is present
- [ ] Username input field is present
- [ ] Password label is present
- [ ] Password input field is present
- [ ] Password show/hide toggle button is present
- [ ] Submit button is present
- [ ] Footer copyright text is present

#### Portfolio Screen (`/portfolio`)
- [ ] Navigation bar is visible
- [ ] Nav link: Home is present
- [ ] Nav link: Portfolio is present
- [ ] Nav link: Register is present
- [ ] "Mark De Guzman" heading is present
- [ ] Profile section is present
- [ ] Work Experience section is present
- [ ] Footer copyright text is present

#### Register Screen (`/register`)
- [ ] Navigation bar is visible
- [ ] Nav link: Home is present
- [ ] Nav link: Portfolio is present
- [ ] Nav link: Register is present
- [ ] Username field is present
- [ ] Password field is present
- [ ] Register button is present
- [ ] Footer copyright text is present

---

### Build Acceptance Tests (BAT) — Pre-Auth
Thorough verification that all UI elements are present and correctly labelled on public screens.

#### Home Screen (`/`)
- [ ] Page title is "LAB<3 Development"
- [ ] Navigation bar is visible
- [ ] Nav link: "Home" is present and links to `/`
- [ ] Nav link: "Portfolio" is present and links to `/portfolio`
- [ ] Nav link: "Register" is present, links to `/register`, and is pushed to the far right
- [ ] LAB3 logo banner image is rendered
- [ ] "Welcome" heading (h1) is present
- [ ] Login form is present with method POST
- [ ] Username label text reads "Username"
- [ ] Username input is type `text`, name `username`, placeholder "Enter username", and is required
- [ ] Password label text reads "Password"
- [ ] Password input is type `password`, name `password`, placeholder "Enter password", and is required
- [ ] Password show/hide toggle button is present inside the field wrapper
- [ ] Submit button text reads "Submit"
- [ ] Submit button is disabled when both username and password are empty
- [ ] Footer text reads "© MJDG 2026"

#### Portfolio Screen (`/portfolio`)
- [ ] Page title is "Portfolio | LAB<3"
- [ ] Navigation bar is visible
- [ ] Nav link: "Home" is present and links to `/`
- [ ] Nav link: "Portfolio" is present and links to `/portfolio`
- [ ] Nav link: "Register" is present and links to `/register`
- [ ] "Mark De Guzman" heading (h1) is present
- [ ] Phone number "(587) 224-2306" is present as a link
- [ ] Email "mark.deguzman960@gmail.com" is present as a link
- [ ] LinkedIn "linkedin.com/in/mark-de-guzman" is present as an external link
- [ ] Location "Calgary, AB" is present
- [ ] Section heading "Profile" is present
- [ ] Skills chips are rendered (e.g. "JavaScript", "TypeScript", "Python")
- [ ] Section heading "Education" is present
- [ ] "University of Calgary" is present
- [ ] "Bachelor of Science in Geomatics Engineering" is present
- [ ] Section heading "Work Experience" is present
- [ ] "Homewood Health" (DevOps Analyst) entry is present
- [ ] "Homewood Health" (Junior Mobile Developer) entry is present
- [ ] "Stantec" entry is present
- [ ] "McElhanney" entry is present
- [ ] Section heading "Projects & Technical Clubs" is present
- [ ] "Capstone Design Project" entry is present
- [ ] "AWS DeepRacer Club" entry is present
- [ ] Section heading "Certifications" is present
- [ ] "AWS Certified Cloud Practitioner" entry is present
- [ ] Section heading "Extracurricular" is present
- [ ] Footer text reads "© MJDG 2026"

#### Register Screen (`/register`)
- [ ] Page title is "Register | LAB<3"
- [ ] Navigation bar is visible
- [ ] Nav link: "Home" is present and links to `/`
- [ ] Nav link: "Portfolio" is present and links to `/portfolio`
- [ ] Nav link: "Register" is present and links to `/register`
- [ ] Registration form is present with method POST
- [ ] Username label text reads "Username*"
- [ ] Username input is type `text`, name `username`, placeholder "Enter username", and is required
- [ ] Password label text reads "Password*"
- [ ] Password input is type `password`, name `password`, placeholder "Enter password", and is required
- [ ] Password show/hide toggle button is present inside the field wrapper
- [ ] Email label text reads "Email"
- [ ] Email input is type `email`, name `email`, placeholder "Enter email"
- [ ] First Name label text reads "First Name"
- [ ] First Name input is type `text`, name `first_name`, placeholder "Enter first name"
- [ ] Last Name label text reads "Last Name"
- [ ] Last Name input is type `text`, name `last_name`, placeholder "Enter last name"
- [ ] Register button is present and reads "Register" when username and password are empty
- [ ] Footer text reads "© MJDG 2026"

---

## ✅ Pre-Launch Checklist
- [ ] `.env` is in `.gitignore` and not committed
- [ ] Error handling on all auth flows
- [ ] Basic brute-force protection on login
- [ ] PM2 set to auto-restart on reboot (`pm2 startup`)
- [ ] App tested on mobile screen size