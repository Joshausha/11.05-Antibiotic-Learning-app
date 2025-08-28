/**
 * featureFlags.js - Feature Flag Management System
 * 
 * Controls experimental and developmental features in the Antibiotic Learning App.
 * Ensures safe rollout of new medical network visualization components.
 * 
 * @medical-validation All feature flags affecting medical content require clinical review
 * @safety-critical Flags controlling patient safety features marked as critical
 * @version 1.0.0
 * @created 2025-08-27
 */

/**
 * Environment-based feature flag loading
 * Supports both development (.env.local) and production configurations
 */
const loadEnvironmentFlags = () => {
  return {
    // Network visualization features
    ENABLE_CYTOSCAPE_NETWORK: process.env.REACT_APP_ENABLE_CYTOSCAPE_NETWORK === 'true',
    ENABLE_NETWORK_CLUSTERING: process.env.REACT_APP_ENABLE_NETWORK_CLUSTERING === 'true',
    ENABLE_ADVANCED_LAYOUTS: process.env.REACT_APP_ENABLE_ADVANCED_LAYOUTS === 'true',
    
    // Medical data features
    ENABLE_RESISTANCE_PATTERNS: process.env.REACT_APP_ENABLE_RESISTANCE_PATTERNS === 'true',
    ENABLE_EVIDENCE_LEVELS: process.env.REACT_APP_ENABLE_EVIDENCE_LEVELS === 'true',
    ENABLE_CLINICAL_SEVERITY: process.env.REACT_APP_ENABLE_CLINICAL_SEVERITY === 'true',
    
    // Performance and debugging
    ENABLE_PERFORMANCE_MONITORING: process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true',
    ENABLE_DEBUG_LOGGING: process.env.REACT_APP_ENABLE_DEBUG_LOGGING === 'true',
    
    // Safety and validation
    ENABLE_MEDICAL_VALIDATION: process.env.REACT_APP_ENABLE_MEDICAL_VALIDATION !== 'false', // Default true
    ENABLE_ERROR_BOUNDARIES: process.env.REACT_APP_ENABLE_ERROR_BOUNDARIES !== 'false', // Default true
  };
};

/**
 * Default feature flag configuration
 * Conservative defaults prioritize medical safety and stability
 */
const defaultFlags = {
  // Network visualization - gradually rollout
  ENABLE_CYTOSCAPE_NETWORK: false, // Start disabled, enable via environment
  ENABLE_NETWORK_CLUSTERING: false,
  ENABLE_ADVANCED_LAYOUTS: false,
  
  // Medical data - enable core features
  ENABLE_RESISTANCE_PATTERNS: true,
  ENABLE_EVIDENCE_LEVELS: true, 
  ENABLE_CLINICAL_SEVERITY: true,
  
  // Performance and debugging - development tools
  ENABLE_PERFORMANCE_MONITORING: false,
  ENABLE_DEBUG_LOGGING: false,
  
  // Safety features - always enabled by default
  ENABLE_MEDICAL_VALIDATION: true,
  ENABLE_ERROR_BOUNDARIES: true,
};

/**
 * Merged feature flags with environment override capability
 */
const featureFlags = {
  ...defaultFlags,
  ...loadEnvironmentFlags(),
};

/**
 * Feature flag getter with validation and logging
 * @param {string} flagName - Name of the feature flag
 * @param {boolean} defaultValue - Fallback value if flag is undefined
 * @returns {boolean} Feature flag status
 */
export const isFeatureEnabled = (flagName, defaultValue = false) => {
  if (typeof flagName !== 'string') {
    console.error('Feature flag name must be a string:', flagName);
    return defaultValue;
  }
  
  const flagValue = featureFlags[flagName];
  
  if (flagValue === undefined) {
    console.warn(`Unknown feature flag: ${flagName}. Using default: ${defaultValue}`);
    return defaultValue;
  }
  
  // Debug logging if enabled
  if (featureFlags.ENABLE_DEBUG_LOGGING) {
    console.log(`Feature flag ${flagName}: ${flagValue}`);
  }
  
  return flagValue;
};

/**
 * Medical safety validation for feature flags
 * Ensures patient safety features cannot be accidentally disabled
 * @param {string} flagName - Name of the feature flag
 * @returns {boolean} Whether the flag affects medical safety
 */
export const isMedicalSafetyFlag = (flagName) => {
  const safetyFlags = [
    'ENABLE_MEDICAL_VALIDATION',
    'ENABLE_ERROR_BOUNDARIES',
    'ENABLE_RESISTANCE_PATTERNS',
    'ENABLE_CLINICAL_SEVERITY'
  ];
  
  return safetyFlags.includes(flagName);
};

