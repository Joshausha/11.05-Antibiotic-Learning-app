/**
 * Backward Compatibility Layer
 * Ensures existing components continue to work with Northwestern enhancements
 * Provides seamless integration between old and new data formats
 */

import { convertToOriginalScale, convertToNorthwesternScale } from './coverageConversionAlgorithm.js';
import { getNorthwesternClassification, getContextualNorthwesternCategory } from './pathogenClassificationMap';

/**
 * Compatibility Adapter Class
 * Maintains existing API while enabling Northwestern functionality
 */
class CompatibilityAdapter {
  constructor(originalAntibiotics, originalPathogens, originalPathogenMap) {
    this.originalAntibiotics = originalAntibiotics;
    this.originalPathogens = originalPathogens;
    this.originalPathogenMap = originalPathogenMap;
  }

  /**
   * Get original effectiveness rating (preserves existing API)
   * @param {number} antibioticId 
   * @param {number} pathogenId 
   * @returns {string|null} Original effectiveness rating
   */
  getOriginalEffectiveness(antibioticId, pathogenId) {
    const pathogen = this.originalPathogenMap[pathogenId];
    if (!pathogen) return null;
    
    const antibiotic = pathogen.antibiotics.find(ab => ab.antibioticId === antibioticId);
    return antibiotic?.effectiveness || null;
  }

  /**
   * Get Northwestern effectiveness (new API)
   * @param {number} antibioticId 
   * @param {number} pathogenId 
   * @returns {number|null} Northwestern scale (0-2)
   */
  getNorthwesternEffectiveness(antibioticId, pathogenId) {
    const originalEffectiveness = this.getOriginalEffectiveness(antibioticId, pathogenId);
    if (!originalEffectiveness) return null;
    
    return convertToNorthwesternScale(originalEffectiveness);
  }

  /**
   * Get effectiveness in either format
   * @param {number} antibioticId 
   * @param {number} pathogenId 
   * @param {string} format - "original" or "northwestern"
   * @returns {string|number|null}
   */
  getEffectiveness(antibioticId, pathogenId, format = "original") {
    if (format === "northwestern") {
      return this.getNorthwesternEffectiveness(antibioticId, pathogenId);
    }
    return this.getOriginalEffectiveness(antibioticId, pathogenId);
  }

  /**
   * Check if antibiotic is effective against pathogen (maintains existing API)
   * @param {number} antibioticId 
   * @param {number} pathogenId 
   * @param {string} threshold - "any", "medium", "high"
   * @returns {boolean}
   */
  isEffective(antibioticId, pathogenId, threshold = "any") {
    const effectiveness = this.getOriginalEffectiveness(antibioticId, pathogenId);
    if (!effectiveness) return false;
    
    switch (threshold) {
      case "high":
        return effectiveness === "high";
      case "medium":
        return ["medium", "high"].includes(effectiveness);
      case "any":
        return !["resistant"].includes(effectiveness);
      default:
        return false;
    }
  }

  /**
   * Get effective antibiotics for pathogen (preserves existing API)
   * @param {number} pathogenId 
   * @param {string} threshold - "any", "medium", "high"
   * @returns {Array} Array of effective antibiotics
   */
  getEffectiveAntibiotics(pathogenId, threshold = "any") {
    const pathogen = this.originalPathogenMap[pathogenId];
    if (!pathogen) return [];
    
    return pathogen.antibiotics.filter(antibiotic => {
      switch (threshold) {
        case "high":
          return antibiotic.effectiveness === "high";
        case "medium":
          return ["medium", "high"].includes(antibiotic.effectiveness);
        case "any":
          return !["resistant"].includes(antibiotic.effectiveness);
        default:
          return false;
      }
    });
  }

