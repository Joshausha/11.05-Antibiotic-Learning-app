/**
 * Northwestern Visual States System
 *
 * Comprehensive visual state management for interactive Northwestern pie chart segments.
 * Provides professional medical-grade visual feedback for hover, selection, focus,
 * loading, error, and emergency states.
 *
 * Created by: Agent 2.3 - Color & Visual Designer
 * Integration: Builds on Agent 2.2's interaction system with enhanced visuals
 * Performance: Optimized for <100ms interaction response in clinical environments
 *
 * Features:
 * - Smooth medical-grade interaction transitions
 * - Emergency clinical access visual patterns
 * - Color-blind safe state indicators
 * - High contrast clinical environment support
 * - Touch-optimized mobile clinical workflows
 *
 * @version 1.0.0
 * @date 2025-08-18
 */

// Type definitions for visual states
type StateName = 'hover' | 'selected' | 'focus' | 'loading' | 'error' | 'disabled' | 'emergency' | 'contraindicated' | 'normal';

interface CombineStatesContext {
  emergencyMode?: boolean;
  [key: string]: unknown;
}

interface VisualConfig {
  brightness?: number;
  saturation?: number;
  scale?: number;
  translateZ?: string;
  opacity?: number;
  cursor?: string;
  filter?: string;
  borderColor?: string;
  borderWidth?: string | number;
  borderStyle?: string;
  backgroundColor?: string;
  boxShadow?: string | { primary?: string; medical?: string; emergency?: string; focus?: string };
  outline?: {
    width?: string;
    color?: string;
    style?: string;
    offset?: string;
  };
  animation?: {
    name?: string;
    duration?: string;
    timing?: string;
    iteration?: string;
    direction?: string;
    fillMode?: string;
  };
  pattern?: {
    type?: string;
    color?: string;
    opacity?: number;
    angle?: number;
  };
  pointerEvents?: string;
  [key: string]: unknown;
}

