/**
 * Northwestern Schema Tests
 * Validates the Northwestern 8-segment data schema and compatibility layer
 */

import {
  createNorthwesternAntibioticData,
  getNorthwesternSpectrum,
  getAntibioticsForNorthwesternCategory,
  getNorthwesternCoverageStats,
  getCellWallActiveAntibiotics,
  getAntibioticsByGeneration,
  validateNorthwesternSchema,
  northwesternSpectrumMap,
  cellWallActiveMap,
  generationMap,
  routeColorMap,
  northwesternPositionMap
} from '../NorthwesternAntibioticSchema';

import {
  getNorthwesternClassification,
  getPathogensInNorthwesternCategory,
  getNorthwesternCategoryDefinition,
  isPathogenInNorthwesternCategory,
  getContextualNorthwesternCategory,
  validatePathogenClassification
} from '../pathogenClassificationMap';

import {
  convertToNorthwesternScale,
  convertToOriginalScale,
  getEffectivenessDistribution,
  validateConversionAlgorithm
} from '../coverageConversionAlgorithm.ts';

import {
  initializeCompatibility,
  getEffectivenessForPair,
  getAntibioticsForPathogen,
  getNorthwesternEffectivenessForPair,
  ensureNorthwesternFormat,
  validateBackwardCompatibility
} from '../backwardCompatibility.ts';

import simpleAntibiotics from '../SimpleAntibioticData';
import simplePathogens from '../SimplePathogenData';
import pathogenAntibioticMap from '../pathogenAntibioticMap';

describe('Northwestern Schema - Core Data Structures', () => {
  
  describe('Northwestern Spectrum Mapping', () => {
    test('should have Northwestern spectrum for all antibiotics', () => {
      simpleAntibiotics.forEach(antibiotic => {
        const spectrum = getNorthwesternSpectrum(antibiotic.id);
        expect(spectrum).toBeDefined();
        expect(spectrum).toHaveProperty('MRSA');
        expect(spectrum).toHaveProperty('VRE_faecium');
        expect(spectrum).toHaveProperty('anaerobes');
        expect(spectrum).toHaveProperty('atypicals');
        expect(spectrum).toHaveProperty('pseudomonas');
        expect(spectrum).toHaveProperty('gramNegative');
        expect(spectrum).toHaveProperty('MSSA');
        expect(spectrum).toHaveProperty('enterococcus_faecalis');
      });
    });

    test('should have valid coverage values (0-2)', () => {
      Object.values(northwesternSpectrumMap).forEach(spectrum => {
        Object.values(spectrum).forEach(coverage => {
          expect([0, 1, 2]).toContain(coverage);
        });
      });
    });

    test('should have medically accurate mappings for key antibiotics', () => {
      // Vancomycin should cover MRSA but not VRE faecium
      const vancomycinSpectrum = getNorthwesternSpectrum(2);
      expect(vancomycinSpectrum.MRSA).toBe(2); // Good coverage
      expect(vancomycinSpectrum.VRE_faecium).toBe(0); // No coverage
      expect(vancomycinSpectrum.MSSA).toBe(2); // Good coverage

      // Meropenem should have broad spectrum except MRSA/VRE
      const meropenemSpectrum = getNorthwesternSpectrum(8);
      expect(meropenemSpectrum.MRSA).toBe(0); // No coverage
      expect(meropenemSpectrum.pseudomonas).toBe(2); // Good coverage
      expect(meropenemSpectrum.gramNegative).toBe(2); // Good coverage
      expect(meropenemSpectrum.anaerobes).toBe(2); // Good coverage

      // Metronidazole should only cover anaerobes
      const metronidazoleSpectrum = getNorthwesternSpectrum(12);
      expect(metronidazoleSpectrum.anaerobes).toBe(2); // Good coverage
      expect(metronidazoleSpectrum.MRSA).toBe(0); // No coverage
      expect(metronidazoleSpectrum.gramNegative).toBe(0); // No coverage
    });
  });

  describe('Cell Wall Activity Classification', () => {
    test('should classify beta-lactams as cell wall active', () => {
      const cellWallActive = getCellWallActiveAntibiotics();
      
      // Should include penicillins
      expect(cellWallActive).toContain(1);  // Penicillin
      expect(cellWallActive).toContain(15); // Ampicillin
      expect(cellWallActive).toContain(16); // Amoxicillin
      
      // Should include cephalosporins
      expect(cellWallActive).toContain(4);  // Ceftriaxone
      expect(cellWallActive).toContain(13); // Cefazolin
      
      // Should include carbapenems
      expect(cellWallActive).toContain(8);  // Meropenem
      
      // Should include vancomycin
      expect(cellWallActive).toContain(2);  // Vancomycin
    });

    test('should not classify protein synthesis inhibitors as cell wall active', () => {
      expect(cellWallActiveMap[5]).toBe(false);  // Azithromycin
      expect(cellWallActiveMap[6]).toBe(false);  // Clindamycin
      expect(cellWallActiveMap[7]).toBe(false);  // Gentamicin
      expect(cellWallActiveMap[11]).toBe(false); // Linezolid
    });
  });

  describe('Generation Classification', () => {
    test('should have generation mapping for all antibiotics', () => {
      simpleAntibiotics.forEach(antibiotic => {
        expect(generationMap[antibiotic.id]).toBeDefined();
        expect(typeof generationMap[antibiotic.id]).toBe('string');
      });
    });

    test('should group antibiotics by generation correctly', () => {
      const generations = getAntibioticsByGeneration();
      
      // Should have penicillin generations
      expect(generations).toHaveProperty('Natural Penicillin');
      expect(generations).toHaveProperty('Aminopenicillin');
      
      // Should have cephalosporin generations
      expect(generations).toHaveProperty('1st Generation');
      expect(generations).toHaveProperty('3rd Generation');
      
      // Ceftriaxone should be 3rd generation
      expect(generations['3rd Generation']).toContain(4);
    });
  });

  describe('Route Color Classification', () => {
    test('should assign route colors correctly', () => {
      // PO only antibiotics should be red
      expect(routeColorMap[16]).toBe('red'); // Amoxicillin (PO)
      expect(routeColorMap[25]).toBe('red'); // Cephalexin (PO)
      
      // IV only antibiotics should be blue
      expect(routeColorMap[2]).toBe('blue');  // Vancomycin (IV)
      expect(routeColorMap[8]).toBe('blue');  // Meropenem (IV)
      
      // Both routes should be purple
      expect(routeColorMap[3]).toBe('purple'); // Ciprofloxacin (IV/PO)
      expect(routeColorMap[11]).toBe('purple'); // Linezolid (IV/PO)
    });
  });
});

