# Suggested Commands
**Last Updated**: 2025-10-04
**Package Version**: 1.0.0

## Development Commands

### Primary Development
```bash
npm start               # Start development server (localhost:3000)
npm run dev            # Alias for npm start
```

### Building
```bash
npm run build          # Build production bundle
npm run build:serve    # Build and serve production locally
npm run serve          # Serve pre-built production bundle (port 3000)
```

### Testing
```bash
npm test                    # Run test suite (1,509 tests)
npm run test:coverage       # Run tests with coverage report
npm test -- ComponentName   # Run specific test file
npm test -- --watch         # Watch mode for development
npm test -- --verbose       # Verbose test output
```

### Code Quality
```bash
npm run lint           # Run ESLint on src/ directory
npm run lint:fix       # Auto-fix linting issues
```

### Local Deployment Testing
```bash
npm run deploy:local   # Run coverage → build → serve pipeline
```

### Quick Explorers (Convenience Aliases)
```bash
npm run simple-explorer  # Start Simple Pathogen Explorer
npm run simple          # Alias for simple-explorer
npm run explore         # Alias for simple-explorer
```

## Testing and Verification Commands

### Complete Test Suite
```bash
# Run all 1,509 tests across 57 suites
npm test

# Expected output:
# Test Suites: 57 passed, 57 total
# Tests:       1,509 passed, 1,509 total
# Time:        ~5 seconds
```

### Test Specific Components
```bash
npm test -- PathogenNetworkVisualization  # Test network visualization
npm test -- NorthwesternComparisonView    # Test comparison mode
npm test -- QuizTab                       # Test quiz functionality
npm test -- --testNamePattern="pattern"   # Test by name pattern
```

### Coverage Analysis
```bash
npm run test:coverage

# Generates:
# - Terminal coverage summary
# - Detailed HTML report in coverage/
# - Coverage for all src/ files
```

### Performance Testing
```bash
npm test -- --testNamePattern="Performance"  # Run performance tests
npm test -- --testNamePattern="memory"       # Run memory leak tests
```

## Build and Deployment Commands

### Development Build
```bash
npm run build

# Expected output:
# - Optimized production bundle
# - Bundle size: ~220 kB gzipped
# - Output in build/ directory
# - Source maps for debugging
```

### Production Testing
```bash
npm run build:serve

# Pipeline:
# 1. npm run build (create production bundle)
# 2. npm run serve (serve on localhost:3000)
# 3. Manual testing in production mode
```

### Serve Pre-Built Bundle
```bash
npm run serve

# Requirements:
# - build/ directory must exist
# - Uses npx serve -s build -p 3000
# - Serves static files from build/
```

## System Commands (Darwin/macOS)

### File Navigation
```bash
cd "/Users/joshpankin/My Drive/10-19 Projects/11 Medical Education Projects/11.05 Antibiotic Learning app"
ls -la                 # List all files with details
tree -L 2              # Directory tree (2 levels deep)
```

### File Search
```bash
find . -name "*.js" -type f           # Find all JavaScript files
find . -name "*test.js"                # Find all test files
find . -name "*.jsx" -o -name "*.js"   # Find JS and JSX files
```

### Content Search
```bash
grep -r "ComponentName" src/          # Search for component usage
grep -r "TODO" src/                   # Find TODO comments
grep -r "FIXME" src/                  # Find FIXME comments
grep -r "import.*d3" src/             # Find D3.js imports
```

### File Operations
```bash
cat package.json                      # View package.json
head -20 src/App.js                   # View first 20 lines
tail -20 src/App.js                   # View last 20 lines
wc -l src/**/*.js                     # Count lines in JS files
```

### System Information
```bash
node --version                        # Check Node.js version
npm --version                         # Check npm version
npx --version                         # Check npx version
```

## Git Commands

### Status and Diff
```bash
git status                            # Check working tree
git diff                              # View unstaged changes
git diff --staged                     # View staged changes
git log --oneline                     # View commit history
git log --oneline --graph             # View branch graph
```

### Staging and Committing
```bash
git add .                             # Stage all changes
git add src/components/Component.js   # Stage specific file
git commit -m "message"               # Commit with message
git push                              # Push to remote
```

### Branch Management
```bash
git branch                            # List local branches
git checkout -b feature-name          # Create new branch
git checkout main                     # Switch to main
git merge feature-name                # Merge branch
```

## Project-Specific Shortcuts

### Quick Development Start
```bash
# Full development cycle
npm install && npm start
```

### Pre-Commit Validation
```bash
# Run all quality checks
npm test && npm run lint && npm run build
```

