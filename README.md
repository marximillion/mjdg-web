# MJMDG Web Application

&copy; MJMDG 2026 — Personal platform and portfolio for Mark De Guzman.

Live: [mjmdg.org](https://mjmdg.org)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Router 7.9.2 (SSR) |
| Build Tool | Vite 7.1.7 |
| Language | TypeScript 5.9.2 |
| Styling | TailwindCSS 4.1.13 |
| Database | PostgreSQL 18 |
| Auth | bcryptjs 3.0.3 + cookie sessions |
| Package Manager | Yarn |
| Process Manager | PM2 |
| Web Server | nginx |
| Hosting | AWS EC2 t3.micro — ca-west-1 (Calgary) |
| DNS / CDN | Cloudflare |

---

## Local Development

### Prerequisites
- Node.js LTS
- Yarn
- PostgreSQL 18
- A `.env` file (see below)

### Environment Variables

Create a `.env` file in the root:

```
DATABASE_URL="postgresql://mjdg:<password>@localhost:5432/mjdg-db01"
SESSION_SECRET="<random-string>"
DEEPAI_API_KEY="<your-key>"
```

### Setup

```bash
yarn install
yarn dev
```

App runs at `https://localhost:5173`.

---

## Pages

| Route | Description | Auth Required |
|---|---|---|
| `/` | Home + login | No |
| `/register` | Registration | No |
| `/dashboard` | Dashboard | Yes |
| `/portfolio` | Resume / portfolio | No |
| `/catalogue` | App launcher | Yes |
| `/profile` | Edit profile | Yes |
| `/logout` | Logout handler | Yes |

---

## Production Build

```bash
yarn build
yarn start
```

---

## Deployment

Deployed on AWS EC2 (Ubuntu 24.04, t3.micro, ca-west-1) with nginx + PM2 + Certbot SSL.

See `app/docs/TASKS.md` for the full deployment roadmap and checklist.

---

## Roadmap

- CI/CD pipeline (GitHub Actions)
- Docker containerization (Phase 3)
- Web3 integration — Solidity, ethers.js, MetaMask wallet auth
