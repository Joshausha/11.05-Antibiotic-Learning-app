# Phase 2: Visual Network Exploration - Context

**Gathered:** 2026-01-07
**Status:** Ready for research

<vision>
## How This Should Work

The network visualization provides **multiple viewing modes** (tabs or buttons) that users can switch between to explore antibiotic-bacteria relationships. The key modes include:

1. **Interactive network graph** - Click antibiotics and see what they cover with visual connections
2. **Filter-driven view** - Select criteria (gram stain, antibiotic class, formulations) and see relevant relationships
3. **Northwestern pie chart integration** - The existing 8-segment coverage visualization as one of the visualization modes

The visualization should reveal **WHY each antibiotic works for each bacteria** - not just showing coverage relationships, but illuminating:
- Mechanism of action (how the antibiotic works)
- Pathogen characteristics (why the bacteria is susceptible)
- The connection between antibiotic mechanism and bacterial vulnerability

**Information layering approach:**
- Visual encoding (colors, thickness) for quick pattern recognition
- Tooltips/hover info for mechanism details
- Info panels on selection for deeper explanations
- Support for multiple learning approaches depending on study style

</vision>

<essential>
## What Must Be Nailed

- **Filtering system that finds specific relationships quickly** - This is the priority
  - Filter by gram stain, antibiotic class, formulation, mechanism of action
  - Enable both directions: antibiotic → bacteria AND bacteria → antibiotic
  - Support clinical scenario filtering ("show me what covers gram-negative anaerobes")

- **The WHY behind relationships** - Understanding mechanisms, not just memorizing coverage
  - Show mechanism of action for antibiotics
  - Show pathogen characteristics and vulnerabilities
  - Connect antibiotic mechanism to why it works against specific bacteria

- **Multiple study approaches** - Flexible learning modes
  - Broad-to-narrow: filter to see patterns across groups
  - Specific-to-expand: master one drug by seeing all relationships
  - Scenario-based: clinical reasoning from patient presentation

</essential>

<boundaries>
## What's Out of Scope

- **No comparison features yet** - That's Phase 3
  - Side-by-side antibiotic comparison comes later
  - This phase is visualization and filtering only

- **No data editing** - This is for viewing and exploring, not modifying medical data

- **No advanced graph algorithms** - Keep network features simple
  - No clustering, shortest paths, or complex graph theory
  - Just nodes, edges, filtering, and interaction

</boundaries>

<specifics>
## Specific Ideas

**Visualization modes:**
- Tabbed interface to switch between different views
- Northwestern pie chart preserved as one of the modes
- Network graph as another mode
- Filter-driven view as another mode

**Information architecture:**
- Layered information design (quick visual cues + detailed info on interaction)
- Visual encoding for mechanism types and pathogen characteristics
- Tooltips for quick mechanism details
- Selection panels for deeper explanations

**No specific aesthetic requirements** - Open to standard approaches that work well technically

</specifics>

<notes>
## Additional Context

The learning goal is to **solidify understanding of WHY each antibiotic works for each bacteria** and **WHY bacteria cause specific symptoms**. The visualization should create mental models of the relationships between:
1. Pathogen characteristics (gram stain, cell wall structure, etc.)
2. Antibiotic mechanism of action (cell wall synthesis inhibition, protein synthesis inhibition, etc.)
3. Coverage relationships (what works, what doesn't, and WHY)

The filtering system is prioritized because it enables focused learning on specific clinical scenarios and patterns, which is more valuable than just browsing a large network.

Multiple viewing modes support different study approaches - some users want to start broad and narrow down, others want to deep-dive on specific antibiotics, others want to reason from clinical scenarios.

</notes>

---

*Phase: 02-visual-network-exploration*
*Context gathered: 2026-01-07*
