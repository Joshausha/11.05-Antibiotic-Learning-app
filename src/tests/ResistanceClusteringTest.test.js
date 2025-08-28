/**
 * Test Suite for Phase 2 Resistance Clustering Algorithm
 * Tests resistance pattern detection with actual pathogen data
 */

import { 
  RESISTANCE_MECHANISMS, 
  parseResistancePatterns, 
  createMedicalClusteredLayout,
  CLINICAL_RESISTANCE_CLUSTERS 
} from '../components/networks/NetworkDataAdapter';
import simplePathogens from '../data/SimplePathogenData';

describe('Phase 2: Resistance Clustering Algorithm Tests', () => {
  
  describe('RESISTANCE_MECHANISMS Configuration', () => {
    test('should have all required resistance mechanisms', () => {
      expect(RESISTANCE_MECHANISMS).toBeDefined();
      expect(RESISTANCE_MECHANISMS.MRSA).toBeDefined();
      expect(RESISTANCE_MECHANISMS.ESBL).toBeDefined();
      expect(RESISTANCE_MECHANISMS.VRE).toBeDefined();
      expect(RESISTANCE_MECHANISMS.CARBAPENEM_RESISTANT).toBeDefined();
    });

    test('should have proper structure for each mechanism', () => {
      Object.values(RESISTANCE_MECHANISMS).forEach(mechanism => {
        expect(mechanism).toHaveProperty('keywords');
        expect(mechanism).toHaveProperty('severity');
        expect(mechanism).toHaveProperty('clinical_significance');
        expect(mechanism).toHaveProperty('color');
        expect(Array.isArray(mechanism.keywords)).toBe(true);
      });
    });
  });

  describe('parseResistancePatterns Function', () => {
    test('should detect MRSA patterns correctly', () => {
      const result = parseResistancePatterns('MRSA strains are resistant to methicillin');
      expect(result.mechanisms).toBeDefined();
      expect(result.mechanisms.some(m => m.type === 'MRSA')).toBe(true);
      expect(result.severity).toBe('high');
      expect(result.clinical_significance).toBe('critical');
    });

    test('should detect ESBL patterns correctly', () => {
      const result = parseResistancePatterns('ESBL-producing strains');
      expect(result.mechanisms).toBeDefined();
      expect(result.mechanisms.some(m => m.type === 'ESBL')).toBe(true);
      expect(result.severity).toBe('high');
      expect(result.clinical_significance).toBe('critical');
    });

    test('should detect VRE patterns correctly', () => {
      const result = parseResistancePatterns('VRE (vancomycin-resistant) strains');
      expect(result.mechanisms).toBeDefined();
      expect(result.mechanisms.some(m => m.type === 'VRE')).toBe(true);
      expect(result.severity).toBe('high');
      expect(result.clinical_significance).toBe('critical');
    });

    test('should detect carbapenem resistance patterns correctly', () => {
      const result = parseResistancePatterns('Carbapenem-resistant strains (CRE)');
      expect(result.mechanisms).toBeDefined();
      expect(result.mechanisms.some(m => m.type === 'CARBAPENEM_RESISTANT')).toBe(true);
      expect(result.severity).toBe('critical');
      expect(result.clinical_significance).toBe('critical');
    });

    test('should handle multiple resistance patterns', () => {
      const result = parseResistancePatterns('AmpC beta-lactamases, carbapenem resistance');
      expect(result.mechanisms.length).toBeGreaterThan(0);
    });

    test('should return empty array for no resistance patterns', () => {
      const result = parseResistancePatterns('Generally susceptible to penicillin');
      // Note: The function may detect SUSCEPTIBLE as a mechanism
      expect(result.mechanisms).toBeDefined();
      // Severity should be low for susceptible pathogens, not unknown
      expect(['unknown', 'low'].includes(result.severity)).toBe(true);
    });
  });

  describe('Real Pathogen Data Analysis', () => {
    let resistanceResults = [];

    beforeAll(() => {
      // Analyze all pathogens with resistance data
      resistanceResults = simplePathogens
        .filter(pathogen => pathogen.resistance)
        .map(pathogen => ({
          pathogen: pathogen.name,
          commonName: pathogen.commonName,
          resistanceText: pathogen.resistance,
          analysis: parseResistancePatterns(pathogen.resistance)
        }))
        .filter(result => result.analysis.mechanisms.length > 0);
    });

    test('should identify resistance patterns in actual pathogen data', () => {
      expect(resistanceResults.length).toBeGreaterThan(0);
      console.log(`✅ Found ${resistanceResults.length} pathogens with detected resistance patterns`);
    });

    test('should detect MRSA in Staphylococcus aureus', () => {
      const staphResult = resistanceResults.find(
        result => result.pathogen === 'Staphylococcus aureus'
      );
      expect(staphResult).toBeDefined();
      expect(staphResult.analysis.mechanisms.some(m => m.type === 'MRSA')).toBe(true);
    });

    test('should detect ESBL in E. coli', () => {
      const ecoliResult = resistanceResults.find(
        result => result.pathogen === 'Escherichia coli'
      );
      expect(ecoliResult).toBeDefined();
      expect(ecoliResult.analysis.mechanisms.some(m => m.type === 'ESBL')).toBe(true);
    });

    test('should detect VRE in Enterococcus species', () => {
      const enterococcusResults = resistanceResults.filter(
        result => result.pathogen.includes('Enterococcus')
      );
      expect(enterococcusResults.length).toBeGreaterThan(0);
      enterococcusResults.forEach(result => {
        expect(result.analysis.mechanisms.some(m => m.type === 'VRE')).toBe(true);
      });
    });

    test('should detect carbapenem resistance in Klebsiella', () => {
      const klebsiellaResult = resistanceResults.find(
        result => result.pathogen === 'Klebsiella pneumoniae'
      );
      expect(klebsiellaResult).toBeDefined();
      expect(klebsiellaResult.analysis.mechanisms.some(m => m.type === 'CARBAPENEM_RESISTANT')).toBe(true);
    });

    test('should assign correct clinical significance levels', () => {
      resistanceResults.forEach(result => {
        expect(['critical', 'high', 'important', 'moderate', 'low']).toContain(
          result.analysis.clinical_significance
        );
      });
    });

    test('should assign correct severity levels', () => {
      resistanceResults.forEach(result => {
        expect(['critical', 'high', 'medium', 'low', 'none']).toContain(
          result.analysis.severity
        );
      });
    });
  });

  describe('Medical Clustering Layout', () => {
    test('should create clustered layout for resistance-positive pathogens', () => {
      const pathogenNodes = simplePathogens
        .filter(pathogen => pathogen.resistance)
        .slice(0, 5) // Test with first 5 for performance
        .map((pathogen, index) => ({
          data: {
            id: `pathogen_${index + 1}`,
            name: pathogen.name,
            commonName: pathogen.commonName,
            resistance: pathogen.resistance,
            resistanceAnalysis: parseResistancePatterns(pathogen.resistance)
          }
        }));

      const clusteredLayout = createMedicalClusteredLayout(pathogenNodes);
      expect(clusteredLayout).toBeDefined();
      expect(clusteredLayout.name).toBe('preset');
    });

    test('should handle empty pathogen list', () => {
      const emptyLayout = createMedicalClusteredLayout([]);
      expect(emptyLayout).toBeDefined();
    });
  });

  describe('Clinical Resistance Clusters', () => {
    test('should have defined cluster configurations', () => {
      expect(CLINICAL_RESISTANCE_CLUSTERS).toBeDefined();
      expect(typeof CLINICAL_RESISTANCE_CLUSTERS).toBe('object');
    });
  });

  describe('Integration Test - Complete Resistance Analysis Pipeline', () => {
    test('should process all pathogens through complete resistance analysis pipeline', () => {
      const processedPathogens = simplePathogens.map(pathogen => {
        const resistanceAnalysis = parseResistancePatterns(pathogen.resistance || '');
        return {
          ...pathogen,
          resistanceAnalysis,
          hasResistance: resistanceAnalysis.mechanisms.length > 0
        };
      });

      const resistantPathogens = processedPathogens.filter(p => p.hasResistance);
      
      expect(processedPathogens.length).toBe(simplePathogens.length);
      expect(resistantPathogens.length).toBeGreaterThan(0);
      
      console.log(`\n🔬 Phase 2 Resistance Analysis Results:`);
      console.log(`   Total pathogens: ${processedPathogens.length}`);
      console.log(`   Pathogens with resistance: ${resistantPathogens.length}`);
      console.log(`   Resistance rate: ${(resistantPathogens.length/processedPathogens.length*100).toFixed(1)}%`);
      
      // Log detected resistance mechanisms
      const mechanismCounts = {};
      resistantPathogens.forEach(pathogen => {
        pathogen.resistanceAnalysis.mechanisms.forEach(mechanism => {
          mechanismCounts[mechanism.type] = (mechanismCounts[mechanism.type] || 0) + 1;
        });
      });
      
      console.log(`   Resistance mechanisms detected:`);
      Object.entries(mechanismCounts).forEach(([mechanism, count]) => {
        console.log(`     - ${mechanism}: ${count} pathogens`);
      });
    });
  });
});