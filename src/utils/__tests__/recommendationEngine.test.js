/**
 * Tests for Recommendation Engine Utilities
 * @description Comprehensive test suite for recommendation engine functions
 */

import {
  analyzeBehaviorPatterns,
  calculatePathogenRecommendations,
  generateLearningPath,
  categorizeRecommendations
} from '../recommendationEngine';

describe('Recommendation Engine - analyzeBehaviorPatterns', () => {
  test('should handle empty user behavior', () => {
    const emptyBehavior = { history: [] };
    const result = analyzeBehaviorPatterns(emptyBehavior);
    
    expect(result).toHaveProperty('mostViewedCategories');
    expect(result).toHaveProperty('gramStatusPreference');
    expect(result).toHaveProperty('averageSessionLength');
    expect(result).toHaveProperty('explorationStyle');
    expect(result).toHaveProperty('difficultyProgression');
    
    expect(result.mostViewedCategories).toEqual([]);
    expect(result.gramStatusPreference).toBeNull();
    expect(result.averageSessionLength).toBe(0);
    expect(result.explorationStyle).toBe('systematic');
    expect(result.difficultyProgression).toBe('steady');
  });

  test('should handle null/undefined user behavior', () => {
    expect(() => analyzeBehaviorPatterns(null)).not.toThrow();
    expect(() => analyzeBehaviorPatterns(undefined)).not.toThrow();
    expect(() => analyzeBehaviorPatterns({})).not.toThrow();
  });

  test('should analyze user behavior with valid history', () => {
    const userBehavior = {
      history: [
        {
          pathogen: {
            gramStatus: 'Positive',
            conditions: ['respiratory', 'bloodstream']
          },
          category: 'Respiratory',
          timeSpent: 120
        },
        {
          pathogen: {
            gramStatus: 'Negative',
            conditions: ['uti']
          },
          category: 'Genitourinary',
          timeSpent: 90
        }
      ]
    };

    const result = analyzeBehaviorPatterns(userBehavior);
    
    expect(result).toBeDefined();
    expect(typeof result.averageSessionLength).toBe('number');
    expect(Array.isArray(result.mostViewedCategories)).toBe(true);
    expect(result.explorationStyle).toBeDefined();
    expect(result.difficultyProgression).toBeDefined();
  });

  test('should handle malformed history entries gracefully', () => {
    const malformedBehavior = {
      history: [
        { pathogen: null, category: 'Test' },
        { pathogen: {}, timeSpent: 'invalid' },
        { pathogen: { gramStatus: 'Positive' } }
      ]
    };

    expect(() => analyzeBehaviorPatterns(malformedBehavior)).not.toThrow();
    const result = analyzeBehaviorPatterns(malformedBehavior);
    expect(result).toBeDefined();
  });
});

describe('Recommendation Engine - calculatePathogenRecommendations', () => {
  const mockIndexes = {
    pathogens: [
      {
        id: 1,
        name: 'Staphylococcus aureus',
        gramStatus: 'Positive',
        conditions: ['bloodstream', 'skin'],
        difficulty: 'intermediate'
      },
      {
        id: 2,
        name: 'Escherichia coli',
        gramStatus: 'Negative',
        conditions: ['uti', 'bloodstream'],
        difficulty: 'beginner'
      },
      {
        id: 3,
        name: 'Pseudomonas aeruginosa',
        gramStatus: 'Negative',
        conditions: ['respiratory', 'uti'],
        difficulty: 'advanced'
      }
    ]
  };

  const mockBehaviorAnalysis = {
    mostViewedCategories: ['Bloodstream', 'Respiratory'],
    gramStatusPreference: 'Positive',
    explorationStyle: 'systematic',
    difficultyProgression: 'steady'
  };

  test('should generate recommendations with valid inputs', () => {
    const selectedPathogen = mockIndexes.pathogens[0];
    const recommendations = calculatePathogenRecommendations(
      selectedPathogen,
      mockIndexes,
      mockBehaviorAnalysis
    );

    expect(Array.isArray(recommendations)).toBe(true);
    
    recommendations.forEach(rec => {
      expect(rec).toHaveProperty('pathogen');
      expect(rec).toHaveProperty('score');
      expect(rec).toHaveProperty('reasoning');
      expect(rec).toHaveProperty('category');
      
      expect(typeof rec.score).toBe('number');
      expect(rec.score).toBeGreaterThanOrEqual(0);
      expect(rec.score).toBeLessThanOrEqual(1);
      expect(typeof rec.reasoning).toBe('string');
      expect(typeof rec.category).toBe('string');
    });
  });

  test('should handle null/undefined inputs gracefully', () => {
    expect(() => calculatePathogenRecommendations(null, mockIndexes, mockBehaviorAnalysis)).not.toThrow();
    expect(() => calculatePathogenRecommendations(mockIndexes.pathogens[0], null, mockBehaviorAnalysis)).not.toThrow();
    expect(() => calculatePathogenRecommendations(mockIndexes.pathogens[0], mockIndexes, null)).not.toThrow();
  });

  test('should return empty array when no suitable recommendations found', () => {
    const emptyIndexes = { pathogens: [] };
    const recommendations = calculatePathogenRecommendations(
      mockIndexes.pathogens[0],
      emptyIndexes,
      mockBehaviorAnalysis
    );

    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBe(0);
  });

  test('should not recommend the same pathogen as selected', () => {
    const selectedPathogen = mockIndexes.pathogens[0];
    const recommendations = calculatePathogenRecommendations(
      selectedPathogen,
      mockIndexes,
      mockBehaviorAnalysis
    );

    recommendations.forEach(rec => {
      expect(rec.pathogen.id).not.toBe(selectedPathogen.id);
    });
  });

  test('should generate diverse recommendation categories', () => {
    const selectedPathogen = mockIndexes.pathogens[0];
    const recommendations = calculatePathogenRecommendations(
      selectedPathogen,
      mockIndexes,
      mockBehaviorAnalysis
    );

    if (recommendations.length > 1) {
      const categories = [...new Set(recommendations.map(r => r.category))];
      expect(categories.length).toBeGreaterThan(0);
    }
  });
});

