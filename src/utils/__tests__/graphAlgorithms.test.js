/**
 * Graph Algorithms Test Suite
 * Validates medical education insights from pathogen relationship networks
 *
 * Created: 2025-10-12
 */

import cytoscape from 'cytoscape';
import {
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
} from '../graphAlgorithms';

// Mock pathogen data for testing
const mockElements = {
  nodes: [
    { data: { id: 'staph-aureus', label: 'Staphylococcus aureus', gramStatus: 'positive', severity: 'high', resistance: 'high' } },
    { data: { id: 'strep-pneumo', label: 'Streptococcus pneumoniae', gramStatus: 'positive', severity: 'high', resistance: 'medium' } },
    { data: { id: 'e-coli', label: 'Escherichia coli', gramStatus: 'negative', severity: 'high', resistance: 'medium' } },
    { data: { id: 'pseudomonas', label: 'Pseudomonas aeruginosa', gramStatus: 'negative', severity: 'high', resistance: 'high' } },
    { data: { id: 'klebsiella', label: 'Klebsiella pneumoniae', gramStatus: 'negative', severity: 'high', resistance: 'high' } }
  ],
  edges: [
    { data: { source: 'staph-aureus', target: 'strep-pneumo', weight: 1, relationshipType: 'cross-resistance' } },
    { data: { source: 'staph-aureus', target: 'e-coli', weight: 2, relationshipType: 'spectrum-coverage' } },
    { data: { source: 'e-coli', target: 'pseudomonas', weight: 1, relationshipType: 'cross-resistance' } },
    { data: { source: 'e-coli', target: 'klebsiella', weight: 1, relationshipType: 'cross-resistance' } },
    { data: { source: 'pseudomonas', target: 'klebsiella', weight: 1, relationshipType: 'treatment-similarity' } }
  ]
};

describe('Graph Algorithms - Centrality Analysis', () => {
  let cy;

  beforeEach(() => {
    cy = cytoscape({
      elements: mockElements,
      headless: true
    });
  });

  test('calculateDegreeCentrality returns sorted pathogen centrality', () => {
    const result = calculateDegreeCentrality(cy);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(5);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('label');
    expect(result[0]).toHaveProperty('centralityScore');
    expect(result[0]).toHaveProperty('connections');

    // E. coli should have highest centrality (3 connections)
    expect(result[0].id).toBe('e-coli');
    expect(result[0].connections).toBe(3);

    // Verify sorting (descending by centrality)
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].centralityScore).toBeGreaterThanOrEqual(result[i + 1].centralityScore);
    }
  });

  test('calculateBetweennessCentrality identifies bridge pathogens', () => {
    const result = calculateBetweennessCentrality(cy);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(5);
    expect(result[0]).toHaveProperty('betweenness');

    // E. coli should have high betweenness (connects gram-positive to gram-negative)
    const eColi = result.find(n => n.id === 'e-coli');
    expect(eColi).toBeDefined();
    expect(eColi.betweenness).toBeGreaterThan(0);
  });

  test('calculateClosenessCentrality measures overall connectivity', () => {
    const result = calculateClosenessCentrality(cy);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(5);
    expect(result[0]).toHaveProperty('closeness');

    // All closeness scores should be between 0 and 1
    result.forEach(node => {
      expect(node.closeness).toBeGreaterThan(0);
      expect(node.closeness).toBeLessThanOrEqual(1);
    });
  });
});

describe('Graph Algorithms - Shortest Path', () => {
  let cy;

  beforeEach(() => {
    cy = cytoscape({
      elements: mockElements,
      headless: true
    });
  });

  test('findShortestPath calculates resistance evolution path', () => {
    const result = findShortestPath(cy, 'staph-aureus', 'pseudomonas');

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('distance');
    expect(result).toHaveProperty('path');
    expect(result).toHaveProperty('clinicalImplication');

    expect(result.path).toBeInstanceOf(Array);
    expect(result.path[0].id).toBe('staph-aureus');
    expect(result.path[result.path.length - 1].id).toBe('pseudomonas');
  });

  test('findShortestPath returns null for invalid nodes', () => {
    const result = findShortestPath(cy, 'invalid-id', 'staph-aureus');
    expect(result).toBeNull();
  });

  test('findAllShortestPaths maps comprehensive resistance patterns', () => {
    const result = findAllShortestPaths(cy, 'e-coli');

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(4); // All other nodes

    result.forEach(path => {
      expect(path).toHaveProperty('target');
      expect(path).toHaveProperty('distance');
      expect(path).toHaveProperty('pathExists');
    });

    // Verify sorted by distance
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].distance).toBeLessThanOrEqual(result[i + 1].distance);
    }
  });
});

