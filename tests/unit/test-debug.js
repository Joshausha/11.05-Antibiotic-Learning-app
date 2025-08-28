#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🔍 Running ConsolidatedPathogenExplorer tests with debug output...\n');

// Change to project directory
process.chdir(__dirname);

// Spawn npm test process
const testProcess = spawn('npm', ['test', '--', '--verbose', '--no-coverage', 'src/components/__tests__/ConsolidatedPathogenExplorer.test.js'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

let stdout = '';
let stderr = '';

testProcess.stdout.on('data', (data) => {
  const text = data.toString();
  stdout += text;
  process.stdout.write(text);
});

testProcess.stderr.on('data', (data) => {
  const text = data.toString();
  stderr += text;
  process.stderr.write(text);
});

testProcess.on('close', (code) => {
  console.log(`\n\n📊 Test Summary`);
  console.log(`Exit code: ${code}`);
  
  // Parse and analyze results
  if (stdout.includes('PASS')) {
    console.log('✅ Some tests passed');
  }
  if (stdout.includes('FAIL')) {
    console.log('❌ Some tests failed');
  }
  
  // Look for specific error patterns
  const failureMatches = stdout.match(/● (.*?)(?=\n\n|\n.*?●|$)/gs);
  if (failureMatches) {
    console.log('\n🚨 Failed Tests:');
    failureMatches.forEach((match, i) => {
      console.log(`\n${i + 1}. ${match.trim()}`);
    });
  }
  
  console.log('\n✅ Test execution completed');
});

testProcess.on('error', (err) => {
  console.error('❌ Failed to start test process:', err);
});