  /**
   * Get pathogens treatable by antibiotic (preserves existing API)
   * @param {number} antibioticId 
   * @param {string} threshold - "any", "medium", "high"
   * @returns {Array} Array of treatable pathogens
   */
  getTreatablePathogens(antibioticId, threshold = "any") {
    const results = [];
    
    Object.entries(this.originalPathogenMap).forEach(([pathogenId, pathogenData]) => {
      const antibiotic = pathogenData.antibiotics.find(ab => ab.antibioticId === antibioticId);
      if (!antibiotic) return;
      
      const isEffective = this.isEffective(antibioticId, parseInt(pathogenId), threshold);
      if (isEffective) {
        results.push({
          pathogenId: parseInt(pathogenId),
          pathogenName: pathogenData.pathogenName,
          effectiveness: antibiotic.effectiveness,
          notes: antibiotic.notes
        });
      }
    });
    
    return results;
  }

  /**
   * Get Northwestern spectrum for antibiotic (new API)
   * @param {number} antibioticId 
   * @returns {Object|null} Northwestern spectrum object
   */
  getNorthwesternSpectrum(antibioticId) {
    // This would typically come from the Northwestern schema
    // For now, build it from existing pathogen relationships
    const spectrum = {
      MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
      pseudomonas: 0, gramNegative: 0, MSSA: 0, enterococcus_faecalis: 0
    };
    
    // Get all pathogens this antibiotic treats
    const treatablePathogens = this.getTreatablePathogens(antibioticId, "any");
    
    treatablePathogens.forEach(pathogen => {
      const northwesternClass = getNorthwesternClassification(pathogen.pathogenId);
      if (northwesternClass) {
        const category = getContextualNorthwesternCategory(pathogen.pathogenId);
        if (spectrum.hasOwnProperty(category)) {
          const northwesternEffectiveness = convertToNorthwesternScale(pathogen.effectiveness);
          spectrum[category] = Math.max(spectrum[category], northwesternEffectiveness);
        }
      }
    });
    
    return spectrum;
  }
}

/**
 * Wrapper functions to maintain existing function-based API
 */
let globalAdapter = null;

/**
 * Initialize the compatibility adapter
 * @param {Array} antibiotics - Original antibiotic data
 * @param {Array} pathogens - Original pathogen data  
 * @param {Object} pathogenMap - Original pathogen-antibiotic map
 */
export const initializeCompatibility = (antibiotics, pathogens, pathogenMap) => {
  globalAdapter = new CompatibilityAdapter(antibiotics, pathogens, pathogenMap);
};

/**
 * Get effectiveness between antibiotic and pathogen (preserves existing API)
 * @param {number} pathogenId 
 * @param {number} antibioticId 
 * @returns {string|null}
 */
export const getEffectivenessForPair = (pathogenId, antibioticId) => {
  if (!globalAdapter) {
    console.warn("Compatibility adapter not initialized");
    return null;
  }
  return globalAdapter.getOriginalEffectiveness(antibioticId, pathogenId);
};

/**
 * Get antibiotics for pathogen (preserves existing API)
 * @param {number} pathogenId 
 * @returns {Array}
 */
export const getAntibioticsForPathogen = (pathogenId) => {
  if (!globalAdapter) {
    console.warn("Compatibility adapter not initialized");
    return [];
  }
  return globalAdapter.getEffectiveAntibiotics(pathogenId, "any");
};

/**
 * Get high effectiveness antibiotics (preserves existing API)
 * @param {number} pathogenId 
 * @returns {Array}
 */
export const getHighEffectivenessAntibiotics = (pathogenId) => {
  if (!globalAdapter) {
    console.warn("Compatibility adapter not initialized");
    return [];
  }
  return globalAdapter.getEffectiveAntibiotics(pathogenId, "high");
};

/**
 * Get resistant antibiotics (preserves existing API)
 * @param {number} pathogenId 
 * @returns {Array}
 */
export const getResistantAntibiotics = (pathogenId) => {
  if (!globalAdapter) {
    console.warn("Compatibility adapter not initialized");
    return [];
  }
  
  const pathogen = globalAdapter.originalPathogenMap[pathogenId];
  if (!pathogen) return [];
  
  return pathogen.antibiotics.filter(ab => ab.effectiveness === "resistant");
};

/**
 * Get pathogens for antibiotic (preserves existing API)
 * @param {number} antibioticId 
 * @returns {Array}
 */
