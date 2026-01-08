/**
 * Northwestern Filtering System Component (TypeScript)
 *
 * Primary interactive filtering interface for Northwestern 8-segment antibiotic
 * methodology with real-time visual feedback and clinical decision support.
 *
 * Performance Target: <100ms filter application, <50ms visual feedback
 *
 * Features:
 * - Real-time Northwestern category filtering with visual feedback
 * - Clinical scenario filtering for workflow optimization
 * - Integration with spatial layout for highlighting
 * - Multi-category combination filtering with logical operators
 * - Filter state persistence and clinical workflow memory
 * - Emergency mode optimization for <30 second clinical access
 * - Mobile-optimized touch controls for clinical tablets
 * - Accessibility compliance with keyboard navigation and screen readers
 */

import React, { useState, useEffect, useMemo, useCallback, useRef, FC, ReactNode } from 'react';
import FilterControlPanel from './FilterControlPanel';
import {
  FilterState,
  applyNorthwesternFilters,
  getFilterSuggestions,
  validateFilterConfiguration,
  exportFilterState,
  importFilterState,
  filterCache
} from '../utils/northwesternFilterLogic';
import {
  applyClinicalScenario,
  generateClinicalDecisionSupport,
  getRecommendedScenarios
} from '../utils/clinicalScenarioFilters';

/**
 * Type Definitions
 */

interface Antibiotic {
  id: string | number;
  name: string;
  class: string;
  northwesternSpectrum: Record<string, number>;
  cellWallActive?: boolean;
  routeColor?: 'red' | 'blue' | 'purple';
  generation?: string;
  [key: string]: any;
}

interface GridPosition {
  row: number;
  col: number;
  group?: string;
}

interface PositionedAntibiotic extends Antibiotic {
  gridPosition: GridPosition;
}

interface SpatialGroup {
  groupId: string;
  name: string;
  color?: string;
  description?: string;
  bounds?: {
    minRow: number;
    maxRow: number;
    minCol: number;
    maxCol: number;
  };
}

interface SpatialLayout {
  positioned: PositionedAntibiotic[];
  groups?: Record<string, SpatialGroup>;
  layout?: any;
}

interface FilteredResults {
  matchingAntibiotics: Antibiotic[];
  filteredCount: number;
  totalCount: number;
  error?: string;
  performance?: {
    calculationTime: number;
    cacheHit?: boolean;
  };
  clinicalScenario?: string;
  decisionSupport?: any;
  clinicalGuidance?: any;
}

interface VisualHighlight {
  antibioticId: string | number;
  gridPosition: GridPosition;
  highlightType: 'filter-match' | 'scenario-match' | 'emergency-priority';
  intensity: number;
  color: string;
}

interface PerformanceMetrics {
  filterTime?: number;
  totalTime?: number;
  resultCount?: number;
  cacheHit?: boolean;
  timestamp?: number;
}

interface ValidationResult {
  isValid: boolean;
  warnings?: string[];
  errors?: string[];
}

interface FilterSuggestion {
  type: 'scenario' | 'filter';
  priority: 'high' | 'medium' | 'low';
  reason: string;
  scenarioKey?: string;
  filterConfig?: any;
}

interface NorthwesternFilteringSystemProps {
  antibiotics?: Antibiotic[];
  spatialLayout?: SpatialLayout | null;
  onFilteredResults?: (results: FilteredResults) => void;
  onVisualFeedback?: (highlights: VisualHighlight[]) => void;
  onFilterStateChange?: (state: FilterState) => void;
  screenSize?: 'mobile' | 'tablet' | 'desktop';
  emergencyMode?: boolean;
  clinicalContext?: string;
  className?: string;
  enableRealTimeFiltering?: boolean;
  filterUpdateDebounce?: number;
  enableVisualFeedback?: boolean;
  visualFeedbackDebounce?: number;
  enableStatePersistence?: boolean;
  persistenceKey?: string;
  enableFilterSuggestions?: boolean;
  maxSuggestions?: number;
}

