/**
 * Northwestern Filtering System Component
 * 
 * Primary interactive filtering interface for Northwestern 8-segment antibiotic 
 * methodology with real-time visual feedback and educational learning support.
 * 
 * Created by: Agent 3.3 - Interactive Filtering Specialist
 * Phase: 3 - Spatial Organization System
 * Performance Target: <100ms filter application, <50ms visual feedback
 * 
 * Features:
 * - Real-time Northwestern category filtering with visual feedback
 * - Educational scenario exploration for learning optimization
 * - Integration with Agent 3.1's spatial layout for highlighting
 * - Integration with Agent 3.2's group organization for contextual filtering
 * - Multi-category combination filtering with logical operators
 * - Filter state persistence and educational workflow memory
 * - Focus mode optimization for rapid educational access
 * - Mobile-optimized touch controls for educational devices
 * - Accessibility compliance with keyboard navigation and screen readers
 * 
 * @component
 * @example
 * <NorthwesternFilteringSystem
 *   antibiotics={enhancedAntibioticData}
 *   spatialLayout={spatialLayoutResults}
 *   onFilteredResults={(results) => updateDisplay(results)}
 *   onVisualFeedback={(highlights) => updateSpatialHighlights(highlights)}
 *   screenSize="tablet"
 *   emergencyMode={false}
 * />
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import FilterControlPanel from './FilterControlPanel.js';
import { 
  FilterState,
  applyNorthwesternFilters,
  getFilterSuggestions,
  validateFilterConfiguration,
  exportFilterState,
  importFilterState,
  filterCache
} from '../utils/northwesternFilterLogic.js';
import { 
  applyClinicalScenario,
  generateClinicalDecisionSupport,
  getRecommendedScenarios
} from '../utils/clinicalScenarioFilters.js';

/**
 * Northwestern Filtering System Component
 * Comprehensive filtering interface with real-time feedback
 */
