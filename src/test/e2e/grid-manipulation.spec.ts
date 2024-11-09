import { expect, test } from '@playwright/test';

test.describe('Grid Manipulation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
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

  // test('can remove a row with confirmation', async ({ page }) => {
  //   const initialCells = await page.getByTestId('grid-cell').count();

  //   // Hover over the first cell to make remove button visible
  //   await page.getByTestId('grid-cell-0-0').hover();

  //   await page.getByRole('button', { name: 'Remove row 0' }).hover();
  //   await page.getByRole('button', { name: 'Remove row 0' }).click();
  //   await page.getByRole('button', { name: 'Confirm remove row 0' }).hover();
  //   await page.getByRole('button', { name: 'Confirm remove row 0' }).click();

  //   const cellsAfterRowRemove = await page.getByTestId('grid-cell').count();
  //   expect(cellsAfterRowRemove).toBe(initialCells - 10); // Assuming 10 cells per row
  // });
});
