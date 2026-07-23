// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page, request }) => {
  await request.post('http://localhost:4000/api/test/reset');
  await page.goto('/login');
  await page.getByTestId('login-username').fill('jdoe');
  await page.getByTestId('login-password').fill('Password123!');
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.getByTestId('nav-billpay').click();
  await expect(page).toHaveURL(/\/billpay$/);
});

test('pays a bill successfully', async ({ page }) => {
  await page.getByTestId('billpay-payee-select').selectOption({ label: 'Electric Company' });
  await page.getByTestId('billpay-amount').fill('50');
  await page.getByTestId('billpay-submit').click();

  await expect(page.getByTestId('billpay-success')).toContainText('sent successfully');
});

test('rejects a bill payment that exceeds the available balance', async ({ page }) => {
  await page.getByTestId('billpay-payee-select').selectOption({ label: 'Electric Company' });
  await page.getByTestId('billpay-amount').fill('999999');
  await page.getByTestId('billpay-submit').click();

  await expect(page.getByTestId('billpay-error')).toContainText('Insufficient funds');
});

test('adds a new payee and it appears in the payee list', async ({ page }) => {
  await page.getByTestId('show-add-payee').click();
  await page.getByTestId('new-payee-name').fill('Internet Provider');
  await page.getByTestId('new-payee-account').fill('NET-1234');
  await page.getByTestId('new-payee-category').fill('Utilities');
  await page.getByTestId('save-add-payee').click();

  await expect(page.getByTestId('payee-list')).toContainText('Internet Provider');
});

test('removes an existing payee from the list', async ({ page }) => {
  await expect(page.getByTestId('payee-list')).toContainText('Acme Credit Card');

  const row = page.locator('[data-testid^="payee-row-"]', { hasText: 'Acme Credit Card' });
  await row.locator('button').click();

  await expect(page.getByTestId('payee-list')).not.toContainText('Acme Credit Card');
});

test('the payment button is disabled when there are no payees', async ({ page }) => {
  for (const name of ['Electric Company', 'City Water Utility', 'Acme Credit Card']) {
    const row = page.locator('[data-testid^="payee-row-"]', { hasText: name });
    await row.locator('button').click();
    await expect(row).toHaveCount(0);
  }

  await expect(page.getByTestId('no-payees')).toBeVisible();
  await expect(page.getByTestId('billpay-submit')).toBeDisabled();
});
