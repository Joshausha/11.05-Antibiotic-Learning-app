# Phase 7: Performance & Polish - Context

**Gathered:** 2026-01-07
**Status:** Ready for planning

<vision>
## How This Should Work

A comprehensive polish pass that makes the app solid, fast, and pleasant to work on. The goal is confidence - when you make changes, you know tests will catch bugs. When something breaks, you understand why. When you open the codebase, TypeScript helps rather than fights you.

This is about making everything that exists work reliably and cleanly, not adding new features. The app should feel stable and trustworthy.

</vision>

<essential>
## What Must Be Nailed

- **Medical data accuracy tests** - Tests verify antibiotic coverage relationships, pathogen data, quiz answers are correct. This is the foundation - if the medical content is wrong, nothing else matters.
- **Zero TypeScript errors** - Clean build without TSC_COMPILE_ON_ERROR workaround. Proper types everywhere that help prevent mistakes and make the code easier to understand.
- **Comprehensive test coverage** - Confidence that changes don't break core functionality. Tests should catch bugs before they reach the browser.

</essential>

<boundaries>
## What's Out of Scope

- **New features** - No new visualizations, modes, or learning features. Polish what exists.
- **Mobile optimization** - Desktop-first focus. Mobile responsiveness can wait for later.
- **Deployment/hosting** - Not worried about production deployment, CI/CD, or infrastructure. This is a local learning project.
- **Perfect performance** - Reasonable speed is fine; not optimizing for milliseconds.

</boundaries>

<specifics>
## Specific Ideas

- Detailed error information in development mode - when something breaks, show what went wrong so debugging and learning are easier
- Medical data validation tests as the highest priority testing target
- 80%+ test coverage focused on core functionality, not chasing 100% on edge cases

</specifics>

<notes>
## Additional Context

This is a learning project - the goal isn't shipping to production, it's building confidence in the codebase. Tests should help Josh learn when something breaks and why. TypeScript should be a helpful guide, not an obstacle to work around.

The "all of the above" vision (stability, speed, developer experience) is achievable by focusing on fundamentals: good tests, clean types, graceful error handling.

</notes>

---

*Phase: 07-performance-polish*
*Context gathered: 2026-01-07*
