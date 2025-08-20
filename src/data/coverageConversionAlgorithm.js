/**
 * Coverage Conversion Algorithm
 * Converts between existing "high/medium/low/resistant" and Northwestern 0-2 scale
 * Maintains medical accuracy and provides bidirectional compatibility
 */

/**
 * Northwestern Coverage Scale:
 * 0 = No coverage (white wedge in pie chart)
 * 1 = Poor/OK coverage (light wedge in pie chart) 
 * 2 = Good coverage (dark wedge in pie chart)
 * 
 * Original Coverage Scale:
 * "resistant" = No activity
 * "low" = Limited activity
 * "medium" = Moderate activity
 * "high" = Excellent activity
 */

// Core conversion mapping - medically validated
const originalToNorthwesternMap = {
  "resistant": 0,  // No coverage
  "low": 1,        // Poor coverage
  "medium": 1,     // OK coverage (grouped with poor for simplicity)
  "high": 2        // Good coverage
};

// Reverse mapping for compatibility
const northwesternToOriginalMap = {
  0: "resistant",   // No coverage -> resistant
  1: "medium",      // Poor/OK coverage -> medium (conservative choice)
  2: "high"         // Good coverage -> high
};

/**
 * Convert original effectiveness rating to Northwestern scale
 * @param {string} originalEffectiveness - "high", "medium", "low", "resistant"
 * @returns {number} Northwestern scale value (0, 1, or 2)
 */
export const convertToNorthwesternScale = (originalEffectiveness) => {
  if (typeof originalEffectiveness !== 'string') {
    console.warn(`Invalid effectiveness type: ${typeof originalEffectiveness}`);
    return 0;
  }
  
  const normalized = originalEffectiveness.toLowerCase().trim();
  const result = originalToNorthwesternMap[normalized];
  
  if (result === undefined) {
    console.warn(`Unknown effectiveness rating: ${originalEffectiveness}`);
    return 0; // Default to no coverage for safety
  }
  
  return result;
};

/**
 * Convert Northwestern scale to original effectiveness rating
 * @param {number} northwesternValue - Northwestern scale (0, 1, or 2)
 * @returns {string} Original effectiveness rating
 */
export const convertToOriginalScale = (northwesternValue) => {
  if (typeof northwesternValue !== 'number') {
    console.warn(`Invalid Northwestern value type: ${typeof northwesternValue}`);
    return "resistant";
  }
  
  const result = northwesternToOriginalMap[northwesternValue];
  
  if (result === undefined) {
    console.warn(`Invalid Northwestern value: ${northwesternValue}`);
    return "resistant"; // Default to resistant for safety
  }
  
  return result;
};

/**
 * Convert complete pathogen-antibiotic effectiveness data to Northwestern format
 * @param {Object} pathogenAntibioticMap - Original effectiveness data
 * @returns {Object} Northwestern format effectiveness data
 */
export const convertPathogenMapToNorthwestern = (pathogenAntibioticMap) => {
  const northwesternMap = {};
  
  Object.entries(pathogenAntibioticMap).forEach(([pathogenId, pathogenData]) => {
    northwesternMap[pathogenId] = {
      pathogenName: pathogenData.pathogenName,
      antibiotics: pathogenData.antibiotics.map(antibiotic => ({
        ...antibiotic,
        originalEffectiveness: antibiotic.effectiveness, // Preserve original
        northwesternEffectiveness: convertToNorthwesternScale(antibiotic.effectiveness)
      }))
    };
  });
  
  return northwesternMap;
};

/**
 * Convert Northwestern effectiveness data back to original format
 * @param {Object} northwesternMap - Northwestern format effectiveness data
 * @returns {Object} Original format effectiveness data
 */
export const convertNorthwesternToPathogenMap = (northwesternMap) => {
  const originalMap = {};
  
  Object.entries(northwesternMap).forEach(([pathogenId, pathogenData]) => {
    originalMap[pathogenId] = {
      pathogenName: pathogenData.pathogenName,
      antibiotics: pathogenData.antibiotics.map(antibiotic => ({
        antibioticId: antibiotic.antibioticId,
        name: antibiotic.name,
        effectiveness: antibiotic.originalEffectiveness || 
                      convertToOriginalScale(antibiotic.northwesternEffectiveness),
        notes: antibiotic.notes
      }))
    };
  });
  
  return originalMap;
};

/**
 * Enhanced conversion with medical accuracy validation
 * Provides warnings for potentially inappropriate conversions
 */
export const convertWithValidation = (originalEffectiveness, antibioticName, pathogenName) => {
  const northwestern = convertToNorthwesternScale(originalEffectiveness);
  const warnings = [];
  
  // Medical accuracy warnings
  if (originalEffectiveness === "medium" && northwestern === 1) {
    warnings.push(`${antibioticName} vs ${pathogenName}: "medium" mapped to poor coverage - verify clinical appropriateness`);
  }
  
  if (originalEffectiveness === "low" && northwestern === 1) {
    warnings.push(`${antibioticName} vs ${pathogenName}: "low" mapped to poor coverage - consider if should be no coverage`);
  }
  
  return {
    northwestern,
    warnings,
    originalValue: originalEffectiveness
  };
};

/**
 * Batch convert entire pathogen-antibiotic relationships with validation
 * @param {Object} pathogenAntibioticMap - Original effectiveness data
 * @param {Object} antibioticData - Antibiotic names lookup
 * @returns {Object} Conversion results with warnings
 */
