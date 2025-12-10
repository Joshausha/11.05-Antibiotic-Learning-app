/**
 * Network Filter Utilities
 * Filtering logic for pathogen network visualization
 * Extracted from PathogenNetworkVisualization.js during Phase 4 refactoring
 */

import pathogenAntibioticMap from '../data/pathogenAntibioticMap';

/**
 * Type definitions for network filtering
 */

interface Antibiotic {
  name: string;
  effectiveness: 'high' | 'medium' | 'low' | 'resistant';
  [key: string]: any;
}

interface ResistanceInfo {
  resistant: number;
  total: number;
  resistancePercentage: number;
  highEffective: number;
}

interface DetailedAntibioticsInfo {
  high: Antibiotic[];
  medium: Antibiotic[];
  low: Antibiotic[];
  resistant: Antibiotic[];
}

interface NetworkNode {
  id: string;
  gramStatus?: string;
  severity?: string;
  shape?: string;
  resistanceInfo?: {
    resistancePercentage: number;
    [key: string]: any;
  };
  [key: string]: any;
}

interface NetworkEdge {
  source: string;
  target: string;
  type: string;
  [key: string]: any;
}

interface Filters {
  gramFilter: string;
  severityFilter: string;
  shapeFilter: string;
  resistanceFilter: string;
  connectionFilter?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

interface FilterOptionsMap {
  gram: FilterOption[];
  severity: FilterOption[];
  shape: FilterOption[];
  resistance: FilterOption[];
  connection: FilterOption[];
}

/**
 * Get resistance information for a pathogen
 * @param pathogenId - The pathogen ID
 * @returns Resistance info with counts and percentages
 */
export const getPathogenResistanceInfo = (pathogenId: string): ResistanceInfo => {
  const antibiotics = pathogenAntibioticMap[pathogenId]?.antibiotics || [];
  const resistant = antibiotics.filter((ab: Antibiotic) => ab.effectiveness === 'resistant').length;
  const total = antibiotics.length;
  const resistancePercentage = total > 0 ? (resistant / total) * 100 : 0;

  return {
    resistant,
    total,
    resistancePercentage,
    highEffective: antibiotics.filter((ab: Antibiotic) => ab.effectiveness === 'high').length
  };
};

/**
 * Get detailed antibiotic information categorized by effectiveness
 * @param pathogenId - The pathogen ID
 * @returns Categorized antibiotics
 */
export const getDetailedAntibioticInfo = (pathogenId: string): DetailedAntibioticsInfo => {
  const antibiotics = pathogenAntibioticMap[pathogenId]?.antibiotics || [];

  return {
    high: antibiotics.filter((ab: Antibiotic) => ab.effectiveness === 'high'),
    medium: antibiotics.filter((ab: Antibiotic) => ab.effectiveness === 'medium'),
    low: antibiotics.filter((ab: Antibiotic) => ab.effectiveness === 'low'),
    resistant: antibiotics.filter((ab: Antibiotic) => ab.effectiveness === 'resistant')
  };
};

/**
 * Apply node filters to the network data
 * @param nodes - All network nodes
 * @param filters - Filter settings
 * @returns Filtered nodes
 */
export const filterNodes = (nodes: NetworkNode[], filters: Filters): NetworkNode[] => {
  const { gramFilter, severityFilter, shapeFilter, resistanceFilter } = filters;

  return (nodes || []).filter(node => {
    // Gram status filter
    if (gramFilter !== 'all' && node.gramStatus !== gramFilter) return false;

    // Severity filter
    if (severityFilter !== 'all' && node.severity !== severityFilter) return false;

    // Shape filter
    if (shapeFilter !== 'all' && node.shape !== shapeFilter) return false;

    // Resistance filter
    if (resistanceFilter !== 'all') {
      const resistancePercentage = node.resistanceInfo?.resistancePercentage || 0;
      if (resistanceFilter === 'high' && resistancePercentage <= 50) return false;
      if (resistanceFilter === 'medium' && (resistancePercentage <= 25 || resistancePercentage > 50)) return false;
      if (resistanceFilter === 'low' && resistancePercentage > 25) return false;
    }

    return true;
  });
};

/**
 * Apply edge filters (only show edges between visible nodes)
 * @param edges - All network edges
 * @param visibleNodes - Currently visible nodes after filtering
 * @param connectionFilter - Connection strength filter
 * @returns Filtered edges
 */
export const filterEdges = (
  edges: NetworkEdge[],
  visibleNodes: NetworkNode[],
  connectionFilter: string
): NetworkEdge[] => {
  const visibleNodeIds = new Set(visibleNodes.map(node => node.id));

  let filteredEdges = (edges || []).filter(edge =>
    visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
  );

  // Apply connection strength filter
  if (connectionFilter !== 'all') {
    filteredEdges = filteredEdges.filter(edge => edge.type === connectionFilter);
  }

  return filteredEdges;
};

/**
 * Default filter state
 */
export const DEFAULT_FILTERS: Filters = {
  gramFilter: 'all',
  severityFilter: 'all',
  resistanceFilter: 'all',
  shapeFilter: 'all',
  connectionFilter: 'all'
};

/**
 * Filter options for dropdowns
 */
export const FILTER_OPTIONS: FilterOptionsMap = {
  gram: [
    { value: 'all', label: 'All' },
    { value: 'positive', label: 'Positive' },
    { value: 'negative', label: 'Negative' }
  ],
  severity: [
    { value: 'all', label: 'All' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ],
  shape: [
    { value: 'all', label: 'All' },
    { value: 'cocci', label: 'Cocci' },
    { value: 'rod', label: 'Rod' }
  ],
  resistance: [
    { value: 'all', label: 'All' },
    { value: 'high', label: 'High (>50%)' },
    { value: 'medium', label: 'Medium (25-50%)' },
    { value: 'low', label: 'Low (<25%)' }
  ],
  connection: [
    { value: 'all', label: 'All' },
    { value: 'strong', label: 'Strong' },
    { value: 'medium', label: 'Medium' },
    { value: 'weak', label: 'Weak' }
  ]
};

export default {
  getPathogenResistanceInfo,
  getDetailedAntibioticInfo,
  filterNodes,
  filterEdges,
  DEFAULT_FILTERS,
  FILTER_OPTIONS
};
