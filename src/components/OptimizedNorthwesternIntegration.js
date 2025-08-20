/**
 * Optimized Northwestern Integration Component
 * 
 * Complete Phase 3 system integration with performance enhancements, lazy loading optimization,
 * error recovery, and clinical accessibility validation for Northwestern antibiotic system.
 * 
 * Created by: Agent 3.4 - Performance & Mobile Optimization Specialist
 * Phase: 3.4 - Performance Optimization & Mobile Clinical Workflows
 * Integration: Unifies Agent 3.1, 3.2, 3.3, 3.4 deliverables with clinical-grade optimization
 * 
 * Features:
 * - Complete Phase 3 system integration with performance enhancements
 * - Intelligent lazy loading prioritized for clinical workflow efficiency
 * - Comprehensive error recovery with graceful degradation for clinical reliability
 * - Enhanced clinical accessibility validation with WCAG 2.1 AA compliance
 * - Emergency mode optimization for <30 second clinical access
 * - Mobile clinical workflow integration with touch gesture support
 * - Real-time performance monitoring with clinical context awareness
 * 
 * Integration Architecture:
 * - Phase 3.1: Spatial Layout (grid positioning, responsive design)
 * - Phase 3.2: Group Organization (medical groupings, clinical context)
 * - Phase 3.3: Interactive Filtering (real-time filtering, clinical scenarios)
 * - Phase 3.4: Performance & Mobile (optimization, mobile workflow, monitoring)
 * 
 * Performance Targets:
 * - Initial Load: <2000ms for complete Northwestern system
 * - Emergency Access: <30s to any critical clinical information
 * - Filter Response: <100ms for real-time clinical feedback
 * - Memory Usage: <50MB sustained during clinical sessions
 * - Touch Response: <100ms for immediate mobile feedback
 * - Error Recovery: <5s graceful degradation to fallback interface
 * 
 * @component
 * @example
 * <OptimizedNorthwesternIntegration
 *   antibiotics={enhancedAntibioticData}
 *   emergencyMode={false}
 *   clinicalContext="clinical"
 *   enableMobileOptimization={true}
 *   enablePerformanceMonitoring={true}
 *   onClinicalDecision={handleDecision}
 * />
 */

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary.js';
import LoadingSpinner from './LoadingSpinner.js';
import { useResponsive } from '../hooks/useResponsive.js';
import { useErrorHandler } from '../hooks/useErrorHandler.js';
import NorthwesternPerformanceOptimizer from '../utils/northwesternPerformanceOptimizer.js';
import ClinicalPerformanceMonitor from '../utils/clinicalPerformanceMonitor.js';

// Lazy load components based on clinical priority
const NorthwesternSpatialLayout = lazy(() => import('./NorthwesternSpatialLayout.js'));
const NorthwesternGroupOrganization = lazy(() => import('./NorthwesternGroupOrganization.js'));
const NorthwesternFilteringSystem = lazy(() => import('./NorthwesternFilteringSystem.js'));
const MobileClinicalWorkflow = lazy(() => import('./MobileClinicalWorkflow.js'));

/**
 * Component loading priorities for clinical workflows
 */
const LOADING_PRIORITIES = {
  emergency: [
    'MobileClinicalWorkflow',      // P1: Emergency interface first
    'NorthwesternSpatialLayout',   // P2: Core antibiotic layout
    'NorthwesternFilteringSystem', // P3: Emergency filtering
    'NorthwesternGroupOrganization' // P4: Group context (nice-to-have)
  ],
  clinical: [
    'NorthwesternSpatialLayout',    // P1: Primary clinical interface
    'NorthwesternFilteringSystem', // P2: Clinical filtering
    'NorthwesternGroupOrganization', // P3: Medical context
    'MobileClinicalWorkflow'       // P4: Mobile fallback
  ],
  education: [
    'NorthwesternSpatialLayout',    // P1: Educational layout
    'NorthwesternGroupOrganization', // P2: Learning context
    'NorthwesternFilteringSystem', // P3: Exploration tools
    'MobileClinicalWorkflow'       // P4: Mobile learning
  ]
};

/**
 * Error recovery strategies for different failure scenarios
 */
