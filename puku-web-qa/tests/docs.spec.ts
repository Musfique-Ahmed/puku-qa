import { test, expect } from '@playwright/test';

test.describe('Docs — Puku Editor and Puku CLI intro pages', () => {
  test('/docs/puku-editor/introduction returns 200 with content', async ({ page }) => {
    const response = await page.goto('/docs/puku-editor/introduction');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);

    const body = await page.locator('body').textContent();
    expect(body && body.length, 'docs page has body text').toBeGreaterThan(50);

    // Should reference "Puku Editor" somewhere.
    const mentionsEditor = /puku editor/i.test(body || '');
    expect(mentionsEditor, 'page mentions Puku Editor').toBe(true);
  });

  test('/docs/puku-cli/introduction returns 200 with content', async ({ page }) => {
    const response = await page.goto('/docs/puku-cli/introduction');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);

    const body = await page.locator('body').textContent();
    expect(body && body.length, 'docs page has body text').toBeGreaterThan(50);
  });

  test('docs sidebar has at least one navigation link', async ({ page }) => {
    await page.goto('/docs/puku-editor/introduction');
    // Sidebar usually a <nav> or <aside> with multiple links.
    const navLinks = page.locator('nav a, aside a').filter({ hasNotText: '' });
    const count = await navLinks.count();
    expect(count, 'docs sidebar has nav links').toBeGreaterThanOrEqual(1);
  });

  test('docs page has navigation links to other docs sections', async ({ page }) => {
    await page.goto('/docs/puku-editor/introduction');

    // Look for any link that points to another docs page.
    const docsLinks = page.locator('a[href*="/docs/"]');
    const total = await docsLinks.count();
    expect(total, 'docs page has at least one link to another docs section').toBeGreaterThanOrEqual(1);

    if (total > 1) {
      const second = docsLinks.nth(1);
      const href = await second.getAttribute('href');
      expect(href, 'docs link has href').toBeTruthy();
      expect(
        href!.startsWith('/docs') || href!.startsWith('#'),
        `docs link points within docs (got: ${href})`,
      ).toBe(true);
    }
  });
});
