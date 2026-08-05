# Domain Setup — MJDG Platform

> Reference document covering domain registration, email setup, DNS, AWS integration, and ongoing maintenance.

---

## 1. Choosing a Domain

### Recommended Options (mjdg.com is taken/listed for sale)
| Domain | Cost/yr | Notes |
|---|---|---|
| `mjdg.dev` | ~$12 | Best pick — dev-focused, clean, industry standard |
| `mjdg.ca` | ~$15 | Canadian identity, good for local presence |
| `mjdg.io` | ~$40 | Popular in tech, pricier |
| `getmjdg.com` | ~$12 | Fallback if .com is important |

### Where to Register
| Registrar | Pros | Cons |
|---|---|---|
| **Cloudflare Registrar** | At-cost (no markup), free DNS, free email routing | Must transfer DNS to Cloudflare |
| **Namecheap** | Cheap, good UI, free WhoisGuard | Slightly higher renewal prices |
| **AWS Route 53** | Native AWS integration | Most expensive (~$13-15/yr + DNS queries) |

**Recommendation:** Register on **Cloudflare** — you get the domain at cost, DNS management, and free email routing all in one place.

---

## 2. Registration Requirements

### What You Need
- Valid email address (use your current Gmail until domain email is set up)
- Credit card or PayPal
- Contact info for WHOIS record (name, address, phone)

### Privacy Protection
Most registrars offer **WHOIS privacy / domain privacy** — hides your personal contact info from public WHOIS lookups. Enable this. It's free on Cloudflare and Namecheap.

### Account to Register Under
Use a personal email you control long-term (e.g., marximillion.w@gmail.com). Do NOT use a work email — you need to own the account permanently.

---

## 3. DNS Setup

DNS (Domain Name System) maps your domain to servers. After registration, you'll configure records in your registrar's DNS dashboard.

### Common Record Types
| Type | Purpose | Example |
|---|---|---|
| `A` | Points domain to an IP address | `mjdg.dev` → `1.2.3.4` (your EC2 IP) |
| `CNAME` | Alias to another domain | `www` → `mjdg.dev` |
| `MX` | Routes email to a mail server | Points to Zoho/Google/Cloudflare mail |
| `TXT` | Verification + email auth (SPF, DKIM) | Proves domain ownership |

### Minimum DNS Records for mjdg-web on EC2
```
A     @         <your EC2 Elastic IP>
A     www       <your EC2 Elastic IP>
```

### Propagation
DNS changes take **up to 48 hours** to propagate globally. Usually faster (15–30 min with Cloudflare DNS).

---

## 4. Email Setup

### Option A — Cloudflare Email Routing (Free, Recommended to Start)
Forwards `anything@mjdg.dev` to your existing Gmail. No new inbox.

**Steps:**
1. Register domain on Cloudflare (or transfer DNS to Cloudflare)
2. Go to **Cloudflare Dashboard → Email → Email Routing**
3. Add a routing rule: `mark@mjdg.dev` → `marximillion.w@gmail.com`
4. Cloudflare adds the required MX and TXT records automatically
5. Done — emails sent to `mark@mjdg.dev` land in your Gmail

