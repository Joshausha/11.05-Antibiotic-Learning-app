import { test, expect } from '@playwright/test';

test.describe('Antibiotic Explorer Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=Antibiotic Explorer');
    await page.waitForSelector('h1:has-text("Antibiotic Explorer")');
  });

  test('should display the antibiotic list', async ({ page }) => {
    await expect(page.locator('.max-h-96')).toBeVisible();
  });

  test('should filter antibiotics based on search term', async ({ page }) => {
    await page.fill('input[placeholder="Search antibiotics..."]', 'Amoxicillin');
    await expect(page.locator('div.font-medium').filter({ hasText: /^Amoxicillin$/ })).toBeVisible();
    await expect(page.locator('text=Ciprofloxacin')).not.toBeVisible();
  });

  test('should open the antibiotic detail modal when an antibiotic is clicked', async ({ page }) => {
    await page.locator('div.font-medium').filter({ hasText: /^Amoxicillin$/ }).click();
    await expect(page.locator('h2:has-text("Amoxicillin")')).toBeVisible();
  });
});
