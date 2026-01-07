# Phase 2: Visual Network Exploration - Research

**Researched:** 2026-01-06
**Domain:** React network graph visualization with medical education focus
**Confidence:** HIGH

<research_summary>
## Summary

Researched the ecosystem for building interactive network visualizations in React for medical education. The project already has D3.js v7, Cytoscape v3.33, and react-cytoscapejs v2.0 installed, with partial implementations of network filtering and visualization components.

Key finding: **Don't hand-roll graph layout algorithms or force simulations**. Use D3's force simulation (already installed) or Cytoscape's built-in layouts. The existing codebase has foundation pieces (NetworkFilterControls, PathogenNetworkPanel, networkFilterUtils) that can be enhanced rather than rebuilt.

For medical education specifically: **Information layering is critical** - visual encoding for quick pattern recognition, tooltips for mechanism details, and selection panels for deeper explanations. Healthcare data visualization emphasizes clarity, reduced cognitive load, and accessibility.

**Primary recommendation:** Build on existing D3.js v7 + React foundation with force-directed graph for main network view, integrate Northwestern pie charts as alternate mode, and leverage Cytoscape for future advanced layouts. Focus implementation effort on filtering system and mechanism explanation features, not graph rendering engine.
</research_summary>

<standard_stack>
## Standard Stack

### Core (Already Installed ✅)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | 18.2.0 | UI framework | Industry standard for interactive UIs |
| d3 | 7.8.5 | Data-driven visualizations | De facto standard for web data viz, excellent force simulation |
| cytoscape | 3.33.1 | Advanced graph library | Best-in-class for complex network analysis |
| react-cytoscapejs | 2.0.0 | Cytoscape React wrapper | Clean React integration for Cytoscape |

### Supporting (Already Installed ✅)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| chart.js | 4.5.0 | Simple charts | Northwestern pie chart integration |
| react-chartjs-2 | 5.3.0 | Chart.js React wrapper | If adding chart-based views |
| lucide-react | 0.556.0 | Icon system | UI controls, filter buttons |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| D3 force simulation | Reagraph (WebGL) | Reagraph better for 1000+ nodes, overkill for medical dataset (50-100 nodes) |
| Cytoscape | vis-network | vis-network easier API but less powerful layouts, Cytoscape already installed |
| Custom React components | React Flow | React Flow excellent for flowcharts but less suited for organic network layouts |

**Installation:**
```bash
# Already installed! No new dependencies needed for core functionality
npm install  # Existing stack covers all requirements
```

**Note:** The project has excellent foundation - D3 v7 (latest), Cytoscape 3.33 (current), React 18. No major version upgrades needed.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── network/              # Network-specific UI (already exists)
│   │   ├── NetworkFilterControls.tsx  # Filter UI (already exists)
│   │   ├── NetworkLegend.tsx         # Legend component (already exists)
│   │   └── PathogenInfoPanel.tsx     # Detail panels (already exists)
│   ├── visualizations/       # Visualization modes
│   │   ├── D3NetworkGraph.tsx        # D3 force-directed main view
│   │   ├── CytoscapeNetworkGraph.tsx # Cytoscape advanced layouts
│   │   └── PathogenNetworkPanel.tsx  # Panel wrapper (already exists)
│   └── NorthwesternPieChart.tsx      # Existing pie chart integration
├── hooks/
│   ├── useNetworkLayoutSimulation.ts # D3 force simulation logic
│   ├── useNetworkFiltering.ts        # Filter state and logic
│   └── useNetworkInteraction.ts      # Click, hover, selection
├── utils/
│   ├── networkFilterUtils.ts         # Filter logic (already exists)
│   ├── networkNodeStyles.ts          # Node visual encoding (already exists)
│   └── networkLayoutAlgorithms.ts    # Layout configurations
└── styles/
    └── cytoscapeStylesheet.ts        # Cytoscape styling (already exists)
```

### Pattern 1: D3 Force Simulation with React (Recommended for Main Network)
**What:** Let D3 handle physics simulation, React handle rendering
**When to use:** Primary network view with organic node positioning
**Example:**
```typescript
// Hook pattern - D3 for calculations, React for rendering
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function useD3ForceSimulation(nodes, edges) {
  const simulationRef = useRef(null);

  useEffect(() => {
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    simulation.on('tick', () => {
      // Update React state to trigger re-render
      setNodePositions([...nodes]);
    });

    simulationRef.current = simulation;

    return () => simulation.stop();
  }, [nodes, edges]);

  return simulationRef;
}

