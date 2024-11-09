import { expect, test } from '@playwright/test';

test.describe('Project Sharing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Create a test project with specific content
    await page.getByTestId('grid-cell-0-0').click();
    await page.keyboard.type('TEST');

    // Add some special properties
    await page.getByTestId('grid-cell-1-0').click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Toggle black square' }).click();
    await page.getByTestId('grid-cell-2-0').click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add right arrow' }).click();
    await page.getByTestId('grid-cell-3-0').click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add hint number' }).click();
  });

  test('can share and import project via URL', async ({ page, context }) => {
    // Share the project
    await page.getByTestId('projects-menu-button').click();
    await page.getByRole('button', { name: 'Share' }).click();

    // Get URL from clipboard
    const shareUrl = await page.evaluate(() => navigator.clipboard.readText());
    expect(shareUrl).toContain('project=');

    // Open new page with shared URL
    const newPage = await context.newPage();
    await newPage.goto(shareUrl);

    // Verify content is preserved
    await expect(newPage.getByTestId('grid-cell-0-0')).toHaveText('T');
    await expect(newPage.getByTestId('grid-cell-0-1')).toHaveText('E');
    await expect(newPage.getByTestId('grid-cell-1-0')).toHaveClass(/bg-black/);
    await expect(newPage.getByTestId('arrow-right')).toBeVisible();
    await expect(newPage.locator('[data-hint="true"]')).toBeVisible();
  });

  test('handles invalid share URLs gracefully', async ({ page }) => {
    await page.goto('/?project=invalid-data');
    // Should show error message or fallback to new project
    await expect(page.getByTestId('grid-cell-0-0')).toBeVisible();
  });
});
