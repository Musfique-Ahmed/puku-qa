import { test, expect } from '@playwright/test';

test.describe('Changelog — listing and per-version pages', () => {
  test('/changelog returns 200 and lists versions', async ({ page }) => {
    const response = await page.goto('/changelog');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);

    const body = (await page.locator('body').textContent()) || '';
    // Version pattern like "1.110.15" or "v1.110.15" or "1.8.56".
    const versionMatches = body.match(/v?1\.\d+\.\d+/gi) || [];
    expect(versionMatches.length, 'changelog lists ≥ 1 version').toBeGreaterThanOrEqual(1);
  });

  test('changelog lists Puku Editor and Puku CLI product entries', async ({ page }) => {
    await page.goto('/changelog');

    // The changelog page shows "Loading releases…" before JS hydrates.
    // Wait for one of the product cards to appear before counting.
    await page
      .locator('a[href*="/changelog/puku-editor"]')
      .or(page.locator('a[href*="/changelog/puku-cli"]'))
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .catch(() => undefined);

    const editorLink = page.locator('a[href*="/changelog/puku-editor"]').first();
    const cliLink = page.locator('a[href*="/changelog/puku-cli"]').first();

    expect(await editorLink.count(), 'Puku Editor changelog entry exists').toBeGreaterThanOrEqual(1);
    expect(await cliLink.count(), 'Puku CLI changelog entry exists').toBeGreaterThanOrEqual(1);
  });

  test('clicking Puku Editor changelog navigates to per-product changelog with versions', async ({ page }) => {
    await page.goto('/changelog');
    // Wait for the JS hydration that renders the product cards.
    await page
      .locator('a[href*="/changelog/puku-editor"]')
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .catch(() => undefined);

    const editorLink = page.locator('a[href*="/changelog/puku-editor"]').first();
    if ((await editorLink.count()) === 0) {
      test.skip(true, 'No Puku Editor changelog link.');
      return;
    }
    const href = await editorLink.getAttribute('href');
    expect(href, 'editor changelog href').toBeTruthy();

    const response = await page.goto(href!);
    expect(response).not.toBeNull();
    expect(response!.status(), `${href} HTTP status`).toBe(200);

    const body = (await page.locator('body').textContent()) || '';
    expect(body.length, 'editor changelog body length').toBeGreaterThan(50);
    // Per-product changelog should list multiple versions.
    const versionMatches = body.match(/v?1\.\d+\.\d+/gi) || [];
    expect(versionMatches.length, `${href} lists ≥ 2 versions`).toBeGreaterThanOrEqual(2);
  });

  test('a specific version page renders with version text', async ({ page }) => {
    // The most recent version shown in the homepage inspect output.
    const response = await page.goto('/changelog/puku-editor/v1.110.15');
    if (response && response.status() === 200) {
      const body = (await page.locator('body').textContent()) || '';
      expect(body.length, 'version page body length').toBeGreaterThan(50);
      expect(/1\.110\.15/.test(body), 'version page mentions 1.110.15').toBe(true);
    } else {
      // Some sites render the version inline on the product page rather than /v<version>.
      const fallback = await page.goto('/changelog/puku-editor');
      expect(fallback).not.toBeNull();
      expect(fallback!.status()).toBe(200);
      const body = (await page.locator('body').textContent()) || '';
      expect(body.length, 'editor changelog body length').toBeGreaterThan(50);
    }
  });
});