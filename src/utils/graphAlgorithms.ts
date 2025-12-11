/**
 * Graph Algorithm Utilities for Antibiotic Learning App
 * Medical Education Insights using Cytoscape Graph Theory
 *
 * Purpose: Provide comprehensive graph analysis for pathogen relationship networks
 * Medical Use Cases:
 * - Hub pathogen identification for empiric therapy
 * - Resistance cluster analysis for board preparation
 * - Treatment decision trees for systematic antibiotic selection
 * - Clinical insight generation for evidence-based practice
 *
 * Created: 2025-10-12
 */

import cytoscape from 'cytoscape';

/**
 * Type definitions for graph algorithm utilities
 */

interface CentralityNode {
  id: string | number;
  label: string;
  centralityScore: number;
  connections?: number;
  gramStatus?: string;
  severity?: string;
  betweenness?: number;
  closeness?: number;
}

interface PathResult {
  distance: number;
  path: Array<{
    id: string | number;
    label: string;
    gramStatus?: string;
  }>;
  clinicalImplication: string;
}

interface ShortestPathInfo {
  target: string;
  distance: number;
  pathExists: boolean;
}

interface Cluster {
  clusterId: number;
  size: number;
  dominantGramStatus: 'positive' | 'negative';
  pathogens: Array<{
    id: string | number;
    label: string;
    gramStatus?: string;
    severity?: string;
  }>;
  resistanceProfile?: ResistanceProfile;
  resistanceRisk?: 'high' | 'medium' | 'low';
  clinicalWarning?: string;
  boardPrepTip?: string;
}

interface ResistanceProfile {
  high: number;
  medium: number;
  low: number;
}

interface MSTResult {
  edges: Array<{
    source: string;
    target: string;
    weight: number;
    relationshipType?: string;
  }>;
  totalWeight: number;
  coverage: string;
}

interface HubPathogen extends CentralityNode {
  hubRank: number;
  clinicalSignificance: string;
  treatmentImplication: string;
  boardPrepInsight: string;
}

interface TreeNode {
  level: number;
  pathogen: string;
  pathogenId: string | number;
  gramStatus?: string;
  severity?: string;
  resistance: string;
  parent: string | null;
  decisionPoint: string;
}

interface ClinicalScenario {
  primaryPathogen: string;
  gramStatus?: string;
  severity?: string;
  scenario: string;
  relatedConsiderations: Array<{
    organism: string;
    relationship?: string;
    significance?: string;
  }>;
  teachingPoints: string[];
  boardPrepQuestion: string;
}

interface NetworkStats {
  totalNodes: number;
  totalEdges: number;
  averageDegree: string;
  density: string;
  connectedComponents: number;
  gramDistribution: {
    positive: number;
    negative: number;
    ratio: string | number;
  };
  hubPathogens: number;
  clinicalInsight: string;
  boardPrepInsight: string;
}

interface NeighborhoodAnalysis {
  pathogen: string;
  directConnections: number;
  relationships: Array<{
    partner: string;
    type?: string;
    weight: number;
  }>;
  clinicalSignificance: string;
}

// ============================================================================
// CENTRALITY ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Calculate degree centrality for all nodes
 * Higher centrality = more connections = broader treatment implications
 *
 * Medical Use: Identify key pathogens requiring broad-spectrum coverage
 * Board Prep: Understanding which organisms are most interconnected
 *
 * @param cy - Cytoscape instance
 * @returns Sorted array of nodes with centrality scores
 */
export function calculateDegreeCentrality(cy: any): CentralityNode[] {
  const nodes = cy.nodes();
  const degrees: number[] = [];
  nodes.forEach((n: any) => degrees.push(n.degree()));
  const maxDegree = Math.max(...degrees, 1);

  const results: CentralityNode[] = [];
  nodes.forEach((node: any) => {
    results.push({
      id: node.id(),
      label: node.data('label'),
      centralityScore: maxDegree > 0 ? node.degree() / maxDegree : 0,
      connections: node.degree(),
      gramStatus: node.data('gramStatus'),
      severity: node.data('severity')
    });
  });

  return results.sort((a, b) => b.centralityScore - a.centralityScore);
}

