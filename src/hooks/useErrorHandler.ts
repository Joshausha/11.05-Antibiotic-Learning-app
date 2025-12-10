import { useCallback } from 'react';

/**
 * Type definitions for error handling
 */

interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  improvementTrend: string;
  strongestCategory: string;
  weakestCategory: string;
  streakLength: number;
}

interface QuizProgressFallback {
  stats: QuizStats;
  recentQuizzes: any[];
  clearHistory: () => void;
  submitQuiz: () => void;
  getDetailedStats: () => Record<string, any>;
}

interface BookmarksFallback {
  bookmarkedConditions: any[];
  isBookmarked: () => boolean;
  toggleBookmark: () => void;
}

interface PathogenDataFallback {
  pathogens: any[];
  selectedPathogen: any;
  selectedPathogenConditions: any[];
  selectedPathogenAntibiotics: any[];
  pathogenStats: any;
  filteredStats: any;
  searchQuery: string;
  gramFilter: string;
  typeFilter: string;
  sortBy: string;
  searchPathogens: () => void;
  filterByGramStatus: () => void;
  filterByType: () => void;
  setSortOrder: () => void;
  selectPathogen: () => void;
  clearSelection: () => void;
  clearFilters: () => void;
  findSimilarPathogens: () => any[];
  isLoading: boolean;
}

interface AntibioticDataFallback {
  antibiotics: any[];
  selectedAntibiotic: any;
  selectedAntibioticConditions: any[];
  drugClassStats: any[];
  availableDrugClasses: any[];
  antibioticStats: any;
  filteredStats: any;
  searchQuery: string;
  drugClassFilter: string;
  sortBy: string;
  searchAntibiotics: () => void;
  filterByDrugClass: () => void;
  setSortOrder: () => void;
  selectAntibiotic: () => void;
  clearSelection: () => void;
  clearFilters: () => void;
  getAntibioticByName: () => null;
  findAlternativeAntibiotics: () => any[];
  findCombinationTherapies: () => any[];
  getResistanceInfo: () => null;
  isLoading: boolean;
}

interface SearchDataFallback {
  searchTerm: string;
  setSearchTerm: () => void;
  filteredItems: any[];
}

interface ErrorHandlerFallbacks {
  quizProgress: QuizProgressFallback;
  bookmarks: BookmarksFallback;
  pathogenData: PathogenDataFallback;
  antibioticData: AntibioticDataFallback;
  searchData: (items?: any[]) => SearchDataFallback;
}

interface UseErrorHandlerReturn {
  safeExecute: <T>(fn: () => T, fallback: T, context?: string) => T;
  withErrorHandling: <T>(hook: () => T, fallback: T, hookName?: string) => T;
  fallbacks: ErrorHandlerFallbacks;
}

/**
 * Custom hook for centralized error handling
 * Provides consistent error handling patterns across the application
 */
const useErrorHandler = (): UseErrorHandlerReturn => {
  /**
   * Safely executes a function and returns either the result or a fallback value
   * @param fn - Function to execute
   * @param fallback - Fallback value if function fails
   * @param context - Context information for logging
   * @returns Function result or fallback value
   */
  const safeExecute = useCallback(<T>(fn: () => T, fallback: T, context: string = 'unknown'): T => {
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
   * @param hook - Hook function to wrap
   * @param fallback - Fallback value if hook fails
   * @param hookName - Name of the hook for logging
   * @returns Hook result or fallback value
   */
  const withErrorHandling = useCallback(<T>(hook: () => T, fallback: T, hookName?: string): T => {
    return safeExecute(hook, fallback, hookName);
  }, [safeExecute]);

  /**
   * Default fallback objects for common hook patterns
   */
  const fallbacks: ErrorHandlerFallbacks = {
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

    searchData: (items: any[] = []): SearchDataFallback => ({
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
