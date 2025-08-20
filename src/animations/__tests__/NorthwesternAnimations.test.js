/**
 * Northwestern Animations Test Suite
 * 
 * Comprehensive test coverage for Agent 2.4's clinical animation framework.
 * Tests medical-appropriate timing, emergency mode, and performance optimization.
 * 
 * Created by: Agent 2.4 - Animation & Transition Expert
 * Purpose: Ensure clinical animation system reliability and performance
 * Coverage: All animation classes, clinical timing, and emergency behaviors
 */

import {
  ClinicalAnimationManager,
  GPUAccelerationOptimizer,
  AnimationPerformanceMonitor,
  createLoadingAnimation,
  createCoverageRevealAnimation,
  createHoverAnimation,
  createSelectionAnimation,
  createLearningProgressAnimation,
  CLINICAL_TIMING,
  MEDICAL_EASING,
  generateCSSKeyframes
} from '../NorthwesternAnimations.js';

// Mock DOM elements for testing
const createMockElement = (tagName = 'div') => {
  const element = {
    tagName: tagName.toUpperCase(),
    style: {},
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(() => false)
    },
    animate: jest.fn(() => {
      const animation = {
        onfinish: null,
        oncancel: null,
        cancel: jest.fn(),
        finished: Promise.resolve()
      };
      // Simulate immediate animation completion
      setTimeout(() => {
        if (animation.onfinish) {
          animation.onfinish();
        }
      }, 0);
      return animation;
    }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  };
  return element;
};

// Mock DOM APIs for testing environment
global.window = {
  matchMedia: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
};

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn()
};

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16); // 60fps
  return 1;
});

global.cancelAnimationFrame = jest.fn();

