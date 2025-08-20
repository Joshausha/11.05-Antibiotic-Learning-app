/**
 * usePathogenData Hook
 * Custom hook for managing pathogen data, search, and condition lookup
 * Provides pathogen exploration functionality with filtering and cross-references
 */

import { useMemo, useState } from 'react';
import { buildIndexes, searchPathogens, getConditionsForPathogen, getAntibioticsForPathogen } from '../utils/dataIndexer';

const usePathogenData = (medicalConditions) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gramFilter, setGramFilter] = useState('all'); // 'all', 'positive', 'negative'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'bacteria', 'virus', 'fungus'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'count', 'conditions'
  const [selectedPathogen, setSelectedPathogen] = useState(null);

  // Build indexes once when conditions data changes
  const indexes = useMemo(() => {
    if (!medicalConditions || medicalConditions.length === 0) {
      return null;
    }
    return buildIndexes(medicalConditions);
  }, [medicalConditions]);

  // Get filtered and sorted pathogens
  const pathogens = useMemo(() => {
    if (!indexes) return [];
    
    return searchPathogens(indexes, {
      query: searchQuery,
      gramStatus: gramFilter,
      pathogenType: typeFilter,
      sortBy: sortBy
    });
  }, [indexes, searchQuery, gramFilter, typeFilter, sortBy]);

  // Get conditions for selected pathogen
  const selectedPathogenConditions = useMemo(() => {
    if (!indexes || !selectedPathogen) return [];
    return getConditionsForPathogen(indexes, selectedPathogen.name);
  }, [indexes, selectedPathogen]);

  // Get antibiotics for selected pathogen
  const selectedPathogenAntibiotics = useMemo(() => {
    if (!indexes || !selectedPathogen) return [];
    return getAntibioticsForPathogen(indexes, selectedPathogen.name);
  }, [indexes, selectedPathogen]);

  // Get pathogen statistics
  const pathogenStats = useMemo(() => {
    if (!indexes) return null;
    
    const gramPositive = indexes.gramPositivePathogens.length;
    const gramNegative = indexes.gramNegativePathogens.length;
    const total = indexes.pathogens.length;
    
    // Calculate condition coverage
    const pathogenConditionCounts = indexes.pathogens.map(p => p.conditions.length);
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
  const filteredStats = useMemo(() => {
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
  const setPathogenSearchQuery = (query) => {
    setSearchQuery(query);
  };

  const filterByGramStatus = (status) => {
    setGramFilter(status);
  };

  const filterByType = (type) => {
    setTypeFilter(type);
  };

  const setSortOrder = (order) => {
    setSortBy(order);
  };

  const selectPathogen = (pathogen) => {
    setSelectedPathogen(pathogen);
  };

  const clearSelection = () => {
    setSelectedPathogen(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setGramFilter('all');
    setTypeFilter('all');
    setSortBy('name');
  };

  // Get pathogen by name (for external lookups)
  const getPathogenByName = (name) => {
    if (!indexes) return null;
    return indexes.pathogens.find(p => p.name === name);
  };

  // Find similar pathogens (same gram status or conditions)
  const findSimilarPathogens = (pathogen) => {
    if (!indexes || !pathogen) return [];
    
    return indexes.pathogens
      .filter(p => p.name !== pathogen.name)
      .filter(p => {
        // Same gram status
        if (p.gramStatus === pathogen.gramStatus && pathogen.gramStatus !== 'unknown') {
          return true;
        }
        
        // Shared conditions
        const sharedConditions = p.conditions.filter(c => pathogen.conditions.includes(c));
        return sharedConditions.length > 0;
      })
      .sort((a, b) => {
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
    selectPathogen,
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