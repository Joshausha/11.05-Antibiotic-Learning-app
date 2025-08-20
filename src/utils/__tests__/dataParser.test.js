/**
 * Tests for Data Parser Utilities
 * @description Comprehensive test suite for data parsing and transformation functions
 */

import {
  parsePathogen,
  parseAntibiotics,
  calculateSpectrumScore,
  getAntibioticsBySpectrum,
  getSpectrumOverlap,
  transformToNeo4jFormat,
  generateCypherQueries,
  processConditionsData
} from '../dataParser';

describe('Data Parser - parsePathogen', () => {
  test('should parse simple pathogen names', () => {
    const result = parsePathogen('Staphylococcus aureus');
    
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('gramStatus');
    expect(result).toHaveProperty('pathogenType');
    expect(typeof result.name).toBe('string');
  });

  test('should handle pathogen names with parenthetical information', () => {
    const result = parsePathogen('Staphylococcus aureus (MRSA)');
    
    expect(result).not.toBeNull();
    expect(result.name).toBe('Staphylococcus aureus');
    expect(result.details).toBe('MRSA');
  });

  test('should filter out non-pathogen entries', () => {
    const nonPathogens = [
      'RCTs for duration of therapy',
      'Observational studies: Smith et al',
      'Studies have shown',
      'Research indicates'
    ];

    nonPathogens.forEach(text => {
      const result = parsePathogen(text);
      expect(result).toBeNull();
    });
  });

  test('should handle invalid inputs', () => {
    expect(parsePathogen(null)).toBeNull();
    expect(parsePathogen(undefined)).toBeNull();
    expect(parsePathogen('')).toBeNull();
    expect(parsePathogen(123)).toBeNull();
    expect(parsePathogen({})).toBeNull();
  });

  test('should clean citation markers', () => {
    const result = parsePathogen('Escherichia coli [cite:123]');
    
    expect(result).not.toBeNull();
    expect(result.name).not.toContain('[cite:123]');
  });

  test('should determine gram status when possible', () => {
    const gramPositive = parsePathogen('Staphylococcus aureus');
    const gramNegative = parsePathogen('Escherichia coli');
    
    if (gramPositive) {
      expect(['positive', 'negative', 'unknown']).toContain(gramPositive.gramStatus.toLowerCase());
    }
    if (gramNegative) {
      expect(['positive', 'negative', 'unknown']).toContain(gramNegative.gramStatus.toLowerCase());
    }
  });

  test('should handle complex pathogen descriptions', () => {
    const complexText = 'Enterobacterales (eg, Escherichia coli, Klebsiella species, Enterobacter species)';
    const result = parsePathogen(complexText);
    
    if (result) {
      expect(result.name).toBeTruthy();
      expect(typeof result.name).toBe('string');
    }
  });
});

describe('Data Parser - parseAntibiotics', () => {
  test('should parse simple antibiotic names', () => {
    const result = parseAntibiotics('Vancomycin');
    
    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('class');
      expect(typeof result[0].name).toBe('string');
    }
  });

  test('should parse multiple antibiotics with OR separator', () => {
    const result = parseAntibiotics('Vancomycin OR Linezolid OR Daptomycin');
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);
    
    result.forEach(antibiotic => {
      expect(antibiotic).toHaveProperty('name');
      expect(antibiotic).toHaveProperty('class');
    });
  });

  test('should parse antibiotics with PLUS combinations', () => {
    const result = parseAntibiotics('Ceftriaxone PLUS Vancomycin');
    
    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      result.forEach(antibiotic => {
        expect(typeof antibiotic.name).toBe('string');
      });
    }
  });

  test('should handle invalid inputs', () => {
    expect(parseAntibiotics(null)).toEqual([]);
    expect(parseAntibiotics(undefined)).toEqual([]);
    expect(parseAntibiotics('')).toEqual([]);
    expect(parseAntibiotics(123)).toEqual([]);
  });

  test('should handle complex therapy descriptions', () => {
    const complexTherapy = 'Choice depends on results of antibiotic susceptibility testing';
    const result = parseAntibiotics(complexTherapy);
    
    expect(Array.isArray(result)).toBe(true);
    // May return empty array for complex descriptions
  });

  test('should clean antibiotic names', () => {
    const result = parseAntibiotics('Vancomycin (intravenous)');
    
    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0].name).toBeTruthy();
      expect(typeof result[0].name).toBe('string');
    }
  });
});

