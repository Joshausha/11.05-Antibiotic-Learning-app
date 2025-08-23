#!/bin/bash
cd "/Users/joshpankin/My Drive/10-19 Projects/11 Medical Education Projects/11.05 Antibiotic Learning app"

echo "=== Testing Specific PathogenExplorer Fixes ==="
echo "Running test with pattern matching for:"
echo "1. Pathogen count display ('{count} found')"
echo "2. Gram status labels ('Gram(+):' and 'Gram(-):')"
echo ""

npm test -- --testPathPattern=PathogenExplorer.test.js --testNamePattern="displays pathogen count statistics|getGramStatusLabel provides accurate medical terminology" --verbose --no-coverage