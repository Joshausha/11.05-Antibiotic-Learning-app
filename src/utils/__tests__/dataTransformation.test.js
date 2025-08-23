/**
 * Tests for Data Transformation Utilities
 * @description Comprehensive test suite for data transformation functions
 */

import {
  transformEmpiricTherapy,
  transformDuration,
  transformNotes,
  transformCondition,
  transformRboDataset,
  validateCondition,
  getDatasetStats
} from '../dataTransformation';

describe('Data Transformation - transformEmpiricTherapy', () => {
  test('should transform therapy array to object format', () => {
    const therapyArray = [
      { condition: 'MSSA', therapy: 'Cefazolin OR Oxacillin' },
      { condition: 'MRSA', therapy: 'Vancomycin OR Linezolid' }
    ];

    const result = transformEmpiricTherapy(therapyArray);

    expect(typeof result).toBe('object');
    expect(result.MSSA).toBe('Cefazolin OR Oxacillin');
    expect(result.MRSA).toBe('Vancomycin OR Linezolid');
  });

  test('should handle empty or invalid input', () => {
    expect(transformEmpiricTherapy([])).toEqual({});
    expect(transformEmpiricTherapy(null)).toEqual({});
    expect(transformEmpiricTherapy(undefined)).toEqual({});
    expect(transformEmpiricTherapy('not an array')).toEqual({});
  });

  test('should use default condition name when missing', () => {
    const therapyArray = [
      { therapy: 'Some antibiotic' }
    ];

    const result = transformEmpiricTherapy(therapyArray);

    expect(result['Standard Treatment']).toBe('Some antibiotic');
  });

  test('should handle therapy items with missing therapy field', () => {
    const therapyArray = [
      { condition: 'Test', therapy: 'Valid therapy' },
      { condition: 'Invalid' }
    ];

    const result = transformEmpiricTherapy(therapyArray);

    expect(result.Test).toBe('Valid therapy');
    expect(result.Invalid).toBeUndefined();
  });
});

describe('Data Transformation - transformDuration', () => {
  test('should return first duration from array', () => {
    const durationArray = ['14 days', '7-10 days', '21 days'];
    const result = transformDuration(durationArray);

    expect(result).toBe('14 days');
  });

  test('should handle single duration', () => {
    const durationArray = ['7 days'];
    const result = transformDuration(durationArray);

    expect(result).toBe('7 days');
  });

  test('should handle empty or invalid input', () => {
    expect(transformDuration([])).toBe('Duration varies based on clinical response');
    expect(transformDuration(null)).toBe('Duration varies based on clinical response');
    expect(transformDuration(undefined)).toBe('Duration varies based on clinical response');
    expect(transformDuration('not an array')).toBe('Duration varies based on clinical response');
  });

  test('should handle array with empty strings', () => {
    const durationArray = ['', '14 days'];
    const result = transformDuration(durationArray);

    expect(result).toBe(''); // Returns first element even if empty
  });
});

describe('Data Transformation - transformNotes', () => {
  test('should separate notes into keyPoints and clinicalPearls', () => {
    const notes = [
      'Key clinical point about treatment',
      'Clinical pearl: Resistance patterns',
      'Important consideration for therapy'
    ];

    const result = transformNotes(notes);

    expect(result).toHaveProperty('keyPoints');
    expect(result).toHaveProperty('clinicalPearls');
    expect(Array.isArray(result.keyPoints)).toBe(true);
    expect(Array.isArray(result.clinicalPearls)).toBe(true);
  });

  test('should handle empty or invalid input', () => {
    expect(transformNotes([])).toEqual({ keyPoints: [], clinicalPearls: [] });
    expect(transformNotes(null)).toEqual({ keyPoints: [], clinicalPearls: [] });
    expect(transformNotes(undefined)).toEqual({ keyPoints: [], clinicalPearls: [] });
    expect(transformNotes('not an array')).toEqual({ keyPoints: [], clinicalPearls: [] });
  });

  test('should handle mixed note types', () => {
    const notes = [
      'Clinical pearl information',
      'Regular key point',
      'Another clinical consideration'
    ];

    const result = transformNotes(notes);

    expect(result.keyPoints.length + result.clinicalPearls.length).toBeLessThanOrEqual(notes.length);
  });
});

