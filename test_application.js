const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testAntibioticApp() {
  let browser;
  
  try {
    console.log('Starting Antibiotic Learning App Test Suite...\n');
    
    // Launch browser
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // Set up console message and error tracking
    const consoleMessages = [];
    const errors = [];
    
    page.on('console', msg => {
      const message = {
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      };
      consoleMessages.push(message);
      console.log(`Console [${msg.type()}]:`, msg.text());
    });
    
    page.on('error', err => {
      errors.push({
        type: 'page-error',
        message: err.message,
        timestamp: new Date().toISOString()
      });
      console.error('Page Error:', err.message);
    });
    
    page.on('pageerror', err => {
      errors.push({
        type: 'page-error',
        message: err.message,
        timestamp: new Date().toISOString()
      });
      console.error('Page Error:', err.message);
    });
    
    // Navigate to application
    console.log('1. Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 10000 });
    
    // Take screenshot of initial page
    await page.screenshot({ 
      path: 'screenshots/01-initial-page.png',
      fullPage: true 
    });
    console.log('   ✓ Initial page screenshot saved\n');
    
    // Wait for React to load
    await page.waitForSelector('[data-testid="header"], header, [role="banner"]', { timeout: 5000 }).catch(() => {
      console.log('   Header not found with test selectors, continuing...');
    });
    
    const tabs = [
      { name: 'Learn', selector: '[data-tab="learn"], button[onclick*="learn"], a[href*="learn"]', expectedContent: 'learning' },
      { name: 'Quiz', selector: '[data-tab="quiz"], button[onclick*="quiz"], a[href*="quiz"]', expectedContent: 'quiz' },
      { name: 'Analytics', selector: '[data-tab="analytics"], button[onclick*="analytics"], a[href*="analytics"]', expectedContent: 'analytics' },
      { name: 'Reference', selector: '[data-tab="reference"], button[onclick*="reference"], a[href*="reference"]', expectedContent: 'reference' },
      { name: 'Pathogens', selector: '[data-tab="pathogen-explorer"], button[onclick*="pathogen"], a[href*="pathogen"]', expectedContent: 'pathogen' },
      { name: 'Antibiotics', selector: '[data-tab="antibiotic-explorer"], button[onclick*="antibiotic"], a[href*="antibiotic"]', expectedContent: 'antibiotic' }
    ];
    
    // Test navigation through all tabs
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      console.log(`${i + 2}. Testing ${tab.name} tab...`);
      
      try {
        // Try to find and click the tab button
        const tabButton = await page.$(tab.selector);
        if (tabButton) {
          await tabButton.click();
          console.log(`   ✓ ${tab.name} tab button clicked`);
        } else {
          // Try to find by text content
          const buttons = await page.$$('button, a');
          let found = false;
          for (const button of buttons) {
            const text = await page.evaluate(el => el.textContent.toLowerCase(), button);
            if (text.includes(tab.name.toLowerCase())) {
              await button.click();
              console.log(`   ✓ ${tab.name} tab found by text and clicked`);
              found = true;
              break;
            }
          }
          if (!found) {
            console.log(`   ⚠ ${tab.name} tab button not found`);
          }
        }
        
        // Wait a bit for content to load
        await page.waitForTimeout(1000);
        
        // Take screenshot
        await page.screenshot({ 
          path: `screenshots/${String(i + 2).padStart(2, '0')}-${tab.name.toLowerCase()}-tab.png`,
          fullPage: true 
        });
        console.log(`   ✓ ${tab.name} tab screenshot saved`);
        
        // Check for tab-specific content
        const pageContent = await page.content();
        if (pageContent.toLowerCase().includes(tab.expectedContent)) {
          console.log(`   ✓ ${tab.name} content appears to be loaded correctly`);
        } else {
          console.log(`   ⚠ ${tab.name} expected content not detected`);
        }
        
      } catch (error) {
        console.log(`   ✗ Error testing ${tab.name} tab:`, error.message);
        errors.push({
          type: 'tab-navigation-error',
          tab: tab.name,
          message: error.message,
          timestamp: new Date().toISOString()
        });
      }
      
      console.log('');
    }
    
    // Final page content analysis
    console.log('8. Analyzing final page state...');
    const finalContent = await page.content();
    const hasReact = finalContent.includes('react') || finalContent.includes('React');
    const hasErrors = finalContent.includes('error') || finalContent.includes('Error');
    
    console.log(`   React detected: ${hasReact}`);
    console.log(`   Error indicators: ${hasErrors}`);
    
    // Generate test report
    const report = {
      timestamp: new Date().toISOString(),
      testResults: {
        totalTabs: tabs.length,
        consoleMessages: consoleMessages,
        errors: errors,
        pageLoadSuccessful: true,
        screenshots: {
          initial: '01-initial-page.png',
          tabs: tabs.map((tab, i) => `${String(i + 2).padStart(2, '0')}-${tab.name.toLowerCase()}-tab.png`)
        }
      }
    };
    
    fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
    console.log('9. Test report saved to test-report.json\n');
    
    return report;
    
  } catch (error) {
    console.error('Critical test failure:', error);
    return {
      timestamp: new Date().toISOString(),
      testResults: {
        criticalError: error.message,
        pageLoadSuccessful: false
      }
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Create screenshots directory if it doesn't exist
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

// Run the test
testAntibioticApp().then(report => {
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Test completed at: ${report.timestamp}`);
  if (report.testResults.criticalError) {
    console.log(`Critical Error: ${report.testResults.criticalError}`);
  } else {
    console.log(`Console Messages: ${report.testResults.consoleMessages.length}`);
    console.log(`Errors Detected: ${report.testResults.errors.length}`);
    console.log(`Page Load: ${report.testResults.pageLoadSuccessful ? 'SUCCESS' : 'FAILED'}`);
  }
  console.log('===================\n');
}).catch(console.error);