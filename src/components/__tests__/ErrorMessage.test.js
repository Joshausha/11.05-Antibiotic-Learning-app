/**
 * Tests for ErrorMessage and specialized error components
 * @description Comprehensive test coverage for error displays
 * Medical safety-critical: Yes (UX Critical)
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorMessage, { 
  DataLoadError, 
  NetworkError, 
  NotFoundError, 
  ValidationError, 
  InlineError, 
  ErrorBoundaryFallback 
} from '../ErrorMessage';

describe('ErrorMessage', () => {
  const mockOnRetry = jest.fn();
  const mockOnHome = jest.fn();

  beforeEach(() => {
    mockOnRetry.mockClear();
    mockOnHome.mockClear();
  });

  describe('Default Props', () => {
    test('renders default title and message', () => {
      render(<ErrorMessage />);
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/we're having trouble loading this content/i)).toBeInTheDocument();
    });

    test('applies default error styling', () => {
      const { container } = render(<ErrorMessage />);
      expect(container.firstChild).toHaveClass('error-message');
    });
  });

  describe('Type Styling', () => {
    test('renders error style', () => {
      const { container } = render(<ErrorMessage type="error" />);
      expect(container.firstChild).toHaveClass('error-message');
    });

    test('renders warning style', () => {
      const { container } = render(<ErrorMessage type="warning" />);
      expect(container.firstChild).toHaveClass('warning-message');
    });

    test('renders info style', () => {
      const { container } = render(<ErrorMessage type="info" />);
      expect(container.firstChild).toHaveClass('info-message');
    });
  });

  describe('Button Logic', () => {
    test('shows retry button when showRetry is true and onRetry provided', () => {
      render(<ErrorMessage showRetry={true} onRetry={mockOnRetry} />);
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    test('hides retry button when onRetry is not provided', () => {
      render(<ErrorMessage showRetry={true} onRetry={null} />);
      expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });

    test('shows home button when showHome is true and onHome provided', () => {
      render(<ErrorMessage showHome={true} onHome={mockOnHome} />);
      expect(screen.getByText('Go Home')).toBeInTheDocument();
    });

    test('calls onRetry when clicked', () => {
      render(<ErrorMessage showRetry={true} onRetry={mockOnRetry} />);
      fireEvent.click(screen.getByText('Try Again'));
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    test('calls onHome when clicked', () => {
      render(<ErrorMessage showHome={true} onHome={mockOnHome} />);
      fireEvent.click(screen.getByText('Go Home'));
      expect(mockOnHome).toHaveBeenCalledTimes(1);
    });
  });

  describe('Specialized Components', () => {
    test('DataLoadError renders correctly', () => {
      render(<DataLoadError onRetry={mockOnRetry} onHome={mockOnHome} />);
      expect(screen.getByText('Unable to load data')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Go Home')).toBeInTheDocument();
    });

    test('NetworkError renders with only retry', () => {
      render(<NetworkError onRetry={mockOnRetry} />);
      expect(screen.getByText('Network connection error')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.queryByText('Go Home')).not.toBeInTheDocument();
    });

    test('NotFoundError uses itemType prop', () => {
      render(<NotFoundError itemType="Patient" onHome={mockOnHome} />);
      expect(screen.getByText('Patient not found')).toBeInTheDocument();
      expect(screen.getByText(/patient you're looking for/i)).toBeInTheDocument();
    });

    test('ValidationError uses field prop', () => {
      render(<ValidationError field="Email" message="Invalid format" />);
      expect(screen.getByText('Invalid Email')).toBeInTheDocument();
      expect(screen.getByText('Invalid format')).toBeInTheDocument();
    });

    test('InlineError renders simple text', () => {
      render(<InlineError message="Required field" />);
      expect(screen.getByText('Required field')).toHaveClass('text-red-600');
    });

    test('ErrorBoundaryFallback renders with large icon and buttons', () => {
      render(<ErrorBoundaryFallback error={new Error('Boom')} resetErrorBoundary={mockOnRetry} />);
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Go Home')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('Try Again'));
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });
  });
});
