/**
 * Network Graph Data Structure and Interaction Logic
 * Transforms pathogen-antibiotic relationships into force-directed graph visualization
 */

import simpleAntibiotics from '../data/SimpleAntibioticData.js';
import simplePathogens from '../data/SimplePathogenData.js';
import pathogenAntibioticMap from '../data/pathogenAntibioticMap.js';

/**
 * Generate network graph data structure
 * @returns {Object} Network graph data with nodes and edges
 */
export const generateNetworkData = () => {
  const nodes = [];
  const edges = [];

  // Create antibiotic nodes
  simpleAntibiotics.forEach(antibiotic => {
    nodes.push({
      id: `antibiotic-${antibiotic.id}`,
      type: 'antibiotic',
      name: antibiotic.name,
      class: antibiotic.class,
      category: antibiotic.category,
      data: antibiotic,
      color: getAntibioticColor(antibiotic.class),
      size: calculateAntibioticSize(antibiotic.id),
      x: Math.random() * 400 - 200, // Initial random position
      y: Math.random() * 400 - 200
    });
  });

  // Create pathogen nodes
  simplePathogens.forEach(pathogen => {
    nodes.push({
      id: `pathogen-${pathogen.id}`,
      type: 'pathogen',
      name: pathogen.name,
      commonName: pathogen.commonName,
      gramStatus: pathogen.gramStatus,
      shape: pathogen.shape,
      severity: pathogen.severity,
      data: pathogen,
      color: getPathogenColor(pathogen.gramStatus),
      size: calculatePathogenSize(pathogen.severity),
      x: Math.random() * 400 - 200, // Initial random position
      y: Math.random() * 400 - 200
    });
  });

  // Create edges (relationships)
  Object.entries(pathogenAntibioticMap).forEach(([pathogenId, pathogenData]) => {
    pathogenData.antibiotics.forEach(antibiotic => {
      edges.push({
        id: `edge-${pathogenId}-${antibiotic.antibioticId}`,
        source: `pathogen-${pathogenId}`,
        target: `antibiotic-${antibiotic.antibioticId}`,
        effectiveness: antibiotic.effectiveness,
        notes: antibiotic.notes,
        strength: getEffectivenessStrength(antibiotic.effectiveness),
        color: getEffectivenessColor(antibiotic.effectiveness),
        width: getEffectivenessWidth(antibiotic.effectiveness)
      });
    });
  });

  return {
    nodes,
    edges,
    metadata: {
      totalNodes: nodes.length,
      antibioticNodes: nodes.filter(n => n.type === 'antibiotic').length,
      pathogenNodes: nodes.filter(n => n.type === 'pathogen').length,
      totalEdges: edges.length,
      effectivenessDistribution: calculateEffectivenessDistribution(edges)
    }
  };
};

/**
 * Get color for antibiotic nodes based on drug class
 * @param {string} drugClass - Drug class name
 * @returns {string} Hex color code
 */
const getAntibioticColor = (drugClass) => {
  const colorMap = {
    'Penicillin': '#3B82F6',
    'Glycopeptide': '#8B5CF6',
    'Quinolone': '#F59E0B',
    '3rd generation cephalosporin': '#10B981',
    'Macrolide': '#EC4899',
    'Lincosamide': '#14B8A6',
    'Aminoglycoside': '#6366F1',
    'Carbapenem': '#EF4444',
    'Tetracycline': '#84CC16',
    'Sulfonamide combination': '#F97316',
    'Oxazolidinone': '#06B6D4',
    'Nitroimidazole': '#64748B',
    '1st generation cephalosporin': '#22C55E',
    'Penicillin + Beta-lactamase inhibitor': '#A855F7'
  };
  return colorMap[drugClass] || '#6B7280';
};

/**
 * Get color for pathogen nodes based on gram status
 * @param {string} gramStatus - Gram status (positive/negative)
 * @returns {string} Hex color code
 */
const getPathogenColor = (gramStatus) => {
  const colorMap = {
    'positive': '#DC2626', // Red for gram-positive
    'negative': '#2563EB', // Blue for gram-negative
    'atypical': '#059669'  // Green for atypical
  };
  return colorMap[gramStatus] || '#6B7280';
};

/**
 * Calculate antibiotic node size based on pathogen coverage
 * @param {number} antibioticId - Antibiotic ID
 * @returns {number} Node size
 */
const calculateAntibioticSize = (antibioticId) => {
  const pathogenData = Object.values(pathogenAntibioticMap);
  let effectiveCount = 0;
  let totalCount = 0;

  pathogenData.forEach(pathogen => {
    const antibiotic = pathogen.antibiotics.find(ab => ab.antibioticId === antibioticId);
    if (antibiotic) {
      totalCount++;
      if (antibiotic.effectiveness === 'high' || antibiotic.effectiveness === 'medium') {
        effectiveCount++;
      }
    }
  });

  // Size based on effective coverage ratio
  const ratio = totalCount > 0 ? effectiveCount / totalCount : 0;
  return Math.max(10, Math.min(25, 10 + (ratio * 15))); // Size range: 10-25
};

