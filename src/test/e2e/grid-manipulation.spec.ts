import { expect, test } from '@playwright/test';

test.describe('Grid Manipulation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Enable grid resize controls
    await page.getByRole('button', { name: 'Settings' }).click();
    await page
      .getByRole('checkbox', { name: 'Show grid resize controls' })
      .click();
  });

  test('can add a row', async ({ page }) => {
    const initialCells = await page.getByTestId('grid-cell').count();
    await page.getByRole('button', { name: 'Add row at bottom' }).click();
    const cellsAfterRowAdd = await page.getByTestId('grid-cell').count();
    expect(cellsAfterRowAdd).toBe(initialCells + 10); // Assuming 10 cells per row
  });

  test('can add a column', async ({ page }) => {
    const initialCells = await page.getByTestId('grid-cell').count();
    await page.getByRole('button', { name: 'Add column at right' }).click();
    const cellsAfterColumnAdd = await page.getByTestId('grid-cell').count();
    expect(cellsAfterColumnAdd).toBe(initialCells + 9); // Assuming 9 rows
  });

  test('grid resize controls are hidden by default', async ({ page }) => {
    await page.goto('/'); // Fresh page load
    await expect(
      page.getByRole('button', { name: 'Add row at bottom' })
    ).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Add column at right' })
    ).not.toBeVisible();
  });

  test('can toggle grid resize controls', async ({ page }) => {
    await page.goto('/'); // Fresh page load
    // Controls should be hidden by default
    await expect(
      page.getByRole('button', { name: 'Add row at bottom' })
    ).not.toBeVisible();

    // Enable controls
    await page.getByRole('button', { name: 'Settings' }).click();
    await page
      .getByRole('checkbox', { name: 'Show grid resize controls' })
      .click();
    await expect(
      page.getByRole('button', { name: 'Add row at bottom' })
    ).toBeVisible();

    // Disable controls
    await page
      .getByRole('checkbox', { name: 'Show grid resize controls' })
      .click();
    await expect(
      page.getByRole('button', { name: 'Add row at bottom' })
    ).not.toBeVisible();
  });
});
