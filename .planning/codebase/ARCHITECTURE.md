# Architecture

**Analysis Date:** 2026-01-06

## Pattern Overview

**Overall:** Layered React Application (Component-Centric + Context API State Management)

**Key Characteristics:**
- Single-page application built with React 18 and TypeScript
- Client-side only (no backend server)
- State management via React Context API (no Redux)
- Component-based architecture with feature-organized modules
- Static medical data bundled with application
- Learning-first design philosophy (multiple experimental approaches coexist)

**Design Philosophy:**
This is an **intentional learning sandbox** where exploration and experimentation are valued. Multiple visualization implementations (D3, Cytoscape, simple network) represent learning paths rather than technical debt. The architecture prioritizes understanding over strict patterns.

## Layers

**Entry Point Layer:**
- Location: `src/index.tsx`
- Purpose: React root initialization and DOM mounting
- Contains: ReactDOM.createRoot() with StrictMode wrapper
- Depends on: React 18, browser DOM
- Used by: Browser (entry point of application)

**Application Layer:**
- Location: `src/App.tsx`
- Purpose: Main application wrapper with lazy-loaded tab routing
- Contains: AppProvider context wrapper, ErrorBoundary, tab navigation system
- Depends on: AppContext, lazy-loaded tab components
- Used by: Entry point layer (`index.tsx`)

**Presentation Layer (Components):**
- Location: `src/components/` (50+ components)
- Purpose: UI components organized by feature domain
- Contains:
  - Core visualizations: `NorthwesternPieChart.tsx`
  - Tab interfaces: `QuizTab.tsx`, `HomeTab.tsx`, `ConditionsTab.tsx`
  - Feature modules: `analytics/`, `ClinicalDecision/`, `network/`, `northwestern/`
- Depends on: State management (AppContext), hooks, utilities
- Used by: Application layer

**State Management Layer:**
- Location: `src/contexts/AppContext.tsx`
- Purpose: Centralized React Context for global state
- Contains: AppProvider component with aggregated state from hooks
- State managed:
  - Navigation: activeTab, showMobileMenu, isMobile
  - Medical data: pathogenData, antibioticData, medicalConditions
  - User interactions: quizProgress, bookmarks, searchResults
- Depends on: Custom hooks (useQuizProgress, usePathogenData, etc.)
- Used by: All components via `useAppContext()` hook

**Business Logic Layer (Hooks + Utils):**
- Hooks: `src/hooks/` - Custom React hooks for data and state
  - `useQuizProgress.ts` - Quiz completion tracking with SRS algorithm
  - `usePathogenData.ts` - Pathogen data retrieval
  - `useAntibioticData.ts` - Antibiotic data retrieval
  - `useLocalStorage.ts` - Browser storage abstraction
  - `useResponsive.ts` - Responsive design detection
- Utils: `src/utils/` - Pure functions and algorithms
  - `spacedRepetitionManager.ts` - Free Spaced Repetition Scheduler (SRS)
  - `dataParser.ts` - Data normalization
  - `graphAlgorithms.ts` - Network graph algorithms
  - `recommendationEngine.ts` - Recommendation logic
- Depends on: Data layer, browser APIs
- Used by: State management and presentation layers

**Data Layer:**
- Location: `src/data/` (~300KB medical knowledge base)
- Purpose: Static medical content bundled with application
- Contains:
  - `medicalConditions.ts` - 20 clinical conditions with treatment protocols
  - `EnhancedAntibioticData.ts` - Antibiotic database with coverage spectrum
  - `quizQuestions.ts` - 46,850+ lines of quiz content
  - `PathogenRelationshipData.ts` - Pathogen similarity mappings (60KB)
- Depends on: Type definitions
- Used by: Business logic layer (hooks)

**External Services Layer:**
- Location: `src/services/`
- Purpose: Integration with external APIs (optional)
- Contains: `pubmedService.ts` - PubMed research integration
- Depends on: Fetch API, environment configuration
- Used by: Components (experimental/optional features)

**Type System Layer:**
- Location: `src/types/`
- Purpose: TypeScript type definitions
- Contains:
  - `medical.types.ts` - Medical domain types
  - `app.types.ts` - Application context and UI types
  - `component.types.ts` - Component prop types
  - `network-ui.types.ts` - Network visualization types
- Depends on: Nothing (pure type definitions)
- Used by: All layers

## Data Flow

**User Interaction Flow:**

```
1. User clicks/interacts with component (e.g., NorthwesternPieChart)
   ↓
2. Component reads current state via useAppContext() hook
   ↓
3. Event handler triggered (e.g., handleSegmentClick)
   ↓
4. State updated via Context API (e.g., setSelectedCondition)
   ↓
5. Context provider triggers re-render
   ↓
6. All subscribed components receive new state
   ↓
7. Components re-render with updated data
```

**Application Initialization Flow:**

