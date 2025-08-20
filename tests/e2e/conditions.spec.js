import { test, expect } from '@playwright/test';

test.describe('Conditions Tab', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(msg.text()));
    await page.goto('http://localhost:3000');
    await page.click('text=Conditions');
    await page.waitForSelector('input[placeholder="Search conditions, pathogens, or treatments..."]');
  });

  test('should display the search bar', async ({ page }) => {
    await expect(page.locator('input[placeholder="Search conditions, pathogens, or treatments..."]')).toBeVisible();
  });

  test('should filter conditions based on search term', async ({ page }) => {
    await page.fill('input[placeholder="Search conditions, pathogens, or treatments..."]', 'pneumonia');
    await page.waitForTimeout(500);
    await expect(page.locator('h3:has-text("Community- acquired pneumonia (CAP)")')).toBeVisible();
    await expect(page.locator('text=Urinary Tract Infection')).not.toBeVisible();
  });

  test('should open the condition detail modal when a condition is clicked', async ({ page }) => {
    await page.click('h3:has-text("Community- acquired pneumonia (CAP)")');
    await expect(page.locator('h2:has-text("Community- acquired pneumonia (CAP)")')).toBeVisible();
  });
});
