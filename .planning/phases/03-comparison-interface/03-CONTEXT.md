# Phase 3: Comparison Interface - Context

**Gathered:** 2026-01-07
**Status:** Ready for planning

<vision>
## How This Should Work

The comparison interface supports multiple modes (side-by-side pairs, reference comparison, multi-item grid), but the **primary use case is reference comparison for learning**: students pick a "known" antibiotic and compare unfamiliar ones against it.

The learning approach emphasizes **similarities first, then differences** - start with what's the same between antibiotics (both cover gram-positive bacteria), then highlight what's unique (but this one also covers MRSA). This progression helps build on existing knowledge rather than overwhelming with differences.

At its core, this is about **clear visual differentiation** - at a glance, you can see how these antibiotics differ. Visual encoding makes differences obvious without requiring deep reading.

</vision>

<essential>
## What Must Be Nailed

- **Clear visual differentiation** - Visual encoding makes differences immediately obvious at a glance
- **Reference comparison learning mode** - The primary workflow: pick a known antibiotic, compare unknowns against it
- **Similarities first, then differences** - Learning progression that builds on existing knowledge
- **Mechanism of action comparison** - Essential property for understanding why coverage differs between antibiotics

</essential>

<boundaries>
## What's Out of Scope

- **Deep clinical decision trees** - Simple comparison interface, not full clinical guidelines or decision algorithms (that's Phase 6 or beyond)
- **Comparison history/saved comparisons** - No persistence or saved comparison sessions yet (defer to future phase)
- **Pathogen comparison** - Phase 3 focuses on antibiotic-to-antibiotic comparison; pathogen comparison deferred

Note: While the interface should support side-by-side and multi-item comparison modes, the primary design focus is reference comparison learning workflow.

</boundaries>

<specifics>
## Specific Ideas

No specific UI requirements - open to standard approaches that work well for comparison interfaces.

Suggested considerations based on vision:
- Visual encoding should align with Phase 2 patterns (color coding, clear differentiation)
- Mechanism of action is the essential property to compare
- Coverage spectrum (Northwestern segments) likely important secondary property
- Interface should support all three modes (pairs, reference, multi) but optimize for reference learning

</specifics>

<notes>
## Additional Context

**Three comparison modes identified:**
1. Side-by-side pairs (two antibiotics head-to-head)
2. Reference comparison (one known vs multiple unknowns) - **PRIMARY**
3. Multi-item grid (3+ items simultaneously)

**Learning philosophy:**
- Comparison reinforces understanding by showing relationships between antibiotics
- "Similarities first, then differences" mirrors educational best practices
- Visual differentiation reduces cognitive load - see differences without reading paragraphs

**Phase 2 foundation:**
- Multi-mode visualization already established in NetworkVisualizationContainer
- Visual encoding patterns (color, size, stroke) already defined
- Can leverage existing medical data structure (EnhancedAntibioticData.ts)

</notes>

---

*Phase: 03-comparison-interface*
*Context gathered: 2026-01-07*