**Limitation:** You receive at your domain but reply from Gmail (unless you configure Gmail's "Send mail as" feature).

### Option B — Zoho Mail (Free Tier, Full Mailbox)
A real mailbox at `mark@mjdg.dev`. Free for up to 5 users.

**Steps:**
1. Sign up at zoho.com/mail → choose free plan
2. Add your domain
3. Zoho gives you DNS records to add (MX, TXT for SPF/DKIM)
4. Add those records in your registrar's DNS dashboard
5. Create mailbox: `mark@mjdg.dev`

### Option C — Google Workspace ($6/month)
Gmail interface with your domain. Best experience, not free.

---

## 5. Connecting Domain to AWS

### Step 1 — Register or Transfer to Route 53 (Optional)
If you want everything in AWS:
- You can register the domain directly in Route 53
- Or transfer an existing domain from Namecheap/Cloudflare to Route 53
- Route 53 hosted zone: ~$0.50/month

### Step 2 — Point Domain to EC2
In your DNS dashboard (Cloudflare or Route 53):
```
A    @      <Elastic IP>
A    www    <Elastic IP>
```
Use an **Elastic IP** (static IP) on EC2 — regular EC2 IPs change on restart.

### Step 3 — SSL Certificate (HTTPS)
Use **Certbot** (free Let's Encrypt) on the EC2 server:
```bash
sudo certbot --nginx -d mjdg.dev -d www.mjdg.dev
```
Certbot auto-configures nginx and renews the cert every 90 days.

### Subdomains (Future)
| Subdomain | Purpose |
|---|---|
| `mjdg.dev` | Main web app |
| `www.mjdg.dev` | Redirect to apex |
| `api.mjdg.dev` | API (if separated) |
| `app.mjdg.dev` | Web app (if marketing site at apex) |
| `mail.mjdg.dev` | Mail server reference |

---

## 6. Using Your Domain for AWS Account

When creating or migrating your AWS account:
- Use `mark@mjdg.dev` (or any alias) as the root account email
- This ties your AWS identity to a domain you own permanently
- You're not dependent on an employer email or personal Gmail

**Best practice:** Create a dedicated alias like `aws@mjdg.dev` so:
- AWS root account email is separate from day-to-day email
- Easy to filter and identify AWS billing/alerts

---

## 7. Maintenance

### Annual
- **Renew the domain** — set auto-renew on. Losing a domain is catastrophic if you have services running on it.
- **Review DNS records** — remove stale records when servers change
- **Rotate domain email passwords** if using Zoho/Google Workspace

### Every 90 Days (Automatic)
- **SSL cert renewal** — Certbot auto-renews. Verify with:
  ```bash
  sudo certbot renew --dry-run
  ```

### When EC2 IP Changes
- Update the `A` record in DNS to the new Elastic IP
- Always use Elastic IP to avoid this (static, doesn't change on restart)

### Monitoring
- Set a calendar reminder 30 days before domain expiry
- Enable **expiry email alerts** in your registrar dashboard
- Monitor SSL expiry: Cloudflare or UptimeRobot can alert on cert issues

---

## 8. Email Strategy — Domain vs Real Email

### Use your real Gmail for
- **AWS root account** — recovery is too critical to risk on a domain you might change
- **Billing / financial accounts** — banks, Stripe, anything money-related
- **Domain registrar (Cloudflare)** — if the domain expires, Cloudflare can't notify you through that same domain
- **Anything where losing access = serious consequence**

### Use your domain email (`@mjdg.dev`) for
- **Public-facing identity** — contact forms, portfolio, LinkedIn
- **App-specific accounts** — e.g. `hello@mjdg.dev` as a support/contact address
- **Professional outreach** — looks more credible than Gmail when presenting yourself as a developer/platform
- **Non-critical SaaS tools, newsletters, signups**

### The simple rule
> If losing that email = losing the account permanently → use Gmail.
> If it's about identity or branding → use the domain email.

### Current account mapping
| Account | Email to Use | Reason |
|---|---|---|
| AWS root | Gmail | Recovery-critical |
| GitHub (marximillion) | Gmail | Already set, recovery-critical |
| Cloudflare (registrar) | Gmail | Can't use domain it manages |
| Portfolio contact | `mark@mjdg.dev` | Public-facing identity |
| Professional outreach | `mark@mjdg.dev` | Branding |
| Non-critical SaaS / tools | `mark@mjdg.dev` | Keeps Gmail clean |

### If you switch domains later
1. Register the new domain
2. Set up email routing on the new domain
3. Update email on every account tied to the old domain — one by one
4. Verify the new email on each account before abandoning the old domain
5. Let the old domain expire only after all accounts are migrated

**Never abandon the old domain until the new email is verified everywhere.**

---

## 9. Recommended Setup Order

1. Check `mjdg.dev` availability on Cloudflare Registrar
2. Register domain on Cloudflare (~$12/yr)
3. Set up Cloudflare Email Routing → forward `mark@mjdg.dev` to Gmail (free, 5 min)
4. Create new AWS account using `mark@mjdg.dev` (or `aws@mjdg.dev`)
5. Deploy mjdg-web to EC2 (see TASKS.md)
6. Point `A` record to EC2 Elastic IP
7. Run Certbot for HTTPS
8. App is live at `https://mjdg.dev`

---

## 9. Cost Summary

| Item | Cost |
|---|---|
| Domain registration (mjdg.dev) | ~$12/yr |
| DNS (Cloudflare) | Free |
| Email routing (Cloudflare) | Free |
| SSL certificate (Let's Encrypt) | Free |
| EC2 t3.micro (AWS free tier) | Free for 12 months |
| Elastic IP (attached to running instance) | Free |
| **Total Year 1** | **~$12** |
| **Total Year 2+** | **~$12/yr + EC2 costs** |
