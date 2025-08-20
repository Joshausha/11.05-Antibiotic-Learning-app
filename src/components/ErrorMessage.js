import React from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronRight } from 'lucide-react';

/**
 * ErrorMessage Component
 * Provides user-friendly error messages with actions
 */
const ErrorMessage = ({ 
  title = "Something went wrong",
  message = "We're having trouble loading this content. Please try again.",
  type = "error",
  showRetry = true,
  showHome = false,
  onRetry = null,
  onHome = null,
  className = ""
}) => {
  const typeStyles = {
    error: "error-message",
    warning: "warning-message", 
    info: "info-message"
  };

  return (
    <div className={`${typeStyles[type]} ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm mb-4 leading-relaxed">{message}</p>
          
          {(showRetry || showHome) && (
            <div className="flex gap-2">
              {showRetry && onRetry && (
                <button
                  onClick={onRetry}
                  className="flex items-center gap-1 text-sm font-medium hover:underline"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              )}
              {showHome && onHome && (
                <button
                  onClick={onHome}
                  className="flex items-center gap-1 text-sm font-medium hover:underline"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Specific error components
export const DataLoadError = ({ onRetry, onHome }) => (
  <ErrorMessage
    title="Unable to load data"
    message="There was a problem loading the medical data. This might be due to a network issue or server problem."
    showRetry={true}
    showHome={true}
    onRetry={onRetry}
    onHome={onHome}
  />
);

export const NetworkError = ({ onRetry }) => (
  <ErrorMessage
    title="Network connection error"
    message="Please check your internet connection and try again."
    showRetry={true}
    onRetry={onRetry}
  />
);

export const NotFoundError = ({ itemType = "content", onHome }) => (
  <ErrorMessage
    title={`${itemType} not found`}
    message={`The ${itemType} you're looking for doesn't exist or has been moved.`}
    type="warning"
    showHome={true}
    onHome={onHome}
  />
);

export const ValidationError = ({ field, message }) => (
  <ErrorMessage
    title={`Invalid ${field}`}
    message={message}
    type="warning"
    showRetry={false}
  />
);

// Inline error for form fields
export const InlineError = ({ message, className = "" }) => (
  <div className={`text-red-600 text-sm mt-1 ${className}`}>
    {message}
  </div>
);

// Error boundary fallback
export const ErrorBoundaryFallback = ({ error, resetErrorBoundary }) => (
  <div className="card max-w-md mx-auto mt-8">
    <div className="text-center">
      <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-6">
        An unexpected error occurred. Our team has been notified.
      </p>
      <div className="flex gap-2 justify-center">
        <button
          onClick={resetErrorBoundary}
          className="btn-primary"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="btn-secondary"
        >
          <Home className="w-4 h-4 mr-2" />
          Go Home
        </button>
      </div>
    </div>
  </div>
);

export default ErrorMessage;