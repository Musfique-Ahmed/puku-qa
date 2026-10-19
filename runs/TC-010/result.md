# TC-010 — Docs Search (Cmd+K) opens and returns results for a known term

**Date:** 2026-10-19
**Result:** ✅ PASS
**Driver:** @playwright/cli (Chromium, headless)

| # | Step | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | Navigate to /docs/puku-editor/introduction | Page loads; sidebar "Search ⌘K" button visible | Page loaded; sidebar visible; button "Search Ctrl K" (e348) in sidebar | ✅ |
| 2 | Click "Search" button in sidebar | Search overlay/modal opens | Dialog "Search" (e355) appears with `combobox "Search"` (e357) and empty-state status "No results found" (e360) | ✅ |
| 3 | Close overlay with Esc | Overlay disappears; underlying article interactive | Esc closed the dialog; only the "Search Ctrl K" button (now ref=e397) is visible again | ✅ |
| 4 | Press keyboard shortcut (Ctrl+K) | Same search overlay appears | Pressing Control+K re-opened a "Search" dialog (e428) with the Search combobox (e430) | ✅ |
| 5 | Type "context" in search input | Results list updates with at least 1 match mentioning "context" | Combobox value = "context"; listbox (e467) shows 8+ options including "DocsPuku cli — Skills in puku-cli", several options with `code: context`, "context: fork", "context window", "execution context" | ✅ |
| 6 | Click first result | Navigate to a valid docs URL; HTTP 200; article body mentions "context" | Clicked first option (e468) → URL = `/docs/puku-cli/skills`; title = `Skills in puku-cli \| Puku CLI`; page snapshot contains 18 instances of "context" | ✅ |

**Evidence:**
- Page snapshots before/during/after the search (saved to `.playwright-cli/page-*.yml`).
- Dialog/combobox/listbox refs inspected directly.

**Notes:**
- The keyboard shortcut "Ctrl+K" opens the overlay on Windows/Linux (as expected — `Cmd+K` is the macOS equivalent). The dialog is the same one triggered by clicking the button.
- The first result for "context" was a Puku CLI page (`/docs/puku-cli/skills`), even though we started in Puku Editor docs. The search engine shows results across **all** product docs, not just the current product — this matches the expected behavior of a global docs search.
- The first search-result click navigates inside the app (single-page navigation; overlay dismisses).