/**
 * Calculate betweenness centrality
 * Identifies nodes that act as bridges between different parts of the network
 *
 * Medical Use: Identify pathogens that bridge multiple infection types
 * Clinical Significance: Important for understanding transmission pathways
 *
 * @param cy - Cytoscape instance
 * @returns Sorted array of nodes with betweenness scores
 */
export function calculateBetweennessCentrality(cy: any): CentralityNode[] {
  const centrality = cy.elements().betweennessCentrality({ directed: false });
  const results: CentralityNode[] = [];
  cy.nodes().forEach((node: any) => {
    results.push({
      id: node.id(),
      label: node.data('label'),
      betweenness: centrality.betweenness(node),
      gramStatus: node.data('gramStatus')
    });
  });
  return results.sort((a, b) => (b.betweenness || 0) - (a.betweenness || 0));
}

/**
 * Calculate closeness centrality
 * Measures how close a node is to all other nodes in the network
 *
 * Medical Use: Pathogens closely related to many others in treatment patterns
 * Board Prep: Understanding antibiotic spectrum relationships
 *
 * @param cy - Cytoscape instance
 * @returns Sorted array of nodes with closeness scores
 */
export function calculateClosenessCentrality(cy: any): CentralityNode[] {
  const results: CentralityNode[] = [];
  cy.nodes().forEach((node: any) => {
    try {
      const dijkstra = cy.elements().dijkstra(node, () => 1);
      let totalDistance = 0;
      let reachableNodes = 0;

      cy.nodes().forEach((target: any) => {
        if (target.id() !== node.id()) {
          const distance = dijkstra.distanceTo(target);
          if (distance !== Infinity && distance > 0) {
            totalDistance += distance;
            reachableNodes++;
          }
        }
      });

      const closeness = reachableNodes > 0 ? reachableNodes / totalDistance : 0;

      results.push({
        id: node.id(),
        label: node.data('label'),
        closeness: closeness,
        gramStatus: node.data('gramStatus')
      });
    } catch (error) {
      // Handle nodes in disconnected components
      results.push({
        id: node.id(),
        label: node.data('label'),
        closeness: 0,
        gramStatus: node.data('gramStatus')
      });
    }
  });
  return results.sort((a, b) => (b.closeness || 0) - (a.closeness || 0));
}

// ============================================================================
// SHORTEST PATH ALGORITHMS
// ============================================================================

/**
 * Find shortest path between two pathogens using Dijkstra's algorithm
 *
 * Medical Use: Identify minimum steps in resistance evolution
 * Clinical Application: Understanding cross-resistance patterns
 * Board Prep: Mechanism-based antibiotic selection
 *
 * @param cy - Cytoscape instance
 * @param sourceId - Source pathogen ID
 * @param targetId - Target pathogen ID
 * @returns Path object with distance and node sequence
 */
export function findShortestPath(cy: any, sourceId: string | number, targetId: string | number): PathResult | null {
  const source = cy.getElementById(sourceId);
  const target = cy.getElementById(targetId);

  if (!source.length || !target.length) return null;

  const dijkstra = cy.elements().dijkstra(source);
  const path = dijkstra.pathTo(target);

  return {
    distance: dijkstra.distanceTo(target),
    path: path.nodes().map((node: any) => ({
      id: node.id(),
      label: node.data('label'),
      gramStatus: node.data('gramStatus')
    })),
    clinicalImplication: `${path.nodes().length - 1} step(s) between organisms in resistance evolution`
  };
}

/**
 * Find all shortest paths from a given pathogen
 *
 * Medical Use: Comprehensive resistance pattern mapping
 *
 * @param cy - Cytoscape instance
 * @param sourceId - Source pathogen ID
 * @returns All shortest paths from source
 */
