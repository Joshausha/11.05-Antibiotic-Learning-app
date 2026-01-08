/**
 * Graph Algorithms Demonstration
 * Shows how to use graph analysis utilities with PathogenRelationshipData
 *
 * Medical Education Use Cases:
 * - Board preparation teaching
 * - Clinical decision support
 * - Resistance pattern analysis
 * - Systematic antibiotic selection
 *
 * Created: 2025-10-12
 */

// import cytoscape, { Core } from 'cytoscape'; // Module not installed - using any type
type Core = any;
import PathogenRelationshipData from '../data/PathogenRelationshipData';
import {
  calculateDegreeCentrality,
  calculateBetweennessCentrality,
  calculateClosenessCentrality,
  findShortestPath,
  identifyHubPathogens,
  analyzeResistanceClusters,
  generateTreatmentDecisionTree,
  generateClinicalScenario,
  calculateNetworkStatistics,
  analyzeNodeNeighborhood
} from './graphAlgorithms';

/**
 * Type definitions for graph algorithms demo
 */

interface HubPathogen {
  id: string | number;
  label: string;
  connections?: number;
  centralityScore?: number;
  clinicalSignificance?: string;
  boardPrepInsight?: string;
  [key: string]: any;
}

interface ResistanceCluster {
  clusterId: number;
  size: number;
  dominantGramStatus: 'positive' | 'negative';
  resistanceRisk?: string;
  clinicalWarning?: string;
  pathogens: Array<{ label: string; [key: string]: any }>;
  [key: string]: any;
}

interface DecisionTreeNode {
  level: number;
  pathogen: string;
  decisionPoint: string;
  gramStatus?: string;
  severity?: string;
  [key: string]: any;
}

interface ClinicalScenario {
  scenario: string;
  gramStatus?: string;
  severity?: string;
  relatedConsiderations: Array<{
    organism: string;
    relationship?: string;
    [key: string]: any;
  }>;
  teachingPoints: string[];
  boardPrepQuestion: string;
  [key: string]: any;
}

interface ResistancePath {
  path: Array<{ label: string; gramStatus?: string; [key: string]: any }>;
  distance: number;
  clinicalImplication: string;
}

interface CentralityResult {
  label: string;
  connections?: number;
  centralityScore?: number;
  betweenness?: number;
  closeness?: number;
}

interface Neighborhood {
  pathogen: string;
  directConnections: number;
  relationships: Array<{
    partner: string;
    type?: string;
    weight: number;
  }>;
  clinicalSignificance: string;
}

interface NetworkStats {
  totalNodes: number;
  totalEdges: number;
  averageDegree: number | string;
  density: number | string;
  connectedComponents: number;
  hubPathogens: number;
  gramDistribution: {
    positive: number;
    negative: number;
    ratio: number | string;
  };
  clinicalInsight: string;
  boardPrepInsight: string;
  [key: string]: any;
}

interface CentralityResults {
  degreeCentrality: CentralityResult[];
  betweenness: CentralityResult[];
  closeness: CentralityResult[];
}

/**
 * Initialize Cytoscape instance with pathogen relationship data
 */
export function initializePathogenNetwork(): Core {
  // Cytoscape module not installed - return mock for type checking
  const cytoscape = (window as any).cytoscape || ((opts: any) => opts);
  return cytoscape({
    elements: PathogenRelationshipData,
    headless: true,
    styleEnabled: false
  });
}

/**
 * EXAMPLE 1: Identify Hub Pathogens for Board Prep
 * Use Case: Teaching systematic antibiotic selection
 */
export function demonstrateHubPathogenIdentification(): HubPathogen[] {
  const cy = initializePathogenNetwork();
  const hubs = identifyHubPathogens(cy, 0.6);

  console.log('🎯 HUB PATHOGENS - Board Prep Focus');
  console.log('=====================================');
  hubs.forEach((hub, index) => {
    console.log(`\n${index + 1}. ${hub.label}`);
    console.log(`   Connections: ${hub.connections}`);
    console.log(`   Centrality Score: ${hub.centralityScore?.toFixed(3) ?? 'N/A'}`);
    console.log(`   Clinical Significance: ${hub.clinicalSignificance}`);
    console.log(`   Board Prep Insight: ${hub.boardPrepInsight}`);
  });

  return hubs as any;
}

/**
 * EXAMPLE 2: Analyze Resistance Clusters
 * Use Case: Risk stratification for antibiotic selection
 */
