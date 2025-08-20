/**
 * useAntibioticData Hook
 * Custom hook for managing antibiotic data, search, and condition lookup
 * Provides antibiotic exploration functionality with drug class filtering and cross-references
 */

import { useMemo, useState } from 'react';
import { buildIndexes, searchAntibiotics, getConditionsForAntibiotic, getDrugClassStats, findCombinationTherapyConditions } from '../utils/dataIndexer';

const useAntibioticData = (medicalConditions) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [drugClassFilter, setDrugClassFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'count', 'conditions', 'class'
  const [selectedAntibiotic, setSelectedAntibiotic] = useState(null);

  // Build indexes once when conditions data changes
  const indexes = useMemo(() => {
    if (!medicalConditions || medicalConditions.length === 0) {
      return null;
    }
    return buildIndexes(medicalConditions);
  }, [medicalConditions]);

  // Get filtered and sorted antibiotics
  const antibiotics = useMemo(() => {
    if (!indexes) return [];
    
    return searchAntibiotics(indexes, {
      query: searchQuery,
      drugClass: drugClassFilter,
      sortBy: sortBy
    });
  }, [indexes, searchQuery, drugClassFilter, sortBy]);

  // Get conditions for selected antibiotic
  const selectedAntibioticConditions = useMemo(() => {
    if (!indexes || !selectedAntibiotic) return [];
    return getConditionsForAntibiotic(indexes, selectedAntibiotic.name);
  }, [indexes, selectedAntibiotic]);

  // Get drug class statistics
  const drugClassStats = useMemo(() => {
    if (!indexes) return [];
    return getDrugClassStats(indexes);
  }, [indexes]);

  // Get available drug classes for filtering
  const availableDrugClasses = useMemo(() => {
    if (!indexes) return [];
    return Array.from(indexes.drugClassToAntibiotics.keys()).sort();
  }, [indexes]);

  // Get antibiotic statistics
  const antibioticStats = useMemo(() => {
    if (!indexes) return null;
    
    const total = indexes.antibiotics.length;
    const conditionCounts = indexes.antibiotics.map(a => a.conditions.length);
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
  const filteredStats = useMemo(() => {
    const drugClassCounts = {};
    antibiotics.forEach(antibiotic => {
      drugClassCounts[antibiotic.class] = (drugClassCounts[antibiotic.class] || 0) + 1;
    });
    
    return {
      total: antibiotics.length,
      byDrugClass: drugClassCounts
    };
  }, [antibiotics]);

  // Search and filter functions
  const searchAntibioticsFunction = (query) => {
    setSearchQuery(query);
  };

  const filterByDrugClass = (drugClass) => {
    setDrugClassFilter(drugClass);
  };

  const setSortOrder = (order) => {
    setSortBy(order);
  };

  const selectAntibiotic = (antibiotic) => {
    setSelectedAntibiotic(antibiotic);
  };

  const clearSelection = () => {
    setSelectedAntibiotic(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDrugClassFilter('all');
    setSortBy('name');
  };

  // Get antibiotic by name (for external lookups)
  const getAntibioticByName = (name) => {
    if (!indexes) return null;
    return indexes.antibiotics.find(a => a.name === name);
  };

  // Find alternative antibiotics (same drug class or similar spectrum)
  const findAlternativeAntibiotics = (antibiotic) => {
    if (!indexes || !antibiotic) return [];
    
    return indexes.antibiotics
      .filter(a => a.name !== antibiotic.name)
      .filter(a => {
        // Same drug class
        if (a.class === antibiotic.class) {
          return true;
        }
        
        // Shared conditions (similar spectrum)
        const sharedConditions = a.conditions.filter(c => antibiotic.conditions.includes(c));
        return sharedConditions.length > 0;
      })
      .sort((a, b) => {
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
  const findCombinationTherapies = (antibiotic) => {
    if (!indexes || !antibiotic) return [];
    
    // Find other antibiotics that appear in combination with this one
    const combinations = new Map();
    
    antibiotic.therapyContexts.forEach(context => {
      const contextLower = context.toLowerCase();
      
      // Look for PLUS/+ indicators
      if (contextLower.includes('plus') || contextLower.includes(' + ')) {
        indexes.antibiotics.forEach(otherAntibiotic => {
          if (otherAntibiotic.name !== antibiotic.name && 
              contextLower.includes(otherAntibiotic.name.toLowerCase())) {
            if (!combinations.has(otherAntibiotic.name)) {
              combinations.set(otherAntibiotic.name, {
                antibiotic: otherAntibiotic,
                contexts: []
              });
            }
            combinations.get(otherAntibiotic.name).contexts.push(context);
          }
        });
      }
    });
    
    return Array.from(combinations.values());
  };

  // Get resistance information (based on therapy context patterns)
  const getResistanceInfo = (antibiotic) => {
    if (!indexes || !antibiotic) return null;
    
    const resistancePatterns = [];
    
    antibiotic.therapyContexts.forEach(context => {
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
    selectAntibiotic,
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