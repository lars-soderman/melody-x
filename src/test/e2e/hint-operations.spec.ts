import { expect, test } from '@playwright/test';

test.describe('Hint Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Set storage to be unavailable for tests
    await page.addInitScript(() => {
      // @ts-expect-error - we know this exists in our app
      window.storage?.setStorageAvailable(false);
    });

    // Create a new project
    await page.goto('/');
    await page.getByRole('button', { name: 'Projects' }).click();
    await page.getByRole('button', { name: 'Create new project' }).click();
    await page.getByPlaceholder('Project name').fill('Test Project');
    await page.getByPlaceholder('Project name').press('Enter');
  });

  test('can add sequential hints to cells', async ({ page }) => {
    // Add hint to first cell
    const cell00 = page.getByTestId('grid-cell-0-0');
    await cell00.click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add hint number' }).click();

    // Verify hint number 1 appears
    const hint1 = page.locator('[data-hint="true"] span').first();
    await expect(hint1).toHaveText('1');

    // Add hint to second cell
    const cell01 = page.getByTestId('grid-cell-0-1');
    await cell01.click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add hint number' }).click();

    // Verify hint number 2 appears
    const hint2 = page.locator('[data-hint="true"] span').nth(1);
    await expect(hint2).toHaveText('2');
  });

  test('can remove hints from cells', async ({ page }) => {
    // Add hint to cell
    const cell = page.getByTestId('grid-cell-0-0');
    await cell.click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add hint number' }).click();

    // Verify hint exists
    await expect(page.locator('[data-hint="true"]')).toBeVisible();

    // Remove hint
    await cell.click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add hint number' }).click();

    // Verify hint is removed
    await expect(page.locator('[data-hint="true"]')).not.toBeVisible();
  });

  test('hint numbers are reused after removal', async ({ page }) => {
    // Add hints to two cells
    const cell00 = page.getByTestId('grid-cell-0-0');
    const cell01 = page.getByTestId('grid-cell-0-1');

    // Add hint 1
    await cell00.click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add hint number' }).click();

    // Add hint 2
    await cell01.click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add hint number' }).click();

    // Remove hint 1
    await cell00.click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add hint number' }).click();

    // Add new hint to first cell
    await cell00.click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add hint number' }).click();

    // Verify it reuses number 1
    const hint1 = page.locator('[data-hint="true"] span').first();
    await expect(hint1).toHaveText('1');
  });
});
