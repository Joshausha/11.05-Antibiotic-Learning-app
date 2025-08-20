/**
 * Northwestern Performance Optimization System
 * 
 * Advanced performance optimization utilities for the Northwestern spatial layout system
 * with clinical workflow prioritization, memory management, and virtualization support.
 * 
 * Created by: Agent 3.4 - Performance & Mobile Optimization Specialist
 * Phase: 3.4 - Performance Optimization & Mobile Clinical Workflows
 * Integration: Optimizes Agent 3.1, 3.2, 3.3 foundations for clinical performance
 * 
 * Features:
 * - Advanced virtualization for large antibiotic datasets (30+ current, 100+ future)
 * - Intelligent render prioritization based on clinical urgency
 * - Memory management for extended clinical sessions (<50MB footprint)
 * - Real-time performance monitoring with clinical workflow analytics
 * - Emergency mode optimizations for <30 second clinical access
 * - Battery optimization for clinical device preservation
 * 
 * Performance Targets:
 * - Initial Load: <2000ms for complete Northwestern system
 * - Filter Application: <100ms for real-time clinical feedback
 * - Spatial Layout: <1000ms for 30 antibiotic positioning
 * - Memory Usage: <50MB sustained during clinical sessions
 * - Emergency Access: <30s to any critical clinical information
 * 
 * @module northwesternPerformanceOptimizer
 */

/**
 * Virtualization system for efficient rendering of large antibiotic datasets
 */
export class VirtualizationManager {
  constructor(options = {}) {
    this.config = {
      bufferSize: options.bufferSize || 5,
      itemHeight: options.itemHeight || 120,
      overscan: options.overscan || 3,
      enableIntersectionObserver: options.enableIntersectionObserver !== false,
      clinicalPriority: options.clinicalPriority || false
    };
    
    this.virtualizedData = new Map();
    this.visibleRange = { start: 0, end: 0 };
    this.intersectionObserver = null;
    this.performanceMetrics = {
      renderCount: 0,
      visibilityCalculations: 0,
      lastRenderTime: 0
    };
    
    this.initializeIntersectionObserver();
  }

  /**
   * Initialize intersection observer for visibility tracking
   */
  initializeIntersectionObserver() {
    if (!this.config.enableIntersectionObserver || !('IntersectionObserver' in window)) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        const antibioticId = element.dataset.antibioticId;
        
        if (antibioticId) {
          this.updateVisibilityState(antibioticId, entry.isIntersecting);
        }
      });
    }, {
      rootMargin: `${this.config.bufferSize * this.config.itemHeight}px`,
      threshold: 0.1
    });
  }

  /**
   * Create virtualized grid for large antibiotic datasets
   * @param {Array} antibiotics - Complete antibiotic dataset
   * @param {Object} viewport - Current viewport dimensions and scroll position
   * @returns {Object} Virtualized grid data with visible items and metadata
   */
  createVirtualizedGrid(antibiotics, viewport) {
    const startTime = performance.now();
    
    const { width, height, scrollTop = 0, scrollLeft = 0 } = viewport;
    const itemsPerRow = Math.floor(width / (this.config.itemHeight + 16)); // Account for gaps
    const totalRows = Math.ceil(antibiotics.length / itemsPerRow);
    
    // Calculate visible range with buffer
    const visibleStartRow = Math.max(0, Math.floor(scrollTop / this.config.itemHeight) - this.config.overscan);
    const visibleEndRow = Math.min(totalRows, Math.ceil((scrollTop + height) / this.config.itemHeight) + this.config.overscan);
    
    const visibleStartIndex = visibleStartRow * itemsPerRow;
    const visibleEndIndex = Math.min(antibiotics.length, visibleEndRow * itemsPerRow);
    
    // Extract visible items with position metadata
    const visibleItems = antibiotics.slice(visibleStartIndex, visibleEndIndex).map((antibiotic, index) => {
      const absoluteIndex = visibleStartIndex + index;
      const row = Math.floor(absoluteIndex / itemsPerRow);
      const col = absoluteIndex % itemsPerRow;
      
      return {
        ...antibiotic,
        virtualIndex: absoluteIndex,
        gridPosition: { row, col },
        transform: `translate3d(${col * (this.config.itemHeight + 16)}px, ${row * (this.config.itemHeight + 16)}px, 0)`,
        priority: this.calculateClinicalPriority(antibiotic)
      };
    });
    
    this.visibleRange = { start: visibleStartIndex, end: visibleEndIndex };
    
    const renderTime = performance.now() - startTime;
    this.performanceMetrics.renderCount++;
    this.performanceMetrics.lastRenderTime = renderTime;
    this.performanceMetrics.visibilityCalculations++;
    
    // Warn if virtualization is taking too long
    if (renderTime > 16) { // 60fps = 16.67ms per frame
      console.warn(`Virtualization calculation took ${renderTime.toFixed(2)}ms (target: <16ms for 60fps)`);
    }
    
    return {
      visibleItems,
      totalHeight: totalRows * (this.config.itemHeight + 16),
      totalWidth: itemsPerRow * (this.config.itemHeight + 16),
      visibleRange: this.visibleRange,
      metadata: {
        totalItems: antibiotics.length,
        visibleItems: visibleItems.length,
        itemsPerRow,
        totalRows,
        renderTime
      }
    };
  }

  /**
   * Calculate clinical priority for render ordering
   * @param {Object} antibiotic - Antibiotic data object
   * @returns {number} Priority score (higher = more urgent)
   */
  calculateClinicalPriority(antibiotic) {
    if (!this.config.clinicalPriority) return 1;
    
    let priority = 1;
    
    // Emergency/sepsis coverage antibiotics get highest priority
    const emergencyAntibiotics = [
      'Vancomycin', 'Piperacillin-Tazobactam', 'Meropenem', 
      'Ceftriaxone', 'Azithromycin', 'Levofloxacin'
    ];
    
    if (emergencyAntibiotics.includes(antibiotic.name)) {
      priority += 10;
    }
    
    // Broad-spectrum antibiotics get higher priority
    if (antibiotic.spectrum === 'broad') {
      priority += 5;
    }
    
    // IV antibiotics get priority in clinical settings
    if (antibiotic.routes?.includes('IV')) {
      priority += 3;
    }
    
    // First-line antibiotics get priority
    if (antibiotic.clinicalRole === 'first-line') {
      priority += 2;
    }
    
    return priority;
  }

  /**
   * Update visibility state for intersection observer
   * @param {string} antibioticId - Antibiotic identifier
   * @param {boolean} isVisible - Current visibility state
   */
  updateVisibilityState(antibioticId, isVisible) {
    if (this.virtualizedData.has(antibioticId)) {
      this.virtualizedData.get(antibioticId).isVisible = isVisible;
    }
  }

  /**
   * Get performance metrics for monitoring
   * @returns {Object} Current performance statistics
   */
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      memoryUsage: this.estimateMemoryUsage(),
      visibleRange: this.visibleRange,
      virtualizationRatio: this.visibleRange.end - this.visibleRange.start
    };
  }

  /**
   * Estimate memory usage of virtualization system
   * @returns {number} Estimated memory usage in MB
   */
  estimateMemoryUsage() {
    const dataSize = this.virtualizedData.size * 2; // Rough estimate: 2KB per item
    const bufferSize = this.config.bufferSize * this.config.itemHeight * 0.001; // Buffer memory
    return (dataSize + bufferSize) / 1024; // Convert to MB
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    this.virtualizedData.clear();
  }
}