### Complete Quality Pipeline
```bash
# Full deployment pipeline
npm run deploy:local
# Runs: test:coverage → build → serve
```

## React Development Tools

### Browser DevTools
```bash
# Install React DevTools (browser extension)
# - Chrome: https://chrome.google.com/webstore
# - Firefox: https://addons.mozilla.org/firefox
```

### Development Server Features
```bash
npm start
# Features:
# - Hot module replacement (HMR)
# - Fast refresh (preserves component state)
# - Automatic browser opening
# - Error overlay
# - Lint error display
```

## Testing Utilities

### Test Debugging
```bash
npm test -- --no-coverage              # Skip coverage for speed
npm test -- --maxWorkers=1            # Run tests serially
npm test -- --bail                    # Stop on first failure
npm test -- --clearCache              # Clear Jest cache
```

### Playwright E2E Testing
```bash
npx playwright test                   # Run E2E tests
npx playwright test --headed          # Run with browser visible
npx playwright show-report            # View test report
```

## Bundle Analysis

### Analyze Bundle Size
```bash
npm run build

# Output includes:
# - File sizes after gzip
# - Chunk breakdown
# - Large module warnings
```

### Source Map Analysis
```bash
# Build includes source maps for debugging
# Located in build/static/js/*.map
```

## Package Management

### Dependency Management
```bash
npm install                           # Install dependencies
npm install package-name              # Add new dependency
npm install --save-dev package        # Add dev dependency
npm update                            # Update dependencies
npm outdated                          # Check for outdated packages
```

### Clean Installation
```bash
rm -rf node_modules package-lock.json
npm install
```

## Performance Profiling

### React Profiler
```bash
# 1. npm start
# 2. Open React DevTools
# 3. Switch to Profiler tab
# 4. Record interactions
# 5. Analyze component render times
```

### Lighthouse Audit
```bash
# 1. npm run build
# 2. npm run serve
# 3. Open Chrome DevTools
# 4. Run Lighthouse audit
# 5. Review performance metrics
```

## Medical Content Validation

### Run Medical Accuracy Tests
```bash
npm test -- --testNamePattern="Medical Content"
npm test -- --testNamePattern="clinically accurate"
npm test -- --testNamePattern="resistance warnings"
```

### Accessibility Testing
```bash
npm test -- --testNamePattern="Accessibility"
npm test -- --testNamePattern="ARIA"
npm test -- --testNamePattern="keyboard"
```

## Quick Reference Card

```
DEVELOPMENT:
  npm start                 → Dev server
  npm test                  → Run tests
  npm run lint             → Check code quality

BUILD:
  npm run build            → Production build
  npm run build:serve      → Build + serve locally

TESTING:
  npm test -- Component    → Test specific file
  npm run test:coverage    → Coverage report
  npm test -- --watch      → Watch mode

QUALITY:
  npm run lint:fix         → Auto-fix linting
  npm run deploy:local     → Full pipeline
```

## Common Workflows

### Starting New Feature
```bash
1. git checkout -b feature-name
2. npm start                    # Start dev server
3. # Make changes
4. npm test                     # Verify tests pass
5. npm run lint                 # Check code quality
6. npm run build                # Verify build succeeds
7. git add .
8. git commit -m "feat: description"
9. git push
```

### Debugging Test Failures
```bash
1. npm test -- ComponentName --verbose
2. # Review error output
3. # Fix issue
4. npm test -- ComponentName
5. # Verify fix
6. npm test                     # Run full suite
```

### Preparing for Deployment
```bash
1. npm run test:coverage        # Verify 80%+ coverage
2. npm run lint                 # No linting errors
3. npm run build                # Build succeeds
4. npm run serve                # Test production build
5. # Manual testing
6. git tag v1.x.x               # Version tag
7. git push --tags              # Push release
```

## Notes

### No Longer Used
- ~~`node test-components.js`~~ - Removed in favor of comprehensive Jest suite
- Custom component verification scripts deprecated

### Environment Variables
- Development: Automatically handled by React Scripts
- Production: Set environment variables before `npm run build`
- `.env` files supported (see Create React App docs)

### Port Configuration
- Default development port: 3000
- Can be changed with PORT environment variable
- Production serve: Fixed to port 3000 (configurable in package.json)

## Summary
The Antibiotic Learning App uses standard **npm scripts** with comprehensive testing, linting, and build commands. The workflow emphasizes test-driven development with 1,509 tests, production-ready builds, and quality validation at every step. All commands support the medical education focus with specific test patterns for clinical accuracy and accessibility validation.