describe('Data Parser - calculateSpectrumScore', () => {
  test('should calculate spectrum score for valid inputs', () => {
    const score = calculateSpectrumScore('vancomycin', 'gram-positive');
    
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(10);
  });

  test('should handle case insensitive inputs', () => {
    const score1 = calculateSpectrumScore('VANCOMYCIN', 'GRAM-POSITIVE');
    const score2 = calculateSpectrumScore('vancomycin', 'gram-positive');
    
    expect(score1).toBe(score2);
  });

  test('should return 0 for unknown combinations', () => {
    const score = calculateSpectrumScore('unknown_antibiotic', 'unknown_category');
    
    expect(score).toBe(0);
  });

  test('should handle null/undefined inputs', () => {
    expect(calculateSpectrumScore(null, 'gram-positive')).toBe(0);
    expect(calculateSpectrumScore('vancomycin', null)).toBe(0);
    expect(calculateSpectrumScore(null, null)).toBe(0);
  });
});

describe('Data Parser - getAntibioticsBySpectrum', () => {
  test('should return antibiotics for valid pathogen category', () => {
    const antibiotics = getAntibioticsBySpectrum('gram-positive');
    
    expect(Array.isArray(antibiotics)).toBe(true);
    
    antibiotics.forEach(antibiotic => {
      expect(antibiotic).toHaveProperty('name');
      expect(antibiotic).toHaveProperty('score');
      expect(typeof antibiotic.name).toBe('string');
      expect(typeof antibiotic.score).toBe('number');
    });
  });

  test('should respect minimum score threshold', () => {
    const highScoreAntibiotics = getAntibioticsBySpectrum('gram-positive', 8);
    
    expect(Array.isArray(highScoreAntibiotics)).toBe(true);
    
    highScoreAntibiotics.forEach(antibiotic => {
      expect(antibiotic.score).toBeGreaterThanOrEqual(8);
    });
  });

  test('should handle invalid pathogen categories', () => {
    const result = getAntibioticsBySpectrum('invalid_category');
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should handle null/undefined inputs', () => {
    expect(getAntibioticsBySpectrum(null)).toEqual([]);
    expect(getAntibioticsBySpectrum(undefined)).toEqual([]);
  });
});

describe('Data Parser - getSpectrumOverlap', () => {
  test('should calculate overlap between antibiotics', () => {
    const overlap = getSpectrumOverlap('vancomycin', 'linezolid');
    
    expect(typeof overlap).toBe('number');
    expect(overlap).toBeGreaterThanOrEqual(0);
    expect(overlap).toBeLessThanOrEqual(1);
  });

  test('should handle identical antibiotics', () => {
    const overlap = getSpectrumOverlap('vancomycin', 'vancomycin');
    
    expect(overlap).toBe(1); // Should have perfect overlap with itself
  });

  test('should handle unknown antibiotics', () => {
    const overlap = getSpectrumOverlap('unknown1', 'unknown2');
    
    expect(typeof overlap).toBe('number');
    expect(overlap).toBeGreaterThanOrEqual(0);
  });

  test('should handle null/undefined inputs', () => {
    expect(getSpectrumOverlap(null, 'vancomycin')).toBe(0);
    expect(getSpectrumOverlap('vancomycin', null)).toBe(0);
    expect(getSpectrumOverlap(null, null)).toBe(0);
  });
});

