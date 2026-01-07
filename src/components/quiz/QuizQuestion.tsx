/**
 * QuizQuestion Component
 *
 * Single question display with answer options in board-prep style (UWorld/Board Vitals).
 * Handles question display, option selection, and correct/incorrect visual feedback.
 *
 * Key features:
 * - Clear A, B, C, D option lettering
 * - Visual feedback: green (correct), red (incorrect user choice), gray (other)
 * - Disabled state after answer selection
 * - Question number badge with progress
 *
 * Created: 2026-01-07
 * Phase: 04-quiz-system-core, Plan 02
 */

import React from 'react';
import { DifficultyLevel } from '../../types/medical.types';

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  onAnswerSelect: (index: number) => void;
  questionNumber: number;
  totalQuestions: number;
  difficulty?: DifficultyLevel;
  isAnswered: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
  difficulty,
  isAnswered
}) => {
  /**
   * Get option styling based on state:
   * - Default: gray border, hover blue highlight
   * - Selected (not revealed): blue highlight
   * - Correct (after answer): green background/border with ✓
   * - Incorrect (user's wrong choice): red background/border with ✗
   * - Other options (after answer): muted gray
   */
  const getOptionClassName = (index: number): string => {
    const baseClass = 'w-full p-4 text-left border-2 rounded-lg transition-all';

    if (!isAnswered) {
      // Before answer is revealed - allow selection
      return `${baseClass} border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer`;
    }

    // After answer is revealed
    const isCorrect = index === correctAnswer;
    const isSelected = index === selectedAnswer;

    if (isCorrect) {
      return `${baseClass} bg-green-50 border-green-500 text-green-800`;
    } else if (isSelected && !isCorrect) {
      return `${baseClass} bg-red-50 border-red-500 text-red-800`;
    } else {
      return `${baseClass} border-gray-200 text-gray-500`;
    }
  };

  /**
   * Get difficulty badge styling
   */
  const getDifficultyBadge = () => {
    if (!difficulty) return null;

    const styles: Record<DifficultyLevel, { bg: string; text: string }> = {
      beginner: { bg: 'bg-green-100', text: 'text-green-700' },
      intermediate: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      advanced: { bg: 'bg-red-100', text: 'text-red-700' }
    };

    const style = styles[difficulty];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text} capitalize`}
        data-testid="difficulty-badge"
      >
        {difficulty}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm" data-testid="quiz-question">
      {/* Header with question number and difficulty */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
          data-testid="question-number"
        >
          Question {questionNumber} of {totalQuestions}
        </span>
        {getDifficultyBadge()}
      </div>

      {/* Question stem */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold leading-relaxed" data-testid="question-text">
          {question}
        </h3>
      </div>

      {/* Answer options */}
      <div className="space-y-3" data-testid="answer-options">
        {options.map((option, index) => {
          const isCorrect = index === correctAnswer;
          const isSelected = index === selectedAnswer;

          return (
            <button
              key={index}
              className={getOptionClassName(index)}
              onClick={() => !isAnswered && onAnswerSelect(index)}
              disabled={isAnswered}
              data-testid={`option-${index}`}
            >
              <div className="flex items-start gap-3">
                {/* Option letter (A, B, C, D) */}
                <span className="font-semibold text-sm mt-1 min-w-[1.5rem]">
                  {String.fromCharCode(65 + index)}.
                </span>
                {/* Option text */}
                <span className="flex-1 text-left">{option}</span>
                {/* Correct/incorrect indicators */}
                {isAnswered && isCorrect && (
                  <span className="text-green-600 font-semibold text-lg" data-testid="correct-icon">
                    ✓
                  </span>
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <span className="text-red-600 font-semibold text-lg" data-testid="incorrect-icon">
                    ✗
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizQuestion;