describe('Data Transformation - transformCondition', () => {
  const mockCondition = {
    id: 'test_condition',
    category: 'Test Category',
    name: 'Test Condition',
    description: 'Test description',
    commonPathogens: ['Pathogen A', 'Pathogen B'],
    empiricAntibioticTherapy: [
      { condition: 'Standard', therapy: 'Test therapy' }
    ],
    antibioticDuration: ['7 days'],
    notes: ['Key point 1', 'Clinical pearl 1']
  };

  test('should transform complete condition object', () => {
    const result = transformCondition(mockCondition);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('commonPathogens');
    expect(result).toHaveProperty('empiricTherapy');
    expect(result).toHaveProperty('duration');
    expect(result).toHaveProperty('keyPoints');
    expect(result).toHaveProperty('clinicalPearls');

    expect(result.id).toBe(mockCondition.id);
    expect(result.name).toBe(mockCondition.name);
    expect(Array.isArray(result.commonPathogens)).toBe(true);
    expect(typeof result.empiricTherapy).toBe('object');
  });

  test('should handle condition with missing fields', () => {
    const incompleteCondition = {
      id: 'incomplete',
      name: 'Incomplete Condition'
    };

    const result = transformCondition(incompleteCondition);

    expect(result.id).toBe('incomplete');
    expect(result.name).toBe('Incomplete Condition');
    expect(result.description).toBe('');
    expect(Array.isArray(result.commonPathogens)).toBe(true);
    expect(typeof result.empiricTherapy).toBe('object');
  });

  test('should handle null/undefined condition', () => {
    expect(() => transformCondition(null)).not.toThrow();
    expect(() => transformCondition(undefined)).not.toThrow();

    const result1 = transformCondition(null);
    const result2 = transformCondition(undefined);

    expect(typeof result1).toBe('object');
    expect(typeof result2).toBe('object');
  });

  test('should preserve original data structure where appropriate', () => {
    const result = transformCondition(mockCondition);

    expect(result.commonPathogens).toEqual(mockCondition.commonPathogens);
    expect(result.id).toBe(mockCondition.id);
    expect(result.category).toBe(mockCondition.category);
  });
});

