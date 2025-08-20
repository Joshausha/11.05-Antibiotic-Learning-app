/**
 * Data Indexer
 * Creates reverse indexes and cross-reference maps for multi-dimensional data access
 * Enables efficient lookup of conditions by pathogen, antibiotic, drug class, etc.
 */

import { processConditionsData } from './dataParser.js';

/**
 * Build comprehensive indexes from processed condition data
 * @param {Array} conditions - Array of medical condition objects
 * @returns {Object} - Complete index structure
 */
export const buildIndexes = (conditions) => {
  const processedData = processConditionsData(conditions);
  
  const indexes = {
    // Primary data
    conditions: processedData.conditions,
    pathogens: processedData.pathogens,
    antibiotics: processedData.antibiotics,
    
    // Reverse indexes
    pathogenToConditions: new Map(),
    antibioticToConditions: new Map(),
    conditionToPathogens: new Map(),
    conditionToAntibiotics: new Map(),
    
    // Classification indexes
    gramPositivePathogens: [],
    gramNegativePathogens: [],
    drugClassToAntibiotics: new Map(),
    antibioticToDrugClass: new Map(),
    
    // Cross-reference maps
    pathogenAntibioticMatrix: new Map(),
    conditionComplexity: new Map(),
    
    // Statistics
    stats: {
      totalConditions: conditions.length,
      totalPathogens: processedData.totalPathogens,
      totalAntibiotics: processedData.totalAntibiotics,
      gramPositiveCount: 0,
      gramNegativeCount: 0,
      drugClassCount: 0
    }
  };
  
  // Build pathogen indexes
  processedData.pathogens.forEach(pathogen => {
    // Pathogen to conditions mapping
    indexes.pathogenToConditions.set(pathogen.name, pathogen.conditions);
    
    // Classify by gram status
    if (pathogen.gramStatus === 'positive') {
      indexes.gramPositivePathogens.push(pathogen);
      indexes.stats.gramPositiveCount++;
    } else if (pathogen.gramStatus === 'negative') {
      indexes.gramNegativePathogens.push(pathogen);
      indexes.stats.gramNegativeCount++;
    }
    
    // Build condition to pathogens reverse index
    pathogen.conditions.forEach(conditionId => {
      if (!indexes.conditionToPathogens.has(conditionId)) {
        indexes.conditionToPathogens.set(conditionId, []);
      }
      indexes.conditionToPathogens.get(conditionId).push(pathogen.name);
    });
  });
  
  // Build antibiotic indexes
  processedData.antibiotics.forEach(antibiotic => {
    // Antibiotic to conditions mapping
    indexes.antibioticToConditions.set(antibiotic.name, antibiotic.conditions);
    
    // Drug class classification
    if (!indexes.drugClassToAntibiotics.has(antibiotic.class)) {
      indexes.drugClassToAntibiotics.set(antibiotic.class, []);
    }
    indexes.drugClassToAntibiotics.get(antibiotic.class).push(antibiotic.name);
    indexes.antibioticToDrugClass.set(antibiotic.name, antibiotic.class);
    
    // Build condition to antibiotics reverse index
    antibiotic.conditions.forEach(conditionId => {
      if (!indexes.conditionToAntibiotics.has(conditionId)) {
        indexes.conditionToAntibiotics.set(conditionId, []);
      }
      indexes.conditionToAntibiotics.get(conditionId).push(antibiotic.name);
    });
  });
  
  // Build pathogen-antibiotic matrix
  indexes.pathogenToConditions.forEach((conditionIds, pathogen) => {
    const antibioticsForPathogen = new Set();
    
    conditionIds.forEach(conditionId => {
      const antibiotics = indexes.conditionToAntibiotics.get(conditionId) || [];
      antibiotics.forEach(antibiotic => antibioticsForPathogen.add(antibiotic));
    });
    
    indexes.pathogenAntibioticMatrix.set(pathogen, Array.from(antibioticsForPathogen));
  });
  
  // Calculate condition complexity scores
  conditions.forEach(condition => {
    const pathogenCount = indexes.conditionToPathogens.get(condition.id)?.length || 0;
    const antibioticCount = indexes.conditionToAntibiotics.get(condition.id)?.length || 0;
    const therapyOptions = Object.keys(condition.empiricTherapy || {}).length;
    
    const complexityScore = {
      pathogens: pathogenCount,
      antibiotics: antibioticCount,
      therapyOptions: therapyOptions,
      total: pathogenCount + antibioticCount + therapyOptions
    };
    
    indexes.conditionComplexity.set(condition.id, complexityScore);
  });
  
  // Update final statistics
  indexes.stats.drugClassCount = indexes.drugClassToAntibiotics.size;
  
  return indexes;
};

