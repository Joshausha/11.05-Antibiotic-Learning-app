import { useCallback } from 'react';

/**
 * Custom hook for centralized error handling
 * Provides consistent error handling patterns across the application
 */
const useErrorHandler = () => {
  /**
   * Safely executes a function and returns either the result or a fallback value
   * @param {Function} fn - Function to execute
   * @param {*} fallback - Fallback value if function fails
   * @param {string} context - Context information for logging
   * @returns {*} Function result or fallback value
   */
  const safeExecute = useCallback((fn, fallback, context = 'unknown') => {
    try {
      const result = fn();
      return result;
    } catch (error) {
      console.error(`❌ ${context} hook failed:`, error);
      return fallback;
    }
  }, []);

  /**
   * Creates a safe version of a hook with error handling
   * @param {Function} hook - Hook function to wrap
   * @param {*} fallback - Fallback value if hook fails
   * @param {string} hookName - Name of the hook for logging
   * @returns {*} Hook result or fallback value
   */
  const withErrorHandling = useCallback((hook, fallback, hookName) => {
    return safeExecute(hook, fallback, hookName);
  }, [safeExecute]);

  /**
   * Default fallback objects for common hook patterns
   */
  const fallbacks = {
    quizProgress: {
      stats: {
        totalQuizzes: 0,
        averageScore: 0,
        improvementTrend: 'insufficient',
        strongestCategory: 'None',
        weakestCategory: 'None',
        streakLength: 0
      },
      recentQuizzes: [],
      clearHistory: () => {},
      submitQuiz: () => {},
      getDetailedStats: () => ({})
    },
    
    bookmarks: {
      bookmarkedConditions: [],
      isBookmarked: () => false,
      toggleBookmark: () => {}
    },
    
    pathogenData: {
      pathogens: [],
      selectedPathogen: null,
      selectedPathogenConditions: [],
      selectedPathogenAntibiotics: [],
      pathogenStats: null,
      filteredStats: null,
      searchQuery: '',
      gramFilter: 'all',
      typeFilter: 'all',
      sortBy: 'name',
      searchPathogens: () => {},
      filterByGramStatus: () => {},
      filterByType: () => {},
      setSortOrder: () => {},
      selectPathogen: () => {},
      clearSelection: () => {},
      clearFilters: () => {},
      findSimilarPathogens: () => [],
      isLoading: false
    },
    
    antibioticData: {
      antibiotics: [],
      selectedAntibiotic: null,
      selectedAntibioticConditions: [],
      drugClassStats: [],
      availableDrugClasses: [],
      antibioticStats: null,
      filteredStats: null,
      searchQuery: '',
      drugClassFilter: 'all',
      sortBy: 'name',
      searchAntibiotics: () => {},
      filterByDrugClass: () => {},
      setSortOrder: () => {},
      selectAntibiotic: () => {},
      clearSelection: () => {},
      clearFilters: () => {},
      getAntibioticByName: () => null,
      findAlternativeAntibiotics: () => [],
      findCombinationTherapies: () => [],
      getResistanceInfo: () => null,
      isLoading: false
    },
    
    searchData: (items = []) => ({
      searchTerm: '',
      setSearchTerm: () => {},
      filteredItems: items
    })
  };

  return {
    safeExecute,
    withErrorHandling,
    fallbacks
  };
};

export default useErrorHandler;