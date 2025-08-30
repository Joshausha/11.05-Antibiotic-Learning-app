/**
 * Northwestern Clinical Animation Framework
 * 
 * Performance-optimized, medically-appropriate animation system for Northwestern pie charts.
 * Provides sophisticated animations while maintaining clinical urgency requirements.
 * 
 * Created by: Agent 2.4 - Animation & Transition Expert
 * Integration: Builds on Agents 2.1, 2.2, and 2.3 for comprehensive animation system
 * Performance Target: 60fps animations, <100ms emergency access
 * 
 * Features:
 * - Medical-grade animation timing (respects clinical urgency)
 * - Emergency mode instant transitions (<100ms for critical information)
 * - Smooth educational reveal animations for learning sequences
 * - Clinical workflow transition optimization
 * - GPU-accelerated performance for clinical devices
 * - Reduced motion support for clinical accessibility
 * 
 * @version 1.0.0
 * @date 2025-08-18
 */

import { generateStateCSS } from '../styles/NorthwesternVisualStates.js';

// =============================================================================
// CLINICAL ANIMATION CONFIGURATION
// Medical-appropriate timing and easing functions
// =============================================================================

/**
 * Clinical Animation Timing Configuration
 * Optimized for medical environment requirements
 */
export const CLINICAL_TIMING = {
  // Emergency access - no delays for critical information
  emergency: {
    duration: 0,              // Instant for patient safety
    easing: 'linear',         // No easing delays
    priority: 'critical'      // Highest priority
  },
  
  // Standard clinical interactions
  clinical: {
    duration: 150,            // Fast clinical response
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material design easing
    priority: 'high'          // High priority
  },
  
  // Educational animations
  educational: {
    duration: 300,            // Smooth learning feedback
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth easing
    priority: 'medium'        // Medium priority
  },
  
  // Background/ambient animations
  ambient: {
    duration: 600,            // Slow ambient animations
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth easing
    priority: 'low'           // Low priority
  }
};

/**
 * Medical-Grade Easing Functions
 * Professionally appropriate animation curves
 */
export const MEDICAL_EASING = {
  // Clinical decision support - immediate feedback
  clinical: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Educational content - engaging but professional
  educational: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  
  // Emergency alerts - immediate attention
  emergency: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  // Data visualization - smooth and trustworthy
  dataVisualization: 'cubic-bezier(0.4, 0, 0.6, 1)',
  
  // Accessibility - gentle and predictable
  accessibility: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
};

// =============================================================================
// CLINICAL ANIMATION MANAGER
// Manages animation priority and emergency overrides
// =============================================================================

export class ClinicalAnimationManager {
  constructor() {
    this.activeAnimations = new Map();
    this.animationQueue = [];
    this.emergencyMode = false;
    this.reducedMotion = this.detectReducedMotion();
    this.performanceMode = 'standard'; // 'standard', 'performance', 'battery'
    
    // Mobile and clinical device detection
    this.deviceInfo = this.detectDeviceCapabilities();
    this.isMobile = this.deviceInfo.isMobile;
    this.isLowPowerDevice = this.deviceInfo.isLowPower;
    this.screenSize = this.deviceInfo.screenSize;
    
    // Performance monitoring
    this.frameTime = 0;
    this.lastFrameTime = performance.now();
    this.animationFrameId = null;
    
    // Emergency override system
    this.emergencyOverrides = new Set();
    
    this.initializePerformanceMonitoring();
  }
  
  /**
   * Detect user's reduced motion preference
   * Critical for clinical accessibility
   */
  detectReducedMotion() {
    if (typeof window === 'undefined') return false;
    if (!window.matchMedia) return false;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery ? mediaQuery.matches : false;
  }
  
