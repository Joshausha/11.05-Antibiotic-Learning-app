# Testing Patterns

**Analysis Date:** 2026-01-06

## Test Framework

**Runner:**
- Jest 27.4.3
- Config: Embedded in `package.json` (jest section)
- Test environment: jsdom (browser-like)

**Assertion Library:**
- Jest built-in `expect`
- Matchers: `toBe`, `toEqual`, `toThrow`, `toBeInTheDocument`
- React Testing Library matchers via `@testing-library/jest-dom`

**Run Commands:**
```bash
npm test                         # Run all tests with watch mode
npm test -- --watchAll=false     # Run all tests once
npm run test:coverage            # Run with coverage report
npm test -- path/to/file.test.js # Run specific file
```

## Test File Organization

**Location:**
- `__tests__/` subdirectories alongside source code
- Co-located pattern: `src/components/__tests__/`, `src/hooks/__tests__/`, `src/utils/__tests__/`

**Naming:**
- `*.test.js` or `*.test.tsx` for all test files
- No distinction between unit/integration in filename

**Structure:**
```
src/
  components/
    PathogenCard.tsx
    __tests__/
      PathogenCard.test.js      # 44+ component tests
  hooks/
    useQuizProgress.ts
    __tests__/
      useQuizProgress.test.js   # 10+ hook tests
  utils/
    dataTransformation.ts
    __tests__/
      dataTransformation.test.js # 15+ utility tests
  __tests__/
    integration/
      CrossComponentIntegration.test.js
      BackwardCompatibilityValidation.test.js
```

## Test Structure

**Suite Organization:**
```javascript
/**
 * Tests for PathogenCard
 * @description Comprehensive test coverage for PathogenCard component
 * Medical safety-critical: Yes (Infection control data)
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PathogenCard from '../PathogenCard';

describe('PathogenCard', () => {
  const mockOnClose = jest.fn();

  const mockPathogen = {
    id: 'staph_aureus',
    name: 'Staphylococcus aureus',
    // ... mock data
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe('Rendering', () => {
    test('renders placeholder when pathogen is null', () => {
      render(<PathogenCard pathogen={null} />);
      expect(screen.getByText(/select a pathogen/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('calls onClose when close button clicked', () => {
      render(<PathogenCard pathogen={mockPathogen} onClose={mockOnClose} />);
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
```

**Patterns:**
- Nested `describe()` blocks for organization
- `beforeEach()` for setup/cleanup (mocks cleared)
- `test()` or `it()` for individual test cases
- Mocks created before describe block
- JSDoc comment noting safety-criticality
- Arrange-Act-Assert pattern

## Mocking

**Framework:**
- Jest built-in mocking (`jest.fn()`, `jest.mock()`)
- React Testing Library for DOM interactions

**Global Mocks** (`src/setupTests.tsx` - 214 lines):
```javascript
// Fetch API
global.fetch = jest.fn();

// ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// DOMParser (for PubMed XML parsing)
global.DOMParser = jest.fn().mockImplementation(() => ({
  parseFromString: jest.fn().mockReturnValue({/* XML structure */}),
}));

// localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Chart.js mocks
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  // ... other Chart.js exports
}));

// react-chartjs-2 mocks (Lines, Pie, Bar, Doughnut)
jest.mock('react-chartjs-2', () => ({
  Line: jest.fn(() => <div>Mocked Line Chart</div>),
  Pie: jest.fn(() => <div>Mocked Pie Chart</div>),
  Bar: jest.fn(() => <div>Mocked Bar Chart</div>),
  Doughnut: jest.fn(() => <div>Mocked Doughnut Chart</div>),
}));

// Lucide React icons
jest.mock('lucide-react', () => ({
  X: () => <div>Mock X Icon</div>,
  ChevronDown: () => <div>Mock ChevronDown Icon</div>,
  // ... other icons
}));
```

