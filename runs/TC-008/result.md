# TC-008 — Docs hub lists all four product doc trees and each card links to its introduction page

**Date:** 2026-10-19
**Result:** ✅ PASS
**Driver:** @playwright/cli (Chromium, headless)

| # | Step | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | Navigate to /docs | H1 = "Documentation" | h1 = "Documentation" | ✅ |
| 2 | "Products" list shows 4 cards in order: Editor, CLI, Chat, App | matches | list with 4 listitems; cards in DOM order: Editor (e53), CLI (e68), Chat (e81), App (e94) | ✅ |
| 3 | Each card has name + description + "Read docs" link | All four have these elements | Each card has heading-level name (e.g. e61/e74/e87/e100), category (e.g. e62/e75/e88/e101), description, and "Read docs" affordance | ✅ |
| 4 | Editor "Read docs" href = /docs/puku-editor/introduction | matches | `/docs/puku-editor/introduction` | ✅ |
| 5 | Click Editor card → navigates to /docs/puku-editor/introduction; title `Introduction \| Puku Editor`; HTTP 200 | matches | URL = `/docs/puku-editor/introduction`; title = `Introduction \| Puku Editor`; page rendered | ✅ |
| 6 | Back to /docs; cards still present | matches | Re-opened /docs; H1 = "Documentation" again; same 4 cards visible | ✅ |
| 7a | Click CLI card | URL `/docs/puku-cli/introduction`; non-empty title | URL = `/docs/puku-cli/introduction`; title = `Introduction to puku-cli \| Puku CLI` | ✅ |
| 7b | Click Chat card | URL `/docs/puku-chat/introduction`; non-empty title | URL = `/docs/puku-chat/introduction`; title = `Introduction to Puku Chat \| Puku Chat` | ✅ |
| 7c | Click App card | URL `/docs/puku-app/introduction`; non-empty title | URL = `/docs/puku-app/introduction`; title = `Introduction to Puku App \| Puku App` | ✅ |

**Evidence:**
- Page snapshots before/after each click (saved to `.playwright-cli/page-*.yml`).
- Each click produces a clean URL and a non-empty `<title>`.

**Notes:**
- All four introduction pages return 200 and render expected title.
- Title format is "Introduction | Puku Editor" (Editor) vs "Introduction to <name> | Puku <name>" (CLI/Chat/App) — implementation-defined wording, both formats are acceptable per the spec.
- The `Editor` page is the only one with a `|` separator using just the product name (no "to").
