import { expect, test } from '@playwright/test';

test.describe('Projects Menu', () => {
  test.beforeEach(async ({ page }) => {
    // Set storage to be unavailable for all tests
    await page.addInitScript(() => {
      // @ts-expect-error - we know this exists in our app
      window.storage?.setStorageAvailable(false);
    });
    await page.goto('/');
  });

  test('can open projects menu', async ({ page }) => {
    await page.getByTestId('projects-menu-button').click();
    await expect(page.getByTestId('new-project-button')).toBeVisible();
  });

  test('can create new project', async ({ page }) => {
    await page.getByTestId('projects-menu-button').click();
    await page.getByTestId('new-project-button').click();

    const input = page.getByPlaceholder('Project name');
    await expect(input).toBeVisible();
    await input.fill('My First Project');
    await input.press('Enter');

    await expect(page.getByText('My First Project')).toBeVisible();
  });
});
