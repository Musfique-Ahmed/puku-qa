# Test Case: [TC-008] — Docs hub lists all four product doc trees and each card links to its introduction page

**Priority:** P0
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S008

## Preconditions
- Anonymous browser session.

## Test data
- Docs hub URL: `https://web.dev.puku.sh/docs`
- Expected introduction URLs: `/docs/puku-editor/introduction`, `/docs/puku-cli/introduction`, `/docs/puku-chat/introduction`, `/docs/puku-app/introduction`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/docs` | Page loads; H1 reads "Documentation" |
| 2 | Inspect the "Products" list | Exactly four product cards are present, in order: Puku Editor, Puku CLI, Puku Chat, Puku App |
| 3 | Each card shows a name (heading), a one-line description, and a "Read docs" link | All four cards have these three elements |
| 4 | Inspect the "Read docs" link on the Puku Editor card | `href` equals `/docs/puku-editor/introduction` |
| 5 | Click the Puku Editor "Read docs" link | Browser navigates to `/docs/puku-editor/introduction`; document title is `Introduction \| Puku Editor`; HTTP 200 |
| 6 | Navigate back to `/docs` | Page loads; cards are still present |
| 7 | Repeat steps 4-5 for Puku CLI, Puku Chat, and Puku App "Read docs" links | Each click navigates to the correct `/docs/<product>/introduction` URL with HTTP 200 and a non-empty document title |

## Postconditions
- None. All targets are read-only.

## Notes
- This is the primary discoverability surface for the four product docs; if a card disappears, users will silently lose access to that product's documentation.
- The "Start with Puku Editor" button near the top of the hub is a separate CTA and is not part of this test.
