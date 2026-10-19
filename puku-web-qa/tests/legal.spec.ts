import { test, expect } from '@playwright/test';

const LEGAL_PAGES = ['/terms', '/privacy', '/support', '/refund'];

test.describe('Legal — terms, privacy, support, refund', () => {
  for (const path of LEGAL_PAGES) {
    test(`${path} returns 200 with non-empty body`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response, `${path} returned no response`).not.toBeNull();
      expect(response!.status(), `${path} HTTP status`).toBe(200);

      const body = (await page.locator('body').textContent()) || '';
      expect(body.length, `${path} body length`).toBeGreaterThan(50);
    });
  }
});
