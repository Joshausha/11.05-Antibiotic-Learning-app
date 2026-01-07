# Codebase Structure

**Analysis Date:** 2026-01-06

## Directory Layout

```
antibiotic-learning-app/
├── src/                    # Source code root
│   ├── index.tsx          # React app entry point
│   ├── App.tsx            # Main application with lazy loading
│   ├── setupTests.tsx     # Jest global test setup
│   │
│   ├── components/        # UI components (50+)
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React Context providers
│   ├── data/              # Medical knowledge base (~300KB)
│   ├── utils/             # Business logic and algorithms
│   ├── types/             # TypeScript type definitions
│   ├── services/          # External API integrations
│   ├── styles/            # Design system
│   ├── animations/        # Animation definitions
│   ├── config/            # Configuration files
│   ├── test-utils/        # Testing utilities
│   └── __tests__/         # Integration tests
│
├── config/                # Build configuration
├── scripts/               # Build and dev scripts
├── public/                # Static assets
├── build/                 # Production build output (generated)
│
├── package.json           # Project manifest
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS setup
├── jest.config.js         # Jest testing (embedded in package.json)
├── .eslintrc.json         # ESLint rules
├── playwright.config.js   # E2E test config
└── CLAUDE.md              # Project documentation
```

## Directory Purposes

