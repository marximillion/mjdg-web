# DEFECTS.md — mjdg-web Known Defects

Format: DEF-[ID] | Page | Severity | Status | Description

---

## Open

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
