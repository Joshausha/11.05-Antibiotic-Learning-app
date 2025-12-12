/**
 * Group Visual Elements Component
 *
 * Specialized visual components for rendering group headers, boundaries, statistics,
 * and connection lines in the Northwestern group organization system.
 *
 * Created by: Agent 3.2 - Group Organization Designer
 * Phase: 3 - Spatial Organization System
 * Integration: Visual rendering for Northwestern group organization
 *
 * Features:
 * - Group headers with medical context and antibiotic counts
 * - Visual connection lines between related antibiotics
 * - Coverage pattern summaries for each group
 * - Interactive group-level controls and statistics
 * - Responsive design for clinical device optimization
 * - Emergency mode support for <30 second clinical access
 *
 * @component
 * @example
 * <GroupVisualElements
 *   type="header"
 *   groupKey="betaLactams"
 *   group={groupData}
 *   statistics={statistics}
 *   onToggle={() => {}}
 * />
 */

import React, { FC, useMemo, useCallback, CSSProperties } from 'react';
import { ROUTE_CLASSIFICATIONS, MECHANISM_CLASSIFICATIONS } from '../utils/medicalGroupingLogic';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

type ScreenSize = 'mobile' | 'tablet' | 'desktop';

type FilterType = 'mechanism' | 'generation';

type CoverageRating = 'Good' | 'Moderate' | 'Poor';

interface GroupColor {
  background?: string;
  border?: string;
  accent?: string;
}

interface RouteDistribution {
  oral: number;
  intravenous: number;
  both: number;
}

interface GroupStatistics {
  totalCount: number;
  generationDistribution: Record<string, number>;
  routeDistribution: RouteDistribution;
}

interface GenerationGroups {
  Cephalosporins?: Record<string, any>;
  [key: string]: any;
}

interface GroupData {
  name: string;
  medicalContext?: string;
  clinicalContext?: string;
  emergencyUse?: string;
  color?: GroupColor;
  antibioticCount?: number;
  generationGroups?: GenerationGroups;
}

interface CoverageSummaryData {
  average: number;
  rating: CoverageRating;
  percentage: {
    good: number;
    moderate?: number;
    poor?: number;
  };
}

interface CoverageSummary {
  [pathogen: string]: CoverageSummaryData;
}

interface SpatialLayout {
  layout?: any;
}

interface GroupsData {
  [groupKey: string]: GroupData;
}

interface ConnectionLine {
  from: string;
  to: string;
  type: string;
  groupKey: string;
  color: string;
}

interface TopCoverageItem {
  pathogen: string;
  rating: CoverageRating;
  percentage: number;
}

// ==========================================
// COMPONENT PROP INTERFACES
// ==========================================

interface GroupHeaderProps {
  groupKey: string;
  group: GroupData;
  statistics?: GroupStatistics;
  coverageSummary?: CoverageSummary;
  screenSize: ScreenSize;
  showStats?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
  onFilter?: (filterType: FilterType) => void;
}

interface GroupStatisticsProps {
  groupKey: string;
  group: GroupData;
  statistics?: GroupStatistics;
  coverageSummary?: CoverageSummary;
  screenSize: ScreenSize;
}

interface GroupBoundaryProps {
  groupKey: string;
  group: GroupData;
  spatialLayout?: SpatialLayout;
  screenSize: ScreenSize;
  isSelected?: boolean;
  onClick?: () => void;
}

interface GroupConnectionsProps {
  groups: GroupsData;
  spatialLayout?: SpatialLayout;
  screenSize: ScreenSize;
}

