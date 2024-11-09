import { expect, test } from '@playwright/test';

test.describe('Box Properties', () => {
  test('can add and modify box properties', async ({ page }) => {
    await page.goto('/');
    const cell = page.getByTestId('grid-cell-0-0');

    // Open options and make black
    await cell.click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Toggle black square' }).click();
    await expect(cell).toHaveClass(/bg-black/);

    // Add right arrow
    await cell.click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add right arrow' }).click();
    await expect(page.getByTestId('arrow-right')).toBeVisible();

    // Add down arrow
    await cell.click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add down arrow' }).click();
    await expect(page.getByTestId('arrow-down')).toBeVisible();

    // Add stop
    await cell.click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Toggle bottom stop' }).click();
    await expect(page.locator('[data-stop="bottom"]')).toBeVisible();

    // Add hint
    await cell.click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add hint number' }).click();
    await expect(page.locator('[data-hint="true"]')).toBeVisible();
  });
});
