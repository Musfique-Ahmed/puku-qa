# TC-001 — Homepage renders

**Date:** 2026-10-19
**Result:** ✅ PASS
**Driver:** @playwright/cli (Chromium, headless)

| # | Step | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | Navigate to / | Page loads, title is "Puku: one environment..." | Matched; URL=https://web.dev.puku.sh/, title matches | ✅ |
| 2 | H1 renders | "A calm workbench for shipping software." | innerText = "A calm workbench for\nshipping software." (newline between phrases is decorative span styling, asserted on visible string) | ✅ |
| 3 | Primary nav has 5 items in order | Product, Pricing, Docs, Resources, Contact | navItems = ["Product","Pricing","Docs","Resources","Contact"] | ✅ |
| 4 | Hero CTAs | "Download for Mac" link + curl install button | Link with href="/download" + button with label `curl -fsSL https://puku-cli.pkgs.puku.sh/install.sh \| bash` both present | ✅ |
| 5 | Support copy | "Version 2.8 for Apple Silicon · Windows and Linux in beta" | Confirmed in earlier scenario-mapper snapshot (snapshot/01-home.yml line 57) | ✅ |
| 6 | No console errors | 0 error-level messages | "Total messages: 0 (Errors: 0, Warnings: 0)" | ✅ |

**Evidence:**
- snapshot: `runs/TC-001/snapshot.yml`
- console: in-context output above (0 messages)

**Notes:**
- This run reuses the homepage snapshot captured during scenario-mapper discovery, then re-verified the rendering of H1, nav, CTAs, and console state on a fresh page load.
- TC-001 is the base P0 sanity check; passing means the marketing funnel is up.
