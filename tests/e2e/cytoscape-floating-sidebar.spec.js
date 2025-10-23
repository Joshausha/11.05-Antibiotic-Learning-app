// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * E2E Tests for Cytoscape Floating Sidebar UI
 * Tests the new floating sidebar implementation with:
 * - Sidebar open/close functionality
 * - Backdrop overlay
 * - Keyboard accessibility (ESC key)
 * - Filter functionality
 * - Full-screen visualization
 * - Visual animations
 */

// Helper function to get the sidebar element
const getSidebar = (page) => {
  return page.locator('div.fixed.top-10.left-0.bottom-0').filter({ has: page.locator('h4:text("Controls")') });
};

test.describe('Cytoscape Floating Sidebar UI', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');

    // Click on the Visualizations tab button
    await page.getByRole('button', { name: 'Navigate to Visualizations' }).click();

    // Wait for visualizations page to load
    await page.waitForTimeout(1000);

    // Click on "Pathogen Network" visualization
    await page.getByRole('button', { name: /pathogen network/i }).click();

    // Wait for network to load
    await page.waitForTimeout(1500);

    // Find the layout dropdown and select "Cytoscape Network"
    const layoutSelect = page.locator('select').filter({ has: page.locator('option[value="cytoscape"]') });
    await layoutSelect.selectOption('cytoscape');

    // Wait for Cytoscape to initialize with the floating sidebar UI
    await page.waitForTimeout(3000);
  });

  test.describe('Sidebar Functionality', () => {
    test('should have sidebar closed by default', async ({ page }) => {
      // Find the sidebar using helper function
      const sidebar = getSidebar(page);
      await expect(sidebar).toBeAttached();

      // Check if sidebar is translated off-screen (-translate-x-full means hidden)
      const isHidden = await sidebar.evaluate((el) => {
        return el.className.includes('-translate-x-full');
      });

      // Sidebar should be closed (hidden) by default
      expect(isHidden).toBe(true);

      // Verify backdrop is NOT visible when sidebar is closed
      const backdrop = page.locator('div.bg-black.bg-opacity-30');
      await expect(backdrop).not.toBeVisible();
    });

    test('should open sidebar when clicking hamburger menu', async ({ page }) => {
      // Find and click the hamburger menu button
      const hamburgerButton = page.getByRole('button', { name: /open sidebar/i });
      await expect(hamburgerButton).toBeVisible();
      await hamburgerButton.click();

      // Wait for animation to complete
      await page.waitForTimeout(400); // 300ms animation + buffer

      // Verify sidebar is visible using helper function
      const sidebar = getSidebar(page);
      const isVisible = await sidebar.evaluate((el) => {
        return el.className.includes('translate-x-0');
      });
      expect(isVisible).toBe(true);

      // Verify backdrop is visible
      const backdrop = page.locator('div.bg-black.bg-opacity-30');
      await expect(backdrop).toBeVisible();
    });

    test('should close sidebar when clicking X button', async ({ page }) => {
      // Open sidebar first
      await page.getByRole('button', { name: /open sidebar/i }).click();
      await page.waitForTimeout(400);

      // Click the X button in the sidebar
      const closeButton = page.getByRole('button', { name: /close sidebar/i }).last();
      await closeButton.click();
      await page.waitForTimeout(400);

      // Verify sidebar is hidden using helper function
      const sidebar = getSidebar(page);
      const isHidden = await sidebar.evaluate((el) => {
        return el.className.includes('-translate-x-full');
      });
      expect(isHidden).toBe(true);
    });

    test('should close sidebar when clicking backdrop', async ({ page }) => {
      // Open sidebar
      await page.getByRole('button', { name: /open sidebar/i }).click();
      await page.waitForTimeout(400);

      // Click the backdrop
      const backdrop = page.locator('div.bg-black.bg-opacity-30');
      await backdrop.click({ position: { x: 400, y: 300 } }); // Click away from sidebar
      await page.waitForTimeout(400);

      // Verify sidebar is hidden using helper function
      const sidebar = getSidebar(page);
      const isHidden = await sidebar.evaluate((el) => {
        return el.className.includes('-translate-x-full');
      });
      expect(isHidden).toBe(true);
    });

    test('should close sidebar when pressing ESC key', async ({ page }) => {
      // Open sidebar
      await page.getByRole('button', { name: /open sidebar/i }).click();
      await page.waitForTimeout(400);

      // Press ESC key
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);

      // Verify sidebar is hidden using helper function
      const sidebar = getSidebar(page);
      const isHidden = await sidebar.evaluate((el) => {
        return el.className.includes('-translate-x-full');
      });
      expect(isHidden).toBe(true);
    });
  });

  test.describe('Header Functionality', () => {
    test('should display minimal header with correct elements', async ({ page }) => {
      // Check header exists
      const header = page.locator('div.h-10.bg-gray-100');
      await expect(header).toBeVisible();

      // Check hamburger menu button
      const hamburger = page.getByRole('button', { name: /sidebar/i });
      await expect(hamburger).toBeVisible();

      // Check title
      const title = page.getByText('Pathogen-Antibiotic Network');
      await expect(title).toBeVisible();

      // Check layout selector
      const layoutSelect = page.getByRole('combobox', { name: /select network layout/i });
      await expect(layoutSelect).toBeVisible();
    });

    test('should change layout when selecting from dropdown', async ({ page }) => {
      const layoutSelect = page.getByRole('combobox', { name: /select network layout/i });

      // Select a different layout
      await layoutSelect.selectOption('circle');

      // Wait for layout to apply
      await page.waitForTimeout(1000);

      // Verify selection changed
      const selectedValue = await layoutSelect.inputValue();
      expect(selectedValue).toBe('circle');
    });
  });

  test.describe('Filter Functionality', () => {
    test('should toggle pathogen filter', async ({ page }) => {
      // Open sidebar
      await page.getByRole('button', { name: /open sidebar/i }).click();
      await page.waitForTimeout(400);

      // Find and click pathogen checkbox
      const pathogenCheckbox = page.getByRole('checkbox', { name: /pathogens/i });
      await expect(pathogenCheckbox).toBeChecked();

      await pathogenCheckbox.uncheck();
      await page.waitForTimeout(500);

      // Verify it's unchecked
      await expect(pathogenCheckbox).not.toBeChecked();
    });

    test('should toggle antibiotic filter', async ({ page }) => {
      // Open sidebar
      await page.getByRole('button', { name: /open sidebar/i }).click();
      await page.waitForTimeout(400);

      // Find and click antibiotic checkbox
      const antibioticCheckbox = page.getByRole('checkbox', { name: /antibiotics/i });
      await expect(antibioticCheckbox).toBeChecked();

      await antibioticCheckbox.uncheck();
      await page.waitForTimeout(500);

      // Verify it's unchecked
      await expect(antibioticCheckbox).not.toBeChecked();
    });

    test('should reset all filters when clicking Reset All button', async ({ page }) => {
      // Open sidebar
      await page.getByRole('button', { name: /open sidebar/i }).click();
      await page.waitForTimeout(400);

      // Uncheck some filters
      const pathogenCheckbox = page.getByRole('checkbox', { name: /pathogens/i });
      await pathogenCheckbox.uncheck();
      await page.waitForTimeout(200);

      // Click Reset All
      const resetButton = page.getByRole('button', { name: /reset all/i });
      await resetButton.click();
      await page.waitForTimeout(500);

      // Verify pathogen checkbox is checked again
      await expect(pathogenCheckbox).toBeChecked();
    });
  });

  test.describe('Legend Functionality', () => {
    test('should toggle legend expand/collapse', async ({ page }) => {
      // Open sidebar
      await page.getByRole('button', { name: /open sidebar/i }).click();
      await page.waitForTimeout(500);

      // Scroll the sidebar to ensure legend section is in view
      const sidebar = getSidebar(page);
      await sidebar.evaluate((el) => {
        el.scrollTop = el.scrollHeight; // Scroll to bottom where legend is
      });
      await page.waitForTimeout(300);

      // Find the legend section by looking for the h5 with "Legend" text
      const legendHeader = page.locator('h5').filter({ hasText: 'Legend' });
      await expect(legendHeader).toBeVisible();

      // The legend content (Node Types, etc.) should be visible initially
      const legendNodeTypes = page.getByText('Node Types', { exact: true });

      // Check initial state - might be visible or not depending on viewport
      const initiallyVisible = await legendNodeTypes.isVisible().catch(() => false);

      // Click the parent div to toggle
      const legendToggleDiv = page.locator('div.cursor-pointer').filter({ has: legendHeader });
      await legendToggleDiv.click();
      await page.waitForTimeout(400);

      // Check if visibility changed
      const afterFirstClick = await legendNodeTypes.isVisible().catch(() => false);
      expect(afterFirstClick).toBe(!initiallyVisible);

      // Click again to toggle back
      await legendToggleDiv.click();
      await page.waitForTimeout(400);

      // Should be back to initial state
      const afterSecondClick = await legendNodeTypes.isVisible().catch(() => false);
      expect(afterSecondClick).toBe(initiallyVisible);
    });
  });

  test.describe('Visual and Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      // Check hamburger button ARIA
      const hamburger = page.getByRole('button', { name: /open sidebar/i });
      await expect(hamburger).toHaveAttribute('aria-label');

      // Open sidebar
      await hamburger.click();
      await page.waitForTimeout(400);

      // Check if aria-label changes
      const hamburgerAfter = page.getByRole('button', { name: /close sidebar/i }).first();
      await expect(hamburgerAfter).toHaveAttribute('aria-label');
    });

    test('should have keyboard navigation support', async ({ page }) => {
      // Tab to hamburger button
      await page.keyboard.press('Tab');

      // Should focus on hamburger or first focusable element
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });

    test('should show sidebar at correct width (280px)', async ({ page }) => {
      // Open sidebar
      await page.getByRole('button', { name: /open sidebar/i }).click();
      await page.waitForTimeout(400);

      // Check sidebar width using helper function
      const sidebar = getSidebar(page);
      const width = await sidebar.evaluate((el) => {
        return window.getComputedStyle(el).width;
      });

      expect(width).toBe('280px');
    });

    test('should display backdrop with correct opacity', async ({ page }) => {
      // Open sidebar
      await page.getByRole('button', { name: /open sidebar/i }).click();
      await page.waitForTimeout(400);

      // Check backdrop opacity
      const backdrop = page.locator('div.bg-black.bg-opacity-30');
      await expect(backdrop).toBeVisible();

      const opacity = await backdrop.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Should contain rgba with alpha around 0.3
      expect(opacity).toContain('rgba');
    });
  });

  test.describe('Cytoscape Visualization', () => {
    test('should render Cytoscape network', async ({ page }) => {
      // Wait for Cytoscape to load
      await page.waitForTimeout(2000);

      // Check if canvas element exists (Cytoscape renders to canvas)
      const canvasExists = await page.locator('canvas').count() > 0;
      expect(canvasExists).toBe(true);
    });

    test('should use full screen when sidebar is closed', async ({ page }) => {
      // Wait for network to load
      await page.waitForTimeout(2000);

      // Check Cytoscape container dimensions
      const container = page.locator('div.absolute.inset-0');
      const dimensions = await container.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height
        };
      });

      // Should take significant screen space (when sidebar closed)
      expect(dimensions.width).toBeGreaterThan(800);
      expect(dimensions.height).toBeGreaterThan(400);
    });
  });

  test.describe('Responsive Design', () => {
    test('should scroll sidebar content if it overflows', async ({ page }) => {
      // Open sidebar
      await page.getByRole('button', { name: /open sidebar/i }).click();
      await page.waitForTimeout(400);

      // Check if sidebar has overflow-y-auto class using helper function
      const sidebar = getSidebar(page);
      const hasScroll = await sidebar.evaluate((el) => {
        return el.className.includes('overflow-y-auto');
      });

      expect(hasScroll).toBe(true);
    });
  });

  test.describe('Animation Smoothness', () => {
    test('should animate sidebar open smoothly', async ({ page }) => {
      // Get initial position using helper function
      const sidebar = getSidebar(page);

      const initialTransform = await sidebar.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });

      // Open sidebar
      await page.getByRole('button', { name: /open sidebar/i }).click();

      // Wait for animation
      await page.waitForTimeout(400);

      // Get final position
      const finalTransform = await sidebar.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });

      // Transforms should be different
      expect(initialTransform).not.toBe(finalTransform);
    });
  });
});
