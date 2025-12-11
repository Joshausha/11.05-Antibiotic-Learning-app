/**
 * Optimized Northwestern Integration Component
 *
 * Complete Phase 3 system integration with performance enhancements, lazy loading optimization,
 * error recovery, and clinical accessibility validation for Northwestern antibiotic system.
 *
 * Refactored in Phase 4 to use extracted modules for better maintainability.
 *
 * @component
 */

import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary.js';
import LoadingSpinner from './LoadingSpinner.js';
import { useResponsive } from '../hooks/useResponsive.js';
import { useErrorHandler } from '../hooks/useErrorHandler.js';
import useNorthwesternErrorRecovery from '../hooks/useNorthwesternErrorRecovery';
import NorthwesternPerformanceOptimizer from '../utils/northwesternPerformanceOptimizer';
import ClinicalPerformanceMonitor from '../utils/clinicalPerformanceMonitor';
import {
  ACCESSIBILITY_CONFIG,
  getLoadingPriority
} from '../config/northwesternIntegrationConfig.js';
import NorthwesternFallbackInterface from './northwestern/NorthwesternFallbackInterface.js';
import NorthwesternLoadingInterface from './northwestern/NorthwesternLoadingInterface.js';
import './northwestern/OptimizedNorthwesternIntegration.css';

// Lazy load components based on clinical priority
const NorthwesternSpatialLayout = lazy(() => import('./NorthwesternSpatialLayout.js'));
const NorthwesternGroupOrganization = lazy(() => import('./NorthwesternGroupOrganization.js'));
const NorthwesternFilteringSystem = lazy(() => import('./NorthwesternFilteringSystem.js'));
const MobileClinicalWorkflow = lazy(() => import('./MobileClinicalWorkflow.js'));

/**
 * Optimized Northwestern Integration Component
 */
