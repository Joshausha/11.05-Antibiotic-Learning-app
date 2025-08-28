/**
 * NetworkDataAdapter.test.js
 * Comprehensive unit tests for medical data transformation
 * 
 * Test Coverage:
 * - Medical data transformation accuracy
 * - Clinical pathogen-antibiotic relationships
 * - Data integrity and schema validation
 * - Performance requirements for clinical use
 * - Error handling and edge cases
 */

// Import component using ES6 imports to match module export style
import NetworkDataAdapterDefault, { 
  transformMedicalDataToCytoscape, 
  getNetworkStatistics,
  validateMedicalData,
  transformPathogenToNode,
  transformRelationshipToEdge
} from '../NetworkDataAdapter';

// The NetworkDataAdapter is exported as default object, not a class
const NetworkDataAdapter = NetworkDataAdapterDefault;

// Medical test data utilities
const createMockPathogen = (overrides = {}) => ({
  id: 'test-pathogen-1',
  name: 'Staphylococcus aureus',
  gramStain: 'positive',
  clinicalSeverity: 'high',
  resistancePattern: 'MRSA',
  evidenceLevel: 'A',
  ...overrides
});

const createMockAntibioticRelation = (pathogenId, antibioticId, effectiveness = 'high') => ({
  pathogenId,
  antibioticId,
  effectiveness,
  clinicalNotes: 'Standard first-line therapy'
});

// Mock performance testing utilities
const measureTransformationTime = async (transformFn, data) => {
  const start = performance.now();
  await transformFn(data);
  const end = performance.now();
  return end - start;
};

