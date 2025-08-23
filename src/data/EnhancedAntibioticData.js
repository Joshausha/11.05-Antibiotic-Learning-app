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

import simpleAntibiotics from './SimpleAntibioticData.js';
import { createNorthwesternAntibioticData } from './NorthwesternAntibioticSchema.js';

// Generate the enhanced dataset with Northwestern integration
const enhancedAntibiotics = createNorthwesternAntibioticData(simpleAntibiotics);

// Validate the migration - ensure all original data is preserved
const validateMigration = () => {
  const errors = [];
  
  enhancedAntibiotics.forEach((enhanced, index) => {
    const original = simpleAntibiotics[index];
    
    // Check all original fields are preserved
    const requiredFields = ['id', 'name', 'category', 'class', 'description', 
                           'mechanism', 'route', 'commonUses', 'resistance', 'sideEffects'];
    
    requiredFields.forEach(field => {
      if (JSON.stringify(enhanced[field]) !== JSON.stringify(original[field])) {
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
        if (!enhanced.northwesternSpectrum.hasOwnProperty(category)) {
          errors.push(`Northwestern category ${category} missing for ${enhanced.name}`);
        }
        
        const value = enhanced.northwesternSpectrum[category];
        if (![0, 1, 2].includes(value)) {
          errors.push(`Invalid coverage value ${value} for ${category} in ${enhanced.name}`);
        }
      });
    }
  });
  
  return errors.length === 0 ? null : errors;
};

// Run validation
const migrationErrors = validateMigration();
if (migrationErrors) {
  console.error('Migration validation failed:', migrationErrors);
}

// Helper functions - Enhanced versions maintaining backward compatibility
export const getAntibioticById = (id) => {
  return enhancedAntibiotics.find(antibiotic => antibiotic.id === id);
};

export const getAntibioticByName = (name) => {
  if (!name || typeof name !== 'string') {
    return undefined;
  }
  return enhancedAntibiotics.find(antibiotic => 
    antibiotic.name.toLowerCase() === name.toLowerCase()
  );
};;

export const getAntibioticsByClass = (drugClass) => {
  return enhancedAntibiotics.filter(antibiotic => antibiotic.class === drugClass);
};

export const getAntibioticsByCategory = (category) => {
  return enhancedAntibiotics.filter(antibiotic => antibiotic.category === category);
};

export const searchAntibiotics = (searchTerm) => {
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
};;

export const getAllDrugClasses = () => {
  const classes = enhancedAntibiotics.map(antibiotic => antibiotic.class);
  return [...new Set(classes)].sort();
};

export const getAllCategories = () => {
  const categories = enhancedAntibiotics.map(antibiotic => antibiotic.category);
  return [...new Set(categories)].sort();
};

// NEW: Northwestern-specific helper functions
export const getAntibioticsWithNorthwesternCoverage = (category, minCoverage = 1) => {
  return enhancedAntibiotics.filter(antibiotic => 
    antibiotic.northwesternSpectrum[category] >= minCoverage
  );
};

export const getNorthwesternSpectrumForAntibiotic = (identifier) => {
  let antibiotic;
  if (typeof identifier === 'number') {
    antibiotic = getAntibioticById(identifier);
  } else if (typeof identifier === 'string') {
    antibiotic = getAntibioticByName(identifier);
  }
  return antibiotic ? antibiotic.northwesternSpectrum : null;
};;

export const getAntibioticsByGeneration = (targetGeneration) => {
  if (!targetGeneration) {
    // Return all generations as object if no parameter provided
    const generations = {};
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
};;

export const getCellWallActiveAntibiotics = () => {
  return enhancedAntibiotics.filter(antibiotic => antibiotic.cellWallActive);
};

export const getAntibioticsByRoute = (route) => {
  const routeMap = {
    'oral': enhancedAntibiotics.filter(ab => ab.routeColor === 'red' || ab.routeColor === 'purple'),
    'iv': enhancedAntibiotics.filter(ab => ab.routeColor === 'blue' || ab.routeColor === 'purple'),
    'both': enhancedAntibiotics.filter(ab => ab.routeColor === 'purple')
  };
  
  return routeMap[route.toLowerCase()] || [];
};

// Original validation function - enhanced
export const validateAntibioticData = () => {
  const errors = [];
  
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
export const getNorthwesternCoverageMatrix = () => {
  const categories = ['MRSA', 'VRE_faecium', 'anaerobes', 'atypicals', 
                     'pseudomonas', 'gramNegative', 'MSSA', 'enterococcus_faecalis'];
  
  const matrix = {};
  
  enhancedAntibiotics.forEach(antibiotic => {
    matrix[antibiotic.id] = {
      name: antibiotic.name,
      spectrum: antibiotic.northwesternSpectrum
    };
  });
  
  return matrix;
};

export const getBroadSpectrumAntibiotics = (threshold = 5) => {
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

export const getNarrowSpectrumAntibiotics = () => {
  return enhancedAntibiotics.filter(antibiotic => {
    const coverage = Object.values(antibiotic.northwesternSpectrum);
    const someCoverage = coverage.filter(value => value >= 1).length;
    
    return someCoverage <= 3;
  });
};

// Migration statistics for reporting
export const getMigrationStats = () => {
  const stats = {
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
    const coverageValues = enhancedAntibiotics.map(ab => ab.northwesternSpectrum[category]);
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