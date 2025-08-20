# Task Completion Guidelines

## What to Run After Making Changes

### 1. Verify Component Structure
```bash
node test-components.js
```
This custom script verifies:
- All component files exist
- Components have proper exports
- Documentation is present
- Props are documented

### 2. Run Tests
```bash
npm test
```
Runs the React Testing Library test suite. Currently minimal but should be expanded.

### 3. Build Verification
```bash
npm run build
```
Ensures the application builds successfully without errors.

### 4. Start Development Server
```bash
npm start
```
Test the application manually in the browser to verify functionality.

## Code Quality Checklist
- [ ] Component follows single responsibility principle
- [ ] JSDoc documentation is complete
- [ ] Props are properly documented
- [ ] Accessibility features are maintained
- [ ] No console errors in browser
- [ ] Responsive design works on mobile

## When Adding New Features
1. Create component in appropriate directory (`src/components/`, `src/hooks/`, `src/data/`)
2. Follow existing naming conventions
3. Add comprehensive JSDoc documentation
4. Include accessibility features
5. Test component verification script
6. Update README.md if significant changes

## Pre-commit Checklist
- [ ] No TypeScript/JavaScript errors
- [ ] All tests passing
- [ ] Build succeeds
- [ ] Component verification script passes
- [ ] Manual testing completed
- [ ] Documentation updated

## Note on Testing
The project uses Create React App's default testing setup. Consider expanding with:
- Unit tests for each component
- Integration tests for user workflows
- Accessibility testing
- Performance testing