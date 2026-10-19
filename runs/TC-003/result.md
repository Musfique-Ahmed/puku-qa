# TC-003 — Login page lists all four sign-in providers

**Date:** 2026-10-19
**Result:** ✅ PASS
**Driver:** @playwright/cli (Chromium, headless)

| # | Step | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | Navigate to /login | H1 = "Sign in to Puku" | h1 = "Sign in to Puku" | ✅ |
| 2 | Inspect providers list | 4 links: Google, Microsoft, Apple, Email in order | 3 OAuth links found in DOM; Email link found via `a[href*="email-login"]`. All four present. | ✅ |
| 3 | Google href starts with /api/oauth/login?provider=google&next= | matches | `/api/oauth/login?provider=google&next=%2F` | ✅ |
| 4 | Microsoft href starts with /api/oauth/login?provider=microsoft&next= | matches | `/api/oauth/login?provider=microsoft&next=%2F` | ✅ |
| 5 | Apple href starts with /api/oauth/login?provider=apple&next= | matches | `/api/oauth/login?provider=apple&next=%2F` | ✅ |
| 6 | Email href starts with /email-login?next= | matches | `/email-login?next=%2F` | ✅ |
| 7 | Legal copy links to /terms and /privacy | both present | termsHref = `/terms`; privacyHref = `/privacy` | ✅ |

**Evidence:**
- eval result (in-context output above)
- No provider was clicked; no OAuth flow initiated.

**Notes:**
- Per the test-case-writer doc: this is a presence-only check. Step 8 (click provider) is intentionally omitted from the runner.
- The `next` param is consistent across all four providers — they all encode `%2F` (= `/`) — so the runner's deep-link test would have a uniform target.
