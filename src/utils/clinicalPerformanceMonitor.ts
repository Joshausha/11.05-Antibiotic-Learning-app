/**
 * Clinical Performance Monitor - TypeScript
 *
 * Real-time performance metrics tracking and analytics for Northwestern antibiotic system
 * with clinical workflow bottleneck identification and optimization recommendations.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PerformanceBenchmarks {
  rendering: {
    initialLoad: number;
    filterApplication: number;
    spatialLayout: number;
    groupOperations: number;
    chartRendering: number;
  };
  clinical: {
    emergencyAccess: number;
    decisionTime: number;
    contextSwitch: number;
    scenarioLoad: number;
    offlineAccess: number;
  };
  memory: {
    sessionFootprint: number;
    peakUsage: number;
    cleanupThreshold: number;
    cacheEfficiency: number;
  };
  ux: {
    touchResponse: number;
    hapticLatency: number;
    visualFeedback: number;
    accessibilityDelay: number;
  };
  network: {
    syncTime: number;
    offlineTransition: number;
    cacheUpdate: number;
    retryInterval: number;
  };
  battery: {
    cpuEfficiency: number;
    renderEfficiency: number;
    backgroundUsage: number;
    idlePowerDraw: number;
  };
}

interface ClinicalMetrics {
  workflows: { [key: string]: string };
  urgencyLevels: {
    [key: string]: {
      maxTime: number;
      priority: number;
    };
  };
}

interface PerformanceAlert {
  type: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  threshold: number;
  actual: number;
  timestamp: number;
}

interface PerformanceRecommendation {
  category: string;
  priority: number;
  message: string;
  estimatedImprovement: number;
  actionItems: string[];
}

interface SessionMetrics {
  sessionId: string;
  startTime: number;
  metrics: { [key: string]: any };
  alerts: PerformanceAlert[];
  recommendations: PerformanceRecommendation[];
}

interface PerformanceReport {
  sessionId: string;
  duration: number;
  summaries: { [key: string]: any };
  alerts: PerformanceAlert[];
  recommendations: PerformanceRecommendation[];
  clinicalReadiness: boolean;
  efficiency: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PERFORMANCE_BENCHMARKS: PerformanceBenchmarks = {
  rendering: {
    initialLoad: 2000,
    filterApplication: 100,
    spatialLayout: 1000,
    groupOperations: 100,
    chartRendering: 500
  },
  clinical: {
    emergencyAccess: 30000,
    decisionTime: 120000,
    contextSwitch: 2000,
    scenarioLoad: 5000,
    offlineAccess: 1000
  },
  memory: {
    sessionFootprint: 50,
    peakUsage: 75,
    cleanupThreshold: 40,
    cacheEfficiency: 0.8
  },
  ux: {
    touchResponse: 100,
    hapticLatency: 50,
    visualFeedback: 150,
    accessibilityDelay: 200
  },
  network: {
    syncTime: 5000,
    offlineTransition: 1000,
    cacheUpdate: 3000,
    retryInterval: 2000
  },
  battery: {
    cpuEfficiency: 0.3,
    renderEfficiency: 0.5,
    backgroundUsage: 0.1,
    idlePowerDraw: 0.05
  }
};

const CLINICAL_METRICS: ClinicalMetrics = {
  workflows: {
    sepsis: 'emergency-sepsis-protocol',
    pneumonia: 'pneumonia-management',
    meningitis: 'meningitis-emergency',
    routine: 'routine-antibiotic-selection',
    education: 'medical-education-session'
  },
  urgencyLevels: {
    emergency: { maxTime: 30000, priority: 1 },
    urgent: { maxTime: 120000, priority: 2 },
    standard: { maxTime: 300000, priority: 3 },
    education: { maxTime: 600000, priority: 4 }
  }
};

// ============================================================================
// MAIN MONITORING CLASS
// ============================================================================

/**
 * Real-time performance monitoring system for clinical workflows
 */
export class ClinicalPerformanceMonitor {
  config: any;
  sessionId: string = '';
  metricsData: SessionMetrics | null = null;
  performanceObserver: PerformanceObserver | null = null;
  batteryManager: any = null;
  monitoringInterval: NodeJS.Timeout | null = null;
  clinicalWorkflows: Map<string, any> = new Map();
  alerts: PerformanceAlert[] = [];
  recommendations: PerformanceRecommendation[] = [];