**src/components/**
- Purpose: All React UI components
- Contains: 50+ .tsx component files organized by feature
- Key files: `NorthwesternPieChart.tsx` (main visualization), `QuizTab.tsx`, `App.tsx`
- Subdirectories:
  - `analytics/` - Learning analytics dashboard
  - `ClinicalDecision/` - Decision tree system
  - `network/` - Network visualization support
  - `northwestern/` - Northwestern-specific components
  - `research/` - Research integration (experimental)
  - `visualizations/` - Dashboard panels
  - `__tests__/` - Component tests (44+ files)

**src/hooks/**
- Purpose: Custom React hooks for state and data
- Contains: .ts hook files with `use` prefix
- Key files:
  - `useQuizProgress.ts` - Quiz state + analytics
  - `usePathogenData.ts` - Pathogen data fetching
  - `useAntibioticData.ts` - Antibiotic data fetching
  - `useLocalStorage.ts` - Browser storage
  - `useResponsive.ts` - Responsive detection
- Subdirectories: `__tests__/` - Hook tests

**src/data/**
- Purpose: Static medical knowledge base bundled with app
- Contains: Large TypeScript const arrays/objects (~300KB total)
- Key files:
  - `medicalConditions.ts` - 20 clinical conditions
  - `EnhancedAntibioticData.ts` - Antibiotic database
  - `quizQuestions.ts` - 46,850+ lines of quiz content
  - `PathogenRelationshipData.ts` - 60KB pathogen similarity data
  - `ClinicalGuidelineData.ts` - Treatment guidelines
- Subdirectories: `__tests__/` - Data validation tests

**src/utils/**
- Purpose: Business logic, algorithms, pure functions
- Contains: Utility .ts files
- Key files:
  - `spacedRepetitionManager.ts` - SRS algorithm (ts-fsrs integration)
  - `dataParser.ts` - Data normalization
  - `graphAlgorithms.ts` - Network graph algorithms
  - `networkNodeStyles.ts` - Node styling
  - `recommendationEngine.ts` - Recommendation logic
  - `clinicalPerformanceMonitor.ts` - Performance tracking
- Subdirectories: `__tests__/` - Utility tests (15+ files)

**src/contexts/**
- Purpose: React Context providers for global state
- Contains: `AppContext.tsx` - Centralized state management
- Key files: `AppContext.tsx` (214 lines, aggregates all hooks)
- Subdirectories: `__tests__/` - Context tests

**src/types/**
- Purpose: TypeScript type definitions
- Contains: .types.ts files with interfaces and types
- Key files:
  - `medical.types.ts` - Medical domain types
  - `app.types.ts` - Application context + UI types
  - `component.types.ts` - Component prop types
  - `clinical-decision.types.ts` - Decision tree types
  - `network-ui.types.ts` - Network visualization types
  - `index.ts` - Type export hub

**src/services/**
- Purpose: External API integration
- Contains: `pubmedService.ts` - PubMed API client
- Key files: `pubmedService.ts` (search, fetch articles, caching)
- Subdirectories: `__tests__/` - Service tests

**src/styles/**
- Purpose: Design system constants
- Contains:
  - `NorthwesternColors.ts` - Color palette
  - `NorthwesternTypography.ts` - Typography system
  - `NorthwesternVisualStates.ts` - UI state styles

**src/animations/**
- Purpose: Animation definitions
- Contains: `NorthwesternAnimations.ts`
- Subdirectories: `__tests__/`

**src/config/**
- Purpose: Configuration files
- Contains:
  - `northwesternIntegrationConfig.ts`
  - `visualizationConfig.ts`

**src/test-utils/**
- Purpose: Testing utilities and factories
- Contains: `mockDataFactory.ts` - Mock data generators

**config/**
- Purpose: Build tool configuration (Webpack, Jest)
- Contains:
  - `webpack.config.js` - Main Webpack config
  - `webpackDevServer.config.js` - Dev server
  - `env.js`, `paths.js`, `modules.js` - Build utilities
  - `jest/` - Jest transforms (Babel, TypeScript, CSS, file)

**scripts/**
- Purpose: Build and development entry points
- Contains:
  - `start.js` - Dev server launcher
  - `build.js` - Production build
  - `test.js` - Test runner

**public/**
- Purpose: Static assets served as-is
- Contains: `index.html` (HTML template with root div)

## Key File Locations

**Entry Points:**
- `src/index.tsx` - React app initialization
- `src/App.tsx` - Main application component
- `scripts/start.js` - Dev server entry
- `scripts/build.js` - Build entry
- `scripts/test.js` - Test runner entry

**Configuration:**
- `tsconfig.json` - TypeScript strict mode, ES2020 target
- `package.json` - Dependencies, scripts, Jest config
- `tailwind.config.js` - Design system
- `config/webpack.config.js` - Build configuration
- `.eslintrc.json` - Linting rules
- `playwright.config.js` - E2E testing

**Core Logic:**
- `src/contexts/AppContext.tsx` - State management
- `src/utils/spacedRepetitionManager.ts` - SRS algorithm
- `src/services/pubmedService.ts` - API integration
- `src/components/NorthwesternPieChart.tsx` - Core visualization

**Testing:**
- `src/setupTests.tsx` - Global Jest setup (mocks)
- `src/components/__tests__/` - Component tests (44+ files)
- `src/__tests__/integration/` - Integration tests
- Test pattern: `*.test.js`, `*.test.tsx`, `*.spec.js`

**Documentation:**
- `CLAUDE.md` - Project instructions for Claude Code
- `README.md` - User-facing documentation
- `.env.example` - Environment variable documentation

## Naming Conventions

**Files:**
- **PascalCase**: Components (`NorthwesternPieChart.tsx`, `QuizTab.tsx`)
- **camelCase**: Utilities, data, hooks (`dataParser.ts`, `useQuizProgress.ts`)
- **kebab-case**: Configuration (`webpack.config.js`, `tailwind.config.js`)
- **.types.ts**: Type definition files (`medical.types.ts`, `app.types.ts`)
- **.test.js/.tsx**: Test files (`PathogenCard.test.js`)

**Directories:**
- **camelCase or descriptive**: Most directories (`components`, `hooks`, `utils`)
- **PascalCase for features**: Feature modules (`ClinicalDecision`)
- **__tests__**: Test subdirectories (double underscore)

**Special Patterns:**
- `index.ts` - Type export hubs and barrel files
- `*.test.js` or `*.spec.js` - Test files
- `setupTests.tsx` - Jest global setup
- `.backup` suffix - Backup/archive files (not tracked in git)

## Where to Add New Code

**New UI Component:**
- Primary code: `src/components/ComponentName.tsx`
- Tests: `src/components/__tests__/ComponentName.test.js`
- Types: Update `src/types/component.types.ts` or create new .types.ts file

**New Hook:**
- Implementation: `src/hooks/useFeatureName.ts`
- Tests: `src/hooks/__tests__/useFeatureName.test.js`
- Export: Add to AppContext if needed for global state

**New Utility Function:**
- Implementation: `src/utils/utilityName.ts`
- Tests: `src/utils/__tests__/utilityName.test.js`
- Types: Use existing types or add to `src/types/`

**New Medical Data:**
- Implementation: `src/data/newDataSet.ts`
- Validation tests: `src/data/__tests__/newDataSet.test.js`
- Type: Define interface in `src/types/medical.types.ts`
- Integration: Import in hook or component

**New API Integration:**
- Implementation: `src/services/serviceName.ts`
- Tests: `src/services/__tests__/serviceName.test.js`
- Usage: Call from component or hook

**New Configuration:**
- For build: Add to `config/` directory
- For app: Add to `src/config/` directory
- For env: Document in `.env.example`

## Special Directories

**.planning/codebase/**
- Purpose: GSD brownfield codebase documentation (this directory)
- Source: Generated by GSD /gsd:map-codebase workflow
- Committed: Yes (codebase reference for planning)

**build/**
- Purpose: Production build output
- Source: Generated by `npm run build`
- Committed: No (.gitignored)

**node_modules/**
- Purpose: npm dependencies
- Source: Generated by `npm install`
- Committed: No (.gitignored)

**.backup files**
- Purpose: Backup versions during refactoring
- Examples: `NorthwesternPieChart.tsx.backup`, `QuizTab.tsx.backup`
- Committed: No (.gitignored or manually excluded)

---

*Structure analysis: 2026-01-06*
*Update when directory structure changes*
