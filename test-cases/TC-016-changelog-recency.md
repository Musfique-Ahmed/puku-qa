# Test Case: [TC-016] — Changelog lists recent releases in reverse-chronological order

**Priority:** P2
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S016

## Preconditions
- Anonymous browser session.
- The homepage currently advertises "NEW Puku 2.8 · subagents in parallel" — that release must be the most recent on `/changelog`.

## Test data
- Changelog URL: `https://web.dev.puku.sh/changelog`
- Expected top entry: a release dated on or after the homepage's "NEW" badge date, with the version `2.8` and a description mentioning "subagents in parallel" or similar.

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/changelog` | Page loads; H1 reads "Changelog" |
| 2 | Locate the first release entry in the list | The first entry is a Puku Editor release with version `2.8` and a description that mentions "subagents" or "parallel" |
| 3 | Inspect the first release's date | The date is on or after the date shown in the homepage "NEW" badge (the homepage and the changelog are kept in sync) |
| 4 | Inspect the next three release entries | Each has a version (semver), a surface label (CLI, Editor, CHAT, etc.), a one-line description, and a date |
| 5 | Verify the dates of the first five entries are non-increasing | entry[i].date ≥ entry[i+1].date for all i in [0, 4] (newest first) |
| 6 | Inspect the network log | A single 200 response; no 404s; no redirect loops |

## Postconditions
- None. Read-only page.

## Notes
- "Reverse-chronological" means newest first. If two entries share a date, the order between them is implementation-defined.
- The "Full changelog →" link at the top of the homepage's release strip and the "Full changelog" link on the changelog page itself both go to `/changelog` — confirm only one destination.
- The release surfaces currently visible in the snapshot: 1.8.66 (CLI), 2.7.0 (Editor), 1.8.65 (CLI), 0.9.0 (CHAT). The 2.8 release is the next one after these. The test should NOT hardcode the exact list; only assert on the ordering invariant.
