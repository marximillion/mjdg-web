# DEFECTS.md — mjdg-web Known Defects

Format: DEF-[ID] | Page | Severity | Status | Description

---

## Closed

### DEF-001 | Portfolio | Low | Fixed — 2026-08-13
**Page:** `/portfolio`
**Description:** Contact links (phone number, email, LinkedIn) and software skill pills have no hover state.
**Expected:** Contact links should have the same brand-red underline slide-in hover effect as nav links. Skill pills should have a subtle hover (background or border brightens).
**Actual:** No visual feedback on hover for either element.
**Notes:** Portfolio page also still uses old synthwave CSS variables (--cyan, --purple, --neon-pink, --crt-green) — full portfolio redesign is a separate task.