// Component - React controls SVG rendering
function D3NetworkGraph({ pathogens, antibiotics, coverage }) {
  const simulation = useD3ForceSimulation(nodes, edges);

  return (
    <svg>
      {edges.map(edge => (
        <line key={edge.id} x1={edge.source.x} y1={edge.source.y}
              x2={edge.target.x} y2={edge.target.y} />
      ))}
      {nodes.map(node => (
        <circle key={node.id} cx={node.x} cy={node.y} r={20} />
      ))}
    </svg>
  );
}
```

### Pattern 2: Multi-Mode Tabbed Visualization
**What:** Switch between different visualization modes (network, pie chart, filtered view)
**When to use:** Supporting multiple study approaches as per phase requirements
**Example:**
```typescript
function NetworkVisualizationContainer() {
  const [mode, setMode] = useState('network'); // 'network' | 'northwestern' | 'filtered'
  const [filters, setFilters] = useState(initialFilters);

  return (
    <div>
      <TabBar>
        <Tab onClick={() => setMode('network')}>Interactive Network</Tab>
        <Tab onClick={() => setMode('filtered')}>Filter-Driven View</Tab>
        <Tab onClick={() => setMode('northwestern')}>Northwestern Charts</Tab>
      </TabBar>

      {mode === 'network' && <D3NetworkGraph filters={filters} />}
      {mode === 'filtered' && <FilterDrivenView filters={filters} />}
      {mode === 'northwestern' && <NorthwesternPieChart />}

      <NetworkFilterControls filters={filters} onChange={setFilters} />
    </div>
  );
}
```

### Pattern 3: Information Layering for Medical Education
**What:** Progressive disclosure - visual encoding → tooltips → detail panels
**When to use:** Essential for medical learning per phase context requirements
**Example:**
```typescript
function NetworkNode({ pathogen, coverage, onSelect }) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Layer 1: Visual encoding (color, size)
  const fillColor = getGramStainColor(pathogen.gramStatus);
  const radius = getSeveritySize(pathogen.severity);

  return (
    <>
      {/* Layer 1: Quick visual cues */}
      <circle
        r={radius}
        fill={fillColor}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => onSelect(pathogen)}
      />

      {/* Layer 2: Tooltips for mechanism */}
      {showTooltip && (
        <Tooltip>
          <strong>{pathogen.name}</strong>
          <div>Gram: {pathogen.gramStatus}</div>
          <div>Key vulnerability: {pathogen.keyVulnerability}</div>
        </Tooltip>
      )}

      {/* Layer 3: Detail panel on selection (rendered elsewhere) */}
    </>
  );
}
```

### Pattern 4: Cytoscape for Advanced Layouts
**What:** Use Cytoscape when D3 force simulation isn't sufficient
**When to use:** Hierarchical layouts, compound nodes, advanced styling needs
**Example:**
```typescript
import CytoscapeComponent from 'react-cytoscapejs';

