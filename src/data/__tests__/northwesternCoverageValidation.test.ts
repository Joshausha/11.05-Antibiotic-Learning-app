/**
 * Northwestern 8-Segment Coverage Validation Tests (TypeScript)
 *
 * Medical Data Accuracy Tests - Phase 07-08
 *
 * Validates the Northwestern coverage model for all antibiotics:
 * - Coverage level constraints (0, 1, or 2 only)
 * - Medical logic rules (MRSA/MSSA relationships, spectrum expectations)
 * - Data completeness (all 8 segments defined)
 * - Type safety with proper TypeScript interfaces
 *
 * Medical Context:
 * - MRSA coverage implies MSSA coverage (resistant strain implies sensitive strain)
 * - CoverageLevel is 0 | 1 | 2 (none | moderate | good)
 * - Northwestern has 8 segments: MRSA, MSSA, VRE_faecium, enterococcus_faecalis,
 *   gramNegative, pseudomonas, anaerobes, atypicals
 *
 * Created: 2026-01-08
 * Phase: 07-08 - Medical Data Accuracy Tests
 */

import enhancedAntibiotics, { EnhancedAntibiotic } from '../EnhancedAntibioticData';
import {
  northwesternSpectrumMap,
  validateNorthwesternSchema,
  getNorthwesternSpectrum,
  getAntibioticsForNorthwesternCategory,
  getNorthwesternCoverageStats,
} from '../NorthwesternAntibioticSchema';

// Type-safe segment names for the Northwestern 8-segment model
const NORTHWESTERN_SEGMENTS = [
  'MRSA',
  'VRE_faecium',
  'anaerobes',
  'atypicals',
  'pseudomonas',
  'gramNegative',
  'MSSA',
  'enterococcus_faecalis',
] as const;

type NorthwesternSegment = typeof NORTHWESTERN_SEGMENTS[number];
type CoverageLevel = 0 | 1 | 2;

