# TC-011 — Blog category filter narrows the listing

**Date:** 2026-10-19
**Result:** ✅ PASS
**Driver:** @playwright/cli (Chromium, headless)

| # | Step | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | Navigate to /blog | H1 = "Notes from the workbench." | h1 = "Notes from the workbench." | ✅ |
| 2 | Filter group has 4 buttons: All, Product, Engineering, Guides; All pressed | matches | Buttons: e50 "All" `[pressed]`, e52 "Product", e53 "Engineering", e54 "Guides" — in that order | ✅ |
| 3 | Count visible posts under "All" | N ≥ 4 | N = 5 (designing-a-readable-sandbox, one-memory, terminal-asks, pkce-refresh, writing-puku-md) | ✅ |
| 4 | Click "Product" | "Product" pressed, "All" unpressed; 1 ≤ M < N | Product pressed=true, All pressed=false; M = 3 (designing-a-readable-sandbox, one-memory, terminal-asks) | ✅ |
| 5 | Click "Engineering" | 1 ≤ K < N | K = 1 (pkce-refresh) | ✅ |
| 6 | Click "Guides" | 1 ≤ J < N | J = 1 (writing-puku-md) | ✅ |
| 7 | Click "All" | Full set restored (N posts) | All pressed=true; 5 posts visible | ✅ |
| 8 | Reload page | "All" active again; N posts visible (state not persisted) | All `[pressed]`; 5 posts visible after reload | ✅ |

**Evidence:**
- Per-filter snapshot grep for `blog/` hrefs (saved to `.playwright-cli/page-*.yml`).
- Direct attribute reads on filter button refs to confirm `aria-pressed` toggles correctly.

**Notes:**
- Total live blog content is 5 posts. Categorization: PRODUCT = 3 (sandbox, one-memory, terminal-asks), ENGINEERING = 1 (pkce-refresh), GUIDES = 1 (writing-puku-md).
- The active state is implemented as `aria-pressed` on each button (not a separate class toggle), so reading `aria-pressed` is the canonical assertion.
- "Filter state is not persisted across reload" is correct: client-side narrowing only, no URL query param.
- The first blog post (e56 "Designing a sandbox") appears as a featured card; the other 4 appear in the "Recently written" section. The filter affects both — clicking "Engineering" hides the featured card and shows only pkce-refresh in the "Recently written" section.
