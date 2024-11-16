import { expect, test } from '@playwright/test';

test.describe('Project Management', () => {
  test('can view projects list', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Melodikryss Projects' })
    ).toBeVisible();
  });

  test('can create new project', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'New Project' }).click();

    const input = page.getByPlaceholder('Project name');
    await expect(input).toBeVisible();
    await input.fill('My First Project');
    await input.press('Enter');

    await expect(page.getByText('My First Project')).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe('Grid Interaction', () => {
  test.beforeEach(async ({ page }) => {
    // Set storage to be unavailable
    await page.addInitScript(() => {
      // @ts-expect-error - we know this exists in our app
      window.storage?.setStorageAvailable(false);
    });

    // Setup: Create a project first
    await page.goto('/');
    await page.getByRole('button', { name: 'Projects' }).click();
    await page.getByRole('button', { name: 'New project' }).click();
    await page.getByPlaceholder('Project name').fill('Test Project');
    await page.getByPlaceholder('Project name').press('Enter');
    await expect(page.getByText('Test Project')).toBeVisible({
      timeout: 10000,
    });
  });

  test('can add letters to grid', async ({ page }) => {
    const cell00 = page.getByTestId('grid-cell-0-0');
    const cell01 = page.getByTestId('grid-cell-0-1');
    await expect(cell00).toBeVisible();
    await cell00.click();

    await page.keyboard.type('A');
    await page.keyboard.type('B');

    await expect(cell00).toHaveText('A');
    await expect(cell01).toHaveText('B');
  });
});
