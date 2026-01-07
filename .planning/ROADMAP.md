# Roadmap: Antibiotic Learning App

## Overview

Transform antibiotic and pathogen education through three reinforcing learning modes: visual exploration reveals patterns, comparison deepens understanding, and spaced repetition testing drives durable clinical recall. Built on solid medical data foundation, this roadmap takes the experimental codebase from scattered visualizations to cohesive multi-modal learning experience.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Data Architecture** - Solidify medical data structure and TypeScript foundation (Complete - 3/3 plans complete)
- [x] **Phase 2: Visual Network Exploration** - Interactive network/graph showing antibiotic-bacteria relationships (Complete - 4/4 plans complete)
- [x] **Phase 3: Comparison Interface** - Side-by-side comparison for antibiotics and bacteria properties (Complete - 7/7 plans complete)
- [x] **Phase 4: Quiz System Core** - Basic quiz/flashcard functionality with question management (Complete - 3/3 plans complete)
- [x] **Phase 5: Enhanced Network Interactivity** - Click-to-explore drill-down (PIVOTED from Spaced Repetition) (Complete - 2/2 plans complete)
- [ ] **Phase 6: Multi-Modal Learning Flow** - Connect visual, comparison, and quiz modes into cohesive experience (In progress - 1/2 plans complete)
- [ ] **Phase 7: Performance & Polish** - Testing coverage, build optimization, error handling
- [ ] **Phase 8: Learning Analytics** - Track progress, identify weak areas, suggest focus topics

## Phase Details

### Phase 1: Foundation & Data Architecture
**Goal**: Clean, type-safe medical data structure that supports all three learning modes (visual, comparison, quiz)
**Depends on**: Nothing (first phase)
**Research**: Unlikely (TypeScript patterns, existing data structure)
**Plans**: 3 plans

Plans:
- [x] 01-01: Audit and consolidate existing medical data files (antibiotics, pathogens, quiz questions) - Completed 2026-01-07
- [x] 01-02: Define TypeScript interfaces for medical entities with proper typing - Completed 2026-01-07
- [x] 01-03: Create data validation and test coverage for medical content accuracy - Completed 2026-01-07

### Phase 2: Visual Network Exploration
**Goal**: Interactive network visualization showing antibiotic-bacteria coverage relationships
**Depends on**: Phase 1
**Research**: Complete (2026-01-06)
**Research topics**: D3.js force-directed graphs vs Cytoscape.js performance for medical data, Northwestern pie chart integration patterns
**Plans**: 4 plans

Plans:
- [x] 02-01: Build D3 force-directed network foundation with organic physics-based layout - Completed 2026-01-07
- [x] 02-02: Interactive filtering system with centralized state management - Completed 2026-01-07
- [x] 02-03: Information layering & mechanism explanations - Completed 2026-01-07
- [x] 02-04: Northwestern Integration & Multi-Mode UI - Completed 2026-01-07

### Phase 3: Comparison Interface
**Goal**: Side-by-side comparison view for antibiotics and bacteria properties
**Depends on**: Phase 1
**Research**: Unlikely (UI patterns, React component design)
**Plans**: 7 plans

Plans:
- [x] 03-01: Comparison Selection & State - TypeScript interfaces and multi-select component - Completed 2026-01-07
- [x] 03-02: Side-by-Side Pair Comparison - Two-column layout with automatic diff highlighting - Completed 2026-01-07
- [x] 03-03: Reference Comparison Foundation (PRIMARY mode) - Completed 2026-01-07
- [x] 03-04: Reference Comparison Differences - Differences highlighting and mechanism comparison - Completed 2026-01-07
- [x] 03-05: Multi-Item Grid Comparison - Responsive grid layout for 3-6 antibiotics - Completed 2026-01-07
- [x] 03-06: Visual Differentiation System - Similarity scoring and DiffIndicator components - Completed 2026-01-07
- [x] 03-07: Mode Integration & Entry Points - Completed 2026-01-07

### Phase 4: Quiz System Core
**Goal**: Board-prep style quiz experience with teaching-focused explanations (UWorld/Board Vitals UX pattern)
**Depends on**: Phase 1
**Research**: Complete (2026-01-07)
**Research topics**: Existing quiz infrastructure audit, component refactoring patterns
**Plans**: 3 plans

Plans:
- [x] 04-01: Quiz Explanation Component - THE teaching moment (core of quiz experience) - Completed 2026-01-07
- [x] 04-02: Quiz Flow Components - QuizQuestion display and QuizStartScreen - Completed 2026-01-07
- [x] 04-03: Session Orchestration & Integration - QuizSession, QuizResults, app integration - Completed 2026-01-07

### Phase 5: Enhanced Network Interactivity
**Goal**: Click-to-explore drill-down for visual relationship exploration
**Depends on**: Phase 2
**Research**: None (uses existing D3 patterns)
**Note**: PIVOTED from "Spaced Repetition Integration" - user determined visual network enhancement more valuable for learning project
**Plans**: 2 plans

Plans:
- [x] 05-01: Selection State & Fade System - Track selection, fade unconnected nodes/edges - Completed 2026-01-07
- [x] 05-02: Bidirectional Drill-Down & Animation - Click handlers, smooth transitions - Completed 2026-01-07

### Phase 6: Multi-Modal Learning Flow
**Goal**: Seamless navigation between visual, comparison, and quiz modes
**Depends on**: Phase 2, Phase 3, Phase 4
**Research**: Unlikely (UX design, React context/routing)
**Plans**: 2 plans

Plans:
- [x] 06-01: Create navigation system linking visual → comparison → quiz modes - Completed 2026-01-07
- [ ] 06-02: Implement context preservation (selected antibiotics/pathogens across modes)

### Phase 7: Performance & Polish
**Goal**: Comprehensive testing, optimized builds, robust error handling
**Depends on**: Phase 6
**Research**: Likely (testing strategies, build optimization)
**Research topics**: Jest configuration for TypeScript, React Testing Library patterns, webpack optimization
**Plans**: 3 plans

Plans:
- [ ] 07-01: Increase test coverage to 80%+ for core functionality
- [ ] 07-02: Resolve TypeScript errors and optimize build configuration
- [ ] 07-03: Implement error boundaries and loading states

### Phase 8: Learning Analytics
**Goal**: Progress tracking and intelligent study recommendations
**Depends on**: Phase 7
**Research**: Unlikely (local storage, progress tracking patterns)
**Plans**: 2 plans

Plans:
- [ ] 08-01: Build analytics dashboard showing weak areas and study patterns
- [ ] 08-02: Implement smart recommendations (which antibiotics/pathogens to review)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Data Architecture | 3/3 | ✅ Complete | 2026-01-07 |
| 2. Visual Network Exploration | 4/4 | ✅ Complete | 2026-01-07 |
| 3. Comparison Interface | 7/7 | ✅ Complete | 2026-01-07 |
| 4. Quiz System Core | 3/3 | ✅ Complete | 2026-01-07 |
| 5. Enhanced Network Interactivity | 2/2 | ✅ Complete | 2026-01-07 |
| 6. Multi-Modal Learning Flow | 1/2 | In progress | - |
| 7. Performance & Polish | 0/3 | Not started | - |
| 8. Learning Analytics | 0/2 | Not started | - |
