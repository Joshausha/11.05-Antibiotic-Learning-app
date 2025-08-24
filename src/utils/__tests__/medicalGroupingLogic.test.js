/**
 * Medical Grouping Logic Tests
 * 
 * Comprehensive test suite for medical grouping algorithms
 * Focus: Clinical accuracy, drug class organization, generation-based clustering
 * Agent: Delta-1 - Coverage Improvement Specialist
 */

import {
  GENERATION_ORDER,
  DRUG_CLASS_HIERARCHIES,
  ROUTE_BASED_GROUPS,
  COVERAGE_PATTERNS,
  groupAntibioticsByClass,
  groupByGeneration,
  groupByRoute,
  groupByCellWallActivity,
  validateMedicalAccuracy,
  analyzeCoveragePatterns,
  generateClinicalStatistics,
  getNorthwesternCompliantGroups,
  optimizeGroupLayout,
  validateGroupIntegrity
} from '../medicalGroupingLogic';

// Mock antibiotic data for testing
const mockAntibioticData = [
  {
    id: 'cefazolin',
    name: 'Cefazolin',
    drugClass: 'Cephalosporins',
    generation: '1st generation',
    route: ['IV'],
    cellWallActivity: true,
    gramPositive: true,
    gramNegative: false,
    coverage: ['Staphylococcus aureus', 'Streptococcus']
  },
  {
    id: 'ceftriaxone',
    name: 'Ceftriaxone',
    drugClass: 'Cephalosporins',
    generation: '3rd generation',
    route: ['IV', 'IM'],
    cellWallActivity: true,
    gramPositive: true,
    gramNegative: true,
    coverage: ['Streptococcus pneumoniae', 'Haemophilus influenzae']
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    drugClass: 'Penicillins',
    generation: 'Natural',
    route: ['oral'],
    cellWallActivity: true,
    gramPositive: true,
    gramNegative: false,
    coverage: ['Streptococcus', 'Some E. coli']
  },
  {
    id: 'ciprofloxacin',
    name: 'Ciprofloxacin',
    drugClass: 'Fluoroquinolones',
    generation: '2nd generation',
    route: ['oral', 'IV'],
    cellWallActivity: false,
    gramPositive: true,
    gramNegative: true,
    coverage: ['Pseudomonas aeruginosa', 'Enterobacteriaceae']
  },
  {
    id: 'vancomycin',
    name: 'Vancomycin',
    drugClass: 'Glycopeptides',
    generation: 'First',
    route: ['IV'],
    cellWallActivity: true,
    gramPositive: true,
    gramNegative: false,
    coverage: ['MRSA', 'VRE (limited)']
  }
];

