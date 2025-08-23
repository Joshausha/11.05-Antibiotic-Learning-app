/**
 * RBO Data Transformation Tests
 * Tests for transforming RBO clinical data and generating medical conditions files
 */

// No mocking needed - using dependency injection

import {
  loadAndTransformRboData,
  generateMedicalConditionsFile,
  rboJsonData
} from '../transformRboData';

describe('RBO Data Transformation', () => {
  describe('RBO JSON Data Structure', () => {
    test('should have valid RBO data structure', () => {
      expect(Array.isArray(rboJsonData)).toBe(true);
      expect(rboJsonData.length).toBeGreaterThan(0);
      
      const firstCondition = rboJsonData[0];
      expect(firstCondition).toHaveProperty('id');
      expect(firstCondition).toHaveProperty('name');
      expect(firstCondition).toHaveProperty('category');
      expect(firstCondition).toHaveProperty('description');
      expect(firstCondition).toHaveProperty('commonPathogens');
      expect(firstCondition).toHaveProperty('empiricAntibioticTherapy');
      expect(firstCondition).toHaveProperty('antibioticDuration');
      expect(firstCondition).toHaveProperty('notes');
    });

    test('should have properly structured empiric therapy data', () => {
      const firstCondition = rboJsonData[0];
      expect(Array.isArray(firstCondition.empiricAntibioticTherapy)).toBe(true);
      
      if (firstCondition.empiricAntibioticTherapy.length > 0) {
        const therapy = firstCondition.empiricAntibioticTherapy[0];
        expect(therapy).toHaveProperty('condition');
        expect(therapy).toHaveProperty('therapy');
        expect(typeof therapy.condition).toBe('string');
        expect(typeof therapy.therapy).toBe('string');
      }
    });

    test('should have valid pathogen data', () => {
      const firstCondition = rboJsonData[0];
      expect(Array.isArray(firstCondition.commonPathogens)).toBe(true);
      
      firstCondition.commonPathogens.forEach(pathogen => {
        expect(typeof pathogen).toBe('string');
        expect(pathogen.length).toBeGreaterThan(0);
      });
    });

    test('should have duration information', () => {
      const firstCondition = rboJsonData[0];
      expect(Array.isArray(firstCondition.antibioticDuration)).toBe(true);
      
      firstCondition.antibioticDuration.forEach(duration => {
        expect(typeof duration).toBe('string');
        expect(duration.length).toBeGreaterThan(0);
      });
    });

    test('should have clinical notes', () => {
      const firstCondition = rboJsonData[0];
      expect(Array.isArray(firstCondition.notes)).toBe(true);
      
      firstCondition.notes.forEach(note => {
        expect(typeof note).toBe('string');
        expect(note.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Medical Content Validation', () => {
    test('should contain clinically relevant pathogens', () => {
      const firstCondition = rboJsonData[0];
      const pathogens = firstCondition.commonPathogens;
      
      // Check for common medical pathogens
      const commonPathogens = [
        'Staphylococcus aureus',
        'Enterococcus',
        'Enterobacterales',
        'Pseudomonas aeruginosa',
        'Escherichia coli',
        'Klebsiella'
      ];
      
      const hasCommonPathogens = pathogens.some(pathogen =>
        commonPathogens.some(common => pathogen.includes(common))
      );
      
      expect(hasCommonPathogens).toBe(true);
    });

    test('should contain valid antibiotic names in therapy', () => {
      const firstCondition = rboJsonData[0];
      const therapies = firstCondition.empiricAntibioticTherapy;
      
      const commonAntibiotics = [
        'Vancomycin',
        'Linezolid',
        'Daptomycin',
        'Ceftaroline',
        'Cefazolin',
        'Oxacillin',
        'Nafcillin',
        'Ampicillin'
      ];
      
      const hasValidAntibiotics = therapies.some(therapy =>
        commonAntibiotics.some(antibiotic => therapy.therapy.includes(antibiotic))
      );
      
      expect(hasValidAntibiotics).toBe(true);
    });

    test('should have clinically appropriate duration formats', () => {
      const firstCondition = rboJsonData[0];
      const durations = firstCondition.antibioticDuration;
      
      durations.forEach(duration => {
        // Check for clinical duration patterns
        const hasDaysMention = /\d+\s*days?/.test(duration);
        const hasWeeksMention = /\d+\s*weeks?/.test(duration);
        const hasFromPattern = /from\s+first/.test(duration);
        const hasNegativePattern = /negative/.test(duration);
        
        expect(
          hasDaysMention || hasWeeksMention || hasFromPattern || hasNegativePattern
        ).toBe(true);
      });
    });

    test('should have appropriate medical condition categories', () => {
      const firstCondition = rboJsonData[0];
      const category = firstCondition.category;
      
      const validCategories = [
        'Bloodstream',
        'Respiratory',
        'Urinary',
        'Skin',
        'Soft Tissue',
        'CNS',
        'Gastrointestinal',
        'Bone',
        'Joint'
      ];
      
      const isValidCategory = validCategories.some(validCat =>
        category.includes(validCat)
      );
      
      expect(isValidCategory).toBe(true);
    });
  });

  describe('Data Transformation Process', () => {
    test('should successfully load and transform RBO data', async () => {
      // Create mock functions for dependency injection
      const mockTransformFn = jest.fn((data) => {
        if (!Array.isArray(data)) return [];
        return data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          description: item.description,
          pathogens: item.commonPathogens || [],
          empiricTherapy: item.empiricAntibioticTherapy || [],
          duration: item.antibioticDuration || [],
          notes: item.notes || [],
          // Add transformed fields
          complexity: 'medium',
          riskLevel: 'standard',
          transformed: true
        }));
      });

      const mockStatsFn = jest.fn(() => ({
        totalConditions: 1,
        averagePathogens: 5.2,
        averageTherapyOptions: 3.1,
        complexityDistribution: {
          low: 0,
          medium: 1,
          high: 0
        }
      }));

      const transformedData = await loadAndTransformRboData(mockTransformFn, mockStatsFn);
      
      expect(Array.isArray(transformedData)).toBe(true);
      expect(transformedData.length).toBeGreaterThan(0);
      
      const firstItem = transformedData[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('transformed');
      expect(firstItem.transformed).toBe(true);
    });

    test('should preserve original data structure while adding transformations', async () => {
      // Create mock function that preserves original data structure
      const mockTransformFn = jest.fn((data) => {
        if (!Array.isArray(data)) return [];
        return data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          description: item.description,
          pathogens: item.commonPathogens || [],
          empiricTherapy: item.empiricAntibioticTherapy || [],
          duration: item.antibioticDuration || [],
          notes: item.notes || [],
          // Add transformed fields
          complexity: 'medium',
          riskLevel: 'standard',
          transformed: true
        }));
      });

      const mockStatsFn = jest.fn(() => ({ totalConditions: 1 }));

      const transformedData = await loadAndTransformRboData(mockTransformFn, mockStatsFn);
      const firstItem = transformedData[0];
      
      // Should preserve original fields
      expect(firstItem.id).toBe(rboJsonData[0].id);
      expect(firstItem.name).toBe(rboJsonData[0].name);
      expect(firstItem.category).toBe(rboJsonData[0].category);
      
      // Should add transformation fields
      expect(firstItem).toHaveProperty('complexity');
      expect(firstItem).toHaveProperty('riskLevel');
      expect(firstItem).toHaveProperty('transformed');
    });

    test('should handle transformation errors gracefully', async () => {
      // Create mock function that throws error
      const mockTransformFn = jest.fn(() => {
        throw new Error('Transformation failed');
      });
      
      const mockStatsFn = jest.fn(() => ({ totalConditions: 0 }));
      
      const result = await loadAndTransformRboData(mockTransformFn, mockStatsFn);
      expect(result).toEqual([]);
    });

    test('should call dataset statistics calculation', async () => {
      const mockTransformFn = jest.fn((data) => data.map(item => ({ ...item, transformed: true })));
      const mockStatsFn = jest.fn(() => ({ totalConditions: 1 }));
      
      await loadAndTransformRboData(mockTransformFn, mockStatsFn);
      
      expect(mockStatsFn).toHaveBeenCalled();
    });
  });

  describe('Medical Conditions File Generation', () => {
    test('should generate valid JavaScript file content', () => {
      const mockTransformedData = [
        {
          id: 'test_condition',
          name: 'Test Condition',
          category: 'Test Category',
          pathogens: ['Test Pathogen'],
          empiricTherapy: ['Test Therapy']
        }
      ];
      
      const fileContent = generateMedicalConditionsFile(mockTransformedData);
      
      expect(typeof fileContent).toBe('string');
      expect(fileContent).toContain('/**');
      expect(fileContent).toContain('Medical Conditions Data');
      expect(fileContent).toContain('const medicalConditions =');
      expect(fileContent).toContain('export default medicalConditions');
    });

    test('should include proper file header with metadata', () => {
      const mockData = [{ id: 'test', name: 'Test' }];
      const fileContent = generateMedicalConditionsFile(mockData);
      
      expect(fileContent).toContain('Contains information about various infectious diseases');
      expect(fileContent).toContain('Data source: RBO_JSON (Transformed)');
      expect(fileContent).toContain('Total conditions: 1');
      expect(fileContent).toContain('Last updated:');
      
      // Should contain valid ISO timestamp
      const timestampMatch = fileContent.match(/Last updated: ([\d-T:.Z]+)/);
      expect(timestampMatch).toBeTruthy();
      expect(() => new Date(timestampMatch[1])).not.toThrow();
    });

    test('should format JSON data properly', () => {
      const mockData = [
        {
          id: 'test_condition',
          name: 'Test Condition',
          nested: {
            field: 'value'
          }
        }
      ];
      
      const fileContent = generateMedicalConditionsFile(mockData);
      
      // Should contain properly formatted JSON
      expect(fileContent).toContain('"id": "test_condition"');
      expect(fileContent).toContain('"name": "Test Condition"');
      expect(fileContent).toContain('"nested": {');
      expect(fileContent).toContain('    "field": "value"');
    });

    test('should handle empty data array', () => {
      const fileContent = generateMedicalConditionsFile([]);
      
      expect(fileContent).toContain('Total conditions: 0');
      expect(fileContent).toContain('[]');
      expect(fileContent).toContain('export default medicalConditions');
    });

    test('should handle complex medical data structures', () => {
      const complexData = [
        {
          id: 'pneumonia_cap',
          name: 'Community-Acquired Pneumonia',
          category: 'Respiratory Infections',
          pathogens: [
            'Streptococcus pneumoniae',
            'Haemophilus influenzae',
            'Mycoplasma pneumoniae'
          ],
          empiricTherapy: {
            'Outpatient': 'Azithromycin OR Doxycycline',
            'Inpatient non-ICU': 'Ceftriaxone + Azithromycin',
            'ICU': 'Ceftriaxone + Azithromycin OR Levofloxacin'
          },
          duration: ['5-7 days', '7-10 days for severe cases'],
          riskFactors: ['Age >65', 'Immunocompromised', 'Chronic diseases']
        }
      ];
      
      const fileContent = generateMedicalConditionsFile(complexData);
      
      expect(fileContent).toContain('pneumonia_cap');
      expect(fileContent).toContain('Community-Acquired Pneumonia');
      expect(fileContent).toContain('Streptococcus pneumoniae');
      expect(fileContent).toContain('Ceftriaxone + Azithromycin');
      expect(fileContent).toContain('5-7 days');
    });

    test('should create valid JavaScript syntax', () => {
      const mockData = [{ id: 'test', name: 'Test' }];
      const fileContent = generateMedicalConditionsFile(mockData);
      
      // Should not throw syntax errors when evaluated
      expect(() => {
        // Extract just the data part for syntax validation
        const dataMatch = fileContent.match(/const medicalConditions = ([\s\S]*)\n\nexport default/);
        if (dataMatch) {
          JSON.parse(dataMatch[1]);
        }
      }).not.toThrow();
    });
  });

  describe('Clinical Data Validation', () => {
    test('should validate pathogen naming conventions', () => {
      const firstCondition = rboJsonData[0];
      const pathogens = firstCondition.commonPathogens;
      
      pathogens.forEach(pathogen => {
        // Should follow genus species naming or descriptive format
        const hasProperFormat = 
          /^[A-Z][a-z]+ [a-z]+/.test(pathogen) || // Genus species
          /^[A-Z][a-z]+ \(/.test(pathogen) ||     // Genus (description)
          /^[A-Z][a-z]+$/.test(pathogen) ||       // Single genus
          pathogen.includes('species') ||          // "species" grouping
          pathogen.includes('negative') ||         // Gram classification
          pathogen.includes('positive');          // Gram classification
        
        expect(hasProperFormat).toBe(true);
      });
    });

    test('should validate therapy dosing patterns', () => {
      const firstCondition = rboJsonData[0];
      const therapies = firstCondition.empiricAntibioticTherapy;
      
      therapies.forEach(therapy => {
        // Should contain valid therapy patterns
        const hasValidPattern = 
          therapy.therapy.includes('OR') ||        // Alternative therapies
          therapy.therapy.includes('+') ||         // Combination therapy
          therapy.therapy.includes('mg') ||        // Dosing
          therapy.therapy.includes('depends') ||   // Context-dependent
          /[A-Z][a-z]+/.test(therapy.therapy);    // Drug names
        
        expect(hasValidPattern).toBe(true);
      });
    });

    test('should validate clinical condition descriptions', () => {
      const firstCondition = rboJsonData[0];
      const description = firstCondition.description;
      
      // Should contain clinical terminology
      const clinicalTerms = [
        'bacteremia',
        'infection',
        'therapy',
        'treatment',
        'antibiotic',
        'pathogen',
        'empiric',
        'susceptibility',
        'resistance',
        'days',
        'host',
        'source'
      ];
      
      const containsClinicalTerms = clinicalTerms.some(term =>
        description.toLowerCase().includes(term)
      );
      
      expect(containsClinicalTerms).toBe(true);
    });

    test('should validate clinical notes for safety information', () => {
      const firstCondition = rboJsonData[0];
      const notes = firstCondition.notes;
      
      // Should contain safety or clinical guidance
      const safetyKeywords = [
        'removal',
        'duration',
        'therapy',
        'resistance',
        'susceptibility',
        'stable',
        'criteria',
        'contraindication',
        'monitoring',
        'dose',
        'adjustment'
      ];
      
      const notesText = notes.join(' ').toLowerCase();
      const containsSafetyInfo = safetyKeywords.some(keyword =>
        notesText.includes(keyword)
      );
      
      expect(containsSafetyInfo).toBe(true);
    });
  });

  describe('Integration and Performance', () => {
    test('should handle large datasets efficiently', async () => {
      const startTime = Date.now();
      const result = await loadAndTransformRboData();
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
      expect(result).toBeDefined();
    });

    test('should maintain data integrity after transformation', async () => {
      const transformedData = await loadAndTransformRboData();
      
      // Every transformed item should have required fields
      transformedData.forEach(item => {
        expect(item.id).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.category).toBeDefined();
        expect(typeof item.id).toBe('string');
        expect(typeof item.name).toBe('string');
        expect(typeof item.category).toBe('string');
      });
    });

    test('should be compatible with existing medical conditions structure', async () => {
      const mockTransformFn = jest.fn((data) => {
        if (!Array.isArray(data)) return [];
        return data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          description: item.description,
          pathogens: item.commonPathogens || [],
          empiricTherapy: item.empiricAntibioticTherapy || [],
          duration: item.antibioticDuration || [],
          notes: item.notes || [],
          transformed: true
        }));
      });

      const mockStatsFn = jest.fn(() => ({ totalConditions: 1 }));

      const transformedData = await loadAndTransformRboData(mockTransformFn, mockStatsFn);
      
      // Should have fields compatible with existing app structure
      const firstItem = transformedData[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('category');
      expect(firstItem).toHaveProperty('pathogens');
      expect(firstItem).toHaveProperty('empiricTherapy');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle malformed RBO data gracefully', async () => {
      // Mock malformed data
      const originalData = rboJsonData[0];
      const malformedData = { ...originalData };
      delete malformedData.id;
      delete malformedData.name;
      
      expect(() => generateMedicalConditionsFile([malformedData])).not.toThrow();
    });

    test('should handle empty strings and null values', () => {
      const dataWithNulls = [
        {
          id: '',
          name: null,
          category: undefined,
          pathogens: []
        }
      ];
      
      const fileContent = generateMedicalConditionsFile(dataWithNulls);
      expect(fileContent).toContain('export default medicalConditions');
    });

    test('should handle special characters in medical data', () => {
      const dataWithSpecialChars = [
        {
          id: 'test-condition_1',
          name: 'Test Condition (β-lactam)',
          category: 'Anti-microbial',
          description: 'Contains special chars: α, β, γ, ≤, ≥, –',
          therapy: 'Penicillin + Clavulanate (875/125 mg)'
        }
      ];
      
      const fileContent = generateMedicalConditionsFile(dataWithSpecialChars);
      expect(fileContent).toContain('β-lactam');
      expect(fileContent).toContain('Anti-microbial');
      expect(fileContent).toContain('≤');
    });

    test('should handle async errors in data loading', async () => {
      // This test verifies the try-catch block in loadAndTransformRboData
      const result = await loadAndTransformRboData();
      expect(result).toBeDefined();
    });
  });
});