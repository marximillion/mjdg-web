# mjdg-web — Release Roadmap

Versioning: `MAJOR.MINOR.PATCH.BUILD`
- **BUILD** — increments every deployment
- **PATCH** — individual features or fixes within a minor version
- **MINOR** — phase completion, significant feature set delivered
- **MAJOR** — architectural pivot or breaking change

Current: **v1.0.1.6**

---

## v1.0 — Foundation (Complete)
> Delivered: auth system, initial EC2 deployment, MJMDG brand redesign, dark/light theme, Flappy Bird, favicon, portfolio improvements, nav, footer
> See `TASKS.md` for full granular history of v1.0 work.

---

## v1.1 — Operations & Security
> Goal: secure the platform end-to-end, automate deployments, establish logging and observability

### SSL — `v1.1.1` ✅ Complete 2026-08-16
> Encrypts the Cloudflare → EC2 traffic leg, which is currently plaintext under Flexible SSL. Without this, all traffic between Cloudflare's proxy and the server is unencrypted HTTP.

- [x] Install Certbot — enables ACME cert provisioning via Let's Encrypt on the EC2 instance
- [x] Provision cert for `mjmdg.org` and `www.mjmdg.org` — generates and auto-configures TLS cert in nginx
- [x] Switch Cloudflare SSL to Full (Strict) — activates end-to-end encryption, cert validated
- [x] Verify HTTPS in browser — padlock confirmed, cert valid, no redirect loops
- [x] Harden Cloudflare SSL config — TLS 1.2 minimum, TLS 1.3 on, HSTS 6-month max-age, No-Sniff header, Always Use HTTPS → **SSL Labs grade: A+**

### Logging & Build Archiving — `v1.1.2`
> Two connected concerns: logs need to be retained per build for traceability, and builds need to be retained for rollback. Both follow the same archive-per-build pattern and are set up in the same pass.
>
> Log files are auto-generated on first write — the custom app logger only creates a file when a log event fires, meaning no traffic = no file. Infrastructure logs (PM2, nginx) are written on process start regardless.

**Log Setup**
- [ ] Custom app logger writes daily log files (`YYYY-MM-DD.log`) on first write — traffic-triggered, no empty files
- [ ] Local: 30-day rolling retention — files older than 30 days deleted automatically
- [ ] Production: logs archived per build at `/var/log/mjdg-web/archive/v[BUILD]/YYYY-MM-DD.log`
- [ ] On each new build deploy: flush current logs into `archive/v[previous_build]/` before the new build starts
- [ ] EC2: `pm2 flush` — clear accumulated PM2 logs from all prior deploys
- [ ] EC2: Install `pm2-logrotate` — configure daily rotation, consistent with app logger cadence
- [ ] EC2: Verify nginx logrotate is active — confirm daily rotation and file count
- [ ] EC2: Tune PostgreSQL log verbosity — reduce noise from default verbose logging

**Build Archiving**
- [ ] Create `/var/www/archive/` on EC2 — sibling directory to the active `mjdg-web/` build
- [ ] Each deploy saves built output as `/var/www/archive/v[BUILD].tar.gz` before swapping the active build — enables rollback to any previous build
- [ ] Retain last 2 builds only (current + previous) — deploy script prunes any older archives after saving new one; keeps rollback available without accumulating disk usage on the 8GB root volume
- [ ] Rollback procedure: extract `archive/v[BUILD].tar.gz` → `mjdg-web/` + `pm2 restart`
- [ ] CI/CD automates tar.gz creation, archive copy, and pruning on every deploy (see v1.1.3)

### CI/CD + Version Injection — `v1.1.3`
> Manual deployments (git pull, yarn build, pm2 restart) are error-prone and slow. Automating deploy on push to main reduces friction and eliminates deployment as a manual step. Version injection removes the need to manually update `.env` on every release.

- [ ] Add EC2 SSH private key as GitHub secret — required for the Actions runner to SSH into EC2
- [ ] Create `.github/workflows/deploy.yml` — triggers on push to `main`: SSH into EC2, pull, build, restart PM2
- [ ] Auto-inject `VERSION` from git tag on deploy — replaces manual `.env` update each release

### Observability — `v1.1.4`
> No way to confirm what version is live without checking PM2 or the repo. `/version.html` gives a quick sanity check during deploy or QA. `dev:remote` removes the two-command setup for local-to-EC2 DB access.

- [ ] `/version.html` — public route that renders the current `VERSION` env var; useful post-deploy QA check
- [ ] `scripts/dev-remote.sh` — opens SSH tunnel to EC2 on start, kills tunnel on exit via `trap`
- [ ] Add `dev:remote` to `package.json` scripts — `bash scripts/dev-remote.sh` (replaces manual tunnel setup)

