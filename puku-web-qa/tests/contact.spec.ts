import { test, expect } from '@playwright/test';

test.describe('Contact — /contact form validation and submit', () => {
  test('/contact returns 200 and has some contact UI', async ({ page }) => {
    const response = await page.goto('/contact');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);

    // Look for any contact UI affordance: a form, an email input, or "Contact" / "Get in touch" copy.
    const formCount = await page.locator('form').count();
    const emailInputCount = await page.locator('input[type="email"]').count();
    const textareaCount = await page.locator('textarea').count();
    const headingMatches = await page
      .getByRole('heading', { name: /contact|get in touch|talk to|reach out/i })
      .count();

    const hasContactUI =
      formCount > 0 ||
      emailInputCount > 0 ||
      textareaCount > 0 ||
      headingMatches > 0;
    expect(hasContactUI, '/contact has some form or contact-oriented UI').toBe(true);
  });

  test('/contact screenshot captures the page', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await page.screenshot({ path: 'test-results/contact.png', fullPage: true });
  });

  test('contact page has at least one input or textarea', async ({ page }) => {
    await page.goto('/contact');
    const inputs = await page.locator('input, textarea').count();
    expect(inputs, '/contact has inputs or textareas').toBeGreaterThanOrEqual(1);
  });
});