/**
 * Render prioritization system for clinical workflows
 */
export class RenderPrioritizationEngine {
  constructor(options = {}) {
    this.config = {
      emergencyMode: options.emergencyMode || false,
      maxConcurrentRenders: options.maxConcurrentRenders || 15,
      clinicalContext: options.clinicalContext || 'education',
      priorityThreshold: options.priorityThreshold || 5
    };
    
    this.renderQueue = [];
    this.activeRenders = new Set();
    this.priorityWeights = this.initializePriorityWeights();
    this.performanceHistory = [];
  }

  /**
   * Initialize priority weights for different clinical contexts
   * @returns {Object} Priority weight configuration
   */
  initializePriorityWeights() {
    const baseWeights = {
      emergency: 20,
      clinicalUrgency: 15,
      userInteraction: 10,
      spatialProximity: 8,
      drugClassRelevance: 6,
      educationalValue: 4,
      visualComplexity: 2
    };

    // Adjust weights based on clinical context
    if (this.config.emergencyMode) {
      baseWeights.emergency *= 2;
      baseWeights.clinicalUrgency *= 1.5;
      baseWeights.userInteraction *= 1.5;
    }

    if (this.config.clinicalContext === 'clinical') {
      baseWeights.clinicalUrgency *= 1.3;
      baseWeights.drugClassRelevance *= 1.3;
    }

    return baseWeights;
  }

  /**
   * Calculate render priority for antibiotic positions
   * @param {Array} positions - Array of positioned antibiotic objects
   * @param {Object} userFocus - Current user focus and interaction state
   * @returns {Array} Prioritized positions array for optimal rendering
   */
  calculateRenderPriority(positions, userFocus = {}) {
    const startTime = performance.now();
    
    const prioritized = positions.map(position => {
      const priority = this.calculatePositionPriority(position, userFocus);
      return {
        ...position,
        renderPriority: priority,
        renderOrder: 0 // Will be set during sorting
      };
    });

    // Sort by priority (highest first)
    prioritized.sort((a, b) => b.renderPriority - a.renderPriority);
    
    // Assign render order
    prioritized.forEach((position, index) => {
      position.renderOrder = index + 1;
    });

    const calculationTime = performance.now() - startTime;
    
    // Track performance
    this.performanceHistory.push({
      timestamp: Date.now(),
      calculationTime,
      positionCount: positions.length,
      averagePriority: prioritized.reduce((sum, p) => sum + p.renderPriority, 0) / prioritized.length
    });

    // Keep only recent history (last 100 calculations)
    if (this.performanceHistory.length > 100) {
      this.performanceHistory = this.performanceHistory.slice(-100);
    }

    // Warn if priority calculation is taking too long
    if (calculationTime > 10) {
      console.warn(`Render priority calculation took ${calculationTime.toFixed(2)}ms (target: <10ms)`);
    }

    return prioritized;
  }

  /**
   * Calculate individual position priority score
   * @param {Object} position - Positioned antibiotic object
   * @param {Object} userFocus - User focus context
   * @returns {number} Priority score
   */
  calculatePositionPriority(position, userFocus) {
    let priority = 0;
    const { antibiotic, gridPosition } = position;

    // Emergency antibiotic priority
    if (this.isEmergencyAntibiotic(antibiotic)) {
      priority += this.priorityWeights.emergency;
    }

    // Clinical urgency based on spectrum and indication
    priority += this.calculateClinicalUrgency(antibiotic) * this.priorityWeights.clinicalUrgency;

    // User interaction proximity
    if (userFocus.hoveredPosition) {
      const distance = this.calculateGridDistance(gridPosition, userFocus.hoveredPosition);
      priority += Math.max(0, this.priorityWeights.userInteraction - distance * 2);
    }

    // Active group membership
    if (userFocus.activeGroup && gridPosition.group === userFocus.activeGroup) {
      priority += this.priorityWeights.userInteraction;
    }

    // Spatial proximity to center (for initial render)
    const centerDistance = this.calculateCenterDistance(gridPosition);
    priority += Math.max(0, this.priorityWeights.spatialProximity - centerDistance);

    // Drug class relevance
    priority += this.calculateDrugClassRelevance(antibiotic) * this.priorityWeights.drugClassRelevance;

    // Educational value (for educational context)
    if (this.config.clinicalContext === 'education') {
      priority += this.calculateEducationalValue(antibiotic) * this.priorityWeights.educationalValue;
    }

    // Visual complexity (simpler charts render first in emergency mode)
    if (this.config.emergencyMode) {
      const complexity = this.calculateVisualComplexity(antibiotic);
      priority += (10 - complexity) * this.priorityWeights.visualComplexity;
    }

    return Math.max(0, priority);
  }

