import { test, expect } from '@playwright/test';

test.describe('Quiz Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=Quiz');
    await page.waitForSelector('text=Knowledge Assessment');
  });

  test('should display the quiz introduction', async ({ page }) => {
    await expect(page.locator('h2:has-text("Knowledge Assessment")')).toBeVisible();
    await expect(page.locator('p:has-text("Test your understanding of infectious diseases and antimicrobial therapy")')).toBeVisible();
  });

  test('should start the quiz when "Start Quiz" is clicked', async ({ page }) => {
    await page.click('button:has-text("Start Quiz")');
    await expect(page.locator('.text-gray-500:has-text("Question 1 of 79")')).toBeVisible();
  });

  test('should allow the user to answer a question and move to the next one', async ({ page }) => {
    await page.click('button:has-text("Start Quiz")');
    await page.locator('button:not(:has-text("Next")):not(:has-text("Finish Quiz")):not(:has-text("Previous"))').first().click();
    await page.waitForTimeout(1500);
    await expect(page.locator('.text-gray-500:has-text("Question 2 of 79")')).toBeVisible();
  });
});
