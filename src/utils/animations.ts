/**
 * Animation Utilities
 * Provides smooth animations and transitions for tactile interactions
 * Enhances the pathogen exploration experience with visual feedback
 */

/**
 * Type definitions for animation utilities
 */

interface AnimationClasses {
  [key: string]: string;
}

interface AnimationInfo {
  animationClass: string;
  handler: () => void;
}

interface AnimationConfig {
  element: HTMLElement | null | undefined;
  animationClass: string;
  duration?: number;
  delay?: number;
}

interface ScrollAnimationOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

interface IntersectionEntry {
  target: HTMLElement;
  isIntersecting: boolean;
  [key: string]: any;
}

// CSS animation classes for dynamic injection
export const animationClasses: AnimationClasses = {
  pulseBlue: `
    @keyframes pulse-blue {
      0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
      50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    }
    .pulse-blue { animation: pulse-blue 2s infinite; }
  `,

  bounceIn: `
    @keyframes bounce-in {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.1); opacity: 0.8; }
      70% { transform: scale(0.9); opacity: 0.9; }
      100% { transform: scale(1); opacity: 1; }
    }
    .bounce-in { animation: bounce-in 0.5s ease-out; }
  `,

  slideInRight: `
    @keyframes slide-in-right {
      0% { transform: translateX(100%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    .slide-in-right { animation: slide-in-right 0.3s ease-out; }
  `,

  slideInLeft: `
    @keyframes slide-in-left {
      0% { transform: translateX(-100%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    .slide-in-left { animation: slide-in-left 0.3s ease-out; }
  `,

  fadeIn: `
    @keyframes fade-in {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .fade-in { animation: fade-in 0.4s ease-out; }
  `,

  scaleIn: `
    @keyframes scale-in {
      0% { transform: scale(0) rotate(180deg); opacity: 0; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .scale-in { animation: scale-in 0.3s ease-out; }
  `,

  ripple: `
    @keyframes ripple {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(4); opacity: 0; }
    }
    .ripple-effect {
      position: relative;
      overflow: hidden;
    }
    .ripple-effect::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }
    .ripple-effect:active::before {
      width: 300px;
      height: 300px;
    }
  `,

  drawLine: `
    @keyframes draw-line {
      0% { stroke-dashoffset: 100%; }
      100% { stroke-dashoffset: 0%; }
    }
    .draw-line {
      stroke-dasharray: 100%;
      animation: draw-line 1s ease-in-out;
    }
  `,

  glow: `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
      50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); }
    }
    .glow { animation: glow 2s ease-in-out infinite; }
  `,

  shake: `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .shake { animation: shake 0.5s ease-in-out; }
  `
};

/**
 * Inject animation styles into the document
 */
export const injectAnimationStyles = (): void => {
  const styleId = 'pathogen-explorer-animations';

  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = Object.values(animationClasses).join('\n');
  document.head.appendChild(style);
};

/**
 * Animation controller class for managing complex animations
 */
export class AnimationController {
  private activeAnimations: Map<HTMLElement, AnimationInfo>;
  private animationQueue: any[];
  private isProcessing: boolean;

  constructor() {
    this.activeAnimations = new Map();
    this.animationQueue = [];
    this.isProcessing = false;
  }

  /**
   * Add animation to an element with cleanup
   */
  animate(
    element: HTMLElement | null | undefined,
    animationClass: string,
    duration: number = 300,
    cleanup: boolean = true
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!element) {
        resolve();
        return;
      }

      if (this.activeAnimations.has(element)) {
        this.stopAnimation(element);
      }

      element.classList.add(animationClass);

      let hasResolved = false;
      const animationHandler = (): void => {
        if (hasResolved) return;
        hasResolved = true;

        if (cleanup) {
          element.classList.remove(animationClass);
        }
        element.removeEventListener('animationend', animationHandler);
        this.activeAnimations.delete(element);
        resolve();
      };

      element.addEventListener('animationend', animationHandler);
      this.activeAnimations.set(element, { animationClass, handler: animationHandler });

