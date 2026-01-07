# Antibiotic Learning App - Project Overview
**Last Updated**: 2025-12-27
**Current Status**: Josh's Coding Learning Sandbox

## Purpose

**This is a fun side project where Josh learns to code** by building something personally meaningful.

NOT a production medical application. NOT something that needs to ship. A sandbox for experimentation.

## What Josh Is Learning

Through this project, Josh explores:
- **React** - Components, hooks, state management, context
- **TypeScript** - Type safety, interfaces, generics
- **Data Visualization** - D3.js, Cytoscape, Chart.js
- **Testing** - Jest, React Testing Library
- **Build Tools** - Webpack, npm, ESLint

## Current State (2025-12-27)

### What Works
- Dev server starts (port 3000 or 3001)
- Core Northwestern pie charts render
- Medical data loads
- Most tests pass (98% individual, 87% suites)
- Build produces output

### Known Issues (Fine to Leave)
- TypeScript errors (100+) - Building anyway via `TSC_COMPILE_ON_ERROR=true`
- Missing `react-cytoscapejs` package
- Some tests reference moved/deleted files
- ESLint warnings everywhere

**These are not blockers for learning.**

## Key Features (As Learning Exercises)

- **Northwestern Pie Charts**: Main visualization showing antibiotic coverage
- **Pathogen Explorer**: Interactive pathogen browsing
- **Quiz System**: Spaced repetition with ts-fsrs
- **Multiple Network Visualizations**: D3, Cytoscape experiments (learning different approaches)

## Success Criteria

- ✅ Did Josh learn something new?
- ✅ Did Josh understand why something works (or doesn't)?
- ✅ Did Josh have fun?

**NOT success criteria**: 100% test pass, zero TS errors, production-ready code

## Medical Content Foundation

The app uses Josh's medical knowledge:
- 39 unique pathogens with clinical characteristics
- 43 antibiotics with Northwestern spectrum data
- Quiz questions for board prep
- Clinical decision tree experiments

## Development Approach

When working on this project:
- Explain concepts as we go
- Experiment freely - breaking things is okay
- Don't enforce strict standards
- Focus on understanding over perfection
- Celebrate learning moments

**The goal is learning, not shipping.**
