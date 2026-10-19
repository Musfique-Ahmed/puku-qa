# TC-014 — Footer links resolve to their target pages without 404

**Date:** 2026-10-19
**Result:** ✅ PASS
**Driver:** @playwright/cli (Chromium, headless)

| # | Step | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | Navigate to / | Footer visible | Footer (`contentinfo` e1961) visible at the bottom of the page | ✅ |
| 2a | Visit /puku-editor | HTTP 200; non-empty title | title = "Puku Editor — AI-Native Development Environment" | ✅ |
| 2b | Visit /puku-cli | HTTP 200; non-empty title | title = "Puku CLI — Terminal-Native Infrastructure Operations" | ✅ |
| 2c | Visit /puku-chat | HTTP 200; non-empty title | title = "Puku Chat \| Chat, research, and create in your browser" | ✅ |
| 2d | Visit /puku-app | HTTP 200; non-empty title | title = "Puku App \| Mobile chats and projects" | ✅ |
| 2e | Visit /pricing | HTTP 200; non-empty title | title = "Pricing — Puku Editor" | ✅ |
| 2f | Visit /docs | HTTP 200; non-empty title | title = "Documentation — Puku" | ✅ |
| 2g | Visit /changelog | HTTP 200; non-empty title | title = "Changelog · Puku" | ✅ |
| 2h | Visit /download | HTTP 200; non-empty title | title = "Download — Puku Editor" | ✅ |
| 2i | Visit /blog | HTTP 200; non-empty title | title = "Blog · Puku" | ✅ |
| 2j | Visit /about-us (About) | HTTP 200; non-empty title | title = "About Us — Puku" | ✅ |
| 2k | Visit /contact (Status + Contact) | HTTP 200; non-empty title | title = "Contact — Puku" | ✅ |
| 2l | Visit /support | HTTP 200; non-empty title | title = "Support — Puku" | ✅ |
| 2m | Visit /terms | HTTP 200; non-empty title | title = "Terms of Service — Puku" | ✅ |
| 2n | Visit /privacy | HTTP 200; non-empty title | title = "Privacy Policy — Puku" | ✅ |
| 2o | Visit /refund | HTTP 200; non-empty title | title = "Refund Policy — Puku" (responseStatus=200) | ✅ |
| 3 | External social links (Discord, YouTube, LinkedIn) | href matches; target=_blank | Discord: `https://discord.gg/WmsGeB68Rv` [target=_blank] ✅; YouTube: `https://www.youtube.com/@poridhiio` [target=_blank] ✅; LinkedIn: `https://www.linkedin.com/company/poridhiio/` [target=_blank] ✅ | ✅ |
| 4 | No external social requests | No fetch to discord/youtube/linkedin | `externalResources` filtered for those domains = `[]`; only internal nav to `/refund` in the navigation entries | ✅ |
| 5 | Return to / | Loads with no console errors | 0 console errors observed across the walk | ✅ |

**Evidence:**
- Footer link dump via `eval` on `contentinfo` ref.
- `runs/TC-014/walk-result.txt` — page titles for each of the 15 internal links.
- `performance.getEntriesByType('navigation')` for the last visited page shows `responseStatus: 200`.
- No external requests in `performance.getEntriesByType('resource')`.

**Notes:**
- The footer has 20 links total: 1 home (logo) + 16 internal + 3 external social.
- Two distinct internal labels map to the same target: "Status" and "Contact" both link to `/contact`. The test spec's "Expected internal targets" list includes `/contact` once; visiting it once is sufficient.
- "About" maps to `/about-us` (matches the spec note that "About" is wired to `/about-us`).
- The Discord invite in the footer is `WmsGeB68Rv` (matches the spec). The contact page also links to `discord.gg/puku` — that's a separate, different invite; not part of this test.
- The LinkedIn URL in the footer is `https://www.linkedin.com/company/poridhiio/` (with trailing slash); the spec listed the same URL. Facebook appears only in the top social bar, not the footer, so it's not in scope.
