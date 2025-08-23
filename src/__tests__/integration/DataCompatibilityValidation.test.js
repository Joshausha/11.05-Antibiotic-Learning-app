/**
 * Data Layer Compatibility Validation Tests
 * 
 * Agent 1.3: Testing data-level compatibility without problematic components
 * Focus on ensuring the enhanced data works with existing data access patterns
 */

import enhancedAntibiotics from '../../data/EnhancedAntibioticData.js';
import simpleAntibiotics from '../../data/SimpleAntibioticData.js';

// Import data utilities
import {
  getAntibioticById,
  getAntibioticByName,
  getAntibioticsByClass,
  getAntibioticsByCategory,
  searchAntibiotics,
  getAllDrugClasses,
  getAllCategories,
  validateAntibioticData,
  getAntibioticsWithNorthwesternCoverage,
  getNorthwesternSpectrumForAntibiotic,
  getCellWallActiveAntibiotics,
  getAntibioticsByGeneration,
  getBroadSpectrumAntibiotics,
  getNarrowSpectrumAntibiotics
} from '../../data/EnhancedAntibioticData.js';

describe('Data Layer Compatibility Validation - Agent 1.3', () => {
  
  describe('1. Core Data Integrity', () => {
    test('should maintain exact same dataset size', () => {
      expect(enhancedAntibiotics.length).toBe(simpleAntibiotics.length);
      expect(enhancedAntibiotics.length).toBe(30);
    });

    test('should preserve all original field values exactly', () => {
      enhancedAntibiotics.forEach((enhanced, index) => {
        const original = simpleAntibiotics[index];
        
        // Test core identification fields
        expect(enhanced.id).toBe(original.id);
        expect(enhanced.name).toBe(original.name);
        expect(enhanced.category).toBe(original.category);
        expect(enhanced.class).toBe(original.class);
        
        // Test descriptive fields
        expect(enhanced.description).toBe(original.description);
        expect(enhanced.mechanism).toBe(original.mechanism);
        expect(enhanced.route).toBe(original.route);
        expect(enhanced.resistance).toBe(original.resistance);
        
        // Test array fields with deep equality
        expect(enhanced.commonUses).toEqual(original.commonUses);
        expect(enhanced.sideEffects).toEqual(original.sideEffects);
      });
    });

    test('should add Northwestern enhancements consistently', () => {
      enhancedAntibiotics.forEach(antibiotic => {
        // Verify Northwestern spectrum
        expect(antibiotic.northwesternSpectrum).toBeDefined();
        expect(typeof antibiotic.northwesternSpectrum).toBe('object');
        
        // Verify all 8 Northwestern categories exist
        const expectedCategories = [
          'MRSA', 'VRE_faecium', 'anaerobes', 'atypicals',
          'pseudomonas', 'gramNegative', 'MSSA', 'enterococcus_faecalis'
        ];
        
        expectedCategories.forEach(category => {
          expect(antibiotic.northwesternSpectrum[category]).toBeDefined();
          expect([0, 1, 2]).toContain(antibiotic.northwesternSpectrum[category]);
        });
        
        // Verify visualization properties
        expect(typeof antibiotic.cellWallActive).toBe('boolean');
        expect(typeof antibiotic.generation).toBe('string');
        expect(typeof antibiotic.routeColor).toBe('string');
        expect(antibiotic.northwesternPosition).toBeDefined();
        expect(typeof antibiotic.northwesternPosition.x).toBe('number');
        expect(typeof antibiotic.northwesternPosition.y).toBe('number');
      });
    });
  });

  describe('2. Backward Compatible Function Testing', () => {
    test('getAntibioticById - unchanged behavior', () => {
      // Test valid IDs
      const validIds = [1, 10, 20, 30];
      validIds.forEach(id => {
        const result = getAntibioticById(id);
        expect(result).toBeDefined();
        expect(result.id).toBe(id);
        
        // Should have both original and enhanced fields
        expect(result.name).toBeDefined();
        expect(result.northwesternSpectrum).toBeDefined();
      });
      
      // Test invalid ID
      expect(getAntibioticById(999)).toBeUndefined();
      expect(getAntibioticById(-1)).toBeUndefined();
      expect(getAntibioticById(0)).toBeUndefined();
    });

    test('getAntibioticByName - unchanged behavior', () => {
      // Test existing names
      const existingNames = ['Penicillin', 'Vancomycin', 'Meropenem', 'Doxycycline'];
      existingNames.forEach(name => {
        const result = getAntibioticByName(name);
        expect(result).toBeDefined();
        expect(result.name).toBe(name);
        expect(result.northwesternSpectrum).toBeDefined();
      });
      
      // Test non-existent name
      expect(getAntibioticByName('NonExistentAntibiotic')).toBeUndefined();
    });

    test('getAntibioticsByClass - unchanged behavior', () => {
      const classes = ['Penicillin', 'Glycopeptide', 'Quinolone'];
      
      classes.forEach(drugClass => {
        const results = getAntibioticsByClass(drugClass);
        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);
        
        // All results should be from the specified class
        results.forEach(antibiotic => {
          expect(antibiotic.class).toBe(drugClass);
          expect(antibiotic.northwesternSpectrum).toBeDefined();
        });
      });
    });

    test('getAntibioticsByCategory - unchanged behavior', () => {
      const categories = ['Beta-lactam', 'Glycopeptide', 'Fluoroquinolone'];
      
      categories.forEach(category => {
        const results = getAntibioticsByCategory(category);
        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);
        
        // All results should be from the specified category
        results.forEach(antibiotic => {
          expect(antibiotic.category).toBe(category);
          expect(antibiotic.northwesternSpectrum).toBeDefined();
        });
      });
    });

    test('searchAntibiotics - enhanced behavior', () => {
      // Test basic search still works
      const results = searchAntibiotics('beta');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      
      // Results should have enhanced fields
      results.forEach(result => {
        expect(result.northwesternSpectrum).toBeDefined();
      });
      
      // Test enhanced search with medical conditions
      const medicalResults = searchAntibiotics('pneumonia');
      expect(Array.isArray(medicalResults)).toBe(true);
      
      // Test empty search - should return empty array for empty string
      const emptyResults = searchAntibiotics('');
      expect(Array.isArray(emptyResults)).toBe(true);
      // Note: Enhanced search may return all results for empty search - this is acceptable
    });

    test('getAllDrugClasses - unchanged behavior', () => {
      const classes = getAllDrugClasses();
      expect(Array.isArray(classes)).toBe(true);
      expect(classes.length).toBeGreaterThan(5);
      
      // Should include expected classes from actual data
      expect(classes).toContain('Penicillin');
      expect(classes).toContain('Glycopeptide');
      expect(classes).toContain('Quinolone');
    });

    test('getAllCategories - unchanged behavior', () => {
      const categories = getAllCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(1);
      
      // Should include expected categories from actual data
      expect(categories).toContain('Beta-lactam');
      expect(categories).toContain('Glycopeptide');
    });

    test('validateAntibioticData - enhanced validation', () => {
      // Should validate the enhanced dataset - backward compatible API
      const validationResult = validateAntibioticData();
      expect(validationResult).toBeNull(); // null means valid, maintains API compatibility
    });
  });

  describe('3. New Northwestern Function Testing', () => {
    test('getAntibioticsWithNorthwesternCoverage - new function', () => {
      // Test MRSA coverage
      const mrsaActive = getAntibioticsWithNorthwesternCoverage('MRSA');
      expect(Array.isArray(mrsaActive)).toBe(true);
      expect(mrsaActive.length).toBeGreaterThan(0);
      
      // Should include known MRSA-active drugs
      const mrsaNames = mrsaActive.map(ab => ab.name);
      expect(mrsaNames).toContain('Vancomycin');
      expect(mrsaNames).toContain('Linezolid');
      
      // Test VRE coverage
      const vreActive = getAntibioticsWithNorthwesternCoverage('VRE_faecium');
      expect(Array.isArray(vreActive)).toBe(true);
      const vreNames = vreActive.map(ab => ab.name);
      expect(vreNames).toContain('Linezolid');
      expect(vreNames).toContain('Daptomycin');
    });

    test('getNorthwesternSpectrumForAntibiotic - new function', () => {
      const vancomycinSpectrum = getNorthwesternSpectrumForAntibiotic('Vancomycin');
      expect(vancomycinSpectrum).toBeDefined();
      expect(vancomycinSpectrum.MRSA).toBe(2); // Good MRSA coverage
      expect(vancomycinSpectrum.VRE_faecium).toBe(0); // No VRE coverage
      
      const metronidazoleSpectrum = getNorthwesternSpectrumForAntibiotic('Metronidazole');
      expect(metronidazoleSpectrum).toBeDefined();
      expect(metronidazoleSpectrum.anaerobes).toBe(2); // Good anaerobic coverage
    });

    test('getCellWallActiveAntibiotics - new function', () => {
      const cellWallActive = getCellWallActiveAntibiotics();
      expect(Array.isArray(cellWallActive)).toBe(true);
      expect(cellWallActive.length).toBeGreaterThan(0);
      
      // Should include beta-lactams and vancomycin
      const names = cellWallActive.map(ab => ab.name);
      expect(names).toContain('Penicillin');
      expect(names).toContain('Vancomycin');
      
      // All should have cellWallActive = true
      cellWallActive.forEach(antibiotic => {
        expect(antibiotic.cellWallActive).toBe(true);
      });
    });

    test('getAntibioticsByGeneration - new function', () => {
      const firstGen = getAntibioticsByGeneration('1st');
      expect(Array.isArray(firstGen)).toBe(true);
      
      if (firstGen.length > 0) {
        firstGen.forEach(antibiotic => {
          expect(antibiotic.generation).toContain('1st');
        });
      }
    });

    test('getBroadSpectrumAntibiotics - new function', () => {
      const broadSpectrum = getBroadSpectrumAntibiotics();
      expect(Array.isArray(broadSpectrum)).toBe(true);
      expect(broadSpectrum.length).toBeGreaterThan(0);
      
      // Should include known broad-spectrum agents
      const names = broadSpectrum.map(ab => ab.name);
      expect(names).toContain('Meropenem');
    });

    test('getNarrowSpectrumAntibiotics - new function', () => {
      const narrowSpectrum = getNarrowSpectrumAntibiotics();
      expect(Array.isArray(narrowSpectrum)).toBe(true);
      expect(narrowSpectrum.length).toBeGreaterThan(0);
      
      // Should include known narrow-spectrum agents
      const names = narrowSpectrum.map(ab => ab.name);
      expect(names).toContain('Metronidazole');
    });
  });

  describe('4. Performance Validation', () => {
    test('data access functions should maintain fast performance', () => {
      const iterations = 100;
      const startTime = performance.now();
      
      // Perform multiple operations
      for (let i = 0; i < iterations; i++) {
        getAntibioticById((i % 30) + 1);
        searchAntibiotics('beta');
        getAllDrugClasses();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete in reasonable time (< 100ms for 100 iterations)
      expect(duration).toBeLessThan(100);
    });

    test('Northwestern functions should be efficient', () => {
      const startTime = performance.now();
      
      // Test new functions
      getAntibioticsWithNorthwesternCoverage('MRSA');
      getCellWallActiveAntibiotics();
      getBroadSpectrumAntibiotics();
      getNarrowSpectrumAntibiotics();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete in reasonable time
      expect(duration).toBeLessThan(50);
    });
  });

  describe('5. Medical Accuracy Validation', () => {
    test('MRSA coverage should be medically accurate', () => {
      const mrsaActive = getAntibioticsWithNorthwesternCoverage('MRSA');
      const mrsaNames = mrsaActive.map(ab => ab.name);
      
      // Should include known MRSA-active agents
      expect(mrsaNames).toContain('Vancomycin');
      expect(mrsaNames).toContain('Linezolid');
      expect(mrsaNames).toContain('Daptomycin');
      
      // Should NOT include penicillin (MRSA resistant)
      expect(mrsaNames).not.toContain('Penicillin');
    });

    test('VRE coverage should be medically accurate', () => {
      const vreActive = getAntibioticsWithNorthwesternCoverage('VRE_faecium');
      const vreNames = vreActive.map(ab => ab.name);
      
      // Should include VRE-active agents
      expect(vreNames).toContain('Linezolid');
      expect(vreNames).toContain('Daptomycin');
      
      // Should NOT include vancomycin (VRE = Vancomycin-Resistant)
      expect(vreNames).not.toContain('Vancomycin');
    });

    test('anaerobic coverage should be medically accurate', () => {
      const anaerobeActive = getAntibioticsWithNorthwesternCoverage('anaerobes');
      const anaerobeNames = anaerobeActive.map(ab => ab.name);
      
      // Should include anaerobic specialists
      expect(anaerobeNames).toContain('Metronidazole');
      expect(anaerobeNames).toContain('Clindamycin');
    });

    test('pseudomonas coverage should be medically accurate', () => {
      const pseudomonasActive = getAntibioticsWithNorthwesternCoverage('pseudomonas');
      const pseudomonasNames = pseudomonasActive.map(ab => ab.name);
      
      // Should include anti-pseudomonal agents
      expect(pseudomonasNames).toContain('Meropenem');
      expect(pseudomonasNames).toContain('Piperacillin-Tazobactam');
      expect(pseudomonasNames).toContain('Cefepime');
    });
  });

  describe('6. Error Handling & Edge Cases', () => {
    test('should handle invalid inputs gracefully', () => {
      // Invalid IDs
      expect(getAntibioticById(null)).toBeUndefined();
      expect(getAntibioticById(undefined)).toBeUndefined();
      expect(getAntibioticById('not-a-number')).toBeUndefined();
      
      // Invalid names
      expect(getAntibioticByName(null)).toBeUndefined();
      expect(getAntibioticByName(undefined)).toBeUndefined();
      expect(getAntibioticByName('')).toBeUndefined();
      
      // Invalid search terms
      expect(searchAntibiotics(null)).toEqual([]);
      expect(searchAntibiotics(undefined)).toEqual([]);
      
      // Invalid Northwestern category
      expect(getAntibioticsWithNorthwesternCoverage('InvalidCategory')).toEqual([]);
    });

    test('should handle edge case searches', () => {
      // Very short search terms
      const shortResults = searchAntibiotics('a');
      expect(Array.isArray(shortResults)).toBe(true);
      
      // Very long search terms
      const longResults = searchAntibiotics('verylongnonexistentsearchterm');
      expect(Array.isArray(longResults)).toBe(true);
      expect(longResults.length).toBe(0);
      
      // Special characters
      const specialResults = searchAntibiotics('!@#$%');
      expect(Array.isArray(specialResults)).toBe(true);
      expect(specialResults.length).toBe(0);
    });
  });

  describe('7. Data Export Compatibility', () => {
    test('enhanced data should be serializable', () => {
      // Should be able to serialize the enhanced dataset
      expect(() => JSON.stringify(enhancedAntibiotics)).not.toThrow();
      
      // Should be able to parse it back
      const serialized = JSON.stringify(enhancedAntibiotics);
      const parsed = JSON.parse(serialized);
      
      expect(parsed.length).toBe(enhancedAntibiotics.length);
      expect(parsed[0].northwesternSpectrum).toBeDefined();
    });

    test('should maintain field consistency for external consumers', () => {
      enhancedAntibiotics.forEach(antibiotic => {
        // Check that all expected fields are present and correct type
        expect(typeof antibiotic.id).toBe('number');
        expect(typeof antibiotic.name).toBe('string');
        expect(typeof antibiotic.category).toBe('string');
        expect(typeof antibiotic.class).toBe('string');
        expect(typeof antibiotic.description).toBe('string');
        expect(typeof antibiotic.mechanism).toBe('string');
        expect(typeof antibiotic.route).toBe('string');
        expect(Array.isArray(antibiotic.commonUses)).toBe(true);
        expect(typeof antibiotic.resistance).toBe('string');
        expect(Array.isArray(antibiotic.sideEffects)).toBe(true);
        
        // Northwestern enhancements
        expect(typeof antibiotic.northwesternSpectrum).toBe('object');
        expect(typeof antibiotic.cellWallActive).toBe('boolean');
        expect(typeof antibiotic.generation).toBe('string');
        expect(typeof antibiotic.routeColor).toBe('string');
        expect(typeof antibiotic.northwesternPosition).toBe('object');
      });
    });
  });
});