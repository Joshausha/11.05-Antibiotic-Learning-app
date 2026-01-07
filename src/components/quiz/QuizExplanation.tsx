/**
 * QuizExplanation Component
 *
 * The teaching moment - where real learning happens after each quiz question.
 * Designed with board-prep UX patterns (UWorld/Board Vitals style).
 *
 * Key features:
 * - Visual correct/incorrect feedback with distinct styling
 * - Prominently displayed explanation with clear visual hierarchy
 * - User-controlled "Next Question" button (NO auto-advance)
 *
 * Created: 2026-01-07
 * Phase: 04-quiz-system-core, Plan 01
 */

import React from 'react';
import { CheckCircle, XCircle, ArrowRight, Trophy } from 'lucide-react';

interface QuizExplanationProps {
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
  selectedAnswer: string;
  onNext: () => void;
  isLastQuestion?: boolean;
}

const QuizExplanation: React.FC<QuizExplanationProps> = ({
  isCorrect,
  explanation,
  correctAnswer,
  selectedAnswer,
  onNext,
  isLastQuestion = false
}) => {
  return (
    <div
      className={`mt-6 rounded-lg border-2 ${
        isCorrect
          ? 'bg-green-50 border-green-300'
          : 'bg-amber-50 border-amber-300'
      }`}
      data-testid="quiz-explanation"
    >
      {/* Feedback Header */}
      <div
        className={`px-4 py-3 rounded-t-lg flex items-center gap-3 ${
          isCorrect ? 'bg-green-100' : 'bg-amber-100'
        }`}
      >
        {isCorrect ? (
          <>
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-lg font-bold text-green-800">Correct!</span>
          </>
        ) : (
          <>
            <XCircle className="w-6 h-6 text-amber-600" />
            <div>
              <span className="text-lg font-bold text-amber-800">Incorrect</span>
              <span className="text-amber-700 ml-2">
                — The answer is <strong>{correctAnswer}</strong>
              </span>
            </div>
          </>
        )}
      </div>

      {/* Explanation Content */}
      <div className="p-4">
        {/* Answer Context (for incorrect) */}
        {!isCorrect && (
          <div className="mb-4 text-sm text-amber-700">
            You selected: <span className="font-medium">{selectedAnswer}</span>
          </div>
        )}

        {/* Explanation Section */}
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h4 className="text-blue-800 font-semibold mb-2 flex items-center gap-2">
            <span className="text-lg">💡</span>
            Explanation
          </h4>
          <p className="text-gray-700 leading-relaxed">{explanation}</p>
        </div>

        {/* Next Button - User controls when to proceed */}
        <button
          onClick={onNext}
          className={`mt-4 w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-colors ${
            isLastQuestion
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          data-testid="next-button"
        >
          {isLastQuestion ? (
            <>
              <Trophy className="w-5 h-5" />
              See Results
            </>
          ) : (
            <>
              Next Question
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizExplanation;
