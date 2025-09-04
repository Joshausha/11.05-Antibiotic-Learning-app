import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Shield, AlertCircle } from 'lucide-react';

/**
 * Medical Safety Warning Banner Component
 * 
 * Displays prominent warnings for components lacking adequate test coverage
 * in medical education applications where clinical accuracy is critical.
 * 
 * @param {Object} props - Component props
 * @param {string} props.componentName - Name of the component being tested
 * @param {number} props.currentCoverage - Current test coverage percentage (0-100)
 * @param {number} props.targetCoverage - Target coverage percentage required
 * @param {string} props.riskLevel - Risk level: 'critical', 'high', 'medium', 'low'
 * @param {Array} props.medicalRisks - Array of specific medical risks
 * @param {boolean} props.isDismissible - Whether banner can be dismissed
 * @param {Function} props.onDismiss - Callback when banner is dismissed
 * @param {boolean} props.showInProduction - Whether to show in production (default: false)
 */
const MedicalSafetyBanner = ({
  componentName,
  currentCoverage = 0,
  targetCoverage = 85,
  riskLevel = 'high',
  medicalRisks = [],
  isDismissible = true,
  onDismiss,
  showInProduction = false
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Don't show in production unless explicitly enabled
  if (!isDevelopment && !showInProduction) {
    return null;
  }

  // Don't show if dismissed and dismissible
  if (isDismissed && isDismissible) {
    return null;
  }

  // Don't show if coverage meets target
  if (currentCoverage >= targetCoverage) {
    return null;
  }

  // Risk level styling configuration
  const riskStyles = {
    critical: {
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
      buttonColor: 'text-red-600 hover:bg-red-100',
      icon: AlertTriangle,
      label: 'CRITICAL RISK'
    },
    high: {
      bgColor: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-800',
      iconColor: 'text-orange-600',
      buttonColor: 'text-orange-600 hover:bg-orange-100',
      icon: AlertCircle,
      label: 'HIGH RISK'
    },
    medium: {
      bgColor: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600',
      buttonColor: 'text-yellow-600 hover:bg-yellow-100',
      icon: AlertCircle,
      label: 'MEDIUM RISK'
    },
    low: {
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
      buttonColor: 'text-blue-600 hover:bg-blue-100',
      icon: Shield,
      label: 'ATTENTION'
    }
  };

  const currentStyle = riskStyles[riskLevel] || riskStyles.high;
  const IconComponent = currentStyle.icon;

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  // Calculate coverage gap
  const coverageGap = targetCoverage - currentCoverage;

  if (!isVisible) return null;

  return (
    <div 
      className={`border-l-4 p-4 mb-4 ${currentStyle.bgColor} border-l-red-500`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Warning Icon */}
          <div className={`flex-shrink-0 ${currentStyle.iconColor}`}>
            <IconComponent size={24} aria-hidden="true" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-bold uppercase tracking-wide ${currentStyle.textColor}`}>
                {currentStyle.label}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-60 ${currentStyle.textColor}`}>
                MEDICAL EDUCATION COMPONENT
              </span>
            </div>

            {/* Main Message */}
            <div className={currentStyle.textColor}>
              <p className="font-semibold text-base mb-1">
                Component "{componentName}" has inadequate test coverage for medical education use
              </p>
              
              <div className="text-sm space-y-1">
                <p>
                  <strong>Current Coverage:</strong> {currentCoverage.toFixed(1)}% • 
                  <strong> Target:</strong> {targetCoverage}% • 
                  <strong> Gap:</strong> {coverageGap.toFixed(1)}%
                </p>
                
                {medicalRisks.length > 0 && (
                  <div>
                    <strong>Medical Risks:</strong>
                    <ul className="list-disc list-inside mt-1 ml-4 space-y-1">
                      {medicalRisks.map((risk, index) => (
                        <li key={index} className="text-sm">{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Disclaimer */}
            <div className={`text-xs p-3 rounded-md bg-white bg-opacity-40 ${currentStyle.textColor}`}>
              <div className="flex items-start space-x-2">
                <Shield size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold mb-1">MEDICAL EDUCATION DISCLAIMER:</p>
                  <p>
                    This component lacks comprehensive testing required for medical education applications. 
                    Clinical accuracy and patient safety cannot be guaranteed. Use for educational 
                    demonstration only. Always consult current medical guidelines and supervising physicians.
                  </p>
                </div>
              </div>
            </div>

            {/* Development Info */}
            {isDevelopment && (
              <div className="text-xs mt-2 p-2 bg-gray-100 rounded">
                <strong>Development Note:</strong> This banner appears in development mode only. 
                Increase test coverage to {targetCoverage}% to remove this warning.
              </div>
            )}
          </div>
        </div>

        {/* Dismiss Button */}
        {isDismissible && (
          <button
            onClick={handleDismiss}
            className={`flex-shrink-0 ml-4 p-1 rounded-md transition-colors ${currentStyle.buttonColor}`}
            aria-label="Dismiss medical safety warning"
            type="button"
          >
            <X size={20} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MedicalSafetyBanner;