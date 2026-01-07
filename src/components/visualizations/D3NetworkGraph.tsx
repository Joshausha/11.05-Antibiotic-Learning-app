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

import React, { useMemo, useState } from 'react';
import { useD3ForceSimulation, NetworkNode, NetworkEdge } from '../../hooks/useD3ForceSimulation';
import { useNetworkFiltering } from '../../hooks/useNetworkFiltering';
import { useNetworkSelection } from '../../hooks/useNetworkSelection';
import { Pathogen, Antibiotic, NorthwesternSpectrum, Coverage } from '../../types/medical.types';
import NetworkFilterControls from '../network/NetworkFilterControls';
import NetworkLegend from '../network/NetworkLegend';
import NetworkTooltip from '../network/NetworkTooltip';
import { getGramStainColor, getNetworkNodeRadius } from '../../utils/networkNodeStyles';
import '../../styles/networkAnimations.css';

// Opacity constants for selection-based fade effect
const OPACITY = {
  FULL: 1.0,          // Selected and connected elements
  NODE_FADED: 0.3,    // Unconnected nodes (visible but dimmed)
  EDGE_FADED: 0.15    // Unconnected edges (more faded than nodes)
} as const;

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
  // Create coverage edges from source data
  const rawCoverage = useMemo(() => {
    const coverage: Coverage[] = [];
    let coverageId = 0;

    antibiotics.forEach(antibiotic => {
      pathogens.forEach(pathogen => {
        const category = pathogen.northwestern8SegmentCategory as keyof NorthwesternSpectrum;
        if (category && antibiotic.northwesternSpectrum) {
          const coverageLevel = antibiotic.northwesternSpectrum[category];
          if (coverageLevel >= 0) {
            coverage.push({
              id: coverageId++,
              pathogenId: pathogen.id,
              antibioticId: antibiotic.id,
              coverageLevel
            });
          }
        }
      });
    });

    return coverage;
  }, [pathogens, antibiotics]);

  // Apply filters using centralized hook
  const {
    filters,
    setFilters,
    filteredPathogens,
    filteredAntibiotics,
    filteredCoverage
  } = useNetworkFiltering(pathogens, antibiotics, rawCoverage);

  // Convert filtered data to network format
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    // Create nodes for filtered pathogens - include medical data for visual encoding
    const pathogenNodes: NetworkNode[] = filteredPathogens.map(pathogen => ({
      id: `pathogen-${pathogen.id}`,
      type: 'pathogen' as const,
      name: pathogen.name,
      gramStain: pathogen.gramStain, // For color encoding
      clinicalRelevance: pathogen.clinicalRelevance, // For tooltips
    } as NetworkNode));

    // Create nodes for filtered antibiotics - include mechanism for tooltips
    const antibioticNodes: NetworkNode[] = filteredAntibiotics.map(antibiotic => ({
      id: `antibiotic-${antibiotic.id}`,
      type: 'antibiotic' as const,
      name: antibiotic.name,
      mechanism: antibiotic.mechanism, // For tooltips
      class: antibiotic.class, // For tooltips
    } as NetworkNode));

    // Create edges from filtered coverage
    const edges: NetworkEdge[] = filteredCoverage.map((cov, idx) => ({
      id: `edge-${idx}`,
      source: `pathogen-${cov.pathogenId}`,
      target: `antibiotic-${cov.antibioticId}`,
      coverageLevel: cov.coverageLevel
    }));

    const nodes = [...pathogenNodes, ...antibioticNodes];

    return { nodes, edges };
  }, [filteredPathogens, filteredAntibiotics, filteredCoverage]);

  // Use D3 force simulation hook
  const { nodes, edges } = useD3ForceSimulation(
    initialNodes,
    initialEdges,
    { width, height }
  );

  // Selection state for click-to-explore interactions (Phase 5)
  const {
    selectionState,
    selectNode,
    clearSelection,
    isNodeConnected,
    isEdgeConnected,
    isNodeSelected
  } = useNetworkSelection();

  /**
   * Handle node click for bidirectional drill-down.
   * - Click unselected node: select it
   * - Click selected node: clear selection (toggle)
   */
  const handleNodeClick = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent SVG background click

    if (isNodeSelected(nodeId)) {
      // Toggle off - clicking same node clears selection
      clearSelection();
    } else {
      // Select new node (works for both pathogens and antibiotics)
      selectNode(nodeId, edges);
    }
  };

  /**
   * Handle SVG background click to clear selection.
   */
  const handleBackgroundClick = () => {
    if (selectionState.selectedNodeId !== null) {
      clearSelection();
    }
  };

  /**
   * Calculate node opacity based on selection state.
   * - No selection: all nodes at full opacity
   * - With selection: selected + connected at full, others faded
   */
  const getNodeOpacity = (nodeId: string): number => {
    if (selectionState.selectedNodeId === null) {
      return OPACITY.FULL;
    }
    if (isNodeSelected(nodeId) || isNodeConnected(nodeId)) {
      return OPACITY.FULL;
    }
    return OPACITY.NODE_FADED;
  };

  /**
   * Calculate edge opacity based on selection state.
   * - No selection: all edges at default opacity (0.6 from original)
   * - With selection: connected edges at full, others more faded
   */
  const getEdgeOpacity = (edgeId: string): number => {
    if (selectionState.selectedNodeId === null) {
      return 0.6; // Original default opacity
    }
    if (isEdgeConnected(edgeId)) {
      return OPACITY.FULL;
    }
    return OPACITY.EDGE_FADED;
  };

  // Layer 2: Tooltip state for hover interactions
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Create tooltip content from node data
  const createTooltipContent = (node: NetworkNode) => {
    const nodeData = node as any; // Type assertion for additional data

    if (node.type === 'pathogen') {
      // Count how many antibiotics cover this pathogen
      const coverageCount = edges.filter(edge => {
        const source = edge.source as NetworkNode;
        return source.id === node.id;
      }).length;

      return {
        name: node.name,
        type: node.type,
        gramStain: nodeData.gramStain,
        clinicalRelevance: nodeData.clinicalRelevance,
        coverageCount
      };
    } else {
      // Antibiotic node
      return {
        name: node.name,
        type: node.type,
        mechanism: nodeData.mechanism,
        antibioticClass: nodeData.class
      };
    }
  };

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-4">
        <NetworkFilterControls
          filters={filters}
          onChange={setFilters}
        />
      </div>

      {/* Network Visualization */}
      <svg
        width={width}
        height={height}
        style={{ border: '1px solid #e0e0e0' }}
        onClick={handleBackgroundClick}
      >
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
              className="network-edge"
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="#999"
              strokeWidth={1}
              strokeOpacity={getEdgeOpacity(edge.id)}
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

          // Layer 1: Visual encoding
          // Pathogen nodes: colored by gram stain (blue=positive, red=negative, gray=unknown)
          // Antibiotic nodes: green
          const fillColor = node.type === 'pathogen'
            ? getGramStainColor((node as any).gramStain)
            : '#10B981'; // Green for antibiotics

          const radius = getNetworkNodeRadius(node.type);

          const nodeOpacity = getNodeOpacity(node.id);

          const isSelected = isNodeSelected(node.id);

          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              {/* Highlight ring for selected node */}
              {isSelected && (
                <circle
                  className="network-highlight-ring"
                  r={radius + 4}
                  fill="none"
                  stroke="#FCD34D"
                  strokeWidth={3}
                />
              )}
              <circle
                className="network-node"
                r={radius}
                fill={fillColor}
                fillOpacity={nodeOpacity}
                stroke="#fff"
                strokeWidth={2}
                strokeOpacity={nodeOpacity}
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleNodeClick(node.id, e)}
                onMouseEnter={() => {
                  setHoveredNode(node);
                  setTooltipPosition({ x: node.x || 0, y: node.y || 0 });
                }}
                onMouseLeave={() => setHoveredNode(null)}
              />
              <text
                textAnchor="middle"
                dy="0.3em"
                fontSize="10"
                fill="#fff"
                fillOpacity={nodeOpacity}
                pointerEvents="none"
                style={{ userSelect: 'none' }}
              >
                {node.name.length > 8 ? node.name.substring(0, 8) + '...' : node.name}
              </text>
            </g>
          );
        })}
      </g>

      {/* Layer 2: Tooltip on hover */}
      {hoveredNode && (
        <NetworkTooltip
          content={createTooltipContent(hoveredNode)}
          position={tooltipPosition}
        />
      )}
    </svg>

      {/* Layer 1: Legend explains visual encoding */}
      <NetworkLegend />
    </div>
  );
};

export default D3NetworkGraph;