  /**
   * Detect device capabilities for mobile optimization
   * Critical for clinical bedside workflow optimization
   */
  detectDeviceCapabilities() {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isLowPower: false,
        screenSize: 'desktop',
        hasTouch: false,
        deviceMemory: 8,
        hardwareConcurrency: 4
      };
    }
    
    const userAgent = navigator.userAgent || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Screen size detection for clinical workflow optimization
    const screenWidth = window.innerWidth;
    let screenSize = 'desktop';
    if (screenWidth < 768) screenSize = 'mobile';
    else if (screenWidth < 1024) screenSize = 'tablet';
    
    // Performance indicators for low-power device detection
    const deviceMemory = navigator.deviceMemory || 4; // GB, default 4GB if not available
    const hardwareConcurrency = navigator.hardwareConcurrency || 4; // CPU cores
    const isLowPower = deviceMemory < 4 || hardwareConcurrency < 4;
    
    return {
      isMobile,
      isLowPower,
      screenSize,
      hasTouch,
      deviceMemory,
      hardwareConcurrency,
      // Clinical-specific indicators
      isClinicalBedside: isMobile && screenSize === 'mobile',
      isTabletWorkstation: !isMobile && screenSize === 'tablet'
    };
  }
  
  /**
   * Initialize performance monitoring for clinical environments
   */
  initializePerformanceMonitoring() {
    if (typeof window === 'undefined') return;
    
    // Monitor frame rate
    const monitorFrameRate = () => {
      const currentTime = performance.now();
      this.frameTime = currentTime - this.lastFrameTime;
      this.lastFrameTime = currentTime;
      
      // Adjust performance mode based on frame rate and device capabilities
      this.adaptPerformanceModeForDevice();
      
      this.animationFrameId = requestAnimationFrame(monitorFrameRate);
    };
    
    monitorFrameRate();
  }
  
  /**
   * Mobile and clinical device-aware performance mode adaptation
   * Enhanced for clinical workflow optimization
   */
  adaptPerformanceModeForDevice() {
    // Base performance mode on frame rate with mobile-specific thresholds
    let baseMode = 'standard';
    
    // Mobile devices get more aggressive optimization thresholds
    const mobileFrameThresholds = this.isMobile ? 
      { performance: 28, battery: 18 } : // 35fps and 55fps for mobile
      { performance: 32, battery: 20 };  // 30fps and 50fps for desktop
    
    if (this.frameTime > mobileFrameThresholds.performance) {
      baseMode = 'performance';
    } else if (this.frameTime > mobileFrameThresholds.battery) {
      baseMode = 'battery';
    }
    
    // Apply mobile-specific optimizations
    if (this.isMobile || this.isLowPowerDevice) {
      // More aggressive performance mode for mobile devices
      if (baseMode === 'standard' && this.isLowPowerDevice) {
        baseMode = 'battery';
      }
      
      // Clinical bedside optimization - prioritize battery life and responsiveness
      if (this.deviceInfo.isClinicalBedside) {
        baseMode = 'battery';
        
        // Ultra-aggressive optimization for clinical bedside workflows
        if (this.frameTime > 25) { // < 40fps triggers ultra mode
          this.performanceMode = 'ultra-battery';
          return;
        }
      }
      
      // Tablet workstation optimization
      if (this.deviceInfo.isTabletWorkstation) {
        // Balance performance and battery for longer clinical sessions
        if (baseMode === 'standard' && this.frameTime > 22) { // < 45fps
          baseMode = 'battery';
        }
      }
    }
    
    // Network-aware optimizations for clinical environments
    if (navigator.connection && navigator.connection.effectiveType) {
      const connectionType = navigator.connection.effectiveType;
      if (connectionType === 'slow-2g' || connectionType === '2g') {
        baseMode = 'battery'; // Ultra-conservative for poor connections
      } else if (connectionType === '3g' && this.isMobile) {
        // Moderate optimization for 3G mobile connections
        if (baseMode === 'standard') baseMode = 'battery';
      }
    }
    
    // Memory pressure detection for extended clinical sessions
    if ('memory' in performance && performance.memory) {
      const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
      if (memoryUsage > 0.8) { // > 80% memory usage
        baseMode = 'battery'; // Reduce animation complexity to free memory
      }
    }
    
    this.performanceMode = baseMode;
  }
  
  /**
   * Set emergency mode - bypasses all animation delays
   */
  setEmergencyMode(enabled) {
    this.emergencyMode = enabled;
    
    if (enabled) {
      // Cancel all non-emergency animations
      this.activeAnimations.forEach((animation, element) => {
        if (animation.priority !== 'critical') {
          this.cancelAnimation(element);
        }
      });
    }
  }
  
  /**
   * Execute animation with clinical priority handling
   */
  async animate(element, config) {
    if (!element || this.reducedMotion) {
      // Apply final state immediately if reduced motion
      this.applyFinalState(element, config);
      return Promise.resolve();
    }
    
    // Emergency mode - apply immediately
    if (this.emergencyMode && config.priority !== 'critical') {
      this.applyFinalState(element, config);
      return Promise.resolve();
    }
    
    // Performance and mobile adaptation
    let adaptedConfig = this.adaptConfigForPerformance(config);
    adaptedConfig = this.optimizeForSmallScreen(element, adaptedConfig);
    adaptedConfig = this.optimizeForClinicalAccessibility(element, adaptedConfig);
    
    // Apply mobile touch optimizations
    this.optimizeForTouchInteraction(element);
    
    return new Promise((resolve) => {
      // Cancel existing animation on this element
      if (this.activeAnimations.has(element)) {
        this.cancelAnimation(element);
      }
      
      // Apply animation
      const animation = element.animate(
        adaptedConfig.keyframes,
        {
          duration: adaptedConfig.duration,
          easing: adaptedConfig.easing,
          fill: 'forwards'
        }
      );
      
      // Track animation
      this.activeAnimations.set(element, {
        animation,
        priority: config.priority,
        config: adaptedConfig
      });
      
      // Handle completion
      animation.onfinish = () => {
        this.activeAnimations.delete(element);
        resolve();
      };
      
      animation.oncancel = () => {
        this.activeAnimations.delete(element);
        resolve();
      };
    });
  }
  
  /**
   * Adapt animation configuration based on performance conditions
   */
  adaptConfigForPerformance(config) {
    const adapted = { ...config };
    
    // Apply performance mode optimizations
    switch (this.performanceMode) {
      case 'performance':
        adapted.duration *= 0.7; // Faster animations
        adapted.keyframes = this.simplifyKeyframes(config.keyframes);
        break;
      case 'battery':
        adapted.duration *= 0.5; // Much faster animations
        adapted.keyframes = this.simplifyKeyframes(config.keyframes);
        break;
    }
    
    // Apply mobile-specific optimizations
    if (this.isMobile) {
      // Mobile devices benefit from shorter, snappier animations
      adapted.duration *= 0.8;
      
      // Clinical bedside optimization - ultra-fast for critical workflows
      if (this.deviceInfo.isClinicalBedside) {
        adapted.duration *= 0.6; // Aggressive optimization for bedside use
        
        // For emergency situations, make animations near-instant on mobile
        if (config.priority === 'critical' || this.emergencyMode) {
          adapted.duration = Math.min(adapted.duration, 50); // Max 50ms for critical
        }
      }
      
      // Touch interaction optimization
      if (this.deviceInfo.hasTouch) {
        adapted.easing = MEDICAL_EASING.clinical; // Snappy clinical easing for touch
      }
    }
    
    // Low-power device optimizations
    if (this.isLowPowerDevice) {
      adapted.duration *= 0.7;
      adapted.keyframes = this.simplifyKeyframes(adapted.keyframes);
      
      // Reduce motion complexity for older devices
      if (adapted.keyframes && adapted.keyframes.length > 3) {
        adapted.keyframes = this.simplifyKeyframes(adapted.keyframes);
      }
    }
    
    // Accessibility - respect reduced motion preferences
    if (this.reducedMotion) {
      adapted.duration = Math.min(adapted.duration, 150); // Max 150ms
      adapted.keyframes = this.simplifyKeyframes(adapted.keyframes);
    }
    
    return adapted;
  }
  
  /**
   * Simplify keyframes for better performance
   */
  simplifyKeyframes(keyframes) {
    if (keyframes.length <= 2) return keyframes;
    
    // Keep only start and end frames for performance mode
    return [keyframes[0], keyframes[keyframes.length - 1]];
  }
  
  /**
   * Apply final animation state immediately
   */
  applyFinalState(element, config) {
    if (!element || !config.keyframes) return;
    
    const finalState = config.keyframes[config.keyframes.length - 1];
    Object.assign(element.style, finalState);
  }
  
  /**
   * Cancel animation on element
   */
  cancelAnimation(element) {
    const animationData = this.activeAnimations.get(element);
    if (animationData) {
      animationData.animation.cancel();
      this.activeAnimations.delete(element);
    }
  }
  
  /**
   * Mobile-specific touch interaction optimization
   * Provides immediate visual feedback for clinical workflows
   */
  optimizeForTouchInteraction(element) {
    if (!this.deviceInfo.hasTouch) return;
    
    // Add touch-friendly properties
    element.style.touchAction = 'manipulation'; // Prevents zoom delays
    element.style.userSelect = 'none'; // Prevents text selection on touch
    
    // Clinical bedside optimization - larger touch targets
    if (this.deviceInfo.isClinicalBedside) {
      const currentMinHeight = parseInt(getComputedStyle(element).minHeight) || 0;
      if (currentMinHeight < 44) { // Apple's 44px minimum touch target
        element.style.minHeight = '44px';
        element.style.minWidth = '44px';
      }
    }
  }
  
  /**
   * Small screen layout optimization for clinical displays
   */
  optimizeForSmallScreen(element, config) {
    if (this.deviceInfo.screenSize !== 'mobile') return config;
    
    const optimized = { ...config };
    
    // Reduce animation complexity for small screens
    if (optimized.keyframes && optimized.keyframes.length > 2) {
      // Keep critical keyframes only
      const start = optimized.keyframes[0];
      const end = optimized.keyframes[optimized.keyframes.length - 1];
      optimized.keyframes = [start, end];
    }
    
    // Scale down transform values for better mobile visibility
    if (optimized.keyframes) {
      optimized.keyframes = optimized.keyframes.map(keyframe => {
        const scaled = { ...keyframe };
        if (scaled.transform && scaled.transform.includes('scale')) {
          // Reduce scale transformations for mobile screens
          scaled.transform = scaled.transform.replace(/scale\(([^)]+)\)/g, (match, value) => {
            const scaleValue = parseFloat(value);
            return `scale(${Math.min(scaleValue, 1.2)})`; // Cap at 1.2x for mobile
          });
        }
        return scaled;
      });
    }
    
    return optimized;
  }
  
  /**
   * Clinical accessibility optimization for medical environments
   * Ensures animations meet healthcare accessibility standards
   */
  optimizeForClinicalAccessibility(element, config) {
    const optimized = { ...config };
    
    // High contrast mode detection (common in clinical environments)
    // Defensive check for test environments where matchMedia might not return .matches
    const contrastQuery = window.matchMedia && window.matchMedia('(prefers-contrast: high)');
    if (contrastQuery && contrastQuery.matches) {
      // Simplify animations for high contrast displays
      optimized.duration *= 0.8;
      if (optimized.keyframes) {
        optimized.keyframes = this.simplifyKeyframes(optimized.keyframes);
      }
    }
    
    // Clinical lighting adaptation (bright clinical environments)
    if (this.deviceInfo.screenSize === 'mobile' || this.deviceInfo.isClinicalBedside) {
      // Increase visual emphasis for clinical visibility
      if (optimized.keyframes) {
        optimized.keyframes = optimized.keyframes.map(keyframe => {
          const enhanced = { ...keyframe };
          
          // Enhance borders and shadows for clinical visibility
          if (enhanced.boxShadow) {
            enhanced.boxShadow = enhanced.boxShadow.replace(/rgba\(([^)]+)\)/g, (match, values) => {
              const [r, g, b, a] = values.split(',').map(v => parseFloat(v.trim()));
              return `rgba(${r}, ${g}, ${b}, ${Math.min(a + 0.1, 1)})`; // Increase opacity
            });
          }
          
          return enhanced;
        });
      }
    }
    
    // Focus management for clinical workflows
    if (element.matches('[role="button"], button, [tabindex]')) {
      // Ensure focus indicators are visible during animations
      element.style.outline = 'none'; // We'll handle focus ourselves
      element.addEventListener('focus', () => {
        element.style.boxShadow = '0 0 0 2px #0066cc, 0 0 0 4px rgba(0, 102, 204, 0.3)';
      });
      element.addEventListener('blur', () => {
        element.style.boxShadow = '';
      });
    }
    
    return optimized;
  }
  
  /**
   * Cleanup all animations
   */
  cleanup() {
    this.activeAnimations.forEach((animationData, element) => {
      animationData.animation.cancel();
    });
    this.activeAnimations.clear();
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// =============================================================================
// PIE CHART LIFECYCLE ANIMATIONS
// Loading, data reveal, and segment growth animations
// =============================================================================

/**
 * Pie Chart Loading Animation
 * Professional medical data loading sequence
 */
export const createLoadingAnimation = (segments, options = {}) => {
  const {
    duration = CLINICAL_TIMING.clinical.duration,
    staggerDelay = 50,
    emergencyMode = false
  } = options;
  
  if (emergencyMode) {
    // No loading animation in emergency mode
    return segments.map(segment => ({
      element: segment,
      config: {
        keyframes: [{ opacity: 1 }],
        duration: 0,
        priority: 'critical'
      }
    }));
  }
  
  return segments.map((segment, index) => ({
    element: segment,
    config: {
      keyframes: [
        { opacity: 0, transform: 'scale(0.8)' },
        { opacity: 0.5, transform: 'scale(0.95)' },
        { opacity: 1, transform: 'scale(1)' }
      ],
      duration: duration,
      easing: MEDICAL_EASING.dataVisualization,
      delay: index * staggerDelay,
      priority: 'medium'
    }
  }));
};

/**
 * Segment Coverage Reveal Animation
 * Educational progressive disclosure of coverage levels
 */
export const createCoverageRevealAnimation = (segment, coverage, options = {}) => {
  const {
    educationLevel = 'resident',
    emergencyMode = false
  } = options;
  
  if (emergencyMode) {
    return {
      element: segment,
      config: {
        keyframes: [{ opacity: 1 }],
        duration: 0,
        priority: 'critical'
      }
    };
  }
  
  // Educational timing based on level
  const educationTimings = {
    student: CLINICAL_TIMING.educational.duration * 1.5, // Slower for learning
    resident: CLINICAL_TIMING.educational.duration,
    attending: CLINICAL_TIMING.clinical.duration // Faster for experts
  };
  
  const duration = educationTimings[educationLevel] || educationTimings.resident;
  
  // Coverage-based animation intensity
  const coverageAnimations = {
    0: { // No coverage - subtle warning
      keyframes: [
        { opacity: 0.3, filter: 'grayscale(0.7)' },
        { opacity: 0.6, filter: 'grayscale(0.5)' },
        { opacity: 0.7, filter: 'grayscale(0.3)' }
      ],
      easing: MEDICAL_EASING.accessibility
    },
    1: { // Moderate coverage - cautious reveal
      keyframes: [
        { opacity: 0.5, transform: 'scale(0.95)' },
        { opacity: 0.8, transform: 'scale(1.02)' },
        { opacity: 1, transform: 'scale(1)' }
      ],
      easing: MEDICAL_EASING.educational
    },
    2: { // Good coverage - confident reveal
      keyframes: [
        { opacity: 0.3, transform: 'scale(0.9)', filter: 'brightness(0.8)' },
        { opacity: 0.7, transform: 'scale(1.05)', filter: 'brightness(1.1)' },
        { opacity: 1, transform: 'scale(1)', filter: 'brightness(1)' }
      ],
      easing: MEDICAL_EASING.educational
    }
  };
  
  const animation = coverageAnimations[coverage] || coverageAnimations[1];
  
  return {
    element: segment,
    config: {
      ...animation,
      duration,
      priority: 'medium'
    }
  };
};

/**
 * Hover State Transition Animation
 * Smooth transition to enhanced hover state
 */
export const createHoverAnimation = (segment, isHovering, options = {}) => {
  const {
    emergencyMode = false,
    coverage = 1
  } = options;
  
  // Emergency mode uses instant transitions
  if (emergencyMode) {
    return {
      element: segment,
      config: {
        keyframes: [
          isHovering 
            ? { transform: 'scale(1.02)', filter: 'brightness(1.2)' }
            : { transform: 'scale(1)', filter: 'brightness(1)' }
        ],
        duration: 0,
        priority: 'critical'
      }
    };
  }
  
  // Coverage-based hover intensity
  const hoverIntensity = {
    0: { scale: 1.01, brightness: 1.05 }, // Subtle for contraindicated
    1: { scale: 1.02, brightness: 1.1 },  // Moderate
    2: { scale: 1.03, brightness: 1.15 }  // Prominent for good coverage
  };
  
  const intensity = hoverIntensity[coverage] || hoverIntensity[1];
  
  return {
    element: segment,
    config: {
      keyframes: isHovering ? [
        { transform: 'scale(1)', filter: 'brightness(1)' },
        { transform: `scale(${intensity.scale})`, filter: `brightness(${intensity.brightness})` }
      ] : [
        { transform: `scale(${intensity.scale})`, filter: `brightness(${intensity.brightness})` },
        { transform: 'scale(1)', filter: 'brightness(1)' }
      ],
      duration: CLINICAL_TIMING.clinical.duration,
      easing: MEDICAL_EASING.clinical,
      priority: 'high'
    }
  };
};

/**
 * Selection State Animation
 * Clear visual feedback for segment selection
 */
export const createSelectionAnimation = (segment, isSelected, options = {}) => {
  const {
    emergencyMode = false,
    selectionIndex = 0
  } = options;
  
  if (emergencyMode) {
    return {
      element: segment,
      config: {
        keyframes: [
          isSelected 
            ? { transform: 'scale(1.05)', outline: '3px solid #000000' }
            : { transform: 'scale(1)', outline: 'none' }
        ],
        duration: 0,
        priority: 'critical'
      }
    };
  }
  
  // Staggered selection animation for multiple selections
  const delay = selectionIndex * 50;
  
  return {
    element: segment,
    config: {
      keyframes: isSelected ? [
        { transform: 'scale(1)', outline: 'none' },
        { transform: 'scale(1.08)', outline: '2px solid #000000' },
        { transform: 'scale(1.05)', outline: '3px solid #000000' }
      ] : [
        { transform: 'scale(1.05)', outline: '3px solid #000000' },
        { transform: 'scale(1.02)', outline: '1px solid #000000' },
        { transform: 'scale(1)', outline: 'none' }
      ],
      duration: CLINICAL_TIMING.educational.duration,
      easing: MEDICAL_EASING.educational,
      delay,
      priority: 'high'
    }
  };
};

// =============================================================================
// MEDICAL EDUCATION ANIMATION SEQUENCES
// Learning progression and clinical scenario animations
// =============================================================================

/**
 * Learning Progress Animation
 * Visual feedback for educational engagement
 */
export const createLearningProgressAnimation = (progressElement, progress, options = {}) => {
  const {
    educationLevel = 'resident',
    milestoneReached = false
  } = options;
  
  // Milestone celebration animation
  if (milestoneReached) {
    return {
      element: progressElement,
      config: {
        keyframes: [
          { transform: 'scale(1)', backgroundColor: 'rgb(59, 130, 246)' },
          { transform: 'scale(1.1)', backgroundColor: 'rgb(34, 197, 94)' },
          { transform: 'scale(1.05)', backgroundColor: 'rgb(34, 197, 94)' },
          { transform: 'scale(1)', backgroundColor: 'rgb(59, 130, 246)' }
        ],
        duration: CLINICAL_TIMING.educational.duration * 2,
        easing: MEDICAL_EASING.educational,
        priority: 'medium'
      }
    };
  }
  
  // Smooth progress fill animation
  return {
    element: progressElement,
    config: {
      keyframes: [
        { width: '0%' },
        { width: `${progress}%` }
      ],
      duration: CLINICAL_TIMING.educational.duration,
      easing: MEDICAL_EASING.dataVisualization,
      priority: 'medium'
    }
  };
};

/**
 * Clinical Scenario Transition Animation
 * Professional transitions between clinical scenarios
 */
export const createScenarioTransitionAnimation = (elements, direction = 'forward', options = {}) => {
  const {
    emergencyMode = false
  } = options;
  
  if (emergencyMode) {
    return elements.map(element => ({
      element,
      config: {
        keyframes: [{ opacity: 1 }],
        duration: 0,
        priority: 'critical'
      }
    }));
  }
  
  const slideDistance = direction === 'forward' ? '-100%' : '100%';
  
  return elements.map((element, index) => ({
    element,
    config: {
      keyframes: [
        { transform: 'translateX(0)', opacity: 1 },
        { transform: `translateX(${slideDistance})`, opacity: 0 }
      ],
      duration: CLINICAL_TIMING.educational.duration,
      easing: MEDICAL_EASING.educational,
      delay: index * 100,
      priority: 'medium'
    }
  }));
};

/**
 * Spaced Repetition Visual Cue Animation
 * Subtle reminder animations for spaced repetition system
 */
export const createSpacedRepetitionAnimation = (element, urgency = 'low', options = {}) => {
  const urgencyAnimations = {
    low: {
      keyframes: [
        { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.3)' },
        { boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)' },
        { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' }
      ],
      duration: CLINICAL_TIMING.ambient.duration * 2
    },
    medium: {
      keyframes: [
        { boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.4)' },
        { boxShadow: '0 0 0 6px rgba(245, 158, 11, 0.1)' },
        { boxShadow: '0 0 0 0 rgba(245, 158, 11, 0)' }
      ],
      duration: CLINICAL_TIMING.ambient.duration
    },
    high: {
      keyframes: [
        { boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.5)' },
        { boxShadow: '0 0 0 8px rgba(220, 38, 38, 0.2)' },
        { boxShadow: '0 0 0 0 rgba(220, 38, 38, 0)' }
      ],
      duration: CLINICAL_TIMING.clinical.duration * 2
    }
  };
  
  const animation = urgencyAnimations[urgency] || urgencyAnimations.low;
  
  return {
    element,
    config: {
      ...animation,
      easing: MEDICAL_EASING.accessibility,
      iterationCount: 3,
      priority: 'low'
    }
  };
};

// =============================================================================
// PERFORMANCE OPTIMIZATION SYSTEM
// GPU acceleration and battery optimization
// =============================================================================

/**
 * GPU Acceleration Optimizer
 * Promotes animations to GPU layer for better performance
 */
export class GPUAccelerationOptimizer {
  constructor(animationManager = null) {
    this.acceleratedElements = new WeakSet();
    this.animationManager = animationManager;
  }
  
  /**
   * Promote element to GPU layer
   */
  promoteToGPU(element) {
    if (this.acceleratedElements.has(element)) return;
    
    element.style.willChange = 'transform, opacity';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
    
    this.acceleratedElements.add(element);
  }
  
  /**
   * Remove GPU promotion
   */
  demoteFromGPU(element) {
    if (!this.acceleratedElements.has(element)) return;
    
    element.style.willChange = 'auto';
    element.style.backfaceVisibility = '';
    element.style.perspective = '';
    
    this.acceleratedElements.delete(element);
  }
  
  /**
   * Auto-promote elements based on animation complexity and device capabilities
   */
  autoPromote(element, config) {
    const complexityScore = this.calculateComplexityScore(config);
    
    // Mobile-specific GPU promotion logic
    if (this.animationManager) {
      const deviceInfo = this.animationManager.deviceInfo;
      
      // Be more conservative on low-power devices
      if (deviceInfo.isLowPower) {
        if (complexityScore > 0.7) { // Higher threshold for low-power devices
          this.promoteToGPU(element);
        }
      } else if (deviceInfo.isMobile) {
        // More aggressive GPU promotion on capable mobile devices
        if (complexityScore > 0.3) {
          this.promoteToGPU(element);
        }
      } else {
        // Standard desktop behavior
        if (complexityScore > 0.5) {
          this.promoteToGPU(element);
        }
      }
    } else {
      // Fallback behavior when no animation manager is available
      if (complexityScore > 0.5) {
        this.promoteToGPU(element);
      }
    }
    
    // Auto-demote after animation with mobile-specific timing
    const demoteDelay = this.animationManager?.isMobile ? config.duration + 50 : config.duration + 100;
    setTimeout(() => {
      this.demoteFromGPU(element);
    }, demoteDelay);
  }
  
  /**
   * Calculate animation complexity score
   */
  calculateComplexityScore(config) {
    let score = 0;
    
    // Keyframe count
    score += Math.min(config.keyframes?.length || 0, 10) * 0.1;
    
    // Duration penalty for long animations
    score += Math.min((config.duration || 0) / 1000, 2) * 0.2;
    
    // Transform complexity
    const transforms = ['transform', 'scale', 'rotate', 'translate'];
    config.keyframes?.forEach(keyframe => {
      Object.keys(keyframe).forEach(property => {
        if (transforms.includes(property) || property.startsWith('transform')) {
          score += 0.15;
        }
      });
    });
    
    return Math.min(score, 1);
  }
}

// =============================================================================
// INTEGRATION HOOKS & UTILITIES
// React integration and utility functions
// =============================================================================

/**
 * React Hook for Northwestern Animations
 * Provides animation manager instance with clinical optimization
 */
export const useNorthwesternAnimations = (options = {}) => {
  const {
    emergencyMode = false,
    reducedMotion = null,
    performanceMode = 'standard'
  } = options;
  
  // This would be used with proper React imports in a React component
  const animationManager = new ClinicalAnimationManager();
  const gpuOptimizer = new GPUAccelerationOptimizer(animationManager);
  
  // Configure manager
  animationManager.setEmergencyMode(emergencyMode);
  if (reducedMotion !== null) {
    animationManager.reducedMotion = reducedMotion;
  }
  animationManager.performanceMode = performanceMode;
  
  return {
    animationManager,
    gpuOptimizer,
    
    // Animation creators
    createLoadingAnimation,
    createCoverageRevealAnimation,
    createHoverAnimation,
    createSelectionAnimation,
    createLearningProgressAnimation,
    createScenarioTransitionAnimation,
    createSpacedRepetitionAnimation,
    
    // Utilities
    CLINICAL_TIMING,
    MEDICAL_EASING
  };
};

/**
 * CSS Keyframes Generator
 * Generates CSS keyframes for animations
 */
export const generateCSSKeyframes = (animationName, keyframes) => {
  const keyframeRules = keyframes.map((keyframe, index) => {
    const percentage = index === 0 ? 0 : index === keyframes.length - 1 ? 100 : (index / (keyframes.length - 1)) * 100;
    const rules = Object.entries(keyframe).map(([property, value]) => `${property}: ${value}`).join('; ');
    return `${percentage}% { ${rules} }`;
  }).join('\n  ');
  
  return `@keyframes ${animationName} {
  ${keyframeRules}
}`;
};

/**
 * Animation Performance Monitor
 * Monitors and reports animation performance metrics
 */
export class AnimationPerformanceMonitor {
  constructor() {
    this.metrics = {
      totalAnimations: 0,
      averageFrameTime: 0,
      droppedFrames: 0,
      emergencyOverrides: 0
    };
    
    this.isMonitoring = false;
  }
  
  startMonitoring() {
    this.isMonitoring = true;
    this.metrics = {
      totalAnimations: 0,
      averageFrameTime: 0,
      droppedFrames: 0,
      emergencyOverrides: 0
    };
  }
  
  recordAnimation(duration, frameTime) {
    if (!this.isMonitoring) return;
    
    this.metrics.totalAnimations++;
    this.metrics.averageFrameTime = 
      (this.metrics.averageFrameTime + frameTime) / this.metrics.totalAnimations;
    
    if (frameTime > 16.67) { // Dropped frame at 60fps
      this.metrics.droppedFrames++;
    }
  }
  
  recordEmergencyOverride() {
    if (!this.isMonitoring) return;
    this.metrics.emergencyOverrides++;
  }
  
  getReport() {
    return {
      ...this.metrics,
      averageFrameRate: 1000 / this.metrics.averageFrameTime,
      frameDropPercentage: (this.metrics.droppedFrames / this.metrics.totalAnimations) * 100
    };
  }
}

// =============================================================================
// DEFAULT EXPORTS
// =============================================================================

// Default animation manager instance
export const defaultAnimationManager = new ClinicalAnimationManager();
export const defaultGPUOptimizer = new GPUAccelerationOptimizer(defaultAnimationManager);
export const defaultPerformanceMonitor = new AnimationPerformanceMonitor();

// Default configuration for Northwestern animations
export const NORTHWESTERN_ANIMATION_CONFIG = {
  emergency: {
    timing: CLINICAL_TIMING.emergency,
    easing: MEDICAL_EASING.emergency
  },
  clinical: {
    timing: CLINICAL_TIMING.clinical,
    easing: MEDICAL_EASING.clinical
  },
  educational: {
    timing: CLINICAL_TIMING.educational,
    easing: MEDICAL_EASING.educational
  }
};

export default {
  ClinicalAnimationManager,
  GPUAccelerationOptimizer,
  AnimationPerformanceMonitor,
  
  // Animation creators
  createLoadingAnimation,
  createCoverageRevealAnimation,
  createHoverAnimation,
  createSelectionAnimation,
  createLearningProgressAnimation,
  createScenarioTransitionAnimation,
  createSpacedRepetitionAnimation,
  
  // Configuration
  CLINICAL_TIMING,
  MEDICAL_EASING,
  NORTHWESTERN_ANIMATION_CONFIG,
  
  // Default instances
  defaultAnimationManager,
  defaultGPUOptimizer,
  defaultPerformanceMonitor,
  
  // React hook
  useNorthwesternAnimations
};