import { useState, useCallback } from 'react';
import { 
  getSafetyConfig, 
  needsSafetyWarning, 
  SAFETY_BANNER_CONFIG 
} from '../config/medicalSafetyConfig';

/**
 * Custom hook for managing medical safety warnings and banners
 * 
 * @param {string} componentName - Name of the component using this hook
 * @returns {Object} Safety configuration and banner management functions
 */
export const useMedicalSafety = (componentName) => {
  const [dismissedBanners, setDismissedBanners] = useState(new Set());
  
  const safetyConfig = getSafetyConfig(componentName);
  const showWarning = needsSafetyWarning(componentName);
  
  // Determine if banner should be visible
  const shouldShowBanner = useCallback(() => {
    if (!safetyConfig || !showWarning) return false;
    
    // Check environment settings
    const isDevelopment = process.env.NODE_ENV === 'development';
    const showInProduction = SAFETY_BANNER_CONFIG.productionOverrides[componentName] || false;
    
    if (!isDevelopment && !showInProduction) return false;
    
    // Check if banner was dismissed
    const isDismissible = SAFETY_BANNER_CONFIG.dismissibleByRisk[safetyConfig.riskLevel] ?? true;
    if (isDismissible && dismissedBanners.has(componentName)) return false;
    
    return true;
  }, [componentName, safetyConfig, showWarning, dismissedBanners]);
  
  // Handle banner dismissal
  const dismissBanner = useCallback(() => {
    const isDismissible = SAFETY_BANNER_CONFIG.dismissibleByRisk[safetyConfig?.riskLevel] ?? true;
    
    if (isDismissible) {
      setDismissedBanners(prev => new Set(prev.add(componentName)));
    }
  }, [componentName, safetyConfig]);
  
  // Reset dismissed banners (useful for testing)
  const resetDismissed = useCallback(() => {
    setDismissedBanners(prev => {
      const newSet = new Set(prev);
      newSet.delete(componentName);
      return newSet;
    });
  }, [componentName]);
  
  // Get banner props ready to pass to MedicalSafetyBanner component
  const getBannerProps = useCallback(() => {
    if (!safetyConfig) return null;
    
    const isDismissible = SAFETY_BANNER_CONFIG.dismissibleByRisk[safetyConfig.riskLevel] ?? true;
    const showInProduction = SAFETY_BANNER_CONFIG.productionOverrides[componentName] || false;
    
    return {
      componentName,
      currentCoverage: safetyConfig.currentCoverage,
      targetCoverage: safetyConfig.targetCoverage,
      riskLevel: safetyConfig.riskLevel,
      medicalRisks: safetyConfig.medicalRisks || [],
      isDismissible,
      onDismiss: dismissBanner,
      showInProduction
    };
  }, [componentName, safetyConfig, dismissBanner]);
  
  return {
    // Safety configuration
    safetyConfig,
    showWarning,
    shouldShowBanner: shouldShowBanner(),
    
    // Banner management
    getBannerProps,
    dismissBanner,
    resetDismissed,
    
    // Utility functions
    isDismissed: dismissedBanners.has(componentName),
    isHighRisk: safetyConfig?.riskLevel === 'critical' || safetyConfig?.riskLevel === 'high',
    requiresEmergencyAccess: safetyConfig?.emergencyAccess === true,
    
    // Development helpers
    isDevelopment: process.env.NODE_ENV === 'development',
    debugInfo: {
      componentName,
      config: safetyConfig,
      dismissed: dismissedBanners.has(componentName),
      shouldShow: shouldShowBanner()
    }
  };
};

/**
 * Hook for getting global medical safety statistics
 * Useful for dashboards and monitoring components
 */
export const useMedicalSafetyStats = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Import the stats function here to avoid circular dependencies
  const getCoverageStats = () => {
    const { MEDICAL_SAFETY_CONFIG } = require('../config/medicalSafetyConfig');
    const components = Object.values(MEDICAL_SAFETY_CONFIG);
    const total = components.length;
    const critical = components.filter(c => c.riskLevel === 'critical').length;
    const high = components.filter(c => c.riskLevel === 'high').length;
    const covered = components.filter(c => c.currentCoverage >= c.targetCoverage).length;
    const untested = components.filter(c => !c.hasTestFile).length;
    
    return {
      total,
      critical,
      high,
      covered,
      untested,
      coverageRate: (covered / total * 100).toFixed(1),
      lastUpdated: new Date().toISOString()
    };
  };
  
  const stats = getCoverageStats();
  
  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);
  
  return {
    ...stats,
    refresh,
    refreshKey
  };
};

export default useMedicalSafety;