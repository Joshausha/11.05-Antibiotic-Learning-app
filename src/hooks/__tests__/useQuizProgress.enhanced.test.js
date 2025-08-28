/**
 * Enhanced useQuizProgress Hook Tests
 * 
 * Comprehensive test suite for useQuizProgress hook functionality
 * Focus: Improve coverage from 20.53% to >80% for quiz progress tracking
 * Agent: Delta-1 - Coverage Improvement Specialist
 */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useQuizProgress from '../useQuizProgress';

// Mock localStorage hook
jest.mock('../useLocalStorage', () => {
  return jest.fn((key, defaultValue) => {
    let value = defaultValue;
    return [
      value,
      jest.fn((newValue) => {
        if (typeof newValue === 'function') {
          value = newValue(value);
        } else {
          value = newValue;
        }
      })
    ];
  });
});

describe('Enhanced useQuizProgress Hook', () => {
  let mockSetQuizHistory;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the mock implementation before each test
    const useLocalStorage = require('../useLocalStorage');
    mockSetQuizHistory = jest.fn();
    useLocalStorage.mockImplementation((key, defaultValue) => [
      [], // Start with empty quiz history
      mockSetQuizHistory
    ]);
  });

  describe('Initial State and Basic Functionality', () => {
    test('should initialize with empty quiz history', () => {
      const { result } = renderHook(() => useQuizProgress());
      
      expect(result.current.stats.totalQuizzes).toBe(0);
      expect(result.current.stats.averageScore).toBe(0);
      expect(result.current.stats.bestScore).toBe(0);
      expect(result.current.stats.recentQuizzes).toEqual([]);
    });

    test('should provide necessary methods', () => {
      const { result } = renderHook(() => useQuizProgress());
      
      expect(typeof result.current.submitQuiz).toBe('function');
      expect(typeof result.current.clearHistory).toBe('function');
      expect(typeof result.current.getQuizById).toBe('function');
      expect(typeof result.current.getQuizzesByCategory).toBe('function');
      expect(typeof result.current.startNewQuiz).toBe('function');
      expect(typeof result.current.updateCurrentSession).toBe('function');
      expect(typeof result.current.finishCurrentSession).toBe('function');
    });

    test('should have proper initial session state', () => {
      const { result } = renderHook(() => useQuizProgress());
      
      expect(result.current.currentSession).toBe(null);
      expect(result.current.isQuizInProgress).toBe(false);
    });
  });

  describe('Quiz History Management', () => {
    test('should submit quiz and update history', async () => {
      const { result } = renderHook(() => useQuizProgress());
      
      const quizData = {
        id: 'quiz-1',
        category: 'respiratory',
        questions: [
          { id: 'q1', correct: true },
          { id: 'q2', correct: false },
          { id: 'q3', correct: true }
        ],
        scorePercentage: 67,
        duration: 120000, // 2 minutes
        difficulty: 'intermediate'
      };

      await act(async () => {
        result.current.submitQuiz(quizData);
      });

      expect(mockSetQuizHistory).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    test('should clear quiz history', async () => {
      const { result } = renderHook(() => useQuizProgress());

      await act(async () => {
        result.current.clearHistory();
      });

      expect(mockSetQuizHistory).toHaveBeenCalledWith([]);
    });

    test('should handle quiz submission with validation', async () => {
      const { result } = renderHook(() => useQuizProgress());
      
      const invalidQuizData = {
        // Missing required fields
        category: 'respiratory'
      };

      await act(async () => {
        result.current.submitQuiz(invalidQuizData);
      });

      // Should still attempt to save, with defensive programming
      expect(mockSetQuizHistory).toHaveBeenCalled();
    });
  });

  describe('Statistics Calculation with Data', () => {
    test('should calculate stats with multiple quiz entries', () => {
      const useLocalStorage = require('../useLocalStorage');
      const mockQuizHistory = [
        { id: 'quiz-1', scorePercentage: 80, category: 'respiratory', date: '2025-01-01' },
        { id: 'quiz-2', scorePercentage: 90, category: 'cardiac', date: '2025-01-02' },
        { id: 'quiz-3', scorePercentage: 70, category: 'respiratory', date: '2025-01-03' }
      ];
      
      useLocalStorage.mockImplementation(() => [mockQuizHistory, mockSetQuizHistory]);
      
      const { result } = renderHook(() => useQuizProgress());
      
      expect(result.current.stats.totalQuizzes).toBe(3);
      expect(result.current.stats.averageScore).toBe(80); // (80+90+70)/3 = 80
      expect(result.current.stats.bestScore).toBe(90);
      expect(result.current.stats.recentQuizzes).toHaveLength(3);
    });

    test('should handle recent quizzes limit', () => {
      const useLocalStorage = require('../useLocalStorage');
      const mockQuizHistory = Array.from({ length: 10 }, (_, i) => ({
        id: `quiz-${i + 1}`,
        scorePercentage: 75 + i,
        category: 'test',
        date: `2025-01-${String(i + 1).padStart(2, '0')}`
      }));
      
      useLocalStorage.mockImplementation(() => [mockQuizHistory, mockSetQuizHistory]);
      
      const { result } = renderHook(() => useQuizProgress());
      
      // Should show only most recent 5 quizzes
      expect(result.current.stats.recentQuizzes).toHaveLength(5);
      // Most recent should be first (reverse chronological)
      expect(result.current.stats.recentQuizzes[0].id).toBe('quiz-10');
    });

    test('should calculate average score correctly with rounding', () => {
      const useLocalStorage = require('../useLocalStorage');
      const mockQuizHistory = [
        { id: 'quiz-1', scorePercentage: 77 },
        { id: 'quiz-2', scorePercentage: 83 },
        { id: 'quiz-3', scorePercentage: 79 }
      ];
      
      useLocalStorage.mockImplementation(() => [mockQuizHistory, mockSetQuizHistory]);
      
      const { result } = renderHook(() => useQuizProgress());
      
      // (77+83+79)/3 = 79.67, should round to 80
      expect(result.current.stats.averageScore).toBe(80);
    });
  });

  describe('Quiz Session Management', () => {
    test('should start new quiz session', async () => {
      const { result } = renderHook(() => useQuizProgress());
      
      const sessionData = {
        category: 'respiratory',
        difficulty: 'intermediate',
        questionCount: 10
      };

      await act(async () => {
        result.current.startNewQuiz(sessionData);
      });

      expect(result.current.currentSession).toEqual(
        expect.objectContaining({
          category: 'respiratory',
          difficulty: 'intermediate',
          questionCount: 10,
          startTime: expect.any(String) // Updated to expect ISO string format
        })
      );
      expect(result.current.isQuizInProgress).toBe(true);
    });

    test('should update current session', async () => {
      const { result } = renderHook(() => useQuizProgress());
      
      // Start a session first
      await act(async () => {
        result.current.startNewQuiz({ category: 'test' });
      });

      // Update session
      const updateData = {
        currentQuestionIndex: 3,
        correctAnswers: 2,
        timeElapsed: 60000 // 1 minute
      };

      await act(async () => {
        result.current.updateCurrentSession(updateData);
      });

      expect(result.current.currentSession).toEqual(
        expect.objectContaining({
          currentQuestionIndex: 3,
          correctAnswers: 2,
          timeElapsed: 60000
        })
      );
    });

    test('should finish current session', async () => {
      const { result } = renderHook(() => useQuizProgress());
      
      // Start a session first
      await act(async () => {
        result.current.startNewQuiz({ 
          category: 'respiratory',
          questionCount: 10 
        });
      });

      // Update session progress
      await act(async () => {
        result.current.updateCurrentSession({
          currentQuestionIndex: 10,
          correctAnswers: 8,
          timeElapsed: 180000 // 3 minutes
        });
      });

      // Finish session
      await act(async () => {
        result.current.finishCurrentSession();
      });

      expect(result.current.currentSession).toBe(null);
      expect(result.current.isQuizInProgress).toBe(false);
      expect(mockSetQuizHistory).toHaveBeenCalled();
    });

    test('should handle finishing session without current session', async () => {
      const { result } = renderHook(() => useQuizProgress());
      
      await act(async () => {
        result.current.finishCurrentSession();
      });

      // Should not crash
      expect(result.current.currentSession).toBe(null);
      expect(result.current.isQuizInProgress).toBe(false);
    });
  });

  describe('Quiz Query Methods', () => {
    test('should get quiz by ID', () => {
      const useLocalStorage = require('../useLocalStorage');
      const mockQuizHistory = [
        { id: 'quiz-1', scorePercentage: 80, category: 'respiratory' },
        { id: 'quiz-2', scorePercentage: 90, category: 'cardiac' }
      ];
      
      useLocalStorage.mockImplementation(() => [mockQuizHistory, mockSetQuizHistory]);
      
      const { result } = renderHook(() => useQuizProgress());
      
      const quiz = result.current.getQuizById('quiz-1');
      expect(quiz).toEqual(
        expect.objectContaining({
          id: 'quiz-1',
          scorePercentage: 80,
          category: 'respiratory'
        })
      );
      
      const nonExistentQuiz = result.current.getQuizById('quiz-nonexistent');
      expect(nonExistentQuiz).toBeUndefined();
    });

    test('should get quizzes by category', () => {
      const useLocalStorage = require('../useLocalStorage');
      const mockQuizHistory = [
        { id: 'quiz-1', scorePercentage: 80, category: 'respiratory' },
        { id: 'quiz-2', scorePercentage: 90, category: 'cardiac' },
        { id: 'quiz-3', scorePercentage: 85, category: 'respiratory' },
        { id: 'quiz-4', scorePercentage: 75, category: 'neurological' }
      ];
      
      useLocalStorage.mockImplementation(() => [mockQuizHistory, mockSetQuizHistory]);
      
      const { result } = renderHook(() => useQuizProgress());
      
      const respiratoryQuizzes = result.current.getQuizzesByCategory('respiratory');
      expect(respiratoryQuizzes).toHaveLength(2);
      expect(respiratoryQuizzes[0].category).toBe('respiratory');
      expect(respiratoryQuizzes[1].category).toBe('respiratory');
      
      const nonExistentCategoryQuizzes = result.current.getQuizzesByCategory('nonexistent');
      expect(nonExistentCategoryQuizzes).toEqual([]);
    });
  });

  describe('Advanced Statistics and Analytics', () => {
    test('should calculate category-specific performance', () => {
      const useLocalStorage = require('../useLocalStorage');
      const mockQuizHistory = [
        { id: 'quiz-1', scorePercentage: 80, category: 'respiratory', difficulty: 'easy' },
        { id: 'quiz-2', scorePercentage: 70, category: 'respiratory', difficulty: 'hard' },
        { id: 'quiz-3', scorePercentage: 90, category: 'cardiac', difficulty: 'easy' },
        { id: 'quiz-4', scorePercentage: 85, category: 'cardiac', difficulty: 'medium' }
      ];
      
      useLocalStorage.mockImplementation(() => [mockQuizHistory, mockSetQuizHistory]);
      
      const { result } = renderHook(() => useQuizProgress());
      
      // Should provide category breakdown if implemented
      const respiratoryQuizzes = result.current.getQuizzesByCategory('respiratory');
      const respiratoryAverage = respiratoryQuizzes.reduce((sum, quiz) => sum + quiz.scorePercentage, 0) / respiratoryQuizzes.length;
      expect(respiratoryAverage).toBe(75); // (80+70)/2
      
      const cardiacQuizzes = result.current.getQuizzesByCategory('cardiac');
      const cardiacAverage = cardiacQuizzes.reduce((sum, quiz) => sum + quiz.scorePercentage, 0) / cardiacQuizzes.length;
      expect(cardiacAverage).toBe(87.5); // (90+85)/2
    });

    test('should handle performance trends analysis', () => {
      const useLocalStorage = require('../useLocalStorage');
      const mockQuizHistory = [
        { id: 'quiz-1', scorePercentage: 60, date: '2025-01-01' },
        { id: 'quiz-2', scorePercentage: 70, date: '2025-01-02' },
        { id: 'quiz-3', scorePercentage: 80, date: '2025-01-03' },
        { id: 'quiz-4', scorePercentage: 85, date: '2025-01-04' },
        { id: 'quiz-5', scorePercentage: 90, date: '2025-01-05' }
      ];
      
      useLocalStorage.mockImplementation(() => [mockQuizHistory, mockSetQuizHistory]);
      
      const { result } = renderHook(() => useQuizProgress());
      
      // Verify trending upward performance
      expect(result.current.stats.totalQuizzes).toBe(5);
      expect(result.current.stats.bestScore).toBe(90);
      expect(result.current.stats.averageScore).toBe(77); // (60+70+80+85+90)/5 = 77
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle corrupted quiz history data', () => {
      const useLocalStorage = require('../useLocalStorage');
      const corruptedQuizHistory = [
        { id: 'quiz-1', scorePercentage: 80 }, // Valid
        { id: 'quiz-2' }, // Missing scorePercentage
        null, // Null entry
        { scorePercentage: 90 }, // Missing id
        { id: 'quiz-5', scorePercentage: 'invalid' } // Invalid score type
      ];
      
      useLocalStorage.mockImplementation(() => [corruptedQuizHistory, mockSetQuizHistory]);
      
      const { result } = renderHook(() => useQuizProgress());
      
      // Should handle gracefully without crashing
      expect(result.current.stats).toBeDefined();
      expect(typeof result.current.stats.totalQuizzes).toBe('number');
      expect(typeof result.current.stats.averageScore).toBe('number');
    });

    test('should handle empty and null inputs gracefully', () => {
      const { result } = renderHook(() => useQuizProgress());
      
      expect(() => {
        result.current.getQuizById(null);
        result.current.getQuizById('');
        result.current.getQuizzesByCategory(null);
        result.current.getQuizzesByCategory('');
      }).not.toThrow();
    });

    test('should handle large quiz history datasets efficiently', () => {
      const useLocalStorage = require('../useLocalStorage');
      const largeQuizHistory = Array.from({ length: 1000 }, (_, i) => ({
        id: `quiz-${i + 1}`,
        scorePercentage: 75 + (i % 25), // Scores from 75-99
        category: `category-${i % 10}`, // 10 different categories
        date: `2025-01-${String((i % 30) + 1).padStart(2, '0')}`,
        difficulty: ['easy', 'medium', 'hard'][i % 3]
      }));
      
      useLocalStorage.mockImplementation(() => [largeQuizHistory, mockSetQuizHistory]);
      
      const startTime = performance.now();
      const { result } = renderHook(() => useQuizProgress());
      const endTime = performance.now();
      
      // Should render efficiently even with large dataset
      expect(endTime - startTime).toBeLessThan(100); // Under 100ms
      expect(result.current.stats.totalQuizzes).toBe(1000);
      expect(result.current.stats.recentQuizzes).toHaveLength(5); // Only most recent 5
    });

    test('should maintain referential stability of memoized values', () => {
      const { result, rerender } = renderHook(() => useQuizProgress());
      
      const firstStatsRef = result.current.stats;
      const firstMethodsRef = {
        submitQuiz: result.current.submitQuiz,
        clearHistory: result.current.clearHistory,
        getQuizById: result.current.getQuizById
      };
      
      // Rerender without changing quiz history
      rerender();
      
      // Memoized stats should have same reference
      expect(result.current.stats).toBe(firstStatsRef);
      
      // Methods should maintain referential stability (useCallback)
      expect(result.current.submitQuiz).toBe(firstMethodsRef.submitQuiz);
      expect(result.current.clearHistory).toBe(firstMethodsRef.clearHistory);
      expect(result.current.getQuizById).toBe(firstMethodsRef.getQuizById);
    });
  });

  describe('Medical Education Context', () => {
    test('should track medical category performance', () => {
      const useLocalStorage = require('../useLocalStorage');
      const medicalQuizHistory = [
        { id: 'quiz-1', scorePercentage: 85, category: 'antibiotics', subcategory: 'penicillins' },
        { id: 'quiz-2', scorePercentage: 92, category: 'antibiotics', subcategory: 'cephalosporins' },
        { id: 'quiz-3', scorePercentage: 78, category: 'pathogens', subcategory: 'gram-positive' },
        { id: 'quiz-4', scorePercentage: 88, category: 'pathogens', subcategory: 'gram-negative' }
      ];
      
      useLocalStorage.mockImplementation(() => [medicalQuizHistory, mockSetQuizHistory]);
      
      const { result } = renderHook(() => useQuizProgress());
      
      const antibioticQuizzes = result.current.getQuizzesByCategory('antibiotics');
      expect(antibioticQuizzes).toHaveLength(2);
      
      const pathogenQuizzes = result.current.getQuizzesByCategory('pathogens');
      expect(pathogenQuizzes).toHaveLength(2);
      
      // Medical education should track performance across clinical domains
      expect(result.current.stats.totalQuizzes).toBe(4);
    });

    test('should handle clinical difficulty progressions', async () => {
      const { result } = renderHook(() => useQuizProgress());
      
      // Simulate progression from basic to advanced medical knowledge
      const basicQuiz = {
        category: 'antibiotics',
        difficulty: 'beginner',
        questions: [{ id: 'q1', correct: true }],
        scorePercentage: 95
      };
      
      const advancedQuiz = {
        category: 'antibiotics',
        difficulty: 'advanced',
        questions: [{ id: 'q1', correct: true }, { id: 'q2', correct: false }],
        scorePercentage: 75
      };

      await act(async () => {
        result.current.submitQuiz(basicQuiz);
        result.current.submitQuiz(advancedQuiz);
      });

      // Should track both difficulty levels
      expect(mockSetQuizHistory).toHaveBeenCalledTimes(2);
    });
  });
});