describe('Northwestern Animations Framework', () => {
  
  describe('CLINICAL_TIMING Configuration', () => {
    test('emergency timing has zero duration for patient safety', () => {
      expect(CLINICAL_TIMING.emergency.duration).toBe(0);
      expect(CLINICAL_TIMING.emergency.easing).toBe('linear');
      expect(CLINICAL_TIMING.emergency.priority).toBe('critical');
    });
    
    test('clinical timing is fast for clinical responsiveness', () => {
      expect(CLINICAL_TIMING.clinical.duration).toBeLessThanOrEqual(200);
      expect(CLINICAL_TIMING.clinical.priority).toBe('high');
    });
    
    test('educational timing allows for learning', () => {
      expect(CLINICAL_TIMING.educational.duration).toBeGreaterThan(CLINICAL_TIMING.clinical.duration);
      expect(CLINICAL_TIMING.educational.priority).toBe('medium');
    });
  });
  
  describe('MEDICAL_EASING Functions', () => {
    test('all easing functions are valid CSS cubic-bezier values', () => {
      Object.values(MEDICAL_EASING).forEach(easing => {
        expect(typeof easing).toBe('string');
        expect(easing).toMatch(/cubic-bezier\(\d*\.?\d+,\s*-?\d*\.?\d+,\s*\d*\.?\d+,\s*\d*\.?\d+\)/);
      });
    });
    
    test('emergency easing is attention-grabbing', () => {
      expect(MEDICAL_EASING.emergency).toContain('1.55'); // Bounce effect
    });
    
    test('accessibility easing is gentle', () => {
      expect(MEDICAL_EASING.accessibility).toBe('cubic-bezier(0.25, 0.46, 0.45, 0.94)');
    });
  });
  
  describe('ClinicalAnimationManager', () => {
    let manager;
    let mockElement;
    
    beforeEach(() => {
      manager = new ClinicalAnimationManager();
      mockElement = createMockElement();
      jest.clearAllMocks();
    });
    
    afterEach(() => {
      manager.cleanup();
    });
    
    describe('Emergency Mode', () => {
      test('enables emergency mode correctly', () => {
        manager.setEmergencyMode(true);
        expect(manager.emergencyMode).toBe(true);
      });
      
      test('bypasses animations in emergency mode', async () => {
        manager.setEmergencyMode(true);
        
        const config = {
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          duration: 300,
          priority: 'medium'
        };
        
        await manager.animate(mockElement, config);
        
        // Should apply final state immediately instead of animating
        expect(mockElement.animate).not.toHaveBeenCalled();
      });
      
      test('allows critical animations in emergency mode', async () => {
        jest.setTimeout(10000); // Increase timeout for animation tests
        manager.setEmergencyMode(true);
        
        const config = {
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          duration: 0,
          priority: 'critical'
        };
        
        await manager.animate(mockElement, config);
        
        // Critical animations should still execute
        expect(mockElement.animate).toHaveBeenCalled();
      }, 10000);
    });
    
    describe('Reduced Motion Support', () => {
      test('detects reduced motion preference', () => {
        // Mock matchMedia to return reduced motion preference
        window.matchMedia.mockImplementation(query => ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }));
        
        const reducedMotionManager = new ClinicalAnimationManager();
        expect(reducedMotionManager.reducedMotion).toBe(true);
      });
      
      test('applies final state immediately with reduced motion', async () => {
        manager.reducedMotion = true;
        
        const config = {
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          duration: 300
        };
        
        await manager.animate(mockElement, config);
        
        expect(mockElement.animate).not.toHaveBeenCalled();
        expect(mockElement.style.opacity).toBe(1);
      });
    });
    
    describe('Performance Adaptation', () => {
      test('adapts duration for performance mode', () => {
        manager.performanceMode = 'performance';
        
        const config = {
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          duration: 300
        };
        
        const adapted = manager.adaptConfigForPerformance(config);
        expect(adapted.duration).toBeLessThan(config.duration);
      });
      
      test('simplifies keyframes for battery mode', () => {
        manager.performanceMode = 'battery';
        
        const config = {
          keyframes: [
            { opacity: 0 },
            { opacity: 0.5 },
            { opacity: 0.8 },
            { opacity: 1 }
          ],
          duration: 300
        };
        
        const adapted = manager.adaptConfigForPerformance(config);
        expect(adapted.keyframes.length).toBe(2); // Start and end only
      });
    });
    
    describe('Animation Execution', () => {
      test('executes animations with proper configuration', async () => {
        const config = {
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          duration: 300,
          easing: 'ease-in-out'
        };
        
        const animatePromise = manager.animate(mockElement, config);
        
        expect(mockElement.animate).toHaveBeenCalledWith(
          config.keyframes,
          expect.objectContaining({
            duration: config.duration,
            easing: config.easing,
            fill: 'forwards'
          })
        );
        
        // Simulate animation completion
        const mockAnimation = mockElement.animate.mock.results[0].value;
        mockAnimation.onfinish();
        
        await animatePromise;
        expect(manager.activeAnimations.size).toBe(0);
      });
      
      test('cancels existing animations on same element', async () => {
        const config1 = {
          keyframes: [{ opacity: 0 }, { opacity: 0.5 }],
          duration: 300
        };
        
        const config2 = {
          keyframes: [{ opacity: 0.5 }, { opacity: 1 }],
          duration: 200
        };
        
        // Start first animation
        manager.animate(mockElement, config1);
        const firstAnimation = mockElement.animate.mock.results[0].value;
        
        // Start second animation (should cancel first)
        manager.animate(mockElement, config2);
        
        expect(firstAnimation.cancel).toHaveBeenCalled();
      });
    });
  });
  
  describe('GPUAccelerationOptimizer', () => {
    let optimizer;
    let mockElement;
    
    beforeEach(() => {
      optimizer = new GPUAccelerationOptimizer();
      mockElement = createMockElement();
    });
    
    test('promotes elements to GPU layer', () => {
      optimizer.promoteToGPU(mockElement);
      
      expect(mockElement.style.willChange).toBe('transform, opacity');
      expect(mockElement.style.backfaceVisibility).toBe('hidden');
      expect(mockElement.style.perspective).toBe('1000px');
    });
    
    test('demotes elements from GPU layer', () => {
      optimizer.promoteToGPU(mockElement);
      optimizer.demoteFromGPU(mockElement);
      
      expect(mockElement.style.willChange).toBe('auto');
      expect(mockElement.style.backfaceVisibility).toBe('');
      expect(mockElement.style.perspective).toBe('');
    });
    
    test('calculates complexity score correctly', () => {
      const simpleConfig = {
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        duration: 200
      };
      
      const complexConfig = {
        keyframes: [
          { opacity: 0, transform: 'scale(0) rotate(0deg)' },
          { opacity: 0.5, transform: 'scale(0.5) rotate(90deg)' },
          { opacity: 1, transform: 'scale(1) rotate(180deg)' }
        ],
        duration: 1000
      };
      
      const simpleScore = optimizer.calculateComplexityScore(simpleConfig);
      const complexScore = optimizer.calculateComplexityScore(complexConfig);
      
      expect(complexScore).toBeGreaterThan(simpleScore);
    });
  });
  
  describe('Animation Creators', () => {
    let mockSegments;
    
    beforeEach(() => {
      mockSegments = [
        createMockElement(),
        createMockElement(),
        createMockElement()
      ];
    });
    
    describe('createLoadingAnimation', () => {
      test('creates loading animation for segments', () => {
        const animations = createLoadingAnimation(mockSegments);
        
        expect(animations).toHaveLength(mockSegments.length);
        animations.forEach((animation, index) => {
          expect(animation.element).toBe(mockSegments[index]);
          expect(animation.config.keyframes).toHaveLength(3); // opacity and scale progression
          expect(animation.config.priority).toBe('medium');
        });
      });
      
      test('skips loading animation in emergency mode', () => {
        const animations = createLoadingAnimation(mockSegments, { emergencyMode: true });
        
        animations.forEach(animation => {
          expect(animation.config.keyframes).toHaveLength(1); // Single keyframe
          expect(animation.config.duration).toBe(0);
          expect(animation.config.priority).toBe('critical');
        });
      });
    });
    
    describe('createCoverageRevealAnimation', () => {
      test('creates coverage-appropriate animations', () => {
        const mockSegment = createMockElement();
        
        // Test different coverage levels
        const noCoverageAnim = createCoverageRevealAnimation(mockSegment, 0);
        const moderateAnim = createCoverageRevealAnimation(mockSegment, 1);
        const goodAnim = createCoverageRevealAnimation(mockSegment, 2);
        
        expect(noCoverageAnim.config.keyframes[0]).toHaveProperty('filter'); // Grayscale for no coverage
        expect(moderateAnim.config.keyframes[0]).toHaveProperty('transform'); // Scale for moderate
        expect(goodAnim.config.keyframes[0]).toHaveProperty('filter'); // Brightness for good coverage
      });
      
      test('adapts timing for education levels', () => {
        const mockSegment = createMockElement();
        
        const studentAnim = createCoverageRevealAnimation(mockSegment, 1, { 
          educationLevel: 'student' 
        });
        const attendingAnim = createCoverageRevealAnimation(mockSegment, 1, { 
          educationLevel: 'attending' 
        });
        
        expect(studentAnim.config.duration).toBeGreaterThan(attendingAnim.config.duration);
      });
    });
    
    describe('createHoverAnimation', () => {
      test('creates appropriate hover animations', () => {
        const mockSegment = createMockElement();
        
        const hoverOn = createHoverAnimation(mockSegment, true);
        const hoverOff = createHoverAnimation(mockSegment, false);
        
        expect(hoverOn.config.keyframes).toHaveLength(2);
        expect(hoverOff.config.keyframes).toHaveLength(2);
        expect(hoverOn.config.priority).toBe('high');
      });
      
      test('uses instant transitions in emergency mode', () => {
        const mockSegment = createMockElement();
        
        const emergencyHover = createHoverAnimation(mockSegment, true, { 
          emergencyMode: true 
        });
        
        expect(emergencyHover.config.keyframes).toHaveLength(1);
        expect(emergencyHover.config.duration).toBe(0);
        expect(emergencyHover.config.priority).toBe('critical');
      });
    });
    
    describe('createSelectionAnimation', () => {
      test('creates selection state animations', () => {
        const mockSegment = createMockElement();
        
        const selectAnim = createSelectionAnimation(mockSegment, true);
        const deselectAnim = createSelectionAnimation(mockSegment, false);
        
        expect(selectAnim.config.keyframes).toHaveLength(3); // Selection bounce
        expect(deselectAnim.config.keyframes).toHaveLength(3); // Deselection ease
      });
      
      test('staggers multiple selections', () => {
        const mockSegment = createMockElement();
        
        const firstSelection = createSelectionAnimation(mockSegment, true, { selectionIndex: 0 });
        const thirdSelection = createSelectionAnimation(mockSegment, true, { selectionIndex: 2 });
        
        expect(thirdSelection.config.delay).toBeGreaterThan(firstSelection.config.delay);
      });
    });
    
    describe('createLearningProgressAnimation', () => {
      test('creates progress fill animation', () => {
        const mockElement = createMockElement();
        
        const progressAnim = createLearningProgressAnimation(mockElement, 75);
        
        expect(progressAnim.config.keyframes).toHaveLength(2);
        expect(progressAnim.config.keyframes[1].width).toBe('75%');
      });
      
      test('creates milestone celebration animation', () => {
        const mockElement = createMockElement();
        
        const milestoneAnim = createLearningProgressAnimation(mockElement, 100, { 
          milestoneReached: true 
        });
        
        expect(milestoneAnim.config.keyframes).toHaveLength(4); // Celebration sequence
        expect(milestoneAnim.config.duration).toBeGreaterThan(CLINICAL_TIMING.educational.duration);
      });
    });
  });
  
  describe('AnimationPerformanceMonitor', () => {
    let monitor;
    
    beforeEach(() => {
      monitor = new AnimationPerformanceMonitor();
    });
    
    test('initializes with zero metrics', () => {
      const report = monitor.getReport();
      
      expect(report.totalAnimations).toBe(0);
      expect(report.averageFrameTime).toBe(0);
      expect(report.droppedFrames).toBe(0);
      expect(report.emergencyOverrides).toBe(0);
    });
    
    test('records animation metrics', () => {
      monitor.startMonitoring();
      
      monitor.recordAnimation(300, 16); // Good frame time
      monitor.recordAnimation(200, 20); // Dropped frame
      
      const report = monitor.getReport();
      
      expect(report.totalAnimations).toBe(2);
      expect(report.droppedFrames).toBe(1);
      expect(report.frameDropPercentage).toBe(50);
    });
    
    test('records emergency overrides', () => {
      monitor.startMonitoring();
      
      monitor.recordEmergencyOverride();
      monitor.recordEmergencyOverride();
      
      const report = monitor.getReport();
      expect(report.emergencyOverrides).toBe(2);
    });
  });
  
  describe('Utility Functions', () => {
    describe('generateCSSKeyframes', () => {
      test('generates valid CSS keyframes', () => {
        const keyframes = [
          { opacity: 0, transform: 'scale(0.5)' },
          { opacity: 0.5, transform: 'scale(0.8)' },
          { opacity: 1, transform: 'scale(1)' }
        ];
        
        const css = generateCSSKeyframes('testAnimation', keyframes);
        
        expect(css).toContain('@keyframes testAnimation');
        expect(css).toContain('0% { opacity: 0; transform: scale(0.5) }');
        expect(css).toContain('50% { opacity: 0.5; transform: scale(0.8) }');
        expect(css).toContain('100% { opacity: 1; transform: scale(1) }');
      });
    });
  });
  
  describe('Integration Tests', () => {
    let manager;
    let optimizer;
    let monitor;
    
    beforeEach(() => {
      manager = new ClinicalAnimationManager();
      optimizer = new GPUAccelerationOptimizer();
      monitor = new AnimationPerformanceMonitor();
      monitor.startMonitoring();
    });
    
    afterEach(() => {
      manager.cleanup();
    });
    
    test('complete animation workflow with performance monitoring', async () => {
      jest.setTimeout(10000); // Increase timeout for complex animation workflow
      const mockElement = createMockElement();
      
      // Create and execute loading animation
      const loadingAnimations = createLoadingAnimation([mockElement]);
      const loadingConfig = loadingAnimations[0].config;
      
      // Promote to GPU for complex animation
      optimizer.autoPromote(mockElement, loadingConfig);
      
      // Execute animation
      const startTime = performance.now();
      await manager.animate(mockElement, loadingConfig);
      const endTime = performance.now();
      
      // Record performance
      monitor.recordAnimation(loadingConfig.duration, endTime - startTime);
      
      // Verify workflow
      expect(mockElement.animate).toHaveBeenCalled();
      
      const report = monitor.getReport();
      expect(report.totalAnimations).toBe(1);
    });
    
    test('emergency mode override workflow', async () => {
      const mockElement = createMockElement();
      monitor.startMonitoring();
      
      // Start in normal mode
      const normalConfig = {
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        duration: 300,
        priority: 'medium'
      };
      
      // Switch to emergency mode
      manager.setEmergencyMode(true);
      monitor.recordEmergencyOverride();
      
      // Attempt animation (should be bypassed)
      await manager.animate(mockElement, normalConfig);
      
      // Verify emergency behavior
      expect(mockElement.animate).not.toHaveBeenCalled();
      
      const report = monitor.getReport();
      expect(report.emergencyOverrides).toBe(1);
    }, 10000);
  });
});

