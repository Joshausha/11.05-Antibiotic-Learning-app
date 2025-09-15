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
*Last Updated: 2025-09-15*

> **📋 CONSOLIDATED DOCUMENTATION NOTICE**: Most project information has been consolidated into [`PROJECT_STATUS.md`](PROJECT_STATUS.md). This file contains only essential development patterns for Claude Code sessions.

---

## 🎯 Project Overview

**Antibiotic Learning App** - Network visualization learning platform with solid educational foundations. ✅ **Current Status**: Build succeeds, ready for enhanced educational features.

**Current Focus**: Interactive pathogen-antibiotic network exploration with D3.js/Cytoscape.js integration.

🚨 **Critical Status**: See [`EVIDENCE_INTEGRATION_STATUS.md`](EVIDENCE_INTEGRATION_STATUS.md) for honest implementation assessment.

**For Complete Project Information**: See [`PROJECT_STATUS.md`](PROJECT_STATUS.md)

---

## ⚡ Essential Development Commands

```bash
# Core Development
npm start          # Start development server with network visualization hot reload
npm test           # Run all tests (including network component test suites)
npm run build      # ✅ SUCCEEDS - Production bundle 496.92 kB (18 functions implemented)
npm run test:watch # Run tests in watch mode with network graph testing
npm run lint       # Check code quality for network components
npm run lint:fix   # Auto-fix linting issues

# Network Visualization Development
REACT_APP_ENABLE_CYTOSCAPE_NETWORK=true npm start  # Enable network features
npm test -- --testNamePattern="Network"            # Run network-specific tests
npm test -- --testPathPattern="network"            # Test network components

# Navigation
cd "/Users/joshpankin/My Drive/10-19 Projects/11 Medical Education Projects/11.05 Antibiotic Learning app"
```

---

## 🏗️ Architecture Essentials

### Core Stack
- **React 18.2.0** - Modern functional components with hooks
- **D3.js v7** - Custom network graph layouts and force-directed positioning
- **Cytoscape.js** - Pre-built network components and graph algorithms
- **Three.js (Optional)** - 3D network visualization capabilities
- **Webpack 5.64.4** - Custom build with network visualization optimization
- **Tailwind CSS + Custom CSS** - Responsive design with graph styling
- **Jest + React Testing Library** - Testing framework with D3/Cytoscape testing utilities

### Key Components
- **Northwestern Animations** (875 lines) - Crown jewel system optimized for network transitions
- **PathogenNetworkVisualization** - Primary network graph explorer component
- **CoverageHeatMap** - Pathogen-antibiotic effectiveness matrices
- **NetworkDataAdapter** - Graph data transformation utilities
- **UserContext** - Global state management with network interaction persistence

### Directory Structure
- `src/components/networks/` - Network visualization components
- `src/data/` - Medical content optimized for graph relationships (50+ pathogens, 40+ antibiotics, network edges)
- `src/hooks/` - Custom hooks including network interaction hooks
- `src/tests/` - Test suites with medical validation failures requiring resolution

---

## 🏥 Medical Development Standards

### Educational Accuracy Requirements 🚨 CRITICAL
- **Medical Accuracy**: All content validated against current guidelines (AAP, IDSA)
- **Northwestern Animations Integrity**: 875-line system must be preserved
- **Quick Access**: <30 second educational resource access requirement
- **Evidence-Based Educational Content**: All educational content linked to published guidelines for learning purposes

### Development Principles
- **One Fix at a Time**: Verify each change before proceeding
- **Defensive Programming**: Comprehensive null safety patterns
- **Educational Standards Preservation**: Educational accuracy maintained during all changes
- **Honest Assessment**: Measure actual improvements vs claims

---

## 🔧 Proven Patterns (Network Visualization Focus)

### Network Component Architecture
```javascript
// Network visualization component pattern
const NetworkComponent = ({ pathogenData, onNodeSelect, layout = "fcose" }) => {
  // Safe data transformation for graph format
  const networkElements = useMemo(() => 
    transformToNetworkData(pathogenData || defaultData), [pathogenData]);
  
  // Performance optimization for large graphs
  const debouncedLayout = useDebounce(layout, 300);
  
  return (
    <CytoscapeWrapper
      elements={networkElements}
      layout={debouncedLayout}
      onSelect={onNodeSelect}
      style={{ width: '100%', height: '600px' }}
    />
  );
};
```

### Graph Data Patterns
```javascript
// Network data transformation
const transformToNetworkData = (pathogens, antibiotics) => ({
  nodes: [
    ...pathogens.map(p => ({ data: { id: p.id, type: 'pathogen', ...p } })),
    ...antibiotics.map(a => ({ data: { id: a.id, type: 'antibiotic', ...a } }))
  ],
  edges: generateEffectivenessEdges(pathogens, antibiotics)
});
```

### Test Infrastructure
- **Network Component Testing**: Mock Cytoscape instances with `jest.mock('cytoscape')`
- **Graph Interaction Testing**: Simulate node clicks and edge selections
- **Performance Testing**: Validate <1 second rendering for 100+ nodes
- **Defensive Programming**: Prevent undefined graph data crashes

### Error Handling
```javascript
// Safe network operations
const safeNodes = networkData?.nodes || [];
const edges = networkData?.edges?.filter(edge => edge.source && edge.target) || [];
```

---

## ✅ Success Criteria for Tasks

**All development tasks must meet**:
- ✅ **FOUNDATION COMPLETE**: 18 educational functions implemented with educational accuracy validation
- ✅ **BUILD OPERATIONAL**: Production-ready bundle generation with comprehensive educational features
- ✅ **EDUCATIONAL ACCURACY PRESERVED**: Pathogen-antibiotic relationships educationally validated (30 antibiotics, 29 pathogens)
- ✅ **NORTHWESTERN ANIMATIONS INTEGRITY**: 875-line system maintained with network transitions
- Code follows established patterns and passes linting
- Educational content quality maintained (✅ educationally accurate medical learning platform)

---

## 📋 Current Status Quick Reference

- **Medical Content**: ✅ Excellent - 30 antibiotics, 29 pathogens, 79+ quiz questions (educationally accurate)
- **Tab Functionality**: ✅ 7/7 tabs working - core learning features operational
- **Build Status**: ✅ **SUCCEEDS** - 18 functions implemented, production-ready deployment
- **Test Suite**: ⚠️ Multiple failures - Medical data validation tests failing, requires resolution
- **Educational Foundation**: ✅ Northwestern animations + educational content + accuracy validation excellent
- **Development Phase**: ✅ Phase 1 complete - Ready for Phase 2 enhanced medical learning

**Phase Status**: Core medical education focus, evidence features in maintenance mode

---

## 📖 Additional Resources

- **Complete Project Status**: [`PROJECT_STATUS.md`](PROJECT_STATUS.md)
- **Evidence Integration Status**: [`EVIDENCE_INTEGRATION_STATUS.md`](EVIDENCE_INTEGRATION_STATUS.md) 🚨 **CRITICAL READ**
- **Application Overview**: [`README.md`](README.md)
- **Historical Context**: `documentation_archive/2025-08-24_consolidation/`

---

**Note**: This file contains only essential development patterns. For comprehensive project information including target users, technical specifications, roadmap, lessons learned, and detailed medical content inventory, see [`PROJECT_STATUS.md`](PROJECT_STATUS.md).