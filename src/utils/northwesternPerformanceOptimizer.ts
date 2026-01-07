/**
 * Northwestern Performance Optimization System - TypeScript
 *
 * Advanced performance optimization utilities for the Northwestern spatial layout system
 * with clinical workflow prioritization, memory management, and virtualization support.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface VirtualizationConfig {
  bufferSize: number;
  itemHeight: number;
  overscan: number;
  enableIntersectionObserver: boolean;
  clinicalPriority: boolean;
}

interface VisibleRange {
  start: number;
  end: number;
}

interface PerformanceMetrics {
  renderCount: number;
  visibilityCalculations: number;
  lastRenderTime: number;
}

interface Viewport {
  width: number;
  height: number;
  scrollTop: number;
  scrollLeft: number;
}

interface Antibiotic {
  id: string;
  name: string;
  [key: string]: any;
}

interface VirtualizedItem {
  id: string;
  visible: boolean;
  index: number;
  priority: number;
}

interface MemorySnapshot {
  timestamp: number;
  usedMemory: number;
  totalMemory: number;
  trend: 'stable' | 'increasing' | 'decreasing';
}

interface OptimizationResult {
  success: boolean;
  metrics: { [key: string]: any };
  recommendations: string[];
}

interface RenderPriority {
  critical: string[];
  high: string[];
  normal: string[];
  low: string[];
}

// ============================================================================
// VIRTUALIZATION MANAGER
// ============================================================================

/**
 * Virtualization system for efficient rendering of large antibiotic datasets
 */
export class VirtualizationManager {
  config: VirtualizationConfig;
  virtualizedData: Map<string, VirtualizedItem> = new Map();
  visibleRange: VisibleRange = { start: 0, end: 0 };
  intersectionObserver: IntersectionObserver | null = null;
  performanceMetrics: PerformanceMetrics;

