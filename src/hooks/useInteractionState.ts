/**
 * useInteractionState Hook
 *
 * Custom hook for managing complex interaction states in Northwestern pie chart
 * components. Handles hover states, selections, learning progress tracking,
 * and clinical context generation.
 *
 * @hook
 */

import { useState, useCallback, useRef, useEffect } from 'react';

// Performance tracking for interaction responsiveness
const PERFORMANCE_THRESHOLD = 100; // 100ms maximum response time

/**
 * Type definitions for interaction state management
 */

interface TouchPosition {
  x: number;
  y: number;
  timestamp: number;
}

interface TouchInteractionState {
  isLongPress: boolean;
  handleTouchStart: (event: React.TouchEvent, onLongPress?: (e: React.TouchEvent) => void) => void;
  handleTouchMove: (event: React.TouchEvent) => void;
  handleTouchEnd: (event: React.TouchEvent, onTap?: (e: React.TouchEvent) => void) => void;
}

interface PerformanceMetrics {
  averageResponseTime: number;
  interactions: number;
  slowInteractions: number;
}

interface Insight {
  timestamp: number;
  segment: string;
  type: string;
  context: Record<string, any>;
  educationLevel: string;
  sessionTime: number;
}

interface LearningSession {
  startTime: number;
  segmentsExplored: Set<string>;
  interactions: number;
  insights: Insight[];
  completionStatus: 'in_progress' | 'halfway' | 'complete';
}

interface LearningProgressReturn {
  learningSession: LearningSession;
  recordInteraction: (segmentKey: string, interactionType: string, context: Record<string, any>) => void;
  getProgressSummary: () => {
    completionPercentage: number;
    timeSpent: number;
    interactionRate: number;
    status: string;
    insights: number;
  };
}

interface InteractionContext {
  segment: string;
  coverage: number;
  antibiotic?: {
    name?: string;
    class?: string;
    mechanism?: string;
  };
  educationLevel: string;
  emergencyMode: boolean;
  isSelected: boolean;
  isHovered: boolean;
}

interface TooltipData {
  segment: string;
  context: Record<string, any>;
  position: {
    x: number;
    y: number;
  };
}

interface InteractionOptions {
  enableLearningTracking?: boolean;
  enablePerformanceTracking?: boolean;
  enableTouchOptimization?: boolean;
  emergencyAccessMode?: boolean;
}

interface EventHandlers {
  onSegmentHover: (segmentKey: string, event: React.MouseEvent) => void;
  onSegmentClick: (segmentKey: string, event: React.MouseEvent) => void;
  onLongPress: (segmentKey: string, event: React.TouchEvent) => void;
  onMouseLeave: () => void;
  onComparisonToggle: () => void;
  onTouchStart: (segmentKey: string, event: React.TouchEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
  onTouchEnd: (segmentKey: string, event: React.TouchEvent) => void;
}

interface InteractionUtils {
  getSegmentContext: (segmentKey: string) => InteractionContext;
  isSelected: (segment: string) => boolean;
  isHovered: (segment: string) => boolean;
  getSelectedContexts: () => InteractionContext[];
  getProgressSummary: () => any;
  clearSelections: () => void;
  selectAll: () => void;
}

interface UseInteractionStateReturn {
  hoveredSegment: string | null;
  selectedSegments: Set<string>;
  tooltipData: TooltipData | null;
  comparisonMode: boolean;
  emergencyMode: boolean;
  learningSession: LearningSession;
  performanceMetrics: PerformanceMetrics;
  handlers: EventHandlers;
  utils: InteractionUtils;
  isLongPress: boolean;
}

interface Antibiotic {
  name?: string;
  class?: string;
  mechanism?: string;
  northwesternSpectrum?: Record<string, number>;
  [key: string]: any;
}

/**
 * Touch interaction utilities for mobile clinical workflows
 */
const useTouchInteraction = (): TouchInteractionState => {
  const touchStartRef = useRef<TouchPosition | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  const handleTouchStart = useCallback((event: React.TouchEvent, onLongPress?: (e: React.TouchEvent) => void) => {
    touchStartRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
      timestamp: Date.now()
    };

    setIsLongPress(false);

    // Set up long press detection (500ms for clinical use)
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
      if (onLongPress) {
        onLongPress(event);
      }
    }, 500);
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const deltaX = Math.abs(event.touches[0].clientX - touchStartRef.current.x);
    const deltaY = Math.abs(event.touches[0].clientY - touchStartRef.current.y);

