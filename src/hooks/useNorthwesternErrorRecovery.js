/**
 * useNorthwesternErrorRecovery Hook
 * Error recovery system for Northwestern Integration
 * Extracted from OptimizedNorthwesternIntegration.js during Phase 4 refactoring
 */

import { useState, useRef, useCallback } from 'react';
import {
  determineErrorSeverity,
  determineErrorRecoveryStrategy
} from '../config/northwesternIntegrationConfig';

/**
 * Custom hook for managing error recovery in Northwestern Integration
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Enable error recovery
 * @param {Object} options.performanceMonitor - Performance monitor reference
 * @param {Function} options.onErrorRecovery - Error recovery callback
 * @param {Function} options.announceToScreenReader - Screen reader announcement function
 * @param {number} options.integrationStartTime - Session start timestamp
 * @returns {Object} Error recovery state and handlers
 */
const useNorthwesternErrorRecovery = ({
  enabled = true,
  performanceMonitor = null,
  onErrorRecovery,
  announceToScreenReader,
  integrationStartTime
}) => {
  const [componentErrors, setComponentErrors] = useState(new Map());
  const [errorRecoveryActive, setErrorRecoveryActive] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [loadedComponents, setLoadedComponents] = useState(new Set());

  const errorRecoveryState = useRef({ attempts: 0, strategy: null });

  /**
   * Handle component error
   */
  const handleComponentError = useCallback((componentName, error, errorInfo = {}) => {
    const errorDetails = {
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
    const strategy = determineErrorRecoveryStrategy(error, componentName);

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
  const executeErrorRecovery = async (componentName, strategy, originalError) => {
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
      console.error('Error recovery failed:', recoveryError);

      if (performanceMonitor?.current) {
        performanceMonitor.current.recordClinicalMetric({
          type: 'error-recovery',
          strategy: strategy.strategy,
          success: false,
          attempts: errorRecoveryState.current.attempts,
          recoveryError: recoveryError.message
        });
      }

      // If recovery fails and we haven't exceeded retry attempts, try again
      if (errorRecoveryState.current.attempts < strategy.retryAttempts) {
        setTimeout(() => {
          executeErrorRecovery(componentName, strategy, originalError);
        }, strategy.timeout);
      } else {
        setErrorRecoveryActive(false);
        return 'fallback-mode';
      }
    }
  };

  /**
   * Offline mode recovery
   */
  const handleOfflineModeRecovery = async () => {
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
  const handleEmergencyMemoryCleanup = async () => {
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    console.log('Emergency memory cleanup completed');
  };

  /**
   * Component isolation recovery
   */
  const handleComponentIsolation = async (componentName) => {
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
  const handleDataValidationRecovery = async () => {
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
  const setOffline = useCallback((offline) => {
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
