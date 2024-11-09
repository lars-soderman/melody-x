import { expect, test } from '@playwright/test';

test.describe('Font Selection', () => {
  test('can change font and persist selection', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.selectOption('#font-selector', 'var(--font-creepster)');

    // Verify font change
    const cell = page.getByTestId('grid-cell-0-0');
    await expect(cell).toHaveCSS('font-family', /Creepster/);
  });
});
