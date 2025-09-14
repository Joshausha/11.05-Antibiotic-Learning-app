/**
 * PathogenNetworkVisualization.jsx - Integrated Medical Network Visualization
 * 
 * Main component that integrates CytoscapeWrapper and NetworkDataAdapter
 * with feature flag controls and medical safety validations.
 * 
 * @medical-validation All network data must preserve clinical accuracy
 * @safety-critical Component includes error boundaries for patient safety
 * @performance-target <2 seconds render time for emergency clinical use
 * @version 1.0.0
 * @created 2025-08-27
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  useFeatureFlag, 
  useMedicalValidation,
  FeatureFlag,
  debugLoggingEnabled,
  performanceMonitoringEnabled
} from '../../utils/featureFlags';
import CytoscapeWrapper from './CytoscapeWrapper';
import { transformMedicalDataToCytoscape, getNetworkStatistics } from './NetworkDataAdapter';
import { SimplePathogenData } from '../../data/SimplePathogenData';
import { pathogenAntibioticMap } from '../../data/pathogenAntibioticMap';

/**
 * Error Boundary for medical network visualization safety
 */
class NetworkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Log medical safety errors
    console.error('Medical Network Visualization Error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="network-error-fallback bg-red-50 border-2 border-red-200 rounded-lg p-6 m-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-100 rounded-full p-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Network Visualization Unavailable</h3>
              <p className="text-red-600">The pathogen network visualization encountered an error and has been safely disabled.</p>
            </div>
          </div>
          
          <div className="bg-white rounded border-l-4 border-red-400 p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Medical Safety Note:</strong> This error does not affect core antibiotic learning functionality. 
              All educational learning data remains available through other app sections.
            </p>
            <p className="text-sm text-gray-600">
              Error occurred at: {new Date().toLocaleString()}
            </p>
          </div>
          
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Performance monitoring hook
 */
const usePerformanceMonitoring = (componentName) => {
  const [metrics, setMetrics] = useState({});
  const performanceEnabled = performanceMonitoringEnabled();
  
  const startTiming = useCallback((operation) => {
    if (!performanceEnabled) return;
    
    const startTime = performance.now();
    performance.mark(`${componentName}-${operation}-start`);
    
    return () => {
      const endTime = performance.now();
      performance.mark(`${componentName}-${operation}-end`);
      performance.measure(
        `${componentName}-${operation}`,
        `${componentName}-${operation}-start`,
        `${componentName}-${operation}-end`
      );
      
      const duration = endTime - startTime;
      setMetrics(prev => ({
        ...prev,
        [operation]: duration
      }));
      
      // Clinical performance warning
      if (duration > 2000) {
        console.warn(`Clinical Performance Warning: ${operation} took ${duration.toFixed(2)}ms (target: <2000ms)`);
      }
      
      if (debugLoggingEnabled()) {
        console.log(`Performance: ${componentName} ${operation} completed in ${duration.toFixed(2)}ms`);
      }
    };
  }, [componentName, performanceEnabled]);
  
  return { startTiming, metrics };
};

/**
 * Main PathogenNetworkVisualization Component
 */
const PathogenNetworkVisualization = ({
  pathogenData = SimplePathogenData,
  antibioticMap = pathogenAntibioticMap,
  layout = 'fcose',
  onNodeSelect,
  onEdgeSelect,
  filterPathogens = null,
  showAntibiotics = true,
  className = '',
  style = {},
  ...props
}) => {
  // Feature flag checks
  const networkEnabled = useFeatureFlag('ENABLE_CYTOSCAPE_NETWORK', false);
  const clusteringEnabled = useFeatureFlag('ENABLE_NETWORK_CLUSTERING', false);
  const advancedLayoutsEnabled = useFeatureFlag('ENABLE_ADVANCED_LAYOUTS', false);
  const medicalValidation = useMedicalValidation();
  
  // State management
  const [networkData, setNetworkData] = useState(null);
  const [networkStats, setNetworkStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Performance monitoring
  const { startTiming, metrics } = usePerformanceMonitoring('PathogenNetworkVisualization');
  
  // Medical validation warnings
  useEffect(() => {
    if (!medicalValidation.isValid) {
      console.warn('Medical Validation Warnings:', medicalValidation.warnings);
    }
  }, [medicalValidation]);
  
  // Transform data when props change
  const transformedData = useMemo(() => {
    if (!pathogenData || !networkEnabled) return null;
    
    const endTiming = startTiming('data-transformation');
    
    try {
      const result = transformMedicalDataToCytoscape({
        pathogenData,
        antibioticMap,
        includeAntibiotics: showAntibiotics,
        filterPathogens,
        validateData: medicalValidation.flags.medicalValidation
      });
      
      if (endTiming) endTiming();
      
      return result;
    } catch (error) {
      if (endTiming) endTiming();
      console.error('Medical data transformation error:', error);
      setError(error.message);
      return null;
    }
  }, [pathogenData, antibioticMap, showAntibiotics, filterPathogens, networkEnabled, medicalValidation.flags.medicalValidation, startTiming]);
  
  // Update network data and statistics
  useEffect(() => {
    if (transformedData) {
      setNetworkData(transformedData.elements);
      setNetworkStats(getNetworkStatistics(transformedData.elements));
      setLoading(false);
      setError(null);
    } else if (networkEnabled) {
      setLoading(false);
      setError('Unable to transform medical data for network visualization');
    }
  }, [transformedData, networkEnabled]);
  
  // Layout selection with feature flag restrictions
  const getEffectiveLayout = useCallback(() => {
    if (!advancedLayoutsEnabled && layout !== 'fcose') {
      if (debugLoggingEnabled()) {
        console.log('Advanced layouts disabled, falling back to fcose');
      }
      return 'fcose';
    }
    return layout;
  }, [layout, advancedLayoutsEnabled]);
  
  // Event handlers with performance monitoring
  const handleNodeSelect = useCallback((node) => {
    const endTiming = startTiming('node-interaction');
    
    if (onNodeSelect) {
      onNodeSelect(node);
    }
    
    if (debugLoggingEnabled()) {
      console.log('Node selected:', {
        id: node.data?.id,
        type: node.data?.type,
        label: node.data?.label
      });
    }
    
    if (endTiming) endTiming();
  }, [onNodeSelect, startTiming]);
  
  const handleEdgeSelect = useCallback((edge) => {
    const endTiming = startTiming('edge-interaction');
    
    if (onEdgeSelect) {
      onEdgeSelect(edge);
    }
    
    if (debugLoggingEnabled()) {
      console.log('Edge selected:', {
        id: edge.data?.id,
        effectiveness: edge.data?.effectiveness,
        evidenceLevel: edge.data?.evidenceLevel
      });
    }
    
    if (endTiming) endTiming();
  }, [onEdgeSelect, startTiming]);
  
  // Fallback component when network visualization is disabled
  const NetworkDisabledFallback = () => (
    <div className="network-disabled-fallback bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-blue-100 rounded-full p-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-800">Network Visualization Currently Disabled</h3>
          <p className="text-blue-600">The pathogen network visualization feature is currently disabled in this environment.</p>
        </div>
      </div>
      
      <div className="bg-white rounded border-l-4 border-blue-400 p-4">
        <p className="text-sm text-gray-700 mb-2">
          To enable network visualization, set the following environment variable:
        </p>
        <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">
          REACT_APP_ENABLE_CYTOSCAPE_NETWORK=true
        </code>
      </div>
    </div>
  );
  
  // Performance metrics display (development only)
  const PerformanceMetrics = () => {
    if (!performanceMonitoringEnabled() || Object.keys(metrics).length === 0) return null;
    
    return (
      <div className="performance-metrics bg-gray-100 p-3 rounded text-xs text-gray-600 mt-2">
        <strong>Performance Metrics:</strong>
        {Object.entries(metrics).map(([operation, duration]) => (
          <span key={operation} className={`ml-4 ${duration > 2000 ? 'text-red-600' : 'text-green-600'}`}>
            {operation}: {duration.toFixed(2)}ms
          </span>
        ))}
      </div>
    );
  };
  
  // Main render logic
  return (
    <FeatureFlag flagName="ENABLE_ERROR_BOUNDARIES" fallback={null}>
      <NetworkErrorBoundary>
        <FeatureFlag 
          flagName="ENABLE_CYTOSCAPE_NETWORK" 
          fallback={<NetworkDisabledFallback />}
        >
          <div className={`pathogen-network-visualization ${className}`} style={style} {...props}>
            {/* Medical validation warnings */}
            {!medicalValidation.isValid && (
              <div className="medical-warnings bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="text-yellow-800 font-semibold mb-2">Medical Validation Warnings:</h4>
                <ul className="text-yellow-700 text-sm list-disc list-inside">
                  {medicalValidation.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Loading state */}
            {loading && (
              <div className="network-loading flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading medical network data...</p>
                </div>
              </div>
            )}
            
            {/* Error state */}
            {error && (
              <div className="network-error bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold">Network Visualization Error:</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            {/* Network statistics */}
            {networkStats && debugLoggingEnabled() && (
              <div className="network-stats bg-gray-50 p-3 rounded mb-4 text-sm text-gray-700">
                <strong>Network Statistics:</strong>
                <span className="ml-4">Pathogens: {networkStats.pathogenCount}</span>
                <span className="ml-4">Antibiotics: {networkStats.antibioticCount}</span>
                <span className="ml-4">Relationships: {networkStats.effectiveConnections}</span>
                <span className="ml-4">Resistant: {networkStats.resistantConnections}</span>
              </div>
            )}
            
            {/* Main network visualization */}
            {networkData && !loading && !error && (
              <CytoscapeWrapper
                data={{ nodes: networkData.filter(el => !el.data.source), edges: networkData.filter(el => el.data.source) }}
                layout={getEffectiveLayout()}
                onNodeSelect={handleNodeSelect}
                onEdgeSelect={handleEdgeSelect}
                style={{ 
                  width: '100%', 
                  height: '600px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  ...style 
                }}
              />
            )}
            
            {/* Performance metrics (development only) */}
            <PerformanceMetrics />
          </div>
        </FeatureFlag>
      </NetworkErrorBoundary>
    </FeatureFlag>
  );
};

PathogenNetworkVisualization.displayName = 'PathogenNetworkVisualization';

export default PathogenNetworkVisualization;