# Phase 5: Enhanced Network Interactivity - Context

**Gathered:** 2026-01-07
**Status:** Ready for planning

> **Note:** This phase was originally "Spaced Repetition Integration" but pivoted during context gathering. The user realized the visual/comparison modes are more interesting and wants to enhance the network visualization rather than add SR complexity to a learning project.

<vision>
## How This Should Work

When you click on an antibiotic in the network, its connected pathogens visually expand and become prominent while everything else fades to ~30% opacity (but stays visible and interactive). The network animates to show the relationships clearly.

This works bidirectionally - clicking a pathogen shows what antibiotics cover it, clicking an antibiotic shows what pathogens it covers. Either direction lets you explore the coverage relationships by drilling down from any node.

The experience should feel like exploring a web of connections - each click reveals more of the picture, helping build intuition about antibiotic coverage patterns through visual exploration rather than memorization.

</vision>

<essential>
## What Must Be Nailed

- **Bidirectional drill-down** - Click antibiotic OR pathogen to explore from that node
- **Visual expansion** - Related nodes animate/expand to show connections clearly
- **Fade effect** - Unrelated nodes dim to ~30% but remain visible and interactive
- **Smooth animation** - Network transitions feel natural, not jarring

</essential>

<boundaries>
## What's Out of Scope

- Clinical scenarios overlay (UTI, pneumonia highlighting) - future enhancement
- Editing/adding medical data - just exploration, no content management
- Connection to quiz system - keep visual and quiz modes separate for now
- Spaced repetition features - deferred/reconsidered for this learning project

</boundaries>

<specifics>
## Specific Ideas

- Click anywhere outside selected node to reset/unfade the network
- Connected nodes should be visually distinguished (maybe animate/pulse briefly)
- Coverage strength could affect how prominent the connection appears
- Keep the existing filtering system working alongside this (filters + drill-down)

</specifics>

<notes>
## Additional Context

**Why the pivot from Spaced Repetition:**
User realized the visual network and comparison interfaces are the unique, interesting parts of this app. SR felt like over-engineering for what's fundamentally a coding learning sandbox. Better to lean into the app's strengths.

**Learning project context:**
This is Josh's React/TypeScript learning project. The goal is learning to code, not shipping a production SR system. Enhancing the visual network is more interesting and valuable for learning.

**Roadmap impact:**
Phase 5 is now "Enhanced Network Interactivity" instead of "Spaced Repetition Integration". The quiz system (Phase 4) can remain simple without SR complexity. Phase 6 (Multi-Modal Flow) may need adjustment since it originally depended on Phase 5 SR.

</notes>

---

*Phase: 05-enhanced-network-interactivity (originally 05-spaced-repetition-integration)*
*Context gathered: 2026-01-07*
