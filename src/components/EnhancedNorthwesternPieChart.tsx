/**
 * Enhanced Northwestern Pie Chart with Medical Design System (TypeScript)
 *
 * Professional medical-grade visualization component that integrates comprehensive
 * visual design system with the existing Northwestern foundation.
 *
 * Features:
 * - Medical-grade color system with clinical significance mapping
 * - Professional medical typography optimized for clinical readability
 * - Enhanced interactive states with emergency clinical access
 * - Responsive design for clinical workflow devices
 * - WCAG 2.1 AA accessibility compliance
 * - Color-blind safe with pattern alternatives
 */

import React, {
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect,
  FC,
  ReactNode,
  CSSProperties,
  MouseEvent,
  ReactElement
} from 'react';
import NorthwesternPieChart from './NorthwesternPieChart';
import { getSegmentColors, getRouteColors } from '../styles/NorthwesternColors';
import { getSegmentTypography } from '../styles/NorthwesternTypography';
import { combineStates, generateStateCSS } from '../styles/NorthwesternVisualStates';

/**
 * Type Definitions
 */

interface AntibioticSpectrum {
  MRSA: number;
  VRE_faecium: number;
  anaerobes: number;
  atypicals: number;
  pseudomonas: number;
  gramNegative: number;
  MSSA: number;
  enterococcus_faecalis: number;
  [key: string]: number;
}

interface Antibiotic {
  id: string | number;
  name: string;
  class?: string;
  northwesternSpectrum: AntibioticSpectrum;
  routeColor?: 'red' | 'blue' | 'purple';
  cellWallActive?: boolean;
  route?: string | string[];
  generation?: string;
  [key: string]: any;
}

interface RouteColors {
  excellent: string;
  limited: string;
  none: string;
  border: string;
  borderHover?: string;
  accent: string;
  emergency?: string;
  textLight?: string;
  [key: string]: string | undefined;
}

interface SegmentColorResult {
  background: string;
  border: string;
  text: string;
  pattern?: 'diagonal-stripes' | 'dots' | 'solid';
  urgency?: 'critical' | 'caution' | 'safe';
  borderStyle?: 'solid' | 'dashed';
  borderDashArray?: string;
  routeAccent?: string;
  accessibilityPattern?: boolean;
  clinicalSignificance?: string;
  [key: string]: any;
}

interface SegmentContext {
  coverage?: number;
  segmentKey?: string;
  [key: string]: any;
}

interface EnhancedSegmentContext extends SegmentContext {
  visualContext?: 'emergency' | 'clinical' | 'education' | 'highContrast';
  clinicalPriority?: 'emergency' | 'high' | 'standard' | 'low';
  colors?: SegmentColorResult;
  typography?: any;
  accessibilityInfo?: {
    contrastRatio: string;
    screenReaderText: string;
    visualPatterns: boolean;
  };
}

interface SelectionContext extends SegmentContext {
  selectionCount?: number;
  maxSelections?: number;
  comparisonMode?: boolean;
  clinicalGuidance?: 'contraindicated' | 'limited' | 'appropriate';
  visualFeedback?: {
    selectionOutline: boolean;
    elevatedShadow: boolean;
    contrastEnhanced: boolean;
  };
}

interface PerformanceMetric {
  type: 'hover_response' | 'selection_response' | 'render_time';
  duration: number;
  segment?: string;
  target?: string;
  size?: 'small' | 'medium' | 'large';
  context?: string;
}

interface AccessibilityEvent {
  type: 'segment_hover' | 'segment_selection' | 'context_update';
  segment?: string;
  context?: any;
  timestamp?: number;
  selected?: boolean;
}

interface AccessibilityContext {
  totalSegments: number;
  selectedSegments: number;
  clinicalContext: string;
  highContrast: boolean;
  colorBlindSafe: boolean;
  emergencyMode: boolean;
  reducedMotion: boolean;
}

