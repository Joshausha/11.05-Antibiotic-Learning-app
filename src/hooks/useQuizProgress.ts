/**
 * useQuizProgress Hook
 * Custom hook to track quiz completion history and progress analytics
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Type definitions for quiz progress tracking
 */

interface AnswerRecord {
  questionIndex: number;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: string;
}

interface QuizSession {
  quizId?: string;
  id?: string;
  totalQuestions: number;
  startTime: number;
  answers: AnswerRecord[];
  currentQuestion: number;
  [key: string]: any;
}

interface CompletedQuiz extends QuizSession {
  endTime: string;
  correctAnswers: number;
  scorePercentage: number;
  duration: string;
  completedAt: string;
}

interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  recentQuizzes: CompletedQuiz[];
  improvementTrend: 'insufficient_data' | 'improving' | 'declining' | 'stable';
  weakAreas: WeakArea[];
  streakCount: number;
}

interface WeakArea {
  topic: string;
  accuracy: number;
  totalQuestions: number;
}

interface TopicPerformance {
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

interface UseQuizProgressReturn {
  // State
  quizHistory: CompletedQuiz[];
  currentSession: QuizSession | null;
  stats: QuizStats;
  isQuizInProgress: boolean;

  // Actions
  startQuiz: (quizIdOrConfig: string | Record<string, any>, totalQuestions?: number) => QuizSession;
  startNewQuiz: (quizIdOrConfig: string | Record<string, any>, totalQuestions?: number) => QuizSession;
  updateCurrentSession: (updateData: Record<string, any>) => void;
  recordAnswer: (questionIndex: number, selectedAnswer: string, correctAnswer: string, questionText: string) => void;
  completeQuiz: () => CompletedQuiz | null;
  submitQuiz: (quizData: CompletedQuiz) => CompletedQuiz | null;
  finishCurrentSession: () => CompletedQuiz | null;
  resetCurrentSession: () => void;
  clearHistory: () => void;
  getTopicPerformance: (topic: string) => TopicPerformance | null;
  getQuizById: (quizId: string) => CompletedQuiz | undefined;
  getQuizzesByCategory: (category: string) => CompletedQuiz[];
}

const useQuizProgress = (): UseQuizProgressReturn => {
  const [quizHistory, setQuizHistory] = useLocalStorage<CompletedQuiz[]>('quizHistory', []);
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);

  // Stable empty stats object for referential stability
  const emptyStats = useMemo<QuizStats>(() => ({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    recentQuizzes: [],
    improvementTrend: 'insufficient_data',
    weakAreas: [],
    streakCount: 0
  }), []);

  // Calculate statistics - memoized for performance with defensive programming
  const stats = useMemo<QuizStats>(() => {
    // Filter for scoring calculations (need scorePercentage)
    const validScoredQuizzes = quizHistory.filter(quiz =>
      quiz && typeof quiz === 'object' && typeof quiz.scorePercentage === 'number'
    );

    // Filter for answer analysis (just need answers array)
    const validQuizzesWithAnswers = quizHistory.filter(quiz =>
      quiz && typeof quiz === 'object' && Array.isArray(quiz.answers)
    );

    const totalQuizzes = validScoredQuizzes.length;

    // Return stable empty stats for empty history
    if (totalQuizzes === 0 && validQuizzesWithAnswers.length === 0) {
      return emptyStats;
    }

    const averageScore = totalQuizzes > 0
      ? Math.round(validScoredQuizzes.reduce((sum, quiz) => sum + quiz.scorePercentage, 0) / totalQuizzes)
      : 0;
    const bestScore = totalQuizzes > 0
      ? Math.max(...validScoredQuizzes.map(quiz => quiz.scorePercentage))
      : 0;
    const recentQuizzes = validScoredQuizzes.slice().reverse().slice(0, 5); // Most recent 5 quizzes, newest first

    return {
      totalQuizzes,
      averageScore,
      bestScore,
      recentQuizzes,
      improvementTrend: calculateImprovementTrend(validScoredQuizzes),
      weakAreas: identifyWeakAreas(validQuizzesWithAnswers), // Use quizzes with answers, not just scored ones
      streakCount: calculateStreakCount(validScoredQuizzes)
    };
  }, [quizHistory, emptyStats]);

  // Start a new quiz session - handle both parameter formats
  const startQuiz = useCallback((quizIdOrConfig: string | Record<string, any>, totalQuestions?: number): QuizSession => {
    let session: QuizSession;
    const startTime = Date.now(); // Use timestamp for enhanced test compatibility

    // Handle object parameter (enhanced test format)
    if (typeof quizIdOrConfig === 'object' && quizIdOrConfig !== null) {
      session = {
        ...quizIdOrConfig, // Spread the config object
        startTime, // Timestamp format
        answers: [],
        currentQuestion: 0
      };
    } else {
      // Handle separate parameters (original format)
      session = {
        quizId: quizIdOrConfig,
        totalQuestions: totalQuestions || 0,
        startTime, // Timestamp format
        answers: [],
        currentQuestion: 0
      };
    }

    setCurrentSession(session);
    return session;
  }, []);