    // Cancel long press if significant movement detected
    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  }, []);

  const handleTouchEnd = useCallback((event: React.TouchEvent, onTap?: (e: React.TouchEvent) => void) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Handle tap if not long press
    if (!isLongPress && onTap && touchStartRef.current) {
      const duration = Date.now() - touchStartRef.current.timestamp;
      if (duration < 500) {
        onTap(event);
      }
    }

    touchStartRef.current = null;
    setIsLongPress(false);
  }, [isLongPress]);

  return {
    isLongPress,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

/**
 * Performance monitoring for interaction responsiveness
 */
const usePerformanceTracking = (): { metrics: PerformanceMetrics; trackInteraction: (startTime: number, endTime: number) => void } => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    averageResponseTime: 0,
    interactions: 0,
    slowInteractions: 0
  });

  const trackInteraction = useCallback((startTime: number, endTime: number) => {
    const responseTime = endTime - startTime;

    setMetrics(prev => {
      const newInteractions = prev.interactions + 1;
      const newAverageResponseTime =
        (prev.averageResponseTime * prev.interactions + responseTime) / newInteractions;
      const newSlowInteractions = prev.slowInteractions +
        (responseTime > PERFORMANCE_THRESHOLD ? 1 : 0);

      return {
        averageResponseTime: newAverageResponseTime,
        interactions: newInteractions,
        slowInteractions: newSlowInteractions
      };
    });
  }, []);

  return { metrics, trackInteraction };
};

/**
 * Learning progress tracking for medical education
 */
const useLearningProgress = (educationLevel: string): LearningProgressReturn => {
  const [learningSession, setLearningSession] = useState<LearningSession>({
    startTime: Date.now(),
    segmentsExplored: new Set(),
    interactions: 0,
    insights: [],
    completionStatus: 'in_progress'
  });

  const recordInteraction = useCallback((segmentKey: string, interactionType: string, context: Record<string, any>) => {
    const timestamp = Date.now();

    setLearningSession(prev => {
      const newSegmentsExplored = new Set(prev.segmentsExplored);
      newSegmentsExplored.add(segmentKey);

      const newInsight: Insight = {
        timestamp,
        segment: segmentKey,
        type: interactionType,
        context: context,
        educationLevel,
        sessionTime: timestamp - prev.startTime
      };

      const newInsights = [...prev.insights, newInsight];

      // Determine completion status
      let completionStatus: 'in_progress' | 'halfway' | 'complete' = 'in_progress';
      if (newSegmentsExplored.size === 8) {
        completionStatus = 'complete';
      } else if (newSegmentsExplored.size >= 4) {
        completionStatus = 'halfway';
      }

      return {
        ...prev,
        segmentsExplored: newSegmentsExplored,
        interactions: prev.interactions + 1,
        insights: newInsights,
        completionStatus
      };
    });
  }, [educationLevel]);

  const getProgressSummary = useCallback(() => {
    return {
      completionPercentage: (learningSession.segmentsExplored.size / 8) * 100,
      timeSpent: Date.now() - learningSession.startTime,
      interactionRate: learningSession.interactions /
        Math.max(1, (Date.now() - learningSession.startTime) / 60000), // per minute
      status: learningSession.completionStatus,
      insights: learningSession.insights.length
    };
  }, [learningSession]);

  return {
    learningSession,
    recordInteraction,
    getProgressSummary
  };
};

/**
 * Main interaction state hook
 */
