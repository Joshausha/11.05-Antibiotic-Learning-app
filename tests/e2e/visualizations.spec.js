import { test, expect } from '@playwright/test';

test.describe('Visualizations Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=Visualizations');
    await page.waitForSelector('h1:has-text("Data Visualizations")');
  });

  test('should display the overview dashboard by default', async ({ page }) => {
    await expect(page.locator('.grid-cols-2.md\:grid-cols-5 button[title="Overview Dashboard"]')).toBeVisible();
  });

  test('should switch to the pathogen network view', async ({ page }) => {
    await page.click('.grid-cols-2.md\:grid-cols-5 button[title="Pathogen Network"]');
    await expect(page.locator('h3:has-text("Pathogen Relationship Network")')).toBeVisible();
  });

  test('should switch to the category distribution view', async ({ page }) => {
    await page.click('.grid-cols-2.md\:grid-cols-5 button[title="Category Distribution"]');
    await expect(page.locator('h3:has-text("Medical Conditions by Category")')).toBeVisible();
  });

  test('should switch to the antibiotic analysis view', async ({ page }) => {
    await page.click('.grid-cols-2.md\:grid-cols-5 button[title="Antibiotic Analysis"]');
    await expect(page.locator('h3:has-text("Antibiotic Drug Class Analysis")')).toBeVisible();
  });

  test('should switch to the pathogen analysis view', async ({ page }) => {
    await page.click('.grid-cols-2.md\:grid-cols-5 button[title="Pathogen Analysis"]');
    await expect(page.locator('h3:has-text("Pathogen Analysis Dashboard")')).toBeVisible();
  });
});
