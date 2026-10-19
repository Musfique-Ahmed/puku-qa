# Test Case: [TC-014] — Footer links resolve to their target pages without 404

**Priority:** P1
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S014

## Preconditions
- Anonymous browser session.
- Network inspector is recording all responses.

## Test data
- Homepage URL: `https://web.dev.puku.sh/`
- Expected internal targets: `/puku-editor`, `/puku-cli`, `/puku-chat`, `/puku-app`, `/pricing`, `/docs`, `/changelog`, `/download`, `/blog`, `/about-us`, `/contact`, `/support`, `/terms`, `/privacy`, `/refund`
- Expected external social targets: `https://discord.gg/WmsGeB68Rv`, `https://www.youtube.com/@poridhiio`, `https://www.linkedin.com/company/poridhiio/`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/` | Page loads; footer is visible at the bottom of the page |
| 2 | For each of the 15 expected internal footer links: locate the `<a>` element, record its `href`, click it (or use `page.goto(href)` in a new tab) | Each target returns HTTP 200; each target's document title is non-empty |
| 3 | For the three expected external social links: locate the `<a>` element, inspect its `href` and `target` | Each external link's `href` matches the expected URL; each has `target="_blank"` (or equivalent) to open in a new tab |
| 4 | Do NOT navigate to the external social links | No request to `discord.com`, `youtube.com`, or `linkedin.com` is sent from the test browser |
| 5 | Return to the homepage | Page loads with no console errors |

## Postconditions
- 15 internal pages were visited. Browser history may be long — close extra tabs at the end of the run.
- No external service was contacted.

## Notes
- This is a "smoke for the whole site" test. A single 404 here is more useful than 15 individual page tests because it catches both "the page is gone" and "the footer link is mis-typed".
- "About" and "Status" are both wired to `/contact` and `/about-us` respectively per the snapshot; assert on the actual target, not the label.
- The Discord link in the footer is `WmsGeB68Rv`; the contact page also links to `discord.gg/puku` (a different invite). Both are valid; the test only asserts on the footer's invite.
