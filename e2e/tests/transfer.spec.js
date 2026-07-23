// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page, request }) => {
  await request.post('http://localhost:4000/api/test/reset');
  await page.goto('/login');
  await page.getByTestId('login-username').fill('jdoe');
  await page.getByTestId('login-password').fill('Password123!');
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL(/\/dashboard$/);
});

test('completes a transfer between the user\'s own accounts', async ({ page }) => {
  await page.getByTestId('nav-transfer').click();
  await page.getByTestId('transfer-to-account').fill('1000200031'); // savings account
  await page.getByTestId('transfer-amount').fill('100');
  await page.getByTestId('transfer-review-button').click();

  await expect(page.getByTestId('transfer-review')).toBeVisible();
  await expect(page.getByTestId('review-amount')).toHaveText('$100.00');

  await page.getByTestId('transfer-confirm-button').click();

  await expect(page.getByTestId('transfer-success-message')).toContainText('completed successfully');
  await expect(page.getByTestId('transfer-new-balance')).toHaveText('$4,150.75');
});

test('rejects a transfer that exceeds the available balance', async ({ page }) => {
  await page.getByTestId('nav-transfer').click();
  await page.getByTestId('transfer-to-account').fill('1000200031');
  await page.getByTestId('transfer-amount').fill('999999');
  await page.getByTestId('transfer-review-button').click();
  await page.getByTestId('transfer-confirm-button').click();

  await expect(page.getByTestId('transfer-error')).toContainText('Insufficient funds');
});

test('rejects a transfer to an account number that does not exist', async ({ page }) => {
  await page.getByTestId('nav-transfer').click();
  await page.getByTestId('transfer-to-account').fill('0000000000');
  await page.getByTestId('transfer-amount').fill('10');
  await page.getByTestId('transfer-review-button').click();
  await page.getByTestId('transfer-confirm-button').click();

  await expect(page.getByTestId('transfer-error')).toContainText('not found');
});

// Demonstrates a seeded bug: the client only blocks negative amounts, so a
// zero-amount transfer reaches the server and is rejected there instead.
// See ANSWER_KEY.md, "Bug 4".
test('a zero-amount transfer passes client validation but fails on the server', async ({ page }) => {
  await page.getByTestId('nav-transfer').click();
  await page.getByTestId('transfer-to-account').fill('1000200031');
  await page.getByTestId('transfer-amount').fill('0');
  await page.getByTestId('transfer-review-button').click();

  await expect(page.getByTestId('transfer-review')).toBeVisible();

  await page.getByTestId('transfer-confirm-button').click();
  await expect(page.getByTestId('transfer-error')).toContainText('positive number');
});
