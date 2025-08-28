const https = require('https');
const http = require('http');

async function testApplication() {
  console.log('🧪 Antibiotic Learning App - Simple Test Suite\n');
  
  const testResults = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {
      passed: 0,
      failed: 0,
      total: 0
    }
  };

  function addTest(name, passed, details) {
    const test = {
      name,
      passed,
      details,
      timestamp: new Date().toISOString()
    };
    testResults.tests.push(test);
    testResults.summary.total++;
    if (passed) {
      testResults.summary.passed++;
      console.log(`✅ ${name}`);
    } else {
      testResults.summary.failed++;
      console.log(`❌ ${name}`);
    }
    if (details) {
      console.log(`   ${details}`);
    }
    console.log('');
  }

  // Test 1: Basic connectivity
  try {
    const response = await makeRequest('http://localhost:3000');
    addTest(
      'Application server connectivity', 
      response.statusCode === 200,
      `Status: ${response.statusCode}, Content-Type: ${response.headers['content-type']}`
    );
  } catch (error) {
    addTest('Application server connectivity', false, `Error: ${error.message}`);
  }

  // Test 2: JavaScript bundle accessibility
  try {
    const bundleResponse = await makeRequest('http://localhost:3000/static/js/bundle.js');
    const bundleSize = bundleResponse.headers['content-length'];
    addTest(
      'JavaScript bundle loading',
      bundleResponse.statusCode === 200 && bundleSize > 1000000,
      `Bundle size: ${(bundleSize / 1024 / 1024).toFixed(2)}MB`
    );
  } catch (error) {
    addTest('JavaScript bundle loading', false, `Error: ${error.message}`);
  }

  // Test 3: HTML content structure
  try {
    const htmlContent = await getContent('http://localhost:3000');
    const hasReactRoot = htmlContent.includes('<div id="root">');
    const hasTitle = htmlContent.includes('Medical Learning App');
    const hasBundle = htmlContent.includes('/static/js/bundle.js');
    
    addTest(
      'HTML structure validation',
      hasReactRoot && hasTitle && hasBundle,
      `React root: ${hasReactRoot}, Title: ${hasTitle}, Bundle ref: ${hasBundle}`
    );
  } catch (error) {
    addTest('HTML structure validation', false, `Error: ${error.message}`);
  }

  // Test 4: React application architecture check
  try {
    // Check if key files exist
    const fs = require('fs');
    const path = require('path');
    
    const criticalFiles = [
      'src/App.js',
      'src/components/Header.js',
      'src/components/HomeTab.js',
      'src/components/QuizTab.js',
      'src/contexts/AppContext.js'
    ];
    
    let filesExist = 0;
    criticalFiles.forEach(file => {
      if (fs.existsSync(file)) filesExist++;
    });
    
    addTest(
      'React component architecture',
      filesExist === criticalFiles.length,
      `${filesExist}/${criticalFiles.length} critical files found`
    );
  } catch (error) {
    addTest('React component architecture', false, `Error: ${error.message}`);
  }

  // Test 5: Medical data structure validation
  try {
    const fs = require('fs');
    const dataFiles = [
      'src/data/medicalConditions.js',
      'src/data/pathogenAntibioticMap.js',
      'src/data/quizQuestions.js'
    ];
    
    let dataFilesExist = 0;
    dataFiles.forEach(file => {
      if (fs.existsSync(file)) dataFilesExist++;
    });
    
    addTest(
      'Medical data files presence',
      dataFilesExist === dataFiles.length,
      `${dataFilesExist}/${dataFiles.length} data files found`
    );
  } catch (error) {
    addTest('Medical data files presence', false, `Error: ${error.message}`);
  }

  // Test Summary
  console.log('📊 Test Summary');
  console.log('================');
  console.log(`Total Tests: ${testResults.summary.total}`);
  console.log(`Passed: ${testResults.summary.passed}`);
  console.log(`Failed: ${testResults.summary.failed}`);
  console.log(`Success Rate: ${((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1)}%`);
  
  if (testResults.summary.failed === 0) {
    console.log('\n🎉 All tests passed! Application appears to be running correctly.');
    console.log('\n📋 Recommended Manual Testing:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Test navigation through all 6 tabs (Learn, Quiz, Analytics, Reference, Pathogens, Antibiotics)');
    console.log('3. Check browser console for any JavaScript errors');
    console.log('4. Verify medical content loads correctly');
    console.log('5. Test quiz functionality and progress tracking');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the issues above before manual testing.');
  }

  // Save results
  require('fs').writeFileSync('simple_test_results.json', JSON.stringify(testResults, null, 2));
  console.log('\n💾 Test results saved to simple_test_results.json');
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.request(url, { method: 'HEAD' }, (res) => {
      resolve(res);
    });
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Request timeout')));
    req.end();
  });
}

function getContent(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.request(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Request timeout')));
    req.end();
  });
}

// Run the tests
testApplication().catch(console.error);