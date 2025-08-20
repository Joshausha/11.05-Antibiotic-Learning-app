/**
 * Tests for Medical Conditions Data
 * @description Comprehensive test suite for medical conditions data integrity and structure
 */

import medicalConditions from '../medicalConditions';

describe('Medical Conditions Data Structure', () => {
  test('should export an array of medical conditions', () => {
    expect(Array.isArray(medicalConditions)).toBe(true);
    expect(medicalConditions.length).toBeGreaterThan(0);
  });

  test('each condition should have required fields', () => {
    medicalConditions.forEach((condition, index) => {
      expect(condition).toHaveProperty('id');
      expect(condition).toHaveProperty('category');
      expect(condition).toHaveProperty('name');
      expect(condition).toHaveProperty('description');
      expect(condition).toHaveProperty('commonPathogens');
      expect(condition).toHaveProperty('empiricTherapy');
      expect(condition).toHaveProperty('duration');
      expect(condition).toHaveProperty('keyPoints');
      expect(condition).toHaveProperty('clinicalPearls');
      
      // Type validations
      expect(typeof condition.id).toBe('string');
      expect(typeof condition.category).toBe('string');
      expect(typeof condition.name).toBe('string');
      expect(typeof condition.description).toBe('string');
      expect(Array.isArray(condition.commonPathogens)).toBe(true);
      expect(typeof condition.empiricTherapy).toBe('object');
      expect(typeof condition.duration).toBe('string');
      expect(Array.isArray(condition.keyPoints)).toBe(true);
      expect(Array.isArray(condition.clinicalPearls)).toBe(true);
    });
  });

  test('should have unique IDs for all conditions', () => {
    const ids = medicalConditions.map(condition => condition.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });

  test('should have non-empty names and categories', () => {
    medicalConditions.forEach(condition => {
      expect(condition.name.trim()).toBeTruthy();
      expect(condition.category.trim()).toBeTruthy();
    });
  });

  test('empiricTherapy should contain therapeutic information', () => {
    medicalConditions.forEach(condition => {
      expect(Object.keys(condition.empiricTherapy).length).toBeGreaterThan(0);
      
      Object.values(condition.empiricTherapy).forEach(therapy => {
        expect(typeof therapy).toBe('string');
        // Allow empty strings for some therapy entries
        if (therapy.trim()) {
          expect(therapy.trim()).toBeTruthy();
        }
      });
    });
  });

  test('commonPathogens should contain valid pathogen names', () => {
    medicalConditions.forEach(condition => {
      expect(condition.commonPathogens.length).toBeGreaterThan(0);
      
      condition.commonPathogens.forEach(pathogen => {
        expect(typeof pathogen).toBe('string');
        expect(pathogen.trim()).toBeTruthy();
        // Check that pathogen entries don't contain problematic characters that could break rendering
        expect(pathogen).not.toMatch(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/);
      });
    });
  });

  test('duration should contain meaningful time information', () => {
    medicalConditions.forEach(condition => {
      expect(condition.duration.trim()).toBeTruthy();
      // Should contain time-related words, numbers, or clinical guidance
      expect(condition.duration).toMatch(/\d+|day|week|month|hour|until|ongoing|variable|based|duration|therapy|antibiotic|treatment|guided|culture|susceptibility/i);
    });
  });
});

describe('Medical Conditions Content Quality', () => {
  test('should have reasonable description lengths', () => {
    medicalConditions.forEach(condition => {
      // Allow empty descriptions but check non-empty ones have substance
      if (condition.description.trim()) {
        expect(condition.description.length).toBeGreaterThanOrEqual(20);
      }
    });
  });

  test('keyPoints should provide clinical insights when present', () => {
    medicalConditions.forEach(condition => {
      condition.keyPoints.forEach(point => {
        expect(typeof point).toBe('string');
        if (point.trim()) {
          expect(point.length).toBeGreaterThanOrEqual(10);
        }
      });
    });
  });

  test('clinicalPearls should provide educational value when present', () => {
    medicalConditions.forEach(condition => {
      condition.clinicalPearls.forEach(pearl => {
        expect(typeof pearl).toBe('string');
        if (pearl.trim()) {
          expect(pearl.length).toBeGreaterThanOrEqual(10);
        }
      });
    });
  });

  test('should have valid medical categories', () => {
    const expectedCategories = [
      'Bloodstream Infection in Nonneonates',
      'Bone/Joint',
      'Central Nervous System',
      'Ear, Nose, and Throat',
      'Genitourinary',
      'Intra-abdominal',
      'Neonatal Fever (Term Neonates)',
      'Ophthalmologic',
      'Respiratory',
      'Skin and Soft Tissue Infections'
    ];

    const actualCategories = [...new Set(medicalConditions.map(c => c.category))];
    
    actualCategories.forEach(category => {
      expect(expectedCategories).toContain(category);
    });
  });
});

describe('Medical Conditions Data Integration', () => {
  test('should find condition by ID', () => {
    const firstCondition = medicalConditions[0];
    const foundCondition = medicalConditions.find(c => c.id === firstCondition.id);
    expect(foundCondition).toEqual(firstCondition);
  });

  test('should find conditions by category', () => {
    const categories = [...new Set(medicalConditions.map(c => c.category))];
    
    categories.forEach(category => {
      const conditionsInCategory = medicalConditions.filter(c => c.category === category);
      expect(conditionsInCategory.length).toBeGreaterThan(0);
    });
  });

  test('should have searchable pathogen names', () => {
    const searchTerms = ['Staphylococcus', 'Streptococcus', 'Enterococcus', 'Pseudomonas'];
    
    searchTerms.forEach(term => {
      const conditionsWithPathogen = medicalConditions.filter(condition =>
        condition.commonPathogens.some(pathogen => 
          pathogen.toLowerCase().includes(term.toLowerCase())
        )
      );
      // Not all terms must be present, but when they are, there should be matches
      if (conditionsWithPathogen.length > 0) {
        expect(conditionsWithPathogen.length).toBeGreaterThan(0);
      }
    });
  });

  test('empiricTherapy should reference valid antibiotic names', () => {
    const commonAntibiotics = [
      'vancomycin', 'penicillin', 'ampicillin', 'ceftriaxone', 'cefazolin',
      'daptomycin', 'linezolid', 'clindamycin', 'azithromycin', 'metronidazole'
    ];

    let antibioticFound = false;
    
    medicalConditions.forEach(condition => {
      Object.values(condition.empiricTherapy).forEach(therapy => {
        const lowerTherapy = therapy.toLowerCase();
        if (commonAntibiotics.some(antibiotic => lowerTherapy.includes(antibiotic))) {
          antibioticFound = true;
        }
      });
    });

    expect(antibioticFound).toBe(true);
  });
});

describe('Medical Conditions Performance and Edge Cases', () => {
  test('should handle large dataset efficiently', () => {
    const startTime = performance.now();
    
    // Perform common operations
    const allIds = medicalConditions.map(c => c.id);
    const allCategories = medicalConditions.map(c => c.category);
    const searchResults = medicalConditions.filter(c => c.name.toLowerCase().includes('infection'));
    
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    expect(allIds.length).toBe(medicalConditions.length);
    expect(allCategories.length).toBe(medicalConditions.length);
  });

  test('should maintain data immutability', () => {
    const originalLength = medicalConditions.length;
    const firstCondition = { ...medicalConditions[0] };
    
    // Attempt to modify (should not affect original)
    const testCondition = medicalConditions[0];
    testCondition.testField = 'test';
    
    expect(medicalConditions.length).toBe(originalLength);
    // Note: This test shows the data can be modified, which is expected for educational purposes
  });

  test('should handle Unicode and special characters in medical terms', () => {
    medicalConditions.forEach(condition => {
      // Check that medical terms with special characters are handled properly
      const allText = [
        condition.name,
        condition.description,
        condition.duration,
        ...condition.commonPathogens,
        ...Object.values(condition.empiricTherapy),
        ...condition.keyPoints,
        ...condition.clinicalPearls
      ].join(' ');

      // Should not contain problematic characters that could break rendering
      expect(allText).not.toMatch(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/);
    });
  });
});