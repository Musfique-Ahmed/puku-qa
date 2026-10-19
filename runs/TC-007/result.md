# TC-007 — Pricing FAQ accordion expands and collapses

**Date:** 2026-10-19
**Result:** ✅ PASS
**Driver:** @playwright/cli (Chromium, headless)

| # | Step | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | Navigate to /pricing; FAQ section visible | Matches | Page loaded, FAQ section reachable | ✅ |
| 2 | First FAQ ("Which plan should I start with?") starts expanded | aria-expanded=true | aria-expanded="true" | ✅ |
| 3 | Click first FAQ to collapse | aria-expanded=false | aria-expanded="false" after click | ✅ |
| 4 | Click first FAQ to re-expand | aria-expanded=true | aria-expanded="true" after second click | ✅ |
| 5 | Click second FAQ ("Who is the Student plan for?") | aria-expanded=true (was false) | started=false; after click=true | ✅ |
| 6 | Click second FAQ again | aria-expanded=false | aria-expanded="false" after second click | ✅ |

**Evidence:**
- aria-expanded values captured via `eval` on each button ref (e516 for first FAQ, e524 for second).
- Page snapshot at each step confirms only the clicked item's state changed.

**Notes:**
- The accordion is **multi-open** (both items can be open simultaneously), which is implementation-defined per the spec. Both behaviors ("single-open" vs "multi-open") are acceptable; only the clicked item's expanded state is being asserted.
- The accessibility tree uses `aria-expanded` correctly on the question buttons.
