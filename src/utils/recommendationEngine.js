/**
 * Recommendation Engine Utilities
 * Pure functions for calculating pathogen recommendations and behavior analysis
 * Extracted from usePathogenRecommendations hook for better separation of concerns
 */

/**
 * Analyzes user behavior patterns from interaction history
 */
export const analyzeBehaviorPatterns = (userBehavior) => {
  if (!userBehavior || !userBehavior.history || userBehavior.history.length === 0) {
    return {
      mostViewedCategories: [],
      gramStatusPreference: null,
      averageSessionLength: 0,
      explorationStyle: 'systematic',
      difficultyProgression: 'steady'
    };
  }

  const history = userBehavior.history;
  const categoryCount = new Map();
  const gramStatusCount = new Map();
  let totalSessionTime = 0;
  
  history.forEach(item => {
    // Count categories
    if (item.pathogen?.conditions) {
      item.pathogen.conditions.forEach(conditionId => {
        // This would need condition lookup logic
        const category = item.category || 'Unknown';
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      });
    }
    
    // Count gram status preferences
    if (item.pathogen?.gramStatus) {
      gramStatusCount.set(
        item.pathogen.gramStatus,
        (gramStatusCount.get(item.pathogen.gramStatus) || 0) + 1
      );
    }
    
    // Track session time
    totalSessionTime += item.timeSpent || 0;
  });

  // Determine exploration style
  const explorationStyle = determineExplorationStyle(history);
  
  return {
    mostViewedCategories: Array.from(categoryCount.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category),
    gramStatusPreference: Array.from(gramStatusCount.entries())
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null,
    averageSessionLength: totalSessionTime / history.length,
    explorationStyle,
    difficultyProgression: 'steady' // Could be enhanced based on patterns
  };
};

/**
 * Determines user's exploration style based on interaction patterns
 */
const determineExplorationStyle = (history) => {
  if (history.length < 3) return 'systematic';
  
  // Analyze pattern consistency
  const categories = history.map(item => item.pathogen?.category).filter(Boolean);
  const uniqueCategories = new Set(categories);
  
  if (uniqueCategories.size === 1) return 'focused';
  if (uniqueCategories.size / categories.length > 0.8) return 'random';
  return 'systematic';
};

/**
 * Calculates pathogen recommendations based on current selection and user behavior
 */
export const calculatePathogenRecommendations = (indexes, selectedPathogen, behaviorAnalysis, userPreferences) => {
  if (!indexes || !selectedPathogen) return [];

  const recommendations = [];
  
  // Get similar pathogens
  const similarPathogens = findSimilarPathogens(indexes, selectedPathogen);
  recommendations.push(...similarPathogens.map(pathogen => ({
    ...pathogen,
    reasoning: 'Similar pathogen characteristics',
    score: calculateSimilarityScore(pathogen, selectedPathogen),
    category: 'Similar'
  })));

  // Get recommendations based on user preferences
  if (behaviorAnalysis && behaviorAnalysis.mostViewedCategories && behaviorAnalysis.mostViewedCategories.length > 0) {
    const categoryRecommendations = findPathogensByCategories(
      indexes, 
      behaviorAnalysis.mostViewedCategories
    );
    recommendations.push(...categoryRecommendations.map(pathogen => ({
      ...pathogen,
      reasoning: 'Matches your learning interests',
      score: calculateUserRelevanceScore(pathogen, behaviorAnalysis),
      category: 'Your Interests'
    })));
  }

  // Add difficulty progression recommendations
  const nextLevelPathogens = findNextLevelPathogens(indexes, selectedPathogen);
  recommendations.push(...nextLevelPathogens.map(pathogen => ({
    ...pathogen,
    reasoning: 'Next difficulty level',
    score: calculateDifficultyScore(pathogen),
    category: 'Next Level'
  })));

  // Remove duplicates and sort by score
  const uniqueRecommendations = removeDuplicateRecommendations(recommendations);
  return uniqueRecommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 8); // Limit to top 8 recommendations
};

/**
 * Finds pathogens similar to the selected one
 */
const findSimilarPathogens = (indexes, selectedPathogen) => {
  if (!indexes.pathogens) return [];
  
  return indexes.pathogens
    .filter(pathogen => pathogen.name !== selectedPathogen.name)
    .filter(pathogen => {
      // Same gram status
      if (pathogen.gramStatus === selectedPathogen.gramStatus) return true;
      
      // Shared conditions
      const sharedConditions = pathogen.conditions?.filter(condition =>
        selectedPathogen.conditions?.includes(condition)
      ) || [];
      
      return sharedConditions.length > 0;
    })
    .slice(0, 4);
};

/**
 * Finds pathogens by user's preferred categories
 */
