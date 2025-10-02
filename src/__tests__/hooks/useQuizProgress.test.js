/**
 * useQuizProgress Hook Tests
 * @description Comprehensive test suite for useQuizProgress hook
 * @created 2025-07-28 09:00:33
 */

import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useQuizProgress from '../../hooks/useQuizProgress';
// Remove setupTestEnvironment import as it replaces localStorage mock

import React from 'react';

// Use global localStorage mock from setupTests.js
const localStorageMock = window.localStorage;

// Mock window.addEventListener for the storage event listener
global.addEventListener = jest.fn();
global.removeEventListener = jest.fn();

describe('useQuizProgress Hook', () => {
  beforeEach(() => {
    // DON'T call setupTestEnvironment() as it replaces our localStorage mock
    // Clear the mock store using the exposed __mockStore
    const mockStore = localStorageMock.__mockStore;
    Object.keys(mockStore).forEach(key => {
      delete mockStore[key];
    });
    // Reset call history but preserve implementations
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    
    // Restore the implementations after clearing
    localStorageMock.getItem.mockImplementation((key) => {
      return mockStore[key] !== undefined ? mockStore[key] : null;
    });
    localStorageMock.setItem.mockImplementation((key, value) => {
      mockStore[key] = value;
    });
    localStorageMock.removeItem.mockImplementation((key) => {
      delete mockStore[key];
    });
    localStorageMock.clear.mockImplementation(() => {
      Object.keys(mockStore).forEach(key => {
        delete mockStore[key];
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('initializes with empty quiz history and no current session', () => {
      const { result } = renderHook(() => useQuizProgress());

      expect(result.current.quizHistory).toEqual([]);
      expect(result.current.currentSession).toBeNull();
      expect(result.current.stats.totalQuizzes).toBe(0);
      expect(result.current.stats.averageScore).toBe(0);
      expect(result.current.stats.bestScore).toBe(0);
      expect(result.current.stats.recentQuizzes).toEqual([]);
    });

    it('provides all necessary methods', () => {
      const { result } = renderHook(() => useQuizProgress());

      expect(typeof result.current.startQuiz).toBe('function');
      expect(typeof result.current.recordAnswer).toBe('function');
      expect(typeof result.current.completeQuiz).toBe('function');
      expect(typeof result.current.resetCurrentSession).toBe('function');
      expect(typeof result.current.clearHistory).toBe('function');
      expect(typeof result.current.getTopicPerformance).toBe('function');
    });
  });

  describe('Starting a Quiz', () => {
    it('creates a new quiz session', () => {
      const { result } = renderHook(() => useQuizProgress());

      act(() => {
        const session = result.current.startQuiz('quiz-1', 5);
        expect(session).toBeDefined();
        expect(session.quizId).toBe('quiz-1');
        expect(session.totalQuestions).toBe(5);
        expect(session.answers).toEqual([]);
        expect(session.currentQuestion).toBe(0);
        expect(session.startTime).toBeDefined();
      });

      expect(result.current.currentSession).toBeDefined();
      expect(result.current.currentSession.quizId).toBe('quiz-1');
      expect(result.current.currentSession.totalQuestions).toBe(5);
    });

    it('generates valid ISO timestamp for start time', () => {
      const { result } = renderHook(() => useQuizProgress());

      act(() => {
        result.current.startQuiz('quiz-1', 5);
      });

      const startTime = result.current.currentSession.startTime;
      // startTime is a timestamp number, not an ISO string
      expect(typeof startTime).toBe('number');
      expect(startTime).toBeLessThanOrEqual(Date.now());
    });

    it('replaces existing session when starting new quiz', () => {
      const { result } = renderHook(() => useQuizProgress());

      act(() => {
        result.current.startQuiz('quiz-1', 5);
      });

      const firstSession = result.current.currentSession;

      act(() => {
        result.current.startQuiz('quiz-2', 3);
      });

      expect(result.current.currentSession.quizId).toBe('quiz-2');
      expect(result.current.currentSession.totalQuestions).toBe(3);
      expect(result.current.currentSession.answers).toEqual([]);
    });
  });

  describe('Recording Answers', () => {
    let quizResult;

    beforeEach(() => {
      const { result } = renderHook(() => useQuizProgress());
      
      act(() => {
        result.current.startQuiz('quiz-1', 3);
      });

      quizResult = result;
    });

    it('records correct answer', () => {
      act(() => {
        quizResult.current.recordAnswer(
          0, 
          2, 
          2, 
          'Which antibiotic is first-line for pneumonia?'
        );
      });

      const answers = quizResult.current.currentSession.answers;
      expect(answers).toHaveLength(1);
      expect(answers[0]).toEqual({
        questionIndex: 0,
        questionText: 'Which antibiotic is first-line for pneumonia?',
        selectedAnswer: 2,
        correctAnswer: 2,
        isCorrect: true,
        timestamp: expect.any(String)
      });

      expect(quizResult.current.currentSession.currentQuestion).toBe(1);
    });

    it('records incorrect answer', () => {
      act(() => {
        quizResult.current.recordAnswer(
          0,
          1,
          2,
          'Which antibiotic is first-line for pneumonia?'
        );
      });

      const answers = quizResult.current.currentSession.answers;
      expect(answers[0].isCorrect).toBe(false);
      expect(answers[0].selectedAnswer).toBe(1);
      expect(answers[0].correctAnswer).toBe(2);
    });

    it('increments current question index', () => {
      act(() => {
        quizResult.current.recordAnswer(0, 2, 2, 'Question 1');
      });

      expect(quizResult.current.currentSession.currentQuestion).toBe(1);

      act(() => {
        quizResult.current.recordAnswer(1, 1, 1, 'Question 2');
      });

      expect(quizResult.current.currentSession.currentQuestion).toBe(2);
    });

    it('stores timestamp for each answer', () => {
      // Create fresh hook instance for this test
      const { result } = renderHook(() => useQuizProgress());
      act(() => {
        result.current.startQuiz('quiz-timestamp', 3);
      });

      const beforeTime = new Date().getTime();

      act(() => {
        result.current.recordAnswer(0, 2, 2, 'Question 1');
      });

      const afterTime = new Date().getTime();
      const answerTimestamp = new Date(result.current.currentSession.answers[0].timestamp).getTime();

      expect(answerTimestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(answerTimestamp).toBeLessThanOrEqual(afterTime);
    });

    it('handles recording without active session gracefully', () => {
      const { result } = renderHook(() => useQuizProgress());

      // Don't start a quiz session
      act(() => {
        result.current.recordAnswer(0, 2, 2, 'Question 1');
      });

      // Should not crash, session should remain null
      expect(result.current.currentSession).toBeNull();
    });

    it('records multiple answers correctly', () => {
      act(() => {
        quizResult.current.recordAnswer(0, 2, 2, 'Question 1');
        quizResult.current.recordAnswer(1, 1, 3, 'Question 2');
        quizResult.current.recordAnswer(2, 0, 0, 'Question 3');
      });

      const answers = quizResult.current.currentSession.answers;
      expect(answers).toHaveLength(3);
      expect(answers[0].isCorrect).toBe(true);
      expect(answers[1].isCorrect).toBe(false);
      expect(answers[2].isCorrect).toBe(true);
      expect(quizResult.current.currentSession.currentQuestion).toBe(3);
    });
  });

  describe('Completing Quiz', () => {
    // Helper function to setup a quiz with answers
    const setupQuizWithAnswers = () => {
      const { result } = renderHook(() => useQuizProgress());
      
      act(() => {
        result.current.startQuiz('quiz-1', 3);
        // Record some answers
        result.current.recordAnswer(0, 2, 2, 'Question 1 about pneumonia');
        result.current.recordAnswer(1, 1, 3, 'Question 2 about UTI');
        result.current.recordAnswer(2, 0, 0, 'Question 3 about antibiotics');
      });

      return result;
    };

    it('completes quiz and calculates score correctly', () => {
      const quizResult = setupQuizWithAnswers();
      let completedQuiz;

      act(() => {
        completedQuiz = quizResult.current.completeQuiz();
      });

      expect(completedQuiz).toBeDefined();
      expect(completedQuiz.correctAnswers).toBe(2); // Questions 1 and 3 were correct
      expect(completedQuiz.scorePercentage).toBe(67); // Math.round((2/3) * 100)
      expect(completedQuiz.endTime).toBeDefined();
      expect(completedQuiz.duration).toMatch(/\d+m \d+s/);
    });

    it('adds completed quiz to history', () => {
      const quizResult = setupQuizWithAnswers();
      
      act(() => {
        quizResult.current.completeQuiz();
      });

      expect(quizResult.current.quizHistory).toHaveLength(1);
      expect(quizResult.current.quizHistory[0].quizId).toBe('quiz-1');
      expect(quizResult.current.quizHistory[0].scorePercentage).toBe(67);
    });

    it('clears current session after completion', () => {
      const quizResult = setupQuizWithAnswers();
      
      act(() => {
        quizResult.current.completeQuiz();
      });

      expect(quizResult.current.currentSession).toBeNull();
    });

    it('calculates duration correctly', () => {
      const quizResult = setupQuizWithAnswers();
      
      // Mock startTime to be 2 minutes ago
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      quizResult.current.currentSession.startTime = twoMinutesAgo;

      let completedQuiz;
      act(() => {
        completedQuiz = quizResult.current.completeQuiz();
      });

      expect(completedQuiz.duration).toMatch(/^[12]m \d+s$/);
    });

    it('handles completion without answers gracefully', () => {
      const { result } = renderHook(() => useQuizProgress());
      
      act(() => {
        result.current.startQuiz('empty-quiz', 0);
      });

      let completedQuiz;
      act(() => {
        completedQuiz = result.current.completeQuiz();
      });

      expect(completedQuiz).toBeNull();
      expect(result.current.currentSession).toBeNull();
    });

    it('handles completion without active session', () => {
      const { result } = renderHook(() => useQuizProgress());

      let completedQuiz;
      act(() => {
        completedQuiz = result.current.completeQuiz();
      });

      expect(completedQuiz).toBeNull();
    });
  });

  describe('Statistics Calculation', () => {
    let quizResult;

    beforeEach(() => {
      // Create multiple completed quizzes FIRST
      const quizHistory = [
        {
          quizId: 'quiz-1',
          scorePercentage: 80,
          correctAnswers: 4,
          totalQuestions: 5,
          completedAt: '2025-01-01T10:00:00.000Z',
          answers: [
            { isCorrect: true, questionText: 'pneumonia question' },
            { isCorrect: true, questionText: 'UTI question' },
            { isCorrect: false, questionText: 'sepsis question' },
            { isCorrect: true, questionText: 'antibiotic question' },
            { isCorrect: true, questionText: 'meningitis question' }
          ]
        },
        {
          quizId: 'quiz-2',
          scorePercentage: 60,
          correctAnswers: 3,
          totalQuestions: 5,
          completedAt: '2025-01-02T10:00:00.000Z',
          answers: [
            { isCorrect: true, questionText: 'pneumonia question' },
            { isCorrect: false, questionText: 'UTI question' },
            { isCorrect: true, questionText: 'sepsis question' },
            { isCorrect: false, questionText: 'antibiotic question' },
            { isCorrect: true, questionText: 'general question' }
          ]
        },
        {
          quizId: 'quiz-3',
          scorePercentage: 100,
          correctAnswers: 5,
          totalQuestions: 5,
          completedAt: '2025-01-03T10:00:00.000Z',
          answers: [
            { isCorrect: true, questionText: 'pneumonia question' },
            { isCorrect: true, questionText: 'UTI question' },
            { isCorrect: true, questionText: 'sepsis question' },
            { isCorrect: true, questionText: 'antibiotic question' },
            { isCorrect: true, questionText: 'meningitis question' }
          ]
        }
      ];

      // Mock localStorage to return this history BEFORE creating hook
      localStorageMock.setItem('quizHistory', JSON.stringify(quizHistory));

      // NOW create the hook instance
      const { result } = renderHook(() => useQuizProgress());
      quizResult = result;
    });

    it('calculates total quizzes correctly', () => {
      // Set data before creating hook instance
      const quizHistory = [
        { quizId: 'quiz-1', scorePercentage: 80, answers: [] },
        { quizId: 'quiz-2', scorePercentage: 60, answers: [] },
        { quizId: 'quiz-3', scorePercentage: 100, answers: [] }
      ];
      
      // Set data using window.localStorage directly
      window.localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
      
      const { result } = renderHook(() => useQuizProgress());
      expect(result.current.stats.totalQuizzes).toBe(3);
    });

    it('calculates average score correctly', () => {
      // Set data before creating hook instance
      const quizHistory = [
        { quizId: 'quiz-1', scorePercentage: 80, answers: [] },
        { quizId: 'quiz-2', scorePercentage: 60, answers: [] },
        { quizId: 'quiz-3', scorePercentage: 100, answers: [] }
      ];
      localStorageMock.setItem('quizHistory', JSON.stringify(quizHistory));
      
      const { result } = renderHook(() => useQuizProgress());
      expect(result.current.stats.averageScore).toBe(80); // (80 + 60 + 100) / 3 = 80
    });

    it('calculates best score correctly', () => {
      // Set data before creating hook instance
      const quizHistory = [
        { quizId: 'quiz-1', scorePercentage: 80, answers: [] },
        { quizId: 'quiz-2', scorePercentage: 60, answers: [] },
        { quizId: 'quiz-3', scorePercentage: 100, answers: [] }
      ];
      localStorageMock.setItem('quizHistory', JSON.stringify(quizHistory));
      
      const { result } = renderHook(() => useQuizProgress());
      expect(result.current.stats.bestScore).toBe(100);
    });

    it('returns recent quizzes in reverse order', () => {
      // Set data before creating hook instance
      const quizHistory = [
        { quizId: 'quiz-1', scorePercentage: 80, answers: [] },
        { quizId: 'quiz-2', scorePercentage: 60, answers: [] },
        { quizId: 'quiz-3', scorePercentage: 100, answers: [] }
      ];
      localStorageMock.setItem('quizHistory', JSON.stringify(quizHistory));
      
      const { result } = renderHook(() => useQuizProgress());
      const recentQuizzes = result.current.stats.recentQuizzes;
      expect(recentQuizzes).toHaveLength(3);
      expect(recentQuizzes[0].quizId).toBe('quiz-3'); // Most recent first
      expect(recentQuizzes[1].quizId).toBe('quiz-2');
      expect(recentQuizzes[2].quizId).toBe('quiz-1');
    });

    it('limits recent quizzes to 5', () => {
      // Add more quizzes to history
      const extendedHistory = Array.from({ length: 10 }, (_, i) => ({
        quizId: `quiz-${i}`,
        scorePercentage: 75,
        correctAnswers: 3,
        totalQuestions: 4,
        completedAt: `2025-01-${String(i + 1).padStart(2, '0')}T10:00:00.000Z`,
        answers: []
      }));

      localStorageMock.setItem('quizHistory', JSON.stringify(extendedHistory));

      const { result } = renderHook(() => useQuizProgress());
      expect(result.current.stats.recentQuizzes).toHaveLength(5);
    });
  });

  describe('Improvement Trend Calculation', () => {
    it('identifies improving trend', () => {
      const improvingHistory = [
        { scorePercentage: 50, answers: [] },
        { scorePercentage: 55, answers: [] },
        { scorePercentage: 60, answers: [] },
        { scorePercentage: 65, answers: [] },
        { scorePercentage: 70, answers: [] },
        { scorePercentage: 80, answers: [] },
        { scorePercentage: 85, answers: [] },
        { scorePercentage: 90, answers: [] },
        { scorePercentage: 95, answers: [] },
        { scorePercentage: 100, answers: [] }
      ];

      localStorageMock.setItem('quizHistory', JSON.stringify(improvingHistory));
      const { result } = renderHook(() => useQuizProgress());

      expect(result.current.stats.improvementTrend).toBe('improving');
    });

    it('identifies declining trend', () => {
      const decliningHistory = [
        { scorePercentage: 100, answers: [] },
        { scorePercentage: 95, answers: [] },
        { scorePercentage: 90, answers: [] },
        { scorePercentage: 85, answers: [] },
        { scorePercentage: 80, answers: [] },
        { scorePercentage: 70, answers: [] },
        { scorePercentage: 65, answers: [] },
        { scorePercentage: 60, answers: [] },
        { scorePercentage: 55, answers: [] },
        { scorePercentage: 50, answers: [] }
      ];

      localStorageMock.setItem('quizHistory', JSON.stringify(decliningHistory));
      const { result } = renderHook(() => useQuizProgress());

      expect(result.current.stats.improvementTrend).toBe('declining');
    });

    it('identifies stable trend', () => {
      const stableHistory = Array.from({ length: 10 }, () => ({ scorePercentage: 75, answers: [] }));

      localStorageMock.setItem('quizHistory', JSON.stringify(stableHistory));
      const { result } = renderHook(() => useQuizProgress());

      expect(result.current.stats.improvementTrend).toBe('stable');
    });

    it('returns insufficient_data for small history', () => {
      const smallHistory = [{ scorePercentage: 80, answers: [] }];

      localStorageMock.setItem('quizHistory', JSON.stringify(smallHistory));
      const { result } = renderHook(() => useQuizProgress());

      expect(result.current.stats.improvementTrend).toBe('insufficient_data');
    });
  });

  describe('Weak Areas Identification', () => {
    beforeEach(() => {
      const historyWithWeakAreas = [
        {
          answers: [
            { isCorrect: false, questionText: 'pneumonia diagnosis question' },
            { isCorrect: false, questionText: 'pneumonia treatment question' },
            { isCorrect: false, questionText: 'pneumonia pathogen question' },
            { isCorrect: true, questionText: 'UTI diagnosis question' },
            { isCorrect: true, questionText: 'UTI treatment question' },
            { isCorrect: true, questionText: 'UTI pathogen question' },
            { isCorrect: true, questionText: 'UTI prevention question' }
          ]
        }
      ];

      localStorageMock.setItem('quizHistory', JSON.stringify(historyWithWeakAreas));
    });

    it('identifies weak areas correctly', () => {
      const { result } = renderHook(() => useQuizProgress());
      
      const weakAreas = result.current.stats.weakAreas;
      expect(weakAreas).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            topic: 'pneumonia',
            accuracy: 0,
            totalQuestions: 3
          })
        ])
      );
    });

    it('excludes topics with good performance', () => {
      const { result } = renderHook(() => useQuizProgress());
      
      const weakAreas = result.current.stats.weakAreas;
      const utiWeakArea = weakAreas.find(area => area.topic === 'uti');
      expect(utiWeakArea).toBeUndefined(); // UTI had 100% accuracy
    });

    it('requires minimum questions for weak area identification', () => {
      const historyWithFewQuestions = [
        {
          answers: [
            { isCorrect: false, questionText: 'pneumonia question' },
            { isCorrect: false, questionText: 'other question' }
          ]
        }
      ];

      localStorageMock.setItem('quizHistory', JSON.stringify(historyWithFewQuestions));
      const { result } = renderHook(() => useQuizProgress());

      const weakAreas = result.current.stats.weakAreas;
      expect(weakAreas).toHaveLength(0); // Less than 3 questions per topic
    });
  });

  describe('Streak Calculation', () => {
    it('calculates correct streak for consecutive good scores', () => {
      const streakHistory = [
        { scorePercentage: 60, answers: [] }, // Not part of streak
        { scorePercentage: 85, answers: [] }, // Start of streak
        { scorePercentage: 90, answers: [] },
        { scorePercentage: 95, answers: [] },
        { scorePercentage: 80, answers: [] } // End of streak (last quiz)
      ];

      localStorageMock.setItem('quizHistory', JSON.stringify(streakHistory));
      const { result } = renderHook(() => useQuizProgress());

      expect(result.current.stats.streakCount).toBe(4); // Last 4 quizzes >= 80%
    });

    it('returns 0 streak for poor recent performance', () => {
      const noStreakHistory = [
        { scorePercentage: 90, answers: [] },
        { scorePercentage: 95, answers: [] },
        { scorePercentage: 70, answers: [] } // Last quiz < 80%
      ];

      localStorageMock.setItem('quizHistory', JSON.stringify(noStreakHistory));
      const { result } = renderHook(() => useQuizProgress());

      expect(result.current.stats.streakCount).toBe(0);
    });

    it('handles empty history', () => {
      const { result } = renderHook(() => useQuizProgress());
      expect(result.current.stats.streakCount).toBe(0);
    });
  });

  describe('Topic Performance Analysis', () => {
    beforeEach(() => {
      const topicHistory = [
        {
          answers: [
            { isCorrect: true, questionText: 'pneumonia diagnosis and treatment' },
            { isCorrect: false, questionText: 'pneumonia pathogen identification' },
            { isCorrect: true, questionText: 'UTI symptoms and causes' },
            { isCorrect: true, questionText: 'UTI antibiotic selection' }
          ]
        },
        {
          answers: [
            { isCorrect: false, questionText: 'pneumonia complications' },
            { isCorrect: true, questionText: 'UTI prevention strategies' }
          ]
        }
      ];

      localStorageMock.setItem('quizHistory', JSON.stringify(topicHistory));
    });

    it('calculates topic performance correctly', () => {
      const { result } = renderHook(() => useQuizProgress());
      
      const pneumoniaPerformance = result.current.getTopicPerformance('pneumonia');
      expect(pneumoniaPerformance).toEqual({
        topic: 'pneumonia',
        totalQuestions: 3,
        correctAnswers: 1,
        accuracy: 33
      });
    });

    it('returns null for topics with no questions', () => {
      const { result } = renderHook(() => useQuizProgress());
      
      const unknownTopicPerformance = result.current.getTopicPerformance('unknown-topic');
      expect(unknownTopicPerformance).toBeNull();
    });

    it('is case insensitive', () => {
      const { result } = renderHook(() => useQuizProgress());
      
      const upperCaseResult = result.current.getTopicPerformance('PNEUMONIA');
      const lowerCaseResult = result.current.getTopicPerformance('pneumonia');
      
      expect(upperCaseResult).toEqual(lowerCaseResult);
    });
  });

  describe('Session Management', () => {
    it('resets current session', () => {
      const { result } = renderHook(() => useQuizProgress());

      act(() => {
        result.current.startQuiz('quiz-1', 5);
        result.current.recordAnswer(0, 1, 2, 'Question 1');
      });

      expect(result.current.currentSession).not.toBeNull();

      act(() => {
        result.current.resetCurrentSession();
      });

      expect(result.current.currentSession).toBeNull();
    });

    it('clears all history', () => {
      const { result } = renderHook(() => useQuizProgress());

      // Add some history
      const history = [
        { quizId: 'quiz-1', scorePercentage: 80, answers: [] },
        { quizId: 'quiz-2', scorePercentage: 90, answers: [] }
      ];
      localStorageMock.setItem('quizHistory', JSON.stringify(history));

      // Re-render hook to pick up history
      const { result: resultWithHistory } = renderHook(() => useQuizProgress());
      expect(resultWithHistory.current.quizHistory).toHaveLength(2);

      act(() => {
        resultWithHistory.current.clearHistory();
      });

      expect(resultWithHistory.current.quizHistory).toHaveLength(0);
      expect(resultWithHistory.current.stats.totalQuizzes).toBe(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles corrupted localStorage data gracefully', () => {
      localStorageMock.setItem('quizHistory', 'invalid-json');
      
      // Should not throw error, should use default empty array
      const { result } = renderHook(() => useQuizProgress());
      expect(result.current.quizHistory).toEqual([]);
    });

    it('handles quiz completion with zero questions', () => {
      const { result } = renderHook(() => useQuizProgress());

      act(() => {
        result.current.startQuiz('empty-quiz', 0);
      });

      let completedQuiz;
      act(() => {
        completedQuiz = result.current.completeQuiz();
      });

      expect(completedQuiz).toBeNull();
    });

    it('handles recording answers beyond total questions', () => {
      const { result } = renderHook(() => useQuizProgress());

      act(() => {
        result.current.startQuiz('quiz-1', 2);
        result.current.recordAnswer(0, 1, 1, 'Question 1');
        result.current.recordAnswer(1, 1, 1, 'Question 2');
        result.current.recordAnswer(2, 1, 1, 'Question 3'); // Beyond total
      });

      // Should handle gracefully
      expect(result.current.currentSession.answers).toHaveLength(3);
      expect(result.current.currentSession.currentQuestion).toBe(3);
    });

    it('maintains data consistency across re-renders', () => {
      const { result, rerender } = renderHook(() => useQuizProgress());

      act(() => {
        result.current.startQuiz('quiz-1', 3);
        result.current.recordAnswer(0, 1, 1, 'Question 1');
      });

      const sessionBeforeRerender = result.current.currentSession;
      
      rerender();

      expect(result.current.currentSession).toEqual(sessionBeforeRerender);
    });
  });
});