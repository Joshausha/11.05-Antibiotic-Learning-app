/**
 * Animation Utilities
 * Provides smooth animations and transitions for tactile interactions
 * Enhances the pathogen exploration experience with visual feedback
 */

// CSS animation classes for dynamic injection
export const animationClasses = {
  // Pulse animations for highlights
  pulseBlue: `
    @keyframes pulse-blue {
      0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
      50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    }
    .pulse-blue { animation: pulse-blue 2s infinite; }
  `,
  
  // Bounce animation for selections
  bounceIn: `
    @keyframes bounce-in {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.1); opacity: 0.8; }
      70% { transform: scale(0.9); opacity: 0.9; }
      100% { transform: scale(1); opacity: 1; }
    }
    .bounce-in { animation: bounce-in 0.5s ease-out; }
  `,
  
  // Slide animations for panels
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
  
  // Fade animations
  fadeIn: `
    @keyframes fade-in {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .fade-in { animation: fade-in 0.4s ease-out; }
  `,
  
  // Scale animations for network nodes
  scaleIn: `
    @keyframes scale-in {
      0% { transform: scale(0) rotate(180deg); opacity: 0; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .scale-in { animation: scale-in 0.3s ease-out; }
  `,
  
  // Ripple effect for button interactions
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
  
  // Connection line drawing animation
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
  
  // Glow effect for active elements
  glow: `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
      50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); }
    }
    .glow { animation: glow 2s ease-in-out infinite; }
  `,
  
  // Shake animation for errors or attention
  shake: `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .shake { animation: shake 0.5s ease-in-out; }
  `
};

// Inject animation styles into the document
export const injectAnimationStyles = () => {
  const styleId = 'pathogen-explorer-animations';
  
  // Remove existing styles if they exist
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create and inject new style element
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = Object.values(animationClasses).join('\n');
  document.head.appendChild(style);
};

// Animation controller class for managing complex animations
export class AnimationController {
  constructor() {
    this.activeAnimations = new Map();
    this.animationQueue = [];
    this.isProcessing = false;
  }
  
  // Add animation to an element with cleanup
  animate(element, animationClass, duration = 300, cleanup = true) {
    return new Promise((resolve) => {
      if (!element) {
        resolve();
        return;
      }
      
      // Clean up previous animation if exists
      if (this.activeAnimations.has(element)) {
        this.stopAnimation(element);
      }
      
      // Apply animation class
      element.classList.add(animationClass);
      
      // Set up cleanup
      const animationHandler = () => {
        if (cleanup) {
          element.classList.remove(animationClass);
        }
        element.removeEventListener('animationend', animationHandler);
        this.activeAnimations.delete(element);
        resolve();
      };
      
      element.addEventListener('animationend', animationHandler);
      this.activeAnimations.set(element, { animationClass, handler: animationHandler });
      
      // Fallback timeout in case animationend doesn't fire
      setTimeout(() => {
        if (this.activeAnimations.has(element)) {
          animationHandler();
        }
      }, duration + 100);
    });
  }
  
  // Stop animation on element
  stopAnimation(element) {
    const animation = this.activeAnimations.get(element);
    if (animation) {
      element.classList.remove(animation.animationClass);
      element.removeEventListener('animationend', animation.handler);
      this.activeAnimations.delete(element);
    }
  }
  
  // Animate multiple elements in sequence
  async animateSequence(animations) {
    for (const { element, animationClass, duration, delay = 0 } of animations) {
      if (delay > 0) {
        await this.delay(delay);
      }
      await this.animate(element, animationClass, duration);
    }
  }
  
  // Animate multiple elements in parallel
  async animateParallel(animations) {
    const promises = animations.map(({ element, animationClass, duration, delay = 0 }) => {
      return new Promise(async (resolve) => {
        if (delay > 0) {
          await this.delay(delay);
        }
        await this.animate(element, animationClass, duration);
        resolve();
      });
    });
    
    await Promise.all(promises);
  }
  
  // Staggered animation for lists
  async animateStagger(elements, animationClass, staggerDelay = 100, duration = 300) {
    const animations = Array.from(elements).map((element, index) => ({
      element,
      animationClass,
      duration,
      delay: index * staggerDelay
    }));
    
    await this.animateParallel(animations);
  }
  
  // Utility delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Create ripple effect on click
  createRipple(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
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
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }
  
  // Cleanup all animations
  cleanup() {
    this.activeAnimations.forEach((animation, element) => {
      this.stopAnimation(element);
    });
    this.activeAnimations.clear();
  }
}

// Intersection Observer for scroll-triggered animations
export class ScrollAnimationController {
  constructor(options = {}) {
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
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
        const animationClass = entry.target.dataset.scrollAnimation || 'fade-in';
        entry.target.classList.add(animationClass);
        this.animatedElements.add(entry.target);
        
        // Optional: stop observing after animation
        if (entry.target.dataset.animateOnce !== 'false') {
          this.observer.unobserve(entry.target);
        }
      }
    });
  }
  
  observe(element, animationClass = 'fade-in') {
    element.dataset.scrollAnimation = animationClass;
    this.observer.observe(element);
  }
  
  unobserve(element) {
    this.observer.unobserve(element);
    this.animatedElements.delete(element);
  }
  
  disconnect() {
    this.observer.disconnect();
    this.animatedElements.clear();
  }
}

// Hook for using animations in React components  
// Note: This requires React to be imported in the component that uses it
export const useAnimations = () => {
  const animationController = new AnimationController();
  
  // This would be used in a React component with proper useEffect import
  // React.useEffect(() => {
  //   injectAnimationStyles();
  //   
  //   return () => {
  //     animationController.cleanup();
  //   };
  // }, []);
  
  return animationController;
};

// Default animation controller instance
export const defaultAnimationController = new AnimationController();

// Initialize animations when module loads
if (typeof document !== 'undefined') {
  injectAnimationStyles();
}