  /**
   * Check if antibiotic is considered emergency/critical
   * @param {Object} antibiotic - Antibiotic data
   * @returns {boolean} True if emergency antibiotic
   */
  isEmergencyAntibiotic(antibiotic) {
    const emergencyNames = [
      'Vancomycin', 'Piperacillin-Tazobactam', 'Meropenem', 'Imipenem',
      'Ceftriaxone', 'Cefepime', 'Azithromycin', 'Levofloxacin', 'Linezolid'
    ];
    
    const emergencyIndications = ['sepsis', 'meningitis', 'severe pneumonia', 'endocarditis'];
    
    return emergencyNames.includes(antibiotic.name) || 
           emergencyIndications.some(indication => 
             antibiotic.indications?.some(ind => ind.toLowerCase().includes(indication))
           );
  }

  /**
   * Calculate clinical urgency score
   * @param {Object} antibiotic - Antibiotic data
   * @returns {number} Urgency score (0-10)
   */
  calculateClinicalUrgency(antibiotic) {
    let urgency = 5; // Base urgency

    // Broad spectrum antibiotics are more urgent
    if (antibiotic.spectrum === 'broad') urgency += 3;
    else if (antibiotic.spectrum === 'extended') urgency += 2;

    // IV antibiotics are more urgent in clinical settings
    if (antibiotic.routes?.includes('IV')) urgency += 2;

    // First-line antibiotics are more urgent
    if (antibiotic.clinicalRole === 'first-line') urgency += 2;
    else if (antibiotic.clinicalRole === 'last-resort') urgency += 4;

    return Math.min(10, urgency);
  }

  /**
   * Calculate grid distance between two positions
   * @param {Object} pos1 - First grid position
   * @param {Object} pos2 - Second grid position
   * @returns {number} Manhattan distance
   */
  calculateGridDistance(pos1, pos2) {
    return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
  }

  /**
   * Calculate distance from grid center
   * @param {Object} gridPosition - Grid position object
   * @returns {number} Distance from center
   */
  calculateCenterDistance(gridPosition) {
    const centerRow = 2.5; // Approximate center for most grids
    const centerCol = 2.5;
    return Math.sqrt(Math.pow(gridPosition.row - centerRow, 2) + Math.pow(gridPosition.col - centerCol, 2));
  }

  /**
   * Calculate drug class relevance score
   * @param {Object} antibiotic - Antibiotic data
   * @returns {number} Relevance score (0-10)
   */
  calculateDrugClassRelevance(antibiotic) {
    const highRelevanceClasses = ['Beta-lactams', 'Fluoroquinolones', 'Glycopeptides'];
    const mediumRelevanceClasses = ['Aminoglycosides', 'Macrolides', 'Carbapenems'];
    
    if (highRelevanceClasses.includes(antibiotic.class)) return 8;
    if (mediumRelevanceClasses.includes(antibiotic.class)) return 6;
    return 4;
  }

  /**
   * Calculate educational value for learning contexts
   * @param {Object} antibiotic - Antibiotic data
   * @returns {number} Educational value score (0-10)
   */
  calculateEducationalValue(antibiotic) {
    let value = 5; // Base educational value

    // Prototype antibiotics are educationally valuable
    if (antibiotic.isPrototype) value += 3;

    // Common antibiotics are educationally important
    if (antibiotic.usage === 'common') value += 2;
    else if (antibiotic.usage === 'specialized') value += 1;

    // Clear mechanism of action increases educational value
    if (antibiotic.mechanismClarity === 'high') value += 2;

    return Math.min(10, value);
  }

  /**
   * Calculate visual complexity for emergency optimization
   * @param {Object} antibiotic - Antibiotic data
   * @returns {number} Complexity score (1-10)
   */
  calculateVisualComplexity(antibiotic) {
    let complexity = 1;

    // More spectrum coverage segments = more complex
    const spectrumSegments = Object.keys(antibiotic.northwesternSpectrum || {}).length;
    complexity += Math.min(5, spectrumSegments);

    // Additional visual elements increase complexity
    if (antibiotic.resistancePatterns?.length > 0) complexity += 1;
    if (antibiotic.sideEffects?.length > 5) complexity += 1;
    if (antibiotic.interactions?.length > 3) complexity += 1;

    return Math.min(10, complexity);
  }

  /**
   * Get performance analytics for monitoring
   * @returns {Object} Performance statistics and trends
   */
  getPerformanceAnalytics() {
    if (this.performanceHistory.length === 0) {
      return { message: 'No performance data available' };
    }

    const recent = this.performanceHistory.slice(-10);
    const averageCalculationTime = recent.reduce((sum, h) => sum + h.calculationTime, 0) / recent.length;
    const averagePositionCount = recent.reduce((sum, h) => sum + h.positionCount, 0) / recent.length;

    return {
      currentLoad: this.activeRenders.size,
      maxConcurrentRenders: this.config.maxConcurrentRenders,
      averageCalculationTime: averageCalculationTime.toFixed(2),
      averagePositionCount: Math.round(averagePositionCount),
      totalCalculations: this.performanceHistory.length,
      emergencyMode: this.config.emergencyMode,
      performanceTrend: this.calculatePerformanceTrend()
    };
  }

  /**
   * Calculate performance trend over recent history
   * @returns {string} Trend description
   */
  calculatePerformanceTrend() {
    if (this.performanceHistory.length < 5) return 'insufficient-data';

    const recent5 = this.performanceHistory.slice(-5);
    const older5 = this.performanceHistory.slice(-10, -5);

    if (older5.length === 0) return 'improving'; // Not enough data for comparison

    const recentAvg = recent5.reduce((sum, h) => sum + h.calculationTime, 0) / recent5.length;
    const olderAvg = older5.reduce((sum, h) => sum + h.calculationTime, 0) / older5.length;

    const improvement = (olderAvg - recentAvg) / olderAvg;

    if (improvement > 0.1) return 'improving';
    if (improvement < -0.1) return 'degrading';
    return 'stable';
  }
}

/**
 * Memory management system for extended clinical sessions
 */
export class MemoryManager {
  constructor(options = {}) {
    this.config = {
      maxMemoryMB: options.maxMemoryMB || 50,
      cleanupInterval: options.cleanupInterval || 60000, // 1 minute
      criticalThresholdMB: options.criticalThresholdMB || 40,
      enableAutoCleanup: options.enableAutoCleanup !== false
    };
    
    this.memoryTracker = {
      startTime: Date.now(),
      peakUsage: 0,
      currentUsage: 0,
      gcEvents: 0,
      cleanupEvents: 0
    };
    
    this.cacheRegistry = new Map();
    this.cleanupTimer = null;
    
    if (this.config.enableAutoCleanup) {
      this.startAutoCleanup();
    }

    // Monitor performance observer if available
    this.initializePerformanceObserver();
  }

