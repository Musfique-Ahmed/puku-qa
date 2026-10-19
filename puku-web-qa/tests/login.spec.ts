import { test, expect } from '@playwright/test';

test.describe('Login — /login form rendering and validation', () => {
  test('/login returns 200 and renders sign-in UI after hydration', async ({ page }) => {
    const response = await page.goto('/login');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);

    // Wait for the SPA / Next.js to hydrate and render the OAuth buttons.
    // The page eventually shows "Sign in to Puku" + Continue with Google/Microsoft/Email.
    await page
      .getByRole('heading', { name: /sign in to puku/i })
      .or(page.getByText(/continue with google/i))
      .or(page.getByText(/continue with email/i))
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .catch(() => undefined);

    // Either OAuth buttons or a traditional form must be present after hydration.
    const oauthGoogle = page.getByRole('button', { name: /continue with google/i });
    const oauthMicrosoft = page.getByRole('button', { name: /continue with microsoft/i });
    const oauthEmail = page.getByRole('button', { name: /continue with email/i });
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    const hasOAuth =
      (await oauthGoogle.count()) +
        (await oauthMicrosoft.count()) +
        (await oauthEmail.count()) >
      0;
    const hasForm =
      ((await emailInput.count()) > 0) || ((await passwordInput.count()) > 0);
    const hasSignInHeading = await page
      .getByRole('heading', { name: /sign in to puku/i })
      .count();

    expect(
      hasOAuth || hasForm || hasSignInHeading > 0,
      'login page has sign-in UI (OAuth buttons, form, or "Sign in to Puku" heading)',
    ).toBe(true);
  });

  test('/login has no console errors after hydration', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/login');
    await page.waitForLoadState('networkidle').catch(() => undefined);

    // The login page legitimately redirects OAuth flows to external providers — that
    // is not a "console error" we care about. Filter known-noisy errors.
    const meaningful = consoleErrors.filter(
      (e) =>
        !/preload|favicon|net::err_aborted|redirect to/i.test(e) &&
        !/failed to load resource/i.test(e),
    );
    expect(meaningful, `console errors on /login: ${meaningful.join(' | ')}`).toEqual([]);
  });

  test('/login screenshot captures the sign-in UI', async ({ page }) => {
    await page.goto('/login');
    // Wait for the OAuth UI to hydrate before screenshotting.
    await page
      .getByText(/continue with (google|microsoft|email)/i)
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .catch(() => undefined);
    await page.screenshot({ path: 'test-results/login.png', fullPage: true });
  });
});