/**
 * Calculate pathogen node size based on severity
 * @param {string} severity - Pathogen severity (high/medium/low)
 * @returns {number} Node size
 */
const calculatePathogenSize = (severity) => {
  const sizeMap = {
    'high': 20,
    'medium': 15,
    'low': 12
  };
  return sizeMap[severity] || 12;
};

/**
 * Get edge strength based on effectiveness
 * @param {string} effectiveness - Effectiveness rating
 * @returns {number} Strength value for force simulation
 */
const getEffectivenessStrength = (effectiveness) => {
  const strengthMap = {
    'high': 1.0,
    'medium': 0.7,
    'low': 0.4,
    'resistant': 0.1
  };
  return strengthMap[effectiveness] || 0.1;
};

/**
 * Get edge color based on effectiveness
 * @param {string} effectiveness - Effectiveness rating
 * @returns {string} Hex color code
 */
const getEffectivenessColor = (effectiveness) => {
  const colorMap = {
    'high': '#10B981',    // Green
    'medium': '#F59E0B',  // Yellow
    'low': '#F97316',     // Orange
    'resistant': '#EF4444' // Red
  };
  return colorMap[effectiveness] || '#6B7280';
};

/**
 * Get edge width based on effectiveness
 * @param {string} effectiveness - Effectiveness rating
 * @returns {number} Edge width in pixels
 */
const getEffectivenessWidth = (effectiveness) => {
  const widthMap = {
    'high': 3,
    'medium': 2,
    'low': 1,
    'resistant': 0.5
  };
  return widthMap[effectiveness] || 1;
};

/**
 * Calculate effectiveness distribution for metadata
 * @param {Array} edges - Array of edges
 * @returns {Object} Distribution statistics
 */
const calculateEffectivenessDistribution = (edges) => {
  const distribution = { high: 0, medium: 0, low: 0, resistant: 0 };
  edges.forEach(edge => {
    distribution[edge.effectiveness]++;
  });
  return distribution;
};

/**
 * Generate D3.js force simulation configuration
 * @param {Object} networkData - Network data with nodes and edges
 * @returns {Object} Force simulation configuration
 */
export const generateForceConfig = (networkData) => {
  return {
    forces: {
      link: {
        id: (d) => d.id,
        strength: (d) => d.strength,
        distance: 80
      },
      charge: {
        strength: -200,
        distanceMax: 400
      },
      center: {
        x: 400, // Assuming 800px width
        y: 300  // Assuming 600px height
      },
      collision: {
        radius: (d) => d.size + 5,
        strength: 0.7
      }
    },
    simulation: {
      alphaMin: 0.001,
      alphaDecay: 0.01,
      velocityDecay: 0.4,
      iterations: 300
    },
    nodes: networkData.nodes,
    edges: networkData.edges
  };
};

/**
 * Filter network data based on criteria
 * @param {Object} networkData - Original network data
 * @param {Object} filters - Filter criteria
 * @returns {Object} Filtered network data
 */
export const filterNetworkData = (networkData, filters = {}) => {
  let filteredNodes = [...networkData.nodes];
  let filteredEdges = [...networkData.edges];

  // Filter by effectiveness
  if (filters.effectiveness && filters.effectiveness.length > 0) {
    filteredEdges = filteredEdges.filter(edge => 
      filters.effectiveness.includes(edge.effectiveness)
    );
  }

  // Filter by drug class
  if (filters.drugClass && filters.drugClass.length > 0) {
    const antibioticIds = filteredNodes
      .filter(node => node.type === 'antibiotic' && filters.drugClass.includes(node.class))
      .map(node => node.id);
    
    filteredEdges = filteredEdges.filter(edge => 
      antibioticIds.includes(edge.target)
    );
  }

  // Filter by gram status
  if (filters.gramStatus && filters.gramStatus.length > 0) {
    const pathogenIds = filteredNodes
      .filter(node => node.type === 'pathogen' && filters.gramStatus.includes(node.gramStatus))
      .map(node => node.id);
    
    filteredEdges = filteredEdges.filter(edge => 
      pathogenIds.includes(edge.source)
    );
  }

  // Remove isolated nodes
  const connectedNodeIds = new Set();
  filteredEdges.forEach(edge => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });
  
  filteredNodes = filteredNodes.filter(node => connectedNodeIds.has(node.id));

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
    metadata: {
      totalNodes: filteredNodes.length,
      antibioticNodes: filteredNodes.filter(n => n.type === 'antibiotic').length,
      pathogenNodes: filteredNodes.filter(n => n.type === 'pathogen').length,
      totalEdges: filteredEdges.length,
      effectivenessDistribution: calculateEffectivenessDistribution(filteredEdges)
    }
  };
};

