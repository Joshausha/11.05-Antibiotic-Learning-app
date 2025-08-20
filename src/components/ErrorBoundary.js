import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-red-50 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-red-800 mb-4">
              Application Error
            </h1>
            <div className="bg-white p-6 rounded-lg border border-red-200">
              <h2 className="text-xl font-semibold text-red-700 mb-2">
                Error Details:
              </h2>
              <p className="text-red-600 mb-4">
                {this.state.error && this.state.error.toString()}
              </p>
              
              {this.state.errorInfo && (
                <>
                  <h3 className="text-lg font-semibold text-red-700 mb-2">
                    Component Stack:
                  </h3>
                  <pre className="text-sm text-red-600 bg-red-50 p-4 rounded overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </>
              )}
              
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;