export function findAllShortestPaths(cy: any, sourceId: string | number): ShortestPathInfo[] {
  const source = cy.getElementById(sourceId);
  if (!source.length) return [];

  const dijkstra = cy.elements().dijkstra(source, () => 1);

  return cy.nodes().filter((node: any) => node.id() !== sourceId).map((target: any) => {
    const distance = dijkstra.distanceTo(target);
    return {
      target: target.data('label'),
      distance: distance,
      pathExists: distance !== Infinity
    };
  }).sort((a: ShortestPathInfo, b: ShortestPathInfo) => a.distance - b.distance);
}

// ============================================================================
// CLUSTERING ALGORITHMS
// ============================================================================

/**
 * Detect pathogen clusters based on connections
 * Uses connected components algorithm
 *
 * Medical Use: Group pathogens with similar resistance patterns
 * Board Prep: Pattern recognition for systematic antibiotic selection
 *
 * @param cy - Cytoscape instance
 * @returns Array of clusters with member pathogens
 */
export function detectCommunities(cy: any): Cluster[] {
  const components = cy.elements().components();

  return components.map((component: any, index: number) => {
    const nodes = component.nodes();
    const gramPositive = nodes.filter((n: any) => n.data('gramStatus') === 'positive').length;
    const gramNegative = nodes.filter((n: any) => n.data('gramStatus') === 'negative').length;

    return {
      clusterId: index + 1,
      size: nodes.length,
      dominantGramStatus: gramPositive > gramNegative ? 'positive' : 'negative',
      pathogens: nodes.map((node: any) => ({
        id: node.id(),
        label: node.data('label'),
        gramStatus: node.data('gramStatus'),
        severity: node.data('severity')
      }))
    };
  });
}

// ============================================================================
// MINIMUM SPANNING TREE
// ============================================================================

/**
 * Calculate minimum spanning tree using Kruskal's algorithm
 *
 * Medical Use: Identify minimum antibiotic set for comprehensive coverage
 * Clinical Application: Optimal empiric therapy selection
 *
 * @param cy - Cytoscape instance
 * @returns MST edges and total weight
 */
export function calculateMinimumSpanningTree(cy: any): MSTResult {
  const mst = cy.elements().kruskal();

  return {
    edges: mst.edges().map((edge: any) => ({
      source: edge.source().data('label'),
      target: edge.target().data('label'),
      weight: edge.data('weight') || 1,
      relationshipType: edge.data('relationshipType')
    })),
    totalWeight: mst.edges().reduce((sum: number, edge: any) =>
      sum + (edge.data('weight') || 1), 0
    ),
    coverage: `${mst.nodes().length} pathogens covered with ${mst.edges().length} antibiotic relationships`
  };
}

// ============================================================================
// CLINICAL INSIGHT GENERATION
// ============================================================================

/**
 * Identify hub pathogens requiring broad-spectrum therapy
 *
 * Medical Education: Teaching systematic antibiotic selection
 * Clinical Decision Support: Empiric therapy recommendations
 *
 * @param cy - Cytoscape instance
 * @param threshold - Centrality threshold (0-1)
 * @returns Hub pathogens with clinical recommendations
 */
export function identifyHubPathogens(cy: any, threshold: number = 0.5): HubPathogen[] {
  const centrality = calculateDegreeCentrality(cy);
  const maxScore = centrality[0]?.centralityScore || 1;

  return centrality
    .filter(node => node.centralityScore >= threshold * maxScore)
    .map(node => ({
      ...node,
      hubRank: centrality.findIndex(n => n.id === node.id) + 1,
      clinicalSignificance: 'High-connectivity pathogen - broad-spectrum coverage required',
      treatmentImplication: `Consider empiric therapy covering this pathogen (${node.connections} connections)`,
      boardPrepInsight: 'Key organism for pattern recognition in antibiotic selection'
    }));
}

/**
 * Analyze resistance patterns across pathogen clusters
 *
 * Medical Education: Pattern recognition for board preparation
 * Clinical Application: Risk stratification for antibiotic selection
 *
 * @param cy - Cytoscape instance
 * @returns Clusters with resistance analysis
 */