describe('Northwestern Schema - Pathogen Classification', () => {
  
  describe('Pathogen to Northwestern Mapping', () => {
    test('should classify all pathogens', () => {
      simplePathogens.forEach(pathogen => {
        const classification = getNorthwesternClassification(pathogen.id);
        expect(classification).toBeDefined();
        expect(classification.pathogenName).toBe(pathogen.name);
        expect(Array.isArray(classification.northwesternCategories)).toBe(true);
        expect(classification.primaryCategory).toBeDefined();
      });
    });

    test('should handle context-dependent classification', () => {
      // S. aureus should default to MSSA
      const sAureusDefault = getContextualNorthwesternCategory(1);
      expect(sAureusDefault).toBe('MSSA');
      
      // S. aureus with MRSA resistance should be MRSA
      const sAureusMRSA = getContextualNorthwesternCategory(1, { MRSA: true });
      expect(sAureusMRSA).toBe('MRSA');
    });

    test('should have medically accurate classifications', () => {
      // Pseudomonas aeruginosa
      expect(isPathogenInNorthwesternCategory(4, 'pseudomonas')).toBe(true);
      
      // E. coli should be gram negative
      expect(isPathogenInNorthwesternCategory(2, 'gramNegative')).toBe(true);
      
      // Enterococcus faecalis
      expect(isPathogenInNorthwesternCategory(7, 'enterococcus_faecalis')).toBe(true);
      
      // Enterococcus faecium
      expect(isPathogenInNorthwesternCategory(11, 'VRE_faecium')).toBe(true);
    });
  });

  describe('Northwestern Category Definitions', () => {
    test('should have definitions for all categories', () => {
      const categories = ['MRSA', 'VRE_faecium', 'anaerobes', 'atypicals', 
                         'pseudomonas', 'gramNegative', 'MSSA', 'enterococcus_faecalis'];
      
      categories.forEach(category => {
        const definition = getNorthwesternCategoryDefinition(category);
        expect(definition).toBeDefined();
        expect(definition.fullName).toBeDefined();
        expect(definition.description).toBeDefined();
        expect(Array.isArray(definition.keyFeatures)).toBe(true);
        expect(definition.clinicalSignificance).toBeDefined();
      });
    });
  });
});

