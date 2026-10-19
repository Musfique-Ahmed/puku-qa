# Test Case: [TC-001] — Homepage renders with hero, primary CTAs, and visible nav

**Priority:** P0
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S001

## Preconditions
- Anonymous browser session (no cookies, no localStorage from a prior auth flow).
- Default viewport (1280×720 desktop).
- System theme is `light` (homepage copies its initial theme from a `radiogroup` whose default is `light`).

## Test data
- Target URL: `https://web.dev.puku.sh/`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/` | Page loads with HTTP 200; document title is `Puku: one environment for AI-assisted development, design and execution` |
| 2 | Wait for the H1 to render | H1 contains the text "A calm workbench for shipping software." (with span-rendered words; assert on the visible string, not exact markup) |
| 3 | Inspect the primary navigation list inside `<nav aria-label="Main">` | The list contains exactly five items in this order: Product, Pricing, Docs, Resources, Contact |
| 4 | Inspect the hero CTA group | Two CTAs are visible: a link "Download for Mac" (href starts with `/download`) and a button with the install command label `curl -fsSL https://puku-cli.pkgs.puku.sh/install.sh \| bash` |
| 5 | Inspect the support copy under the CTAs | The paragraph "Version 2.8 for Apple Silicon · Windows and Linux in beta" is visible |
| 6 | Open the browser console | No uncaught errors and no `error`-level console messages are logged on load |

## Postconditions
- None. Anonymous, read-only page; no state left behind.

## Notes
- If step 2 fails, the whole marketing funnel is effectively down — treat as a P0 incident.
- The `Product` nav item is a `<button>` (hover/focus dropdown) while the other four are `<a>` links — assert on role, not tag.
- The body content of the homepage is heavy with decorative SVG/imagery; do not assert on a specific H1 DOM structure, only on the visible text.
