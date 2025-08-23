const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Running ConsolidatedPathogenExplorer tests...\n');

const testProcess = spawn('npm', ['test', '--', 'src/components/__tests__/ConsolidatedPathogenExplorer.test.js'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

testProcess.on('close', (code) => {
  console.log(`\n📊 Test process finished with code ${code}`);
  if (code === 0) {
    console.log('✅ All tests passed!');
  } else {
    console.log('❌ Some tests failed. Code:', code);
  }
});

testProcess.on('error', (err) => {
  console.error('❌ Failed to start test process:', err);
});