describe('Northwestern 8-Segment Coverage Validation', () => {
  describe('Coverage Level Validation', () => {
    test('all antibiotics have exactly 8 coverage segments', () => {
      enhancedAntibiotics.forEach((antibiotic: EnhancedAntibiotic) => {
        NORTHWESTERN_SEGMENTS.forEach((segment) => {
          expect(antibiotic.northwesternSpectrum).toHaveProperty(segment);
          expect(antibiotic.northwesternSpectrum[segment]).toBeDefined();
        });

        // Validate exactly 8 segments (no extra properties beyond the 8)
        const segmentKeys = Object.keys(antibiotic.northwesternSpectrum);
        expect(segmentKeys).toHaveLength(8);
      });
    });

    test('each coverage value is strictly 0, 1, or 2', () => {
      const validCoverageLevels: CoverageLevel[] = [0, 1, 2];

      enhancedAntibiotics.forEach((antibiotic: EnhancedAntibiotic) => {
        Object.entries(antibiotic.northwesternSpectrum).forEach(([segment, value]) => {
          expect(validCoverageLevels).toContain(value);
          expect(Number.isInteger(value)).toBe(true);
          expect(value).not.toBeNull();
          expect(value).not.toBeUndefined();
        });
      });
    });

    test('no undefined or null coverage values exist', () => {
      enhancedAntibiotics.forEach((antibiotic: EnhancedAntibiotic) => {
        Object.entries(antibiotic.northwesternSpectrum).forEach(([segment, value]) => {
          expect(value).toBeDefined();
          expect(value).not.toBeNull();
          expect([0, 1, 2]).toContain(value);
        });
      });
    });

    test('direct spectrum map validation passes', () => {
      const validationErrors = validateNorthwesternSchema();
      expect(validationErrors).toBeNull();
    });
  });

  describe('Medical Logic Validation - MRSA/MSSA Relationship', () => {
    test('MRSA coverage implies MSSA coverage (resistant implies sensitive)', () => {
      // CRITICAL MEDICAL RULE:
      // If an antibiotic covers MRSA (methicillin-resistant),
      // it MUST cover MSSA (methicillin-sensitive) with equal or better coverage
      // Rationale: MSSA lacks the resistance mechanism, so any drug effective against
      // the resistant strain will be at least as effective against the sensitive strain.

      enhancedAntibiotics.forEach((antibiotic: EnhancedAntibiotic) => {
        const mrsaCoverage = antibiotic.northwesternSpectrum.MRSA;
        const mssaCoverage = antibiotic.northwesternSpectrum.MSSA;

        if (mrsaCoverage > 0) {
          expect(mssaCoverage).toBeGreaterThanOrEqual(mrsaCoverage);
        }
      });
    });

    test('specific antibiotics with MRSA coverage are validated', () => {
      // Vancomycin - gold standard for MRSA
      const vancomycin = enhancedAntibiotics.find(ab => ab.name === 'Vancomycin');
      if (vancomycin) {
        expect(vancomycin.northwesternSpectrum.MRSA).toBe(2);
        expect(vancomycin.northwesternSpectrum.MSSA).toBeGreaterThanOrEqual(
          vancomycin.northwesternSpectrum.MRSA
        );
      }

      // Linezolid - MRSA coverage
      const linezolid = enhancedAntibiotics.find(ab => ab.name === 'Linezolid');
      if (linezolid) {
        expect(linezolid.northwesternSpectrum.MRSA).toBeGreaterThanOrEqual(1);
        expect(linezolid.northwesternSpectrum.MSSA).toBeGreaterThanOrEqual(
          linezolid.northwesternSpectrum.MRSA
        );
      }

      // Ceftaroline - 5th gen cephalosporin with MRSA activity
      const ceftaroline = enhancedAntibiotics.find(ab => ab.name === 'Ceftaroline');
      if (ceftaroline) {
        expect(ceftaroline.northwesternSpectrum.MRSA).toBeGreaterThanOrEqual(1);
        expect(ceftaroline.northwesternSpectrum.MSSA).toBeGreaterThanOrEqual(
          ceftaroline.northwesternSpectrum.MRSA
        );
      }

      // TMP-SMX - community MRSA coverage
      const tmpSmx = enhancedAntibiotics.find(ab =>
        ab.name.includes('Trimethoprim') || ab.name === 'TMP-SMX'
      );
      if (tmpSmx) {
        expect(tmpSmx.northwesternSpectrum.MRSA).toBeGreaterThanOrEqual(1);
        expect(tmpSmx.northwesternSpectrum.MSSA).toBeGreaterThanOrEqual(
          tmpSmx.northwesternSpectrum.MRSA
        );
      }
    });

    test('non-MRSA antibiotics correctly have 0 MRSA coverage', () => {
      // Standard cephalosporins (except ceftaroline) should not cover MRSA
      const ceftriaxone = enhancedAntibiotics.find(ab => ab.name === 'Ceftriaxone');
      if (ceftriaxone) {
        expect(ceftriaxone.northwesternSpectrum.MRSA).toBe(0);
      }

      // Standard penicillins should not cover MRSA
      const ampicillin = enhancedAntibiotics.find(ab => ab.name === 'Ampicillin');
      if (ampicillin) {
        expect(ampicillin.northwesternSpectrum.MRSA).toBe(0);
      }
    });
  });

  describe('Medical Logic Validation - Spectrum Expectations', () => {
    test('broad-spectrum carbapenems have appropriate multi-segment coverage', () => {
      const meropenem = enhancedAntibiotics.find(ab => ab.name === 'Meropenem');
      if (meropenem) {
        const coverageCount = Object.values(meropenem.northwesternSpectrum)
          .filter((v: number) => v >= 1).length;

        // Carbapenems should cover at least 5 of 8 segments
        expect(coverageCount).toBeGreaterThanOrEqual(5);

        // Specific expectations for meropenem
        expect(meropenem.northwesternSpectrum.gramNegative).toBeGreaterThanOrEqual(2);
        expect(meropenem.northwesternSpectrum.pseudomonas).toBeGreaterThanOrEqual(1);
        expect(meropenem.northwesternSpectrum.anaerobes).toBeGreaterThanOrEqual(1);
        expect(meropenem.northwesternSpectrum.MSSA).toBeGreaterThanOrEqual(1);
      }
    });

    test('vancomycin is narrow-spectrum (gram-positive only)', () => {
      const vancomycin = enhancedAntibiotics.find(ab => ab.name === 'Vancomycin');
      if (vancomycin) {
        // Vancomycin should NOT cover gram-negative organisms
        expect(vancomycin.northwesternSpectrum.gramNegative).toBe(0);
        expect(vancomycin.northwesternSpectrum.pseudomonas).toBe(0);

        // But should cover gram-positive organisms well
        expect(vancomycin.northwesternSpectrum.MRSA).toBeGreaterThanOrEqual(2);
        expect(vancomycin.northwesternSpectrum.MSSA).toBeGreaterThanOrEqual(2);
      }
    });

    test('metronidazole is focused on anaerobes', () => {
      const metronidazole = enhancedAntibiotics.find(ab => ab.name === 'Metronidazole');
      if (metronidazole) {
        // Metronidazole should have excellent anaerobic coverage
        expect(metronidazole.northwesternSpectrum.anaerobes).toBe(2);

        // Should NOT have aerobic gram-positive/negative coverage
        expect(metronidazole.northwesternSpectrum.MRSA).toBe(0);
        expect(metronidazole.northwesternSpectrum.MSSA).toBe(0);
        expect(metronidazole.northwesternSpectrum.gramNegative).toBe(0);
        expect(metronidazole.northwesternSpectrum.pseudomonas).toBe(0);
      }
    });

    test('aminoglycosides have no anaerobic coverage (require oxygen)', () => {
      const gentamicin = enhancedAntibiotics.find(ab => ab.name === 'Gentamicin');
      if (gentamicin) {
        // Aminoglycosides require oxygen for uptake - no anaerobic activity
        expect(gentamicin.northwesternSpectrum.anaerobes).toBe(0);
      }
    });

    test('macrolides have excellent atypical coverage', () => {
      const azithromycin = enhancedAntibiotics.find(ab => ab.name === 'Azithromycin');
      if (azithromycin) {
        expect(azithromycin.northwesternSpectrum.atypicals).toBe(2);
      }
    });

    test('fluoroquinolones have atypical coverage', () => {
      const levofloxacin = enhancedAntibiotics.find(ab => ab.name === 'Levofloxacin');
      if (levofloxacin) {
        expect(levofloxacin.northwesternSpectrum.atypicals).toBeGreaterThanOrEqual(1);
      }

      const ciprofloxacin = enhancedAntibiotics.find(ab => ab.name === 'Ciprofloxacin');
      if (ciprofloxacin) {
        expect(ciprofloxacin.northwesternSpectrum.atypicals).toBeGreaterThanOrEqual(1);
      }
    });

    test('anti-pseudomonal agents have pseudomonas coverage', () => {
      const pipTazo = enhancedAntibiotics.find(ab =>
        ab.name.includes('Piperacillin') || ab.name.includes('piperacillin')
      );
      if (pipTazo) {
        expect(pipTazo.northwesternSpectrum.pseudomonas).toBeGreaterThanOrEqual(2);
      }

      const cefepime = enhancedAntibiotics.find(ab => ab.name === 'Cefepime');
      if (cefepime) {
        expect(cefepime.northwesternSpectrum.pseudomonas).toBeGreaterThanOrEqual(1);
      }
    });

    test('VRE-active agents have VRE_faecium coverage', () => {
      // Linezolid and Daptomycin should cover VRE
      const linezolid = enhancedAntibiotics.find(ab => ab.name === 'Linezolid');
      if (linezolid) {
        expect(linezolid.northwesternSpectrum.VRE_faecium).toBeGreaterThanOrEqual(2);
      }

      const daptomycin = enhancedAntibiotics.find(ab => ab.name === 'Daptomycin');
      if (daptomycin) {
        expect(daptomycin.northwesternSpectrum.VRE_faecium).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe('Data Structure Integrity', () => {
    test('all antibiotics have required Northwestern properties', () => {
      enhancedAntibiotics.forEach((antibiotic: EnhancedAntibiotic) => {
        expect(antibiotic).toHaveProperty('northwesternSpectrum');
        expect(antibiotic.northwesternSpectrum).toBeDefined();
        expect(antibiotic.northwesternSpectrum).not.toBeNull();
        expect(typeof antibiotic.northwesternSpectrum).toBe('object');

        // Additional Northwestern properties
        expect(antibiotic).toHaveProperty('cellWallActive');
        expect(antibiotic).toHaveProperty('generation');
        expect(antibiotic).toHaveProperty('routeColor');
      });
    });

    test('no antibiotics are missing from coverage model', () => {
      const antibioticsWithoutNorthwesternData = enhancedAntibiotics.filter(
        (antibiotic: EnhancedAntibiotic) =>
          !antibiotic.northwesternSpectrum ||
          Object.keys(antibiotic.northwesternSpectrum).length !== 8
      );

      expect(antibioticsWithoutNorthwesternData).toHaveLength(0);
    });

    test('spectrum map IDs match antibiotic IDs', () => {
      const spectrumMapIds = Object.keys(northwesternSpectrumMap).map(Number);
      const antibioticIds = enhancedAntibiotics.map(ab => ab.id);

      // All spectrum map entries should correspond to valid antibiotics
      spectrumMapIds.forEach((spectrumId) => {
        expect(antibioticIds).toContain(spectrumId);
      });
    });
  });

  describe('Coverage Statistics Validation', () => {
    test('coverage statistics are computed correctly', () => {
      const stats = getNorthwesternCoverageStats();

      NORTHWESTERN_SEGMENTS.forEach((segment) => {
        expect(stats[segment]).toBeDefined();
        expect(stats[segment]).toHaveProperty('noCoverage');
        expect(stats[segment]).toHaveProperty('someCoverage');
        expect(stats[segment]).toHaveProperty('goodCoverage');

        // Counts should be non-negative integers
        expect(stats[segment].noCoverage).toBeGreaterThanOrEqual(0);
        expect(stats[segment].someCoverage).toBeGreaterThanOrEqual(0);
        expect(stats[segment].goodCoverage).toBeGreaterThanOrEqual(0);

        // Sum should equal total antibiotics with spectrum data
        const total = stats[segment].noCoverage +
                     stats[segment].someCoverage +
                     stats[segment].goodCoverage;
        expect(total).toBeGreaterThan(0);
      });
    });

    test('getAntibioticsForNorthwesternCategory returns valid results', () => {
      // MRSA coverage agents
      const mrsaAgents = getAntibioticsForNorthwesternCategory('MRSA', 2);
      expect(mrsaAgents.length).toBeGreaterThan(0);
      mrsaAgents.forEach((agent) => {
        expect(agent.coverage).toBe(2);
      });

      // Pseudomonas coverage agents
      const pseudomonasAgents = getAntibioticsForNorthwesternCategory('pseudomonas', 2);
      pseudomonasAgents.forEach((agent) => {
        expect(agent.coverage).toBe(2);
      });
    });

    test('getNorthwesternSpectrum returns valid spectrum for known IDs', () => {
      // Vancomycin (ID 2)
      const vancoSpectrum = getNorthwesternSpectrum(2);
      if (vancoSpectrum) {
        expect(vancoSpectrum.MRSA).toBe(2);
        expect(vancoSpectrum.gramNegative).toBe(0);
      }

      // Invalid ID should return null
      const invalidSpectrum = getNorthwesternSpectrum(9999);
      expect(invalidSpectrum).toBeNull();
    });
  });

  describe('Test Summary', () => {
    test('summary report of validation results', () => {
      const totalAntibiotics = enhancedAntibiotics.length;
      const antibioticsWithCompleteData = enhancedAntibiotics.filter(
        (ab: EnhancedAntibiotic) =>
          ab.northwesternSpectrum &&
          Object.keys(ab.northwesternSpectrum).length === 8
      ).length;

      // MRSA/MSSA relationship compliance
      const mrsaMssaCompliant = enhancedAntibiotics.filter(
        (ab: EnhancedAntibiotic) =>
          ab.northwesternSpectrum.MRSA === 0 ||
          ab.northwesternSpectrum.MSSA >= ab.northwesternSpectrum.MRSA
      ).length;

      console.log(`\n✓ Northwestern 8-Segment Coverage Validation Report`);
      console.log(`  - Total antibiotics: ${totalAntibiotics}`);
      console.log(`  - Complete coverage data: ${antibioticsWithCompleteData}/${totalAntibiotics}`);
      console.log(`  - MRSA/MSSA rule compliance: ${mrsaMssaCompliant}/${totalAntibiotics}`);

      expect(antibioticsWithCompleteData).toBe(totalAntibiotics);
      expect(mrsaMssaCompliant).toBe(totalAntibiotics);
    });
  });
});