describe('Graph Algorithms - Clustering', () => {
  let cy;

  beforeEach(() => {
    cy = cytoscape({
      elements: mockElements,
      headless: true
    });
  });

  test('detectCommunities groups related pathogens', () => {
    const result = detectCommunities(cy);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);

    result.forEach(cluster => {
      expect(cluster).toHaveProperty('clusterId');
      expect(cluster).toHaveProperty('size');
      expect(cluster).toHaveProperty('dominantGramStatus');
      expect(cluster).toHaveProperty('pathogens');
      expect(cluster.pathogens).toBeInstanceOf(Array);
    });

    // Total pathogens across all clusters should equal total nodes
    const totalInClusters = result.reduce((sum, cluster) => sum + cluster.size, 0);
    expect(totalInClusters).toBe(5);
  });
});

describe('Graph Algorithms - Minimum Spanning Tree', () => {
  let cy;

  beforeEach(() => {
    cy = cytoscape({
      elements: mockElements,
      headless: true
    });
  });

  test('calculateMinimumSpanningTree identifies optimal coverage', () => {
    const result = calculateMinimumSpanningTree(cy);

    expect(result).toHaveProperty('edges');
    expect(result).toHaveProperty('totalWeight');
    expect(result).toHaveProperty('coverage');

    expect(result.edges).toBeInstanceOf(Array);
    expect(result.edges.length).toBe(4); // MST of 5 nodes has 4 edges

    result.edges.forEach(edge => {
      expect(edge).toHaveProperty('source');
      expect(edge).toHaveProperty('target');
      expect(edge).toHaveProperty('weight');
      expect(edge).toHaveProperty('relationshipType');
    });
  });
});

describe('Graph Algorithms - Clinical Insights', () => {
  let cy;

  beforeEach(() => {
    cy = cytoscape({
      elements: mockElements,
      headless: true
    });
  });

  test('identifyHubPathogens finds high-connectivity organisms', () => {
    const result = identifyHubPathogens(cy, 0.5);

    expect(result).toBeInstanceOf(Array);

    if (result.length > 0) {
      result.forEach(hub => {
        expect(hub).toHaveProperty('id');
        expect(hub).toHaveProperty('hubRank');
        expect(hub).toHaveProperty('clinicalSignificance');
        expect(hub).toHaveProperty('treatmentImplication');
        expect(hub).toHaveProperty('boardPrepInsight');
      });

      // E. coli should be identified as a hub
      const eColi = result.find(h => h.id === 'e-coli');
      expect(eColi).toBeDefined();
    }
  });

  test('analyzeResistanceClusters provides risk stratification', () => {
    const result = analyzeResistanceClusters(cy);

    expect(result).toBeInstanceOf(Array);

    result.forEach(cluster => {
      expect(cluster).toHaveProperty('resistanceProfile');
      expect(cluster).toHaveProperty('resistanceRisk');
      expect(cluster).toHaveProperty('clinicalWarning');
      expect(cluster).toHaveProperty('boardPrepTip');

      expect(['high', 'medium', 'low']).toContain(cluster.resistanceRisk);
    });
  });
});

describe('Graph Algorithms - Board Preparation Tools', () => {
  let cy;

  beforeEach(() => {
    cy = cytoscape({
      elements: mockElements,
      headless: true
    });
  });

  test('generateTreatmentDecisionTree creates systematic approach', () => {
    const result = generateTreatmentDecisionTree(cy, 'staph-aureus');

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);

    expect(result[0].pathogen).toBe('Staphylococcus aureus');
    expect(result[0].level).toBe(0);
    expect(result[0]).toHaveProperty('decisionPoint');

    result.forEach(node => {
      expect(node).toHaveProperty('level');
      expect(node).toHaveProperty('pathogen');
      expect(node).toHaveProperty('gramStatus');
      expect(node).toHaveProperty('severity');
    });
  });

  test('generateTreatmentDecisionTree returns empty for invalid ID', () => {
    const result = generateTreatmentDecisionTree(cy, 'invalid-id');
    expect(result).toEqual([]);
  });

  test('generateClinicalScenario creates board prep cases', () => {
    const result = generateClinicalScenario(cy, 'e-coli');

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('primaryPathogen');
    expect(result).toHaveProperty('gramStatus');
    expect(result).toHaveProperty('scenario');
    expect(result).toHaveProperty('relatedConsiderations');
    expect(result).toHaveProperty('teachingPoints');
    expect(result).toHaveProperty('boardPrepQuestion');

    expect(result.primaryPathogen).toBe('Escherichia coli');
    expect(result.relatedConsiderations).toBeInstanceOf(Array);
    expect(result.teachingPoints).toBeInstanceOf(Array);
  });

  test('generateClinicalScenario returns null for invalid ID', () => {
    const result = generateClinicalScenario(cy, 'invalid-id');
    expect(result).toBeNull();
  });
});

