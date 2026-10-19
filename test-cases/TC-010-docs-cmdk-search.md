# Test Case: [TC-010] — Docs Search (Cmd+K) opens and returns results for a known term

**Priority:** P1
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S010

## Preconditions
- Anonymous browser session, on any `/docs/<product>/*` page.
- The Search overlay is a keyboard shortcut (`Cmd+K` on macOS, `Ctrl+K` on Windows/Linux) AND clickable via a "Search ⌘K" button in the sidebar.

## Test data
- Starting URL: `https://web.dev.puku.sh/docs/puku-editor/introduction`
- Search term: `context` (known to appear in the Puku Editor docs: "Context Engine", "context window", "contextual answers")

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/docs/puku-editor/introduction` | Page loads; sidebar is visible with a "Search ⌘K" button |
| 2 | Click the "Search ⌘K" button in the sidebar | A search overlay/modal appears (visible input field, results list, or "no results" empty state) |
| 3 | Close the overlay (Esc or close button) | Overlay disappears; the underlying article is interactive again |
| 4 | Press the platform-appropriate keyboard shortcut (Ctrl+K on Windows/Linux, Cmd+K on macOS) | The same search overlay appears as in step 2 |
| 5 | Type the word `context` into the search input | The results list updates to show at least one matching article; matching title and/or snippet mentions "context" |
| 6 | Click the first result | Browser navigates to the matching article URL; HTTP 200; the article body contains the searched term |

## Postconditions
- None. The search overlay is closed; no state left behind.

## Notes
- The keyboard shortcut is platform-dependent. Do not assert on the exact key; assert on the overlay opening.
- "First result" is implementation-defined (could be a fuzzy match or a literal match); assert on the result count being ≥ 1 and the click navigating somewhere valid.
- If the overlay does not appear on the first click, wait up to 3 seconds — some doc sites load the search bundle lazily.
