// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page, request }) => {
  await request.post('http://localhost:4000/api/test/reset');
  await page.goto('/login');
  await page.getByTestId('login-username').fill('jdoe');
  await page.getByTestId('login-password').fill('Password123!');
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.getByTestId('account-list').getByText('Everyday Checking').click();
  await expect(page).toHaveURL(/\/accounts\/\d+$/);
});

test('paginates through transaction history', async ({ page }) => {
  await expect(page.getByTestId('pagination-status')).toContainText('Page 1 of 3');
  await page.getByTestId('pagination-next').click();
  await expect(page.getByTestId('pagination-status')).toContainText('Page 2 of 3');
});

test('previous is disabled on the first page, next is disabled on the last page', async ({ page }) => {
  await expect(page.getByTestId('pagination-prev')).toBeDisabled();

  await page.getByTestId('pagination-next').click();
  await page.getByTestId('pagination-next').click();

  await expect(page.getByTestId('pagination-status')).toContainText('Page 3 of 3');
  await expect(page.getByTestId('pagination-next')).toBeDisabled();
});

// Seeded bug (ANSWER_KEY.md, Bug 2): search is case-sensitive even though
// nothing in the UI suggests it should be.
test('transaction search is case-sensitive', async ({ page }) => {
  await page.getByTestId('transaction-search').fill('grocery');
  await expect(page.getByTestId('no-transactions')).toBeVisible();
});

test('transaction search matches when the case is correct', async ({ page }) => {
  await page.getByTestId('transaction-search').fill('Grocery');
  await expect(page.locator('[data-testid^="transaction-row-"]').first()).toBeVisible();
});

// Seeded bug (ANSWER_KEY.md, Bug 6): `from` is inclusive but `to` is
// exclusive. This test just confirms an obviously out-of-range filter
// correctly excludes everything.
test('date filters outside the transaction history return no results', async ({ page }) => {
  await page.getByTestId('transaction-from').fill('2000-01-01');
  await page.getByTestId('transaction-to').fill('2000-01-02');
  await expect(page.getByTestId('no-transactions')).toBeVisible();
});