```
1. Browser loads index.html
   ↓
2. React mounts via index.tsx → ReactDOM.createRoot()
   ↓
3. App.tsx renders with AppProvider wrapper
   ↓
4. AppContext.tsx initializes all hooks:
   - useResponsive() → detects mobile/desktop
   - usePathogenData(medicalConditions) → builds pathogen map
   - useAntibioticData(medicalConditions) → builds antibiotic map
   - useQuizProgress() → loads quiz history from localStorage
   - useSearch(medicalConditions) → enables search functionality
   ↓
5. contextValue object aggregates all state
   ↓
6. Child components mount and access via useAppContext()
   ↓
7. User sees rendered application
```

**Quiz Session Lifecycle:**

```
1. QuizTab component mounts
   ↓
2. Loads quizQuestions from data/quizQuestions.ts
   ↓
3. Initializes spacedRepetitionManager (SRS algorithm)
   ↓
4. User answers question
   ↓
5. useQuizProgress hook records answer to localStorage
   ↓
6. SRS algorithm updates next review date
   ↓
7. Analytics dashboard displays progress
```

**State Management:**
- Centralized via React Context API
- No external state management library (Redux, Zustand, MobX)
- Persistent state via localStorage for quiz progress and bookmarks
- Ephemeral state for UI interactions (active tab, mobile menu, search)

## Key Abstractions

**Northwestern Visualization System:**
- Purpose: 8-category antibiotic coverage visualization
- Pattern: Pie chart with segments representing pathogen groups (MRSA, VRE, anaerobes, etc.)
- Components:
  - `src/components/NorthwesternPieChart.tsx` - Core implementation
  - `src/components/EnhancedNorthwesternPieChart.tsx` - Enhanced version
  - `src/components/AnimatedNorthwesternPieChart.tsx` - Animated version
- Examples: Multiple variants demonstrate different rendering approaches

**Medical Data Models:**
- Purpose: Standardized medical content structure
- Pattern: TypeScript interfaces with strict typing
- Examples:
  - `MedicalCondition` - Clinical conditions with therapy protocols
  - `Antibiotic` - Antibiotic drugs with coverage spectrum
  - `Pathogen` - Microorganisms with classification data
  - `QuizQuestion` - Quiz content with difficulty ratings

**Context-Based State:**
- Purpose: Global state without prop drilling
- Pattern: Single AppContext with aggregated hooks
- Implementation: `src/contexts/AppContext.tsx`
- Used via: `useAppContext()` custom hook

**Custom Hook Pattern:**
- Purpose: Reusable state logic
- Pattern: `use[Name]` naming convention
- Examples:
  - `usePathogenData` - Data retrieval hook
  - `useLocalStorage` - Browser storage hook
  - `useQuizProgress` - Quiz state management hook

**Error Handling:**
- Purpose: Graceful error recovery
- Pattern: ErrorBoundary component + defensive hooks
- Implementation: `src/components/ErrorBoundary.tsx`, `src/hooks/useErrorHandler.ts`

## Entry Points

**Primary Entry:**
- Location: `src/index.tsx`
- Triggers: Browser page load
- Responsibilities: Initialize React app, mount to DOM element with ID `root`

**Application Entry:**
- Location: `src/App.tsx`
- Triggers: React renders App component
- Responsibilities:
  - Wrap application in AppProvider context
  - Implement tab-based navigation (7 tabs)
  - Lazy load components for code splitting
  - Error boundary for crash protection

**Script Entry Points:**
- `scripts/start.js` - Development server (triggered by `npm start`)
- `scripts/build.js` - Production build (triggered by `npm run build`)
- `scripts/test.js` - Test runner (triggered by `npm test`)

## Error Handling

**Strategy:** ErrorBoundary at app root + defensive programming in components

**Patterns:**
- Top-level ErrorBoundary component catches React errors
- useErrorHandler hook for graceful degradation in visualizations
- Null/undefined checks before rendering (defensive coding)
- Console.error() logging in development (lines 17-18 in ErrorBoundary.tsx)

**Error Boundary Scope:**
- Wraps entire application in `src/App.tsx`
- Catches React component errors
- Displays fallback UI to user
- Does not catch: event handler errors, async errors outside React lifecycle

## Cross-Cutting Concerns

**Logging:**
- Console.log for debug output (development only)
- ErrorBoundary logs errors via console.error()
- Performance monitoring via `clinicalPerformanceMonitor.ts` (optional feature flag)

**Validation:**
- Medical data validation via feature flag (`REACT_APP_ENABLE_MEDICAL_VALIDATION`)
- Type safety via TypeScript strict mode
- No runtime schema validation (Zod, Yup)

**Performance:**
- Lazy loading for 5 major tab components (React.lazy())
- Memoization via useMemo in hooks
- Target: <1000ms rendering, <200ms re-render (documented in component headers)

**Responsive Design:**
- `useResponsive` hook detects mobile vs desktop (768px breakpoint)
- Tailwind CSS utility classes for responsive layouts
- Mobile menu implementation in Header component

---

*Architecture analysis: 2026-01-06*
*Update when major patterns change*
