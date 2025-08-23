#!/bin/bash
cd "/Users/joshpankin/My Drive/10-19 Projects/11 Medical Education Projects/11.05 Antibiotic Learning app"

echo "=== Running All Tests to Verify Current Status ==="
npm test -- --watchAll=false --verbose --no-coverage

echo ""
echo "=== Test Results Summary ==="