#!/usr/bin/env node

// Quick test runner specifically for PathogenExplorer
const { spawn } = require('child_process');
const path = require('path');

// Set up environment
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

console.log('🧪 Running PathogenExplorer tests...');

const testProcess = spawn('node', [
  'scripts/test.js',
  '--testNamePattern=PathogenExplorer',
  '--testPathPattern=PathogenExplorer.test.js',
  '--watchAll=false',
  '--verbose'
], {
  cwd: __dirname,
  stdio: 'inherit',
  env: process.env
});

testProcess.on('close', (code) => {
  console.log(`\n🏁 PathogenExplorer test process exited with code ${code}`);
  process.exit(code);
});

testProcess.on('error', (err) => {
  console.error('❌ Test process error:', err);
  process.exit(1);
});