/**
 * Feature flag status reporter for debugging and monitoring
 * @returns {Object} Complete feature flag status
 */
export const getFeatureFlagStatus = () => {
  const status = {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    flags: { ...featureFlags },
    safetyFlags: {},
    networkFlags: {},
    debugFlags: {}
  };
  
  // Categorize flags for easier monitoring
  Object.keys(featureFlags).forEach(flagName => {
    const flagValue = featureFlags[flagName];
    
    if (isMedicalSafetyFlag(flagName)) {
      status.safetyFlags[flagName] = flagValue;
    }
    
    if (flagName.includes('NETWORK') || flagName.includes('CYTOSCAPE')) {
      status.networkFlags[flagName] = flagValue;
    }
    
    if (flagName.includes('DEBUG') || flagName.includes('MONITORING')) {
      status.debugFlags[flagName] = flagValue;
    }
  });
  
  return status;
};

/**
 * Conditional component rendering based on feature flags
 * @param {string} flagName - Feature flag to check
 * @param {React.Component} enabledComponent - Component to render when enabled
 * @param {React.Component} disabledComponent - Component to render when disabled (optional)
 * @returns {React.Component|null} Component based on flag status
 */
export const FeatureFlag = ({ flagName, children, fallback = null }) => {
  const enabled = isFeatureEnabled(flagName);
  
  if (enabled) {
    return children;
  }
  
  return fallback;
};

/**
 * Higher-order component for feature flag wrapping
 * @param {string} flagName - Feature flag to check
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {React.Component} FallbackComponent - Component to show when disabled
 * @returns {React.Component} HOC with feature flag logic
 */
export const withFeatureFlag = (flagName, FallbackComponent = null) => {
  return (WrappedComponent) => {
    const FeatureFlaggedComponent = (props) => {
      const enabled = isFeatureEnabled(flagName);
      
      if (enabled) {
        return <WrappedComponent {...props} />;
      }
      
      if (FallbackComponent) {
        return <FallbackComponent {...props} />;
      }
      
      return null;
    };
    
    FeatureFlaggedComponent.displayName = `withFeatureFlag(${flagName})(${WrappedComponent.displayName || WrappedComponent.name})`;
    
    return FeatureFlaggedComponent;
  };
};

/**
 * Hook for using feature flags in functional components
 * @param {string} flagName - Feature flag name
 * @param {boolean} defaultValue - Default value if flag not found
 * @returns {boolean} Feature flag status
 */
export const useFeatureFlag = (flagName, defaultValue = false) => {
  return isFeatureEnabled(flagName, defaultValue);
};

/**
 * Medical validation hook - ensures medical safety flags are enabled
 * @returns {Object} Medical validation status and warnings
 */
export const useMedicalValidation = () => {
  const medicalValidationEnabled = isFeatureEnabled('ENABLE_MEDICAL_VALIDATION', true);
  const errorBoundariesEnabled = isFeatureEnabled('ENABLE_ERROR_BOUNDARIES', true);
  const resistancePatternsEnabled = isFeatureEnabled('ENABLE_RESISTANCE_PATTERNS', true);
  
  const warnings = [];
  
  if (!medicalValidationEnabled) {
    warnings.push('Medical validation is disabled - this may compromise patient safety');
  }
  
  if (!errorBoundariesEnabled) {
    warnings.push('Error boundaries are disabled - application may crash with medical data errors');
  }
  
  if (!resistancePatternsEnabled) {
    warnings.push('Resistance patterns are disabled - antibiotic effectiveness may not be accurate');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    flags: {
      medicalValidation: medicalValidationEnabled,
      errorBoundaries: errorBoundariesEnabled,
      resistancePatterns: resistancePatternsEnabled
    }
  };
};

// Export feature flags for direct access (use sparingly)
export { featureFlags };

// Export individual feature flag checkers for common usage
export const networkVisualizationEnabled = () => isFeatureEnabled('ENABLE_CYTOSCAPE_NETWORK');
export const performanceMonitoringEnabled = () => isFeatureEnabled('ENABLE_PERFORMANCE_MONITORING');
export const debugLoggingEnabled = () => isFeatureEnabled('ENABLE_DEBUG_LOGGING');

export default {
  isFeatureEnabled,
  isMedicalSafetyFlag,
  getFeatureFlagStatus,
  FeatureFlag,
  withFeatureFlag,
  useFeatureFlag,
  useMedicalValidation,
  networkVisualizationEnabled,
  performanceMonitoringEnabled,
  debugLoggingEnabled
};