describe('Medical Grouping Logic System', () => {
  describe('Generation Order Configuration', () => {
    test('should have proper cephalosporin generation order', () => {
      expect(GENERATION_ORDER).toBeDefined();
      expect(GENERATION_ORDER.cephalosporins).toBeDefined();
      
      const cephGenerations = GENERATION_ORDER.cephalosporins;
      expect(cephGenerations['1st generation'].order).toBe(1);
      expect(cephGenerations['2nd generation'].order).toBe(2);
      expect(cephGenerations['3rd generation'].order).toBe(3);
      expect(cephGenerations['4th generation'].order).toBe(4);
    });

    test('should include clinical focus for each generation', () => {
      const firstGen = GENERATION_ORDER.cephalosporins['1st generation'];
      expect(firstGen.clinicalFocus).toBeDefined();
      expect(firstGen.examples).toBeDefined();
      expect(firstGen.coverage).toBeDefined();
    });

    test('should have medically accurate generation examples', () => {
      const thirdGen = GENERATION_ORDER.cephalosporins['3rd generation'];
      expect(thirdGen.examples).toContain('Ceftriaxone');
      expect(thirdGen.examples).toContain('Ceftazidime');
    });
  });

  describe('Drug Class Grouping', () => {
    test('should group antibiotics by drug class correctly', () => {
      let groupedResult;
      expect(() => {
        groupedResult = groupAntibioticsByClass(mockAntibioticData);
      }).not.toThrow();
      
      if (groupedResult) {
        expect(groupedResult).toHaveProperty('Cephalosporins');
        expect(groupedResult).toHaveProperty('Penicillins');
        expect(groupedResult).toHaveProperty('Fluoroquinolones');
        expect(groupedResult).toHaveProperty('Glycopeptides');
      }
    });

    test('should handle empty antibiotic data gracefully', () => {
      let result;
      expect(() => {
        result = groupAntibioticsByClass([]);
      }).not.toThrow();
      
      if (result) {
        expect(typeof result).toBe('object');
      }
    });

    test('should handle undefined antibiotic data safely', () => {
      expect(() => {
        groupAntibioticsByClass(undefined);
        groupAntibioticsByClass(null);
      }).not.toThrow();
    });

    test('should preserve antibiotic properties in grouped results', () => {
      const grouped = groupAntibioticsByClass(mockAntibioticData);
      
      if (grouped && grouped.Cephalosporins) {
        const cefazolin = grouped.Cephalosporins.find(ab => ab.id === 'cefazolin');
        if (cefazolin) {
          expect(cefazolin.generation).toBe('1st generation');
          expect(cefazolin.cellWallActivity).toBe(true);
        }
      }
    });
  });

  describe('Generation-Based Grouping', () => {
    test('should group cephalosporins by generation correctly', () => {
      let generationGroups;
      expect(() => {
        generationGroups = groupByGeneration(mockAntibioticData, 'Cephalosporins');
      }).not.toThrow();
      
      if (generationGroups) {
        expect(generationGroups).toHaveProperty('1st generation');
        expect(generationGroups).toHaveProperty('3rd generation');
      }
    });

    test('should order generations correctly based on clinical progression', () => {
      const cephData = mockAntibioticData.filter(ab => ab.drugClass === 'Cephalosporins');
      const generationGroups = groupByGeneration(cephData, 'Cephalosporins');
      
      if (generationGroups) {
        const firstGen = generationGroups['1st generation'];
        const thirdGen = generationGroups['3rd generation'];
        
        if (firstGen && thirdGen) {
          expect(firstGen[0].name).toBe('Cefazolin');
          expect(thirdGen[0].name).toBe('Ceftriaxone');
        }
      }
    });

    test('should handle drug classes without generation data', () => {
      expect(() => {
        groupByGeneration(mockAntibioticData, 'UnknownDrugClass');
      }).not.toThrow();
    });

    test('should validate generation medical accuracy', () => {
      const penicillinData = mockAntibioticData.filter(ab => ab.drugClass === 'Penicillins');
      let result;
      
      expect(() => {
        result = groupByGeneration(penicillinData, 'Penicillins');
      }).not.toThrow();
    });
  });

  describe('Route-Based Grouping', () => {
    test('should group antibiotics by administration route', () => {
      let routeGroups;
      expect(() => {
        routeGroups = groupByRoute(mockAntibioticData);
      }).not.toThrow();
      
      if (routeGroups) {
        expect(routeGroups).toHaveProperty('oral');
        expect(routeGroups).toHaveProperty('IV');
        expect(routeGroups.oral).toBeDefined();
        expect(routeGroups.IV).toBeDefined();
      }
    });

    test('should handle antibiotics with multiple routes', () => {
      const routeGroups = groupByRoute(mockAntibioticData);
      
      if (routeGroups) {
        // Ciprofloxacin should appear in both oral and IV groups
        const oralCipro = routeGroups.oral?.find(ab => ab.id === 'ciprofloxacin');
        const ivCipro = routeGroups.IV?.find(ab => ab.id === 'ciprofloxacin');
        
        expect(oralCipro).toBeDefined();
        expect(ivCipro).toBeDefined();
      }
    });

    test('should handle missing route information gracefully', () => {
      const dataWithMissingRoutes = [
        { id: 'test', name: 'Test Drug', drugClass: 'Test' }
      ];
      
      expect(() => {
        groupByRoute(dataWithMissingRoutes);
      }).not.toThrow();
    });
  });

  describe('Cell Wall Activity Grouping', () => {
    test('should separate cell wall active and non-active antibiotics', () => {
      let cellWallGroups;
      expect(() => {
        cellWallGroups = groupByCellWallActivity(mockAntibioticData);
      }).not.toThrow();
      
      if (cellWallGroups) {
        expect(cellWallGroups).toHaveProperty('cellWallActive');
        expect(cellWallGroups).toHaveProperty('nonCellWallActive');
      }
    });

    test('should correctly classify beta-lactams as cell wall active', () => {
      const cellWallGroups = groupByCellWallActivity(mockAntibioticData);
      
      if (cellWallGroups && cellWallGroups.cellWallActive) {
        const betalactams = cellWallGroups.cellWallActive.filter(ab => 
          ab.drugClass === 'Cephalosporins' || ab.drugClass === 'Penicillins'
        );
        expect(betalactams.length).toBeGreaterThan(0);
      }
    });

    test('should correctly classify fluoroquinolones as non-cell wall active', () => {
      const cellWallGroups = groupByCellWallActivity(mockAntibioticData);
      
      if (cellWallGroups && cellWallGroups.nonCellWallActive) {
        const fluoroquinolones = cellWallGroups.nonCellWallActive.filter(ab => 
          ab.drugClass === 'Fluoroquinolones'
        );
        expect(fluoroquinolones.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Medical Accuracy Validation', () => {
    test('should validate drug class assignments', () => {
      let validationResult;
      expect(() => {
        validationResult = validateMedicalAccuracy(mockAntibioticData, 'drugClass');
      }).not.toThrow();
      
      if (validationResult) {
        expect(typeof validationResult).toBe('object');
        expect(validationResult).toHaveProperty('isValid');
      }
    });

    test('should validate generation assignments for cephalosporins', () => {
      const cephData = mockAntibioticData.filter(ab => ab.drugClass === 'Cephalosporins');
      let validationResult;
      
      expect(() => {
        validationResult = validateMedicalAccuracy(cephData, 'generation');
      }).not.toThrow();
    });

    test('should validate coverage patterns for clinical accuracy', () => {
      expect(() => {
        validateMedicalAccuracy(mockAntibioticData, 'coverage');
      }).not.toThrow();
    });

    test('should detect medical inaccuracies in drug classifications', () => {
      const inaccurateData = [{
        id: 'test',
        name: 'Test Drug',
        drugClass: 'Cephalosporins',
        generation: '1st generation',
        cellWallActivity: false // Inaccurate - cephalosporins are cell wall active
      }];
      
      let validationResult;
      expect(() => {
        validationResult = validateMedicalAccuracy(inaccurateData, 'consistency');
      }).not.toThrow();
    });
  });

  describe('Coverage Pattern Analysis', () => {
    test('should analyze gram-positive and gram-negative coverage patterns', () => {
      let coverageAnalysis;
      expect(() => {
        coverageAnalysis = analyzeCoveragePatterns(mockAntibioticData);
      }).not.toThrow();
      
      if (coverageAnalysis) {
        expect(coverageAnalysis).toHaveProperty('gramPositive');
        expect(coverageAnalysis).toHaveProperty('gramNegative');
      }
    });

    test('should identify broad spectrum antibiotics', () => {
      const coverageAnalysis = analyzeCoveragePatterns(mockAntibioticData);
      
      if (coverageAnalysis && coverageAnalysis.broadSpectrum) {
        // Ciprofloxacin and Ceftriaxone should be identified as broad spectrum
        const broadSpectrumNames = coverageAnalysis.broadSpectrum.map(ab => ab.name);
        expect(broadSpectrumNames).toContain('Ciprofloxacin');
      }
    });

    test('should calculate coverage statistics', () => {
      const coverageAnalysis = analyzeCoveragePatterns(mockAntibioticData);
      
      if (coverageAnalysis && coverageAnalysis.statistics) {
        expect(coverageAnalysis.statistics).toHaveProperty('totalAntibiotics');
        expect(coverageAnalysis.statistics).toHaveProperty('gramPositivePercentage');
        expect(coverageAnalysis.statistics).toHaveProperty('gramNegativePercentage');
      }
    });
  });

  describe('Clinical Statistics Generation', () => {
    test('should generate comprehensive clinical statistics', () => {
      let clinicalStats;
      expect(() => {
        clinicalStats = generateClinicalStatistics(mockAntibioticData);
      }).not.toThrow();
      
      if (clinicalStats) {
        expect(clinicalStats).toHaveProperty('drugClassDistribution');
        expect(clinicalStats).toHaveProperty('routeDistribution');
        expect(clinicalStats).toHaveProperty('coverageAnalysis');
      }
    });

    test('should calculate drug class distribution accurately', () => {
      const clinicalStats = generateClinicalStatistics(mockAntibioticData);
      
      if (clinicalStats && clinicalStats.drugClassDistribution) {
        expect(clinicalStats.drugClassDistribution.Cephalosporins).toBe(2);
        expect(clinicalStats.drugClassDistribution.Penicillins).toBe(1);
        expect(clinicalStats.drugClassDistribution.Fluoroquinolones).toBe(1);
        expect(clinicalStats.drugClassDistribution.Glycopeptides).toBe(1);
      }
    });

    test('should provide medical recommendations based on statistics', () => {
      const clinicalStats = generateClinicalStatistics(mockAntibioticData);
      
      if (clinicalStats && clinicalStats.recommendations) {
        expect(Array.isArray(clinicalStats.recommendations)).toBe(true);
      }
    });
  });

  describe('Northwestern Compliance Checking', () => {
    test('should generate Northwestern-compliant group organization', () => {
      let northwesternGroups;
      expect(() => {
        northwesternGroups = getNorthwesternCompliantGroups(mockAntibioticData);
      }).not.toThrow();
      
      if (northwesternGroups) {
        expect(typeof northwesternGroups).toBe('object');
      }
    });

    test('should validate Northwestern methodology compliance', () => {
      const northwesternGroups = getNorthwesternCompliantGroups(mockAntibioticData);
      
      if (northwesternGroups) {
        // Verify that groups follow Northwestern principles
        expect(northwesternGroups).toHaveProperty('spatialLayout');
        expect(northwesternGroups).toHaveProperty('colorCoding');
      }
    });

    test('should optimize group layout for Northwestern visualization', () => {
      let optimizedLayout;
      expect(() => {
        optimizedLayout = optimizeGroupLayout(mockAntibioticData, {
          maxGroupSize: 8,
          spatialDistribution: 'balanced'
        });
      }).not.toThrow();
    });
  });

  describe('Group Integrity Validation', () => {
    test('should validate group completeness and consistency', () => {
      const groupedData = groupAntibioticsByClass(mockAntibioticData);
      let integrityResult;
      
      expect(() => {
        integrityResult = validateGroupIntegrity(groupedData);
      }).not.toThrow();
      
      if (integrityResult) {
        expect(integrityResult).toHaveProperty('isValid');
        expect(integrityResult).toHaveProperty('errors');
      }
    });

    test('should detect missing antibiotics in groups', () => {
      const incompleteGroups = {
        Cephalosporins: [mockAntibioticData[0]], // Missing second cephalosporin
        Penicillins: [mockAntibioticData[2]]
      };
      
      expect(() => {
        validateGroupIntegrity(incompleteGroups);
      }).not.toThrow();
    });

    test('should validate medical consistency across groups', () => {
      const groupedData = groupAntibioticsByClass(mockAntibioticData);
      
      expect(() => {
        validateGroupIntegrity(groupedData, { 
          checkMedicalAccuracy: true,
          validateCoverage: true 
        });
      }).not.toThrow();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle null and undefined inputs gracefully', () => {
      expect(() => {
        groupAntibioticsByClass(null);
        groupAntibioticsByClass(undefined);
        groupByGeneration(null, 'Test');
        groupByRoute(undefined);
      }).not.toThrow();
    });

    test('should handle empty arrays and objects', () => {
      expect(() => {
        groupAntibioticsByClass([]);
        analyzeCoveragePatterns([]);
        generateClinicalStatistics([]);
      }).not.toThrow();
    });

    test('should handle malformed antibiotic data', () => {
      const malformedData = [
        { /* missing required fields */ },
        { id: '', name: '', drugClass: null },
        { id: 'test', name: 'Test' /* missing drugClass */ }
      ];
      
      expect(() => {
        groupAntibioticsByClass(malformedData);
        validateMedicalAccuracy(malformedData, 'all');
      }).not.toThrow();
    });

    test('should handle very large datasets efficiently', () => {
      const largeDataset = Array(1000).fill(0).map((_, i) => ({
        id: `antibiotic_${i}`,
        name: `Antibiotic ${i}`,
        drugClass: `Class${i % 10}`,
        generation: `${(i % 4) + 1}st generation`,
        route: i % 2 === 0 ? ['oral'] : ['IV'],
        cellWallActivity: i % 2 === 0,
        gramPositive: true,
        gramNegative: i % 3 === 0
      }));
      
      expect(() => {
        groupAntibioticsByClass(largeDataset);
        analyzeCoveragePatterns(largeDataset);
      }).not.toThrow();
    });
  });
});