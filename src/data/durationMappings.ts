/**
 * Duration Mappings
 * Bridge between existing pathogen/antibiotic data and RBO duration data
 * Maps clinical conditions to treatment durations with pathogen-antibiotic context
 * Created: 2025-08-03
 */

import simplePathogens from './SimplePathogenData';
import simpleAntibiotics from './SimpleAntibioticData';
import { rboConditionsMap } from './RBOMappingSystem.ts';
import pathogenAntibioticMap from './pathogenAntibioticMap';
import {
  mapPathogenToConditions,
  getPathogenDurations,
  parseDurationString
} from '../utils/durationHelpers.js';

interface DurationContext {
  conditionName: string;
  conditionCategory: string;
  severity: string;
  parsedDuration: any;
}

interface EnhancedAntibiotic {
  antibioticId: number;
  name?: string;
  effectiveness: string;
  notes?: string;
  antibioticData?: any;
  duration?: string | null;
  durationContext?: DurationContext | null;
}

interface EnhancedPathogenData {
  pathogenName: string;
  pathogenData?: any;
  antibiotics: EnhancedAntibiotic[];
  allDurations?: any[];
  primaryDuration?: any;
}

interface PathogenDurationInfo {
  pathogen?: any;
  durations?: any[];
  primaryDuration?: any;
  hasMultipleDurations?: boolean;
  durationCount?: number;
}

interface AntibioticDurationInfo {
  antibiotic?: any;
  effectivePathogens?: any[];
  durationRange?: any;
}

interface DurationStatistics {
  totalConditions: number;
  durationTypes: {
    simple: number;
    complex: number;
    ageBased: number;
    conditional: number;
  };
  categories: {
    short: number;
    medium: number;
    long: number;
    extended: number;
    unknown: number;
  };
  severityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  averageDurationDays: number | null;
  durationRange: { min: number | null; max: number | null };
}

interface SearchCriteria {
  category?: string;
  isComplex?: boolean;
  minDays?: number;
  maxDays?: number;
  severity?: string;
}

/**
 * Enhanced pathogen-antibiotic-duration mapping
 * Combines effectiveness with clinical duration guidelines
 */
export const createEnhancedPathogenAntibioticMap = (): Record<string | number, EnhancedPathogenData> => {
  const enhancedMap: Record<string | number, EnhancedPathogenData> = {};

  Object.keys(pathogenAntibioticMap).forEach(pathogenId => {
    const pathogenData = pathogenAntibioticMap[pathogenId];
    const pathogen = simplePathogens.find(p => p.id === parseInt(pathogenId));

    if (!pathogen) return;

    // Get duration data for this pathogen
    const pathogenDurations = getPathogenDurations(pathogen.name);

    // Enhance antibiotic data with duration information
    const enhancedAntibiotics: EnhancedAntibiotic[] = pathogenData.antibiotics.map((antibiotic: any) => {
      const antibioticData = simpleAntibiotics.find(ab => ab.id === antibiotic.antibioticId);

      // Find most relevant duration for this antibiotic-pathogen combination
      const relevantDuration = findRelevantDuration(
        pathogenDurations,
        antibioticData,
        antibiotic.effectiveness
      );

      return {
        ...antibiotic,
        antibioticData,
        duration: relevantDuration ? relevantDuration.duration : null,
        durationContext: relevantDuration ? {
          conditionName: relevantDuration.conditionName,
          conditionCategory: relevantDuration.category,
          severity: relevantDuration.severity,
          parsedDuration: relevantDuration.parsedDuration
        } : null
      };
    });

    enhancedMap[pathogenId] = {
      pathogenName: pathogenData.pathogenName,
      pathogenData: pathogen,
      antibiotics: enhancedAntibiotics,
      allDurations: pathogenDurations,
      primaryDuration: getPrimaryDuration(pathogenDurations)
    };
  });

  return enhancedMap;
};

/**
 * Find the most relevant duration for a pathogen-antibiotic combination
 * Prioritizes based on antibiotic common uses and condition severity
 */
