---
type: development-guidance
title: CLAUDE.md - Antibiotic Learning App Development Guide
status: streamlined-post-consolidation
created: 2025-07-16
modified: 2025-12-09
tags: [claude-code, development-patterns, medical-education, consolidated]
category: Projects
purpose: claude-code-development-guidance-essential-patterns-only
structure: para-methodology
redirect: PROJECT_STATUS.md for comprehensive project information
---

# CLAUDE.md - Essential Development Patterns
**Streamlined Development Guide for Claude Code**
*Last Updated: 2025-12-09*

> **📋 CONSOLIDATED DOCUMENTATION NOTICE**: Most project information has been consolidated into [`PROJECT_STATUS.md`](PROJECT_STATUS.md). This file contains only essential development patterns for Claude Code sessions.

---

## 🎯 Project Overview

**Antibiotic Learning App** - Production-ready clinical decision education platform with streamlined learning-focused UI/UX.

**Current Focus**: Phase 1.3 Design Token Standardization (After Phase 1 UI/UX Completion)

**✅ PHASE 1: UI/UX IMPROVEMENT - COMPLETE** (2025-12-01)
- ✅ **Phase 1.1**: VisualizationsTab progressive disclosure (COMPLETE)
  - 60% reduction in visual clutter in default view
  - 3 collapsible groups: Overview Dashboard (default), Explore Relationships, Analyze Patterns, Settings
  - Build: 416.26 kB gzipped | Tests: 1723 passing (zero regressions)

- ✅ **Phase 1.2**: HomeTab simplification (COMPLETE)
  - 71% CTA reduction: 7 buttons → 2 primary (Take Quiz, Browse Conditions)
  - 5 secondary actions in collapsible "More Learning Tools"
  - Removed Feature Cards section (redundant), made progress analytics collapsible
  - Build: 416.26 kB gzipped | Tests: 1718 passing (net +3 tests!)

**Phase 7.2 Network Visualization**: ✅ Weeks 1-2 complete (Jaccard similarity + D3.js layouts)
**Priority 2 Medical Integration**: ✅ Complete (ClinicalDecisionTree, GuidelineComparison, PathogenRelationships)

**For Complete Project Information**: See [`PROJECT_STATUS.md`](PROJECT_STATUS.md)

---

## ⚡ Essential Development Commands

```bash
# Core Development
npm start          # Start development server with hot reload
npm test           # Run all tests (96.9% suite / 97.7% individual test pass rate)
npm run build      # Build production bundle
npm run test:watch # Run tests in watch mode
npm run lint       # Check code quality  
npm run lint:fix   # Auto-fix linting issues

# Navigation
cd "/Users/joshpankin/My Drive/10-19 Projects/11 Medical Education Projects/11.05 Antibiotic Learning app"
```

---

## 🏗️ Architecture Essentials

### Core Stack
- **React 18.2.0** - Modern functional components with hooks
- **Webpack 5.64.4** - Custom build configuration
- **Tailwind CSS** - Local installation (not CDN)
- **Jest + React Testing Library** - Testing framework

### Key Components
- **Northwestern Animations** (875 lines) - Crown jewel visualization system
- **UserContext** - Global state management with localStorage persistence
- **Custom Hooks** - 10 specialized hooks for medical workflows

### Directory Structure
- `src/components/` - React components
- `src/data/` - Medical content (79 questions, 29 pathogens, 30 antibiotics)
- `src/hooks/` - Custom hooks
- `src/tests/` - Test suites (96.9% suite pass rate)

---

## 🏥 Medical Development Standards

### Clinical Safety Requirements 🚨 CRITICAL
- **Medical Accuracy**: All content validated against current guidelines (AAP, IDSA)
- **Northwestern Animations Integrity**: 875-line system must be preserved
- **Emergency Access**: <30 second clinical resource access requirement
- **Evidence-Based Content**: All recommendations linked to published guidelines

### Development Principles
- **One Fix at a Time**: Verify each change before proceeding
- **Defensive Programming**: Comprehensive null safety patterns
- **Medical Standards Preservation**: Clinical accuracy maintained during all changes
- **Honest Assessment**: Measure actual improvements vs claims

---

## 🔧 Proven Patterns (From Test Recovery Success)

### Component Architecture
```javascript
// Hybrid controlled/uncontrolled pattern
const Component = ({ data, onSelect }) => {
  // Use prop data if provided, fallback to imports
  const effectiveData = data || importedData;
  
  // Enable both test mocks and production usage
  return <div>{/* implementation */}</div>;
};
```

### Test Infrastructure
- **Mock Infrastructure**: `mockClear()` removes implementations - restore after clearing
- **localStorage Integration**: Timing issues require careful mock patterns
- **Defensive Programming**: Prevent undefined array access crashes

### Error Handling
```javascript
// Safe array operations
const safeArray = items?.slice() || [];
const count = pathogens?.length || 0;
```

---

## ✅ Success Criteria for Tasks

**All development tasks must meet**:
- Tests pass (target: 94%+ suite pass rate - currently 94.4%)
- Code follows established patterns
- Medical accuracy preserved
- Northwestern animations integrity maintained
- Dev server works (production build currently blocked - see Known Issues)
- No new linting errors introduced

---

## 📋 Current Status Quick Reference

### ⚠️ KNOWN ISSUES (Verified 2025-12-09)
- **Production Build**: ❌ FAILS - `Cannot find module 'd3'`
- **Test Suites**: 67/71 passing (4 failing due to D3/Cytoscape module issues)
- **Lint**: 274 problems (3 errors, 271 warnings)

### Verified Metrics
- **Tests**: 1750 passing, 1 failed (99.94% pass rate)
- **Test Suites**: 67/71 passing (94.4% pass rate)
- **Dev Server**: ✅ Works (port 3000)
- **Medical Foundation**: ✅ Northwestern animations + Priority 2 Medical Integration + Phase 1 UI/UX (100% clinical accuracy)

### Failing Tests (Root Causes)
1. D3 module not found (NetworkVisualizationD3Filtering.test.js, NetworkLayoutEngine.test.js)
2. react-cytoscapejs not found (PathogenNetworkVisualizationCytoscape.test.js)
3. Medical naming regex (pathogenAntibioticMap.test.js - "Coagulase-negative Staphylococcus")

**Current Status**: Component development works, but production build and some tests blocked by module resolution issues

---

## 📖 Additional Resources

- **Complete Project Status**: [`PROJECT_STATUS.md`](PROJECT_STATUS.md)
- **Application Overview**: [`README.md`](README.md)
- **Historical Context**: `documentation_archive/2025-08-24_consolidation/`

---

**Note**: This file contains only essential development patterns. For comprehensive project information including target users, technical specifications, roadmap, lessons learned, and detailed medical content inventory, see [`PROJECT_STATUS.md`](PROJECT_STATUS.md).