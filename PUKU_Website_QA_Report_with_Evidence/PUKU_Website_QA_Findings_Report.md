<div align="center">

# Puku Website
## Quality Assurance Findings Report

**Visual QA · Content Integrity · Navigation · Contact Workflows**

`Puku Web — Development Environment` · `web.dev.puku.sh`

**Report date:** 20 October 2026  
**Primary automated run:** 19 October 2026  
**Prepared from:** Flow-runner report and manuall QA

</div>

---

## Executive summary

This report consolidates the issues observed during the Puku website QA review. The automated flow-runner run was largely successful: **14 of 15 reported test cases passed, and one failed**. The failed case, **TC-016**, identified a mismatch between the homepage's Puku 2.8 release announcement and the changelog's latest listed release.

Additional manual screenshot review surfaced issues that the existing automated flows did not cover, including contact-email routing, an invalid Discord invitation, stale account/profile content, asset presentation, readability, layout consistency, and the removal of the issue-reporting entry point.

The automated pass rate should not be interpreted as evidence that the entire website is defect-free. The flow-runner report explicitly notes that mobile-only behavior, deeper accessibility auditing, mutation/CRUD workflows, and some authentication completion steps were not fully exercised.

### At a glance

| Measure | Result |
|---|---:|
| Automated test cases reported | 15 |
| Passed | 14 |
| Failed | 1 |
| Additional manually reported findings | 8 |
| Distinct findings in this report | 9 |
| Primary target | `https://web.dev.puku.sh/` |

> **Counting note:** The flow-runner report lists 14 passing rows and one failing row (TC-001–TC-016, with TC-004 noted as “PASS with follow-up”). Its summary line says “Pass: 14 / Fail: 1 / Total executed: 16,” which is internally inconsistent if “Pass” and “Fail” are mutually exclusive. This report uses the individual test-case rows as the basis for the 14-pass/1-fail summary and preserves the follow-up caveat for TC-004.

## Priority overview

Priorities below are triage recommendations based on the supplied evidence and likely user impact. They are not claims that a production incident or data loss has occurred.

| ID | Finding | Recommended priority | Area |
|---|---|---:|---|
| PUKU-QA-001 | Contact form routes Team plan inquiries to the support address | **P1** | Contact / lead routing |
| PUKU-QA-002 | Discord community invitation is invalid | **P2** | External navigation |
| PUKU-QA-003 | Personal profile / usage experience appears outdated | **P2** | Account / product UI |
| PUKU-QA-004 | Homepage release messaging is inconsistent and difficult to read | **P2** | Homepage / content |
| PUKU-QA-005 | Homepage release badge and changelog are inconsistent (TC-016) | **P2** | Release communication |
| PUKU-QA-006 | Puku logo and computer artwork should use transparent-background assets | **P3** | Visual assets |
| PUKU-QA-007 | Puku Chat feature strip breaks the site's content-width consistency | **P3** | Layout / responsive design |
| PUKU-QA-008 | Issue-reporting entry point is no longer available | **P2** | Support / feedback |
| PUKU-QA-009 | Docs page footer has not been updated | **P3** | Documentation / content |

---

## Detailed findings

<a id="puku-qa-001"></a>
### PUKU-QA-001 — Team plan contact inquiries use the wrong recipient

