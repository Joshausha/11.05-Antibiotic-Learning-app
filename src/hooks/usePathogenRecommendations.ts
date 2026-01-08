/**
 * usePathogenRecommendations Hook (Refactored)
 * Simplified recommendation engine focusing on core functionality
 * Uses extracted utilities and separate hooks for better maintainability
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  analyzeBehaviorPatterns,
  calculatePathogenRecommendations,
  generateLearningPath,
  categorizeRecommendations
} from '../utils/recommendationEngine';
import useUserSession from './useUserSession';

/**
 * Type definitions for recommendation system
 */

interface BehaviorAnalysis {
  [key: string]: any;
}

interface UserPreferences {
  [key: string]: any;
}

interface SessionStats {
  [key: string]: any;
}

interface Recommendation {
  [key: string]: any;
}

interface LearningPath {
  [key: string]: any;
}

interface UsePathogenRecommendationsReturn {
  // Core data
  recommendations: Recommendation[];
  learningPath: LearningPath[];
  userPreferences: UserPreferences;
  sessionStats: SessionStats;
  behaviorAnalysis: BehaviorAnalysis;

  // Actions
  recordInteraction: (interaction: any) => void;
  setUserPreferences: (preferences: UserPreferences) => void;
  refreshRecommendations: () => void;
  regenerateLearningPath: () => void;
  resetSession: () => void;

  // Derived data
  getRecommendationsByCategory: any;
}

interface PathogenIndexes {
  [key: string]: any;
}

interface SelectedPathogen {
  name: string;
  [key: string]: any;
}

/**
 * Custom hook for generating pathogen recommendations based on user behavior
 * @param indexes - Pathogen data indexes
 * @param selectedPathogen - Currently selected pathogen
 * @param userBehavior - User interaction history
 * @returns Recommendations and learning utilities
 */
const usePathogenRecommendations = (
  indexes: PathogenIndexes | null,
  selectedPathogen: SelectedPathogen | null,
  userBehavior: Record<string, any> = {}
): UsePathogenRecommendationsReturn => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPath[]>([]);

  // Use separate session management hook
  const {
    sessionStats,
    userPreferences,
    recordInteraction,
    resetSession,
    updatePreferences,
    setUserPreferences: setUserPreferencesFromSession
  } = useUserSession(indexes);

  // Analyze user behavior patterns (memoized for performance)
  const behaviorAnalysis = useMemo<BehaviorAnalysis>(() => {
    return analyzeBehaviorPatterns(userBehavior as any);
  }, [userBehavior]);

  // Calculate recommendations when dependencies change
  const calculateRecommendations = useCallback((): void => {
    if (!indexes || !selectedPathogen) {
      setRecommendations([]);
      return;
    }

    const newRecommendations = calculatePathogenRecommendations(
      indexes as any,
      selectedPathogen as any,
      behaviorAnalysis as any,
      userPreferences as any
    );

    setRecommendations(newRecommendations);
  }, [indexes, selectedPathogen, behaviorAnalysis, userPreferences]);

  // Generate learning path when dependencies change
  const regenerateLearningPath = useCallback((): void => {
    if (!indexes) {
      setLearningPath([]);
      return;
    }

    const newLearningPath = generateLearningPath(
      indexes as any,
      userPreferences as any,
      behaviorAnalysis as any
    );

    setLearningPath(newLearningPath);
  }, [indexes, userPreferences, behaviorAnalysis]);

  // Auto-calculate recommendations when selectedPathogen changes
  useEffect(() => {
    calculateRecommendations();
  }, [calculateRecommendations]);

  // Auto-generate learning path when preferences change
  useEffect(() => {
    regenerateLearningPath();
  }, [regenerateLearningPath]);

  // Categorize recommendations for UI display
  const getRecommendationsByCategory = useMemo(() => {
    return categorizeRecommendations(recommendations as any, selectedPathogen as any);
  }, [recommendations, selectedPathogen]);

  return {
    // Core data
    recommendations,
    learningPath,
    userPreferences,
    sessionStats,
    behaviorAnalysis,

    // Actions
    recordInteraction,
    setUserPreferences: updatePreferences,
    refreshRecommendations: calculateRecommendations,
    regenerateLearningPath,
    resetSession,

    // Derived data
    getRecommendationsByCategory
  };
};

export default usePathogenRecommendations;
