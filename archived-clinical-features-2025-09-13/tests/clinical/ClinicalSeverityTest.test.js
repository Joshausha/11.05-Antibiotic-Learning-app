/**
 * Test Suite for Phase 2: Clinical Severity-Based Node Sizing with Warning Indicators
 * Tests enhanced clinical severity calculations and visual warning system
 */

import { 
  calculateEnhancedClinicalSeverity, 
  CLINICAL_WARNING_INDICATORS,
  SEVERITY_SIZE_MAP,
  parseResistancePatterns,
  transformPathogenWithResistanceClustering
} from '../components/networks/NetworkDataAdapter';
import simplePathogens from '../data/SimplePathogenData';

describe('Phase 2: Clinical Severity-Based Node Sizing with Warning Indicators', () => {
  
  describe('Enhanced Clinical Severity Calculations', () => {
    test('should handle basic severity without resistance', () => {
      const result = calculateEnhancedClinicalSeverity('high', null);
      
      expect(result.originalSeverity).toBe('high');
      expect(result.enhancedSeverity).toBe('high');
      expect(result.nodeSize).toBe(SEVERITY_SIZE_MAP.high);
      expect(result.warningIndicators).toEqual([]);
      expect(result.hasResistanceEscalation).toBe(false);
    });

    test('should escalate severity for critical resistance', () => {
      const resistanceInfo = parseResistancePatterns('MRSA strains are resistant to methicillin');
      const result = calculateEnhancedClinicalSeverity('medium', resistanceInfo);
      
      expect(result.originalSeverity).toBe('medium');
      expect(result.enhancedSeverity).toBe('critical');
      expect(result.nodeSize).toBeGreaterThan(SEVERITY_SIZE_MAP.medium);
      expect(result.hasResistanceEscalation).toBe(true);
      expect(result.requiresEnhancedPrecautions).toBe(true);
    });

    test('should calculate risk scores correctly', () => {
      const resistanceInfo = parseResistancePatterns('VRE (vancomycin-resistant) strains');
      const result = calculateEnhancedClinicalSeverity('high', resistanceInfo);
      
      expect(result.riskScore).toBeGreaterThan(70);
      expect(result.riskScore).toBeLessThanOrEqual(100);
      expect(typeof result.riskScore).toBe('number');
    });

    test('should generate appropriate warning indicators', () => {
      const resistanceInfo = parseResistancePatterns('Carbapenem-resistant strains (CRE)');
      const result = calculateEnhancedClinicalSeverity('high', resistanceInfo);
      
      expect(result.warningIndicators.length).toBeGreaterThan(0);
      expect(result.clinicalAlerts.length).toBeGreaterThan(0);
      
      const firstAlert = result.clinicalAlerts[0];
      expect(firstAlert).toHaveProperty('level');
      expect(firstAlert).toHaveProperty('message');
      expect(firstAlert).toHaveProperty('mechanisms');
    });

    test('should apply correct warning styles', () => {
      const result = calculateEnhancedClinicalSeverity('critical', null);
      
      expect(result.warningStyle).toBeDefined();
      expect(result.warningStyle.color).toBe(CLINICAL_WARNING_INDICATORS.critical.color);
      expect(result.warningStyle.borderWidth).toBe(4);
      expect(result.warningStyle.icon).toBe('⚠️');
    });
  });

  describe('CLINICAL_WARNING_INDICATORS Configuration', () => {
    test('should have all required severity levels', () => {
      const requiredLevels = ['critical', 'high', 'medium', 'low', 'unknown'];
      
      requiredLevels.forEach(level => {
        expect(CLINICAL_WARNING_INDICATORS[level]).toBeDefined();
        expect(CLINICAL_WARNING_INDICATORS[level]).toHaveProperty('color');
        expect(CLINICAL_WARNING_INDICATORS[level]).toHaveProperty('borderWidth');
        expect(CLINICAL_WARNING_INDICATORS[level]).toHaveProperty('icon');
        expect(CLINICAL_WARNING_INDICATORS[level]).toHaveProperty('warningLevel');
      });
    });

    test('should have progressive border widths by severity', () => {
      expect(CLINICAL_WARNING_INDICATORS.critical.borderWidth).toBeGreaterThan(
        CLINICAL_WARNING_INDICATORS.high.borderWidth
      );
      expect(CLINICAL_WARNING_INDICATORS.high.borderWidth).toBeGreaterThan(
        CLINICAL_WARNING_INDICATORS.medium.borderWidth
      );
      expect(CLINICAL_WARNING_INDICATORS.medium.borderWidth).toBeGreaterThan(
        CLINICAL_WARNING_INDICATORS.low.borderWidth
      );
    });

    test('should have unique visual properties for each level', () => {
      const levels = Object.keys(CLINICAL_WARNING_INDICATORS);
      const colors = levels.map(level => CLINICAL_WARNING_INDICATORS[level].color);
      const icons = levels.map(level => CLINICAL_WARNING_INDICATORS[level].icon);
      
      expect(new Set(colors).size).toBe(levels.length);
      expect(new Set(icons).size).toBe(levels.length);
    });
  });

  describe('Enhanced SEVERITY_SIZE_MAP', () => {
    test('should include critical severity level', () => {
      expect(SEVERITY_SIZE_MAP.critical).toBe(100);
      expect(SEVERITY_SIZE_MAP.critical).toBeGreaterThan(SEVERITY_SIZE_MAP.high);
    });

    test('should have progressive sizing', () => {
      expect(SEVERITY_SIZE_MAP.critical).toBeGreaterThan(SEVERITY_SIZE_MAP.high);
      expect(SEVERITY_SIZE_MAP.high).toBeGreaterThan(SEVERITY_SIZE_MAP.medium);
      expect(SEVERITY_SIZE_MAP.medium).toBeGreaterThan(SEVERITY_SIZE_MAP.low);
    });
  });

  describe('Integration with Real Pathogen Data', () => {
    test('should enhance pathogen nodes with clinical severity analysis', () => {
      const staphAureus = simplePathogens.find(p => p.name === 'Staphylococcus aureus');
      expect(staphAureus).toBeDefined();
      
      const enhancedNode = transformPathogenWithResistanceClustering(staphAureus);
      
      expect(enhancedNode.data).toHaveProperty('enhancedSeverity');
      expect(enhancedNode.data).toHaveProperty('warningLevel');
      expect(enhancedNode.data).toHaveProperty('riskScore');
      expect(enhancedNode.data).toHaveProperty('warningIndicators');
      expect(enhancedNode.data).toHaveProperty('borderWidth');
      expect(enhancedNode.data).toHaveProperty('shadowColor');
      expect(enhancedNode.data).toHaveProperty('warningIcon');
    });

    test('should identify high-risk pathogens correctly', () => {
      const highRiskPathogens = simplePathogens.filter(pathogen => {
        const resistanceInfo = parseResistancePatterns(pathogen.resistance || '');
        const severityInfo = calculateEnhancedClinicalSeverity(pathogen.severity, resistanceInfo);
        return severityInfo.enhancedSeverity === 'critical';
      });
      
      expect(highRiskPathogens.length).toBeGreaterThan(0);
      
      // Should include MRSA pathogens
      const mrsaPathogens = highRiskPathogens.filter(p => 
        p.resistance && p.resistance.toLowerCase().includes('mrsa')
      );
      expect(mrsaPathogens.length).toBeGreaterThan(0);
    });

    test('should calculate appropriate node sizes based on risk', () => {
      const testCases = [
        { name: 'Staphylococcus aureus', expectedMinSize: 80 },
        { name: 'Escherichia coli', expectedMinSize: 60 },
        { name: 'Klebsiella pneumoniae', expectedMinSize: 80 }
      ];
      
      testCases.forEach(testCase => {
        const pathogen = simplePathogens.find(p => p.name === testCase.name);
        if (pathogen) {
          const enhancedNode = transformPathogenWithResistanceClustering(pathogen);
          expect(enhancedNode.data.size).toBeGreaterThanOrEqual(testCase.expectedMinSize);
        }
      });
    });

    test('should provide clinical decision support data', () => {
      const pathogen = simplePathogens.find(p => p.resistance && p.resistance.includes('VRE'));
      if (pathogen) {
        const enhancedNode = transformPathogenWithResistanceClustering(pathogen);
        
        expect(enhancedNode.data).toHaveProperty('clinicalNotes');
        expect(enhancedNode.data).toHaveProperty('clinicalWarningDescription');
        
        if (enhancedNode.data.medicalEducationNotes) {
          expect(enhancedNode.data.medicalEducationNotes).toHaveProperty('recommendedActions');
          expect(Array.isArray(enhancedNode.data.medicalEducationNotes.recommendedActions)).toBe(true);
        }
      }
    });
  });

  describe('Clinical Alert System', () => {
    test('should generate appropriate alerts for critical pathogens', () => {
      const resistanceInfo = parseResistancePatterns('Multi-drug resistant (MDR)');
      const result = calculateEnhancedClinicalSeverity('high', resistanceInfo);
      
      if (result.clinicalAlerts.length > 0) {
        const alert = result.clinicalAlerts[0];
        expect(['CRITICAL', 'HIGH', 'MODERATE']).toContain(alert.level);
        expect(alert.message).toBeTruthy();
        expect(Array.isArray(alert.mechanisms)).toBe(true);
      }
    });

    test('should provide accessibility-compliant descriptions', () => {
      const pathogen = { name: 'Test Pathogen', resistance: 'ESBL-producing strains', severity: 'high' };
      const enhancedNode = transformPathogenWithResistanceClustering(pathogen);
      
      expect(enhancedNode.data.ariaLabel).toBeTruthy();
      expect(enhancedNode.data.clinicalWarningDescription).toBeTruthy();
      expect(typeof enhancedNode.data.ariaLabel).toBe('string');
    });
  });

  describe('Performance and Edge Cases', () => {
    test('should handle missing or invalid input gracefully', () => {
      expect(() => calculateEnhancedClinicalSeverity(null, null)).not.toThrow();
      expect(() => calculateEnhancedClinicalSeverity('invalid', {})).not.toThrow();
      expect(() => calculateEnhancedClinicalSeverity('', null)).not.toThrow();
    });

    test('should return valid data structures for all inputs', () => {
      const result = calculateEnhancedClinicalSeverity('unknown', null);
      
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('nodeSize');
      expect(result).toHaveProperty('riskScore');
      expect(Array.isArray(result.warningIndicators)).toBe(true);
      expect(Array.isArray(result.clinicalAlerts)).toBe(true);
    });

    test('should process all pathogen data without errors', () => {
      const results = simplePathogens.map(pathogen => {
        expect(() => transformPathogenWithResistanceClustering(pathogen)).not.toThrow();
        return transformPathogenWithResistanceClustering(pathogen);
      });
      
      expect(results.length).toBe(simplePathogens.length);
      results.forEach(result => {
        expect(result.data.size).toBeGreaterThan(0);
        expect(result.data.riskScore).toBeGreaterThanOrEqual(0);
        expect(result.data.riskScore).toBeLessThanOrEqual(100);
      });
    });
  });
});