export function analyzeResistanceClusters(cy: any): Cluster[] {
  const clusters = detectCommunities(cy);

  return clusters.map(cluster => {
    const resistancePatterns = cluster.pathogens.map(p =>
      cy.getElementById(p.id).data('resistance') || 'unknown'
    );

    const highResistance = resistancePatterns.filter((r: string) => r === 'high').length;
    const mediumResistance = resistancePatterns.filter((r: string) => r === 'medium').length;
    const clusterRisk = highResistance / cluster.size;

    return {
      ...cluster,
      resistanceProfile: {
        high: highResistance,
        medium: mediumResistance,
        low: cluster.size - highResistance - mediumResistance
      },
      resistanceRisk: clusterRisk >= 0.5 ? 'high' :
                      clusterRisk >= 0.25 ? 'medium' : 'low',
      clinicalWarning: clusterRisk >= 0.5 ?
        'High resistance cluster - consider culture-guided therapy and infectious disease consultation' :
        clusterRisk >= 0.25 ?
        'Moderate resistance - consider local antibiogram and patient risk factors' :
        'Standard empiric therapy appropriate with clinical monitoring',
      boardPrepTip: `${cluster.dominantGramStatus === 'positive' ? 'Gram-positive' : 'Gram-negative'} cluster with ${cluster.size} organisms`
    };
  });
}

// ============================================================================
// BOARD PREPARATION TOOLS
// ============================================================================

/**
 * Generate treatment decision tree from network using BFS
 *
 * Medical Education: Systematic approach to empiric therapy
 * Board Prep: Decision-making algorithms for exam questions
 *
 * @param cy - Cytoscape instance
 * @param startPathogenId - Starting pathogen for tree
 * @returns Hierarchical treatment decision tree
 */
export function generateTreatmentDecisionTree(cy: any, startPathogenId: string | number): TreeNode[] {
  const startNode = cy.getElementById(startPathogenId);

  if (!startNode.length) return [];

  const visited = new Set<string | number>();
  const tree: TreeNode[] = [];
  const queue: Array<{ node: any; level: number; parent: string | null }> = [{ node: startNode, level: 0, parent: null }];

  while (queue.length > 0) {
    const { node, level, parent } = queue.shift()!;

    if (visited.has(node.id())) continue;
    visited.add(node.id());

    tree.push({
      level,
      pathogen: node.data('label'),
      pathogenId: node.id(),
      gramStatus: node.data('gramStatus'),
      severity: node.data('severity'),
      resistance: node.data('resistance') || 'unknown',
      parent: parent,
      decisionPoint: level === 0 ? 'Initial Empiric Selection' :
                     level === 1 ? 'Consider Cross-Resistance' :
                     level === 2 ? 'Culture-Guided Adjustment' :
                     'Specialized Consultation'
    });

    // Add connected nodes at next level
    node.connectedEdges().forEach((edge: any) => {
      const nextNode = edge.target().id() === node.id() ?
        edge.source() : edge.target();
      if (!visited.has(nextNode.id())) {
        queue.push({
          node: nextNode,
          level: level + 1,
          parent: node.data('label')
        });
      }
    });
  }

  return tree;
}

/**
 * Generate clinical scenarios for board preparation
 *
 * Medical Education: Case-based learning for antibiotic selection
 *
 * @param cy - Cytoscape instance
 * @param pathogenId - Pathogen to generate scenario for
 * @returns Clinical scenario with teaching points
 */
