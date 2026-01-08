import React from 'react';

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName: string;
  onDismiss?: () => void;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  isDismissed: boolean;
}

/**
 * Section-level error boundary for isolated component failures.
 *
 * Unlike the main ErrorBoundary which takes over the whole page,
 * this shows an inline error for a specific section while letting
 * the rest of the app continue working.
 *
 * Features:
 * - Shows which section failed
 * - Retry button to attempt recovery
 * - Dismiss button to hide the error
 * - Development mode shows error details
 * - Doesn't block other sections
 */
class SectionErrorBoundary extends React.Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isDismissed: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<SectionErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const { sectionName } = this.props;

    if (process.env.NODE_ENV === 'development') {
      console.error(`🟡 Section "${sectionName}" error:`, {
        message: error.message,
        name: error.name,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        section: sectionName,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error(`Section "${sectionName}" failed:`, error.message);
    }

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isDismissed: false
    });
  };

  handleDismiss = (): void => {
    this.setState({ isDismissed: true });
    this.props.onDismiss?.();
  };

  render(): React.ReactNode {
    const { hasError, error, errorInfo, isDismissed } = this.state;
    const { children, sectionName } = this.props;

    if (isDismissed) {
      return null;
    }

    if (hasError) {
      const isDev = process.env.NODE_ENV === 'development';

      return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 mb-1">
                {sectionName} encountered an error
              </h3>

              {isDev && error && (
                <div className="mt-2 mb-3">
                  <p className="text-amber-700 text-sm font-mono bg-amber-100 p-2 rounded">
                    {error.name}: {error.message}
                  </p>

                  <details className="mt-2 text-sm">
                    <summary className="cursor-pointer text-amber-700 hover:text-amber-900">
                      Show error details (development only)
                    </summary>
                    <pre className="mt-2 text-xs text-amber-600 bg-amber-100 p-2 rounded overflow-auto max-h-32">
                      {error.stack}
                    </pre>
                    {errorInfo?.componentStack && (
                      <pre className="mt-2 text-xs text-amber-600 bg-amber-100 p-2 rounded overflow-auto max-h-32">
                        {errorInfo.componentStack}
                      </pre>
                    )}
                  </details>
                </div>
              )}

              {!isDev && (
                <p className="text-amber-700 text-sm mb-3">
                  Something went wrong loading this section. You can try again or dismiss this message.
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={this.handleRetry}
                  className="text-sm px-3 py-1.5 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                >
                  🔄 Try Again
                </button>
                <button
                  onClick={this.handleDismiss}
                  className="text-sm px-3 py-1.5 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors"
                >
                  ✕ Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default SectionErrorBoundary;
