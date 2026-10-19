# TC-016 — Changelog lists recent releases in reverse-chronological order

**Date:** 2026-10-19
**Result:** ❌ FAIL (with findings)
**Driver:** @playwright/cli (Chromium, headless)

| # | Step | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | Navigate to /changelog | Page loads; H1 reads "Changelog" | Page loaded; H1 = "What's new in Puku" (changelog page, hero text — spec's "Changelog" is loose; page title = "Changelog · Puku") | ✅ |
| 2 | First release is Puku Editor 2.8 with description mentioning "subagents" or "parallel" | matches | First entry is **Puku CLI v1.8.66** (Oct 7, 2026), description: "Polished /sandbox and /permissions UX, and clearer install instructions for both the native installer and the npm package." — **NO 2.8 Editor release exists on the changelog.** | ❌ FAIL |
| 3 | First release's date on/after the homepage "NEW" badge date | matches | The homepage's "NEW Puku 2.8 · subagents in parallel" badge has no visible date; the corresponding release is not in the changelog. | ❌ FAIL (related to #2) |
| 4 | Next three entries have version, surface, description, date | matches | Entries 2-4: Puku CLI v1.8.65 (Oct 2), Puku CLI v1.8.63 (Sep 27), Puku CLI v1.8.58 (Sep 26) — each has version, surface label "CLI", one-line description, date | ✅ |
| 5 | First 5 dates are non-increasing | matches | Oct 7 → Oct 2 → Sep 27 → Sep 26 → Sep 22 (all strictly non-increasing) | ✅ |
| 6 | Single 200; no 404s; no redirect loops | matches | responseStatus = 200; no failed requests; no redirect chain | ✅ |

**Evidence:**
- Top-5 dates extracted via regex: `["Oct 7, 2026", "Oct 2, 2026", "Sep 27, 2026", "Sep 26, 2026", "Sep 22, 2026"]` — all non-increasing.
- Top-5 versions: 1.8.66, 1.8.65, 1.8.63, 1.8.58, 1.8.57 — all Puku **CLI** (no Editor entries in the top 5).
- `performance.getEntriesByType("navigation")` shows `responseStatus: 200` for `/changelog`.

**Findings (bug):**

**HOMEPAGE ↔ CHANGELOG MISMATCH.** The homepage advertises "**NEW Puku 2.8 · subagents in parallel**" as the latest release, but the changelog's most recent entry is **Puku CLI v1.8.66 (Oct 7, 2026)** — there's no Puku Editor 2.8.0 release in the changelog, and no entry with "2.8" anywhere on the page.

This is a content-consistency bug: users who click through from the homepage's "NEW" badge will not find the promised release. Suggested follow-up:
- Either publish a Puku Editor 2.8.0 changelog entry (matching the homepage's claim), or
- Update the homepage's "NEW" badge to point to the actual most-recent release (Puku CLI v1.8.66).

**Notes:**
- The changelog appears to only show **Puku CLI** releases in the visible top entries. Puku Editor releases may be paginated or filtered (e.g., the "All" / "Editor" / "CLI" filter at the top of the listing — the snapshot showed "AllEditorCLI" buttons but the default view appears to be CLI-only or weighted toward CLI). The current default view is "All" but the top 5 are all CLI.
- Dates are present in the DOM but rendered as plain text (no `<time>` element). The regex extraction is the only practical way to read them; a future improvement would be to add `<time datetime="...">` for testability.
- Steps 1, 4, 5, 6 pass. Steps 2 and 3 fail due to the homepage/changelog mismatch.
