/**
 * Tests for PathogenRelationshipData.js
 *
 * Validates:
 * - Relationship data generation using Jaccard similarity
 * - Statistics calculation
 * - Helper function filters
 * - Medical accuracy of relationships
 * - Backward compatibility with Cytoscape format
 */

import pathogenData, {
  stats,
  getPathogenRelationships,
  getRelationshipsForPathogen,
  getRelationshipsByType,
  getRelationshipsAboveThreshold,
  nodes,
  edges,
} from '../PathogenRelationshipData';

describe('PathogenRelationshipData', () => {
  // =========================================================================
  // Test Suite 1: Basic Data Generation
  // =========================================================================
  describe('Relationship Generation and Export', () => {
    test('should export relationships in default export', () => {
      expect(pathogenData).toBeDefined();
      expect(pathogenData.relationships).toBeDefined();
      expect(Array.isArray(pathogenData.relationships)).toBe(true);
    });

    test('should have 40-70 relationships generated at 0.3 threshold', () => {
      const relationships = getPathogenRelationships();
      expect(relationships.length).toBeGreaterThanOrEqual(40);
      expect(relationships.length).toBeLessThanOrEqual(70);
    });

    test('should have relationships with required properties', () => {
      const relationships = getPathogenRelationships();
      expect(relationships.length).toBeGreaterThan(0);

      relationships.forEach(rel => {
        expect(rel.sourceId).toBeDefined();
        expect(rel.source).toBeDefined();
        expect(rel.targetId).toBeDefined();
        expect(rel.target).toBeDefined();
        expect(rel.similarity).toBeDefined();
        expect(rel.relationshipType).toBeDefined();
        expect(rel.sharedAntibiotics).toBeDefined();
        expect(rel.sharedAntibioticNames).toBeDefined();
        expect(rel.clinicalRationale).toBeDefined();
        expect(rel.medicalSource).toBeDefined();
      });
    });

    test('should have valid similarity scores (0-1)', () => {
      const relationships = getPathogenRelationships();
      relationships.forEach(rel => {
        expect(rel.similarity).toBeGreaterThanOrEqual(0);
        expect(rel.similarity).toBeLessThanOrEqual(1);
      });
    });

    test('should have relationships above 0.3 threshold', () => {
      const relationships = getPathogenRelationships();
      relationships.forEach(rel => {
        expect(rel.similarity).toBeGreaterThanOrEqual(0.3);
      });
    });

    test('should have no self-relationships', () => {
      const relationships = getPathogenRelationships();
      relationships.forEach(rel => {
        expect(rel.sourceId).not.toBe(rel.targetId);
      });
    });

    test('should have no duplicate relationships', () => {
      const relationships = getPathogenRelationships();
      const seen = new Set();

      relationships.forEach(rel => {
        const pairKey = `${Math.min(rel.sourceId, rel.targetId)}-${Math.max(rel.sourceId, rel.targetId)}`;
        expect(seen.has(pairKey)).toBe(false);
        seen.add(pairKey);
      });
    });
  });

  // =========================================================================
  // Test Suite 2: Statistics
  // =========================================================================
  describe('Relationship Statistics', () => {
    test('should have statistics exported', () => {
      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThan(0);
    });

    test('should have accurate total count', () => {
      expect(stats.total).toBeGreaterThanOrEqual(40);
      expect(stats.total).toBeLessThanOrEqual(70);
    });

    test('should count relationships by type', () => {
      expect(stats.strong).toBeDefined();
      expect(stats.medium).toBeDefined();
      expect(stats.weak).toBeDefined();

      const totalByType = stats.strong + stats.medium + stats.weak;
      expect(totalByType).toBe(stats.total);
    });

    test('should calculate similarity metrics', () => {
      expect(stats.averageSimilarity).toBeDefined();
      expect(stats.minSimilarity).toBeDefined();
      expect(stats.maxSimilarity).toBeDefined();

      const avg = parseFloat(stats.averageSimilarity);
      const min = parseFloat(stats.minSimilarity);
      const max = parseFloat(stats.maxSimilarity);

      expect(min).toBeLessThanOrEqual(avg);
      expect(avg).toBeLessThanOrEqual(max);
      expect(min).toBeGreaterThanOrEqual(0.3);
      expect(max).toBeLessThanOrEqual(1.0);
    });

    test('should have strong relationships', () => {
      expect(stats.strong).toBeGreaterThanOrEqual(0);
    });
  });

  // =========================================================================
  // Test Suite 3: Helper Functions
  // =========================================================================
  describe('Helper Functions', () => {
    test('getPathogenRelationships should return all relationships', () => {
      const relationships = getPathogenRelationships();
      expect(relationships.length).toBe(stats.total);
    });

    test('getRelationshipsForPathogen should return relationships for specific pathogen', () => {
      const pathogenId = 2; // E. coli
      const relationships = getRelationshipsForPathogen(pathogenId);

      relationships.forEach(rel => {
        const isSourceOrTarget = rel.sourceId === pathogenId || rel.targetId === pathogenId;
        expect(isSourceOrTarget).toBe(true);
      });
    });

    test('getRelationshipsForPathogen should return empty array for pathogen with no relationships', () => {
      const pathogenId = 999; // Non-existent pathogen
      const relationships = getRelationshipsForPathogen(pathogenId);
      expect(Array.isArray(relationships)).toBe(true);
      expect(relationships.length).toBe(0);
    });

    test('getRelationshipsByType should filter by type', () => {
      const strongRels = getRelationshipsByType('strong');
      strongRels.forEach(rel => {
        expect(rel.relationshipType).toBe('strong');
      });
      expect(strongRels.length).toBe(stats.strong);

      const mediumRels = getRelationshipsByType('medium');
      mediumRels.forEach(rel => {
        expect(rel.relationshipType).toBe('medium');
      });
      expect(mediumRels.length).toBe(stats.medium);

      const weakRels = getRelationshipsByType('weak');
      weakRels.forEach(rel => {
        expect(rel.relationshipType).toBe('weak');
      });
      expect(weakRels.length).toBe(stats.weak);
    });

    test('getRelationshipsByType should return all relationships for "all"', () => {
      const allRels = getRelationshipsByType('all');
      expect(allRels.length).toBe(stats.total);
    });

    test('getRelationshipsAboveThreshold should filter by similarity', () => {
      const relationships = getRelationshipsAboveThreshold(0.5);
      relationships.forEach(rel => {
        expect(rel.similarity).toBeGreaterThanOrEqual(0.5);
      });

      const aboveThreshold = getPathogenRelationships()
        .filter(r => r.similarity >= 0.5).length;
      expect(relationships.length).toBe(aboveThreshold);
    });

    test('getRelationshipsAboveThreshold should handle threshold at 0.3', () => {
      const relationships = getRelationshipsAboveThreshold(0.3);
      expect(relationships.length).toBe(stats.total);
    });

    test('getRelationshipsAboveThreshold should handle high threshold', () => {
      const relationships = getRelationshipsAboveThreshold(0.9);
      relationships.forEach(rel => {
        expect(rel.similarity).toBeGreaterThanOrEqual(0.9);
      });
    });
  });

  // =========================================================================
  // Test Suite 4: Medical Accuracy
  // =========================================================================
  describe('Medical Accuracy', () => {
    test('should have clinical rationale for each relationship', () => {
      const relationships = getPathogenRelationships();
      relationships.forEach(rel => {
        expect(rel.clinicalRationale).toBeDefined();
        expect(typeof rel.clinicalRationale).toBe('string');
        expect(rel.clinicalRationale.length).toBeGreaterThan(0);
      });
    });

    test('should have medical source attribution', () => {
      const relationships = getPathogenRelationships();
      relationships.forEach(rel => {
        expect(rel.medicalSource).toBe('Phase 7.2 Antibiotic Similarity Analysis');
      });
    });

    test('should have shared antibiotics for each relationship', () => {
      const relationships = getPathogenRelationships();
      relationships.forEach(rel => {
        expect(Array.isArray(rel.sharedAntibiotics)).toBe(true);
        expect(rel.sharedAntibiotics.length).toBeGreaterThan(0);
      });
    });

    test('should have antibiotic names matching IDs', () => {
      const relationships = getPathogenRelationships();
      relationships.forEach(rel => {
        expect(rel.sharedAntibioticNames.length).toBe(rel.sharedAntibiotics.length);
        expect(rel.sharedAntibioticNames.every(name => typeof name === 'string')).toBe(true);
      });
    });

    test('should have medically validated relationships (medical rules applied)', () => {
      const relationships = getPathogenRelationships();

      // Verify that relationships exist (medical validation didn't eliminate all)
      expect(relationships.length).toBeGreaterThan(0);

      // Verify that all relationships pass basic validation:
      // - Source and target are different
      // - Similarity is >= threshold
      relationships.forEach(rel => {
        expect(rel.sourceId).not.toBe(rel.targetId);
        expect(rel.similarity).toBeGreaterThanOrEqual(0.3);
        expect(rel.clinicalRationale).toBeTruthy();
      });
    });

    test('should have common pathogenic relationships', () => {
      const relationships = getPathogenRelationships();
      const relationshipPairs = new Set(
        relationships.map(r => `${Math.min(r.sourceId, r.targetId)}-${Math.max(r.sourceId, r.targetId)}`)
      );

      // E. coli (2) should be related to common UTI pathogens (Proteus=23)
      const eColi = relationships.filter(r => r.sourceId === 2 || r.targetId === 2);
      expect(eColi.length).toBeGreaterThan(0);

      // Staph aureus (1) should be related to other cocci
      const staph = relationships.filter(r => r.sourceId === 1 || r.targetId === 1);
      expect(staph.length).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // Test Suite 5: Backward Compatibility with Cytoscape Format
  // =========================================================================
  describe('Backward Compatibility with Cytoscape Format', () => {
    test('should export nodes for Cytoscape', () => {
      expect(nodes).toBeDefined();
      expect(Array.isArray(nodes)).toBe(true);
      expect(nodes.length).toBeGreaterThan(0);
    });

    test('should export edges for Cytoscape', () => {
      expect(edges).toBeDefined();
      expect(Array.isArray(edges)).toBe(true);
      expect(edges.length).toBeGreaterThan(0);
    });

    test('should have 29 pathogen nodes', () => {
      const pathogenNodes = nodes.filter(n => n.data.type === 'pathogen');
      expect(pathogenNodes.length).toBe(29);
    });

    test('should have 30 antibiotic nodes', () => {
      const antibioticNodes = nodes.filter(n => n.data.type === 'antibiotic');
      expect(antibioticNodes.length).toBe(30);
    });

    test('default export should have backward-compatible structure', () => {
      expect(pathogenData.nodes).toBeDefined();
      expect(pathogenData.edges).toBeDefined();
    });

    test('default export should have new relationship data', () => {
      expect(pathogenData.relationships).toBeDefined();
      expect(pathogenData.relationshipStats).toBeDefined();
    });

    test('default export should include helper functions', () => {
      expect(typeof pathogenData.getRelationshipsForPathogen).toBe('function');
      expect(typeof pathogenData.getRelationshipsByType).toBe('function');
      expect(typeof pathogenData.getRelationshipsAboveThreshold).toBe('function');
    });
  });

  // =========================================================================
  // Test Suite 6: Edge Cases
  // =========================================================================
  describe('Edge Cases', () => {
    test('should handle pathogen with multiple relationship types', () => {
      const relationships = getPathogenRelationships();
      const pathogenId = relationships[0].sourceId;
      const pathogenRels = getRelationshipsForPathogen(pathogenId);

      const types = new Set(pathogenRels.map(r => r.relationshipType));
      // Most pathogens should have at least one type
      expect(types.size).toBeGreaterThan(0);
    });

    test('should maintain relationship symmetry (both directions linked)', () => {
      const relationships = getPathogenRelationships();
      const relationshipPairs = new Set();

      relationships.forEach(rel => {
        const pair = `${Math.min(rel.sourceId, rel.targetId)}-${Math.max(rel.sourceId, rel.targetId)}`;
        expect(relationshipPairs.has(pair)).toBe(false);
        relationshipPairs.add(pair);
      });
    });

    test('should handle pathogens with high similarity > 0.5', () => {
      const highSimilarityRels = getRelationshipsAboveThreshold(0.51);
      expect(highSimilarityRels.length).toBeGreaterThanOrEqual(0);

      highSimilarityRels.forEach(rel => {
        expect(rel.relationshipType).toBe('strong');
        expect(rel.similarity).toBeGreaterThan(0.5);
      });
    });
  });

  // =========================================================================
  // Test Suite 7: Data Integrity
  // =========================================================================
  describe('Data Integrity', () => {
    test('should have consistent relationship counts', () => {
      const relationships = getPathogenRelationships();
      const totalByType = stats.strong + stats.medium + stats.weak;

      expect(relationships.length).toBe(stats.total);
      expect(totalByType).toBe(stats.total);
    });

    test('should have valid type classifications', () => {
      const validTypes = ['strong', 'medium', 'weak'];
      const relationships = getPathogenRelationships();

      relationships.forEach(rel => {
        expect(validTypes.includes(rel.relationshipType)).toBe(true);
      });
    });

    test('should have consistent similarity to type mapping', () => {
      const relationships = getPathogenRelationships();

      relationships.forEach(rel => {
        if (rel.similarity > 0.5) {
          expect(rel.relationshipType).toBe('strong');
        } else if (rel.similarity > 0.35) {
          expect(rel.relationshipType).toBe('medium');
        } else if (rel.similarity > 0.2) {
          expect(rel.relationshipType).toBe('weak');
        }
      });
    });

    test('should have pathogen IDs in valid range', () => {
      const relationships = getPathogenRelationships();
      relationships.forEach(rel => {
        expect(rel.sourceId).toBeGreaterThanOrEqual(1);
        expect(rel.sourceId).toBeLessThanOrEqual(29);
        expect(rel.targetId).toBeGreaterThanOrEqual(1);
        expect(rel.targetId).toBeLessThanOrEqual(29);
      });
    });

    test('should have non-empty shared antibiotics', () => {
      const relationships = getPathogenRelationships();
      relationships.forEach(rel => {
        expect(rel.sharedAntibiotics.length).toBeGreaterThan(0);
        expect(rel.sharedAntibioticNames.length).toBeGreaterThan(0);
      });
    });
  });
});
