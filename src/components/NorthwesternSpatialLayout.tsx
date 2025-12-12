/**
 * Northwestern Spatial Layout Component
 *
 * Core spatial organization system for 30 antibiotics based on Northwestern
 * methodology with drug class groupings and responsive grid positioning.
 * TypeScript Migration - Full type safety with medical domain validation
 */

import React, { useState, useEffect, useMemo, useCallback, useRef, FC } from 'react';
import EnhancedNorthwesternPieChart from './EnhancedNorthwesternPieChart';
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
  validationUtils,
} from '../utils/northwesternSpatialAlgorithms';

// Types
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
  group: string;
}

interface PositionedAntibiotic extends Antibiotic {
  gridPosition: GridPosition;
}

interface SpatialGroup {
  name: string;
  antibiotics: Antibiotic[];
  color: string;
  priority: number;
}

interface Layout {
  gridTemplate: string;
  gap: string;
  chartSize: 'small' | 'large';
  [key: string]: any;
}

interface SpatialLayoutResult {
  positioned: PositionedAntibiotic[];
  layout: Layout | null;
  groups: Record<string, SpatialGroup>;
  validation: any;
  performance: {
    calculationTime: number;
    antibioticCount: number;
    gridCells: number;
  };
}

interface ViewModeConfig {
  [key: string]: {
    chartSize: 'small' | 'large';
    showLabels: boolean;
    cardPadding: string;
    minCardHeight: string;
    maxColumns: Record<string, number>;
  };
}

interface NorthwesternSpatialLayoutProps {
  antibiotics?: Antibiotic[];
  viewMode?: 'comparison' | 'exploration';
  groupingMode?: 'drugClass' | 'route' | 'alphabetical' | 'coverage';
  screenSize?: 'mobile' | 'tablet' | 'desktop';
  showConnections?: boolean;
  highlightedClasses?: string[];
  onAntibioticSelect?: (antibiotic: Antibiotic) => void;
  onGroupSelect?: (groupKey: string, antibiotics: Antibiotic[]) => void;
  onViewModeChange?: (mode: 'comparison' | 'exploration') => void;
  onGroupingModeChange?: (mode: string) => void;
  className?: string;
  enableVirtualization?: boolean;
  renderBufferSize?: number;
  emergencyMode?: boolean;
  clinicalContext?: 'education' | 'clinical' | 'emergency';
}

const VIEW_MODE_CONFIG: ViewModeConfig = {
  comparison: {
    chartSize: 'small',
    showLabels: false,
    cardPadding: '8px',
    minCardHeight: '140px',
    maxColumns: { mobile: 3, tablet: 5, desktop: 6 },
  },
  exploration: {
    chartSize: 'large',
    showLabels: true,
    cardPadding: '16px',
    minCardHeight: '320px',
    maxColumns: { mobile: 1, tablet: 2, desktop: 3 },
  },
};

