import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should navigate to all tabs', async ({ page }) => {
    // Home
    await page.click('text=Home');
    await expect(page.locator('text=Medical Learning App')).toBeVisible();

    // Conditions
    await page.click('text=Conditions');
    await page.waitForSelector('input[placeholder="Search conditions, pathogens, or treatments..."]', { timeout: 10000 });
    await expect(page.locator('input[placeholder="Search conditions, pathogens, or treatments..."]')).toBeVisible();

    // Quiz
    await page.click('text=Quiz');
    await expect(page.locator('text=Knowledge Assessment')).toBeVisible();

    // Pathogen Explorer
    await page.click('text=Pathogen Explorer');
    await expect(page.locator('text=Pathogen Explorer')).toBeVisible();

    // Simple Explorer
    await page.click('text=Simple Explorer');
    await expect(page.locator('text=Simple Pathogen Explorer')).toBeVisible();

    // Antibiotic Explorer
    await page.click('text=Antibiotic Explorer');
    await expect(page.locator('text=Antibiotic Explorer')).toBeVisible();

    // Visualizations
    await page.click('text=Visualizations');
    await expect(page.locator('text=Data Visualizations')).toBeVisible();

    // Progress
    await page.click('text=Progress');
    await expect(page.locator('text=Quiz Statistics')).toBeVisible();

    // Analytics
    await page.click('text=Analytics');
    await expect(page.locator('text=Learning Analytics Dashboard')).toBeVisible();
  });
});
