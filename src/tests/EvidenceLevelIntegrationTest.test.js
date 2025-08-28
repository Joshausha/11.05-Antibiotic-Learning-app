/**
 * Test Suite for Phase 2: Evidence Level Integration System
 * Tests evidence-based medicine grading and clinical recommendations
 */

import { 
  analyzeEvidenceStrength,
  transformEdgeWithEvidenceAnalysis,
  EVIDENCE_STRENGTH_MAP
} from '../components/networks/NetworkDataAdapter';

describe('Phase 2: Evidence Level Integration System', () => {
  
  describe('EVIDENCE_STRENGTH_MAP Configuration', () => {
    test('should have all required evidence levels', () => {
      const requiredLevels = ['A', 'B', 'C', 'D', 'EXPERT', 'UNKNOWN'];
      
      requiredLevels.forEach(level => {
        expect(EVIDENCE_STRENGTH_MAP[level]).toBeDefined();
        expect(EVIDENCE_STRENGTH_MAP[level]).toHaveProperty('style');
        expect(EVIDENCE_STRENGTH_MAP[level]).toHaveProperty('modifier');
        expect(EVIDENCE_STRENGTH_MAP[level]).toHaveProperty('thickness');
        expect(EVIDENCE_STRENGTH_MAP[level]).toHaveProperty('opacity');
        expect(EVIDENCE_STRENGTH_MAP[level]).toHaveProperty('color');
        expect(EVIDENCE_STRENGTH_MAP[level]).toHaveProperty('confidence');
        expect(EVIDENCE_STRENGTH_MAP[level]).toHaveProperty('description');
        expect(EVIDENCE_STRENGTH_MAP[level]).toHaveProperty('clinicalWeight');
        expect(EVIDENCE_STRENGTH_MAP[level]).toHaveProperty('guidelineStrength');
        expect(EVIDENCE_STRENGTH_MAP[level]).toHaveProperty('icon');
      });
    });

    test('should have progressive clinical weights by evidence level', () => {
      expect(EVIDENCE_STRENGTH_MAP.A.clinicalWeight).toBeGreaterThan(
        EVIDENCE_STRENGTH_MAP.B.clinicalWeight
      );
      expect(EVIDENCE_STRENGTH_MAP.B.clinicalWeight).toBeGreaterThan(
        EVIDENCE_STRENGTH_MAP.C.clinicalWeight
      );
      expect(EVIDENCE_STRENGTH_MAP.C.clinicalWeight).toBeGreaterThan(
        EVIDENCE_STRENGTH_MAP.D.clinicalWeight
      );
    });

    test('should have progressive visual thickness by evidence level', () => {
      expect(EVIDENCE_STRENGTH_MAP.A.thickness).toBeGreaterThan(
        EVIDENCE_STRENGTH_MAP.B.thickness
      );
      expect(EVIDENCE_STRENGTH_MAP.B.thickness).toBeGreaterThan(
        EVIDENCE_STRENGTH_MAP.C.thickness
      );
    });

    test('should have valid opacity values', () => {
      Object.values(EVIDENCE_STRENGTH_MAP).forEach(evidence => {
        expect(evidence.opacity).toBeGreaterThan(0);
        expect(evidence.opacity).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('analyzeEvidenceStrength Function', () => {
    test('should analyze Grade A evidence correctly', () => {
      const result = analyzeEvidenceStrength(
        'Staphylococcus aureus', 
        'Vancomycin', 
        { evidenceLevel: 'A', effectiveness: 'high' }
      );
      
      expect(result.evidenceLevel).toBe('A');
      expect(result.confidence).toBe('HIGH');
      expect(result.clinicalWeight).toBe(100);
      expect(result.guidelineStrength).toBe('Strong recommendation');
      expect(result.visualProperties.thickness).toBe(4);
      expect(result.recommendations.primary).toContain('First-line therapy supported by high-quality evidence');
    });

    test('should analyze Grade C evidence correctly', () => {
      const result = analyzeEvidenceStrength(
        'Pseudomonas aeruginosa', 
        'Colistin', 
        { evidenceLevel: 'C', severity: 'high' }
      );
      
      expect(result.evidenceLevel).toBe('C');
      expect(result.confidence).toBe('LOW');
      expect(result.clinicalWeight).toBe(50);
      expect(result.recommendations.primary).toContain('Limited evidence - use with caution');
      expect(result.recommendations.alternatives.length).toBeGreaterThan(0);
      expect(result.recommendations.monitoring).toContain('Close monitoring required');
    });

    test('should handle unknown evidence level', () => {
      const result = analyzeEvidenceStrength(
        'Mycobacterium tuberculosis', 
        'Isoniazid', 
        {}
      );
      
      expect(result.evidenceLevel).toBe('UNKNOWN');
      expect(result.confidence).toBe('UNKNOWN');
      expect(result.clinicalWeight).toBe(10);
      expect(result.recommendations.secondary).toContain('Infectious disease consultation strongly recommended');
    });

    test('should provide clinical context for high-risk pathogens', () => {
      const result = analyzeEvidenceStrength(
        'Staphylococcus aureus', 
        'Methicillin', 
        { evidenceLevel: 'B' }
      );
      
      expect(result.clinicalContext.pathogenRiskFactors).toContain('MRSA potential - requires culture-guided therapy');
      expect(result.clinicalContext.pathogenRiskFactors).toContain('Tissue penetration considerations for deep infections');
      expect(result.clinicalContext.populationSpecificFactors).toContain('Pediatric dosing considerations');
    });

    test('should provide antibiotic-specific considerations', () => {
      const result = analyzeEvidenceStrength(
        'Enterococcus faecium', 
        'Vancomycin', 
        { evidenceLevel: 'A' }
      );
      
      expect(result.clinicalContext.antibioticConsiderations).toContain('Nephrotoxicity monitoring required');
      expect(result.clinicalContext.antibioticConsiderations).toContain('Therapeutic drug monitoring essential');
    });

    test('should generate appropriate clinical pearls', () => {
      const result = analyzeEvidenceStrength(
        'Pseudomonas aeruginosa', 
        'Ceftazidime', 
        { evidenceLevel: 'A' }
      );
      
      expect(result.medicalEducationNotes.clinicalPearls).toContain('Gold standard therapy - first choice when clinically appropriate');
      expect(result.medicalEducationNotes.clinicalPearls).toContain('Consider combination therapy for serious infections');
    });

    test('should identify relevant guidelines', () => {
      const result = analyzeEvidenceStrength(
        'Streptococcus pneumoniae', 
        'Amoxicillin', 
        { evidenceLevel: 'A' }
      );
      
      expect(result.medicalEducationNotes.guidelineReferences).toContain('AAP Clinical Practice Guidelines for Pediatric Infections');
      expect(result.medicalEducationNotes.guidelineReferences).toContain('AAP Guidelines for Streptococcal Infections');
      expect(result.medicalEducationNotes.guidelineReferences).toContain('CDC Core Elements of Antibiotic Stewardship');
    });

    test('should calculate clinical confidence appropriately', () => {
      const highEvidenceResult = analyzeEvidenceStrength(
        'Escherichia coli', 
        'Ceftriaxone', 
        { evidenceLevel: 'A' }
      );
      
      const lowEvidenceResult = analyzeEvidenceStrength(
        'Pseudomonas aeruginosa', 
        'Colistin', 
        { evidenceLevel: 'D' }
      );
      
      expect(highEvidenceResult.qualityIndicators.clinicalApplicationConfidence)
        .toBeGreaterThan(lowEvidenceResult.qualityIndicators.clinicalApplicationConfidence);
    });
  });

  describe('transformEdgeWithEvidenceAnalysis Function', () => {
    const sampleEdge = {
      data: {
        id: 'edge-staph-vanco',
        source: 'pathogen-staph',
        target: 'antibiotic-vanco',
        effectiveness: 'high',
        ariaLabel: 'Staphylococcus aureus to Vancomycin'
      }
    };

    test('should enhance edge with evidence analysis', () => {
      const evidenceAnalysis = analyzeEvidenceStrength(
        'Staphylococcus aureus', 
        'Vancomycin', 
        { evidenceLevel: 'A' }
      );
      
      const enhancedEdge = transformEdgeWithEvidenceAnalysis(sampleEdge, evidenceAnalysis);
      
      expect(enhancedEdge.data.evidenceLevel).toBe('A');
      expect(enhancedEdge.data.evidenceConfidence).toBe('HIGH');
      expect(enhancedEdge.data.clinicalWeight).toBe(100);
      expect(enhancedEdge.data.lineStyle).toBe('solid');
      expect(enhancedEdge.data.width).toBe(4);
      expect(enhancedEdge.data.opacity).toBe(1.0);
      expect(enhancedEdge.data.color).toBe('#059669');
    });

    test('should preserve original edge data', () => {
      const evidenceAnalysis = analyzeEvidenceStrength(
        'Staphylococcus aureus', 
        'Vancomycin', 
        { evidenceLevel: 'B' }
      );
      
      const enhancedEdge = transformEdgeWithEvidenceAnalysis(sampleEdge, evidenceAnalysis);
      
      expect(enhancedEdge.data.id).toBe(sampleEdge.data.id);
      expect(enhancedEdge.data.source).toBe(sampleEdge.data.source);
      expect(enhancedEdge.data.target).toBe(sampleEdge.data.target);
      expect(enhancedEdge.data.effectiveness).toBe(sampleEdge.data.effectiveness);
    });

    test('should enhance accessibility with evidence information', () => {
      const evidenceAnalysis = analyzeEvidenceStrength(
        'Staphylococcus aureus', 
        'Vancomycin', 
        { evidenceLevel: 'A' }
      );
      
      const enhancedEdge = transformEdgeWithEvidenceAnalysis(sampleEdge, evidenceAnalysis);
      
      expect(enhancedEdge.data.ariaLabel).toContain('A level evidence');
      expect(enhancedEdge.data.evidenceDescription).toBeTruthy();
      expect(enhancedEdge.data.qualityAssessment).toBeTruthy();
    });

    test('should include clinical recommendations', () => {
      const evidenceAnalysis = analyzeEvidenceStrength(
        'Enterococcus faecium', 
        'Linezolid', 
        { evidenceLevel: 'B' }
      );
      
      const enhancedEdge = transformEdgeWithEvidenceAnalysis(sampleEdge, evidenceAnalysis);
      
      expect(Array.isArray(enhancedEdge.data.recommendations)).toBe(true);
      expect(enhancedEdge.data.recommendations.length).toBeGreaterThan(0);
      expect(Array.isArray(enhancedEdge.data.clinicalPearls)).toBe(true);
    });
  });

  describe('Evidence-Based Clinical Decision Support', () => {
    test('should provide graduated recommendations based on evidence quality', () => {
      const testCases = [
        { level: 'A', expectedStrength: 'Strong recommendation' },
        { level: 'B', expectedStrength: 'Conditional recommendation' },
        { level: 'C', expectedStrength: 'Weak recommendation' },
        { level: 'D', expectedStrength: 'No recommendation' }
      ];
      
      testCases.forEach(testCase => {
        const result = analyzeEvidenceStrength(
          'Test Pathogen', 
          'Test Antibiotic', 
          { evidenceLevel: testCase.level }
        );
        
        expect(result.qualityIndicators.recommendationStrength).toContain(testCase.expectedStrength);
      });
    });

    test('should escalate monitoring requirements for lower evidence levels', () => {
      const gradeAResult = analyzeEvidenceStrength(
        'Streptococcus pyogenes', 
        'Penicillin', 
        { evidenceLevel: 'A' }
      );
      
      const gradeDResult = analyzeEvidenceStrength(
        'Rare Pathogen', 
        'Experimental Drug', 
        { evidenceLevel: 'D' }
      );
      
      expect(gradeAResult.recommendations.monitoring).toContain('Standard monitoring protocols adequate');
      expect(gradeDResult.recommendations.monitoring).toContain('Intensive monitoring required');
    });

    test('should recommend infectious disease consultation for complex cases', () => {
      const complexCaseResult = analyzeEvidenceStrength(
        'Pseudomonas aeruginosa', 
        'Investigational Agent', 
        { evidenceLevel: 'D', severity: 'critical' }
      );
      
      expect(complexCaseResult.recommendations.secondary).toContain('Infectious disease consultation essential');
    });
  });

  describe('Integration with Medical Education', () => {
    test('should provide evidence summaries for educational content', () => {
      const result = analyzeEvidenceStrength(
        'Escherichia coli', 
        'Ceftriaxone', 
        { evidenceLevel: 'A' }
      );
      
      expect(result.medicalEducationNotes.evidenceSummary).toContain('A level evidence');
      expect(result.medicalEducationNotes.evidenceSummary).toContain('Strong evidence from well-designed RCTs');
    });

    test('should adapt content for pediatric population', () => {
      const result = analyzeEvidenceStrength(
        'Haemophilus influenzae', 
        'Amoxicillin-clavulanate', 
        { evidenceLevel: 'B' }
      );
      
      expect(result.clinicalContext.populationSpecificFactors).toContain('Pediatric dosing considerations');
      expect(result.clinicalContext.populationSpecificFactors).toContain('Age-appropriate formulations');
      expect(result.clinicalContext.populationSpecificFactors).toContain('Developmental pharmacokinetics');
    });

    test('should reference appropriate clinical guidelines', () => {
      const result = analyzeEvidenceStrength(
        'Staphylococcus aureus', 
        'Clindamycin', 
        { evidenceLevel: 'B' }
      );
      
      const guidelines = result.medicalEducationNotes.guidelineReferences;
      expect(guidelines).toContain('AAP Clinical Practice Guidelines for Pediatric Infections');
      expect(guidelines).toContain('IDSA Guidelines for MRSA Infections');
      expect(guidelines).toContain('CDC Antibiotic Resistance Threats Report');
    });
  });

  describe('Performance and Edge Cases', () => {
    test('should handle missing evidence level gracefully', () => {
      expect(() => analyzeEvidenceStrength('Pathogen', 'Antibiotic', {})).not.toThrow();
      
      const result = analyzeEvidenceStrength('Pathogen', 'Antibiotic', {});
      expect(result.evidenceLevel).toBe('UNKNOWN');
      expect(typeof result.clinicalWeight).toBe('number');
      expect(Array.isArray(result.recommendations.primary)).toBe(true);
    });

    test('should handle null or undefined inputs gracefully', () => {
      expect(() => analyzeEvidenceStrength(null, null, null)).not.toThrow();
      expect(() => analyzeEvidenceStrength('', '', undefined)).not.toThrow();
    });

    test('should return consistent data structure for all evidence levels', () => {
      const evidenceLevels = ['A', 'B', 'C', 'D', 'EXPERT', 'UNKNOWN'];
      
      evidenceLevels.forEach(level => {
        const result = analyzeEvidenceStrength(
          'Test Pathogen', 
          'Test Antibiotic', 
          { evidenceLevel: level }
        );
        
        expect(typeof result).toBe('object');
        expect(result).toHaveProperty('evidenceLevel');
        expect(result).toHaveProperty('clinicalWeight');
        expect(result).toHaveProperty('visualProperties');
        expect(result).toHaveProperty('recommendations');
        expect(result).toHaveProperty('qualityIndicators');
        expect(result).toHaveProperty('medicalEducationNotes');
      });
    });

    test('should validate clinical confidence scores', () => {
      const result = analyzeEvidenceStrength(
        'Complex Pathogen', 
        'High Risk Antibiotic', 
        { evidenceLevel: 'C' }
      );
      
      const confidence = result.qualityIndicators.clinicalApplicationConfidence;
      expect(confidence).toBeGreaterThanOrEqual(10);
      expect(confidence).toBeLessThanOrEqual(100);
      expect(typeof confidence).toBe('number');
    });
  });
});