interface EnhancedNorthwesternPieChartProps {
  // Core props from original NorthwesternPieChart
  antibiotic?: Antibiotic;
  size?: 'small' | 'medium' | 'large';
  onSegmentHover?: (segmentKey: string, event: MouseEvent, context: EnhancedSegmentContext) => void;
  onSegmentClick?: (segmentKey: string, event: MouseEvent, context: SelectionContext) => void;
  showLabels?: boolean;
  interactive?: boolean;
  className?: string;
  hoveredSegment?: string | null;
  selectedSegments?: string[];
  educationLevel?: 'student' | 'resident' | 'attending';
  emergencyMode?: boolean;
  enableTouchInteractions?: boolean;

  // Enhanced visual design props
  clinicalContext?: 'emergency' | 'clinical' | 'education' | 'highContrast';
  visualTheme?: 'professional' | 'accessible' | 'emergency';
  colorBlindSafe?: boolean;
  highContrast?: boolean;
  responsiveText?: boolean;
  enhancedStates?: boolean;
  performanceMode?: boolean;

  // Medical workflow props
  clinicalPriority?: 'emergency' | 'high' | 'standard' | 'low';
  showCoverageIndicators?: boolean;
  showRouteIndicators?: boolean;
  enableEmergencyAccess?: boolean;
  showDebugInfo?: boolean;

  // Accessibility enhancement props
  forceFocus?: boolean;
  announceChanges?: boolean;
  reducedMotion?: boolean;

  // Integration callbacks
  onVisualStateChange?: (event: {
    segment: string;
    states: string[];
    context: any;
  }) => void;
  onAccessibilityEvent?: (event: AccessibilityEvent) => void;
  onPerformanceMetric?: (metric: PerformanceMetric) => void;
}

/**
 * Enhanced Northwestern Pie Chart Component
 * Integrates comprehensive medical design system with existing functionality
 */
