/**
 * NetworkLayout.js - Biological Layout Algorithm Configurations
 * 
 * Specialized layout algorithms optimized for pathogen-antibiotic relationship networks.
 * Each layout is tuned for medical education and clinical decision support visualization.
 * 
 * @module NetworkLayout
 * @version 1.0.0
 * @created 2025-08-27
 * @medical-validation CRITICAL - Layout parameters affect clinical relationship clarity
 * @performance-target Smooth 60fps layout animations, <2s layout completion
 * @algorithms FCOSE (preferred), Cola, Dagre, COSE-Bilkent
 */

/**
 * FCOSE Layout - Force-directed layout with compound graph support
 * Optimized for pathogen-antibiotic clustering and relationship visualization
 * BEST FOR: Medium to large networks with clear pathogen groupings
 */
export const FCOSE_MEDICAL_LAYOUT = {
  name: 'fcose',
  quality: 'proof',
  randomize: false,
  animate: true,
  animationDuration: 1000,
  animationEasing: 'ease-out',
  fit: true,
  padding: 30,
  
  // Medical clustering parameters
  nodeDimensionsIncludeLabels: true,
  uniformNodeDimensions: false,
  packComponents: true,
  
  // Biological force parameters - tuned for pathogen relationships
  idealEdgeLength: 120,        // Optimal distance for pathogen-antibiotic connections
  nodeRepulsion: 4500,         // Prevent pathogen overlap for readability
  edgeElasticity: 0.45,        // Spring-like behavior for medical relationships
  nestingFactor: 0.1,          // Compound node clustering strength
  gravity: 0.25,               // Central attraction for compact layout
  numIter: 2500,              // High iterations for stable medical layout
  
  // Performance optimization
  tile: true,
  tilingPaddingVertical: 10,
  tilingPaddingHorizontal: 10,
  
  // Medical education enhancements
  initialTemp: 1000,           // Starting temperature for force simulation
  coolingFactor: 0.95,         // Cooling rate for convergence
  minTemp: 1.0,                // Minimum temperature threshold
  
  // Compound graph support for pathogen families
  nodeGroups: null,            // Can be set dynamically for gram stain grouping
  groupPadding: 20,            // Space within pathogen family groups
};

/**
 * Cola Layout - Constraint-based layout with clustering
 * Optimized for hierarchical pathogen classification
 * BEST FOR: Educational content showing pathogen taxonomies
 */
export const COLA_MEDICAL_LAYOUT = {
  name: 'cola',
  animate: true,
  animationDuration: 1200,
  animationEasing: 'ease-in-out',
  refresh: 20,
  maxSimulationTime: 4000,
  ungrabifyWhileSimulating: false,
  fit: true,
  padding: 40,
  
  // Medical hierarchy parameters
  nodeDimensionsIncludeLabels: true,
  uniformNodeDimensions: false,
  
  // Force-directed parameters for medical networks
  edgeLength: 100,             // Distance between connected pathogens/antibiotics
  edgeSymDiffLength: 100,      // Symmetric difference edge length
  edgeJaccardLength: 100,      // Jaccard similarity edge length
  
  // Biological clustering
  nodeSpacing: 5,              // Minimum space between pathogen nodes
  flow: null,                  // Can be set for directed antibiotic relationships
  
  // Constraints for medical accuracy
  alignment: null,             // Can be used to align by Gram stain
  gapInequalities: null,       // Enforce minimum distances between node types
  
  // Performance settings
  randomize: false,
  debug: false,
  
  // Medical layout preferences
  avoidOverlaps: true,         // Critical for pathogen label readability
  handleDisconnected: true,    // Handle isolated pathogens gracefully
  convergenceThreshold: 0.01,  // Layout stability threshold
  alpha: 0.5,                  // Step size for force calculations
};

/**
 * Dagre Layout - Hierarchical directed graph layout
 * Optimized for antibiotic mechanism pathways and resistance chains
 * BEST FOR: Showing antibiotic resistance progression or treatment pathways
 */