      setTimeout(() => {
        if (this.activeAnimations.has(element)) {
          animationHandler();
        }
      }, duration + 100);
    });
  }

  /**
   * Stop animation on element
   */
  stopAnimation(element: HTMLElement): void {
    const animation = this.activeAnimations.get(element);
    if (animation) {
      element.classList.remove(animation.animationClass);
      element.removeEventListener('animationend', animation.handler);
      this.activeAnimations.delete(element);
    }
  }

  /**
   * Animate multiple elements in sequence
   */
  async animateSequence(animations: AnimationConfig[]): Promise<void> {
    for (const { element, animationClass, duration, delay = 0 } of animations) {
      if (delay > 0) {
        await this.delay(delay);
      }
      await this.animate(element, animationClass, duration);
    }
  }

  /**
   * Animate multiple elements in parallel
   */
  async animateParallel(animations: AnimationConfig[]): Promise<void> {
    const promises = animations.map(({ element, animationClass, duration, delay = 0 }) => {
      return new Promise<void>(async (resolve) => {
        if (delay > 0) {
          await this.delay(delay);
        }
        await this.animate(element, animationClass, duration);
        resolve();
      });
    });

    await Promise.all(promises);
  }

  /**
   * Staggered animation for lists
   */
  async animateStagger(
    elements: HTMLElement[] | NodeListOf<HTMLElement>,
    animationClass: string,
    staggerDelay: number = 100,
    duration: number = 300
  ): Promise<void> {
    const animations = Array.from(elements).map((element, index) => ({
      element,
      animationClass,
      duration,
      delay: index * staggerDelay
    }));

    await this.animateParallel(animations);
  }

  /**
   * Utility delay function
   */
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create ripple effect on click
   */
  createRipple(element: HTMLElement | null | undefined, event: MouseEvent | null | undefined): void {
    try {
      if (!element || !event) {
        console.warn('Missing element or event for ripple creation');
        return;
      }

      const clientX = event.clientX || 0;
      const clientY = event.clientY || 0;

      const ripple = document.createElement('div');

      let rect: DOMRect | { left: number; top: number; width: number; height: number };
      if (typeof element.getBoundingClientRect === 'function') {
        rect = element.getBoundingClientRect();
      } else {
        rect = { left: 0, top: 0, width: 100, height: 100 };
        console.warn('Element missing getBoundingClientRect method, using fallback values');
      }

      const size = Math.max(rect.width, rect.height);
      const x = clientX - rect.left - size / 2;
      const y = clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
        z-index: 1000;
      `;

      element.style.position = 'relative';
      element.appendChild(ripple);

      setTimeout(() => {
        try {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        } catch (error) {
          console.warn('Error removing ripple element:', error);
        }
      }, 600);
    } catch (error) {
      console.error('Error creating ripple effect:', error);
    }
  }

  /**
   * Cleanup all animations
   */
  cleanup(): void {
    this.activeAnimations.forEach((animation, element) => {
      this.stopAnimation(element);
    });
    this.activeAnimations.clear();
  }
}

/**
 * Intersection Observer for scroll-triggered animations
 */
export class ScrollAnimationController {
  private observer: IntersectionObserver;
  private animatedElements: Set<HTMLElement>;
  private options: ScrollAnimationOptions;

  constructor(options: ScrollAnimationOptions = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px',
      ...options
    };

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    );

    this.animatedElements = new Set();
  }

  /**
   * Handle intersection changes
   */
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    try {
      if (!entries || !Array.isArray(entries)) {
        return;
      }

      entries.forEach((entry) => {
        try {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting && !this.animatedElements.has(target)) {
            const animationClass = target.dataset.scrollAnimation || 'fade-in';
            target.classList.add(animationClass);
            this.animatedElements.add(target);

            if (target.dataset.animateOnce !== 'false') {
              this.observer.unobserve(target);
            }
          }
        } catch (error) {
          console.warn('Error handling intersection entry:', error);
        }
      });
    } catch (error) {
      console.error('Error in handleIntersection:', error);
    }
  }

  /**
   * Observe an element for scroll animation
   */
  observe(element: HTMLElement, animationClass: string = 'fade-in'): void {
    element.dataset.scrollAnimation = animationClass;
    this.observer.observe(element);
  }

  /**
   * Stop observing an element
   */
  unobserve(element: HTMLElement): void {
    this.observer.unobserve(element);
    this.animatedElements.delete(element);
  }

  /**
   * Disconnect the observer
   */
  disconnect(): void {
    try {
      if (this.observer && typeof this.observer.disconnect === 'function') {
        this.observer.disconnect();
      }
    } catch (error) {
      console.warn('Error disconnecting scroll animation observer:', error);
    }
    this.animatedElements.clear();
  }
}

/**
 * Hook for using animations in React components
 */
export const useAnimations = (): AnimationController => {
  const animationController = new AnimationController();

  return animationController;
};

/**
 * Default animation controller instance
 */
export const defaultAnimationController = new AnimationController();

/**
 * Initialize animations when module loads
 */
if (typeof document !== 'undefined') {
  injectAnimationStyles();
}
