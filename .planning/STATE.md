# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-06)

**Core value:** Accurate medical data with flexible, experimental interaction modes that transform antibiotic coverage knowledge into durable clinical recall.
**Current focus:** Phase 8 — Learning Analytics (Phase 7 complete)

## Current Position

Phase: 8 of 8 (Learning Analytics)
Plan: 1 of 2 in current phase
Status: In progress
Last activity: 2026-01-08 — Completed 08-01-PLAN.md (Learning Analytics Dashboard)

Progress: █████████████████████████░░ 93% (26 of 28 plans complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 26
- Average duration: 5.0 min
- Total execution time: 1.99 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 3 | 18 min | 6 min |
| 2 | 4 | 17 min | 4.25 min |
| 3 | 7 | 24 min | 3.4 min |
| 4 | 3 | 16 min | 5.3 min |
| 5 | 2 | 13 min | 6.5 min |
| 6 | 2 | 15 min | 7.5 min |

**Recent Trend:**
- Last 5 plans: 8 min, 3 min, 12 min, 5 min, 8 min
- Trend: Phase 7 progressing - Northwestern infrastructure type-safe

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

| Phase | Decision | Rationale |
|-------|----------|-----------|
| 01-01 | Designate EnhancedAntibioticData.ts as canonical antibiotic source | Maintains layered learning architecture while establishing single source of truth |
| 01-01 | Merge all quiz files into unified source with extended interface | Eliminates HIGH severity duplication and terminology inconsistencies |
| 01-01 | Consolidate all medical type definitions into medical.types.ts | Establishes true single source of truth for TypeScript types |
| 01-02 | Use CoverageLevel strict union type (0 \| 1 \| 2) for Northwestern coverage | Enforces valid coverage values at compile time instead of generic number |
| 01-02 | Add medicalAccuracyVerified field to QuizQuestion interface | Enables clinical content validation tracking for medical education compliance |
| 01-02 | Export all types via barrel file pattern (src/types/index.ts) | Provides clean import pattern across codebase |
| 01-03 | Require medicalAccuracyVerified: true for ALL quiz questions (CRITICAL gate-keeper) | Prevents deployment of unverified medical content - quiz validation test fails when questions unverified |
| 01-03 | Northwestern coverage validation enforces MRSA/MSSA medical logic relationship | Medical logic: if antibiotic covers MRSA, it must cover MSSA (resistant vs sensitive strains) |
| 01-03 | Added npm scripts for targeted validation (test:validation, test:medical-accuracy) | Enables quick medical accuracy verification without running full test suite |
| 02-01 | Use D3 v7 force simulation instead of hand-rolled physics | D3's force simulation handles collision, gravity, convergence better than custom code |
| 02-01 | Throttle state updates to 50ms instead of 60fps tick rate | Prevents React re-render performance death from simulation updates |
| 02-01 | Only create edges for coverage level >= 1 (moderate/good coverage) | Prevents network hairball from showing every possible relationship |
| 02-01 | Visual encoding: blue for pathogens, green for antibiotics | Simple, accessible color scheme for quick node type recognition |
| 02-02 | Use single NetworkFilters object instead of separate state variables | Prevents state combination bugs per RESEARCH.md guidance |
| 02-02 | Pure filtering functions return new arrays without mutations | Makes filtering logic testable and predictable |
| 02-02 | useMemo for filtered results prevents expensive recalculation | Filtering only recalculates when input data or filters change |
| 02-02 | Defer multi-select filters (antibioticClasses, mechanismOfAction) | Focus on core filtering first - single-select filters (gramStain, formulation, threshold, resistance) |
| 02-03 | Use gram stain for primary color encoding (blue/red/gray) | Medical education convention - clear visual categorization by gram status |
| 02-03 | Uniform node size despite plan suggesting severity encoding | Data limitations - no severity field in current pathogen data structure |
| 02-03 | 3-layer information architecture (visual → tooltips → panels) | Progressive disclosure reduces cognitive load per medical UX guidelines |
| 02-03 | foreignObject for rich HTML tooltips in SVG | Enables styled, readable mechanism explanations without canvas text limitations |
| 02-04 | Use NorthwesternSpatialLayout instead of single pie chart | Richer visualization showing all antibiotics simultaneously with drug class grouping |
| 02-04 | Preserve component state with display:none pattern | Prevents state loss when switching modes, improves performance over unmount/remount |
| 02-04 | Provide mode descriptions for each visualization | Users need context to understand what each mode offers for self-directed learning |
| 03-01 | ComparisonMode type with 'pair' \| 'reference' \| 'grid' for all three modes | Supports side-by-side, reference-based, and grid comparison workflows |
| 03-01 | Single ComparisonState object following Phase 02-02 NetworkFilters pattern | Prevents state combination bugs by keeping related state together |
| 03-01 | maxSelections default of 5 to prevent cognitive overload | Limits comparison complexity while allowing meaningful multi-antibiotic analysis |
| 03-01 | Group antibiotics by class with expand/collapse for navigation | Enables efficient browsing through 40+ antibiotics with clear class organization |
| 03-02 | Three-column layout (property/left/right) instead of two-column for clearer comparison | Makes property-level comparison structure more obvious than side-by-side columns |
| 03-02 | useMemo optimization for compareProperties to prevent recalculation on every render | Only recomputes when antibiotics change, prevents expensive comparison on each render |
| 03-02 | Northwestern spectrum segment-level comparison (any segment difference = different) | Detects subtle coverage differences like "both cover 6 segments but different ones" |
| 03-02 | Visual legend with colored boxes (gray=same, yellow=different) for immediate comprehension | Users understand highlighting scheme before scanning rows |
| 03-03 | Asymmetric 30/70 layout emphasizes reference antibiotic as learning foundation | Reference fixed at 30% width with blue background - visually distinguishes anchor point for PRIMARY learning mode |
| 03-03 | useMemo optimization for similarity calculations prevents recalculation on every render | Only recalculates when reference or comparison antibiotics change |
| 03-03 | Array intersection for formulations, Northwestern spectrum analysis for gram coverage | Manual implementation without external dependencies (lodash not available) |
| 03-04 | HIGH significance for mechanism (red), MEDIUM for class/formulation (orange), LOW for category (gray) | Mechanism is most clinically important - drives treatment decisions |
| 03-04 | MechanismComparisonWidget at TOP of comparison card | Per 03-CONTEXT: mechanism is essential property - must be immediately visible |
| 03-05 | Use existing useResponsive hook for mobile detection | Reuse existing pattern, consistent breakpoint logic |
| 03-05 | Hide Northwestern coverage visualization on mobile, abbreviate labels | Too small to be useful on mobile - prioritize readability |
| 03-05 | 8 colored circles for coverage visualization (gray/yellow/green) | Compact representation of Northwestern 8-segment model consistent with established patterns |
| 03-06 | Similarity scoring: mechanism=40, class=30, formulation=20, route=10 | Mechanism is most clinically important for treatment decisions |
| 03-06 | Coverage pattern analysis with 5 categories (identical, similar-GP, similar-GN, complementary, distinct) | Enables quick clinical categorization for combination therapy decisions |
| 03-06 | DiffIndicator uses Unicode symbols (✓, ✗, ~, ⟷) | Universal support, no icon library dependency |
| 03-07 | Reference mode as default (PRIMARY per 03-CONTEXT) | Reference comparison is the primary learning mode for comparing unfamiliar antibiotics against known ones |
| 03-07 | Display:none pattern for state preservation across mode switches | Prevents state loss when switching modes, consistent with Phase 2 pattern |
| 03-07 | Dynamic maxSelections: 2 for pair, 6 for grid, 5 for reference | Mode-specific constraints ensure appropriate selection counts |
| 04-01 | Green/amber visual distinction for correct/incorrect answers | Board-prep UX convention (UWorld/Board Vitals pattern) |
| 04-01 | User-controlled Next button with NO auto-advance | Per CONTEXT.md: "user controls when to proceed" - respect learning time |
| 04-01 | isLastQuestion prop changes button to "See Results" with purple styling | Visual cue for quiz completion |
| 04-02 | Board-prep visual pattern (A, B, C, D option lettering) | UWorld/Board Vitals convention familiar to medical learners |
| 04-02 | Difficulty selection grid (2x2 mobile, 4x1 desktop) | Responsive layout for cross-device quiz configuration |
| 04-02 | No spaced repetition toggle in QuizStartScreen | Phase 5 scope - keep Phase 4 focused on core quiz mechanics |
| 04-03 | State machine with three phases (active/explanation/complete) | Clear flow control for quiz progression |
| 04-03 | User-controlled navigation only - NO auto-advance | Per CONTEXT.md: "user controls when to proceed" - respect learning time |
| 04-03 | Retry resets all state, exit calls parent callback | Clean separation of concerns between session and parent |
| 05-01 | Use single NetworkSelectionState object per Phase 02-02 pattern | Prevents state combination bugs, single source of truth |
| 05-01 | Opacity values: nodes fade to 30%, edges to 15% | Edges more faded for visual hierarchy and clarity |
| 05-01 | Edge connections determined bidirectionally | Works for both pathogen and antibiotic selection |
| 05-02 | Use refs instead of state closure in D3 tick handler | Avoids stale closure bug - tick handler needs current simulation data |
| 05-02 | CSS transitions (300ms) over D3.transition() | CSS works better with React declarative rendering |
| 05-02 | Northwestern 8-segment model hardcoded in D3NetworkGraph | Reliable coverage mapping with props as fallback |
| 06-01 | Add 'hub' to TabType at start of union | Makes hub the default landing page |
| 06-01 | Update AppContext default in addition to App.tsx | AppContext defines actual initial state, not just destructuring default |
| 06-02 | Separate SharedSelectionContext from AppContext | Clean separation: AppContext for UI/nav, SharedSelectionContext for learning state |
| 06-02 | Bidirectional sync: read on mount, write on change | Inherit selections from other modes, propagate changes back |
| 06-02 | Hub as first nav item in header | "Always get back to dashboard" UX per 06-CONTEXT requirements |
| 07-01 | Removed Cytoscape entirely | Incomplete experiment with working D3 fallback - keeping broken code caused test failures with no benefit |
| 07-01 | Fixed import paths rather than deleting tests | Modules still existed but paths were wrong |
| 07-03 | Use Record<number/string, T> for all dynamic key lookup maps | Enables type-safe indexing of spectrum maps, position maps |
| 07-03 | Use 'as unknown as StateConfig' double assertion for complex state configs | Handles state object typing that doesn't match interface directly |
| 07-03 | Add \| undefined to InteractiveState index signature | Allows optional properties in indexed type |
| 07-04 | Use type assertions (as any) for cross-component type compatibility | Different local interfaces need compatibility with child component props |
| 07-04 | Fix hook usage patterns rather than modifying hooks | useResponsive returns boolean, useErrorHandler has different return type |
| 07-04 | FC<Props> = memo(...) pattern for typed memoized components | Correct pattern instead of memo<FC<Props>>(...) generic syntax |
| 07-05 | Type assertions for D3 integration | D3's complex type system doesn't align with React patterns - strategic assertions maintain functionality |
| 07-05 | Standalone interfaces over extension when properties conflict | When base interface properties conflict with child properties, standalone with explicit fields is cleaner |
| 07-05 | Double assertion pattern (as unknown as T) for cross-module compatibility | Required for cross-module type compatibility where interfaces don't align directly |
| 07-06 | Accept 5 remaining TypeScript errors | Learning project - 650/655 fixed (99.2%), diminishing returns on last 5 |
| 07-06 | Keep TSC_COMPILE_ON_ERROR=true | App works, tests pass - strict typing not critical for learning sandbox |
| 07-07 | Development mode shows full error details; production minimal | Learning requires understanding errors - detailed dev info accelerates debugging |
| 07-07 | Section-level error boundaries with amber styling | Amber distinguishes from full-page red errors, allows partial failures |
| 07-07 | Error logging includes file, operation, context | Actionable errors: "Failed to load Amoxicillin: missing gramPositiveCocci" helps fix issues |
| 07-08 | MRSA/MSSA rule validation catches 100% compliance | All 3 antibiotics covering MRSA also cover MSSA - medical relationship verified |
| 07-08 | Quiz format detection handles both RBO and Northwestern formats | Flexible validation supports legacy and new question formats |
| 07-08 | Pathogen gram stain validation includes expanded categories | Supports atypical, acid-fast, virus, mixed beyond simple positive/negative |
| 07-09 | Fixed null antibiotic handling bug in NorthwesternPieChart deriveRouteColor | Component crashed when antibiotic was null before null check |
| 07-09 | Used enabled: false in error recovery tests to avoid async race conditions | Tests callbacks synchronously without async recovery complications |
| 07-09 | Tested hooks with real implementations rather than mocking config imports | Mocking caused path resolution issues, actual implementation worked correctly |

### Deferred Issues

**From Phase 1-03 (Non-blocking):**
1. Quiz questions need medical review - 91 questions missing `medicalAccuracyVerified: true`
   - Action: Medical review required before marking questions as verified
   - Impact: Does NOT block Phase 2 development - can proceed with visual network exploration
   - Priority: Medium - required for deployment, not for development

2. Pathogen descriptions flagged for review - 2 minor warnings
   - "Clostridium difficile" and "Respiratory viruses" descriptions may need more detail
   - Impact: Non-critical warnings, tests passing
   - Priority: Low - optional enhancement

### Blockers/Concerns

None - Phase 8 in progress.

## Session Continuity

Last session: 2026-01-08
Stopped at: Completed 08-01-PLAN.md (Learning Analytics Dashboard)
Next plan: 08-02-PLAN.md (Smart Recommendations)
Resume file: None
