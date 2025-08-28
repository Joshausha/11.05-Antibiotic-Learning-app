/**
 * NetworkControls.js - Advanced Network Control Panel
 * 
 * Comprehensive control interface for medical network visualization including
 * layout switching, filtering, clustering, and performance optimization.
 * 
 * @module NetworkControls
 * @version 1.0.0
 * @created 2025-08-27
 * @medical-validation CRITICAL - All controls must maintain clinical accuracy
 * @accessibility WCAG 2.1 AA compliant with keyboard navigation
 * @performance Controls should not impact network rendering performance
 */

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  Settings, 
  Filter, 
  Layout, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download,
  Info,
  Eye,
  EyeOff,
  Sliders,
  Layers
} from 'lucide-react';

import { MEDICAL_LAYOUTS, getRecommendedLayout, PERFORMANCE_PROFILES } from './NetworkLayout';

/**
 * Layout options with medical descriptions
 */
const LAYOUT_OPTIONS = [
  {
    value: 'fcose',
    label: 'FCOSE (Recommended)',
    description: 'Force-directed layout optimized for pathogen clustering',
    bestFor: 'Medium networks with clear pathogen groupings'
  },
  {
    value: 'cola',
    label: 'Cola Constraints',
    description: 'Constraint-based layout for hierarchical relationships',
    bestFor: 'Educational content showing pathogen taxonomies'
  },
  {
    value: 'dagre',
    label: 'Dagre Hierarchical',
    description: 'Hierarchical layout for treatment pathways',
    bestFor: 'Antibiotic resistance progression or treatment flows'
  },
  {
    value: 'cose-bilkent',
    label: 'COSE-Bilkent',
    description: 'Multi-level layout for large networks',
    bestFor: 'Large datasets with 50+ pathogens'
  },
  {
    value: 'grid',
    label: 'Grid Organization',
    description: 'Systematic grid for pathogen comparison',
    bestFor: 'Educational overviews and classification'
  },
  {
    value: 'circle',
    label: 'Circular Arrangement',
    description: 'Circular layout for pathogen families',
    bestFor: 'Small focused groups and family relationships'
  }
];

/**
 * Filter categories for medical networks
 */
const FILTER_CATEGORIES = {
  gramStain: {
    label: 'Gram Stain',
    options: [
      { value: 'all', label: 'All Pathogens' },
      { value: 'positive', label: 'Gram-Positive' },
      { value: 'negative', label: 'Gram-Negative' },
      { value: 'variable', label: 'Variable Staining' }
    ]
  },
  severity: {
    label: 'Clinical Severity',
    options: [
      { value: 'all', label: 'All Severities' },
      { value: 'high', label: 'High Severity' },
      { value: 'medium', label: 'Medium Severity' },
      { value: 'low', label: 'Low Severity' }
    ]
  },
  resistance: {
    label: 'Resistance Patterns',
    options: [
      { value: 'all', label: 'All Relationships' },
      { value: 'show-resistant', label: 'Show Resistant Only' },
      { value: 'hide-resistant', label: 'Hide Resistant' },
      { value: 'effective-only', label: 'Effective Only' }
    ]
  },
  evidenceLevel: {
    label: 'Evidence Level',
    options: [
      { value: 'all', label: 'All Evidence Levels' },
      { value: 'A', label: 'Grade A - Strong Evidence (RCTs)' },
      { value: 'B', label: 'Grade B - Moderate Evidence' },
      { value: 'C', label: 'Grade C - Limited Evidence' },
      { value: 'D', label: 'Grade D - Expert Opinion' },
      { value: 'EXPERT', label: 'Expert Consensus' },
      { value: 'high-quality', label: 'High Quality Evidence (A+B)' },
      { value: 'low-quality', label: 'Low Quality Evidence (C+D)' }
    ]
  }
};

/**
 * Performance profile options
 */
const PERFORMANCE_OPTIONS = [
  { value: 'research', label: 'Research Quality', description: 'High quality, slower' },
  { value: 'clinical', label: 'Clinical Balanced', description: 'Balanced speed/quality' },
  { value: 'mobile', label: 'Mobile Fast', description: 'Fast, lower quality' }
];

