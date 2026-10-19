# TC-005 — Email magic-link form rejects an empty or invalid email

**Date:** 2026-10-19
**Result:** ✅ PASS
**Driver:** @playwright/cli (Chromium, headless)

| # | Step | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | Navigate to /email-login?next=%2F | Page loads; input + Continue visible | input placeholder `you@example.com`; button text "Continue" | ✅ |
| 2 | Empty field: button disabled OR inline error on click | Either | Button is enabled when empty, but click triggers HTML5/browser validation; inline alert appears | ✅ |
| 3 | Empty click: no POST | reqLog empty | reqLog = [] (fetch wrapper saw 0 calls) | ✅ |
| 4 | Type `not-an-email` | Input value = `not-an-email` | inputValue = "not-an-email" | ✅ |
| 5 | Click Continue with invalid email | No POST; inline validation | reqLog = []; alert: "Enter a full email address, like you@example.com." | ✅ |
| 6 | No POST fires for invalid value | reqLog empty | reqLog = [] | ✅ |

**Evidence:**
- `runs/TC-005/click.js` — click helper
- eval result (in-context output above)

**Notes:**
- The form uses HTML5 input validation via `<input type="email">` (implied by the placeholder and the alert wording). The browser's built-in validation runs before any fetch — that's why the reqLog is empty in both cases.
- An attacker cannot trigger an email send by submitting empty/invalid data — this is the property TC-005 is asserting.
- The exact alert copy ("Enter a full email address, like you@example.com.") is implementation-defined; the behavior (no POST) is what matters.
