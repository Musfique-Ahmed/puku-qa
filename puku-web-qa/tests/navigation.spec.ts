import { test, expect } from '@playwright/test';
import { NavPage } from '../pages/nav.page';

test.describe('Navigation — top menus and in-page anchors', () => {
  test('Product / Docs nav triggers exist', async ({ page }) => {
    await page.goto('/');
    // Tolerate either button- or link-style triggers.
    const productLink = page.getByRole('link', { name: /^product$/i }).first();
    const docsLink = page.getByRole('link', { name: /^docs$/i }).first();
    const productButton = page.getByRole('button', { name: /^product$/i }).first();
    const docsButton = page.getByRole('button', { name: /^docs$/i }).first();

    const productExists = (await productLink.count()) > 0 || (await productButton.count()) > 0;
    const docsExists = (await docsLink.count()) > 0 || (await docsButton.count()) > 0;
    expect(productExists, 'Product nav trigger exists').toBe(true);
    expect(docsExists, 'Docs nav trigger exists').toBe(true);
  });

  test('clicking the Docs link routes to the docs root', async ({ page }) => {
    await page.goto('/');
    const docsTrigger = page
      .getByRole('link', { name: /^docs$/i })
      .or(page.getByRole('button', { name: /^docs$/i }))
      .first();
    if ((await docsTrigger.count()) === 0) {
      test.skip(true, 'No Docs trigger on homepage.');
      return;
    }
    const href = await docsTrigger.getAttribute('href');
    if (href && href.startsWith('/')) {
      await docsTrigger.click();
      await expect(page).toHaveURL(/\/docs/);
    } else {
      await docsTrigger.click();
      await page.waitForTimeout(500);
      const docsSublink = page.getByRole('link', { name: /puku editor|puku cli/i }).first();
      const exists = await docsSublink.count();
      expect(exists, 'a Puku docs sublink exists after opening the Docs menu').toBeGreaterThanOrEqual(1);
    }
  });

  test('browser back/forward preserves history', async ({ page }) => {
    await page.goto('/');
    await page.goto('/pricing');
    await page.goBack();
    await expect(page).toHaveURL(/\/$|\/index|\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/pricing/);
  });
});