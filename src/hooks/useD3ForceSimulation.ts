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

import { useEffect, useRef, useState, useCallback } from 'react';
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
 * Throttle function to limit how often a function is called
 * Used to prevent 60fps state updates that cause React re-render storm
 */
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
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
  const [nodes, setNodes] = useState<NetworkNode[]>(initialNodes);
  const [edges, setEdges] = useState<NetworkEdge[]>(initialEdges);

  // Ref to persist simulation across renders
  const simulationRef = useRef<d3.Simulation<NetworkNode, NetworkEdge> | null>(null);

  // Throttled state update function
  // CRITICAL: Updates every 50ms instead of 60fps to prevent performance death
  const throttledUpdate = useCallback(
    throttle(() => {
      setNodes([...nodes]);
      setEdges([...edges]);
    }, 50),
    [nodes, edges]
  );

  useEffect(() => {
    // Initialize nodes and edges with copies
    const nodesCopy = initialNodes.map(node => ({ ...node }));
    const edgesCopy = initialEdges.map(edge => ({ ...edge }));

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

    // Set up throttled tick handler
    // Simulation fires 'tick' event many times per second
    // We throttle updates to prevent React re-render performance issues
    simulation.on('tick', () => {
      throttledUpdate();
    });

    // Store simulation in ref
    simulationRef.current = simulation;

    // Update state with initialized data
    setNodes(nodesCopy);
    setEdges(edgesCopy);

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
