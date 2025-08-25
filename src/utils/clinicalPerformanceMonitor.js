/**
 * Clinical Performance Monitor
 * 
 * Real-time performance metrics tracking and analytics for Northwestern antibiotic system
 * with clinical workflow bottleneck identification and optimization recommendations.
 * 
 * Created by: Agent 3.4 - Performance & Mobile Optimization Specialist
 * Phase: 3.4 - Performance Optimization & Mobile Clinical Workflows
 * Integration: Performance analytics for all Phase 3 Northwestern components
 * 
 * Features:
 * - Real-time performance metrics tracking with clinical context
 * - Clinical workflow bottleneck identification and recommendations
 * - Memory usage monitoring for extended clinical sessions (4+ hours)
 * - User interaction pattern optimization for clinical efficiency
 * - Emergency mode performance validation (<30 second access)
 * - Battery usage optimization metrics for mobile clinical devices
 * 
 * Analytics Categories:
 * - Rendering Performance: <2000ms initial load, <100ms filter response
 * - Clinical Workflow: Emergency access timing, decision efficiency
 * - Memory Management: Session footprint tracking, cleanup optimization
 * - User Experience: Touch response, gesture recognition, accessibility
 * - Network Performance: Offline capability, sync efficiency
 * - Device Performance: Battery impact, CPU usage, thermal management
 * 
 * @module clinicalPerformanceMonitor
 */

/**
 * Performance metric categories with clinical benchmarks
 */
const PERFORMANCE_BENCHMARKS = {
  rendering: {
    initialLoad: 2000,        // Northwestern system complete load
    filterApplication: 100,   // Real-time filtering response
    spatialLayout: 1000,      // 30 antibiotic positioning
    groupOperations: 100,     // Medical group calculations
    chartRendering: 500       // Individual pie chart rendering
  },
  clinical: {
    emergencyAccess: 30000,   // 30 seconds maximum for critical antibiotics
    decisionTime: 120000,     // 2 minutes average clinical decision
    contextSwitch: 2000,      // Context switching between antibiotics
    scenarioLoad: 5000,       // Clinical scenario loading time
    offlineAccess: 1000       // Offline data access speed
  },
  memory: {
    sessionFootprint: 50,     // 50MB maximum sustained usage
    peakUsage: 75,           // 75MB maximum peak usage
    cleanupThreshold: 40,     // Cleanup trigger threshold
    cacheEfficiency: 0.8     // 80% cache hit ratio target
  },
  ux: {
    touchResponse: 100,       // Touch gesture response time
    hapticLatency: 50,        // Haptic feedback delay
    visualFeedback: 150,      // Visual feedback duration
    accessibilityDelay: 200   // Screen reader announcement delay
  },
  network: {
    syncTime: 5000,          // Background synchronization
    offlineTransition: 1000,  // Online to offline transition
    cacheUpdate: 3000,       // Critical data cache update
    retryInterval: 2000      // Network retry interval
  },
  battery: {
    cpuEfficiency: 0.3,      // CPU usage efficiency target
    renderEfficiency: 0.5,   // Rendering power efficiency
    backgroundUsage: 0.1,    // Background processing efficiency
    idlePowerDraw: 0.05     // Idle state power consumption
  }
};

/**
 * Clinical workflow performance categories
 */