/**
 * NetworkControls - Advanced control panel component
 */
const NetworkControls = ({
  // Layout controls
  currentLayout = 'fcose',
  onLayoutChange,
  networkStats = {},
  
  // Filter controls
  filters = {},
  onFilterChange,
  
  // View controls
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitView,
  
  // Export controls
  onExportPNG,
  onExportJPG,
  
  // Display options
  showControls = true,
  showFilters = true,
  showLayout = true,
  showPerformance = false,
  showExport = true,
  compact = false,
  
  // Clustering options
  enableClustering = true,
  clusterOptions = {},
  onClusterChange,
  
  // Performance
  performanceProfile = 'clinical',
  onPerformanceChange,
  
  // Visibility
  showAntibiotics = true,
  onToggleAntibiotics,
  showResistance = true,
  onToggleResistance,
  
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [activeTab, setActiveTab] = useState('layout');

  /**
   * Get recommended layout based on current network statistics
   */
  const recommendedLayout = getRecommendedLayout(networkStats);

  /**
   * Handle layout change with medical validation
   */
  const handleLayoutChange = useCallback((layoutName) => {
    if (onLayoutChange) {
      const layoutConfig = MEDICAL_LAYOUTS[layoutName];
      if (layoutConfig) {
        onLayoutChange(layoutName, layoutConfig);
      }
    }
  }, [onLayoutChange]);

  /**
   * Handle filter changes
   */
  const handleFilterChange = useCallback((category, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        [category]: value
      });
    }
  }, [filters, onFilterChange]);

  /**
   * Handle cluster option changes
   */
  const handleClusterChange = useCallback((option, value) => {
    if (onClusterChange) {
      onClusterChange({
        ...clusterOptions,
        [option]: value
      });
    }
  }, [clusterOptions, onClusterChange]);

  if (!showControls) return null;

  return (
    <div className={`network-controls bg-white shadow-lg rounded-lg border ${className}`}>
      {/* Control Panel Header */}
      <div className="p-3 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Network Controls
          </h4>
          {compact && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              aria-label={isExpanded ? 'Collapse controls' : 'Expand controls'}
            >
              {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        
        {/* Network Statistics Summary */}
        {networkStats && Object.keys(networkStats).length > 0 && (
          <div className="mt-2 text-xs text-gray-600 flex gap-4">
            <span>Pathogens: {networkStats.pathogenCount || 0}</span>
            <span>Antibiotics: {networkStats.antibioticCount || 0}</span>
            <span>Relationships: {networkStats.relationshipCount || 0}</span>
          </div>
        )}
      </div>

      {(isExpanded || !compact) && (
        <div className="p-3">
          {/* Tab Navigation */}
          <div className="flex mb-3 border-b">
            {showLayout && (
              <button
                onClick={() => setActiveTab('layout')}
                className={`px-3 py-1 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'layout' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Layout className="h-3 w-3 inline mr-1" />
                Layout
              </button>
            )}
            {showFilters && (
              <button
                onClick={() => setActiveTab('filters')}
                className={`px-3 py-1 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'filters' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Filter className="h-3 w-3 inline mr-1" />
                Filters
              </button>
            )}
            {enableClustering && (
              <button
                onClick={() => setActiveTab('clustering')}
                className={`px-3 py-1 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'clustering' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Layers className="h-3 w-3 inline mr-1" />
                Clustering
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="space-y-3">
            {/* Layout Tab */}
            {activeTab === 'layout' && showLayout && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="layout-select" className="block text-xs font-medium text-gray-700 mb-1">
                    Layout Algorithm
                  </label>
                  <select
                    id="layout-select"
                    value={currentLayout}
                    onChange={(e) => handleLayoutChange(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    {LAYOUT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                        {option.value === recommendedLayout ? ' (Recommended)' : ''}
                      </option>
                    ))}
                  </select>
                  {/* Layout Description */}
                  {LAYOUT_OPTIONS.find(opt => opt.value === currentLayout) && (
                    <div className="mt-1 text-xs text-gray-500">
                      <div>{LAYOUT_OPTIONS.find(opt => opt.value === currentLayout)?.description}</div>
                      <div className="font-medium">
                        Best for: {LAYOUT_OPTIONS.find(opt => opt.value === currentLayout)?.bestFor}
                      </div>
                    </div>
                  )}
                </div>

                {/* Performance Profile */}
                {showPerformance && (
                  <div>
                    <label htmlFor="performance-select" className="block text-xs font-medium text-gray-700 mb-1">
                      Performance Profile
                    </label>
                    <select
                      id="performance-select"
                      value={performanceProfile}
                      onChange={(e) => onPerformanceChange?.(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      {PERFORMANCE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label} - {option.description}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Filters Tab */}
            {activeTab === 'filters' && showFilters && (
              <div className="space-y-3">
                {Object.entries(FILTER_CATEGORIES).map(([category, config]) => (
                  <div key={category}>
                    <label htmlFor={`${category}-filter`} className="block text-xs font-medium text-gray-700 mb-1">
                      {config.label}
                    </label>
                    <select
                      id={`${category}-filter`}
                      value={filters[category] || 'all'}
                      onChange={(e) => handleFilterChange(category, e.target.value)}
                      className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      {config.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* Visibility Toggles */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showAntibiotics}
                      onChange={(e) => onToggleAntibiotics?.(e.target.checked)}
                      className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-700">Show Antibiotics</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showResistance}
                      onChange={(e) => onToggleResistance?.(e.target.checked)}
                      className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-700">Highlight Resistance</span>
                  </label>
                </div>
              </div>
            )}

            {/* Clustering Tab */}
            {activeTab === 'clustering' && enableClustering && (
              <div className="space-y-3">
                <div className="text-xs text-gray-600 mb-2">
                  Group pathogens by clinical characteristics
                </div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={clusterOptions.clusterByGramStain || false}
                      onChange={(e) => handleClusterChange('clusterByGramStain', e.target.checked)}
                      className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-700">Cluster by Gram Stain</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={clusterOptions.clusterBySeverity || false}
                      onChange={(e) => handleClusterChange('clusterBySeverity', e.target.checked)}
                      className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-700">Cluster by Clinical Severity</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={clusterOptions.clusterByResistance || false}
                      onChange={(e) => handleClusterChange('clusterByResistance', e.target.checked)}
                      className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-700">Cluster by Resistance Patterns</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t">
            {/* View Controls */}
            <div className="flex space-x-1">
              <button
                onClick={onResetView}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                title="Reset View"
                aria-label="Reset network view"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={onZoomIn}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                title="Zoom In"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={onZoomOut}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                title="Zoom Out"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
            </div>

            {/* Export Controls */}
            {showExport && (
              <div className="flex space-x-1">
                <button
                  onClick={onExportPNG}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  title="Export PNG"
                >
                  PNG
                </button>
                <button
                  onClick={onExportJPG}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  title="Export JPG"
                >
                  JPG
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

NetworkControls.displayName = 'NetworkControls';

NetworkControls.propTypes = {
  // Layout controls
  currentLayout: PropTypes.string,
  onLayoutChange: PropTypes.func,
  networkStats: PropTypes.object,
  
  // Filter controls
  filters: PropTypes.object,
  onFilterChange: PropTypes.func,
  
  // View controls
  onZoomIn: PropTypes.func,
  onZoomOut: PropTypes.func,
  onResetView: PropTypes.func,
  onFitView: PropTypes.func,
  
  // Export controls
  onExportPNG: PropTypes.func,
  onExportJPG: PropTypes.func,
  
  // Display options
  showControls: PropTypes.bool,
  showFilters: PropTypes.bool,
  showLayout: PropTypes.bool,
  showPerformance: PropTypes.bool,
  showExport: PropTypes.bool,
  compact: PropTypes.bool,
  
  // Clustering options
  enableClustering: PropTypes.bool,
  clusterOptions: PropTypes.object,
  onClusterChange: PropTypes.func,
  
  // Performance
  performanceProfile: PropTypes.string,
  onPerformanceChange: PropTypes.func,
  
  // Visibility
  showAntibiotics: PropTypes.bool,
  onToggleAntibiotics: PropTypes.func,
  showResistance: PropTypes.bool,
  onToggleResistance: PropTypes.func,
  
  className: PropTypes.string
};

export default NetworkControls;