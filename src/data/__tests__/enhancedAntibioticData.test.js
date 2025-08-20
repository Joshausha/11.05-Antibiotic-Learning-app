/**
 * Enhanced Antibiotic Data Migration Tests
 * Validates the Northwestern 8-segment migration was successful
 * 
 * Created by: Agent 1.2 - Data Migration Specialist
 * Date: 2025-01-18
 */

import enhancedAntibiotics, {
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
  getAntibioticsByGeneration,
  getCellWallActiveAntibiotics,
  getAntibioticsByRoute,
  getNorthwesternCoverageMatrix,
  getBroadSpectrumAntibiotics,
  getNarrowSpectrumAntibiotics,
  getMigrationStats
} from '../EnhancedAntibioticData.js';

import simpleAntibiotics from '../SimpleAntibioticData.js';

describe('Enhanced Antibiotic Data - Migration Validation', () => {
  
  describe('Data Preservation', () => {
    test('should preserve all original antibiotics', () => {
      expect(enhancedAntibiotics.length).toBe(simpleAntibiotics.length);
      expect(enhancedAntibiotics.length).toBe(30);
    });

    test('should preserve all original fields for each antibiotic', () => {
      const requiredFields = ['id', 'name', 'category', 'class', 'description', 
                             'mechanism', 'route', 'commonUses', 'resistance', 'sideEffects'];
      
      enhancedAntibiotics.forEach((enhanced, index) => {
        const original = simpleAntibiotics[index];
        
        requiredFields.forEach(field => {
          expect(enhanced[field]).toEqual(original[field]);
        });
      });
    });

    test('should preserve exact field values', () => {
      // Spot check specific examples
      const penicillin = enhancedAntibiotics.find(ab => ab.id === 1);
      expect(penicillin.name).toBe("Penicillin");
      expect(penicillin.mechanism).toBe("Cell wall synthesis inhibition");
      expect(penicillin.commonUses).toEqual(["Strep throat", "Pneumococcal infections"]);

      const vancomycin = enhancedAntibiotics.find(ab => ab.id === 2);
      expect(vancomycin.description).toBe("Reserve antibiotic for MRSA and severe gram-positive infections");
      expect(vancomycin.sideEffects).toEqual(["Kidney toxicity", "Red man syndrome"]);
    });
  });

  describe('Northwestern Enhancement', () => {
    test('should add Northwestern spectrum to all antibiotics', () => {
      enhancedAntibiotics.forEach(antibiotic => {
        expect(antibiotic).toHaveProperty('northwesternSpectrum');
        expect(typeof antibiotic.northwesternSpectrum).toBe('object');
      });
    });

    test('should have all 8 Northwestern categories', () => {
      const requiredCategories = ['MRSA', 'VRE_faecium', 'anaerobes', 'atypicals', 
                                 'pseudomonas', 'gramNegative', 'MSSA', 'enterococcus_faecalis'];
      
      enhancedAntibiotics.forEach(antibiotic => {
        requiredCategories.forEach(category => {
          expect(antibiotic.northwesternSpectrum).toHaveProperty(category);
          expect([0, 1, 2]).toContain(antibiotic.northwesternSpectrum[category]);
        });
      });
    });

    test('should add visualization properties', () => {
      enhancedAntibiotics.forEach(antibiotic => {
        expect(antibiotic).toHaveProperty('cellWallActive');
        expect(antibiotic).toHaveProperty('generation');
        expect(antibiotic).toHaveProperty('routeColor');
        expect(antibiotic).toHaveProperty('northwesternPosition');
        
        expect(typeof antibiotic.cellWallActive).toBe('boolean');
        expect(typeof antibiotic.generation).toBe('string');
        expect(typeof antibiotic.routeColor).toBe('string');
        expect(typeof antibiotic.northwesternPosition).toBe('object');
      });
    });
  });

  describe('Medical Accuracy Validation', () => {
    test('should have correct MRSA coverage assignments', () => {
      // Vancomycin should have excellent MRSA coverage
      const vancomycin = enhancedAntibiotics.find(ab => ab.id === 2);
      expect(vancomycin.northwesternSpectrum.MRSA).toBe(2);

      // Penicillin should have no MRSA coverage
      const penicillin = enhancedAntibiotics.find(ab => ab.id === 1);
      expect(penicillin.northwesternSpectrum.MRSA).toBe(0);

      // Linezolid should have excellent MRSA coverage
      const linezolid = enhancedAntibiotics.find(ab => ab.id === 11);
      expect(linezolid.northwesternSpectrum.MRSA).toBe(2);
    });

    test('should have correct anaerobic coverage assignments', () => {
      // Metronidazole should have excellent anaerobic coverage
      const metronidazole = enhancedAntibiotics.find(ab => ab.id === 12);
      expect(metronidazole.northwesternSpectrum.anaerobes).toBe(2);

      // Gentamicin should have no anaerobic coverage
      const gentamicin = enhancedAntibiotics.find(ab => ab.id === 7);
      expect(gentamicin.northwesternSpectrum.anaerobes).toBe(0);
    });

    test('should have correct pseudomonas coverage assignments', () => {
      // Meropenem should have excellent pseudomonas coverage
      const meropenem = enhancedAntibiotics.find(ab => ab.id === 8);
      expect(meropenem.northwesternSpectrum.pseudomonas).toBe(2);

      // Ceftriaxone should have no pseudomonas coverage
      const ceftriaxone = enhancedAntibiotics.find(ab => ab.id === 4);
      expect(ceftriaxone.northwesternSpectrum.pseudomonas).toBe(0);
    });

    test('should have correct atypical coverage assignments', () => {
      // Azithromycin should have excellent atypical coverage
      const azithromycin = enhancedAntibiotics.find(ab => ab.id === 5);
      expect(azithromycin.northwesternSpectrum.atypicals).toBe(2);

      // Vancomycin should have no atypical coverage
      const vancomycin = enhancedAntibiotics.find(ab => ab.id === 2);
      expect(vancomycin.northwesternSpectrum.atypicals).toBe(0);
    });
  });

  describe('Backward Compatibility - Original Functions', () => {
    test('getAntibioticById should work unchanged', () => {
      const antibiotic = getAntibioticById(1);
      expect(antibiotic.name).toBe("Penicillin");
      expect(antibiotic.id).toBe(1);
    });

    test('getAntibioticByName should work unchanged', () => {
      const antibiotic = getAntibioticByName("Vancomycin");
      expect(antibiotic.id).toBe(2);
      expect(antibiotic.name).toBe("Vancomycin");
    });

    test('getAntibioticsByClass should work unchanged', () => {
      const penicillins = getAntibioticsByClass("Penicillin");
      expect(penicillins.length).toBeGreaterThan(0);
      penicillins.forEach(ab => {
        expect(ab.class).toBe("Penicillin");
      });
    });

    test('getAntibioticsByCategory should work unchanged', () => {
      const betaLactams = getAntibioticsByCategory("Beta-lactam");
      expect(betaLactams.length).toBeGreaterThan(0);
      betaLactams.forEach(ab => {
        expect(ab.category).toBe("Beta-lactam");
      });
    });

    test('searchAntibiotics should work unchanged', () => {
      const results = searchAntibiotics("Pneumonia");
      expect(results.length).toBeGreaterThan(0);
      
      // Should find antibiotics with pneumonia in their uses
      const names = results.map(ab => ab.name);
      expect(names).toContain("Ceftriaxone"); // Has "Pneumonia" in commonUses
    });

    test('getAllDrugClasses should work unchanged', () => {
      const classes = getAllDrugClasses();
      expect(Array.isArray(classes)).toBe(true);
      expect(classes.length).toBeGreaterThan(0);
      expect(classes).toContain("Penicillin");
    });

    test('getAllCategories should work unchanged', () => {
      const categories = getAllCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain("Beta-lactam");
    });

    test('validateAntibioticData should work unchanged', () => {
      const errors = validateAntibioticData();
      expect(errors).toBeNull(); // Should pass validation
    });
  });

  describe('New Northwestern Functions', () => {
    test('getAntibioticsWithNorthwesternCoverage should work', () => {
      const mrsaAntibiotics = getAntibioticsWithNorthwesternCoverage('MRSA', 2);
      expect(Array.isArray(mrsaAntibiotics)).toBe(true);
      
      // Should include vancomycin and linezolid
      const names = mrsaAntibiotics.map(ab => ab.name);
      expect(names).toContain("Vancomycin");
      expect(names).toContain("Linezolid");
    });

    test('getNorthwesternSpectrumForAntibiotic should work', () => {
      const spectrum = getNorthwesternSpectrumForAntibiotic(2); // Vancomycin
      expect(spectrum).toBeDefined();
      expect(spectrum.MRSA).toBe(2);
      expect(spectrum.VRE_faecium).toBe(0);
    });

    test('getCellWallActiveAntibiotics should work', () => {
      const cellWallActive = getCellWallActiveAntibiotics();
      expect(Array.isArray(cellWallActive)).toBe(true);
      
      // Should include beta-lactams
      const names = cellWallActive.map(ab => ab.name);
      expect(names).toContain("Penicillin");
      expect(names).toContain("Ceftriaxone");
      expect(names).toContain("Vancomycin");
    });

    test('getAntibioticsByGeneration should work', () => {
      const generations = getAntibioticsByGeneration();
      expect(typeof generations).toBe('object');
      expect(generations).toHaveProperty('Natural Penicillin');
      expect(generations).toHaveProperty('3rd Generation');
    });

    test('getBroadSpectrumAntibiotics should work', () => {
      const broadSpectrum = getBroadSpectrumAntibiotics(4);
      expect(Array.isArray(broadSpectrum)).toBe(true);
      
      // Should include meropenem
      const names = broadSpectrum.map(ab => ab.name);
      expect(names).toContain("Meropenem");
    });

    test('getNarrowSpectrumAntibiotics should work', () => {
      const narrowSpectrum = getNarrowSpectrumAntibiotics();
      expect(Array.isArray(narrowSpectrum)).toBe(true);
      
      // Should include metronidazole
      const names = narrowSpectrum.map(ab => ab.name);
      expect(names).toContain("Metronidazole");
    });
  });

  describe('Migration Statistics', () => {
    test('getMigrationStats should provide comprehensive statistics', () => {
      const stats = getMigrationStats();
      
      expect(stats.totalAntibiotics).toBe(30);
      expect(stats.originalFieldsPreserved).toBe(30);
      expect(stats.northwesternFieldsAdded).toBe(30);
      expect(stats.validationErrors).toBeNull();
      expect(stats.migrationErrors).toBeNull();
      expect(stats.coverageDistribution).toBeDefined();
      
      // Check coverage distribution structure
      const categories = ['MRSA', 'VRE_faecium', 'anaerobes', 'atypicals', 
                         'pseudomonas', 'gramNegative', 'MSSA', 'enterococcus_faecalis'];
      
      categories.forEach(category => {
        expect(stats.coverageDistribution[category]).toBeDefined();
        expect(stats.coverageDistribution[category]).toHaveProperty('noCoverage');
        expect(stats.coverageDistribution[category]).toHaveProperty('someCoverage');
        expect(stats.coverageDistribution[category]).toHaveProperty('goodCoverage');
      });
    });
  });

  describe('Data Integrity', () => {
    test('should have consistent array lengths', () => {
      expect(enhancedAntibiotics.length).toBe(simpleAntibiotics.length);
    });

    test('should have unique IDs', () => {
      const ids = enhancedAntibiotics.map(ab => ab.id);
      const uniqueIds = [...new Set(ids)];
      expect(uniqueIds.length).toBe(ids.length);
    });

    test('should have valid ID range', () => {
      enhancedAntibiotics.forEach(antibiotic => {
        expect(antibiotic.id).toBeGreaterThan(0);
        expect(antibiotic.id).toBeLessThanOrEqual(30);
      });
    });

    test('should have no undefined Northwestern values', () => {
      enhancedAntibiotics.forEach(antibiotic => {
        Object.values(antibiotic.northwesternSpectrum).forEach(value => {
          expect(value).toBeDefined();
          expect([0, 1, 2]).toContain(value);
        });
      });
    });
  });

  describe('Route Color Validation', () => {
    test('should have valid route colors', () => {
      const validColors = ['red', 'blue', 'purple', 'gray'];
      
      enhancedAntibiotics.forEach(antibiotic => {
        expect(validColors).toContain(antibiotic.routeColor);
      });
    });

    test('should assign route colors correctly', () => {
      // PO only should be red
      const amoxicillin = enhancedAntibiotics.find(ab => ab.name === "Amoxicillin");
      expect(amoxicillin.routeColor).toBe('red');

      // IV only should be blue
      const vancomycin = enhancedAntibiotics.find(ab => ab.name === "Vancomycin");
      expect(vancomycin.routeColor).toBe('blue');

      // Both should be purple
      const ciprofloxacin = enhancedAntibiotics.find(ab => ab.name === "Ciprofloxacin");
      expect(ciprofloxacin.routeColor).toBe('purple');
    });
  });

  describe('Position Data Validation', () => {
    test('should have valid position coordinates', () => {
      enhancedAntibiotics.forEach(antibiotic => {
        const pos = antibiotic.northwesternPosition;
        expect(typeof pos.x).toBe('number');
        expect(typeof pos.y).toBe('number');
        expect(typeof pos.group).toBe('string');
        expect(typeof pos.hasBorder).toBe('boolean');
      });
    });
  });
});

describe('Northwestern Coverage Matrix', () => {
  test('should generate complete coverage matrix', () => {
    const matrix = getNorthwesternCoverageMatrix();
    
    expect(typeof matrix).toBe('object');
    expect(Object.keys(matrix).length).toBe(30);
    
    Object.values(matrix).forEach(entry => {
      expect(entry).toHaveProperty('name');
      expect(entry).toHaveProperty('spectrum');
      expect(typeof entry.name).toBe('string');
      expect(typeof entry.spectrum).toBe('object');
    });
  });
});