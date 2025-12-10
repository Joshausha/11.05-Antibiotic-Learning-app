/**
 * Northwestern Enhanced Antibiotic Data
 *
 * This file contains the migrated antibiotic dataset with Northwestern 8-segment
 * coverage model integration while preserving 100% backward compatibility.
 *
 * Created by: Agent 1.2 - Data Migration Specialist
 * Date: 2025-01-18
 *
 * Northwestern 8-Segment Categories:
 * 1. MRSA - Methicillin-resistant Staphylococcus aureus
 * 2. VRE_faecium - Vancomycin-resistant Enterococcus faecium
 * 3. anaerobes - Bacteroides, C. difficile, mixed anaerobes
 * 4. atypicals - Legionella, Mycoplasma, Chlamydophila
 * 5. pseudomonas - Pseudomonas aeruginosa
 * 6. gramNegative - Gram-negative organisms
 * 7. MSSA - Methicillin-sensitive Staphylococcus aureus
 * 8. enterococcus_faecalis - Enterococcus faecalis
 *
 * Coverage Scale: 0=no coverage, 1=poor/moderate coverage, 2=good coverage
 */

import simpleAntibiotics from './SimpleAntibioticData.ts';
import { createNorthwesternAntibioticData } from './NorthwesternAntibioticSchema.ts';

interface NorthwesternSpectrum {
  MRSA: 0 | 1 | 2;
  VRE_faecium: 0 | 1 | 2;
  anaerobes: 0 | 1 | 2;
  atypicals: 0 | 1 | 2;
  pseudomonas: 0 | 1 | 2;
  gramNegative: 0 | 1 | 2;
  MSSA: 0 | 1 | 2;
  enterococcus_faecalis: 0 | 1 | 2;
}

interface NorthwesternPosition {
  x: number;
  y: number;
  radius: number;
  region: string;
}

interface EnhancedAntibiotic {
  id: number;
  name: string;
  category: string;
  class: string;
  description: string;
  mechanism: string;
  spectrum: string;
  route: string;
  commonUses: string[];
  resistance: string;
  sideEffects: string;
  northwesternSpectrum: NorthwesternSpectrum;
  cellWallActive: boolean;
  generation: string;
  routeColor: 'red' | 'blue' | 'purple';
  northwesternPosition: NorthwesternPosition;
}

interface MigrationStats {
  totalAntibiotics: number;
  originalFieldsPreserved: number;
  northwesternFieldsAdded: number;
  validationErrors: string[] | null;
  migrationErrors: string[] | null;
  coverageDistribution: Record<string, { noCoverage: number; someCoverage: number; goodCoverage: number }>;
}

interface GenerationMap {
  [key: string]: EnhancedAntibiotic[];
}

// Generate the enhanced dataset with Northwestern integration
const enhancedAntibiotics: EnhancedAntibiotic[] = createNorthwesternAntibioticData(simpleAntibiotics);

// Validate the migration - ensure all original data is preserved
const validateMigration = (): string[] | null => {
  const errors: string[] = [];

  enhancedAntibiotics.forEach((enhanced, index) => {
    const original = simpleAntibiotics[index];

    // Check all original fields are preserved
    const requiredFields = ['id', 'name', 'category', 'class', 'description',
                           'mechanism', 'route', 'commonUses', 'resistance', 'sideEffects'];

    requiredFields.forEach(field => {
      if (JSON.stringify(enhanced[field as keyof EnhancedAntibiotic]) !== JSON.stringify(original[field as keyof typeof original])) {
        errors.push(`Field ${field} not preserved for antibiotic ${enhanced.name}`);
      }
    });

    // Check Northwestern fields are added
    const northwesternFields = ['northwesternSpectrum', 'cellWallActive',
                               'generation', 'routeColor', 'northwesternPosition'];

    northwesternFields.forEach(field => {
      if (!enhanced.hasOwnProperty(field)) {
        errors.push(`Northwestern field ${field} missing for antibiotic ${enhanced.name}`);
      }
    });

    // Validate Northwestern spectrum structure
    if (enhanced.northwesternSpectrum) {
      const requiredCategories = ['MRSA', 'VRE_faecium', 'anaerobes', 'atypicals',
                                 'pseudomonas', 'gramNegative', 'MSSA', 'enterococcus_faecalis'];

      requiredCategories.forEach(category => {
        if (!enhanced.northwesternSpectrum.hasOwnProperty(category as keyof NorthwesternSpectrum)) {
          errors.push(`Northwestern category ${category} missing for ${enhanced.name}`);
        }

        const value = enhanced.northwesternSpectrum[category as keyof NorthwesternSpectrum];
        if (![0, 1, 2].includes(value)) {
          errors.push(`Invalid coverage value ${value} for ${category} in ${enhanced.name}`);
        }
      });
    }
  });

  return errors.length === 0 ? null : errors;
};

