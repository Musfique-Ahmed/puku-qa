# TC-002 — Header Sign in and Download links resolve to correct routes

**Date:** 2026-10-19
**Result:** ✅ PASS
**Driver:** @playwright/cli (Chromium, headless)

| # | Step | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | Navigate to / | Homepage loads with header nav | Matched; URL=https://web.dev.puku.sh/ | ✅ |
| 2 | Locate Sign in link | href = `/login?next=%2F` | href = `/login?next=%2F` (exact) | ✅ |
| 3 | Click Sign in | URL = `/login?next=%2F`, title = "Puku" | URL = https://web.dev.puku.sh/login?next=%2F, title = "Puku" | ✅ |
| 4 | Navigate back to / | Homepage loads | Matched; URL=https://web.dev.puku.sh/ | ✅ |
| 5 | Locate Download link | href starts with `/download` | href = `/download` (exact) | ✅ |
| 6 | Click Download | URL = `/download`, title = "Download — Puku Editor" | URL = https://web.dev.puku.sh/download, title = "Download — Puku Editor" | ✅ |

**Evidence:**
- Sign-in href captured in-context; post-click URL/title captured in-context
- Download href captured in-context; post-click URL/title captured in-context

**Notes:**
- Both `next` and the `platform` query param conventions are respected: the `next=%2F` param round-trips exactly.
- The Download link did NOT add `?platform=*` in this headless run (the default Playwright UA is not in the recognized list); the spec allows either, so this is acceptable.