const findRelevantDuration = (pathogenDurations: any[], antibioticData: any, effectiveness: string) => {
  if (!pathogenDurations || pathogenDurations.length === 0) return null;
  if (!antibioticData) return pathogenDurations[0]; // Return first available duration

  // If only one duration available, return it
  if (pathogenDurations.length === 1) {
    return pathogenDurations[0];
  }

  // Score durations based on relevance to antibiotic
  const scoredDurations = pathogenDurations.map((duration: any) => {
    let score = 0;

    // Base score on effectiveness
    if (effectiveness === 'high') score += 3;
    else if (effectiveness === 'medium') score += 2;
    else if (effectiveness === 'low') score += 1;

    // Bonus for matching antibiotic common uses with condition category
    if (antibioticData.commonUses && Array.isArray(antibioticData.commonUses)) {
      const usesString = antibioticData.commonUses.join(' ').toLowerCase();
      const categoryString = duration.category.toLowerCase();
      const conditionString = duration.conditionName.toLowerCase();

      // Direct matches
      if (usesString.includes('bloodstream') && categoryString.includes('bloodstream')) score += 5;
      if (usesString.includes('pneumonia') && (categoryString.includes('respiratory') || conditionString.includes('pneumonia'))) score += 5;
      if (usesString.includes('meningitis') && (categoryString.includes('nervous') || conditionString.includes('meningitis'))) score += 5;
      if (usesString.includes('uti') && categoryString.includes('genitourinary')) score += 5;
      if (usesString.includes('skin') && categoryString.includes('skin')) score += 5;
      if (usesString.includes('bone') && categoryString.includes('bone')) score += 5;
      if (usesString.includes('throat') && categoryString.includes('throat')) score += 5;

      // Partial matches
      if (usesString.includes('infections') && conditionString.includes('infection')) score += 2;
      if (usesString.includes('sepsis') && conditionString.includes('blood')) score += 3;
    }

    // Bonus for severity alignment
    if (duration.severity === 'high') score += 2;
    else if (duration.severity === 'medium') score += 1;

    return { ...duration, relevanceScore: score };
  });

  // Sort by score and return highest scoring duration
  scoredDurations.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);
  return scoredDurations[0];
};

/**
 * Get the primary (most common/representative) duration for a pathogen
 */
