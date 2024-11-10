import { expect, test } from '@playwright/test';
test.describe('Project Sharing', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');

    // Create a test project with specific name
    await page.getByTestId('projects-menu-button').click();
    await page.getByTestId('new-project-button').click();
    await page.getByPlaceholder('Project name').fill('Special Test Name');
    await page.getByPlaceholder('Project name').press('Enter');

    // Wait for project to be visible
    await expect(page.getByText('Special Test Name')).toBeVisible();
  });

  test('can share project with text content', async ({ page, context }) => {
    // Add text content
    await page.getByTestId('grid-cell-0-0').click();
    await page.keyboard.type('TEST');
    await expect(page.getByTestId('grid-cell-0-0')).toHaveText('T');
    await expect(page.getByTestId('grid-cell-0-1')).toHaveText('E');

    await page.waitForTimeout(100);

    // Share and verify URL
    await page.getByTestId('projects-menu-button').click();
    await page.getByRole('button', { name: 'Share' }).click();
    const shareUrl = await page.evaluate(() => navigator.clipboard.readText());
    expect(shareUrl).toContain('project=');

    // Open new page and verify content
    const newPage = await context.newPage();
    await newPage.goto(shareUrl);
    await newPage.getByTestId('grid-cell-0-0').waitFor();
    await newPage.waitForTimeout(100);

    await expect(newPage.getByTestId('grid-cell-0-0')).toHaveText('T');
    await expect(newPage.getByTestId('grid-cell-0-1')).toHaveText('E');
  });

  test('can share project with black squares', async ({ page, context }) => {
    // Add black square
    await page.getByTestId('grid-cell-1-0').click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Toggle black square' }).click();
    await expect(page.getByTestId('grid-cell-1-0')).toHaveClass(/bg-black/);

    await page.waitForTimeout(100);

    // Share and verify URL
    await page.getByTestId('projects-menu-button').click();
    await page.getByRole('button', { name: 'Share' }).click();
    const shareUrl = await page.evaluate(() => navigator.clipboard.readText());

    // Open new page and verify content
    const newPage = await context.newPage();
    await newPage.goto(shareUrl);
    await newPage.getByTestId('grid-cell-1-0').waitFor();
    await newPage.waitForTimeout(100);

    await expect(newPage.getByTestId('grid-cell-1-0')).toHaveClass(/bg-black/);
  });

  test('can share project with arrows', async ({ page, context }) => {
    // Add right arrow
    await page.getByTestId('grid-cell-2-0').click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add right arrow' }).click();
    await expect(page.getByTestId('arrow-right')).toBeVisible();

    await page.waitForTimeout(100);

    // Share and verify URL
    await page.getByTestId('projects-menu-button').click();
    await page.getByRole('button', { name: 'Share' }).click();
    const shareUrl = await page.evaluate(() => navigator.clipboard.readText());

    // Open new page and verify content
    const newPage = await context.newPage();
    await newPage.goto(shareUrl);
    await newPage.getByTestId('grid-cell-2-0').waitFor();
    await newPage.waitForTimeout(100);

    await expect(newPage.getByTestId('arrow-right')).toBeVisible();
  });

  test('can share project with hint numbers', async ({ page, context }) => {
    // Add hint number
    await page.getByTestId('grid-cell-3-0').click();
    await page.getByRole('button', { name: 'Show options' }).click();
    await page.getByRole('button', { name: 'Add hint number' }).click();
    await expect(page.locator('[data-hint="true"]')).toBeVisible();

    await page.waitForTimeout(100);

    // Share and verify URL
    await page.getByTestId('projects-menu-button').click();
    await page.getByRole('button', { name: 'Share' }).click();
    const shareUrl = await page.evaluate(() => navigator.clipboard.readText());

    // Open new page and verify content
    const newPage = await context.newPage();
    await newPage.goto(shareUrl);
    await newPage.getByTestId('grid-cell-3-0').waitFor();
    await newPage.waitForTimeout(100);

    await expect(newPage.locator('[data-hint="true"]')).toBeVisible();
  });

  test('handles invalid share URLs gracefully', async ({ page }) => {
    await page.goto('/?project=invalid-data');
    await expect(page.getByTestId('grid-cell-0-0')).toBeVisible();
    await expect(page.getByTestId('grid-cell-0-0')).toHaveText('');
  });
});
