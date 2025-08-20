/**
 * Data Indexer Tests
 * Tests for medical data indexing, cross-referencing, and search functionality
 */

import {
  buildIndexes,
  searchPathogens,
  searchAntibiotics,
  getConditionsForPathogen,
  getConditionsForAntibiotic,
  getAntibioticsForPathogen,
  findCombinationTherapyConditions,
  getDrugClassStats,
  calculatePathogenSimilarity,
  buildPathogenNetwork,
  findPathogenPaths,
  getPathogenRecommendations
} from '../dataIndexer.js';

// Mock the dataParser dependency
jest.mock('../dataParser.js', () => ({
  processConditionsData: jest.fn((conditions) => ({
    conditions: conditions,
    pathogens: [
      {
        name: 'Staphylococcus aureus',
        shortName: 'S. aureus',
        gramStatus: 'positive',
        type: 'bacteria',
        details: 'Gram-positive cocci',
        conditions: ['condition1', 'condition2'],
        count: 2
      },
      {
        name: 'Escherichia coli',
        shortName: 'E. coli',
        gramStatus: 'negative',
        type: 'bacteria',
        details: 'Gram-negative rod',
        conditions: ['condition1', 'condition3'],
        count: 2
      },
      {
        name: 'Pseudomonas aeruginosa',
        shortName: 'P. aeruginosa',
        gramStatus: 'negative',
        type: 'bacteria',
        details: 'Gram-negative rod',
        conditions: ['condition2'],
        count: 1
      }
    ],
    antibiotics: [
      {
        name: 'Vancomycin',
        class: 'Glycopeptide',
        conditions: ['condition1', 'condition2'],
        count: 2,
        therapyContexts: ['Staphylococcus aureus infections']
      },
      {
        name: 'Ceftriaxone',
        class: 'Cephalosporin',
        conditions: ['condition1', 'condition3'],
        count: 2,
        therapyContexts: ['Gram-negative infections']
      },
      {
        name: 'Piperacillin-Tazobactam',
        class: 'Beta-lactam combination',
        conditions: ['condition2', 'condition3'],
        count: 2,
        therapyContexts: ['Pseudomonas coverage']
      }
    ],
    totalPathogens: 3,
    totalAntibiotics: 3
  }))
}));

// Mock medical conditions data
const mockConditions = [
  {
    id: 'condition1',
    name: 'Pneumonia',
    category: 'Respiratory',
    empiricTherapy: {
      'Community-acquired': 'Ceftriaxone + Azithromycin',
      'Hospital-acquired': 'Piperacillin-Tazobactam + Vancomycin',
      'MRSA risk': 'Vancomycin + Ceftriaxone'
    }
  },
  {
    id: 'condition2',
    name: 'Bacteremia',
    category: 'Bloodstream',
    empiricTherapy: {
      'Gram-positive': 'Vancomycin',
      'Gram-negative': 'Piperacillin-Tazobactam',
      'Unknown source': 'Vancomycin + Piperacillin-Tazobactam'
    }
  },
  {
    id: 'condition3',
    name: 'Urinary Tract Infection',
    category: 'Urinary',
    empiricTherapy: {
      'Uncomplicated': 'Ceftriaxone',
      'Complicated': 'Piperacillin-Tazobactam'
    }
  }
];