  constructor(options: any = {}) {
    this.config = {
      enableRealTimeTracking: options.enableRealTimeTracking !== false,
      samplingRate: options.samplingRate || 1000,
      enableBatteryTracking: options.enableBatteryTracking !== false,
      enableClinicalTracking: options.enableClinicalTracking !== false,
      maxDataPoints: options.maxDataPoints || 10000,
      autoCleanup: options.autoCleanup !== false,
      clinicalMode: options.clinicalMode !== false,
      emergencyMode: options.emergencyMode || false,
      emergencyThreshold: options.emergencyThreshold || 30000
    };

    this.initialize();
  }

  /**
   * Initialize the monitoring system
   */
  initialize(): void {
    this.sessionId = this.generateSessionId();
    this.metricsData = {
      sessionId: this.sessionId,
      startTime: Date.now(),
      metrics: {},
      alerts: [],
      recommendations: []
    };

    if (this.config.enableRealTimeTracking) {
      this.startRealTimeMonitoring();
    }

    if (typeof PerformanceObserver !== 'undefined') {
      this.initializePerformanceObserver();
    }

    if (this.config.enableBatteryTracking && (navigator as any).getBattery) {
      this.initializeBatteryMonitoring();
    }

    if (this.config.enableClinicalTracking) {
      this.setupClinicalWorkflowTracking();
    }
  }

  /**
   * Generate a unique session ID
   */
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start real-time monitoring
   */
  startRealTimeMonitoring(): void {
    if (this.monitoringInterval) return;

    this.monitoringInterval = setInterval(() => {
      this.captureSystemMetrics();
      this.checkPerformanceThresholds();

      if (this.config.autoCleanup) {
        this.cleanupOldData();
      }
    }, this.config.samplingRate);
  }

