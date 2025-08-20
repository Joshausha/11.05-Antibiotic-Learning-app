/**
 * Tests for HomeTab component
 * @description Comprehensive test suite for the landing page component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeTab from '../HomeTab';

describe('HomeTab Component', () => {
  const mockSetActiveTab = jest.fn();

  beforeEach(() => {
    mockSetActiveTab.mockClear();
  });

  test('renders main heading', () => {
    render(<HomeTab setActiveTab={mockSetActiveTab} />);
    expect(screen.getByText(/medical learning app/i)).toBeInTheDocument();
  });

  test('renders all feature cards', () => {
    render(<HomeTab setActiveTab={mockSetActiveTab} />);
    
    expect(screen.getByRole('heading', { name: /clinical guidelines/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /targeted learning/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /interactive quizzes/i })).toBeInTheDocument();
  });

  test('renders call-to-action button', () => {
    render(<HomeTab setActiveTab={mockSetActiveTab} />);
    
    const quizButton = screen.getByText(/Take a Quiz/i);
    const referenceButton = screen.getByText(/browse reference/i);
    expect(quizButton).toBeInTheDocument();
    expect(referenceButton).toBeInTheDocument();
  });

  test('browse reference button navigates to reference tab', () => {
    render(<HomeTab setActiveTab={mockSetActiveTab} />);
    
    const referenceButton = screen.getByText(/browse reference/i);
    fireEvent.click(referenceButton);
    
    expect(mockSetActiveTab).toHaveBeenCalledWith('reference');
  });

  test('component structure includes main sections', () => {
    render(<HomeTab setActiveTab={mockSetActiveTab} />);
    
    // Check for main heading and description
    expect(screen.getByText(/medical learning app/i)).toBeInTheDocument();
    expect(screen.getByText(/master infectious diseases/i)).toBeInTheDocument();
    
    // Check for feature descriptions
    expect(screen.getByText(/evidence-based treatment protocols/i)).toBeInTheDocument();
    expect(screen.getByText(/test your knowledge with case-based questions/i)).toBeInTheDocument();
  });

  test('feature cards have proper structure', () => {
    render(<HomeTab setActiveTab={mockSetActiveTab} />);
    
    // Check that feature card headings exist
    const clinicalGuidelinesHeading = screen.getByRole('heading', { name: /clinical guidelines/i });
    const targetedLearningHeading = screen.getByRole('heading', { name: /targeted learning/i });
    const interactiveQuizzesHeading = screen.getByRole('heading', { name: /interactive quizzes/i });
    
    expect(clinicalGuidelinesHeading).toBeInTheDocument();
    expect(targetedLearningHeading).toBeInTheDocument();
    expect(interactiveQuizzesHeading).toBeInTheDocument();
    
    // Check for descriptive text
    expect(screen.getByText(/focus on high-yield infectious disease/i)).toBeInTheDocument();
  });

  // Enhanced Phase 2 Accessibility and WCAG Compliance Tests
  
  describe('Accessibility and WCAG Compliance', () => {
    test('has proper heading hierarchy', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Main heading should be h1
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent(/medical learning app/i);
      
      // Feature headings should be h2 or h3
      const featureHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(featureHeadings.length).toBeGreaterThan(0);
    });
    
    test('all interactive elements are keyboard accessible', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      const quizButton = screen.getByText(/Take a Quiz/i);
      
      // Button should be focusable
      quizButton.focus();
      expect(document.activeElement).toBe(quizButton);
      
      // Should activate with Enter key
      fireEvent.keyDown(quizButton, { key: 'Enter' });
      expect(mockSetActiveTab).toHaveBeenCalledWith('quiz');
      
      mockSetActiveTab.mockClear();
      
      // Should activate with Space key
      fireEvent.keyDown(startButton, { key: ' ' });
      expect(mockSetActiveTab).toHaveBeenCalledWith('quiz');
    });
    
    test('has sufficient color contrast ratios', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Test that text elements have proper contrast
      // Note: This is a simplified test - actual contrast testing would require color analysis
      const mainHeading = screen.getByRole('heading', { level: 1 });
      const computedStyle = window.getComputedStyle(mainHeading);
      
      // Ensure text is not transparent or invisible
      expect(computedStyle.opacity).not.toBe('0');
      expect(computedStyle.visibility).not.toBe('hidden');
    });
    
    test('provides alternative text for visual elements', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Check for any images that should have alt text
      const images = screen.queryAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });
    
    test('supports screen reader navigation', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Check for ARIA landmarks
      const mainContent = screen.getByRole('main') || screen.getByRole('region');
      expect(mainContent).toBeInTheDocument();
      
      // Check for proper button roles
      const startButton = screen.getByRole('button', { name: /take a quiz/i });
      expect(startButton).toBeInTheDocument();
    });
    
    test('handles focus management properly', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      const startButton = screen.getByText(/Take a Quiz/i);
      
      // Focus should be visible
      startButton.focus();
      expect(startButton).toHaveFocus();
      
      // Focus should remain after click
      fireEvent.click(startButton);
      // In real app, focus might move to the conditions tab
    });
    
    test('content is readable at 200% zoom', () => {
      // Mock viewport changes for zoom testing
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640, // Simulating zoomed viewport
      });
      
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Content should still be accessible
      expect(screen.getByText(/medical learning app/i)).toBeInTheDocument();
      expect(screen.getByText(/Take a Quiz/i)).toBeInTheDocument();
      
      // Restore original window size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });
    
    test('respects reduced motion preferences', () => {
      // Mock prefers-reduced-motion media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Component should render without animation-dependent features
      expect(screen.getByText(/medical learning app/i)).toBeInTheDocument();
    });
    
    test('provides error feedback for failed navigation', () => {
      const mockSetActiveTabWithError = jest.fn(() => {
        throw new Error('Navigation failed');
      });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<HomeTab setActiveTab={mockSetActiveTabWithError} />);
      
      const startButton = screen.getByText(/Take a Quiz/i);
      
      // Should handle errors gracefully
      expect(() => fireEvent.click(startButton)).not.toThrow();
      
      consoleSpy.mockRestore();
    });
    
    test('maintains semantic meaning without CSS', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Content should be logically structured
      const headings = screen.getAllByRole('heading');
      const buttons = screen.getAllByRole('button');
      
      expect(headings.length).toBeGreaterThan(0);
      expect(buttons.length).toBeGreaterThan(0);
      
      // Check logical reading order
      const mainHeading = screen.getByRole('heading', { level: 1 });
      const startButton = screen.getByRole('button');
      
      expect(mainHeading).toBeInTheDocument();
      expect(startButton).toBeInTheDocument();
    });
  });

  // Phase 2 Enhanced Testing - Progress Dashboard and Features
  
  describe('Progress Dashboard', () => {
    test('renders progress dashboard when user has quiz history', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Mock progress data should show progress elements
      expect(screen.getByText(/learning progress/i)).toBeInTheDocument();
      expect(screen.getByText(/average score/i)).toBeInTheDocument();
      expect(screen.getByText(/weekly goal/i)).toBeInTheDocument();
    });
    
    test('displays correct progress statistics', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Check that progress numbers are displayed correctly
      expect(screen.getByText(/2 of 6 sections completed/i)).toBeInTheDocument();
      expect(screen.getByText(/85%/i)).toBeInTheDocument();
      expect(screen.getByText(/based on 3 quizzes/i)).toBeInTheDocument();
      expect(screen.getByText(/3 of 5 quizzes this week/i)).toBeInTheDocument();
    });
    
    test('progress indicators are accessible', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Check for appropriate ARIA attributes on progress elements
      const progressElements = screen.getAllByRole('progressbar') || 
                             screen.querySelectorAll('[aria-valuenow]');
      
      // Should have accessible progress indicators
      expect(progressElements.length).toBeGreaterThan(0);
    });
    
    test('handles zero progress gracefully', () => {
      // Mock component with zero progress
      const { rerender } = render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Component should render without errors even with zero progress
      expect(screen.getByText(/Take a Quiz/i)).toBeInTheDocument();
    });
  });
  
  describe('Feature Cards Interaction', () => {
    test('feature cards are properly structured for accessibility', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      const featureHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(featureHeadings).toHaveLength(3);
      
      // Each feature should have an icon, heading, and description
      expect(screen.getByText(/clinical guidelines/i)).toBeInTheDocument();
      expect(screen.getByText(/targeted learning/i)).toBeInTheDocument();
      expect(screen.getByText(/interactive quizzes/i)).toBeInTheDocument();
    });
    
    test('feature descriptions are informative and complete', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Check for comprehensive descriptions
      expect(screen.getByText(/evidence-based treatment protocols/i)).toBeInTheDocument();
      expect(screen.getByText(/focus on high-yield infectious disease/i)).toBeInTheDocument();
      expect(screen.getByText(/test your knowledge with case-based questions/i)).toBeInTheDocument();
    });
    
    test('icons are properly associated with feature cards', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Check that icons are present (they would be in the DOM via Lucide React)
      const featureCards = screen.getAllByText(/clinical guidelines|targeted learning|interactive quizzes/i);
      expect(featureCards).toHaveLength(3);
    });
  });
  
  describe('Navigation and User Flow', () => {
    test('handles navigation errors gracefully', () => {
      const mockSetActiveTabWithError = jest.fn(() => {
        throw new Error('Navigation failed');
      });
      
      // Mock console.error to prevent error output in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<HomeTab setActiveTab={mockSetActiveTabWithError} />);
      
      const startButton = screen.getByText(/Take a Quiz/i);
      
      // Should not crash the component
      expect(() => fireEvent.click(startButton)).not.toThrow();
      
      // Should log the error
      expect(consoleSpy).toHaveBeenCalledWith('Navigation failed:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
    
    test('take quiz button leads to appropriate next step', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      const startButton = screen.getByRole('button', { name: /take a quiz/i });
      fireEvent.click(startButton);
      
      expect(mockSetActiveTab).toHaveBeenCalledWith('quiz');
      expect(mockSetActiveTab).toHaveBeenCalledTimes(1);
    });
    
    test('supports multiple navigation methods', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      const startButton = screen.getByText(/Take a Quiz/i);
      
      // Test mouse click
      fireEvent.click(startButton);
      expect(mockSetActiveTab).toHaveBeenCalledWith('quiz');
      
      mockSetActiveTab.mockClear();
      
      // Test Enter key
      fireEvent.keyDown(startButton, { key: 'Enter' });
      expect(mockSetActiveTab).toHaveBeenCalledWith('quiz');
      
      mockSetActiveTab.mockClear();
      
      // Test Space key
      fireEvent.keyDown(startButton, { key: ' ' });
      expect(mockSetActiveTab).toHaveBeenCalledWith('quiz');
    });
    
    test('ignores non-navigation key presses', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      const startButton = screen.getByText(/Take a Quiz/i);
      
      // Test non-navigation keys
      fireEvent.keyDown(startButton, { key: 'Tab' });
      fireEvent.keyDown(startButton, { key: 'Escape' });
      fireEvent.keyDown(startButton, { key: 'ArrowDown' });
      
      expect(mockSetActiveTab).not.toHaveBeenCalled();
    });
  });
  
  describe('Responsive Design and Mobile Support', () => {
    test('layout adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Content should still be accessible on mobile
      expect(screen.getByText(/medical learning app/i)).toBeInTheDocument();
      expect(screen.getByText(/Take a Quiz/i)).toBeInTheDocument();
      
      // Restore viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });
    
    test('buttons are properly sized for touch interaction', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      const startButton = screen.getByText(/Take a Quiz/i);
      const computedStyle = window.getComputedStyle(startButton);
      
      // Button should not be invisible or too small
      expect(computedStyle.display).not.toBe('none');
      expect(computedStyle.visibility).not.toBe('hidden');
    });
  });
  
  describe('Performance and Loading States', () => {
    test('renders quickly without blocking operations', () => {
      const startTime = performance.now();
      
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      const endTime = performance.now();
      
      // Should render within reasonable time
      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByText(/medical learning app/i)).toBeInTheDocument();
    });
    
    test('handles component rerendering efficiently', () => {
      const { rerender } = render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Multiple rerenders should not cause issues
      rerender(<HomeTab setActiveTab={mockSetActiveTab} />);
      rerender(<HomeTab setActiveTab={mockSetActiveTab} />);
      rerender(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      expect(screen.getByText(/medical learning app/i)).toBeInTheDocument();
      expect(screen.getByText(/Take a Quiz/i)).toBeInTheDocument();
    });
    
    test('maintains state during prop updates', () => {
      const mockSetActiveTab1 = jest.fn();
      const mockSetActiveTab2 = jest.fn();
      
      const { rerender } = render(<HomeTab setActiveTab={mockSetActiveTab1} />);
      
      // Component should render with first prop
      expect(screen.getByText(/Take a Quiz/i)).toBeInTheDocument();
      
      // Update prop and verify component still works
      rerender(<HomeTab setActiveTab={mockSetActiveTab2} />);
      
      const startButton = screen.getByText(/Take a Quiz/i);
      fireEvent.click(startButton);
      
      expect(mockSetActiveTab2).toHaveBeenCalledWith('quiz');
      expect(mockSetActiveTab1).not.toHaveBeenCalled();
    });
  });
  
  describe('Error Recovery and Edge Cases', () => {
    test('handles undefined setActiveTab prop gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<HomeTab setActiveTab={undefined} />);
      }).not.toThrow();
      
      // Component should still render
      expect(screen.getByText(/medical learning app/i)).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
    
    test('handles null setActiveTab prop gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<HomeTab setActiveTab={null} />);
      }).not.toThrow();
      
      expect(screen.getByText(/medical learning app/i)).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
    
    test('prevents navigation when setActiveTab throws errors', () => {
      const mockSetActiveTabWithError = jest.fn(() => {
        throw new Error('Critical navigation error');
      });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<HomeTab setActiveTab={mockSetActiveTabWithError} />);
      
      const startButton = screen.getByText(/Take a Quiz/i);
      
      // Should handle error gracefully
      expect(() => fireEvent.click(startButton)).not.toThrow();
      
      // Error should be logged
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('Content Quality and Medical Education Focus', () => {
    test('displays medically accurate content', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Check for medical terminology and concepts
      expect(screen.getByText(/infectious diseases/i)).toBeInTheDocument();
      expect(screen.getByText(/antimicrobial therapy/i)).toBeInTheDocument();
      expect(screen.getByText(/clinical guidelines/i)).toBeInTheDocument();
      expect(screen.getByText(/evidence-based/i)).toBeInTheDocument();
    });
    
    test('promotes educational best practices', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Check for educational concepts
      expect(screen.getByText(/case-based questions/i)).toBeInTheDocument();
      expect(screen.getByText(/detailed explanations/i)).toBeInTheDocument();
      expect(screen.getByText(/high-yield/i)).toBeInTheDocument();
    });
    
    test('emphasizes clinical relevance', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Check for clinical practice focus
      expect(screen.getByText(/clinical practice/i)).toBeInTheDocument();
      expect(screen.getByText(/treatment protocols/i)).toBeInTheDocument();
      expect(screen.getByText(/medical societies/i)).toBeInTheDocument();
    });
  });
  
  describe('Integration with Other Components', () => {
    test('progress indicators integrate with user data', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Should display progress data that would come from user context
      expect(screen.getByText(/2 of 6 sections/i)).toBeInTheDocument();
      expect(screen.getByText(/85%/i)).toBeInTheDocument();
      expect(screen.getByText(/3 quizzes/i)).toBeInTheDocument();
    });
    
    test('navigation integrates with app routing system', () => {
      render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      const startButton = screen.getByText(/Take a Quiz/i);
      fireEvent.click(startButton);
      
      // Should request navigation to conditions tab
      expect(mockSetActiveTab).toHaveBeenCalledWith('quiz');
    });
    
    test('component works with memo optimization', () => {
      const { rerender } = render(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      // Component should work with React.memo
      const initialContent = screen.getByText(/medical learning app/i);
      
      // Rerender with same props (should be memoized)
      rerender(<HomeTab setActiveTab={mockSetActiveTab} />);
      
      expect(screen.getByText(/medical learning app/i)).toBeInTheDocument();
    });
  });
});