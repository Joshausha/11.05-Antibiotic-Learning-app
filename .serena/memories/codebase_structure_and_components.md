# Codebase Structure and Components
**Last Updated**: 2025-12-09
**Component Count**: 47+ components
**Test Suites**: 57+ test suites with 1,822 passing tests

## Top-Level Directory Structure

```
antibiotic-learning-app/
├── public/                   # Static assets
├── src/                      # Source code (main application)
│   ├── components/          # 47+ React components
│   ├── data/                # Medical data modules
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── __tests__/           # Integration tests
│   ├── App.js               # Main application component
│   ├── index.js             # React entry point
│   └── setupTests.js        # Jest configuration
├── config/                   # Webpack and build configuration
├── scripts/                  # Custom build scripts
├── node_modules/            # Dependencies
├── package.json             # Project configuration
└── README.md                # Project documentation
```

## Component Directory Structure

### Main Components Directory (`src/components/`)

```
src/components/
├── __tests__/                    # Component test files (57 test suites)
│   ├── QuizTab.test.js
│   ├── PathogenNetworkVisualization.test.js
│   ├── PathogenList.test.js
│   ├── NorthwesternComparisonView.test.js
│   ├── Header.test.js
│   ├── AntibioticExplorer.test.js
│   ├── ConditionsTab.test.js
│   ├── PathogenExplorer.test.js
│   ├── ClinicalTooltip.test.js
│   ├── GuidelineComparisonPanel.test.js
│   ├── HomeTab.test.js
│   └── [many more test files]
│
├── analytics/                    # Analytics dashboard components
│   └── [analytics-related components]
│
├── research/                     # Research and experimental features
│   └── [experimental components]
│
├── ClinicalDecision/            # Clinical decision support tools
│   └── [clinical decision components]
│
├── Navigation & Layout
│   ├── Header.js                # Main navigation component
│   ├── HomeTab.js               # Landing page with feature highlights
│   └── ErrorBoundary.js         # Error handling wrapper
│
├── Medical Content Browsers
│   ├── ConditionsTab.js         # Medical conditions browser
│   ├── ConditionDetailModal.js  # Condition details modal
│   ├── PathogenExplorer.js      # Pathogen exploration interface
│   ├── ConsolidatedPathogenExplorer.js  # Consolidated pathogen view
│   ├── SimplePathogenExplorer.js        # Simplified pathogen interface
│   └── AntibioticExplorer.js    # Antibiotic analysis tool
│
├── Pathogen Visualization
│   ├── PathogenNetworkVisualization.js  # D3.js network graphs
│   ├── SimplePathogenNetwork.js         # Simplified network view
│   ├── SimpleNetworkView.js             # Basic network visualization
│   ├── PathogenConnectionExplorer.js    # Connection analysis
│   ├── PathogenList.js                  # Pathogen listing component
│   ├── PathogenCard.js                  # Individual pathogen card
│   └── PathogenDetailPanel.js           # Pathogen detail view
│
├── Antibiotic Visualization
│   ├── AntibioticList.js               # Antibiotic listing
│   └── AntibioticCard.js               # Individual antibiotic card
│
├── Quiz System
│   ├── QuizTab.js                      # Main quiz interface
│   ├── QuizAnalyticsDashboard.js       # Performance analytics
│   └── NorthwesternQuizComponent.js    # Northwestern-style quiz
│
├── Northwestern Visualization Suite
│   ├── NorthwesternPieChart.js              # Base pie chart (showCenterLabel prop added Phase 2)
│   ├── EnhancedNorthwesternPieChart.js      # Enhanced version
│   ├── AnimatedNorthwesternPieChart.js      # Animated version
│   ├── NorthwesternPieChartDemo.js          # Demo component
│   ├── NorthwesternAnimationDemo.js         # Animation demonstrations
│   ├── NorthwesternSpatialLayout.js         # Spatial arrangement
│   ├── NorthwesternSpatialLayoutDemo.js     # Spatial demo
│   ├── NorthwesternInteractionSystem.js     # Interaction handling
│   ├── NorthwesternInteractionDemo.js       # Interaction demo
│   ├── NorthwesternGroupOrganization.js     # Group organization
│   ├── NorthwesternFilteringSystem.js       # Filtering logic
│   ├── OptimizedNorthwesternIntegration.js  # Performance optimization
│   ├── GroupVisualElements.js               # Visual group elements
│   └── ComparisonControlPanel.js            # NEW: Comparison controls (Phase 7.1)
│
├── Northwestern Comparison Mode (Phase 7.1)
│   ├── NorthwesternComparisonView.js   # Side-by-side comparison (440 lines)
│   └── ComparisonControlPanel.js       # Advanced controls (600+ lines)
│
├── Visualizations Dashboard
│   └── VisualizationsTab.js            # Visualization dashboard
│
├── UI Components
│   ├── DetailPanel.js                  # Generic detail panel
│   ├── ClinicalTooltip.js              # Clinical information tooltips
│   ├── LoadingSpinner.js               # Loading indicator
│   ├── SkeletonLoader.js               # Skeleton loading states
│   ├── ProgressIndicator.js            # Progress visualization
│   ├── DurationIndicator.js            # Duration display
│   ├── ErrorMessage.js                 # Error display component
│   └── FilterControlPanel.js           # Filter controls
│
├── Clinical Features
│   ├── MobileClinicalWorkflow.js       # Mobile-optimized clinical workflow
│   ├── GuidelineComparisonPanel.js     # Clinical guideline comparison
│   └── UserProgress.js                 # User progress tracking
│
└── [Additional specialized components]
```