interface EmergencyOptimizations {
  disableAnimations?: boolean;
  hideAdvancedFeatures?: boolean;
  prioritizeSpeed?: boolean;
  simplifiedInterface?: boolean;
}

/**
 * Northwestern Filtering System Component
 * Comprehensive filtering interface with real-time feedback
 */
const NorthwesternFilteringSystem: FC<NorthwesternFilteringSystemProps> = ({
  antibiotics = [],
  spatialLayout = null,
  onFilteredResults,
  onVisualFeedback,
  onFilterStateChange,
  screenSize = 'desktop',
  emergencyMode = false,
  clinicalContext = '',
  className = '',
  enableRealTimeFiltering = true,
  filterUpdateDebounce = 100,
  enableVisualFeedback = true,
  visualFeedbackDebounce = 50,
  enableStatePersistence = true,
  persistenceKey = 'northwesternFilterState',
  enableFilterSuggestions = true,
  maxSuggestions = 5
}) => {
  // Component state
  const [filterState, setFilterState] = useState<FilterState>(new FilterState());
  const [filteredResults, setFilteredResults] = useState<FilteredResults | null>(null);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [filterSuggestions, setFilterSuggestions] = useState<FilterSuggestion[]>([]);
  const [visualHighlights, setVisualHighlights] = useState<VisualHighlight[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({});
  const [validationResults, setValidationResults] = useState<ValidationResult>({ isValid: true });

  // Refs for performance monitoring and debouncing
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const visualTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFilterTime = useRef<number>(Date.now());
  const componenMountTime = useRef<number>(Date.now());

  // Load persisted filter state on mount
  useEffect(() => {
    if (enableStatePersistence) {
      try {
        const persisted = localStorage.getItem(persistenceKey);
        if (persisted) {
          const importedState = importFilterState(JSON.parse(persisted));
          if (importedState && !importedState.isEmpty?.()) {
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
      const suggestions = getFilterSuggestions(antibiotics, clinicalContext) as FilterSuggestion[];
      setFilterSuggestions(suggestions.slice(0, maxSuggestions));
    }
  }, [antibiotics, clinicalContext, enableFilterSuggestions, maxSuggestions]);

  // Apply filters with debouncing for performance
  const applyFilters = useCallback(async (): Promise<void> => {
    if (!antibiotics.length || isFiltering) return;

    setIsFiltering(true);
    const startTime = performance.now();

    try {
      // Apply Northwestern filters
      const results = applyNorthwesternFilters(antibiotics, filterState) as unknown as FilteredResults;

      // Validate filter configuration
      const validation = validateFilterConfiguration(filterState) as unknown as ValidationResult;

      // Update state with results
      setFilteredResults(results);
      setValidationResults(validation);

      // Calculate performance metrics
      const totalTime = performance.now() - startTime;
      const metrics: PerformanceMetrics = {
        filterTime: results.performance?.calculationTime,
        totalTime,
        resultCount: results.filteredCount,
        cacheHit: results.performance?.cacheHit,
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Filter application error:', error);
      setFilteredResults({
        error: errorMessage,
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
  const generateVisualHighlights = useCallback((matchingAntibiotics: Antibiotic[], layout: SpatialLayout): VisualHighlight[] => {
    if (!layout.positioned) return [];

    const startTime = performance.now();

    const highlights: VisualHighlight[] = layout.positioned
      .filter(positioned =>
        matchingAntibiotics.some(match => match.id === positioned.id)
      )
      .map(positioned => ({
        antibioticId: positioned.id,
        gridPosition: positioned.gridPosition,
        highlightType: 'filter-match' as const,
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
  const calculateHighlightIntensity = useCallback((positioned: PositionedAntibiotic, state: FilterState): number => {
    const spectrum = positioned.northwesternSpectrum;
    const categories = state?.northwesternCategories;

    if (!spectrum || !categories) return 0.5;

    let matchScore = 0;
    let totalPossible = 0;

    Object.entries(categories).forEach(([category, criteria]: [string, any]) => {
      if (criteria?.enabled) {
        const coverage = spectrum[category] || 0;
        matchScore += coverage;
        totalPossible += 2; // Max coverage is 2
      }
    });

    return totalPossible > 0 ? Math.min(matchScore / totalPossible, 1) : 0.5;
  }, []);

  // Get highlight color based on filter type
  const getHighlightColor = useCallback((positioned: PositionedAntibiotic, state: FilterState): string => {
    // Emergency scenarios get red highlighting
    if (state?.emergencyMode) return '#f44336';

    // Clinical scenarios get scenario-specific colors
    if (state?.clinicalScenario) {
      const scenarioColors: Record<string, string> = {
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
  const handleFilterChange = useCallback((newState: FilterState): void => {
    setFilterState(newState);
  }, []);

  // Handle clinical scenario application
  const handleScenarioApply = useCallback((scenarioKey: string): void => {
    // Generate clinical decision support
    if (filteredResults?.matchingAntibiotics) {
      const scenarioResults = applyClinicalScenario(
        antibiotics as any,
        scenarioKey
      );

      if (scenarioResults?.matchingAntibiotics) {
        const decisionSupport = generateClinicalDecisionSupport(scenarioResults);

        // Update results with clinical context
        setFilteredResults(prevResults => prevResults ? {
          ...prevResults,
          clinicalScenario: scenarioKey,
          decisionSupport,
          clinicalGuidance: decisionSupport?.decisionSupport
        } : null);
      }
    }
  }, [antibiotics, filteredResults]);

  // Handle filter reset
  const handleFilterReset = useCallback((): void => {
    const newState = new FilterState();
    setFilterState(newState);
    setFilteredResults(null);
    setVisualHighlights([]);
    setValidationResults({ isValid: true });

    // Clear visual feedback
    onVisualFeedback?.([]);
  }, [onVisualFeedback]);

  // Handle filter suggestion application
  const handleSuggestionApply = useCallback((suggestion: FilterSuggestion): void => {
    const newState = new FilterState();

    if (suggestion.type === 'scenario' && suggestion.scenarioKey) {
      newState.applyScenario?.(suggestion.scenarioKey);
    } else if (suggestion.filterConfig) {
      newState.updateFilter?.(suggestion.filterConfig);
    }

    setFilterState(newState);
  }, []);

  // Emergency mode optimizations
  const emergencyOptimizations = useMemo((): EmergencyOptimizations => {
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
  const screenReaderAnnouncement = useMemo((): string => {
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
      style={emergencyOptimizations as React.CSSProperties}
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
              <span>Total: {performanceMetrics.totalTime?.toFixed(2)}ms</span>
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
      {enableFilterSuggestions && filterSuggestions.length > 0 && filterState.isEmpty?.() && (
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
          {filteredResults.decisionSupport.recommendations?.firstLine?.length > 0 && (
            <div className="recommendation-section">
              <h4>First-line Options</h4>
              <div className="antibiotic-recommendations">
                {filteredResults.decisionSupport.recommendations.firstLine.slice(0, 5).map((antibiotic: Antibiotic) => (
                  <div key={antibiotic.id} className="antibiotic-recommendation">
                    <span className="antibiotic-name">{antibiotic.name}</span>
                    <span className="antibiotic-class">{antibiotic.class}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Considerations */}
          {filteredResults.decisionSupport.recommendations?.considerations?.length > 0 && (
            <div className="clinical-considerations">
              <h4>Clinical Considerations</h4>
              <ul>
                {filteredResults.decisionSupport.recommendations.considerations.map((consideration: string, index: number) => (
                  <li key={index}>{consideration}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence Basis */}
          {filteredResults.decisionSupport.decisionSupport?.evidence && (
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
          🚨 Emergency Mode Active - Streamlined interface for urgent clinical decisions
        </div>
      )}
    </div>
  );
};

export default NorthwesternFilteringSystem;
