/**
 * Network Node Styles Utilities
 * Styling logic for pathogen network nodes
 * Extracted from PathogenNetworkVisualization.js during Phase 4 refactoring
 */

/**
 * Type definitions for network styling
 */

interface ColorScheme {
  light: string;
  main: string;
  dark: string;
}

interface GramColorSchemes {
  positive: ColorScheme;
  negative: ColorScheme;
  [key: string]: ColorScheme;
}

interface EdgeStrokeMap {
  strong: string;
  medium: string;
  weak: string;
  [key: string]: string;
}

interface EdgeWidthMap {
  strong: number;
  medium: number;
  weak: number;
  [key: string]: number;
}

interface SeverityRadiusMap {
  high: number;
  medium: number;
  low: number;
  [key: string]: number;
}

interface SeverityIntensityMap {
  high: string;
  medium: string;
  low: string;
  [key: string]: string;
}

interface NodeStyleObject {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  filter: string;
}

interface EdgeStyleObject {
  stroke: string;
  strokeWidth: number;
  opacity: number;
  strokeDasharray: string;
  filter: string;
}

interface Node {
  id: string;
  gramStatus: string;
  severity: string;
  shape: string;
  resistanceInfo?: {
    resistancePercentage: number;
    [key: string]: any;
  };
  [key: string]: any;
}

interface Edge {
  source: string;
  target: string;
  type: string;
  [key: string]: any;
}

interface SelectedPathogen {
  id: string;
  [key: string]: any;
}

interface HoveredNode {
  id: string;
  [key: string]: any;
}

/**
 * Base color schemes for Gram status
 */
export const GRAM_COLOR_SCHEMES: GramColorSchemes = {
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
export const EDGE_STROKE_COLORS: EdgeStrokeMap = {
  strong: '#10b981',   // Emerald green for strong connections
  medium: '#f59e0b',   // Amber for medium connections
  weak: '#94a3b8'      // Slate gray for weak connections
};

/**
 * Edge stroke widths by connection type
 */
export const EDGE_STROKE_WIDTHS: EdgeWidthMap = {
  strong: 4,
  medium: 2.5,
  weak: 1.5
};

/**
 * Get node style based on gram status, severity, and resistance
 * @param node - The node object
 * @param selectedPathogen - Currently selected pathogen
 * @param hoveredNode - Currently hovered node
 * @returns Style properties for the node
 */
export const getNodeStyle = (node: Node, selectedPathogen?: SelectedPathogen, hoveredNode?: HoveredNode): NodeStyleObject => {
  const isSelected = selectedPathogen && selectedPathogen.id === node.id;
  const isHovered = hoveredNode && hoveredNode.id === node.id;

  const colorScheme = GRAM_COLOR_SCHEMES[node.gramStatus] || GRAM_COLOR_SCHEMES.negative;

  // Severity-based color intensity
  const severityIntensity: SeverityIntensityMap = {
    high: colorScheme.dark,
    medium: colorScheme.main,
    low: colorScheme.light
  };

  // Resistance-based border styling
  const resistancePercentage = node.resistanceInfo?.resistancePercentage || 0;

  const getBorderColor = (): string => {
    if (resistancePercentage > 50) return '#dc2626'; // Red for high resistance
    if (resistancePercentage > 25) return '#f59e0b'; // Orange for medium resistance
    return '#10b981'; // Green for low resistance
  };

  const getBorderWidth = (): number => {
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
 * @param node - The node object
 * @returns Radius value
 */
export const getNodeRadius = (node: Node): number => {
  const severityRadius: SeverityRadiusMap = {
    high: 22,
    medium: 16,
    low: 12
  };

  return severityRadius[node.severity] || 16;
};

/**
 * Get node shape based on pathogen morphology
 * @param node - The node object
 * @returns Shape type ('rect' for rods, 'circle' for cocci)
 */
export const getNodeShape = (node: Node): string => {
  return node.shape === 'rod' ? 'rect' : 'circle';
};

/**
 * Get edge style based on connection type and hover state
 * @param edge - The edge object
 * @param hoveredNode - Currently hovered node
 * @returns Style properties for the edge
 */
export const getEdgeStyle = (edge: Edge, hoveredNode?: HoveredNode): EdgeStyleObject => {
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
 * @param node - The node object
 * @returns Whether to show warning
 */
export const shouldShowResistanceWarning = (node: Node): boolean => {
  return (node.resistanceInfo?.resistancePercentage || 0) > 50;
};

/**
 * Check if node should show severity indicator
 * @param node - The node object
 * @returns Whether to show indicator
 */
export const shouldShowSeverityIndicator = (node: Node): boolean => {
  return node.severity === 'high';
};

// ==========================================
// D3 NETWORK GRAPH ENCODING FUNCTIONS
// (for D3NetworkGraph component)
// ==========================================

/**
 * Get gram stain color for D3 network visualization
 * Layer 1: Visual encoding for quick recognition
 */
export function getGramStainColor(gramStain?: string): string {
  if (!gramStain) return '#6B7280'; // Gray for unknown

  const gramLower = gramStain.toLowerCase();

  if (gramLower.includes('positive')) {
    return '#3B82F6'; // Blue for gram-positive
  }
  if (gramLower.includes('negative')) {
    return '#EF4444'; // Red for gram-negative
  }

  return '#6B7280'; // Gray for atypical/unknown
}

/**
 * Get node radius based on type
 * Pathogens and antibiotics have same size for simplicity
 */
export function getNetworkNodeRadius(type: 'pathogen' | 'antibiotic'): number {
  return 20; // Uniform size for cleaner visual design
}

/**
 * Get resistance stroke styling
 * Orange stroke indicates resistance concerns
 */
export function getResistanceStroke(hasResistance: boolean): {
  stroke?: string;
  strokeWidth?: number;
} {
  if (hasResistance) {
    return {
      stroke: '#FFA500', // Orange for resistance
      strokeWidth: 3
    };
  }
  return {}; // No additional stroke
}

export default {
  GRAM_COLOR_SCHEMES,
  EDGE_STROKE_COLORS,
  EDGE_STROKE_WIDTHS,
  getNodeStyle,
  getNodeRadius,
  getNodeShape,
  getEdgeStyle,
  shouldShowResistanceWarning,
  shouldShowSeverityIndicator,
  // New D3 network functions
  getGramStainColor,
  getNetworkNodeRadius,
  getResistanceStroke
};
