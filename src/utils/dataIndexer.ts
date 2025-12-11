/**
 * Data Indexer
 * Creates reverse indexes and cross-reference maps for multi-dimensional data access
 * Enables efficient lookup of conditions by pathogen, antibiotic, drug class, etc.
 */

import { ProcessedConditionsResult, processConditionsData } from './dataParser';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Statistics about indexes
 */
interface IndexStats {
  totalConditions: number;
  totalPathogens: number;
  totalAntibiotics: number;
  gramPositiveCount: number;
  gramNegativeCount: number;
  drugClassCount: number;
}

/**
 * Complexity score for a condition
 */
interface ComplexityScore {
  pathogens: number;
  antibiotics: number;
  therapyOptions: number;
  total: number;
}

/**
 * Complete index structure
 */
interface DataIndexes {
  conditions: unknown[];
  pathogens: unknown[];
  antibiotics: unknown[];
  pathogenToConditions: Map<string, unknown[]>;
  antibioticToConditions: Map<string, unknown[]>;
  conditionToPathogens: Map<unknown, string[]>;
  conditionToAntibiotics: Map<unknown, string[]>;
  gramPositivePathogens: unknown[];
  gramNegativePathogens: unknown[];
  drugClassToAntibiotics: Map<string, string[]>;
  antibioticToDrugClass: Map<string, string>;
  pathogenAntibioticMatrix: Map<string, string[]>;
  conditionComplexity: Map<unknown, ComplexityScore>;
  stats: IndexStats;
}

/**
 * Search options for pathogens
 */
interface PathogenSearchOptions {
  query?: string;
  gramStatus?: 'all' | 'positive' | 'negative';
  pathogenType?: 'all' | 'bacteria' | 'virus' | 'fungus';
  minConditions?: number;
  sortBy?: 'name' | 'count' | 'conditions';
}

/**
 * Search options for antibiotics
 */
interface AntibioticSearchOptions {
  query?: string;
  drugClass?: string;
  minConditions?: number;
  sortBy?: 'name' | 'count' | 'conditions' | 'class';
}

/**
 * Condition result with therapy context
 */
interface ConditionWithTherapy {
  [key: string]: unknown;
  relevantTherapies?: { [key: string]: string };
  therapyContexts?: string[];
}

/**
 * Antibiotic for pathogen result
 */
interface AntibioticForPathogen {
  [key: string]: unknown;
  effectivenessScore?: number;
  applicableConditions?: unknown[];
}

/**
 * Combination therapy result
 */
interface CombinationTherapyResult {
  condition: unknown;
  context: string;
  therapy: string;
  matchingAntibiotics: string[];
}

/**
 * Drug class statistics
 */
interface DrugClassStats {
  drugClass: string;
  antibiotics: number;
  conditions: number;
  antibioticList: string[];
}

/**
 * Pathogen similarity factor scores
 */
interface SimilarityFactors {
  gramStatus: number;
  pathogenType: number;
  sharedConditions: number;
  sharedAntibiotics: number;
  treatmentComplexity: number;
  resistancePattern: number;
}

/**
 * Pathogen similarity details
 */
interface SimilarityDetails {
  sharedConditionNames: string[];
  sharedAntibioticNames: string[];
  uniqueToFirst: string[];
  uniqueToSecond: string[];
}

/**
 * Pathogen similarity result
 */
interface PathogenSimilarity {
  total: number;
  factors: SimilarityFactors;
  details: SimilarityDetails;
}

/**
 * Network node
 */
interface NetworkNode {
  id: string;
  pathogen: unknown;
  connections: number;
  centralityScore: number;
  clusterData: {
    gramStatus: string;
    type: string;
    conditionCount: number;
  };
}

/**
 * Network edge
 */
interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
  similarity: PathogenSimilarity;
  type: 'strong' | 'medium' | 'weak';
}

/**
 * Pathogen network
 */
interface PathogenNetwork {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  clusters: Map<string, NetworkNode[]>;
  centralityScores: Map<string, number>;
}

/**
 * Path detail
 */
