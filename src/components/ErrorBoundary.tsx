import React from 'react';
import { ErrorBoundaryProps, ErrorBoundaryState } from '../types/component.types';

/**
 * Enhanced ErrorBoundary with development mode details.
 *
 * In development mode: Shows full error details including stack trace,
 * component stack, and copy-to-clipboard functionality.
 *
 * In production mode: Shows minimal user-friendly error message.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Structured logging for development debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('🔴 ErrorBoundary caught an error:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        location: window.location.href
      });
    } else {
      console.error('Application error:', error.message);
    }

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleCopyError = (): void => {
    const { error, errorInfo } = this.state;
    const errorDetails = `
Error: ${error?.name || 'Unknown'}: ${error?.message || 'No message'}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}

Stack Trace:
${error?.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}
    `.trim();

    navigator.clipboard.writeText(errorDetails)
      .then(() => {
        alert('Error details copied to clipboard!');
      })
      .catch(() => {
        // Fallback for browsers without clipboard API
        console.log('Error details:', errorDetails);
        alert('Could not copy to clipboard. Check console for details.');
      });
  };

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  renderDevelopmentError(): React.ReactNode {
    const { error, errorInfo } = this.state;

    return (
      <div className="min-h-screen bg-red-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🔴</span>
            <h1 className="text-3xl md:text-4xl font-bold text-red-800">
              Application Error
            </h1>
          </div>

          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 font-medium">
              🛠️ Development Mode - Detailed error information below
            </p>
          </div>

          {/* Error Summary */}
          <div className="bg-white p-6 rounded-lg border border-red-200 mb-4">
            <h2 className="text-xl font-semibold text-red-700 mb-3">
              Error Message
            </h2>
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-800 font-mono text-sm">
                {error?.name || 'Error'}: {error?.message || 'Unknown error occurred'}
              </p>
            </div>
          </div>

          {/* Stack Trace */}
          <details open className="bg-white rounded-lg border border-red-200 mb-4">
            <summary className="p-4 cursor-pointer font-semibold text-red-700 hover:bg-red-50">
              📋 Stack Trace
            </summary>
            <div className="p-4 pt-0">
              <pre className="text-xs md:text-sm text-red-600 bg-red-50 p-4 rounded overflow-auto max-h-64 font-mono whitespace-pre-wrap">
                {error?.stack || 'No stack trace available'}
              </pre>
            </div>
          </details>

          {/* Component Stack */}
          {errorInfo?.componentStack && (
            <details open className="bg-white rounded-lg border border-red-200 mb-4">
              <summary className="p-4 cursor-pointer font-semibold text-red-700 hover:bg-red-50">
                ⚛️ React Component Stack
              </summary>
              <div className="p-4 pt-0">
                <pre className="text-xs md:text-sm text-red-600 bg-red-50 p-4 rounded overflow-auto max-h-64 font-mono whitespace-pre-wrap">
                  {errorInfo.componentStack}
                </pre>
              </div>
            </details>
          )}

          {/* Debug Info */}
          <details className="bg-white rounded-lg border border-gray-200 mb-6">
            <summary className="p-4 cursor-pointer font-semibold text-gray-700 hover:bg-gray-50">
              🔍 Debug Information
            </summary>
            <div className="p-4 pt-0">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <dt className="font-medium text-gray-600">Timestamp:</dt>
                <dd className="font-mono text-gray-800">{new Date().toISOString()}</dd>
                <dt className="font-medium text-gray-600">URL:</dt>
                <dd className="font-mono text-gray-800 break-all">{window.location.href}</dd>
                <dt className="font-medium text-gray-600">Error Name:</dt>
                <dd className="font-mono text-gray-800">{error?.name || 'Unknown'}</dd>
              </dl>
            </div>
          </details>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              🔄 Try Again
            </button>
            <button
              onClick={this.handleCopyError}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              📋 Copy Error Details
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium transition-colors"
            >
              🔃 Reload Page
            </button>
          </div>

          {/* Learning Hint */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Learning Tip</h3>
            <p className="text-blue-700 text-sm">
              Read the stack trace from top to bottom. The first line usually shows where the error occurred.
              The component stack shows which React components were rendering when the error happened.
            </p>
          </div>
        </div>
      </div>
    );
  }

  renderProductionError(): React.ReactNode {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            We're sorry, but something unexpected happened.
            Please try refreshing the page or come back later.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={this.handleRetry}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Show detailed error in development, minimal in production
      if (process.env.NODE_ENV === 'development') {
        return this.renderDevelopmentError();
      }
      return this.renderProductionError();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