describe('Northwestern Schema - Coverage Conversion', () => {
  
  describe('Scale Conversion', () => {
    test('should convert original effectiveness to Northwestern scale', () => {
      expect(convertToNorthwesternScale('resistant')).toBe(0);
      expect(convertToNorthwesternScale('low')).toBe(1);
      expect(convertToNorthwesternScale('medium')).toBe(1);
      expect(convertToNorthwesternScale('high')).toBe(2);
    });

    test('should convert Northwestern scale to original effectiveness', () => {
      expect(convertToOriginalScale(0)).toBe('resistant');
      expect(convertToOriginalScale(1)).toBe('medium');
      expect(convertToOriginalScale(2)).toBe('high');
    });

    test('should handle invalid inputs gracefully', () => {
      expect(convertToNorthwesternScale('invalid')).toBe(0);
      expect(convertToOriginalScale(99)).toBe('resistant');
    });
  });

  describe('Effectiveness Distribution', () => {
    test('should calculate distribution statistics', () => {
      const distribution = getEffectivenessDistribution(pathogenAntibioticMap);
      expect(distribution.total).toBeGreaterThan(0);
      expect(distribution.original).toHaveProperty('high');
      expect(distribution.northwestern).toHaveProperty('good');
      expect(typeof distribution.originalPercentages.high).toBe('string');
    });
  });
});

describe('Northwestern Schema - Backward Compatibility', () => {
  
  beforeAll(() => {
    initializeCompatibility(simpleAntibiotics, simplePathogens, pathogenAntibioticMap);
  });

  describe('Original API Preservation', () => {
    test('should maintain getEffectivenessForPair function', () => {
      const effectiveness = getEffectivenessForPair(1, 2); // S. aureus + Vancomycin
      expect(effectiveness).toBe('high');
    });

    test('should maintain getAntibioticsForPathogen function', () => {
      const antibiotics = getAntibioticsForPathogen(1); // S. aureus
      expect(Array.isArray(antibiotics)).toBe(true);
      expect(antibiotics.length).toBeGreaterThan(0);
      expect(antibiotics[0]).toHaveProperty('antibioticId');
      expect(antibiotics[0]).toHaveProperty('effectiveness');
    });
  });

  describe('Enhanced API Functions', () => {
    test('should provide Northwestern effectiveness', () => {
      const northwesternEff = getNorthwesternEffectivenessForPair(1, 2); // S. aureus + Vancomycin
      expect([0, 1, 2]).toContain(northwesternEff);
    });

    test('should ensure Northwestern format', () => {
      const antibiotic = simpleAntibiotics[0];
      const enhanced = ensureNorthwesternFormat(antibiotic);
      expect(enhanced).toHaveProperty('northwesternSpectrum');
      expect(enhanced).toHaveProperty('cellWallActive');
      expect(enhanced).toHaveProperty('generation');
      expect(enhanced).toHaveProperty('routeColor');
    });
  });
});

describe('Northwestern Schema - Enhanced Data Creation', () => {
  
  test('should create Northwestern-enhanced antibiotic data', () => {
    const enhanced = createNorthwesternAntibioticData(simpleAntibiotics);
    
    expect(Array.isArray(enhanced)).toBe(true);
    expect(enhanced.length).toBe(simpleAntibiotics.length);
    
    enhanced.forEach((antibiotic, index) => {
      // Should preserve original properties
      expect(antibiotic.id).toBe(simpleAntibiotics[index].id);
      expect(antibiotic.name).toBe(simpleAntibiotics[index].name);
      
      // Should add Northwestern properties
      expect(antibiotic).toHaveProperty('northwesternSpectrum');
      expect(antibiotic).toHaveProperty('cellWallActive');
      expect(antibiotic).toHaveProperty('generation');
      expect(antibiotic).toHaveProperty('routeColor');
      expect(antibiotic).toHaveProperty('northwesternPosition');
    });
  });

  test('should find antibiotics for Northwestern categories', () => {
    const mrsaAntibiotics = getAntibioticsForNorthwesternCategory('MRSA', 2);
    expect(Array.isArray(mrsaAntibiotics)).toBe(true);
    
    // Should include vancomycin and linezolid
    const antibioticIds = mrsaAntibiotics.map(ab => ab.antibioticId);
    expect(antibioticIds).toContain(2);  // Vancomycin
    expect(antibioticIds).toContain(11); // Linezolid
  });
});

