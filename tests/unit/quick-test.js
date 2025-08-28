const { execSync } = require('child_process');

try {
  console.log('🧪 Running single test to check our fixes...\n');
  
  const result = execSync(`cd "${process.cwd()}" && npm test -- --testNamePattern="renders component header with title and description" src/components/__tests__/ConsolidatedPathogenExplorer.test.js`, 
    { encoding: 'utf8', stdio: 'pipe' });
  
  console.log('✅ Test output:');
  console.log(result);
} catch (error) {
  console.log('❌ Test failed with output:');
  console.log(error.stdout);
  if (error.stderr) {
    console.log('\n❌ Error details:');
    console.log(error.stderr);
  }
}