const NorthwesternFilteringSystem = ({
  antibiotics = [],
  spatialLayout = null,
  onFilteredResults,
  onVisualFeedback,
  onFilterStateChange,
  screenSize = 'desktop',
  emergencyMode = false,
  clinicalContext = '',
  className = '',
  // Performance and optimization props
  enableRealTimeFiltering = true,
  filterUpdateDebounce = 100,
  enableVisualFeedback = true,
  visualFeedbackDebounce = 50,
  // Persistence and workflow props
  enableStatePersistence = true,
  persistenceKey = 'northwesternFilterState',
  enableFilterSuggestions = true,
  maxSuggestions = 5
}) => {
  // Component state
  const [filterState, setFilterState] = useState(new FilterState());
  const [filteredResults, setFilteredResults] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterSuggestions, setFilterSuggestions] = useState([]);
  const [visualHighlights, setVisualHighlights] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  const [validationResults, setValidationResults] = useState({ isValid: true });

  // Refs for performance monitoring and debouncing
  const filterTimeoutRef = useRef(null);
  const visualTimeoutRef = useRef(null);
  const lastFilterTime = useRef(Date.now());
  const componenMountTime = useRef(Date.now());

  // Load persisted filter state on mount
  useEffect(() => {
    if (enableStatePersistence) {
      try {
        const persisted = localStorage.getItem(persistenceKey);
        if (persisted) {
          const importedState = importFilterState(JSON.parse(persisted));
          if (importedState && !importedState.isEmpty()) {
            setFilterState(importedState);
          }
        }
      } catch (error) {
        console.warn('Failed to load persisted filter state:', error);
      }
    }
  }, [enableStatePersistence, persistenceKey]);

  // Persist filter state changes
  useEffect(() => {
    if (enableStatePersistence && filterState) {
      try {
        const exportedState = exportFilterState(filterState);
        localStorage.setItem(persistenceKey, JSON.stringify(exportedState));
      } catch (error) {
        console.warn('Failed to persist filter state:', error);
      }
    }
  }, [filterState, enableStatePersistence, persistenceKey]);

  // Generate filter suggestions
  useEffect(() => {
    if (enableFilterSuggestions && antibiotics.length > 0) {
      const suggestions = getFilterSuggestions(antibiotics, clinicalContext);
      setFilterSuggestions(suggestions.slice(0, maxSuggestions));
    }
  }, [antibiotics, clinicalContext, enableFilterSuggestions, maxSuggestions]);

  // Apply filters with debouncing for performance
  const applyFilters = useCallback(async () => {
    if (!antibiotics.length || isFiltering) return;

    setIsFiltering(true);
    const startTime = performance.now();

    try {
      // Apply Northwestern filters
      const results = applyNorthwesternFilters(antibiotics, filterState);
      
      // Validate filter configuration
      const validation = validateFilterConfiguration(filterState);
      
      // Update state with results
      setFilteredResults(results);
      setValidationResults(validation);
      
      // Calculate performance metrics
      const totalTime = performance.now() - startTime;
      const metrics = {
        filterTime: results.performance.calculationTime,
        totalTime,
        resultCount: results.filteredCount,
        cacheHit: results.performance.cacheHit,
        timestamp: Date.now()
      };
      setPerformanceMetrics(metrics);

      // Performance warning for clinical workflow
      if (totalTime > 100) {
        console.warn(`Filter application took ${totalTime.toFixed(2)}ms (target: <100ms)`);
      }

      // Notify parent components
      onFilteredResults?.(results);
      onFilterStateChange?.(filterState);

      // Generate visual highlights for spatial layout
      if (enableVisualFeedback && spatialLayout && results.matchingAntibiotics.length > 0) {
        const highlights = generateVisualHighlights(results.matchingAntibiotics, spatialLayout);
        setVisualHighlights(highlights);
        onVisualFeedback?.(highlights);
      }

    } catch (error) {
      console.error('Filter application error:', error);
      setFilteredResults({
        error: error.message,
        matchingAntibiotics: [],
        filteredCount: 0,
        totalCount: antibiotics.length
      });
    } finally {
      setIsFiltering(false);
      lastFilterTime.current = Date.now();
    }
  }, [
    antibiotics, 
    filterState, 
    spatialLayout, 
    isFiltering,
    onFilteredResults,
    onFilterStateChange,
    onVisualFeedback,
    enableVisualFeedback
  ]);

  // Debounced filter application
  useEffect(() => {
    if (!enableRealTimeFiltering) return;

    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    filterTimeoutRef.current = setTimeout(() => {
      applyFilters();
    }, emergencyMode ? 0 : filterUpdateDebounce);

    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [filterState, applyFilters, enableRealTimeFiltering, filterUpdateDebounce, emergencyMode]);

  // Generate visual highlights for spatial layout integration
  const generateVisualHighlights = useCallback((matchingAntibiotics, layout) => {
    if (!layout.positioned) return [];

    const startTime = performance.now();
    
    const highlights = layout.positioned
      .filter(positioned => 
        matchingAntibiotics.some(match => match.id === positioned.id)
      )
      .map(positioned => ({
        antibioticId: positioned.id,
        gridPosition: positioned.gridPosition,
        highlightType: 'filter-match',
        intensity: calculateHighlightIntensity(positioned, filterState),
        color: getHighlightColor(positioned, filterState)
      }));

    const calculationTime = performance.now() - startTime;
    
    // Performance warning for visual feedback
    if (calculationTime > 50) {
      console.warn(`Visual highlight calculation took ${calculationTime.toFixed(2)}ms (target: <50ms)`);
    }

    return highlights;
  }, [filterState]);

  // Calculate highlight intensity based on filter match quality
  const calculateHighlightIntensity = useCallback((positioned, state) => {
    if (!positioned.northwesternSpectrum || !state.northwesternCategories) return 0.5;

    let matchScore = 0;
    let totalPossible = 0;

    Object.entries(state.northwesternCategories).forEach(([category, criteria]) => {
      if (criteria.enabled) {
        const coverage = positioned.northwesternSpectrum[category] || 0;
        matchScore += coverage;
        totalPossible += 2; // Max coverage is 2
      }
    });

    return totalPossible > 0 ? Math.min(matchScore / totalPossible, 1) : 0.5;
  }, []);

  // Get highlight color based on filter type
  const getHighlightColor = useCallback((positioned, state) => {
    // Emergency scenarios get red highlighting
    if (state.emergencyMode) return '#f44336';
    
    // Clinical scenarios get scenario-specific colors
    if (state.clinicalScenario) {
      const scenarioColors = {
        icuSepsis: '#ff5722',
        mrsaCoverage: '#e91e63',
        outpatientUTI: '#2196f3',
        postSurgical: '#4caf50'
      };
      return scenarioColors[state.clinicalScenario] || '#ff9800';
    }

    // Default to primary blue
    return '#2196f3';
  }, []);

  // Handle filter state changes from control panel
  const handleFilterChange = useCallback((newState) => {
    setFilterState(newState);
  }, []);

  // Handle clinical scenario application
  const handleScenarioApply = useCallback((scenarioKey) => {
    // Generate educational learning support
    if (filteredResults?.matchingAntibiotics) {
      const scenarioResults = applyClinicalScenario(
        antibiotics, 
        scenarioKey
      );
      
      if (scenarioResults.matchingAntibiotics) {
        const decisionSupport = generateClinicalDecisionSupport(scenarioResults);
        
        // Update results with clinical context
        setFilteredResults(prevResults => ({
          ...prevResults,
          clinicalScenario: scenarioKey,
          decisionSupport,
          clinicalGuidance: decisionSupport.decisionSupport
        }));
      }
    }
  }, [antibiotics, filteredResults]);

  // Handle filter reset
  const handleFilterReset = useCallback(() => {
    const newState = new FilterState();
    setFilterState(newState);
    setFilteredResults(null);
    setVisualHighlights([]);
    setValidationResults({ isValid: true });
    
    // Clear visual feedback
    onVisualFeedback?.([]);
  }, [onVisualFeedback]);

  // Handle filter suggestion application
  const handleSuggestionApply = useCallback((suggestion) => {
    const newState = new FilterState();
    
    if (suggestion.type === 'scenario') {
      newState.applyScenario(suggestion.scenarioKey);
    } else if (suggestion.filterConfig) {
      newState.updateFilter(suggestion.filterConfig);
    }
    
    setFilterState(newState);
  }, []);

  // Emergency mode optimizations
  const emergencyOptimizations = useMemo(() => {
    if (!emergencyMode) return {};

    return {
      disableAnimations: true,
      hideAdvancedFeatures: true,
      prioritizeSpeed: true,
      simplifiedInterface: true
    };
  }, [emergencyMode]);

  // Component performance monitoring
  useEffect(() => {
    const componentLoadTime = Date.now() - componenMountTime.current;
    
    if (componentLoadTime > 1000) {
      console.warn(`Northwestern Filtering System load time: ${componentLoadTime}ms (target: <1000ms)`);
    }
  }, []);

  // Accessibility announcements for screen readers
  const screenReaderAnnouncement = useMemo(() => {
    if (!filteredResults) return '';
    
    const { filteredCount, totalCount } = filteredResults;
    
    if (filteredCount === 0) {
      return 'No antibiotics match the current filter criteria';
    } else if (filteredCount === totalCount) {
      return `All ${totalCount} antibiotics are shown`;
    } else {
      return `${filteredCount} of ${totalCount} antibiotics match the current filters`;
    }
  }, [filteredResults]);

  return (
    <div 
      className={`northwestern-filtering-system northwestern-filtering-system--${screenSize} ${emergencyMode ? 'northwestern-filtering-system--emergency' : ''} ${className}`}
      data-emergency-mode={emergencyMode}
      data-screen-size={screenSize}
      style={emergencyOptimizations}
    >
      {/* Screen Reader Announcements */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite"
        aria-atomic="true"
      >
        {screenReaderAnnouncement}
      </div>

      {/* Filter Control Panel */}
      <FilterControlPanel
        filterState={filterState}
        onFilterChange={handleFilterChange}
        onScenarioApply={handleScenarioApply}
        onFilterReset={handleFilterReset}
        screenSize={screenSize}
        emergencyMode={emergencyMode}
        showAdvancedControls={!emergencyMode}
        clinicalContext={clinicalContext}
        enableFilterHistory={!emergencyMode}
        enableQuickFilters={true}
      />

      {/* Filter Results Summary */}
      {filteredResults && (
        <div className="filter-results-summary">
          <div className="results-count">
            <span className="results-numbers">
              {filteredResults.filteredCount} of {filteredResults.totalCount}
            </span>
            <span className="results-label">antibiotics match</span>
          </div>

          {/* Performance Metrics (Development Mode) */}
          {process.env.NODE_ENV === 'development' && performanceMetrics.filterTime && (
            <div className="performance-metrics">
              <span>Filter: {performanceMetrics.filterTime.toFixed(2)}ms</span>
              <span>Total: {performanceMetrics.totalTime.toFixed(2)}ms</span>
              {performanceMetrics.cacheHit && <span>Cached ✓</span>}
            </div>
          )}

          {/* Validation Warnings */}
          {validationResults.warnings && validationResults.warnings.length > 0 && (
            <div className="filter-warnings">
              {validationResults.warnings.map((warning, index) => (
                <div key={index} className="filter-warning">
                  ⚠️ {warning}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filter Suggestions */}
      {enableFilterSuggestions && filterSuggestions.length > 0 && filterState.isEmpty() && (
        <div className="filter-suggestions">
          <h3 className="suggestions-title">Suggested Filters</h3>
          <div className="suggestions-list">
            {filterSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className={`suggestion-button suggestion-button--${suggestion.priority}`}
                onClick={() => handleSuggestionApply(suggestion)}
              >
                <div className="suggestion-content">
                  <span className="suggestion-text">{suggestion.reason}</span>
                  {suggestion.type === 'scenario' && (
                    <span className="suggestion-type">Scenario</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clinical Decision Support */}
      {filteredResults?.decisionSupport && (
        <div className="clinical-decision-support">
          <h3 className="decision-support-title">Clinical Guidance</h3>
          
          {/* First-line Recommendations */}
          {filteredResults.decisionSupport.recommendations.firstLine.length > 0 && (
            <div className="recommendation-section">
              <h4>First-line Options</h4>
              <div className="antibiotic-recommendations">
                {filteredResults.decisionSupport.recommendations.firstLine.slice(0, 5).map(antibiotic => (
                  <div key={antibiotic.id} className="antibiotic-recommendation">
                    <span className="antibiotic-name">{antibiotic.name}</span>
                    <span className="antibiotic-class">{antibiotic.class}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Considerations */}
          {filteredResults.decisionSupport.recommendations.considerations.length > 0 && (
            <div className="clinical-considerations">
              <h4>Clinical Considerations</h4>
              <ul>
                {filteredResults.decisionSupport.recommendations.considerations.map((consideration, index) => (
                  <li key={index}>{consideration}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence Basis */}
          {filteredResults.decisionSupport.decisionSupport.evidence && (
            <div className="evidence-basis">
              <strong>Evidence:</strong> {filteredResults.decisionSupport.decisionSupport.evidence}
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {filteredResults?.error && (
        <div className="filter-error">
          <h3>Filter Error</h3>
          <p>{filteredResults.error}</p>
          <button onClick={handleFilterReset}>Reset Filters</button>
        </div>
      )}

      {/* Loading State */}
      {isFiltering && (
        <div className="filtering-overlay" aria-hidden={!isFiltering}>
          <div className="filtering-spinner">
            <div className="spinner"></div>
            <span>Applying filters...</span>
          </div>
        </div>
      )}

      {/* Emergency Mode Indicator */}
      {emergencyMode && (
        <div className="emergency-mode-banner" role="alert">
          🎓 Focus Mode Active - Streamlined interface for concentrated learning
        </div>
      )}
    </div>
  );
};

// PropTypes for type safety
NorthwesternFilteringSystem.propTypes = {
  antibiotics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      class: PropTypes.string.isRequired,
      northwesternSpectrum: PropTypes.object.isRequired,
      cellWallActive: PropTypes.bool,
      routeColor: PropTypes.oneOf(['red', 'blue', 'purple']),
      generation: PropTypes.string
    })
  ).isRequired,
  spatialLayout: PropTypes.shape({
    positioned: PropTypes.arrayOf(PropTypes.object),
    groups: PropTypes.object,
    layout: PropTypes.object
  }),
  onFilteredResults: PropTypes.func,
  onVisualFeedback: PropTypes.func,
  onFilterStateChange: PropTypes.func,
  screenSize: PropTypes.oneOf(['mobile', 'tablet', 'desktop']),
  emergencyMode: PropTypes.bool,
  clinicalContext: PropTypes.string,
  className: PropTypes.string,
  enableRealTimeFiltering: PropTypes.bool,
  filterUpdateDebounce: PropTypes.number,
  enableVisualFeedback: PropTypes.bool,
  visualFeedbackDebounce: PropTypes.number,
  enableStatePersistence: PropTypes.bool,
  persistenceKey: PropTypes.string,
  enableFilterSuggestions: PropTypes.bool,
  maxSuggestions: PropTypes.number
};

export default NorthwesternFilteringSystem;