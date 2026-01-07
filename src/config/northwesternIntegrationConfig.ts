/**
 * Northwestern Integration Configuration
 * Constants and configuration for OptimizedNorthwesternIntegration
 * Extracted during Phase 4 refactoring
 */

// Type definitions
type ClinicalContextType = 'emergency' | 'clinical' | 'education';
type ErrorSeverity = 'critical' | 'warning' | 'info';

interface ErrorRecoveryStrategy {
  strategy: string;
  fallback: string;
  timeout: number;
  retryAttempts: number;
}

/**
 * Component loading priorities for clinical workflows
 */
export const LOADING_PRIORITIES = {
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
export const ERROR_RECOVERY_STRATEGIES = {
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
export const ACCESSIBILITY_CONFIG = {
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
 * Performance targets for clinical workflows
 */
export const PERFORMANCE_TARGETS = {
  initialLoad: 2000,       // <2000ms for complete system
  emergencyAccess: 30000,  // <30s to critical info
  filterResponse: 100,     // <100ms for filtering
  memoryLimit: 50,         // <50MB sustained
  touchResponse: 100,      // <100ms mobile feedback
  errorRecovery: 5000      // <5s graceful degradation
};

/**
 * Determine error severity based on error message
 * @param {Error} error - The error object
 * @returns {string} Severity level
 */
export const determineErrorSeverity = (error: Error): ErrorSeverity => {
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

/**
 * Determine appropriate error recovery strategy
 * @param {Error} error - The error object
 * @param {string} componentName - Name of the component that errored
 * @returns {Object} Recovery strategy
 */
export const determineErrorRecoveryStrategy = (error: Error, componentName: string): ErrorRecoveryStrategy => {
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

/**
 * Get loading priority based on context and device
 * @param {string} clinicalContext - Clinical context type
 * @param {boolean} emergencyMode - Emergency mode flag
 * @param {boolean} isTouchDevice - Touch device flag
 * @param {boolean} enableMobileOptimization - Mobile optimization enabled
 * @returns {Array} Prioritized component list
 */
export const getLoadingPriority = (
  clinicalContext: ClinicalContextType,
  emergencyMode: boolean,
  isTouchDevice: boolean,
  enableMobileOptimization: boolean
): string[] => {
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
};

export default {
  LOADING_PRIORITIES,
  ERROR_RECOVERY_STRATEGIES,
  ACCESSIBILITY_CONFIG,
  PERFORMANCE_TARGETS,
  determineErrorSeverity,
  determineErrorRecoveryStrategy,
  getLoadingPriority
};