export function generateClinicalScenario(cy: any, pathogenId: string | number): ClinicalScenario | null {
  const node = cy.getElementById(pathogenId);
  if (!node.length) return null;

  const connections = node.connectedEdges();
  const relatedPathogens = connections.map((edge: any) => {
    const related = edge.target().id() === pathogenId ?
      edge.source() : edge.target();
    return {
      organism: related.data('label'),
      relationship: edge.data('relationshipType'),
      significance: edge.data('clinicalSignificance')
    };
  });

  return {
    primaryPathogen: node.data('label'),
    gramStatus: node.data('gramStatus'),
    severity: node.data('severity'),
    scenario: `Patient presents with suspected ${node.data('label')} infection`,
    relatedConsiderations: relatedPathogens.slice(0, 3),
    teachingPoints: [
      `${node.data('gramStatus') === 'positive' ? 'Gram-positive' : 'Gram-negative'} coverage required`,
      `${connections.length} related organisms in differential`,
      `Severity classification: ${node.data('severity') || 'variable'}`
    ],
    boardPrepQuestion: `What empiric antibiotic would you choose for suspected ${node.data('label')} based on local resistance patterns?`
  };
}

// ============================================================================
// NETWORK STATISTICS
// ============================================================================

/**
 * Calculate comprehensive network statistics
 *
 * Medical Education: Understanding pathogen relationships at scale
 * Performance Metrics: Network complexity for optimization
 *
 * @param cy - Cytoscape instance
 * @returns Comprehensive network statistics
 */
export function calculateNetworkStatistics(cy: any): NetworkStats {
  const nodes = cy.nodes();
  const edges = cy.edges();
  const n = nodes.length;

  // Calculate average degree
  const totalDegree = nodes.reduce((sum: number, node: any) => sum + node.degree(), 0);
  const avgDegree = n > 0 ? totalDegree / n : 0;

  // Calculate density (actual edges / possible edges)
  const possibleEdges = (n * (n - 1)) / 2;
  const density = possibleEdges > 0 ? edges.length / possibleEdges : 0;

  // Count gram status distribution
  const gramPositive = nodes.filter((n: any) => n.data('gramStatus') === 'positive').length;
  const gramNegative = nodes.filter((n: any) => n.data('gramStatus') === 'negative').length;

  // Identify hub pathogens
  const hubs = identifyHubPathogens(cy, 0.6);

  return {
    totalNodes: n,
    totalEdges: edges.length,
    averageDegree: avgDegree.toFixed(2),
    density: (density * 100).toFixed(2) + '%',
    connectedComponents: cy.elements().components().length,
    gramDistribution: {
      positive: gramPositive,
      negative: gramNegative,
      ratio: gramPositive > 0 ? (gramNegative / gramPositive).toFixed(2) : 'N/A'
    },
    hubPathogens: hubs.length,
    clinicalInsight: `Network contains ${n} pathogens with ${edges.length} relationships (${(density * 100).toFixed(1)}% density)`,
    boardPrepInsight: `Focus on ${hubs.length} hub organisms for maximum coverage understanding`
  };
}

/**
 * Get node neighbors for local network analysis
 *
 * @param cy - Cytoscape instance
 * @param nodeId - Node to analyze
 * @returns Neighborhood analysis
 */
export function analyzeNodeNeighborhood(cy: any, nodeId: string | number): NeighborhoodAnalysis | null {
  const node = cy.getElementById(nodeId);
  if (!node.length) return null;

  const neighbors = node.neighborhood('node');
  const edges = node.connectedEdges();

  return {
    pathogen: node.data('label'),
    directConnections: neighbors.length,
    relationships: edges.map((edge: any) => ({
      partner: edge.target().id() === nodeId ?
        edge.source().data('label') : edge.target().data('label'),
      type: edge.data('relationshipType'),
      weight: edge.data('weight') || 1
    })),
    clinicalSignificance: `${neighbors.length} directly related organisms in treatment planning`
  };
}

// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================

export default {
  calculateDegreeCentrality,
  calculateBetweennessCentrality,
  calculateClosenessCentrality,
  findShortestPath,
  findAllShortestPaths,
  detectCommunities,
  calculateMinimumSpanningTree,
  identifyHubPathogens,
  analyzeResistanceClusters,
  generateTreatmentDecisionTree,
  generateClinicalScenario,
  calculateNetworkStatistics,
  analyzeNodeNeighborhood
};