  /**
   * Initialize performance observer for memory monitoring
   */
  initializePerformanceObserver() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'measure' && entry.name.includes('memory')) {
            this.trackMemoryEvent(entry);
          }
        });
      });

      observer.observe({ entryTypes: ['measure'] });
    } catch (error) {
      console.warn('Performance observer not available for memory monitoring');
    }
  }

  /**
   * Track memory usage for specific operations
   * @param {string} operationName - Name of the operation
   * @param {Function} operation - Function to execute and monitor
   * @returns {*} Result of the operation
   */
  async trackMemoryUsage(operationName, operation) {
    const startMemory = this.getCurrentMemoryEstimate();
    const startTime = performance.now();

    // Mark start of operation
    performance.mark(`${operationName}-memory-start`);

    try {
      const result = await operation();
      
      // Mark end and measure
      performance.mark(`${operationName}-memory-end`);
      performance.measure(`${operationName}-memory`, `${operationName}-memory-start`, `${operationName}-memory-end`);
      
      const endMemory = this.getCurrentMemoryEstimate();
      const memoryDelta = endMemory - startMemory;
      const executionTime = performance.now() - startTime;

      this.recordMemoryUsage({
        operation: operationName,
        memoryDelta,
        totalMemory: endMemory,
        executionTime,
        timestamp: Date.now()
      });

      // Check if cleanup is needed
      if (endMemory > this.config.criticalThresholdMB) {
        await this.performEmergencyCleanup();
      }

      return result;
    } catch (error) {
      console.error(`Memory tracking failed for operation: ${operationName}`, error);
      throw error;
    }
  }

  /**
   * Get current memory usage estimate
   * @returns {number} Memory usage in MB
   */
  getCurrentMemoryEstimate() {
    if ('performance' in window && 'memory' in performance) {
      // Chrome-specific memory API
      return performance.memory.usedJSHeapSize / (1024 * 1024);
    }
    
    // Fallback estimation based on cache registry
    let estimate = 0;
    this.cacheRegistry.forEach(cache => {
      estimate += this.estimateCacheSize(cache);
    });
    
    return estimate;
  }

  /**
   * Estimate size of cache data
   * @param {Object} cache - Cache object
   * @returns {number} Estimated size in MB
   */
  estimateCacheSize(cache) {
    try {
      const jsonString = JSON.stringify(cache.data);
      return (jsonString.length * 2) / (1024 * 1024); // Rough estimate: 2 bytes per character
    } catch (error) {
      return 1; // Default estimate
    }
  }

  /**
   * Record memory usage event
   * @param {Object} event - Memory usage event data
   */
  recordMemoryUsage(event) {
    this.memoryTracker.currentUsage = event.totalMemory;
    this.memoryTracker.peakUsage = Math.max(this.memoryTracker.peakUsage, event.totalMemory);
    
    // Log warning if approaching memory limit
    if (event.totalMemory > this.config.maxMemoryMB * 0.8) {
      console.warn(`Memory usage approaching limit: ${event.totalMemory.toFixed(2)}MB / ${this.config.maxMemoryMB}MB`);
    }
  }

  /**
   * Register cache for memory management
   * @param {string} cacheId - Unique cache identifier
   * @param {Object} cacheData - Cache data object
   * @param {Object} options - Cache options
   */
  registerCache(cacheId, cacheData, options = {}) {
    this.cacheRegistry.set(cacheId, {
      data: cacheData,
      lastAccessed: Date.now(),
      accessCount: 0,
      priority: options.priority || 'normal',
      maxAge: options.maxAge || 600000, // 10 minutes default
      size: this.estimateCacheSize({ data: cacheData })
    });
  }

  /**
   * Access registered cache
   * @param {string} cacheId - Cache identifier
   * @returns {*} Cache data or null if not found
   */
  accessCache(cacheId) {
    const cache = this.cacheRegistry.get(cacheId);
    if (cache) {
      cache.lastAccessed = Date.now();
      cache.accessCount++;
      return cache.data;
    }
    return null;
  }

  /**
   * Start automatic cleanup process
   */
  startAutoCleanup() {
    this.cleanupTimer = setInterval(() => {
      this.performRoutineCleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Perform routine memory cleanup
   */
  async performRoutineCleanup() {
    const currentMemory = this.getCurrentMemoryEstimate();
    
    if (currentMemory < this.config.maxMemoryMB * 0.7) {
      return; // Memory usage is acceptable
    }

    console.log(`Performing routine memory cleanup. Current usage: ${currentMemory.toFixed(2)}MB`);
    
    // Clean expired caches
    const expiredCaches = [];
    const now = Date.now();
    
    this.cacheRegistry.forEach((cache, cacheId) => {
      const age = now - cache.lastAccessed;
      if (age > cache.maxAge) {
        expiredCaches.push(cacheId);
      }
    });

    // Remove expired caches
    expiredCaches.forEach(cacheId => {
      this.cacheRegistry.delete(cacheId);
    });

    // If still high memory usage, clean low-priority caches
    if (this.getCurrentMemoryEstimate() > this.config.maxMemoryMB * 0.8) {
      await this.cleanLowPriorityCaches();
    }

    this.memoryTracker.cleanupEvents++;
  }

  /**
   * Perform emergency cleanup when memory is critical
   */
  async performEmergencyCleanup() {
    console.warn('Performing emergency memory cleanup due to high usage');
    
    // Clear all non-critical caches
    const criticalCaches = new Map();
    this.cacheRegistry.forEach((cache, cacheId) => {
      if (cache.priority === 'critical') {
        criticalCaches.set(cacheId, cache);
      }
    });
    
    this.cacheRegistry.clear();
    this.cacheRegistry = criticalCaches;
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
      this.memoryTracker.gcEvents++;
    }

    this.memoryTracker.cleanupEvents++;
  }

  /**
   * Clean low-priority caches based on access patterns
   */
  async cleanLowPriorityCaches() {
    const cachesToRemove = [];
    
    // Sort caches by access frequency and recency
    const cacheEntries = Array.from(this.cacheRegistry.entries()).sort(([, a], [, b]) => {
      const aScore = a.accessCount * (Date.now() - a.lastAccessed);
      const bScore = b.accessCount * (Date.now() - b.lastAccessed);
      return aScore - bScore; // Lower scores (less frequent, less recent) first
    });

    // Remove bottom 30% of caches
    const removeCount = Math.floor(cacheEntries.length * 0.3);
    for (let i = 0; i < removeCount; i++) {
      const [cacheId] = cacheEntries[i];
      if (this.cacheRegistry.get(cacheId).priority !== 'critical') {
        cachesToRemove.push(cacheId);
      }
    }

    cachesToRemove.forEach(cacheId => {
      this.cacheRegistry.delete(cacheId);
    });
  }

  /**
   * Get comprehensive memory analytics
   * @returns {Object} Memory usage statistics and recommendations
   */
  getMemoryAnalytics() {
    const currentUsage = this.getCurrentMemoryEstimate();
    const sessionDuration = (Date.now() - this.memoryTracker.startTime) / 1000 / 60; // minutes
    const cacheCount = this.cacheRegistry.size;
    
    let totalCacheSize = 0;
    let criticalCacheCount = 0;
    this.cacheRegistry.forEach(cache => {
      totalCacheSize += cache.size;
      if (cache.priority === 'critical') criticalCacheCount++;
    });

    const memoryEfficiency = sessionDuration > 0 ? currentUsage / sessionDuration : 0;
    const utilizationPercentage = (currentUsage / this.config.maxMemoryMB) * 100;

    return {
      currentUsage: currentUsage.toFixed(2),
      peakUsage: this.memoryTracker.peakUsage.toFixed(2),
      maxAllowed: this.config.maxMemoryMB,
      utilizationPercentage: utilizationPercentage.toFixed(1),
      sessionDurationMinutes: sessionDuration.toFixed(1),
      memoryEfficiency: memoryEfficiency.toFixed(3),
      cacheStatistics: {
        totalCaches: cacheCount,
        criticalCaches: criticalCacheCount,
        totalCacheSize: totalCacheSize.toFixed(2),
        averageCacheSize: cacheCount > 0 ? (totalCacheSize / cacheCount).toFixed(2) : 0
      },
      cleanupStatistics: {
        routineCleanups: this.memoryTracker.cleanupEvents,
        gcEvents: this.memoryTracker.gcEvents
      },
      recommendations: this.generateMemoryRecommendations(utilizationPercentage, sessionDuration)
    };
  }

  /**
   * Generate memory usage recommendations
   * @param {number} utilization - Current memory utilization percentage
   * @param {number} sessionDuration - Session duration in minutes
   * @returns {Array} Array of recommendation strings
   */
  generateMemoryRecommendations(utilization, sessionDuration) {
    const recommendations = [];

    if (utilization > 90) {
      recommendations.push('Memory usage is critical - consider refreshing the application');
    } else if (utilization > 80) {
      recommendations.push('High memory usage detected - cleanup will occur automatically');
    }

    if (sessionDuration > 240) { // 4 hours
      recommendations.push('Extended session detected - consider periodic application refresh');
    }

    if (this.cacheRegistry.size > 100) {
      recommendations.push('Large number of cached items - consider reducing cache retention time');
    }

    if (recommendations.length === 0) {
      recommendations.push('Memory usage is optimal for clinical workflow');
    }

    return recommendations;
  }

  /**
   * Track memory event from performance observer
   * @param {PerformanceEntry} entry - Performance entry
   */
  trackMemoryEvent(entry) {
    // Implementation for performance observer memory tracking
    this.recordMemoryUsage({
      operation: entry.name,
      executionTime: entry.duration,
      timestamp: entry.startTime,
      memoryDelta: 0, // Would need additional calculation
      totalMemory: this.getCurrentMemoryEstimate()
    });
  }

  /**
   * Stop automatic cleanup and dispose resources
   */
  dispose() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.cacheRegistry.clear();
  }
}

