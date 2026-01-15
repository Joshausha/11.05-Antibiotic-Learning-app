# Roadmap: Antibiotic Learning App

## Overview

Transform antibiotic and pathogen education through three reinforcing learning modes: visual exploration reveals patterns, comparison deepens understanding, and spaced repetition testing drives durable clinical recall. Built on solid medical data foundation, this roadmap takes the experimental codebase from scattered visualizations to cohesive multi-modal learning experience.

## Milestones

- ✅ **[v1.0 MVP](milestones/v1.0-ROADMAP.md)** — Phases 1-8 (shipped 2026-01-08)
- ⏭️ **v1.1 DevOps & CI/CD** — Phases 9-18 (skipped - not needed for learning sandbox)
- 🚧 **v1.2 Visualizations** — Phases 19-26 (in progress)

## Completed Milestones

<details>
<summary>✅ v1.0 MVP (Phases 1-8) — SHIPPED 2026-01-08</summary>

- [x] Phase 1: Foundation & Data Architecture (3/3 plans) — completed 2026-01-07
- [x] Phase 2: Visual Network Exploration (4/4 plans) — completed 2026-01-07
- [x] Phase 3: Comparison Interface (7/7 plans) — completed 2026-01-07
- [x] Phase 4: Quiz System Core (3/3 plans) — completed 2026-01-07
- [x] Phase 5: Enhanced Network Interactivity (2/2 plans) — completed 2026-01-07
- [x] Phase 6: Multi-Modal Learning Flow (2/2 plans) — completed 2026-01-07
- [x] Phase 7: Performance & Polish (9/9 plans) — completed 2026-01-08
- [x] Phase 8: Learning Analytics (2/2 plans) — completed 2026-01-08

**Full details:** [milestones/v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)

</details>

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & Data Architecture | v1.0 | 3/3 | ✅ Complete | 2026-01-07 |
| 2. Visual Network Exploration | v1.0 | 4/4 | ✅ Complete | 2026-01-07 |
| 3. Comparison Interface | v1.0 | 7/7 | ✅ Complete | 2026-01-07 |
| 4. Quiz System Core | v1.0 | 3/3 | ✅ Complete | 2026-01-07 |
| 5. Enhanced Network Interactivity | v1.0 | 2/2 | ✅ Complete | 2026-01-07 |
| 6. Multi-Modal Learning Flow | v1.0 | 2/2 | ✅ Complete | 2026-01-07 |
| 7. Performance & Polish | v1.0 | 9/9 | ✅ Complete | 2026-01-08 |
| 8. Learning Analytics | v1.0 | 2/2 | ✅ Complete | 2026-01-08 |
| 9-18. DevOps & CI/CD | v1.1 | - | ⏭️ Skipped | - |
| 19. Network Graph Polish | v1.2 | 0/1 | Planning | - |
| 20. Interactive Filtering | v1.2 | 0/? | Not started | - |
| 21. Antibiotic Detail Cards | v1.2 | 0/? | Not started | - |
| 22. Pathogen Exploration | v1.2 | 0/? | Not started | - |
| 23. Coverage Heatmap | v1.2 | 0/? | Not started | - |
| 24. Animation Enhancements | v1.2 | 0/? | Not started | - |
| 25. Mobile Responsive | v1.2 | 0/? | Not started | - |
| 26. Export & Sharing | v1.2 | 0/? | Not started | - |

**Total:** 26 phases — v1.0: 8 phases, 32 plans (100%) | v1.1: 10 phases (skipped) | v1.2: 8 phases, 0 plans (0%)

## Skipped Milestone

<details>
<summary>⏭️ v1.1 DevOps & CI/CD (Phases 9-18) — SKIPPED</summary>

**Reason:** Infrastructure/tooling not needed for learning sandbox focused on React/TypeScript/D3.js development.

Phases 9-18 covered: Testing Automation, Build Optimization, Preview Environments, Performance Monitoring, Error Tracking, Security Scanning, Bundle Analysis, Automated Documentation, Deployment Rollback, Health Checks.

Can revisit if project transitions to production medical application.

</details>

## Current Milestone

### 🚧 v1.2 Visualizations (In Progress)

**Milestone Goal:** Deepen D3.js and data visualization skills by building rich, interactive exploration tools for antibiotic-pathogen relationships.

#### Phase 19: Network Graph Polish

**Goal**: Improve existing D3 force-directed network styling and interactions
**Depends on**: v1.0 MVP (Phase 8)
**Research**: Unlikely (internal patterns, existing D3 code)
**Plans**: 1

Plans:
- [ ] 19-01: Gram stain colors, label polish, edge highlighting

#### Phase 20: Interactive Filtering

**Goal**: Add filter controls to network (by gram stain, mechanism, coverage)
**Depends on**: Phase 19
**Research**: Unlikely (React state + D3 update patterns)
**Plans**: TBD

Plans:
- [ ] 20-01: TBD

#### Phase 21: Antibiotic Detail Cards

**Goal**: Rich hover/click cards showing antibiotic details within network view
**Depends on**: Phase 20
**Research**: Unlikely (D3 + React integration)
**Plans**: TBD

Plans:
- [ ] 21-01: TBD

#### Phase 22: Pathogen Exploration

**Goal**: New view focusing on pathogen-centric exploration (select pathogen, see coverage)
**Depends on**: Phase 21
**Research**: Unlikely (internal patterns)
**Plans**: TBD

Plans:
- [ ] 22-01: TBD

#### Phase 23: Coverage Heatmap

**Goal**: D3 heatmap visualization showing antibiotic-pathogen coverage matrix
**Depends on**: Phase 22
**Research**: Likely (D3 heatmap patterns, color scales)
**Research topics**: D3 heatmap implementations, color interpolation, matrix layouts
**Plans**: TBD

Plans:
- [ ] 23-01: TBD

#### Phase 24: Animation Enhancements

**Goal**: Add smooth transitions, entrance animations to visualizations
**Depends on**: Phase 23
**Research**: Likely (D3 transitions, animation libraries)
**Research topics**: D3 transition API, GSAP integration, React animation patterns
**Plans**: TBD

Plans:
- [ ] 24-01: TBD

#### Phase 25: Mobile Responsive

**Goal**: Make visualizations work well on tablet/mobile screens
**Depends on**: Phase 24
**Research**: Unlikely (CSS/responsive patterns)
**Plans**: TBD

Plans:
- [ ] 25-01: TBD

#### Phase 26: Export & Sharing

**Goal**: Export visualizations as images, share specific views via URL
**Depends on**: Phase 25
**Research**: Likely (canvas/SVG export, URL state)
**Research topics**: SVG to PNG conversion, html2canvas, URL state management
**Plans**: TBD

Plans:
- [ ] 26-01: TBD
