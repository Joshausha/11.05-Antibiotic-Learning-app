# Phase 9: Testing Automation & Coverage - Research

**Researched:** 2026-01-08
**Domain:** GitHub Actions CI/CD with Jest test automation and coverage reporting
**Confidence:** HIGH

<research_summary>
## Summary

Researched the modern ecosystem for Jest testing automation in GitHub Actions CI/CD pipelines. The standard approach uses Jest's built-in coverage tools with GitHub Actions marketplace integrations for PR comments, badge generation, and quality gates.

Key finding: Don't hand-roll coverage reporting, PR comments, or badge generation. The GitHub Actions marketplace has battle-tested solutions (jest-coverage-report-action, coverage-badges-action) that handle edge cases, comment updates, and badge hosting. Custom reporting leads to duplicate comments, broken badge URLs, and maintenance burden.

**Primary recommendation:** Use Jest's native `coverageThreshold` for quality gates + GitHub Actions marketplace actions for visualization (PR comments, badges). Configure matrix testing for Node.js versions. Enable flaky test detection early to prevent CI reliability issues.

</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| jest | 29.x | Test framework with built-in coverage | Industry standard for React/Node testing |
| @actions/setup-node | v4 | Node.js runtime in GitHub Actions | Official GitHub action with npm caching |
| @actions/cache | v4 | Dependency caching | Speeds up CI by 40-60% |

### Supporting - Coverage Reporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| ArtiomTr/jest-coverage-report-action | latest | PR coverage comments | Best for pull request feedback |
| jpb06/coverage-badges-action | latest | Badge generation | For README coverage badges |
| codecov/codecov-action | v4 | Codecov integration | If using Codecov service (free for open source) |
| coverallsapp/github-action | v2 | Coveralls integration | Alternative to Codecov |

### Supporting - Quality Gates
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Jest coverageThreshold | Built-in | Fail build on low coverage | Always - native Jest feature |
| actions/github-script | v7 | Custom quality gate logic | For complex conditional gates |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Jest built-in coverage | Istanbul directly | Istanbul is what Jest uses internally - no benefit |
| GitHub Actions marketplace | Custom scripts | Marketplace actions handle comment updates, deduplication |
| Codecov free tier | Coveralls free tier | Both similar - Codecov has better GitHub Actions integration |

**Installation:**
```bash
# Already have Jest - just configure coverage
# GitHub Actions are referenced in workflow YAML, not package.json
```

</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Workflow Structure
```yaml
.github/workflows/
├── test.yml              # Main test workflow with coverage
├── deploy.yml            # Deploy workflow (existing)
└── (future: pr-preview.yml, lighthouse.yml)
```

### Pattern 1: Jest Coverage with Quality Gates
**What:** Use Jest's native `coverageThreshold` to fail builds when coverage drops
**When to use:** Always - prevents coverage regression
**Example:**
```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  collect CoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    // Higher thresholds for critical modules
    './src/data/**/*.{js,ts}': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
```

### Pattern 2: GitHub Actions Test Workflow with Caching
**What:** Matrix testing across Node versions with npm caching
**When to use:** Standard for all Node.js projects
**Example:**
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: ['18.x', '20.x']

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests with coverage
      run: npm test -- --coverage --watchAll=false

    - name: Upload coverage reports
      uses: codecov/codecov-action@v4
      if: matrix.node-version == '20.x'
      with:
        files: ./coverage/lcov.info
        fail_ci_if_error: true
```

### Pattern 3: PR Coverage Comments
**What:** Automated coverage diff comments on pull requests
**When to use:** For all PRs - provides immediate feedback
**Example:**
```yaml
    - name: Jest coverage comment
      uses: ArtiomTr/jest-coverage-report-action@v2
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        threshold: 70
        working-directory: ./