describe('Medical Context Validation', () => {
  test('animation timings meet clinical requirements', () => {
    // Emergency access must be instant
    expect(CLINICAL_TIMING.emergency.duration).toBe(0);
    
    // Clinical interactions must be fast
    expect(CLINICAL_TIMING.clinical.duration).toBeLessThanOrEqual(200);
    
    // Educational content can be slower but reasonable
    expect(CLINICAL_TIMING.educational.duration).toBeLessThanOrEqual(500);
  });
  
  test('animation system respects medical priorities', () => {
    const manager = new ClinicalAnimationManager();
    
    // Emergency mode should be available
    expect(typeof manager.setEmergencyMode).toBe('function');
    
    // Reduced motion should be supported
    expect(typeof manager.reducedMotion).toBe('boolean');
    
    // Performance adaptation should exist
    expect(typeof manager.performanceMode).toBe('string');
  });
  
  test('all animations have appropriate medical context', () => {
    const mockElement = createMockElement();
    
    // Coverage reveal should vary by coverage level
    const noCoverage = createCoverageRevealAnimation(mockElement, 0);
    const goodCoverage = createCoverageRevealAnimation(mockElement, 2);
    
    expect(noCoverage.config.keyframes[0].filter).toContain('grayscale'); // Warning for no coverage
    expect(goodCoverage.config.keyframes[0].filter).toContain('brightness'); // Positive for good coverage
  });
});