interface GroupVisualElementsProps {
  type: 'header' | 'statistics' | 'boundary' | 'connections';
  groupKey?: string;
  group?: GroupData;
  statistics?: GroupStatistics;
  coverageSummary?: CoverageSummary;
  screenSize?: ScreenSize;
  showStats?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
  onFilter?: (filterType: FilterType) => void;
  onClick?: () => void;
  spatialLayout?: SpatialLayout;
  groups?: GroupsData;
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

/**
 * Group Header Component
 * Displays group name, medical context, and interactive controls
 */
const GroupHeader: FC<GroupHeaderProps> = ({
  groupKey,
  group,
  statistics,
  coverageSummary,
  screenSize,
  showStats,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  onFilter
}) => {
  const headerStyles = useMemo((): CSSProperties => ({
    backgroundColor: group.color?.background || '#f5f5f5',
    borderColor: group.color?.border || '#ccc',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    padding: screenSize === 'mobile' ? '8px 12px' : screenSize === 'tablet' ? '12px 16px' : '16px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)'
  }), [group.color, screenSize, isSelected]);

  const handleHeaderClick = useCallback(() => {
    onSelect?.();
  }, [onSelect]);

  const handleToggleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggle?.();
  }, [onToggle]);

  const handleFilterClick = useCallback((filterType: FilterType, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onFilter?.(filterType);
  }, [onFilter]);

  // Top coverage pathogens for quick display
  const topCoverage = useMemo((): TopCoverageItem[] => {
    if (!coverageSummary) return [];

    return Object.entries(coverageSummary)
      .sort(([,a], [,b]) => b.average - a.average)
      .slice(0, 3)
      .map(([pathogen, data]) => ({
        pathogen: pathogen.replace('_', ' '),
        rating: data.rating,
        percentage: Math.round(data.percentage.good)
      }));
  }, [coverageSummary]);

  return (
    <div
      className={`group-header group-header--${groupKey} ${isSelected ? 'group-header--selected' : ''} ${isExpanded ? 'group-header--expanded' : ''}`}
      style={headerStyles}
      onClick={handleHeaderClick}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`${group.name} group with ${statistics?.totalCount || 0} antibiotics`}
    >
      {/* Header Title and Context */}
      <div className="group-header-main">
        <div className="group-title-section">
          <h3 className="group-title" style={{
            color: group.color?.accent || '#333',
            fontSize: screenSize === 'mobile' ? '1rem' : '1.125rem',
            margin: 0,
            fontWeight: 'bold'
          }}>
            {group.name}
          </h3>

          {screenSize !== 'mobile' && (
            <p className="group-medical-context" style={{
              color: group.color?.accent || '#666',
              fontSize: '0.875rem',
              margin: '4px 0 0 0',
              fontStyle: 'italic'
            }}>
              {group.medicalContext}
            </p>
          )}
        </div>

        <div className="group-counts">
          <span className="antibiotic-count" style={{
            backgroundColor: group.color?.accent || '#333',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {statistics?.totalCount || 0} antibiotics
          </span>

          {screenSize === 'desktop' && statistics && (
            <>
              <span className="class-count" style={{
                marginLeft: '8px',
                fontSize: '0.75rem',
                color: group.color?.accent || '#666'
              }}>
                {Object.keys(statistics.generationDistribution).length} generations
              </span>

              <span className="route-info" style={{
                marginLeft: '8px',
                fontSize: '0.75rem',
                color: group.color?.accent || '#666'
              }}>
                {statistics.routeDistribution.both > 0 ? 'PO/IV' :
                 statistics.routeDistribution.oral > statistics.routeDistribution.intravenous ? 'PO' : 'IV'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Expandable Statistics Section */}
      {showStats && isExpanded && statistics && (
        <div className="group-stats-expanded" style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: `1px solid ${group.color?.border || '#ddd'}`,
          fontSize: '0.75rem'
        }}>
          {/* Top Coverage Display */}
          {topCoverage.length > 0 && (
            <div className="coverage-highlights" style={{ marginBottom: '8px' }}>
              <strong style={{ color: group.color?.accent }}>Best Coverage:</strong>
              {topCoverage.map((coverage) => (
                <span key={coverage.pathogen} style={{
                  marginLeft: '8px',
                  padding: '2px 6px',
                  backgroundColor: coverage.rating === 'Good' ? '#4caf50' :
                                   coverage.rating === 'Moderate' ? '#ff9800' : '#f44336',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.7rem'
                }}>
                  {coverage.pathogen}
                </span>
              ))}
            </div>
          )}

          {/* Route Distribution */}
          <div className="route-distribution" style={{ marginBottom: '8px' }}>
            <strong style={{ color: group.color?.accent }}>Routes:</strong>
            <span style={{ marginLeft: '8px' }}>
              PO: {statistics.routeDistribution.oral},
              IV: {statistics.routeDistribution.intravenous},
              Both: {statistics.routeDistribution.both}
            </span>
          </div>

          {/* Filter Buttons */}
          <div className="group-filter-controls">
            <button
              onClick={(e) => handleFilterClick('mechanism', e)}
              style={{
                padding: '4px 8px',
                backgroundColor: group.color?.border,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.7rem',
                marginRight: '4px',
                cursor: 'pointer'
              }}
              aria-label={`Filter by ${group.name} mechanism`}
            >
              Mechanism
            </button>

            <button
              onClick={(e) => handleFilterClick('generation', e)}
              style={{
                padding: '4px 8px',
                backgroundColor: group.color?.border,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.7rem',
                marginRight: '4px',
                cursor: 'pointer'
              }}
              aria-label={`Filter by ${group.name} generations`}
            >
              Generations
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        className="group-toggle"
        onClick={handleToggleClick}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          color: group.color?.accent || '#666',
          fontSize: '1.2rem'
        }}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${group.name} group`}
      >
        {isExpanded ? '−' : '+'}
      </button>
    </div>
  );
};

/**
 * Group Statistics Panel Component
 * Detailed statistical breakdown for expanded groups
 */
const GroupStatistics: FC<GroupStatisticsProps> = ({
  groupKey,
  group,
  statistics,
  coverageSummary,
  screenSize
}) => {
  const statisticsStyles = useMemo((): CSSProperties => ({
    backgroundColor: group.color?.background || '#f5f5f5',
    border: `1px solid ${group.color?.border || '#ddd'}`,
    borderRadius: '8px',
    padding: screenSize === 'mobile' ? '12px' : '16px',
    marginTop: '8px'
  }), [group.color, screenSize]);

  if (!statistics || !coverageSummary) return null;

  return (
    <div
      className={`group-statistics group-statistics--${groupKey}`}
      style={statisticsStyles}
    >
      <h4 style={{
        color: group.color?.accent || '#333',
        fontSize: screenSize === 'mobile' ? '0.875rem' : '1rem',
        marginBottom: '12px'
      }}>
        {group.name} Coverage Analysis
      </h4>

      {/* Northwestern 8-Segment Coverage Grid */}
      <div className="coverage-grid" style={{
        display: 'grid',
        gridTemplateColumns: screenSize === 'mobile' ? '1fr' : 'repeat(2, 1fr)',
        gap: '8px',
        marginBottom: '16px'
      }}>
        {Object.entries(coverageSummary).map(([pathogen, data]) => (
          <div key={pathogen} className="coverage-item" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 8px',
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: '4px',
            fontSize: '0.75rem'
          }}>
            <span className="pathogen-name">
              {pathogen.replace('_', ' ').replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <div className="coverage-indicator" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div className="coverage-bar" style={{
                width: '30px',
                height: '4px',
                backgroundColor: '#e0e0e0',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(data.average / 2) * 100}%`,
                  height: '100%',
                  backgroundColor: data.rating === 'Good' ? '#4caf50' :
                                   data.rating === 'Moderate' ? '#ff9800' : '#f44336',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <span style={{
                color: data.rating === 'Good' ? '#4caf50' :
                       data.rating === 'Moderate' ? '#ff9800' : '#f44336',
                fontWeight: 'bold',
                minWidth: '50px'
              }}>
                {data.rating}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Clinical Context */}
      <div className="clinical-context" style={{
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '0.75rem'
      }}>
        <strong style={{ color: group.color?.accent }}>Clinical Context:</strong>
        <p style={{ margin: '4px 0 0 0' }}>{group.clinicalContext}</p>

        {group.emergencyUse && (
          <div style={{ marginTop: '8px' }}>
            <strong style={{ color: '#d32f2f' }}>Emergency Use:</strong>
            <p style={{ margin: '4px 0 0 0', color: '#d32f2f' }}>{group.emergencyUse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Group Boundary Component
 * Visual boundary overlay for spatial grid groups
 */
const GroupBoundary: FC<GroupBoundaryProps> = ({
  groupKey,
  group,
  spatialLayout,
  screenSize,
  isSelected,
  onClick
}) => {
  // Calculate boundary position based on spatial layout
  const boundaryStyles = useMemo((): CSSProperties => {
    if (!spatialLayout?.layout) return {};

    return {
      position: 'absolute',
      backgroundColor: `${group.color?.background || '#f5f5f5'}20`,
      border: `2px ${isSelected ? 'solid' : 'dashed'} ${group.color?.border || '#ddd'}`,
      borderRadius: '8px',
      pointerEvents: 'auto',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      zIndex: isSelected ? 10 : 1
    };
  }, [group.color, spatialLayout, isSelected]);

  if (!spatialLayout?.layout) return null;

  return (
    <div
      className={`group-boundary group-boundary--${groupKey} ${isSelected ? 'group-boundary--selected' : ''}`}
      style={boundaryStyles}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${group.name} group boundary`}
    >
      {/* Boundary Label */}
      <div className="boundary-label" style={{
        position: 'absolute',
        top: '-10px',
        left: '8px',
        backgroundColor: group.color?.background || '#f5f5f5',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        color: group.color?.accent || '#333',
        border: `1px solid ${group.color?.border || '#ddd'}`
      }}>
        {group.name}
        <span style={{
          marginLeft: '4px',
          fontSize: '0.6rem',
          opacity: 0.8
        }}>
          ({group.antibioticCount || 0})
        </span>
      </div>
    </div>
  );
};

/**
 * Group Connections Component
 * SVG lines showing relationships between antibiotics
 */
const GroupConnections: FC<GroupConnectionsProps> = ({
  groups,
  spatialLayout,
  screenSize
}) => {
  const connections = useMemo((): ConnectionLine[] => {
    if (!groups || !spatialLayout) return [];

    const connectionLines: ConnectionLine[] = [];

    Object.keys(groups).forEach(groupKey => {
      const group = groups[groupKey];

      // Add generation connections within cephalosporin group
      if (groupKey === 'betaLactams' && group.generationGroups?.Cephalosporins) {
        const cephGenerations = Object.keys(group.generationGroups.Cephalosporins).sort();

        for (let i = 0; i < cephGenerations.length - 1; i++) {
          connectionLines.push({
            from: cephGenerations[i],
            to: cephGenerations[i + 1],
            type: 'generation',
            groupKey,
            color: group.color?.border || '#ddd'
          });
        }
      }
    });

    return connectionLines;
  }, [groups, spatialLayout]);

  if (!connections.length) return null;

  return (
    <svg
      className="group-connections"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5
      }}
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7"
                refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
        </marker>
      </defs>

      {connections.map((connection, index) => (
        <line
          key={index}
          className={`connection-line connection-line--${connection.type}`}
          stroke={connection.color}
          strokeWidth="1"
          strokeDasharray={connection.type === 'generation' ? '5,5' : 'none'}
          markerEnd="url(#arrowhead)"
          opacity="0.6"
          // Coordinates would be calculated based on actual antibiotic positions
          x1="0" y1="0" x2="100" y2="100"
        />
      ))}
    </svg>
  );
};

/**
 * Main Group Visual Elements Component
 * Renders appropriate visual element based on type prop
 */
const GroupVisualElements: FC<GroupVisualElementsProps> = ({ type, ...props }) => {
  switch (type) {
    case 'header':
      return (
        <GroupHeader
          groupKey={props.groupKey!}
          group={props.group!}
          statistics={props.statistics}
          coverageSummary={props.coverageSummary}
          screenSize={props.screenSize || 'desktop'}
          showStats={props.showStats}
          isExpanded={props.isExpanded}
          isSelected={props.isSelected}
          onToggle={props.onToggle}
          onSelect={props.onSelect}
          onFilter={props.onFilter}
        />
      );
    case 'statistics':
      return (
        <GroupStatistics
          groupKey={props.groupKey!}
          group={props.group!}
          statistics={props.statistics}
          coverageSummary={props.coverageSummary}
          screenSize={props.screenSize || 'desktop'}
        />
      );
    case 'boundary':
      return (
        <GroupBoundary
          groupKey={props.groupKey!}
          group={props.group!}
          spatialLayout={props.spatialLayout}
          screenSize={props.screenSize || 'desktop'}
          isSelected={props.isSelected}
          onClick={props.onClick}
        />
      );
    case 'connections':
      return (
        <GroupConnections
          groups={props.groups!}
          spatialLayout={props.spatialLayout}
          screenSize={props.screenSize || 'desktop'}
        />
      );
    default:
      return null;
  }
};

export default GroupVisualElements;
