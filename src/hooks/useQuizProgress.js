/**
 * useQuizProgress Hook
 * Custom hook to track quiz completion history and progress analytics
 * 
 * @returns {Object} - Quiz progress state and methods
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

const useQuizProgress = () => {
  const [quizHistory, setQuizHistory] = useLocalStorage('quizHistory', []);
  const [currentSession, setCurrentSession] = useState(null);

  // Calculate statistics - memoized for performance
  const stats = useMemo(() => {
    const totalQuizzes = quizHistory.length;
    const averageScore = totalQuizzes > 0 
      ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.scorePercentage, 0) / totalQuizzes)
      : 0;
    const bestScore = totalQuizzes > 0
      ? Math.max(...quizHistory.map(quiz => quiz.scorePercentage))
      : 0;
    const recentQuizzes = quizHistory.slice(-5).reverse(); // Last 5 quizzes
    
    return {
      totalQuizzes,
      averageScore,
      bestScore,
      recentQuizzes,
      improvementTrend: calculateImprovementTrend(quizHistory),
      weakAreas: identifyWeakAreas(quizHistory),
      streakCount: calculateStreakCount(quizHistory)
    };
  }, [quizHistory]);

  // Start a new quiz session
  const startQuiz = useCallback((quizId, totalQuestions) => {
    const session = {
      quizId,
      totalQuestions,
      startTime: new Date().toISOString(),
      answers: [],
      currentQuestion: 0
    };
    setCurrentSession(session);
    return session;
  }, []);

  // Record an answer
  const recordAnswer = useCallback((questionIndex, selectedAnswer, correctAnswer, questionText) => {
    if (!currentSession) return;

    const answerRecord = {
      questionIndex,
      questionText,
      selectedAnswer,
      correctAnswer,
      isCorrect: selectedAnswer === correctAnswer,
      timestamp: new Date().toISOString()
    };

    setCurrentSession(prev => ({
      ...prev,
      answers: [...prev.answers, answerRecord],
      currentQuestion: questionIndex + 1
    }));
  }, [currentSession]);

  // Complete the quiz and save to history
  const completeQuiz = useCallback(() => {
    if (!currentSession || currentSession.answers.length === 0) return null;

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

    // Add to history
    setQuizHistory(prev => [...prev, completedQuiz]);
    
    // Clear current session
    setCurrentSession(null);

    return completedQuiz;
  }, [currentSession, setQuizHistory]);

  // Reset current session
  const resetCurrentSession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setQuizHistory([]);
  }, [setQuizHistory]);

  // Get performance for a specific topic/category
  const getTopicPerformance = useCallback((topic) => {
    const topicQuizzes = quizHistory.filter(quiz => 
      quiz.answers.some(answer => 
        answer.questionText.toLowerCase().includes(topic.toLowerCase())
      )
    );

    if (topicQuizzes.length === 0) return null;

    const totalTopicQuestions = topicQuizzes.reduce((sum, quiz) => 
      sum + quiz.answers.filter(answer => 
        answer.questionText.toLowerCase().includes(topic.toLowerCase())
      ).length, 0
    );

    const correctTopicAnswers = topicQuizzes.reduce((sum, quiz) => 
      sum + quiz.answers.filter(answer => 
        answer.questionText.toLowerCase().includes(topic.toLowerCase()) && answer.isCorrect
      ).length, 0
    );

    return {
      topic,
      totalQuestions: totalTopicQuestions,
      correctAnswers: correctTopicAnswers,
      accuracy: Math.round((correctTopicAnswers / totalTopicQuestions) * 100)
    };
  }, [quizHistory]);

  return {
    // State
    quizHistory,
    currentSession,
    stats,
    
    // Actions
    startQuiz,
    recordAnswer,
    completeQuiz,
    resetCurrentSession,
    clearHistory,
    getTopicPerformance
  };
};

// Helper functions
function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end - start;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

function calculateImprovementTrend(history) {
  if (history.length < 2) return 'insufficient_data';
  
  const recent = history.slice(-5);
  const older = history.slice(-10, -5);
  
  if (older.length === 0) return 'insufficient_data';
  
  const recentAvg = recent.reduce((sum, quiz) => sum + quiz.scorePercentage, 0) / recent.length;
  const olderAvg = older.reduce((sum, quiz) => sum + quiz.scorePercentage, 0) / older.length;
  
  const difference = recentAvg - olderAvg;
  
  if (difference > 5) return 'improving';
  if (difference < -5) return 'declining';
  return 'stable';
}

function identifyWeakAreas(history) {
  const topicPerformance = {};
  
  history.forEach(quiz => {
    quiz.answers.forEach(answer => {
      // Extract topic from question (simplified - in real app you'd have better categorization)
      const topics = extractTopicsFromQuestion(answer.questionText);
      
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