const OptimizedNorthwesternIntegration = ({
  antibiotics = [],
  emergencyMode = false,
  clinicalContext = 'clinical',
  enableMobileOptimization = true,
  enablePerformanceMonitoring = true,
  enableErrorRecovery = true,
  enableAccessibilityEnhancements = true,
  onClinicalDecision,
  onPerformanceAlert,
  onErrorRecovery,
  className = '',
  currentPatient = null,
  clinicalScenario = null,
  urgencyLevel = 'standard',
  performanceTarget = 'clinical',
  memoryLimit = 50,
  screenReaderMode = false,
  highContrastMode = false,
  reducedMotionMode = false,
  enableOfflineMode = true,
  enableBatteryOptimization = true,
  debugMode = false
}) => {
  // Refs for performance tracking
  const performanceOptimizer = useRef(null);
  const performanceMonitor = useRef(null);
  const componentLoadOrder = useRef([]);
  const accessibilityAnnouncer = useRef(null);
  const integrationStartTime = useRef(Date.now());

  // State management
  const [systemStatus, setSystemStatus] = useState('initializing');
  const [accessibilityState, setAccessibilityState] = useState(ACCESSIBILITY_CONFIG);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  // Custom hooks
  const { screenSize, isTouchDevice, isLowPowerMode } = useResponsive();
  const { handleError, clearErrors, errors } = useErrorHandler();

  // Error recovery hook
  const {
    componentErrors,
    errorRecoveryActive,
    offlineMode,
    loadedComponents,
    handleComponentError,
    setOfflineMode,
    setLoadedComponents
  } = useNorthwesternErrorRecovery({
    enabled: enableErrorRecovery,
    performanceMonitor,
    onErrorRecovery,
    announceToScreenReader,
    integrationStartTime: integrationStartTime.current
  });

  // Component loading prioritization
  const loadingPriority = useMemo(() => {
    return getLoadingPriority(clinicalContext, emergencyMode, isTouchDevice, enableMobileOptimization);
  }, [clinicalContext, emergencyMode, isTouchDevice, enableMobileOptimization]);

  // Screen reader announcement utility
  function announceToScreenReader(message, priority = 'polite') {
    if (!accessibilityAnnouncer.current || !screenReaderMode) return;

    const delay = priority === 'assertive' ?
      accessibilityState.announcements.assertiveDelay :
      accessibilityState.announcements.politeDelay;

    setTimeout(() => {
      accessibilityAnnouncer.current.textContent = message;
      setTimeout(() => {
        if (accessibilityAnnouncer.current) {
          accessibilityAnnouncer.current.textContent = '';
        }
      }, 3000);
    }, delay);
  }

  // Initialize performance optimization systems
  useEffect(() => {
    const initStartTime = performance.now();

    if (enablePerformanceMonitoring) {
      performanceOptimizer.current = new NorthwesternPerformanceOptimizer({
        enableVirtualization: antibiotics.length > 20,
        enableMemoryManagement: enableBatteryOptimization,
        emergencyMode,
        clinicalContext
      });

      performanceMonitor.current = new ClinicalPerformanceMonitor({
        clinicalContext,
        sessionType: performanceTarget,
        enableBatteryTracking: enableBatteryOptimization,
        enableClinicalAnalytics: true
      });

      performanceMonitor.current.startClinicalWorkflow(
        clinicalScenario || 'antibiotic-selection',
        urgencyLevel
      );
    }

    // Initialize accessibility
    if (enableAccessibilityEnhancements) {
      initializeAccessibilityFeatures();
    }

    setSystemStatus('ready');

    return () => {
      if (performanceOptimizer.current) performanceOptimizer.current.dispose();
      if (performanceMonitor.current) performanceMonitor.current.dispose();
    };
  }, [emergencyMode, clinicalContext, enablePerformanceMonitoring, enableAccessibilityEnhancements]);

  // Network status monitoring
  useEffect(() => {
    if (!enableOfflineMode) return;

    const handleOnline = () => setOfflineMode(false);
    const handleOffline = () => setOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) setOfflineMode(true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enableOfflineMode, setOfflineMode]);

  // Performance monitoring updates
  useEffect(() => {
    if (!performanceMonitor.current || !enablePerformanceMonitoring) return;

    const updateInterval = setInterval(() => {
      const metrics = performanceMonitor.current.generateClinicalPerformanceReport();
      setPerformanceMetrics(metrics);

      if (metrics.alertSummary.criticalAlerts > 0) {
        onPerformanceAlert?.(metrics.alertSummary);
      }
    }, 5000);

    return () => clearInterval(updateInterval);
  }, [enablePerformanceMonitoring, onPerformanceAlert]);

  // Initialize accessibility features
  const initializeAccessibilityFeatures = useCallback(() => {
    if (!accessibilityAnnouncer.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.id = 'northwestern-announcer';
      document.body.appendChild(announcer);
      accessibilityAnnouncer.current = announcer;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || reducedMotionMode) {
      setAccessibilityState(prev => ({
        ...prev,
        visualization: { ...prev.visualization, reducedMotion: true }
      }));
    }

    if (highContrastMode || window.matchMedia('(prefers-contrast: high)').matches) {
      setAccessibilityState(prev => ({
        ...prev,
        visualization: { ...prev.visualization, highContrast: true }
      }));
    }

    announceToScreenReader('Northwestern Antibiotic System ready for clinical use', 'polite');
  }, [reducedMotionMode, highContrastMode]);

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

    if (screenReaderMode) {
      announceToScreenReader(`${componentName} loaded and ready`, 'polite');
    }
  }, [screenReaderMode, setLoadedComponents]);

  // Clinical decision handler
  const handleClinicalDecision = useCallback((decision, context) => {
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
      performanceMetrics,
      sessionDuration: Date.now() - integrationStartTime.current
    });
  }, [onClinicalDecision, performanceMetrics, urgencyLevel]);

  // Child component props
  const childComponentProps = useMemo(() => ({
    emergencyMode,
    enableVirtualization: antibiotics.length > 20,
    performanceTarget,
    screenReaderMode,
    highContrastMode,
    reducedMotion: accessibilityState.visualization.reducedMotion,
    clinicalContext,
    urgencyLevel,
    offlineMode,
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

  // Render fallback for critical errors
  if (systemStatus === 'fallback-mode' || componentErrors.size > 2) {
    return (
      <NorthwesternFallbackInterface
        antibiotics={antibiotics}
        onClinicalDecision={handleClinicalDecision}
      />
    );
  }

  // Render loading interface
  if (systemStatus === 'initializing' || loadedComponents.size < 2) {
    return (
      <NorthwesternLoadingInterface
        loadedComponents={loadedComponents}
        loadingPriority={loadingPriority}
        emergencyMode={emergencyMode}
        clinicalContext={clinicalContext}
        performanceTarget={performanceTarget}
      />
    );
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
            <div className="offline-indicator">🔴 Offline Mode</div>
          )}

          {emergencyMode && (
            <div className="emergency-indicator">🚨 Emergency Mode</div>
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
  debugMode: PropTypes.bool
};

export default OptimizedNorthwesternIntegration;