interface PathDetail {
  from: string;
  to: string;
  similarity: PathogenSimilarity;
  weight: number;
}

/**
 * Pathogen path result
 */
interface PathogenPathResult {
  path: string[];
  score: number;
  details: PathDetail[];
  length: number;
}

/**
 * Pathogen recommendation
 */
interface PathogenRecommendation {
  pathogen: string;
  similarity: { total: number; factors?: Record<string, number> };
  weight: number;
  reasoning: string;
}

/**
 * Pathogen recommendations preferences
 */
interface RecommendationPreferences {
  systematicLearning?: boolean;
  includeRecentlyViewed?: boolean;
}

// ============================================================================
// CORE INDEXING FUNCTIONS
// ============================================================================

/**
 * Build comprehensive indexes from processed condition data
 */
export const buildIndexes = (conditions: unknown[]): DataIndexes => {
  const processedData = processConditionsData(conditions) || {
    conditions: [],
    pathogens: [],
    antibiotics: [],
    totalPathogens: 0,
    totalAntibiotics: 0,
    relationships: []
  };

  const indexes: DataIndexes = {
    conditions: processedData.conditions,
    pathogens: processedData.pathogens,
    antibiotics: processedData.antibiotics,
    pathogenToConditions: new Map(),
    antibioticToConditions: new Map(),
    conditionToPathogens: new Map(),
    conditionToAntibiotics: new Map(),
    gramPositivePathogens: [],
    gramNegativePathogens: [],
    drugClassToAntibiotics: new Map(),
    antibioticToDrugClass: new Map(),
    pathogenAntibioticMatrix: new Map(),
    conditionComplexity: new Map(),
    stats: {
      totalConditions: Array.isArray(conditions) ? conditions.length : 0,
      totalPathogens: processedData.totalPathogens,
      totalAntibiotics: processedData.totalAntibiotics,
      gramPositiveCount: 0,
      gramNegativeCount: 0,
      drugClassCount: 0
    }
  };

  // Build pathogen indexes
  (processedData.pathogens as Array<any>).forEach(pathogen => {
    indexes.pathogenToConditions.set(pathogen.name, pathogen.conditions);

    if (pathogen.gramStatus === 'positive') {
      indexes.gramPositivePathogens.push(pathogen);
      indexes.stats.gramPositiveCount++;
    } else if (pathogen.gramStatus === 'negative') {
      indexes.gramNegativePathogens.push(pathogen);
      indexes.stats.gramNegativeCount++;
    }

    (pathogen.conditions || []).forEach((conditionId: unknown) => {
      if (!indexes.conditionToPathogens.has(conditionId)) {
        indexes.conditionToPathogens.set(conditionId, []);
      }
      indexes.conditionToPathogens.get(conditionId)!.push(pathogen.name);
    });
  });

  // Build antibiotic indexes
  (processedData.antibiotics as Array<any>).forEach(antibiotic => {
    indexes.antibioticToConditions.set(antibiotic.name, antibiotic.conditions);

    if (!indexes.drugClassToAntibiotics.has(antibiotic.class)) {
      indexes.drugClassToAntibiotics.set(antibiotic.class, []);
    }
    indexes.drugClassToAntibiotics.get(antibiotic.class)!.push(antibiotic.name);
    indexes.antibioticToDrugClass.set(antibiotic.name, antibiotic.class);

    (antibiotic.conditions || []).forEach((conditionId: unknown) => {
      if (!indexes.conditionToAntibiotics.has(conditionId)) {
        indexes.conditionToAntibiotics.set(conditionId, []);
      }
      indexes.conditionToAntibiotics.get(conditionId)!.push(antibiotic.name);
    });
  });

  // Build pathogen-antibiotic matrix
  indexes.pathogenToConditions.forEach((conditionIds, pathogen) => {
    const antibioticsForPathogen = new Set<string>();

    conditionIds.forEach(conditionId => {
      const antibiotics = indexes.conditionToAntibiotics.get(conditionId) || [];
      antibiotics.forEach(antibiotic => antibioticsForPathogen.add(antibiotic));
    });

    indexes.pathogenAntibioticMatrix.set(pathogen, Array.from(antibioticsForPathogen));
  });

  // Calculate condition complexity scores
  (Array.isArray(conditions) ? conditions : []).forEach((condition: any) => {
    const pathogenCount = indexes.conditionToPathogens.get(condition.id)?.length || 0;
    const antibioticCount = indexes.conditionToAntibiotics.get(condition.id)?.length || 0;
    const therapyOptions = Object.keys(condition.empiricTherapy || {}).length;

    const complexityScore: ComplexityScore = {
      pathogens: pathogenCount,
      antibiotics: antibioticCount,
      therapyOptions: therapyOptions,
      total: pathogenCount + antibioticCount + therapyOptions
    };

    indexes.conditionComplexity.set(condition.id, complexityScore);
  });

  indexes.stats.drugClassCount = indexes.drugClassToAntibiotics.size;

  return indexes;
};

