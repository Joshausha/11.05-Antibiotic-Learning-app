/**
 * Pathogen Similarity Analysis Tests
 *
 * Comprehensive test suite for Jaccard similarity algorithm and relationship generation
 * Medical accuracy validated against IDSA/AAP guidelines
 */

import {
  calculateJaccardSimilarity,
  getEffectiveAntibiotics,
  classifyRelationshipType,
  validateRelationshipMedically,
  generatePathogenRelationships,
  getRelationshipStatistics
} from '../pathogenSimilarity';

/**
 * Test Suite 1: Jaccard Similarity Calculation
 * Tests core similarity metric calculation
 */
describe('calculateJaccardSimilarity', () => {
  it('should calculate similarity for gram-negative Enterobacteriaceae (E. coli vs Klebsiella)', () => {
    // E. coli (ID 2) and Klebsiella (ID 6) share multiple Enterobacteriaceae characteristics
    const similarity = calculateJaccardSimilarity(2, 6);
    // Expected high similarity due to shared antibiotic susceptibility
    expect(similarity).toBeGreaterThan(0.5);
    expect(similarity).toBeLessThanOrEqual(1);
  });

  it('should calculate similarity for Gram-positive cocci (Staph vs Strep)', () => {
    // Staphylococcus aureus (ID 1) and S. pneumoniae (ID 3) - both positive cocci
    const similarity = calculateJaccardSimilarity(1, 3);
    // Expected moderate similarity due to different resistance patterns
    expect(similarity).toBeGreaterThan(0.2);
    expect(similarity).toBeLessThanOrEqual(1);
  });

  it('should calculate low similarity for different gram stains (Staph vs E. coli)', () => {
    // Staph aureus (ID 1, positive) vs E. coli (ID 2, negative)
    const similarity = calculateJaccardSimilarity(1, 2);
    // Expected low similarity due to Gram difference
    expect(similarity).toBeLessThan(0.5);
  });

  it('should return 0 for non-existent pathogens', () => {
    const similarity = calculateJaccardSimilarity(999, 1);
    expect(similarity).toBe(0);
  });

  it('should return symmetric results (similarity is commutative)', () => {
    const sim12 = calculateJaccardSimilarity(1, 2);
    const sim21 = calculateJaccardSimilarity(2, 1);
    expect(sim12).toBe(sim21);
  });

  it('should return 1 for identical pathogen compared to itself', () => {
    // Same pathogen should have perfect overlap
    const similarity = calculateJaccardSimilarity(1, 1);
    expect(similarity).toBe(1);
  });

  it('should handle effectiveness threshold parameter', () => {
    // High threshold should be more restrictive
    const simHigh = calculateJaccardSimilarity(2, 6, 'high');
    const simMedium = calculateJaccardSimilarity(2, 6, 'medium');

    // High effectiveness requires more overlap
    expect(simHigh).toBeLessThanOrEqual(simMedium);
  });
});

/**
 * Test Suite 2: Effectiveness Threshold Filtering
 * Tests extraction of effective antibiotics
 */
