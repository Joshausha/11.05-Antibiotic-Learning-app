# Task Completion Guidelines
**Last Updated**: 2025-10-04
**Test Suite Status**: 1,509 tests passing (100%) across 57 test suites

## What to Run After Making Changes

### 1. Run Test Suite (PRIMARY VERIFICATION)
```bash
npm test
```
**Purpose**: Run comprehensive test suite with Jest and React Testing Library
**Current Status**: 1,509 tests passing across 57 test suites
**Execution Time**: ~5 seconds
**Coverage**: All components, integration, accessibility, medical content validation

**Test Categories**:
- Component Unit Tests: 900+ tests
- Integration Tests: 400+ tests
- Accessibility Tests: 100+ tests  
- Medical Content Validation: 50+ tests
- Performance Tests: 40+ tests
- Utility Function Tests: 19+ tests

### 2. Run Linting
```bash
npm run lint
```
**Purpose**: Check code quality and React best practices
**Fix Issues**: `npm run lint:fix`

### 3. Build Verification
```bash
npm run build
```
**Purpose**: Ensure production build succeeds
**Output**: Optimized bundle in `build/` directory
**Expected Bundle Size**: ~220 kB gzipped

### 4. Test Coverage Report
```bash
npm run test:coverage
```
**Purpose**: Generate detailed coverage report
**Target**: 80%+ coverage across all components
**Output**: Coverage report in terminal and `coverage/` directory

### 5. Start Development Server
```bash
npm start
# or
npm run dev
```
**Purpose**: Manual testing in browser at http://localhost:3000
**Features to Verify**:
- All 7 tabs functional
- Visualizations render correctly
- Northwestern comparison mode works
- Search and filtering responsive
- Mobile view functional

### 6. Production Build Testing
```bash
npm run build:serve
```
**Purpose**: Test production build locally
**Server**: http://localhost:3000 with production bundle
**Verifies**: Production optimizations, code splitting, asset loading

## Code Quality Checklist

### Before Committing Changes
- [ ] All tests passing (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] No console errors in browser
- [ ] Responsive design works (mobile + desktop)
- [ ] Accessibility features maintained
- [ ] Medical content accuracy verified

### Component-Specific Checklist
- [ ] Component follows single responsibility principle
- [ ] JSDoc documentation complete
- [ ] Props properly documented
- [ ] Tests cover main functionality
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Accessibility features (ARIA labels, keyboard nav)

### Medical Content Checklist
- [ ] Clinical accuracy verified against guidelines
- [ ] Pathogen classifications correct (Gram stain, morphology)
- [ ] Antibiotic coverage data accurate
- [ ] Resistance warnings displayed (ESBL, MRSA, MDR)
- [ ] Age-appropriate content (pediatric focus)

## When Adding New Features

### 1. Component Creation
```bash
# Create component in appropriate directory
src/components/NewComponent.js

# Create test file
src/components/__tests__/NewComponent.test.js
```

### 2. Follow Naming Conventions
- **Components**: PascalCase (e.g., `NorthwesternComparisonView.js`)
- **Tests**: ComponentName.test.js
- **Utils**: camelCase (e.g., `calculateCoverage.js`)
- **Data files**: camelCase (e.g., `antibioticData.js`)

### 3. Documentation Requirements
```javascript
/**
 * Component Name
 * 
 * Brief description of purpose
 * 
 * Props:
 * @param {Type} propName - Description
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 */
```

### 4. Test Requirements
- Minimum 80% coverage for new components
- Test rendering, interactions, edge cases
- Include accessibility tests
- Medical content validation where applicable

### 5. Update Memory Files
If adding significant features:
- Update `project_purpose_and_overview` with new features
- Update `codebase_structure_and_components` with new components
- Update `development_phase_and_roadmap` with phase progress

## Pre-Commit Checklist (MANDATORY)

```bash
# 1. Run full test suite
npm test

# 2. Check linting
npm run lint

# 3. Verify build
npm run build

# 4. Manual browser test
npm start
# - Test all tabs
# - Verify visualizations
# - Check responsive design
# - Test on mobile view

# 5. Check test coverage
npm run test:coverage
```

### Expected Results
- ✅ All 1,509 tests passing
- ✅ No linting errors
- ✅ Build succeeds without warnings
- ✅ Bundle size remains reasonable (<250 kB gzipped)
- ✅ No console errors in browser
- ✅ All features functional

## Testing Best Practices

### Component Testing Pattern
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Component from '../Component';

describe('Component', () => {
  test('renders without crashing', () => {
    render(<Component />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  test('handles user interaction', () => {
    render(<Component />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/result/i)).toBeInTheDocument();
  });

  test('meets accessibility standards', () => {
    const { container } = render(<Component />);
    expect(container.querySelector('[aria-label]')).toBeInTheDocument();
  });
});
```

### Integration Testing
- Test cross-component workflows
- Verify data flow between components
- Test state management integration
- Validate Context API usage

### Medical Content Testing
```javascript
test('displays clinically accurate information', () => {
  render(<PathogenCard pathogen={mockEcoli} />);
  expect(screen.getByText(/gram-negative/i)).toBeInTheDocument();
  expect(screen.getByText(/rod/i)).toBeInTheDocument();
});

test('shows resistance warnings', () => {
  render(<PathogenCard pathogen={mockMRSA} />);
  expect(screen.getByText(/MRSA/i)).toBeInTheDocument();
  expect(screen.getByText(/⚠️/)).toBeInTheDocument();
});
```

## Performance Considerations

### Rendering Optimization
- Use React.memo for expensive components
- Implement virtualization for large lists
- Debounce search inputs
- Lazy load route-based components

### Bundle Size Management
- Monitor bundle size with each build
- Code split large dependencies
- Tree shake unused imports
- Optimize images and assets

### Test Performance
- Keep test execution under 10 seconds
- Mock expensive operations (D3.js, API calls)
- Use Jest's parallel execution
- Cache test results when possible

## Debugging Guidelines

### Common Issues
1. **Tests Failing**: Check mock data, component props, async operations
2. **Build Errors**: Verify imports, webpack config, dependencies
3. **Linting Errors**: Run `npm run lint:fix`, check ESLint config
4. **Performance**: Profile with React DevTools, check re-renders

### Debugging Tools
- React DevTools (browser extension)
- Jest verbose mode: `npm test -- --verbose`
- Test specific file: `npm test -- ComponentName.test.js`
- Watch mode: `npm test -- --watch`

## Medical Accuracy Standards

### Content Validation
- All pathogen data verified against medical references
- Antibiotic coverage based on Northwestern/Sanford Guide standards
- Resistance patterns match current epidemiology
- Pediatric focus maintained throughout

### Clinical Safety
- Emergency mode provides <30 second access
- Critical information prominently displayed
- Resistance warnings visually distinct
- Evidence-based content only

## CI/CD Considerations (Future)

### Pre-Deployment Checklist
1. ✅ All tests passing (1,509/1,509)
2. ✅ Build successful
3. ✅ Bundle size acceptable
4. ✅ Medical content validated
5. ✅ Accessibility compliance verified
6. ✅ Performance metrics met

### Quality Gates
- Test pass rate: 100%
- Code coverage: >80%
- Bundle size: <300 kB gzipped
- Build time: <60 seconds
- Test execution: <10 seconds

## Summary
The Antibiotic Learning App maintains **strict quality standards** with comprehensive testing (1,509 tests), linting, build verification, and medical content validation. All changes must pass the complete test suite, maintain accessibility standards, and preserve clinical accuracy before being considered complete. The development workflow emphasizes test-driven development, continuous validation, and evidence-based medical content quality.