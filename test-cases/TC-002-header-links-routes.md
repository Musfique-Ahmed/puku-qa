# Test Case: [TC-002] — Header Sign in and Download links resolve to correct routes

**Priority:** P0
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S002

## Preconditions
- Anonymous browser session on the homepage.
- The UA is recognized (default Playwright Chromium UA is fine for the test) — Download sets `?platform=*` only when the UA is recognized; the un-parameterized route is also valid.

## Test data
- Homepage URL: `https://web.dev.puku.sh/`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/` | Homepage loads; header `<nav aria-label="Main">` is visible |
| 2 | Locate the header link labeled "Sign in" | Link is visible and its `href` is `/login?next=%2F` (the `next` param encodes `/`) |
| 3 | Click "Sign in" | Browser navigates to `/login`; URL contains the `next=%2F` query string; document title is `Puku` |
| 4 | Navigate back to the homepage | Homepage loads again |
| 5 | Locate the header link labeled "Download" | Link is visible and its `href` starts with `/download` |
| 6 | Click "Download" | Browser navigates to `/download`; document title is `Download — Puku Editor` |

## Postconditions
- None. Both targets are read-only pages.

## Notes
- The `next` query param must round-trip; if the marketing site ever strips it, deep-linking from blog posts to auth will silently break.
- The Download link may include `?platform=*` depending on UA; either is acceptable, but the base path must be `/download`.
