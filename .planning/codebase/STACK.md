# Technology Stack

**Analysis Date:** 2026-01-06

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (`tsconfig.json`)

**Secondary:**
- JavaScript ES2020 - Build scripts, webpack configuration (`config/`, `scripts/`)

## Runtime

**Environment:**
- Node.js 14.0+ (no `.nvmrc` file, version specified in `package.json` engines field)
- Browser runtime (React 18 web application)

**Package Manager:**
- npm 6.0+
- No lockfile tracked in git (package-lock.json generated but .gitignored)

## Frameworks

**Core:**
- React 18.2.0 - UI framework (`package.json:59-60`)
- React DOM 18.2.0 - Client-side rendering

**Testing:**
- Jest 27.4.3 - Unit test runner (`package.json:48`)
- React Testing Library 13.3.0 - Component testing utilities
- Playwright 1.54.1 - E2E testing (`@playwright/test`)

**Build/Dev:**
- Webpack 5.64.4 - Custom build configuration (`config/webpack.config.js`)
- TypeScript 5.9.3 - Compilation with strict mode
- Babel 7.16.0 - JavaScript transpilation via `babel-preset-react-app`
- webpack-dev-server 5.2.2 - Development server with hot reload

**Styling:**
- Tailwind CSS 3.0.2 - Utility-first CSS framework (`tailwind.config.js`)
- PostCSS 8.4.4 - CSS processing
- Custom Northwestern medical theme colors

## Key Dependencies

**Critical:**
- `ts-fsrs` 5.2.2 - Free Spaced Repetition Scheduler for quiz system (`src/utils/spacedRepetitionManager.ts`)
- `react-context-api` (built-in) - State management via `src/contexts/AppContext.tsx`
- `lucide-react` 0.556.0 - Icon library (`package.json:51`)

**Visualization:**
- `chart.js` 4.5.0 - Chart rendering (`package.json:33`)
- `react-chartjs-2` 5.3.0 - React wrapper for Chart.js
- `d3` 7.8.5 - Data visualization with 15+ sub-packages (force, selection, zoom, scale, etc.)
- `cytoscape` 3.33.1 - Graph analysis library
- `react-cytoscapejs` 2.0.0 - React wrapper (experimental - package incomplete)

**Infrastructure:**
- `date-fns` 4.1.0 - Date manipulation
- `@svgr/webpack` 8.1.0 - SVG component imports
- `workbox-webpack-plugin` 6.4.1 - PWA/offline support

## Configuration

**Environment:**
- `.env.local` for local configuration (not committed)
- `.env.example` documents 30+ feature flags and API keys
- Configuration via React environment variables (`REACT_APP_*`)

**Build:**
- `tsconfig.json` - TypeScript strict mode (ES2020 target)
- `webpack.config.js` - Custom Webpack with multiple loaders
- `tailwind.config.js` - Design system configuration
- `jest.config.js` (embedded in package.json) - Test configuration
- Build flag: `TSC_COMPILE_ON_ERROR=true` (allows build with TypeScript errors)

**Key Environment Variables:**
- `REACT_APP_PUBMED_API_KEY` - Optional PubMed API key
- `REACT_APP_CDC_API_KEY` - Optional CDC data integration (disabled)
- `REACT_APP_ENABLE_*` - 20+ feature flags for visualizations and analytics
- `REACT_APP_ENABLE_MEDICAL_VALIDATION` - Medical data validation (CRITICAL)
- `REACT_APP_ENABLE_ERROR_BOUNDARIES` - Error boundaries (CRITICAL)

## Platform Requirements

**Development:**
- macOS/Linux/Windows (any platform with Node.js)
- No Docker or container requirements
- 300MB+ node_modules directory (89 dependencies total)

**Production:**
- Static file hosting (no server required)
- Build output: `build/` directory
- PWA support with service worker
- No database or backend services required

**Browser Targets:**
- Modern browsers via browserslist configuration
- ES2020 JavaScript features
- CSS Grid and Flexbox support required

---

*Stack analysis: 2026-01-06*
*Update after major dependency changes*
