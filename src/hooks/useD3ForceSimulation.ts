/**
 * D3 Force Simulation Hook
 *
 * Custom React hook for managing D3.js force-directed graph simulation.
 * Follows React + D3 best practices: D3 handles physics calculations,
 * React handles rendering.
 *
 * Key features:
 * - Throttled state updates (50ms) to prevent React re-render performance death
 * - Proper cleanup on unmount
 * - Four force configuration: link, charge, center, collision
 *
 * Based on research findings from Phase 2 RESEARCH.md
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Network node interface
export interface NetworkNode extends d3.SimulationNodeDatum {
  id: string;
  type: 'pathogen' | 'antibiotic';
  name: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

// Network edge interface
export interface NetworkEdge extends d3.SimulationLinkDatum<NetworkNode> {
  id: string;
  source: string | NetworkNode;
  target: string | NetworkNode;
  coverageLevel?: number; // 0=none, 1=moderate, 2=good
}

interface Dimensions {
  width: number;
  height: number;
}

interface UseD3ForceSimulationReturn {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  simulation: d3.Simulation<NetworkNode, NetworkEdge> | null;
}

/**
 * D3 Force Simulation Hook
 *
 * @param initialNodes - Array of nodes (pathogens and antibiotics)
 * @param initialEdges - Array of edges (coverage relationships)
 * @param dimensions - Canvas dimensions for centering force
 *
 * @returns Object containing nodes, edges, and simulation reference
 *
 * @example
 * ```tsx
 * const { nodes, edges } = useD3ForceSimulation(
 *   networkNodes,
 *   networkEdges,
 *   { width: 800, height: 600 }
 * );
 * ```
 */
export function useD3ForceSimulation(
  initialNodes: NetworkNode[],
  initialEdges: NetworkEdge[],
  dimensions: Dimensions
): UseD3ForceSimulationReturn {
  // State for node and edge positions (updated by simulation)
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);

  // Ref to persist simulation across renders
  const simulationRef = useRef<d3.Simulation<NetworkNode, NetworkEdge> | null>(null);

  // Refs to hold current simulation data (avoids stale closure in tick handler)
  const nodesRef = useRef<NetworkNode[]>([]);
  const edgesRef = useRef<NetworkEdge[]>([]);

  useEffect(() => {
    // Skip if no input data
    if (initialNodes.length === 0) {
      return;
    }

    // Initialize nodes and edges with copies
    const nodesCopy = initialNodes.map(node => ({ ...node }));
    const edgesCopy = initialEdges.map(edge => ({ ...edge }));

    // Store in refs for tick handler access
    nodesRef.current = nodesCopy;
    edgesRef.current = edgesCopy;

    // Create D3 force simulation
    const simulation = d3.forceSimulation<NetworkNode>(nodesCopy)
      // Link force - connects nodes with edges
      .force(
        'link',
        d3.forceLink<NetworkNode, NetworkEdge>(edgesCopy)
          .id(d => d.id)
          .distance(100) // Target distance between connected nodes
      )
      // Charge force - nodes repel each other to prevent overlap
      .force(
        'charge',
        d3.forceManyBody<NetworkNode>()
          .strength(-300) // Negative = repulsion
      )
      // Center force - pulls entire network toward center of canvas
      .force(
        'center',
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
      )
      // Collision force - prevents node overlap with radius padding
      .force(
        'collision',
        d3.forceCollide<NetworkNode>()
          .radius(30) // Node radius + padding
      );

    // Throttle counter for tick updates
    let tickCount = 0;
    const THROTTLE_INTERVAL = 3; // Update React state every 3 ticks (~50ms at 60fps)

    // Set up tick handler
    // Simulation fires 'tick' event many times per second
    // We throttle updates to prevent React re-render performance issues
    simulation.on('tick', () => {
      tickCount++;
      if (tickCount % THROTTLE_INTERVAL === 0) {
        // Create new arrays to trigger React re-render
        setNodes([...nodesRef.current]);
        setEdges([...edgesRef.current]);
      }
    });

    // Store simulation in ref
    simulationRef.current = simulation;

    // Initial state update
    setNodes([...nodesCopy]);
    setEdges([...edgesCopy]);

    // Cleanup: stop simulation when component unmounts
    return () => {
      simulation.stop();
    };
  }, [initialNodes, initialEdges, dimensions.width, dimensions.height]);

  return {
    nodes,
    edges,
    simulation: simulationRef.current
  };
}

export default useD3ForceSimulation;