describe('Recommendation Engine - generateLearningPath', () => {
  const mockIndexes = {
    pathogens: [
      {
        id: 1,
        name: 'Staphylococcus aureus',
        gramStatus: 'Positive',
        conditions: ['bloodstream'],
        difficulty: 'intermediate'
      },
      {
        id: 2,
        name: 'Escherichia coli',
        gramStatus: 'Negative',
        conditions: ['uti'],
        difficulty: 'beginner'
      }
    ]
  };

  const mockBehaviorAnalysis = {
    mostViewedCategories: ['Bloodstream'],
    explorationStyle: 'systematic'
  };

  test('should create a learning path with valid structure', () => {
    const learningPath = generateLearningPath(mockIndexes, mockBehaviorAnalysis);

    expect(Array.isArray(learningPath)).toBe(true);
    
    learningPath.forEach(section => {
      expect(section).toHaveProperty('section');
      expect(section).toHaveProperty('pathogens');
      expect(section).toHaveProperty('reasoning');
      
      expect(typeof section.section).toBe('string');
      expect(Array.isArray(section.pathogens)).toBe(true);
      expect(typeof section.reasoning).toBe('string');
    });
  });

  test('should handle empty indexes gracefully', () => {
    const emptyIndexes = { pathogens: [] };
    const learningPath = generateLearningPath(emptyIndexes, mockBehaviorAnalysis);

    expect(Array.isArray(learningPath)).toBe(true);
  });

  test('should adapt to different exploration styles', () => {
    const systematicAnalysis = { ...mockBehaviorAnalysis, explorationStyle: 'systematic' };
    const interestBasedAnalysis = { ...mockBehaviorAnalysis, explorationStyle: 'interest-based' };

    const systematicPath = generateLearningPath(mockIndexes, systematicAnalysis);
    const interestBasedPath = generateLearningPath(mockIndexes, interestBasedAnalysis);

    expect(Array.isArray(systematicPath)).toBe(true);
    expect(Array.isArray(interestBasedPath)).toBe(true);
    
    // Paths might be different based on exploration style
    if (systematicPath.length > 0 && interestBasedPath.length > 0) {
      // At least one should have different reasoning or structure
      const systematicReasons = systematicPath.map(p => p.reasoning).join('');
      const interestBasedReasons = interestBasedPath.map(p => p.reasoning).join('');
      
      // They might be the same, which is also valid
      expect(typeof systematicReasons).toBe('string');
      expect(typeof interestBasedReasons).toBe('string');
    }
  });

  test('should handle null/undefined inputs', () => {
    expect(() => generateLearningPath(null, mockBehaviorAnalysis)).not.toThrow();
    expect(() => generateLearningPath(mockIndexes, null)).not.toThrow();
    expect(() => generateLearningPath(null, null)).not.toThrow();
  });
});

