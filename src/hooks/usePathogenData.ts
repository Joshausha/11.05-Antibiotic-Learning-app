/**
 * usePathogenData Hook
 * Custom hook for managing pathogen data, search, and condition lookup
 * Provides pathogen exploration functionality with filtering and cross-references
 */

import { useMemo, useState } from 'react';
import {
  buildIndexes,
  searchPathogens,
  getConditionsForPathogen,
  getAntibioticsForPathogen
} from '../utils/dataIndexer';
import { logDevError, logDevWarning, validatePathogenData } from '../utils/devErrorLogger';

/**
 * Type definitions for pathogen data management
 */

interface PathogenIndexes {
  pathogens: Array<{
    name: string;
    gramStatus: string;
    conditions: string[];
    [key: string]: any;
  }>;
  gramPositivePathogens: any[];
  gramNegativePathogens: any[];
  [key: string]: any;
}

interface PathogenStats {
  total: number;
  gramPositive: number;
  gramNegative: number;
  unknown: number;
  maxConditions: number;
  avgConditions: string | number;
}

interface FilteredStats {
  total: number;
  gramPositive: number;
  gramNegative: number;
  unknown: number;
}

interface Pathogen {
  name: string;
  gramStatus: string;
  conditions: string[];
  [key: string]: any;
}

interface UsePathogenDataReturn {
  // Data
  pathogens: Pathogen[];
  selectedPathogen: Pathogen | null;
  selectedPathogenConditions: any[];
  selectedPathogenAntibiotics: any[];
  indexes: PathogenIndexes | null;

  // Statistics
  pathogenStats: PathogenStats | null;
  filteredStats: FilteredStats;

  // Search state
  searchQuery: string;
  gramFilter: string;
  typeFilter: string;
  sortBy: string;

  // Actions
  searchPathogens: (query: string) => void;
  filterByGramStatus: (status: string) => void;
  filterByType: (type: string) => void;
  setSortOrder: (order: string) => void;
  selectPathogen: (pathogen: Pathogen) => void;
  clearSelection: () => void;
  clearFilters: () => void;

  // Utilities
  getPathogenByName: (name: string) => Pathogen | null | undefined;
  findSimilarPathogens: (pathogen: Pathogen) => Pathogen[];

  // Loading state
  isLoading: boolean;
}

/**
 * Custom hook for managing pathogen data with search and filtering
 * @param medicalConditions - Array of medical conditions
 * @returns Pathogen data and management utilities
 */
