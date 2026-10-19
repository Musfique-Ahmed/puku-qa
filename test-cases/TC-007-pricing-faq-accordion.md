# Test Case: [TC-007] — Pricing FAQ accordion expands and collapses

**Priority:** P2
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S007

## Preconditions
- Anonymous browser session.
- The first FAQ ("Which plan should I start with?") is rendered open by default per the snapshot.

## Test data
- Pricing URL: `https://web.dev.puku.sh/pricing`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/pricing` | Page loads; scroll to the FAQ section (H2 "Questions.") |
| 2 | Inspect the first FAQ item ("Which plan should I start with?") | It is currently `expanded` (the `<button>` has `aria-expanded="true"` and the answer paragraph "Start with the Test plan..." is visible) |
| 3 | Click the first FAQ button to collapse it | The `<button>` gains `aria-expanded="false"`; the answer paragraph is no longer visible |
| 4 | Click the first FAQ button to expand it again | The `<button>` regains `aria-expanded="true"`; the answer paragraph is visible again |
| 5 | Click the second FAQ item ("Who is the Student plan for?") | The second FAQ expands; behavior is single-open (the first may stay open, or the first may close — both are acceptable per the test snapshot's behavior) |
| 6 | Click the second FAQ button again | The second FAQ collapses; the first FAQ's state is whatever it was before step 5 |

## Postconditions
- None. Read-only interaction.

## Notes
- "Stacked open" vs "single open" behavior is implementation-defined; assert only on the clicked item's expanded/collapsed state.
- The "Read the refund policy" link at the top of the FAQ is not part of the accordion — do not assert on it.
