#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🎯 Running final ConsolidatedPathogenExplorer test suite...\n');
console.log('📊 Targeting: <5 failures (>90% success rate)\n');

try {
  const result = execSync(
    'npm test -- --watchAll=false --verbose src/components/__tests__/ConsolidatedPathogenExplorer.test.js',
    { 
      encoding: 'utf8', 
      cwd: process.cwd(),
      timeout: 60000 // 60 second timeout
    }
  );
  
  console.log('✅ Test execution completed successfully!');
  
  // Parse results
  const lines = result.split('\n');
  let passCount = 0;
  let failCount = 0;
  let totalCount = 0;
  
  // Look for test summary
  const summaryLine = lines.find(line => line.includes('Tests:') && (line.includes('passed') || line.includes('failed')));
  if (summaryLine) {
    console.log('\n📊 Test Summary:');
    console.log(summaryLine);
    
    // Extract numbers
    const passMatch = summaryLine.match(/(\d+) passed/);
    const failMatch = summaryLine.match(/(\d+) failed/);
    const totalMatch = summaryLine.match(/(\d+) total/);
    
    if (passMatch) passCount = parseInt(passMatch[1]);
    if (failMatch) failCount = parseInt(failMatch[1]);
    if (totalMatch) totalCount = parseInt(totalMatch[1]);
    
    // Calculate success rate
    const successRate = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(1) : 0;
    console.log(`\n🎯 Success Rate: ${successRate}% (${passCount}/${totalCount})`);
    
    // Check if we met our target
    if (failCount <= 5 && successRate >= 90) {
      console.log('🎉 SUCCESS: Target achieved! ≤5 failures and ≥90% success rate');
    } else {
      console.log(`⚠️  Target not yet met. Current: ${failCount} failures, ${successRate}% success`);
    }
  }
  
  // Look for specific failures
  const failureLines = lines.filter(line => line.trim().startsWith('●'));
  if (failureLines.length > 0) {
    console.log('\n❌ Remaining Failures:');
    failureLines.forEach((line, i) => {
      console.log(`${i + 1}. ${line.trim()}`);
    });
  }
  
  // Save full output for analysis
  fs.writeFileSync('test-results.log', result);
  console.log('\n📄 Full test output saved to test-results.log');
  
} catch (error) {
  console.log('❌ Test execution encountered issues:');
  
  if (error.stdout) {
    console.log('\n📤 Standard Output:');
    console.log(error.stdout.substring(0, 2000)); // First 2000 chars
    
    // Save for analysis
    fs.writeFileSync('test-error-output.log', error.stdout);
    console.log('\n📄 Full error output saved to test-error-output.log');
  }
  
  if (error.stderr) {
    console.log('\n📤 Error Output:');
    console.log(error.stderr.substring(0, 1000)); // First 1000 chars
  }
  
  console.log(`\n Exit Code: ${error.status}`);
}