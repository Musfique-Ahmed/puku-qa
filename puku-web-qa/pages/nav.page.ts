import { type Page, type Locator } from '@playwright/test';

/**
 * Shared navigation interactions.
 * Selectors are intentionally tolerant — many marketing sites use
 * "Product" as either a button (dropdown) or a link. We accept both.
 */
export class NavPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Open the Product menu if it's a dropdown; otherwise treat as a link. */
  async openProduct(): Promise<void> {
    const productTrigger = this.page.getByRole('button', { name: /^product$/i }).first();
    if (await productTrigger.count()) {
      await productTrigger.click().catch(() => undefined);
    }
  }

  /** Open the Docs menu if it's a dropdown. */
  async openDocs(): Promise<void> {
    const docsTrigger = this.page.getByRole('button', { name: /^docs$/i }).first();
    if (await docsTrigger.count()) {
      await docsTrigger.click().catch(() => undefined);
    }
  }

  /** Click a nav link to a product by visible name (Editor, CLI, Graph, ...). */
  async clickProductLink(name: string | RegExp): Promise<void> {
    await this.openProduct();
    await this.page.getByRole('link', { name }).first().click();
  }

  /** Click a nav link to docs. */
  async clickDocsLink(name: string | RegExp): Promise<void> {
    await this.openDocs();
    await this.page.getByRole('link', { name }).first().click();
  }
}
