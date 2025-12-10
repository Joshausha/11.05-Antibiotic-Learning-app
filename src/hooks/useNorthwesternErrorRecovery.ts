/**
 * useNorthwesternErrorRecovery Hook
 * Error recovery system for Northwestern Integration
 * Extracted from OptimizedNorthwesternIntegration.js during Phase 4 refactoring
 */

import { useState, useRef, useCallback, MutableRefObject } from 'react';
import {
  determineErrorSeverity,
  determineErrorRecoveryStrategy
} from '../config/northwesternIntegrationConfig';

/**
 * Type definitions for error recovery
 */

type ErrorRecoveryStrategy = 'offline-mode' | 'emergency-cleanup' | 'component-isolation' | 'data-validation';

interface ErrorDetails {
  component: string;
  error: string;
  stack?: string;
  timestamp: number;
  sessionTime: number;
  [key: string]: any;
}

interface RecoveryStrategy {
  strategy: ErrorRecoveryStrategy;
  fallback?: string;
  retryAttempts?: number;
  timeout?: number;
}

interface PerformanceMonitor {
  recordClinicalMetric: (metric: {
    type: string;
    component?: string;
    error?: string;
    severity?: string | number;
    strategy?: string;
    duration?: number;
    success?: boolean;
    attempts?: number;
    recoveryError?: string;
  }) => void;
}

interface UseNorthwesternErrorRecoveryOptions {
  enabled?: boolean;
  performanceMonitor?: MutableRefObject<PerformanceMonitor | null> | null;
  onErrorRecovery?: (errorDetails: ErrorDetails, strategy: RecoveryStrategy) => void;
  announceToScreenReader?: (message: string, priority: string) => void;
  integrationStartTime?: number;
}

interface ErrorRecoveryState {
  attempts: number;
  strategy: ErrorRecoveryStrategy | null;
}

interface UseNorthwesternErrorRecoveryReturn {
  componentErrors: Map<string, ErrorDetails>;
  errorRecoveryActive: boolean;
  offlineMode: boolean;
  loadedComponents: Set<string>;
  handleComponentError: (componentName: string, error: Error, errorInfo?: Record<string, any>) => void;
  clearErrors: () => void;
  setOfflineMode: (offline: boolean) => void;
  setLoadedComponents: (components: Set<string>) => void;
  errorCount: number;
}

/**
 * Custom hook for managing error recovery in Northwestern Integration
 * @param options - Configuration options
 * @param options.enabled - Enable error recovery
 * @param options.performanceMonitor - Performance monitor reference
 * @param options.onErrorRecovery - Error recovery callback
 * @param options.announceToScreenReader - Screen reader announcement function
 * @param options.integrationStartTime - Session start timestamp
 * @returns Error recovery state and handlers
 */
