import { test, expect } from '@playwright/test';

test.describe('Downloads — /download route resolution', () => {
  test('GET /download?platform=darwin-arm64 returns 2xx or 3xx', async ({ page }) => {
    // The /download route is a Next.js page that triggers an actual download via JS.
    // We test the page renders without errors; clicking the download button is the
    // user-visible flow.
    const response = await page.request.get('/download?platform=darwin-arm64', {
      maxRedirects: 5,
      failOnStatusCode: false,
    });
    expect(response.status(), 'download page HTTP status').toBeLessThan(400);
  });

  test('GET /download?platform=win32-x64 returns 2xx or 3xx', async ({ page }) => {
    const response = await page.request.get('/download?platform=win32-x64', {
      maxRedirects: 5,
      failOnStatusCode: false,
    });
    expect(response.status(), 'download (Windows) HTTP status').toBeLessThan(400);
  });

  test('/download page renders a download CTA', async ({ page }) => {
    const response = await page.goto('/download?platform=darwin-arm64');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);

    // After hydration the page should show a download button or link.
    await page.waitForLoadState('networkidle').catch(() => undefined);
    const downloadCta = page
      .getByRole('link', { name: /download/i })
      .or(page.getByRole('button', { name: /download/i }));
    const count = await downloadCta.count();
    expect(count, '/download has at least one download CTA').toBeGreaterThanOrEqual(1);
  });

  test('homepage hero "Download for <OS>" link uses /download endpoint', async ({ page }) => {
    await page.goto('/');
    const cta = page
      .getByRole('link', { name: /download for (macos|windows|linux)/i })
      .first();
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute('href');
    expect(href, 'hero CTA href').toBeTruthy();
    expect(href!.toLowerCase()).toMatch(/download/);
  });

  test('header "Download" button uses /download endpoint', async ({ page }) => {
    await page.goto('/');
    const headerDownload = page.locator('header').getByRole('link', { name: /^download$/i }).first();
    if ((await headerDownload.count()) === 0) {
      test.skip(true, 'No header-level Download link.');
      return;
    }
    const href = await headerDownload.getAttribute('href');
    expect(href, 'header Download href').toBeTruthy();
    expect(href!.toLowerCase()).toMatch(/download/);
  });
});