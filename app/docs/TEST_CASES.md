# mjdg-web — Test Cases

Manual test cases for validating features on production and local dev.

> **Automation:** Playwright E2E suite lives in `tests/navigation.spec.ts`. Run with `yarn playwright test` (dev server must be running). Set `TEST_USERNAME` / `TEST_PASSWORD` env vars for a valid test account. Run `npx playwright install chromium` once to install the browser binary.
> Manual cases below remain the source of truth for the mjdg-automation BAT suite (v1.2.7).

---

## Auth

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| AUTH-001 | Login — valid credentials | Enter valid username + password, submit | Redirect to `/dashboard`, session cookie set |
| AUTH-002 | Login — invalid credentials | Enter wrong username or password, submit | Error message displayed, no redirect |
| AUTH-003 | Logout — desktop | Click Logout in nav | Redirect to `/`, logout alert shown |
| AUTH-004 | Logout — mobile | Open hamburger menu, click Logout | Redirect to `/`, logout alert shown |
| AUTH-005 | Protected route — unauthenticated | Navigate to `/dashboard` without login | Redirect to `/` |
| AUTH-006 | Protected route — authenticated | Login, navigate to `/dashboard` | Page loads correctly |
| AUTH-007 | Login redirect — already authenticated | Login, try to navigate to `/` | Redirect to `/dashboard` |

---

## Registration

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| REG-001 | Register — valid new user | Fill all fields, submit | Redirect to `/?registered=true`, success alert shown |
| REG-002 | Register — duplicate username | Register with existing username | Error message "Username or email already taken" |
| REG-003 | Register — submit button disabled | Load `/register` with empty fields | Submit button disabled |
| REG-004 | Register — submit button enabled | Fill username + password | Submit button enabled |
| REG-005 | Register — show/hide password | Click eye icon on password field | Password visibility toggles |

---

## Alerts

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| ALERT-001 | Registration success alert | Complete registration | Green alert shown: "Account created successfully. Please log in." |
| ALERT-002 | Logout success alert | Logout | Green alert shown: "You have been logged out." |
| ALERT-003 | Alert dismiss | Click ✕ on alert | Alert disappears |
| ALERT-004 | Alert gone on refresh | Refresh page after alert shown | Alert does not reappear |

---

## Dashboard

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| DASH-001 | Welcome message | Login, navigate to `/dashboard` | Shows "Welcome back, \<username\>!" |

---

## Footer

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| FOOT-001 | Version in production | Visit any page on mjmdg.org | Footer shows `© MJMDG 2026 — vX.X.X.X` |
| FOOT-002 | DEV label in local | Run `yarn dev`, visit any page | Footer shows `© MJMDG 2026 — DEV` |
| FOOT-003 | Footer on all pages | Check footer on `/`, `/dashboard`, `/profile` | Version label consistent across pages |

---

## Navigation (Automated — `tests/navigation.spec.ts`)

| ID | Test Case | Coverage |
|---|---|---|
| NAV-001 | Public routes load without session | `/`, `/portfolio`, `/register` |
| NAV-002 | Protected routes redirect to `/` — unauthenticated | `/dashboard`, `/catalogue`, `/profile`, `/logout GET` |
| NAV-003 | Protected routes load after login | `/dashboard`, `/catalogue`, `/profile` |
| NAV-004 | Logout destroys session | POST `/logout` → redirect `/` → `/dashboard` redirects to `/` |
| NAV-005 | Nav links — portfolio | `/dashboard` → click `a[href="/portfolio"]` → `/portfolio` |
| NAV-006 | Nav links — catalogue | `/dashboard` → click `a[href="/catalogue"]` → `/catalogue` |
| NAV-007 | Nav links — profile | `/dashboard` → click `a[href="/profile"]` → `/profile` |
| NAV-008 | Nav links — home | `/dashboard` → click `a[href="/"]` → `/` |
| NAV-009 | Cross-route matrix (authenticated) | All permutations of `/dashboard`, `/catalogue`, `/profile`, `/portfolio`, `/` |
| NAV-010 | 404 — unknown route | `/this-does-not-exist` → HTTP 404 |

---

## Login Error Behaviour

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| ERR-001 | Error auto-dismiss | Submit invalid credentials, wait 4s | Error message disappears automatically |
| ERR-002 | Error clears on typing — username | Submit invalid credentials, type in username field | Error message clears immediately |
| ERR-003 | Error clears on typing — password | Submit invalid credentials, type in password field | Error message clears immediately |

---

## Loader Animation

| ID | Test Case | Steps | Expected Result |
|---|---|---|---|
| LOAD-001 | Fires on logout | Click Logout | Car approach animation plays, blinker flash on completion, overlay fades |
| LOAD-002 | Does not fire on page nav | Navigate between `/dashboard`, `/portfolio`, etc. | No loader overlay appears |
| LOAD-003 | Fires on login | Submit login form with valid credentials | Car approach animation plays, overlay fades into dashboard |
| LOAD-004 | Blinker position | Watch logout animation | Hazard blinkers land on the turn signal positions of the FD5 car image |
| LOAD-005 | Sync — bar and car | Watch logout animation | Progress bar reaches 100% at same time car animation completes |

---

## DNS / Connectivity

| ID | URL | Expected Result |
|---|---|---|
| DNS-001 | mjmdg.org | ✅ Resolves and loads |
| DNS-002 | www.mjmdg.org | ✅ Resolves and loads |
| DNS-003 | staging.mjmdg.org | ✅ Resolves and loads |
| HTTP-001 | http://mjmdg.org | ✅ Loads (Cloudflare Flexible SSL) |
| HTTP-002 | http://www.mjmdg.org | ✅ Loads |
| HTTPS-001 | https://mjmdg.org | ✅ Loads |
| HTTPS-002 | https://www.mjmdg.org | ✅ Loads |
| HTTPS-003 | https://staging.mjmdg.org | ✅ Loads |
| IP-001 | http://40.177.197.204 | ✅ Loads |
| IP-002 | https://40.177.197.204 | ❌ Expected — no SSL cert on raw IP |