interface StateConfig {
  visual?: VisualConfig;
  transition?: {
    duration?: string;
    easing?: string;
    properties?: string[];
  };
  performance?: Record<string, string | number>;
  accessibility?: Record<string, unknown>;
  priority?: {
    zIndex?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface CSSProperties {
  transform?: string;
  outline?: string;
  outlineOffset?: string;
  transition?: string;
  [key: string]: string | number | undefined;
}

// =============================================================================
// INTERACTION STATE DEFINITIONS
// Professional medical visual feedback system
// =============================================================================

/**
 * Base Interactive State Configuration
 * Core visual properties for all interactive states
 */
export const BASE_INTERACTIVE_STATE = {
  // Transition timing optimized for clinical responsiveness
  transition: {
    duration: '200ms',          // Medical-standard response time
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material design easing
    properties: ['all']         // Comprehensive state transitions
  },
  
  // Performance optimizations for clinical environments
  performance: {
    willChange: 'transform, opacity, filter',
    backfaceVisibility: 'hidden',
    perspective: '1000px',
    containment: 'layout style paint'
  },
  
  // Accessibility requirements
  accessibility: {
    minContrastRatio: 4.5,      // WCAG 2.1 AA standard
    focusVisible: true,         // Keyboard navigation support
    screenReaderDescriptions: true // Assistive technology support
  }
};

/**
 * Hover State Configuration
 * Enhanced visual feedback for mouse and touch hover interactions
 */
export const HOVER_STATE = {
  ...BASE_INTERACTIVE_STATE,
  
  // Visual enhancements
  visual: {
    brightness: 1.15,           // 15% brighter for visibility
    saturation: 1.1,            // Slightly more saturated
    scale: 1.02,                // Subtle scale increase
    boxShadow: {
      primary: '0 4px 12px rgba(0, 0, 0, 0.15)', // Elevation shadow
      medical: '0 2px 8px rgba(59, 130, 246, 0.2)', // Medical blue glow
      emergency: '0 4px 16px rgba(220, 38, 38, 0.3)' // Emergency red glow
    }
  },
  
  // Timing optimizations
  timing: {
    enter: '150ms',             // Quick hover response
    exit: '200ms',              // Smooth hover exit
    delay: '0ms'                // Immediate response
  },
  
  // Clinical context variations
  contexts: {
    standard: {
      borderWidth: '3px',       // Emphasized border
      opacity: 1.0,             // Full visibility
      zIndex: 5                 // Above other elements
    },
    emergency: {
      borderWidth: '4px',       // Thicker emergency border
      opacity: 1.0,
      zIndex: 10,               // High priority layering
      animation: 'pulse 2s infinite' // Emergency pulsing
    },
    comparison: {
      borderWidth: '2px',       // Subtle comparison border
      opacity: 0.9,             // Slight transparency for context
      zIndex: 3                 // Below selected elements
    }
  }
};

/**
 * Selection State Configuration
 * Clear visual indication of selected segments for multi-selection workflows
 */
export const SELECTION_STATE = {
  ...BASE_INTERACTIVE_STATE,
  
  // Selection visual indicators
  visual: {
    outline: {
      width: '3px',             // Prominent selection outline
      color: '#000000',         // High contrast black outline
      style: 'solid',           // Solid outline for certainty
      offset: '2px'             // Spacing from element
    },
    boxShadow: {
      primary: '0 6px 20px rgba(0, 0, 0, 0.25)', // Elevated selection shadow
      focus: '0 0 0 4px rgba(37, 99, 235, 0.25)', // Focus ring shadow
      emergency: '0 8px 25px rgba(220, 38, 38, 0.4)' // Emergency selection
    },
    transform: {
      scale: 1.05,              // Noticeable scale increase
      translateZ: '10px'        // 3D elevation effect
    }
  },
  
  // Selection behaviors
  behavior: {
    persistent: true,           // Selection persists until deselected
    multiSelect: true,          // Support multiple selections
    toggleable: true,           // Click to toggle selection
    keyboardNavigable: true     // Keyboard selection support
  },
  
  // Clinical workflow optimizations
  workflow: {
    maxSelections: 8,           // All 8 Northwestern segments
    selectionOrder: 'clockwise', // Follow Northwestern segment order
    comparisonMode: true,       // Enable comparison features
    exportable: true            // Selection state can be exported
  }
};

/**
 * Focus State Configuration  
 * Accessibility-optimized focus indicators for keyboard navigation
 */
export const FOCUS_STATE = {
  ...BASE_INTERACTIVE_STATE,
  
  // Focus visual indicators (WCAG 2.1 AA compliant)
  visual: {
    outline: {
      width: '3px',             // Visible focus outline
      color: '#2563eb',         // Medical blue focus color
      style: 'solid',           // Solid for visibility
      offset: '2px'             // Clear separation
    },
    boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.25)', // Focus ring
    backgroundColor: 'rgba(37, 99, 235, 0.05)' // Subtle background
  },
  
  // Keyboard navigation
  keyboard: {
    tabIndex: 0,                // Keyboard focusable
    ariaRole: 'button',         // Screen reader role
    ariaPressed: false,         // Selection state
    ariaLabel: 'Northwestern segment' // Base aria label
  },
  
  // Focus management
  management: {
    trapFocus: false,           // Don't trap focus within component
    restoreFocus: true,         // Restore focus on component unmount
    skipLinks: true,            // Support skip navigation
    announceChanges: true       // Screen reader announcements
  }
};

/**
 * Loading State Configuration
 * Visual feedback during data loading or processing
 */
export const LOADING_STATE = {
  ...BASE_INTERACTIVE_STATE,
  
  // Loading visual effects
  visual: {
    opacity: 0.7,              // Reduced opacity during loading
    cursor: 'wait',             // Wait cursor
    filter: 'grayscale(0.3)',   // Slight desaturation
    animation: {
      name: 'medicalPulse',     // Medical loading animation
      duration: '2s',           // Slow, professional pulse
      timing: 'cubic-bezier(0.4, 0, 0.6, 1)',
      iteration: 'infinite',
      direction: 'alternate'
    }
  },
  
  // Loading indicators
  indicators: {
    spinner: false,             // No spinner for pie segments
    skeleton: false,            // No skeleton for existing segments
    pulse: true,                // Pulse animation
    progressBar: false          // No progress bar for segments
  },
  
  // Performance during loading
  performance: {
    disableHover: true,         // Disable hover during loading
    disableSelection: true,     // Disable selection during loading
    disableKeyboard: true,      // Disable keyboard during loading
    reduceAnimations: true      // Minimize non-essential animations
  }
};

/**
 * Error State Configuration
 * Clear visual indication of errors or invalid states
 */
export const ERROR_STATE = {
  ...BASE_INTERACTIVE_STATE,
  
  // Error visual indicators
  visual: {
    borderColor: '#dc2626',     // Medical error red
    borderWidth: '2px',         // Prominent error border
    borderStyle: 'solid',       // Solid error indication
    backgroundColor: 'rgba(220, 38, 38, 0.05)', // Subtle error background
    animation: {
      name: 'shake',            // Error shake animation
      duration: '0.5s',         // Quick shake
      timing: 'ease-in-out',
      iteration: '1',           // Single shake
      fillMode: 'both'
    }
  },
  
  // Error messaging
  messaging: {
    showTooltip: true,          // Show error tooltip
    announceToScreenReader: true, // Screen reader announcement
    logToConsole: true,         // Console error logging
    displayDuration: 5000       // 5 second error display
  },
  
  // Error recovery
  recovery: {
    autoRetry: false,           // No automatic retry for segments
    userActionRequired: true,   // User must address error
    fallbackDisplay: 'grayscale', // Fallback visual state
    accessibilityMessage: 'Segment data unavailable' // A11y message
  }
};

/**
 * Disabled State Configuration
 * Clear indication of disabled or unavailable segments
 */
export const DISABLED_STATE = {
  ...BASE_INTERACTIVE_STATE,
  
  // Disabled visual appearance
  visual: {
    opacity: 0.4,              // Significantly reduced opacity
    cursor: 'not-allowed',     // Clear disabled cursor
    filter: 'grayscale(0.7) brightness(0.9)', // Desaturated appearance
    pointerEvents: 'none'      // Disable all interactions
  },
  
  // Accessibility for disabled state
  accessibility: {
    ariaDisabled: true,         // Screen reader disabled state
    tabIndex: -1,               // Remove from tab order
    ariaLabel: 'Segment not available', // Clear disabled message
    role: 'presentation'        // Presentation only when disabled
  },
  
  // Disabled behavior
  behavior: {
    preventHover: true,         // No hover effects
    preventSelection: true,     // No selection possible
    preventFocus: true,         // No focus possible
    preventKeyboard: true       // No keyboard interaction
  }
};

// =============================================================================
// EMERGENCY CLINICAL ACCESS STATES
// High-priority visual states for emergency medical scenarios
// =============================================================================

/**
 * Emergency Access State Configuration
 * Maximum visibility and immediate recognition for emergency scenarios
 */
export const EMERGENCY_STATE = {
  ...BASE_INTERACTIVE_STATE,
  
  // Emergency visual prominence
  visual: {
    borderColor: '#dc2626',     // Emergency red border
    borderWidth: '4px',         // Thick emergency border
    backgroundColor: 'rgba(220, 38, 38, 0.1)', // Emergency background tint
    boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)', // Emergency glow
    animation: {
      name: 'emergencyPulse',   // Emergency pulsing
      duration: '1.5s',         // Faster emergency pulse
      timing: 'ease-in-out',
      iteration: 'infinite',
      direction: 'alternate'
    }
  },
  
