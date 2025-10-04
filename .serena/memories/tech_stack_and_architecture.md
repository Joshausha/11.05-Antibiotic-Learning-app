# Tech Stack and Architecture
**Last Updated**: 2025-10-04
**Project Status**: Production-Ready, Phase 7.1 Complete

## Core Technologies

### Frontend Framework
- **React 18.2.0**: Main UI framework with hooks and modern patterns
- **React DOM 18.2.0**: DOM rendering engine
- **React App Polyfill 3.0.0**: Browser compatibility support

### Build System & Development
- **Webpack 5.64.4**: Custom build configuration with optimization
- **Webpack Dev Server 5.2.2**: Development server with hot reload
- **Babel 7.16.0**: JavaScript transpilation with react-app preset
- **@pmmmwh/react-refresh-webpack-plugin 0.5.3**: Fast refresh for development
- **React Refresh 0.11.0**: Preserve component state during updates

### Visualization Libraries
- **D3.js** (implicit via imports): Network graphs, force-directed layouts, interactive pathogen visualization
- **Chart.js 4.5.0**: Statistical charts and data visualization
- **react-chartjs-2 5.3.0**: React wrapper for Chart.js integration

### UI Components & Styling
- **Tailwind CSS 3.0.2**: Utility-first CSS framework
- **Lucide React 0.263.1**: Modern icon library (300+ medical/clinical icons)
- **PostCSS 8.4.4**: CSS processing with plugins:
  - postcss-flexbugs-fixes 5.0.2
  - postcss-preset-env 7.0.1
  - postcss-normalize 10.0.1

### Testing Infrastructure
- **Jest 27.4.3**: Test framework with custom configuration
- **@testing-library/react 13.3.0**: React component testing utilities
- **@testing-library/jest-dom 5.16.4**: Custom DOM matchers
- **@testing-library/user-event 14.6.1**: User interaction simulation
- **@testing-library/dom 10.4.1**: DOM testing utilities
- **Playwright 1.54.1**: End-to-end testing framework
- **jest-watch-typeahead 1.0.0**: Enhanced test filtering

### Medical Education Algorithms
- **ts-fsrs 5.2.2**: Spaced repetition scheduling (Free Spaced Repetition Scheduler)
- **date-fns 4.1.0**: Date manipulation for quiz scheduling and analytics

### Code Quality & Linting
- **ESLint 8.3.0**: JavaScript/React linting
- **eslint-config-react-app 7.0.1**: Create React App ESLint rules
- **eslint-webpack-plugin 3.1.1**: ESLint integration with webpack

### Build Optimization
- **Terser Webpack Plugin 5.2.5**: JavaScript minification
- **CSS Minimizer Webpack Plugin 3.2.0**: CSS optimization
- **Mini CSS Extract Plugin 2.4.5**: CSS extraction for production
- **Workbox Webpack Plugin 6.4.1**: Service worker and PWA support
- **Webpack Manifest Plugin 4.0.2**: Asset manifest generation

## Architecture Pattern

### Component Architecture (47+ Components)
```
Hierarchical component structure with:
- **Container Components**: State management and data flow orchestration
- **Presentational Components**: Pure UI rendering with props
- **Custom Hooks**: Shared logic extraction (useResponsive, useLocalStorage, useBookmarks)
- **Higher-Order Components**: ErrorBoundary for fault tolerance
- **Context Providers**: Global state management (Emergency mode, education level)
```

### Key Architectural Patterns
1. **Single Responsibility Principle**: Each component has one focused purpose
2. **Composition Over Inheritance**: Building complex UIs from simple components
3. **Prop Drilling with Context**: Explicit data flow with strategic Context API usage
4. **Lazy Loading**: Code-splitting for performance optimization
5. **Error Boundaries**: Graceful failure handling for clinical reliability
6. **Custom Hooks**: Reusable stateful logic across components

### Data Management
- **Local State**: useState for component-specific state
- **Context API**: Global emergency mode, education level, user preferences
- **Local Storage**: Persistent user progress, bookmarks, quiz history
- **Module-Based Data**: Medical conditions, antibiotic data, quiz questions in dedicated modules

## Project Structure

```
src/
├── components/                  # UI components (47+ files)
│   ├── __tests__/              # Component tests (57 test suites)
│   ├── analytics/              # Analytics dashboard components
│   ├── research/               # Research and experimental features
│   ├── ClinicalDecision/       # Clinical decision support tools
│   ├── Header.js               # Navigation component
│   ├── HomeTab.js              # Landing page
│   ├── ConditionsTab.js        # Medical conditions browser
│   ├── QuizTab.js              # Quiz functionality with analytics
│   ├── PathogenExplorer.js     # Pathogen exploration interface
│   ├── AntibioticExplorer.js   # Antibiotic analysis tool
│   ├── VisualizationsTab.js    # Visualization dashboard
│   ├── NorthwesternComparisonView.js    # NEW: Comparison mode (Phase 7.1)
│   ├── ComparisonControlPanel.js        # NEW: Comparison controls (Phase 7.1)
│   ├── PathogenNetworkVisualization.js  # D3.js network graphs
│   ├── AnimatedNorthwesternPieChart.js  # Animated visualizations
│   ├── EnhancedNorthwesternPieChart.js  # Enhanced pie charts
│   ├── ErrorBoundary.js        # Error handling wrapper
│   └── [40+ additional components]
├── data/                       # Medical data modules
│   ├── SimplePathogenData.js  # Pathogen database (39 pathogens)
│   ├── EnhancedAntibioticData.js  # Antibiotic database (43 antibiotics)
│   ├── medicalConditions.js   # Clinical conditions catalog
│   └── quizQuestions.js       # Educational quiz content
├── hooks/                      # Custom React hooks
│   ├── useResponsive.js       # Responsive design logic
│   ├── useLocalStorage.js     # Persistent storage hook
│   └── useBookmarks.js        # Bookmark management
├── utils/                      # Utility functions
│   ├── animations.js          # Northwestern animation system (875 lines)
│   └── testUtils.enhanced.js  # Testing utilities
├── __tests__/                  # Integration tests
│   └── integration/           # Cross-component integration tests
├── App.js                      # Main application component
├── index.js                    # React entry point
└── setupTests.js              # Jest configuration
```

