/**
 * QuizStartScreen Component
 *
 * Quiz configuration and start interface with clean board-prep UX.
 * Provides difficulty selection and session overview before starting.
 *
 * Key features:
 * - Difficulty selection (All, Beginner, Intermediate, Advanced)
 * - Question count per difficulty
 * - Quiz features list
 * - Prominent Start Quiz button
 *
 * Simplified from QuizTab.tsx - no spaced repetition toggle (Phase 5 scope)
 *
 * Created: 2026-01-07
 * Phase: 04-quiz-system-core, Plan 02
 */

import React from 'react';
import { BookOpen, Lightbulb, CheckCircle, Clock } from 'lucide-react';
import { DifficultyLevel } from '../../types/medical.types';

interface DifficultyStats {
  all: number;
  beginner: number;
  intermediate: number;
  advanced: number;
}

interface QuizStartScreenProps {
  totalQuestions: number;
  onStart: () => void;
  difficultyStats?: DifficultyStats;
  selectedDifficulty: DifficultyLevel | 'all';
  onDifficultyChange: (difficulty: DifficultyLevel | 'all') => void;
}

type DifficultyOption = {
  key: DifficultyLevel | 'all';
  label: string;
  icon: string;
  color: string;
};

const difficultyOptions: DifficultyOption[] = [
  { key: 'all', label: 'All Levels', icon: '📚', color: 'blue' },
  { key: 'beginner', label: 'Beginner', icon: '🌱', color: 'green' },
  { key: 'intermediate', label: 'Intermediate', icon: '🎯', color: 'yellow' },
  { key: 'advanced', label: 'Advanced', icon: '🔥', color: 'red' }
];

const QuizStartScreen: React.FC<QuizStartScreenProps> = ({
  totalQuestions,
  onStart,
  difficultyStats,
  selectedDifficulty,
  onDifficultyChange
}) => {
  /**
   * Get button styling based on selection and color
   */
  const getButtonStyle = (key: string, color: string): string => {
    const isSelected = selectedDifficulty === key;
    const baseClass = 'p-4 rounded-lg border-2 transition-all text-sm';

    if (isSelected) {
      // Selected state with color-specific styling
      const selectedStyles: Record<string, string> = {
        blue: 'bg-blue-50 border-blue-500 text-blue-800',
        green: 'bg-green-50 border-green-500 text-green-800',
        yellow: 'bg-yellow-50 border-yellow-500 text-yellow-800',
        red: 'bg-red-50 border-red-500 text-red-800'
      };
      return `${baseClass} ${selectedStyles[color]}`;
    }

    return `${baseClass} bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300`;
  };

  /**
   * Get question count for a difficulty level
   */
  const getQuestionCount = (key: DifficultyLevel | 'all'): number => {
    if (!difficultyStats) return 0;
    return difficultyStats[key] || 0;
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm" data-testid="quiz-start-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Knowledge Assessment</h2>
        <p className="text-gray-600">
          Test your understanding of infectious diseases and antimicrobial therapy with{' '}
          <strong data-testid="total-questions">{totalQuestions}</strong> clinical questions.
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Difficulty Level
        </h3>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          data-testid="difficulty-selection"
        >
          {difficultyOptions.map(({ key, label, icon, color }) => (
            <button
              key={key}
              className={getButtonStyle(key, color)}
              onClick={() => onDifficultyChange(key)}
              data-testid={`difficulty-${key}`}
            >
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-medium">{label}</div>
              {difficultyStats && (
                <div className="text-xs text-gray-500 mt-1">
                  {getQuestionCount(key)} questions
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Features */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-3">Quiz Features:</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Evidence-based clinical scenarios
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Detailed explanations for each answer
          </li>
          <li className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Immediate feedback on your responses
          </li>
        </ul>
      </div>

      {/* Start Quiz Button */}
      <div className="text-center">
        <button
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onStart}
          disabled={totalQuestions === 0}
          data-testid="start-quiz-button"
        >
          Start Quiz ({totalQuestions} questions)
        </button>
      </div>
    </div>
  );
};

export default QuizStartScreen;
