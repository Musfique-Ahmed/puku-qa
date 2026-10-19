# Test Case: [TC-013] — Theme toggle cycles between system, light, and dark across pages

**Priority:** P2
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S013

## Preconditions
- Anonymous browser session.
- Browser supports `prefers-color-scheme` (Chromium does by default).
- localStorage is empty at the start of the run (clear it in setup).

## Test data
- Homepage URL: `https://web.dev.puku.sh/`
- Pricing URL: `https://web.dev.puku.sh/pricing`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Clear localStorage; navigate to `https://web.dev.puku.sh/` | Page loads; theme radiogroup in the footer has "light" selected (the site default per the snapshot) |
| 2 | Click the theme toggle in the header (button labeled "Switch to dark theme") | The document's effective background becomes dark; the toggle button label updates to "Switch to light theme"; the footer radiogroup updates to show "dark" selected |
| 3 | Click the theme toggle again | The page returns to light; the radiogroup shows "light" selected |
| 4 | Open the footer theme radiogroup and select "system" | The page follows the OS preference; the radiogroup shows "system" selected |
| 5 | Navigate to `https://web.dev.puku.sh/pricing` | Pricing page loads with the SAME theme as the homepage (no flash of unstyled content) |
| 6 | Reload the page | The selected theme (from step 4) is preserved across reload — no flash to a different theme on initial paint |
| 7 | Inspect localStorage | A theme key (e.g. `theme` or `puku-theme`) holds the selected value |

## Postconditions
- Theme preference is left in `localStorage` for the user; if the runner runs in a shared browser, clear localStorage at the end of the run.

## Notes
- The exact key name and the radiogroup's aria-checked implementation may change; assert on the visible background color, not the key name.
- "No flash of unstyled content" is hard to assert deterministically; a reasonable proxy is "the `<html>` element's `class` or `data-theme` attribute is set before the first paint". If that is too strict, asserting on the post-paint value is sufficient.