export const getPathogensForAntibiotic = (antibioticId) => {
  if (!globalAdapter) {
    console.warn("Compatibility adapter not initialized");
    return [];
  }
  return globalAdapter.getTreatablePathogens(antibioticId, "any");
};

/**
 * Enhanced API functions that provide Northwestern functionality
 */

/**
 * Get effectiveness in Northwestern format (new API)
 * @param {number} pathogenId 
 * @param {number} antibioticId 
 * @returns {number|null}
 */
export const getNorthwesternEffectivenessForPair = (pathogenId, antibioticId) => {
  if (!globalAdapter) {
    console.warn("Compatibility adapter not initialized");
    return null;
  }
  return globalAdapter.getNorthwesternEffectiveness(antibioticId, pathogenId);
};

/**
 * Get Northwestern spectrum for antibiotic (new API)
 * @param {number} antibioticId 
 * @returns {Object|null}
 */
export const getNorthwesternSpectrumForAntibiotic = (antibioticId) => {
  if (!globalAdapter) {
    console.warn("Compatibility adapter not initialized");
    return null;
  }
  return globalAdapter.getNorthwesternSpectrum(antibioticId);
};

/**
 * Check if data is in Northwestern format
 * @param {Object} antibioticData 
 * @returns {boolean}
 */
export const hasNorthwesternData = (antibioticData) => {
  return antibioticData && 
         antibioticData.northwesternSpectrum !== undefined &&
         typeof antibioticData.cellWallActive === "boolean";
};

/**
 * Convert antibiotic data to Northwestern format if needed
 * @param {Object} antibioticData 
 * @returns {Object}
 */
export const ensureNorthwesternFormat = (antibioticData) => {
  if (hasNorthwesternData(antibioticData)) {
    return antibioticData;
  }
  
  // Add Northwestern properties with defaults
  return {
    ...antibioticData,
    northwesternSpectrum: globalAdapter?.getNorthwesternSpectrum(antibioticData.id) || {
      MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
      pseudomonas: 0, gramNegative: 0, MSSA: 0, enterococcus_faecalis: 0
    },
    cellWallActive: false, // Default, should be overridden with actual data
    generation: "Unclassified",
    routeColor: "gray",
    northwesternPosition: { x: 0, y: 0, group: "unclassified", hasBorder: false }
  };
};

/**
 * Migration helper for existing components
 * @param {Array} antibioticArray - Array of antibiotic objects
 * @returns {Array} Array with Northwestern enhancements
 */
export const migrateToNorthwesternFormat = (antibioticArray) => {
  return antibioticArray.map(antibiotic => ensureNorthwesternFormat(antibiotic));
};

/**
 * Validate backward compatibility
 * @returns {Array|null} Array of compatibility issues or null if valid
 */
export const validateBackwardCompatibility = () => {
  if (!globalAdapter) {
    return ["Compatibility adapter not initialized"];
  }
  
  const issues = [];
  
  // Test that original API functions still work
  try {
    const testPathogenId = 1; // S. aureus
    const testAntibioticId = 2; // Vancomycin
    
    const originalEff = getEffectivenessForPair(testPathogenId, testAntibioticId);
    const antibiotics = getAntibioticsForPathogen(testPathogenId);
    const pathogens = getPathogensForAntibiotic(testAntibioticId);
    
    if (!originalEff) issues.push("getEffectivenessForPair not working");
    if (!Array.isArray(antibiotics)) issues.push("getAntibioticsForPathogen not returning array");
    if (!Array.isArray(pathogens)) issues.push("getPathogensForAntibiotic not returning array");
    
  } catch (error) {
    issues.push(`API compatibility error: ${error.message}`);
  }
  
  return issues.length === 0 ? null : issues;
};

/**
 * Get compatibility adapter instance (for advanced usage)
 * @returns {CompatibilityAdapter|null}
 */
export const getCompatibilityAdapter = () => globalAdapter;

// Export the adapter class for direct instantiation if needed
export { CompatibilityAdapter };