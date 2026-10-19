# Test Case: [TC-004] — Email magic-link form accepts a valid email and shows the "check your inbox" state

**Priority:** P0
**Status:** Verified (via flow-runner, 2026-10-19) — steps 1–7 fully proven, step 8 has a structural follow-up (confirm-button click + post-auth snapshot) needed for full closure
**Source:** scenario-mapper row S004
**Run result:** [runs/TC-004/result.md](../runs/TC-004/result.md)

## Preconditions
- Anonymous browser session, no cookies.
- A **disposable inbox** is provisioned via mail.tm's REST API (`https://api.mail.tm`, `maxxspace.com` is the active public domain at run time). The dev environment sends a real email; do not point this at a personal mailbox.
- The same browser instance is reused for the verify-URL click — the magic link is **browser-bound** and fails with `error=magic_link_wrong_browser` if opened in a different browser context.
- The orchestrator script at `runs/TC-004/run-magic-link.py` implements this flow end-to-end.

## Test data
- Email-login URL: `https://web.dev.puku.sh/email-login?next=%2F`
- Disposable email: a fresh address created for this run, e.g. `puku-qa-<unix-timestamp>@maxxspace.com`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/email-login?next=%2F` | Page loads; H1 reads "Sign in with Email" |
| 2 | Inspect the helper copy beneath the H1 | The text mentions "we'll send you a link", "It works once", and "15 minutes" (exact wording may shift slightly; assert on the three facts) |
| 3 | Locate the email textbox (placeholder `you@example.com`) and the "Continue" button | Both are visible; the "Continue" button is enabled |
| 4 | Type the disposable email into the textbox | The textbox value equals the disposable email |
| 5 | Click "Continue" | A network request POSTs to the email-login endpoint; the page transitions to a confirmation state ("check your inbox" or similar) with no error message |
| 6 | Open the disposable inbox | Within 60 seconds, a single new email arrives from Puku |
| 7 | Open the email | The email body contains a single sign-in link whose host is on the `puku.sh` domain |
| 8 | Click the sign-in link in a fresh tab | The link is single-use: the page either lands on `/` with an authenticated session, OR shows an "expired" page if the 15-minute window has passed |

## Step 8 — actual behavior (verified 2026-10-19)

The verify URL renders a **two-stage CSRF confirmation page**, NOT an instant auth. After navigating to `/api/oauth/magic-link/verify?token=…` in the same browser session, the page shows:

- H1 = "Sign in to Puku"
- Body = "Click the button below to finish signing in. This link is single-use and expires in 15 minutes."
- Button = "Sign in to Puku" (this is what establishes the session)
- A "Cancel" link → `/login`

The runner MUST click the confirm button before asserting authenticated state. Failing to do so leaves the user on the CSRF page and `localStorage` empty.

## Postconditions
- The disposable inbox may receive a real sign-in link — recommend deleting the address after the run to keep the inbox list clean.
- The user's session on `web.dev.puku.sh` is now authenticated. The runner should log out at the end of the run (clear cookies + localStorage).

## Notes
- The 15-minute expiry means a run that pauses between steps 7 and 8 for more than 15 minutes will see an expired-link page; budget for this.
- Browser-based runners cannot read email bodies; pair this test with an inbox-watcher service (e.g., a small Playwright `route` to a stub, or an inbox API call) or stop at step 5 and report "confirmation state reached" as the runner's pass condition.
- The magic link is single-use — do not click the same link twice.
- **mail.tm response shape quirks:** `/domains` and `/messages` return plain JSON lists (not Hydra `hydra:member` collections); `msg["html"]` is a list of HTML strings, not a single string. Code must handle both shapes.
- **`playwright open` vs `goto`:** opening the verify URL via `open` spawns a fresh browser context and triggers `error=magic_link_wrong_browser`. Use `goto` to stay in the same browser that submitted the form.
