# Test Case: [TC-015] — Each product sub-page renders a unique hero and a working Download CTA

**Priority:** P1
**Status:** Inferred from exploration, not yet verified
**Source:** scenario-mapper row S015

## Preconditions
- Anonymous browser session.

## Test data
- Targets:
  - `https://web.dev.puku.sh/puku-editor`
  - `https://web.dev.puku.sh/puku-cli`
  - `https://web.dev.puku.sh/puku-chat`
  - `https://web.dev.puku.sh/puku-app`

## Steps

| # | Action | Expected Result |
|---|---|---|
| 1 | Navigate to `https://web.dev.puku.sh/puku-editor` | Page loads; HTTP 200; document title is `Puku Editor — AI-Native Development Environment`; H1 contains "Puku Editor" (exact text varies; assert on the product name being present) |
| 2 | On the Puku Editor page, locate the primary CTA in the hero | The CTA is visible and its text is "Download for macOS" with a "→" arrow. Its `href` is `/download` (or starts with it). |
| 3 | Navigate to `https://web.dev.puku.sh/puku-cli` | Page loads; HTTP 200; document title is `Puku CLI — Terminal-Native Infrastructure Operations`; H1 contains "Puku CLI" |
| 4 | On the Puku CLI page, locate the primary CTA | The CTA is visible and its text is "Install the CLI" with a "→" arrow. Its `href` is `/download` or starts with the install command. |
| 5 | Navigate to `https://web.dev.puku.sh/puku-chat` | Page loads; HTTP 200; document title is `Puku Chat \| Chat, research, and create in your browser`; H1 contains "Puku Chat" |
| 6 | On the Puku Chat page, locate the primary CTA | The CTA is visible and its text is "Open Puku Chat" with a "→" arrow. Its `href` is the chat app URL (likely `/app/chat` or a redirect to `chat.puku.sh`) |
| 7 | Navigate to `https://web.dev.puku.sh/puku-app` | Page loads; HTTP 200; document title is `Puku App \| Mobile chats and projects`; H1 contains "Puku App" |
| 8 | On the Puku App page, locate the primary CTA | The CTA is visible and its text is "Learn about Puku App" with a "→" arrow. Its `href` is internal (likely `/docs/puku-app/introduction`) |
| 9 | Inspect the four H1s side-by-side | Each H1 contains the corresponding product name; no two H1s are identical |

## Postconditions
- None. Read-only pages.

## Notes
- This is a "no template-shared 404 fallback" check. If a future deploy accidentally falls back to a generic page, all four H1s would be identical or empty — step 9 catches that.
- The exact CTA hrefs (especially for Puku Chat, which may link to a separate subdomain) can drift; assert on the CTA text and the link being non-empty, not the exact href.
- The CTA `→` glyph is decorative; assert on the visible label text, not on the arrow.
