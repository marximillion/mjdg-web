# mjdg-web — Test Cases

Manual test cases for validating features on production and local dev.

> **Automation:** These test cases are the source of truth for the mjdg-automation Playwright + Appium suite. See `mjdg-automation` project when automation is prioritized.

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