---

## v1.2 — API & Data Layer
> Goal: clean separation of UI, API, and DB — no direct DB access from mjdg-web; each service owns its own logs

### mjdg-api Scaffold — `v1.2.1`
> Before migrating any routes, the API service needs to exist, be reachable, and be stable on EC2. This ships the skeleton so the next patch can migrate routes into it without infra work blocking.

- [ ] Scaffold `mjdg-api` repo — Express + TypeScript, separate GitHub repo
- [ ] Set up PM2 process on EC2 at `:3001` — runs alongside mjdg-web on the same instance
- [ ] Configure nginx to route `api.mjmdg.org` → `localhost:3001` — makes the API publicly accessible
- [ ] Add Certbot cert for `api.mjmdg.org` — SSL on the API subdomain

### DB Route Migration — `v1.2.2`
> mjdg-web currently calls PostgreSQL directly. This violates the UI/API/DB separation and means DB credentials live in the frontend process. Moving all DB calls to mjdg-api makes the data layer swappable and removes DB access from the UI entirely.

- [ ] Migrate auth routes — login, register, logout, profile read/update to mjdg-api
- [ ] Migrate game routes — score submit, leaderboard fetch to mjdg-api
- [ ] mjdg-web refactor — remove `pg` pool import and all direct query calls; replace with `fetch` to mjdg-api
- [ ] Add internal logger to mjdg-web — logs UI events + outbound API calls; environment-aware via `NODE_ENV`
- [ ] Add internal logger to mjdg-api — logs inbound requests + DB call results; environment-aware via `NODE_ENV`

### Shared Database — `v1.2.3`
> Local dev currently uses a local PostgreSQL instance, which drifts from production schema over time. Connecting local dev to a EC2-hosted dev DB via SSH tunnel means local and staging always reflect real data structure without exposing the DB port publicly.

- [ ] `pg_dump` prod DB on EC2 — save as snapshot before creating dev DB
- [ ] Create `mjdg-db01-dev` on same EC2 PostgreSQL instance from snapshot — dev DB mirrors prod schema
- [ ] Add `dev:remote` DB variant to `scripts/dev-remote.sh` — tunnel closes when `yarn dev` exits
- [ ] Update local `.env` `DATABASE_URL` → EC2 dev DB via tunnel (`localhost:5432` after tunnel open)
- [ ] Remove local PostgreSQL dependency — nothing should require a local DB running

### DB Migration System — `v1.2.4`
> No migration system means schema changes are applied manually and inconsistently across environments. Numbered SQL files with a runner script make schema history auditable and deployable via CI/CD.

- [ ] Define numbered SQL migration file convention — `migrations/001_initial_schema.sql`
- [ ] Move schema ownership to `mjdg-db` repo — single source of truth for all table definitions
- [ ] Write migration runner script — applies unapplied migrations in order
- [ ] Hook migration runner into CI/CD deploy step — schema and app ship together

### Staging Environment — `v1.2.5`
> No staging means every release goes straight to prod with no pre-deploy verification. A staging environment on the same EC2 using the dev DB gives a safe place to test deploys before they go live.

- [ ] Configure separate nginx server block for `staging.mjmdg.org`
- [ ] Set up second PM2 process for staging build — runs separately from prod
- [ ] Staging `.env` points to `mjdg-db01-dev` — isolated from prod data
- [ ] Staging deploy triggered separately from prod via CI/CD (manual dispatch or separate job)

### Auth Security — `v1.2.6`
> These are security items, not features — they belong in v1.2 alongside the API layer rather than lumped with feature work in v1.3. Rate limiting and input validation are the two most exploitable gaps in the current auth flow.

- [ ] Session expiry + idle timeout — add `maxAge` to cookie session config; prevents stale sessions on shared or stolen devices
- [ ] Input validation on registration and login forms — email format, minimum password length, username character rules; return field-level errors
- [ ] Rate limiting / brute force protection on login — block or slow repeated failed attempts per IP
- [ ] Email validation — verify email format before user record is created

### BAT Suite — `v1.2.7`
> CI/CD (v1.1.3) automates deploys but has no gate. Without a test suite, every push to main ships untested code. The BAT suite must exist and pass before any deploy proceeds. Stored in `mjdg-automation` repo.