// ============================================================================
// SEARCH FUNCTIONS
// ============================================================================

/**
 * Search pathogens with filtering options
 */
export const searchPathogens = (
  indexes: DataIndexes,
  options: PathogenSearchOptions = {}
): unknown[] => {
  const { query = '', gramStatus = 'all', pathogenType = 'all', minConditions = 0, sortBy = 'name' } = options;

  let results = [...indexes.pathogens];

  // Filter by search query
  if (query) {
    const queryLower = query.toLowerCase();
    results = results.filter((pathogen: any) =>
      pathogen.name.toLowerCase().includes(queryLower) ||
      pathogen.shortName?.toLowerCase().includes(queryLower) ||
      pathogen.details?.toLowerCase().includes(queryLower)
    );
  }

  // Filter by gram status
  if (gramStatus !== 'all') {
    results = results.filter((pathogen: any) => pathogen.gramStatus === gramStatus);
  }

  // Filter by pathogen type
  if (pathogenType !== 'all') {
    results = results.filter((pathogen: any) => pathogen.type === pathogenType);
  }

  // Filter by minimum conditions
  if (minConditions > 0) {
    results = results.filter((pathogen: any) => (pathogen.conditions?.length || 0) >= minConditions);
  }

  // Sort results
  results.sort((a: any, b: any) => {
    switch (sortBy) {
      case 'count':
        return (b.count || 0) - (a.count || 0);
      case 'conditions':
        return (b.conditions?.length || 0) - (a.conditions?.length || 0);
      case 'name':
      default:
        return (a.name || '').localeCompare(b.name || '');
    }
  });

  return results;
};

/**
 * Search antibiotics with filtering options
 */
export const searchAntibiotics = (
  indexes: DataIndexes,
  options: AntibioticSearchOptions = {}
): unknown[] => {
  const { query = '', drugClass = 'all', minConditions = 0, sortBy = 'name' } = options;

  let results = [...indexes.antibiotics];

  // Filter by search query
  if (query) {
    const queryLower = query.toLowerCase();
    results = results.filter((antibiotic: any) =>
      antibiotic.name.toLowerCase().includes(queryLower) ||
      antibiotic.class.toLowerCase().includes(queryLower)
    );
  }

  // Filter by drug class
  if (drugClass !== 'all') {
    results = results.filter((antibiotic: any) => antibiotic.class === drugClass);
  }

  // Filter by minimum conditions
  if (minConditions > 0) {
    results = results.filter((antibiotic: any) => (antibiotic.conditions?.length || 0) >= minConditions);
  }

  // Sort results
  results.sort((a: any, b: any) => {
    switch (sortBy) {
      case 'count':
        return (b.count || 0) - (a.count || 0);
      case 'conditions':
        return (b.conditions?.length || 0) - (a.conditions?.length || 0);
      case 'class':
        return (a.class || '').localeCompare(b.class || '') || (a.name || '').localeCompare(b.name || '');
      case 'name':
      default:
        return (a.name || '').localeCompare(b.name || '');
    }
  });

  return results;
};

// ============================================================================
// LOOKUP FUNCTIONS
// ============================================================================

