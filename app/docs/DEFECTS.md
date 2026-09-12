# DEFECTS.md — mjdg-web Known Defects

Format: DEF-[ID] | Page | Severity | Status | Description

---

## Open

### DEF-004 | ThemeToggle | Low | Open
**Page:** Global (all routes)
**Description:** TypeScript error — duplicate `@fortawesome/fontawesome-common-types` installed at two version paths. `IconDefinition` type from `free-regular-svg-icons` is not assignable to `IconProp` from the root `@fortawesome` package.
**Expected:** `tsc` passes clean.
**Actual:** `app/components/ThemeToggle.tsx(31,24): error TS2322` — prefix type incompatibility between nested and root FA installs.
**Fix:** `yarn dedupe @fortawesome/fontawesome-common-types` or pin versions in `package.json` resolutions.
**Notes:** Non-blocking — app builds and runs via esbuild. Does not affect runtime behaviour.

---

### DEF-003 | Portfolio | Low | Open
**Page:** `/portfolio`
**Description:** TypeScript error — `e.id` referenced on experience array objects that have no `id` field. Key expression `e.id ?? e.company + e.role` always falls through to the fallback.
**Expected:** `tsc` passes clean.
**Actual:** `app/routes/portfolio.tsx(290,29): error TS2339` — Property `id` does not exist on experience object type.
**Fix:** Either add an `id` field to each experience entry or remove `e.id ??` from the key expression.
**Notes:** Non-blocking — fallback key `e.company + e.role` is used at runtime, React renders correctly.

---

### DEF-002 | Portfolio | Low | Open
**Page:** `/portfolio`
**Description:** Section headers (PROFILE, EDUCATION, WORK EXPERIENCE, etc.) still use `var(--cyan)` from the old synthwave theme which is no longer defined.
**Expected:** Section headers should use a brand token (e.g. `--text-primary` or `--brand-red`) consistent with the MJMDG design system.
**Actual:** Headers render in cyan on dark mode (browser falling back to a default), will be broken in light mode.
**Notes:** Part of the broader portfolio page redesign task. Low priority until full portfolio brand pass is done.

---

## Closed

### DEF-001 | Portfolio | Low | Fixed — 2026-08-13
**Page:** `/portfolio`
**Description:** Contact links (phone number, email, LinkedIn) and software skill pills have no hover state.
**Expected:** Contact links should have the same brand-red underline slide-in hover effect as nav links. Skill pills should have a subtle hover (background or border brightens).
**Actual:** No visual feedback on hover for either element.
**Notes:** Portfolio page also still uses old synthwave CSS variables (--cyan, --purple, --neon-pink, --crt-green) — full portfolio redesign is a separate task.
