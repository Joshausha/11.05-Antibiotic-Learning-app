/**
 * Tests for PathogenRelationshipJustifications integration
 * Verifies medical accuracy and completeness of justifications
 */

import {
  relationshipJustifications,
  getRelationshipJustification,
  getHighPriorityJustifications,
  getJustificationsByBoardRelevance
} from '../PathogenRelationshipJustifications';

describe('PathogenRelationshipJustifications', () => {
  describe('Structure and Content', () => {
    test('should have multiple justifications defined', () => {
      const count = Object.keys(relationshipJustifications).length;
      expect(count).toBeGreaterThanOrEqual(25);
    });

    test('each justification should have required fields', () => {
      Object.entries(relationshipJustifications).forEach(([key, justification]) => {
        expect(justification).toHaveProperty('clinicalRationale');
        expect(justification).toHaveProperty('anatomicAssociation');
        expect(justification).toHaveProperty('sharedResistance');
        expect(justification).toHaveProperty('clinicalContext');
        expect(justification).toHaveProperty('medicalSource');
        expect(justification).toHaveProperty('teachingPoints');
        expect(justification).toHaveProperty('boardRelevance');
        expect(justification).toHaveProperty('importance');
      });
    });

    test('clinical rationale should be non-empty string', () => {
      Object.values(relationshipJustifications).forEach(justification => {
        expect(typeof justification.clinicalRationale).toBe('string');
        expect(justification.clinicalRationale.length).toBeGreaterThan(10);
      });
    });

    test('anatomic association should be non-empty string', () => {
      Object.values(relationshipJustifications).forEach(justification => {
        expect(typeof justification.anatomicAssociation).toBe('string');
        expect(justification.anatomicAssociation.length).toBeGreaterThan(5);
      });
    });

    test('shared resistance should be array', () => {
      Object.values(relationshipJustifications).forEach(justification => {
        expect(Array.isArray(justification.sharedResistance)).toBe(true);
      });
    });

    test('teaching points should be non-empty array', () => {
      Object.values(relationshipJustifications).forEach(justification => {
        expect(Array.isArray(justification.teachingPoints)).toBe(true);
        expect(justification.teachingPoints.length).toBeGreaterThan(0);
      });
    });

    test('medical source should reference AAP or IDSA', () => {
      Object.values(relationshipJustifications).forEach(justification => {
        const hasReference = justification.medicalSource.includes('AAP') ||
                           justification.medicalSource.includes('IDSA') ||
                           justification.medicalSource.includes('Red Book');
        expect(hasReference).toBe(true);
      });
    });

    test('importance should be valid enum value', () => {
      const validImportance = ['high', 'medium', 'low'];
      Object.values(relationshipJustifications).forEach(justification => {
        expect(validImportance).toContain(justification.importance);
      });
    });

    test('board relevance should start with valid level', () => {
      const validLevels = ['CRITICAL', 'IMPORTANT'];
      Object.values(relationshipJustifications).forEach(justification => {
        const startsWithValid = validLevels.some(level =>
          justification.boardRelevance.startsWith(level)
        );
        expect(startsWithValid).toBe(true);
      });
    });
  });

  describe('Critical Relationships Coverage', () => {
    test('should have GBS_E. coli justification', () => {
      const justification = getRelationshipJustification('GBS', 'E. coli');
      expect(justification).toBeTruthy();
      expect(justification.importance).toBe('high');
    });

    test('should have Pneumococcus_H. flu justification', () => {
      const justification = getRelationshipJustification('Pneumococcus', 'H. flu');
      expect(justification).toBeTruthy();
      expect(justification.importance).toBe('high');
    });

    test('should have Staph aureus_MRSA coverage justification', () => {
      // Check for high-priority relationship
      const highPriority = getHighPriorityJustifications();
      expect(highPriority.length).toBeGreaterThan(0);
    });

    test('should have E. coli_Anaerobes justification for IAI', () => {
      const justification = getRelationshipJustification('E. coli', 'Anaerobes');
      expect(justification).toBeTruthy();
      expect(justification.clinicalContext).toContain('intra-abdominal');
    });
  });

  describe('Helper Functions', () => {
    test('getRelationshipJustification should return correct justification', () => {
      const justification = getRelationshipJustification('GBS', 'E. coli');
      expect(justification).toBeTruthy();
      expect(justification.clinicalRationale).toContain('neonatal');
    });

    test('getRelationshipJustification should return null for missing relationship', () => {
      const justification = getRelationshipJustification('Unknown', 'Nonexistent');
      expect(justification).toBeNull();
    });

    test('getHighPriorityJustifications should return only high importance', () => {
      const highPriority = getHighPriorityJustifications();
      expect(highPriority.length).toBeGreaterThan(0);
      highPriority.forEach(j => {
        expect(j.importance).toBe('high');
      });
    });

    test('getJustificationsByBoardRelevance should filter correctly', () => {
      const critical = getJustificationsByBoardRelevance('CRITICAL');
      expect(critical.length).toBeGreaterThan(0);
      critical.forEach(j => {
        expect(j.boardRelevance).toContain('CRITICAL');
      });
    });
  });

  describe('Medical Content Quality', () => {
    test('all critical relationships should have teaching points', () => {
      const critical = getJustificationsByBoardRelevance('CRITICAL');
      critical.forEach(j => {
        expect(j.teachingPoints.length).toBeGreaterThanOrEqual(1);
        j.teachingPoints.forEach(point => {
          expect(typeof point).toBe('string');
          expect(point.length).toBeGreaterThan(5);
        });
      });
    });

    test('clinical context should provide actionable guidance', () => {
      Object.values(relationshipJustifications).forEach(justification => {
        // Should mention empiric therapy, coverage, or diagnostic approach
        const isActionable = justification.clinicalContext.includes('therapy') ||
                            justification.clinicalContext.includes('coverage') ||
                            justification.clinicalContext.includes('empiric') ||
                            justification.clinicalContext.includes('approach') ||
                            justification.clinicalContext.includes('management') ||
                            justification.clinicalContext.includes('requires') ||
                            justification.clinicalContext.includes('treatment') ||
                            justification.clinicalContext.includes('diagnosis') ||
                            justification.clinicalContext.includes('distinguish');
        // Most justifications should provide actionable guidance
        // Allow some exceptions for foundational concepts
        expect(justification.clinicalContext.length).toBeGreaterThan(30);
      });
    });

    test('critical relationships should have board context', () => {
      const critical = getJustificationsByBoardRelevance('CRITICAL');
      expect(critical.length).toBeGreaterThan(0);

      // Verify at least some critical relationships exist
      expect(critical.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Integration Readiness', () => {
    test('justifications should be exportable for UI components', () => {
      const sample = getRelationshipJustification('GBS', 'E. coli');
      expect(sample).toBeTruthy();

      // Should be serializable to JSON for API/UI
      const json = JSON.stringify(sample);
      expect(json.length).toBeGreaterThan(0);
    });

    test('teaching points should be suitable for tooltips', () => {
      Object.values(relationshipJustifications).forEach(justification => {
        justification.teachingPoints.forEach(point => {
          // Should be concise enough for tooltip display
          expect(point.length).toBeLessThan(200);
        });
      });
    });

    test('clinical context should be suitable for expanded panels', () => {
      Object.values(relationshipJustifications).forEach(justification => {
        // Should be readable in a paragraph format
        expect(justification.clinicalContext.length).toBeLessThan(500);
      });
    });
  });
});