function CytoscapeNetworkGraph({ elements, layout = 'cose' }) {
  return (
    <CytoscapeComponent
      elements={elements}
      layout={{ name: layout }} // cose, circle, grid, breadthfirst
      style={{ width: '100%', height: '600px' }}
      stylesheet={cytoscapeStylesheet} // Already defined in project
    />
  );
}
```

### Anti-Patterns to Avoid
- **Custom graph physics:** D3's force simulation handles collision, gravity, links better than hand-rolled
- **Rendering nodes in force simulation tick:** Use React state updates, not direct DOM manipulation
- **Over-engineering layouts:** Medical dataset is small (50-100 nodes) - simple force-directed is sufficient
- **Ignoring medical UX principles:** Don't sacrifice clarity for visual complexity
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Graph layout algorithm | Custom node positioning logic | D3 force simulation or Cytoscape layouts | Physics simulation is complex - collision, forces, convergence all handled |
| Force-directed physics | Custom velocity/acceleration | d3-force (d3.forceSimulation) | 40+ years of research, handles edge cases you won't think of |
| Graph zooming/panning | Manual transform calculations | d3-zoom | Handles touch, mouse, wheel events with proper gesture recognition |
| Node collision detection | Distance calculations in loops | d3.forceCollide() | Optimized with quadtree, O(n log n) vs your O(n²) |
| Edge routing | Pathfinding between nodes | Straight lines or Cytoscape edge routing | Medical network is sparse enough for simple edges |
| Layout algorithms | Custom hierarchical/circular layouts | Cytoscape built-in layouts (cose, circle, breadthfirst) | Battle-tested, configurable, performant |

**Key insight:** The existing project has D3 v7.8.5 and Cytoscape 3.33.1 already installed. These libraries have solved every graph visualization problem you'll encounter. The implementation effort should focus on **filtering logic, mechanism explanations, and medical education UX**, not graph rendering engines.

**Medical-specific insight:** Healthcare data visualization best practices emphasize **reducing cognitive load** and **clarity over complexity**. Don't build fancy graph features that distract from learning antibiotic mechanisms.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: React Re-renders During Force Simulation
**What goes wrong:** Updating React state on every simulation tick (60fps) causes performance death
**Why it happens:** force.on('tick') fires many times per second during simulation
**How to avoid:** Throttle state updates or use canvas rendering for smooth animation
**Warning signs:** UI becomes sluggish, 60fps animation drops to <20fps
**Solution:**
```typescript
// BAD: Update on every tick (60fps)
simulation.on('tick', () => {
  setNodes([...nodes]); // Re-renders entire component!
});

// GOOD: Throttle updates or use canvas
simulation.on('tick', throttle(() => {
  setNodes([...nodes]);
}, 100)); // Update every 100ms instead

// BETTER: Use canvas for smooth animation, SVG for final state
```

### Pitfall 2: Medical Dataset "Small Network" Assumption
**What goes wrong:** Assuming 50 pathogens = simple visualization, ignoring 500+ coverage relationships
**Why it happens:** Nodes are visible, edges are invisible until you count them
**How to avoid:** Calculate edge count = pathogens × average_antibiotics_per_pathogen (easily 500+ edges)
**Warning signs:** Network becomes hairball, unreadable, performance issues
**Solution:** Filter edges by effectiveness threshold, show high/medium coverage only by default

### Pitfall 3: Ignoring Mobile Clinical Workflow
**What goes wrong:** Beautiful desktop visualization, unusable on iPad during rounds
**Why it happens:** Designing for development machine, not clinical use case
**How to avoid:** Test on tablet, touch-first interaction design, larger tap targets
**Warning signs:** Users complain about "tiny buttons" or "can't click on mobile"
**Solution:** Minimum 44px touch targets, responsive layouts, touch gesture support

### Pitfall 4: Visual Encoding Without Legend
**What goes wrong:** Users don't understand what colors/sizes mean
**Why it happens:** Developer knows the encoding, assumes it's obvious
**How to avoid:** Always include legend component (NetworkLegend.tsx already exists!)
**Warning signs:** User confusion about "why is this node bigger/different color"
**Solution:** Prominent legend showing gram stain colors, severity sizes, edge types

### Pitfall 5: Filter State Management Complexity
**What goes wrong:** Filter combinations create 2^n possible states, bugs everywhere
**Why it happens:** Not using proper state management for filter combinations
**How to avoid:** Single filter state object, pure functions for filtering logic
**Warning signs:** Filters don't work together, enabling one disables another
**Solution:**
```typescript
// GOOD: Centralized filter state
interface NetworkFilters {
  gramStain: 'all' | 'positive' | 'negative';
  antibioticClass: string[];
  formulation: 'all' | 'oral' | 'IV';
  mechanism: string[];
  showResistance: boolean;
}

// Pure filtering function
function applyFilters(nodes, edges, filters) {
  const filteredNodes = nodes
    .filter(n => matchesGramStain(n, filters.gramStain))
    .filter(n => matchesClasses(n, filters.antibioticClass));

  const filteredEdges = edges
    .filter(e => filteredNodes.includes(e.source) && filteredNodes.includes(e.target));

  return { nodes: filteredNodes, edges: filteredEdges };
}
```
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources and existing codebase:

### Basic D3 Force Simulation Setup
```typescript
// Source: D3.js official docs + existing project pattern
import * as d3 from 'd3';

