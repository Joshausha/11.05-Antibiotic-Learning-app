/**
 * Northwestern Spatial Layout Component
 * 
 * Core spatial organization system for 30 antibiotics based on Northwestern 
 * methodology with drug class groupings and responsive grid positioning.
 * 
 * Created by: Agent 3.1 - Spatial Layout Architect  
 * Phase: 3 - Spatial Organization System
 * Integration: Builds on Phase 2 EnhancedNorthwesternPieChart components
 * 
 * Features:
 * - Grid-based positioning system (3x10 mobile, 5x6 tablet, 6x5 desktop)
 * - Northwestern spatial grouping by drug class and mechanism
 * - Responsive layout with clinical device optimization
 * - Integration with Phase 2 pie chart components
 * - <1000ms rendering performance for 30 antibiotics
 * - Medical emergency <30 second access compliance
 * 
 * @component
 * @example
 * <NorthwesternSpatialLayout
 *   antibiotics={enhancedAntibioticData}
 *   viewMode="clustered"
 *   screenSize="tablet" 
 *   showConnections={true}
 *   onAntibioticSelect={(antibiotic) => console.log(antibiotic)}
 * />
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import EnhancedNorthwesternPieChart from './EnhancedNorthwesternPieChart.js';
import '../styles/NorthwesternSpatialLayout.css';
import {
  GRID_CONFIGURATIONS,
  SPATIAL_GROUPS,
  determineBreakpoint,
  groupByDrugClass,
  groupByRoute,
  groupByAlphabetical,
  groupByCoverageBreadth,
  applySpatialGrouping,
  calculateGridCoordinates,
  calculateResponsiveLayout,
  getGroupBoundaries,
  performanceUtils,
  validationUtils
} from '../utils/northwesternSpatialAlgorithms';

/**
 * View mode configuration for comparison vs exploration views
 */
const VIEW_MODE_CONFIG = {
  comparison: {
    chartSize: 'small',
    showLabels: false,
    cardPadding: '8px',
    minCardHeight: '140px',
    maxColumns: { mobile: 3, tablet: 5, desktop: 6 }
  },
  exploration: {
    chartSize: 'large',
    showLabels: true,
    cardPadding: '16px',
    minCardHeight: '320px',
    maxColumns: { mobile: 1, tablet: 2, desktop: 3 }
  }
};

/**
 * Northwestern Spatial Layout Component
 * Organizes antibiotics in clinically-relevant spatial groupings
 */
