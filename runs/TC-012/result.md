# TC-012 — Contact form builds a mailto draft with the entered values

**Date:** 2026-10-19
**Result:** ✅ PASS
**Driver:** @playwright/cli (Chromium, headless)

| # | Step | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | Navigate to /contact | H1 = "Talk to a person." | h1 = "Talk to a person." | ✅ |
| 2 | Name textbox visible and empty | matches | textbox "Name" (e87) with placeholder "Your name", value = "" | ✅ |
| 3 | Type "QA Tester" into Name | value = "QA Tester" | input value = "QA Tester" | ✅ |
| 4 | Work email textbox visible and empty | matches | textbox "Work email" (e90) with placeholder "you@company.com", value = "" | ✅ |
| 5 | Type test email | value = test email | input value = "qa+1700000000@example.com" | ✅ |
| 6 | Click "Billing" topic button | Billing pressed, Support unpressed | Support (e94) pressed=false; Billing (e95) pressed=true | ✅ |
| 7 | Product combobox default = "Puku CLI" | matches | option "Puku CLI" [selected] | ✅ |
| 8 | Message textbox empty, counter "0/1000" | matches | counter (e104) shows "0/1000"; textarea empty | ✅ |
| 9 | Type test message | Counter updates; value matches; counter ≤ 1000 | counter shows "63/1000"; textarea value matches | ✅ |
| 10 | Click "Open email draft →" | mailto: navigation; to=support@puku.sh (Billing); subject contains topic; body contains name, email, product, message | Console log captured: `mailto:support@puku.sh?subject=Billing%20%E2%80%94%20Puku%20CLI&body=Name%3A%20QA%20Tester%0AEmail%3A%20qa%2B1700000000%40example.com%0AProduct%3A%20Puku%20CLI%0ATopic%3A%20Billing%0A%0AThis%20is%20a%20sanity-check%20message%20generated%20by%20the%20QA%20flow%20runner.` — to=`support@puku.sh` ✅, subject=`Billing — Puku CLI` ✅, body contains all required fields ✅ | ✅ |
| 11 | No POST to form endpoint | no fetch/XHR to /contact | `performance.getEntriesByType('resource')` filtered to contact (excluding `_rsc` prefetches) returns `[]` — no fetch POST. | ✅ |

**Evidence:**
- Console log file: `.playwright-cli/console-2026-10-19T10-31-49-305Z.log` — captured the full mailto URL via Chromium's "Launched external handler" INFO message.
- Per-field value checks via `eval`.
- Performance API confirms no fetch/XHR to /contact.

**Notes:**
- The contact form is a **mailto: handoff** — no server endpoint is called. The browser receives a `mailto:support@puku.sh?...` URL and attempts to launch an external handler.
- In a real (non-headless) browser, this would open the OS-default email client with a pre-filled draft. The headless Chromium logs the handler-launch attempt as an INFO line, which is sufficient evidence for the assertion.
- The topic→recipient mapping is: **Billing → `support@puku.sh`** (matches the test spec's expected recipient). Other topics follow the same pattern; Press would route to `press@puku.sh` if present.
- The subject format is `Billing — Puku CLI` (em-dash separator); the topic and selected product are both encoded.
- The body uses `Name: …\nEmail: …\nProduct: …\nTopic: …\n\n<message>` (newline-separated, then a blank line before the user's message).
- The form button is `<button type="submit">`; React intercepts the submit and assigns `window.location.href = "mailto:..."` (no `action="/api/contact"` POST is ever made).