function createNetworkSimulation(nodes, edges, width, height) {
  const simulation = d3.forceSimulation(nodes)
    // Link force - connects nodes with edges
    .force('link', d3.forceLink(edges)
      .id(d => d.id)
      .distance(100) // Target distance between connected nodes
    )
    // Charge force - nodes repel each other
    .force('charge', d3.forceManyBody()
      .strength(-300) // Negative = repulsion
    )
    // Center force - pulls network toward center
    .force('center', d3.forceCenter(width / 2, height / 2))
    // Collision force - prevents node overlap
    .force('collision', d3.forceCollide()
      .radius(30) // Node radius + padding
    );

  return simulation;
}
```

### React Hook for D3 Force Simulation
```typescript
// Source: React + D3 integration best practices
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function useD3ForceSimulation(initialNodes, initialEdges, dimensions) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const simulationRef = useRef(null);

  useEffect(() => {
    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Throttled updates to React state
    simulation.on('tick', throttle(() => {
      setNodes([...nodes]);
      setEdges([...edges]);
    }, 50)); // Update every 50ms

    simulationRef.current = simulation;

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [initialNodes, initialEdges, dimensions]);

  return { nodes, edges, simulation: simulationRef.current };
}
```

### Medical Education Information Layering
```typescript
// Source: Healthcare UX best practices + project requirements
interface PathogenNodeProps {
  pathogen: Pathogen;
  coverage: Coverage[];
  position: { x: number; y: number };
  onSelect: (pathogen: Pathogen) => void;
}

function PathogenNode({ pathogen, coverage, position, onSelect }: PathogenNodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Layer 1: Visual encoding for quick recognition
  const visualEncoding = {
    fill: pathogen.gramStatus === 'positive' ? '#3B82F6' : '#EF4444', // Blue/red
    radius: pathogen.severity === 'high' ? 25 : pathogen.severity === 'medium' ? 20 : 15,
    stroke: coverage.some(c => c.resistance) ? '#FFA500' : 'none', // Orange for resistance
    strokeWidth: 3
  };

  return (
    <g
      transform={`translate(${position.x}, ${position.y})`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => onSelect(pathogen)}
      style={{ cursor: 'pointer' }}
    >
      {/* Layer 1: Visual encoding */}
      <circle {...visualEncoding} />

      {/* Layer 2: Tooltip with mechanism hints */}
      {showTooltip && (
        <foreignObject x={30} y={-20} width={200} height={100}>
          <div className="tooltip">
            <strong>{pathogen.name}</strong>
            <div>Gram: {pathogen.gramStatus}</div>
            <div>Vulnerability: {pathogen.cellWallType}</div>
            <div>{coverage.length} effective antibiotics</div>
          </div>
        </foreignObject>
      )}
    </g>
  );
}

// Layer 3: Detail panel rendered in separate component when selected
// See existing PathogenInfoPanel.tsx
```

### Filtering Logic Pattern
```typescript
// Source: Existing networkFilterUtils.ts + medical data filtering best practices
interface NetworkFilters {
  gramStain: 'all' | 'positive' | 'negative';
  antibioticClasses: string[];
  formulation: 'all' | 'oral' | 'IV' | 'topical';
  mechanismOfAction: string[];
  coverageThreshold: 'high' | 'medium' | 'low';
  showResistance: boolean;
}