const usePathogenData = (medicalConditions: any[]): UsePathogenDataReturn => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [gramFilter, setGramFilter] = useState<string>('all'); // 'all', 'positive', 'negative'
  const [typeFilter, setTypeFilter] = useState<string>('all'); // 'all', 'bacteria', 'virus', 'fungus'
  const [sortBy, setSortBy] = useState<string>('name'); // 'name', 'count', 'conditions'
  const [selectedPathogen, setSelectedPathogen] = useState<Pathogen | null>(null);

  // Build indexes once when conditions data changes
  const indexes = useMemo<PathogenIndexes | null>(() => {
    if (!medicalConditions || medicalConditions.length === 0) {
      logDevWarning('No medical conditions data available for pathogen indexing', {
        conditionsLength: medicalConditions?.length ?? 0
      });
      return null;
    }

    try {
      const result = buildIndexes(medicalConditions) as any;

      // Validate indexes in development
      if (process.env.NODE_ENV === 'development' && result?.pathogens) {
        const issues: string[] = [];
        result.pathogens.slice(0, 5).forEach((pathogen: any) => {
          const pathogenIssues = validatePathogenData(pathogen);
          issues.push(...pathogenIssues);
        });
        if (issues.length > 0) {
          logDevWarning('Pathogen data validation issues (first 5 checked)', { issues });
        }
      }

      return result;
    } catch (error) {
      logDevError({
        file: 'usePathogenData.ts',
        operation: 'Building pathogen indexes',
        error,
        context: { conditionsCount: medicalConditions.length }
      });
      return null;
    }
  }, [medicalConditions]);

  // Get filtered and sorted pathogens
  const pathogens = useMemo<Pathogen[]>(() => {
    if (!indexes) return [];

    try {
      return searchPathogens(indexes as any, {
        query: searchQuery,
        gramStatus: gramFilter as any,
        pathogenType: typeFilter as any,
        sortBy: sortBy as any
      }) as any;
    } catch (error) {
      logDevError({
        file: 'usePathogenData.ts',
        operation: 'Searching/filtering pathogens',
        error,
        context: { searchQuery, gramFilter, typeFilter, sortBy }
      });
      return [];
    }
  }, [indexes, searchQuery, gramFilter, typeFilter, sortBy]);

  // Get conditions for selected pathogen
  const selectedPathogenConditions = useMemo<any[]>(() => {
    if (!indexes || !selectedPathogen) return [];
    return getConditionsForPathogen(indexes as any, selectedPathogen.name);
  }, [indexes, selectedPathogen]);

  // Get antibiotics for selected pathogen
  const selectedPathogenAntibiotics = useMemo<any[]>(() => {
    if (!indexes || !selectedPathogen) return [];
    return getAntibioticsForPathogen(indexes as any, selectedPathogen.name);
  }, [indexes, selectedPathogen]);

  // Get pathogen statistics
  const pathogenStats = useMemo<PathogenStats | null>(() => {
    if (!indexes) return null;

    const gramPositive = indexes.gramPositivePathogens.length;
    const gramNegative = indexes.gramNegativePathogens.length;
    const total = indexes.pathogens.length;

    // Calculate condition coverage
    const pathogenConditionCounts = indexes.pathogens.map((p: Pathogen) => p.conditions.length);
    const maxConditions = Math.max(...pathogenConditionCounts, 0);
    const avgConditions = pathogenConditionCounts.length > 0
      ? (pathogenConditionCounts.reduce((a, b) => a + b, 0) / pathogenConditionCounts.length).toFixed(1)
      : 0;

    return {
      total,
      gramPositive,
      gramNegative,
      unknown: total - gramPositive - gramNegative,
      maxConditions,
      avgConditions
    };
  }, [indexes]);

  // Get gram status distribution for filtered results
  const filteredStats = useMemo<FilteredStats>(() => {
    const gramPositiveCount = pathogens.filter(p => p.gramStatus === 'positive').length;
    const gramNegativeCount = pathogens.filter(p => p.gramStatus === 'negative').length;
    const unknownCount = pathogens.filter(p => p.gramStatus === 'unknown').length;

    return {
      total: pathogens.length,
      gramPositive: gramPositiveCount,
      gramNegative: gramNegativeCount,
      unknown: unknownCount
    };
  }, [pathogens]);

  // Search functions
  const setPathogenSearchQuery = (query: string): void => {
    setSearchQuery(query);
  };

  const filterByGramStatus = (status: string): void => {
    setGramFilter(status);
  };

  const filterByType = (type: string): void => {
    setTypeFilter(type);
  };

  const setSortOrder = (order: string): void => {
    setSortBy(order);
  };

  const selectPathogenFn = (pathogen: Pathogen): void => {
    setSelectedPathogen(pathogen);
  };

  const clearSelection = (): void => {
    setSelectedPathogen(null);
  };

  const clearFilters = (): void => {
    setSearchQuery('');
    setGramFilter('all');
    setTypeFilter('all');
    setSortBy('name');
  };

  // Get pathogen by name (for external lookups)
  const getPathogenByName = (name: string): Pathogen | null | undefined => {
    if (!indexes) return null;
    return indexes.pathogens.find((p: Pathogen) => p.name === name);
  };

  // Find similar pathogens (same gram status or conditions)
  const findSimilarPathogens = (pathogen: Pathogen): Pathogen[] => {
    if (!indexes || !pathogen) return [];

    return indexes.pathogens
      .filter((p: Pathogen) => p.name !== pathogen.name)
      .filter((p: Pathogen) => {
        // Same gram status
        if (p.gramStatus === pathogen.gramStatus && pathogen.gramStatus !== 'unknown') {
          return true;
        }

        // Shared conditions
        const sharedConditions = p.conditions.filter(c => pathogen.conditions.includes(c));
        return sharedConditions.length > 0;
      })
      .sort((a: Pathogen, b: Pathogen) => {
        // Sort by number of shared conditions
        const aShared = a.conditions.filter(c => pathogen.conditions.includes(c)).length;
        const bShared = b.conditions.filter(c => pathogen.conditions.includes(c)).length;
        return bShared - aShared;
      })
      .slice(0, 5); // Top 5 similar pathogens
  };

  return {
    // Data
    pathogens,
    selectedPathogen,
    selectedPathogenConditions,
    selectedPathogenAntibiotics,
    indexes,

    // Statistics
    pathogenStats,
    filteredStats,

    // Search state
    searchQuery,
    gramFilter,
    typeFilter,
    sortBy,

    // Actions
    searchPathogens: setPathogenSearchQuery,
    filterByGramStatus,
    filterByType,
    setSortOrder,
    selectPathogen: selectPathogenFn,
    clearSelection,
    clearFilters,

    // Utilities
    getPathogenByName,
    findSimilarPathogens,

    // Loading state
    isLoading: !indexes
  };
};

export default usePathogenData;