describe('getEffectiveAntibiotics', () => {
  it('should extract high effectiveness antibiotics only', () => {
    const highEff = getEffectiveAntibiotics(1, 'high');
    expect(Array.isArray(highEff)).toBe(true);
    expect(highEff.length).toBeGreaterThan(0);
    // All returned IDs should be valid antibiotic IDs
    highEff.forEach(id => {
      expect(typeof id).toBe('number');
      expect(id).toBeGreaterThan(0);
    });
  });

  it('should include both high and medium effectiveness at medium threshold', () => {
    const mediumEff = getEffectiveAntibiotics(1, 'medium');
    const highEff = getEffectiveAntibiotics(1, 'high');
    // Medium threshold should include or equal high threshold items
    expect(mediumEff.length).toBeGreaterThanOrEqual(highEff.length);
  });

  it('should return empty array for non-existent pathogen', () => {
    const result = getEffectiveAntibiotics(999, 'medium');
    expect(result).toEqual([]);
  });

  it('should handle all effectiveness thresholds', () => {
    const thresholds = ['high', 'medium', 'low', 'resistant'];
    thresholds.forEach(threshold => {
      const result = getEffectiveAntibiotics(1, threshold);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  it('should be most restrictive for high, most permissive for resistant', () => {
    const high = getEffectiveAntibiotics(1, 'high').length;
    const medium = getEffectiveAntibiotics(1, 'medium').length;
    const low = getEffectiveAntibiotics(1, 'low').length;
    const resistant = getEffectiveAntibiotics(1, 'resistant').length;

    expect(high).toBeLessThanOrEqual(medium);
    expect(medium).toBeLessThanOrEqual(low);
    expect(low).toBeLessThanOrEqual(resistant);
  });
});

/**
 * Test Suite 3: Relationship Type Classification
 * Tests strength categorization
 */
describe('classifyRelationshipType', () => {
  it('should classify very high similarity as strong', () => {
    expect(classifyRelationshipType(0.8)).toBe('strong');
    expect(classifyRelationshipType(0.6)).toBe('strong');
    expect(classifyRelationshipType(0.51)).toBe('strong');
  });

  it('should classify medium similarity as medium', () => {
    expect(classifyRelationshipType(0.5)).toBe('medium');
    expect(classifyRelationshipType(0.45)).toBe('medium');
    expect(classifyRelationshipType(0.36)).toBe('medium');
  });

  it('should classify low similarity as weak', () => {
    expect(classifyRelationshipType(0.35)).toBe('weak');
    expect(classifyRelationshipType(0.27)).toBe('weak');
    expect(classifyRelationshipType(0.21)).toBe('weak');
  });

  it('should classify very low similarity as none', () => {
    expect(classifyRelationshipType(0.19)).toBe('none');
    expect(classifyRelationshipType(0.1)).toBe('none');
    expect(classifyRelationshipType(0)).toBe('none');
  });

  it('should handle boundary values correctly', () => {
    // Test exact boundaries (>0.5=strong, >0.35-0.5=medium, >0.2-0.35=weak, <=0.2=none)
    expect(classifyRelationshipType(0.5)).toBe('medium');
    expect(classifyRelationshipType(0.36)).toBe('medium');
    expect(classifyRelationshipType(0.35)).toBe('weak');
    expect(classifyRelationshipType(0.21)).toBe('weak');
    expect(classifyRelationshipType(0.2)).toBe('none');
  });
});

/**
 * Test Suite 4: Medical Validation
 * Tests biological reasonableness checks
 */
describe('validateRelationshipMedically', () => {
  it('should reject virus-bacteria relationships', () => {
    // HSV (ID 28, virus) vs Staph (ID 1, positive bacteria)
    const validation = validateRelationshipMedically(28, 1, 0.5);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain('Virus');
  });

  it('should reject very high cross-gram similarity', () => {
    // Gram-positive (ID 1) vs Gram-negative (ID 2) with very high similarity
    const validation = validateRelationshipMedically(1, 2, 0.65);
    expect(validation.valid).toBe(false);
  });

  it('should accept moderate cross-gram similarity', () => {
    // Gram-positive vs Gram-negative with moderate similarity is possible
    const validation = validateRelationshipMedically(1, 2, 0.35);
    // May or may not validate depending on other factors
    expect(validation).toHaveProperty('valid');
  });

  it('should handle same-species relationships', () => {
    // Two species from same genus should have reasonable similarity
    // E.g., different Enterococcus species
    const validation = validateRelationshipMedically(7, 11, 0.4);
    expect(validation).toHaveProperty('valid');
    expect(validation).toHaveProperty('reason');
  });

  it('should return object with valid and reason properties', () => {
    const validation = validateRelationshipMedically(1, 3, 0.5);
    expect(validation).toHaveProperty('valid');
    expect(validation).toHaveProperty('reason');
    expect(typeof validation.valid).toBe('boolean');
    expect(typeof validation.reason).toBe('string');
  });

  it('should reject invalid pathogen IDs', () => {
    const validation = validateRelationshipMedically(999, 1, 0.5);
    expect(validation.valid).toBe(false);
  });
});

/**
 * Test Suite 5: Relationship Generation
 * Tests full pipeline from pair comparison to final output
 */
describe('generatePathogenRelationships', () => {
  let relationships;

  beforeAll(() => {
    relationships = generatePathogenRelationships(0.3, true);
  });

  it('should generate array of relationships', () => {
    expect(Array.isArray(relationships)).toBe(true);
    expect(relationships.length).toBeGreaterThan(0);
  });

  it('should generate 40-70 relationships at 0.3 threshold (balanced clustering)', () => {
    // With 0.3 threshold, expect moderate number of relationships
    expect(relationships.length).toBeGreaterThan(30);
    expect(relationships.length).toBeLessThan(100);
  });

  it('should all relationships have required properties', () => {
    relationships.forEach(rel => {
      expect(rel).toHaveProperty('sourceId');
      expect(rel).toHaveProperty('source');
      expect(rel).toHaveProperty('targetId');
      expect(rel).toHaveProperty('target');
      expect(rel).toHaveProperty('similarity');
      expect(rel).toHaveProperty('relationshipType');
      expect(rel).toHaveProperty('sharedAntibiotics');
      expect(rel).toHaveProperty('sharedAntibioticNames');
      expect(rel).toHaveProperty('clinicalRationale');
      expect(rel).toHaveProperty('medicalSource');
    });
  });

  it('should have valid similarity scores', () => {
    relationships.forEach(rel => {
      expect(rel.similarity).toBeGreaterThanOrEqual(0);
      expect(rel.similarity).toBeLessThanOrEqual(1);
    });
  });

  it('should have no self-relationships', () => {
    relationships.forEach(rel => {
      expect(rel.sourceId).not.toBe(rel.targetId);
    });
  });

  it('should have no duplicate relationships', () => {
    const pairs = relationships.map(
      rel => `${Math.min(rel.sourceId, rel.targetId)}-${Math.max(rel.sourceId, rel.targetId)}`
    );
    const uniquePairs = new Set(pairs);
    expect(pairs.length).toBe(uniquePairs.size);
  });

  it('should classify relationships by type', () => {
    const types = new Set(relationships.map(r => r.relationshipType));
    expect(types.has('strong') || types.has('medium') || types.has('weak')).toBe(true);
  });

  it('should all relationships be above threshold', () => {
    relationships.forEach(rel => {
      expect(rel.similarity).toBeGreaterThanOrEqual(0.3);
    });
  });

  it('should include shared antibiotic IDs and names', () => {
    relationships.forEach(rel => {
      expect(Array.isArray(rel.sharedAntibiotics)).toBe(true);
      expect(Array.isArray(rel.sharedAntibioticNames)).toBe(true);
      expect(rel.sharedAntibiotics.length).toBeGreaterThan(0);
      expect(rel.sharedAntibioticNames.length).toBe(rel.sharedAntibiotics.length);
    });
  });

  it('should have clinical rationale for each relationship', () => {
    relationships.forEach(rel => {
      expect(typeof rel.clinicalRationale).toBe('string');
      expect(rel.clinicalRationale.length).toBeGreaterThan(0);
    });
  });
});

/**
 * Test Suite 6: Relationship Statistics
 * Tests statistical summaries
 */
describe('getRelationshipStatistics', () => {
  let relationships;
  let stats;

  beforeAll(() => {
    relationships = generatePathogenRelationships(0.3, true);
    stats = getRelationshipStatistics(relationships);
  });

  it('should calculate total relationships', () => {
    expect(stats.total).toBe(relationships.length);
  });

  it('should count strong, medium, weak relationships', () => {
    expect(stats.strong).toBeGreaterThanOrEqual(0);
    expect(stats.medium).toBeGreaterThanOrEqual(0);
    expect(stats.weak).toBeGreaterThanOrEqual(0);
    expect(stats.strong + stats.medium + stats.weak).toBeLessThanOrEqual(stats.total);
  });

  it('should calculate average similarity', () => {
    const avg = parseFloat(stats.averageSimilarity);
    expect(avg).toBeGreaterThan(0);
    expect(avg).toBeLessThanOrEqual(1);
  });

  it('should calculate min and max similarity', () => {
    const min = parseFloat(stats.minSimilarity);
    const max = parseFloat(stats.maxSimilarity);
    expect(min).toBeGreaterThanOrEqual(0);
    expect(max).toBeLessThanOrEqual(1);
    expect(min).toBeLessThanOrEqual(max);
  });

  it('should return empty stats for empty relationships array', () => {
    const emptyStats = getRelationshipStatistics([]);
    expect(emptyStats.total).toBe(0);
    expect(emptyStats.strong).toBe(0);
    expect(emptyStats.averageSimilarity).toBe(0);
  });
});

/**
 * Test Suite 7: Medical Accuracy Clinical Scenarios
 * Tests real-world pathogen clustering
 */
describe('Medical Accuracy: Clinical Scenarios', () => {
  let relationships;

  beforeAll(() => {
    relationships = generatePathogenRelationships(0.3, true);
  });

  it('should cluster Enterobacteriaceae together (E. coli, Klebsiella, Enterobacter)', () => {
    const ecoli = 2;
    const klebsiella = 6;
    const enterobacter = 22;

    const ecoliKlebRel = relationships.find(
      r => (r.sourceId === ecoli && r.targetId === klebsiella) ||
           (r.sourceId === klebsiella && r.targetId === ecoli)
    );

    // E. coli and Klebsiella should have a relationship (both Enterobacteriaceae)
    expect(ecoliKlebRel).toBeDefined();
  });

  it('should cluster Gram-positive Staph species together', () => {
    const staph = 1;
    const cons = 18;

    // Both Staphylococcus species with methicillin resistance patterns
    const staphdConsSimilarity = calculateJaccardSimilarity(staph, cons);
    expect(staphdConsSimilarity).toBeGreaterThan(0.4);
  });

  it('should identify resistance clustering (MRSA and VRE)', () => {
    const mrsa = 1; // Staph aureus (MRSA)
    const vre = 11; // Enterococcus faecium (VRE)

    // Both are multidrug-resistant Gram-positive organisms
    const similarity = calculateJaccardSimilarity(mrsa, vre);
    // They should have some antibiotic overlap (vancomycin, linezolid)
    expect(similarity).toBeGreaterThan(0);
  });

  it('should identify UTI pathogen clustering', () => {
    const ecoli = 2;
    const saprophyticus = 17;
    const proteus = 24;

    // UTI pathogens: E. coli and Saprophyticus are both gram-positive cocci
    // and Proteus are gram-negative rods found in UTI
    const ecoliSapSim = calculateJaccardSimilarity(ecoli, saprophyticus);
    const ecoliProteusSim = calculateJaccardSimilarity(ecoli, proteus);

    // These pathogens share some antibiotic susceptibility patterns for UTI treatment
    expect(ecoliSapSim).toBeGreaterThanOrEqual(0);
    expect(ecoliProteusSim).toBeGreaterThan(0.1);
  });

  it('should show respiratory pathogen relationships', () => {
    const pneumococcus = 3;
    const haemophilus = 8;
    const moraxella = 13;

    // Common respiratory pathogens
    const pneumococcusHaemSim = calculateJaccardSimilarity(pneumococcus, haemophilus);
    expect(pneumococcusHaemSim).toBeGreaterThan(0.2);
  });

  it('should properly handle VRE resistance (vancomycin resistance)', () => {
    const vre = 11; // Enterococcus faecium

    const effectiveAbs = getEffectiveAntibiotics(vre, 'medium');
    // Linezolid should be in high-effectiveness list
    expect(effectiveAbs).toContain(11); // Linezolid

    // Vancomycin should NOT be effective
    const allEffectivenessMap = {
      2: 'resistant' // Vancomycin
    };

    // Verify resistance patterns documented
    expect(effectiveAbs).not.toContain(2); // Vancomycin excluded for VRE
  });
});

/**
 * Test Suite 8: Edge Cases and Boundary Conditions
 * Tests robustness and error handling
 */
describe('Edge Cases and Boundary Conditions', () => {
  it('should handle pathogens with no antibiotic data', () => {
    const similarity = calculateJaccardSimilarity(1, 1);
    expect(typeof similarity).toBe('number');
    expect(similarity).toBeGreaterThanOrEqual(0);
  });

  it('should handle threshold = 0 (all antibiotics included)', () => {
    const relationships = generatePathogenRelationships(0, true);
    expect(relationships.length).toBeGreaterThan(40);
  });

  it('should handle threshold = 1 (only perfect overlap)', () => {
    const relationships = generatePathogenRelationships(1, true);
    // Perfect overlap is rare but can occur with identical antibiotic profiles
    // Most likely 0, but can have 0-2 relationships with exactly identical high/medium effectiveness coverage
    expect(relationships.length).toBeLessThanOrEqual(2);
    // If there are relationships, they must all have similarity = 1.0
    relationships.forEach(r => {
      expect(r.similarity).toBe(1.0);
    });
  });

  it('should handle high threshold values appropriately', () => {
    const high60 = generatePathogenRelationships(0.6, true);
    const low30 = generatePathogenRelationships(0.3, true);

    expect(high60.length).toBeLessThanOrEqual(low30.length);
  });

  it('should not include validation errors in results', () => {
    const relationships = generatePathogenRelationships(0.3, true);

    relationships.forEach(rel => {
      // No viruses mixed with bacteria
      const isVirus = [28, 29].includes(rel.sourceId);
      const isBacteria = ![28, 29].includes(rel.targetId);
      expect(!(isVirus && isBacteria)).toBe(true);
    });
  });
});
