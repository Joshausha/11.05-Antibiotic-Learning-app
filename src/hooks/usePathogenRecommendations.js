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

const usePathogenRecommendations = (indexes, selectedPathogen, userBehavior = {}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [learningPath, setLearningPath] = useState([]);

  // Use separate session management hook
  const {
    sessionStats,
    userPreferences,
    recordInteraction,
    resetSession,
    updatePreferences,
    setUserPreferences
  } = useUserSession(indexes);

  // Analyze user behavior patterns (memoized for performance)
  const behaviorAnalysis = useMemo(() => {
    return analyzeBehaviorPatterns(userBehavior);
  }, [userBehavior]);

  // Calculate recommendations when dependencies change
  const calculateRecommendations = useCallback(() => {
    if (!indexes || !selectedPathogen) {
      setRecommendations([]);
      return;
    }

    const newRecommendations = calculatePathogenRecommendations(
      indexes,
      selectedPathogen,
      behaviorAnalysis,
      userPreferences
    );
    
    setRecommendations(newRecommendations);
  }, [indexes, selectedPathogen, behaviorAnalysis, userPreferences]);

  // Generate learning path when dependencies change
  const regenerateLearningPath = useCallback(() => {
    if (!indexes) {
      setLearningPath([]);
      return;
    }

    const newLearningPath = generateLearningPath(
      indexes,
      userPreferences,
      behaviorAnalysis
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
    return categorizeRecommendations(recommendations, selectedPathogen);
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