describe('Graph Algorithms - Network Statistics', () => {
  let cy;

  beforeEach(() => {
    cy = cytoscape({
      elements: mockElements,
      headless: true
    });
  });

  test('calculateNetworkStatistics provides comprehensive metrics', () => {
    const result = calculateNetworkStatistics(cy);

    expect(result).toHaveProperty('totalNodes');
    expect(result).toHaveProperty('totalEdges');
    expect(result).toHaveProperty('averageDegree');
    expect(result).toHaveProperty('density');
    expect(result).toHaveProperty('connectedComponents');
    expect(result).toHaveProperty('gramDistribution');
    expect(result).toHaveProperty('hubPathogens');
    expect(result).toHaveProperty('clinicalInsight');
    expect(result).toHaveProperty('boardPrepInsight');

    expect(result.totalNodes).toBe(5);
    expect(result.totalEdges).toBe(5);
    expect(result.gramDistribution).toHaveProperty('positive');
    expect(result.gramDistribution).toHaveProperty('negative');
    expect(result.gramDistribution).toHaveProperty('ratio');
  });

  test('analyzeNodeNeighborhood provides local network analysis', () => {
    const result = analyzeNodeNeighborhood(cy, 'e-coli');

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('pathogen');
    expect(result).toHaveProperty('directConnections');
    expect(result).toHaveProperty('relationships');
    expect(result).toHaveProperty('clinicalSignificance');

    expect(result.pathogen).toBe('Escherichia coli');
    expect(result.directConnections).toBe(3);
    expect(result.relationships).toBeInstanceOf(Array);

    result.relationships.forEach(rel => {
      expect(rel).toHaveProperty('partner');
      expect(rel).toHaveProperty('type');
      expect(rel).toHaveProperty('weight');
    });
  });

  test('analyzeNodeNeighborhood returns null for invalid ID', () => {
    const result = analyzeNodeNeighborhood(cy, 'invalid-id');
    expect(result).toBeNull();
  });
});

describe('Graph Algorithms - Performance with Large Network', () => {
  test('handles 39+ pathogen network efficiently', () => {
    // Create larger network simulating full PathogenRelationshipData
    const largeNodes = Array.from({ length: 39 }, (_, i) => ({
      data: {
        id: `pathogen-${i}`,
        label: `Pathogen ${i}`,
        gramStatus: i % 2 === 0 ? 'positive' : 'negative',
        severity: 'high',
        resistance: i % 3 === 0 ? 'high' : 'medium'
      }
    }));

    // Create random connections
    const largeEdges = [];
    for (let i = 0; i < 39; i++) {
      const connections = Math.min(3, 39 - i - 1);
      for (let j = 1; j <= connections; j++) {
        largeEdges.push({
          data: {
            source: `pathogen-${i}`,
            target: `pathogen-${i + j}`,
            weight: 1,
            relationshipType: 'cross-resistance'
          }
        });
      }
    }

    const cy = cytoscape({
      elements: { nodes: largeNodes, edges: largeEdges },
      headless: true
    });

    // Test performance of key algorithms
    const startTime = Date.now();

    const stats = calculateNetworkStatistics(cy);
    const centrality = calculateDegreeCentrality(cy);
    const hubs = identifyHubPathogens(cy, 0.6);
    const clusters = analyzeResistanceClusters(cy);

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    // Should complete in under 1 second
    expect(executionTime).toBeLessThan(1000);

    // Verify results
    expect(stats.totalNodes).toBe(39);
    expect(centrality.length).toBe(39);
    expect(hubs).toBeInstanceOf(Array);
    expect(clusters).toBeInstanceOf(Array);
  });
});
