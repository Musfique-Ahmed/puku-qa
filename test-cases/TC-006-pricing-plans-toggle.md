# Test Case: [TC-006] — Pricing page renders all six plans and lets you switch between Individual and Teams

**Priority:** P0
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S006

## Preconditions
- Anonymous browser session.
- Default viewport (1280×720).
- The "Yearly" billing toggle is currently disabled by design — see Notes. Do not treat this as a regression.

## Test data
- Pricing URL: `https://web.dev.puku.sh/pricing`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/pricing` | Page loads; H1 reads "Pricing" |
| 2 | Locate the audience group (`Choose audience`) | Two buttons are visible: "Individual" (pressed/active) and "Teams" |
| 3 | Locate the billing period group | Two buttons are visible: "Monthly" (pressed/active) and "Yearly" (disabled) |
| 4 | Inspect the plan list under the controls | Six plan cards are rendered, in this order: Free, Test Package, Student Package, Pro, Power, Max |
| 5 | Confirm each plan card has a name (heading), a price, and a CTA link | All six cards have an H2 with the plan name; price text is visible (e.g. "Free", "$1 /mo", "$20 /mo", "$100 /mo"); CTA links are present and start with `/login?next=%2Fpricing` (or `/docs` for the Free plan) |
| 6 | Click the "Teams" audience button | The button gains the pressed/active state; the rendered plan list updates (the comparison table and "Team & Enterprise" section copy become prominent); no full-page navigation occurs (URL is unchanged) |
| 7 | Click the "Individual" audience button | The button regains the pressed/active state; the plan list returns to the Individual view |

## Postconditions
- None. Read-only page; no state left behind.

## Notes
- "Yearly" is intentionally disabled. The site copy says "Monthly billing only" — if a future run finds Yearly enabled, that is an enhancement, not a regression.
- The audience toggle is client-side; assert on visible cards, not URL changes.
- The "Compare features across plans" table near the bottom is the same regardless of audience; do not re-assert it under Teams.