const useInteractionState = (
  antibiotic: Antibiotic | null,
  educationLevel: string = 'resident',
  options: InteractionOptions = {}
): UseInteractionStateReturn => {
  // Core interaction state
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [selectedSegments, setSelectedSegments] = useState<Set<string>>(new Set());
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Performance and learning tracking
  const { metrics, trackInteraction } = usePerformanceTracking();
  const { learningSession, recordInteraction, getProgressSummary } =
    useLearningProgress(educationLevel);
  const touchInteraction = useTouchInteraction();

  // Options with defaults
  const {
    enableLearningTracking = true,
    enablePerformanceTracking = true,
    enableTouchOptimization = true,
    emergencyAccessMode = false
  } = options;

  // Handle segment hover with performance tracking
  const handleSegmentHover = useCallback((segmentKey: string, event: React.MouseEvent) => {
    const startTime = Date.now();

    // Generate clinical context
    const coverage = antibiotic?.northwesternSpectrum?.[segmentKey] || 0;
    const context = {
      segment: segmentKey,
      coverage,
      antibiotic: antibiotic?.name,
      emergencyAccess: emergencyMode
    };

    // Create tooltip data
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const tooltipInfo: TooltipData = {
      segment: segmentKey,
      context,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      }
    };

    // Update state
    setHoveredSegment(segmentKey);
    setTooltipData(tooltipInfo);

    // Track performance
    if (enablePerformanceTracking) {
      const endTime = Date.now();
      trackInteraction(startTime, endTime);
    }

    // Record learning interaction
    if (enableLearningTracking) {
      recordInteraction(segmentKey, 'hover', context);
    }
  }, [antibiotic, emergencyMode, enablePerformanceTracking, enableLearningTracking,
    trackInteraction, recordInteraction]);

  // Handle segment click/selection
  const handleSegmentClick = useCallback((segmentKey: string, event: React.MouseEvent) => {
    const startTime = Date.now();

    const newSelected = new Set(selectedSegments);
    const isSelecting = !newSelected.has(segmentKey);

    if (isSelecting) {
      newSelected.add(segmentKey);
    } else {
      newSelected.delete(segmentKey);
    }

    setSelectedSegments(newSelected);

    // Generate interaction context
    const coverage = antibiotic?.northwesternSpectrum?.[segmentKey] || 0;
    const context = {
      segment: segmentKey,
      coverage,
      antibiotic: antibiotic?.name,
      action: isSelecting ? 'select' : 'deselect',
      totalSelected: newSelected.size
    };

    // Track performance
    if (enablePerformanceTracking) {
      const endTime = Date.now();
      trackInteraction(startTime, endTime);
    }

    // Record learning interaction
    if (enableLearningTracking) {
      recordInteraction(segmentKey, 'click', context);
    }
  }, [selectedSegments, antibiotic, enablePerformanceTracking, enableLearningTracking,
    trackInteraction, recordInteraction]);

  // Handle long press for detailed information (mobile)
  const handleLongPress = useCallback((segmentKey: string, event: React.TouchEvent) => {
    if (!enableTouchOptimization) return;

    setEmergencyMode(true);

    // Generate emergency clinical context
    const coverage = antibiotic?.northwesternSpectrum?.[segmentKey] || 0;
    const context = {
      segment: segmentKey,
      coverage,
      antibiotic: antibiotic?.name,
      emergencyAccess: true,
      timestamp: Date.now()
    };

    // Record emergency access
    if (enableLearningTracking) {
      recordInteraction(segmentKey, 'emergency_access', context);
    }

    // Auto-hide emergency mode after 5 seconds
    setTimeout(() => {
      setEmergencyMode(false);
    }, 5000);
  }, [antibiotic, enableTouchOptimization, enableLearningTracking, recordInteraction]);

  // Clear hover state
  const handleMouseLeave = useCallback(() => {
    setHoveredSegment(null);
    setTooltipData(null);
  }, []);

  // Toggle comparison mode
  const toggleComparisonMode = useCallback(() => {
    const newComparisonMode = !comparisonMode;
    setComparisonMode(newComparisonMode);

    if (!newComparisonMode) {
      setSelectedSegments(new Set());
    }

    // Record mode change
    if (enableLearningTracking) {
      recordInteraction('system', 'comparison_mode_toggle', {
        enabled: newComparisonMode,
        selectedSegments: selectedSegments.size
      });
    }
  }, [comparisonMode, selectedSegments.size, enableLearningTracking, recordInteraction]);

  // Get clinical context for a segment
  const getSegmentContext = useCallback((segmentKey: string): InteractionContext => {
    const coverage = antibiotic?.northwesternSpectrum?.[segmentKey] || 0;

    return {
      segment: segmentKey,
      coverage,
      antibiotic: {
        name: antibiotic?.name,
        class: antibiotic?.class,
        mechanism: antibiotic?.mechanism
      },
      educationLevel,
      emergencyMode,
      isSelected: selectedSegments.has(segmentKey),
      isHovered: hoveredSegment === segmentKey
    };
  }, [antibiotic, educationLevel, emergencyMode, selectedSegments, hoveredSegment]);

  // Utility functions
  const utils: InteractionUtils = {
    getSegmentContext,
    isSelected: (segment) => selectedSegments.has(segment),
    isHovered: (segment) => hoveredSegment === segment,
    getSelectedContexts: () => Array.from(selectedSegments).map(getSegmentContext),
    getProgressSummary,
    clearSelections: () => setSelectedSegments(new Set()),
    selectAll: () => setSelectedSegments(new Set([
      'MRSA', 'VRE_faecium', 'anaerobes', 'atypicals',
      'pseudomonas', 'gramNegative', 'MSSA', 'enterococcus_faecalis'
    ]))
  };

  // Event handlers
  const handlers: EventHandlers = {
    onSegmentHover: handleSegmentHover,
    onSegmentClick: handleSegmentClick,
    onLongPress: handleLongPress,
    onMouseLeave: handleMouseLeave,
    onComparisonToggle: toggleComparisonMode,
    // Touch handlers
    onTouchStart: (segmentKey, event) =>
      touchInteraction.handleTouchStart(event, (e) => handleLongPress(segmentKey, e)),
    onTouchMove: touchInteraction.handleTouchMove,
    onTouchEnd: (segmentKey, event) =>
      touchInteraction.handleTouchEnd(event, (e) => handleSegmentClick(segmentKey, e))
  };

  return {
    // State
    hoveredSegment,
    selectedSegments,
    tooltipData,
    comparisonMode,
    emergencyMode,

    // Learning and performance data
    learningSession,
    performanceMetrics: metrics,

    // Handlers
    handlers,

    // Utilities
    utils,

    // Touch interaction state
    isLongPress: touchInteraction.isLongPress
  };
};

export default useInteractionState;

// Export related hooks for individual use
export { useTouchInteraction, usePerformanceTracking, useLearningProgress };