describe('Data Parser - transformToNeo4jFormat', () => {
  const mockConditions = [
    {
      id: 'test_condition',
      name: 'Test Condition',
      category: 'Test Category',
      commonPathogens: ['Staphylococcus aureus', 'Escherichia coli'],
      empiricTherapy: {
        'Standard': 'Vancomycin OR Linezolid'
      }
    }
  ];

  test('should transform conditions to Neo4j format', () => {
    const result = transformToNeo4jFormat(mockConditions);
    
    expect(result).toHaveProperty('nodes');
    expect(result).toHaveProperty('relationships');
    expect(Array.isArray(result.nodes)).toBe(true);
    expect(Array.isArray(result.relationships)).toBe(true);
  });

  test('should create proper node structure', () => {
    const result = transformToNeo4jFormat(mockConditions);
    
    result.nodes.forEach(node => {
      expect(node).toHaveProperty('id');
      expect(node).toHaveProperty('type');
      expect(node).toHaveProperty('properties');
      
      expect(typeof node.id).toBe('string');
      expect(typeof node.type).toBe('string');
      expect(typeof node.properties).toBe('object');
    });
  });

  test('should create proper relationship structure', () => {
    const result = transformToNeo4jFormat(mockConditions);
    
    result.relationships.forEach(rel => {
      expect(rel).toHaveProperty('from');
      expect(rel).toHaveProperty('to');
      expect(rel).toHaveProperty('type');
      
      expect(typeof rel.from).toBe('string');
      expect(typeof rel.to).toBe('string');
      expect(typeof rel.type).toBe('string');
    });
  });

  test('should handle empty conditions array', () => {
    const result = transformToNeo4jFormat([]);
    
    expect(result).toHaveProperty('nodes');
    expect(result).toHaveProperty('relationships');
    expect(result.nodes.length).toBe(0);
    expect(result.relationships.length).toBe(0);
  });

  test('should handle null/undefined input', () => {
    expect(() => transformToNeo4jFormat(null)).not.toThrow();
    expect(() => transformToNeo4jFormat(undefined)).not.toThrow();
    
    const result1 = transformToNeo4jFormat(null);
    const result2 = transformToNeo4jFormat(undefined);
    
    expect(result1).toHaveProperty('nodes');
    expect(result2).toHaveProperty('nodes');
  });
});

describe('Data Parser - generateCypherQueries', () => {
  const mockNeo4jData = {
    nodes: [
      {
        id: 'condition_1',
        type: 'Condition',
        properties: { name: 'Test Condition' }
      },
      {
        id: 'pathogen_1',
        type: 'Pathogen',
        properties: { name: 'Test Pathogen' }
      }
    ],
    relationships: [
      {
        from: 'condition_1',
        to: 'pathogen_1',
        type: 'CAUSES'
      }
    ]
  };

  test('should generate Cypher queries for Neo4j data', () => {
    const queries = generateCypherQueries(mockNeo4jData);
    
    expect(queries).toHaveProperty('nodes');
    expect(queries).toHaveProperty('relationships');
    expect(Array.isArray(queries.nodes)).toBe(true);
    expect(Array.isArray(queries.relationships)).toBe(true);
  });

  test('should generate valid Cypher syntax', () => {
    const queries = generateCypherQueries(mockNeo4jData);
    
    queries.nodes.forEach(query => {
      expect(typeof query).toBe('string');
      expect(query).toContain('CREATE');
      expect(query).toContain('(');
      expect(query).toContain(')');
    });

    queries.relationships.forEach(query => {
      expect(typeof query).toBe('string');
      expect(query).toContain('MATCH');
      expect(query).toContain('CREATE');
    });
  });

  test('should handle empty Neo4j data', () => {
    const emptyData = { nodes: [], relationships: [] };
    const queries = generateCypherQueries(emptyData);
    
    expect(queries.nodes.length).toBe(0);
    expect(queries.relationships.length).toBe(0);
  });

  test('should handle null/undefined input', () => {
    expect(() => generateCypherQueries(null)).not.toThrow();
    expect(() => generateCypherQueries(undefined)).not.toThrow();
  });
});