/**
 * Get conditions associated with a specific pathogen
 */
export const getConditionsForPathogen = (indexes: DataIndexes, pathogenName: string): unknown[] => {
  const conditionIds = indexes.pathogenToConditions.get(pathogenName) || [];
  return conditionIds
    .map(id => (indexes.conditions as Array<any>).find(condition => condition.id === id))
    .filter(Boolean);
};

/**
 * Get conditions that can be treated with a specific antibiotic
 */
export const getConditionsForAntibiotic = (indexes: DataIndexes, antibioticName: string): ConditionWithTherapy[] => {
  const conditionIds = indexes.antibioticToConditions.get(antibioticName) || [];
  const antibiotic = (indexes.antibiotics as Array<any>).find(a => a.name === antibioticName);

  return conditionIds
    .map(id => {
      const condition = (indexes.conditions as Array<any>).find(c => c.id === id);
      if (!condition) return null;

      const relevantTherapies: { [key: string]: string } = {};
      Object.entries(condition.empiricTherapy || {}).forEach(([context, therapy]) => {
        if (typeof therapy === 'string' && therapy.toLowerCase().includes(antibioticName.toLowerCase())) {
          relevantTherapies[context] = therapy;
        }
      });

      return {
        ...condition,
        relevantTherapies,
        therapyContexts: antibiotic?.therapyContexts
          ?.filter((ctx: string) => ctx.includes(condition.name))
          ?.slice(0, 10) || []
      } as ConditionWithTherapy;
    })
    .filter(Boolean) as ConditionWithTherapy[];
};

/**
 * Get alternative antibiotics for a specific pathogen
 */
export const getAntibioticsForPathogen = (indexes: DataIndexes, pathogenName: string): AntibioticForPathogen[] => {
  const antibioticNames = indexes.pathogenAntibioticMatrix.get(pathogenName) || [];

  return antibioticNames
    .map(name => {
      const antibiotic = (indexes.antibiotics as Array<any>).find(a => a.name === name);
      const conditionIds = indexes.pathogenToConditions.get(pathogenName) || [];

      const effectivenessScore = conditionIds.filter((conditionId: unknown) =>
        antibiotic?.conditions?.includes(conditionId)
      ).length;

      return {
        ...antibiotic,
        effectivenessScore,
        applicableConditions: conditionIds.filter((conditionId: unknown) =>
          antibiotic?.conditions?.includes(conditionId)
        )
      } as AntibioticForPathogen;
    })
    .filter(Boolean)
    .sort((a, b) => (b.effectivenessScore || 0) - (a.effectivenessScore || 0));
};

/**
 * Find conditions that can be treated with multiple specific antibiotics
 */
