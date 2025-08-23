#!/bin/bash
cd "/Users/joshpankin/My Drive/10-19 Projects/11 Medical Education Projects/11.05 Antibiotic Learning app"

echo "=== Running PathogenExplorer Tests with Detailed Output ==="
npm test -- --testPathPattern=PathogenExplorer.test.js --verbose --no-coverage 2>&1 | tee test_output.txt

echo "=== Test Complete ==="
echo "Output saved to test_output.txt"