/**
 * Search pathogens with filtering options
 * @param {Object} indexes - Index structure from buildIndexes
 * @param {Object} options - Search and filter options
 * @returns {Array} - Filtered pathogen results
 */
export const searchPathogens = (indexes, options = {}) => {
  const {
    query = '',
    gramStatus = 'all', // 'all', 'positive', 'negative'
    pathogenType = 'all', // 'all', 'bacteria', 'virus', 'fungus'
    minConditions = 0,
    sortBy = 'name' // 'name', 'count', 'conditions'
  } = options;
  
  let results = [...indexes.pathogens];
  
  // Filter by search query
  if (query) {
    const queryLower = query.toLowerCase();
    results = results.filter(pathogen => 
      pathogen.name.toLowerCase().includes(queryLower) ||
      pathogen.shortName.toLowerCase().includes(queryLower) ||
      pathogen.details.toLowerCase().includes(queryLower)
    );
  }
  
  // Filter by gram status
  if (gramStatus !== 'all') {
    results = results.filter(pathogen => pathogen.gramStatus === gramStatus);
  }
  
  // Filter by pathogen type
  if (pathogenType !== 'all') {
    results = results.filter(pathogen => pathogen.type === pathogenType);
  }
  
  // Filter by minimum conditions
  if (minConditions > 0) {
    results = results.filter(pathogen => pathogen.conditions.length >= minConditions);
  }
  
  // Sort results
  results.sort((a, b) => {
    switch (sortBy) {
      case 'count':
        return b.count - a.count;
      case 'conditions':
        return b.conditions.length - a.conditions.length;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });
  
  return results;
};

/**
 * Search antibiotics with filtering options
 * @param {Object} indexes - Index structure from buildIndexes
 * @param {Object} options - Search and filter options
 * @returns {Array} - Filtered antibiotic results
 */
export const searchAntibiotics = (indexes, options = {}) => {
  const {
    query = '',
    drugClass = 'all',
    minConditions = 0,
    sortBy = 'name' // 'name', 'count', 'conditions', 'class'
  } = options;
  
  let results = [...indexes.antibiotics];
  
  // Filter by search query
  if (query) {
    const queryLower = query.toLowerCase();
    results = results.filter(antibiotic => 
      antibiotic.name.toLowerCase().includes(queryLower) ||
      antibiotic.class.toLowerCase().includes(queryLower)
    );
  }
  
  // Filter by drug class
  if (drugClass !== 'all') {
    results = results.filter(antibiotic => antibiotic.class === drugClass);
  }
  
  // Filter by minimum conditions
  if (minConditions > 0) {
    results = results.filter(antibiotic => antibiotic.conditions.length >= minConditions);
  }
  
  // Sort results
  results.sort((a, b) => {
    switch (sortBy) {
      case 'count':
        return b.count - a.count;
      case 'conditions':
        return b.conditions.length - a.conditions.length;
      case 'class':
        return a.class.localeCompare(b.class) || a.name.localeCompare(b.name);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });
  
  return results;
};

/**
 * Get conditions associated with a specific pathogen
 * @param {Object} indexes - Index structure from buildIndexes
 * @param {string} pathogenName - Name of the pathogen
 * @returns {Array} - Array of condition objects
 */
export const getConditionsForPathogen = (indexes, pathogenName) => {
  const conditionIds = indexes.pathogenToConditions.get(pathogenName) || [];
  return conditionIds.map(id => 
    indexes.conditions.find(condition => condition.id === id)
  ).filter(Boolean);
};

/**
 * Get conditions that can be treated with a specific antibiotic
 * @param {Object} indexes - Index structure from buildIndexes
 * @param {string} antibioticName - Name of the antibiotic
 * @returns {Array} - Array of condition objects with therapy context
 */
export const getConditionsForAntibiotic = (indexes, antibioticName) => {
  const conditionIds = indexes.antibioticToConditions.get(antibioticName) || [];
  const antibiotic = indexes.antibiotics.find(a => a.name === antibioticName);
  
  return conditionIds.map(id => {
    const condition = indexes.conditions.find(c => c.id === id);
    if (!condition) return null;
    
    // Find specific therapy contexts where this antibiotic is mentioned
    const relevantTherapies = {};
    Object.entries(condition.empiricTherapy || {}).forEach(([context, therapy]) => {
      if (therapy.toLowerCase().includes(antibioticName.toLowerCase())) {
        relevantTherapies[context] = therapy;
      }
    });
    
    return {
      ...condition,
      relevantTherapies,
      therapyContexts: antibiotic?.therapyContexts?.filter(ctx => 
        ctx.includes(condition.name)
      ) || []
    };
  }).filter(Boolean);
};

/**
 * Get alternative antibiotics for a specific pathogen
 * @param {Object} indexes - Index structure from buildIndexes
 * @param {string} pathogenName - Name of the pathogen
 * @returns {Array} - Array of antibiotic options with context
 */
export const getAntibioticsForPathogen = (indexes, pathogenName) => {
  const antibioticNames = indexes.pathogenAntibioticMatrix.get(pathogenName) || [];
  
  return antibioticNames.map(name => {
    const antibiotic = indexes.antibiotics.find(a => a.name === name);
    const conditionIds = indexes.pathogenToConditions.get(pathogenName) || [];
    
    // Calculate effectiveness score based on how many conditions this antibiotic treats for this pathogen
    const effectivenessScore = conditionIds.filter(conditionId => 
      antibiotic?.conditions.includes(conditionId)
    ).length;
    
    return {
      ...antibiotic,
      effectivenessScore,
      applicableConditions: conditionIds.filter(conditionId => 
        antibiotic?.conditions.includes(conditionId)
      )
    };
  }).filter(Boolean).sort((a, b) => b.effectivenessScore - a.effectivenessScore);
};

/**
 * Find conditions that can be treated with multiple specific antibiotics (combination therapy)
 * @param {Object} indexes - Index structure from buildIndexes
 * @param {Array} antibioticNames - Array of antibiotic names
 * @returns {Array} - Conditions that use these antibiotics together
 */
export const findCombinationTherapyConditions = (indexes, antibioticNames) => {
  const results = [];
  
  indexes.conditions.forEach(condition => {
    Object.entries(condition.empiricTherapy || {}).forEach(([context, therapy]) => {
      const therapyLower = therapy.toLowerCase();
      const matchingAntibiotics = antibioticNames.filter(name => 
        therapyLower.includes(name.toLowerCase())
      );
      
      if (matchingAntibiotics.length >= 2) {
        results.push({
          condition,
          context,
          therapy,
          matchingAntibiotics
        });
      }
    });
  });
  
  return results;
};

/**
 * Get drug class statistics
 * @param {Object} indexes - Index structure from buildIndexes
 * @returns {Array} - Array of drug class statistics
 */
export const getDrugClassStats = (indexes) => {
  const stats = [];
  
  indexes.drugClassToAntibiotics.forEach((antibiotics, drugClass) => {
    const totalConditions = new Set();
    antibiotics.forEach(antibiotic => {
      const conditions = indexes.antibioticToConditions.get(antibiotic) || [];
      conditions.forEach(condition => totalConditions.add(condition));
    });
    
    stats.push({
      drugClass,
      antibiotics: antibiotics.length,
      conditions: totalConditions.size,
      antibioticList: antibiotics
    });
  });
  
  return stats.sort((a, b) => b.conditions - a.conditions);
};

/**
 * Calculate pathogen similarity score based on multiple factors
 * @param {Object} pathogen1 - First pathogen object
 * @param {Object} pathogen2 - Second pathogen object
 * @param {Object} indexes - Index structure from buildIndexes
 * @returns {Object} - Similarity analysis with detailed scores
 */
export const calculatePathogenSimilarity = (pathogen1, pathogen2, indexes) => {
  if (pathogen1.name === pathogen2.name) return { total: 1, factors: {} };
  
  const similarity = {
    total: 0,
    factors: {
      gramStatus: 0,
      pathogenType: 0,
      sharedConditions: 0,
      sharedAntibiotics: 0,
      treatmentComplexity: 0,
      resistancePattern: 0
    },
    details: {
      sharedConditionNames: [],
      sharedAntibioticNames: [],
      uniqueToFirst: [],
      uniqueToSecond: []
    }
  };
  
  // Gram status similarity (0.15 weight)
  if (pathogen1.gramStatus === pathogen2.gramStatus && pathogen1.gramStatus !== 'unknown') {
    similarity.factors.gramStatus = 0.15;
  }
  
  // Pathogen type similarity (0.1 weight)
  if (pathogen1.type === pathogen2.type) {
    similarity.factors.pathogenType = 0.1;
  }
  
  // Shared conditions analysis (0.35 weight)
  const conditions1 = new Set(pathogen1.conditions);
  const conditions2 = new Set(pathogen2.conditions);
  const sharedConditions = [...conditions1].filter(c => conditions2.has(c));
  const totalUniqueConditions = new Set([...conditions1, ...conditions2]).size;
  
  if (totalUniqueConditions > 0) {
    similarity.factors.sharedConditions = (sharedConditions.length / totalUniqueConditions) * 0.35;
    similarity.details.sharedConditionNames = sharedConditions.map(id => 
      indexes.conditions.find(c => c.id === id)?.name || id
    );
  }
  
  // Shared antibiotics analysis (0.25 weight)
  const antibiotics1 = new Set(indexes.pathogenAntibioticMatrix.get(pathogen1.name) || []);
  const antibiotics2 = new Set(indexes.pathogenAntibioticMatrix.get(pathogen2.name) || []);
  const sharedAntibiotics = [...antibiotics1].filter(a => antibiotics2.has(a));
  const totalUniqueAntibiotics = new Set([...antibiotics1, ...antibiotics2]).size;
  
  if (totalUniqueAntibiotics > 0) {
    similarity.factors.sharedAntibiotics = (sharedAntibiotics.length / totalUniqueAntibiotics) * 0.25;
    similarity.details.sharedAntibioticNames = sharedAntibiotics;
  }
  
  // Treatment complexity similarity (0.1 weight)
  const complexity1 = pathogen1.conditions.reduce((sum, condId) => {
    const complexity = indexes.conditionComplexity.get(condId);
    return sum + (complexity?.total || 0);
  }, 0);
  const complexity2 = pathogen2.conditions.reduce((sum, condId) => {
    const complexity = indexes.conditionComplexity.get(condId);
    return sum + (complexity?.total || 0);
  }, 0);
  
  if (complexity1 > 0 && complexity2 > 0) {
    const complexityDiff = Math.abs(complexity1 - complexity2);
    const maxComplexity = Math.max(complexity1, complexity2);
    similarity.factors.treatmentComplexity = Math.max(0, (1 - complexityDiff / maxComplexity)) * 0.1;
  }
  
  // Resistance pattern similarity (0.05 weight) - placeholder for future enhancement
  // This could be enhanced with actual resistance data
  similarity.factors.resistancePattern = 0.05 * Math.random(); // Placeholder
  
  // Calculate total similarity
  similarity.total = Object.values(similarity.factors).reduce((sum, score) => sum + score, 0);
  
  // Add unique condition details
  similarity.details.uniqueToFirst = [...conditions1].filter(c => !conditions2.has(c))
    .map(id => indexes.conditions.find(c => c.id === id)?.name || id);
  similarity.details.uniqueToSecond = [...conditions2].filter(c => !conditions1.has(c))
    .map(id => indexes.conditions.find(c => c.id === id)?.name || id);
  
  return similarity;
};

/**
 * Build comprehensive pathogen relationship network
 * @param {Object} indexes - Index structure from buildIndexes
 * @returns {Object} - Network structure with nodes and weighted edges
 */
export const buildPathogenNetwork = (indexes) => {
  const network = {
    nodes: [],
    edges: [],
    clusters: new Map(),
    centralityScores: new Map()
  };
  
  // Create nodes for each pathogen
  indexes.pathogens.forEach(pathogen => {
    const node = {
      id: pathogen.name,
      pathogen: pathogen,
      connections: 0,
      centralityScore: 0,
      clusterData: {
        gramStatus: pathogen.gramStatus,
        type: pathogen.type,
        conditionCount: pathogen.conditions.length
      }
    };
    network.nodes.push(node);
  });
  
  // Calculate edges between pathogens based on similarity
  for (let i = 0; i < indexes.pathogens.length; i++) {
    for (let j = i + 1; j < indexes.pathogens.length; j++) {
      const pathogen1 = indexes.pathogens[i];
      const pathogen2 = indexes.pathogens[j];
      const similarity = calculatePathogenSimilarity(pathogen1, pathogen2, indexes);
      
      // Only create edges for meaningful similarities (threshold > 0.2)
      if (similarity.total > 0.2) {
        const edge = {
          source: pathogen1.name,
          target: pathogen2.name,
          weight: similarity.total,
          similarity: similarity,
          type: similarity.total > 0.6 ? 'strong' : similarity.total > 0.4 ? 'medium' : 'weak'
        };
        
        network.edges.push(edge);
        
        // Update connection counts
        const node1 = network.nodes.find(n => n.id === pathogen1.name);
        const node2 = network.nodes.find(n => n.id === pathogen2.name);
        if (node1) node1.connections++;
        if (node2) node2.connections++;
      }
    }
  }
  
  // Calculate centrality scores (simplified betweenness centrality)
  network.nodes.forEach(node => {
    const connections = network.edges.filter(e => e.source === node.id || e.target === node.id);
    const strongConnections = connections.filter(e => e.type === 'strong').length;
    const mediumConnections = connections.filter(e => e.type === 'medium').length;
    const weakConnections = connections.filter(e => e.type === 'weak').length;
    
    node.centralityScore = (strongConnections * 3 + mediumConnections * 2 + weakConnections * 1) / network.nodes.length;
    network.centralityScores.set(node.id, node.centralityScore);
  });
  
  // Identify clusters based on gram status and high connectivity
  const gramClusters = new Map();
  network.nodes.forEach(node => {
    const gramStatus = node.clusterData.gramStatus;
    if (!gramClusters.has(gramStatus)) {
      gramClusters.set(gramStatus, []);
    }
    gramClusters.get(gramStatus).push(node);
  });
  
  network.clusters = gramClusters;
  
  return network;
};

/**
 * Find pathogen exploration paths between two pathogens
 * @param {Object} indexes - Index structure from buildIndexes
 * @param {string} startPathogen - Starting pathogen name
 * @param {string} endPathogen - Target pathogen name
 * @param {number} maxDepth - Maximum path depth to explore
 * @returns {Array} - Array of exploration paths with similarities
 */
export const findPathogenPaths = (indexes, startPathogen, endPathogen, maxDepth = 3) => {
  const network = buildPathogenNetwork(indexes);
  const paths = [];
  
  const findPaths = (current, target, path, depth) => {
    if (depth > maxDepth) return;
    if (current === target && path.length > 1) {
      paths.push([...path]);
      return;
    }
    
    const edges = network.edges.filter(e => 
      (e.source === current || e.target === current) && 
      !path.includes(e.source === current ? e.target : e.source)
    );
    
    edges.forEach(edge => {
      const next = edge.source === current ? edge.target : edge.source;
      findPaths(next, target, [...path, next], depth + 1);
    });
  };
  
  findPaths(startPathogen, endPathogen, [startPathogen], 0);
  
  // Calculate path scores based on edge weights
  return paths.map(path => {
    let totalScore = 0;
    let pathDetails = [];
    
    for (let i = 0; i < path.length - 1; i++) {
      const edge = network.edges.find(e => 
        (e.source === path[i] && e.target === path[i + 1]) ||
        (e.source === path[i + 1] && e.target === path[i])
      );
      
      if (edge) {
        totalScore += edge.weight;
        pathDetails.push({
          from: path[i],
          to: path[i + 1],
          similarity: edge.similarity,
          weight: edge.weight
        });
      }
    }
    
    return {
      path,
      score: totalScore / (path.length - 1), // Average similarity along path
      details: pathDetails,
      length: path.length
    };
  }).sort((a, b) => b.score - a.score);
};

/**
 * Get pathogen recommendations based on current selection and user behavior
 * @param {Object} indexes - Index structure from buildIndexes
 * @param {string} currentPathogen - Currently selected pathogen
 * @param {Array} recentlyViewed - Array of recently viewed pathogen names
 * @param {Object} preferences - User learning preferences
 * @returns {Array} - Array of recommended pathogens with reasoning
 */
export const getPathogenRecommendations = (indexes, currentPathogen, recentlyViewed = [], preferences = {}) => {
  const network = buildPathogenNetwork(indexes);
  const recommendations = [];
  
  const currentNode = network.nodes.find(n => n.id === currentPathogen);
  if (!currentNode) return recommendations;
  
  // Get direct connections sorted by similarity
  const directConnections = network.edges
    .filter(e => e.source === currentPathogen || e.target === currentPathogen)
    .map(e => ({
      pathogen: e.source === currentPathogen ? e.target : e.source,
      similarity: e.similarity,
      weight: e.weight,
      reasoning: 'Direct similarity connection'
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);
  
  recommendations.push(...directConnections);
  
  // Get pathogens from same gram status if user prefers systematic learning
  if (preferences.systematicLearning && currentNode.clusterData.gramStatus !== 'unknown') {
    const sameGramPathogens = indexes.pathogens
      .filter(p => 
        p.gramStatus === currentNode.clusterData.gramStatus && 
        p.name !== currentPathogen &&
        !recommendations.some(r => r.pathogen === p.name)
      )
      .slice(0, 3)
      .map(p => ({
        pathogen: p.name,
        similarity: { total: 0.3, factors: { gramStatus: 0.15 } },
        weight: 0.3,
        reasoning: `Same gram status (${p.gramStatus})`
      }));
    
    recommendations.push(...sameGramPathogens);
  }
  
  // Get pathogens that treat similar conditions
  const currentConditions = new Set(currentNode.pathogen.conditions);
  const conditionBasedRecommendations = indexes.pathogens
    .filter(p => {
      if (p.name === currentPathogen) return false;
      if (recommendations.some(r => r.pathogen === p.name)) return false;
      
      const sharedConditions = p.conditions.filter(c => currentConditions.has(c));
      return sharedConditions.length > 0;
    })
    .map(p => {
      const sharedConditions = p.conditions.filter(c => currentConditions.has(c));
      const weight = sharedConditions.length / Math.max(currentConditions.size, p.conditions.length);
      
      return {
        pathogen: p.name,
        similarity: { total: weight, factors: { sharedConditions: weight } },
        weight: weight,
        reasoning: `Treats similar conditions (${sharedConditions.length} shared)`
      };
    })
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);
  
  recommendations.push(...conditionBasedRecommendations);
  
  // Avoid recently viewed unless specifically requested
  if (!preferences.includeRecentlyViewed) {
    return recommendations.filter(r => !recentlyViewed.includes(r.pathogen));
  }
  
  return recommendations.slice(0, 8); // Limit to top 8 recommendations
};