const findPathogensByCategories = (indexes, preferredCategories) => {
  if (!indexes.pathogens) return [];
  
  return indexes.pathogens.filter(pathogen => {
    // This would need proper category lookup
    return preferredCategories.some(category => 
      pathogen.category === category
    );
  }).slice(0, 3);
};

/**
 * Finds pathogens at the next difficulty level
 */
const findNextLevelPathogens = (indexes, selectedPathogen) => {
  if (!indexes.pathogens) return [];
  
  const currentComplexity = selectedPathogen.conditions?.length || 0;
  
  return indexes.pathogens
    .filter(pathogen => {
      const pathogenComplexity = pathogen.conditions?.length || 0;
      return pathogenComplexity > currentComplexity && 
             pathogenComplexity <= currentComplexity + 2;
    })
    .slice(0, 3);
};

/**
 * Calculates similarity score between two pathogens
 */
const calculateSimilarityScore = (pathogen1, pathogen2) => {
  let score = 0;
  
  // Gram status match
  if (pathogen1.gramStatus === pathogen2.gramStatus) score += 30;
  
  // Shared conditions
  const sharedConditions = pathogen1.conditions?.filter(condition =>
    pathogen2.conditions?.includes(condition)
  ) || [];
  score += sharedConditions.length * 20;
  
  // Morphology similarity (if available)
  if (pathogen1.morphology === pathogen2.morphology) score += 15;
  
  return Math.min(score, 100);
};

/**
 * Calculates user relevance score
 */
const calculateUserRelevanceScore = (pathogen, behaviorAnalysis) => {
  let score = 50; // Base score
  
  // Category preference match
  if (behaviorAnalysis.mostViewedCategories.includes(pathogen.category)) {
    score += 25;
  }
  
  // Gram status preference match
  if (pathogen.gramStatus === behaviorAnalysis.gramStatusPreference) {
    score += 20;
  }
  
  return Math.min(score, 100);
};

/**
 * Calculates difficulty score for progression
 */
const calculateDifficultyScore = (pathogen) => {
  const complexity = pathogen.conditions?.length || 0;
  return Math.min(complexity * 10, 100);
};

/**
 * Removes duplicate recommendations based on pathogen name
 */
const removeDuplicateRecommendations = (recommendations) => {
  const seen = new Set();
  return recommendations.filter(rec => {
    if (seen.has(rec.name)) return false;
    seen.add(rec.name);
    return true;
  });
};

/**
 * Generates a structured learning path
 */
export const generateLearningPath = (indexes, userPreferences, behaviorAnalysis) => {
  if (!indexes) return [];

  const learningPath = [];
  
  if (userPreferences && userPreferences.systematicLearning) {
    // Create systematic progression by gram status
    const gramPositive = indexes.pathogens?.filter(p => p.gramStatus === 'Positive') || [];
    const gramNegative = indexes.pathogens?.filter(p => p.gramStatus === 'Negative') || [];
    
    learningPath.push({
      section: 'Gram-Positive Bacteria',
      pathogens: gramPositive.slice(0, 5),
      reasoning: 'Systematic learning: Gram-positive organisms'
    });
    
    learningPath.push({
      section: 'Gram-Negative Bacteria', 
      pathogens: gramNegative.slice(0, 5),
      reasoning: 'Systematic learning: Gram-negative organisms'
    });
  } else {
    // Create interest-based learning path
    if (behaviorAnalysis && behaviorAnalysis.mostViewedCategories && behaviorAnalysis.mostViewedCategories.length > 0) {
      behaviorAnalysis.mostViewedCategories.forEach(category => {
        const categoryPathogens = findPathogensByCategories(indexes, [category]);
        if (categoryPathogens.length > 0) {
          learningPath.push({
            section: `${category} Focus`,
            pathogens: categoryPathogens,
            reasoning: `Based on your interest in ${category}`
          });
        }
      });
    }
  }
  
  return learningPath;
};

/**
 * Categorizes recommendations for better organization
 */
export const categorizeRecommendations = (recommendations, selectedPathogen) => {
  if (!recommendations || !Array.isArray(recommendations)) {
    return {
      'Similar': [],
      'Your Interests': [],
      'Next Level': [],
      'Recently Popular': [],
      'Discover': []
    };
  }
  
  const categorized = {
    'Similar': recommendations.filter(r => r.category === 'Similar'),
    'Your Interests': recommendations.filter(r => r.category === 'Your Interests'),
    'Next Level': recommendations.filter(r => r.category === 'Next Level'),
    'Recently Popular': recommendations.filter(r => r.category === 'Recently Popular'),
    'Discover': recommendations.filter(r => 
      !['Similar', 'Your Interests', 'Next Level', 'Recently Popular'].includes(r.category)
    )
  };

  // Filter out empty categories
  return Object.fromEntries(
    Object.entries(categorized).filter(([, recs]) => recs.length > 0)
  );
};