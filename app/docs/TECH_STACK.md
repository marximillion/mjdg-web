# mjdg-web — Tech Stack

## Frontend
| Technology | Version | Purpose |
|---|---|---|
| React Router | 7.9.2 | SSR framework, routing, loaders/actions |
| Vite | 7.1.7 | Build tool, dev server |
| TypeScript | 5.9.2 | Type safety |
| TailwindCSS | 4.1.13 | Utility-first styling |

## Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | LTS | Server runtime |
| React Router (SSR) | 7.9.2 | Server-side rendering, API actions |
| bcryptjs | 3.0.3 | Password hashing |
| pg | 8.20.0 | PostgreSQL client (connection pool) |

## Database
| Technology | Version | Purpose |
|---|---|---|
| PostgreSQL | 18 | Primary database |
| pgAdmin | — | DB GUI (local dev) |

## Auth
| Technology | Purpose |
|---|---|
| bcryptjs 3.0.3 | Password hashing |
| Cookie session storage | Session management via signed cookies |

## External APIs
| Service | Key | Purpose |
|---|---|---|
| DeepAI | DEEPAI_API_KEY | AI features |

## Infrastructure
| Technology | Purpose |
|---|---|
| AWS EC2 t3.micro | Hosting (ca-west-1, Calgary) |
| nginx | Reverse proxy |
| PM2 | Process manager, auto-restart |
| Certbot | SSL/HTTPS via Let's Encrypt |
| Cloudflare | Domain registrar, DNS, email routing |

## Package Manager
- **Yarn**

## Environment Variables
| Variable | Description |
|---|---|
| DATABASE_URL | PostgreSQL connection string |
| SESSION_SECRET | Cookie session signing key |
| DEEPAI_API_KEY | DeepAI API key |

## Future (Planned)
| Technology | Purpose |
|---|---|
| Solidity | Smart contracts |
| ethers.js / viem | Blockchain interaction |
| Hardhat | Local blockchain dev |
| MetaMask | Wallet-based auth (replaces session auth) |
| Docker | Containerization (Phase 3) |