- [ ] Scaffold `mjdg-automation` project structure + `conftest.py`
- [ ] Playwright BAT — 10 must-pass tests on every deploy:
  - [ ] Home page returns 200
  - [ ] Page title is "MJMDG"
  - [ ] Login with valid credentials → lands on dashboard
  - [ ] Login with invalid credentials → shows error
  - [ ] Logout → session destroyed, redirects to home
  - [ ] `/dashboard` unauthenticated → redirects to home
  - [ ] `/profile` unauthenticated → redirects to home
  - [ ] `/game-flappy-bird` unauthenticated → redirects to home
  - [ ] Registration with valid data → success message shown
  - [ ] Footer displays version matching deployed build
- [ ] Integrate Playwright BAT into CI/CD pipeline — deploy blocked if any test fails
- [ ] Phase 2 addition (post mjdg-api): `GET /health` on mjdg-api returns 200

---

## v1.3 — Feature Expansion
> Goal: deliver platform features, harden auth, establish test coverage

### Flappy Me Core — `v1.3.1`
> Rebrand game to Flappy Me and allow users to use their selfie as the bird. This personalises the game and anchors it to the platform identity. Score table is a prerequisite for leaderboard in the next patch.

- [ ] Rename game — "Flappy Bird" → "Flappy Me" across route, page title, catalogue tile, and all references
- [ ] Selfie capture — `getUserMedia` API, camera UI on game page
- [ ] Store selfie per user — TBD: DB blob vs file path
- [ ] Clip selfie to circle, render as bird sprite — fallback to bald icon if not set
- [ ] Add `Score` table — `id`, `user_id`, `score`, `created_at` with FK to `User.id`
- [ ] Replace `localStorage` high score with DB personal best

### Flappy Me Leaderboard — `v1.3.2`
> Gives the game a social/competitive layer. Ships as a separate patch from core because the API routes and leaderboard UI can be built and deployed independently of the selfie feature.

- [ ] `POST /api/flappy-score` — submit score on game over (authenticated)
- [ ] `GET /api/flappy-leaderboard` — return top N scores with username + selfie
- [ ] Leaderboard UI on `/game-flappy-me` — overlay or side panel
- [ ] Highlight current user's entry in leaderboard

### Dashboard — `v1.3.3`
> The dashboard page currently renders with no content. This patch adds the card grid skeleton and stat callouts to give authenticated users a landing page worth arriving at.

- [ ] Dashboard card grid — stat callouts, module placeholders

### Feedback — `v1.3.4`
> No mechanism exists for users or visitors to submit feedback on the platform. Feedback from real users (including friends and family during early growth) is the primary design and product signal at this stage. Keeps feedback structured and traceable rather than informal.

- [ ] Feedback form — accessible to authenticated users and public visitors
- [ ] Feedback stored in DB with timestamp, user (if authenticated), and message
- [ ] Admin view of submitted feedback (dashboard or separate route)
- [ ] Optional: email notification to admin on new submission

### Visual — `v1.3.5`
> Portfolio still uses old synthwave CSS variables (DEF-002). Synthwave theme is a third selectable option requested by the user — ships together since both touch the theme/token layer.

- [ ] Portfolio redesign — replace remaining `var(--cyan)` and synthwave variable references with brand tokens (resolves DEF-002)
- [ ] Synthwave theme — third selectable theme: neon accents, gradients, glows; added to theme toggle cycle

### Auth Hardening — `v1.3.6`
> Core auth is functional but has no account recovery, no MFA, and no rate limiting. This patch closes the most common auth attack vectors and adds essential account management flows.

- [ ] Change password on profile page
- [ ] Password recovery + forced reset flow
- [ ] Add `phone_number` field to User table
- [ ] Session expiry + idle timeout
- [ ] Input validation on registration and login forms
- [ ] Rate limiting / brute force protection on login
- [ ] Email validation
- [ ] Email / SMS MFA

### Test Automation — `v1.3.7`
> No automated tests means regressions are caught manually or not at all. Playwright BAT suite covers the critical paths. Appium handles mobile screen coverage. Both integrate into CI/CD so tests run on every deploy.

- [ ] Scaffold `mjdg-automation` project structure + `conftest.py`
- [ ] Playwright BAT suite — auth, registration, navigation, protected routes, footer version check
- [ ] Integrate Playwright into CI/CD pipeline — tests run before deploy proceeds
- [ ] Appium mobile tests — iOS + Android
- [ ] Mobile screen size testing

---

## v1.4 — Admin & System Health
> Goal: give the operator a single view into platform health — no more SSHing in to check disk or PM2 status. All system health data visible from the dashboard without touching the server.

### Admin Dashboard — `v1.4.1`
> No visibility into system health without SSHing into EC2 or checking Cloudflare manually. An admin-only dashboard route surfaces the key operational metrics in one place. Prerequisite: mjdg-api exists (v1.2.1) so health endpoints can be served separately from the UI.

