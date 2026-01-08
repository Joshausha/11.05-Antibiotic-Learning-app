/**
 * Backward Compatibility Layer
 * Ensures existing components continue to work with Northwestern enhancements
 * Provides seamless integration between old and new data formats
 */

import { convertToOriginalScale, convertToNorthwesternScale } from './coverageConversionAlgorithm';
import { getNorthwesternClassification, getContextualNorthwesternCategory } from './pathogenClassificationMap';

/**
 * Type definitions for backward compatibility layer
 */

interface AntibioticReference {
  antibioticId: number;
  effectiveness: 'high' | 'medium' | 'low' | 'resistant';
  notes?: string;
}

interface PathogenData {
  pathogenId: number;
  pathogenName: string;
  antibiotics: AntibioticReference[];
}

interface PathogenMap {
  [key: number]: PathogenData;
}

interface TreatablePathogen {
  pathogenId: number;
  pathogenName: string;
  effectiveness: 'high' | 'medium' | 'low' | 'resistant';
  notes?: string;
}

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
  group: string;
  hasBorder: boolean;
}

interface EnhancedAntibioticData {
  id: number;
  name?: string;
  category?: string;
  class?: string;
  description?: string;
  mechanism?: string;
  spectrum?: string;
  route?: string;
  commonUses?: string[];
  resistance?: string;
  sideEffects?: string | string[];
  northwesternSpectrum?: NorthwesternSpectrum;
  cellWallActive?: boolean;
  generation?: string;
  routeColor?: 'red' | 'blue' | 'purple' | 'gray';
  northwesternPosition?: NorthwesternPosition;
}

/**
 * Compatibility Adapter Class
 * Maintains existing API while enabling Northwestern functionality
 */
class CompatibilityAdapter {
  private originalAntibiotics: any[];
  private originalPathogens: any[];
  private originalPathogenMap: PathogenMap;

  constructor(originalAntibiotics: any[], originalPathogens: any[], originalPathogenMap: PathogenMap) {
    this.originalAntibiotics = originalAntibiotics;
    this.originalPathogens = originalPathogens;
    this.originalPathogenMap = originalPathogenMap;
  }

  /**
   * Get original effectiveness rating (preserves existing API)
   * @param antibioticId - The antibiotic ID
   * @param pathogenId - The pathogen ID
   * @returns Original effectiveness rating or null
   */
  getOriginalEffectiveness(antibioticId: number, pathogenId: number): string | null {
    const pathogen = this.originalPathogenMap[pathogenId];
    if (!pathogen) return null;

    const antibiotic = pathogen.antibiotics.find((ab: AntibioticReference) => ab.antibioticId === antibioticId);
    return antibiotic?.effectiveness || null;
  }

  /**
   * Get Northwestern effectiveness (new API)
   * @param antibioticId - The antibiotic ID
   * @param pathogenId - The pathogen ID
   * @returns Northwestern scale (0-2) or null
   */
  getNorthwesternEffectiveness(antibioticId: number, pathogenId: number): number | null {
    const originalEffectiveness = this.getOriginalEffectiveness(antibioticId, pathogenId);
    if (!originalEffectiveness) return null;

    return convertToNorthwesternScale(originalEffectiveness);
  }

  /**
   * Get effectiveness in either format
   * @param antibioticId - The antibiotic ID
   * @param pathogenId - The pathogen ID
   * @param format - "original" or "northwestern"
   * @returns Effectiveness in requested format or null
   */
  getEffectiveness(antibioticId: number, pathogenId: number, format: 'original' | 'northwestern' = 'original'): string | number | null {
    if (format === 'northwestern') {
      return this.getNorthwesternEffectiveness(antibioticId, pathogenId);
    }
    return this.getOriginalEffectiveness(antibioticId, pathogenId);
  }

  /**
   * Check if antibiotic is effective against pathogen (maintains existing API)
   * @param antibioticId - The antibiotic ID
   * @param pathogenId - The pathogen ID
   * @param threshold - "any", "medium", or "high"
   * @returns Whether the antibiotic is effective at the given threshold
   */
  isEffective(antibioticId: number, pathogenId: number, threshold: 'any' | 'medium' | 'high' = 'any'): boolean {
    const effectiveness = this.getOriginalEffectiveness(antibioticId, pathogenId);
    if (!effectiveness) return false;

    switch (threshold) {
      case 'high':
        return effectiveness === 'high';
      case 'medium':
        return ['medium', 'high'].includes(effectiveness);
      case 'any':
        return !['resistant'].includes(effectiveness);
      default:
        return false;
    }
  }