export function demonstrateResistanceAnalysis(): ResistanceCluster[] {
  const cy = initializePathogenNetwork();
  const clusters = analyzeResistanceClusters(cy);

  console.log('\n🦠 RESISTANCE CLUSTER ANALYSIS');
  console.log('================================');
  clusters.forEach(cluster => {
    console.log(`\nCluster ${cluster.clusterId}: ${cluster.dominantGramStatus === 'positive' ? 'Gram-Positive' : 'Gram-Negative'}`);
    console.log(`   Size: ${cluster.size} pathogens`);
    console.log(`   Resistance Risk: ${cluster.resistanceRisk?.toUpperCase() ?? 'Unknown'}`);
    console.log(`   Clinical Warning: ${cluster.clinicalWarning}`);
    console.log(`   Pathogens: ${cluster.pathogens.slice(0, 3).map(p => p.label).join(', ')}...`);
  });

  return clusters as any;
}

/**
 * EXAMPLE 3: Generate Treatment Decision Tree
 * Use Case: Systematic approach to empiric therapy
 */
export function demonstrateTreatmentDecisionTree(pathogenId: string | null | undefined): DecisionTreeNode[] {
  const cy = initializePathogenNetwork();
  const tree = generateTreatmentDecisionTree(cy, pathogenId || '');

  console.log('\n📊 TREATMENT DECISION TREE');
  console.log('===========================');
  tree.forEach(node => {
    const indent = '  '.repeat(node.level);
    console.log(`${indent}Level ${node.level}: ${node.pathogen}`);
    console.log(`${indent}  └─ ${node.decisionPoint}`);
    console.log(`${indent}  └─ Gram ${node.gramStatus}, ${node.severity} severity`);
  });

  return tree as any;
}

/**
 * EXAMPLE 4: Generate Clinical Scenario
 * Use Case: Board prep case-based learning
 */
export function demonstrateClinicalScenario(pathogenId: string | null | undefined): ClinicalScenario | null {
  const cy = initializePathogenNetwork();
  const scenario = generateClinicalScenario(cy, pathogenId || '');

  if (!scenario) {
    console.log('❌ Pathogen not found');
    return null;
  }

  console.log('\n🏥 CLINICAL SCENARIO - Board Preparation');
  console.log('=========================================');
  console.log(`\nCase: ${scenario.scenario}`);
  console.log(`\nGram Status: ${scenario.gramStatus}`);
  console.log(`Severity: ${scenario.severity}`);

  console.log('\nRelated Considerations:');
  scenario.relatedConsiderations.forEach((rel, index) => {
    console.log(`  ${index + 1}. ${rel.organism}`);
    console.log(`     Relationship: ${rel.relationship}`);
  });

  console.log('\nTeaching Points:');
  scenario.teachingPoints.forEach((point, index) => {
    console.log(`  ${index + 1}. ${point}`);
  });

  console.log(`\nBoard Question: ${scenario.boardPrepQuestion}`);

  return scenario as any;
}

/**
 * EXAMPLE 5: Find Resistance Evolution Path
 * Use Case: Understanding cross-resistance mechanisms
 */
export function demonstrateResistanceEvolution(sourceId: string | null | undefined, targetId: string | null | undefined): ResistancePath | null {
  const cy = initializePathogenNetwork();
  const path = findShortestPath(cy, sourceId || '', targetId || '');

  if (!path) {
    console.log('❌ No path found between pathogens');
    return null;
  }

  console.log('\n🔬 RESISTANCE EVOLUTION PATH');
  console.log('=============================');
  console.log(`From: ${path.path[0].label}`);
  console.log(`To: ${path.path[path.path.length - 1].label}`);
  console.log(`Distance: ${path.distance} steps`);
  console.log(`\nPathway:`);
  path.path.forEach((node, index) => {
    if (index === 0) {
      console.log(`  ${node.label} (Gram ${node.gramStatus})`);
    } else {
      console.log(`    ↓`);
      console.log(`  ${node.label} (Gram ${node.gramStatus})`);
    }
  });
  console.log(`\n${path.clinicalImplication}`);

  return path as any;
}

/**
 * EXAMPLE 6: Calculate Centrality Measures
 * Use Case: Understanding network importance of pathogens
 */
export function demonstrateCentralityAnalysis(): CentralityResults {
  const cy = initializePathogenNetwork();

  console.log('\n📈 CENTRALITY ANALYSIS');
  console.log('======================');

  // Degree Centrality
  const degreeCentrality = calculateDegreeCentrality(cy);
  console.log('\nTop 5 by Degree Centrality (Most Connected):');
  degreeCentrality.slice(0, 5).forEach((node, index) => {
    console.log(`  ${index + 1}. ${node.label} - ${node.connections} connections (score: ${(node.centralityScore || 0).toFixed(3)})`);
  });

  // Betweenness Centrality
  const betweenness = calculateBetweennessCentrality(cy);
  console.log('\nTop 5 by Betweenness Centrality (Bridge Organisms):');
  betweenness.slice(0, 5).forEach((node, index) => {
    console.log(`  ${index + 1}. ${node.label} - betweenness: ${(node.betweenness || 0).toFixed(3)}`);
  });

  // Closeness Centrality
  const closeness = calculateClosenessCentrality(cy);
  console.log('\nTop 5 by Closeness Centrality (Overall Connectivity):');
  closeness.slice(0, 5).forEach((node, index) => {
    console.log(`  ${index + 1}. ${node.label} - closeness: ${(node.closeness || 0).toFixed(3)}`);
  });

  return { degreeCentrality, betweenness, closeness } as any;
}

/**
 * EXAMPLE 7: Analyze Pathogen Neighborhood
 * Use Case: Local network analysis for specific organism
 */
export function demonstrateNeighborhoodAnalysis(pathogenId: string | null | undefined): Neighborhood | null {
  const cy = initializePathogenNetwork();
  const neighborhood = analyzeNodeNeighborhood(cy, pathogenId || '');

  if (!neighborhood) {
    console.log('❌ Pathogen not found');
    return null;
  }

  console.log('\n🔍 NEIGHBORHOOD ANALYSIS');
  console.log('========================');
  console.log(`Pathogen: ${neighborhood.pathogen}`);
  console.log(`Direct Connections: ${neighborhood.directConnections}`);
  console.log(`\nRelated Organisms:`);
  neighborhood.relationships.forEach((rel, index) => {
    console.log(`  ${index + 1}. ${rel.partner}`);
    console.log(`     Type: ${rel.type}`);
    console.log(`     Weight: ${rel.weight}`);
  });
  console.log(`\n${neighborhood.clinicalSignificance}`);

  return neighborhood as any;
}

/**
 * EXAMPLE 8: Network Statistics Overview
 * Use Case: Understanding overall pathogen network structure
 */
export function demonstrateNetworkStatistics(): NetworkStats {
  const cy = initializePathogenNetwork();
  const stats = calculateNetworkStatistics(cy);

  console.log('\n📊 NETWORK STATISTICS');
  console.log('=====================');
  console.log(`Total Pathogens: ${stats.totalNodes}`);
  console.log(`Total Relationships: ${stats.totalEdges}`);
  console.log(`Average Degree: ${stats.averageDegree}`);
  console.log(`Network Density: ${stats.density}`);
  console.log(`Connected Components: ${stats.connectedComponents}`);
  console.log(`Hub Pathogens: ${stats.hubPathogens}`);
  console.log(`\nGram Distribution:`);
  console.log(`  Gram-Positive: ${stats.gramDistribution.positive}`);
  console.log(`  Gram-Negative: ${stats.gramDistribution.negative}`);
  console.log(`  Ratio (Neg/Pos): ${stats.gramDistribution.ratio}`);
  console.log(`\n${stats.clinicalInsight}`);
  console.log(`\nBoard Prep: ${stats.boardPrepInsight}`);

  return stats as any;
}

/**
 * COMPLETE DEMONSTRATION
 * Run all examples for comprehensive showcase
 */
export function runCompleteDemo(): void {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║  GRAPH ALGORITHMS FOR ANTIBIOTIC LEARNING                     ║');
  console.log('║  Medical Education & Board Preparation Tools                  ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  // 1. Network Overview
  demonstrateNetworkStatistics();

  // 2. Hub Pathogens
  const hubs = demonstrateHubPathogenIdentification();

  // 3. Resistance Clusters
  demonstrateResistanceAnalysis();

  // 4. Centrality Analysis
  demonstrateCentralityAnalysis();

  // 5. Clinical Scenario (using first hub pathogen if available)
  if (hubs.length > 0) {
    demonstrateClinicalScenario(String(hubs[0].id));
  }

  // 6. Treatment Decision Tree (using first hub pathogen if available)
  if (hubs.length > 0) {
    demonstrateTreatmentDecisionTree(String(hubs[0].id));
  }

  // 7. Neighborhood Analysis (using first hub pathogen if available)
  if (hubs.length > 0) {
    demonstrateNeighborhoodAnalysis(String(hubs[0].id));
  }

  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║  Demo Complete - All Graph Algorithms Demonstrated            ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
}

// Export all demo functions
export default {
  initializePathogenNetwork,
  demonstrateHubPathogenIdentification,
  demonstrateResistanceAnalysis,
  demonstrateTreatmentDecisionTree,
  demonstrateClinicalScenario,
  demonstrateResistanceEvolution,
  demonstrateCentralityAnalysis,
  demonstrateNeighborhoodAnalysis,
  demonstrateNetworkStatistics,
  runCompleteDemo
};