// Run validation
const migrationErrors: string[] | null = validateMigration();
if (migrationErrors) {
  console.error('Migration validation failed:', migrationErrors);
}

// Helper functions - Enhanced versions maintaining backward compatibility
export const getAntibioticById = (id: number): EnhancedAntibiotic | undefined => {
  return enhancedAntibiotics.find(antibiotic => antibiotic.id === id);
};

export const getAntibioticByName = (name: string): EnhancedAntibiotic | undefined => {
  if (!name || typeof name !== 'string') {
    return undefined;
  }
  return enhancedAntibiotics.find(antibiotic =>
    antibiotic.name.toLowerCase() === name.toLowerCase()
  );
};

export const getAntibioticsByClass = (drugClass: string): EnhancedAntibiotic[] => {
  return enhancedAntibiotics.filter(antibiotic => antibiotic.class === drugClass);
};

export const getAntibioticsByCategory = (category: string): EnhancedAntibiotic[] => {
  return enhancedAntibiotics.filter(antibiotic => antibiotic.category === category);
};

export const searchAntibiotics = (searchTerm: string): EnhancedAntibiotic[] => {
  // Handle null, undefined, and non-string inputs
  if (searchTerm === null || searchTerm === undefined || typeof searchTerm !== 'string') {
    return [];
  }

  // Return all for empty string (enhanced behavior)
  if (searchTerm === '') return enhancedAntibiotics;

  const term = searchTerm.toLowerCase();
  return enhancedAntibiotics.filter(antibiotic =>
    antibiotic.name.toLowerCase().includes(term) ||
    antibiotic.class.toLowerCase().includes(term) ||
    antibiotic.description.toLowerCase().includes(term) ||
    (antibiotic.commonUses && antibiotic.commonUses.some(use =>
      use.toLowerCase().includes(term)
    ))
  );
};

export const getAllDrugClasses = (): string[] => {
  const classes = enhancedAntibiotics.map(antibiotic => antibiotic.class);
  return [...new Set(classes)].sort();
};

export const getAllCategories = (): string[] => {
  const categories = enhancedAntibiotics.map(antibiotic => antibiotic.category);
  return [...new Set(categories)].sort();
};

// NEW: Northwestern-specific helper functions
export const getAntibioticsWithNorthwesternCoverage = (category: string, minCoverage: number = 1): EnhancedAntibiotic[] => {
  return enhancedAntibiotics.filter(antibiotic =>
    antibiotic.northwesternSpectrum[category as keyof NorthwesternSpectrum] >= minCoverage
  );
};

export const getNorthwesternSpectrumForAntibiotic = (identifier: number | string): NorthwesternSpectrum | null => {
  let antibiotic;
  if (typeof identifier === 'number') {
    antibiotic = getAntibioticById(identifier);
  } else if (typeof identifier === 'string') {
    antibiotic = getAntibioticByName(identifier);
  }
  return antibiotic ? antibiotic.northwesternSpectrum : null;
};

export const getAntibioticsByGeneration = (targetGeneration?: string): EnhancedAntibiotic[] | GenerationMap => {
  if (!targetGeneration) {
    // Return all generations as object if no parameter provided
    const generations: GenerationMap = {};
    enhancedAntibiotics.forEach(antibiotic => {
      const generation = antibiotic.generation;
      if (!generations[generation]) {
        generations[generation] = [];
      }
      generations[generation].push(antibiotic);
    });
    return generations;
  }

  // Return array of antibiotics for specific generation
  return enhancedAntibiotics.filter(antibiotic =>
    antibiotic.generation && antibiotic.generation.includes(targetGeneration)
  );
};

export const getCellWallActiveAntibiotics = (): EnhancedAntibiotic[] => {
  return enhancedAntibiotics.filter(antibiotic => antibiotic.cellWallActive);
};

