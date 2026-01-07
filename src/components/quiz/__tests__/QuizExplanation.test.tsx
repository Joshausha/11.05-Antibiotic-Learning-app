/**
 * Tests for QuizExplanation component
 *
 * Tests the board-prep style explanation component that is
 * "THE teaching moment" - where real learning happens.
 *
 * Created: 2026-01-07
 * Phase: 04-quiz-system-core, Plan 01
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizExplanation from '../QuizExplanation';

describe('QuizExplanation Component', () => {
  const defaultProps = {
    isCorrect: true,
    explanation: 'This antibiotic works by inhibiting cell wall synthesis.',
    correctAnswer: 'Penicillin',
    selectedAnswer: 'Penicillin',
    onNext: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Correct Answer State', () => {
    test('renders "Correct!" message when isCorrect=true', () => {
      render(<QuizExplanation {...defaultProps} isCorrect={true} />);

      expect(screen.getByText('Correct!')).toBeInTheDocument();
    });

    test('displays green background for correct answers', () => {
      render(<QuizExplanation {...defaultProps} isCorrect={true} />);

      const container = screen.getByTestId('quiz-explanation');
      expect(container).toHaveClass('bg-green-50', 'border-green-300');
    });

    test('does not show selected answer when correct', () => {
      render(<QuizExplanation {...defaultProps} isCorrect={true} />);

      expect(screen.queryByText(/You selected:/)).not.toBeInTheDocument();
    });
  });

  describe('Incorrect Answer State', () => {
    test('renders "Incorrect" message when isCorrect=false', () => {
      render(
        <QuizExplanation
          {...defaultProps}
          isCorrect={false}
          selectedAnswer="Amoxicillin"
        />
      );

      expect(screen.getByText('Incorrect')).toBeInTheDocument();
    });

    test('shows correct answer when incorrect', () => {
      render(
        <QuizExplanation
          {...defaultProps}
          isCorrect={false}
          correctAnswer="Vancomycin"
          explanation="Vancomycin is used for MRSA coverage."
        />
      );

      // The correct answer appears in the "The answer is X" text
      expect(screen.getByText(/The answer is/)).toBeInTheDocument();
      expect(screen.getByText('Vancomycin', { selector: 'strong' })).toBeInTheDocument();
    });

    test('displays amber/yellow background for incorrect answers', () => {
      render(<QuizExplanation {...defaultProps} isCorrect={false} />);

      const container = screen.getByTestId('quiz-explanation');
      expect(container).toHaveClass('bg-amber-50', 'border-amber-300');
    });

    test('shows what the user selected when incorrect', () => {
      render(
        <QuizExplanation
          {...defaultProps}
          isCorrect={false}
          selectedAnswer="Amoxicillin"
        />
      );

      expect(screen.getByText(/You selected:/)).toBeInTheDocument();
      expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
    });
  });

  describe('Explanation Content', () => {
    test('renders explanation text', () => {
      const explanation = 'Penicillins work by binding to PBPs and disrupting peptidoglycan synthesis.';
      render(<QuizExplanation {...defaultProps} explanation={explanation} />);

      expect(screen.getByText(explanation)).toBeInTheDocument();
    });

    test('displays explanation heading', () => {
      render(<QuizExplanation {...defaultProps} />);

      expect(screen.getByText('Explanation')).toBeInTheDocument();
    });

    test('shows explanation emoji/icon', () => {
      render(<QuizExplanation {...defaultProps} />);

      // The lightbulb emoji is used as visual marker
      expect(screen.getByText(/💡/)).toBeInTheDocument();
    });
  });

  describe('Navigation Button', () => {
    test('calls onNext when button clicked', () => {
      const mockOnNext = jest.fn();
      render(<QuizExplanation {...defaultProps} onNext={mockOnNext} />);

      fireEvent.click(screen.getByTestId('next-button'));

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    test('shows "Next Question" when not last question', () => {
      render(<QuizExplanation {...defaultProps} isLastQuestion={false} />);

      expect(screen.getByText(/Next Question/)).toBeInTheDocument();
    });

    test('shows "See Results" when isLastQuestion=true', () => {
      render(<QuizExplanation {...defaultProps} isLastQuestion={true} />);

      expect(screen.getByText(/See Results/)).toBeInTheDocument();
    });

    test('button has different styling for last question', () => {
      render(<QuizExplanation {...defaultProps} isLastQuestion={true} />);

      const button = screen.getByTestId('next-button');
      expect(button).toHaveClass('bg-purple-600');
    });

    test('button has blue styling for non-last question', () => {
      render(<QuizExplanation {...defaultProps} isLastQuestion={false} />);

      const button = screen.getByTestId('next-button');
      expect(button).toHaveClass('bg-blue-600');
    });
  });

  describe('User Control (No Auto-advance)', () => {
    test('component does not auto-advance', () => {
      jest.useFakeTimers();
      const mockOnNext = jest.fn();

      render(<QuizExplanation {...defaultProps} onNext={mockOnNext} />);

      // Advance timers - should NOT trigger onNext
      jest.advanceTimersByTime(5000);

      expect(mockOnNext).not.toHaveBeenCalled();

      jest.useRealTimers();
    });

    test('onNext only called on button click', () => {
      const mockOnNext = jest.fn();
      render(<QuizExplanation {...defaultProps} onNext={mockOnNext} />);

      // Initially not called
      expect(mockOnNext).not.toHaveBeenCalled();

      // Click button
      fireEvent.click(screen.getByTestId('next-button'));

      // Now called exactly once
      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });
  });
});