```

### Anti-Patterns to Avoid
- **Running tests without `npm ci`:** Use `npm ci` not `npm install` - ensures lock file consistency
- **Not caching node_modules:** Missing `cache: 'npm'` adds 30-60s to every run
- **Custom coverage comment scripts:** Leads to duplicate comments, broken updates
- **Ignoring flaky tests:** Disables them ASAP or entire team wastes time on false positives

</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PR coverage comments | Custom GitHub API script | ArtiomTr/jest-coverage-report-action | Handles comment updates, deduplication, formatting |
| Coverage badges | Manual SVG generation | jpb06/coverage-badges-action | Handles gist/branch storage, updates, shields.io format |
| Quality gate enforcement | Exit code parsing | Jest coverageThreshold config | Native feature, fail fast, clearer errors |
| Test result annotations | Custom reporter | Jest github-actions reporter | GitHub automatically shows inline test failures |
| Flaky test detection | Manual observation | BuildPulse or Trunk Flaky Tests | Tracks historical patterns, not just single runs |

**Key insight:** GitHub Actions marketplace has solved the "coverage visualization" problem comprehensively. Custom solutions break when GitHub API changes, create duplicate comments, and require ongoing maintenance. The marketplace actions are maintained by specialists and handle edge cases you haven't thought of yet.

</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Coverage Appears to Drop on PR
**What goes wrong:** Coverage % decreases even though new code is tested
**Why it happens:** New untested files added to codebase without tests
**How to avoid:** Use `collectCoverageFrom` to include all source files, not just tested ones
**Warning signs:** Coverage report shows 100% for changed files but overall coverage drops

### Pitfall 2: Flaky Tests Poison CI
**What goes wrong:** Tests randomly fail, team ignores failures, real bugs slip through
**Why it happens:** Race conditions, async timing issues, shared state between tests
**How to avoid:** Disable flaky tests immediately, use BuildPulse/Trunk to detect patterns
**Warning signs:** "Just rerun it" becomes common phrase, developers stop trusting CI

### Pitfall 3: Coverage Threshold Too Aggressive
**What goes wrong:** Team can't merge legitimate code because coverage threshold is unrealistic
**Why it happens:** Setting 90%+ global coverage when starting from 60%
**How to avoid:** Start with current coverage -5%, gradually increase by 5% per quarter
**Warning signs:** Developers writing meaningless tests just to hit threshold

### Pitfall 4: Not Failing CI on Coverage Drop
**What goes wrong:** Coverage slowly decays over time
**Why it happens:** No `coverageThreshold` configured, coverage reporting is "informational"
**How to avoid:** Set `coverageThreshold` in jest.config.js from day one
**Warning signs:** Coverage badge shows steady decline month over month

### Pitfall 5: Testing Against Wrong Node Version
**What goes wrong:** Tests pass in CI but fail in production
**Why it happens:** CI uses different Node version than production deployment
**How to avoid:** Matrix test across supported versions, match production version exactly
**Warning signs:** "Works on my machine" and "works in CI" but fails in prod

</common_pitfalls>

<code_examples>
## Code Examples

### Complete Jest Configuration for CI
```javascript
// jest.config.js - Production-ready CI configuration
module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Coverage collection
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/index.js',
  ],

  // Coverage output
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',           // Console output
    'text-summary',   // Brief console summary
    'lcov',           // For Codecov/Coveralls
    'json-summary',   // For badge generation
  ],

  // Quality gates
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    // Critical medical data - higher standards
    './src/data/**/*.{js,ts}': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },

  // CI-specific reporters
  reporters: [
    'default',
    ['github-actions', { silent: false }],  // GitHub annotations
    'summary',                               // Clean summary output
  ],

  // Optimization
  maxWorkers: '50%',  // Use half of available CPUs in CI
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
};
```

### GitHub Actions Workflow - Complete Test Suite
```yaml
# .github/workflows/test.yml
name: Tests & Coverage

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

permissions:
  contents: read
  pull-requests: write  # For coverage comments
  checks: write         # For test annotations

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: ['18.x', '20.x']
      fail-fast: false  # Continue testing other versions if one fails

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests with coverage
      run: npm test -- --coverage --watchAll=false --maxWorkers=2

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v4
      if: matrix.node-version == '20.x'  # Only upload once
      with:
        files: ./coverage/lcov.info
        flags: unittests
        name: codecov-antibiotic-app
        fail_ci_if_error: true

    - name: Jest coverage report
      uses: ArtiomTr/jest-coverage-report-action@v2
      if: matrix.node-version == '20.x' && github.event_name == 'pull_request'
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        threshold: 70
        working-directory: ./
        coverage-file: ./coverage/coverage-summary.json
        base-coverage-file: ./coverage/coverage-summary.json

    - name: Generate coverage badges
      uses: jpb06/coverage-badges-action@v1
      if: matrix.node-version == '20.x' && github.ref == 'refs/heads/main'
      with:
        branches: main
        coverage-summary-path: ./coverage/coverage-summary.json
        target-branch: badges
