import { test, expect, type Response } from '@playwright/test';

/**
 * Hygiene check — runs first because failures here cascade.
 * For each page in the curated list, asserts:
 *   - no console.error
 *   - no pageerror (uncaught JS exception)
 *   - no <img> returns 404
 *   - no network request returns 404 / 5xx
 *   - meta viewport exists (basic responsive sanity)
 */
const PAGES = [
  '/',
  '/pricing',
  '/login',
  '/contact',
  '/docs/puku-editor/introduction',
  '/changelog',
  '/terms',
  '/privacy',
];

test.describe('Hygiene — no broken pages, images, or JS errors', () => {
  for (const path of PAGES) {
    test(`${path} renders cleanly`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: Error[] = [];
      const failedRequests: { url: string; status: number }[] = [];
      const badImages: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', (err) => pageErrors.push(err));
      page.on('response', (resp: Response) => {
        const status = resp.status();
        const url = resp.url();
        if (status >= 400) {
          failedRequests.push({ url, status });
        }
        // Track image 404s separately for clearer failure messages.
        const req = resp.request();
        if (req.resourceType() === 'image' && status >= 400) {
          badImages.push(`${status} ${url}`);
        }
      });

      const response = await page.goto(path, { waitUntil: 'networkidle' });
      expect(response, `navigation to ${path} returned no response`).not.toBeNull();
      expect(response!.status(), `${path} HTTP status`).toBeLessThan(400);

      // Viewport meta — basic responsive sanity.
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content').catch(() => null);
      expect(viewport, `${path} meta[name="viewport"]`).not.toBeNull();

      // Wait for images to load before sampling them.
      await page.waitForLoadState('networkidle').catch(() => undefined);

      // No JS exceptions.
      expect(pageErrors, `${path} threw uncaught JS errors`).toEqual([]);

      // No failed network requests (filter out things like favicon 404s that are tolerable? — for now keep strict).
      expect(
        failedRequests,
        `${path} had failed network requests: ${JSON.stringify(failedRequests)}`,
      ).toEqual([]);

      // No console errors.
      expect(consoleErrors, `${path} logged console errors: ${consoleErrors.join(' | ')}`).toEqual([]);

      // No broken images.
      expect(badImages, `${path} had broken images: ${badImages.join(' | ')}`).toEqual([]);
    });
  }
});