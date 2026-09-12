/**
 * Navigation test suite — mjdg-web
 *
 * Route map:
 *   PUBLIC   /            home (login form)
 *            /portfolio   portfolio page
 *            /register    registration form
 *
 *   PROTECTED (redirect → / when no session)
 *            /dashboard
 *            /catalogue
 *            /profile
 *
 *   ACTION   /logout      POST only — GET redirects to /
 *
 * Auth flow:
 *   Login via POST on / → sets mjdg_session cookie → redirects to /dashboard
 *   Logout via POST on /logout → destroys cookie → redirects to /
 */

import { test, expect, type Page } from "@playwright/test";

// ── Helpers ──────────────────────────────────────────────────────────────────

const TEST_USER = {
  username: process.env.TEST_USERNAME ?? "testuser",
  password: process.env.TEST_PASSWORD ?? "testpass",
};

async function login(page: Page) {
  await page.goto("/");
  await page.fill('input[name="username"]', TEST_USER.username);
  await page.fill('input[name="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard");
}

async function clearSession(page: Page) {
  await page.context().clearCookies();
}

// ── Public routes (no auth) ───────────────────────────────────────────────────

test.describe("Public routes — accessible without session", () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
  });

  test("/ loads login form", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("/portfolio loads portfolio page", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page).toHaveURL("/portfolio");
    await expect(page.locator("body")).toBeVisible();
    // Verify a landmark element specific to portfolio
    await expect(page.locator(".pf2-page, main, [class*='portfolio']").first()).toBeVisible();
  });

  test("/register loads registration form", async ({ page }) => {
    await page.goto("/register");
    await expect(page).toHaveURL("/register");
    await expect(page.locator('input[name="username"]')).toBeVisible();
  });
});

// ── Protected routes — unauthenticated redirect ───────────────────────────────

test.describe("Protected routes — redirect to / when no session", () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
  });

  for (const route of ["/dashboard", "/catalogue", "/profile", "/automotive"]) {
    test(`${route} redirects to /`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL("/");
    });
  }

  test("/logout GET redirects to /", async ({ page }) => {
    await page.goto("/logout");
    await expect(page).toHaveURL("/");
  });
});

// ── Authenticated navigation ──────────────────────────────────────────────────

test.describe("Authenticated navigation", () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
    await login(page);
  });

  test("dashboard is accessible after login", async ({ page }) => {
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("/catalogue is accessible after login", async ({ page }) => {
    await page.goto("/catalogue");
    await expect(page).toHaveURL("/catalogue");
    await expect(page.locator("body")).toBeVisible();
  });

  test("/profile is accessible after login", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL("/profile");
    await expect(page.locator("body")).toBeVisible();
  });

  test("/portfolio is accessible after login", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page).toHaveURL("/portfolio");
  });

  test("/ shows home page (not redirect) after login", async ({ page }) => {
    await page.goto("/");
    // Home is public; authenticated users stay on / (no forced redirect)
    await expect(page).toHaveURL("/");
  });
});

// ── Logout flow ───────────────────────────────────────────────────────────────

test.describe("Logout flow", () => {
  test("logout destroys session and protected routes redirect to /", async ({ page }) => {
    await clearSession(page);
    await login(page);
    await expect(page).toHaveURL("/dashboard");

    // POST to /logout (simulate the logout button action)
    await page.evaluate(async () => {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/logout";
      document.body.appendChild(form);
      form.submit();
    });

    await page.waitForURL("/");

    // Session should be gone — protected route redirects back to /
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/");
  });
});

// ── Nav links (in-app navigation via NavigationBar) ───────────────────────────

test.describe("In-app navigation links", () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
    await login(page);
  });

  test("nav link to /portfolio navigates correctly", async ({ page }) => {
    await page.goto("/dashboard");
    const portfolioLink = page.locator('a[href="/portfolio"]').first();
    await portfolioLink.click();
    await expect(page).toHaveURL("/portfolio");
  });

  test("nav link to /catalogue navigates correctly", async ({ page }) => {
    await page.goto("/dashboard");
    const link = page.locator('a[href="/catalogue"]').first();
    await link.click();
    await expect(page).toHaveURL("/catalogue");
  });

  test("nav link to /profile navigates correctly", async ({ page }) => {
    await page.goto("/dashboard");
    const link = page.locator('a[href="/profile"]').first();
    await link.click();
    await expect(page).toHaveURL("/profile");
  });

  test("nav link to / (home) navigates correctly", async ({ page }) => {
    await page.goto("/dashboard");
    const link = page.locator('a[href="/"]').first();
    await link.click();
    await expect(page).toHaveURL("/");
  });
});

// ── Cross-route navigation matrix ─────────────────────────────────────────────

test.describe("Cross-route navigation matrix (authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
    await login(page);
  });

  const routes = ["/dashboard", "/catalogue", "/profile", "/automotive", "/portfolio", "/"];

  for (const from of routes) {
    for (const to of routes) {
      if (from === to) continue;
      test(`${from} → ${to}`, async ({ page }) => {
        await page.goto(from);
        await expect(page).toHaveURL(from);
        await page.goto(to);
        await expect(page).toHaveURL(to);
      });
    }
  }
});

// ── 404 handling ──────────────────────────────────────────────────────────────

test.describe("404 — unknown routes", () => {
  test("unknown route shows error/404 response", async ({ page }) => {
    const response = await page.goto("/this-does-not-exist");
    // React Router returns 404 for unmatched routes
    expect(response?.status()).toBe(404);
  });
});
