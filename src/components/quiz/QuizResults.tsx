/**
 * QuizResults Component
 *
 * End-of-session results display showing score, performance feedback, and actions.
 * Designed with board-prep UX patterns (UWorld/Board Vitals style).
 *
 * Key features:
 * - Score display with percentage
 * - Progress bar visualization
 * - Performance-appropriate feedback messages
 * - Retry and exit actions
 *
 * Created: 2026-01-07
 * Phase: 04-quiz-system-core, Plan 03
 */

import React from 'react';
import { Trophy, RefreshCw, LogOut, Star, Target, BookOpen } from 'lucide-react';
import { DifficultyLevel } from '../../types/medical.types';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
  onExit: () => void;
  difficulty?: DifficultyLevel | 'all';
}

interface PerformanceLevel {
  threshold: number;
  icon: React.ReactNode;
  title: string;
  message: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  onRetry,
  onExit,
  difficulty
}) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  /**
   * Get performance level based on score percentage
   */
  const getPerformanceLevel = (): PerformanceLevel => {
    if (percentage >= 90) {
      return {
        threshold: 90,
        icon: <Trophy className="w-12 h-12 text-green-600" />,
        title: 'Excellent! 🎉',
        message: "Outstanding work! You've demonstrated mastery of this material.",
        colorClass: 'text-green-700',
        bgClass: 'bg-green-50',
        borderClass: 'border-green-300'
      };
    } else if (percentage >= 70) {
      return {
        threshold: 70,
        icon: <Star className="w-12 h-12 text-yellow-600" />,
        title: 'Good job! 👍',
        message: 'Solid performance! Review the explanations for any questions you missed.',
        colorClass: 'text-yellow-700',
        bgClass: 'bg-yellow-50',
        borderClass: 'border-yellow-300'
      };
    } else {
      return {
        threshold: 0,
        icon: <BookOpen className="w-12 h-12 text-red-600" />,
        title: 'Keep studying! 📚',
        message: "Don't be discouraged! Use this as a learning opportunity. Review the material and try again.",
        colorClass: 'text-red-700',
        bgClass: 'bg-red-50',
        borderClass: 'border-red-300'
      };
    }
  };

  const performance = getPerformanceLevel();

  /**
   * Get difficulty label display
   */
  const getDifficultyLabel = (): string | null => {
    if (!difficulty) return null;
    if (difficulty === 'all') return 'All Levels';
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  return (
    <div
      className="bg-white rounded-xl p-8 shadow-sm max-w-lg mx-auto"
      data-testid="quiz-results"
    >
      {/* Performance Header */}
      <div
        className={`text-center p-6 rounded-lg border-2 ${performance.bgClass} ${performance.borderClass} mb-6`}
      >
        <div className="flex justify-center mb-4" data-testid="performance-icon">
          {performance.icon}
        </div>
        <h2
          className={`text-2xl font-bold mb-2 ${performance.colorClass}`}
          data-testid="performance-title"
        >
          {performance.title}
        </h2>
        <p className={`text-sm ${performance.colorClass}`} data-testid="performance-message">
          {performance.message}
        </p>
      </div>

      {/* Score Display */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Target className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-700">Your Score</span>
        </div>
        <div className="text-5xl font-bold text-gray-900" data-testid="score-display">
          {score}/{totalQuestions}
        </div>
        <div className="text-2xl text-gray-600 mt-1" data-testid="percentage-display">
          {percentage}%
        </div>
        {difficulty && (
          <div className="text-sm text-gray-500 mt-2" data-testid="difficulty-label">
            Difficulty: {getDifficultyLabel()}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div
          className="h-4 bg-gray-200 rounded-full overflow-hidden"
          data-testid="progress-bar-container"
        >
          <div
            className={`h-full transition-all duration-500 ${
              percentage >= 90
                ? 'bg-green-500'
                : percentage >= 70
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
            data-testid="progress-bar-fill"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          data-testid="retry-button"
        >
          <RefreshCw className="w-5 h-5" />
          Take Again
        </button>
        <button
          onClick={onExit}
          className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          data-testid="exit-button"
        >
          <LogOut className="w-5 h-5" />
          Exit Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
