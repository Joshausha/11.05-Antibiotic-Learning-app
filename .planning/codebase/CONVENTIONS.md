# Coding Conventions

**Analysis Date:** 2026-01-06

## Naming Patterns

**Files:**
- PascalCase for React components: `NorthwesternPieChart.tsx`, `PathogenCard.tsx`, `QuizTab.tsx`
- camelCase for utilities, data, hooks: `dataParser.ts`, `useQuizProgress.ts`, `medicalConditions.ts`
- `.types.ts` suffix for type definitions: `medical.types.ts`, `app.types.ts`, `component.types.ts`
- `*.test.js` or `*.spec.js` for tests: `PathogenCard.test.js`, `dataTransformation.test.js`
- __tests__/ directory naming (double underscore)

**Functions:**
- camelCase for all functions: `formatPathogenLabel()`, `checkMobile()`, `analyzeBehaviorPatterns()`
- No special prefix for async functions
- Event handlers: `handle[Event]` pattern (`handleClick`, `handleSegmentClick`, `handleSubmit`)

**Variables:**
- camelCase for variables: `isMobile`, `pathogenData`, `quizProgress`
- UPPER_SNAKE_CASE for constants: `NORTHWESTERN_COLORS`, `VISUAL_STATES`, `SEGMENT_DEFINITIONS`
- No underscore prefix for private members (TypeScript doesn't use this convention)

**Types:**
- PascalCase for interfaces: `MedicalCondition`, `Antibiotic`, `Pathogen` (no `I` prefix)
- PascalCase for type aliases: `TabType`, `UserConfig`, `ResponseData`
- Union types for enums: `'positive' | 'negative' | 'variable'`

**Hooks:**
- camelCase with `use` prefix: `usePathogenData`, `useQuizProgress`, `useLocalStorage`, `useResponsive`

## Code Style

**Formatting:**
- 2-space indentation (inferred from React components)
- Double quotes for strings (standard in React/TypeScript)
- Semicolons required (enforced by ESLint react-app config)
- No explicit line length limit (descriptive names sometimes exceed 80-120 chars)

**TypeScript Configuration:**
- Compiler: TypeScript 5.9.3 - `tsconfig.json`
- Target: ES2020
- Module: ESNext
- JSX: react-jsx (React 18 automatic transform)
- Strict mode: **Fully enabled** (`strict: true`)
  - `noImplicitAny`: true
  - `strictNullChecks`: true
  - `strictFunctionTypes`: true
  - `noImplicitReturns`: true
- Source maps: Enabled for debugging

**Linting:**
- ESLint with `eslint-config-react-app` - `.eslintrc.json`
- Run: `npm run lint`
- Auto-fix: `npm run lint:fix`
- Rules: React/TypeScript best practices from Create React App

**Build Quirk:**
- `TSC_COMPILE_ON_ERROR=true` in `package.json:9` - Build proceeds despite TypeScript errors
- Intentional for learning project (100+ known TypeScript errors acceptable)

## Import Organization

**Order:**
1. React imports (`import React from 'react'`)
2. External packages (`import { Chart } from 'chart.js'`)
3. Internal modules (`import { useAppContext } from '../contexts/AppContext'`)
4. Relative imports (`import PathogenCard from './PathogenCard'`)
5. Type imports (`import type { Antibiotic } from '../types/medical.types'`)

**Grouping:**
- Blank line between import groups (not always followed consistently)
- Alphabetical within groups (not enforced)

**Path Patterns:**
- Relative paths: `../contexts/`, `../../data/`, `./utils/`
- No path aliases configured (no `@/` or `~/` imports)
- File extensions omitted in imports (`.tsx` not included)

## Error Handling

**Patterns:**
- ErrorBoundary component wraps application (`src/components/ErrorBoundary.tsx`)
- Console.error() for logging errors (lines 17-18 in ErrorBoundary.tsx)
- Defensive defaults via optional chaining (`pathogen?.id`)
- Try/catch not consistently used in async operations

**Example from `src/hooks/useResponsive.ts`:**
```typescript
useEffect(() => {
  const checkMobile = (): void => {
    setIsMobile(window.innerWidth < 768);
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);

  // Cleanup - required pattern
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

**Error Types:**
- No custom error classes
- Standard Error objects used
- No structured error handling library (no Result<T, E> pattern)

## Logging

**Framework:**
- console.log() for development debugging
- console.error() in ErrorBoundary component
- No production logging framework (pino, winston)
- Feature flag: `REACT_APP_DEBUG_MODE` for verbose logging

**Patterns:**
- Log state transitions in development
- Log errors before throwing (ErrorBoundary pattern)
- Remove console.log() statements before commit (not enforced)

## Comments

**When to Comment:**
- File headers explaining purpose and context (JSDoc-style)
- Complex medical logic requiring explanation
- Performance targets documented in component headers
- Safety-critical code marked explicitly

**Example File Header Pattern** (`src/components/NorthwesternPieChart.tsx`):
```tsx
/**
 * Northwestern 8-Segment Pie Chart Component (TypeScript)
 *
 * Core visualization component for antibiotic coverage using Northwestern methodology.
 * Renders 8 segments representing different pathogen categories with coverage levels.
 *
 * Created by: Agent 2.1 - Phase 2 Northwestern Foundation
 * Medical Accuracy: Validated against EnhancedAntibioticData.ts
 * Performance Target: <1000ms rendering, <200ms re-render
 */
```

**Example Function Documentation** (`src/utils/textFormatting.ts`):
```tsx
/**
 * Smart line breaking for medical pathogen names
 * Uses syllable-aware breaking to create more balanced line distribution
 *
 * @param text - The text to format
 * @param maxCharsPerLine - Approximate max characters per line
 * @returns - Text with newline characters inserted
 */
export function formatPathogenLabel(text: string, maxCharsPerLine: number = 10): string {
```

**Inline Comments:**
- Explain "why" not "what" (when logic isn't self-evident)
- Descriptive comments for complex algorithms
- Cleanup/lifecycle comments in useEffect hooks
- Example: `// Cleanup event listener on component unmount`

**TODO Comments:**
- Pattern: `// TODO: description` (no username)
- Not extensively used (experimental project accepts incomplete features)

## Function Design

**Size:**
- No strict limit enforced
- Complex visualization functions can exceed 100 lines
- Utility functions kept focused and small

**Parameters:**
- TypeScript enforces parameter types
- Optional parameters with defaults: `pathogen = null`, `onClose = () => {}`
- Destructuring in parameter list: `({ pathogen, onClose })`

**Return Values:**
- Explicit return type annotations on exported functions
- React components: `React.FC<PropsType>`
- Hooks: Explicit return type (`useResponsive(): boolean`)
- Early returns for guard clauses

## Module Design

**Exports:**
- Default export for React components
- Named exports for utilities, hooks, and data
- Example: `export default PathogenCard` vs `export { formatPathogenLabel }`

**Barrel Files:**
- `src/types/index.ts` re-exports all type definitions
- Not extensively used elsewhere
- Direct imports preferred over barrel imports

**Component Pattern Example:**
```tsx
import React, { useMemo } from 'react';

interface PathogenCardProps {
  pathogen?: Pathogen | null;
  onClose?: () => void;
}

const PathogenCard: React.FC<PathogenCardProps> = ({
  pathogen = null,
  onClose = () => {}
}) => {
  const pathogenInfo = useMemo(() => {
    if (!pathogen) return null;
    return getPathogenDurationInfo(pathogen.id);
  }, [pathogen]);

  // ... component logic
};

export default PathogenCard;
```

**Conventions Observed:**
- Props interface defined inline (not separate file)
- React.FC<Props> type annotation
- Default parameters for optional props
- useMemo for expensive computations
- Default export for component

---

*Convention analysis: 2026-01-06*
*Update when patterns change*
