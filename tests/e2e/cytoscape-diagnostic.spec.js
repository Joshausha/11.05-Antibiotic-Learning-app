// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Diagnostic test to check what's on the page after navigating to Cytoscape
 */

test('Diagnostic: Check page content after navigating to Cytoscape', async ({ page }) => {
  // Navigate to the application
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // Click on Visualizations
  await page.getByRole('button', { name: 'Navigate to Visualizations' }).click();
  await page.waitForTimeout(1000);

  // Click on Pathogen Network
  await page.getByRole('button', { name: /pathogen network/i }).click();
  await page.waitForTimeout(3000);

  // Take a screenshot
  await page.screenshot({ path: 'cytoscape-diagnostic.png', fullPage: true });

  // Get all text content
  const bodyText = await page.locator('body').textContent();
  console.log('=== Page Text Content ===');
  console.log(bodyText);

  // Check for hamburger menu
  const hamburger = page.getByRole('button', { name: /sidebar/i });
  const hamburgerCount = await hamburger.count();
  console.log(`\n=== Hamburger buttons found: ${hamburgerCount} ===`);

  // Check for any buttons
  const allButtons = await page.locator('button').all();
  console.log(`\n=== Total buttons on page: ${allButtons.length} ===`);
  for (let i = 0; i < Math.min(20, allButtons.length); i++) {
    const text = await allButtons[i].textContent();
    const ariaLabel = await allButtons[i].getAttribute('aria-label');
    console.log(`Button ${i + 1}: text="${text}" aria-label="${ariaLabel}"`);
  }

  // Check for Cytoscape container
  const cytoscapeContainer = page.locator('div[class*="absolute"]');
  const containerCount = await cytoscapeContainer.count();
  console.log(`\n=== Containers with 'absolute' class: ${containerCount} ===`);

  // This test just prints diagnostics, always passes
  expect(true).toBe(true);
});