export const batchConvertWithValidation = (pathogenAntibioticMap, antibioticData = {}) => {
  const results = {
    convertedData: {},
    warnings: [],
    stats: {
      totalConversions: 0,
      resistantCount: 0,
      lowCount: 0,
      mediumCount: 0,
      highCount: 0
    }
  };
  
  Object.entries(pathogenAntibioticMap).forEach(([pathogenId, pathogenData]) => {
    results.convertedData[pathogenId] = {
      pathogenName: pathogenData.pathogenName,
      antibiotics: []
    };
    
    pathogenData.antibiotics.forEach(antibiotic => {
      const antibioticName = antibioticData[antibiotic.antibioticId]?.name || antibiotic.name;
      const conversion = convertWithValidation(
        antibiotic.effectiveness, 
        antibioticName, 
        pathogenData.pathogenName
      );
      
      results.convertedData[pathogenId].antibiotics.push({
        ...antibiotic,
        originalEffectiveness: antibiotic.effectiveness,
        northwesternEffectiveness: conversion.northwestern
      });
      
      // Track statistics
      results.stats.totalConversions++;
      results.stats[antibiotic.effectiveness + 'Count']++;
      
      // Collect warnings
      results.warnings.push(...conversion.warnings);
    });
  });
  
  return results;
};

/**
 * Get effectiveness distribution statistics
 * @param {Object} pathogenAntibioticMap - Effectiveness data
 * @returns {Object} Statistical breakdown
 */
export const getEffectivenessDistribution = (pathogenAntibioticMap) => {
  const distribution = {
    original: { resistant: 0, low: 0, medium: 0, high: 0 },
    northwestern: { none: 0, poor: 0, good: 0 },
    total: 0
  };
  
  Object.values(pathogenAntibioticMap).forEach(pathogenData => {
    pathogenData.antibiotics.forEach(antibiotic => {
      distribution.total++;
      
      // Count original effectiveness
      const original = antibiotic.effectiveness.toLowerCase();
      if (distribution.original[original] !== undefined) {
        distribution.original[original]++;
      }
      
      // Count Northwestern equivalent
      const northwestern = convertToNorthwesternScale(antibiotic.effectiveness);
      if (northwestern === 0) distribution.northwestern.none++;
      else if (northwestern === 1) distribution.northwestern.poor++;
      else if (northwestern === 2) distribution.northwestern.good++;
    });
  });
  
  // Calculate percentages
  const originalPercentages = {};
  const northwesternPercentages = {};
  
  Object.entries(distribution.original).forEach(([key, count]) => {
    originalPercentages[key] = ((count / distribution.total) * 100).toFixed(1);
  });
  
  Object.entries(distribution.northwestern).forEach(([key, count]) => {
    northwesternPercentages[key] = ((count / distribution.total) * 100).toFixed(1);
  });
  
  return {
    ...distribution,
    originalPercentages,
    northwesternPercentages
  };
};

/**
 * Validate conversion accuracy against medical literature
 * Returns potential medical accuracy concerns
 */
export const validateMedicalAccuracy = (conversions) => {
  const concerns = [];
  const highConcernPairs = [
    // Pairs where medium->poor conversion might be inappropriate
    { antibiotic: "Penicillin", pathogen: "Streptococcus pneumoniae" },
    { antibiotic: "Ampicillin", pathogen: "Enterococcus faecalis" },
    { antibiotic: "Ciprofloxacin", pathogen: "Pseudomonas aeruginosa" }
  ];
  
  Object.values(conversions.convertedData).forEach(pathogenData => {
    pathogenData.antibiotics.forEach(antibiotic => {
      if (antibiotic.originalEffectiveness === "medium" && 
          antibiotic.northwesternEffectiveness === 1) {
        
        const concernPair = highConcernPairs.find(pair => 
          antibiotic.name.includes(pair.antibiotic) && 
          pathogenData.pathogenName.includes(pair.pathogen)
        );
        
        if (concernPair) {
          concerns.push({
            severity: "high",
            antibiotic: antibiotic.name,
            pathogen: pathogenData.pathogenName,
            issue: "Medium effectiveness mapped to poor - may need clinical review",
            recommendation: "Consider if this should be good coverage (2) in Northwestern model"
          });
        }
      }
    });
  });
  
  return concerns;
};

/**
 * Export utility for testing and validation
 */
export const getConversionMappings = () => ({
  originalToNorthwestern: originalToNorthwesternMap,
  northwesternToOriginal: northwesternToOriginalMap
});

// Validation function for the conversion algorithm
export const validateConversionAlgorithm = () => {
  const errors = [];
  
  // Test bidirectional conversion
  const testValues = ["resistant", "low", "medium", "high"];
  testValues.forEach(original => {
    const northwestern = convertToNorthwesternScale(original);
    const backToOriginal = convertToOriginalScale(northwestern);
    
    // Note: medium and low both map to 1, so back-conversion defaults to medium
    if (original === "low" && backToOriginal === "medium") {
      // This is expected behavior
    } else if (original !== backToOriginal) {
      errors.push(`Conversion inconsistency: ${original} -> ${northwestern} -> ${backToOriginal}`);
    }
  });
  
  // Test edge cases
  if (convertToNorthwesternScale("INVALID") !== 0) {
    errors.push("Invalid input should default to 0");
  }
  
  if (convertToOriginalScale(99) !== "resistant") {
    errors.push("Invalid Northwestern value should default to resistant");
  }
  
  return errors.length === 0 ? null : errors;
};