**Priority:** P1 · **Category:** Contact workflow / lead routing  
**Affected page:** [`/contact`](https://web.dev.puku.sh/contact)

#### Observation

The contact form offers a **Team plan** inquiry category, but the reported behavior is that contact scenarios—including Team plan inquiries—are routed to `support@puku.sh`. The intended recipient for Team plan inquiries is `sales@puku.sh`.

The contact page separately lists Support (`support@puku.sh`) and Team & Enterprise (`sales@puku.sh`), which makes the form's reported routing behavior inconsistent with the contact information presented on the same page.

#### Expected behavior

- **Team plan / Team & Enterprise:** address the generated email to `sales@puku.sh`.
- **Support and product-help requests:** address the generated email to `support@puku.sh`.
- Other categories should follow an explicitly defined routing rule rather than silently defaulting to Support.

#### Actual behavior

Team plan inquiries are reported to use `support@puku.sh` instead of the sales inbox.

#### Reproduction

1. Open `https://web.dev.puku.sh/contact`.
2. Enter a name and valid work email.
3. Select **Team plan** under “What's this about?”
4. Complete the remaining required fields.
5. Select **Open email draft**.
6. Inspect the generated draft's recipient.

#### Recommended fix

Centralize category-to-recipient mapping in one explicit configuration or routing function. Add automated tests that assert the recipient for every contact category. Verify the generated `mailto:` URL's `to`, `subject`, and body fields, including correct URL encoding.

#### Acceptance criteria

- Selecting **Team plan** opens a draft addressed to `sales@puku.sh`.
- Selecting **Support** opens a draft addressed to `support@puku.sh`.
- Each remaining category has a documented, tested recipient.
- No category unintentionally falls back to the Support address.


**Screenshot evidence — contact form and routing context**

![Contact page form and contact routes](evidence/08-contact-page-form.png)

---

<a id="puku-qa-002"></a>
### PUKU-QA-002 — Discord community link opens an invalid invitation

**Priority:** P2 · **Category:** External navigation  
**Affected page:** [`/contact`](https://web.dev.puku.sh/contact)  
**Reported destination:** [`https://discord.com/invite/puku`](https://discord.com/invite/puku)

#### Observation

Selecting the Community link on the Contact page opens Discord, which displays **“Invite Invalid”** and states that the invitation may have expired or the visitor may not have permission to join.

This prevents visitors from using the website's advertised community entry point.

#### Expected behavior

The Community link should lead to a valid, active invitation for the official Puku Discord community, with permissions appropriate for intended visitors.

#### Actual behavior

The supplied invitation URL displays Discord's invalid-invitation page.

#### Recommended fix

1. Obtain or generate a verified, current invitation from an authorized Puku Discord administrator.
2. Replace the stale URL wherever it is referenced, not only on the Contact page.
3. Check invitation expiration, usage limits, and server membership requirements.
4. Add a periodic link check where practical, while recognizing that HTTP success alone cannot guarantee an invitation remains joinable.

#### Acceptance criteria

- The published link opens the intended Puku community.
- A logged-in eligible visitor can accept the invitation.
- The link is consistent across the Contact page, footer, and other community references.


**Screenshot evidence — invalid Discord invitation**

![Discord invitation invalid state](evidence/09-discord-invalid-invite.png)

---

<a id="puku-qa-003"></a>
### PUKU-QA-003 — Personal profile and usage pages have not been updated

**Priority:** P2 · **Category:** Account UI / content consistency  
**Affected page shown:** [`/usage`](https://web.dev.puku.sh/usage)

#### Observation

The supplied screenshot of the Usage page shows account-related information and navigation for **Usage**, **Settings**, **API keys**, and **Organization**. The page appears not to have received the same update as the main marketing site. The user specifically reports that personal profile pages have not been updated yet.

The screenshot also shows values such as **Plan: None**, **Requests used: 0 of 0**, and an activity-availability message dated 27 August 2026. These values may be legitimate for the captured account or environment; the screenshot alone does not establish that the underlying account data is incorrect. The confirmed concern is the reported update gap and inconsistent presentation.

#### Expected behavior

Authenticated account/profile pages should use the current product navigation, visual design, terminology, and responsive layout. Account-specific metrics should remain accurate for the signed-in user and clearly explain unavailable or unconfigured quotas.

#### Actual behavior

The Usage/profile experience appears visually or functionally behind the updated public website.

#### Recommended fix

- Audit the full authenticated account area, including Usage, Settings, API keys, Organization, and profile controls.
- Reconcile shared navigation, typography, spacing, theme controls, and component versions with the current design system.
- Validate empty states such as zero quota or no active plan so they communicate whether the account is unconfigured, inactive, or genuinely has no allowance.
- Confirm that activity date labels and account data are driven by the correct environment and timezone.

#### Acceptance criteria

- Account pages follow the approved current design system.
- Navigation and profile controls behave consistently across account routes.
- Quota, plan, and activity states are accurate and unambiguous.
- Desktop and mobile layouts are reviewed before the update is considered complete.


**Screenshot evidence — account Usage page**

![Personal account Usage page](evidence/10-account-usage-page.png)

---

<a id="puku-qa-004"></a>
### PUKU-QA-004 — Homepage release messaging contains questionable information and low-readability text

**Priority:** P2 · **Category:** Homepage content / readability  
**Affected page:** [`Homepage`](https://web.dev.puku.sh/)

#### Observation

The supplied homepage screenshot highlights two concerns:

1. The small release/version line beneath the primary download controls is reported as containing incorrect information.
2. The text is difficult to read against the decorative dot-pattern artwork and dark background.

The screenshot shows the line **“Version 2.8 for Apple Silicon · Windows and Linux in beta”**. This report records that as the displayed text in the screenshot, not as a verified statement about the actual release state.

#### Expected behavior

Homepage release messaging should match the actual release and platform-support state. Supporting text should remain legible against all backgrounds and at common desktop and mobile viewport sizes.

#### Actual behavior

The displayed release/platform statement is reported to be inaccurate, and its low contrast or visual interference makes it difficult to read.

#### Recommended fix

- Confirm the authoritative release version and platform-support status with the product/release owner.
- Render version and platform availability from a single release metadata source where feasible.
- Increase foreground/background contrast and avoid placing small text directly over visually busy artwork.
- Review font size, weight, line height, and responsive wrapping at standard viewport widths.
- Check contrast against WCAG 2.2 AA targets: generally **4.5:1 for normal text** and **3:1 for large text**.

#### Acceptance criteria

- Version and platform-support claims match the approved release information.
- Supporting text is readable without relying on zoom.
- Contrast meets the applicable accessibility target.
- The text remains legible when the page is resized and when the theme changes.


**Screenshot evidence — homepage release/platform text**

![Homepage release and platform text](evidence/11-homepage-release-text.png)

---

<a id="puku-qa-005"></a>
### PUKU-QA-005 — Homepage “NEW Puku 2.8” badge does not match the changelog (TC-016)

**Priority:** P2 · **Category:** Release communication / content integrity  
**Affected pages:** [`Homepage`](https://web.dev.puku.sh/) · [`Changelog`](https://web.dev.puku.sh/changelog)  
**Automated evidence:** [TC-016 result](https://github.com/Musfique-Ahmed/puku-qa/blob/main/runs/TC-016/result.md) · [Full flow-runner report](https://github.com/Musfique-Ahmed/puku-qa/blob/main/runs/REPORT.md)

#### Observation

The homepage advertises **“NEW Puku 2.8 · subagents in parallel”** as the latest release. The latest changelog entry shown in the 19 October 2026 flow-runner run is **Puku CLI v1.8.66**, dated **7 October 2026**. The changelog does not list a **Puku Editor 2.8.0** release.

#### Expected behavior

The homepage's release badge should point to a published release entry that substantiates the version and feature claim. The changelog should make the latest release for the relevant product surface discoverable.

#### Actual behavior

The homepage promotes Puku 2.8, but the changelog's newest entry is Puku CLI v1.8.66. A visitor following the release claim cannot find the corresponding Puku Editor 2.8.0 entry.

#### Automated reproduction

1. Open the homepage and record the “NEW Puku 2.8 · subagents in parallel” badge.
2. Follow the badge or open the changelog.
3. Inspect the most recent changelog entry.
4. Compare the release product, version, date, and feature claim.

#### Recommended fix

Choose and implement one source-of-truth-consistent resolution:

- **Option A:** Publish a Puku Editor 2.8.0 changelog entry with verified release notes, date, and feature details, if the release is genuinely available.
- **Option B:** Update the homepage badge and destination to reflect the actual latest published release.

Do not publish a release entry merely to make the pages agree if the release has not shipped.

#### Acceptance criteria

- The homepage release badge points to a real, published changelog entry.
- Version, product surface, release date, and feature description agree across both pages.
- TC-016 passes after the fix and is retained as a regression test.

#### Flow-runner result

The 19 October 2026 report records TC-016 as **FAIL (P2)**. The other reported scenarios passed, with TC-004 carrying a follow-up caveat for the final post-confirm authentication snapshot. See the test-run report for the full evidence and scope limitations.


**Screenshot evidence — homepage badge and changelog**

![Homepage Puku 2.8 badge](evidence/12-homepage-new-release-badge.png)

![Changelog latest release](evidence/13-changelog-latest-release.png)

---

<a id="puku-qa-006"></a>
### PUKU-QA-006 — Puku logo and computer illustration need transparent-background assets

**Priority:** P3 · **Category:** Asset quality / visual polish  
**Affected page shown:** [`/puku-chat`](https://web.dev.puku.sh/puku-chat)

#### Observation

The supplied Puku Chat screenshots highlight two visual assets:

- The Puku logo displayed in the product interface.
- A retro-computer illustration displayed in the chat landing section.

The request is to use versions of both assets with their backgrounds removed. The computer illustration currently appears inside a light rectangular background, which clashes with the surrounding dark interface. The logo is also called out for background removal.

#### Expected behavior

Both assets should integrate cleanly with the site's dark and light themes, without an unintended rectangular background or halo around transparent edges.

#### Recommended fix

- Use the official logo artwork exported with a genuinely transparent alpha channel (for example, SVG or transparent PNG), rather than applying a visual workaround to a flattened image.
- Use a properly isolated computer illustration with a transparent background and clean edges.
- Preserve the intended original artwork, aspect ratio, and brand colors.
- Verify asset rendering on both light and dark backgrounds and at high-density displays.
- If the original source is unavailable, request a licensed/source asset from the design owner rather than attempting to remove a background in a way that damages the subject.

#### Acceptance criteria

- No unwanted solid rectangle is visible behind either asset.
- Transparent edges are clean and do not show white fringes.
- Both assets retain the correct dimensions and visual quality on supported themes and viewport sizes.


**Screenshot evidence — logo and computer artwork**

![Puku Chat logo and computer artwork](evidence/15-puku-chat-logo-and-computer-artwork.png)

---

<a id="puku-qa-007"></a>
### PUKU-QA-007 — Puku Chat feature strip spans the viewport and breaks layout consistency

**Priority:** P3 · **Category:** Layout / design consistency  
**Affected page:** [`/puku-chat`](https://web.dev.puku.sh/puku-chat)

#### Observation

The feature strip containing **“Not used for training,” “Delete any time,”** and **“Shared projects”** stretches across nearly the full browser viewport. Other major sections on the same site use a centered, constrained content width. The supplied screenshot marks this strip and the surrounding area as the inconsistent region.

#### Expected behavior

The feature strip should align to the same content grid and maximum-width rules as neighboring sections, with consistent horizontal padding and responsive behavior.

#### Actual behavior

The strip spans much more widely than the site's other content sections, weakening alignment and creating a visual discontinuity.

#### Recommended fix

- Reuse the site's shared page-container component or design token for maximum content width.
- Apply consistent horizontal padding at desktop, tablet, and mobile breakpoints.
- Keep the three feature items within the same container; use a three-column layout on wide screens and a responsive stack or grid on narrow screens.
- Avoid one-off viewport-width styling unless a full-bleed section is intentional and consistently designed.

#### Acceptance criteria

- The strip aligns with the primary content edges used by adjacent sections.
- Feature columns have consistent spacing and vertical alignment.
- No horizontal overflow is introduced at mobile widths.
- Full-width sections elsewhere remain unaffected.


**Screenshot evidence — full-width feature strip**

![Puku Chat full-width feature strip](evidence/16-puku-chat-full-width-feature-strip.png)

---

<a id="puku-qa-008"></a>
### PUKU-QA-008 — The issue-reporting entry point is missing

**Priority:** P2 · **Category:** Supportability / feedback workflow  
**Affected page:** Website-wide; exact previous location not confirmed

#### Observation

The user reports that there is **no longer a way to report an issue as there was before**. The previous entry point appears to have been removed or is no longer discoverable.


#### Expected behavior

Visitors should have a clear, discoverable way to report a website or product issue without having to locate an unrelated support channel manually. The reporting path should make it possible to describe the problem and, where appropriate, provide the affected page and relevant diagnostic context.

#### Actual behavior

The previous issue-reporting path is reportedly absent, leaving no obvious equivalent route from the website.

#### Recommended fix

- Restore the prior **Report an issue** entry point or provide an explicitly equivalent replacement.
- Place it in a predictable location, such as the site footer, Help/Support menu, or relevant product interface.
- Route submissions to the appropriate support or issue-tracking workflow.
- Include the current page URL and optional reproduction steps; make screenshots or diagnostic attachments optional where supported.
- Provide a clear success state and an alternative contact path if submission fails.
- Avoid exposing secrets, access tokens, private user data, or sensitive logs in automatically attached diagnostics.

#### Acceptance criteria

- A visitor can find the reporting option from the intended website areas.
- The form or link successfully opens the documented reporting workflow.
- The user receives clear confirmation or an understandable failure state.
- The route is tested end-to-end, including required-field validation and failure handling.

#### Clarification for implementation

The exact former placement and whether the old control opened a form, email draft, or external issue tracker were not established by the supplied evidence. Confirm the previous behavior before choosing the replacement implementation.

---

<a id="puku-qa-009"></a>
### PUKU-QA-009 — Docs page footer has not been updated

**Priority:** P3 · **Category:** Documentation / content consistency  
**Affected page:** [`/docs`](https://web.dev.puku.sh/docs)

#### Observation

The supplied screenshot of the Docs page shows a footer that appears not to have been updated alongside the rest of the website. The footer contains product links, resource links, company/legal links, social links, a theme selector, copyright information, and company/trade-license details.

The evidence establishes a reported update gap, but does not identify every specific footer item that is stale. Those details should be verified before editing legal or company information.

#### Expected behavior

The Docs footer should use the current shared site footer and display accurate, consistent navigation and company information.

#### Actual behavior

The Docs page footer appears outdated relative to the current site experience.

#### Recommended fix

- Compare the Docs footer with the current canonical footer used on the main website.
- Prefer one shared footer component or shared content configuration to prevent route-specific drift.
- Verify product/resource links and ensure they point to current destinations.
- Confirm company, copyright, and legal text with the appropriate owner before changing it.
- Check theme switching, keyboard navigation, and responsive layout.

#### Acceptance criteria

- The Docs page uses the approved current footer structure and content.
- Footer links resolve to the intended pages and do not produce 404s.
- Legal and company details remain accurate.
- Footer presentation is consistent across public routes and both themes.


**Screenshot evidence — Docs footer**

![Docs page footer](evidence/07-docs-footer-outdated.png)

---

## Automated flow-runner results

The following table transcribes the individual test-case rows in the supplied [flow-runner report](https://github.com/Musfique-Ahmed/puku-qa/blob/main/runs/REPORT.md). The original report remains the source of truth for detailed test evidence.

| Test case | Scenario | Reported result |
|---|---|---|
| TC-001 | Homepage renders | PASS |
| TC-002 | Header links route correctly | PASS |
| TC-003 | Login providers presence | PASS — presence only |
| TC-004 | Email magic link with valid email | PASS with follow-up |
| TC-005 | Email magic-link validation | PASS |
| TC-006 | Pricing plans and Individual/Teams toggle | PASS |
| TC-007 | Pricing FAQ accordion | PASS |
| TC-008 | Docs hub list | PASS |
| TC-009 | Docs sidebar navigation | PASS |
| TC-010 | Docs Cmd+K search | PASS |
| TC-011 | Blog category filter | PASS |
| TC-012 | Contact form mailto handoff | PASS |
| TC-013 | Theme toggle | PASS |
| TC-014 | Footer links do not return 404 | PASS |
| TC-015 | Product sub-pages | PASS |
| TC-016 | Changelog recency | **FAIL — P2** |

### Important scope limitations

The source report identifies the following gaps, which should be considered when interpreting the green results:

- **OAuth completion:** TC-003 checked provider presence; it did not complete the full OAuth round-trip.
- **Magic-link completion:** TC-004 reached the CSRF confirmation page, but the final confirmation click and post-authentication snapshot were not re-run in that session.
- **Mutation/CRUD:** These scenarios were out of scope because the target environment was not marked safe to mutate.
- **Accessibility:** No comprehensive axe-core or pa11y audit was run.
- **Mobile:** The run used a desktop-default viewport and does not rule out mobile-specific regressions.

The manually reported findings in this document are additional to the automated test cases; they should not be treated as failures already detected by the flow-runner.

---

## Recommended remediation order

The order below prioritizes business impact and user-facing blockage. Reassess after engineering confirms the underlying implementation and release state.

### Phase 1 — Restore important user journeys

1. **PUKU-QA-001:** Correct Team plan email routing to Sales and test every contact category.
2. **PUKU-QA-008:** Restore a discoverable issue-reporting workflow.
3. **PUKU-QA-002:** Replace the invalid Discord invitation with a verified active link.

### Phase 2 — Correct release and account information

4. **PUKU-QA-005:** Resolve the homepage/changelog mismatch and rerun TC-016.
5. **PUKU-QA-004:** Verify the homepage version/platform statement and improve text readability.
6. **PUKU-QA-003:** Audit and update the personal profile/account pages.

### Phase 3 — Align the visual system

7. **PUKU-QA-006:** Replace the logo and computer illustration with transparent-background assets.
8. **PUKU-QA-007:** Constrain the Puku Chat feature strip to the shared content grid.
9. **PUKU-QA-009:** Update the Docs footer using the canonical shared component.

---

## Regression and verification checklist

Use this checklist to close findings consistently and preserve the fixes.

- [ ] **Contact routing:** Verify each contact category's generated email recipient, subject, and body.
- [ ] **Discord link:** Open the invitation and confirm it reaches the intended community.
- [ ] **Account pages:** Review Usage, Settings, API keys, Organization, and profile/navigation behavior.
- [ ] **Homepage copy:** Verify version, release status, platform support, contrast, and text wrapping.
- [ ] **Release consistency:** Confirm homepage badge, changelog entry, version, date, and feature description; rerun TC-016.
- [ ] **Transparent assets:** Inspect logo and computer artwork on both dark and light backgrounds.
- [ ] **Layout consistency:** Check the Puku Chat feature strip at desktop, tablet, and mobile widths.
- [ ] **Issue reporting:** Complete a report submission or open the intended reporting workflow and verify feedback to the user.
- [ ] **Docs footer:** Verify links, shared styling, theme behavior, legal copy, and responsive presentation.
- [ ] **Broader regression:** Rerun the existing sanity suite and document any skipped or partially completed steps.

## Evidence and source material

- **Primary target:** [https://web.dev.puku.sh/](https://web.dev.puku.sh/)
- **Automated flow-runner report:** [runs/REPORT.md](https://github.com/Musfique-Ahmed/puku-qa/blob/main/runs/REPORT.md)
- **TC-016 detailed result:** [runs/TC-016/result.md](https://github.com/Musfique-Ahmed/puku-qa/blob/main/runs/TC-016/result.md)
- **Pages represented in supplied screenshots:** `/docs`, `/contact`, `/usage`, `/`, `/changelog`, and `/puku-chat`
- **Evidence basis:** Screenshots and issue descriptions supplied during this QA conversation, plus the linked automated run report.

### Reporting conventions

- **P1:** Important user journey or business workflow is impaired; prioritize prompt remediation.
- **P2:** Meaningful content, navigation, release-communication, or supportability issue; schedule for the next appropriate fix cycle.
- **P3:** Visual consistency, polish, or lower-impact content issue; address as part of the relevant design/content pass.

These priorities are recommendations for triage, not a substitute for the team's incident/severity policy.



## Complete screenshot evidence gallery

All **16 screenshots supplied in the conversation** are included in this package. Images are stored as local PNG files under `evidence/` and linked with relative paths, so the report remains readable after the ZIP is extracted. The first eight images above are embedded in the relevant findings where the relationship is clear; the full gallery below preserves every submitted screenshot for review.

### Evidence 01 — Footer/navigation content screenshot

![Evidence 01: Footer/navigation content screenshot](evidence/01-footer-navigation-content.png)

### Evidence 02 — Payment/checkout state screenshot

![Evidence 02: Payment/checkout state screenshot](evidence/02-payment-checkout-state.png)

### Evidence 03 — Puku Support page screenshot

![Evidence 03: Puku Support page screenshot](evidence/03-puku-support-page.png)

### Evidence 04 — Product overview and cards screenshot

![Evidence 04: Product overview and cards screenshot](evidence/04-product-overview-cards.png)

### Evidence 05 — Pricing plans screenshot

![Evidence 05: Pricing plans screenshot](evidence/05-pricing-plans.png)

### Evidence 06 — Homepage/footer links screenshot

![Evidence 06: Homepage/footer links screenshot](evidence/06-homepage-footer-links.png)

### Evidence 07 — Docs page footer screenshot

![Evidence 07: Docs page footer screenshot](evidence/07-docs-footer-outdated.png)

### Evidence 08 — Contact page form and contact routes screenshot

![Evidence 08: Contact page form and contact routes screenshot](evidence/08-contact-page-form.png)

### Evidence 09 — Discord invitation invalid-state screenshot

![Evidence 09: Discord invitation invalid-state screenshot](evidence/09-discord-invalid-invite.png)

### Evidence 10 — Personal account Usage page screenshot

![Evidence 10: Personal account Usage page screenshot](evidence/10-account-usage-page.png)

### Evidence 11 — Homepage release/platform text screenshot

![Evidence 11: Homepage release/platform text screenshot](evidence/11-homepage-release-text.png)

### Evidence 12 — Homepage Puku 2.8 badge screenshot

![Evidence 12: Homepage Puku 2.8 badge screenshot](evidence/12-homepage-new-release-badge.png)

### Evidence 13 — Changelog latest CLI release screenshot

![Evidence 13: Changelog latest CLI release screenshot](evidence/13-changelog-latest-release.png)

### Evidence 14 — Puku Chat feature preview screenshot

![Evidence 14: Puku Chat feature preview screenshot](evidence/14-puku-chat-feature-preview.png)

### Evidence 15 — Puku Chat logo and computer artwork screenshot

![Evidence 15: Puku Chat logo and computer artwork screenshot](evidence/15-puku-chat-logo-and-computer-artwork.png)

### Evidence 16 — Puku Chat full-width feature strip screenshot

![Evidence 16: Puku Chat full-width feature strip screenshot](evidence/16-puku-chat-full-width-feature-strip.png)

---

<div align="center">

**End of report**

*Prepared for engineering triage and QA follow-up.*

</div>