const getPrimaryDuration = (pathogenDurations: any[]): any => {
  if (!pathogenDurations || pathogenDurations.length === 0) return null;

  // Prioritize by severity and condition frequency
  const prioritized = pathogenDurations.sort((a: any, b: any) => {
    // First by severity
    const severityOrder: Record<string, number> = { 'high': 3, 'medium': 2, 'low': 1 };
    const severityDiff = (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
    if (severityDiff !== 0) return severityDiff;

    // Then by condition name (some conditions are more representative)
    const conditionPriority: Record<string, number> = {
      'bloodstream': 5,
      'pneumonia': 4,
      'meningitis': 4,
      'cellulitis': 3,
      'uti': 3,
      'sinusitis': 2,
      'pharyngitis': 1
    };

    const aPriority = Object.keys(conditionPriority).reduce((max: number, key: string) => {
      return a.conditionName.toLowerCase().includes(key) ? Math.max(max, conditionPriority[key]) : max;
    }, 0);

    const bPriority = Object.keys(conditionPriority).reduce((max: number, key: string) => {
      return b.conditionName.toLowerCase().includes(key) ? Math.max(max, conditionPriority[key]) : max;
    }, 0);

    return bPriority - aPriority;
  });

  return prioritized[0];
};

/**
 * Get duration information for a specific pathogen
 */
export const getPathogenDurationInfo = (pathogenId: number): PathogenDurationInfo | null => {
  const pathogen = simplePathogens.find(p => p.id === parseInt(pathogenId.toString()));
  if (!pathogen) return null;

  const durations = getPathogenDurations(pathogen.name);
  const primary = getPrimaryDuration(durations);

  return {
    pathogen,
    durations,
    primaryDuration: primary,
    hasMultipleDurations: durations.length > 1,
    durationCount: durations.length
  };
};

/**
 * Get duration information for a specific antibiotic
 */
export const getAntibioticDurationInfo = (antibioticId: number): AntibioticDurationInfo | null => {
  const antibiotic = simpleAntibiotics.find(ab => ab.id === parseInt(antibioticId.toString()));
  if (!antibiotic) return null;

  // Find all pathogens this antibiotic is effective against
  const effectivePathogens: any[] = [];

  Object.keys(pathogenAntibioticMap).forEach(pathogenId => {
    const pathogenData = pathogenAntibioticMap[pathogenId];
    const antibioticEntry = pathogenData.antibiotics.find((ab: any) => ab.antibioticId === parseInt(antibioticId.toString()));

    if (antibioticEntry && (antibioticEntry.effectiveness === 'high' || antibioticEntry.effectiveness === 'medium')) {
      const pathogen = simplePathogens.find(p => p.id === parseInt(pathogenId));
      if (pathogen) {
        const durations = getPathogenDurations(pathogen.name);
        const relevantDuration = findRelevantDuration(durations, antibiotic, antibioticEntry.effectiveness);

        effectivePathogens.push({
          pathogen,
          effectiveness: antibioticEntry.effectiveness,
          duration: relevantDuration,
          allDurations: durations
        });
      }
    }
  });

  return {
    antibiotic,
    effectivePathogens,
    durationRange: calculateDurationRange(effectivePathogens)
  };
};

/**
 * Calculate duration range for multiple pathogen-antibiotic combinations
 */
const calculateDurationRange = (effectivePathogens: any[]) => {
  const durations = effectivePathogens
    .map(ep => ep.duration)
    .filter(d => d && d.parsedDuration && !d.parsedDuration.isComplex)
    .map(d => d.parsedDuration);

  if (durations.length === 0) return null;

  const allDays = durations.flatMap(d => [d.minDays, d.maxDays]).filter(days => days !== null);

  if (allDays.length === 0) return null;

  const minDays = Math.min(...allDays);
  const maxDays = Math.max(...allDays);

  return {
    minDays,
    maxDays,
    displayRange: formatDurationRange(minDays, maxDays),
    categories: [...new Set(durations.map(d => d.category))]
  };
};

/**
 * Format duration range for display
 */
const formatDurationRange = (minDays: number, maxDays: number): string => {
  if (minDays === maxDays) {
    return `${minDays} day${minDays !== 1 ? 's' : ''}`;
  }

  // Convert to weeks if appropriate
  if (minDays >= 7 && maxDays >= 7) {
    const minWeeks = Math.floor(minDays / 7);
    const maxWeeks = Math.ceil(maxDays / 7);

    if (minWeeks === maxWeeks) {
      return `${minWeeks} week${minWeeks !== 1 ? 's' : ''}`;
    }
    return `${minWeeks}-${maxWeeks} weeks`;
  }

  return `${minDays}-${maxDays} days`;
};

/**
 * Get all conditions with their duration summaries
 */
export const getAllConditionDurations = () => {
  return rboConditionsMap.map((condition: any) => ({
    id: condition.id,
    name: condition.name,
    category: condition.category,
    severity: condition.severity,
    duration: condition.duration,
    parsedDuration: parseDurationString(condition.duration),
    pathogenCount: condition.mappedPathogens.length,
    antibioticCount: condition.mappedAntibiotics.length
  }));
};

/**
 * Get duration statistics across all conditions
 */
export const getDurationStatistics = (): DurationStatistics => {
  const allConditions = getAllConditionDurations();

  const stats: DurationStatistics = {
    totalConditions: allConditions.length,
    durationTypes: {
      simple: 0,
      complex: 0,
      ageBased: 0,
      conditional: 0
    },
    categories: {
      short: 0,
      medium: 0,
      long: 0,
      extended: 0,
      unknown: 0
    },
    severityDistribution: {
      high: 0,
      medium: 0,
      low: 0
    },
    averageDurationDays: null,
    durationRange: { min: null, max: null }
  };

  const simpleDurations: number[] = [];

  allConditions.forEach((condition: any) => {
    // Duration types
    if (condition.parsedDuration.isComplex) {
      stats.durationTypes.complex++;
      if (condition.parsedDuration.type === 'age-based') {
        stats.durationTypes.ageBased++;
      } else if (condition.parsedDuration.type === 'conditional') {
        stats.durationTypes.conditional++;
      }
    } else {
      stats.durationTypes.simple++;
      if (condition.parsedDuration.maxDays) {
        simpleDurations.push(condition.parsedDuration.maxDays);
      }
    }

    // Categories
    const categoryKey = condition.parsedDuration.category as keyof typeof stats.categories;
    if (categoryKey in stats.categories) {
      stats.categories[categoryKey]++;
    }

    // Severity
    const severityKey = condition.severity as keyof typeof stats.severityDistribution;
    if (severityKey in stats.severityDistribution) {
      stats.severityDistribution[severityKey]++;
    }
  });

  // Calculate average and range for simple durations
  if (simpleDurations.length > 0) {
    stats.averageDurationDays = Math.round(
      simpleDurations.reduce((sum, days) => sum + days, 0) / simpleDurations.length
    );
    stats.durationRange.min = Math.min(...simpleDurations);
    stats.durationRange.max = Math.max(...simpleDurations);
  }

  return stats;
};

/**
 * Search conditions by duration criteria
 */
export const searchConditionsByDuration = (criteria: SearchCriteria) => {
  const allConditions = getAllConditionDurations();

  return allConditions.filter((condition: any) => {
    const parsed = condition.parsedDuration;

    // Filter by category
    if (criteria.category && parsed.category !== criteria.category) {
      return false;
    }

    // Filter by complexity
    if (criteria.isComplex !== undefined && parsed.isComplex !== criteria.isComplex) {
      return false;
    }

    // Filter by duration range (in days)
    if (criteria.minDays !== undefined || criteria.maxDays !== undefined) {
      if (parsed.isComplex || !parsed.maxDays) {
        return false; // Skip complex durations for range filtering
      }

      if (criteria.minDays !== undefined && parsed.maxDays < criteria.minDays) {
        return false;
      }

      if (criteria.maxDays !== undefined && parsed.minDays > criteria.maxDays) {
        return false;
      }
    }

    // Filter by severity
    if (criteria.severity && condition.severity !== criteria.severity) {
      return false;
    }

    return true;
  });
};

// Create and export the enhanced mapping
export const enhancedPathogenAntibioticMap = createEnhancedPathogenAntibioticMap();

export default {
  enhancedPathogenAntibioticMap,
  getPathogenDurationInfo,
  getAntibioticDurationInfo,
  getAllConditionDurations,
  getDurationStatistics,
  searchConditionsByDuration
};
