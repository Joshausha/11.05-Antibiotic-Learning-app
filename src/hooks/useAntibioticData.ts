/**
 * useAntibioticData Hook
 * Custom hook for managing antibiotic data, search, and condition lookup
 * Provides antibiotic exploration functionality with drug class filtering and cross-references
 */

import { useMemo, useState } from 'react';
import {
  buildIndexes,
  searchAntibiotics,
  getConditionsForAntibiotic,
  getDrugClassStats,
  findCombinationTherapyConditions
} from '../utils/dataIndexer';
import { createNorthwesternAntibioticData } from '../data/NorthwesternAntibioticSchema';
import { logDevError, logDevWarning, validateAntibioticData } from '../utils/devErrorLogger';

/**
 * Type definitions for antibiotic data management
 */

interface AntibioticIndexes {
  antibiotics: Array<{
    name: string;
    class: string;
    conditions: string[];
    count: number;
    therapyContexts: string[];
    [key: string]: any;
  }>;
  drugClassToAntibiotics: Map<string, any>;
  [key: string]: any;
}

interface AntibioticStats {
  total: number;
  maxConditions: number;
  avgConditions: string | number;
  topAntibiotics: any[];
  drugClassCount: number;
}

interface FilteredStats {
  total: number;
  byDrugClass: Record<string, number>;
}

interface Antibiotic {
  name: string;
  class: string;
  conditions: string[];
  count: number;
  therapyContexts: string[];
  [key: string]: any;
}

interface CombinationTherapy {
  antibiotic: Antibiotic;
  contexts: string[];
}

interface UseAntibioticDataReturn {
  // Data
  antibiotics: Antibiotic[];
  selectedAntibiotic: Antibiotic | null;
  selectedAntibioticConditions: any[];
  drugClassStats: any[];
  availableDrugClasses: string[];

  // Statistics
  antibioticStats: AntibioticStats | null;
  filteredStats: FilteredStats;

  // Search state
  searchQuery: string;
  drugClassFilter: string;
  sortBy: string;

  // Actions
  searchAntibiotics: (query: string) => void;
  filterByDrugClass: (drugClass: string) => void;
  setSortOrder: (order: string) => void;
  selectAntibiotic: (antibiotic: Antibiotic) => void;
  clearSelection: () => void;
  clearFilters: () => void;

  // Utilities
  getAntibioticByName: (name: string) => Antibiotic | null | undefined;
  findAlternativeAntibiotics: (antibiotic: Antibiotic) => Antibiotic[];
  findCombinationTherapies: (antibiotic: Antibiotic) => CombinationTherapy[];
  getResistanceInfo: (antibiotic: Antibiotic) => string[] | null;

  // Loading state
  isLoading: boolean;
}

/**
 * Custom hook for managing antibiotic data with search and filtering
 * @param medicalConditions - Array of medical conditions
 * @returns Antibiotic data and management utilities
 */