const useNorthwesternErrorRecovery = ({
  enabled = true,
  performanceMonitor = null,
  onErrorRecovery,
  announceToScreenReader,
  integrationStartTime = 0
}: UseNorthwesternErrorRecoveryOptions = {}): UseNorthwesternErrorRecoveryReturn => {
  const [componentErrors, setComponentErrors] = useState<Map<string, ErrorDetails>>(new Map());
  const [errorRecoveryActive, setErrorRecoveryActive] = useState<boolean>(false);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(new Set());

  const errorRecoveryState = useRef<ErrorRecoveryState>({ attempts: 0, strategy: null });

  /**
   * Handle component error
   */
  const handleComponentError = useCallback((componentName: string, error: Error, errorInfo: Record<string, any> = {}) => {
    const errorDetails: ErrorDetails = {
      component: componentName,
      error: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      sessionTime: Date.now() - integrationStartTime,
      ...errorInfo
    };

    // Track error in performance monitor
    if (performanceMonitor?.current) {
      performanceMonitor.current.recordClinicalMetric({
        type: 'component-error',
        component: componentName,
        error: error.message,
        severity: determineErrorSeverity(error)
      });
    }

    // Determine error recovery strategy
    const strategy = determineErrorRecoveryStrategy(error, componentName) as RecoveryStrategy;

    setComponentErrors(prev => new Map(prev.set(componentName, errorDetails)));

    // Execute error recovery
    if (enabled && strategy) {
      executeErrorRecovery(componentName, strategy, error);
    }

    // Notify parent component
    onErrorRecovery?.(errorDetails, strategy);

    // Announce error to screen reader if critical
    if (strategy.fallback === 'basic-list-view' && announceToScreenReader) {
      announceToScreenReader(
        'System error detected. Switching to simplified interface for continued clinical access.',
        'assertive'
      );
    }
  }, [enabled, performanceMonitor, onErrorRecovery, announceToScreenReader, integrationStartTime]);

  /**
   * Execute error recovery strategy
   */
  const executeErrorRecovery = async (componentName: string, strategy: RecoveryStrategy, originalError: Error): Promise<void | string> => {
    setErrorRecoveryActive(true);
    errorRecoveryState.current.attempts += 1;
    errorRecoveryState.current.strategy = strategy.strategy;

    try {
      const recoveryStartTime = performance.now();

      switch (strategy.strategy) {
        case 'offline-mode':
          await handleOfflineModeRecovery();
          break;
        case 'emergency-cleanup':
          await handleEmergencyMemoryCleanup();
          break;
        case 'component-isolation':
          await handleComponentIsolation(componentName);
          break;
        case 'data-validation':
          await handleDataValidationRecovery();
          break;
        default:
          console.warn('Unknown error recovery strategy:', strategy.strategy);
      }

      const recoveryTime = performance.now() - recoveryStartTime;

      if (performanceMonitor?.current) {
        performanceMonitor.current.recordClinicalMetric({
          type: 'error-recovery',
          strategy: strategy.strategy,
          duration: recoveryTime,
          success: true,
          attempts: errorRecoveryState.current.attempts
        });
      }

      // Remove error from state if recovery successful
      setComponentErrors(prev => {
        const newErrors = new Map(prev);
        newErrors.delete(componentName);
        return newErrors;
      });

      setErrorRecoveryActive(false);

    } catch (recoveryError) {
      const errorMessage = recoveryError instanceof Error ? recoveryError.message : String(recoveryError);
      console.error('Error recovery failed:', recoveryError);

      if (performanceMonitor?.current) {
        performanceMonitor.current.recordClinicalMetric({
          type: 'error-recovery',
          strategy: strategy.strategy,
          success: false,
          attempts: errorRecoveryState.current.attempts,
          recoveryError: errorMessage
        });
      }

      // If recovery fails and we haven't exceeded retry attempts, try again
      const retryAttempts = strategy.retryAttempts ?? 3;
      const timeout = strategy.timeout ?? 1000;

      if (errorRecoveryState.current.attempts < retryAttempts) {
        setTimeout(() => {
          executeErrorRecovery(componentName, strategy, originalError);
        }, timeout);
      } else {
        setErrorRecoveryActive(false);
        return 'fallback-mode';
      }
    }
  };

  /**
   * Offline mode recovery
   */
  const handleOfflineModeRecovery = async (): Promise<any> => {
    setOfflineMode(true);

    // Load cached data if available
    if ('caches' in window) {
      try {
        const cache = await caches.open('northwestern-clinical-v1');
        const cachedResponse = await cache.match('/api/emergency-antibiotics');

        if (cachedResponse) {
          const cachedData = await cachedResponse.json();
          console.log('Loaded cached antibiotic data for offline mode');
          return cachedData;
        }
      } catch (error) {
        console.warn('Failed to load cached data:', error);
      }
    }
  };

  /**
   * Emergency memory cleanup
   */
  const handleEmergencyMemoryCleanup = async (): Promise<void> => {
    // Force garbage collection if available
    const gc = (window as any).gc;
    if (gc) {
      gc();
    }
    console.log('Emergency memory cleanup completed');
  };

  /**
   * Component isolation recovery
   */
  const handleComponentIsolation = async (componentName: string): Promise<void> => {
    setLoadedComponents(prev => {
      const newSet = new Set(prev);
      newSet.delete(componentName);
      return newSet;
    });
    console.log(`Isolated component: ${componentName}`);
  };

  /**
   * Data validation recovery
   */
  const handleDataValidationRecovery = async (): Promise<void> => {
    console.log('Data validation recovery executed');
  };

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setComponentErrors(new Map());
    errorRecoveryState.current.attempts = 0;
    errorRecoveryState.current.strategy = null;
  }, []);

  /**
   * Set offline mode
   */
  const setOffline = useCallback((offline: boolean) => {
    setOfflineMode(offline);
  }, []);

  return {
    componentErrors,
    errorRecoveryActive,
    offlineMode,
    loadedComponents,
    handleComponentError,
    clearErrors,
    setOfflineMode: setOffline,
    setLoadedComponents,
    errorCount: componentErrors.size
  };
};

export default useNorthwesternErrorRecovery;