## Data Modules (`src/data/`)

```
src/data/
├── SimplePathogenData.js          # Pathogen database (39 pathogens)
│   - Comprehensive pathogen information
│   - Gram stain classifications
│   - Resistance patterns (MRSA, ESBL, MDR)
│   - Clinical characteristics
│
├── EnhancedAntibioticData.js      # Antibiotic database (43 antibiotics)
│   - Northwestern spectrum coverage
│   - Drug classes and generations
│   - Route of administration
│   - Coverage matrices
│
├── medicalConditions.js           # Clinical conditions catalog
│   - Infectious disease conditions
│   - Pathogen associations
│   - Treatment recommendations
│
└── quizQuestions.js               # Educational quiz content
    - Multiple choice questions
    - Explanations and references
    - Difficulty levels
```

## Custom Hooks (`src/hooks/`)

```
src/hooks/
├── useResponsive.js               # Responsive design logic
│   - Mobile/desktop detection
│   - Breakpoint management
│   - Window resize handling
│
├── useLocalStorage.js             # Persistent storage hook
│   - localStorage abstraction
│   - JSON serialization
│   - State synchronization
│
└── useBookmarks.js                # Bookmark management
    - Add/remove bookmarks
    - Persistent storage
    - Bookmark retrieval
```

## Utility Functions (`src/utils/`)

```
src/utils/
├── animations.js                  # Northwestern animation system (875 lines)
│   - Force-directed layout algorithms
│   - Synchronized hover animations
│   - Coverage difference calculations
│   - Clinical insight generation
│
├── testUtils.enhanced.js          # Testing utilities
│   - Mock data generators
│   - Test helpers
│   - Render utilities
│
└── __tests__/
    ├── animations.test.js         # Animation system tests
    └── testUtils.enhanced.test.js # Utility function tests
```

## Test Structure (`src/__tests__/` and `src/components/__tests__/`)

```
Testing Infrastructure:
├── Component Tests (900+ tests)
│   - Unit tests for each component
│   - Props validation
│   - Interaction testing
│   - Accessibility testing
│
├── Integration Tests (400+ tests)
│   ├── CrossComponentIntegration.test.js
│   └── VisualizationIntegration.test.js
│
├── Medical Content Validation (50+ tests)
│   - Clinical accuracy verification
│   - Resistance warning validation
│   - Evidence-based content checks
│
├── Performance Tests (40+ tests)
│   - Rendering performance
│   - Memory leak prevention
│   - Animation cleanup
│
└── Accessibility Tests (100+ tests)
    - ARIA label validation
    - Keyboard navigation
    - Screen reader support
```

## Main Application Components

### App.js (Main Orchestrator)
**Purpose**: Application-level state management and routing
**Key Responsibilities**:
- Tab switching logic
- Global state management (emergency mode, education level)
- Component composition
- Error boundary integration

**State Management**:
```javascript
- activeTab: Current view selection
- emergencyMode: Clinical emergency access
- educationLevel: Student/Resident/Attending customization
- selectedCondition: Current condition details
- searchTerm: Global search state
```

### Header.js (Navigation)
**Purpose**: Site navigation and mobile menu
**Features**:
- Tab switching interface
- Mobile hamburger menu
- Responsive navigation
- Accessibility (keyboard navigation)

### HomeTab.js (Landing Page)
**Purpose**: Application introduction and feature highlights
**Content**:
- Feature overview
- Call-to-action buttons
- Educational value proposition
- Quick start guidance

### ConditionsTab.js (Medical Browser)
**Purpose**: Interactive medical conditions catalog
**Features**:
- Real-time search filtering
- Grid display with responsive design
- Condition card components
- Empty state handling
- Modal integration for details

### PathogenExplorer.js (Pathogen Interface)
**Purpose**: Comprehensive pathogen exploration
**Features**:
- Network visualization integration
- Filter controls (Gram stain, resistance, severity)
- Detail panel display
- Bookmark functionality

### PathogenNetworkVisualization.js (D3.js Visualization)
**Purpose**: Interactive force-directed pathogen network
**Technical Details**:
- D3.js force simulation (49 tests, 100% passing)
- 39 pathogen nodes with relationships
- Hover tooltips with clinical information
- Resistance warnings (ESBL, MRSA, MDR)
- Zoom and pan interactions
- Proper memory cleanup (no leaks)