describe('Northwestern Schema - Validation', () => {
  
  test('should validate Northwestern schema integrity', () => {
    const schemaErrors = validateNorthwesternSchema();
    expect(schemaErrors).toBeNull();
  });

  test('should validate pathogen classification', () => {
    const classificationErrors = validatePathogenClassification();
    expect(classificationErrors).toBeNull();
  });

  test('should validate conversion algorithm', () => {
    const conversionErrors = validateConversionAlgorithm();
    expect(conversionErrors).toBeNull();
  });

  test('should validate backward compatibility', () => {
    const compatibilityErrors = validateBackwardCompatibility();
    expect(compatibilityErrors).toBeNull();
  });
});

describe('Northwestern Schema - Coverage Statistics', () => {
  
  test('should generate Northwestern coverage statistics', () => {
    const stats = getNorthwesternCoverageStats();
    
    // Should have stats for all categories
    expect(stats).toHaveProperty('MRSA');
    expect(stats).toHaveProperty('pseudomonas');
    expect(stats).toHaveProperty('anaerobes');
    
    // Each category should have coverage counts
    Object.values(stats).forEach(categoryStat => {
      expect(categoryStat).toHaveProperty('noCoverage');
      expect(categoryStat).toHaveProperty('someCoverage');
      expect(categoryStat).toHaveProperty('goodCoverage');
      expect(typeof categoryStat.noCoverage).toBe('number');
    });
  });

  test('should have reasonable distribution across categories', () => {
    const stats = getNorthwesternCoverageStats();
    
    // MRSA should have fewer good coverage options than gram negatives
    expect(stats.MRSA.goodCoverage).toBeLessThan(stats.gramNegative.goodCoverage);
    
    // Anaerobes should have reasonable coverage
    expect(stats.anaerobes.goodCoverage).toBeGreaterThan(0);
  });
});

describe('Northwestern Schema - Medical Accuracy Spot Checks', () => {
  
  test('should have accurate MRSA coverage', () => {
    // Antibiotics that should cover MRSA well
    expect(getNorthwesternSpectrum(2).MRSA).toBe(2);  // Vancomycin
    expect(getNorthwesternSpectrum(11).MRSA).toBe(2); // Linezolid
    expect(getNorthwesternSpectrum(26).MRSA).toBe(2); // Daptomycin
    expect(getNorthwesternSpectrum(23).MRSA).toBe(2); // Ceftaroline
    
    // Antibiotics that should NOT cover MRSA
    expect(getNorthwesternSpectrum(1).MRSA).toBe(0);  // Penicillin
    expect(getNorthwesternSpectrum(4).MRSA).toBe(0);  // Ceftriaxone
  });

  test('should have accurate Pseudomonas coverage', () => {
    // Anti-pseudomonal agents
    expect(getNorthwesternSpectrum(8).pseudomonas).toBe(2);  // Meropenem
    expect(getNorthwesternSpectrum(14).pseudomonas).toBe(2); // Piperacillin-tazobactam
    expect(getNorthwesternSpectrum(20).pseudomonas).toBe(2); // Cefepime
    
    // Agents without pseudomonas coverage
    expect(getNorthwesternSpectrum(4).pseudomonas).toBe(0);  // Ceftriaxone
    expect(getNorthwesternSpectrum(13).pseudomonas).toBe(0); // Cefazolin
  });

  test('should have accurate anaerobic coverage', () => {
    // Good anaerobic agents
    expect(getNorthwesternSpectrum(12).anaerobes).toBe(2); // Metronidazole
    expect(getNorthwesternSpectrum(6).anaerobes).toBe(2);  // Clindamycin
    expect(getNorthwesternSpectrum(8).anaerobes).toBe(2);  // Meropenem
    
    // Poor/no anaerobic coverage
    expect(getNorthwesternSpectrum(7).anaerobes).toBe(0);  // Gentamicin
    expect(getNorthwesternSpectrum(3).anaerobes).toBe(0);  // Ciprofloxacin
  });
});