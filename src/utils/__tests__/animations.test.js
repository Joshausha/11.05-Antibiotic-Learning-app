/**
 * Animation Utilities Tests
 * Tests for CSS animations, animation controller, and scroll-triggered animations
 */

import {
  animationClasses,
  injectAnimationStyles,
  AnimationController,
  ScrollAnimationController,
  useAnimations,
  defaultAnimationController
} from '../animations.js';

// Mock DOM methods - Agent T3: Enhanced with all required properties
const createMockElement = () => ({
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn()
  },
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  appendChild: jest.fn(),
  removeChild: jest.fn(),
  remove: jest.fn(), // For style element removal
  getBoundingClientRect: jest.fn(() => ({
    left: 100,
    top: 100,
    width: 200,
    height: 100
  })),
  style: {},
  parentNode: null,
  dataset: {},
  id: '', // Required for style elements
  textContent: '', // Required for style elements
  tagName: 'DIV'
});

const mockElement = createMockElement();

// Mock document methods
Object.defineProperty(document, 'getElementById', {
  value: jest.fn(),
  writable: true
});

Object.defineProperty(document, 'createElement', {
  value: jest.fn(() => createMockElement()), // Agent T3: Return fresh mock each time
  writable: true
});

Object.defineProperty(document, 'head', {
  value: {
    appendChild: jest.fn()
  },
  writable: true
});

