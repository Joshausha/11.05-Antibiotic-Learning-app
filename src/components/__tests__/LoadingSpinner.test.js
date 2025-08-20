/**
 * Tests for LoadingSpinner component
 * @description Test suite for the loading indicator component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  test('renders with default message', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders with custom message', () => {
    const customMessage = 'Loading custom data...';
    render(<LoadingSpinner message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('renders loading icon with spinner animation', () => {
    render(<LoadingSpinner />);
    
    // Check for the loading icon (Loader from lucide-react)
    const loadingIcon = screen.getByRole('img', { hidden: true });
    expect(loadingIcon).toBeInTheDocument();
    expect(loadingIcon).toHaveClass('animate-spin');
  });

  test('applies correct styling classes', () => {
    render(<LoadingSpinner message="Test message" />);
    
    // Check for the main container classes
    const container = screen.getByText('Test message').closest('div');
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'py-16');
  });

  test('loading icon has correct styling', () => {
    render(<LoadingSpinner />);
    
    const loadingIcon = screen.getByRole('img', { hidden: true });
    expect(loadingIcon).toHaveClass('w-8', 'h-8', 'text-blue-600', 'animate-spin', 'mb-4');
  });

  test('message text has correct styling', () => {
    render(<LoadingSpinner message="Styled message" />);
    
    const messageElement = screen.getByText('Styled message');
    expect(messageElement).toHaveClass('text-gray-600', 'text-lg');
  });

  test('handles empty string message', () => {
    render(<LoadingSpinner message="" />);
    
    const messageElement = screen.getByText('', { selector: 'p' });
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('text-gray-600', 'text-lg');
  });

  test('handles very long message', () => {
    const longMessage = 'This is a very long loading message that should still render properly and not break the component layout or functionality';
    render(<LoadingSpinner message={longMessage} />);
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});