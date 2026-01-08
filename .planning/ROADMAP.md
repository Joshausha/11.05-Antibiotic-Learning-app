# Roadmap: Antibiotic Learning App

## Overview

Transform antibiotic and pathogen education through three reinforcing learning modes: visual exploration reveals patterns, comparison deepens understanding, and spaced repetition testing drives durable clinical recall. Built on solid medical data foundation, this roadmap takes the experimental codebase from scattered visualizations to cohesive multi-modal learning experience.

## Milestones

- ✅ **[v1.0 MVP](milestones/v1.0-ROADMAP.md)** — Phases 1-8 (shipped 2026-01-08)
- 🚧 **v1.1 DevOps & CI/CD** — Phases 9-18 (in progress)

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
| 9. Testing Automation & Coverage | v1.1 | 0/? | Not started | - |
| 10. Build Optimization & Caching | v1.1 | 0/? | Not started | - |
| 11. Deployment Preview Environments | v1.1 | 0/? | Not started | - |
| 12. Performance Monitoring & Lighthouse | v1.1 | 0/? | Not started | - |
| 13. Error Tracking & Logging | v1.1 | 0/? | Not started | - |
| 14. Security Scanning & Dependabot | v1.1 | 0/? | Not started | - |
| 15. Bundle Analysis & Optimization | v1.1 | 0/? | Not started | - |
| 16. Automated Documentation | v1.1 | 0/? | Not started | - |
| 17. Deployment Rollback Strategies | v1.1 | 0/? | Not started | - |
| 18. Health Checks & Uptime Monitoring | v1.1 | 0/? | Not started | - |

**Total:** 18 phases — v1.0: 8 phases, 32 plans (100% complete) | v1.1: 10 phases, 0 plans (0% complete)

## Current Milestone

### 🚧 v1.1 DevOps & CI/CD (In Progress)

**Milestone Goal:** Master modern DevOps practices and CI/CD workflows through hands-on implementation of automated testing, deployment pipelines, monitoring, and production-ready infrastructure.

#### Phase 9: Testing Automation & Coverage

**Goal**: Automate test execution in CI with coverage reporting and quality gates
**Depends on**: Phase 8 (Learning Analytics)
**Research**: Likely (GitHub Actions test reporting, Codecov integration)
**Research topics**: Jest coverage in CI, GitHub Actions test reporters, coverage badge generation
**Plans**: TBD

Plans:
- [ ] 09-01: TBD (run /gsd:plan-phase 9 to break down)

#### Phase 10: Build Optimization & Caching

**Goal**: Speed up CI builds with dependency caching and build artifact optimization
**Depends on**: Phase 9
**Research**: Unlikely (standard GitHub Actions caching patterns)
**Plans**: TBD

Plans:
- [ ] 10-01: TBD

#### Phase 11: Deployment Preview Environments

**Goal**: Create preview deployments for pull requests to test changes before merging
**Depends on**: Phase 10
**Research**: Likely (GitHub Actions environments, preview URL generation)
**Research topics**: GitHub deployment environments, PR preview strategies, environment cleanup
**Plans**: TBD

Plans:
- [ ] 11-01: TBD

#### Phase 12: Performance Monitoring & Lighthouse

**Goal**: Integrate Lighthouse CI for automated performance, accessibility, and SEO audits
**Depends on**: Phase 11
**Research**: Likely (Lighthouse CI setup, performance budgets)
**Research topics**: Lighthouse CI configuration, performance budget thresholds, CI integration patterns
**Plans**: TBD

Plans:
- [ ] 12-01: TBD

#### Phase 13: Error Tracking & Logging

**Goal**: Set up Sentry for production error monitoring and debugging
**Depends on**: Phase 12
**Research**: Likely (Sentry integration for React applications)
**Research topics**: Sentry SDK setup, error boundaries, source map upload, alert configuration
**Plans**: TBD

Plans:
- [ ] 13-01: TBD

#### Phase 14: Security Scanning & Dependabot

**Goal**: Enable automated dependency updates and vulnerability scanning
**Depends on**: Phase 13
**Research**: Unlikely (GitHub native Dependabot and code scanning features)
**Plans**: TBD

Plans:
- [ ] 14-01: TBD

#### Phase 15: Bundle Analysis & Optimization

**Goal**: Analyze webpack bundle size and optimize for faster load times
**Depends on**: Phase 14
**Research**: Likely (webpack-bundle-analyzer, code splitting strategies)
**Research topics**: Webpack bundle analysis, dynamic imports, tree shaking, code splitting patterns
**Plans**: TBD

Plans:
- [ ] 15-01: TBD

#### Phase 16: Automated Documentation

**Goal**: Generate API documentation and changelogs automatically from code and commits
**Depends on**: Phase 15
**Research**: Likely (TSDoc, conventional commits, changelog automation)
**Research topics**: TypeScript documentation generators, conventional commit parsers, changelog automation tools
**Plans**: TBD

Plans:
- [ ] 16-01: TBD

#### Phase 17: Deployment Rollback Strategies

**Goal**: Implement safe deployment practices with rollback capabilities
**Depends on**: Phase 16
**Research**: Likely (GitHub deployments API, versioning strategies)
**Research topics**: GitHub deployment status API, semantic versioning, rollback workflows
**Plans**: TBD

Plans:
- [ ] 17-01: TBD

#### Phase 18: Health Checks & Uptime Monitoring

**Goal**: Add health check endpoints and uptime monitoring for deployed application
**Depends on**: Phase 17
**Research**: Likely (monitoring services, health check patterns)
**Research topics**: Health check endpoints, uptime monitoring services (UptimeRobot, etc.), status pages
**Plans**: TBD

Plans:
- [ ] 18-01: TBD