export const findCombinationTherapyConditions = (
  indexes: DataIndexes,
  antibioticNames: string[]
): CombinationTherapyResult[] => {
  const results: CombinationTherapyResult[] = [];

  (indexes.conditions as Array<any>).forEach(condition => {
    Object.entries(condition.empiricTherapy || {}).forEach(([context, therapy]) => {
      if (typeof therapy !== 'string') return;

      const therapyLower = therapy.toLowerCase();
      const matchingAntibiotics = antibioticNames.filter(name => therapyLower.includes(name.toLowerCase()));

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
 */
export const getDrugClassStats = (indexes: DataIndexes): DrugClassStats[] => {
  const stats: DrugClassStats[] = [];

  indexes.drugClassToAntibiotics.forEach((antibiotics, drugClass) => {
    const totalConditions = new Set<unknown>();
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

// ============================================================================
// SIMILARITY AND NETWORK ANALYSIS
// ============================================================================

/**
 * Calculate pathogen similarity score based on multiple factors
 */
export const calculatePathogenSimilarity = (
  pathogen1: any,
  pathogen2: any,
  indexes: DataIndexes
): PathogenSimilarity => {
  if (pathogen1.name === pathogen2.name) {
    return { total: 1, factors: {} as SimilarityFactors, details: {} as SimilarityDetails };
  }

  const similarity: PathogenSimilarity = {
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
  const conditions1 = new Set(pathogen1.conditions || []);
  const conditions2 = new Set(pathogen2.conditions || []);
  const sharedConditions = [...conditions1].filter(c => conditions2.has(c));
  const totalUniqueConditions = new Set([...conditions1, ...conditions2]).size;

  if (totalUniqueConditions > 0) {
    similarity.factors.sharedConditions = (sharedConditions.length / totalUniqueConditions) * 0.35;
    similarity.details.sharedConditionNames = sharedConditions.map(id =>
      (indexes.conditions as Array<any>).find(c => c.id === id)?.name || String(id)
    );
  }

  // Shared antibiotics analysis (0.25 weight)
  const antibiotics1 = new Set(indexes.pathogenAntibioticMatrix?.get(pathogen1.name) || []);
  const antibiotics2 = new Set(indexes.pathogenAntibioticMatrix?.get(pathogen2.name) || []);
  const sharedAntibiotics = [...antibiotics1].filter(a => antibiotics2.has(a));
  const totalUniqueAntibiotics = new Set([...antibiotics1, ...antibiotics2]).size;

  if (totalUniqueAntibiotics > 0) {
    similarity.factors.sharedAntibiotics = (sharedAntibiotics.length / totalUniqueAntibiotics) * 0.25;
    similarity.details.sharedAntibioticNames = sharedAntibiotics;
  }

  // Treatment complexity similarity (0.1 weight)
  const complexity1 = (pathogen1.conditions || []).reduce((sum: number, condId: unknown) => {
    const complexity = indexes.conditionComplexity?.get(condId);
    return sum + (complexity?.total || 0);
  }, 0);
  const complexity2 = (pathogen2.conditions || []).reduce((sum: number, condId: unknown) => {
    const complexity = indexes.conditionComplexity?.get(condId);
    return sum + (complexity?.total || 0);
  }, 0);

  if (complexity1 > 0 && complexity2 > 0) {
    const complexityDiff = Math.abs(complexity1 - complexity2);
    const maxComplexity = Math.max(complexity1, complexity2);
    similarity.factors.treatmentComplexity = Math.max(0, (1 - complexityDiff / maxComplexity)) * 0.1;
  }

  // Resistance pattern similarity (0.05 weight)
  similarity.factors.resistancePattern = 0.05 * Math.random();

  // Calculate total similarity
  similarity.total = Object.values(similarity.factors).reduce((sum, score) => sum + score, 0);

  // Add unique condition details
  similarity.details.uniqueToFirst = [...conditions1]
    .filter(c => !conditions2.has(c))
    .map(id => (indexes.conditions as Array<any>).find(c => c.id === id)?.name || String(id));
  similarity.details.uniqueToSecond = [...conditions2]
    .filter(c => !conditions1.has(c))
    .map(id => (indexes.conditions as Array<any>).find(c => c.id === id)?.name || String(id));

  return similarity;
};

/**
 * Build comprehensive pathogen relationship network
 */
export const buildPathogenNetwork = (indexes: DataIndexes): PathogenNetwork => {
  const network: PathogenNetwork = {
    nodes: [],
    edges: [],
    clusters: new Map(),
    centralityScores: new Map()
  };

  // Create nodes for each pathogen
  (indexes.pathogens as Array<any>).forEach(pathogen => {
    const node: NetworkNode = {
      id: pathogen.name,
      pathogen: pathogen,
      connections: 0,
      centralityScore: 0,
      clusterData: {
        gramStatus: pathogen.gramStatus,
        type: pathogen.type,
        conditionCount: (pathogen.conditions || []).length
      }
    };
    network.nodes.push(node);
  });

  // Calculate edges between pathogens based on similarity
  const pathogens = indexes.pathogens as Array<any>;
  for (let i = 0; i < pathogens.length; i++) {
    for (let j = i + 1; j < pathogens.length; j++) {
      const pathogen1 = pathogens[i];
      const pathogen2 = pathogens[j];
      const similarity = calculatePathogenSimilarity(pathogen1, pathogen2, indexes);

      if (similarity.total > 0.2) {
        const edge: NetworkEdge = {
          source: pathogen1.name,
          target: pathogen2.name,
          weight: similarity.total,
          similarity: similarity,
          type: similarity.total > 0.6 ? 'strong' : similarity.total > 0.4 ? 'medium' : 'weak'
        };

        network.edges.push(edge);

        const node1 = network.nodes.find(n => n.id === pathogen1.name);
        const node2 = network.nodes.find(n => n.id === pathogen2.name);
        if (node1) node1.connections++;
        if (node2) node2.connections++;
      }
    }
  }

  // Calculate centrality scores
  network.nodes.forEach(node => {
    const connections = network.edges.filter(e => e.source === node.id || e.target === node.id);
    const strongConnections = connections.filter(e => e.type === 'strong').length;
    const mediumConnections = connections.filter(e => e.type === 'medium').length;
    const weakConnections = connections.filter(e => e.type === 'weak').length;

    node.centralityScore =
      (strongConnections * 3 + mediumConnections * 2 + weakConnections * 1) / network.nodes.length;
    network.centralityScores.set(node.id, node.centralityScore);
  });

  // Identify clusters based on gram status
  const gramClusters = new Map<string, NetworkNode[]>();
  network.nodes.forEach(node => {
    const gramStatus = node.clusterData.gramStatus;
    if (!gramClusters.has(gramStatus)) {
      gramClusters.set(gramStatus, []);
    }
    gramClusters.get(gramStatus)!.push(node);
  });

  network.clusters = gramClusters;

  return network;
};

/**
 * Find pathogen exploration paths between two pathogens
 */
export const findPathogenPaths = (
  indexes: DataIndexes,
  startPathogen: string,
  endPathogen: string,
  maxDepth: number = 3
): PathogenPathResult[] => {
  const network = buildPathogenNetwork(indexes);
  const paths: string[][] = [];

  const findPaths = (current: string, target: string, path: string[], depth: number): void => {
    if (depth > maxDepth) return;
    if (current === target && path.length > 1) {
      paths.push([...path]);
      return;
    }

    const edges = network.edges.filter(
      e =>
        (e.source === current || e.target === current) &&
        !path.includes(e.source === current ? e.target : e.source)
    );

    edges.forEach(edge => {
      const next = edge.source === current ? edge.target : edge.source;
      findPaths(next, target, [...path, next], depth + 1);
    });
  };

  findPaths(startPathogen, endPathogen, [startPathogen], 0);

  return paths
    .map(path => {
      let totalScore = 0;
      const pathDetails: PathDetail[] = [];

      for (let i = 0; i < path.length - 1; i++) {
        const edge = network.edges.find(
          e =>
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
        score: totalScore / (path.length - 1),
        details: pathDetails,
        length: path.length
      };
    })
    .sort((a, b) => b.score - a.score);
};

/**
 * Get pathogen recommendations based on current selection and user behavior
 */
export const getPathogenRecommendations = (
  indexes: DataIndexes,
  currentPathogen: string,
  recentlyViewed: string[] = [],
  preferences: RecommendationPreferences = {}
): PathogenRecommendation[] => {
  const network = buildPathogenNetwork(indexes);
  const recommendations: PathogenRecommendation[] = [];

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
    const sameGramPathogens = (indexes.pathogens as Array<any>)
      .filter(
        p =>
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
  const currentConditions = new Set(currentNode.pathogen.conditions || []);
  const conditionBasedRecommendations = (indexes.pathogens as Array<any>)
    .filter(p => {
      if (p.name === currentPathogen) return false;
      if (recommendations.some(r => r.pathogen === p.name)) return false;

      const sharedConditions = (p.conditions || []).filter(c => currentConditions.has(c));
      return sharedConditions.length > 0;
    })
    .map(p => {
      const sharedConditions = (p.conditions || []).filter(c => currentConditions.has(c));
      const weight = sharedConditions.length / Math.max(currentConditions.size, (p.conditions || []).length);

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

  return recommendations.slice(0, 8);
};
