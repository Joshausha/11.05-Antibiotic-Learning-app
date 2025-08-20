import React from 'react';
import { Loader, RefreshCw, Clock } from 'lucide-react';

/**
 * LoadingSpinner Component
 * Provides a consistent loading indicator for lazy-loaded components
 */
const LoadingSpinner = ({ 
  message = "Loading...", 
  size = "md",
  variant = "default",
  showMessage = true,
  className = ""
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const iconSize = sizeClasses[size];
  const Icon = variant === 'refresh' ? RefreshCw : variant === 'clock' ? Clock : Loader;

  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <Icon 
        className={`${iconSize} text-blue-600 animate-spin mb-4`} 
        role="img" 
        aria-label={message}
      />
      {showMessage && (
        <p className="text-gray-600 text-lg animate-pulse">{message}</p>
      )}
    </div>
  );
};

// Inline loading spinner for buttons
export const InlineSpinner = ({ size = "sm", className = "" }) => (
  <Loader 
    className={`${sizeClasses[size]} animate-spin ${className}`} 
    role="img" 
    aria-label="Loading"
  />
);

// Minimal loading indicator
export const MinimalSpinner = ({ className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8", 
  lg: "w-12 h-12"
};

export default LoadingSpinner;