export const DAGRE_MEDICAL_LAYOUT = {
  name: 'dagre',
  animate: true,
  animationDuration: 800,
  animationEasing: 'linear',
  fit: true,
  padding: 50,
  
  // Hierarchical medical organization
  nodeDimensionsIncludeLabels: true,
  uniformNodeDimensions: false,
  
  // Dagre-specific parameters for medical hierarchy
  rankDir: 'TB',               // Top-bottom for infection -> treatment flow
  ranksep: 100,                // Vertical separation between treatment levels
  nodesep: 50,                 // Horizontal separation between pathogens
  
  // Edge routing for medical relationships
  edgesep: 10,                 // Separation between parallel relationships
  rankdir: 'TB',               // Direction: pathogen -> antibiotic -> outcome
  
  // Medical workflow optimization
  align: 'UL',                 // Align nodes upper-left for consistent reading
  acyclicer: 'greedy',         // Handle resistance cycles in pathogen networks
  ranker: 'tight-tree',        // Minimize treatment pathway spans
  
  // Layout quality for clinical education
  minlen: 1,                   // Minimum edge length for readability
  edgeWeight: 1,               // Equal weight for all pathogen-antibiotic connections
  
  // Performance settings
  refresh: 30,
  debug: false,
  
  // Medical-specific enhancements
  sortByPosition: true,        // Maintain consistent pathogen positioning
  spacingFactor: 1.25,         // Extra space for medical terminology
};

/**
 * COSE-Bilkent Layout - Multi-level force-directed layout
 * Optimized for large-scale pathogen networks with performance
 * BEST FOR: Large datasets with 50+ pathogens and complex relationships
 */
export const COSE_BILKENT_MEDICAL_LAYOUT = {
  name: 'cose-bilkent',
  quality: 'default',         // Balance between speed and quality for clinical use
  randomize: true,
  animate: true,
  animationDuration: 1500,
  animationEasing: 'ease-out',
  fit: true,
  padding: 35,
  
  // Medical network parameters
  nodeDimensionsIncludeLabels: true,
  uniformNodeDimensions: false,
  packComponents: true,
  
  // Multi-level optimization for large medical networks
  nodeRepulsion: 4500,         // Pathogen separation for clarity
  idealEdgeLength: 80,         // Compact layout for large datasets
  edgeElasticity: 0.45,        // Spring behavior for relationships
  nestingFactor: 0.1,          // Compound grouping strength
  gravity: 0.4,                // Stronger gravity for large networks
  numIter: 2500,              // Sufficient iterations for stability
  
  // Performance optimization for clinical environments
  tile: true,
  tilingPaddingVertical: 8,
  tilingPaddingHorizontal: 8,
  gravityRangeCompound: 1.5,   // Compound node gravity range
  gravityCompound: 1.0,        // Compound gravity strength
  gravityRange: 3.8,           // Gravity range for positioning
  
  // Medical clustering parameters
  initialTemp: 1000,           // Starting temperature
  coolingFactor: 0.95,         // Cooling rate
  minTemp: 1.0,                // Convergence threshold
  
  // Clinical workflow optimization
  randomize: false,            // Deterministic layouts for teaching consistency
  componentSpacing: 40,        // Space between disconnected pathogen groups
  nodeOverlap: 20,             // Minimum overlap prevention
  refresh: 30,                 // Refresh rate during animation
  
  // Advanced medical features
  fixedNodeConstraint: null,   // Can pin specific pathogens for educational focus
  alignmentConstraint: null,   // Can align pathogens by classification
  relativePlacementConstraint: null,  // Relative positioning for clinical accuracy
};

/**
 * Grid Layout - Organized grid for systematic pathogen comparison
 * BEST FOR: Educational overviews and pathogen classification exercises
 */
export const GRID_MEDICAL_LAYOUT = {
  name: 'grid',
  fit: true,
  padding: 30,
  boundingBox: undefined,      // Use entire container
  avoidOverlap: true,
  avoidOverlapPadding: 10,
  nodeDimensionsIncludeLabels: true,
  spacingFactor: undefined,    // Auto-calculate optimal spacing
  condense: false,
  rows: undefined,             // Auto-calculate based on pathogen count
  cols: undefined,             // Auto-calculate for optimal aspect ratio
  position: function(node) {}, // Can be customized for medical ordering
  sort: undefined,             // Can sort by Gram stain, severity, etc.
  animate: true,
  animationDuration: 500,
  animationEasing: 'ease-in-out',
  transform: function(node, position) { return position; }
};

/**
 * Circle Layout - Circular arrangement for pathogen families
 * BEST FOR: Small focused groups, pathogen family relationships
 */
export const CIRCLE_MEDICAL_LAYOUT = {
  name: 'circle',
  fit: true,
  padding: 30,
  boundingBox: undefined,
  avoidOverlap: true,
  nodeDimensionsIncludeLabels: true,
  spacingFactor: undefined,
  radius: undefined,           // Auto-calculate based on pathogen count
  startAngle: 3 / 2 * Math.PI, // Start at top (12 o'clock position)
  sweep: undefined,            // Full circle by default
  clockwise: true,
  sort: undefined,             // Can sort by clinical severity
  animate: true,
  animationDuration: 800,
  animationEasing: 'ease-out',
  transform: function(node, position) { return position; }
};