  // Submit a completed quiz directly (enhanced API)
  const submitQuiz = useCallback((quizData: CompletedQuiz): CompletedQuiz | null => {
    if (!quizData) return null;

    // Add to history directly
    setQuizHistory(prev => [...prev, quizData]);
    return quizData;
  }, [setQuizHistory]);

  // Update current session with new data
  const updateCurrentSession = useCallback((updateData: Record<string, any>) => {
    setCurrentSession(prevSession => {
      if (!prevSession) return prevSession;
      return { ...prevSession, ...updateData };
    });
  }, []);

  // Record an answer
  const recordAnswer = useCallback((questionIndex: number, selectedAnswer: string, correctAnswer: string, questionText: string) => {
    setCurrentSession(prevSession => {
      if (!prevSession) return prevSession; // Gracefully handle missing session

      const answerRecord: AnswerRecord = {
        questionIndex,
        questionText,
        selectedAnswer,
        correctAnswer,
        isCorrect: selectedAnswer === correctAnswer,
        timestamp: new Date().toISOString()
      };

      return {
        ...prevSession,
        answers: [...prevSession.answers, answerRecord],
        currentQuestion: prevSession.currentQuestion + 1
      };
    });
  }, []);

  // Complete the quiz and save to history (session-based API)
  const completeQuiz = useCallback((): CompletedQuiz | null => {
    if (!currentSession) return null;

    // Handle edge case for quiz with zero questions
    if (currentSession.totalQuestions === 0) {
      setCurrentSession(null);
      return null;
    }

    const endTime = new Date().toISOString();
    const correctAnswers = currentSession.answers.filter(answer => answer.isCorrect).length;
    const scorePercentage = Math.round((correctAnswers / currentSession.totalQuestions) * 100);

    const completedQuiz: CompletedQuiz = {
      ...currentSession,
      endTime,
      correctAnswers,
      scorePercentage,
      duration: calculateDuration(currentSession.startTime, endTime),
      completedAt: endTime
    };

    // Add to history
    setQuizHistory(prev => [...prev, completedQuiz]);

    // Clear current session
    setCurrentSession(null);

    return completedQuiz;
  }, [currentSession, setQuizHistory]);

  // Finish current session (alias for completeQuiz)
  const finishCurrentSession = useCallback((): CompletedQuiz | null => {
    return completeQuiz();
  }, [completeQuiz]);

  // Reset current session
  const resetCurrentSession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setQuizHistory([]);
  }, [setQuizHistory]);

  // Get performance for a specific topic/category
  const getTopicPerformance = useCallback((topic: string): TopicPerformance | null => {
    const topicQuizzes = quizHistory.filter(quiz =>
      quiz && quiz.answers && quiz.answers.some(answer =>
        answer.questionText && answer.questionText.toLowerCase().includes(topic.toLowerCase())
      )
    );

    if (topicQuizzes.length === 0) return null;

    const totalTopicQuestions = topicQuizzes.reduce((sum, quiz) =>
      sum + (quiz.answers || []).filter(answer =>
        answer.questionText && answer.questionText.toLowerCase().includes(topic.toLowerCase())
      ).length, 0
    );

    const correctTopicAnswers = topicQuizzes.reduce((sum, quiz) =>
      sum + (quiz.answers || []).filter(answer =>
        answer.questionText && answer.questionText.toLowerCase().includes(topic.toLowerCase()) && answer.isCorrect
      ).length, 0
    );

    return {
      topic: topic.toLowerCase(),
      totalQuestions: totalTopicQuestions,
      correctAnswers: correctTopicAnswers,
      accuracy: Math.round((correctTopicAnswers / totalTopicQuestions) * 100)
    };
  }, [quizHistory]);

  // Get quiz by ID - look for both 'id' and 'quizId' fields for compatibility
  // Use a ref to maintain referential stability when content doesn't change
  const quizHistoryRef = useRef(quizHistory);
  if (JSON.stringify(quizHistoryRef.current) !== JSON.stringify(quizHistory)) {
    quizHistoryRef.current = quizHistory;
  }

  const getQuizById = useCallback((quizId: string): CompletedQuiz | undefined => {
    const quiz = quizHistoryRef.current.find(quiz => quiz && (quiz.id === quizId || quiz.quizId === quizId));
    return quiz; // Return undefined if not found (default behavior)
  }, []);

  // Get quizzes by category - look for direct category field
  const getQuizzesByCategory = useCallback((category: string): CompletedQuiz[] => {
    if (!category) return [];
    return quizHistory.filter(quiz => {
      if (!quiz) return false;
      // Check direct category field first (enhanced tests)
      if (quiz.category && (quiz as any).category.toLowerCase() === category.toLowerCase()) {
        return true;
      }
      // Fallback to checking answers for question text containing category (original implementation)
      if (quiz.answers) {
        return quiz.answers.some(answer =>
          answer.questionText && answer.questionText.toLowerCase().includes(category.toLowerCase())
        );
      }
      return false;
    });
  }, [quizHistory]);

  // Computed properties
  const isQuizInProgress = currentSession !== null;

  return {
    // State
    quizHistory,
    currentSession,
    stats,
    isQuizInProgress,

    // Actions
    startQuiz,
    startNewQuiz: startQuiz, // Alias for test compatibility
    updateCurrentSession,
    recordAnswer,
    completeQuiz,
    submitQuiz, // Direct submission API for enhanced tests
    finishCurrentSession,
    resetCurrentSession,
    clearHistory,
    getTopicPerformance,
    getQuizById,
    getQuizzesByCategory
  };
};