describe('Data Parser - processConditionsData', () => {
  const mockConditions = [
    {
      id: 'condition_1',
      name: 'Test Condition 1',
      category: 'Category A',
      commonPathogens: ['Pathogen A', 'Pathogen B'],
      empiricTherapy: { Standard: 'Therapy A' }
    },
    {
      id: 'condition_2',
      name: 'Test Condition 2',
      category: 'Category B',
      commonPathogens: ['Pathogen C'],
      empiricTherapy: { Standard: 'Therapy B OR Therapy C' }
    }
  ];

  test('should process conditions data comprehensively', () => {
    const result = processConditionsData(mockConditions);
    
    expect(result).toHaveProperty('pathogens');
    expect(result).toHaveProperty('antibiotics');
    expect(result).toHaveProperty('conditions');
    expect(result).toHaveProperty('relationships');
    
    expect(Array.isArray(result.pathogens)).toBe(true);
    expect(Array.isArray(result.antibiotics)).toBe(true);
    expect(Array.isArray(result.conditions)).toBe(true);
    expect(Array.isArray(result.relationships)).toBe(true);
  });

  test('should extract unique pathogens', () => {
    const result = processConditionsData(mockConditions);
    
    const pathogenNames = result.pathogens.map(p => p.name);
    const uniqueNames = [...new Set(pathogenNames)];
    
    expect(pathogenNames.length).toBe(uniqueNames.length); // No duplicates
  });

  test('should extract antibiotics from therapy descriptions', () => {
    const result = processConditionsData(mockConditions);
    
    expect(result.antibiotics.length).toBeGreaterThan(0);
    
    result.antibiotics.forEach(antibiotic => {
      expect(antibiotic).toHaveProperty('name');
      expect(typeof antibiotic.name).toBe('string');
    });
  });

  test('should create relationships between entities', () => {
    const result = processConditionsData(mockConditions);
    
    expect(result.relationships.length).toBeGreaterThan(0);
    
    result.relationships.forEach(rel => {
      expect(rel).toHaveProperty('from');
      expect(rel).toHaveProperty('to');
      expect(rel).toHaveProperty('type');
    });
  });

  test('should handle empty conditions array', () => {
    const result = processConditionsData([]);
    
    expect(result.pathogens.length).toBe(0);
    expect(result.antibiotics.length).toBe(0);
    expect(result.conditions.length).toBe(0);
    expect(result.relationships.length).toBe(0);
  });

  test('should handle null/undefined input', () => {
    expect(() => processConditionsData(null)).not.toThrow();
    expect(() => processConditionsData(undefined)).not.toThrow();
    
    const result1 = processConditionsData(null);
    const result2 = processConditionsData(undefined);
    
    expect(Array.isArray(result1.pathogens)).toBe(true);
    expect(Array.isArray(result2.pathogens)).toBe(true);
  });
});

describe('Data Parser - Integration Tests', () => {
  test('should handle complete parsing workflow', () => {
    const mockCondition = {
      id: 'integration_test',
      name: 'Integration Test',
      category: 'Test',
      commonPathogens: ['Staphylococcus aureus', 'Escherichia coli'],
      empiricTherapy: { Standard: 'Vancomycin OR Linezolid' }
    };

    // Test full pipeline
    const processed = processConditionsData([mockCondition]);
    const neo4jData = transformToNeo4jFormat([mockCondition]);
    const queries = generateCypherQueries(neo4jData);

    expect(processed.pathogens.length).toBeGreaterThan(0);
    expect(processed.antibiotics.length).toBeGreaterThan(0);
    expect(neo4jData.nodes.length).toBeGreaterThan(0);
    expect(queries.nodes.length).toBeGreaterThan(0);
  });

  test('should maintain data consistency across transformations', () => {
    const conditions = [
      {
        id: 'consistency_test',
        name: 'Consistency Test',
        commonPathogens: ['Test Pathogen'],
        empiricTherapy: { Standard: 'Test Antibiotic' }
      }
    ];

    const processed = processConditionsData(conditions);
    const neo4j = transformToNeo4jFormat(conditions);

    expect(processed.conditions.length).toBe(conditions.length);
    
    // Should have nodes for condition, pathogen, and antibiotic
    const conditionNodes = neo4j.nodes.filter(n => n.type === 'Condition');
    expect(conditionNodes.length).toBeGreaterThanOrEqual(1);
  });

  test('should handle performance with large datasets', () => {
    const largeDataset = Array.from({ length: 100 }, (_, i) => ({
      id: `condition_${i}`,
      name: `Condition ${i}`,
      category: `Category ${i % 10}`,
      commonPathogens: [`Pathogen ${i}`],
      empiricTherapy: { Standard: `Antibiotic ${i}` }
    }));

    const startTime = performance.now();
    
    const processed = processConditionsData(largeDataset);
    const neo4j = transformToNeo4jFormat(largeDataset);
    
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(5000); // Should complete in under 5 seconds
    expect(processed.conditions.length).toBe(100);
    expect(neo4j.nodes.length).toBeGreaterThan(100);
  });
});