/**
 * Layout configuration map for easy access
 */
export const MEDICAL_LAYOUTS = {
  fcose: FCOSE_MEDICAL_LAYOUT,
  cola: COLA_MEDICAL_LAYOUT,
  dagre: DAGRE_MEDICAL_LAYOUT,
  'cose-bilkent': COSE_BILKENT_MEDICAL_LAYOUT,
  grid: GRID_MEDICAL_LAYOUT,
  circle: CIRCLE_MEDICAL_LAYOUT
};

/**
 * Default layout recommendations based on network characteristics
 */
export const getRecommendedLayout = (networkStats) => {
  // Defensive programming - handle null/undefined networkStats
  if (!networkStats) {
    return 'fcose'; // Default layout for null statistics
  }
  
  const { pathogenCount = 0, antibioticCount = 0, relationshipCount = 0 } = networkStats;
  const totalNodes = pathogenCount + antibioticCount;
  
  // Small networks (< 20 nodes) - Focus on clarity
  if (totalNodes < 20) {
    return relationshipCount > 30 ? 'fcose' : 'circle';
  }
  
  // Medium networks (20-50 nodes) - Balance performance and clarity
  if (totalNodes < 50) {
    return relationshipCount > 100 ? 'fcose' : 'cola';
  }
  
  // Large networks (50+ nodes) - Optimize for performance
  return 'cose-bilkent';
};

/**
 * Create custom layout with medical clustering parameters
 */
export const createMedicalClusteredLayout = (baseLayout, clusterOptions = {}) => {
  const {
    clusterByGramStain = false,
    clusterBySeverity = false,
    clusterByResistance = false,
    clusterPadding = 20,
    interClusterSpacing = 100
  } = clusterOptions;
  
  const clusteredLayout = { ...MEDICAL_LAYOUTS[baseLayout] };
  
  if (clusterByGramStain || clusterBySeverity || clusterByResistance) {
    // Enhance layout with clustering parameters
    clusteredLayout.clusters = {
      gramStain: clusterByGramStain,
      severity: clusterBySeverity,
      resistance: clusterByResistance
    };
    
    clusteredLayout.clusterPadding = clusterPadding;
    clusteredLayout.interClusterSpacing = interClusterSpacing;
    
    // Adjust force parameters for clustering
    if (baseLayout === 'fcose') {
      clusteredLayout.nestingFactor = 0.2;  // Stronger clustering
      clusteredLayout.gravity = 0.1;        // Reduce central attraction
      clusteredLayout.nodeRepulsion *= 1.5;  // Increase repulsion for clarity
    }
  }
  
  return clusteredLayout;
};

/**
 * Layout performance profiles for different clinical environments
 */
export const PERFORMANCE_PROFILES = {
  // High-performance for research environments with powerful hardware
  research: {
    quality: 'proof',
    animationDuration: 2000,
    numIter: 5000,
    refresh: 10
  },
  
  // Balanced for clinical education environments
  clinical: {
    quality: 'default',
    animationDuration: 1000,
    numIter: 2500,
    refresh: 20
  },
  
  // Fast for mobile or low-power clinical devices
  mobile: {
    quality: 'fast',
    animationDuration: 500,
    numIter: 1000,
    refresh: 50
  }
};

/**
 * Apply performance profile to layout configuration
 */
export const applyPerformanceProfile = (layout, profile = 'clinical') => {
  const profileSettings = PERFORMANCE_PROFILES[profile];
  if (!profileSettings) return layout;
  
  return {
    ...layout,
    ...profileSettings
  };
};

/**
 * Validate layout configuration for medical networks
 */
export const validateMedicalLayout = (layout) => {
  const warnings = [];
  
  if (!layout.nodeDimensionsIncludeLabels) {
    warnings.push('Layout should include label dimensions for medical readability');
  }
  
  if (layout.animate && layout.animationDuration > 3000) {
    warnings.push('Animation duration > 3s may impact clinical workflow efficiency');
  }
  
  if (!layout.fit) {
    warnings.push('Layout should fit container for consistent clinical presentation');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
};

export default {
  MEDICAL_LAYOUTS,
  getRecommendedLayout,
  createMedicalClusteredLayout,
  applyPerformanceProfile,
  validateMedicalLayout,
  
  // Individual layouts for direct import
  FCOSE_MEDICAL_LAYOUT,
  COLA_MEDICAL_LAYOUT,
  DAGRE_MEDICAL_LAYOUT,
  COSE_BILKENT_MEDICAL_LAYOUT,
  GRID_MEDICAL_LAYOUT,
  CIRCLE_MEDICAL_LAYOUT
};