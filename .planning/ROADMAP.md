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
- [ ] **Phase 2: Visual Network Exploration** - Interactive network/graph showing antibiotic-bacteria relationships
- [ ] **Phase 3: Comparison Interface** - Side-by-side comparison for antibiotics and bacteria properties
- [ ] **Phase 4: Quiz System Core** - Basic quiz/flashcard functionality with question management
- [ ] **Phase 5: Spaced Repetition Integration** - Implement spaced repetition algorithm for retention
- [ ] **Phase 6: Multi-Modal Learning Flow** - Connect visual, comparison, and quiz modes into cohesive experience
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
- [ ] 02-02: Implement node/edge rendering for antibiotic-pathogen relationships
- [ ] 02-03: Add interactive filtering (gram stain, antibiotic class, formulation)
- [ ] 02-04: Integrate Northwestern pie chart system with network view

### Phase 3: Comparison Interface
**Goal**: Side-by-side comparison view for antibiotics and bacteria properties
**Depends on**: Phase 1
**Research**: Unlikely (UI patterns, React component design)
**Plans**: 3 plans

Plans:
- [ ] 03-01: Build comparison component with split-pane layout
- [ ] 03-02: Implement property comparison tables (coverage, formulations, characteristics)
- [ ] 03-03: Add visual diff highlighting for key differences

### Phase 4: Quiz System Core
**Goal**: Functional quiz/flashcard system with question management
**Depends on**: Phase 1
**Research**: Unlikely (React state management, existing quiz data structure)
**Plans**: 3 plans

Plans:
- [ ] 04-01: Create quiz component with question rendering and answer validation
- [ ] 04-02: Implement quiz session state management
- [ ] 04-03: Add quiz performance tracking (correct/incorrect, time spent)

### Phase 5: Spaced Repetition Integration
**Goal**: Spaced repetition algorithm driving quiz question scheduling for retention
**Depends on**: Phase 4
**Research**: Likely (spaced repetition algorithms)
**Research topics**: ts-fsrs library implementation, spaced repetition best practices for medical education
**Plans**: 3 plans

Plans:
- [ ] 05-01: Integrate ts-fsrs library for spaced repetition scheduling
- [ ] 05-02: Implement card review scheduling based on performance
- [ ] 05-03: Add progress persistence (local storage or simple backend)

### Phase 6: Multi-Modal Learning Flow
**Goal**: Seamless navigation between visual, comparison, and quiz modes
**Depends on**: Phase 2, Phase 3, Phase 5
**Research**: Unlikely (UX design, React context/routing)
**Plans**: 2 plans

Plans:
- [ ] 06-01: Create navigation system linking visual → comparison → quiz modes
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
| 2. Visual Network Exploration | 1/4 | 🔄 In Progress | - |
| 3. Comparison Interface | 0/3 | Not started | - |
| 4. Quiz System Core | 0/3 | Not started | - |
| 5. Spaced Repetition Integration | 0/3 | Not started | - |
| 6. Multi-Modal Learning Flow | 0/2 | Not started | - |
| 7. Performance & Polish | 0/3 | Not started | - |
| 8. Learning Analytics | 0/2 | Not started | - |