  // Emergency interaction priority
  priority: {
    zIndex: 999,                // Maximum z-index for emergency
    pointerEvents: 'all',       // Ensure clickability
    userSelect: 'none',         // Prevent text selection
    touchAction: 'manipulation' // Optimize touch response
  },
  
  // Emergency accessibility
  emergency_a11y: {
    ariaLive: 'assertive',      // Immediate screen reader announcement
    ariaLabel: 'Emergency: High-priority clinical information',
    role: 'alert',              // Alert role for urgency
    tabIndex: 0                 // Ensure keyboard focus
  }
};

/**
 * Contraindicated State Configuration
 * Clear visual warning for contraindicated antibiotic-pathogen combinations
 */
export const CONTRAINDICATED_STATE = {
  ...BASE_INTERACTIVE_STATE,
  
  // Contraindication visual warnings
  visual: {
    backgroundColor: '#ffffff', // White background for no coverage
    borderColor: '#dc2626',     // Red warning border
    borderWidth: '3px',         // Prominent warning border
    borderStyle: 'dashed',      // Dashed pattern for warning
    opacity: 0.6,               // Reduced opacity for contraindication
    pattern: {
      type: 'diagonal-stripes', // Warning pattern overlay
      color: '#dc2626',         // Red warning stripes
      opacity: 0.2,             // Subtle pattern overlay
      angle: 45                 // Diagonal stripe angle
    }
  },
  
  // Clinical warning behavior
  warning: {
    showWarningIcon: true,      // Display warning icon
    preventSelection: false,    // Allow selection for educational purposes
    showTooltip: true,          // Show contraindication explanation
    logClinicalWarning: true    // Log clinical decision support warning
  },
  
  // Educational context
  education: {
    explainContraindication: true, // Provide educational explanation
    suggestAlternatives: true,  // Suggest alternative antibiotics
    showClinicalEvidence: true, // Display supporting evidence
    trackLearningProgress: true // Track educational engagement
  }
};