// Helper functions
function calculateDuration(startTime: number, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

function calculateImprovementTrend(history: CompletedQuiz[]): 'insufficient_data' | 'improving' | 'declining' | 'stable' {
  if (history.length < 2) return 'insufficient_data';

  // Split history into first half and second half
  const firstHalf = history.slice(0, Math.floor(history.length / 2));
  const secondHalf = history.slice(Math.floor(history.length / 2));

  if (firstHalf.length === 0 || secondHalf.length === 0) return 'insufficient_data';

  const firstHalfAvg = firstHalf.reduce((sum, quiz) => sum + quiz.scorePercentage, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, quiz) => sum + quiz.scorePercentage, 0) / secondHalf.length;

  const difference = secondHalfAvg - firstHalfAvg;

  if (difference > 10) return 'improving';  // More than 10% improvement
  if (difference < -10) return 'declining'; // More than 10% decline
  return 'stable';
}

function identifyWeakAreas(history: CompletedQuiz[]): WeakArea[] {
  const topicPerformance: Record<string, { correct: number; total: number }> = {};

  // Defensive programming: ensure history is an array
  if (!history || !Array.isArray(history)) {
    return [];
  }

  history.forEach(quiz => {
    // Defensive programming: ensure quiz and quiz.answers exist and answers is an array
    if (!quiz || !quiz.answers || !Array.isArray(quiz.answers)) {
      return; // Skip this quiz if data is invalid
    }

    quiz.answers.forEach(answer => {
      // Defensive programming: ensure answer and answer.questionText exist
      if (!answer || !answer.questionText) {
        return; // Skip this answer if data is invalid
      }

      // Extract topic from question (simplified - in real app you'd have better categorization)
      const topics = extractTopicsFromQuestion(answer.questionText);

      // Defensive programming: ensure topics is an array
      if (!topics || !Array.isArray(topics)) {
        return; // Skip if topics extraction failed
      }

      topics.forEach(topic => {
        if (!topicPerformance[topic]) {
          topicPerformance[topic] = { correct: 0, total: 0 };
        }

        topicPerformance[topic].total++;
        if (answer.isCorrect) {
          topicPerformance[topic].correct++;
        }
      });
    });
  });

  // Find topics with < 70% accuracy
  return Object.entries(topicPerformance)
    .map(([topic, data]) => ({
      topic,
      accuracy: Math.round((data.correct / data.total) * 100),
      totalQuestions: data.total
    }))
    .filter(item => item.accuracy < 70 && item.totalQuestions >= 3)
    .sort((a, b) => a.accuracy - b.accuracy);
}

function extractTopicsFromQuestion(questionText: string): string[] {
  const topics: string[] = [];
  const text = questionText.toLowerCase();

  // Simple topic extraction based on keywords
  if (text.includes('pneumonia')) topics.push('pneumonia');
  if (text.includes('uti') || text.includes('urinary')) topics.push('uti');
  if (text.includes('sepsis')) topics.push('sepsis');
  if (text.includes('meningitis')) topics.push('meningitis');
  if (text.includes('antibiotic') || text.includes('antimicrobial')) topics.push('antibiotics');

  return topics.length > 0 ? topics : ['general'];
}

function calculateStreakCount(history: CompletedQuiz[]): number {
  if (history.length === 0) return 0;

  let streak = 0;
  // Count consecutive quizzes with score >= 80%
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].scorePercentage >= 80) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default useQuizProgress;