/**
 * Performance monitoring system with real-time analytics
 */
export class PerformanceMonitor {
  constructor(options = {}) {
    this.config = {
      enableRealTimeMonitoring: options.enableRealTimeMonitoring !== false,
      samplingInterval: options.samplingInterval || 1000, // 1 second
      maxDataPoints: options.maxDataPoints || 1000,
      alertThresholds: {
        renderTime: options.renderTimeThreshold || 1000, // 1 second
        filterTime: options.filterTimeThreshold || 100,   // 100ms
        memoryUsage: options.memoryUsageThreshold || 40   // 40MB
      },
      clinicalContext: options.clinicalContext || 'education'
    };

    this.metrics = {
      renderingMetrics: [],
      filteringMetrics: [],
      memoryMetrics: [],
      userInteractionMetrics: [],
      clinicalWorkflowMetrics: []
    };

    this.alerts = [];
    this.monitoringTimer = null;
    this.startTime = Date.now();

    if (this.config.enableRealTimeMonitoring) {
      this.startRealTimeMonitoring();
    }

    // Initialize performance measurement utilities
    this.initializePerformanceMeasurement();
  }

  /**
   * Initialize performance measurement utilities
   */
  initializePerformanceMeasurement() {
    // Ensure performance timing is available
    if (!('performance' in window) || !('now' in performance)) {
      console.warn('Performance timing not available - using Date.now() fallback');
      performance.now = () => Date.now();
    }

    // Add performance mark/measure polyfill if needed
    if (!('mark' in performance)) {
      performance.mark = () => {};
      performance.measure = () => {};
      performance.getEntriesByName = () => [];
    }
  }

  /**
   * Start real-time performance monitoring
   */
  startRealTimeMonitoring() {
    this.monitoringTimer = setInterval(() => {
      this.captureRealTimeMetrics();
    }, this.config.samplingInterval);
  }

  /**
   * Capture real-time performance metrics
   */
  captureRealTimeMetrics() {
    const timestamp = Date.now();
    
    // Memory metrics
    const memoryUsage = this.getCurrentMemoryUsage();
    this.recordMemoryMetric({
      timestamp,
      usage: memoryUsage,
      type: 'realtime-sample'
    });

    // Check for performance alerts
    this.checkPerformanceAlerts(memoryUsage);

    // Cleanup old metrics
    this.cleanupOldMetrics();
  }

