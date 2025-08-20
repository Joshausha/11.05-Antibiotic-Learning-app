/**
 * Animated Northwestern Pie Chart Component
 * 
 * Enhanced Northwestern pie chart with sophisticated animation system.
 * Integrates Agent 2.4's animation framework with Agents 2.1-2.3 foundations.
 * 
 * Created by: Agent 2.4 - Animation & Transition Expert
 * Foundation: Builds on NorthwesternPieChart (Agent 2.1)
 * Interactions: Integrates with NorthwesternInteractionSystem (Agent 2.2)
 * Visual Design: Uses NorthwesternVisualStates (Agent 2.3)
 * Performance Target: 60fps animations, <100ms emergency access
 * 
 * Features:
 * - Clinical animation lifecycle management
 * - Emergency mode instant transitions
 * - Educational learning animations
 * - Performance-optimized GPU acceleration
 * - Reduced motion accessibility support
 * 
 * @component
 * @example
 * <AnimatedNorthwesternPieChart 
 *   antibiotic={enhancedAntibioticData[0]}
 *   size="medium"
 *   educationLevel="resident"
 *   emergencyMode={false}
 *   onAnimationComplete={(phase) => console.log('Animation complete:', phase)}
 * />
 */

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import NorthwesternPieChart from './NorthwesternPieChart.js';
import { 
  ClinicalAnimationManager,
  GPUAccelerationOptimizer,
  createLoadingAnimation,
  createCoverageRevealAnimation,
  createHoverAnimation,
  createSelectionAnimation,
  createLearningProgressAnimation,
  CLINICAL_TIMING,
  MEDICAL_EASING
} from '../animations/NorthwesternAnimations.js';

/**
 * Animation Phase Management
 * Defines the lifecycle phases for pie chart animations
 */
const ANIMATION_PHASES = {
  INITIALIZING: 'initializing',
  LOADING: 'loading',
  REVEALING: 'revealing',
  INTERACTIVE: 'interactive',
  EMERGENCY: 'emergency',
  COMPLETE: 'complete'
};

/**
 * Animated Northwestern Pie Chart Component
 */