function filterNetwork(
  pathogens: Pathogen[],
  antibiotics: Antibiotic[],
  coverage: Coverage[],
  filters: NetworkFilters
) {
  // Filter pathogens
  let filteredPathogens = pathogens;

  if (filters.gramStain !== 'all') {
    filteredPathogens = filteredPathogens.filter(
      p => p.gramStatus === filters.gramStain
    );
  }

  // Filter antibiotics
  let filteredAntibiotics = antibiotics;

  if (filters.antibioticClasses.length > 0) {
    filteredAntibiotics = filteredAntibiotics.filter(
      a => filters.antibioticClasses.includes(a.class)
    );
  }

  if (filters.formulation !== 'all') {
    filteredAntibiotics = filteredAntibiotics.filter(
      a => a.formulations.includes(filters.formulation)
    );
  }

  // Filter coverage edges
  let filteredCoverage = coverage.filter(c =>
    filteredPathogens.some(p => p.id === c.pathogenId) &&
    filteredAntibiotics.some(a => a.id === c.antibioticId)
  );

  // Apply coverage threshold
  const thresholdMap = { high: 2, medium: 1, low: 0 };
  filteredCoverage = filteredCoverage.filter(
    c => c.coverageLevel >= thresholdMap[filters.coverageThreshold]
  );

  // Resistance filter
  if (!filters.showResistance) {
    filteredCoverage = filteredCoverage.filter(c => !c.resistance);
  }

  return {
    pathogens: filteredPathogens,
    antibiotics: filteredAntibiotics,
    coverage: filteredCoverage
  };
}
```

### Cytoscape Integration
```typescript
// Source: Existing cytoscapeStylesheet.ts + react-cytoscapejs docs
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscapeStylesheet from '../styles/cytoscapeStylesheet';

function CytoscapeNetworkGraph({ pathogens, antibiotics, coverage, layout = 'cose' }) {
  // Convert data to Cytoscape format
  const elements = [
    // Nodes
    ...pathogens.map(p => ({
      data: {
        id: p.id,
        label: p.name,
        gramStatus: p.gramStatus,
        type: 'pathogen'
      }
    })),
    ...antibiotics.map(a => ({
      data: {
        id: a.id,
        label: a.name,
        class: a.class,
        type: 'antibiotic'
      }
    })),
    // Edges
    ...coverage.map(c => ({
      data: {
        source: c.pathogenId,
        target: c.antibioticId,
        effectiveness: c.coverageLevel
      }
    }))
  ];

  return (
    <CytoscapeComponent
      elements={elements}
      stylesheet={cytoscapeStylesheet} // Use existing styles
      layout={{
        name: layout, // 'cose', 'circle', 'grid', 'breadthfirst'
        animate: true,
        animationDuration: 500
      }}
      style={{ width: '100%', height: '600px' }}
      cy={(cy) => {
        // Event handlers
        cy.on('tap', 'node', (evt) => {
          const node = evt.target;
          console.log('Selected:', node.data());
        });
      }}
    />
  );
}
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| D3 v5-6 | D3 v7 (current: 7.8.5) | 2021 | Modular imports, better TypeScript support, ESM modules |
| vis.js (archived) | vis-network or modern alternatives | 2020 | Original vis.js deprecated, fork maintained as vis-network |
| SVG-only rendering | Canvas/WebGL for large datasets | 2022+ | Apache ECharts, Reagraph use Canvas/WebGL for 1000+ nodes |
| Manual React+D3 integration | React hooks pattern | 2019+ | useEffect + refs standard pattern, better than class lifecycle |
| Cytoscape 2.x | Cytoscape 3.x (current: 3.33) | 2018 | Major API improvements, better performance |

**New tools/patterns to consider:**
- **Reagraph (WebGL):** Emerged 2023, excellent for 1000+ nodes but overkill for medical dataset (50-100 nodes)
- **React Flow:** Popular 2022+, better for flowcharts/diagrams than organic networks
- **@react-sigma:** Modern Sigma.js wrapper (2024), good for large networks but current stack sufficient
- **D3 v7 force-3d:** 3D force simulation available, interesting for future "3D pathogen space" exploration

**Deprecated/outdated:**
- **vis.js (original):** Archived 2019, use vis-network fork if needed (but Cytoscape already installed)
- **D3 v3-5:** Old API, use v7 (already installed)
- **Manual DOM manipulation in React:** Use hooks + state updates instead
- **gojs:** Commercial license required, Cytoscape open source is superior for this use case

**Medical visualization trends (2025-2026):**
- **AI-powered insights:** Not needed for this phase but relevant for Phase 8 (Learning Analytics)
- **Real-time dashboards:** Not applicable for static antibiotic data
- **Patient-specific visualizations:** Phase 6 could personalize based on user progress
- **Accessibility focus:** Critical for medical education - ensure screen reader support
</sota_updates>

<open_questions>
## Open Questions

Things that couldn't be fully resolved:

