/**
 * Network Node Styles Utilities
 * Styling logic for pathogen network nodes
 * Extracted from PathogenNetworkVisualization.js during Phase 4 refactoring
 */

/**
 * Base color schemes for Gram status
 */
export const GRAM_COLOR_SCHEMES = {
  positive: {
    light: '#e9d5ff',
    main: '#a855f7',
    dark: '#7c3aed'
  },
  negative: {
    light: '#fecaca',
    main: '#ef4444',
    dark: '#dc2626'
  }
};

/**
 * Edge stroke colors by connection type
 */
export const EDGE_STROKE_COLORS = {
  strong: '#10b981',   // Emerald green for strong connections
  medium: '#f59e0b',   // Amber for medium connections
  weak: '#94a3b8'      // Slate gray for weak connections
};

/**
 * Edge stroke widths by connection type
 */
export const EDGE_STROKE_WIDTHS = {
  strong: 4,
  medium: 2.5,
  weak: 1.5
};

/**
 * Get node style based on gram status, severity, and resistance
 * @param {Object} node - The node object
 * @param {Object} selectedPathogen - Currently selected pathogen
 * @param {Object} hoveredNode - Currently hovered node
 * @returns {Object} Style properties for the node
 */
export const getNodeStyle = (node, selectedPathogen, hoveredNode) => {
  const isSelected = selectedPathogen && selectedPathogen.id === node.id;
  const isHovered = hoveredNode && hoveredNode.id === node.id;

  const colorScheme = GRAM_COLOR_SCHEMES[node.gramStatus] || GRAM_COLOR_SCHEMES.negative;

  // Severity-based color intensity
  const severityIntensity = {
    high: colorScheme.dark,
    medium: colorScheme.main,
    low: colorScheme.light
  };

  // Resistance-based border styling
  const resistancePercentage = node.resistanceInfo?.resistancePercentage || 0;

  const getBorderColor = () => {
    if (resistancePercentage > 50) return '#dc2626'; // Red for high resistance
    if (resistancePercentage > 25) return '#f59e0b'; // Orange for medium resistance
    return '#10b981'; // Green for low resistance
  };

  const getBorderWidth = () => {
    if (isSelected) return 4;
    if (resistancePercentage > 50) return 3;
    if (resistancePercentage > 25) return 2;
    return 1;
  };

  return {
    fill: severityIntensity[node.severity] || colorScheme.main,
    stroke: getBorderColor(),
    strokeWidth: getBorderWidth(),
    opacity: isHovered ? 0.95 : 0.85,
    filter: isSelected ? 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none'
  };
};

/**
 * Get node radius based on severity
 * @param {Object} node - The node object
 * @returns {number} Radius value
 */
export const getNodeRadius = (node) => {
  const severityRadius = {
    high: 22,
    medium: 16,
    low: 12
  };

  return severityRadius[node.severity] || 16;
};

/**
 * Get node shape based on pathogen morphology
 * @param {Object} node - The node object
 * @returns {string} Shape type ('rect' for rods, 'circle' for cocci)
 */
export const getNodeShape = (node) => {
  return node.shape === 'rod' ? 'rect' : 'circle';
};

/**
 * Get edge style based on connection type and hover state
 * @param {Object} edge - The edge object
 * @param {Object} hoveredNode - Currently hovered node
 * @returns {Object} Style properties for the edge
 */
export const getEdgeStyle = (edge, hoveredNode) => {
  const isHovered = hoveredNode &&
    (hoveredNode.id === edge.source || hoveredNode.id === edge.target);

  return {
    stroke: EDGE_STROKE_COLORS[edge.type] || EDGE_STROKE_COLORS.weak,
    strokeWidth: EDGE_STROKE_WIDTHS[edge.type] || EDGE_STROKE_WIDTHS.weak,
    opacity: isHovered ? 0.9 : 0.7,
    strokeDasharray: edge.type === 'weak' ? '5,5' : 'none',
    filter: isHovered ? 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' : 'none'
  };
};

/**
 * Check if node should show resistance warning
 * @param {Object} node - The node object
 * @returns {boolean} Whether to show warning
 */
export const shouldShowResistanceWarning = (node) => {
  return (node.resistanceInfo?.resistancePercentage || 0) > 50;
};

/**
 * Check if node should show severity indicator
 * @param {Object} node - The node object
 * @returns {boolean} Whether to show indicator
 */
export const shouldShowSeverityIndicator = (node) => {
  return node.severity === 'high';
};

export default {
  GRAM_COLOR_SCHEMES,
  EDGE_STROKE_COLORS,
  EDGE_STROKE_WIDTHS,
  getNodeStyle,
  getNodeRadius,
  getNodeShape,
  getEdgeStyle,
  shouldShowResistanceWarning,
  shouldShowSeverityIndicator
};
