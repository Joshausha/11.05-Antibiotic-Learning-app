# Antibiotic App Remediation: TODO List

This document breaks down the `JUNIOR_DEVELOPER_REMEDIATION_PLAN.md` into atomic, trackable tasks. Check items off as you complete them to track your progress.

---

### Phase 1: Stabilize the Unit & Integration Test Suite

- [ ] **Goal: Achieve 100% pass rate for `npm test`**

**Step 1.1: Fix `window.matchMedia` Fatal Error**
- [ ] Review the `Object.defineProperty(window, 'matchMedia', ...)` mock in `src/setupTests.js`.
- [ ] Verify that `package.json` has `"setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"]` in the `jest` config.
- [ ] Search for and remove any local overrides of the `window` object in test files, especially in `src/animations/__tests__/NorthwesternAnimations.test.js`.
- [ ] Run `npm test` to confirm the initial `TypeError: Cannot read properties of undefined (reading 'matches')` is gone.

**Step 1.2: Address Systemic Data Prop Error**
- [ ] Identify all components that receive a `safePathogens` prop.
- [ ] For each component, add a defensive `Array.isArray(safePathogens)` check before any array methods are called.
- [ ] Run `npm test` to confirm all `TypeError: safePathogens.filter is not a function` errors are resolved.

**Step 1.3: Update Outdated Tests**
- [ ] Go to `ConsolidatedPathogenExplorer.test.js`, use `screen.debug()` to find new element selectors, and update the test to make it pass.
- [ ] Go to `DetailPanel.test.js`, use `screen.debug()`, and update the test to make it pass.
- [ ] Go to `AntibioticExplorer.test.js`, use `screen.debug()`, and update the test to make it pass.
- [ ] Systematically repeat this process for all remaining tests that fail with `TestingLibraryElementError`.
- [ ] Confirm that `npm test` now runs to completion with 100% of tests passing.

---

### Phase 2: Verify End-to-End UI Functionality

- [ ] **Goal: Achieve 100% pass rate for `npx playwright test`**

- [ ] Execute the full E2E suite with `npx playwright test`.
- [ ] Launch the Playwright HTML report using `npx playwright show-report`.
- [ ] For each failed test, analyze the error, screenshot, and trace.
- [ ] Apply fixes to the React components to resolve the issues found in the E2E tests.
- [ ] Re-run the E2E tests to confirm all tests now pass.

---

### Phase 3: Update Project Documentation

- [ ] **Goal: Ensure all project documentation is accurate.**

- [ ] Open `PROJECT_STATUS.md` and update the test suite pass rate to 100%.
- [ ] Open `CLAUDE.md` and update the test suite pass rate to 100%.
- [ ] Open `.serena/memories/development_phase_and_roadmap.md`.
- [ ] In the roadmap file, update the "Current Test Status" to reflect the 100% pass rate.
- [ ] In the roadmap file, update the "Current Status" to "Phase 5 - Ready for Feature Development".
- [ ] Perform a final review of all documents to ensure consistency.
