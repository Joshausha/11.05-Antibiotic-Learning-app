// Custom Playwright exploration script with corrected selectors
// Based on UI analysis from generated screenshots

import { test, expect } from '@playwright/test';

test.describe('Medical Learning App - Systematic Feature Exploration', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Wait for app to load
    await page.waitForSelector('text=Medical Learning App');
  });

  test('should explore the main navigation and capture all tabs', async ({ page }) => {
    // Take initial screenshot of landing page
    await page.screenshot({ path: 'exploration-results/01-landing-page.png', fullPage: true });

    // Document landing page elements
    const mainHeading = await page.locator('text=Medical Learning App').textContent();
    const subtitle = await page.locator('text=Master infectious diseases').textContent();
    console.log('Landing page loaded:', { mainHeading, subtitle });

    // Test main action buttons
    const takeQuizBtn = page.locator('text=Take a Quiz');
    const browseRefBtn = page.locator('text=Browse Reference');

    await expect(takeQuizBtn).toBeVisible();
    await expect(browseRefBtn).toBeVisible();
    console.log('Main action buttons confirmed visible');

    // Test navigation tabs using corrected selectors
    const navigationTabs = [
      { name: 'Learn', selector: 'text=Learn' },
      { name: 'Quiz', selector: 'text=Quiz' },
      { name: 'Analytics', selector: 'text=Analytics' },
      { name: 'Visualizations', selector: 'text=Visualizations' },
      { name: 'Reference', selector: 'text=Reference' },
      { name: 'Pathogens', selector: 'text=Pathogens' },
      { name: 'Antibiotics', selector: 'text=Antibiotics' }
    ];

    for (const tab of navigationTabs) {
      console.log(`Testing navigation to ${tab.name}...`);

      try {
        // Wait for and click the tab
        await page.waitForSelector(tab.selector, { timeout: 5000 });
        await page.click(tab.selector);

        // Wait for page to load
        await page.waitForTimeout(2000);

        // Take screenshot of each tab
        await page.screenshot({
          path: `exploration-results/02-${tab.name.toLowerCase()}-tab.png`,
          fullPage: true
        });

        console.log(`✅ Successfully navigated to ${tab.name} tab`);

        // Document any visible content
        const pageContent = await page.locator('main').textContent();
        console.log(`${tab.name} content length:`, pageContent.length);

      } catch (error) {
        console.log(`❌ Failed to navigate to ${tab.name}:`, error.message);
        await page.screenshot({
          path: `exploration-results/error-${tab.name.toLowerCase()}.png`
        });
      }
    }
  });

  test('should test interactive features on Quiz tab', async ({ page }) => {
    console.log('Testing Quiz functionality...');

    try {
      // Navigate to Quiz tab
      await page.click('text=Quiz');
      await page.waitForTimeout(2000);

      // Look for quiz elements
      const quizElements = await page.locator('[data-testid*="quiz"], .quiz, button:has-text("Start"), button:has-text("Begin")').count();
      console.log('Quiz interactive elements found:', quizElements);

      await page.screenshot({ path: 'exploration-results/03-quiz-interaction.png', fullPage: true });

    } catch (error) {
      console.log('Quiz exploration error:', error.message);
    }
  });

  test('should explore Pathogen visualization features', async ({ page }) => {
    console.log('Testing Pathogen Explorer features...');

    try {
      // Navigate to Pathogens tab
      await page.click('text=Pathogens');
      await page.waitForTimeout(3000); // Allow time for network graph to load

      // Look for visualization elements
      const canvasElements = await page.locator('canvas, svg, .cytoscape').count();
      const searchElements = await page.locator('input[placeholder*="search"], input[type="search"]').count();

      console.log('Visualization elements found:', { canvasElements, searchElements });

      await page.screenshot({ path: 'exploration-results/04-pathogen-explorer.png', fullPage: true });

    } catch (error) {
      console.log('Pathogen explorer error:', error.message);
    }
  });

  test('should test Antibiotic database features', async ({ page }) => {
    console.log('Testing Antibiotic Explorer features...');

    try {
      // Navigate to Antibiotics tab
      await page.click('text=Antibiotics');
      await page.waitForTimeout(2000);

      // Look for database elements
      const listItems = await page.locator('li, .antibiotic-item, .drug-card').count();
      const searchBox = await page.locator('input[placeholder*="search"], input[type="search"]').count();

      console.log('Antibiotic database elements:', { listItems, searchBox });

      await page.screenshot({ path: 'exploration-results/05-antibiotic-database.png', fullPage: true });

    } catch (error) {
      console.log('Antibiotic database error:', error.message);
    }
  });

  test('should explore Analytics dashboard', async ({ page }) => {
    console.log('Testing Analytics dashboard...');

    try {
      // Navigate to Analytics tab
      await page.click('text=Analytics');
      await page.waitForTimeout(2000);

      // Look for chart/analytics elements
      const chartElements = await page.locator('canvas, svg, .chart, .analytics').count();
      const metricCards = await page.locator('.card, .metric, .stat').count();

      console.log('Analytics elements found:', { chartElements, metricCards });

      await page.screenshot({ path: 'exploration-results/06-analytics-dashboard.png', fullPage: true });

    } catch (error) {
      console.log('Analytics dashboard error:', error.message);
    }
  });

});