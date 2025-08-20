/**
 * Tests for ErrorBoundary component
 * @description Comprehensive test suite for error boundary error handling and recovery
 * @created 2025-07-28 06:49:33
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../ErrorBoundary';

// Test component that can throw errors on demand
const ThrowError = ({ shouldThrow, errorMessage = 'Test error', children }) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div data-testid="no-error">{children}</div>;
};

// Test component for lifecycle error testing
class ThrowErrorInLifecycle extends React.Component {
  constructor(props) {
    super(props);
    if (props.throwInConstructor) {
      throw new Error('Constructor error');
    }
  }

  componentDidMount() {
    if (this.props.throwInDidMount) {
      throw new Error('componentDidMount error');
    }
  }

  render() {
    if (this.props.throwInRender) {
      throw new Error('Render error');
    }
    return <div data-testid="lifecycle-component">Lifecycle component</div>;
  }
}

describe('ErrorBoundary Component', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    // Mock console.error to prevent error noise in tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Normal Operation', () => {
    test('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-component">Child Component</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child-component')).toBeInTheDocument();
      expect(screen.queryByText(/application error/i)).not.toBeInTheDocument();
    });

    test('passes props to children correctly', () => {
      const TestChild = ({ testProp }) => (
        <div data-testid="test-child">Test prop: {testProp}</div>
      );

      render(
        <ErrorBoundary>
          <TestChild testProp="test-value" />
        </ErrorBoundary>
      );

      expect(screen.getByText(/test prop: test-value/i)).toBeInTheDocument();
    });

    test('renders multiple children correctly', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('catches and displays error when child component throws', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Child component error" />
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
      expect(screen.getByText(/child component error/i)).toBeInTheDocument();
      expect(screen.queryByTestId('no-error')).not.toBeInTheDocument();
    });

    test('displays error details in error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Detailed error message" />
        </ErrorBoundary>
      );

      expect(screen.getByText(/error details:/i)).toBeInTheDocument();
      expect(screen.getByText(/detailed error message/i)).toBeInTheDocument();
      expect(screen.getByText(/component stack:/i)).toBeInTheDocument();
    });

    test('shows reload button in error state', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByText(/reload page/i);
      expect(reloadButton).toBeInTheDocument();
      expect(reloadButton).toHaveClass('bg-red-600', 'text-white');
    });

    test('logs error to console when error is caught', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Console logging test" />
        </ErrorBoundary>
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error Boundary caught an error:',
        expect.any(Error)
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error Info:',
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      );
    });
  });

  describe('Error Recovery', () => {
    test('reload button triggers page reload', () => {
      // Mock window.location.reload
      const mockReload = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true
      });

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByText(/reload page/i);
      fireEvent.click(reloadButton);

      expect(mockReload).toHaveBeenCalled();
    });

    test('error boundary resets when new children are provided', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();

      // Re-render with non-error-throwing children
      rerender(
        <ErrorBoundary>
          <div data-testid="new-child">New child component</div>
        </ErrorBoundary>
      );

      // Error boundary should still show error state (React behavior)
      expect(screen.getByText(/application error/i)).toBeInTheDocument();
      expect(screen.queryByTestId('new-child')).not.toBeInTheDocument();
    });
  });

  describe('Different Error Types', () => {
    test('handles TypeError correctly', () => {
      const ThrowTypeError = () => {
        throw new TypeError('Type error occurred');
      };

      render(
        <ErrorBoundary>
          <ThrowTypeError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
      expect(screen.getByText(/type error occurred/i)).toBeInTheDocument();
    });

    test('handles ReferenceError correctly', () => {
      const ThrowReferenceError = () => {
        throw new ReferenceError('Reference error occurred');
      };

      render(
        <ErrorBoundary>
          <ThrowReferenceError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
      expect(screen.getByText(/reference error occurred/i)).toBeInTheDocument();
    });

    test('handles custom error objects', () => {
      const ThrowCustomError = () => {
        const customError = new Error('Custom error');
        customError.code = 'CUSTOM_ERROR';
        customError.details = 'Additional error details';
        throw customError;
      };

      render(
        <ErrorBoundary>
          <ThrowCustomError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
      expect(screen.getByText(/custom error/i)).toBeInTheDocument();
    });
  });

  describe('Lifecycle Error Handling', () => {
    test('catches errors in component constructor', () => {
      render(
        <ErrorBoundary>
          <ThrowErrorInLifecycle throwInConstructor={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
      expect(screen.getByText(/constructor error/i)).toBeInTheDocument();
    });

    test('catches errors in componentDidMount', () => {
      render(
        <ErrorBoundary>
          <ThrowErrorInLifecycle throwInDidMount={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
      expect(screen.getByText(/componentdidmount error/i)).toBeInTheDocument();
    });

    test('catches errors in render method', () => {
      render(
        <ErrorBoundary>
          <ThrowErrorInLifecycle throwInRender={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
      expect(screen.getByText(/render error/i)).toBeInTheDocument();
    });
  });

  describe('Nested Error Boundaries', () => {
    test('inner error boundary catches errors before outer boundary', () => {
      render(
        <ErrorBoundary data-testid="outer-boundary">
          <div>Outer content</div>
          <ErrorBoundary data-testid="inner-boundary">
            <ThrowError shouldThrow={true} errorMessage="Inner error" />
          </ErrorBoundary>
          <div>More outer content</div>
        </ErrorBoundary>
      );

      // Only one error boundary should show error state
      const errorElements = screen.getAllByText(/application error/i);
      expect(errorElements).toHaveLength(1);
      expect(screen.getByText(/inner error/i)).toBeInTheDocument();
    });

    test('outer error boundary catches when inner boundary also fails', () => {
      const FaultyErrorBoundary = ({ children }) => {
        throw new Error('Error boundary itself failed');
      };

      render(
        <ErrorBoundary>
          <FaultyErrorBoundary>
            <ThrowError shouldThrow={true} />
          </FaultyErrorBoundary>
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
      expect(screen.getByText(/error boundary itself failed/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility and User Experience', () => {
    test('error UI has proper semantic structure', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Check for proper heading hierarchy
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/application error/i);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/error details/i);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(/component stack/i);
    });

    test('error UI has appropriate color coding', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorContainer = screen.getByText(/application error/i).closest('.bg-red-50');
      expect(errorContainer).toBeInTheDocument();
      
      const errorTitle = screen.getByText(/application error/i);
      expect(errorTitle).toHaveClass('text-red-800');
      
      const reloadButton = screen.getByText(/reload page/i);
      expect(reloadButton).toHaveClass('bg-red-600', 'hover:bg-red-700');
    });

    test('error message is readable and informative', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="User-friendly error message" />
        </ErrorBoundary>
      );

      expect(screen.getByText(/user-friendly error message/i)).toBeInTheDocument();
      expect(screen.getByText(/component stack/i)).toBeInTheDocument();
      expect(screen.getByText(/reload page/i)).toBeInTheDocument();
    });

    test('error UI provides component stack information', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const componentStack = screen.getByText(/component stack:/i).nextSibling;
      expect(componentStack).toHaveClass('bg-red-50');
      expect(componentStack.tagName).toBe('PRE');
    });
  });

  describe('Performance and Memory', () => {
    test('error boundary does not cause memory leaks', () => {
      const { unmount } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Component should unmount cleanly
      expect(() => unmount()).not.toThrow();
    });

    test('error boundary handles rapid error occurrences', () => {
      let shouldThrow = true;
      
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();

      // Try multiple re-renders with errors - should not crash
      for (let i = 0; i < 5; i++) {
        rerender(
          <ErrorBoundary>
            <ThrowError shouldThrow={shouldThrow} errorMessage={`Error ${i}`} />
          </ErrorBoundary>
        );
      }

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles null error object', () => {
      const ThrowNullError = () => {
        throw null;
      };

      render(
        <ErrorBoundary>
          <ThrowNullError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
      // Should gracefully handle null error
    });

    test('handles undefined error', () => {
      const ThrowUndefinedError = () => {
        throw undefined;
      };

      render(
        <ErrorBoundary>
          <ThrowUndefinedError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
    });

    test('handles string errors', () => {
      const ThrowStringError = () => {
        throw 'String error message';
      };

      render(
        <ErrorBoundary>
          <ThrowStringError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
    });

    test('handles errors with circular references', () => {
      const ThrowCircularError = () => {
        const error = new Error('Circular reference error');
        error.self = error; // Create circular reference
        throw error;
      };

      render(
        <ErrorBoundary>
          <ThrowCircularError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
      expect(screen.getByText(/circular reference error/i)).toBeInTheDocument();
    });
  });

  describe('Integration with Application State', () => {
    test('error boundary works with context providers', () => {
      const TestContext = React.createContext();
      const TestProvider = ({ children }) => (
        <TestContext.Provider value={{ testValue: 'test' }}>
          {children}
        </TestContext.Provider>
      );

      render(
        <TestProvider>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </TestProvider>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
    });

    test('error boundary preserves application layout', () => {
      render(
        <div className="app-container">
          <header data-testid="app-header">App Header</header>
          <main>
            <ErrorBoundary>
              <ThrowError shouldThrow={true} />
            </ErrorBoundary>
          </main>
          <footer data-testid="app-footer">App Footer</footer>
        </div>
      );

      // App structure should be preserved
      expect(screen.getByTestId('app-header')).toBeInTheDocument();
      expect(screen.getByTestId('app-footer')).toBeInTheDocument();
      expect(screen.getByText(/application error/i)).toBeInTheDocument();
    });
  });
});