- [ ] Admin-only route — `/admin` protected behind role check; only accessible to admin users
- [ ] SSL cert status panel — cert expiry date, days remaining, issuer, last renewed; sourced from Let's Encrypt metadata
- [ ] SSL Labs grade history — manually logged grade + date tested; tracks grade regressions over time
- [ ] Disk usage panel — root filesystem % used, available space; polled from EC2 via mjdg-api health endpoint
- [ ] PM2 process health — process name, status (online/stopped/errored), uptime, restart count, memory usage
- [ ] System uptime — EC2 instance uptime via `/proc/uptime` or equivalent
- [ ] Build info panel — current deployed version, build timestamp, git commit hash

### Admin Alerts — `v1.4.2`
> Passive dashboard requires the admin to remember to check it. Alerts push critical thresholds to the operator without requiring a manual check.

- [ ] Disk usage alert — notify when root filesystem exceeds 70% (current threshold from MJDG_DEPLOYMENT.md)
- [ ] Cert expiry alert — notify when SSL cert is within 14 days of expiry (safety net on top of Certbot auto-renewal)
- [ ] PM2 process down alert — notify when mjdg-web or mjdg-api process is not in `online` state
- [ ] Delivery method TBD — email (v1 simple), SNS push (v2.0.2 when SNS is wired)

---

## v2.0 — Platform Evolution
> Goal: containerize, scale, and extend the platform into Web3

### Infrastructure — `v2.0.0`
> EC2-hosted PostgreSQL is a single point of failure with no managed backups. RDS offloads DB ops (backups, patching, failover) to AWS and removes the DB from the app server entirely. Separating mjdg-api onto its own instance means the two services can scale, restart, and deploy independently — a runaway API process can no longer starve mjdg-web. Trigger: sustained CPU or memory above 70% on the shared instance, or a foreseeable traffic spike from a specific feature.

- [ ] Create RDS PostgreSQL instance (db.t3.micro, ca-west-1) from EC2 snapshot
- [ ] Migrate prod DB from EC2 → RDS prod instance
- [ ] Update all `DATABASE_URL` env vars to RDS endpoints
- [ ] Remove PostgreSQL from EC2
- [ ] Provision dedicated EC2 instance for mjdg-api — separates API and UI into independently scalable servers
- [ ] Update nginx on mjdg-web EC2 to proxy `api.mjmdg.org` → mjdg-api EC2 instance
- [ ] Update PM2 and CI/CD config for independent deploys per service

### Containerization — `v2.0.1`
> Docker makes deployments reproducible and environment-agnostic. Container images eliminate "works on my machine" issues and are a prerequisite for any future orchestration (ECS, EKS).

- [ ] `Dockerfile` — multi-stage build → production image
- [ ] `.dockerignore`
- [ ] `docker-compose.yml` — app + postgres services for local
- [ ] Test local Docker build and run
- [ ] Push image to ECR (or Docker Hub)
- [ ] Update EC2 deployment to run containerized app
- [ ] Update CI/CD to build and push Docker image on deploy

### AWS SNS — `v2.0.2`
> Billing alerts currently only send emails. SNS wires push notifications and SMS into the platform and sets up the Lambda trigger pattern needed for future event-driven features.

- [ ] Wire AWS SNS for billing alert notifications
- [ ] Push threshold alerts to app dashboard
- [ ] SMS alerts + Lambda triggers via SNS

### Web3 / Blockchain — `v2.0.3`
> Long-term platform direction — wallet-based auth and on-chain features. Ships last because it depends on the API layer (v1.2) and a stable containerized infra (v2.0.1).

- [ ] Solidity — smart contract fundamentals
- [ ] ethers.js / viem — blockchain interaction from Node.js
- [ ] Hardhat — local blockchain dev environment
- [ ] MetaMask wallet connect — replace or augment session auth
- [ ] First smart contract deployed to testnet
- [ ] dApp frontend integration with React + ethers.js

### Architecture — `v2.0.4`
> Monorepo is only warranted once a second child app (mjdg-api or a new app) is mature enough that shared tooling pays off. Premature adoption adds overhead with no benefit.

- [ ] Monorepo migration — Turborepo + Yarn workspaces (trigger: second child app ready)

---

## Pre-Launch Checklist
- [ ] `.env` is in `.gitignore` and not committed
- [ ] Error handling on all auth flows
- [ ] Basic brute-force protection on login
- [ ] PM2 set to auto-restart on reboot (`pm2 startup`)
- [ ] App tested on mobile screen size
- [ ] Privacy policy and terms of service pages