**What to Mock:**
- External APIs (fetch, PubMed service)
- Browser APIs (ResizeObserver, IntersectionObserver, localStorage)
- Chart libraries (Chart.js, react-chartjs-2)
- Icon libraries (lucide-react)
- Window methods (scrollTo, matchMedia)

**What NOT to Mock:**
- React itself
- Internal utility functions
- Pure business logic
- Medical data constants

## Fixtures and Factories

**Test Data Patterns:**
```javascript
// Inline mock data
const mockPathogen = {
  id: 'staph_aureus',
  name: 'Staphylococcus aureus',
  gramStatus: 'positive',
};

// Factory-style (from src/test-utils/mockDataFactory.ts)
function createMockCondition(overrides = {}) {
  return {
    id: 'test_condition',
    category: 'Infection',
    name: 'Test Condition',
    ...overrides
  };
}
```

**Location:**
- Inline mocks in test files (most common)
- `src/test-utils/mockDataFactory.ts` for shared factories
- No separate fixtures/ directory

## Coverage

**Requirements:**
- No enforced coverage target
- Coverage tracked for awareness
- Focus on critical medical logic paths

**Configuration:**
- Tool: Jest built-in coverage via `--coverage` flag
- Exclusions: `*.d.ts`, test files excluded automatically
- Collection: `src/**/*.{js,jsx,ts,tsx}`

**View Coverage:**
```bash
npm run test:coverage
# Output in coverage/lcov-report/index.html
```

**Current Status** (per CLAUDE.md):
- Individual test pass rate: 98%
- Test suite pass rate: 87%
- Known issues: Some tests reference moved/deleted components

## Test Types

**Unit Tests:**
- Scope: Single component/function in isolation
- Location: Co-located `__tests__/` directories
- Mocking: All external dependencies mocked
- Examples:
  - `src/components/__tests__/PathogenCard.test.js`
  - `src/utils/__tests__/dataTransformation.test.js`
  - `src/hooks/__tests__/useSearch.test.js`

**Integration Tests:**
- Scope: Multiple modules working together
- Location: `src/__tests__/integration/`
- Mocking: External boundaries only
- Examples:
  - `CrossComponentIntegration.test.js`
  - `BackwardCompatibilityValidation.test.js`
  - `DataCompatibilityValidation.test.js`
  - `PerformanceBenchmark.test.js`

**E2E Tests:**
- Framework: Playwright 1.54.1
- Config: `playwright.config.js`
- Location: `tests/e2e/` (if present)
- Scope: Full user flows
- Status: Limited E2E coverage (focus on unit/integration)

## Common Patterns

**Async Testing:**
```javascript
test('should handle async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});
```

**Error Testing:**
```javascript
// Sync error
test('should throw on invalid input', () => {
  expect(() => parse(null)).toThrow('Cannot parse null');
});

// Async error
test('should reject on failure', async () => {
  await expect(asyncCall()).rejects.toThrow('error message');
});
```

**Component Rendering:**
```javascript
test('renders with correct props', () => {
  render(<PathogenCard pathogen={mockPathogen} />);
  expect(screen.getByText('Staphylococcus aureus')).toBeInTheDocument();
});
```

**User Interactions:**
```javascript
test('handles click event', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick} />);
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

**Data Transformation Testing** (`src/utils/__tests__/dataTransformation.test.js`):
```javascript
describe('Data Transformation - transformEmpiricTherapy', () => {
  test('should transform therapy array to object format', () => {
    const therapyArray = [
      { condition: 'MSSA', therapy: 'Cefazolin OR Oxacillin' }
    ];

    const result = transformEmpiricTherapy(therapyArray);

    expect(typeof result).toBe('object');
    expect(result.MSSA).toBe('Cefazolin OR Oxacillin');
  });

  test('should handle empty or invalid input', () => {
    expect(transformEmpiricTherapy([])).toEqual({});
    expect(transformEmpiricTherapy(null)).toEqual({});
  });
});
```

**Snapshot Testing:**
- Not used in this codebase
- Prefer explicit assertions for clarity

---

*Testing analysis: 2026-01-06*
*Update when test patterns change*