```

### Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --coverage --watchAll=false --maxWorkers=2"
  }
}
```

</code_examples>

<sota_updates>
## State of the Art (2024-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual coverage checks | Jest coverageThreshold | Jest 24+ (2019) | Automatic fail-fast, no custom scripts |
| Travis CI/Circle CI | GitHub Actions | 2020-2022 | Free for open source, tighter GitHub integration |
| Istanbul standalone | Jest built-in coverage | Jest 20+ (2017) | One tool instead of two, better DX |
| codecov.io upload script | codecov-action v4 | 2023-2024 | Simpler config, better token handling |
| Custom PR comment scripts | ArtiomTr/jest-coverage-report-action | 2021-2024 | No more duplicate comments, auto-updates |

**New tools/patterns to consider:**
- **BuildPulse/Trunk Flaky Tests (2024-2026):** Machine learning-based flaky test detection that tracks historical patterns, not just single runs
- **GitHub Actions concurrency groups (2023+):** Cancel in-progress runs when new commits pushed - saves CI minutes
- **dependabot integration (2024+):** Automated dependency updates with CI verification before merge

**Deprecated/outdated:**
- **Travis CI:** Moved to paid model, GitHub Actions now standard for open source
- **Manual codecov bash uploader:** Replaced by official GitHub Action
- **Pre-commit test hooks:** Slow local development, better to catch in CI with fast feedback

</sota_updates>

<open_questions>
## Open Questions

1. **Should we use Codecov free tier or stick with GitHub-only badges?**
   - What we know: Both ArtiomTr (PR comments) and jpb06 (badges) work without external services
   - What's unclear: Is Codecov's historical tracking worth the external dependency for a learning project?
   - Recommendation: Start GitHub-only (simpler), add Codecov later if historical tracking becomes valuable

2. **What's the right coverage threshold for a learning sandbox?**
   - What we know: Project currently has 80%+ coverage, that's excellent
   - What's unclear: Should a "learning project" have the same standards as production code?
   - Recommendation: Start at 70% global (current - 10%), keep 90% for critical data modules

3. **Should we test across multiple Node versions?**
   - What we know: Project currently uses Node 20.x, GitHub Pages deploy uses 20.x
   - What's unclear: Is multi-version testing overkill for a single-developer learning project?
   - Recommendation: Matrix test 18.x and 20.x - minimal cost, ensures LTS compatibility

</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [Jest Configuration Docs](https://jestjs.io/docs/configuration) - coverageThreshold, coverageReporters, collectCoverageFrom
- [GitHub Actions Node.js Guide](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs) - setup-node, caching, test execution
- [jest-coverage-report-action](https://github.com/marketplace/actions/jest-coverage-report) - PR coverage comments
- [coverage-badges-action](https://github.com/marketplace/actions/coverage-badges-generation-action) - Badge generation

### Secondary (MEDIUM confidence)
- [Codecov vs Coveralls comparison](https://stackshare.io/stackups/codecov-vs-coveralls) - Service comparison (verified against official docs)
- [GitHub Actions quality gates guide](https://graphite.dev/guides/enforce-code-quality-gates-github-actions) - Quality gate patterns (verified with Jest docs)
- [Jest coverage best practices](https://www.valentinog.com/blog/jest-coverage/) - Configuration patterns (verified with official docs)

### Tertiary (LOW confidence - needs validation)
- None - all findings verified against official documentation

</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Jest testing framework + GitHub Actions CI/CD
- Ecosystem: Coverage reporters (Codecov, Coveralls), badge generators, flaky test detection
- Patterns: Quality gates, matrix testing, PR comments, caching strategies
- Pitfalls: Flaky tests, coverage regression, threshold configuration

**Confidence breakdown:**
- Standard stack: HIGH - Jest and GitHub Actions are official, well-documented
- Architecture: HIGH - Patterns from official GitHub Actions documentation and Jest docs
- Pitfalls: HIGH - Well-documented in community resources and official guides
- Code examples: HIGH - Directly from Jest and GitHub Actions official documentation

**Research date:** 2026-01-08
**Valid until:** 2026-02-08 (30 days - Jest/GitHub Actions ecosystem is stable)

</metadata>

---

*Phase: 09-testing-automation*
*Research completed: 2026-01-08*
*Ready for planning: yes*