  /**
   * Record rendering performance metric
   * @param {Object} metric - Rendering performance data
   */
  recordRenderingMetric(metric) {
    const enhancedMetric = {
      ...metric,
      timestamp: Date.now(),
      sessionTime: Date.now() - this.startTime,
      category: 'rendering'
    };

    this.metrics.renderingMetrics.push(enhancedMetric);
    
    // Check for performance alerts
    if (metric.duration > this.config.alertThresholds.renderTime) {
      this.createAlert('render-performance', `Slow rendering detected: ${metric.duration}ms`, 'warning');
    }

    this.limitMetricsSize('renderingMetrics');
  }

  /**
   * Record filtering performance metric
   * @param {Object} metric - Filtering performance data
   */
  recordFilteringMetric(metric) {
    const enhancedMetric = {
      ...metric,
      timestamp: Date.now(),
      sessionTime: Date.now() - this.startTime,
      category: 'filtering'
    };

    this.metrics.filteringMetrics.push(enhancedMetric);
    
    // Check for performance alerts
    if (metric.duration > this.config.alertThresholds.filterTime) {
      this.createAlert('filter-performance', `Slow filtering detected: ${metric.duration}ms`, 'warning');
    }

    this.limitMetricsSize('filteringMetrics');
  }

  /**
   * Record memory performance metric
   * @param {Object} metric - Memory performance data
   */
  recordMemoryMetric(metric) {
    const enhancedMetric = {
      ...metric,
      timestamp: Date.now(),
      sessionTime: Date.now() - this.startTime,
      category: 'memory'
    };

    this.metrics.memoryMetrics.push(enhancedMetric);
    this.limitMetricsSize('memoryMetrics');
  }

  /**
   * Record user interaction metric
   * @param {Object} metric - User interaction data
   */
  recordUserInteractionMetric(metric) {
    const enhancedMetric = {
      ...metric,
      timestamp: Date.now(),
      sessionTime: Date.now() - this.startTime,
      category: 'interaction'
    };

    this.metrics.userInteractionMetrics.push(enhancedMetric);
    this.limitMetricsSize('userInteractionMetrics');
  }

  /**
   * Record clinical workflow metric
   * @param {Object} metric - Clinical workflow data
   */
  recordClinicalWorkflowMetric(metric) {
    const enhancedMetric = {
      ...metric,
      timestamp: Date.now(),
      sessionTime: Date.now() - this.startTime,
      category: 'clinical',
      clinicalContext: this.config.clinicalContext
    };

    this.metrics.clinicalWorkflowMetrics.push(enhancedMetric);
    
    // Special handling for clinical access time
    if (metric.type === 'emergency-access' && metric.duration > 30000) { // 30 seconds
      this.createAlert('clinical-access', `Emergency access time exceeded: ${(metric.duration / 1000).toFixed(1)}s`, 'critical');
    }

    this.limitMetricsSize('clinicalWorkflowMetrics');
  }

  /**
   * Get current memory usage estimate
   * @returns {number} Memory usage in MB
   */
  getCurrentMemoryUsage() {
    if ('performance' in window && 'memory' in performance) {
      return performance.memory.usedJSHeapSize / (1024 * 1024);
    }
    return 0; // Fallback when memory API not available
  }

  /**
   * Check for performance alerts based on current metrics
   * @param {number} memoryUsage - Current memory usage
   */
  checkPerformanceAlerts(memoryUsage) {
    // Memory usage alert
    if (memoryUsage > this.config.alertThresholds.memoryUsage) {
      this.createAlert('memory-usage', `High memory usage: ${memoryUsage.toFixed(2)}MB`, 'warning');
    }
  }

  /**
   * Create performance alert
   * @param {string} type - Alert type
   * @param {string} message - Alert message
   * @param {string} severity - Alert severity
   */
  createAlert(type, message, severity = 'info') {
    const alert = {
      type,
      message,
      severity,
      timestamp: Date.now(),
      sessionTime: Date.now() - this.startTime
    };

    this.alerts.push(alert);

    // Limit alerts to prevent memory growth
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    // Log critical alerts
    if (severity === 'critical') {
      console.error(`Performance Alert: ${message}`);
    } else if (severity === 'warning') {
      console.warn(`Performance Alert: ${message}`);
    }
  }

  /**
   * Limit the size of metrics arrays
   * @param {string} metricsKey - Key of metrics array to limit
   */
  limitMetricsSize(metricsKey) {
    if (this.metrics[metricsKey].length > this.config.maxDataPoints) {
      this.metrics[metricsKey] = this.metrics[metricsKey].slice(-this.config.maxDataPoints);
    }
  }