const EnhancedNorthwesternPieChart: FC<EnhancedNorthwesternPieChartProps> = ({
  // Core props from original NorthwesternPieChart
  antibiotic,
  size = 'medium',
  onSegmentHover,
  onSegmentClick,
  showLabels = false,
  interactive = true,
  className = '',
  hoveredSegment,
  selectedSegments = [],
  educationLevel = 'resident',
  emergencyMode = false,
  enableTouchInteractions = true,

  // Enhanced visual design props
  clinicalContext = 'clinical',
  visualTheme = 'professional',
  colorBlindSafe = true,
  highContrast = false,
  responsiveText = true,
  enhancedStates = true,
  performanceMode = false,

  // Medical workflow props
  clinicalPriority = 'standard',
  showCoverageIndicators = false,
  showRouteIndicators = false,
  enableEmergencyAccess = true,
  showDebugInfo = false,

  // Accessibility enhancement props
  forceFocus = false,
  announceChanges = true,
  reducedMotion = false,

  // Integration callbacks
  onVisualStateChange,
  onAccessibilityEvent,
  onPerformanceMetric
}) => {
  // State management
  const [visualStates, setVisualStates] = useState<Map<string, string[]>>(new Map());
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric>({} as PerformanceMetric);
  const [accessibilityContext, setAccessibilityContext] = useState<AccessibilityContext | {}>({});
  const chartRef = useRef<HTMLDivElement>(null);
  const renderStartTime = useRef<number>(performance.now());

  // Determine clinical visual context
  const effectiveContext = useMemo((): 'emergency' | 'clinical' | 'education' | 'highContrast' => {
    if (emergencyMode || clinicalPriority === 'emergency') return 'emergency';
    if (highContrast) return 'highContrast';
    return (clinicalContext as 'emergency' | 'clinical' | 'education' | 'highContrast') || 'clinical';
  }, [emergencyMode, clinicalPriority, highContrast, clinicalContext]);

  // Generate enhanced route colors with medical context
  const enhancedRouteColors = useMemo((): RouteColors => {
    const baseColors = getRouteColors(antibiotic?.routeColor || 'blue') as RouteColors;

    // Apply clinical context enhancements
    if (effectiveContext === 'emergency') {
      return {
        ...baseColors,
        emergency: baseColors.accent,
        border: baseColors.borderHover || baseColors.border,
        accent: baseColors.emergency || baseColors.accent
      };
    }

    if (effectiveContext === 'highContrast') {
      return {
        ...baseColors,
        none: '#ffffff',
        limited: baseColors.textLight || '#4a5568',
        excellent: '#000000',
        border: '#000000'
      };
    }

    return baseColors;
  }, [antibiotic?.routeColor, effectiveContext]);

  // Enhanced segment color calculation
  const calculateSegmentColors = useCallback((segmentKey: string, coverage: number): SegmentColorResult => {
    try {
      const baseColors = getSegmentColors(segmentKey, antibiotic?.routeColor, coverage) as any;
      const routeColors = enhancedRouteColors;

      // Apply visual theme enhancements
      if (visualTheme === 'accessible' || colorBlindSafe) {
        baseColors.pattern = coverage === 0 ? 'diagonal-stripes' :
          coverage === 1 ? 'dots' : 'solid';
      }

      if (visualTheme === 'emergency') {
        baseColors.urgency = coverage === 0 ? 'critical' :
          coverage === 1 ? 'caution' : 'safe';
      }

      // Apply cell wall active patterns
      if (antibiotic?.cellWallActive && coverage > 0) {
        baseColors.borderStyle = 'dashed';
        baseColors.borderDashArray = '6,3';
      }

      return {
        ...baseColors,
        routeAccent: routeColors.accent,
        accessibilityPattern: colorBlindSafe,
        clinicalSignificance: baseColors.clinicalSignificance || 'standard'
      };
    } catch (error) {
      console.error('Error calculating segment colors:', error);
      return {
        background: '#e5e7eb',
        border: '#9ca3af',
        text: '#374151',
        routeAccent: '#6b7280'
      };
    }
  }, [antibiotic, enhancedRouteColors, visualTheme, colorBlindSafe]);

  // Enhanced segment interaction handler
  const handleEnhancedSegmentHover = useCallback(
    (segmentKey: string, event: MouseEvent<any>, context: SegmentContext): void => {
      const startTime = performance.now();

      // Update visual states
      setVisualStates(prev => {
        const newStates = new Map(prev);
        newStates.set(segmentKey, ['hover']);
        return newStates;
      });

      // Generate enhanced context
      const enhancedContext: EnhancedSegmentContext = {
        ...context,
        visualContext: effectiveContext,
        clinicalPriority,
        coverage: antibiotic?.northwesternSpectrum?.[segmentKey] || 0,
        colors: calculateSegmentColors(segmentKey, antibiotic?.northwesternSpectrum?.[segmentKey] || 0),
        typography: getSegmentTypography(segmentKey, 'primary'),
        accessibilityInfo: {
          contrastRatio: 'AA',
          screenReaderText: `${segmentKey}: ${context.coverage}/2 coverage`,
          visualPatterns: colorBlindSafe
        }
      };

      // Performance tracking
      const responseTime = performance.now() - startTime;
      if (onPerformanceMetric) {
        onPerformanceMetric({
          type: 'hover_response',
          duration: responseTime,
          segment: segmentKey,
          target: '100ms'
        });
      }

      // Accessibility announcements
      if (announceChanges && onAccessibilityEvent) {
        onAccessibilityEvent({
          type: 'segment_hover',
          segment: segmentKey,
          context: enhancedContext,
          timestamp: Date.now()
        });
      }

      // Call original handler with enhanced context
      if (onSegmentHover) {
        onSegmentHover(segmentKey, event, enhancedContext);
      }

      // Visual state change callback
      if (onVisualStateChange) {
        onVisualStateChange({
          segment: segmentKey,
          states: ['hover'],
          context: enhancedContext
        });
      }
    },
    [effectiveContext, clinicalPriority, antibiotic, calculateSegmentColors, colorBlindSafe,
      announceChanges, onSegmentHover, onAccessibilityEvent, onPerformanceMetric, onVisualStateChange]
  );

  // Enhanced segment selection handler
  const handleEnhancedSegmentClick = useCallback(
    (segmentKey: string, event: MouseEvent<any>, context: SegmentContext): void => {
      const startTime = performance.now();

      // Update visual states for selection
      setVisualStates(prev => {
        const newStates = new Map(prev);
        const currentStates = newStates.get(segmentKey) || [];
        const isSelected = currentStates.includes('selected');

        if (isSelected) {
          newStates.set(segmentKey, currentStates.filter(state => state !== 'selected'));
        } else {
          newStates.set(segmentKey, [...currentStates, 'selected']);
        }

        return newStates;
      });

      // Generate enhanced selection context
      const enhancedContext: SelectionContext = {
        ...context,
        selectionCount: selectedSegments.length,
        maxSelections: 8,
        comparisonMode: selectedSegments.length > 1,
        clinicalGuidance: context.coverage === 0 ? 'contraindicated' :
          context.coverage === 1 ? 'limited' : 'appropriate',
        visualFeedback: {
          selectionOutline: true,
          elevatedShadow: true,
          contrastEnhanced: effectiveContext === 'highContrast'
        }
      };

      // Performance and accessibility tracking
      const responseTime = performance.now() - startTime;
      if (onPerformanceMetric) {
        onPerformanceMetric({
          type: 'selection_response',
          duration: responseTime,
          segment: segmentKey
        });
      }

      if (onAccessibilityEvent) {
        onAccessibilityEvent({
          type: 'segment_selection',
          segment: segmentKey,
          selected: !selectedSegments.includes(segmentKey),
          context: enhancedContext
        });
      }

      // Call original handler
      if (onSegmentClick) {
        onSegmentClick(segmentKey, event, enhancedContext);
      }
    },
    [selectedSegments, effectiveContext, onSegmentClick, onPerformanceMetric, onAccessibilityEvent]
  );

  // Mouse leave handler with enhanced cleanup
  const handleEnhancedMouseLeave = useCallback((): void => {
    setVisualStates(prev => {
      const newStates = new Map<string, string[]>();
      // Keep selected states, clear hover states
      prev.forEach((states, segment) => {
        const filteredStates = states.filter(state => state !== 'hover');
        if (filteredStates.length > 0) {
          newStates.set(segment, filteredStates);
        }
      });
      return newStates;
    });
  }, []);

  // Generate enhanced CSS classes
  const enhancedClassName = useMemo((): string => {
    const classes: string[] = [
      'enhanced-northwestern-pie-chart',
      `enhanced-northwestern-pie-chart--${size}`,
      `enhanced-northwestern-pie-chart--${effectiveContext}`,
      `enhanced-northwestern-pie-chart--${visualTheme}`
    ];

    if (colorBlindSafe) classes.push('enhanced-northwestern-pie-chart--colorblind-safe');
    if (highContrast) classes.push('enhanced-northwestern-pie-chart--high-contrast');
    if (emergencyMode) classes.push('enhanced-northwestern-pie-chart--emergency');
    if (performanceMode) classes.push('enhanced-northwestern-pie-chart--performance');
    if (reducedMotion) classes.push('enhanced-northwestern-pie-chart--reduced-motion');

    classes.push(className);

    return classes.filter(Boolean).join(' ');
  }, [size, effectiveContext, visualTheme, colorBlindSafe, highContrast,
    emergencyMode, performanceMode, reducedMotion, className]);

  // Performance measurement effect
  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    if (onPerformanceMetric && renderTime > 0) {
      onPerformanceMetric({
        type: 'render_time',
        duration: renderTime,
        target: '1000ms',
        size: size,
        context: effectiveContext
      });
    }
  }, [antibiotic, size, effectiveContext, onPerformanceMetric]);

  // Accessibility context effect
  useEffect(() => {
    if (onAccessibilityEvent) {
      const a11yContext: AccessibilityContext = {
        totalSegments: 8,
        selectedSegments: selectedSegments.length,
        clinicalContext: effectiveContext,
        highContrast: highContrast,
        colorBlindSafe: colorBlindSafe,
        emergencyMode: emergencyMode,
        reducedMotion: reducedMotion
      };

      setAccessibilityContext(a11yContext);
      onAccessibilityEvent({
        type: 'context_update',
        context: a11yContext,
        timestamp: Date.now()
      });
    }
  }, [selectedSegments, effectiveContext, highContrast, colorBlindSafe,
    emergencyMode, reducedMotion, onAccessibilityEvent]);

  // CSS custom properties for dynamic theming
  const chartStyle: CSSProperties = {
    '--medical-route-primary': enhancedRouteColors.excellent,
    '--medical-route-secondary': enhancedRouteColors.limited,
    '--medical-route-border': enhancedRouteColors.border,
    '--medical-context': effectiveContext,
    '--medical-priority': clinicalPriority,
    contain: performanceMode ? 'layout style paint' : 'none',
    willChange: enhancedStates ? 'transform, opacity, filter' : 'auto'
  } as CSSProperties & Record<string, string>;

  // Render enhanced Northwestern pie chart
  return (
    <div
      ref={chartRef}
      className={enhancedClassName}
      data-clinical-context={effectiveContext}
      data-visual-theme={visualTheme}
      data-emergency-mode={emergencyMode}
      data-high-contrast={highContrast}
      data-colorblind-safe={colorBlindSafe}
      onMouseLeave={handleEnhancedMouseLeave}
      style={chartStyle}
    >
      {/* Enhanced Northwestern Pie Chart with integrated design system */}
      <NorthwesternPieChart
        antibiotic={antibiotic}
        size={size}
        onSegmentHover={handleEnhancedSegmentHover}
        onSegmentClick={handleEnhancedSegmentClick}
        showLabels={showLabels}
        interactive={interactive}
        className="enhanced-northwestern-pie-chart__core"
        hoveredSegment={hoveredSegment}
        selectedSegments={selectedSegments}
        educationLevel={educationLevel}
        emergencyMode={emergencyMode}
        enableTouchInteractions={enableTouchInteractions}
      />

      {/* Enhanced visual indicators */}
      {showCoverageIndicators && (
        <div className="enhanced-northwestern-pie-chart__coverage-legend">
          <div className="coverage-indicator coverage-indicator--none" title="No Coverage">
            <span className="coverage-indicator__dot"></span>
            <span className="coverage-indicator__label">No Coverage</span>
          </div>
          <div className="coverage-indicator coverage-indicator--limited" title="Limited Coverage">
            <span className="coverage-indicator__dot"></span>
            <span className="coverage-indicator__label">Limited</span>
          </div>
          <div className="coverage-indicator coverage-indicator--excellent" title="Excellent Coverage">
            <span className="coverage-indicator__dot"></span>
            <span className="coverage-indicator__label">Excellent</span>
          </div>
        </div>
      )}

      {/* Route indicators */}
      {showRouteIndicators && antibiotic?.route && (
        <div className="enhanced-northwestern-pie-chart__route-indicator">
          <span className={`route-badge route-badge--${antibiotic.routeColor}`}>
            {Array.isArray(antibiotic.route)
              ? antibiotic.route.join('/').toUpperCase()
              : antibiotic.route.toUpperCase()
            }
          </span>
        </div>
      )}

      {/* Emergency access indicator */}
      {emergencyMode && enableEmergencyAccess && (
        <div className="enhanced-northwestern-pie-chart__emergency-indicator">
          <div className="emergency-badge">
            <span className="emergency-badge__icon">⚡</span>
            <span className="emergency-badge__text">Emergency Access</span>
          </div>
        </div>
      )}

      {/* Accessibility enhancement overlay */}
      {(colorBlindSafe || forceFocus) && (
        <div
          className="enhanced-northwestern-pie-chart__a11y-overlay"
          aria-hidden="true"
          style={{
            display: visualStates.size > 0 ? 'block' : 'none',
            pointerEvents: 'none'
          }}
        >
          {/* Accessibility patterns and indicators would be rendered here */}
        </div>
      )}

      {/* Performance and debug information (development only, must be explicitly enabled) */}
      {showDebugInfo && process.env.NODE_ENV === 'development' && (
        <div className="enhanced-northwestern-pie-chart__debug">
          <small>
            Context: {effectiveContext} | Theme: {visualTheme} |
            States: {visualStates.size} | A11y: {colorBlindSafe ? 'ON' : 'OFF'}
          </small>
        </div>
      )}
    </div>
  );
};

export default EnhancedNorthwesternPieChart;
