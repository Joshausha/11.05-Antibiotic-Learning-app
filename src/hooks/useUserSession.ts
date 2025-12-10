/**
 * useUserSession Hook
 * Manages user session statistics and interaction tracking
 * Extracted from usePathogenRecommendations for better separation of concerns
 */

import { useState, useCallback } from 'react';

/**
 * Type definitions for user session tracking
 */

interface SessionStats {
  totalViewed: number;
  averageTimePerPathogen: number;
  preferredCategories: Map<string, number>;
  gramStatusFocus: Map<string, number>;
  explorationDepth: number;
}

interface UserPreferences {
  systematicLearning: boolean;
  preferSimilarPathogens: boolean;
  includeRecentlyViewed: boolean;
  difficultyLevel: string;
  focusAreas: string[];
  [key: string]: any;
}

interface Pathogen {
  conditions?: string[];
  gramStatus?: string;
  [key: string]: any;
}

interface PathogenIndexes {
  conditions?: Array<{
    id: string;
    category: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

interface UseUserSessionReturn {
  sessionStats: SessionStats;
  userPreferences: UserPreferences;
  recordInteraction: (pathogen: Pathogen, interactionType?: string, timeSpent?: number) => void;
  resetSession: () => void;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  setUserPreferences: (newPreferences: Partial<UserPreferences>) => void;
}

const useUserSession = (indexes: PathogenIndexes | null): UseUserSessionReturn => {
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalViewed: 0,
    averageTimePerPathogen: 0,
    preferredCategories: new Map(),
    gramStatusFocus: new Map(),
    explorationDepth: 0
  });

  const [userPreferences, setUserPreferencesState] = useState<UserPreferences>({
    systematicLearning: false,
    preferSimilarPathogens: true,
    includeRecentlyViewed: false,
    difficultyLevel: 'adaptive',
    focusAreas: []
  });

  /**
   * Records a user interaction with a pathogen
   */
  const recordInteraction = useCallback((pathogen: Pathogen, interactionType: string = 'view', timeSpent: number = 0) => {
    setSessionStats(prevStats => {
      const newStats: SessionStats = {
        ...prevStats,
        totalViewed: prevStats.totalViewed + 1,
        explorationDepth: prevStats.explorationDepth + 1,
        preferredCategories: new Map(prevStats.preferredCategories),
        gramStatusFocus: new Map(prevStats.gramStatusFocus)
      };

      // Update average time per pathogen
      const totalTime = (prevStats.averageTimePerPathogen * prevStats.totalViewed) + timeSpent;
      newStats.averageTimePerPathogen = totalTime / newStats.totalViewed;

      // Update category preferences
      if (pathogen && pathogen.conditions && indexes && indexes.conditions) {
        pathogen.conditions.forEach(conditionId => {
          const condition = indexes.conditions!.find(c => c.id === conditionId);
          if (condition) {
            const currentCount = newStats.preferredCategories.get(condition.category) || 0;
            newStats.preferredCategories.set(condition.category, currentCount + 1);
          }
        });
      }

      // Update gram status preferences
      if (pathogen && pathogen.gramStatus) {
        const currentCount = newStats.gramStatusFocus.get(pathogen.gramStatus) || 0;
        newStats.gramStatusFocus.set(pathogen.gramStatus, currentCount + 1);
      }

      return newStats;
    });
  }, [indexes]);

  /**
   * Resets session statistics
   */
  const resetSession = useCallback(() => {
    setSessionStats({
      totalViewed: 0,
      averageTimePerPathogen: 0,
      preferredCategories: new Map(),
      gramStatusFocus: new Map(),
      explorationDepth: 0
    });
  }, []);

  /**
   * Updates user preferences
   */
  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setUserPreferencesState(prev => ({
      ...prev,
      ...newPreferences
    }));
  }, []);

  return {
    sessionStats,
    userPreferences,
    recordInteraction,
    resetSession,
    updatePreferences,
    setUserPreferences: updatePreferences
  };
};

export default useUserSession;
