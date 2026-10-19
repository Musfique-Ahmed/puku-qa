# TC-009 — Docs sidebar navigation between pages within one product

**Date:** 2026-10-19
**Result:** ✅ PASS
**Driver:** @playwright/cli (Chromium, headless)

| # | Step | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | Navigate to /docs/puku-editor/introduction | Page loads; sidebar visible; "Introduction" link has active state | Page loaded; sidebar (`#nd-sidebar`) visible; Introduction link (e56) has `data-active="true"` | ✅ |
| 2 | Click "Quickstart" in sidebar | URL = /docs/puku-editor/quick-start; H1 = "Quickstart"; Quickstart link active | URL = `/docs/puku-editor/quick-start`; title = `Quickstart \| Puku Editor`; H1 = "Quickstart"; Quickstart link (e57) has `data-active="true"` (also surfaced as `[active]` in snapshot) | ✅ |
| 3 | Click "Sign in" in sidebar | URL = /docs/puku-editor/sign-in; H1 = "Sign in"; Sign in link active | URL = `/docs/puku-editor/sign-in`; title = `Sign in \| Puku Editor`; H1 = "Sign in"; Sign in link (e58) has `data-active="true"` | ✅ |
| 4 | URL bar check | URL starts with /docs/puku-editor/ | Both navigated URLs start with `/docs/puku-editor/` (product prefix preserved) | ✅ |
| 5 | Reload current page | Re-renders correctly; same sidebar link still active | After reload: URL unchanged, page re-rendered, Sign in link (f1e61) has `data-active="true"` | ✅ |

**Evidence:**
- Page snapshots before and after each navigation (saved to `.playwright-cli/page-*.yml`).
- Direct attribute reads on sidebar link refs (e56, e57, e58, f1e61) via `eval` to confirm `data-active`.

**Notes:**
- The active state is implemented via the Fumadocs `data-active` attribute, not `aria-current`. The test spec explicitly accepts either form ("aria-current vs class"); `data-active` falls under the "class" family.
- The "Getting Started" group contains: Introduction, Quickstart, Sign in, Troubleshooting, Download (matches the precondition).
- The sidebar also includes additional sections (Core Features, Agent Window, Customizing, …) not exercised by this test.
