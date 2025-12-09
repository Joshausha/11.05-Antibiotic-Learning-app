/**
 * Network Filter Utilities
 * Filtering logic for pathogen network visualization
 * Extracted from PathogenNetworkVisualization.js during Phase 4 refactoring
 */

import pathogenAntibioticMap from '../data/pathogenAntibioticMap';

/**
 * Get resistance information for a pathogen
 * @param {string} pathogenId - The pathogen ID
 * @returns {Object} Resistance info with counts and percentages
 */
export const getPathogenResistanceInfo = (pathogenId) => {
  const antibiotics = pathogenAntibioticMap[pathogenId]?.antibiotics || [];
  const resistant = antibiotics.filter(ab => ab.effectiveness === 'resistant').length;
  const total = antibiotics.length;
  const resistancePercentage = total > 0 ? (resistant / total) * 100 : 0;

  return {
    resistant,
    total,
    resistancePercentage,
    highEffective: antibiotics.filter(ab => ab.effectiveness === 'high').length
  };
};

/**
 * Get detailed antibiotic information categorized by effectiveness
 * @param {string} pathogenId - The pathogen ID
 * @returns {Object} Categorized antibiotics
 */
export const getDetailedAntibioticInfo = (pathogenId) => {
  const antibiotics = pathogenAntibioticMap[pathogenId]?.antibiotics || [];

  return {
    high: antibiotics.filter(ab => ab.effectiveness === 'high'),
    medium: antibiotics.filter(ab => ab.effectiveness === 'medium'),
    low: antibiotics.filter(ab => ab.effectiveness === 'low'),
    resistant: antibiotics.filter(ab => ab.effectiveness === 'resistant')
  };
};

/**
 * Apply node filters to the network data
 * @param {Array} nodes - All network nodes
 * @param {Object} filters - Filter settings
 * @returns {Array} Filtered nodes
 */
export const filterNodes = (nodes, filters) => {
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
 * @param {Array} edges - All network edges
 * @param {Array} visibleNodes - Currently visible nodes after filtering
 * @param {string} connectionFilter - Connection strength filter
 * @returns {Array} Filtered edges
 */
export const filterEdges = (edges, visibleNodes, connectionFilter) => {
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
export const DEFAULT_FILTERS = {
  gramFilter: 'all',
  severityFilter: 'all',
  resistanceFilter: 'all',
  shapeFilter: 'all',
  connectionFilter: 'all'
};

/**
 * Filter options for dropdowns
 */
export const FILTER_OPTIONS = {
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
