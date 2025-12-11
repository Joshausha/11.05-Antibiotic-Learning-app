// Props interfaces for shared UI components

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'refresh' | 'clock';
}

export interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onHome?: () => void;
}

export interface SkeletonLoaderProps {
  type?: 'content' | 'card' | 'list' | 'quiz';
  rows?: number;
}

export interface ProgressBarProps {
  progress?: number;
  total?: number;
  showPercentage?: boolean;
  color?: string;
}

export interface ProgressIndicatorProps {
  current?: number;
  total?: number;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface DurationIndicatorProps {
  duration?: number | string;
  type?: 'spent' | 'remaining' | 'total';
  showIcon?: boolean;
  format?: 'short' | 'long';
}