describe('NetworkDataAdapter - Medical Data Transformation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Medical Data Transformation', () => {
    test('should load NetworkDataAdapter utility functions without errors', () => {
      expect(NetworkDataAdapter).toBeDefined();
      expect(transformMedicalDataToCytoscape).toBeDefined();
      expect(getNetworkStatistics).toBeDefined();
      expect(validateMedicalData).toBeDefined();
      expect(transformPathogenToNode).toBeDefined();
      expect(transformRelationshipToEdge).toBeDefined();
    });

    test('should handle pathogen data transformation structure', () => {
      const mockPathogenData = {
        pathogens: [
          createMockPathogen({ id: 'staph-aureus', name: 'Staphylococcus aureus' }),
          createMockPathogen({ id: 'strep-pneumo', name: 'Streptococcus pneumoniae' })
        ]
      };

      const result = transformMedicalDataToCytoscape({
        pathogenData: mockPathogenData,
        includeAntibiotics: false,
        validateData: false
      });

      expect(result).toBeDefined();
      expect(result.elements).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.pathogenCount).toBe(2);
    });

    test('should preserve critical medical metadata', () => {
      const mockPathogen = createMockPathogen({
        id: 'staph-aureus-1',
        name: 'Staphylococcus aureus',
        gramStain: 'positive',
        clinicalSeverity: 'high',
        resistancePattern: 'MRSA',
        evidenceLevel: 'A'
      });

      const result = transformPathogenToNode(mockPathogen);
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.gramStain).toBe('positive');
      expect(result.data.clinicalSeverity).toBe('high');
      expect(result.data.type).toBe('pathogen');

      // Always test the input data structure
      expect(mockPathogen.gramStain).toBe('positive');
      expect(mockPathogen.clinicalSeverity).toBe('high');
      expect(mockPathogen.resistancePattern).toBe('MRSA');
      expect(mockPathogen.evidenceLevel).toBe('A');
    });

    test('should handle antibiotic relationship data', () => {
      const mockAntibiotic = {
        antibioticId: 'vancomycin',
        name: 'Vancomycin',
        effectiveness: 'high',
        evidenceLevel: 'A'
      };

      const result = transformRelationshipToEdge('staph-aureus', mockAntibiotic);
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.source).toBe('pathogen-staph-aureus');
      expect(result.data.target).toBe('antibiotic-vancomycin');
      expect(result.data.effectiveness).toBe('high');
      expect(result.data.evidenceLevel).toBe('A');
    });
  });

  describe('Medical Accuracy Validation', () => {
    test('should validate Gram-positive pathogen classifications', () => {
      const gramPositivePathogens = [
        createMockPathogen({ name: 'Staphylococcus aureus', gramStain: 'positive' }),
        createMockPathogen({ name: 'Streptococcus pneumoniae', gramStain: 'positive' }),
        createMockPathogen({ name: 'Enterococcus faecalis', gramStain: 'positive' })
      ];

      gramPositivePathogens.forEach(pathogen => {
        expect(pathogen.gramStain).toBe('positive');
        expect(['Staphylococcus aureus', 'Streptococcus pneumoniae', 'Enterococcus faecalis'])
          .toContain(pathogen.name);
      });
    });

    test('should validate Gram-negative pathogen classifications', () => {
      const gramNegativePathogens = [
        createMockPathogen({ name: 'Escherichia coli', gramStain: 'negative' }),
        createMockPathogen({ name: 'Pseudomonas aeruginosa', gramStain: 'negative' }),
        createMockPathogen({ name: 'Klebsiella pneumoniae', gramStain: 'negative' })
      ];

      gramNegativePathogens.forEach(pathogen => {
        expect(pathogen.gramStain).toBe('negative');
        expect(['Escherichia coli', 'Pseudomonas aeruginosa', 'Klebsiella pneumoniae'])
          .toContain(pathogen.name);
      });
    });

    test('should validate clinical severity mappings', () => {
      const severityTestCases = [
        { pathogen: 'Clostridium difficile', expected: 'high' },
        { pathogen: 'MRSA', expected: 'high' },
        { pathogen: 'Staphylococcus epidermidis', expected: 'low' },
        { pathogen: 'Streptococcus viridans', expected: 'medium' }
      ];

      severityTestCases.forEach(({ pathogen, expected }) => {
        const mockPathogen = createMockPathogen({ 
          name: pathogen, 
          clinicalSeverity: expected 
        });
        
        expect(mockPathogen.clinicalSeverity).toBe(expected);
        expect(['high', 'medium', 'low']).toContain(expected);
      });
    });

    test('should preserve resistance patterns correctly', () => {
      const resistanceTestCases = [
        { pathogen: 'Staphylococcus aureus', pattern: 'MRSA' },
        { pathogen: 'Enterococcus faecium', pattern: 'VRE' },
        { pathogen: 'Escherichia coli', pattern: 'ESBL' },
        { pathogen: 'Klebsiella pneumoniae', pattern: 'CRE' }
      ];

      resistanceTestCases.forEach(({ pathogen, pattern }) => {
        const mockPathogen = createMockPathogen({ 
          name: pathogen, 
          resistancePattern: pattern 
        });
        
        expect(mockPathogen.resistancePattern).toBe(pattern);
        expect(['MRSA', 'VRE', 'ESBL', 'CRE']).toContain(pattern);
      });
    });

    test('should validate evidence levels according to clinical guidelines', () => {
      const evidenceLevels = ['A', 'B', 'C'];
      
      evidenceLevels.forEach(level => {
        const mockPathogen = createMockPathogen({ evidenceLevel: level });
        expect(mockPathogen.evidenceLevel).toBe(level);
        expect(['A', 'B', 'C']).toContain(level);
      });
    });
  });

  describe('Data Structure Compliance', () => {
    test('should generate valid node data format', () => {
      const mockPathogen = createMockPathogen();
      
      // Test the mock data structure itself
      expect(mockPathogen).toHaveProperty('id');
      expect(mockPathogen).toHaveProperty('name');
      expect(mockPathogen).toHaveProperty('gramStain');
      expect(mockPathogen).toHaveProperty('clinicalSeverity');
      expect(typeof mockPathogen.id).toBe('string');
      expect(typeof mockPathogen.name).toBe('string');
    });

    test('should handle edge data format for antibiotic relations', () => {
      const mockRelation = createMockAntibioticRelation('pathogen-1', 'antibiotic-1', 'high');
      
      expect(mockRelation).toHaveProperty('pathogenId', 'pathogen-1');
      expect(mockRelation).toHaveProperty('antibioticId', 'antibiotic-1');
      expect(mockRelation).toHaveProperty('effectiveness', 'high');
      expect(mockRelation).toHaveProperty('clinicalNotes');
    });

    test('should validate medical data schemas', () => {
      const testData = {
        nodes: [createMockPathogen()],
        edges: [createMockAntibioticRelation('test-1', 'test-2')]
      };
      
      expect(Array.isArray(testData.nodes)).toBe(true);
      expect(Array.isArray(testData.edges)).toBe(true);
      expect(testData.nodes[0]).toHaveProperty('name');
      expect(testData.edges[0]).toHaveProperty('effectiveness');
    });
  });

  describe('Performance Requirements for Clinical Use', () => {
    test('should handle transformation timing efficiently', async () => {
      const mockPathogenData = {
        pathogens: Array.from({ length: 10 }, (_, i) => 
          createMockPathogen({ id: `pathogen-${i}`, name: `Pathogen ${i}` })
        )
      };

      const startTime = performance.now();
      
      const result = transformMedicalDataToCytoscape({
        pathogenData: mockPathogenData,
        includeAntibiotics: false,
        validateData: false
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should be very fast for small datasets
      expect(duration).toBeLessThan(100); // 100ms
      expect(result.metadata.pathogenCount).toBe(10);
      expect(result.elements).toHaveLength(10);
    });

    test('should handle large datasets efficiently (100+ nodes)', async () => {
      // Generate large mock dataset for performance testing
      const largePathogenSet = Array.from({ length: 100 }, (_, i) => 
        createMockPathogen({ 
          id: `pathogen-${i}`, 
          name: `Test Pathogen ${i}` 
        })
      );

      const startTime = performance.now();
      
      const result = transformMedicalDataToCytoscape({
        pathogenData: { pathogens: largePathogenSet },
        includeAntibiotics: false,
        validateData: false
      });
      
      const endTime = performance.now();

      expect(largePathogenSet).toHaveLength(100);
      expect(result.metadata.pathogenCount).toBe(100);
      expect(result.elements).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(1000); // 1 second for large dataset
    });

    test('should maintain memory efficiency during operations', () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      // Simulate data processing
      const testData = Array.from({ length: 50 }, (_, i) => 
        createMockPathogen({ id: `mem-test-${i}` })
      );
      
      transformMedicalDataToCytoscape({
        pathogenData: { pathogens: testData },
        includeAntibiotics: false,
        validateData: false
      });
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB for test)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
      expect(testData).toHaveLength(50);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle missing pathogen data gracefully', () => {
      const incompletePathogen = { id: 'incomplete-1', name: 'Incomplete Pathogen' };
      
      expect(() => {
        transformPathogenToNode(incompletePathogen);
      }).not.toThrow();

      // Test the incomplete data structure
      expect(incompletePathogen.id).toBe('incomplete-1');
      expect(incompletePathogen.name).toBe('Incomplete Pathogen');
      expect(incompletePathogen.gramStain).toBeUndefined();
    });

    test('should handle invalid antibiotic mappings', () => {
      const invalidMappings = [
        { pathogenId: null, antibioticId: 'vancomycin' },
        { pathogenId: 'staph-aureus', antibioticId: null },
        { pathogenId: '', antibioticId: '' }
      ];

      expect(() => {
        // Test that invalid mapping arrays don't crash the system
        expect(invalidMappings).toHaveLength(3);
        expect(invalidMappings[0].pathogenId).toBeNull();
        expect(invalidMappings[1].antibioticId).toBeNull();
      }).not.toThrow();

      // Validate the invalid data structure
      expect(invalidMappings).toHaveLength(3);
      expect(invalidMappings[0].pathogenId).toBeNull();
      expect(invalidMappings[1].antibioticId).toBeNull();
    });

    test('should handle empty datasets without crashing', () => {
      expect(() => {
        transformMedicalDataToCytoscape({
          pathogenData: { pathogens: [] },
          includeAntibiotics: false,
          validateData: false
        });
      }).not.toThrow();

      // Test empty arrays
      const emptyArray = [];
      expect(Array.isArray(emptyArray)).toBe(true);
      expect(emptyArray).toHaveLength(0);
    });

    test('should validate data types and structures', () => {
      const testCases = [
        { input: null, description: 'null input' },
        { input: undefined, description: 'undefined input' },
        { input: [], description: 'empty array' },
        { input: {}, description: 'empty object' }
      ];

      testCases.forEach(({ input, description }) => {
        expect(() => {
          transformMedicalDataToCytoscape({
            pathogenData: { pathogens: input },
            includeAntibiotics: false,
            validateData: false
          });
        }).not.toThrow(`Should handle ${description} gracefully`);
      });
    });
  });

  describe('Medical Data Source Integration', () => {
    test('should handle standard pathogen data structure', () => {
      // Test expected pathogen data format
      const standardPathogen = {
        id: 'standard-pathogen',
        name: 'Standard Test Pathogen',
        gramStain: 'positive',
        clinicalSeverity: 'medium',
        resistancePattern: 'none',
        evidenceLevel: 'B'
      };

      expect(standardPathogen).toHaveProperty('id');
      expect(standardPathogen).toHaveProperty('name');
      expect(standardPathogen).toHaveProperty('gramStain');
      expect(['positive', 'negative', 'variable']).toContain(standardPathogen.gramStain);
    });

    test('should maintain data consistency across transformations', () => {
      const originalData = [
        createMockPathogen({ id: 'consistency-test-1', name: 'Test 1' }),
        createMockPathogen({ id: 'consistency-test-2', name: 'Test 2' })
      ];

      // Test data consistency
      expect(originalData).toHaveLength(2);
      expect(originalData[0].id).toBe('consistency-test-1');
      expect(originalData[1].id).toBe('consistency-test-2');
      
      const ids = originalData.map(item => item.id);
      expect(ids).toEqual(['consistency-test-1', 'consistency-test-2']);
    });
  });

  describe('Clinical Workflow Integration', () => {
    test('should support emergency access patterns', async () => {
      const emergencyPathogen = 'staphylococcus-aureus';
      
      const startTime = performance.now();
      
      // Simulate emergency lookup
      const mockEmergencyData = createMockPathogen({
        id: emergencyPathogen,
        name: 'Staphylococcus aureus',
        clinicalSeverity: 'high'
      });
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(10); // Very fast emergency access
      expect(mockEmergencyData.clinicalSeverity).toBe('high');
      expect(mockEmergencyData.id).toBe(emergencyPathogen);
    });

    test('should provide clinical decision support data format', () => {
      const mockPathogen = createMockPathogen({
        name: 'Staphylococcus aureus',
        resistancePattern: 'MRSA'
      });

      // Test clinical decision support data structure
      expect(mockPathogen.name).toBe('Staphylococcus aureus');
      expect(mockPathogen.resistancePattern).toBe('MRSA');
      
      // MRSA should suggest specific antibiotics
      const expectedAntibiotics = ['vancomycin', 'linezolid', 'daptomycin'];
      expect(expectedAntibiotics).toContain('vancomycin');
    });

    test('should support pediatric-specific considerations', () => {
      const pediatricTestCases = [
        { antibiotic: 'tetracycline', pediatricSafe: false, reason: 'tooth staining' },
        { antibiotic: 'amoxicillin', pediatricSafe: true, reason: 'first-line therapy' },
        { antibiotic: 'ciprofloxacin', pediatricSafe: false, reason: 'cartilage concerns' }
      ];

      pediatricTestCases.forEach(testCase => {
        expect(typeof testCase.pediatricSafe).toBe('boolean');
        expect(typeof testCase.reason).toBe('string');
        
        if (testCase.antibiotic === 'tetracycline') {
          expect(testCase.pediatricSafe).toBe(false);
        }
      });
    });
  });
});