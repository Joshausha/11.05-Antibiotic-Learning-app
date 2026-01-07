/**
 * D3 Network Graph Component
 *
 * Interactive network visualization showing antibiotic-pathogen coverage relationships
 * using D3 force-directed layout.
 *
 * Features:
 * - Organic force-directed node positioning
 * - Visual encoding: pathogens (blue), antibiotics (green)
 * - Edges represent coverage relationships from EnhancedAntibioticData
 * - SVG rendering for accessibility and interactivity
 *
 * Based on Phase 2 research findings - uses D3 for physics, React for rendering.
 */

import React, { useMemo } from 'react';
import { useD3ForceSimulation, NetworkNode, NetworkEdge } from '../../hooks/useD3ForceSimulation';
import { Pathogen, Antibiotic, NorthwesternSpectrum } from '../../types/medical.types';

interface D3NetworkGraphProps {
  pathogens: Pathogen[];
  antibiotics: Antibiotic[];
  width?: number;
  height?: number;
}

/**
 * Convert coverage data from Northwestern spectrum to edges
 * Creates edges for coverage level >= 1 (moderate or good coverage)
 */
function createCoverageEdges(
  pathogens: Pathogen[],
  antibiotics: Antibiotic[]
): NetworkEdge[] {
  const edges: NetworkEdge[] = [];
  let edgeId = 0;

  antibiotics.forEach(antibiotic => {
    pathogens.forEach(pathogen => {
      // Get coverage level from Northwestern spectrum
      // Map pathogen to Northwestern category
      const category = pathogen.northwestern8SegmentCategory as keyof NorthwesternSpectrum;

      if (category && antibiotic.northwesternSpectrum) {
        const coverageLevel = antibiotic.northwesternSpectrum[category];

        // Only create edge if there's at least moderate coverage (1 or 2)
        if (coverageLevel >= 1) {
          edges.push({
            id: `edge-${edgeId++}`,
            source: `pathogen-${pathogen.id}`,
            target: `antibiotic-${antibiotic.id}`,
            coverageLevel
          });
        }
      }
    });
  });

  return edges;
}

/**
 * D3 Network Graph Component
 *
 * Renders interactive network visualization of antibiotic-pathogen relationships.
 *
 * @param pathogens - Array of pathogen entities
 * @param antibiotics - Array of antibiotic entities
 * @param width - Canvas width (default: 800)
 * @param height - Canvas height (default: 600)
 */
export const D3NetworkGraph: React.FC<D3NetworkGraphProps> = ({
  pathogens,
  antibiotics,
  width = 800,
  height = 600
}) => {
  // Convert data to network format
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    // Create nodes for pathogens
    const pathogenNodes: NetworkNode[] = pathogens.map(pathogen => ({
      id: `pathogen-${pathogen.id}`,
      type: 'pathogen' as const,
      name: pathogen.name,
      // D3 will set x, y during simulation
    }));

    // Create nodes for antibiotics
    const antibioticNodes: NetworkNode[] = antibiotics.map(antibiotic => ({
      id: `antibiotic-${antibiotic.id}`,
      type: 'antibiotic' as const,
      name: antibiotic.name,
      // D3 will set x, y during simulation
    }));

    const nodes = [...pathogenNodes, ...antibioticNodes];
    const edges = createCoverageEdges(pathogens, antibiotics);

    return { nodes, edges };
  }, [pathogens, antibiotics]);

  // Use D3 force simulation hook
  const { nodes, edges } = useD3ForceSimulation(
    initialNodes,
    initialEdges,
    { width, height }
  );

  return (
    <svg width={width} height={height} style={{ border: '1px solid #e0e0e0' }}>
      {/* Define marker for arrow heads (optional for future) */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#999" />
        </marker>
      </defs>

      {/* Render edges first (so they appear below nodes) */}
      <g className="edges">
        {edges.map(edge => {
          // Get source and target positions
          const source = edge.source as NetworkNode;
          const target = edge.target as NetworkNode;

          // Only render if positions are defined
          if (!source.x || !source.y || !target.x || !target.y) {
            return null;
          }

          return (
            <line
              key={edge.id}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="#999"
              strokeWidth={1}
              strokeOpacity={0.6}
            />
          );
        })}
      </g>

      {/* Render nodes on top */}
      <g className="nodes">
        {nodes.map(node => {
          // Only render if position is defined
          if (!node.x || !node.y) {
            return null;
          }

          // Visual encoding: pathogen nodes blue, antibiotic nodes green
          const fillColor = node.type === 'pathogen' ? '#3B82F6' : '#10B981';
          const radius = 20;

          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <circle
                r={radius}
                fill={fillColor}
                stroke="#fff"
                strokeWidth={2}
                style={{ cursor: 'pointer' }}
              />
              <text
                textAnchor="middle"
                dy="0.3em"
                fontSize="10"
                fill="#fff"
                pointerEvents="none"
                style={{ userSelect: 'none' }}
              >
                {node.name.length > 8 ? node.name.substring(0, 8) + '...' : node.name}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default D3NetworkGraph;