// =============================================================================
// STATE COMBINATION LOGIC
// Intelligent combination of multiple simultaneous states
// =============================================================================

/**
 * State Priority System
 * Defines which states take priority when multiple states are active
 */
export const STATE_PRIORITY = {
  // Priority order (highest to lowest)
  emergency: 10,              // Emergency states always take priority
  error: 9,                   // Errors are high priority
  disabled: 8,                // Disabled state overrides interactions
  contraindicated: 7,         // Clinical contraindications are important
  loading: 6,                 // Loading states prevent interactions
  selected: 5,                // Selection is persistent
  focus: 4,                   // Focus for accessibility
  hover: 3,                   // Hover feedback
  normal: 1                   // Base state
};

/**
 * Combine multiple states with intelligent priority resolution
 * @param {Array} activeStates - Array of active state names
 * @param {object} context - Additional context for state resolution
 * @returns {object} Combined state configuration
 */
export const combineStates = (activeStates: StateName[], context: CombineStatesContext = {}): StateConfig => {
  // Sort states by priority
  const sortedStates = activeStates
    .filter((state: StateName) => STATE_PRIORITY[state] !== undefined)
    .sort((a: StateName, b: StateName) => STATE_PRIORITY[b] - STATE_PRIORITY[a]);

  if (sortedStates.length === 0) {
    return getStateConfig('normal');
  }

  const primaryState = sortedStates[0];
  const secondaryStates = sortedStates.slice(1);

  // Get primary state configuration
  let combinedConfig = getStateConfig(primaryState);

  // Layer secondary state properties that don't conflict
  secondaryStates.forEach((state: StateName) => {
    const stateConfig = getStateConfig(state);
    combinedConfig = mergeStateConfigs(combinedConfig, stateConfig);
  });

  // Apply context-specific modifications
  if (context.emergencyMode && primaryState !== 'emergency') {
    combinedConfig = enhanceForEmergency(combinedConfig);
  }

  return combinedConfig;
};

/**
 * Get state configuration by name
 * @param {string} stateName - Name of the state
 * @returns {object} State configuration
 */
export const getStateConfig = (stateName: StateName): StateConfig => {
  const stateConfigs: Record<StateName, StateConfig> = {
    hover: HOVER_STATE as unknown as StateConfig,
    selected: SELECTION_STATE as unknown as StateConfig,
    focus: FOCUS_STATE as unknown as StateConfig,
    loading: LOADING_STATE as unknown as StateConfig,
    error: ERROR_STATE as unknown as StateConfig,
    disabled: DISABLED_STATE as unknown as StateConfig,
    emergency: EMERGENCY_STATE as unknown as StateConfig,
    contraindicated: CONTRAINDICATED_STATE as unknown as StateConfig,
    normal: BASE_INTERACTIVE_STATE as unknown as StateConfig
  };

  return stateConfigs[stateName] || BASE_INTERACTIVE_STATE;
};

/**
 * Merge two state configurations intelligently
 * @param {object} primary - Primary state configuration
 * @param {object} secondary - Secondary state configuration
 * @returns {object} Merged configuration
 */
export const mergeStateConfigs = (primary: StateConfig, secondary: StateConfig): StateConfig => {
  const merged: StateConfig = { ...primary };

  // Merge visual properties carefully
  if (secondary.visual) {
    merged.visual = {
      ...merged.visual,
      // Only merge non-conflicting visual properties
      ...Object.fromEntries(
        Object.entries(secondary.visual).filter(([key]) =>
          !['borderColor', 'backgroundColor', 'outline'].includes(key)
        )
      )
    };
  }

  // Combine box shadows
  if (secondary.visual?.boxShadow && primary.visual?.boxShadow) {
    const primaryShadow = typeof primary.visual.boxShadow === 'string' ? primary.visual.boxShadow : '';
    const secondaryShadow = typeof secondary.visual.boxShadow === 'string' ? secondary.visual.boxShadow : '';
    if (merged.visual) {
      merged.visual.boxShadow = `${primaryShadow}, ${secondaryShadow}`;
    }
  }

  // Merge accessibility properties
  if (secondary.accessibility) {
    merged.accessibility = {
      ...merged.accessibility,
      ...secondary.accessibility
    };
  }

  return merged;
};