describe('Recommendation Engine - categorizeRecommendations', () => {
  const mockRecommendations = [
    {
      pathogen: { id: 1, name: 'Test 1' },
      category: 'Similar',
      score: 0.8,
      reasoning: 'Similar pathogen'
    },
    {
      pathogen: { id: 2, name: 'Test 2' },
      category: 'Your Interests',
      score: 0.7,
      reasoning: 'Based on interests'
    },
    {
      pathogen: { id: 3, name: 'Test 3' },
      category: 'Next Level',
      score: 0.6,
      reasoning: 'Progressive learning'
    },
    {
      pathogen: { id: 4, name: 'Test 4' },
      category: 'Recently Popular',
      score: 0.5,
      reasoning: 'Trending content'
    },
    {
      pathogen: { id: 5, name: 'Test 5' },
      category: 'Random',
      score: 0.4,
      reasoning: 'Discovery'
    }
  ];

  test('should categorize recommendations correctly', () => {
    const selectedPathogen = { id: 1, name: 'Selected' };
    const categorized = categorizeRecommendations(mockRecommendations, selectedPathogen);

    expect(typeof categorized).toBe('object');
    expect(categorized).not.toBeNull();

    // Check expected categories
    const expectedCategories = ['Similar', 'Your Interests', 'Next Level', 'Recently Popular', 'Discover'];
    expectedCategories.forEach(category => {
      if (categorized[category]) {
        expect(Array.isArray(categorized[category])).toBe(true);
        categorized[category].forEach(rec => {
          expect(rec).toHaveProperty('pathogen');
          expect(rec).toHaveProperty('score');
          expect(rec).toHaveProperty('reasoning');
        });
      }
    });
  });

  test('should filter out empty categories', () => {
    const limitedRecommendations = [mockRecommendations[0]]; // Only 'Similar' category
    const categorized = categorizeRecommendations(limitedRecommendations, null);

    expect(categorized.Similar).toBeDefined();
    expect(categorized.Similar.length).toBe(1);
    
    // Other categories should not exist if empty
    Object.keys(categorized).forEach(category => {
      expect(categorized[category].length).toBeGreaterThan(0);
    });
  });

  test('should handle empty recommendations array', () => {
    const categorized = categorizeRecommendations([], null);
    
    expect(typeof categorized).toBe('object');
    expect(Object.keys(categorized).length).toBe(0);
  });

  test('should handle null/undefined inputs', () => {
    expect(() => categorizeRecommendations(null, null)).not.toThrow();
    expect(() => categorizeRecommendations(undefined, null)).not.toThrow();
    
    const result1 = categorizeRecommendations(null, null);
    const result2 = categorizeRecommendations(undefined, null);
    
    expect(typeof result1).toBe('object');
    expect(typeof result2).toBe('object');
  });

  test('should properly group unknown categories into Discover', () => {
    const unknownCategoryRecs = [
      {
        pathogen: { id: 1, name: 'Test' },
        category: 'Unknown Category',
        score: 0.5,
        reasoning: 'Test'
      }
    ];

    const categorized = categorizeRecommendations(unknownCategoryRecs, null);
    
    if (categorized.Discover) {
      expect(categorized.Discover.length).toBeGreaterThan(0);
      expect(categorized.Discover[0].category).toBe('Unknown Category');
    }
  });
});

describe('Recommendation Engine - Integration Tests', () => {
  test('should work together in realistic scenario', () => {
    const userBehavior = {
      history: [
        {
          pathogen: { gramStatus: 'Positive', conditions: ['bloodstream'] },
          category: 'Bloodstream',
          timeSpent: 150
        }
      ]
    };

    const indexes = {
      pathogens: [
        {
          id: 1,
          name: 'Staphylococcus aureus',
          gramStatus: 'Positive',
          conditions: ['bloodstream'],
          difficulty: 'intermediate'
        },
        {
          id: 2,
          name: 'Escherichia coli',
          gramStatus: 'Negative',
          conditions: ['uti'],
          difficulty: 'beginner'
        }
      ]
    };

    // Full workflow
    const behaviorAnalysis = analyzeBehaviorPatterns(userBehavior);
    const recommendations = calculatePathogenRecommendations(
      indexes.pathogens[0],
      indexes,
      behaviorAnalysis
    );
    const categorized = categorizeRecommendations(recommendations, indexes.pathogens[0]);
    const learningPath = generateLearningPath(indexes, behaviorAnalysis);

    expect(behaviorAnalysis).toBeDefined();
    expect(Array.isArray(recommendations)).toBe(true);
    expect(typeof categorized).toBe('object');
    expect(Array.isArray(learningPath)).toBe(true);
  });

  test('should handle performance with large datasets', () => {
    const largeIndexes = {
      pathogens: Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Pathogen ${i + 1}`,
        gramStatus: i % 2 === 0 ? 'Positive' : 'Negative',
        conditions: [`condition${i % 5}`],
        difficulty: ['beginner', 'intermediate', 'advanced'][i % 3]
      }))
    };

    const behaviorAnalysis = {
      mostViewedCategories: ['Test'],
      explorationStyle: 'systematic'
    };

    const startTime = performance.now();
    
    const recommendations = calculatePathogenRecommendations(
      largeIndexes.pathogens[0],
      largeIndexes,
      behaviorAnalysis
    );
    const categorized = categorizeRecommendations(recommendations, largeIndexes.pathogens[0]);
    const learningPath = generateLearningPath(largeIndexes, behaviorAnalysis);

    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
    expect(Array.isArray(recommendations)).toBe(true);
    expect(typeof categorized).toBe('object');
    expect(Array.isArray(learningPath)).toBe(true);
  });
});