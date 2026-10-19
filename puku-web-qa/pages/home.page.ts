import { type Page, type Locator } from '@playwright/test';

/**
 * Page object for the homepage (https://web.dev.puku.sh/).
 * Selectors are intentionally loose — we look for visible marketing copy,
 * not specific class names that the site may rename.
 */
export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Primary CTA in the hero — "Download for <OS>" (text varies by user-agent).
   * We match either the macOS or Windows wording.
   */
  get heroPrimaryCta(): Locator {
    return this.page
      .getByRole('link', { name: /download for (macos|windows|linux)/i })
      .first();
  }

  /** Secondary CTA — "Read the Puku Editor docs". */
  get heroSecondaryCta(): Locator {
    return this.page
      .getByRole('link', { name: /read the puku editor docs|puku editor docs/i })
      .first();
  }

  /** Any visible h1 in the hero. */
  get heroHeadline(): Locator {
    return this.page.locator('h1').first();
  }

  /** Pillar section by its visible heading text. */
  pillarSection(title: string | RegExp): Locator {
    return this.page.locator('section', { has: this.page.getByRole('heading', { name: title }) }).first();
  }

  /** Logo strip — best-effort: every img inside a "trusted by" region. */
  get trustedByLogos(): Locator {
    return this.page.locator('img').filter({ hasNot: this.page.locator('[role="presentation"]') });
  }

  /** Footer link by visible name. */
  footerLink(name: string | RegExp): Locator {
    return this.page.getByRole('link', { name }).last();
  }

  /** Capture a full-page screenshot for visual review. */
  async captureFullPage(path: string): Promise<void> {
    await this.page.screenshot({ path, fullPage: true });
  }
}