describe('Data Transformation - transformRboDataset', () => {
  const mockDataset = [
    {
      id: 'condition1',
      category: 'Category A',
      name: 'Condition 1',
      commonPathogens: ['Pathogen 1'],
      empiricAntibioticTherapy: [{ therapy: 'Therapy 1' }]
    },
    {
      id: 'condition2',
      category: 'Category B',
      name: 'Condition 2',
      commonPathogens: ['Pathogen 2'],
      empiricAntibioticTherapy: [{ therapy: 'Therapy 2' }]
    }
  ];

  test('should transform entire dataset', () => {
    const result = transformRboDataset(mockDataset);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(mockDataset.length);

    result.forEach((condition, index) => {
      expect(condition.id).toBe(mockDataset[index].id);
      expect(condition.name).toBe(mockDataset[index].name);
    });
  });

  test('should handle empty dataset', () => {
    const result = transformRboDataset([]);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  test('should handle invalid input', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result1 = transformRboDataset(null);
    const result2 = transformRboDataset('not an array');

    expect(Array.isArray(result1)).toBe(true);
    expect(Array.isArray(result2)).toBe(true);
    expect(result1.length).toBe(0);
    expect(result2.length).toBe(0);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('should handle mixed valid/invalid conditions', () => {
    const mixedDataset = [
      mockDataset[0],
      null,
      mockDataset[1],
      undefined,
      { id: 'partial' }
    ];

    const result = transformRboDataset(mixedDataset);

    expect(Array.isArray(result)).toBe(true);
    // Should filter out null and undefined entries, leaving 3 valid items
    expect(result.length).toBe(3);
  });
});

describe('Data Transformation - validateCondition', () => {
  const validCondition = {
    id: 'valid_condition',
    category: 'Valid Category',
    name: 'Valid Condition',
    commonPathogens: ['Pathogen'],
    empiricTherapy: { Standard: 'Therapy' }
  };

  test('should validate complete condition', () => {
    const isValid = validateCondition(validCondition);
    expect(isValid).toBe(true);
  });

  test('should detect missing required fields', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const incompleteCondition = {
      id: 'incomplete',
      name: 'Incomplete'
      // Missing: category, commonPathogens, empiricTherapy
    };

    const isValid = validateCondition(incompleteCondition);
    expect(isValid).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test('should handle null/undefined condition', () => {
    expect(() => validateCondition(null)).toThrow();
    expect(() => validateCondition(undefined)).toThrow();
  });

  test('should validate all required fields', () => {
    const requiredFields = ['id', 'category', 'name', 'commonPathogens', 'empiricTherapy'];
    
    requiredFields.forEach(field => {
      const testCondition = { ...validCondition };
      delete testCondition[field];

      const isValid = validateCondition(testCondition);
      expect(isValid).toBe(false);
    });
  });
});

describe('Data Transformation - getDatasetStats', () => {
  const mockTransformedData = [
    { id: '1', category: 'Category A', name: 'Condition 1', commonPathogens: [], empiricTherapy: {} },
    { id: '2', category: 'Category A', name: 'Condition 2', commonPathogens: [], empiricTherapy: {} },
    { id: '3', category: 'Category B', name: 'Condition 3', commonPathogens: [], empiricTherapy: {} },
    { id: '4', category: 'Category B', name: 'Condition 4', commonPathogens: [], empiricTherapy: {} },
    { id: '5', category: 'Category C', name: 'Condition 5', commonPathogens: [], empiricTherapy: {} }
  ];

  test('should generate comprehensive dataset statistics', () => {
    const stats = getDatasetStats(mockTransformedData);

    expect(stats).toHaveProperty('totalConditions');
    expect(stats).toHaveProperty('categories');
    expect(stats).toHaveProperty('categoryCount');
    expect(stats).toHaveProperty('validConditions');

    expect(stats.totalConditions).toBe(5);
    expect(Array.isArray(stats.categories)).toBe(true);
    expect(stats.categories.length).toBe(3);
    expect(typeof stats.categoryCount).toBe('object');
  });

  test('should count categories correctly', () => {
    const stats = getDatasetStats(mockTransformedData);

    expect(stats.categoryCount['Category A']).toBe(2);
    expect(stats.categoryCount['Category B']).toBe(2);
    expect(stats.categoryCount['Category C']).toBe(1);
  });

  test('should handle empty dataset', () => {
    const stats = getDatasetStats([]);

    expect(stats.totalConditions).toBe(0);
    expect(stats.categories.length).toBe(0);
    expect(Object.keys(stats.categoryCount).length).toBe(0);
    expect(stats.validConditions).toBe(0);
  });

  test('should count valid vs invalid conditions', () => {
    const mixedData = [
      ...mockTransformedData,
      { id: 'incomplete' } // Invalid condition
    ];

    const stats = getDatasetStats(mixedData);

    expect(stats.totalConditions).toBe(6);
    expect(stats.validConditions).toBeLessThanOrEqual(stats.totalConditions);
  });

  test('should handle duplicate categories', () => {
    const duplicateData = [
      { id: '1', category: 'Same Category', name: 'Condition 1', commonPathogens: [], empiricTherapy: {} },
      { id: '2', category: 'Same Category', name: 'Condition 2', commonPathogens: [], empiricTherapy: {} }
    ];

    const stats = getDatasetStats(duplicateData);

    expect(stats.categories.length).toBe(1);
    expect(stats.categoryCount['Same Category']).toBe(2);
  });
});

describe('Data Transformation - Integration Tests', () => {
  test('should handle complete transformation workflow', () => {
    const rawRboData = [
      {
        id: 'integration_test',
        category: 'Test Category',
        name: 'Integration Test Condition',
        description: 'Test description',
        commonPathogens: ['Test Pathogen'],
        empiricAntibioticTherapy: [
          { condition: 'Standard', therapy: 'Test Therapy' }
        ],
        antibioticDuration: ['7-14 days'],
        notes: ['Key clinical point', 'Important consideration']
      }
    ];

    // Full transformation workflow
    const transformed = transformRboDataset(rawRboData);
    const stats = getDatasetStats(transformed);
    const isValid = transformed.every(validateCondition);

    expect(transformed.length).toBe(1);
    expect(stats.totalConditions).toBe(1);
    expect(stats.validConditions).toBeGreaterThan(0);
    expect(isValid).toBe(true);

    const condition = transformed[0];
    expect(condition.id).toBe(rawRboData[0].id);
    expect(condition.empiricTherapy.Standard).toBe('Test Therapy');
    expect(condition.duration).toBe('7-14 days');
  });

  test('should maintain data integrity through transformations', () => {
    const originalData = {
      id: 'integrity_test',
      category: 'Test',
      name: 'Integrity Test',
      commonPathogens: ['Original Pathogen'],
      empiricAntibioticTherapy: [{ therapy: 'Original Therapy' }]
    };

    const transformed = transformCondition(originalData);

    expect(transformed.id).toBe(originalData.id);
    expect(transformed.commonPathogens).toEqual(originalData.commonPathogens);
    expect(validateCondition(transformed)).toBe(true);
  });

  test('should handle large datasets efficiently', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: `condition_${i}`,
      category: `Category ${i % 10}`,
      name: `Condition ${i}`,
      commonPathogens: [`Pathogen ${i}`],
      empiricAntibioticTherapy: [{ therapy: `Therapy ${i}` }]
    }));

    const startTime = performance.now();
    
    const transformed = transformRboDataset(largeDataset);
    const stats = getDatasetStats(transformed);
    
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
    expect(transformed.length).toBe(1000);
    expect(stats.totalConditions).toBe(1000);
    expect(stats.categories.length).toBe(10);
  });
});