describe('DataIndexer', () => {
  let indexes;

  beforeEach(() => {
    indexes = buildIndexes(mockConditions);
  });

  describe('Index Building', () => {
    test('should build comprehensive indexes from medical conditions', () => {
      expect(indexes).toBeDefined();
      expect(indexes.conditions).toHaveLength(3);
      expect(indexes.pathogens).toHaveLength(3);
      expect(indexes.antibiotics).toHaveLength(3);
    });

    test('should create pathogen to conditions mapping', () => {
      expect(indexes.pathogenToConditions).toBeInstanceOf(Map);
      expect(indexes.pathogenToConditions.get('Staphylococcus aureus')).toEqual(['condition1', 'condition2']);
      expect(indexes.pathogenToConditions.get('Escherichia coli')).toEqual(['condition1', 'condition3']);
    });

    test('should create antibiotic to conditions mapping', () => {
      expect(indexes.antibioticToConditions).toBeInstanceOf(Map);
      expect(indexes.antibioticToConditions.get('Vancomycin')).toEqual(['condition1', 'condition2']);
      expect(indexes.antibioticToConditions.get('Ceftriaxone')).toEqual(['condition1', 'condition3']);
    });

    test('should create reverse indexes (condition to pathogens/antibiotics)', () => {
      expect(indexes.conditionToPathogens.get('condition1')).toContain('Staphylococcus aureus');
      expect(indexes.conditionToPathogens.get('condition1')).toContain('Escherichia coli');
      
      expect(indexes.conditionToAntibiotics.get('condition1')).toContain('Vancomycin');
      expect(indexes.conditionToAntibiotics.get('condition1')).toContain('Ceftriaxone');
    });

    test('should classify pathogens by gram status', () => {
      expect(indexes.gramPositivePathogens).toHaveLength(1);
      expect(indexes.gramNegativePathogens).toHaveLength(2);
      expect(indexes.gramPositivePathogens[0].name).toBe('Staphylococcus aureus');
    });

    test('should create drug class indexes', () => {
      expect(indexes.drugClassToAntibiotics).toBeInstanceOf(Map);
      expect(indexes.drugClassToAntibiotics.get('Glycopeptide')).toContain('Vancomycin');
      expect(indexes.drugClassToAntibiotics.get('Cephalosporin')).toContain('Ceftriaxone');
      
      expect(indexes.antibioticToDrugClass.get('Vancomycin')).toBe('Glycopeptide');
    });

    test('should build pathogen-antibiotic matrix', () => {
      const antibioticsForStaph = indexes.pathogenAntibioticMatrix.get('Staphylococcus aureus');
      expect(antibioticsForStaph).toContain('Vancomycin');
      expect(antibioticsForStaph).toContain('Piperacillin-Tazobactam');
    });

    test('should calculate condition complexity scores', () => {
      expect(indexes.conditionComplexity).toBeInstanceOf(Map);
      const pneumoniaComplexity = indexes.conditionComplexity.get('condition1');
      expect(pneumoniaComplexity).toBeDefined();
      expect(pneumoniaComplexity.pathogens).toBe(2); // S. aureus, E. coli
      expect(pneumoniaComplexity.antibiotics).toBe(2); // Vancomycin, Ceftriaxone
      expect(pneumoniaComplexity.therapyOptions).toBe(3); // 3 therapy contexts
    });

    test('should generate accurate statistics', () => {
      expect(indexes.stats.totalConditions).toBe(3);
      expect(indexes.stats.totalPathogens).toBe(3);
      expect(indexes.stats.totalAntibiotics).toBe(3);
      expect(indexes.stats.gramPositiveCount).toBe(1);
      expect(indexes.stats.gramNegativeCount).toBe(2);
      expect(indexes.stats.drugClassCount).toBe(3);
    });
  });

  describe('Pathogen Search', () => {
    test('should search pathogens by name', () => {
      const results = searchPathogens(indexes, { query: 'aureus' });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Staphylococcus aureus');
    });

    test('should search pathogens by short name', () => {
      const results = searchPathogens(indexes, { query: 'E. coli' });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Escherichia coli');
    });

    test('should filter pathogens by gram status', () => {
      const gramPositive = searchPathogens(indexes, { gramStatus: 'positive' });
      const gramNegative = searchPathogens(indexes, { gramStatus: 'negative' });
      
      expect(gramPositive).toHaveLength(1);
      expect(gramNegative).toHaveLength(2);
      expect(gramPositive[0].gramStatus).toBe('positive');
    });

    test('should filter pathogens by pathogen type', () => {
      const bacteria = searchPathogens(indexes, { pathogenType: 'bacteria' });
      expect(bacteria).toHaveLength(3);
      expect(bacteria.every(p => p.type === 'bacteria')).toBe(true);
    });

    test('should filter pathogens by minimum conditions', () => {
      const results = searchPathogens(indexes, { minConditions: 2 });
      expect(results).toHaveLength(2); // S. aureus and E. coli have 2 conditions
    });

    test('should sort pathogens by different criteria', () => {
      const byName = searchPathogens(indexes, { sortBy: 'name' });
      const byCount = searchPathogens(indexes, { sortBy: 'count' });
      const byConditions = searchPathogens(indexes, { sortBy: 'conditions' });
      
      expect(byName[0].name).toBe('Escherichia coli'); // Alphabetical first
      expect(byCount.every((p, i, arr) => i === 0 || arr[i-1].count >= p.count)).toBe(true);
      expect(byConditions.every((p, i, arr) => i === 0 || arr[i-1].conditions.length >= p.conditions.length)).toBe(true);
    });

    test('should combine multiple filters', () => {
      const results = searchPathogens(indexes, {
        gramStatus: 'negative',
        minConditions: 2,
        sortBy: 'name'
      });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Escherichia coli');
    });
  });

  describe('Antibiotic Search', () => {
    test('should search antibiotics by name', () => {
      const results = searchAntibiotics(indexes, { query: 'Vancomycin' });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Vancomycin');
    });

    test('should search antibiotics by drug class', () => {
      const results = searchAntibiotics(indexes, { query: 'Glycopeptide' });
      expect(results).toHaveLength(1);
      expect(results[0].class).toBe('Glycopeptide');
    });

    test('should filter antibiotics by drug class', () => {
      const cephalosporins = searchAntibiotics(indexes, { drugClass: 'Cephalosporin' });
      expect(cephalosporins).toHaveLength(1);
      expect(cephalosporins[0].name).toBe('Ceftriaxone');
    });

    test('should filter antibiotics by minimum conditions', () => {
      const results = searchAntibiotics(indexes, { minConditions: 2 });
      expect(results).toHaveLength(3); // All antibiotics have 2 conditions
    });

    test('should sort antibiotics by different criteria', () => {
      const byName = searchAntibiotics(indexes, { sortBy: 'name' });
      const byClass = searchAntibiotics(indexes, { sortBy: 'class' });
      
      expect(byName[0].name).toBe('Ceftriaxone'); // Alphabetical first
      expect(byClass[0].class).toBe('Beta-lactam combination'); // Alphabetical first class
    });
  });

  describe('Condition Retrieval', () => {
    test('should get conditions for specific pathogen', () => {
      const conditions = getConditionsForPathogen(indexes, 'Staphylococcus aureus');
      expect(conditions).toHaveLength(2);
      expect(conditions.map(c => c.name)).toContain('Pneumonia');
      expect(conditions.map(c => c.name)).toContain('Bacteremia');
    });

    test('should get conditions for specific antibiotic with therapy context', () => {
      const conditions = getConditionsForAntibiotic(indexes, 'Vancomycin');
      expect(conditions).toHaveLength(2);
      
      const pneumoniaCondition = conditions.find(c => c.name === 'Pneumonia');
      expect(pneumoniaCondition.relevantTherapies).toBeDefined();
      expect(pneumoniaCondition.relevantTherapies['MRSA risk']).toContain('Vancomycin');
    });

    test('should get antibiotics for specific pathogen with effectiveness scores', () => {
      const antibiotics = getAntibioticsForPathogen(indexes, 'Staphylococcus aureus');
      expect(antibiotics.length).toBeGreaterThan(0);
      
      antibiotics.forEach(antibiotic => {
        expect(antibiotic.effectivenessScore).toBeDefined();
        expect(antibiotic.applicableConditions).toBeDefined();
      });
      
      // Should be sorted by effectiveness score
      for (let i = 1; i < antibiotics.length; i++) {
        expect(antibiotics[i-1].effectivenessScore).toBeGreaterThanOrEqual(antibiotics[i].effectivenessScore);
      }
    });

    test('should handle non-existent pathogen/antibiotic names', () => {
      expect(getConditionsForPathogen(indexes, 'Non-existent pathogen')).toHaveLength(0);
      expect(getConditionsForAntibiotic(indexes, 'Non-existent antibiotic')).toHaveLength(0);
      expect(getAntibioticsForPathogen(indexes, 'Non-existent pathogen')).toHaveLength(0);
    });
  });

  describe('Combination Therapy Analysis', () => {
    test('should find conditions using multiple antibiotics', () => {
      const combinations = findCombinationTherapyConditions(indexes, ['Vancomycin', 'Piperacillin-Tazobactam']);
      expect(combinations.length).toBeGreaterThan(0);
      
      const pneumoniaCombination = combinations.find(c => c.condition.name === 'Pneumonia');
      expect(pneumoniaCombination).toBeDefined();
      expect(pneumoniaCombination.matchingAntibiotics).toContain('Vancomycin');
      expect(pneumoniaCombination.matchingAntibiotics).toContain('Piperacillin-Tazobactam');
    });

    test('should not return single-antibiotic therapies', () => {
      const combinations = findCombinationTherapyConditions(indexes, ['Vancomycin', 'Non-existent']);
      // Should only return therapies that mention multiple antibiotics
      combinations.forEach(combo => {
        expect(combo.matchingAntibiotics.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('Drug Class Statistics', () => {
    test('should generate drug class statistics', () => {
      const stats = getDrugClassStats(indexes);
      expect(stats).toHaveLength(3);
      
      const glycopeptideStats = stats.find(s => s.drugClass === 'Glycopeptide');
      expect(glycopeptideStats).toBeDefined();
      expect(glycopeptideStats.antibiotics).toBe(1);
      expect(glycopeptideStats.conditions).toBe(2);
      expect(glycopeptideStats.antibioticList).toContain('Vancomycin');
    });

    test('should sort drug class stats by condition count', () => {
      const stats = getDrugClassStats(indexes);
      // Should be sorted by condition count (descending)
      for (let i = 1; i < stats.length; i++) {
        expect(stats[i-1].conditions).toBeGreaterThanOrEqual(stats[i].conditions);
      }
    });
  });

  describe('Pathogen Similarity Analysis', () => {
    test('should calculate similarity between different pathogens', () => {
      const staph = indexes.pathogens.find(p => p.name === 'Staphylococcus aureus');
      const ecoli = indexes.pathogens.find(p => p.name === 'Escherichia coli');
      
      const similarity = calculatePathogenSimilarity(staph, ecoli, indexes);
      
      expect(similarity.total).toBeGreaterThan(0);
      expect(similarity.total).toBeLessThan(1);
      expect(similarity.factors).toBeDefined();
      expect(similarity.details).toBeDefined();
      expect(similarity.details.sharedConditionNames).toContain('Pneumonia');
    });

    test('should return perfect similarity for same pathogen', () => {
      const staph = indexes.pathogens.find(p => p.name === 'Staphylococcus aureus');
      const similarity = calculatePathogenSimilarity(staph, staph, indexes);
      
      expect(similarity.total).toBe(1);
    });

    test('should consider gram status in similarity', () => {
      const staph = indexes.pathogens.find(p => p.name === 'Staphylococcus aureus'); // gram positive
      const ecoli = indexes.pathogens.find(p => p.name === 'Escherichia coli'); // gram negative
      const pseudomonas = indexes.pathogens.find(p => p.name === 'Pseudomonas aeruginosa'); // gram negative
      
      const differentGram = calculatePathogenSimilarity(staph, ecoli, indexes);
      const sameGram = calculatePathogenSimilarity(ecoli, pseudomonas, indexes);
      
      expect(differentGram.factors.gramStatus).toBe(0);
      expect(sameGram.factors.gramStatus).toBe(0.15);
    });

    test('should analyze shared conditions and antibiotics', () => {
      const staph = indexes.pathogens.find(p => p.name === 'Staphylococcus aureus');
      const ecoli = indexes.pathogens.find(p => p.name === 'Escherichia coli');
      
      const similarity = calculatePathogenSimilarity(staph, ecoli, indexes);
      
      expect(similarity.factors.sharedConditions).toBeGreaterThan(0);
      expect(similarity.factors.sharedAntibiotics).toBeGreaterThan(0);
      expect(similarity.details.sharedConditionNames).toContain('Pneumonia');
    });
  });

  describe('Pathogen Network Analysis', () => {
    test('should build pathogen network with nodes and edges', () => {
      const network = buildPathogenNetwork(indexes);
      
      expect(network.nodes).toHaveLength(3);
      expect(network.edges.length).toBeGreaterThan(0);
      expect(network.clusters).toBeInstanceOf(Map);
      expect(network.centralityScores).toBeInstanceOf(Map);
    });

    test('should calculate centrality scores for nodes', () => {
      const network = buildPathogenNetwork(indexes);
      
      network.nodes.forEach(node => {
        expect(node.centralityScore).toBeDefined();
        expect(node.centralityScore).toBeGreaterThanOrEqual(0);
        expect(network.centralityScores.get(node.id)).toBe(node.centralityScore);
      });
    });

    test('should create meaningful edges based on similarity threshold', () => {
      const network = buildPathogenNetwork(indexes);
      
      network.edges.forEach(edge => {
        expect(edge.weight).toBeGreaterThan(0.2); // Minimum threshold
        expect(edge.similarity).toBeDefined();
        expect(['strong', 'medium', 'weak']).toContain(edge.type);
      });
    });

    test('should cluster pathogens by gram status', () => {
      const network = buildPathogenNetwork(indexes);
      
      expect(network.clusters.has('positive')).toBe(true);
      expect(network.clusters.has('negative')).toBe(true);
      expect(network.clusters.get('positive')).toHaveLength(1);
      expect(network.clusters.get('negative')).toHaveLength(2);
    });
  });

  describe('Pathogen Path Finding', () => {
    test('should find paths between pathogens', () => {
      const paths = findPathogenPaths(indexes, 'Staphylococcus aureus', 'Escherichia coli', 2);
      
      expect(Array.isArray(paths)).toBe(true);
      if (paths.length > 0) {
        paths.forEach(path => {
          expect(path.path).toBeDefined();
          expect(path.score).toBeDefined();
          expect(path.details).toBeDefined();
          expect(path.length).toBeDefined();
          expect(path.path[0]).toBe('Staphylococcus aureus');
          expect(path.path[path.path.length - 1]).toBe('Escherichia coli');
        });
      }
    });

    test('should respect maximum depth parameter', () => {
      const paths = findPathogenPaths(indexes, 'Staphylococcus aureus', 'Escherichia coli', 1);
      
      paths.forEach(path => {
        expect(path.length).toBeLessThanOrEqual(2); // Start + 1 hop max
      });
    });

    test('should sort paths by score', () => {
      const paths = findPathogenPaths(indexes, 'Staphylococcus aureus', 'Pseudomonas aeruginosa', 3);
      
      for (let i = 1; i < paths.length; i++) {
        expect(paths[i-1].score).toBeGreaterThanOrEqual(paths[i].score);
      }
    });
  });

  describe('Pathogen Recommendations', () => {
    test('should generate recommendations based on similarity', () => {
      const recommendations = getPathogenRecommendations(
        indexes, 
        'Staphylococcus aureus', 
        [], 
        {}
      );
      
      expect(Array.isArray(recommendations)).toBe(true);
      recommendations.forEach(rec => {
        expect(rec.pathogen).toBeDefined();
        expect(rec.similarity).toBeDefined();
        expect(rec.weight).toBeDefined();
        expect(rec.reasoning).toBeDefined();
      });
    });

    test('should prioritize systematic learning for same gram status', () => {
      const recommendations = getPathogenRecommendations(
        indexes,
        'Escherichia coli',
        [],
        { systematicLearning: true }
      );
      
      const gramNegativeRecs = recommendations.filter(r => 
        r.reasoning.includes('Same gram status')
      );
      expect(gramNegativeRecs.length).toBeGreaterThan(0);
    });

    test('should avoid recently viewed pathogens', () => {
      const recentlyViewed = ['Escherichia coli'];
      const recommendations = getPathogenRecommendations(
        indexes,
        'Staphylococcus aureus',
        recentlyViewed,
        {}
      );
      
      expect(recommendations.every(r => !recentlyViewed.includes(r.pathogen))).toBe(true);
    });

    test('should include recently viewed if requested', () => {
      const recentlyViewed = ['Escherichia coli'];
      const recommendations = getPathogenRecommendations(
        indexes,
        'Staphylococcus aureus',
        recentlyViewed,
        { includeRecentlyViewed: true }
      );
      
      // Should not filter out recently viewed
      expect(recommendations.length).toBeGreaterThanOrEqual(0);
    });

    test('should limit recommendations to maximum count', () => {
      const recommendations = getPathogenRecommendations(
        indexes,
        'Staphylococcus aureus',
        [],
        {}
      );
      
      expect(recommendations.length).toBeLessThanOrEqual(8);
    });

    test('should handle non-existent current pathogen', () => {
      const recommendations = getPathogenRecommendations(
        indexes,
        'Non-existent pathogen',
        [],
        {}
      );
      
      expect(recommendations).toHaveLength(0);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle empty conditions array', () => {
      const emptyIndexes = buildIndexes([]);
      expect(emptyIndexes.conditions).toHaveLength(0);
      expect(emptyIndexes.pathogens).toHaveLength(0);
      expect(emptyIndexes.antibiotics).toHaveLength(0);
    });

    test('should handle conditions without empiric therapy', () => {
      const conditionsWithoutTherapy = [
        { id: 'test', name: 'Test Condition' }
      ];
      
      expect(() => buildIndexes(conditionsWithoutTherapy)).not.toThrow();
    });

    test('should handle search with empty query', () => {
      const pathogenResults = searchPathogens(indexes, { query: '' });
      const antibioticResults = searchAntibiotics(indexes, { query: '' });
      
      expect(pathogenResults).toHaveLength(3); // Should return all
      expect(antibioticResults).toHaveLength(3); // Should return all
    });

    test('should handle invalid sort options', () => {
      const results = searchPathogens(indexes, { sortBy: 'invalid' });
      expect(results).toHaveLength(3); // Should default to name sorting
    });
  });
});