  /**
   * Clean up old metrics to prevent memory growth
   */
  cleanupOldMetrics() {
    const cutoffTime = Date.now() - (60 * 60 * 1000); // 1 hour ago

    Object.keys(this.metrics).forEach(key => {
      this.metrics[key] = this.metrics[key].filter(metric => metric.timestamp > cutoffTime);
    });

    // Clean up old alerts
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffTime);
  }

  /**
   * Generate comprehensive performance report
   * @returns {Object} Complete performance analysis
   */
  generatePerformanceReport() {
    const sessionDuration = (Date.now() - this.startTime) / 1000; // seconds
    
    return {
      sessionInfo: {
        duration: sessionDuration.toFixed(1),
        startTime: new Date(this.startTime).toISOString(),
        clinicalContext: this.config.clinicalContext
      },
      renderingAnalytics: this.analyzeRenderingMetrics(),
      filteringAnalytics: this.analyzeFilteringMetrics(),
      memoryAnalytics: this.analyzeMemoryMetrics(),
      userInteractionAnalytics: this.analyzeUserInteractionMetrics(),
      clinicalWorkflowAnalytics: this.analyzeClinicalWorkflowMetrics(),
      alertSummary: this.summarizeAlerts(),
      recommendations: this.generatePerformanceRecommendations()
    };
  }

  /**
   * Analyze rendering metrics
   * @returns {Object} Rendering performance analysis
   */
  analyzeRenderingMetrics() {
    const metrics = this.metrics.renderingMetrics;
    if (metrics.length === 0) return { message: 'No rendering data available' };

    const durations = metrics.map(m => m.duration).filter(d => d != null);
    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);

    return {
      totalRenders: metrics.length,
      averageDuration: averageDuration.toFixed(2),
      maxDuration: maxDuration.toFixed(2),
      minDuration: minDuration.toFixed(2),
      performanceTarget: this.config.alertThresholds.renderTime,
      performanceRatio: (averageDuration / this.config.alertThresholds.renderTime).toFixed(2)
    };
  }

  /**
   * Analyze filtering metrics
   * @returns {Object} Filtering performance analysis
   */
  analyzeFilteringMetrics() {
    const metrics = this.metrics.filteringMetrics;
    if (metrics.length === 0) return { message: 'No filtering data available' };

    const durations = metrics.map(m => m.duration).filter(d => d != null);
    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;

    return {
      totalFilters: metrics.length,
      averageDuration: averageDuration.toFixed(2),
      performanceTarget: this.config.alertThresholds.filterTime,
      meetingTarget: averageDuration < this.config.alertThresholds.filterTime
    };
  }

  /**
   * Analyze memory metrics
   * @returns {Object} Memory usage analysis
   */
  analyzeMemoryMetrics() {
    const metrics = this.metrics.memoryMetrics;
    if (metrics.length === 0) return { message: 'No memory data available' };

    const usageValues = metrics.map(m => m.usage).filter(u => u != null);
    const currentUsage = usageValues[usageValues.length - 1];
    const peakUsage = Math.max(...usageValues);
    const averageUsage = usageValues.reduce((sum, u) => sum + u, 0) / usageValues.length;

    return {
      currentUsage: currentUsage?.toFixed(2) || 'unknown',
      peakUsage: peakUsage.toFixed(2),
      averageUsage: averageUsage.toFixed(2),
      memoryTarget: this.config.alertThresholds.memoryUsage,
      utilizationPercentage: ((currentUsage || 0) / this.config.alertThresholds.memoryUsage * 100).toFixed(1)
    };
  }

  /**
   * Analyze user interaction metrics
   * @returns {Object} User interaction analysis
   */
  analyzeUserInteractionMetrics() {
    const metrics = this.metrics.userInteractionMetrics;
    if (metrics.length === 0) return { message: 'No interaction data available' };

    const interactionTypes = {};
    metrics.forEach(metric => {
      interactionTypes[metric.type] = (interactionTypes[metric.type] || 0) + 1;
    });

    return {
      totalInteractions: metrics.length,
      interactionTypes,
      mostCommonInteraction: Object.keys(interactionTypes).reduce((a, b) => 
        interactionTypes[a] > interactionTypes[b] ? a : b
      )
    };
  }

  /**
   * Analyze clinical workflow metrics
   * @returns {Object} Clinical workflow analysis
   */
  analyzeClinicalWorkflowMetrics() {
    const metrics = this.metrics.clinicalWorkflowMetrics;
    if (metrics.length === 0) return { message: 'No clinical workflow data available' };

    const emergencyAccessMetrics = metrics.filter(m => m.type === 'emergency-access');
    const averageAccessTime = emergencyAccessMetrics.length > 0 
      ? emergencyAccessMetrics.reduce((sum, m) => sum + m.duration, 0) / emergencyAccessMetrics.length
      : null;

    return {
      totalClinicalActions: metrics.length,
      emergencyAccessCount: emergencyAccessMetrics.length,
      averageEmergencyAccessTime: averageAccessTime ? (averageAccessTime / 1000).toFixed(2) + 's' : 'N/A',
      clinicalContext: this.config.clinicalContext,
      meetingEmergencyTarget: averageAccessTime ? averageAccessTime < 30000 : true
    };
  }

  /**
   * Summarize alerts
   * @returns {Object} Alert summary
   */
  summarizeAlerts() {
    if (this.alerts.length === 0) return { message: 'No performance alerts' };

    const alertTypes = {};
    const severityCount = {};
    
    this.alerts.forEach(alert => {
      alertTypes[alert.type] = (alertTypes[alert.type] || 0) + 1;
      severityCount[alert.severity] = (severityCount[alert.severity] || 0) + 1;
    });

    return {
      totalAlerts: this.alerts.length,
      recentAlerts: this.alerts.slice(-5),
      alertTypes,
      severityCount
    };
  }

  /**
   * Generate performance recommendations
   * @returns {Array} Array of recommendation strings
   */
  generatePerformanceRecommendations() {
    const recommendations = [];
    const renderingAnalytics = this.analyzeRenderingMetrics();
    const memoryAnalytics = this.analyzeMemoryMetrics();
    const alertSummary = this.summarizeAlerts();

    if (renderingAnalytics.averageDuration > this.config.alertThresholds.renderTime) {
      recommendations.push('Consider enabling virtualization for improved rendering performance');
    }

    if (memoryAnalytics.currentUsage > this.config.alertThresholds.memoryUsage * 0.8) {
      recommendations.push('Memory usage is high - consider periodic cleanup or application refresh');
    }

    if (alertSummary.totalAlerts > 10) {
      recommendations.push('Multiple performance alerts detected - review system performance configuration');
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance metrics are within acceptable ranges for clinical use');
    }

    return recommendations;
  }

  /**
   * Stop monitoring and dispose resources
   */
  dispose() {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = null;
    }

    // Clear all metrics
    Object.keys(this.metrics).forEach(key => {
      this.metrics[key] = [];
    });

    this.alerts = [];
  }
}

/**
 * Main performance optimization orchestrator
 */
export class NorthwesternPerformanceOptimizer {
  constructor(options = {}) {
    this.config = {
      enableVirtualization: options.enableVirtualization !== false,
      enableMemoryManagement: options.enableMemoryManagement !== false,
      enablePerformanceMonitoring: options.enablePerformanceMonitoring !== false,
      emergencyMode: options.emergencyMode || false,
      clinicalContext: options.clinicalContext || 'education'
    };

    // Initialize sub-systems
    this.virtualizationManager = new VirtualizationManager({
      bufferSize: 5,
      enableIntersectionObserver: true,
      clinicalPriority: this.config.emergencyMode
    });

    this.renderPrioritizationEngine = new RenderPrioritizationEngine({
      emergencyMode: this.config.emergencyMode,
      clinicalContext: this.config.clinicalContext,
      maxConcurrentRenders: this.config.emergencyMode ? 10 : 15
    });

    this.memoryManager = new MemoryManager({
      maxMemoryMB: 50,
      enableAutoCleanup: this.config.enableMemoryManagement
    });

    this.performanceMonitor = new PerformanceMonitor({
      enableRealTimeMonitoring: this.config.enablePerformanceMonitoring,
      clinicalContext: this.config.clinicalContext
    });
  }

