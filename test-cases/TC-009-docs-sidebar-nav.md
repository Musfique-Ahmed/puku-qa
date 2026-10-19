# Test Case: [TC-009] — Docs sidebar navigation between pages within one product

**Priority:** P1
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S009

## Preconditions
- Anonymous browser session.
- The "Getting Started" section of the Puku Editor docs sidebar contains at least: Introduction, Quickstart, Sign in, Troubleshooting, Download.

## Test data
- Starting URL: `https://web.dev.puku.sh/docs/puku-editor/introduction`
- Targets: `/docs/puku-editor/quick-start`, `/docs/puku-editor/sign-in`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/docs/puku-editor/introduction` | Page loads; sidebar is visible; the "Introduction" link has an active/aria-current state |
| 2 | In the sidebar, click the "Quickstart" link | Browser navigates to `/docs/puku-editor/quick-start`; HTTP 200; the new page's H1 is "Quickstart" (or equivalent); the sidebar's "Quickstart" link now has the active state |
| 3 | In the sidebar, click the "Sign in" link | Browser navigates to `/docs/puku-editor/sign-in`; HTTP 200; the new page's H1 is "Sign in" (or equivalent); the sidebar's "Sign in" link now has the active state |
| 4 | Inspect the URL bar | The URL starts with `/docs/puku-editor/` — the product prefix is preserved across sidebar clicks |
| 5 | Reload the current page | Page re-renders correctly; sidebar state is preserved (the same link still has the active state) |

## Postconditions
- None. Read-only navigation.

## Notes
- The "Active" state implementation varies (aria-current="page" vs. a class); assert on whichever is present.
- 404s on the slugs the navigation suggests are the most common docs regressions; if step 2 or 3 produces a 404, that is a P1 docs bug, not a sidebar bug.
- Sidebar items may be lazy-loaded or behind a "Collapse Sidebar" toggle; if collapsed, click the toggle first.
