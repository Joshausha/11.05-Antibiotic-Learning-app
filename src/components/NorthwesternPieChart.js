/**
 * Northwestern 8-Segment Pie Chart Component
 * 
 * Core visualization component for antibiotic coverage using Northwestern methodology.
 * Renders 8 segments representing different pathogen categories with coverage levels.
 * 
 * Created by: Agent 2.1 - Phase 2 Northwestern Foundation
 * Medical Accuracy: Validated against EnhancedAntibioticData.ts
 * Performance Target: <1000ms rendering, <200ms re-render
 * 
 * @component
 * @example
 * <NorthwesternPieChart 
 *   antibiotic={enhancedAntibioticData[0]}
 *   size="medium"
 *   interactive={true}
 *   onSegmentHover={(segment, coverage, context) => console.log(segment)}
 * />
 */

import React, { useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

// Northwestern 8-segment categories in clockwise order
const NORTHWESTERN_SEGMENTS = [
  { key: 'MRSA', label: 'MRSA', angle: 0, description: 'Methicillin-resistant Staphylococcus aureus' },
  { key: 'VRE_faecium', label: 'VRE faecium', angle: 45, description: 'Vancomycin-resistant Enterococcus faecium' },
  { key: 'anaerobes', label: 'Anaerobes', angle: 90, description: 'Bacteroides, C. difficile, mixed anaerobes' },
  { key: 'atypicals', label: 'Atypicals', angle: 135, description: 'Legionella, Mycoplasma, Chlamydophila' },
  { key: 'pseudomonas', label: 'P. aeruginosa', angle: 180, description: 'Pseudomonas aeruginosa' },
  { key: 'gramNegative', label: 'Gram(-)', angle: 225, description: 'Gram-negative organisms' },
  { key: 'MSSA', label: 'MSSA', angle: 270, description: 'Methicillin-sensitive Staphylococcus aureus' },
  { key: 'enterococcus_faecalis', label: 'E. faecalis', angle: 315, description: 'Enterococcus faecalis' }
];

// Size configurations for responsive design
const SIZE_CONFIG = {
  small: { diameter: 120, centerRadius: 20, strokeWidth: 1, fontSize: 10 },
  medium: { diameter: 200, centerRadius: 30, strokeWidth: 2, fontSize: 12 },
  large: { diameter: 280, centerRadius: 40, strokeWidth: 2, fontSize: 14 }
};

// Color palettes based on route
const ROUTE_COLORS = {
  red: { // Oral
    light: '#fecaca', // coverage 1
    dark: '#dc2626',  // coverage 2
    border: '#991b1b'
  },
  blue: { // IV
    light: '#bfdbfe', // coverage 1  
    dark: '#2563eb',  // coverage 2
    border: '#1d4ed8'
  },
  purple: { // Both
    light: '#ddd6fe', // coverage 1
    dark: '#7c3aed',  // coverage 2
    border: '#5b21b6'
  }
};

/**
 * Calculates SVG path for a pie segment
 * @param {number} startAngle - Starting angle in degrees
 * @param {number} endAngle - Ending angle in degrees  
 * @param {number} radius - Outer radius
 * @param {number} innerRadius - Inner radius for center hole
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 * @returns {string} SVG path string
 */
const createSegmentPath = (startAngle, endAngle, radius, innerRadius, centerX, centerY) => {
  const startAngleRad = (startAngle - 90) * Math.PI / 180; // -90 to start at top
  const endAngleRad = (endAngle - 90) * Math.PI / 180;
  
  const x1 = centerX + radius * Math.cos(startAngleRad);
  const y1 = centerY + radius * Math.sin(startAngleRad);
  const x2 = centerX + radius * Math.cos(endAngleRad);
  const y2 = centerY + radius * Math.sin(endAngleRad);
  
  const x3 = centerX + innerRadius * Math.cos(startAngleRad);
  const y3 = centerY + innerRadius * Math.sin(startAngleRad);
  const x4 = centerX + innerRadius * Math.cos(endAngleRad);
  const y4 = centerY + innerRadius * Math.sin(endAngleRad);
  
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    `M ${x1} ${y1}`, // Move to start point on outer circle
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc to end point on outer circle
    `L ${x4} ${y4}`, // Line to end point on inner circle
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x3} ${y3}`, // Arc back to start on inner circle
    'Z' // Close path
  ].join(' ');
};

/**
 * Gets fill color based on coverage level and route
 * @param {number} coverage - Coverage level (0, 1, or 2)
 * @param {string} routeColor - Route color ('red', 'blue', or 'purple')
 * @returns {string} Fill color
 */
const getCoverageColor = (coverage, routeColor) => {
  const palette = ROUTE_COLORS[routeColor] || ROUTE_COLORS.blue;
  
  switch (coverage) {
    case 0: return '#ffffff'; // No coverage - white
    case 1: return palette.light; // Some coverage - light
    case 2: return palette.dark; // Good coverage - dark
    default: return '#f3f4f6'; // Fallback - gray
  }
};

/**
 * Gets stroke pattern for cell wall active antibiotics
 * @param {boolean} cellWallActive - Whether antibiotic affects cell wall
 * @param {string} routeColor - Route color for stroke color
 * @returns {object} Stroke style properties
 */
const getStrokeStyle = (cellWallActive, routeColor) => {
  const palette = ROUTE_COLORS[routeColor] || ROUTE_COLORS.blue;
  
  return {
    stroke: palette.border,
    strokeWidth: 2,
    strokeDasharray: cellWallActive ? '4,2' : 'none'
  };
};

/**
 * Northwestern Pie Chart Component
 * Enhanced with sophisticated medical education interactions
 */
const NorthwesternPieChart = ({
  antibiotic,
  size = 'medium',
  onSegmentHover,
  onSegmentClick,
  showLabels = false,
  interactive = true,
  className = '',
  // Enhanced interaction props
  hoveredSegment: externalHoveredSegment,
  selectedSegments = [],
  educationLevel = 'resident',
  emergencyMode = false,
  enableTouchInteractions = true,
  showCenterLabel = false  // Hide center label by default for cleaner grid display
}) => {
  const [internalHoveredSegment, setInternalHoveredSegment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touchStartTime, setTouchStartTime] = useState(null);

  // Use external or internal hover state
  const hoveredSegment = externalHoveredSegment !== undefined ? externalHoveredSegment : internalHoveredSegment;

  // Size configuration
  const config = SIZE_CONFIG[size];
  const centerX = config.diameter / 2;
  const centerY = config.diameter / 2;
  const outerRadius = (config.diameter / 2) - config.strokeWidth;
  const innerRadius = config.centerRadius;

  // Validate antibiotic data
  const isValid = useMemo(() => {
    if (!antibiotic || !antibiotic.northwesternSpectrum || !antibiotic.routeColor) {
      setError('Invalid antibiotic data');
      return false;
    }
    
    // Validate all 8 segments are present
    const requiredSegments = NORTHWESTERN_SEGMENTS.map(s => s.key);
    const hasAllSegments = requiredSegments.every(key => 
      antibiotic.northwesternSpectrum.hasOwnProperty(key)
    );
    
    if (!hasAllSegments) {
      setError('Missing Northwestern spectrum data');
      return false;
    }
    
    setError(null);
    return true;
  }, [antibiotic]);

  // Generate segment data with paths and styling
  const segmentData = useMemo(() => {
    if (!isValid) return [];
    
    return NORTHWESTERN_SEGMENTS.map((segment, index) => {
      const startAngle = segment.angle;
      const endAngle = segment.angle + 45; // Each segment is 45 degrees
      const coverage = antibiotic.northwesternSpectrum[segment.key];
      
      return {
        ...segment,
        path: createSegmentPath(startAngle, endAngle, outerRadius, innerRadius, centerX, centerY),
        fill: getCoverageColor(coverage, antibiotic.routeColor),
        stroke: getStrokeStyle(antibiotic.cellWallActive, antibiotic.routeColor),
        coverage,
        id: `segment-${antibiotic.id}-${segment.key}`
      };
    });
  }, [antibiotic, config, isValid]);

  // Handle segment hover with enhanced context
  const handleSegmentHover = useCallback((segment, event) => {
    if (!interactive) return;
    
    // Performance timing for responsiveness tracking
    const startTime = performance.now();
    
    // Update internal state if not externally controlled
    if (externalHoveredSegment === undefined) {
      setInternalHoveredSegment(segment.key);
    }
    
    if (onSegmentHover) {
      const enhancedContext = {
        segment: segment.key,
        coverage: segment.coverage,
        description: segment.description,
        antibiotic: antibiotic?.name,
        educationLevel,
        emergencyMode,
        performance: performance.now() - startTime
      };
      onSegmentHover(segment.key, segment.coverage, `${segment.description} - Coverage: ${segment.coverage}/2`);
    }
  }, [interactive, onSegmentHover, antibiotic, educationLevel, emergencyMode, externalHoveredSegment]);

  // Handle segment click with selection support
  const handleSegmentClick = useCallback((segment, event) => {
    if (!interactive) return;
    
    const startTime = performance.now();
    
    if (onSegmentClick) {
      const enhancedContext = {
        segment: segment.key,
        coverage: segment.coverage,
        antibiotic,
        isSelected: selectedSegments.includes(segment.key),
        educationLevel,
        emergencyMode,
        performance: performance.now() - startTime
      };
      onSegmentClick(segment.key, antibiotic);
    }
  }, [interactive, onSegmentClick, antibiotic, selectedSegments, educationLevel, emergencyMode]);

  // Handle touch interactions for mobile clinical workflows
  const handleTouchStart = useCallback((segment, event) => {
    if (!enableTouchInteractions || !interactive) return;
    
    setTouchStartTime(Date.now());
    
    // Long press detection for emergency access
    const longPressTimer = setTimeout(() => {
      if (emergencyMode) {
        // Trigger emergency context display
        const emergencyContext = {
          segment: segment.key,
          coverage: segment.coverage,
          antibiotic,
          emergencyAccess: true,
          timestamp: Date.now()
        };
        onSegmentHover?.(segment.key, event, emergencyContext);
      }
    }, 500);
    
    // Store timer for cleanup
    event.target.longPressTimer = longPressTimer;
  }, [enableTouchInteractions, interactive, emergencyMode, antibiotic, onSegmentHover]);

  const handleTouchEnd = useCallback((segment, event) => {
    if (!enableTouchInteractions || !interactive) return;
    
    // Clear long press timer
    if (event.target.longPressTimer) {
      clearTimeout(event.target.longPressTimer);
      delete event.target.longPressTimer;
    }
    
    const touchDuration = Date.now() - touchStartTime;
    
    // If short tap, treat as click
    if (touchDuration < 500) {
      handleSegmentClick(segment, event);
    }
    
    setTouchStartTime(null);
  }, [enableTouchInteractions, interactive, touchStartTime, handleSegmentClick]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (externalHoveredSegment === undefined) {
      setInternalHoveredSegment(null);
    }
  }, [externalHoveredSegment]);

  // Generate center label text
  const centerLabel = useMemo(() => {
    if (!antibiotic) return { name: 'Unknown', route: '' };
    
    const routeText = Array.isArray(antibiotic.route) 
      ? antibiotic.route.join('/').toUpperCase()
      : (antibiotic.route || '').toUpperCase();
    
    return {
      name: antibiotic.name || 'Unknown',
      route: routeText
    };
  }, [antibiotic]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`northwestern-pie-chart northwestern-pie-chart--${size} ${className}`}>
        <div className="northwestern-pie-chart__loading">
          Loading chart...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`northwestern-pie-chart northwestern-pie-chart--${size} ${className}`}>
        <div className="northwestern-pie-chart__error">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`northwestern-pie-chart northwestern-pie-chart--${size} ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      <svg 
        viewBox={`0 0 ${config.diameter} ${config.diameter}`}
        className="northwestern-pie-chart__svg"
        role="img"
        aria-label={`Northwestern spectrum chart for ${centerLabel.name}`}
      >
        {/* Render segments with enhanced interactions */}
        {segmentData.map((segment) => {
          const isHovered = hoveredSegment === segment.key;
          const isSelected = selectedSegments.includes(segment.key);
          const hasLowCoverage = segment.coverage === 0;
          
          // Enhanced styling for different states
          const segmentClasses = [
            'pie-segment',
            `pie-segment--${segment.key.toLowerCase().replace('_', '-')}`,
            `pie-segment--coverage-${segment.coverage}`,
            isHovered && 'pie-segment--hovered',
            isSelected && 'pie-segment--selected',
            hasLowCoverage && 'pie-segment--contraindicated',
            emergencyMode && 'pie-segment--emergency-mode'
          ].filter(Boolean).join(' ');

          // Dynamic opacity and effects
          let segmentOpacity = 1;
          if (hoveredSegment && !isHovered) segmentOpacity = 0.6;
          if (selectedSegments.length > 0 && !isSelected) segmentOpacity = 0.5;
          if (emergencyMode && hasLowCoverage) segmentOpacity = 0.3;

          // Enhanced stroke for selected segments
          const enhancedStroke = {
            ...segment.stroke,
            strokeWidth: isSelected ? segment.stroke.strokeWidth * 1.5 : segment.stroke.strokeWidth,
            stroke: isSelected ? '#000000' : segment.stroke.stroke
          };

          return (
            <path
              key={segment.id}
              id={segment.id}
              className={segmentClasses}
              d={segment.path}
              fill={segment.fill}
              {...enhancedStroke}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                opacity: segmentOpacity,
                transition: 'all 0.2s ease-in-out',
                filter: isHovered ? 'brightness(1.1)' : 'none',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                transformOrigin: 'center'
              }}
              onMouseEnter={(e) => handleSegmentHover(segment, e)}
              onClick={(e) => handleSegmentClick(segment, e)}
              onTouchStart={enableTouchInteractions ? (e) => handleTouchStart(segment, e) : undefined}
              onTouchEnd={enableTouchInteractions ? (e) => handleTouchEnd(segment, e) : undefined}
              onKeyDown={(e) => {
                if (interactive && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleSegmentClick(segment, e);
                }
              }}
              aria-label={`${segment.label}: ${segment.coverage}/2 coverage`}
              aria-pressed={isSelected}
              role="button"
              tabIndex={interactive ? 0 : -1}
            />
          );
        })}
        
        {/* Center label - only show when explicitly enabled */}
        {showCenterLabel && (
          <g className="pie-center-label">
            <text
              x={centerX}
              y={centerY - config.fontSize/2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="pie-center-label__name"
              fontSize={config.fontSize}
              fontWeight="bold"
              fill="currentColor"
            >
              {centerLabel.name}
            </text>
            <text
              x={centerX}
              y={centerY + config.fontSize/2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="pie-center-label__route"
              fontSize={config.fontSize * 0.8}
              fill="currentColor"
              opacity="0.7"
            >
              {centerLabel.route}
            </text>
          </g>
        )}
        
        {/* Optional segment labels */}
        <g 
          className="pie-segment-labels"
          style={{ display: showLabels ? 'block' : 'none' }}
        >
          {segmentData.map((segment) => {
            const labelAngle = segment.angle + 22.5; // Middle of segment
            const labelRadius = outerRadius + 15;
            const labelAngleRad = (labelAngle - 90) * Math.PI / 180;
            const labelX = centerX + labelRadius * Math.cos(labelAngleRad);
            const labelY = centerY + labelRadius * Math.sin(labelAngleRad);
            
            return (
              <text
                key={`label-${segment.id}`}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={config.fontSize * 0.7}
                fill="currentColor"
                className="pie-segment-label"
              >
                {segment.label}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

// PropTypes validation
NorthwesternPieChart.propTypes = {
  antibiotic: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    northwesternSpectrum: PropTypes.shape({
      MRSA: PropTypes.oneOf([0, 1, 2]).isRequired,
      VRE_faecium: PropTypes.oneOf([0, 1, 2]).isRequired,
      anaerobes: PropTypes.oneOf([0, 1, 2]).isRequired,
      atypicals: PropTypes.oneOf([0, 1, 2]).isRequired,
      pseudomonas: PropTypes.oneOf([0, 1, 2]).isRequired,
      gramNegative: PropTypes.oneOf([0, 1, 2]).isRequired,
      MSSA: PropTypes.oneOf([0, 1, 2]).isRequired,
      enterococcus_faecalis: PropTypes.oneOf([0, 1, 2]).isRequired
    }).isRequired,
    routeColor: PropTypes.oneOf(['red', 'blue', 'purple']).isRequired,
    cellWallActive: PropTypes.bool,
    route: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
  }).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onSegmentHover: PropTypes.func,
  onSegmentClick: PropTypes.func,
  showLabels: PropTypes.bool,
  interactive: PropTypes.bool,
  className: PropTypes.string,
  // Enhanced interaction props
  hoveredSegment: PropTypes.string,
  selectedSegments: PropTypes.arrayOf(PropTypes.string),
  educationLevel: PropTypes.oneOf(['student', 'resident', 'attending']),
  emergencyMode: PropTypes.bool,
  enableTouchInteractions: PropTypes.bool,
  showCenterLabel: PropTypes.bool
};

export default NorthwesternPieChart;

// Export helper functions for testing
export {
  NORTHWESTERN_SEGMENTS,
  SIZE_CONFIG,
  ROUTE_COLORS,
  createSegmentPath,
  getCoverageColor,
  getStrokeStyle
};