const AnimatedNorthwesternPieChart = ({
  // Base pie chart props
  antibiotic,
  size = 'medium',
  onSegmentHover,
  onSegmentClick,
  showLabels = false,
  interactive = true,
  className = '',
  
  // Animation-specific props
  educationLevel = 'resident',
  emergencyMode = false,
  animateOnMount = true,
  animationSequence = 'educational', // 'clinical', 'educational', 'emergency'
  enableGPUAcceleration = true,
  onAnimationStart,
  onAnimationComplete,
  onAnimationPhaseChange,
  reducedMotion = null,
  
  // Advanced animation options
  customAnimationTiming,
  learningProgressVisible = false,
  spacedRepetitionCues = false,
  performanceMode = 'standard',
  
  // Pass-through props for base component
  ...baseProps
}) => {
  
  // Refs for animation management
  const containerRef = useRef(null);
  const segmentRefs = useRef(new Map());
  const animationManagerRef = useRef(null);
  const gpuOptimizerRef = useRef(null);
  
  // Animation state
  const [currentPhase, setCurrentPhase] = React.useState(
    animateOnMount ? ANIMATION_PHASES.INITIALIZING : ANIMATION_PHASES.INTERACTIVE
  );
  const [animationsEnabled, setAnimationsEnabled] = React.useState(true);
  const [learningProgress, setLearningProgress] = React.useState(0);
  
  // Initialize animation managers
  useEffect(() => {
    if (!animationManagerRef.current) {
      animationManagerRef.current = new ClinicalAnimationManager();
    }
    
    if (!gpuOptimizerRef.current && enableGPUAcceleration) {
      gpuOptimizerRef.current = new GPUAccelerationOptimizer();
    }
    
    // Configure animation manager
    const manager = animationManagerRef.current;
    manager.setEmergencyMode(emergencyMode);
    manager.performanceMode = performanceMode;
    
    if (reducedMotion !== null) {
      manager.reducedMotion = reducedMotion;
    }
    
    // Check for reduced motion preference
    const prefersReducedMotion = reducedMotion ?? manager.detectReducedMotion();
    setAnimationsEnabled(!prefersReducedMotion && !emergencyMode);
    
    return () => {
      manager.cleanup();
    };
  }, [emergencyMode, reducedMotion, performanceMode, enableGPUAcceleration]);
  
  // Handle emergency mode changes
  useEffect(() => {
    if (animationManagerRef.current) {
      animationManagerRef.current.setEmergencyMode(emergencyMode);
    }
    
    if (emergencyMode) {
      setCurrentPhase(ANIMATION_PHASES.EMERGENCY);
      setAnimationsEnabled(false);
    } else {
      setAnimationsEnabled(true);
      if (currentPhase === ANIMATION_PHASES.EMERGENCY) {
        setCurrentPhase(ANIMATION_PHASES.INTERACTIVE);
      }
    }
  }, [emergencyMode, currentPhase]);
  
  // Animation timing configuration
  const animationTiming = useMemo(() => {
    if (customAnimationTiming) return customAnimationTiming;
    
    const sequences = {
      clinical: {
        loading: CLINICAL_TIMING.clinical.duration,
        revealing: CLINICAL_TIMING.clinical.duration,
        stagger: 30
      },
      educational: {
        loading: CLINICAL_TIMING.educational.duration,
        revealing: CLINICAL_TIMING.educational.duration,
        stagger: 100
      },
      emergency: {
        loading: 0,
        revealing: 0,
        stagger: 0
      }
    };
    
    return sequences[animationSequence] || sequences.educational;
  }, [customAnimationTiming, animationSequence]);
  
  // Collect segment references
  const collectSegmentRef = useCallback((segmentElement, segmentKey) => {
    if (segmentElement) {
      segmentRefs.current.set(segmentKey, segmentElement);
    }
  }, []);
  
  // Execute loading animation sequence
  const executeLoadingSequence = useCallback(async () => {
    if (!animationsEnabled || currentPhase !== ANIMATION_PHASES.LOADING) return;
    
    onAnimationStart?.('loading');
    
    const segments = Array.from(segmentRefs.current.values());
    const animations = createLoadingAnimation(segments, {
      duration: animationTiming.loading,
      staggerDelay: animationTiming.stagger,
      emergencyMode
    });
    
    // GPU acceleration for complex animations
    if (gpuOptimizerRef.current && animations.length > 4) {
      segments.forEach(segment => {
        gpuOptimizerRef.current.promoteToGPU(segment);
      });
    }
    
    // Execute animations
    const animationPromises = animations.map(({ element, config }) =>
      animationManagerRef.current.animate(element, config)
    );
    
    await Promise.all(animationPromises);
    
    // Cleanup GPU acceleration
    if (gpuOptimizerRef.current) {
      segments.forEach(segment => {
        setTimeout(() => {
          gpuOptimizerRef.current.demoteFromGPU(segment);
        }, 100);
      });
    }
    
    setCurrentPhase(ANIMATION_PHASES.REVEALING);
    onAnimationComplete?.('loading');
  }, [animationsEnabled, currentPhase, animationTiming, emergencyMode, onAnimationStart, onAnimationComplete]);
  
  // Execute coverage reveal sequence
  const executeCoverageRevealSequence = useCallback(async () => {
    if (!animationsEnabled || currentPhase !== ANIMATION_PHASES.REVEALING || !antibiotic?.northwesternSpectrum) return;
    
    onAnimationStart?.('revealing');
    
    const revealPromises = [];
    
    // Reveal each segment based on its coverage level
    Object.entries(antibiotic.northwesternSpectrum).forEach(([segmentKey, coverage]) => {
      const segmentElement = segmentRefs.current.get(segmentKey);
      if (!segmentElement) return;
      
      const animation = createCoverageRevealAnimation(segmentElement, coverage, {
        educationLevel,
        emergencyMode
      });
      
      revealPromises.push(
        animationManagerRef.current.animate(animation.element, animation.config)
      );
    });
    
    await Promise.all(revealPromises);
    
    setCurrentPhase(ANIMATION_PHASES.INTERACTIVE);
    onAnimationComplete?.('revealing');
  }, [animationsEnabled, currentPhase, antibiotic, educationLevel, emergencyMode, onAnimationStart, onAnimationComplete]);
  
  // Handle segment hover with animation
  const handleAnimatedSegmentHover = useCallback(async (segmentKey, event, context) => {
    if (!animationsEnabled) {
      onSegmentHover?.(segmentKey, event, context);
      return;
    }
    
    const segmentElement = segmentRefs.current.get(segmentKey);
    if (!segmentElement) {
      onSegmentHover?.(segmentKey, event, context);
      return;
    }
    
    // Create hover animation
    const animation = createHoverAnimation(segmentElement, true, {
      emergencyMode,
      coverage: context?.coverage || 1
    });
    
    // Execute animation
    await animationManagerRef.current.animate(animation.element, animation.config);
    
    // Update learning progress for educational levels
    if (educationLevel !== 'attending' && context) {
      setLearningProgress(prev => Math.min(prev + 1, 8));
    }
    
    onSegmentHover?.(segmentKey, event, context);
  }, [animationsEnabled, emergencyMode, educationLevel, onSegmentHover]);
  
  // Handle segment click with animation
  const handleAnimatedSegmentClick = useCallback(async (segmentKey, event, context) => {
    if (!animationsEnabled) {
      onSegmentClick?.(segmentKey, event, context);
      return;
    }
    
    const segmentElement = segmentRefs.current.get(segmentKey);
    if (!segmentElement) {
      onSegmentClick?.(segmentKey, event, context);
      return;
    }
    
    // Create selection animation
    const animation = createSelectionAnimation(segmentElement, !context?.isSelected, {
      emergencyMode,
      selectionIndex: context?.selectionIndex || 0
    });
    
    // Execute animation
    await animationManagerRef.current.animate(animation.element, animation.config);
    
    onSegmentClick?.(segmentKey, event, context);
  }, [animationsEnabled, emergencyMode, onSegmentClick]);
  
  // Animation lifecycle management
  useEffect(() => {
    const executeAnimationSequence = async () => {
      if (!animateOnMount || !animationsEnabled) {
        setCurrentPhase(ANIMATION_PHASES.INTERACTIVE);
        return;
      }
      
      try {
        // Phase 1: Loading
        setCurrentPhase(ANIMATION_PHASES.LOADING);
        onAnimationPhaseChange?.(ANIMATION_PHASES.LOADING);
        await executeLoadingSequence();
        
        // Phase 2: Coverage reveal
        setCurrentPhase(ANIMATION_PHASES.REVEALING);
        onAnimationPhaseChange?.(ANIMATION_PHASES.REVEALING);
        await executeCoverageRevealSequence();
        
        // Phase 3: Interactive state
        setCurrentPhase(ANIMATION_PHASES.INTERACTIVE);
        onAnimationPhaseChange?.(ANIMATION_PHASES.INTERACTIVE);
        
        setCurrentPhase(ANIMATION_PHASES.COMPLETE);
        onAnimationComplete?.('sequence');
        
      } catch (error) {
        console.error('Animation sequence error:', error);
        setCurrentPhase(ANIMATION_PHASES.INTERACTIVE);
      }
    };
    
    // Small delay to ensure DOM elements are ready
    const timer = setTimeout(executeAnimationSequence, 50);
    return () => clearTimeout(timer);
  }, [animateOnMount, animationsEnabled, executeLoadingSequence, executeCoverageRevealSequence, onAnimationPhaseChange, onAnimationComplete]);
  
  // Learning progress animation
  useEffect(() => {
    if (!learningProgressVisible || !animationsEnabled) return;
    
    const progressElement = containerRef.current?.querySelector('.learning-progress-bar');
    if (!progressElement) return;
    
    const animation = createLearningProgressAnimation(progressElement, (learningProgress / 8) * 100);
    animationManagerRef.current.animate(animation.element, animation.config);
  }, [learningProgress, learningProgressVisible, animationsEnabled]);
  
  // Enhanced className with animation state
  const enhancedClassName = useMemo(() => {
    const classes = [
      className,
      'animated-northwestern-pie-chart',
      `animation-phase--${currentPhase}`,
      animationsEnabled ? 'animations-enabled' : 'animations-disabled',
      emergencyMode ? 'emergency-mode' : '',
      `education-level--${educationLevel}`,
      `performance-mode--${performanceMode}`
    ];
    
    return classes.filter(Boolean).join(' ');
  }, [className, currentPhase, animationsEnabled, emergencyMode, educationLevel, performanceMode]);
  
  return (
    <div 
      ref={containerRef}
      className={enhancedClassName}
      data-animation-phase={currentPhase}
      data-testid="animated-northwestern-pie-chart"
      style={{
        // Animation-optimized styles
        willChange: animationsEnabled ? 'transform, opacity' : 'auto',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        position: 'relative'
      }}
    >
      {/* Enhanced Northwestern Pie Chart with animation handlers */}
      <NorthwesternPieChart
        antibiotic={antibiotic}
        size={size}
        onSegmentHover={handleAnimatedSegmentHover}
        onSegmentClick={handleAnimatedSegmentClick}
        showLabels={showLabels}
        interactive={interactive && currentPhase === ANIMATION_PHASES.INTERACTIVE}
        educationLevel={educationLevel}
        emergencyMode={emergencyMode}
        {...baseProps}
        className="northwestern-pie-chart--animated"
      />
      
      {/* Learning Progress Indicator */}
      {learningProgressVisible && educationLevel !== 'attending' && (
        <div className="learning-progress-container absolute -bottom-8 left-0 right-0">
          <div className="learning-progress-bar w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="learning-progress-fill h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(learningProgress / 8) * 100}%` }}
            />
          </div>
          <div className="learning-progress-text text-xs text-center mt-1 text-gray-600">
            Learning Progress: {learningProgress}/8 segments explored
          </div>
        </div>
      )}
      
      {/* Animation Phase Indicator (Development/Debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="animation-debug absolute top-0 right-0 p-1 bg-black bg-opacity-75 text-white text-xs rounded">
          Phase: {currentPhase}
          {emergencyMode && <span className="text-red-400 ml-2">EMERGENCY</span>}
        </div>
      )}
      
      {/* Animation Performance Styles */}
      <style jsx>{`
        .animated-northwestern-pie-chart {
          contain: layout style paint;
        }
        
        .animation-phase--loading {
          pointer-events: none;
        }
        
        .animation-phase--revealing {
          pointer-events: none;
        }
        
        .emergency-mode .animated-northwestern-pie-chart {
          animation: none !important;
          transition: none !important;
        }
        
        .animations-disabled * {
          animation: none !important;
          transition: none !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animated-northwestern-pie-chart * {
            animation: none !important;
            transition: none !important;
          }
        }
        
        /* Performance optimizations */
        .performance-mode--performance .animated-northwestern-pie-chart {
          animation-duration: 0.7s !important;
        }
        
        .performance-mode--battery .animated-northwestern-pie-chart {
          animation-duration: 0.5s !important;
        }
      `}</style>
    </div>
  );
};

// PropTypes validation
AnimatedNorthwesternPieChart.propTypes = {
  // Base component props
  antibiotic: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onSegmentHover: PropTypes.func,
  onSegmentClick: PropTypes.func,
  showLabels: PropTypes.bool,
  interactive: PropTypes.bool,
  className: PropTypes.string,
  
  // Animation props
  educationLevel: PropTypes.oneOf(['student', 'resident', 'attending']),
  emergencyMode: PropTypes.bool,
  animateOnMount: PropTypes.bool,
  animationSequence: PropTypes.oneOf(['clinical', 'educational', 'emergency']),
  enableGPUAcceleration: PropTypes.bool,
  onAnimationStart: PropTypes.func,
  onAnimationComplete: PropTypes.func,
  onAnimationPhaseChange: PropTypes.func,
  reducedMotion: PropTypes.bool,
  
  // Advanced animation options
  customAnimationTiming: PropTypes.shape({
    loading: PropTypes.number,
    revealing: PropTypes.number,
    stagger: PropTypes.number
  }),
  learningProgressVisible: PropTypes.bool,
  spacedRepetitionCues: PropTypes.bool,
  performanceMode: PropTypes.oneOf(['standard', 'performance', 'battery'])
};

export default AnimatedNorthwesternPieChart;

// Export animation phases for external use
export { ANIMATION_PHASES };