  /**
   * Get effective antibiotics for pathogen (preserves existing API)
   * @param pathogenId - The pathogen ID
   * @param threshold - "any", "medium", or "high"
   * @returns Array of effective antibiotics
   */
  getEffectiveAntibiotics(pathogenId: number, threshold: 'any' | 'medium' | 'high' = 'any'): AntibioticReference[] {
    const pathogen = this.originalPathogenMap[pathogenId];
    if (!pathogen) return [];

    return pathogen.antibiotics.filter((antibiotic: AntibioticReference) => {
      switch (threshold) {
        case 'high':
          return antibiotic.effectiveness === 'high';
        case 'medium':
          return ['medium', 'high'].includes(antibiotic.effectiveness);
        case 'any':
          return !['resistant'].includes(antibiotic.effectiveness);
        default:
          return false;
      }
    });
  }

  /**
   * Get pathogens treatable by antibiotic (preserves existing API)
   * @param antibioticId - The antibiotic ID
   * @param threshold - "any", "medium", or "high"
   * @returns Array of treatable pathogens
   */
  getTreatablePathogens(antibioticId: number, threshold: 'any' | 'medium' | 'high' = 'any'): TreatablePathogen[] {
    const results: TreatablePathogen[] = [];

    Object.entries(this.originalPathogenMap).forEach(([pathogenId, pathogenData]) => {
      const antibiotic = pathogenData.antibiotics.find((ab: AntibioticReference) => ab.antibioticId === antibioticId);
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
   * @param antibioticId - The antibiotic ID
   * @returns Northwestern spectrum object or null
   */
  getNorthwesternSpectrum(antibioticId: number): NorthwesternSpectrum | null {
    // This would typically come from the Northwestern schema
    // For now, build it from existing pathogen relationships
    const spectrum: NorthwesternSpectrum = {
      MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
      pseudomonas: 0, gramNegative: 0, MSSA: 0, enterococcus_faecalis: 0
    };

    // Get all pathogens this antibiotic treats
    const treatablePathogens = this.getTreatablePathogens(antibioticId, 'any');

    treatablePathogens.forEach((pathogen: TreatablePathogen) => {
      const northwesternClass = getNorthwesternClassification(pathogen.pathogenId);
      if (northwesternClass) {
        const category = getContextualNorthwesternCategory(pathogen.pathogenId);
        if (category && spectrum.hasOwnProperty(category)) {
          const northwesternEffectiveness = convertToNorthwesternScale(pathogen.effectiveness);
          const categoryKey = category as keyof NorthwesternSpectrum;
          spectrum[categoryKey] = Math.max(spectrum[categoryKey], northwesternEffectiveness) as 0 | 1 | 2;
        }
      }
    });

    return spectrum;
  }
}

/**
 * Wrapper functions to maintain existing function-based API
 */
let globalAdapter: CompatibilityAdapter | null = null;

/**
 * Initialize the compatibility adapter
 * @param antibiotics - Original antibiotic data
 * @param pathogens - Original pathogen data
 * @param pathogenMap - Original pathogen-antibiotic map
 */
export const initializeCompatibility = (
  antibiotics: any[],
  pathogens: any[],
  pathogenMap: PathogenMap
): void => {
  globalAdapter = new CompatibilityAdapter(antibiotics, pathogens, pathogenMap);
};

/**
 * Get effectiveness between antibiotic and pathogen (preserves existing API)
 * @param pathogenId - The pathogen ID
 * @param antibioticId - The antibiotic ID
 * @returns Effectiveness rating or null
 */
export const getEffectivenessForPair = (pathogenId: number, antibioticId: number): string | null => {
  if (!globalAdapter) {
    console.warn('Compatibility adapter not initialized');
    return null;
  }
  return globalAdapter.getOriginalEffectiveness(antibioticId, pathogenId);
};

/**
 * Get antibiotics for pathogen (preserves existing API)
 * @param pathogenId - The pathogen ID
 * @returns Array of antibiotics
 */
export const getAntibioticsForPathogen = (pathogenId: number): AntibioticReference[] => {
  if (!globalAdapter) {
    console.warn('Compatibility adapter not initialized');
    return [];
  }
  return globalAdapter.getEffectiveAntibiotics(pathogenId, 'any');
};

/**
 * Get high effectiveness antibiotics (preserves existing API)
 * @param pathogenId - The pathogen ID
 * @returns Array of antibiotics with high effectiveness
 */
export const getHighEffectivenessAntibiotics = (pathogenId: number): AntibioticReference[] => {
  if (!globalAdapter) {
    console.warn('Compatibility adapter not initialized');
    return [];
  }
  return globalAdapter.getEffectiveAntibiotics(pathogenId, 'high');
};

/**
 * Get resistant antibiotics (preserves existing API)
 * @param pathogenId - The pathogen ID
 * @returns Array of resistant antibiotics
 */
export const getResistantAntibiotics = (pathogenId: number): AntibioticReference[] => {
  if (!globalAdapter) {
    console.warn('Compatibility adapter not initialized');
    return [];
  }

  const pathogen = globalAdapter['originalPathogenMap'][pathogenId];
  if (!pathogen) return [];

  return pathogen.antibiotics.filter((ab: AntibioticReference) => ab.effectiveness === 'resistant');
};

/**
 * Get pathogens for antibiotic (preserves existing API)
 * @param antibioticId - The antibiotic ID
 * @returns Array of treatable pathogens
 */
export const getPathogensForAntibiotic = (antibioticId: number): TreatablePathogen[] => {
  if (!globalAdapter) {
    console.warn('Compatibility adapter not initialized');
    return [];
  }
  return globalAdapter.getTreatablePathogens(antibioticId, 'any');
};

/**
 * Enhanced API functions that provide Northwestern functionality
 */

/**
 * Get effectiveness in Northwestern format (new API)
 * @param pathogenId - The pathogen ID
 * @param antibioticId - The antibiotic ID
 * @returns Northwestern effectiveness (0-2) or null
 */
export const getNorthwesternEffectivenessForPair = (pathogenId: number, antibioticId: number): number | null => {
  if (!globalAdapter) {
    console.warn('Compatibility adapter not initialized');
    return null;
  }
  return globalAdapter.getNorthwesternEffectiveness(antibioticId, pathogenId);
};

/**
 * Get Northwestern spectrum for antibiotic (new API)
 * @param antibioticId - The antibiotic ID
 * @returns Northwestern spectrum or null
 */
export const getNorthwesternSpectrumForAntibiotic = (antibioticId: number): NorthwesternSpectrum | null => {
  if (!globalAdapter) {
    console.warn('Compatibility adapter not initialized');
    return null;
  }
  return globalAdapter.getNorthwesternSpectrum(antibioticId);
};

/**
 * Check if data is in Northwestern format
 * @param antibioticData - The antibiotic data object
 * @returns Whether the data has Northwestern properties
 */
export const hasNorthwesternData = (antibioticData: EnhancedAntibioticData): boolean => {
  return antibioticData &&
         antibioticData.northwesternSpectrum !== undefined &&
         typeof antibioticData.cellWallActive === 'boolean';
};

/**
 * Convert antibiotic data to Northwestern format if needed
 * @param antibioticData - The antibiotic data object
 * @returns Antibiotic data with Northwestern format
 */
export const ensureNorthwesternFormat = (antibioticData: EnhancedAntibioticData): EnhancedAntibioticData => {
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
    generation: 'Unclassified',
    routeColor: 'gray',
    northwesternPosition: { x: 0, y: 0, group: 'unclassified', hasBorder: false }
  };
};

/**
 * Migration helper for existing components
 * @param antibioticArray - Array of antibiotic objects
 * @returns Array with Northwestern enhancements
 */
export const migrateToNorthwesternFormat = (antibioticArray: EnhancedAntibioticData[]): EnhancedAntibioticData[] => {
  return antibioticArray.map((antibiotic: EnhancedAntibioticData) => ensureNorthwesternFormat(antibiotic));
};

/**
 * Validate backward compatibility
 * @returns Array of compatibility issues or null if valid
 */
export const validateBackwardCompatibility = (): string[] | null => {
  if (!globalAdapter) {
    return ['Compatibility adapter not initialized'];
  }

  const issues: string[] = [];

  // Test that original API functions still work
  try {
    const testPathogenId = 1; // S. aureus
    const testAntibioticId = 2; // Vancomycin

    const originalEff = getEffectivenessForPair(testPathogenId, testAntibioticId);
    const antibiotics = getAntibioticsForPathogen(testPathogenId);
    const pathogens = getPathogensForAntibiotic(testAntibioticId);

    if (!originalEff) issues.push('getEffectivenessForPair not working');
    if (!Array.isArray(antibiotics)) issues.push('getAntibioticsForPathogen not returning array');
    if (!Array.isArray(pathogens)) issues.push('getPathogensForAntibiotic not returning array');

  } catch (error) {
    issues.push(`API compatibility error: ${(error as Error).message}`);
  }

  return issues.length === 0 ? null : issues;
};

/**
 * Get compatibility adapter instance (for advanced usage)
 * @returns The global compatibility adapter instance or null
 */
export const getCompatibilityAdapter = (): CompatibilityAdapter | null => globalAdapter;

// Export the adapter class for direct instantiation if needed
export { CompatibilityAdapter };

export default {
  initializeCompatibility,
  getEffectivenessForPair,
  getAntibioticsForPathogen,
  getHighEffectivenessAntibiotics,
  getResistantAntibiotics,
  getPathogensForAntibiotic,
  getNorthwesternEffectivenessForPair,
  getNorthwesternSpectrumForAntibiotic,
  hasNorthwesternData,
  ensureNorthwesternFormat,
  migrateToNorthwesternFormat,
  validateBackwardCompatibility,
  getCompatibilityAdapter,
  CompatibilityAdapter
};
