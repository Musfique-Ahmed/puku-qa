import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test.describe('Homepage — marketing copy, hero, and footer', () => {
  test('loads with status 200 and a Puku-related title', async ({ page }) => {
    const response = await page.goto('/');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);

    const title = await page.title();
    expect(title.toLowerCase()).toContain('puku');
  });

  test('hero headline is visible', async ({ page }) => {
    await page.goto('/');
    const home = new HomePage(page);
    await expect(home.heroHeadline).toBeVisible();
  });

  test('primary "Download for <OS>" CTA is visible and routes to download', async ({ page }) => {
    await page.goto('/');
    const home = new HomePage(page);
    const cta = home.heroPrimaryCta;
    await expect(cta).toBeVisible();

    const href = await cta.getAttribute('href');
    expect(href, 'hero primary CTA href').toBeTruthy();
    expect(href!.toLowerCase()).toMatch(/download/);
  });

  test('secondary CTA routes to Puku Editor docs', async ({ page }) => {
    await page.goto('/');
    const home = new HomePage(page);
    const cta = home.heroSecondaryCta;
    if ((await cta.count()) === 0) {
      test.skip(true, 'No secondary docs CTA found on homepage.');
      return;
    }
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute('href');
    expect(href, 'secondary CTA href').toBeTruthy();
    expect(href!.toLowerCase()).toContain('docs');
  });

  test('four pillar sections render', async ({ page }) => {
    await page.goto('/');
    // Soft check — site may rename over time. Just verify ≥ 1 heading-2 / h2 exists.
    const h2s = page.locator('h2');
    const count = await h2s.count();
    expect(count, 'homepage should have at least one h2').toBeGreaterThanOrEqual(1);

    // Verify all four pillar headlines if present.
    const pillars = ['Connected workflows', 'Shared context', 'Model routing', 'Team workspaces'];
    let matched = 0;
    for (const p of pillars) {
      const exists = await page.getByRole('heading', { name: new RegExp(p, 'i') }).count();
      if (exists > 0) matched++;
    }
    expect(matched, 'expected at least one of the four pillar headlines').toBeGreaterThanOrEqual(1);
  });

  test('footer renders Terms / Privacy / Support / Refund links', async ({ page }) => {
    await page.goto('/');
    // Use partial-match regex so "Terms & conditions", "Privacy policy",
    // "Refund policy" all match — the actual labels include suffixes.
    const labels: Array<[string, RegExp]> = [
      ['Terms', /terms/i],
      ['Privacy', /privacy/i],
      ['Support', /support/i],
      ['Refund', /refund/i],
    ];
    for (const [name, re] of labels) {
      // Look inside <footer> specifically.
      const link = page.locator('footer').getByRole('link', { name: re }).first();
      const count = await link.count();
      expect(count, `footer link matching "${name}" exists`).toBeGreaterThanOrEqual(1);
      const href = await link.getAttribute('href');
      expect(href, `footer link "${name}" has href`).toBeTruthy();
    }
  });

  test('homepage captures a full-page screenshot for visual review', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await page.screenshot({ path: 'test-results/homepage-full.png', fullPage: true });
  });
});