  /**
   * Optimize antibiotic layout rendering with full performance suite
   * @param {Array} antibiotics - Antibiotic dataset
   * @param {Object} viewport - Current viewport information
   * @param {Object} userFocus - User focus and interaction state
   * @returns {Object} Optimized rendering data
   */
  async optimizeRendering(antibiotics, viewport, userFocus = {}) {
    const startTime = performance.now();
    
    try {
      // Step 1: Virtualization (if enabled and needed)
      let renderableData = antibiotics;
      let virtualizationData = null;
      
      if (this.config.enableVirtualization && antibiotics.length > 20) {
        virtualizationData = this.virtualizationManager.createVirtualizedGrid(antibiotics, viewport);
        renderableData = virtualizationData.visibleItems;
        
        this.performanceMonitor.recordRenderingMetric({
          type: 'virtualization',
          duration: performance.now() - startTime,
          itemCount: antibiotics.length,
          visibleCount: renderableData.length
        });
      }

      // Step 2: Render prioritization
      const prioritizedData = this.renderPrioritizationEngine.calculateRenderPriority(renderableData, userFocus);
      
      // Step 3: Memory management
      const renderingPromise = this.memoryManager.trackMemoryUsage('antibiotic-rendering', async () => {
        return {
          antibiotics: prioritizedData,
          virtualization: virtualizationData,
          renderOrder: prioritizedData.map(item => item.renderOrder),
          metadata: {
            totalItems: antibiotics.length,
            visibleItems: prioritizedData.length,
            virtualizationEnabled: virtualizationData !== null,
            emergencyMode: this.config.emergencyMode
          }
        };
      });

      const result = await renderingPromise;
      const totalTime = performance.now() - startTime;

      // Step 4: Performance monitoring
      this.performanceMonitor.recordRenderingMetric({
        type: 'complete-optimization',
        duration: totalTime,
        itemCount: antibiotics.length,
        optimizedCount: prioritizedData.length,
        virtualizationEnabled: virtualizationData !== null
      });

      return result;

    } catch (error) {
      console.error('Performance optimization failed:', error);
      
      // Fallback to basic rendering
      return {
        antibiotics: antibiotics,
        virtualization: null,
        renderOrder: antibiotics.map((_, index) => index + 1),
        metadata: {
          totalItems: antibiotics.length,
          visibleItems: antibiotics.length,
          virtualizationEnabled: false,
          emergencyMode: this.config.emergencyMode,
          fallbackMode: true,
          error: error.message
        }
      };
    }
  }

  /**
   * Get comprehensive performance dashboard
   * @returns {Object} Complete performance analytics
   */
  getPerformanceDashboard() {
    return {
      timestamp: new Date().toISOString(),
      config: this.config,
      virtualizationMetrics: this.virtualizationManager.getPerformanceMetrics(),
      prioritizationMetrics: this.renderPrioritizationEngine.getPerformanceAnalytics(),
      memoryMetrics: this.memoryManager.getMemoryAnalytics(),
      performanceReport: this.performanceMonitor.generatePerformanceReport(),
      systemStatus: this.getSystemStatus()
    };
  }

  /**
   * Get overall system performance status
   * @returns {Object} System status summary
   */
  getSystemStatus() {
    const memoryAnalytics = this.memoryManager.getMemoryAnalytics();
    const currentMemory = parseFloat(memoryAnalytics.currentUsage);
    const memoryUtilization = parseFloat(memoryAnalytics.utilizationPercentage);
    
    let status = 'optimal';
    let statusMessage = 'All systems operating within normal parameters';
    
    if (memoryUtilization > 90) {
      status = 'critical';
      statusMessage = 'Memory usage critical - immediate cleanup recommended';
    } else if (memoryUtilization > 80) {
      status = 'warning';
      statusMessage = 'Memory usage high - monitoring closely';
    } else if (memoryUtilization > 60) {
      status = 'caution';
      statusMessage = 'Memory usage moderate - system stable';
    }

    return {
      status,
      statusMessage,
      clinicalReadiness: status === 'optimal' || status === 'caution',
      emergencyMode: this.config.emergencyMode,
      uptime: this.performanceMonitor ? (Date.now() - this.performanceMonitor.startTime) / 1000 : 0
    };
  }

  /**
   * Enable emergency mode optimization
   */
  enableEmergencyMode() {
    this.config.emergencyMode = true;
    
    // Update all sub-systems for emergency mode
    this.renderPrioritizationEngine.config.emergencyMode = true;
    this.renderPrioritizationEngine.config.maxConcurrentRenders = 10;
    this.renderPrioritizationEngine.priorityWeights.emergency *= 2;
    
    this.virtualizationManager.config.clinicalPriority = true;
    
    console.log('Emergency mode enabled - optimized for <30 second clinical access');
  }

  /**
   * Disable emergency mode optimization
   */
  disableEmergencyMode() {
    this.config.emergencyMode = false;
    
    // Reset sub-systems to normal mode
    this.renderPrioritizationEngine.config.emergencyMode = false;
    this.renderPrioritizationEngine.config.maxConcurrentRenders = 15;
    this.renderPrioritizationEngine.priorityWeights = this.renderPrioritizationEngine.initializePriorityWeights();
    
    this.virtualizationManager.config.clinicalPriority = false;
    
    console.log('Emergency mode disabled - returned to normal optimization');
  }

  /**
   * Dispose all resources and stop monitoring
   */
  dispose() {
    this.virtualizationManager.dispose();
    this.memoryManager.dispose();
    this.performanceMonitor.dispose();
  }
}

// Export individual classes for granular usage
export {
  VirtualizationManager,
  RenderPrioritizationEngine,
  MemoryManager,
  PerformanceMonitor
};

// Default export as main orchestrator
export default NorthwesternPerformanceOptimizer;