### AntibioticExplorer.js (Drug Analysis)
**Purpose**: Antibiotic coverage analysis and comparison
**Features**:
- 43 antibiotic database
- Northwestern spectrum visualization
- Filter by class, route, generation
- Coverage matrix display

### NorthwesternComparisonView.js (Phase 7.1 - NEW)
**Purpose**: Side-by-side antibiotic comparison
**Features** (440 lines):
- Compare 2-4 antibiotics simultaneously
- Synchronized hover states
- Coverage difference calculations
- Similarity scoring algorithm
- Responsive grid layouts
- Medical accuracy validated (30 tests passing)

### ComparisonControlPanel.js (Phase 7.1 - NEW)
**Purpose**: Advanced comparison controls
**Features** (600+ lines):
- Autocomplete antibiotic search
- Multi-select with visual chips
- Filter by drug class, route, generation
- Quick preset comparisons
- Export functionality (placeholder)
- Responsive mobile design

### QuizTab.js (Educational Assessment)
**Purpose**: Quiz functionality with spaced repetition
**Features**:
- Multiple choice questions
- Progress tracking
- Performance analytics dashboard
- Spaced repetition scheduling (ts-fsrs)
- Results display with explanations

### VisualizationsTab.js (Dashboard)
**Purpose**: Visualization selection and display
**Features**:
- 5+ visualization types
- Northwestern comparison integration
- Chart.js integration
- Interactive controls

## Component Design Patterns

### Pattern 1: Container/Presentational
```javascript
// Container (PathogenExplorer.js)
- Manages state and data
- Handles user interactions
- Coordinates child components

// Presentational (PathogenCard.js)
- Pure rendering from props
- No state management
- Reusable UI component
```

### Pattern 2: Compound Components
```javascript
// Visualization Tab with multiple sub-components
<VisualizationsTab>
  <NorthwesternComparisonView />
  <PathogenNetworkVisualization />
  <Charts />
</VisualizationsTab>
```

### Pattern 3: Custom Hooks
```javascript
// Reusable responsive logic
const isMobile = useResponsive();

// Persistent bookmark state
const [bookmarks, addBookmark, removeBookmark] = useBookmarks();
```

### Pattern 4: Error Boundaries
```javascript
<ErrorBoundary fallback={<ErrorMessage />}>
  <ComplexVisualization />
</ErrorBoundary>
```

## Component Hierarchy (Simplified)

```
App.js
├── ErrorBoundary
│   ├── Header
│   │   └── Navigation Items
│   │
│   ├── HomeTab
│   │   └── Feature Cards
│   │
│   ├── ConditionsTab
│   │   ├── Search Input
│   │   ├── Condition Grid
│   │   └── ConditionDetailModal
│   │
│   ├── PathogenExplorer
│   │   ├── FilterControlPanel
│   │   ├── PathogenList
│   │   │   └── PathogenCard (multiple)
│   │   ├── PathogenNetworkVisualization (D3.js)
│   │   └── PathogenDetailPanel
│   │
│   ├── AntibioticExplorer
│   │   ├── FilterControlPanel
│   │   ├── AntibioticList
│   │   │   └── AntibioticCard (multiple)
│   │   └── DetailPanel
│   │
│   ├── VisualizationsTab
│   │   ├── NorthwesternComparisonView (NEW)
│   │   │   ├── ComparisonControlPanel (NEW)
│   │   │   ├── AnimatedNorthwesternPieChart (2-4)
│   │   │   └── Comparison Statistics
│   │   ├── Charts (Chart.js)
│   │   └── PathogenNetworkVisualization
│   │
│   └── QuizTab
│       ├── Quiz Interface
│       ├── Progress Indicator
│       └── QuizAnalyticsDashboard
```

## Key Implementation Notes

### Single Responsibility
Each component has one clear, focused purpose:
- **PathogenNetworkVisualization**: Only handles D3.js network rendering
- **FilterControlPanel**: Only manages filter state and UI
- **QuizAnalyticsDashboard**: Only displays performance metrics

### Props Documentation
All components include JSDoc comments:
```javascript
/**
 * PathogenNetworkVisualization
 * 
 * Interactive D3.js force-directed network visualization
 * 
 * Props:
 * @param {Array} pathogens - Array of pathogen objects
 * @param {Function} onNodeClick - Callback for node selection
 * @param {Object} filters - Active filter configuration
 */
```

### Accessibility Standards
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Semantic HTML structure
- Color contrast compliance

## Summary
The Antibiotic Learning App features a **sophisticated component architecture** with 47+ specialized components organized into logical subdirectories (analytics/, research/, ClinicalDecision/). The structure supports advanced features like D3.js network visualization, Northwestern comparison mode, and comprehensive medical education tools, all backed by 1,509 passing tests across 57 test suites. Each component follows React best practices with single responsibility, proper error handling, and comprehensive accessibility support.