const NorthwesternSpatialLayout = ({
  antibiotics = [],
  viewMode = 'comparison',           // 'comparison' | 'exploration'
  groupingMode = 'drugClass',        // 'drugClass' | 'route' | 'alphabetical' | 'coverage'
  screenSize: propScreenSize,
  showConnections = false,
  highlightedClasses = [],
  onAntibioticSelect,
  onGroupSelect,
  onViewModeChange,                  // Callback when view mode changes
  onGroupingModeChange,              // Callback when grouping mode changes
  className = '',
  // Performance and optimization props
  enableVirtualization = false,
  renderBufferSize = 5,
  // Clinical workflow props
  emergencyMode = false,
  clinicalContext = 'education'
}) => {
  // Refs for performance monitoring and responsive behavior
  const containerRef = useRef(null);
  const renderStartTime = useRef(Date.now());
  const [isRendering, setIsRendering] = useState(true);
  
  // State management
  const [containerDimensions, setContainerDimensions] = useState({ width: 1024, height: 600 });
  const [hoveredAntibiotic, setHoveredAntibiotic] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [viewportInfo, setViewportInfo] = useState({ scrollY: 0, height: 600 });

  // Determine screen size breakpoint
  const screenSize = propScreenSize || determineBreakpoint(containerDimensions.width);
  const gridConfig = GRID_CONFIGURATIONS[screenSize];

  // Responsive dimensions observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerDimensions({ width, height });
      }
    });

    resizeObserver.observe(container);
    
    // Initial measurement
    const { width, height } = container.getBoundingClientRect();
    setContainerDimensions({ width, height });

    return () => resizeObserver.disconnect();
  }, []);

  // Viewport tracking for virtualization
  useEffect(() => {
    if (!enableVirtualization) return;

    const handleScroll = () => {
      setViewportInfo({
        scrollY: window.scrollY,
        height: window.innerHeight
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableVirtualization]);

  // Get view mode configuration
  const viewConfig = VIEW_MODE_CONFIG[viewMode] || VIEW_MODE_CONFIG.comparison;

  // Core spatial layout calculation
  const spatialLayout = useMemo(() => {
    if (!antibiotics.length) {
      return { positioned: [], layout: null, groups: {}, validation: null };
    }

    const startTime = performance.now();

    // Step 1: Group antibiotics based on selected grouping mode
    let grouped;
    switch (groupingMode) {
      case 'route':
        grouped = groupByRoute(antibiotics);
        break;
      case 'alphabetical':
        grouped = groupByAlphabetical(antibiotics);
        break;
      case 'coverage':
        grouped = groupByCoverageBreadth(antibiotics);
        break;
      case 'drugClass':
      default:
        grouped = groupByDrugClass(antibiotics);
        break;
    }

    // Step 2: Apply spatial grouping (for drug class mode) or flat positioning (for other modes)
    let spatialGroups;
    if (groupingMode === 'drugClass') {
      spatialGroups = applySpatialGrouping(grouped);
    } else {
      // For non-drugClass groupings, create simple spatial groups from the grouped data
      spatialGroups = {};
      Object.keys(grouped).forEach((groupKey, index) => {
        spatialGroups[groupKey] = {
          name: groupKey,
          antibiotics: grouped[groupKey],
          color: ['#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0'][index % 4],
          priority: index + 1
        };
      });
    }

    // Step 3: Calculate grid coordinates with view mode adjustments
    const effectiveGridConfig = {
      ...gridConfig,
      columns: viewConfig.maxColumns[screenSize] || gridConfig.columns
    };
    const positioned = calculateGridCoordinates(spatialGroups, effectiveGridConfig);

    // Step 4: Generate responsive layout properties
    const layout = calculateResponsiveLayout(
      containerDimensions.width,
      containerDimensions.height,
      antibiotics.length
    );

    // Override chart size based on view mode
    layout.chartSize = viewConfig.chartSize;

    // Step 5: Validate Northwestern compliance
    const validation = validationUtils.validateNorthwesternCompliance(positioned);

    const calculationTime = performance.now() - startTime;

    // Log performance metrics for monitoring
    if (calculationTime > 100) {
      console.warn(`Spatial layout calculation took ${calculationTime.toFixed(2)}ms (target: <100ms)`);
    }

    return {
      positioned,
      layout,
      groups: spatialGroups,
      validation,
      performance: {
        calculationTime,
        antibioticCount: antibiotics.length,
        gridCells: effectiveGridConfig.columns * gridConfig.rows
      }
    };
  }, [antibiotics, screenSize, containerDimensions, gridConfig, groupingMode, viewConfig]);

  // Performance optimization - visible positions for virtualization
  const visiblePositions = useMemo(() => {
    if (!enableVirtualization || !spatialLayout.positioned.length) {
      return spatialLayout.positioned;
    }

    return performanceUtils.getVisiblePositions(
      {
        ...viewportInfo,
        cellHeight: gridConfig.cellHeight
      },
      spatialLayout.positioned
    );
  }, [spatialLayout.positioned, viewportInfo, gridConfig, enableVirtualization]);

  // Render priority calculation for performance
  const prioritizedPositions = useMemo(() => {
    const userFocus = {
      activeGroup: selectedGroup,
      hoveredPosition: hoveredAntibiotic?.gridPosition
    };

    return performanceUtils.calculateRenderPriority(visiblePositions, userFocus);
  }, [visiblePositions, selectedGroup, hoveredAntibiotic]);

  // Event handlers
  const handleAntibioticHover = useCallback((antibiotic, isHovering) => {
    setHoveredAntibiotic(isHovering ? antibiotic : null);
  }, []);

  const handleAntibioticClick = useCallback((antibiotic) => {
    onAntibioticSelect?.(antibiotic);
  }, [onAntibioticSelect]);

  const handleGroupClick = useCallback((groupKey) => {
    const group = spatialLayout.groups[groupKey];
    if (group) {
      setSelectedGroup(selectedGroup === groupKey ? null : groupKey);
      onGroupSelect?.(groupKey, group.antibiotics);
    }
  }, [spatialLayout.groups, selectedGroup, onGroupSelect]);

  // Component mounting performance tracking
  useEffect(() => {
    const renderTime = Date.now() - renderStartTime.current;
    
    if (renderTime > 1000) {
      console.warn(`Northwestern Spatial Layout render took ${renderTime}ms (target: <1000ms)`);
    }
    
    setIsRendering(false);
  }, [spatialLayout]);

  // Emergency mode optimization - priority rendering
  const emergencyOptimizations = useMemo(() => {
    if (!emergencyMode) return {};

    return {
      animationDuration: 0, // Disable animations in emergency mode
      chartSize: 'small', // Use smaller charts for faster rendering
      maxConcurrentRenders: 10 // Limit concurrent renders
    };
  }, [emergencyMode]);

  // CSS Grid layout properties
  const gridStyles = useMemo(() => {
    if (!spatialLayout.layout) return {};

    return {
      display: 'grid',
      gridTemplate: spatialLayout.layout.gridTemplate,
      gap: spatialLayout.layout.gap,
      width: '100%',
      height: '100%',
      padding: '16px',
      position: 'relative',
      ...emergencyOptimizations
    };
  }, [spatialLayout.layout, emergencyOptimizations]);

  // Group boundaries for visual organization (Agent 3.2 integration point)
  const groupBoundaries = useMemo(() => {
    return Object.keys(SPATIAL_GROUPS).map(groupKey => {
      const boundary = getGroupBoundaries(groupKey, gridConfig);
      return boundary ? { ...boundary, key: groupKey } : null;
    }).filter(Boolean);
  }, [gridConfig]);

  // Loading state
  if (isRendering || !spatialLayout.positioned.length) {
    return (
      <div className={`northwestern-spatial-layout northwestern-spatial-layout--loading ${className}`}>
        <div className="spatial-loading">
          <div className="loading-skeleton">
            <div className="loading-grid">
              {Array.from({ length: gridConfig.columns * 3 }).map((_, index) => (
                <div key={index} className="loading-cell" />
              ))}
            </div>
          </div>
          <div className="loading-text">
            Organizing {antibiotics.length} antibiotics using Northwestern methodology...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (spatialLayout.validation && !spatialLayout.validation.isValid) {
    return (
      <div className={`northwestern-spatial-layout northwestern-spatial-layout--error ${className}`}>
        <div className="spatial-error">
          <h3>Northwestern Layout Validation Failed</h3>
          <ul>
            {spatialLayout.validation.errors.map((error, index) => (
              <li key={index} className="error-item">{error}</li>
            ))}
          </ul>
          <button onClick={() => window.location.reload()}>
            Retry Layout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`northwestern-spatial-layout northwestern-spatial-layout--${viewMode} northwestern-spatial-layout--${screenSize} ${className}`}
      data-antibiotic-count={antibiotics.length}
      data-screen-size={screenSize}
      data-emergency-mode={emergencyMode}
      data-grouping-mode={groupingMode}
    >
      {/* View Mode Controls and Grouping Selector */}
      <div className="spatial-layout-controls">
        {/* View Mode Toggle */}
        <div className="view-mode-toggle" role="tablist" aria-label="View mode">
          <button
            role="tab"
            aria-selected={viewMode === 'comparison'}
            className={`view-toggle-btn ${viewMode === 'comparison' ? 'active' : ''}`}
            onClick={() => onViewModeChange?.('comparison')}
          >
            <span className="icon">▦</span> Compare
          </button>
          <button
            role="tab"
            aria-selected={viewMode === 'exploration'}
            className={`view-toggle-btn ${viewMode === 'exploration' ? 'active' : ''}`}
            onClick={() => onViewModeChange?.('exploration')}
          >
            <span className="icon">◉</span> Explore
          </button>
        </div>

        {/* Grouping Selector */}
        <div className="grouping-selector">
          <label htmlFor="grouping-mode">Group by:</label>
          <select
            id="grouping-mode"
            value={groupingMode}
            onChange={(e) => onGroupingModeChange?.(e.target.value)}
            aria-label="Grouping mode"
          >
            <option value="drugClass">Drug Class</option>
            <option value="route">Route (Oral/IV)</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
            <option value="coverage">Coverage Breadth</option>
          </select>
        </div>
      </div>

      {/* Shared Coverage Legend */}
      <div className="shared-coverage-legend" aria-label="Coverage legend">
        <div className="legend-section">
          <span className="legend-title">Coverage:</span>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-dot legend-dot--none"></span>
              <span className="legend-label">None</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-dot--limited"></span>
              <span className="legend-label">Limited</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-dot--excellent"></span>
              <span className="legend-label">Excellent</span>
            </div>
          </div>
        </div>
        <div className="legend-section route-legend">
          <span className="legend-title">Route:</span>
          <div className="legend-items">
            <span className="route-indicator route-indicator--oral">Oral</span>
            <span className="route-indicator route-indicator--iv">IV</span>
            <span className="route-indicator route-indicator--both">Both</span>
          </div>
        </div>
      </div>

      {/* Group boundaries visual (Agent 3.2 integration point) */}
      {showConnections && groupingMode === 'drugClass' && (
        <div className="group-boundaries">
          {groupBoundaries.map(boundary => (
            <div
              key={boundary.key}
              className={`group-boundary group-boundary--${boundary.key} ${selectedGroup === boundary.key ? 'group-boundary--selected' : ''}`}
              style={{
                gridRowStart: boundary.startRow + 1,
                gridRowEnd: boundary.endRow + 1,
                gridColumnStart: boundary.startCol + 1,
                gridColumnEnd: boundary.endCol + 1,
                backgroundColor: boundary.color,
                border: selectedGroup === boundary.key ? '2px solid #1976d2' : '1px solid rgba(0,0,0,0.1)',
                borderRadius: '8px',
                padding: '4px',
                zIndex: 1
              }}
              onClick={() => handleGroupClick(boundary.key)}
            >
              <div className="group-label">
                {boundary.label}
                <span className="group-count">
                  ({spatialLayout.groups[boundary.key]?.antibiotics.length || 0})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main spatial grid */}
      <div className="spatial-grid" style={gridStyles}>
        {prioritizedPositions.map((positionedAntibiotic, index) => {
          const { gridPosition, ...antibiotic } = positionedAntibiotic;
          const isHighlighted = highlightedClasses.includes(antibiotic.class);
          const isHovered = hoveredAntibiotic?.id === antibiotic.id;
          const isGroupSelected = selectedGroup === gridPosition.group;

          return (
            <div
              key={antibiotic.id}
              className={`antibiotic-position antibiotic-position--${gridPosition.row}-${gridPosition.col} ${isHighlighted ? 'antibiotic-position--highlighted' : ''} ${isHovered ? 'antibiotic-position--hovered' : ''} ${isGroupSelected ? 'antibiotic-position--group-selected' : ''}`}
              style={{
                gridRow: gridPosition.row + 1,
                gridColumn: gridPosition.col + 1,
                zIndex: 10 + (isHovered ? 100 : 0),
                transition: emergencyMode ? 'none' : 'all 0.2s ease',
              }}
              data-antibiotic-id={antibiotic.id}
              data-drug-class={antibiotic.class}
              data-spatial-group={gridPosition.group}
              onMouseEnter={() => handleAntibioticHover(positionedAntibiotic, true)}
              onMouseLeave={() => handleAntibioticHover(positionedAntibiotic, false)}
              onClick={() => handleAntibioticClick(positionedAntibiotic)}
            >
              {/* Integrated Phase 2 Enhanced Northwestern Pie Chart */}
              <EnhancedNorthwesternPieChart
                antibiotic={antibiotic}
                size={viewConfig.chartSize}
                interactive={!emergencyMode}
                clinicalContext={clinicalContext}
                emergencyMode={emergencyMode}
                showLabels={viewConfig.showLabels && screenSize !== 'mobile'}
                showCoverageIndicators={false}
                showRouteIndicators={false}
                showDebugInfo={false}
                onSegmentHover={(segment, coverage) => {
                  // Forward to parent for detailed interactions (Agent 3.3 integration)
                }}
                onSegmentClick={(segment) => {
                  // Forward to parent for detailed interactions (Agent 3.3 integration)
                }}
              />
              
              {/* Position label */}
              <div className="position-label">
                <span className="antibiotic-name">{antibiotic.name}</span>
                {screenSize !== 'mobile' && (
                  <span className="drug-class">{antibiotic.class}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance and validation info (development mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="spatial-debug-info">
          <div className="performance-metrics">
            <span>Render: {spatialLayout.performance.calculationTime.toFixed(2)}ms</span>
            <span>Antibiotics: {spatialLayout.performance.antibioticCount}</span>
            <span>Grid: {gridConfig.columns}×{gridConfig.rows}</span>
            <span>Breakpoint: {screenSize}</span>
            {spatialLayout.validation.warnings.length > 0 && (
              <span className="validation-warnings">
                ⚠️ {spatialLayout.validation.warnings.length} warnings
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes for type safety
NorthwesternSpatialLayout.propTypes = {
  antibiotics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      class: PropTypes.string.isRequired,
      northwesternSpectrum: PropTypes.object.isRequired,
      cellWallActive: PropTypes.bool,
      routeColor: PropTypes.oneOf(['red', 'blue', 'purple']),
      generation: PropTypes.string
    })
  ).isRequired,
  viewMode: PropTypes.oneOf(['comparison', 'exploration']),
  groupingMode: PropTypes.oneOf(['drugClass', 'route', 'alphabetical', 'coverage']),
  screenSize: PropTypes.oneOf(['mobile', 'tablet', 'desktop']),
  showConnections: PropTypes.bool,
  highlightedClasses: PropTypes.arrayOf(PropTypes.string),
  onAntibioticSelect: PropTypes.func,
  onGroupSelect: PropTypes.func,
  onViewModeChange: PropTypes.func,
  onGroupingModeChange: PropTypes.func,
  className: PropTypes.string,
  enableVirtualization: PropTypes.bool,
  renderBufferSize: PropTypes.number,
  emergencyMode: PropTypes.bool,
  clinicalContext: PropTypes.oneOf(['education', 'clinical', 'emergency'])
};

export default NorthwesternSpatialLayout;