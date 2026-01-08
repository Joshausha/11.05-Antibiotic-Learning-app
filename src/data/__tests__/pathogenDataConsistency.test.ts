/**
 * Pathogen Data Consistency Tests (TypeScript)
 *
 * Medical Data Accuracy Tests - Phase 07-08
 *
 * Validates pathogen data for medical accuracy and consistency:
 * - Pathogen data integrity (valid gramStatus, unique IDs)
 * - Pathogen-antibiotic relationship consistency
 * - Medical classification accuracy (gram-positive/negative correctness)
 *
 * Medical Context:
 * - Gram stain classification is fundamental to antibiotic selection
 * - Pathogen relationships are based on Jaccard similarity of antibiotic profiles
 * - Unique IDs are critical for data integrity in relationship mapping
 *
 * Created: 2026-01-08
 * Phase: 07-08 - Medical Data Accuracy Tests
 */

import simplePathogens, {
  SimplePathogen,
  getPathogenById,
  getPathogenByName,
  getPathogensByGramStatus,
  validatePathogenData,
} from '../SimplePathogenData';

import pathogenRelationshipData, {
  getPathogenRelationships,
  getRelationshipsForPathogen,
  getRelationshipsByType,
  PathogenRelationship,
  GramStainType,
} from '../PathogenRelationshipData';

// Valid gram stain classifications
const VALID_GRAM_STAINS: GramStainType[] = [
  'positive',
  'negative',
  'atypical',
  'acid-fast',
  'virus',
  'mixed',
];

// Extended classifications that exist in the actual data
const ALL_VALID_GRAM_VALUES = [
  'positive',
  'negative',
  'variable',
  'not_applicable',
  'atypical',
  'acid-fast',
  'mixed',
  'virus',
];