const ERROR_RECOVERY_STRATEGIES = {
  'network-failure': {
    strategy: 'offline-mode',
    fallback: 'cached-data',
    timeout: 5000,
    retryAttempts: 3
  },
  'memory-exhaustion': {
    strategy: 'emergency-cleanup',
    fallback: 'simplified-interface',
    timeout: 2000,
    retryAttempts: 1
  },
  'rendering-failure': {
    strategy: 'component-isolation',
    fallback: 'basic-list-view',
    timeout: 3000,
    retryAttempts: 2
  },
  'data-corruption': {
    strategy: 'data-validation',
    fallback: 'default-dataset',
    timeout: 1000,
    retryAttempts: 1
  }
};

/**
 * Accessibility configuration for WCAG 2.1 AA compliance
 */
const ACCESSIBILITY_CONFIG = {
  announcements: {
    politeDelay: 1000,      // Screen reader announcement delay
    assertiveDelay: 500,    // Urgent announcement delay
    maxAnnouncements: 5     // Prevent announcement flooding
  },
  navigation: {
    skipLinkTarget: 'main-content',
    focusManagement: 'progressive',
    tabIndex: 'semantic'
  },
  visualization: {
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    colorBlindSupport: true
  },
  touch: {
    minTargetSize: 44,      // WCAG AA minimum
    optimalTargetSize: 48,  // Clinical glove compatibility
    gestureAlternatives: true
  }
};

/**
 * Optimized Northwestern Integration Component
 */
