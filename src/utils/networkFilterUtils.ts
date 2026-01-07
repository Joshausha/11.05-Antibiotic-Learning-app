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

/**
 * Apply comprehensive filters to network data
 * Pure function - no mutations, returns filtered copies
 *
 * @param pathogens - All pathogens
 * @param antibiotics - All antibiotics
 * @param coverage - All coverage edges
 * @param filters - Filter criteria
 * @returns Filtered pathogens, antibiotics, and coverage edges
 */
export function applyFilters(
  pathogens: any[],
  antibiotics: any[],
  coverage: any[],
  filters: any
): { pathogens: any[], antibiotics: any[], coverage: any[] } {
  // Filter pathogens by gram stain
  const filteredPathogens = pathogens.filter(pathogen => {
    if (filters.gramStain === 'all') return true;
    return pathogen.gramStatus === filters.gramStain;
  });

  // Filter antibiotics by class, formulation, and mechanism
  const filteredAntibiotics = antibiotics.filter(antibiotic => {
    // Filter by antibiotic classes (multiple selection)
    if (filters.antibioticClasses.length > 0) {
      if (!filters.antibioticClasses.includes(antibiotic.class)) {
        return false;
      }
    }

    // Filter by formulation
    if (filters.formulation !== 'all') {
      // Check if antibiotic has the required formulation in routes array
      const routes = antibiotic.routes || [];
      const hasFormulation = routes.some((route: string) =>
        route.toLowerCase().includes(filters.formulation.toLowerCase())
      );
      if (!hasFormulation) return false;
    }

    // Filter by mechanism of action (multiple selection)
    if (filters.mechanismOfAction.length > 0) {
      const mechanism = antibiotic.mechanismOfAction || '';
      const hasMatch = filters.mechanismOfAction.some((moa: string) =>
        mechanism.toLowerCase().includes(moa.toLowerCase())
      );
      if (!hasMatch) return false;
    }

    return true;
  });

  // Create sets of visible IDs for edge filtering
  const visiblePathogenIds = new Set(filteredPathogens.map(p => p.id));
  const visibleAntibioticIds = new Set(filteredAntibiotics.map(a => a.id));

  // Filter coverage edges
  const filteredCoverage = coverage.filter(edge => {
    // Only show edges where both nodes are visible
    if (!visiblePathogenIds.has(edge.pathogenId)) return false;
    if (!visibleAntibioticIds.has(edge.antibioticId)) return false;

    // Filter by coverage threshold
    if (filters.coverageThreshold !== 'all') {
      const thresholds: Record<string, number> = {
        high: 2,
        medium: 1,
        low: 0
      };
      const requiredLevel = thresholds[filters.coverageThreshold];
      if (edge.coverageLevel < requiredLevel) return false;
    }

    // Filter by resistance status
    if (!filters.showResistance) {
      // Hide edges marked as resistant (coverageLevel 0)
      if (edge.coverageLevel === 0) return false;
    }

    return true;
  });

  return {
    pathogens: filteredPathogens,
    antibiotics: filteredAntibiotics,
    coverage: filteredCoverage
  };
}

export default {
  getPathogenResistanceInfo,
  getDetailedAntibioticInfo,
  filterNodes,
  filterEdges,
  DEFAULT_FILTERS,
  FILTER_OPTIONS,
  applyFilters
};
