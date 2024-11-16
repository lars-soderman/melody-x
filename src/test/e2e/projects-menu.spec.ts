import { expect, test } from '@playwright/test';

test.describe('Projects List', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      // @ts-expect-error - we know this exists in our app
      window.storage?.setStorageAvailable(false);
    });
    await page.goto('/');
  });

  test('shows projects heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Melodikryss' })
    ).toBeVisible();
  });

  test('can create new project', async ({ page }) => {
    await page.getByRole('button', { name: 'New Project' }).click();

    const input = page.getByPlaceholder('Project name');
    await expect(input).toBeVisible();
    await input.fill('My First Project');
    await input.press('Enter');

    await expect(page.getByText('My First Project')).toBeVisible();
  });
});