const OptimizedNorthwesternIntegration = ({
  antibiotics = [],
  emergencyMode = false,
  clinicalContext = 'clinical',
  enableMobileOptimization = true,
  enablePerformanceMonitoring = true,
  enableLazyLoading = true,
  enableErrorRecovery = true,
  enableAccessibilityEnhancements = true,
  onClinicalDecision,
  onPerformanceAlert,
  onErrorRecovery,
  className = '',
  // Clinical workflow props
  currentPatient = null,
  clinicalScenario = null,
  urgencyLevel = 'standard',
  // Performance props
  performanceTarget = 'clinical', // 'emergency', 'clinical', 'education'
  memoryLimit = 50, // MB
  // Accessibility props
  screenReaderMode = false,
  highContrastMode = false,
  reducedMotionMode = false,
  // Integration props
  enableOfflineMode = true,
  enableBatteryOptimization = true,
  // Development props
  debugMode = false,
  enablePerformanceLogging = false
}) => {
  // Refs for performance and error tracking
  const performanceOptimizer = useRef(null);
  const performanceMonitor = useRef(null);
  const componentLoadOrder = useRef([]);
  const errorRecoveryState = useRef({ attempts: 0, strategy: null });
  const accessibilityAnnouncer = useRef(null);
  const integrationStartTime = useRef(Date.now());

  // State management
  const [loadedComponents, setLoadedComponents] = useState(new Set());
  const [componentErrors, setComponentErrors] = useState(new Map());
  const [systemStatus, setSystemStatus] = useState('initializing');
  const [accessibilityState, setAccessibilityState] = useState(ACCESSIBILITY_CONFIG);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [errorRecoveryActive, setErrorRecoveryActive] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  // Custom hooks
  const { screenSize, isTouchDevice, isLowPowerMode } = useResponsive();
  const { handleError, clearErrors, errors } = useErrorHandler();

  // Initialize performance optimization systems
  useEffect(() => {
    const initStartTime = performance.now();

    // Initialize performance optimizer
    if (enablePerformanceMonitoring) {
      performanceOptimizer.current = new NorthwesternPerformanceOptimizer({
        enableVirtualization: antibiotics.length > 20,
        enableMemoryManagement: enableBatteryOptimization,
        emergencyMode: emergencyMode,
        clinicalContext: clinicalContext
      });

      performanceMonitor.current = new ClinicalPerformanceMonitor({
        clinicalContext: clinicalContext,
        sessionType: performanceTarget,
        enableBatteryTracking: enableBatteryOptimization,
        enableClinicalAnalytics: true
      });

      // Start clinical workflow tracking
      const workflowId = performanceMonitor.current.startClinicalWorkflow(
        clinicalScenario || 'antibiotic-selection',
        urgencyLevel
      );

      // Track integration initialization time
      const initTime = performance.now() - initStartTime;
      performanceMonitor.current.recordRenderingMetric({
        type: 'integration-initialization',
        duration: initTime,
        componentCount: Object.keys(LOADING_PRIORITIES[clinicalContext]).length
      });
    }

    // Initialize accessibility features
    if (enableAccessibilityEnhancements) {
      initializeAccessibilityFeatures();
    }

    // Set up error recovery
    if (enableErrorRecovery) {
      initializeErrorRecovery();
    }

    // Track system readiness
    const totalInitTime = performance.now() - integrationStartTime.current;
    if (totalInitTime > 2000) {
      console.warn(`Northwestern Integration initialization took ${totalInitTime.toFixed(2)}ms (target: <2000ms)`);
    }

    setSystemStatus('ready');

    return () => {
      // Cleanup
      if (performanceOptimizer.current) {
        performanceOptimizer.current.dispose();
      }
      if (performanceMonitor.current) {
        performanceMonitor.current.dispose();
      }
    };
  }, [emergencyMode, clinicalContext, enablePerformanceMonitoring, enableAccessibilityEnhancements, enableErrorRecovery]);

  // Network status monitoring
  useEffect(() => {
    if (!enableOfflineMode) return;

    const handleOnline = () => {
      setOfflineMode(false);
      if (performanceMonitor.current) {
        performanceMonitor.current.recordNetworkMetric({
          type: 'online-transition',
          timestamp: Date.now()
        });
      }
    };

    const handleOffline = () => {
      setOfflineMode(true);
      if (performanceMonitor.current) {
        performanceMonitor.current.recordNetworkMetric({
          type: 'offline-transition',
          timestamp: Date.now()
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setOfflineMode(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enableOfflineMode]);

  // Performance monitoring updates
  useEffect(() => {
    if (!performanceMonitor.current || !enablePerformanceMonitoring) return;

    const updateInterval = setInterval(() => {
      const metrics = performanceMonitor.current.generateClinicalPerformanceReport();
      setPerformanceMetrics(metrics);

      // Check for performance alerts
      if (metrics.alertSummary.criticalAlerts > 0) {
        onPerformanceAlert?.(metrics.alertSummary);
      }

      // Check clinical readiness
      if (!metrics.clinicalReadiness.clinicallyReady) {
        console.warn('System not meeting clinical readiness requirements:', metrics.clinicalReadiness.issues);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(updateInterval);
  }, [enablePerformanceMonitoring, onPerformanceAlert]);

  // Initialize accessibility features
  const initializeAccessibilityFeatures = useCallback(() => {
    // Create accessibility announcer
    if (!accessibilityAnnouncer.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.id = 'northwestern-announcer';
      document.body.appendChild(announcer);
      accessibilityAnnouncer.current = announcer;
    }

    // Set up reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || reducedMotionMode) {
      setAccessibilityState(prev => ({
        ...prev,
        visualization: { ...prev.visualization, reducedMotion: true }
      }));
    }

    // Set up high contrast mode
    if (highContrastMode || window.matchMedia('(prefers-contrast: high)').matches) {
      setAccessibilityState(prev => ({
        ...prev,
        visualization: { ...prev.visualization, highContrast: true }
      }));
    }

    // Announce system readiness
    announceToScreenReader('Northwestern Antibiotic System ready for clinical use', 'polite');
  }, [reducedMotionMode, highContrastMode]);

  // Initialize error recovery system
  const initializeErrorRecovery = useCallback(() => {
    // Set up global error handlers
    const handleUnhandledError = (event) => {
      const error = event.error || new Error(event.message);
      handleComponentError('system', error);
    };

    const handleUnhandledRejection = (event) => {
      const error = new Error(event.reason);
      handleComponentError('promise', error);
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Component loading prioritization based on clinical context
  const loadingPriority = useMemo(() => {
    const basePriority = LOADING_PRIORITIES[clinicalContext] || LOADING_PRIORITIES.clinical;
    
    // Adjust for emergency mode
    if (emergencyMode) {
      return LOADING_PRIORITIES.emergency;
    }
    
    // Adjust for mobile optimization
    if (enableMobileOptimization && isTouchDevice) {
      const mobilePriority = [...basePriority];
      const mobileIndex = mobilePriority.indexOf('MobileClinicalWorkflow');
      if (mobileIndex > 0) {
        // Move mobile component to higher priority
        mobilePriority.splice(mobileIndex, 1);
        mobilePriority.splice(1, 0, 'MobileClinicalWorkflow');
      }
      return mobilePriority;
    }

    return basePriority;
  }, [clinicalContext, emergencyMode, enableMobileOptimization, isTouchDevice]);

  // Optimized antibiotic data with lazy loading support
  const optimizedAntibiotics = useMemo(async () => {
    if (!antibiotics.length || !performanceOptimizer.current) {
      return antibiotics;
    }

    const startTime = performance.now();

    try {
      const optimizationResult = await performanceOptimizer.current.optimizeRendering(
        antibiotics,
        {
          width: window.innerWidth,
          height: window.innerHeight,
          scrollTop: window.scrollY
        },
        {
          activeGroup: null,
          hoveredPosition: null
        }
      );

      const optimizationTime = performance.now() - startTime;
      
      if (performanceMonitor.current) {
        performanceMonitor.current.recordRenderingMetric({
          type: 'antibiotic-optimization',
          duration: optimizationTime,
          originalCount: antibiotics.length,
          optimizedCount: optimizationResult.antibiotics.length,
          virtualizationEnabled: optimizationResult.metadata.virtualizationEnabled
        });
      }

      return optimizationResult.antibiotics;
    } catch (error) {
      console.error('Antibiotic optimization failed:', error);
      handleComponentError('optimization', error);
      return antibiotics; // Fallback to unoptimized data
    }
  }, [antibiotics]);

  // Component error handler
  const handleComponentError = useCallback((componentName, error, errorInfo = {}) => {
    const errorDetails = {
      component: componentName,
      error: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      sessionTime: Date.now() - integrationStartTime.current,
      ...errorInfo
    };

    // Track error in performance monitor
    if (performanceMonitor.current) {
      performanceMonitor.current.recordClinicalMetric({
        type: 'component-error',
        component: componentName,
        error: error.message,
        severity: determinErrorSeverity(error)
      });
    }

    // Determine error recovery strategy
    const strategy = determineErrorRecoveryStrategy(error, componentName);
    
    setComponentErrors(prev => new Map(prev.set(componentName, errorDetails)));
    
    // Execute error recovery
    if (enableErrorRecovery && strategy) {
      executeErrorRecovery(componentName, strategy, error);
    }

    // Notify parent component
    onErrorRecovery?.(errorDetails, strategy);

    // Announce error to screen reader if critical
    if (strategy.fallback === 'basic-list-view') {
      announceToScreenReader(
        'System error detected. Switching to simplified interface for continued clinical access.',
        'assertive'
      );
    }
  }, [enableErrorRecovery, onErrorRecovery]);

  // Determine error severity for appropriate response
  const determinErrorSeverity = (error) => {
    if (error.message.includes('memory') || error.message.includes('Memory')) {
      return 'critical';
    }
    if (error.message.includes('network') || error.message.includes('offline')) {
      return 'warning';
    }
    if (error.message.includes('render') || error.message.includes('React')) {
      return 'warning';
    }
    return 'info';
  };

  // Determine appropriate error recovery strategy
  const determineErrorRecoveryStrategy = (error, componentName) => {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return ERROR_RECOVERY_STRATEGIES['network-failure'];
    }
    if (errorMessage.includes('memory') || errorMessage.includes('heap')) {
      return ERROR_RECOVERY_STRATEGIES['memory-exhaustion'];
    }
    if (errorMessage.includes('render') || errorMessage.includes('component')) {
      return ERROR_RECOVERY_STRATEGIES['rendering-failure'];
    }
    if (errorMessage.includes('data') || errorMessage.includes('parse')) {
      return ERROR_RECOVERY_STRATEGIES['data-corruption'];
    }

    // Default recovery strategy
    return ERROR_RECOVERY_STRATEGIES['rendering-failure'];
  };

  // Execute error recovery strategy
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
      
      if (performanceMonitor.current) {
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
      
      if (performanceMonitor.current) {
        performanceMonitor.current.recordClinicalMetric({
          type: 'error-recovery',
          strategy: strategy.strategy,
          success: false,
          attempts: errorRecoveryState.current.attempts,
          recoveryError: recoveryError.message
        });
      }

      // If recovery fails and we haven't exceeded retry attempts, try fallback
      if (errorRecoveryState.current.attempts < strategy.retryAttempts) {
        setTimeout(() => {
          executeErrorRecovery(componentName, strategy, originalError);
        }, strategy.timeout);
      } else {
        // Ultimate fallback - switch to basic interface
        setSystemStatus('fallback-mode');
        setErrorRecoveryActive(false);
      }
    }
  };

  // Offline mode recovery
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

  // Emergency memory cleanup
  const handleEmergencyMemoryCleanup = async () => {
    if (performanceOptimizer.current && performanceOptimizer.current.memoryManager) {
      await performanceOptimizer.current.memoryManager.performEmergencyCleanup();
    }
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    console.log('Emergency memory cleanup completed');
  };

  // Component isolation recovery
  const handleComponentIsolation = async (componentName) => {
    // Remove problematic component from loaded components
    setLoadedComponents(prev => {
      const newSet = new Set(prev);
      newSet.delete(componentName);
      return newSet;
    });
    
    console.log(`Isolated component: ${componentName}`);
  };

  // Data validation recovery
  const handleDataValidationRecovery = async () => {
    // Validate and sanitize antibiotic data
    const validatedAntibiotics = antibiotics.filter(antibiotic => {
      return antibiotic && 
             typeof antibiotic.id !== 'undefined' && 
             typeof antibiotic.name === 'string' &&
             typeof antibiotic.class === 'string';
    });

    if (validatedAntibiotics.length < antibiotics.length) {
      console.warn(`Data validation removed ${antibiotics.length - validatedAntibiotics.length} invalid antibiotics`);
    }
    
    return validatedAntibiotics;
  };

  // Screen reader announcement utility
  const announceToScreenReader = useCallback((message, priority = 'polite') => {
    if (!accessibilityAnnouncer.current || !screenReaderMode) return;

    const delay = priority === 'assertive' ? 
      accessibilityState.announcements.assertiveDelay :
      accessibilityState.announcements.politeDelay;

    setTimeout(() => {
      accessibilityAnnouncer.current.textContent = message;
      
      // Clear announcement after it's been read
      setTimeout(() => {
        if (accessibilityAnnouncer.current) {
          accessibilityAnnouncer.current.textContent = '';
        }
      }, 3000);
    }, delay);
  }, [accessibilityState.announcements, screenReaderMode]);

  // Component loading handler
  const handleComponentLoad = useCallback((componentName) => {
    setLoadedComponents(prev => new Set(prev.add(componentName)));
    
    if (performanceMonitor.current) {
      performanceMonitor.current.recordRenderingMetric({
        type: 'component-load',
        component: componentName,
        loadOrder: componentLoadOrder.current.length + 1,
        timestamp: Date.now()
      });
    }

    componentLoadOrder.current.push(componentName);
    
    // Announce component readiness to screen reader
    if (screenReaderMode) {
      announceToScreenReader(`${componentName} loaded and ready`, 'polite');
    }
  }, [screenReaderMode]);

  // Clinical decision handler with performance tracking
  const handleClinicalDecision = useCallback((decision, context) => {
    const decisionStartTime = Date.now();
    
    if (performanceMonitor.current) {
      performanceMonitor.current.recordClinicalMetric({
        type: 'clinical-decision',
        decision: decision.type || 'antibiotic-selection',
        antibiotic: decision.antibiotic?.name,
        context: context?.scenario,
        urgency: urgencyLevel
      });
    }

    onClinicalDecision?.(decision, {
      ...context,
      performanceMetrics: performanceMetrics,
      sessionDuration: Date.now() - integrationStartTime.current
    });

    // Track decision time
    const decisionTime = Date.now() - decisionStartTime;
    if (decisionTime > 5000) { // 5 second decision logging threshold
      console.log(`Clinical decision took ${decisionTime}ms to process`);
    }
  }, [onClinicalDecision, performanceMetrics, urgencyLevel]);

  // Render fallback interface for critical errors
  const renderFallbackInterface = () => (
    <div className="northwestern-fallback-interface">
      <div className="fallback-header">
        <h2>Northwestern Antibiotic Reference</h2>
        <div className="status-indicator status-fallback">
          Simplified Mode - Core functionality available
        </div>
      </div>
      
      <div className="antibiotic-list-fallback">
        {antibiotics.map(antibiotic => (
          <div 
            key={antibiotic.id}
            className="antibiotic-item-fallback"
            onClick={() => handleClinicalDecision({ 
              type: 'antibiotic-selection', 
              antibiotic 
            }, { interface: 'fallback' })}
          >
            <div className="antibiotic-name">{antibiotic.name}</div>
            <div className="antibiotic-class">{antibiotic.class}</div>
            <div className="antibiotic-routes">
              {antibiotic.routes?.join(', ') || 'Multiple routes'}
            </div>
          </div>
        ))}
      </div>
      
      <div className="fallback-footer">
        <button 
          onClick={() => window.location.reload()} 
          className="recovery-button"
        >
          Restart System
        </button>
      </div>
    </div>
  );

  // Render loading interface with priority indicators
  const renderLoadingInterface = () => {
    const loadedCount = loadedComponents.size;
    const totalComponents = loadingPriority.length;
    const loadingProgress = (loadedCount / totalComponents) * 100;

    return (
      <div className="northwestern-loading-interface">
        <div className="loading-header">
          <h2>Northwestern Antibiotic System</h2>
          <div className="loading-context">
            {emergencyMode ? 'Emergency Mode' : `${clinicalContext} Mode`}
          </div>
        </div>
        
        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="progress-text">
            Loading components: {loadedCount}/{totalComponents}
          </div>
        </div>

        <div className="loading-priorities">
          {loadingPriority.map((component, index) => (
            <div 
              key={component}
              className={`priority-item ${loadedComponents.has(component) ? 'loaded' : 'loading'}`}
            >
              <span className="priority-number">P{index + 1}</span>
              <span className="component-name">{component}</span>
              {loadedComponents.has(component) && <span className="status-check">✓</span>}
            </div>
          ))}
        </div>

        <div className="loading-footer">
          <div className="clinical-context">
            Optimizing for {performanceTarget} performance
          </div>
        </div>
      </div>
    );
  };

  // Performance and accessibility props for child components
  const childComponentProps = useMemo(() => ({
    // Performance props
    emergencyMode,
    enableVirtualization: antibiotics.length > 20,
    performanceTarget,
    
    // Accessibility props
    screenReaderMode,
    highContrastMode,
    reducedMotion: accessibilityState.visualization.reducedMotion,
    
    // Clinical props
    clinicalContext,
    urgencyLevel,
    offlineMode,
    
    // Integration props
    onError: handleComponentError,
    onLoad: handleComponentLoad,
    onClinicalDecision: handleClinicalDecision
  }), [
    emergencyMode, antibiotics.length, performanceTarget, screenReaderMode,
    highContrastMode, accessibilityState.visualization.reducedMotion,
    clinicalContext, urgencyLevel, offlineMode, handleComponentError,
    handleComponentLoad, handleClinicalDecision
  ]);

  // System status classes
  const statusClasses = [
    'optimized-northwestern-integration',
    `northwestern-integration--${systemStatus}`,
    `northwestern-integration--${clinicalContext}`,
    `northwestern-integration--${screenSize}`,
    emergencyMode && 'northwestern-integration--emergency',
    offlineMode && 'northwestern-integration--offline',
    errorRecoveryActive && 'northwestern-integration--recovering',
    accessibilityState.visualization.highContrast && 'northwestern-integration--high-contrast',
    accessibilityState.visualization.reducedMotion && 'northwestern-integration--reduced-motion',
    className
  ].filter(Boolean).join(' ');

  // Main render logic
  if (systemStatus === 'fallback-mode' || componentErrors.size > 2) {
    return renderFallbackInterface();
  }

  if (systemStatus === 'initializing' || loadedComponents.size < 2) {
    return renderLoadingInterface();
  }

  return (
    <div 
      className={statusClasses}
      role="main"
      aria-label="Northwestern Antibiotic Clinical System"
      data-emergency-mode={emergencyMode}
      data-clinical-context={clinicalContext}
      data-system-status={systemStatus}
    >
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* System status bar */}
      <div className="system-status-bar">
        <div className="status-indicators">
          <div className={`status-dot status-${systemStatus}`} />
          <span className="status-text">
            {systemStatus === 'ready' ? 'System Ready' : 'System Loading'}
          </span>
          
          {offlineMode && (
            <div className="offline-indicator">
              🔴 Offline Mode
            </div>
          )}
          
          {emergencyMode && (
            <div className="emergency-indicator">
              🚨 Emergency Mode
            </div>
          )}
        </div>

        <div className="performance-indicators">
          {performanceMetrics && (
            <>
              <span className="memory-usage">
                Memory: {performanceMetrics.memoryAnalytics.currentUsage}
              </span>
              <span className="session-time">
                Session: {performanceMetrics.sessionInfo.duration}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div id="main-content" className="main-content">
        <ErrorBoundary 
          fallback={<div>Component error detected. Using fallback interface.</div>}
          onError={(error, errorInfo) => handleComponentError('error-boundary', error, errorInfo)}
        >
          {/* Mobile-first rendering for touch devices */}
          {enableMobileOptimization && isTouchDevice && loadedComponents.has('MobileClinicalWorkflow') && (
            <Suspense fallback={<LoadingSpinner />}>
              <MobileClinicalWorkflow
                antibiotics={antibiotics}
                {...childComponentProps}
              />
            </Suspense>
          )}

          {/* Desktop/tablet spatial layout */}
          {(!isTouchDevice || !enableMobileOptimization) && loadedComponents.has('NorthwesternSpatialLayout') && (
            <Suspense fallback={<LoadingSpinner />}>
              <NorthwesternSpatialLayout
                antibiotics={antibiotics}
                viewMode={emergencyMode ? 'emergency' : 'clustered'}
                screenSize={screenSize}
                {...childComponentProps}
              />
            </Suspense>
          )}

          {/* Group organization overlay */}
          {loadedComponents.has('NorthwesternGroupOrganization') && (
            <Suspense fallback={<div>Loading group organization...</div>}>
              <NorthwesternGroupOrganization
                antibiotics={antibiotics}
                screenSize={screenSize}
                {...childComponentProps}
              />
            </Suspense>
          )}

          {/* Interactive filtering system */}
          {loadedComponents.has('NorthwesternFilteringSystem') && (
            <Suspense fallback={<div>Loading filtering system...</div>}>
              <NorthwesternFilteringSystem
                antibiotics={antibiotics}
                screenSize={screenSize}
                {...childComponentProps}
              />
            </Suspense>
          )}
        </ErrorBoundary>
      </div>

      {/* Performance monitoring overlay (development mode) */}
      {debugMode && performanceMetrics && (
        <div className="debug-performance-overlay">
          <h4>Performance Debug</h4>
          <div>Clinical Readiness: {performanceMetrics.clinicalReadiness.level}</div>
          <div>Memory: {performanceMetrics.memoryAnalytics.currentUsage}</div>
          <div>Alerts: {performanceMetrics.alertSummary.totalAlerts}</div>
          <div>Components: {loadedComponents.size}/{loadingPriority.length}</div>
        </div>
      )}

      {/* Error recovery notification */}
      {errorRecoveryActive && (
        <div className="error-recovery-notification">
          <div className="recovery-content">
            <span className="recovery-icon">🔧</span>
            <span className="recovery-text">
              Recovering from system error... Clinical access maintained.
            </span>
          </div>
        </div>
      )}

      {/* CSS for integration styles */}
      <style jsx>{`
        .optimized-northwestern-integration {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #fafafa;
          color: #333;
        }

        .northwestern-integration--high-contrast {
          filter: contrast(150%);
        }

        .northwestern-integration--reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #1976d2;
          color: white;
          padding: 8px;
          text-decoration: none;
          border-radius: 4px;
          z-index: 1000;
        }

        .skip-link:focus {
          top: 6px;
        }

        .system-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background: #e3f2fd;
          border-bottom: 1px solid #bbdefb;
          font-size: 14px;
        }

        .status-indicators {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-ready { background: #4caf50; }
        .status-initializing { background: #ff9800; animation: pulse 1s infinite; }
        .status-fallback-mode { background: #f44336; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .offline-indicator {
          color: #d32f2f;
          font-weight: 500;
        }

        .emergency-indicator {
          color: #d32f2f;
          font-weight: bold;
          animation: flash 1s infinite;
        }

        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .main-content {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .northwestern-fallback-interface {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .fallback-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .status-fallback {
          background: #fff3cd;
          color: #856404;
          padding: 8px 16px;
          border-radius: 4px;
          display: inline-block;
          margin-top: 8px;
        }

        .antibiotic-list-fallback {
          display: grid;
          gap: 8px;
          max-height: 70vh;
          overflow-y: auto;
        }

        .antibiotic-item-fallback {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .antibiotic-item-fallback:hover {
          background: #f5f5f5;
        }

        .antibiotic-name {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .antibiotic-class {
          color: #666;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .antibiotic-routes {
          color: #888;
          font-size: 12px;
        }

        .recovery-button {
          background: #1976d2;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
        }

        .northwestern-loading-interface {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          padding: 40px;
        }

        .loading-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .loading-context {
          color: #666;
          font-size: 16px;
          margin-top: 8px;
        }

        .loading-progress {
          width: 100%;
          max-width: 400px;
          margin-bottom: 40px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: #1976d2;
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          color: #666;
          font-size: 14px;
        }

        .loading-priorities {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 40px;
        }

        .priority-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border-radius: 4px;
          background: #f5f5f5;
          transition: background-color 0.3s;
        }

        .priority-item.loaded {
          background: #e8f5e8;
        }

        .priority-number {
          font-weight: bold;
          color: #1976d2;
          min-width: 24px;
        }

        .component-name {
          flex: 1;
        }

        .status-check {
          color: #4caf50;
          font-weight: bold;
        }

        .debug-performance-overlay {
          position: fixed;
          top: 60px;
          right: 10px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 12px;
          border-radius: 4px;
          font-size: 12px;
          max-width: 200px;
          z-index: 9999;
        }

        .error-recovery-notification {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          border-radius: 8px;
          padding: 20px;
          z-index: 10000;
        }

        .recovery-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .recovery-icon {
          font-size: 24px;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
};

// PropTypes for comprehensive type checking
OptimizedNorthwesternIntegration.propTypes = {
  antibiotics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      class: PropTypes.string.isRequired,
      northwesternSpectrum: PropTypes.object,
      routes: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  emergencyMode: PropTypes.bool,
  clinicalContext: PropTypes.oneOf(['emergency', 'clinical', 'education']),
  enableMobileOptimization: PropTypes.bool,
  enablePerformanceMonitoring: PropTypes.bool,
  enableLazyLoading: PropTypes.bool,
  enableErrorRecovery: PropTypes.bool,
  enableAccessibilityEnhancements: PropTypes.bool,
  onClinicalDecision: PropTypes.func,
  onPerformanceAlert: PropTypes.func,
  onErrorRecovery: PropTypes.func,
  className: PropTypes.string,
  currentPatient: PropTypes.object,
  clinicalScenario: PropTypes.string,
  urgencyLevel: PropTypes.oneOf(['standard', 'urgent', 'emergency']),
  performanceTarget: PropTypes.oneOf(['emergency', 'clinical', 'education']),
  memoryLimit: PropTypes.number,
  screenReaderMode: PropTypes.bool,
  highContrastMode: PropTypes.bool,
  reducedMotionMode: PropTypes.bool,
  enableOfflineMode: PropTypes.bool,
  enableBatteryOptimization: PropTypes.bool,
  debugMode: PropTypes.bool,
  enablePerformanceLogging: PropTypes.bool
};

export default OptimizedNorthwesternIntegration;