const NorthwesternSpatialLayout: FC<NorthwesternSpatialLayoutProps> = ({
  antibiotics = [],
  viewMode = 'comparison',
  groupingMode = 'drugClass',
  screenSize: propScreenSize,
  showConnections = false,
  highlightedClasses = [],
  onAntibioticSelect,
  onGroupSelect,
  onViewModeChange,
  onGroupingModeChange,
  className = '',
  enableVirtualization = false,
  renderBufferSize = 5,
  emergencyMode = false,
  clinicalContext = 'education',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderStartTime = useRef<number>(Date.now());
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 1024,
    height: 600,
  });
  const [hoveredAntibiotic, setHoveredAntibiotic] = useState<PositionedAntibiotic | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [viewportInfo, setViewportInfo] = useState<{ scrollY: number; height: number }>({
    scrollY: 0,
    height: 600,
  });

  const screenSize = (propScreenSize || determineBreakpoint(containerDimensions.width)) as
    | 'mobile'
    | 'tablet'
    | 'desktop';
  const gridConfig = GRID_CONFIGURATIONS[screenSize];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerDimensions({ width, height });
      }
    });

    resizeObserver.observe(container);
    const { width, height } = container.getBoundingClientRect();
    setContainerDimensions({ width, height });

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!enableVirtualization) return;

    const handleScroll = (): void => {
      setViewportInfo({
        scrollY: window.scrollY,
        height: window.innerHeight,
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableVirtualization]);

  const viewConfig = VIEW_MODE_CONFIG[viewMode] || VIEW_MODE_CONFIG.comparison;

  const spatialLayout = useMemo((): SpatialLayoutResult => {
    if (!antibiotics.length) {
      return {
        positioned: [],
        layout: null,
        groups: {},
        validation: null,
        performance: { calculationTime: 0, antibioticCount: 0, gridCells: 0 },
      };
    }

    const startTime = performance.now();

    let grouped: Record<string, Antibiotic[]>;
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

    let spatialGroups: Record<string, SpatialGroup>;
    if (groupingMode === 'drugClass') {
      spatialGroups = applySpatialGrouping(grouped);
    } else {
      spatialGroups = {};
      Object.keys(grouped).forEach((groupKey, index) => {
        spatialGroups[groupKey] = {
          name: groupKey,
          antibiotics: grouped[groupKey],
          color: ['#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0'][index % 4],
          priority: index + 1,
        };
      });
    }

    const effectiveGridConfig = {
      ...gridConfig,
      columns: viewConfig.maxColumns[screenSize] || gridConfig.columns,
    };
    const positioned = calculateGridCoordinates(spatialGroups, effectiveGridConfig);

    const layout = calculateResponsiveLayout(
      containerDimensions.width,
      containerDimensions.height,
      antibiotics.length
    );

    layout.chartSize = viewConfig.chartSize;

    const validation = validationUtils.validateNorthwesternCompliance(positioned);

    const calculationTime = performance.now() - startTime;

    if (calculationTime > 100) {
      console.warn(
        `Spatial layout calculation took ${calculationTime.toFixed(2)}ms (target: <100ms)`
      );
    }

    return {
      positioned,
      layout,
      groups: spatialGroups,
      validation,
      performance: {
        calculationTime,
        antibioticCount: antibiotics.length,
        gridCells: effectiveGridConfig.columns * gridConfig.rows,
      },
    };
  }, [antibiotics, screenSize, containerDimensions, gridConfig, groupingMode, viewConfig]);

  const visiblePositions = useMemo((): PositionedAntibiotic[] => {
    if (!enableVirtualization || !spatialLayout.positioned.length) {
      return spatialLayout.positioned;
    }

    return performanceUtils.getVisiblePositions(
      {
        ...viewportInfo,
        cellHeight: gridConfig.cellHeight,
      },
      spatialLayout.positioned
    );
  }, [spatialLayout.positioned, viewportInfo, gridConfig, enableVirtualization]);

  const prioritizedPositions = useMemo((): PositionedAntibiotic[] => {
    const userFocus = {
      activeGroup: selectedGroup,
      hoveredPosition: hoveredAntibiotic?.gridPosition,
    };

    return performanceUtils.calculateRenderPriority(visiblePositions, userFocus);
  }, [visiblePositions, selectedGroup, hoveredAntibiotic]);

  const handleAntibioticHover = useCallback((antibiotic: PositionedAntibiotic, isHovering: boolean): void => {
    setHoveredAntibiotic(isHovering ? antibiotic : null);
  }, []);

  const handleAntibioticClick = useCallback((antibiotic: PositionedAntibiotic): void => {
    onAntibioticSelect?.(antibiotic);
  }, [onAntibioticSelect]);

  const handleGroupClick = useCallback((groupKey: string): void => {
    const group = spatialLayout.groups[groupKey];
    if (group) {
      setSelectedGroup(selectedGroup === groupKey ? null : groupKey);
      onGroupSelect?.(groupKey, group.antibiotics);
    }
  }, [spatialLayout.groups, selectedGroup, onGroupSelect]);

  useEffect(() => {
    const renderTime = Date.now() - renderStartTime.current;

    if (renderTime > 1000) {
      console.warn(`Northwestern Spatial Layout render took ${renderTime}ms (target: <1000ms)`);
    }

    setIsRendering(false);
  }, [spatialLayout]);

  const emergencyOptimizations = useMemo(() => {
    if (!emergencyMode) return {};

    return {
      animationDuration: 0,
      chartSize: 'small',
      maxConcurrentRenders: 10,
    };
  }, [emergencyMode]);

  const gridStyles = useMemo(() => {
    if (!spatialLayout.layout) return {};

    return {
      display: 'grid',
      gridTemplate: spatialLayout.layout.gridTemplate,
      gap: spatialLayout.layout.gap,
      width: '100%',
      height: '100%',
      padding: '16px',
      position: 'relative' as const,
      ...emergencyOptimizations,
    };
  }, [spatialLayout.layout, emergencyOptimizations]);

  const groupBoundaries = useMemo(() => {
    return Object.keys(SPATIAL_GROUPS)
      .map((groupKey) => {
        const boundary = getGroupBoundaries(groupKey, gridConfig);
        return boundary ? { ...boundary, key: groupKey } : null;
      })
      .filter(Boolean);
  }, [gridConfig]);

  if (isRendering || !spatialLayout.positioned.length) {
    return (
      <div
        className={`northwestern-spatial-layout northwestern-spatial-layout--loading ${className}`}
      >
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

  if (spatialLayout.validation && !spatialLayout.validation.isValid) {
    return (
      <div
        className={`northwestern-spatial-layout northwestern-spatial-layout--error ${className}`}
      >
        <div className="spatial-error">
          <h3>Northwestern Layout Validation Failed</h3>
          <ul>
            {spatialLayout.validation.errors.map((error: string, index: number) => (
              <li key={index} className="error-item">
                {error}
              </li>
            ))}
          </ul>
          <button onClick={() => window.location.reload()}>Retry Layout</button>
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
      {/* View Mode Controls */}
      <div className="spatial-layout-controls">
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

      {/* Coverage Legend */}
      <div className="shared-coverage-legend" aria-label="Coverage legend">
        <div className="legend-section">
          <span className="legend-title">Coverage:</span>
          <div className="legend-items">
            {['none', 'limited', 'excellent'].map((level) => (
              <div key={level} className="legend-item">
                <span className={`legend-dot legend-dot--${level}`}></span>
                <span className="legend-label">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Group Boundaries */}
      {showConnections && groupingMode === 'drugClass' && (
        <div className="group-boundaries">
          {groupBoundaries.map((boundary: any) => (
            <div
              key={boundary.key}
              className={`group-boundary group-boundary--${boundary.key} ${
                selectedGroup === boundary.key ? 'group-boundary--selected' : ''
              }`}
              style={{
                gridRowStart: boundary.startRow + 1,
                gridRowEnd: boundary.endRow + 1,
                gridColumnStart: boundary.startCol + 1,
                gridColumnEnd: boundary.endCol + 1,
                backgroundColor: boundary.color,
                border:
                  selectedGroup === boundary.key
                    ? '2px solid #1976d2'
                    : '1px solid rgba(0,0,0,0.1)',
                borderRadius: '8px',
                padding: '4px',
                zIndex: 1,
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

      {/* Spatial Grid */}
      <div className="spatial-grid" style={gridStyles}>
        {prioritizedPositions.map((positionedAntibiotic, index) => {
          const { gridPosition, ...antibiotic } = positionedAntibiotic;
          const isHighlighted = highlightedClasses.includes(antibiotic.class);
          const isHovered = hoveredAntibiotic?.id === antibiotic.id;
          const isGroupSelected = selectedGroup === gridPosition.group;

          return (
            <div
              key={antibiotic.id}
              className={`antibiotic-position ${isHighlighted ? 'antibiotic-position--highlighted' : ''} ${
                isHovered ? 'antibiotic-position--hovered' : ''
              } ${isGroupSelected ? 'antibiotic-position--group-selected' : ''}`}
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
              />

              <div className="position-label">
                <span className="antibiotic-name">{antibiotic.name}</span>
                {screenSize !== 'mobile' && <span className="drug-class">{antibiotic.class}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="spatial-debug-info">
          <div className="performance-metrics">
            <span>Render: {spatialLayout.performance.calculationTime.toFixed(2)}ms</span>
            <span>Antibiotics: {spatialLayout.performance.antibioticCount}</span>
            <span>
              Grid: {gridConfig.columns}×{gridConfig.rows}
            </span>
            <span>Breakpoint: {screenSize}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NorthwesternSpatialLayout;
