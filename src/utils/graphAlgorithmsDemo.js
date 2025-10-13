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

import cytoscape from 'cytoscape';
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
 * Initialize Cytoscape instance with pathogen relationship data
 */
export function initializePathogenNetwork() {
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
export function demonstrateHubPathogenIdentification() {
  const cy = initializePathogenNetwork();
  const hubs = identifyHubPathogens(cy, 0.6);

  console.log('🎯 HUB PATHOGENS - Board Prep Focus');
  console.log('=====================================');
  hubs.forEach((hub, index) => {
    console.log(`\n${index + 1}. ${hub.label}`);
    console.log(`   Connections: ${hub.connections}`);
    console.log(`   Centrality Score: ${hub.centralityScore.toFixed(3)}`);
    console.log(`   Clinical Significance: ${hub.clinicalSignificance}`);
    console.log(`   Board Prep Insight: ${hub.boardPrepInsight}`);
  });

  return hubs;
}

/**
 * EXAMPLE 2: Analyze Resistance Clusters
 * Use Case: Risk stratification for antibiotic selection
 */
export function demonstrateResistanceAnalysis() {
  const cy = initializePathogenNetwork();
  const clusters = analyzeResistanceClusters(cy);

  console.log('\n🦠 RESISTANCE CLUSTER ANALYSIS');
  console.log('================================');
  clusters.forEach(cluster => {
    console.log(`\nCluster ${cluster.clusterId}: ${cluster.dominantGramStatus === 'positive' ? 'Gram-Positive' : 'Gram-Negative'}`);
    console.log(`   Size: ${cluster.size} pathogens`);
    console.log(`   Resistance Risk: ${cluster.resistanceRisk.toUpperCase()}`);
    console.log(`   Clinical Warning: ${cluster.clinicalWarning}`);
    console.log(`   Pathogens: ${cluster.pathogens.slice(0, 3).map(p => p.label).join(', ')}...`);
  });

  return clusters;
}

/**
 * EXAMPLE 3: Generate Treatment Decision Tree
 * Use Case: Systematic approach to empiric therapy
 */
export function demonstrateTreatmentDecisionTree(pathogenId) {
  const cy = initializePathogenNetwork();
  const tree = generateTreatmentDecisionTree(cy, pathogenId);

  console.log('\n📊 TREATMENT DECISION TREE');
  console.log('===========================');
  tree.forEach(node => {
    const indent = '  '.repeat(node.level);
    console.log(`${indent}Level ${node.level}: ${node.pathogen}`);
    console.log(`${indent}  └─ ${node.decisionPoint}`);
    console.log(`${indent}  └─ Gram ${node.gramStatus}, ${node.severity} severity`);
  });

  return tree;
}

/**
 * EXAMPLE 4: Generate Clinical Scenario
 * Use Case: Board prep case-based learning
 */
export function demonstrateClinicalScenario(pathogenId) {
  const cy = initializePathogenNetwork();
  const scenario = generateClinicalScenario(cy, pathogenId);

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

  return scenario;
}

/**
 * EXAMPLE 5: Find Resistance Evolution Path
 * Use Case: Understanding cross-resistance mechanisms
 */
export function demonstrateResistanceEvolution(sourceId, targetId) {
  const cy = initializePathogenNetwork();
  const path = findShortestPath(cy, sourceId, targetId);

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

  return path;
}

/**
 * EXAMPLE 6: Calculate Centrality Measures
 * Use Case: Understanding network importance of pathogens
 */
export function demonstrateCentralityAnalysis() {
  const cy = initializePathogenNetwork();

  console.log('\n📈 CENTRALITY ANALYSIS');
  console.log('======================');

  // Degree Centrality
  const degreeCentrality = calculateDegreeCentrality(cy);
  console.log('\nTop 5 by Degree Centrality (Most Connected):');
  degreeCentrality.slice(0, 5).forEach((node, index) => {
    console.log(`  ${index + 1}. ${node.label} - ${node.connections} connections (score: ${node.centralityScore.toFixed(3)})`);
  });

  // Betweenness Centrality
  const betweenness = calculateBetweennessCentrality(cy);
  console.log('\nTop 5 by Betweenness Centrality (Bridge Organisms):');
  betweenness.slice(0, 5).forEach((node, index) => {
    console.log(`  ${index + 1}. ${node.label} - betweenness: ${node.betweenness.toFixed(3)}`);
  });

  // Closeness Centrality
  const closeness = calculateClosenessCentrality(cy);
  console.log('\nTop 5 by Closeness Centrality (Overall Connectivity):');
  closeness.slice(0, 5).forEach((node, index) => {
    console.log(`  ${index + 1}. ${node.label} - closeness: ${node.closeness.toFixed(3)}`);
  });

  return { degreeCentrality, betweenness, closeness };
}

/**
 * EXAMPLE 7: Analyze Pathogen Neighborhood
 * Use Case: Local network analysis for specific organism
 */
export function demonstrateNeighborhoodAnalysis(pathogenId) {
  const cy = initializePathogenNetwork();
  const neighborhood = analyzeNodeNeighborhood(cy, pathogenId);

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

  return neighborhood;
}

/**
 * EXAMPLE 8: Network Statistics Overview
 * Use Case: Understanding overall pathogen network structure
 */
export function demonstrateNetworkStatistics() {
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

  return stats;
}

/**
 * COMPLETE DEMONSTRATION
 * Run all examples for comprehensive showcase
 */
export function runCompleteDemo() {
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
    demonstrateClinicalScenario(hubs[0].id);
  }

  // 6. Treatment Decision Tree (using first hub pathogen if available)
  if (hubs.length > 0) {
    demonstrateTreatmentDecisionTree(hubs[0].id);
  }

  // 7. Neighborhood Analysis (using first hub pathogen if available)
  if (hubs.length > 0) {
    demonstrateNeighborhoodAnalysis(hubs[0].id);
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
