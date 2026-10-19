# Test Case: [TC-011] — Blog category filter narrows the listing

**Priority:** P2
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S011

## Preconditions
- Anonymous browser session.
- The blog has at least one post in each of the four categories: All, Product, Engineering, Guides.

## Test data
- Blog URL: `https://web.dev.puku.sh/blog`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/blog` | Page loads; H1 reads "Notes from the workbench." |
| 2 | Inspect the filter group near the top of the listing | Four filter buttons are visible, in order: All, Product, Engineering, Guides. "All" is currently pressed/active. |
| 3 | Count the visible post cards under the filter group | N ≥ 4 (the full set) |
| 4 | Click the "Product" filter button | The button gains the pressed/active state; the "All" button loses it. The visible post cards narrow to only Product-tagged posts. Count is M where 1 ≤ M < N. |
| 5 | Click the "Engineering" filter button | The visible post cards narrow to only Engineering-tagged posts. Count is K where 1 ≤ K < N. |
| 6 | Click the "Guides" filter button | The visible post cards narrow to only Guides-tagged posts. Count is J where 1 ≤ J < N. |
| 7 | Click the "All" filter button | The full set is restored (N posts visible again). |
| 8 | Reload the page | The page re-renders with "All" active and N posts visible (filter state is not persisted across reloads) |

## Postconditions
- None. Filter is client-side state; no URL change, no server side effect.

## Notes
- Filter is a client-side narrowing, not a separate page — assert on visible cards, not URL changes.
- The "Try what we write about" CTA at the bottom is not part of the listing and is not affected by the filter.
- Post counts M, K, J depend on the live blog; do not hardcode them, only assert `1 ≤ count < N`.