const useAntibioticData = (medicalConditions: any[]): UseAntibioticDataReturn => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [drugClassFilter, setDrugClassFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name'); // 'name', 'count', 'conditions', 'class'
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<Antibiotic | null>(null);

  // Build indexes once when conditions data changes
  const indexes = useMemo<AntibioticIndexes | null>(() => {
    if (!medicalConditions || medicalConditions.length === 0) {
      logDevWarning('No medical conditions data available for antibiotic indexing', {
        conditionsLength: medicalConditions?.length ?? 0
      });
      return null;
    }

    try {
      const result = buildIndexes(medicalConditions) as any;

      // Validate indexes in development
      if (process.env.NODE_ENV === 'development' && result?.antibiotics) {
        const issues: string[] = [];
        result.antibiotics.slice(0, 5).forEach((antibiotic: any) => {
          const antibioticIssues = validateAntibioticData(antibiotic);
          issues.push(...antibioticIssues);
        });
        if (issues.length > 0) {
          logDevWarning('Antibiotic data validation issues (first 5 checked)', { issues });
        }
      }

      return result;
    } catch (error) {
      logDevError({
        file: 'useAntibioticData.ts',
        operation: 'Building antibiotic indexes',
        error,
        context: { conditionsCount: medicalConditions.length }
      });
      return null;
    }
  }, [medicalConditions]);

  // Get filtered and sorted antibiotics
  const antibiotics = useMemo<Antibiotic[]>(() => {
    if (!indexes) return [];

    try {
      const searchResults = searchAntibiotics(indexes as any, {
        query: searchQuery,
        drugClass: drugClassFilter,
        sortBy: sortBy as any
      });

      // Merge Northwestern data from NorthwesternAntibioticSchema
      return createNorthwesternAntibioticData(searchResults as any) as any;
    } catch (error) {
      logDevError({
        file: 'useAntibioticData.ts',
        operation: 'Searching/filtering antibiotics',
        error,
        context: { searchQuery, drugClassFilter, sortBy }
      });
      return [];
    }
  }, [indexes, searchQuery, drugClassFilter, sortBy]);

  // Get conditions for selected antibiotic
  const selectedAntibioticConditions = useMemo<any[]>(() => {
    if (!indexes || !selectedAntibiotic) return [];
    return getConditionsForAntibiotic(indexes as any, selectedAntibiotic.name);
  }, [indexes, selectedAntibiotic]);

  // Get drug class statistics
  const drugClassStats = useMemo<any[]>(() => {
    if (!indexes) return [];
    return getDrugClassStats(indexes as any);
  }, [indexes]);

  // Get available drug classes for filtering
  const availableDrugClasses = useMemo<string[]>(() => {
    if (!indexes) return [];
    return Array.from(indexes.drugClassToAntibiotics.keys()).sort();
  }, [indexes]);

  // Get antibiotic statistics
  const antibioticStats = useMemo<AntibioticStats | null>(() => {
    if (!indexes) return null;

    const total = indexes.antibiotics.length;
    const conditionCounts = indexes.antibiotics.map((a: Antibiotic) => a.conditions.length);
    const maxConditions = Math.max(...conditionCounts, 0);
    const avgConditions = conditionCounts.length > 0
      ? (conditionCounts.reduce((a, b) => a + b, 0) / conditionCounts.length).toFixed(1)
      : 0;

    // Calculate most used antibiotics
    const topAntibiotics = [...indexes.antibiotics]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total,
      maxConditions,
      avgConditions,
      topAntibiotics,
      drugClassCount: availableDrugClasses.length
    };
  }, [indexes, availableDrugClasses]);

  // Get filtered statistics
  const filteredStats = useMemo<FilteredStats>(() => {
    const drugClassCounts: Record<string, number> = {};
    antibiotics.forEach(antibiotic => {
      drugClassCounts[antibiotic.class] = (drugClassCounts[antibiotic.class] || 0) + 1;
    });

    return {
      total: antibiotics.length,
      byDrugClass: drugClassCounts
    };
  }, [antibiotics]);

  // Search and filter functions
  const searchAntibioticsFunction = (query: string): void => {
    setSearchQuery(query);
  };

  const filterByDrugClass = (drugClass: string): void => {
    setDrugClassFilter(drugClass);
  };

  const setSortOrder = (order: string): void => {
    setSortBy(order);
  };

  const selectAntibioticFn = (antibiotic: Antibiotic): void => {
    setSelectedAntibiotic(antibiotic);
  };

  const clearSelection = (): void => {
    setSelectedAntibiotic(null);
  };

  const clearFilters = (): void => {
    setSearchQuery('');
    setDrugClassFilter('all');
    setSortBy('name');
  };

  // Get antibiotic by name (for external lookups)
  const getAntibioticByName = (name: string): Antibiotic | null | undefined => {
    if (!indexes) return null;
    return indexes.antibiotics.find((a: Antibiotic) => a.name === name);
  };

  // Find alternative antibiotics (same drug class or similar spectrum)
  const findAlternativeAntibiotics = (antibiotic: Antibiotic): Antibiotic[] => {
    if (!indexes || !antibiotic) return [];

    return indexes.antibiotics
      .filter((a: Antibiotic) => a.name !== antibiotic.name)
      .filter((a: Antibiotic) => {
        // Same drug class
        if (a.class === antibiotic.class) {
          return true;
        }

        // Shared conditions (similar spectrum)
        const sharedConditions = a.conditions.filter(c => antibiotic.conditions.includes(c));
        return sharedConditions.length > 0;
      })
      .sort((a: Antibiotic, b: Antibiotic) => {
        // Prioritize same drug class
        if (a.class === antibiotic.class && b.class !== antibiotic.class) return -1;
        if (b.class === antibiotic.class && a.class !== antibiotic.class) return 1;

        // Then sort by number of shared conditions
        const aShared = a.conditions.filter(c => antibiotic.conditions.includes(c)).length;
        const bShared = b.conditions.filter(c => antibiotic.conditions.includes(c)).length;
        return bShared - aShared;
      })
      .slice(0, 8); // Top 8 alternatives
  };

  // Find combination therapies involving this antibiotic
  const findCombinationTherapies = (antibiotic: Antibiotic): CombinationTherapy[] => {
    if (!indexes || !antibiotic) return [];

    // Find other antibiotics that appear in combination with this one
    const combinations = new Map<string, CombinationTherapy>();

    antibiotic.therapyContexts.forEach((context: string) => {
      const contextLower = context.toLowerCase();

      // Look for PLUS/+ indicators
      if (contextLower.includes('plus') || contextLower.includes(' + ')) {
        indexes.antibiotics.forEach((otherAntibiotic: Antibiotic) => {
          if (otherAntibiotic.name !== antibiotic.name &&
              contextLower.includes(otherAntibiotic.name.toLowerCase())) {
            if (!combinations.has(otherAntibiotic.name)) {
              combinations.set(otherAntibiotic.name, {
                antibiotic: otherAntibiotic,
                contexts: []
              });
            }
            combinations.get(otherAntibiotic.name)!.contexts.push(context);
          }
        });
      }
    });

    return Array.from(combinations.values());
  };

  // Get resistance information (based on therapy context patterns)
  const getResistanceInfo = (antibiotic: Antibiotic): string[] | null => {
    if (!indexes || !antibiotic) return null;

    const resistancePatterns: string[] = [];

    antibiotic.therapyContexts.forEach((context: string) => {
      const contextLower = context.toLowerCase();

      if (contextLower.includes('mrsa') && contextLower.includes(antibiotic.name.toLowerCase())) {
        resistancePatterns.push('Active against MRSA');
      }
      if (contextLower.includes('resistant') || contextLower.includes('resistance')) {
        resistancePatterns.push('Consider resistance patterns');
      }
      if (contextLower.includes('susceptible') || contextLower.includes('susceptibility')) {
        resistancePatterns.push('Requires susceptibility testing');
      }
    });

    return resistancePatterns.length > 0 ? Array.from(new Set(resistancePatterns)) : null;
  };

  return {
    // Data
    antibiotics,
    selectedAntibiotic,
    selectedAntibioticConditions,
    drugClassStats,
    availableDrugClasses,

    // Statistics
    antibioticStats,
    filteredStats,

    // Search state
    searchQuery,
    drugClassFilter,
    sortBy,

    // Actions
    searchAntibiotics: searchAntibioticsFunction,
    filterByDrugClass,
    setSortOrder,
    selectAntibiotic: selectAntibioticFn,
    clearSelection,
    clearFilters,

    // Utilities
    getAntibioticByName,
    findAlternativeAntibiotics,
    findCombinationTherapies,
    getResistanceInfo,

    // Loading state
    isLoading: !indexes
  };
};

export default useAntibioticData;