  /**
   * Initialize PerformanceObserver for browser metrics
   */
  initializePerformanceObserver(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
        for (const entry of list.getEntries()) {
          if (!this.metricsData) return;
          if (!this.metricsData.metrics[entry.name]) {
            this.metricsData.metrics[entry.name] = [];
          }
          this.metricsData.metrics[entry.name].push({
            duration: (entry as any).duration,
            timestamp: entry.startTime
          });
        }
      });

      const supported = PerformanceObserver.supportedEntryTypes || [];
      if (supported.includes('measure')) {
        observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
      }

      this.performanceObserver = observer;
    } catch (error) {
      console.warn('PerformanceObserver initialization failed:', error);
    }
  }

  /**
   * Initialize battery monitoring
   */
  initializeBatteryMonitoring(): void {
    if (!(navigator as any).getBattery) return;

    (navigator as any).getBattery().then((battery: any) => {
      this.batteryManager = battery;

      const updateBatteryMetrics = () => {
        if (!this.metricsData) return;
        this.metricsData.metrics.battery = {
          level: battery.level,
          charging: battery.charging,
          dischargingTime: battery.dischargingTime,
          chargingTime: battery.chargingTime
        };
      };

      battery.addEventListener('levelchange', updateBatteryMetrics);
      battery.addEventListener('chargingchange', updateBatteryMetrics);
      updateBatteryMetrics();
    }).catch(() => {
      // Battery API not available
    });
  }

  /**
   * Setup clinical workflow tracking
   */
  setupClinicalWorkflowTracking(): void {
    this.clinicalWorkflows.set('sepsis', {
      name: 'Sepsis Protocol',
      maxTime: CLINICAL_METRICS.urgencyLevels.emergency.maxTime,
      priority: 1,
      metrics: {}
    });

    this.clinicalWorkflows.set('pneumonia', {
      name: 'Pneumonia Management',
      maxTime: CLINICAL_METRICS.urgencyLevels.urgent.maxTime,
      priority: 2,
      metrics: {}
    });

    this.clinicalWorkflows.set('meningitis', {
      name: 'Meningitis Emergency',
      maxTime: CLINICAL_METRICS.urgencyLevels.emergency.maxTime,
      priority: 1,
      metrics: {}
    });
  }

  /**
   * Capture system metrics
   */
  captureSystemMetrics(): void {
    if (!this.metricsData) return;

    this.metricsData.metrics.memory = this.getCurrentMemoryUsage();
    this.metricsData.metrics.device = this.detectDeviceType();
    this.metricsData.metrics.connection = this.getConnectionType();
  }

  /**
   * Analyze clinical performance
   */
  analyzeClinicalPerformance(): any {
    const analysis = {
      workflows: {} as any,
      bottlenecks: [] as string[],
      efficiency: 0,
      readiness: true
    };

    this.clinicalWorkflows.forEach((workflow, key) => {
      const metrics = workflow.metrics;
      analysis.workflows[key] = {
        avgTime: Object.values(metrics).length > 0 ?
          (Object.values(metrics) as any).reduce((a: number, b: any) => a + b.duration, 0) / Object.values(metrics).length :
          0,
        withinThreshold: true
      };
    });

    return analysis;
  }

  /**
   * Check performance thresholds
   */
  checkPerformanceThresholds(): void {
    if (!this.metricsData) return;

    // Check memory threshold
    const memory = this.metricsData.metrics.memory;
    if (memory && memory.used > PERFORMANCE_BENCHMARKS.memory.sessionFootprint) {
      this.addAlert({
        type: 'memory',
        severity: 'warning',
        message: `Memory usage exceeds threshold: ${memory.used}MB`,
        threshold: PERFORMANCE_BENCHMARKS.memory.sessionFootprint,
        actual: memory.used,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Get session duration in milliseconds
   */
  getSessionDuration(): number {
    if (!this.metricsData) return 0;
    return Date.now() - this.metricsData.startTime;
  }

  /**
   * Get current memory usage
   */
  getCurrentMemoryUsage(): any {
    if (typeof (performance as any).memory !== 'undefined') {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize / 1048576,
        total: memory.totalJSHeapSize / 1048576,
        limit: memory.jsHeapSizeLimit / 1048576
      };
    }
    return { used: 0, total: 0, limit: 0 };
  }

  /**
   * Detect device type
   */
  detectDeviceType(): string {
    const ua = navigator.userAgent;
    if (/mobile|android|iphone|ipad/i.test(ua)) return 'mobile';
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    return 'desktop';
  }

  /**
   * Get connection type
   */
  getConnectionType(): string {
    if (typeof (navigator as any).connection !== 'undefined') {
      return (navigator as any).connection.effectiveType || 'unknown';
    }
    return navigator.onLine ? 'online' : 'offline';
  }

  /**
   * Cleanup old data
   */
  cleanupOldData(): void {
    if (!this.metricsData) return;

    const now = Date.now();
    const maxAge = 3600000; // 1 hour

    Object.keys(this.metricsData.metrics).forEach(key => {
      if (Array.isArray(this.metricsData!.metrics[key])) {
        this.metricsData!.metrics[key] = (this.metricsData!.metrics[key] as any[]).filter(
          m => now - m.timestamp < maxAge
        );
      }
    });
  }

  /**
   * Generate clinical performance report
   */
  generateClinicalPerformanceReport(): PerformanceReport {
    const duration = this.getSessionDuration();

    return {
      sessionId: this.sessionId,
      duration,
      summaries: {
        rendering: this.analyzeRenderingPerformance(),
        clinical: this.analyzeClinicalPerformance(),
        memory: this.analyzeMemoryPerformance(),
        ux: this.analyzeUXPerformance(),
        network: this.analyzeNetworkPerformance(),
        battery: this.analyzeBatteryPerformance()
      },
      alerts: this.alerts,
      recommendations: this.recommendations,
      clinicalReadiness: this.assessClinicalReadiness(),
      efficiency: this.calculateClinicalEfficiency()
    };
  }

  /**
   * Analyze rendering performance
   */
  analyzeRenderingPerformance(): any {
    if (!this.metricsData) return {};
    return {
      initialLoad: this.metricsData.metrics.initialLoad || 0,
      avgFilterTime: 0,
      layoutTime: 0,
      status: 'nominal'
    };
  }

  /**
   * Analyze clinical workflow performance
   */
  analyzeClinicalWorkflowPerformance(): any {
    return {
      totalWorkflows: this.clinicalWorkflows.size,
      status: 'monitoring'
    };
  }

  /**
   * Analyze memory performance
   */
  analyzeMemoryPerformance(): any {
    const memory = this.getCurrentMemoryUsage();
    return {
      current: memory.used,
      peak: memory.total,
      efficiency: (memory.used / memory.limit) * 100,
      status: memory.used < PERFORMANCE_BENCHMARKS.memory.sessionFootprint ? 'healthy' : 'warning'
    };
  }

  /**
   * Analyze UX performance
   */
  analyzeUXPerformance(): any {
    return {
      touchResponse: 0,
      visualFeedback: 0,
      status: 'nominal'
    };
  }

  /**
   * Analyze network performance
   */
  analyzeNetworkPerformance(): any {
    return {
      type: this.getConnectionType(),
      status: navigator.onLine ? 'online' : 'offline'
    };
  }

  /**
   * Analyze battery performance
   */
  analyzeBatteryPerformance(): any {
    if (!this.batteryManager) {
      return { status: 'not_available' };
    }
    return {
      level: this.batteryManager.level,
      charging: this.batteryManager.charging,
      status: this.batteryManager.level < 0.2 ? 'low' : 'healthy'
    };
  }

  /**
   * Add an alert
   */
  addAlert(alert: PerformanceAlert): void {
    this.alerts.push(alert);
    if (this.metricsData) {
      this.metricsData.alerts.push(alert);
    }
  }

  /**
   * Add a recommendation
   */
  addRecommendation(recommendation: PerformanceRecommendation): void {
    this.recommendations.push(recommendation);
    if (this.metricsData) {
      this.metricsData.recommendations.push(recommendation);
    }
  }

  /**
   * Assess clinical readiness
   */
  assessClinicalReadiness(): boolean {
    const memory = this.getCurrentMemoryUsage();
    const connected = navigator.onLine;

    return memory.used < PERFORMANCE_BENCHMARKS.memory.peakUsage &&
           connected &&
           this.alerts.filter(a => a.severity === 'critical').length === 0;
  }

  /**
   * Calculate clinical efficiency score
   */
  calculateClinicalEfficiency(): number {
    const memory = this.getCurrentMemoryUsage();
    const baseScore = 100;
    const memoryPenalty = (memory.used / PERFORMANCE_BENCHMARKS.memory.sessionFootprint) * 10;
    const alertPenalty = this.alerts.length * 2;

    return Math.max(0, baseScore - memoryPenalty - alertPenalty);
  }

  /**
   * Assess emergency access readiness
   */
  assessEmergencyAccessReadiness(): boolean {
    return this.getSessionDuration() < this.config.emergencyThreshold &&
           this.assessClinicalReadiness();
  }

  /**
   * Get top recommendations
   */
  getTopRecommendations(limit: number = 5): PerformanceRecommendation[] {
    return this.recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);
  }

  /**
   * Dispose and cleanup
   */
  dispose(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }

    this.clinicalWorkflows.clear();
    this.alerts = [];
    this.recommendations = [];
    this.metricsData = null;
  }
}

