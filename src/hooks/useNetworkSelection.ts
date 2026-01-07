/**
 * Network Selection Hook
 *
 * Custom React hook for managing node selection state in the network visualization.
 * Implements click-to-explore drill-down functionality.
 *
 * Key features:
 * - Single centralized state object (per Phase 02-02 pattern)
 * - Computes connected nodes/edges on selection change
 * - Bidirectional: works for both pathogen and antibiotic selection
 *
 * Based on Phase 5 requirements for enhanced network interactivity.
 */

import { useState, useCallback, useMemo } from 'react';
import { NetworkSelectionState, initialSelectionState } from '../types/network-ui.types';
import { NetworkEdge, NetworkNode } from './useD3ForceSimulation';

interface UseNetworkSelectionReturn {
  /** Current selection state */
  selectionState: NetworkSelectionState;
  /** Select a node and compute connected nodes/edges */
  selectNode: (nodeId: string, edges: NetworkEdge[]) => void;
  /** Clear selection, returning to initial state */
  clearSelection: () => void;
  /** Check if a node is connected to the selected node */
  isNodeConnected: (nodeId: string) => boolean;
  /** Check if an edge is connected to the selected node */
  isEdgeConnected: (edgeId: string) => boolean;
  /** Check if a node is the selected node */
  isNodeSelected: (nodeId: string) => boolean;
}

/**
 * Network Selection Hook
 *
 * Manages selection state for click-to-explore network interactions.
 *
 * When a node is selected:
 * - For pathogens: connected nodes are antibiotics that cover it
 * - For antibiotics: connected nodes are pathogens it covers
 *
 * @returns Object containing selection state and helper functions
 *
 * @example
 * ```tsx
 * const {
 *   selectionState,
 *   selectNode,
 *   clearSelection,
 *   isNodeConnected
 * } = useNetworkSelection();
 *
 * // Select a node
 * selectNode('pathogen-1', edges);
 *
 * // Check if another node is connected
 * const connected = isNodeConnected('antibiotic-5'); // true/false
 * ```
 */
export function useNetworkSelection(): UseNetworkSelectionReturn {
  // Single centralized state object (per Phase 02-02 pattern)
  const [selectionState, setSelectionState] = useState<NetworkSelectionState>(initialSelectionState);

  /**
   * Select a node and compute its connections.
   *
   * Edge structure: source = pathogen, target = antibiotic
   * - If selecting a pathogen: find all edges where source.id === nodeId
   *   - Connected edges = those edges
   *   - Connected nodes = the target (antibiotic) of each edge
   * - If selecting an antibiotic: find all edges where target.id === nodeId
   *   - Connected edges = those edges
   *   - Connected nodes = the source (pathogen) of each edge
   */
  const selectNode = useCallback((nodeId: string, edges: NetworkEdge[]) => {
    const connectedNodeIds = new Set<string>();
    const connectedEdgeIds = new Set<string>();

    edges.forEach(edge => {
      // Get source and target IDs (handle both string and NetworkNode forms)
      const sourceId = typeof edge.source === 'string' ? edge.source : (edge.source as NetworkNode).id;
      const targetId = typeof edge.target === 'string' ? edge.target : (edge.target as NetworkNode).id;

      // Check if this edge connects to the selected node
      if (sourceId === nodeId) {
        // Selected node is the source (pathogen), target is connected
        connectedNodeIds.add(targetId);
        connectedEdgeIds.add(edge.id);
      } else if (targetId === nodeId) {
        // Selected node is the target (antibiotic), source is connected
        connectedNodeIds.add(sourceId);
        connectedEdgeIds.add(edge.id);
      }
    });

    setSelectionState({
      selectedNodeId: nodeId,
      connectedNodeIds,
      connectedEdgeIds
    });
  }, []);

  /**
   * Clear selection, returning to initial state.
   */
  const clearSelection = useCallback(() => {
    setSelectionState(initialSelectionState);
  }, []);

  /**
   * Check if a node is connected to the selected node.
   */
  const isNodeConnected = useCallback((nodeId: string): boolean => {
    return selectionState.connectedNodeIds.has(nodeId);
  }, [selectionState.connectedNodeIds]);

  /**
   * Check if an edge is connected to the selected node.
   */
  const isEdgeConnected = useCallback((edgeId: string): boolean => {
    return selectionState.connectedEdgeIds.has(edgeId);
  }, [selectionState.connectedEdgeIds]);

  /**
   * Check if a node is the selected node.
   */
  const isNodeSelected = useCallback((nodeId: string): boolean => {
    return selectionState.selectedNodeId === nodeId;
  }, [selectionState.selectedNodeId]);

  return {
    selectionState,
    selectNode,
    clearSelection,
    isNodeConnected,
    isEdgeConnected,
    isNodeSelected
  };
}

export default useNetworkSelection;
