import { test, expect } from '@playwright/test';

test.describe('Simple Pathogen Explorer Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=Simple Explorer');
    await page.waitForSelector('h1:has-text("Pathogen Explorer")');
  });

  test('should display the pathogen list', async ({ page }) => {
    await expect(page.locator('.max-h-96')).toBeVisible();
  });

  test('should filter pathogens based on search term', async ({ page }) => {
    await page.fill('input[placeholder="Search pathogens..."]', 'Staphylococcus aureus');
    await expect(page.locator('text=Staphylococcus aureus')).toBeVisible();
    await expect(page.locator('text=Streptococcus pneumoniae')).not.toBeVisible();
  });

  test('should open the pathogen detail modal when a pathogen is clicked', async ({ page }) => {
    await page.click('text=Staphylococcus aureus');
    await expect(page.locator('h2:has-text("Staphylococcus aureus")')).toBeVisible();
  });
});
