# Test Case: [TC-003] — Login page lists all four sign-in providers

**Priority:** P0
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S003

## Preconditions
- Anonymous browser session.
- No URL query params required (`/login` and `/login?next=...` both work; the `next` value is only consumed after a successful sign-in).

## Test data
- Login URL: `https://web.dev.puku.sh/login`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/login` | Page loads; H1 reads "Sign in to Puku" |
| 2 | Inspect the providers list | Four links are present, in order: "Continue with Google", "Continue with Microsoft", "Continue with Apple", "Continue with Email" |
| 3 | Inspect the href of "Continue with Google" | `href` starts with `/api/oauth/login?provider=google&next=` |
| 4 | Inspect the href of "Continue with Microsoft" | `href` starts with `/api/oauth/login?provider=microsoft&next=` |
| 5 | Inspect the href of "Continue with Apple" | `href` starts with `/api/oauth/login?provider=apple&next=` |
| 6 | Inspect the href of "Continue with Email" | `href` starts with `/email-login?next=` |
| 7 | Inspect the legal copy beneath the buttons | Two inline links are present and resolve to `/terms` and `/privacy` respectively |

## Postconditions
- None. No provider was clicked; no OAuth flow was initiated.

## Notes
- **Do not click any OAuth provider in automated runs.** Step 8 (omitted) would initiate a real OAuth handshake; the runner must stop at step 7 and only assert on rendered state.
- If any provider is missing, this is a P0 marketing/contract regression — the comparison table on /pricing advertises Google / Microsoft / Apple sign-in.