/**
 * Enhance state configuration for emergency mode
 * @param {object} baseConfig - Base state configuration
 * @returns {object} Emergency-enhanced configuration
 */
export const enhanceForEmergency = (baseConfig: StateConfig): StateConfig => {
  const borderWidthValue = baseConfig.visual?.borderWidth;
  const parsedBorderWidth = typeof borderWidthValue === 'string' ? parseInt(borderWidthValue) : (borderWidthValue || 2);

  return {
    ...baseConfig,
    visual: {
      ...baseConfig.visual,
      filter: `${baseConfig.visual?.filter || ''} contrast(1.5) brightness(1.1)`.trim(),
      borderWidth: Math.max(parsedBorderWidth, 3) + 'px',
      animation: {
        ...baseConfig.visual?.animation,
        duration: '1s' // Faster animations in emergency mode
      }
    },
    priority: {
      ...baseConfig.priority,
      zIndex: Math.max(baseConfig.priority?.zIndex || 5, 20)
    }
  };
};

// =============================================================================
// CSS GENERATION UTILITIES
// Convert state configurations to CSS properties
// =============================================================================

/**
 * Generate CSS properties from state configuration
 * @param {object} stateConfig - State configuration object
 * @returns {object} CSS properties object
 */
export const generateStateCSS = (stateConfig: StateConfig): CSSProperties => {
  const css: CSSProperties = {};

  // Convert visual properties to CSS
  if (stateConfig.visual) {
    const visual = stateConfig.visual;

    // Direct CSS property mapping
    const directMappings: Record<string, string> = {
      opacity: 'opacity',
      cursor: 'cursor',
      borderColor: 'borderColor',
      borderWidth: 'borderWidth',
      borderStyle: 'borderStyle',
      backgroundColor: 'backgroundColor',
      boxShadow: 'boxShadow',
      filter: 'filter'
    };

    Object.entries(directMappings).forEach(([visualProp, cssProp]) => {
      const value = visual[visualProp as keyof VisualConfig];
      if (value !== undefined && typeof value !== 'object') {
        css[cssProp] = value as string | number;
      }
    });

    // Transform properties
    if (visual.scale || visual.translateZ) {
      const transforms: string[] = [];
      if (visual.scale) transforms.push(`scale(${visual.scale})`);
      if (visual.translateZ) transforms.push(`translateZ(${visual.translateZ})`);
      css.transform = transforms.join(' ');
    }

    // Outline properties
    if (visual.outline) {
      css.outline = `${visual.outline.width} ${visual.outline.style} ${visual.outline.color}`;
      if (visual.outline.offset) {
        css.outlineOffset = visual.outline.offset;
      }
    }
  }

  // Transition properties
  if (stateConfig.transition && stateConfig.transition.properties) {
    css.transition = `${stateConfig.transition.properties.join(', ')} ${stateConfig.transition.duration} ${stateConfig.transition.easing}`;
  }

  // Performance properties
  if (stateConfig.performance) {
    Object.entries(stateConfig.performance).forEach(([prop, value]) => {
      css[prop.replace(/([A-Z])/g, '-$1').toLowerCase()] = value;
    });
  }

  return css;
};

// =============================================================================
// EXPORT DEFAULT CONFIGURATION
// =============================================================================

export default {
  states: {
    base: BASE_INTERACTIVE_STATE,
    hover: HOVER_STATE,
    selected: SELECTION_STATE,
    focus: FOCUS_STATE,
    loading: LOADING_STATE,
    error: ERROR_STATE,
    disabled: DISABLED_STATE,
    emergency: EMERGENCY_STATE,
    contraindicated: CONTRAINDICATED_STATE
  },
  priority: STATE_PRIORITY,
  utils: {
    combineStates,
    getStateConfig,
    mergeStateConfigs,
    enhanceForEmergency,
    generateStateCSS
  }
};