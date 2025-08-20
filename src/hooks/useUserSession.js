/**
 * useUserSession Hook
 * Manages user session statistics and interaction tracking
 * Extracted from usePathogenRecommendations for better separation of concerns
 */

import { useState, useCallback } from 'react';

const useUserSession = (indexes) => {
  const [sessionStats, setSessionStats] = useState({
    totalViewed: 0,
    averageTimePerPathogen: 0,
    preferredCategories: new Map(),
    gramStatusFocus: new Map(),
    explorationDepth: 0
  });

  const [userPreferences, setUserPreferences] = useState({
    systematicLearning: false,
    preferSimilarPathogens: true,
    includeRecentlyViewed: false,
    difficultyLevel: 'adaptive',
    focusAreas: []
  });

  /**
   * Records a user interaction with a pathogen
   */
  const recordInteraction = useCallback((pathogen, interactionType = 'view', timeSpent = 0) => {
    setSessionStats(prevStats => {
      const newStats = {
        ...prevStats,
        totalViewed: prevStats.totalViewed + 1,
        explorationDepth: prevStats.explorationDepth + 1
      };

      // Update average time per pathogen
      const totalTime = (prevStats.averageTimePerPathogen * prevStats.totalViewed) + timeSpent;
      newStats.averageTimePerPathogen = totalTime / newStats.totalViewed;

      // Update category preferences
      if (pathogen && pathogen.conditions && indexes && indexes.conditions) {
        pathogen.conditions.forEach(conditionId => {
          const condition = indexes.conditions.find(c => c.id === conditionId);
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
  const updatePreferences = useCallback((newPreferences) => {
    setUserPreferences(prev => ({
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
    setUserPreferences
  };
};

export default useUserSession;