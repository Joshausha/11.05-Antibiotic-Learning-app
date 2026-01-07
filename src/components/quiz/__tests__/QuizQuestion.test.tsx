/**
 * QuizQuestion Component Tests
 *
 * Tests for the single question display component.
 * Covers rendering, option selection, and state handling.
 *
 * Created: 2026-01-07
 * Phase: 04-quiz-system-core, Plan 02
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizQuestion from '../QuizQuestion';

describe('QuizQuestion', () => {
  const defaultProps = {
    question: 'Which antibiotic has excellent MRSA coverage?',
    options: ['Ceftriaxone', 'Vancomycin', 'Azithromycin', 'Ciprofloxacin'],
    selectedAnswer: null,
    correctAnswer: 1,
    onAnswerSelect: jest.fn(),
    questionNumber: 3,
    totalQuestions: 10,
    isAnswered: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders question text', () => {
      render(<QuizQuestion {...defaultProps} />);
      expect(screen.getByTestId('question-text')).toHaveTextContent(
        'Which antibiotic has excellent MRSA coverage?'
      );
    });

    it('renders all answer options with A, B, C, D labels', () => {
      render(<QuizQuestion {...defaultProps} />);

      // Text content merges without space between spans
      expect(screen.getByTestId('option-0')).toHaveTextContent('A.Ceftriaxone');
      expect(screen.getByTestId('option-1')).toHaveTextContent('B.Vancomycin');
      expect(screen.getByTestId('option-2')).toHaveTextContent('C.Azithromycin');
      expect(screen.getByTestId('option-3')).toHaveTextContent('D.Ciprofloxacin');
    });

    it('renders question number badge', () => {
      render(<QuizQuestion {...defaultProps} />);
      expect(screen.getByTestId('question-number')).toHaveTextContent('Question 3 of 10');
    });

    it('renders difficulty badge when provided', () => {
      render(<QuizQuestion {...defaultProps} difficulty="intermediate" />);
      expect(screen.getByTestId('difficulty-badge')).toHaveTextContent('intermediate');
    });

    it('does not render difficulty badge when not provided', () => {
      render(<QuizQuestion {...defaultProps} />);
      expect(screen.queryByTestId('difficulty-badge')).not.toBeInTheDocument();
    });
  });

  describe('answer selection', () => {
    it('calls onAnswerSelect when option clicked', () => {
      const onAnswerSelect = jest.fn();
      render(<QuizQuestion {...defaultProps} onAnswerSelect={onAnswerSelect} />);

      fireEvent.click(screen.getByTestId('option-1'));
      expect(onAnswerSelect).toHaveBeenCalledWith(1);
    });

    it('does not call onAnswerSelect when already answered', () => {
      const onAnswerSelect = jest.fn();
      render(
        <QuizQuestion
          {...defaultProps}
          onAnswerSelect={onAnswerSelect}
          isAnswered={true}
          selectedAnswer={2}
        />
      );

      fireEvent.click(screen.getByTestId('option-0'));
      expect(onAnswerSelect).not.toHaveBeenCalled();
    });
  });

  describe('correct/incorrect feedback', () => {
    it('shows correct styling for correct answer after answering', () => {
      render(
        <QuizQuestion
          {...defaultProps}
          isAnswered={true}
          selectedAnswer={1}
        />
      );

      // Option 1 is correct answer
      const correctOption = screen.getByTestId('option-1');
      expect(correctOption).toHaveClass('bg-green-50');
      expect(screen.getByTestId('correct-icon')).toHaveTextContent('✓');
    });

    it('shows incorrect styling for wrong user selection', () => {
      render(
        <QuizQuestion
          {...defaultProps}
          isAnswered={true}
          selectedAnswer={0}
        />
      );

      // User selected option 0 (wrong)
      const incorrectOption = screen.getByTestId('option-0');
      expect(incorrectOption).toHaveClass('bg-red-50');
      expect(screen.getByTestId('incorrect-icon')).toHaveTextContent('✗');

      // Option 1 (correct) should show green
      const correctOption = screen.getByTestId('option-1');
      expect(correctOption).toHaveClass('bg-green-50');
    });

    it('mutes other options after answering', () => {
      render(
        <QuizQuestion
          {...defaultProps}
          isAnswered={true}
          selectedAnswer={1}
        />
      );

      // Non-selected, non-correct options should be muted
      const otherOption = screen.getByTestId('option-2');
      expect(otherOption).toHaveClass('text-gray-500');
    });
  });

  describe('disabled state', () => {
    it('disables all options after answer is selected', () => {
      render(
        <QuizQuestion
          {...defaultProps}
          isAnswered={true}
          selectedAnswer={1}
        />
      );

      expect(screen.getByTestId('option-0')).toBeDisabled();
      expect(screen.getByTestId('option-1')).toBeDisabled();
      expect(screen.getByTestId('option-2')).toBeDisabled();
      expect(screen.getByTestId('option-3')).toBeDisabled();
    });

    it('enables options before answer is selected', () => {
      render(<QuizQuestion {...defaultProps} />);

      expect(screen.getByTestId('option-0')).not.toBeDisabled();
      expect(screen.getByTestId('option-1')).not.toBeDisabled();
    });
  });
});
