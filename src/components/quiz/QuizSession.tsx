/**
 * QuizSession Component
 *
 * State machine orchestrating the complete quiz flow:
 * question → answer → explanation → (next question OR results)
 *
 * Key features:
 * - No auto-advance: user controls all navigation
 * - State machine phases: active, explanation, complete
 * - Integrates QuizQuestion, QuizExplanation, QuizResults
 *
 * Created: 2026-01-07
 * Phase: 04-quiz-system-core, Plan 03
 */

import React, { useState, useCallback } from 'react';
import { QuizQuestion as QuizQuestionType, DifficultyLevel } from '../../types/medical.types';
import QuizQuestion from './QuizQuestion';
import QuizExplanation from './QuizExplanation';
import QuizResults from './QuizResults';

type SessionPhase = 'active' | 'explanation' | 'complete';

interface QuizSessionProps {
  questions: QuizQuestionType[];
  onComplete: (score: number, total: number) => void;
  onExit: () => void;
  difficulty?: DifficultyLevel | 'all';
}

const QuizSession: React.FC<QuizSessionProps> = ({
  questions,
  onComplete,
  onExit,
  difficulty
}) => {
  // State machine phase
  const [phase, setPhase] = useState<SessionPhase>('active');

  // Quiz progress tracking
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Get current question
  const currentQuestion = questions[currentIndex];

  /**
   * Get the index of the correct answer option
   * QuizQuestion type has correctAnswer as string or string[]
   * We need to find its index in options array
   */
  const getCorrectAnswerIndex = useCallback((): number => {
    if (!currentQuestion?.options) return -1;
    const correctAnswer = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer[0]
      : currentQuestion.correctAnswer;
    return currentQuestion.options.findIndex(opt => opt === correctAnswer);
  }, [currentQuestion]);

  /**
   * Handle answer selection
   * Transition from 'active' → 'explanation'
   */
  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (phase !== 'active' || selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);

    // Check if correct
    const correctIndex = getCorrectAnswerIndex();
    if (answerIndex === correctIndex) {
      setScore(prev => prev + 1);
    }

    // Transition to explanation phase
    setPhase('explanation');
  }, [phase, selectedAnswer, getCorrectAnswerIndex]);

  /**
   * Handle "Next" button click in explanation
   * Either advance to next question or show results
   */
  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      // More questions: go to next
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setPhase('active');
    } else {
      // Last question: show results
      setPhase('complete');
      onComplete(score, questions.length);
    }
  }, [currentIndex, questions.length, score, onComplete]);

  /**
   * Handle retry - restart quiz from beginning
   */
  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setPhase('active');
  }, []);

  // Safety check for empty questions array
  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm text-center" data-testid="quiz-session-empty">
        <p className="text-gray-600">No questions available for this quiz.</p>
        <button
          onClick={onExit}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Exit
        </button>
      </div>
    );
  }

  // Results phase
  if (phase === 'complete') {
    return (
      <QuizResults
        score={score}
        totalQuestions={questions.length}
        onRetry={handleRetry}
        onExit={onExit}
        difficulty={difficulty}
      />
    );
  }

  // Active or Explanation phase
  const correctIndex = getCorrectAnswerIndex();
  const isCorrect = selectedAnswer === correctIndex;
  const isAnswered = phase === 'explanation';
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="space-y-4" data-testid="quiz-session">
      {/* Question Component */}
      <QuizQuestion
        question={currentQuestion.question}
        options={currentQuestion.options || []}
        selectedAnswer={selectedAnswer}
        correctAnswer={correctIndex}
        onAnswerSelect={handleAnswerSelect}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        difficulty={currentQuestion.difficulty}
        isAnswered={isAnswered}
      />

      {/* Explanation Component (shown after answering) */}
      {phase === 'explanation' && selectedAnswer !== null && (
        <QuizExplanation
          isCorrect={isCorrect}
          explanation={currentQuestion.explanation}
          correctAnswer={currentQuestion.options?.[correctIndex] || ''}
          selectedAnswer={currentQuestion.options?.[selectedAnswer] || ''}
          onNext={handleNext}
          isLastQuestion={isLastQuestion}
        />
      )}
    </div>
  );
};

export default QuizSession;