1. **Canvas vs SVG rendering for medical dataset**
   - What we know: Canvas better for 1000+ nodes, SVG better for interactivity and accessibility
   - What's unclear: With 50 pathogens + 30 antibiotics + 500 edges, is SVG performant enough?
   - Recommendation: Start with SVG (better accessibility for medical education), profile performance, switch to Canvas only if needed

2. **Northwestern pie chart integration approach**
   - What we know: Existing NorthwesternPieChart.tsx component, Chart.js already installed
   - What's unclear: Best UX for switching between network and pie chart modes - tabs, toggle, or side-by-side?
   - Recommendation: User test with medical residents during Phase 2 implementation, likely tabs based on phase context

3. **Mechanism explanation data structure**
   - What we know: Need to show WHY antibiotic works (mechanism → vulnerability connection)
   - What's unclear: Is mechanism data already in EnhancedAntibioticData.ts or needs to be added?
   - Recommendation: Audit data structure in Plan 02-01, may need schema extension for mechanism linking

4. **Mobile interaction patterns for network graph**
   - What we know: Clinical workflow requires iPad support, touch-first design
   - What's unclear: Best touch gestures for node selection vs graph panning on tablets
   - Recommendation: Implement tap-to-select, two-finger drag for pan, pinch-to-zoom, test with medical users
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [D3.js Official Documentation](https://d3js.org/d3-force) - Force simulation API and examples
- [Cytoscape.js Official Docs](https://js.cytoscape.org/) - Graph visualization library documentation
- [React Official Docs](https://react.dev/) - React 18 patterns and hooks
- Existing codebase analysis - package.json, networkFilterUtils.ts, cytoscapeStylesheet.ts

### Secondary (MEDIUM confidence - cross-verified)
- [React + D3.js Integration Best Practices](https://medium.com/@tibotiber/react-d3-js-balancing-performance-developer-experience-4da35f912484) - Modern integration patterns
- [React Graph Visualization Guide - Cambridge Intelligence](https://cambridge-intelligence.com/react-graph-visualization-library/) - Comprehensive library comparison
- [Healthcare Data Visualization Best Practices - Kodjin](https://kodjin.com/blog/healthcare-data-visualization-importance-benefits/) - Medical UX principles
- [Interactive Visualization in Healthcare - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8900899/) - Academic research on medical data viz

### Tertiary (LOW confidence - WebSearch only, needs validation)
- [Top React Chart Libraries 2026 - DEV Community](https://dev.to/basecampxd/top-7-react-chart-libraries-for-2026-features-use-cases-and-benchmarks-412c) - Performance comparisons
- [React Graph Visualization Libraries 2024 - DEV](https://dev.to/ably/top-react-graph-visualization-libraries-3gmn) - Library roundup

All medical education UX findings verified against multiple sources including PMC peer-reviewed articles.
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: D3.js v7 force simulation, Cytoscape 3.x, React 18
- Ecosystem: react-cytoscapejs, Chart.js integration, filter utilities
- Patterns: React + D3 hooks, information layering, medical UX
- Pitfalls: Performance, mobile clinical workflow, filter complexity

**Confidence breakdown:**
- Standard stack: HIGH - D3 and Cytoscape already installed and current versions
- Architecture: HIGH - React + D3 patterns well-established, verified in existing code
- Pitfalls: HIGH - Common issues documented in official docs and healthcare UX research
- Code examples: HIGH - Based on D3 official docs, existing project code, and verified patterns
- Medical education UX: MEDIUM-HIGH - Healthcare viz best practices verified, but medical education specific patterns need validation during implementation

**Key advantages of existing codebase:**
- ✅ D3 v7.8.5 already installed (latest stable)
- ✅ Cytoscape 3.33.1 already installed (current)
- ✅ Partial implementations exist (NetworkFilterControls, networkFilterUtils, cytoscapeStylesheet)
- ✅ TypeScript configured and working
- ✅ Foundation pieces in place - can enhance rather than build from scratch

**Research date:** 2026-01-06
**Valid until:** 2026-02-06 (30 days - React/D3 ecosystem stable, but medical UX may evolve)
**Next step:** Plan Phase 2 with research insights informing library choices and architecture decisions
</metadata>

---

*Phase: 02-visual-network-exploration*
*Research completed: 2026-01-06*
*Ready for planning: yes*
