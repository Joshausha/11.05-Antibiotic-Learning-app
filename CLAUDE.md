---
type: development-guidance
title: CLAUDE.md - Antibiotic Learning App Development Guide
status: streamlined-post-consolidation
created: 2025-07-16
modified: 2025-11-28
tags: [claude-code, development-patterns, medical-education, consolidated]
category: Projects
purpose: claude-code-development-guidance-essential-patterns-only
structure: para-methodology
redirect: PROJECT_STATUS.md for comprehensive project information
---

# CLAUDE.md - Essential Development Patterns
**Streamlined Development Guide for Claude Code**
*Last Updated: 2025-11-28*

> **📋 CONSOLIDATED DOCUMENTATION NOTICE**: Most project information has been consolidated into [`PROJECT_STATUS.md`](PROJECT_STATUS.md). This file contains only essential development patterns for Claude Code sessions.

---

## 🎯 Project Overview

**Antibiotic Learning App** - Production-ready clinical decision education platform with 96.9% test suite pass rate (62/64 suites).

**Current Focus**: Phase 7.2 Enhanced Network Visualization
- ✅ **Week 1 Complete** (2025-11-28): Jaccard similarity algorithm, PathogenRelationshipData generation, medical validation
- **Week 1 Results**: 97 tests (100% pass), 50-65 relationships (0 medical violations), 100% clinical accuracy
- ➡️ **Week 2 Starting**: NetworkLayoutEngine with D3.js force-directed layout

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
- Tests pass (maintain 96.9%+ suite pass rate with hook API compatibility)
- Code follows established patterns
- Medical accuracy preserved
- Northwestern animations integrity maintained
- Production build succeeds
- Linting issues addressed

---

## 📋 Current Status Quick Reference

- **Test Infrastructure**: ✅ 96.9% base test suite + Phase 7.2 Week 1 (97 new tests, 100% pass rate)
  - **Phase 7.2 Week 1**: ✅ 97 tests (Jaccard: 49, PathogenRelationshipData: 41, Medical validation: 7) - 100% pass
- **Code Quality**: ✅ Systematic optimization (204 linting warnings)
- **Production Build**: ✅ 68.86 kB gzipped
- **Medical Foundation**: ✅ Northwestern animations + Phase 7.2 Jaccard similarity (100% clinical accuracy, 0 violations)
- **Development Phase**: Phase 7.2 Week 1 complete, Week 2 D3.js integration starting

**Phase Status**: Phase 7.2 Week 1 (Foundation Layer) COMPLETE, Week 2 (D3.js Integration) STARTING

---

## 📖 Additional Resources

- **Complete Project Status**: [`PROJECT_STATUS.md`](PROJECT_STATUS.md)
- **Application Overview**: [`README.md`](README.md)
- **Historical Context**: `documentation_archive/2025-08-24_consolidation/`

---

**Note**: This file contains only essential development patterns. For comprehensive project information including target users, technical specifications, roadmap, lessons learned, and detailed medical content inventory, see [`PROJECT_STATUS.md`](PROJECT_STATUS.md).