# CLAUDE.md - Antibiotic Learning App
**Josh's Coding Learning Sandbox**
*Last Updated: 2025-12-27*

---

## 🎯 What This Project Is

**A fun side project where Josh learns to code** by building something personally meaningful.

This is NOT:
- A production medical application
- Something that needs to be "shipped"
- Code that needs to be perfect

This IS:
- A sandbox for learning React, TypeScript, D3.js, testing, and more
- A place to experiment with different approaches
- Built around medical content Josh knows well (antibiotics, pathogens)
- Okay to be messy, broken, or experimental

---

## 🧪 Learning Goals

Josh is exploring:
- **React** - Components, hooks, state management, context
- **TypeScript** - Type safety, interfaces, generics
- **Data Visualization** - D3.js, Cytoscape, Chart.js
- **Testing** - Jest, React Testing Library
- **Modern Build Tools** - Webpack, npm, ESLint

The multiple visualization implementations (D3, Cytoscape, simple network) are evidence of **learning through exploration**, not technical debt.

---

## ⚡ Quick Commands

```bash
# Start dev server (usually port 3000 or 3001)
npm start

# Run tests (some will fail - that's okay!)
npm test

# Build (TypeScript errors are ignored)
npm run build
```

---

## 🏗️ Project Structure

```
src/
├── components/     # React components (50+, many experimental)
├── data/           # Medical content (pathogens, antibiotics, quiz questions)
├── hooks/          # Custom React hooks
├── utils/          # Helper functions
└── animations/     # Northwestern visualization system
```

**Key files for learning:**
- `src/components/NorthwesternPieChart.tsx` - The main visualization
- `src/data/EnhancedAntibioticData.ts` - Medical data structure
- `src/hooks/` - Examples of custom hooks

---

## 📚 Current State (As of 2025-12-27)

### What Works
- Dev server starts ✅
- Core Northwestern pie charts render ✅
- Medical data loads ✅
- Most tests pass (98% individual, 87% suites) ✅
- Build produces output ✅

### Known Issues (Fine to Leave)
- TypeScript errors (100+) - Building anyway via `TSC_COMPILE_ON_ERROR=true`
- Missing `react-cytoscapejs` package - Cytoscape experiments incomplete
- Some tests reference moved/deleted files
- ESLint warnings everywhere

**These are not blockers for learning. Fix them when curious, ignore them otherwise.**

---

## 💡 Learning-Focused Development

### Success Criteria for This Project
- ✅ Did you learn something new?
- ✅ Did you understand why something works (or doesn't)?
- ✅ Did you have fun?

### NOT Success Criteria
- ❌ 100% test pass rate
- ❌ Zero TypeScript errors
- ❌ Production-ready code
- ❌ Perfect architecture

---

## 🎓 Topics Josh Has Explored

Through this project, Josh has touched:
- React functional components and hooks
- Context API for state management
- D3.js force-directed graphs
- Cytoscape.js network visualization
- TypeScript interfaces and types
- Jest testing with React Testing Library
- CSS-in-JS and Tailwind
- Custom webpack configuration
- Spaced repetition algorithms (ts-fsrs)

**That's a lot of learning!**

---

## 🔧 For Claude Code Sessions

**Preferred output style:** `coding-mentor`

When working on this project:
- Explain concepts as we go
- It's okay to experiment and break things
- Don't enforce strict standards
- Focus on understanding over perfection
- Celebrate learning moments

---

## 📖 Historical Context

This project has evolved through many phases of experimentation:
- Started as simple pathogen list
- Added Northwestern pie chart visualization
- Explored D3.js network graphs
- Tried Cytoscape for different approach
- Added quiz system with spaced repetition
- Built clinical decision trees (experimental)
- Multiple UI/UX iterations

Each "pivot" represents learning, not failure.
