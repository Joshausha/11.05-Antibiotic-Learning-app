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
  applySpatialGrouping,
  calculateGridCoordinates,
  calculateResponsiveLayout,
  getGroupBoundaries,
  performanceUtils,
  validationUtils
} from '../utils/northwesternSpatialAlgorithms.js';

/**
 * Northwestern Spatial Layout Component
 * Organizes antibiotics in clinically-relevant spatial groupings
 */
const NorthwesternSpatialLayout = ({
  antibiotics = [],
  viewMode = 'clustered',
  screenSize: propScreenSize,
  showConnections = false,
  highlightedClasses = [],
  onAntibioticSelect,
  onGroupSelect,
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

  // Core spatial layout calculation
  const spatialLayout = useMemo(() => {
    if (!antibiotics.length) {
      return { positioned: [], layout: null, groups: {}, validation: null };
    }

    const startTime = performance.now();

    // Step 1: Group antibiotics by drug class
    const grouped = groupByDrugClass(antibiotics);
    
    // Step 2: Apply Northwestern spatial grouping methodology  
    const spatialGroups = applySpatialGrouping(grouped);
    
    // Step 3: Calculate grid coordinates
    const positioned = calculateGridCoordinates(spatialGroups, gridConfig);
    
    // Step 4: Generate responsive layout properties
    const layout = calculateResponsiveLayout(
      containerDimensions.width, 
      containerDimensions.height,
      antibiotics.length
    );

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
        gridCells: gridConfig.columns * gridConfig.rows
      }
    };
  }, [antibiotics, screenSize, containerDimensions, gridConfig]);

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
    >
      {/* Group boundaries visual (Agent 3.2 integration point) */}
      {showConnections && (
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
                size={spatialLayout.layout.chartSize}
                interactive={!emergencyMode}
                clinicalContext={clinicalContext}
                emergencyMode={emergencyMode}
                showLabels={screenSize !== 'mobile'}
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
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      class: PropTypes.string.isRequired,
      northwesternSpectrum: PropTypes.object.isRequired,
      cellWallActive: PropTypes.bool,
      routeColor: PropTypes.oneOf(['red', 'blue', 'purple']),
      generation: PropTypes.string
    })
  ).isRequired,
  viewMode: PropTypes.oneOf(['grid', 'clustered', 'class']),
  screenSize: PropTypes.oneOf(['mobile', 'tablet', 'desktop']),
  showConnections: PropTypes.bool,
  highlightedClasses: PropTypes.arrayOf(PropTypes.string),
  onAntibioticSelect: PropTypes.func,
  onGroupSelect: PropTypes.func,
  className: PropTypes.string,
  enableVirtualization: PropTypes.bool,
  renderBufferSize: PropTypes.number,
  emergencyMode: PropTypes.bool,
  clinicalContext: PropTypes.oneOf(['education', 'clinical', 'emergency'])
};

export default NorthwesternSpatialLayout;