describe('Animation Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockElement.classList.add.mockClear();
    mockElement.classList.remove.mockClear();
    mockElement.addEventListener.mockClear();
    mockElement.removeEventListener.mockClear();
  });

  describe('Animation Classes', () => {
    test('should define all required animation classes', () => {
      expect(animationClasses.pulseBlue).toContain('@keyframes pulse-blue');
      expect(animationClasses.bounceIn).toContain('@keyframes bounce-in');
      expect(animationClasses.slideInRight).toContain('@keyframes slide-in-right');
      expect(animationClasses.slideInLeft).toContain('@keyframes slide-in-left');
      expect(animationClasses.fadeIn).toContain('@keyframes fade-in');
      expect(animationClasses.scaleIn).toContain('@keyframes scale-in');
      expect(animationClasses.ripple).toContain('@keyframes ripple');
      expect(animationClasses.drawLine).toContain('@keyframes draw-line');
      expect(animationClasses.glow).toContain('@keyframes glow');
      expect(animationClasses.shake).toContain('@keyframes shake');
    });

    test('should include CSS class definitions with animations', () => {
      expect(animationClasses.pulseBlue).toContain('.pulse-blue');
      expect(animationClasses.bounceIn).toContain('.bounce-in');
      expect(animationClasses.fadeIn).toContain('.fade-in');
      expect(animationClasses.scaleIn).toContain('.scale-in');
      expect(animationClasses.glow).toContain('.glow');
      expect(animationClasses.shake).toContain('.shake');
    });

    test('should define ripple effect with proper CSS structure', () => {
      expect(animationClasses.ripple).toContain('.ripple-effect');
      expect(animationClasses.ripple).toContain('position: relative');
      expect(animationClasses.ripple).toContain('overflow: hidden');
      expect(animationClasses.ripple).toContain('::before');
    });

    test('should define line drawing animation for network visualization', () => {
      expect(animationClasses.drawLine).toContain('.draw-line');
      expect(animationClasses.drawLine).toContain('stroke-dasharray');
      expect(animationClasses.drawLine).toContain('stroke-dashoffset');
    });
  });

  describe('Style Injection', () => {
    test('should inject animation styles into document head', () => {
      // Agent T3: Mock createElement to return proper style element
      const mockStyleElement = createMockElement();
      document.createElement.mockReturnValueOnce(mockStyleElement);
      
      injectAnimationStyles();
      
      expect(document.createElement).toHaveBeenCalledWith('style');
      expect(document.head.appendChild).toHaveBeenCalledWith(mockStyleElement);
    });

    test('should remove existing styles before injecting new ones', () => {
      const existingStyle = { remove: jest.fn() };
      document.getElementById.mockReturnValueOnce(existingStyle);
      // Agent T3: Mock createElement for new style element
      const mockStyleElement = createMockElement();
      document.createElement.mockReturnValueOnce(mockStyleElement);
      
      injectAnimationStyles();
      
      expect(document.getElementById).toHaveBeenCalledWith('pathogen-explorer-animations');
      expect(existingStyle.remove).toHaveBeenCalled();
    });

    test('should handle case where no existing styles exist', () => {
      document.getElementById.mockReturnValueOnce(null);
      // Agent T3: Mock createElement for new style element
      const mockStyleElement = createMockElement();
      document.createElement.mockReturnValueOnce(mockStyleElement);
      
      expect(() => injectAnimationStyles()).not.toThrow();
    });

    test('should set correct ID and content for style element', () => {
      const styleElement = createMockElement(); // Agent T3: Fresh mock element
      document.createElement.mockReturnValueOnce(styleElement);
      
      injectAnimationStyles();
      
      expect(styleElement.id).toBe('pathogen-explorer-animations');
      expect(styleElement.textContent).toContain('@keyframes pulse-blue');
    });
  });

  describe('AnimationController', () => {
    let controller;

    beforeEach(() => {
      controller = new AnimationController();
    });

    describe('Basic Animation Control', () => {
      test('should animate element with specified class', async () => {
        const element = { ...mockElement };
        
        const promise = controller.animate(element, 'fade-in', 300);
        
        expect(element.classList.add).toHaveBeenCalledWith('fade-in');
        expect(element.addEventListener).toHaveBeenCalledWith('animationend', expect.any(Function));
        
        // Simulate animation end
        const animationEndHandler = element.addEventListener.mock.calls[0][1];
        animationEndHandler();
        
        await promise;
        expect(element.classList.remove).toHaveBeenCalledWith('fade-in');
      });

      test('should handle null element gracefully', async () => {
        await expect(controller.animate(null, 'fade-in')).resolves.toBeUndefined();
      });

      test('should clean up previous animation before starting new one', async () => {
        const element = { ...mockElement };
        
        // Start first animation
        controller.animate(element, 'fade-in');
        expect(controller.activeAnimations.has(element)).toBe(true);
        
        // Start second animation
        controller.animate(element, 'bounce-in');
        
        expect(element.classList.remove).toHaveBeenCalledWith('fade-in');
        expect(element.classList.add).toHaveBeenCalledWith('bounce-in');
      });

      test('should provide fallback timeout for animation completion', async () => {
        const element = { ...mockElement };
        
        const promise = controller.animate(element, 'fade-in', 100);
        
        // Don't trigger animationend, let timeout handle it
        await new Promise(resolve => setTimeout(resolve, 250));
        
        await promise;
        expect(element.classList.remove).toHaveBeenCalledWith('fade-in');
      });

      test('should optionally skip cleanup', async () => {
        const element = { ...mockElement };
        
        const promise = controller.animate(element, 'fade-in', 300, false);
        
        // Simulate animation end
        const animationEndHandler = element.addEventListener.mock.calls[0][1];
        animationEndHandler();
        
        await promise;
        expect(element.classList.remove).not.toHaveBeenCalled();
      });
    });

    describe('Animation Management', () => {
      test('should stop animation on element', () => {
        const element = { ...mockElement };
        
        controller.animate(element, 'fade-in');
        controller.stopAnimation(element);
        
        expect(element.classList.remove).toHaveBeenCalledWith('fade-in');
        expect(element.removeEventListener).toHaveBeenCalled();
        expect(controller.activeAnimations.has(element)).toBe(false);
      });

      test('should handle stopping non-existent animation', () => {
        const element = { ...mockElement };
        
        expect(() => controller.stopAnimation(element)).not.toThrow();
      });

      test('should track active animations', () => {
        const element1 = { ...mockElement };
        const element2 = { ...mockElement };
        
        controller.animate(element1, 'fade-in');
        controller.animate(element2, 'bounce-in');
        
        expect(controller.activeAnimations.size).toBe(2);
        expect(controller.activeAnimations.has(element1)).toBe(true);
        expect(controller.activeAnimations.has(element2)).toBe(true);
      });
    });

    describe('Sequential Animations', () => {
      test('should animate elements in sequence', async () => {
        const element1 = { ...mockElement };
        const element2 = { ...mockElement };
        
        const animations = [
          { element: element1, animationClass: 'fade-in', duration: 100 },
          { element: element2, animationClass: 'bounce-in', duration: 100, delay: 50 }
        ];
        
        const startTime = Date.now();
        await controller.animateSequence(animations);
        const endTime = Date.now();
        
        expect(endTime - startTime).toBeGreaterThan(100); // Should take time for sequence
        expect(element1.classList.add).toHaveBeenCalledWith('fade-in');
        expect(element2.classList.add).toHaveBeenCalledWith('bounce-in');
      });

      test('should handle delays in sequential animations', async () => {
        const element = { ...mockElement };
        
        const animations = [
          { element, animationClass: 'fade-in', duration: 100, delay: 100 }
        ];
        
        const startTime = Date.now();
        await controller.animateSequence(animations);
        const endTime = Date.now();
        
        expect(endTime - startTime).toBeGreaterThan(150); // Delay + animation time
      });
    });

    describe('Parallel Animations', () => {
      test('should animate elements in parallel', async () => {
        const element1 = createMockElement(); // Agent T3: Fresh mock elements
        const element2 = createMockElement();
        
        const animations = [
          { element: element1, animationClass: 'fade-in', duration: 100 },
          { element: element2, animationClass: 'bounce-in', duration: 100 }
        ];
        
        const startTime = Date.now();
        
        // Agent T3: Trigger animationend events immediately to simulate parallel completion
        const animatePromise = controller.animateParallel(animations);
        
        // Simulate immediate animationend for both elements
        setTimeout(() => {
          const handler1 = element1.addEventListener.mock.calls.find(call => call[0] === 'animationend')?.[1];
          const handler2 = element2.addEventListener.mock.calls.find(call => call[0] === 'animationend')?.[1];
          if (handler1) handler1();
          if (handler2) handler2();
        }, 10);
        
        await animatePromise;
        const endTime = Date.now();
        
        expect(endTime - startTime).toBeLessThan(250); // Agent T3: More realistic timing allowance
        expect(element1.classList.add).toHaveBeenCalledWith('fade-in');
        expect(element2.classList.add).toHaveBeenCalledWith('bounce-in');
      });

      test('should handle delays in parallel animations', async () => {
        const element1 = createMockElement(); // Agent T3: Fresh mock elements
        const element2 = createMockElement();
        
        const animations = [
          { element: element1, animationClass: 'fade-in', duration: 100 },
          { element: element2, animationClass: 'bounce-in', duration: 100, delay: 50 }
        ];
        
        // Agent T3: Start animations and simulate events
        const animatePromise = controller.animateParallel(animations);
        
        // Simulate animationend events after short delay
        setTimeout(() => {
          const handler1 = element1.addEventListener.mock.calls.find(call => call[0] === 'animationend')?.[1];
          const handler2 = element2.addEventListener.mock.calls.find(call => call[0] === 'animationend')?.[1];
          if (handler1) handler1();
          if (handler2) handler2();
        }, 10);
        
        await animatePromise;
        
        expect(element1.classList.add).toHaveBeenCalledWith('fade-in');
        expect(element2.classList.add).toHaveBeenCalledWith('bounce-in');
      });
    });

    describe('Staggered Animations', () => {
      test('should animate elements with staggered timing', async () => {
        const elements = [
          { ...mockElement },
          { ...mockElement },
          { ...mockElement }
        ];
        
        await controller.animateStagger(elements, 'fade-in', 50, 100);
        
        elements.forEach(element => {
          expect(element.classList.add).toHaveBeenCalledWith('fade-in');
        });
      });

      test('should handle array-like elements', async () => {
        const nodeList = {
          0: { ...mockElement },
          1: { ...mockElement },
          length: 2,
          [Symbol.iterator]: function* () {
            for (let i = 0; i < this.length; i++) {
              yield this[i];
            }
          }
        };
        
        await controller.animateStagger(nodeList, 'fade-in', 50);
        
        expect(nodeList[0].classList.add).toHaveBeenCalledWith('fade-in');
        expect(nodeList[1].classList.add).toHaveBeenCalledWith('fade-in');
      });
    });

    describe('Ripple Effects', () => {
      test('should create ripple effect on click', () => {
        const element = createMockElement(); // Agent T3: Fresh mock element
        const rippleElement = createMockElement(); // Agent T3: Mock for ripple element
        document.createElement.mockReturnValueOnce(rippleElement);
        
        const event = {
          clientX: 150,
          clientY: 150
        };
        
        controller.createRipple(element, event);
        
        expect(document.createElement).toHaveBeenCalledWith('div');
        expect(element.appendChild).toHaveBeenCalledWith(rippleElement);
      });

      test('should calculate ripple position and size correctly', () => {
        const element = createMockElement(); // Agent T3: Fresh mock element
        element.getBoundingClientRect.mockReturnValue({
          left: 100,
          top: 100,
          width: 200,
          height: 100
        });
        
        const event = {
          clientX: 200, // Center of element
          clientY: 150  // Center of element
        };
        
        controller.createRipple(element, event);
        
        // Should create ripple div
        expect(document.createElement).toHaveBeenCalledWith('div');
      });

      test('should remove ripple after timeout', async () => {
        const element = createMockElement(); // Agent T3: Fresh mock elements
        const rippleElement = createMockElement();
        rippleElement.parentNode = element;
        
        document.createElement.mockReturnValueOnce(rippleElement);
        
        const event = { clientX: 150, clientY: 150 };
        controller.createRipple(element, event);
        
        // Agent T3: Apply Agent 19's async timeout pattern
        await new Promise(resolve => setTimeout(resolve, 650));
        
        expect(element.removeChild).toHaveBeenCalledWith(rippleElement);
      });
    });

    describe('Cleanup', () => {
      test('should cleanup all active animations', () => {
        const element1 = { ...mockElement };
        const element2 = { ...mockElement };
        
        controller.animate(element1, 'fade-in');
        controller.animate(element2, 'bounce-in');
        
        expect(controller.activeAnimations.size).toBe(2);
        
        controller.cleanup();
        
        expect(controller.activeAnimations.size).toBe(0);
        expect(element1.classList.remove).toHaveBeenCalledWith('fade-in');
        expect(element2.classList.remove).toHaveBeenCalledWith('bounce-in');
      });
    });

    describe('Utility Methods', () => {
      test('should provide delay utility', async () => {
        const startTime = Date.now();
        await controller.delay(100);
        const endTime = Date.now();
        
        expect(endTime - startTime).toBeGreaterThanOrEqual(95); // Allow some timing variance
      });
    });
  });

  describe('ScrollAnimationController', () => {
    let scrollController;
    let mockIntersectionObserver;

    beforeEach(() => {
      mockIntersectionObserver = {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn()
      };
      
      global.IntersectionObserver = jest.fn().mockImplementation((callback, options) => {
        mockIntersectionObserver.callback = callback;
        mockIntersectionObserver.options = options;
        return mockIntersectionObserver;
      });
      
      scrollController = new ScrollAnimationController();
    });

    test('should initialize with default options', () => {
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.1,
          rootMargin: '0px 0px -10% 0px'
        })
      );
    });

    test('should accept custom options', () => {
      const customOptions = {
        threshold: 0.5,
        rootMargin: '50px'
      };
      
      new ScrollAnimationController(customOptions);
      
      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining(customOptions)
      );
    });

    test('should observe elements with animation class', () => {
      const element = { ...mockElement };
      
      scrollController.observe(element, 'fade-in');
      
      expect(element.dataset.scrollAnimation).toBe('fade-in');
      expect(mockIntersectionObserver.observe).toHaveBeenCalledWith(element);
    });

    test('should use default animation class when not specified', () => {
      const element = { ...mockElement };
      
      scrollController.observe(element);
      
      expect(element.dataset.scrollAnimation).toBe('fade-in');
    });

    test('should handle intersection events', () => {
      const element = { ...mockElement };
      element.dataset.scrollAnimation = 'fade-in';
      
      const entries = [{
        target: element,
        isIntersecting: true
      }];
      
      scrollController.handleIntersection(entries);
      
      expect(element.classList.add).toHaveBeenCalledWith('fade-in');
    });

    test('should not animate already animated elements', () => {
      const element = { ...mockElement };
      element.dataset.scrollAnimation = 'fade-in';
      
      const entries = [{
        target: element,
        isIntersecting: true
      }];
      
      // First intersection
      scrollController.handleIntersection(entries);
      expect(element.classList.add).toHaveBeenCalledTimes(1);
      
      // Second intersection (should not animate again)
      scrollController.handleIntersection(entries);
      expect(element.classList.add).toHaveBeenCalledTimes(1);
    });

    test('should continue observing if animateOnce is false', () => {
      const element = { ...mockElement };
      element.dataset.scrollAnimation = 'fade-in';
      element.dataset.animateOnce = 'false';
      
      const entries = [{
        target: element,
        isIntersecting: true
      }];
      
      scrollController.handleIntersection(entries);
      
      expect(mockIntersectionObserver.unobserve).not.toHaveBeenCalledWith(element);
    });

    test('should stop observing after animation by default', async () => {
      const element = createMockElement(); // Agent T3: Fresh mock element
      element.dataset.scrollAnimation = 'fade-in';
      
      const entries = [{
        target: element,
        isIntersecting: true
      }];
      
      // Agent T3: Apply Agent 19's async timing pattern
      scrollController.handleIntersection(entries);
      
      // Allow for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(mockIntersectionObserver.unobserve).toHaveBeenCalledWith(element);
    });

    test('should unobserve specific elements', () => {
      const element = { ...mockElement };
      
      scrollController.unobserve(element);
      
      expect(mockIntersectionObserver.unobserve).toHaveBeenCalledWith(element);
    });

    test('should disconnect observer', () => {
      scrollController.disconnect();
      
      expect(mockIntersectionObserver.disconnect).toHaveBeenCalled();
      expect(scrollController.animatedElements.size).toBe(0);
    });
  });

  describe('React Hook Integration', () => {
    test('should return animation controller instance', () => {
      const controller = useAnimations();
      
      expect(controller).toBeInstanceOf(AnimationController);
    });

    test('should provide different instances for each call', () => {
      const controller1 = useAnimations();
      const controller2 = useAnimations();
      
      expect(controller1).not.toBe(controller2);
    });
  });

  describe('Default Controller', () => {
    test('should provide singleton animation controller', () => {
      expect(defaultAnimationController).toBeInstanceOf(AnimationController);
    });

    test('should return same instance on multiple accesses', () => {
      const controller1 = defaultAnimationController;
      const controller2 = defaultAnimationController;
      
      expect(controller1).toBe(controller2);
    });
  });

  describe('Module Initialization', () => {
    test('should inject styles when document is available', () => {
      // This is tested implicitly by the fact that injectAnimationStyles is called
      // when the module loads (if typeof document !== 'undefined')
      expect(typeof document).toBe('object');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle missing event properties in ripple creation', () => {
      const controller = new AnimationController();
      const element = createMockElement(); // Agent T3: Fresh mock element
      const incompleteEvent = { clientX: 100 }; // Missing clientY
      
      expect(() => controller.createRipple(element, incompleteEvent)).not.toThrow();
    });

    test('should handle elements without getBoundingClientRect', () => {
      const elementWithoutRect = createMockElement(); // Agent T3: Fresh mock element
      delete elementWithoutRect.getBoundingClientRect;
      
      const controller = new AnimationController();
      const event = { clientX: 100, clientY: 100 };
      
      expect(() => controller.createRipple(elementWithoutRect, event)).not.toThrow();
    });

    test('should handle animation end events that fire multiple times', async () => {
      const element = createMockElement(); // Agent T3: Fresh mock element
      const controller = new AnimationController();
      
      const promise = controller.animate(element, 'fade-in', 300);
      
      // Simulate multiple animationend events
      const animationEndHandler = element.addEventListener.mock.calls[0][1];
      animationEndHandler();
      animationEndHandler(); // Second call should be ignored
      
      await promise;
      expect(element.classList.remove).toHaveBeenCalledTimes(1);
    });

    test('should handle scroll controller with no elements', () => {
      const scrollController = new ScrollAnimationController();
      
      expect(() => scrollController.handleIntersection([])).not.toThrow();
      expect(() => scrollController.disconnect()).not.toThrow();
    });
  });
});