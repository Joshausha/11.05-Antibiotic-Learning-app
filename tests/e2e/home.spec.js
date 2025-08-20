import { test, expect } from '@playwright/test';

test.describe('Home Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=Home');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.locator('text=Medical Learning App')).toBeVisible();
  });

  test('should display the three learning pillars', async ({ page }) => {
    await expect(page.locator('h2:has-text("Clinical Guidelines")')).toBeVisible();
    await expect(page.locator('h2:has-text("Targeted Learning")')).toBeVisible();
    await expect(page.locator('h2:has-text("Interactive Quizzes")')).toBeVisible();
  });

  test('should navigate to the Conditions tab when "Start Learning" is clicked', async ({ page }) => {
    await page.click('text=Start Learning');
    await expect(page.locator('input[placeholder="Search conditions, pathogens, or treatments..."]')).toBeVisible();
  });
});
