/**
 * QuizSession Integration Tests
 *
 * Tests the complete quiz flow:
 * - Answer question → see explanation → click next → repeat → see results
 * - Score tracking
 * - Retry functionality
 * - Exit functionality
 *
 * Created: 2026-01-07
 * Phase: 04-quiz-system-core, Plan 03
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizSession from '../QuizSession';
import { QuizQuestion } from '../../../types/medical.types';

// Mock quiz questions for testing
const mockQuestions: QuizQuestion[] = [
  {
    id: 'test-1',
    question: 'Which antibiotic covers MRSA?',
    type: 'multiple-choice',
    difficulty: 'beginner',
    options: ['Ceftriaxone', 'Vancomycin', 'Azithromycin', 'Amoxicillin'],
    correctAnswer: 'Vancomycin',
    explanation: 'Vancomycin is a glycopeptide antibiotic with excellent MRSA coverage.',
    tags: ['MRSA', 'glycopeptide'],
    medicalAccuracyVerified: true,
    lastUpdated: '2026-01-07'
  },
  {
    id: 'test-2',
    question: 'Which antibiotic is first-line for strep throat?',
    type: 'multiple-choice',
    difficulty: 'beginner',
    options: ['Vancomycin', 'Ciprofloxacin', 'Amoxicillin', 'Doxycycline'],
    correctAnswer: 'Amoxicillin',
    explanation: 'Amoxicillin (or penicillin) is first-line for Group A strep pharyngitis.',
    tags: ['strep', 'penicillin'],
    medicalAccuracyVerified: true,
    lastUpdated: '2026-01-07'
  },
  {
    id: 'test-3',
    question: 'What class does ciprofloxacin belong to?',
    type: 'multiple-choice',
    difficulty: 'intermediate',
    options: ['Penicillin', 'Cephalosporin', 'Fluoroquinolone', 'Macrolide'],
    correctAnswer: 'Fluoroquinolone',
    explanation: 'Ciprofloxacin is a fluoroquinolone antibiotic.',
    tags: ['fluoroquinolone'],
    medicalAccuracyVerified: true,
    lastUpdated: '2026-01-07'
  }
];

describe('QuizSession', () => {
  const mockOnComplete = jest.fn();
  const mockOnExit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('renders first question', () => {
      render(
        <QuizSession
          questions={mockQuestions}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      expect(screen.getByTestId('quiz-session')).toBeInTheDocument();
      expect(screen.getByTestId('quiz-question')).toBeInTheDocument();
      expect(screen.getByText(/Which antibiotic covers MRSA/)).toBeInTheDocument();
      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();
    });

    it('renders empty state when no questions', () => {
      render(
        <QuizSession
          questions={[]}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      expect(screen.getByTestId('quiz-session-empty')).toBeInTheDocument();
      expect(screen.getByText(/No questions available/)).toBeInTheDocument();
    });
  });

  describe('question flow', () => {
    it('shows explanation after selecting an answer', () => {
      render(
        <QuizSession
          questions={mockQuestions}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      // Answer should not be visible yet
      expect(screen.queryByTestId('quiz-explanation')).not.toBeInTheDocument();

      // Select correct answer (Vancomycin - index 1)
      fireEvent.click(screen.getByTestId('option-1'));

      // Explanation should now be visible
      expect(screen.getByTestId('quiz-explanation')).toBeInTheDocument();
      expect(screen.getByText('Correct!')).toBeInTheDocument();
    });

    it('advances to next question when clicking Next', () => {
      render(
        <QuizSession
          questions={mockQuestions}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      // Answer first question
      fireEvent.click(screen.getByTestId('option-1'));

      // Click Next
      fireEvent.click(screen.getByTestId('next-button'));

      // Should now be on question 2
      expect(screen.getByText('Question 2 of 3')).toBeInTheDocument();
      expect(screen.getByText(/strep throat/)).toBeInTheDocument();
    });

    it('shows results after completing all questions', () => {
      render(
        <QuizSession
          questions={mockQuestions}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      // Answer question 1 (correct - Vancomycin is index 1)
      fireEvent.click(screen.getByTestId('option-1'));
      fireEvent.click(screen.getByTestId('next-button'));

      // Answer question 2 (correct - Amoxicillin is index 2)
      fireEvent.click(screen.getByTestId('option-2'));
      fireEvent.click(screen.getByTestId('next-button'));

      // Answer question 3 (correct - Fluoroquinolone is index 2)
      fireEvent.click(screen.getByTestId('option-2'));
      fireEvent.click(screen.getByTestId('next-button'));

      // Should show results
      expect(screen.getByTestId('quiz-results')).toBeInTheDocument();
      expect(mockOnComplete).toHaveBeenCalledWith(3, 3);
    });

    it('shows "See Results" on last question', () => {
      render(
        <QuizSession
          questions={mockQuestions}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      // Answer questions 1 and 2
      fireEvent.click(screen.getByTestId('option-1'));
      fireEvent.click(screen.getByTestId('next-button'));
      fireEvent.click(screen.getByTestId('option-2'));
      fireEvent.click(screen.getByTestId('next-button'));

      // On question 3, answer
      fireEvent.click(screen.getByTestId('option-2'));

      // Button should say "See Results"
      expect(screen.getByText(/See Results/)).toBeInTheDocument();
    });
  });

  describe('score tracking', () => {
    it('tracks correct answers', () => {
      render(
        <QuizSession
          questions={mockQuestions}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      // Answer all correctly (indices: 1, 2, 2)
      fireEvent.click(screen.getByTestId('option-1'));
      fireEvent.click(screen.getByTestId('next-button'));
      fireEvent.click(screen.getByTestId('option-2'));
      fireEvent.click(screen.getByTestId('next-button'));
      fireEvent.click(screen.getByTestId('option-2'));
      fireEvent.click(screen.getByTestId('next-button'));

      // Should show 3/3
      expect(screen.getByTestId('score-display')).toHaveTextContent('3/3');
      expect(screen.getByTestId('percentage-display')).toHaveTextContent('100%');
    });

    it('tracks incorrect answers', () => {
      render(
        <QuizSession
          questions={mockQuestions}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      // Answer all incorrectly (all index 0)
      fireEvent.click(screen.getByTestId('option-0'));
      fireEvent.click(screen.getByTestId('next-button'));
      fireEvent.click(screen.getByTestId('option-0'));
      fireEvent.click(screen.getByTestId('next-button'));
      fireEvent.click(screen.getByTestId('option-0'));
      fireEvent.click(screen.getByTestId('next-button'));

      // Should show 0/3
      expect(screen.getByTestId('score-display')).toHaveTextContent('0/3');
      expect(screen.getByTestId('percentage-display')).toHaveTextContent('0%');
    });

    it('shows Incorrect feedback for wrong answers', () => {
      render(
        <QuizSession
          questions={mockQuestions}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      // Select wrong answer
      fireEvent.click(screen.getByTestId('option-0'));

      // Should show Incorrect
      expect(screen.getByText('Incorrect')).toBeInTheDocument();
      expect(screen.getByText(/The answer is/)).toBeInTheDocument();
    });
  });

  describe('retry functionality', () => {
    it('restarts quiz when clicking retry', () => {
      render(
        <QuizSession
          questions={mockQuestions}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      // Complete the quiz
      fireEvent.click(screen.getByTestId('option-1'));
      fireEvent.click(screen.getByTestId('next-button'));
      fireEvent.click(screen.getByTestId('option-2'));
      fireEvent.click(screen.getByTestId('next-button'));
      fireEvent.click(screen.getByTestId('option-2'));
      fireEvent.click(screen.getByTestId('next-button'));

      // On results, click retry
      fireEvent.click(screen.getByTestId('retry-button'));

      // Should be back at question 1
      expect(screen.getByTestId('quiz-session')).toBeInTheDocument();
      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();
    });
  });

  describe('exit functionality', () => {
    it('calls onExit when clicking exit on results', () => {
      render(
        <QuizSession
          questions={mockQuestions}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      // Complete the quiz
      fireEvent.click(screen.getByTestId('option-1'));
      fireEvent.click(screen.getByTestId('next-button'));
      fireEvent.click(screen.getByTestId('option-2'));
      fireEvent.click(screen.getByTestId('next-button'));
      fireEvent.click(screen.getByTestId('option-2'));
      fireEvent.click(screen.getByTestId('next-button'));

      // Click exit
      fireEvent.click(screen.getByTestId('exit-button'));

      expect(mockOnExit).toHaveBeenCalledTimes(1);
    });

    it('calls onExit when clicking exit on empty state', () => {
      render(
        <QuizSession
          questions={[]}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      fireEvent.click(screen.getByText('Exit'));
      expect(mockOnExit).toHaveBeenCalledTimes(1);
    });
  });

  describe('user-controlled navigation', () => {
    it('does not auto-advance after answering', () => {
      jest.useFakeTimers();

      render(
        <QuizSession
          questions={mockQuestions}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      // Answer question
      fireEvent.click(screen.getByTestId('option-1'));

      // Wait some time
      jest.advanceTimersByTime(5000);

      // Should still be on question 1 with explanation visible
      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();
      expect(screen.getByTestId('quiz-explanation')).toBeInTheDocument();

      jest.useRealTimers();
    });

    it('prevents multiple answer selections', () => {
      render(
        <QuizSession
          questions={mockQuestions}
          onComplete={mockOnComplete}
          onExit={mockOnExit}
        />
      );

      // Select first answer
      fireEvent.click(screen.getByTestId('option-0'));

      // Try to select another answer
      fireEvent.click(screen.getByTestId('option-1'));

      // Should still show first selection (wrong answer)
      expect(screen.getByText('Incorrect')).toBeInTheDocument();
      // The correct answer indicator should show on Vancomycin (index 1)
      expect(screen.getByTestId('correct-icon')).toBeInTheDocument();
    });
  });
});