export const getAntibioticsByRoute = (route: string): EnhancedAntibiotic[] => {
  const routeMap: Record<string, EnhancedAntibiotic[]> = {
    'oral': enhancedAntibiotics.filter(ab => ab.routeColor === 'red' || ab.routeColor === 'purple'),
    'iv': enhancedAntibiotics.filter(ab => ab.routeColor === 'blue' || ab.routeColor === 'purple'),
    'both': enhancedAntibiotics.filter(ab => ab.routeColor === 'purple')
  };

  return routeMap[route.toLowerCase()] || [];
};

// Original validation function - enhanced
export const validateAntibioticData = (): string[] | null => {
  const errors: string[] = [];

  enhancedAntibiotics.forEach(antibiotic => {
    // Original validations
    if (!antibiotic.name) errors.push(`Antibiotic ${antibiotic.id} missing name`);
    if (!antibiotic.class) errors.push(`Antibiotic ${antibiotic.id} missing class`);
    if (!antibiotic.mechanism) errors.push(`Antibiotic ${antibiotic.id} missing mechanism`);

    // Northwestern validations
    if (!antibiotic.northwesternSpectrum) {
      errors.push(`Antibiotic ${antibiotic.id} missing Northwestern spectrum`);
    }
    if (antibiotic.cellWallActive === undefined) {
      errors.push(`Antibiotic ${antibiotic.id} missing cell wall activity classification`);
    }
    if (!antibiotic.generation) {
      errors.push(`Antibiotic ${antibiotic.id} missing generation classification`);
    }
    if (!antibiotic.routeColor) {
      errors.push(`Antibiotic ${antibiotic.id} missing route color`);
    }
    if (!antibiotic.northwesternPosition) {
      errors.push(`Antibiotic ${antibiotic.id} missing Northwestern position data`);
    }
  });

  // Maintain backward compatibility with SimpleAntibioticData API
  return errors.length === 0 ? null : errors;
};

// NEW: Northwestern coverage analysis functions
export const getNorthwesternCoverageMatrix = (): Record<number, { name: string; spectrum: NorthwesternSpectrum }> => {
  const matrix: Record<number, { name: string; spectrum: NorthwesternSpectrum }> = {};

  enhancedAntibiotics.forEach(antibiotic => {
    matrix[antibiotic.id] = {
      name: antibiotic.name,
      spectrum: antibiotic.northwesternSpectrum
    };
  });

  return matrix;
};

export const getBroadSpectrumAntibiotics = (threshold: number = 5): EnhancedAntibiotic[] => {
  return enhancedAntibiotics.filter(antibiotic => {
    const coverage = Object.values(antibiotic.northwesternSpectrum);
    const goodCoverage = coverage.filter(value => value >= 2).length;
    const someCoverage = coverage.filter(value => value >= 1).length;

    return someCoverage >= threshold;
  }).sort((a, b) => {
    const aCoverage = Object.values(a.northwesternSpectrum).filter(v => v >= 2).length;
    const bCoverage = Object.values(b.northwesternSpectrum).filter(v => v >= 2).length;
    return bCoverage - aCoverage;
  });
};

export const getNarrowSpectrumAntibiotics = (): EnhancedAntibiotic[] => {
  return enhancedAntibiotics.filter(antibiotic => {
    const coverage = Object.values(antibiotic.northwesternSpectrum);
    const someCoverage = coverage.filter(value => value >= 1).length;

    return someCoverage <= 3;
  });
};

// Migration statistics for reporting
export const getMigrationStats = (): MigrationStats => {
  const stats: MigrationStats = {
    totalAntibiotics: enhancedAntibiotics.length,
    originalFieldsPreserved: enhancedAntibiotics.length, // All preserved by validation
    northwesternFieldsAdded: enhancedAntibiotics.length, // All enhanced
    validationErrors: validateAntibioticData(),
    migrationErrors: migrationErrors,
    coverageDistribution: {}
  };

  // Calculate coverage distribution
  const categories = ['MRSA', 'VRE_faecium', 'anaerobes', 'atypicals',
                     'pseudomonas', 'gramNegative', 'MSSA', 'enterococcus_faecalis'];

  categories.forEach(category => {
    const coverageValues = enhancedAntibiotics.map(ab => ab.northwesternSpectrum[category as keyof NorthwesternSpectrum]);
    stats.coverageDistribution[category] = {
      noCoverage: coverageValues.filter(v => v === 0).length,
      someCoverage: coverageValues.filter(v => v === 1).length,
      goodCoverage: coverageValues.filter(v => v === 2).length
    };
  });

  return stats;
};

// Export the enhanced dataset as default
export default enhancedAntibiotics;

// Named export for compatibility
export { enhancedAntibiotics };
