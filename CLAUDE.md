---
type: development-guidance
title: CLAUDE.md - Antibiotic Learning App Development Guide
status: streamlined-post-consolidation
created: 2025-07-16
modified: 2025-08-28
tags: [claude-code, development-patterns, medical-education, consolidated]
category: Projects
purpose: claude-code-development-guidance-essential-patterns-only
structure: para-methodology
redirect: PROJECT_STATUS.md for comprehensive project information
---

# CLAUDE.md - Essential Development Patterns
**Streamlined Development Guide for Claude Code**  
*Last Updated: 2025-08-26*

> **📋 CONSOLIDATED DOCUMENTATION NOTICE**: Most project information has been consolidated into [`PROJECT_STATUS.md`](PROJECT_STATUS.md). This file contains only essential development patterns for Claude Code sessions.

---

## 🎯 Project Overview

**Antibiotic Learning App** - Production-ready clinical decision education platform with 88.3% test suite pass rate (53/60 suites).

**Current Focus**: Core medical education features (evidence integration paused for maintenance).

🚨 **Critical Status**: See [`EVIDENCE_INTEGRATION_STATUS.md`](EVIDENCE_INTEGRATION_STATUS.md) for honest implementation assessment.

**For Complete Project Information**: See [`PROJECT_STATUS.md`](PROJECT_STATUS.md)

---

## ⚡ Essential Development Commands

```bash
# Core Development
npm start          # Start development server with hot reload
npm test           # Run all tests (mixed: evidence backend 26/26✅, network UI 4/11❌)
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
- `src/tests/` - Test suites (88.3% suite pass rate)

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
- Tests pass (maintain 88.3%+ suite pass rate with hook API compatibility)
- Code follows established patterns
- Medical accuracy preserved
- Northwestern animations integrity maintained
- Production build succeeds
- Linting issues addressed

---

## 📋 Current Status Quick Reference

- **Core Medical Education**: ✅ Quiz system, pathogen explorer, clinical decision trees operational
- **Evidence Integration**: 🔄 Paused (complete but unmaintained - 26/26 backend, 12/12 UI tests pass)
- **Network Visualization**: ✅ Basic Cytoscape.js pathogen-antibiotic networks functional
- **Production Build**: ✅ 216.07 kB gzipped
- **Medical Foundation**: ✅ Northwestern animations + core clinical content ready
- **Development Phase**: Focused on sustainable core features, evidence maintenance-light

**Phase Status**: Core medical education focus, evidence features in maintenance mode

---

## 📖 Additional Resources

- **Complete Project Status**: [`PROJECT_STATUS.md`](PROJECT_STATUS.md)
- **Evidence Integration Status**: [`EVIDENCE_INTEGRATION_STATUS.md`](EVIDENCE_INTEGRATION_STATUS.md) 🚨 **CRITICAL READ**
- **Application Overview**: [`README.md`](README.md)
- **Historical Context**: `documentation_archive/2025-08-24_consolidation/`

---

**Note**: This file contains only essential development patterns. For comprehensive project information including target users, technical specifications, roadmap, lessons learned, and detailed medical content inventory, see [`PROJECT_STATUS.md`](PROJECT_STATUS.md).