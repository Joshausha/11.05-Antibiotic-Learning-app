/**
 * Northwestern 8-Segment Coverage Validation Tests
 *
 * Validates the Northwestern coverage model for all antibiotics:
 * - Coverage level constraints (0, 1, or 2 only)
 * - Medical logic rules (MRSA/MSSA relationships, spectrum expectations)
 * - Data completeness (all 8 segments defined)
 *
 * Created: 2026-01-07
 * Phase: 01-03 - Data Validation & Testing
 */

import enhancedAntibiotics from '../EnhancedAntibioticData.ts';

describe('Northwestern 8-Segment Coverage Validation', () => {

  describe('Coverage Level Validation', () => {
    test('all antibiotics have exactly 8 coverage values', () => {
      const requiredSegments = [
        'MRSA',
        'VRE_faecium',
        'anaerobes',
        'atypicals',
        'pseudomonas',
        'gramNegative',
        'MSSA',
        'enterococcus_faecalis'
      ];

      enhancedAntibiotics.forEach(antibiotic => {
        requiredSegments.forEach(segment => {
          expect(antibiotic.northwesternSpectrum).toHaveProperty(segment);
          expect(antibiotic.northwesternSpectrum[segment]).toBeDefined();
        });
      });

      // Validate exactly 8 segments (no extra properties)
      enhancedAntibiotics.forEach(antibiotic => {
        const segments = Object.keys(antibiotic.northwesternSpectrum);
        expect(segments).toHaveLength(8);
      });
    });

    test('each coverage value is strictly 0, 1, or 2', () => {
      const validCoverageLevels = [0, 1, 2];

      enhancedAntibiotics.forEach(antibiotic => {
        Object.entries(antibiotic.northwesternSpectrum).forEach(([segment, value]) => {
          expect(validCoverageLevels).toContain(value);

          // Additional check: ensure it's not a decimal or other numeric value
          expect(Number.isInteger(value)).toBe(true);

          // Ensure it's not null or undefined
          expect(value).not.toBeNull();
          expect(value).not.toBeUndefined();
        });
      });
    });

    test('no undefined or null coverage values', () => {
      enhancedAntibiotics.forEach(antibiotic => {
        Object.entries(antibiotic.northwesternSpectrum).forEach(([segment, value]) => {
          expect(value).toBeDefined();
          expect(value).not.toBeNull();
          expect([0, 1, 2]).toContain(value);
        });
      });
    });
  });

  describe('Medical Logic Validation', () => {
    test('antibiotics with MRSA coverage must have MSSA coverage >= MRSA coverage', () => {
      // Medical logic: MSSA is methicillin-sensitive Staph aureus
      // If an antibiotic covers MRSA (resistant), it MUST cover MSSA (sensitive)
      // MSSA coverage should be >= MRSA coverage

      enhancedAntibiotics.forEach(antibiotic => {
        const mrsaCoverage = antibiotic.northwesternSpectrum.MRSA;
        const mssaCoverage = antibiotic.northwesternSpectrum.MSSA;

        if (mrsaCoverage > 0) {
          expect(mssaCoverage).toBeGreaterThanOrEqual(mrsaCoverage);
        }
      });
    });

    test('broad-spectrum antibiotics have appropriate multi-segment coverage', () => {
      // Carbapenems (Meropenem, Ertapenem) should have broad coverage
      const meropenem = enhancedAntibiotics.find(ab => ab.name === 'Meropenem');
      if (meropenem) {
        const coverageCount = Object.values(meropenem.northwesternSpectrum)
          .filter(v => v >= 1).length;

        // Carbapenems should cover at least 5 of 8 segments
        expect(coverageCount).toBeGreaterThanOrEqual(5);

        // Meropenem specifically should cover gram-negative and pseudomonas well
        expect(meropenem.northwesternSpectrum.gramNegative).toBeGreaterThanOrEqual(1);
        expect(meropenem.northwesternSpectrum.pseudomonas).toBeGreaterThanOrEqual(1);
      }
    });

    test('narrow-spectrum antibiotics have focused coverage', () => {
      // Vancomycin should be narrow-spectrum (gram-positive only)
      const vancomycin = enhancedAntibiotics.find(ab => ab.name === 'Vancomycin');
      if (vancomycin) {
        // Vancomycin should NOT cover gram-negative organisms
        expect(vancomycin.northwesternSpectrum.gramNegative).toBe(0);
        expect(vancomycin.northwesternSpectrum.pseudomonas).toBe(0);

        // But should cover MRSA and MSSA
        expect(vancomycin.northwesternSpectrum.MRSA).toBeGreaterThanOrEqual(1);
        expect(vancomycin.northwesternSpectrum.MSSA).toBeGreaterThanOrEqual(1);
      }

      // Metronidazole should be focused on anaerobes
      const metronidazole = enhancedAntibiotics.find(ab => ab.name === 'Metronidazole');
      if (metronidazole) {
        // Metronidazole should have excellent anaerobic coverage
        expect(metronidazole.northwesternSpectrum.anaerobes).toBeGreaterThanOrEqual(2);

        // Limited coverage elsewhere (narrow-spectrum)
        const nonAnaerobicCoverage = Object.entries(metronidazole.northwesternSpectrum)
          .filter(([segment, value]) => segment !== 'anaerobes' && value >= 2)
          .length;

        // Should not have excellent (2) coverage in multiple other segments
        expect(nonAnaerobicCoverage).toBeLessThanOrEqual(2);
      }
    });

    test('anaerobic coverage correlates with appropriate antibiotic classes', () => {
      // Beta-lactam/beta-lactamase inhibitors should have anaerobic coverage
      const piperacillinTazobactam = enhancedAntibiotics.find(ab =>
        ab.name.includes('Piperacillin') || ab.name.includes('piperacillin')
      );
      if (piperacillinTazobactam) {
        // Should have some anaerobic coverage
        expect(piperacillinTazobactam.northwesternSpectrum.anaerobes).toBeGreaterThanOrEqual(1);
      }

      // Aminoglycosides should NOT have anaerobic coverage
      const aminoglycosides = enhancedAntibiotics.filter(ab =>
        ab.class === 'Aminoglycoside' || ab.category.includes('Aminoglycoside')
      );

      aminoglycosides.forEach(antibiotic => {
        // Aminoglycosides require oxygen to work, so no anaerobic coverage
        expect(antibiotic.northwesternSpectrum.anaerobes).toBe(0);
      });
    });

    test('atypical coverage correlates with appropriate antibiotic classes', () => {
      // Macrolides (Azithromycin) should have excellent atypical coverage
      const azithromycin = enhancedAntibiotics.find(ab => ab.name === 'Azithromycin');
      if (azithromycin) {
        expect(azithromycin.northwesternSpectrum.atypicals).toBeGreaterThanOrEqual(2);
      }

      // Fluoroquinolones should have good atypical coverage
      const fluoroquinolones = enhancedAntibiotics.filter(ab =>
        ab.class === 'Fluoroquinolone'
      );

      fluoroquinolones.forEach(antibiotic => {
        expect(antibiotic.northwesternSpectrum.atypicals).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Data Completeness', () => {
    test('all antibiotics have Northwestern spectrum defined', () => {
      enhancedAntibiotics.forEach(antibiotic => {
        expect(antibiotic).toHaveProperty('northwesternSpectrum');
        expect(antibiotic.northwesternSpectrum).toBeDefined();
        expect(antibiotic.northwesternSpectrum).not.toBeNull();
        expect(typeof antibiotic.northwesternSpectrum).toBe('object');
      });
    });

    test('no antibiotics missing from coverage model', () => {
      // All antibiotics in the dataset should have complete Northwestern data
      const antibioticsWithoutNorthwesternData = enhancedAntibiotics.filter(antibiotic =>
        !antibiotic.northwesternSpectrum ||
        Object.keys(antibiotic.northwesternSpectrum).length !== 8
      );

      expect(antibioticsWithoutNorthwesternData).toHaveLength(0);
    });

    test('coverage data matches antibiotic class expectations', () => {
      // Beta-lactams should generally have good gram-positive coverage
      const betaLactams = enhancedAntibiotics.filter(ab =>
        ab.class === 'Beta-Lactam' || ab.category.includes('Cephalosporin') || ab.category.includes('Penicillin')
      );

      betaLactams.forEach(antibiotic => {
        // At least some gram-positive coverage expected
        const gramPositiveCoverage = Math.max(
          antibiotic.northwesternSpectrum.MSSA,
          antibiotic.northwesternSpectrum.enterococcus_faecalis
        );

        // Most beta-lactams should have at least some gram-positive coverage
        // (exception: ceftazidime is more gram-negative focused)
        if (!antibiotic.name.includes('Ceftazidime')) {
          expect(gramPositiveCoverage).toBeGreaterThanOrEqual(1);
        }
      });
    });

    test('test summary: antibiotics validated', () => {
      // Generate helpful summary
      const totalAntibiotics = enhancedAntibiotics.length;
      const antibioticsWithCompleteData = enhancedAntibiotics.filter(ab =>
        ab.northwesternSpectrum &&
        Object.keys(ab.northwesternSpectrum).length === 8
      ).length;

      console.log(`\n✓ Validated ${totalAntibiotics} antibiotics against Northwestern 8-segment coverage model`);
      console.log(`✓ All antibiotics have complete coverage data (${antibioticsWithCompleteData}/${totalAntibiotics})`);

      expect(antibioticsWithCompleteData).toBe(totalAntibiotics);
    });
  });
});