/**
 * Find neighboring nodes for a given node
 * @param {Object} networkData - Network data
 * @param {string} nodeId - ID of the node
 * @returns {Object} Neighboring nodes and edges
 */
export const findNeighbors = (networkData, nodeId) => {
  const connectedEdges = networkData.edges.filter(edge => 
    edge.source === nodeId || edge.target === nodeId
  );
  
  const neighborIds = new Set();
  connectedEdges.forEach(edge => {
    if (edge.source === nodeId) {
      neighborIds.add(edge.target);
    } else {
      neighborIds.add(edge.source);
    }
  });
  
  const neighbors = networkData.nodes.filter(node => neighborIds.has(node.id));
  
  return {
    neighbors,
    edges: connectedEdges,
    count: neighbors.length
  };
};

/**
 * Calculate shortest path between two nodes
 * @param {Object} networkData - Network data
 * @param {string} sourceId - Source node ID
 * @param {string} targetId - Target node ID
 * @returns {Array} Path array or null if no path exists
 */
export const findShortestPath = (networkData, sourceId, targetId) => {
  if (sourceId === targetId) return [sourceId];
  
  // Build adjacency list
  const adjacencyList = {};
  networkData.nodes.forEach(node => {
    adjacencyList[node.id] = [];
  });
  
  networkData.edges.forEach(edge => {
    adjacencyList[edge.source].push(edge.target);
    adjacencyList[edge.target].push(edge.source);
  });
  
  // BFS to find shortest path
  const queue = [[sourceId]];
  const visited = new Set([sourceId]);
  
  while (queue.length > 0) {
    const path = queue.shift();
    const currentNode = path[path.length - 1];
    
    if (currentNode === targetId) {
      return path;
    }
    
    for (const neighbor of adjacencyList[currentNode] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  
  return null; // No path found
};

/**
 * Generate network clustering data
 * @param {Object} networkData - Network data
 * @returns {Object} Clustering information
 */
export const generateClusters = (networkData) => {
  const clusters = {
    byDrugClass: {},
    byGramStatus: {},
    byEffectiveness: {}
  };
  
  // Cluster by drug class
  networkData.nodes.forEach(node => {
    if (node.type === 'antibiotic') {
      if (!clusters.byDrugClass[node.class]) {
        clusters.byDrugClass[node.class] = [];
      }
      clusters.byDrugClass[node.class].push(node);
    }
  });
  
  // Cluster by gram status
  networkData.nodes.forEach(node => {
    if (node.type === 'pathogen') {
      if (!clusters.byGramStatus[node.gramStatus]) {
        clusters.byGramStatus[node.gramStatus] = [];
      }
      clusters.byGramStatus[node.gramStatus].push(node);
    }
  });
  
  // Cluster by effectiveness
  networkData.edges.forEach(edge => {
    if (!clusters.byEffectiveness[edge.effectiveness]) {
      clusters.byEffectiveness[edge.effectiveness] = [];
    }
    clusters.byEffectiveness[edge.effectiveness].push(edge);
  });
  
  return clusters;
};

/**
 * Validate network graph data structure
 * @returns {Array} Array of validation errors, empty if valid
 */
export const validateNetworkData = () => {
  const errors = [];
  
  try {
    const networkData = generateNetworkData();
    
    // Validate nodes
    if (networkData.nodes.length === 0) {
      errors.push('No nodes generated');
    }
    
    // Validate edges
    if (networkData.edges.length === 0) {
      errors.push('No edges generated');
    }
    
    // Validate node structure
    const sampleNode = networkData.nodes[0];
    const requiredNodeFields = ['id', 'type', 'name', 'color', 'size'];
    requiredNodeFields.forEach(field => {
      if (!(field in sampleNode)) {
        errors.push(`Missing node field: ${field}`);
      }
    });
    
    // Validate edge structure
    const sampleEdge = networkData.edges[0];
    const requiredEdgeFields = ['id', 'source', 'target', 'effectiveness', 'strength'];
    requiredEdgeFields.forEach(field => {
      if (!(field in sampleEdge)) {
        errors.push(`Missing edge field: ${field}`);
      }
    });
    
    // Test filtering
    const filtered = filterNetworkData(networkData, { effectiveness: ['high'] });
    if (filtered.edges.length === 0) {
      errors.push('Filtering functionality failed');
    }
    
  } catch (error) {
    errors.push(`Network data validation error: ${error.message}`);
  }
  
  return errors;
};

export default {
  generateNetworkData,
  generateForceConfig,
  filterNetworkData,
  findNeighbors,
  findShortestPath,
  generateClusters,
  validateNetworkData
};