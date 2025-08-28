# Antibiotic Learning App: Junior Developer Remediation Plan

## Introduction

Welcome to the Antibiotic Learning App project! This document provides a clear, step-by-step roadmap to stabilize the application and resolve critical issues identified during a recent audit. The primary goal is to bring the application to a healthy state where all tests pass, making it ready for future development and deployment.

Please follow these phases in order, as each step builds upon the last.

---

## Phase 1: Stabilize the Unit & Integration Test Suite

**Goal:** Get the `npm test` command to run successfully with a 100% pass rate.

This is the most critical phase. A stable test suite is essential for reliable development.

### Step 1.1: Fix the `window.matchMedia` Fatal Error

*   **Problem:** The entire test suite is currently blocked by a `TypeError: Cannot read properties of undefined (reading 'matches')`. This error originates in `src/animations/NorthwesternAnimations.js` because the `window.matchMedia` browser API is not available in the Node.js-based test environment (JSDOM).

*   **Solution:** A "mock" (a fake version) of `window.matchMedia` needs to be provided to the test environment globally. A mock for this already exists in `src/setupTests.js`, but it appears it's not being applied correctly or is being overridden.

*   **Action:**
    1.  Open `src/setupTests.js` and review the existing `Object.defineProperty(window, 'matchMedia', ...)` block.
    2.  Verify that the `package.json` file's `jest` configuration correctly points to this setup file under the `setupFilesAfterEnv` key. It should look like this: `"setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"]`.
    3.  Ensure no other test file is overriding the global `window` object (a likely issue in `src/animations/__tests__/NorthwesternAnimations.test.js`). A global mock should only be defined once in `setupTests.js`.
    4.  Run `npm test` again. The fatal error should be gone, though other tests will still be failing.

### Step 1.2: Address the Systemic Data Prop Error

*   **Problem:** Several tests fail with `TypeError: safePathogens.filter is not a function`. This indicates that components expecting an array for the `safePathogens` prop are sometimes receiving an object or another data type.

*   **Solution:** Apply defensive coding to ensure components can handle this situation gracefully. The component should validate that the prop is an array before attempting to call array methods on it. This is consistent with the "Proven Patterns" outlined in `CLAUDE.md`.

*   **Action:**
    1.  Locate the components that use the `safePathogens` prop (e.g., `ConsolidatedPathogenExplorer`).
    2.  In the component, before using `.filter()`, add a check to ensure the prop is an array. You can use `Array.isArray(safePathogens)`.
    3.  If it's not an array, default to an empty array (`const pathogens = Array.isArray(safePathogens) ? safePathogens : [];`).
    4.  Run `npm test` and verify that these specific errors are resolved.

### Step 1.3: Update Outdated Tests

*   **Problem:** Many tests are failing with `TestingLibraryElementError`. This means the tests are trying to find HTML elements that have been changed or removed, so the tests are out of sync with the code.

*   **Solution:** You need to update the test queries to match the current component structure.

*   **Action:**
    1.  Go through each failing test file one by one (e.g., `ConsolidatedPathogenExplorer.test.js`, `DetailPanel.test.js`).
    2.  In a failing test, temporarily add `screen.debug()` before the line that fails. This will print the component's current HTML to the console.
    3.  Examine the HTML output to find the correct text, role, or label for the element you want to test.
    4.  Update the failing query (e.g., `getByText`, `getByRole`) with the correct information.
    5.  Repeat this process until all `TestingLibraryElementError` failures are resolved.

---

## Phase 2: Verify End-to-End UI Functionality

**Goal:** Ensure the application's key user flows work as expected in a real browser environment.

### Step 2.1: Run the Playwright Test Suite

*   **Problem:** With the unit tests broken, the actual user-facing functionality of the application is unverified.

*   **Solution:** This project has a suite of end-to-end (E2E) tests written with Playwright. These tests automatically launch a browser, navigate the application, and interact with it like a user would.

*   **Action:**
    1.  Make sure the application is not already running.
    2.  In your terminal, run the command: `npx playwright test`.
    3.  This command will automatically start the web server and run all the test files located in the `tests/e2e/` directory.

### Step 2.2: Debug and Fix Failing E2E Tests

*   **Problem:** It is likely that some E2E tests will fail, reflecting the same bugs found in the unit tests or other issues.

*   **Solution:** Playwright generates a detailed HTML report that makes debugging much easier.

*   **Action:**
    1.  After the test run is complete, open the report with this command: `npx playwright show-report`.
    2.  For each failed test, the report will provide a step-by-step log of actions, the specific error message, a screenshot, and a full execution trace.
    3.  Use this information to diagnose and fix the underlying issues in the React components.

---

## Phase 3: Update Project Documentation

**Goal:** Ensure the project's documentation is accurate and trustworthy.

### Step 3.1: Update `PROJECT_STATUS.md` and `CLAUDE.md`

*   **Problem:** `PROJECT_STATUS.md` and `CLAUDE.md` currently report an 88.3% test pass rate, which is dangerously misleading.

*   **Solution:** Now that the test suites are passing, you must update these documents to reflect the true, healthy state of the project.

*   **Action:**
    1.  Open `PROJECT_STATUS.md` and `CLAUDE.md`.
    2.  Update the test suite status in both files to show a **100% pass rate**.
    3.  Review the rest of the documents and ensure they align with the current state of the application.

### Step 3.2: Review Historical "Memories"

*   **Problem:** The `.serena/memories/` directory contains many documents that may also be out of date.

*   **Solution:** Give these files a quick review and update them where necessary.

*   **Action:**
    1.  Focus on `development_phase_and_roadmap.md`. Update the "Current Test Status" to reflect the 100% pass rate.
    2.  Change the "Current Status" from "Phase 4 - Test Stabilization" to "Phase 5 - Ready for Feature Development".

---

## Conclusion

Congratulations! By completing this plan, you will have single-handedly rescued the project from a critical state of regression. The application is now stable, reliable, and ready for the next phase of development. Your work has been crucial in ensuring the quality and maintainability of this important educational tool.
