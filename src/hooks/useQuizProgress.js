/**
 * useQuizProgress Hook
 * Custom hook to track quiz completion history and progress analytics
 * 
 * @returns {Object} - Quiz progress state and methods
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import useLocalStorage from './useLocalStorage';

const useQuizProgress = () => {
  const [quizHistory, setQuizHistory] = useLocalStorage('quizHistory', []);
  const [currentSession, setCurrentSession] = useState(null);
  
  // Use refs for stable access to latest values in callbacks
  const quizHistoryRef = useRef(quizHistory);
  const setQuizHistoryRef = useRef(setQuizHistory);
  
  // Update refs whenever values change
  useEffect(() => {
    quizHistoryRef.current = quizHistory;
  }, [quizHistory]);
  
  useEffect(() => {
    setQuizHistoryRef.current = setQuizHistory;
  }, [setQuizHistory]);

  // Stable empty stats object for referential stability
  const emptyStats = useMemo(() => ({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    recentQuizzes: [],
    improvementTrend: 'insufficient_data',
    weakAreas: [],
    streakCount: 0
  }), []);

  // Calculate statistics - memoized for performance with defensive programming
  const stats = useMemo(() => {
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
  const startQuiz = useCallback((quizIdOrConfig, totalQuestions) => {
    let session;
    const startTime = new Date().toISOString(); // Use ISO string for test compatibility
    
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
        totalQuestions,
        startTime, // Timestamp format
        answers: [],
        currentQuestion: 0
      };
    }
    
    setCurrentSession(session);
    return session;
  }, []);

  // Submit a completed quiz directly (enhanced API)
  const submitQuiz = useCallback((quizData) => {
    if (!quizData) return null;
    
    // Add to history directly using ref for stability
    setQuizHistoryRef.current(prev => [...prev, quizData]);
    return quizData;
  }, []); // No dependencies for referential stability

  // Update current session with new data
  const updateCurrentSession = useCallback((updateData) => {
    setCurrentSession(prevSession => {
      if (!prevSession) return prevSession;
      return { ...prevSession, ...updateData };
    });
  }, []);

  // Record an answer
  const recordAnswer = useCallback((questionIndex, selectedAnswer, correctAnswer, questionText) => {
    setCurrentSession(prevSession => {
      if (!prevSession) return prevSession; // Gracefully handle missing session

      const answerRecord = {
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
  const completeQuiz = useCallback(() => {
    if (!currentSession) return null;
    
    // Handle edge case for quiz with zero questions
    if (currentSession.totalQuestions === 0) {
      setCurrentSession(null);
      return null;
    }

    const endTime = new Date().toISOString();
    const correctAnswers = currentSession.answers.filter(answer => answer.isCorrect).length;
    const scorePercentage = Math.round((correctAnswers / currentSession.totalQuestions) * 100);
    
    const completedQuiz = {
      ...currentSession,
      endTime,
      correctAnswers,
      scorePercentage,
      duration: calculateDuration(currentSession.startTime, endTime),
      completedAt: endTime
    };

    // Add to history using ref for consistency
    setQuizHistoryRef.current(prev => [...prev, completedQuiz]);
    
    // Clear current session
    setCurrentSession(null);

    return completedQuiz;
  }, [currentSession]); // Removed setQuizHistory dependency for better stability

  // Finish current session (alias for completeQuiz)
  const finishCurrentSession = useCallback(() => {
    return completeQuiz();
  }, [completeQuiz]);

  // Reset current session
  const resetCurrentSession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setQuizHistoryRef.current([]);
  }, []); // No dependencies for referential stability

  // Get performance for a specific topic/category
  const getTopicPerformance = useCallback((topic) => {
    const topicQuizzes = quizHistoryRef.current.filter(quiz => 
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
  }, []); // No dependencies for referential stability

  // Get quiz by ID - look for both 'id' and 'quizId' fields for compatibility
  const getQuizById = useCallback((quizId) => {
    const quiz = quizHistoryRef.current.find(quiz => quiz && (quiz.id === quizId || quiz.quizId === quizId));
    return quiz; // Return undefined if not found (default behavior)
  }, []); // No dependencies for referential stability

  // Get quizzes by category - look for direct category field
  const getQuizzesByCategory = useCallback((category) => {
    if (!category) return [];
    return quizHistoryRef.current.filter(quiz => {
      if (!quiz) return false;
      // Check direct category field first (enhanced tests)
      if (quiz.category && quiz.category.toLowerCase() === category.toLowerCase()) {
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
  }, []); // No dependencies for referential stability

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
};;;;;;;;;

// Helper functions
function calculateDuration(startTime, endTime) {
  // Handle both timestamp numbers and ISO strings
  const start = typeof startTime === 'number' ? new Date(startTime) : new Date(startTime);
  const end = typeof endTime === 'number' ? new Date(endTime) : new Date(endTime);
  const durationMs = end - start;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

function calculateImprovementTrend(history) {
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

function identifyWeakAreas(history) {
  const topicPerformance = {};
  
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

function extractTopicsFromQuestion(questionText) {
  const topics = [];
  const text = questionText.toLowerCase();
  
  // Simple topic extraction based on keywords
  if (text.includes('pneumonia')) topics.push('pneumonia');
  if (text.includes('uti') || text.includes('urinary')) topics.push('uti');
  if (text.includes('sepsis')) topics.push('sepsis');
  if (text.includes('meningitis')) topics.push('meningitis');
  if (text.includes('antibiotic') || text.includes('antimicrobial')) topics.push('antibiotics');
  
  return topics.length > 0 ? topics : ['general'];
}

function calculateStreakCount(history) {
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