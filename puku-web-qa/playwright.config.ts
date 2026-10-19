import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the Puku web QA suite.
 * Base URL: https://web.dev.puku.sh
 *
 * Run `npm test` for the default (chromium-desktop only) run.
 * Run `npm run test:full` for the full browser + viewport matrix.
 */
export default defineConfig({
  testDir: './tests',
  // Each spec is fully isolated.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: 'https://web.dev.puku.sh',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    // Be polite with the public site.
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  expect: {
    timeout: 5_000,
  },

  timeout: 60_000,

  // Default project: desktop Chromium only — fastest feedback loop.
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],

  // Uncomment the block below and run `npm run test:full` for cross-browser coverage.
  // Keeping it as a separate `projects` entry makes matrix runs explicit.
  /*
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'firefox-desktop',  use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } } },
    { name: 'webkit-desktop',   use: { ...devices['Desktop Safari'],  viewport: { width: 1280, height: 800 } } },
    { name: 'mobile-chrome',    use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari',    use: { ...devices['iPhone 13'] } },
    { name: 'tablet',           use: { ...devices['iPad (gen 7)'] } },
  ],
  */
});