  constructor(options: any = {}) {
    this.config = {
      bufferSize: options.bufferSize || 5,
      itemHeight: options.itemHeight || 120,
      overscan: options.overscan || 3,
      enableIntersectionObserver: options.enableIntersectionObserver !== false,
      clinicalPriority: options.clinicalPriority || false
    };

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
  initializeIntersectionObserver(): void {
    if (!this.config.enableIntersectionObserver || typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.intersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const element = entry.target as HTMLElement;
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
   */
  createVirtualizedGrid(antibiotics: Antibiotic[], viewport: Viewport): VirtualizedItem[] {
    const startIndex = Math.floor(viewport.scrollTop / this.config.itemHeight);
    const endIndex = Math.ceil((viewport.scrollTop + viewport.height) / this.config.itemHeight);

    this.visibleRange = {
      start: Math.max(0, startIndex - this.config.overscan),
      end: Math.min(antibiotics.length, endIndex + this.config.overscan)
    };

    const virtualized: VirtualizedItem[] = [];

    for (let i = this.visibleRange.start; i < this.visibleRange.end; i++) {
      const antibiotic = antibiotics[i];
      if (antibiotic) {
        virtualized.push({
          id: antibiotic.id,
          visible: i >= startIndex && i < endIndex,
          index: i,
          priority: this.config.clinicalPriority ? 1 : 0
        });
      }
    }

    this.performanceMetrics.renderCount++;
    return virtualized;
  }

  /**
   * Update visibility state for antibiotic
   */
  updateVisibilityState(antibioticId: string, isVisible: boolean): void {
    const item = this.virtualizedData.get(antibioticId);
    if (item) {
      item.visible = isVisible;
    }
  }

  /**
   * Get rendered items only
   */
  getRenderedItems(): VirtualizedItem[] {
    const items: VirtualizedItem[] = [];
    this.virtualizedData.forEach((item, id) => {
      if (item.visible) {
        items.push(item);
      }
    });
    return items;
  }

  /**
   * Clear and reset virtualization
   */
  reset(): void {
    this.virtualizedData.clear();
    this.visibleRange = { start: 0, end: 0 };
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

// ============================================================================
// PERFORMANCE MONITOR
// ============================================================================

/**
 * Performance monitoring for Northwestern system
 */
export class PerformanceMonitor {
  metrics: { [key: string]: MemorySnapshot[] } = {};
  startTime: number = Date.now();
  memorySnapshots: MemorySnapshot[] = [];

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Record memory snapshot
   */
  recordMemorySnapshot(): MemorySnapshot {
    const memory = (performance as any).memory || { usedJSHeapSize: 0, jsHeapSizeLimit: 0 };
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      usedMemory: memory.usedJSHeapSize / 1048576,
      totalMemory: memory.jsHeapSizeLimit / 1048576,
      trend: 'stable'
    };

    if (this.memorySnapshots.length > 0) {
      const prev = this.memorySnapshots[this.memorySnapshots.length - 1];
      if (snapshot.usedMemory > prev.usedMemory * 1.1) {
        snapshot.trend = 'increasing';
      } else if (snapshot.usedMemory < prev.usedMemory * 0.9) {
        snapshot.trend = 'decreasing';
      }
    }

    this.memorySnapshots.push(snapshot);
    return snapshot;
  }

  /**
   * Get average memory usage
   */
  getAverageMemory(): number {
    if (this.memorySnapshots.length === 0) return 0;
    const total = this.memorySnapshots.reduce((sum, snapshot) => sum + snapshot.usedMemory, 0);
    return total / this.memorySnapshots.length;
  }

  /**
   * Get peak memory usage
   */
  getPeakMemory(): number {
    if (this.memorySnapshots.length === 0) return 0;
    return Math.max(...this.memorySnapshots.map(s => s.usedMemory));
  }

  /**
   * Get elapsed time in milliseconds
   */
  getElapsedTime(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Analyze performance metrics
   */
  analyzePerformance(): OptimizationResult {
    const avgMemory = this.getAverageMemory();
    const peakMemory = this.getPeakMemory();
    const memoryHealthy = peakMemory < 100;

    return {
      success: memoryHealthy,
      metrics: {
        averageMemory: avgMemory.toFixed(2),
        peakMemory: peakMemory.toFixed(2),
        elapsedTime: this.getElapsedTime(),
        snapshotCount: this.memorySnapshots.length
      },
      recommendations: memoryHealthy ? [] : ['Consider implementing memory cleanup strategies']
    };
  }

  /**
   * Reset monitoring
   */
  reset(): void {
    this.memorySnapshots = [];
    this.startTime = Date.now();
  }
}

// ============================================================================
// NORTHWESTERN PERFORMANCE OPTIMIZER
// ============================================================================

/**
 * Main optimization system for Northwestern layout
 */
export class NorthwesternPerformanceOptimizer {
  virtualizationManager: VirtualizationManager;
  performanceMonitor: PerformanceMonitor;
  renderPriorities: RenderPriority;
  enableClinicalMode: boolean;
  emergencyAccessTime: number;

  constructor(options: any = {}) {
    this.virtualizationManager = new VirtualizationManager(options);
    this.performanceMonitor = new PerformanceMonitor();
    this.enableClinicalMode = options.clinicalMode !== false;
    this.emergencyAccessTime = options.emergencyAccessTime || 30000;

    this.renderPriorities = {
      critical: [],
      high: [],
      normal: [],
      low: []
    };
  }

  /**
   * Optimize rendering for clinical efficiency
   */
  optimizeRenderingPipeline(antibiotics: Antibiotic[], viewport: Viewport): OptimizationResult {
    const startTime = Date.now();

    // Create virtualized grid
    this.virtualizationManager.createVirtualizedGrid(antibiotics, viewport);

    // Record performance metrics
    this.performanceMonitor.recordMemorySnapshot();

    const duration = Date.now() - startTime;

    return {
      success: duration < 100,
      metrics: {
        renderTime: duration,
        itemsVirtualized: this.virtualizationManager.visibleRange.end - this.virtualizationManager.visibleRange.start,
        memoryUsage: this.performanceMonitor.getPeakMemory()
      },
      recommendations: duration > 100 ? ['Reduce viewport complexity'] : []
    };
  }

  /**
   * Prioritize clinical render order
   */
  prioritizeClinicalRender(antibiotics: Antibiotic[], urgency: string): Antibiotic[] {
    if (!this.enableClinicalMode) {
      return antibiotics;
    }

    const urgencyMap: { [key: string]: number } = {
      emergency: 0,
      urgent: 1,
      standard: 2,
      education: 3
    };

    const priority = urgencyMap[urgency] || 2;

    return antibiotics.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (a.priority || 999) - (b.priority || 999);
      }
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Apply memory optimization strategies
   */
  optimizeMemoryUsage(): OptimizationResult {
    const beforeMemory = this.performanceMonitor.getPeakMemory();

    // Clear virtualization cache
    this.virtualizationManager.reset();
    this.performanceMonitor.recordMemorySnapshot();

    const afterMemory = this.performanceMonitor.getPeakMemory();
    const memoryFreed = beforeMemory - afterMemory;

    return {
      success: memoryFreed > 0,
      metrics: {
        memoryFreed: memoryFreed.toFixed(2),
        beforeOptimization: beforeMemory.toFixed(2),
        afterOptimization: afterMemory.toFixed(2)
      },
      recommendations: []
    };
  }

  /**
   * Validate clinical performance requirements
   */
  validateClinicalPerformance(): OptimizationResult {
    const analysis = this.performanceMonitor.analyzePerformance();
    const elapsed = this.performanceMonitor.getElapsedTime();
    const emergencyReady = elapsed < this.emergencyAccessTime;

    return {
      success: emergencyReady && analysis.success,
      metrics: {
        ...analysis.metrics,
        emergencyReady,
        emergencyAccessTime: this.emergencyAccessTime
      },
      recommendations: emergencyReady ? [] : ['Performance degradation detected in emergency mode']
    };
  }

  /**
   * Get optimization summary
   */
  getSummary(): any {
    return {
      virtualization: this.virtualizationManager.performanceMetrics,
      memory: {
        average: this.performanceMonitor.getAverageMemory(),
        peak: this.performanceMonitor.getPeakMemory()
      },
      elapsed: this.performanceMonitor.getElapsedTime(),
      clinicalMode: this.enableClinicalMode
    };
  }

  /**
   * Reset all systems
   */
  reset(): void {
    this.virtualizationManager.reset();
    this.performanceMonitor.reset();
  }
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

// Classes are already exported inline with 'export class' declarations above
// Just export the default for convenience
export default NorthwesternPerformanceOptimizer;