const CLINICAL_METRICS = {
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

/**
 * Real-time performance monitoring system
 */
export class ClinicalPerformanceMonitor {
  constructor(options = {}) {
    this.config = {
      enableRealTimeTracking: options.enableRealTimeTracking !== false,
      samplingRate: options.samplingRate || 1000, // 1 second intervals
      maxDataPoints: options.maxDataPoints || 2000, // 2000 data points = ~30 minutes at 1s
      clinicalContext: options.clinicalContext || 'education',
      sessionType: options.sessionType || 'standard',
      enableBatteryTracking: options.enableBatteryTracking !== false,
      enableClinicalAnalytics: options.enableClinicalAnalytics !== false
    };

    // Performance data storage
    this.metrics = {
      rendering: [],
      clinical: [],
      memory: [],
      ux: [],
      network: [],
      battery: [],
      system: []
    };

    // Real-time monitoring state
    this.session = {
      startTime: Date.now(),
      sessionId: this.generateSessionId(),
      clinicalContext: this.config.clinicalContext,
      activeWorkflow: null,
      urgencyLevel: 'standard'
    };

    // Performance alerts and recommendations
    this.alerts = [];
    this.recommendations = [];
    
    // Monitoring timers and observers
    this.monitoringTimer = null;
    this.performanceObserver = null;
    this.memoryTracker = null;

    // Clinical workflow tracking
    this.clinicalSessions = new Map();
    this.workflowTimers = new Map();

    this.initialize();
  }

  /**
   * Initialize monitoring system
   */
  initialize() {
    if (this.config.enableRealTimeTracking) {
      this.startRealTimeMonitoring();
    }

    this.initializePerformanceObserver();
    this.initializeBatteryMonitoring();
    this.setupClinicalWorkflowTracking();

    console.log(`Clinical Performance Monitor initialized for session: ${this.session.sessionId}`);
  }

  /**
   * Generate unique session identifier
   * @returns {string} Session ID
   */
  generateSessionId() {
    return `clinical-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start real-time performance monitoring
   */
  startRealTimeMonitoring() {
    this.monitoringTimer = setInterval(() => {
      this.captureSystemMetrics();
      this.analyzeClinicalPerformance();
      this.checkPerformanceThresholds();
      this.cleanupOldData();
    }, this.config.samplingRate);
  }

  /**
   * Initialize browser performance observer
   */
  initializePerformanceObserver() {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not available - limited performance tracking');
      return;
    }

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.processPerformanceEntry(entry);
        });
      });

      this.performanceObserver.observe({ 
        entryTypes: ['measure', 'navigation', 'paint', 'largest-contentful-paint'] 
      });
    } catch (error) {
      console.warn('Performance observer initialization failed:', error);
    }
  }

  /**
   * Initialize battery monitoring for mobile devices
   */
  initializeBatteryMonitoring() {
    if (!this.config.enableBatteryTracking || !('getBattery' in navigator)) {
      return;
    }

    navigator.getBattery().then(battery => {
      const trackBatteryChange = () => {
        this.recordBatteryMetric({
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
          timestamp: Date.now()
        });
      };

      battery.addEventListener('levelchange', trackBatteryChange);
      battery.addEventListener('chargingchange', trackBatteryChange);
      
      // Initial reading
      trackBatteryChange();
    }).catch(error => {
      console.warn('Battery monitoring not available:', error);
    });
  }

  /**
   * Setup clinical workflow tracking
   */
  setupClinicalWorkflowTracking() {
    if (!this.config.enableClinicalAnalytics) return;

    // Track page visibility for clinical session accuracy
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.recordClinicalMetric({
          type: 'session-pause',
          timestamp: Date.now(),
          sessionTime: this.getSessionDuration()
        });
      } else {
        this.recordClinicalMetric({
          type: 'session-resume',
          timestamp: Date.now(),
          sessionTime: this.getSessionDuration()
        });
      }
    });
  }

  /**
   * Record rendering performance metric
   * @param {Object} metric - Rendering performance data
   */
  recordRenderingMetric(metric) {
    const enhancedMetric = {
      ...metric,
      timestamp: Date.now(),
      sessionTime: this.getSessionDuration(),
      category: 'rendering',
      sessionId: this.session.sessionId,
      clinicalContext: this.session.clinicalContext
    };

    this.metrics.rendering.push(enhancedMetric);
    
    // Check against benchmarks
    if (metric.duration > PERFORMANCE_BENCHMARKS.rendering[metric.type]) {
      this.createAlert('rendering-performance', 
        `${metric.type} took ${metric.duration}ms (target: ${PERFORMANCE_BENCHMARKS.rendering[metric.type]}ms)`,
        'warning'
      );
    }

    this.limitMetricsArray('rendering');
  }

  /**
   * Record clinical workflow metric
   * @param {Object} metric - Clinical workflow data
   */
  recordClinicalMetric(metric) {
    const enhancedMetric = {
      ...metric,
      timestamp: Date.now(),
      sessionTime: this.getSessionDuration(),
      category: 'clinical',
      sessionId: this.session.sessionId,
      activeWorkflow: this.session.activeWorkflow,
      urgencyLevel: this.session.urgencyLevel
    };

    this.metrics.clinical.push(enhancedMetric);

    // Special handling for emergency access
    if (metric.type === 'emergency-access') {
      const accessTime = metric.duration || (Date.now() - metric.startTime);
      
      if (accessTime > PERFORMANCE_BENCHMARKS.clinical.emergencyAccess) {
        this.createAlert('emergency-access', 
          `Emergency access took ${(accessTime/1000).toFixed(1)}s (target: 30s)`,
          'critical'
        );
      }
      
      // Add to clinical session tracking
      this.updateClinicalSession(metric.workflow || 'emergency', accessTime);
    }

    this.limitMetricsArray('clinical');
  }

  /**
   * Record memory usage metric
   * @param {Object} metric - Memory usage data
   */
  recordMemoryMetric(metric) {
    const enhancedMetric = {
      ...metric,
      timestamp: Date.now(),
      sessionTime: this.getSessionDuration(),
      category: 'memory',
      sessionId: this.session.sessionId
    };

    this.metrics.memory.push(enhancedMetric);

    // Check memory thresholds
    if (metric.usage > PERFORMANCE_BENCHMARKS.memory.sessionFootprint) {
      this.createAlert('memory-usage',
        `Memory usage ${metric.usage.toFixed(2)}MB (target: ${PERFORMANCE_BENCHMARKS.memory.sessionFootprint}MB)`,
        metric.usage > PERFORMANCE_BENCHMARKS.memory.peakUsage ? 'critical' : 'warning'
      );
    }

    this.limitMetricsArray('memory');
  }

  /**
   * Record user experience metric
   * @param {Object} metric - UX performance data
   */
  recordUXMetric(metric) {
    const enhancedMetric = {
      ...metric,
      timestamp: Date.now(),
      sessionTime: this.getSessionDuration(),
      category: 'ux',
      sessionId: this.session.sessionId,
      deviceType: this.detectDeviceType()
    };

    this.metrics.ux.push(enhancedMetric);

    // Check UX benchmarks
    if (metric.type === 'touch-response' && metric.duration > PERFORMANCE_BENCHMARKS.ux.touchResponse) {
      this.createAlert('ux-performance',
        `Touch response delayed: ${metric.duration}ms (target: ${PERFORMANCE_BENCHMARKS.ux.touchResponse}ms)`,
        'warning'
      );
    }

    this.limitMetricsArray('ux');
  }

  /**
   * Record network performance metric
   * @param {Object} metric - Network performance data
   */
  recordNetworkMetric(metric) {
    const enhancedMetric = {
      ...metric,
      timestamp: Date.now(),
      sessionTime: this.getSessionDuration(),
      category: 'network',
      sessionId: this.session.sessionId,
      connectionType: this.getConnectionType()
    };

    this.metrics.network.push(enhancedMetric);
    this.limitMetricsArray('network');
  }

  /**
   * Record battery performance metric
   * @param {Object} metric - Battery usage data
   */
  recordBatteryMetric(metric) {
    const enhancedMetric = {
      ...metric,
      sessionTime: this.getSessionDuration(),
      category: 'battery',
      sessionId: this.session.sessionId
    };

    this.metrics.battery.push(enhancedMetric);
    this.limitMetricsArray('battery');
  }

  /**
   * Start clinical workflow tracking
   * @param {string} workflowType - Type of clinical workflow
   * @param {string} urgencyLevel - Urgency level (emergency, urgent, standard)
   */
  startClinicalWorkflow(workflowType, urgencyLevel = 'standard') {
    const workflowId = `${workflowType}-${Date.now()}`;
    
    this.session.activeWorkflow = workflowType;
    this.session.urgencyLevel = urgencyLevel;
    
    this.workflowTimers.set(workflowId, {
      workflowType,
      urgencyLevel,
      startTime: Date.now(),
      expectedDuration: CLINICAL_METRICS.urgencyLevels[urgencyLevel].maxTime,
      interactions: 0,
      decisions: 0
    });

    this.recordClinicalMetric({
      type: 'workflow-start',
      workflowId,
      workflowType,
      urgencyLevel,
      startTime: Date.now()
    });

    return workflowId;
  }

  /**
   * End clinical workflow tracking
   * @param {string} workflowId - Workflow identifier
   * @param {Object} outcome - Workflow outcome data
   */
  endClinicalWorkflow(workflowId, outcome = {}) {
    const workflow = this.workflowTimers.get(workflowId);
    if (!workflow) return;

    const endTime = Date.now();
    const duration = endTime - workflow.startTime;
    const efficiency = workflow.expectedDuration > 0 ? 
      Math.min(1, workflow.expectedDuration / duration) : 1;

    this.recordClinicalMetric({
      type: 'workflow-end',
      workflowId,
      workflowType: workflow.workflowType,
      urgencyLevel: workflow.urgencyLevel,
      duration,
      efficiency,
      interactions: workflow.interactions,
      decisions: workflow.decisions,
      outcome,
      endTime
    });

    // Update clinical session data
    this.updateClinicalSession(workflow.workflowType, duration);
    
    // Clean up
    this.workflowTimers.delete(workflowId);
    this.session.activeWorkflow = null;
    this.session.urgencyLevel = 'standard';
  }

  /**
   * Record clinical interaction
   * @param {string} workflowId - Active workflow ID
   * @param {Object} interaction - Interaction data
   */
  recordClinicalInteraction(workflowId, interaction) {
    const workflow = this.workflowTimers.get(workflowId);
    if (workflow) {
      workflow.interactions++;
      
      if (interaction.type === 'antibiotic-selection' || interaction.type === 'decision') {
        workflow.decisions++;
      }
    }

    this.recordClinicalMetric({
      type: 'clinical-interaction',
      workflowId,
      ...interaction
    });
  }

  /**
   * Update clinical session statistics
   * @param {string} workflowType - Workflow type
   * @param {number} duration - Workflow duration
   */
  updateClinicalSession(workflowType, duration) {
    if (!this.clinicalSessions.has(workflowType)) {
      this.clinicalSessions.set(workflowType, {
        count: 0,
        totalTime: 0,
        averageTime: 0,
        minTime: Infinity,
        maxTime: 0,
        efficiencyScores: []
      });
    }

    const session = this.clinicalSessions.get(workflowType);
    session.count++;
    session.totalTime += duration;
    session.averageTime = session.totalTime / session.count;
    session.minTime = Math.min(session.minTime, duration);
    session.maxTime = Math.max(session.maxTime, duration);

    // Calculate efficiency score
    const expectedTime = CLINICAL_METRICS.urgencyLevels[this.session.urgencyLevel]?.maxTime || 300000;
    const efficiency = Math.min(1, expectedTime / duration);
    session.efficiencyScores.push(efficiency);
  }

  /**
   * Capture current system metrics
   */
  captureSystemMetrics() {
    const memoryUsage = this.getCurrentMemoryUsage();
    const timestamp = Date.now();

    // Record system performance
    this.metrics.system.push({
      timestamp,
      sessionTime: this.getSessionDuration(),
      memoryUsage,
      performanceNow: performance.now(),
      category: 'system',
      sessionId: this.session.sessionId
    });

    // Record memory specifically
    if (memoryUsage > 0) {
      this.recordMemoryMetric({
        type: 'system-sample',
        usage: memoryUsage,
        timestamp
      });
    }

    this.limitMetricsArray('system');
  }

  /**
   * Analyze clinical performance patterns
   */
  analyzeClinicalPerformance() {
    const recentClinicalMetrics = this.metrics.clinical.slice(-10);
    if (recentClinicalMetrics.length === 0) return;

    // Analyze decision patterns
    const decisionTimes = recentClinicalMetrics
      .filter(m => m.type === 'clinical-interaction' && m.interactionType === 'decision')
      .map(m => m.duration);

    if (decisionTimes.length >= 3) {
      const avgDecisionTime = decisionTimes.reduce((sum, time) => sum + time, 0) / decisionTimes.length;
      
      if (avgDecisionTime > PERFORMANCE_BENCHMARKS.clinical.decisionTime) {
        this.createRecommendation('clinical-efficiency',
          `Average decision time ${(avgDecisionTime/1000).toFixed(1)}s is above target. Consider streamlining workflows.`
        );
      }
    }

    // Analyze workflow efficiency
    this.clinicalSessions.forEach((session, workflowType) => {
      const recentEfficiency = session.efficiencyScores.slice(-5);
      if (recentEfficiency.length >= 3) {
        const avgEfficiency = recentEfficiency.reduce((sum, eff) => sum + eff, 0) / recentEfficiency.length;
        
        if (avgEfficiency < 0.7) {
          this.createRecommendation('workflow-optimization',
            `${workflowType} efficiency ${(avgEfficiency * 100).toFixed(1)}% below target. Review workflow design.`
          );
        }
      }
    });
  }

  /**
   * Check performance against thresholds and create alerts
   */
  checkPerformanceThresholds() {
    const currentMemory = this.getCurrentMemoryUsage();
    const sessionDuration = this.getSessionDuration();

    // Memory threshold checks
    if (currentMemory > PERFORMANCE_BENCHMARKS.memory.cleanupThreshold) {
      this.createAlert('memory-cleanup',
        `Memory usage ${currentMemory.toFixed(2)}MB approaching cleanup threshold`,
        'info'
      );
    }

    // Extended session monitoring
    if (sessionDuration > 4 * 60 * 60 * 1000) { // 4 hours
      this.createRecommendation('session-management',
        'Extended clinical session detected. Consider periodic refresh for optimal performance.'
      );
    }

    // Performance degradation detection
    const recentRenderingMetrics = this.metrics.rendering.slice(-5);
    if (recentRenderingMetrics.length === 5) {
      const avgRenderTime = recentRenderingMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / 5;
      const initialRenderTime = this.metrics.rendering.slice(0, 5)
        .reduce((sum, m) => sum + (m.duration || 0), 0) / Math.min(5, this.metrics.rendering.length);

      if (avgRenderTime > initialRenderTime * 1.5) {
        this.createAlert('performance-degradation',
          'Rendering performance has degraded. Consider performance optimization.',
          'warning'
        );
      }
    }
  }

  /**
   * Process performance observer entry
   * @param {PerformanceEntry} entry - Performance entry
   */
  processPerformanceEntry(entry) {
    let metricType = 'unknown';
    let duration = entry.duration;

    switch (entry.entryType) {
      case 'navigation':
        metricType = 'page-load';
        duration = entry.loadEventEnd - entry.fetchStart;
        break;
      case 'paint':
        metricType = entry.name === 'first-paint' ? 'first-paint' : 'first-contentful-paint';
        duration = entry.startTime;
        break;
      case 'largest-contentful-paint':
        metricType = 'largest-contentful-paint';
        duration = entry.startTime;
        break;
      case 'measure':
        metricType = entry.name;
        duration = entry.duration;
        break;
    }

    this.recordRenderingMetric({
      type: metricType,
      duration,
      name: entry.name,
      entryType: entry.entryType,
      timestamp: Date.now()
    });
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
      sessionTime: this.getSessionDuration(),
      sessionId: this.session.sessionId
    };

    this.alerts.push(alert);

    // Limit alerts array size
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    // Console output based on severity
    switch (severity) {
      case 'critical':
        console.error(`Clinical Performance Alert: ${message}`);
        break;
      case 'warning':
        console.warn(`Clinical Performance Alert: ${message}`);
        break;
      default:
        console.info(`Clinical Performance Alert: ${message}`);
    }
  }

  /**
   * Create performance recommendation
   * @param {string} type - Recommendation type
   * @param {string} message - Recommendation message
   */
  createRecommendation(type, message) {
    const recommendation = {
      type,
      message,
      timestamp: Date.now(),
      sessionTime: this.getSessionDuration(),
      sessionId: this.session.sessionId
    };

    this.recommendations.push(recommendation);

    // Limit recommendations array size
    if (this.recommendations.length > 50) {
      this.recommendations = this.recommendations.slice(-50);
    }
  }

  /**
   * Get current session duration
   * @returns {number} Duration in milliseconds
   */
  getSessionDuration() {
    return Date.now() - this.session.startTime;
  }

  /**
   * Get current memory usage estimate
   * @returns {number} Memory usage in MB
   */
  getCurrentMemoryUsage() {
    if ('performance' in window && 'memory' in performance) {
      return performance.memory.usedJSHeapSize / (1024 * 1024);
    }
    return 0;
  }

  /**
   * Detect device type for UX metrics
   * @returns {string} Device type
   */
  detectDeviceType() {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  /**
   * Get network connection type
   * @returns {string} Connection type
   */
  getConnectionType() {
    if ('connection' in navigator) {
      return navigator.connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  /**
   * Limit metrics array size to prevent memory growth
   * @param {string} metricType - Type of metrics to limit
   */
  limitMetricsArray(metricType) {
    if (this.metrics[metricType].length > this.config.maxDataPoints) {
      this.metrics[metricType] = this.metrics[metricType].slice(-this.config.maxDataPoints);
    }
  }

  /**
   * Clean up old data beyond retention period
   */
  cleanupOldData() {
    const cutoffTime = Date.now() - (2 * 60 * 60 * 1000); // 2 hours retention

    Object.keys(this.metrics).forEach(key => {
      this.metrics[key] = this.metrics[key].filter(metric => metric.timestamp > cutoffTime);
    });

    // Clean up alerts and recommendations
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffTime);
    this.recommendations = this.recommendations.filter(rec => rec.timestamp > cutoffTime);
  }

  /**
   * Generate comprehensive clinical performance report
   * @returns {Object} Complete performance analysis
   */
  generateClinicalPerformanceReport() {
    const sessionDuration = this.getSessionDuration();
    const currentMemory = this.getCurrentMemoryUsage();

    return {
      sessionInfo: {
        sessionId: this.session.sessionId,
        startTime: new Date(this.session.startTime).toISOString(),
        duration: (sessionDuration / 1000).toFixed(1) + 's',
        durationHours: (sessionDuration / (1000 * 60 * 60)).toFixed(2) + 'h',
        clinicalContext: this.session.clinicalContext,
        activeWorkflow: this.session.activeWorkflow,
        urgencyLevel: this.session.urgencyLevel
      },
      renderingAnalytics: this.analyzeRenderingPerformance(),
      clinicalAnalytics: this.analyzeClinicalWorkflowPerformance(),
      memoryAnalytics: this.analyzeMemoryPerformance(),
      uxAnalytics: this.analyzeUXPerformance(),
      networkAnalytics: this.analyzeNetworkPerformance(),
      batteryAnalytics: this.analyzeBatteryPerformance(),
      alertSummary: this.summarizeAlerts(),
      recommendationsSummary: this.summarizeRecommendations(),
      clinicalReadiness: this.assessClinicalReadiness()
    };
  }

  /**
   * Analyze rendering performance metrics
   * @returns {Object} Rendering performance analysis
   */
  analyzeRenderingPerformance() {
    const renderingMetrics = this.metrics.rendering;
    if (renderingMetrics.length === 0) {
      return { status: 'no-data', message: 'No rendering performance data available' };
    }

    const byType = {};
    renderingMetrics.forEach(metric => {
      if (!byType[metric.type]) {
        byType[metric.type] = [];
      }
      byType[metric.type].push(metric.duration);
    });

    const analysis = {};
    Object.keys(byType).forEach(type => {
      const durations = byType[type];
      const average = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      const benchmark = PERFORMANCE_BENCHMARKS.rendering[type] || 1000;
      
      analysis[type] = {
        count: durations.length,
        average: average.toFixed(2),
        min: Math.min(...durations).toFixed(2),
        max: Math.max(...durations).toFixed(2),
        benchmark,
        meetingBenchmark: average <= benchmark,
        performanceRatio: (average / benchmark).toFixed(2)
      };
    });

    return {
      status: 'analyzed',
      totalMetrics: renderingMetrics.length,
      typeAnalysis: analysis,
      overallPerformance: this.calculateOverallRenderingPerformance(analysis)
    };
  }

  /**
   * Analyze clinical workflow performance
   * @returns {Object} Clinical workflow analysis
   */
  analyzeClinicalWorkflowPerformance() {
    const clinicalMetrics = this.metrics.clinical;
    if (clinicalMetrics.length === 0) {
      return { status: 'no-data', message: 'No clinical workflow data available' };
    }

    const workflowAnalysis = {};
    this.clinicalSessions.forEach((session, workflowType) => {
      const avgEfficiency = session.efficiencyScores.length > 0 
        ? session.efficiencyScores.reduce((sum, eff) => sum + eff, 0) / session.efficiencyScores.length
        : 0;

      workflowAnalysis[workflowType] = {
        sessionCount: session.count,
        averageTime: (session.averageTime / 1000).toFixed(1) + 's',
        minTime: (session.minTime / 1000).toFixed(1) + 's',
        maxTime: (session.maxTime / 1000).toFixed(1) + 's',
        efficiency: (avgEfficiency * 100).toFixed(1) + '%',
        totalTime: (session.totalTime / 1000).toFixed(1) + 's'
      };
    });

    // Emergency access analysis
    const emergencyAccessMetrics = clinicalMetrics.filter(m => m.type === 'emergency-access');
    const emergencyAnalysis = emergencyAccessMetrics.length > 0 ? {
      count: emergencyAccessMetrics.length,
      averageTime: (emergencyAccessMetrics.reduce((sum, m) => sum + m.duration, 0) / emergencyAccessMetrics.length / 1000).toFixed(1) + 's',
      meetingTarget: emergencyAccessMetrics.every(m => m.duration <= PERFORMANCE_BENCHMARKS.clinical.emergencyAccess)
    } : null;

    return {
      status: 'analyzed',
      totalClinicalMetrics: clinicalMetrics.length,
      workflowAnalysis,
      emergencyAccess: emergencyAnalysis,
      clinicalEfficiency: this.calculateClinicalEfficiency()
    };
  }

  /**
   * Analyze memory performance
   * @returns {Object} Memory performance analysis
   */
  analyzeMemoryPerformance() {
    const memoryMetrics = this.metrics.memory;
    if (memoryMetrics.length === 0) {
      return { status: 'no-data', message: 'No memory performance data available' };
    }

    const usageValues = memoryMetrics.map(m => m.usage).filter(u => u > 0);
    if (usageValues.length === 0) {
      return { status: 'no-data', message: 'No valid memory usage data' };
    }

    const currentUsage = usageValues[usageValues.length - 1];
    const averageUsage = usageValues.reduce((sum, u) => sum + u, 0) / usageValues.length;
    const peakUsage = Math.max(...usageValues);
    const minUsage = Math.min(...usageValues);

    return {
      status: 'analyzed',
      currentUsage: currentUsage.toFixed(2) + 'MB',
      averageUsage: averageUsage.toFixed(2) + 'MB',
      peakUsage: peakUsage.toFixed(2) + 'MB',
      minUsage: minUsage.toFixed(2) + 'MB',
      benchmark: PERFORMANCE_BENCHMARKS.memory.sessionFootprint + 'MB',
      utilizationPercentage: ((currentUsage / PERFORMANCE_BENCHMARKS.memory.sessionFootprint) * 100).toFixed(1) + '%',
      withinBenchmark: currentUsage <= PERFORMANCE_BENCHMARKS.memory.sessionFootprint,
      memoryTrend: this.calculateMemoryTrend(usageValues)
    };
  }

  /**
   * Analyze UX performance metrics
   * @returns {Object} UX performance analysis
   */
  analyzeUXPerformance() {
    const uxMetrics = this.metrics.ux;
    if (uxMetrics.length === 0) {
      return { status: 'no-data', message: 'No UX performance data available' };
    }

    const touchResponses = uxMetrics.filter(m => m.type === 'touch-response');
    const gestureRecognition = uxMetrics.filter(m => m.type === 'gesture-recognition');
    
    const analysis = {
      totalUXEvents: uxMetrics.length,
      deviceTypes: this.analyzeDeviceTypes(uxMetrics)
    };

    if (touchResponses.length > 0) {
      const avgTouchResponse = touchResponses.reduce((sum, m) => sum + m.duration, 0) / touchResponses.length;
      analysis.touchPerformance = {
        count: touchResponses.length,
        averageResponse: avgTouchResponse.toFixed(2) + 'ms',
        benchmark: PERFORMANCE_BENCHMARKS.ux.touchResponse + 'ms',
        meetingBenchmark: avgTouchResponse <= PERFORMANCE_BENCHMARKS.ux.touchResponse
      };
    }

    if (gestureRecognition.length > 0) {
      const avgGestureTime = gestureRecognition.reduce((sum, m) => sum + m.duration, 0) / gestureRecognition.length;
      analysis.gesturePerformance = {
        count: gestureRecognition.length,
        averageRecognition: avgGestureTime.toFixed(2) + 'ms',
        accuracy: this.calculateGestureAccuracy(gestureRecognition)
      };
    }

    return {
      status: 'analyzed',
      ...analysis
    };
  }

  /**
   * Analyze network performance
   * @returns {Object} Network performance analysis
   */
  analyzeNetworkPerformance() {
    const networkMetrics = this.metrics.network;
    if (networkMetrics.length === 0) {
      return { status: 'no-data', message: 'No network performance data available' };
    }

    const syncOperations = networkMetrics.filter(m => m.type === 'sync');
    const offlineTransitions = networkMetrics.filter(m => m.type === 'offline-transition');
    
    const analysis = {
      totalNetworkEvents: networkMetrics.length,
      connectionTypes: this.analyzeConnectionTypes(networkMetrics)
    };

    if (syncOperations.length > 0) {
      const avgSyncTime = syncOperations.reduce((sum, m) => sum + m.duration, 0) / syncOperations.length;
      analysis.syncPerformance = {
        count: syncOperations.length,
        averageTime: avgSyncTime.toFixed(2) + 'ms',
        benchmark: PERFORMANCE_BENCHMARKS.network.syncTime + 'ms',
        meetingBenchmark: avgSyncTime <= PERFORMANCE_BENCHMARKS.network.syncTime
      };
    }

    if (offlineTransitions.length > 0) {
      analysis.offlineCapability = {
        transitionCount: offlineTransitions.length,
        averageTransitionTime: (offlineTransitions.reduce((sum, m) => sum + m.duration, 0) / offlineTransitions.length).toFixed(2) + 'ms'
      };
    }

    return {
      status: 'analyzed',
      ...analysis
    };
  }

  /**
   * Analyze battery performance
   * @returns {Object} Battery performance analysis
   */
  analyzeBatteryPerformance() {
    const batteryMetrics = this.metrics.battery;
    if (batteryMetrics.length === 0) {
      return { status: 'no-data', message: 'No battery performance data available' };
    }

    const latestBattery = batteryMetrics[batteryMetrics.length - 1];
    const initialBattery = batteryMetrics[0];
    const batteryDrop = initialBattery.level - latestBattery.level;
    const sessionHours = this.getSessionDuration() / (1000 * 60 * 60);
    const drainRate = sessionHours > 0 ? (batteryDrop / sessionHours) * 100 : 0;

    return {
      status: 'analyzed',
      currentLevel: (latestBattery.level * 100).toFixed(1) + '%',
      charging: latestBattery.charging,
      sessionDrain: (batteryDrop * 100).toFixed(1) + '%',
      drainRate: drainRate.toFixed(1) + '%/hour',
      efficiency: drainRate < 20 ? 'excellent' : drainRate < 30 ? 'good' : 'needs-optimization'
    };
  }

  /**
   * Summarize alerts
   * @returns {Object} Alert summary
   */
  summarizeAlerts() {
    if (this.alerts.length === 0) {
      return { status: 'no-alerts', message: 'No performance alerts generated' };
    }

    const severityCount = {};
    const typeCount = {};
    
    this.alerts.forEach(alert => {
      severityCount[alert.severity] = (severityCount[alert.severity] || 0) + 1;
      typeCount[alert.type] = (typeCount[alert.type] || 0) + 1;
    });

    return {
      status: 'alerts-present',
      totalAlerts: this.alerts.length,
      recentAlerts: this.alerts.slice(-5),
      severityBreakdown: severityCount,
      typeBreakdown: typeCount,
      criticalAlerts: this.alerts.filter(a => a.severity === 'critical').length
    };
  }

  /**
   * Summarize recommendations
   * @returns {Object} Recommendations summary
   */
  summarizeRecommendations() {
    if (this.recommendations.length === 0) {
      return { status: 'no-recommendations', message: 'No performance recommendations available' };
    }

    const typeCount = {};
    this.recommendations.forEach(rec => {
      typeCount[rec.type] = (typeCount[rec.type] || 0) + 1;
    });

    return {
      status: 'recommendations-available',
      totalRecommendations: this.recommendations.length,
      recentRecommendations: this.recommendations.slice(-3),
      typeBreakdown: typeCount,
      topRecommendations: this.getTopRecommendations()
    };
  }

  /**
   * Assess overall clinical readiness
   * @returns {Object} Clinical readiness assessment
   */
  assessClinicalReadiness() {
    const memoryOk = this.getCurrentMemoryUsage() <= PERFORMANCE_BENCHMARKS.memory.sessionFootprint;
    const criticalAlerts = this.alerts.filter(a => a.severity === 'critical').length;
    const emergencyAccessOk = this.assessEmergencyAccessReadiness();
    
    let readinessScore = 100;
    const issues = [];

    if (!memoryOk) {
      readinessScore -= 30;
      issues.push('Memory usage exceeds clinical benchmark');
    }

    if (criticalAlerts > 0) {
      readinessScore -= 20 * criticalAlerts;
      issues.push(`${criticalAlerts} critical performance alerts`);
    }

    if (!emergencyAccessOk) {
      readinessScore -= 25;
      issues.push('Emergency access time exceeds 30-second target');
    }

    readinessScore = Math.max(0, readinessScore);

    let readinessLevel;
    if (readinessScore >= 90) {
      readinessLevel = 'excellent';
    } else if (readinessScore >= 75) {
      readinessLevel = 'good';
    } else if (readinessScore >= 60) {
      readinessLevel = 'acceptable';
    } else {
      readinessLevel = 'needs-attention';
    }

    return {
      score: readinessScore,
      level: readinessLevel,
      clinicallyReady: readinessScore >= 75,
      issues,
      recommendations: this.generateClinicalReadinessRecommendations(readinessScore, issues)
    };
  }

  /**
   * Calculate overall rendering performance score
   * @param {Object} analysis - Type analysis results
   * @returns {Object} Overall performance assessment
   */
  calculateOverallRenderingPerformance(analysis) {
    const typeScores = Object.values(analysis).map(typeData => 
      typeData.meetingBenchmark ? 100 : Math.max(0, 100 - (parseFloat(typeData.performanceRatio) - 1) * 50)
    );
    
    const averageScore = typeScores.reduce((sum, score) => sum + score, 0) / typeScores.length;
    
    return {
      score: averageScore.toFixed(1),
      level: averageScore >= 90 ? 'excellent' : averageScore >= 75 ? 'good' : 'needs-optimization'
    };
  }

  /**
   * Calculate clinical efficiency score
   * @returns {Object} Clinical efficiency metrics
   */
  calculateClinicalEfficiency() {
    if (this.clinicalSessions.size === 0) {
      return { score: 0, level: 'no-data' };
    }

    let totalEfficiency = 0;
    let sessionCount = 0;

    this.clinicalSessions.forEach(session => {
      if (session.efficiencyScores.length > 0) {
        const avgEfficiency = session.efficiencyScores.reduce((sum, eff) => sum + eff, 0) / session.efficiencyScores.length;
        totalEfficiency += avgEfficiency;
        sessionCount++;
      }
    });

    if (sessionCount === 0) {
      return { score: 0, level: 'no-data' };
    }

    const overallEfficiency = (totalEfficiency / sessionCount) * 100;
    
    return {
      score: overallEfficiency.toFixed(1),
      level: overallEfficiency >= 80 ? 'excellent' : overallEfficiency >= 65 ? 'good' : 'needs-improvement'
    };
  }

  /**
   * Calculate memory usage trend
   * @param {Array} usageValues - Memory usage values
   * @returns {string} Trend description
   */
  calculateMemoryTrend(usageValues) {
    if (usageValues.length < 10) return 'insufficient-data';

    const recent = usageValues.slice(-5);
    const older = usageValues.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    
    const change = (recentAvg - olderAvg) / olderAvg;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  /**
   * Analyze device types from UX metrics
   * @param {Array} uxMetrics - UX metrics array
   * @returns {Object} Device type breakdown
   */
  analyzeDeviceTypes(uxMetrics) {
    const deviceCounts = {};
    uxMetrics.forEach(metric => {
      const device = metric.deviceType || 'unknown';
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    return deviceCounts;
  }

  /**
   * Calculate gesture recognition accuracy
   * @param {Array} gestureMetrics - Gesture recognition metrics
   * @returns {string} Accuracy percentage
   */
  calculateGestureAccuracy(gestureMetrics) {
    const successful = gestureMetrics.filter(m => m.recognized === true).length;
    const accuracy = (successful / gestureMetrics.length) * 100;
    return accuracy.toFixed(1) + '%';
  }

  /**
   * Analyze connection types from network metrics
   * @param {Array} networkMetrics - Network metrics array
   * @returns {Object} Connection type breakdown
   */
  analyzeConnectionTypes(networkMetrics) {
    const connectionCounts = {};
    networkMetrics.forEach(metric => {
      const connection = metric.connectionType || 'unknown';
      connectionCounts[connection] = (connectionCounts[connection] || 0) + 1;
    });
    return connectionCounts;
  }

  /**
   * Assess emergency access readiness
   * @returns {boolean} Whether emergency access meets requirements
   */
  assessEmergencyAccessReadiness() {
    const emergencyMetrics = this.metrics.clinical.filter(m => m.type === 'emergency-access');
    if (emergencyMetrics.length === 0) return true; // No emergency access attempts yet

    const recentEmergencyAccess = emergencyMetrics.slice(-5);
    const avgAccessTime = recentEmergencyAccess.reduce((sum, m) => sum + m.duration, 0) / recentEmergencyAccess.length;
    
    return avgAccessTime <= PERFORMANCE_BENCHMARKS.clinical.emergencyAccess;
  }

  /**
   * Get top performance recommendations
   * @returns {Array} Top recommendations
   */
  getTopRecommendations() {
    // Group recommendations by type and get most recent for each type
    const byType = {};
    this.recommendations.forEach(rec => {
      if (!byType[rec.type] || byType[rec.type].timestamp < rec.timestamp) {
        byType[rec.type] = rec;
      }
    });

    return Object.values(byType).slice(0, 3);
  }

  /**
   * Generate clinical readiness recommendations
   * @param {number} score - Readiness score
   * @param {Array} issues - Array of issues
   * @returns {Array} Recommendations
   */
  generateClinicalReadinessRecommendations(score, issues) {
    const recommendations = [];

    if (score < 75) {
      recommendations.push('Consider refreshing the application to restore optimal performance');
    }

    if (issues.some(issue => issue.includes('Memory'))) {
      recommendations.push('Enable automatic memory cleanup or reduce concurrent operations');
    }

    if (issues.some(issue => issue.includes('emergency'))) {
      recommendations.push('Optimize emergency mode settings and enable performance prioritization');
    }

    if (issues.some(issue => issue.includes('alerts'))) {
      recommendations.push('Review and address critical performance alerts before clinical use');
    }

    return recommendations;
  }

  /**
   * Export performance data for analysis
   * @param {string} format - Export format ('json' or 'csv')
   * @returns {string} Exported data
   */
  exportPerformanceData(format = 'json') {
    const exportData = {
      sessionInfo: this.session,
      metrics: this.metrics,
      alerts: this.alerts,
      recommendations: this.recommendations,
      clinicalSessions: Object.fromEntries(this.clinicalSessions),
      exportTimestamp: new Date().toISOString()
    };

    if (format === 'csv') {
      // Simplified CSV export of key metrics
      const csvRows = [];
      csvRows.push('timestamp,category,type,duration,sessionTime');
      
      Object.keys(this.metrics).forEach(category => {
        this.metrics[category].forEach(metric => {
          csvRows.push(`${metric.timestamp},${category},${metric.type || 'unknown'},${metric.duration || 0},${metric.sessionTime}`);
        });
      });
      
      return csvRows.join('\n');
    }

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Stop monitoring and clean up resources
   */
  dispose() {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = null;
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }

    // Clear all data
    Object.keys(this.metrics).forEach(key => {
      this.metrics[key] = [];
    });
    
    this.alerts = [];
    this.recommendations = [];
    this.clinicalSessions.clear();
    this.workflowTimers.clear();

    console.log(`Clinical Performance Monitor disposed for session: ${this.session.sessionId}`);
  }
}

// Create global monitor instance for standalone function exports
let globalMonitor = null;

const getGlobalMonitor = () => {
  if (!globalMonitor) {
    globalMonitor = new ClinicalPerformanceMonitor();
  }
  return globalMonitor;
};

// Export individual functions for backward compatibility with tests
export const initializePerformanceMonitoring = (options = {}) => {
  globalMonitor = new ClinicalPerformanceMonitor(options);
  return globalMonitor;
};

export const trackRenderingPerformance = (type, duration, metadata = {}) => {
  return getGlobalMonitor().recordRenderingMetric({ type, duration, ...metadata });
};

export const trackClinicalWorkflow = (workflow, duration, metadata = {}) => {
  return getGlobalMonitor().recordClinicalMetric({ type: workflow, duration, ...metadata });
};

export const trackMemoryUsage = (type, usage, metadata = {}) => {
  return getGlobalMonitor().recordMemoryMetric({ type, usage, ...metadata });
};

export const trackUserInteraction = (type, duration, metadata = {}) => {
  return getGlobalMonitor().recordUXMetric({ type, duration, ...metadata });
};

export const trackNetworkPerformance = (type, duration, metadata = {}) => {
  return getGlobalMonitor().recordNetworkMetric({ type, duration, ...metadata });
};

export const trackDevicePerformance = (type, value, metadata = {}) => {
  return getGlobalMonitor().recordBatteryMetric({ type, value, ...metadata });
};

export const getPerformanceReport = () => {
  return getGlobalMonitor().generateClinicalPerformanceReport();
};

export const exportPerformanceData = (format = 'json') => {
  return getGlobalMonitor().exportPerformanceData(format);
};

export const clearPerformanceData = () => {
  if (globalMonitor) {
    globalMonitor.dispose();
    globalMonitor = null;
  }
};

// Export for use in other components
export default ClinicalPerformanceMonitor;