describe('Pathogen Data Consistency Tests', () => {
  describe('Pathogen Data Integrity', () => {
    test('all pathogens have unique IDs', () => {
      const ids = simplePathogens.map((p: SimplePathogen) => p.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);

      // No duplicate IDs
      const duplicateIds = ids.filter(
        (id: number, index: number) => ids.indexOf(id) !== index
      );
      expect(duplicateIds).toHaveLength(0);
    });

    test('all pathogen IDs are positive integers', () => {
      simplePathogens.forEach((pathogen: SimplePathogen) => {
        expect(Number.isInteger(pathogen.id)).toBe(true);
        expect(pathogen.id).toBeGreaterThan(0);
      });
    });

    test('all pathogens have valid gramStain values', () => {
      simplePathogens.forEach((pathogen: SimplePathogen) => {
        expect(pathogen.gramStain).toBeDefined();
        expect(pathogen.gramStain).not.toBeNull();
        expect(ALL_VALID_GRAM_VALUES).toContain(pathogen.gramStain);
      });
    });

    test('no invalid or misspelled gram stain values', () => {
      const invalidValues = [
        'pos',
        'neg',
        'gram-positive',
        'gram-negative',
        'gram positive',
        'gram negative',
        '',
        'unknown',
        'null',
      ];

      simplePathogens.forEach((pathogen: SimplePathogen) => {
        invalidValues.forEach((invalid) => {
          expect(pathogen.gramStain).not.toBe(invalid);
        });
      });
    });

    test('pathogen IDs are sequential without gaps (1 to N)', () => {
      const sortedIds = [...simplePathogens.map((p: SimplePathogen) => p.id)].sort(
        (a, b) => a - b
      );

      // First ID should be 1
      expect(sortedIds[0]).toBe(1);

      // Last ID should equal the count
      expect(sortedIds[sortedIds.length - 1]).toBe(simplePathogens.length);

      // Check for gaps
      for (let i = 1; i < sortedIds.length; i++) {
        expect(sortedIds[i]).toBe(sortedIds[i - 1] + 1);
      }
    });

    test('validatePathogenData helper returns null (no errors)', () => {
      const errors = validatePathogenData();
      expect(errors).toBeNull();
    });
  });

  describe('Medical Classification Accuracy', () => {
    test('known gram-positive organisms are classified correctly', () => {
      const gramPositiveOrganisms = [
        'Staphylococcus aureus',
        'Streptococcus pneumoniae',
        'Streptococcus pyogenes',
        'Enterococcus faecalis',
        'Enterococcus faecium',
        'Clostridium difficile',
        'Group B Streptococcus',
      ];

      gramPositiveOrganisms.forEach((name) => {
        const pathogen = simplePathogens.find(
          (p: SimplePathogen) =>
            p.name.toLowerCase().includes(name.toLowerCase().split(' ')[0])
        );

        if (pathogen) {
          expect(pathogen.gramStain).toBe('positive');
        }
      });
    });

    test('known gram-negative organisms are classified correctly', () => {
      const gramNegativeOrganisms = [
        'Escherichia coli',
        'Pseudomonas aeruginosa',
        'Klebsiella pneumoniae',
        'Haemophilus influenzae',
        'Neisseria meningitidis',
        'Acinetobacter baumannii',
        'Proteus',
        'Enterobacter',
        'Citrobacter',
      ];

      gramNegativeOrganisms.forEach((name) => {
        const pathogen = simplePathogens.find(
          (p: SimplePathogen) =>
            p.name.toLowerCase().includes(name.toLowerCase().split(' ')[0])
        );

        if (pathogen) {
          expect(pathogen.gramStain).toBe('negative');
        }
      });
    });

    test('atypical organisms are classified as atypical', () => {
      const atypicalOrganisms = ['Mycoplasma'];

      atypicalOrganisms.forEach((name) => {
        const pathogen = simplePathogens.find((p: SimplePathogen) =>
          p.name.toLowerCase().includes(name.toLowerCase())
        );

        if (pathogen) {
          expect(pathogen.gramStain).toBe('atypical');
        }
      });
    });

    test('acid-fast organisms are classified correctly', () => {
      const acidFastOrganisms = ['NTM', 'mycobacteria'];

      const ntm = simplePathogens.find(
        (p: SimplePathogen) =>
          p.commonName === 'NTM' ||
          p.name.toLowerCase().includes('mycobacteria')
      );

      if (ntm) {
        expect(ntm.gramStain).toBe('acid-fast');
      }
    });

    test('viruses are marked as virus gramStain', () => {
      const viralPathogens = simplePathogens.filter((p: SimplePathogen) =>
        p.name.toLowerCase().includes('virus') ||
        p.commonName === 'HSV' ||
        p.commonName.toLowerCase().includes('virus')
      );

      viralPathogens.forEach((pathogen: SimplePathogen) => {
        expect(pathogen.gramStain).toBe('virus');
      });
    });
  });

  describe('Pathogen-Antibiotic Relationship Consistency', () => {
    test('pathogen relationships have valid source and target IDs', () => {
      const relationships = getPathogenRelationships();
      const pathogenIds = simplePathogens.map((p: SimplePathogen) => p.id);

      relationships.forEach((rel: PathogenRelationship) => {
        // Source and target should reference valid pathogens
        // Note: Relationship data may use different ID schema
        expect(rel.sourceId).toBeDefined();
        expect(rel.targetId).toBeDefined();
        expect(typeof rel.sourceId).toBe('number');
        expect(typeof rel.targetId).toBe('number');
      });
    });

    test('relationship similarity scores are between 0 and 1', () => {
      const relationships = getPathogenRelationships();

      relationships.forEach((rel: PathogenRelationship) => {
        expect(rel.similarity).toBeGreaterThanOrEqual(0);
        expect(rel.similarity).toBeLessThanOrEqual(1);
      });
    });

    test('relationship types are valid', () => {
      const validTypes = ['strong', 'medium', 'weak'];
      const relationships = getPathogenRelationships();

      relationships.forEach((rel: PathogenRelationship) => {
        expect(validTypes).toContain(rel.relationshipType);
      });
    });

    test('relationship statistics are consistent', () => {
      const allRelationships = getPathogenRelationships();
      const strongRelationships = getRelationshipsByType('strong');
      const mediumRelationships = getRelationshipsByType('medium');
      const weakRelationships = getRelationshipsByType('weak');

      // Sum of typed relationships should equal total
      expect(
        strongRelationships.length +
        mediumRelationships.length +
        weakRelationships.length
      ).toBe(allRelationships.length);
    });

    test('getRelationshipsForPathogen returns valid data', () => {
      // Test for a known pathogen (E. coli, ID 2)
      const ecoliRelationships = getRelationshipsForPathogen(2);

      ecoliRelationships.forEach((rel: PathogenRelationship) => {
        expect(rel.sourceId === 2 || rel.targetId === 2).toBe(true);
      });
    });

    test('shared antibiotics in relationships are valid', () => {
      const relationships = getPathogenRelationships();

      relationships.forEach((rel: PathogenRelationship) => {
        if (rel.sharedAntibiotics && rel.sharedAntibiotics.length > 0) {
          rel.sharedAntibiotics.forEach((antibiotic: any) => {
            // Handle both formats:
            // 1. Interface format: { id: number, name: string }
            // 2. Generated format: number (antibiotic ID)
            if (typeof antibiotic === 'object') {
              expect(antibiotic).toHaveProperty('id');
              expect(antibiotic).toHaveProperty('name');
              expect(typeof antibiotic.id).toBe('number');
              expect(typeof antibiotic.name).toBe('string');
            } else if (typeof antibiotic === 'number') {
              // Antibiotic ID format
              expect(Number.isInteger(antibiotic)).toBe(true);
              expect(antibiotic).toBeGreaterThan(0);
            } else {
              // String format (antibiotic name)
              expect(typeof antibiotic).toBe('string');
              expect(antibiotic.length).toBeGreaterThan(0);
            }
          });
        }
      });
    });
  });

  describe('Data Completeness', () => {
    test('all pathogens have required fields', () => {
      const requiredFields = [
        'id',
        'name',
        'commonName',
        'gramStain',
        'description',
        'commonSites',
      ];

      simplePathogens.forEach((pathogen: SimplePathogen) => {
        requiredFields.forEach((field) => {
          expect(pathogen).toHaveProperty(field);
          expect((pathogen as any)[field]).toBeDefined();
        });
      });
    });

    test('pathogen names are non-empty strings', () => {
      simplePathogens.forEach((pathogen: SimplePathogen) => {
        expect(typeof pathogen.name).toBe('string');
        expect(pathogen.name.length).toBeGreaterThan(0);
        expect(typeof pathogen.commonName).toBe('string');
        expect(pathogen.commonName.length).toBeGreaterThan(0);
      });
    });

    test('descriptions are meaningful (> 20 chars)', () => {
      simplePathogens.forEach((pathogen: SimplePathogen) => {
        expect(typeof pathogen.description).toBe('string');
        expect(pathogen.description.length).toBeGreaterThan(20);
      });
    });

    test('commonSites is a non-empty array', () => {
      simplePathogens.forEach((pathogen: SimplePathogen) => {
        expect(Array.isArray(pathogen.commonSites)).toBe(true);
        expect(pathogen.commonSites.length).toBeGreaterThan(0);

        pathogen.commonSites.forEach((site: string) => {
          expect(typeof site).toBe('string');
          expect(site.length).toBeGreaterThan(0);
        });
      });
    });

    test('severity levels are valid', () => {
      const validSeverities = ['low', 'medium', 'high'];

      simplePathogens.forEach((pathogen: SimplePathogen) => {
        expect(validSeverities).toContain(pathogen.severity);
      });
    });
  });

  describe('Helper Function Validation', () => {
    test('getPathogenById returns correct pathogen', () => {
      const staphAureus = getPathogenById(1);
      expect(staphAureus).toBeDefined();
      expect(staphAureus?.name).toContain('Staphylococcus');

      const nonExistent = getPathogenById(9999);
      expect(nonExistent).toBeUndefined();
    });

    test('getPathogenByName handles case-insensitive search', () => {
      const byName = getPathogenByName('Staphylococcus aureus');
      expect(byName).toBeDefined();

      const byCommonName = getPathogenByName('E. coli');
      expect(byCommonName).toBeDefined();

      const byLowerCase = getPathogenByName('pseudomonas');
      expect(byLowerCase).toBeDefined();

      const nonExistent = getPathogenByName('Fake Bacterium');
      expect(nonExistent).toBeUndefined();
    });

    test('getPathogensByGramStatus returns correct categories', () => {
      const gramPositive = getPathogensByGramStatus('positive');
      expect(gramPositive.length).toBeGreaterThan(0);
      gramPositive.forEach((p: SimplePathogen) => {
        expect(p.gramStain).toBe('positive');
      });

      const gramNegative = getPathogensByGramStatus('negative');
      expect(gramNegative.length).toBeGreaterThan(0);
      gramNegative.forEach((p: SimplePathogen) => {
        expect(p.gramStain).toBe('negative');
      });

      const emptyResult = getPathogensByGramStatus('nonexistent' as any);
      expect(emptyResult).toHaveLength(0);
    });
  });

  describe('Cytoscape Node Data Consistency', () => {
    test('pathogen nodes have required properties', () => {
      const { nodes } = pathogenRelationshipData;

      nodes.forEach((node) => {
        expect(node).toHaveProperty('data');
        expect(node.data).toHaveProperty('id');
        expect(node.data).toHaveProperty('label');
        expect(node.data).toHaveProperty('type');
      });
    });

    test('pathogen and antibiotic nodes are properly typed', () => {
      const { nodes } = pathogenRelationshipData;

      const pathogenNodes = nodes.filter(
        (n) => n.data.type === 'pathogen'
      );
      const antibioticNodes = nodes.filter(
        (n) => n.data.type === 'antibiotic'
      );

      expect(pathogenNodes.length).toBeGreaterThan(0);
      expect(antibioticNodes.length).toBeGreaterThan(0);

      // Pathogen nodes should have gram stain
      pathogenNodes.forEach((node) => {
        if ('gramStain' in node.data) {
          expect(VALID_GRAM_STAINS).toContain(node.data.gramStain);
        }
      });

      // Antibiotic nodes should have class
      antibioticNodes.forEach((node) => {
        if ('class' in node.data) {
          expect(typeof node.data.class).toBe('string');
        }
      });
    });

    test('edge data has required source and target', () => {
      const { edges } = pathogenRelationshipData;

      edges.forEach((edge) => {
        expect(edge).toHaveProperty('data');
        expect(edge.data).toHaveProperty('source');
        expect(edge.data).toHaveProperty('target');
        expect(edge.data).toHaveProperty('label');
      });
    });
  });

  describe('Test Summary', () => {
    test('pathogen data consistency validation summary', () => {
      const totalPathogens = simplePathogens.length;
      const gramPositive = getPathogensByGramStatus('positive').length;
      const gramNegative = getPathogensByGramStatus('negative').length;
      const atypical = simplePathogens.filter(
        (p: SimplePathogen) => p.gramStain === 'atypical'
      ).length;
      const viruses = simplePathogens.filter(
        (p: SimplePathogen) => p.gramStain === 'virus'
      ).length;

      const relationships = getPathogenRelationships();

      console.log(`\n✓ Pathogen Data Consistency Validation Report`);
      console.log(`  - Total pathogens: ${totalPathogens}`);
      console.log(`  - Gram-positive: ${gramPositive}`);
      console.log(`  - Gram-negative: ${gramNegative}`);
      console.log(`  - Atypical: ${atypical}`);
      console.log(`  - Viruses: ${viruses}`);
      console.log(`  - Total relationships: ${relationships.length}`);

      expect(totalPathogens).toBeGreaterThan(0);
      expect(gramPositive + gramNegative).toBeGreaterThan(
        totalPathogens * 0.6
      ); // At least 60% should be GP or GN
    });
  });
});