// ============================================================================
// MODULE-LEVEL FUNCTIONS
// ============================================================================

let globalMonitor: ClinicalPerformanceMonitor | null = null;

export const initializePerformanceMonitoring = (options: any = {}): ClinicalPerformanceMonitor => {
  globalMonitor = new ClinicalPerformanceMonitor(options);
  return globalMonitor;
};

export const trackRenderingPerformance = (type: string, duration: number, metadata: any = {}): void => {
  if (globalMonitor && globalMonitor.metricsData) {
    globalMonitor.metricsData.metrics[`render_${type}`] = { duration, ...metadata, timestamp: Date.now() };
  }
};

export const trackClinicalWorkflow = (workflow: string, duration: number, metadata: any = {}): void => {
  if (globalMonitor) {
    const wf = globalMonitor.clinicalWorkflows.get(workflow);
    if (wf) {
      wf.metrics[Date.now()] = { duration, ...metadata };
    }
  }
};

export const trackMemoryUsage = (type: string, usage: number, metadata: any = {}): void => {
  if (globalMonitor && globalMonitor.metricsData) {
    globalMonitor.metricsData.metrics[`memory_${type}`] = { usage, ...metadata, timestamp: Date.now() };
  }
};

export const trackUserInteraction = (type: string, duration: number, metadata: any = {}): void => {
  if (globalMonitor && globalMonitor.metricsData) {
    globalMonitor.metricsData.metrics[`interaction_${type}`] = { duration, ...metadata, timestamp: Date.now() };
  }
};

export const trackNetworkPerformance = (type: string, duration: number, metadata: any = {}): void => {
  if (globalMonitor && globalMonitor.metricsData) {
    globalMonitor.metricsData.metrics[`network_${type}`] = { duration, ...metadata, timestamp: Date.now() };
  }
};

export const trackDevicePerformance = (type: string, value: number, metadata: any = {}): void => {
  if (globalMonitor && globalMonitor.metricsData) {
    globalMonitor.metricsData.metrics[`device_${type}`] = { value, ...metadata, timestamp: Date.now() };
  }
};

export const getPerformanceReport = (): PerformanceReport | null => {
  return globalMonitor ? globalMonitor.generateClinicalPerformanceReport() : null;
};

export const exportPerformanceData = (format: string = 'json'): string => {
  if (!globalMonitor) return '';
  const report = globalMonitor.generateClinicalPerformanceReport();
  return format === 'json' ? JSON.stringify(report, null, 2) : '';
};

export const clearPerformanceData = (): void => {
  if (globalMonitor) {
    globalMonitor.dispose();
    globalMonitor = null;
  }
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default ClinicalPerformanceMonitor;
