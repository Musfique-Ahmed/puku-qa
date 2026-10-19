# Test Case: [TC-005] — Email magic-link form rejects an empty or invalid email

**Priority:** P1
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S005

## Preconditions
- Anonymous browser session, no cookies.
- Network inspector is recording all outgoing requests.

## Test data
- Email-login URL: `https://web.dev.puku.sh/email-login?next=%2F`
- Invalid email sample: `not-an-email`
- Empty value: leave the field blank.

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/email-login?next=%2F` | Page loads; email textbox and "Continue" button are visible |
| 2 | Leave the email textbox empty; inspect the "Continue" button | The "Continue" button is disabled (or, if it is not, an inline validation message appears on click) |
| 3 | If the button is enabled: click "Continue" with the field empty | Either no network request fires, OR the page shows an inline validation error and remains on `/email-login` |
| 4 | Type `not-an-email` into the email textbox | The textbox value equals `not-an-email` |
| 5 | Click "Continue" | Either no network request fires, OR the page shows an inline validation error and remains on `/email-login` |
| 6 | Inspect the network log | No `POST` to the email-login API has been sent for the invalid value |

## Postconditions
- None. No email was sent.

## Notes
- Two valid implementations are acceptable: (a) button stays disabled, (b) click fires the request and the server rejects it. The thing that is NOT acceptable: a successful request from an empty/invalid field that triggers a real email.
- The exact validation message copy can drift; assert on the behavior (no success state, no network success) rather than literal text.
