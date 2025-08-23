#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🧪 Testing basic rendering functionality...\n');

try {
  // Test just the basic rendering tests first
  const result = execSync(
    'npm test -- --testNamePattern="Basic Rendering" --watchAll=false src/components/__tests__/ConsolidatedPathogenExplorer.test.js',
    { encoding: 'utf8', timeout: 30000 }
  );
  
  console.log('✅ Basic rendering tests completed:');
  console.log(result);
  
} catch (error) {
  console.log('❌ Basic rendering tests failed:');
  console.log('STDOUT:', error.stdout?.substring(0, 1500) || 'No stdout');
  console.log('STDERR:', error.stderr?.substring(0, 500) || 'No stderr');
}