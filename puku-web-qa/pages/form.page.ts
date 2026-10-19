import { type Page, type Locator } from '@playwright/test';

/**
 * Form helpers shared between /login and /contact.
 * We don't assume specific field names — we look for inputs by type/role.
 */
export class FormPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** The first <form> on the page. */
  get form(): Locator {
    return this.page.locator('form').first();
  }

  /** Submit button inside the form. */
  get submitButton(): Locator {
    return this.form.getByRole('button', { name: /submit|sign in|log in|send|contact us|get started/i }).first();
  }

  /** Email field — first email-type input on the page. */
  get emailInput(): Locator {
    return this.page.locator('input[type="email"]').first();
  }

  /** Password field — first password-type input on the page. */
  get passwordInput(): Locator {
    return this.page.locator('input[type="password"]').first();
  }

  /** Name field — first text input named/labeled "name". */
  get nameInput(): Locator {
    return this.page.getByLabel(/name/i).first();
  }

  /** Message field — first textarea on the page. */
  get messageInput(): Locator {
    return this.page.locator('textarea').first();
  }

  /** Try to submit the form with empty values. */
  async submitEmpty(): Promise<void> {
    await this.submitButton.click().catch(() => undefined);
  }

  /** Fill a contact-like form and submit. Missing fields are silently skipped. */
  async fillAndSubmitContact(payload: { name?: string; email?: string; message?: string }): Promise<void> {
    if (payload.name && (await this.nameInput.count())) {
      await this.nameInput.fill(payload.name);
    }
    if (payload.email && (await this.emailInput.count())) {
      await this.emailInput.fill(payload.email);
    }
    if (payload.message && (await this.messageInput.count())) {
      await this.messageInput.fill(payload.message);
    }
    await this.submitButton.click().catch(() => undefined);
  }

  /** Fill a login form and submit. */
  async fillAndSubmitLogin(email: string, password: string): Promise<void> {
    if (await this.emailInput.count()) await this.emailInput.fill(email);
    if (await this.passwordInput.count()) await this.passwordInput.fill(password);
    await this.submitButton.click().catch(() => undefined);
  }
}