### Custom Webpack Configuration
Located in `config/webpack.config.js` (custom Create React App configuration):
- **Production Optimization**: Code splitting, tree shaking, minification
- **Development Features**: Hot module replacement, fast refresh
- **Asset Handling**: Images, fonts, SVGs via @svgr/webpack
- **CSS Processing**: Tailwind, PostCSS, CSS modules support
- **Source Maps**: Configured for debugging

### Build Scripts
Custom build scripts in `scripts/`:
- `start.js`: Development server with custom webpack dev server config
- `build.js`: Production build with optimization
- `test.js`: Jest test runner with custom configuration

## Performance Characteristics

### Build Metrics
- **Bundle Size**: 220.92 kB gzipped (production)
- **Build Time**: ~20-30 seconds for production
- **Test Execution**: 5.045 seconds for 1,509 tests across 57 suites
- **Development Server**: Hot reload in <1 second

### Runtime Performance
- **Initial Load**: <2 seconds on modern browsers
- **Component Rendering**: <1000ms target for complex visualizations
- **Interaction Response**: <200ms for user interactions
- **Network Visualization**: D3.js force simulation with 39 nodes
- **Chart Rendering**: Chart.js with responsive canvas rendering

### Optimization Techniques
1. **Code Splitting**: Lazy loading for route-based components
2. **Memoization**: React.memo for expensive component renders
3. **Virtual DOM**: React's reconciliation algorithm
4. **Debouncing**: Search input optimization
5. **Canvas Rendering**: Hardware-accelerated Chart.js visualizations
6. **Service Workers**: Workbox for offline capability (PWA-ready)

## Testing Architecture

### Test Coverage: 1,509 Tests Across 57 Suites
```
Categories:
- Component Unit Tests: 900+ tests
- Integration Tests: 400+ tests
- Accessibility Tests: 100+ tests
- Medical Content Validation: 50+ tests
- Performance Tests: 40+ tests
- Utility Function Tests: 19+ tests
```

### Test Structure
```
__tests__/
├── Component tests in src/components/__tests__/
├── Integration tests in src/__tests__/integration/
├── Utility tests in src/utils/__tests__/
└── Animation tests in src/animations/__tests__/
```

### Testing Tools Configuration
- **jsdom**: Browser environment simulation
- **ResizeObserver**: Mocked for responsive testing
- **Mock Data**: Comprehensive pathogen and antibiotic test datasets
- **Coverage**: Configured for 80%+ code coverage target

## Medical Education Specific Architecture

### Northwestern Animation System
- **875-line framework** for medical education animations
- Spatial layout algorithms for antibiotic spectrum visualization
- Synchronized hover states across multiple wheels
- Coverage difference calculations with mathematical precision
- Clinical insight generation algorithms

### Spaced Repetition Implementation
- **ts-fsrs algorithm**: Evidence-based scheduling
- Performance tracking with analytics dashboard
- Adaptive difficulty based on user performance
- Long-term retention optimization

### Clinical Decision Support Features
- **Emergency Mode**: <30 second access to critical information
- **Evidence-Based Content**: Medical accuracy validation
- **Pediatric Focus**: Age-appropriate antimicrobial dosing
- **Resistance Warnings**: Visual alerts for MRSA, ESBL, MDR patterns

## Key Design Patterns

### State Management
```javascript
// Component-level state
const [activeTab, setActiveTab] = useState('home');

// Context for global state
const EmergencyModeContext = createContext();

// Custom hooks for shared logic
const isMobile = useResponsive();
const [bookmarks, addBookmark] = useBookmarks();
```

### Data Flow
```
App.js (State Owner)
  ├→ Header (Navigation)
  ├→ HomeTab (Static Content)
  ├→ ConditionsTab (Filtered Data)
  │   └→ ConditionDetailModal (Selected Item)
  ├→ PathogenExplorer (Network Data)
  │   └→ PathogenNetworkVisualization (D3.js Rendering)
  ├→ AntibioticExplorer (Drug Data)
  └→ QuizTab (Quiz Logic + Analytics)
```

### Error Handling
```javascript
<ErrorBoundary fallback={<ErrorMessage />}>
  <PathogenNetworkVisualization />
</ErrorBoundary>
```

## Browser Support

### Production Targets
```json
">0.2%", "not dead", "not op_mini all"
```

### Development Targets
```json
"last 1 chrome version",
"last 1 firefox version", 
"last 1 safari version"
```

## Summary
The Antibiotic Learning App uses a **modern, production-grade React architecture** with custom webpack configuration, comprehensive testing infrastructure (1,509 tests), advanced visualization libraries (D3.js, Chart.js), and medical education-specific algorithms (spaced repetition, Northwestern spectrum visualization). The architecture supports 47+ components across multiple feature domains with a focus on clinical accuracy, performance optimization, and medical education effectiveness.