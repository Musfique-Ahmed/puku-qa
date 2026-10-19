# Puku Web QA

Playwright-based end-to-end QA audit for [https://web.dev.puku.sh/](https://web.dev.puku.sh/).

## What's covered

- **Marketing & SEO** — homepage hero, navigation, product sections, footer, "Trusted By" logos.
- **Auth** — `/login` form rendering and validation.
- **Downloads** — `/download?platform=darwin-arm64` asset resolution.
- **Pricing** — `/pricing` plans and CTAs.
- **Docs** — `/docs/puku-editor/introduction` and `/docs/puku-cli/introduction` with sidebar nav.
- **Changelog** — `/changelog` listing + per-version pages.
- **Contact form** — `/contact` validation and submit.
- **Legal** — `/terms`, `/privacy`, `/support`, `/refund`.
- **External links** — Discord, GitHub, YouTube, LinkedIn.
- **Hygiene** — no console errors, no broken images, no 404s, no uncaught exceptions on any visited page.

## Setup

```bash
cd puku-web-qa
npm install
npx playwright install --with-deps chromium firefox webkit
```

## Run

```bash
# Default — chromium desktop only (fastest feedback loop).
npm test

# Full browser + viewport matrix.
npm run test:full

# Open the HTML report from the last run.
npm run test:report

# Headed (watch the browser).
npm run test:headed

# Interactive UI mode.
npm run test:ui

# Just the smoke / hygiene checks.
npm run test:smoke
```

## Project layout

```
puku-web-qa/
├── playwright.config.ts     # browser/viewport matrix, base URL, reporters
├── tests/                   # one spec per concern
│   ├── homepage.spec.ts
│   ├── navigation.spec.ts
│   ├── downloads.spec.ts
│   ├── pricing.spec.ts
│   ├── login.spec.ts
│   ├── contact.spec.ts
│   ├── docs.spec.ts
│   ├── changelog.spec.ts
│   ├── legal.spec.ts
│   ├── external-links.spec.ts
│   └── hygiene.spec.ts      # runs first — surfaces systemic issues
├── pages/                   # page object modules
│   ├── home.page.ts
│   ├── nav.page.ts
│   └── form.page.ts
└── README.md
```

## Pass criteria

- 0 hard failures on the chromium-desktop project.
- No broken images, console errors, 404s, or 5xx responses on any visited page.
- All navigation flows reachable without 4xx/5xx.
- Every CTA in marketing copy resolves to a working page or asset.

## Failures

Failures auto-screenshot, trace, and record video on first retry. The HTML report at `playwright-report/index.html` groups failures by spec file.

## Notes

- Form submissions on `/login` and `/contact` are tested for **render + validation only**, not full end-to-end submission (no real account creation).
- The download test verifies the route returns/redirects to a downloadable asset — it does not actually save the binary.
- External-link tests assert 2xx/3xx to the expected domain. Some social platforms can rate-limit headless browsers; persistent failures should be marked `test.fixme`.
