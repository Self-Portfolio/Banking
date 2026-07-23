// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:4000/api/test/reset');
});

test('logs in with valid demo credentials and lands on the dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-username').fill('jdoe');
  await page.getByTestId('login-password').fill('Password123!');
  await page.getByTestId('login-submit').click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByTestId('nav-username')).toHaveText('Jane Doe');
  await expect(page.getByTestId('total-balance')).toContainText('$17,050.75');
});

test('shows an error for an incorrect password', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-username').fill('jdoe');
  await page.getByTestId('login-password').fill('wrong-password');
  await page.getByTestId('login-submit').click();

  await expect(page.getByTestId('login-error')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test('redirects an unauthenticated user away from the dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login$/);
});

test('logs out and returns to the login page', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-username').fill('jdoe');
  await page.getByTestId('login-password').fill('Password123!');
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByTestId('logout-button').click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login$/);
});
