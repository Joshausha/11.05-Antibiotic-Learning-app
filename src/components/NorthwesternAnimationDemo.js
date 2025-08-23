/**
 * Northwestern Animation System Demo
 * 
 * Comprehensive demonstration of Agent 2.4's animation framework integration
 * with Northwestern pie charts. Shows all animation phases and clinical workflows.
 * 
 * Created by: Agent 2.4 - Animation & Transition Expert
 * Purpose: Demonstrate clinical animation system capabilities
 * Integration: Uses AnimatedNorthwesternPieChart with NorthwesternInteractionSystem
 * 
 * Features:
 * - Animation phase demonstration
 * - Emergency mode testing
 * - Educational level comparisons
 * - Performance mode testing
 * - Clinical workflow animations
 * 
 * @component
 * @example
 * <NorthwesternAnimationDemo 
 *   onDemoComplete={(metrics) => console.log('Demo metrics:', metrics)}
 * />
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import PropTypes from 'prop-types';
import AnimatedNorthwesternPieChart, { ANIMATION_PHASES } from './AnimatedNorthwesternPieChart.js';
import NorthwesternInteractionSystem from './NorthwesternInteractionSystem.js';
import { AnimationPerformanceMonitor } from '../animations/NorthwesternAnimations.js';

// Sample antibiotic data for demonstration
const DEMO_ANTIBIOTICS = [
  {
    id: 'demo-vancomycin',
    name: 'Vancomycin',
    class: 'Glycopeptide',
    mechanism: 'Cell wall synthesis inhibition',
    route: ['IV'],
    routeColor: 'blue',
    cellWallActive: true,
    northwesternSpectrum: {
      MRSA: 2,
      VRE_faecium: 0,
      anaerobes: 0,
      atypicals: 0,
      pseudomonas: 0,
      gramNegative: 0,
      MSSA: 2,
      enterococcus_faecalis: 2
    }
  },
  {
    id: 'demo-piperacillin-tazobactam',
    name: 'Piperacillin-Tazobactam',
    class: 'Beta-lactam/Beta-lactamase inhibitor',
    mechanism: 'Cell wall synthesis inhibition',
    route: ['IV'],
    routeColor: 'blue',
    cellWallActive: true,
    northwesternSpectrum: {
      MRSA: 0,
      VRE_faecium: 0,
      anaerobes: 2,
      atypicals: 0,
      pseudomonas: 2,
      gramNegative: 2,
      MSSA: 2,
      enterococcus_faecalis: 1
    }
  },
  {
    id: 'demo-azithromycin',
    name: 'Azithromycin',
    class: 'Macrolide',
    mechanism: 'Protein synthesis inhibition',
    route: ['PO', 'IV'],
    routeColor: 'purple',
    cellWallActive: false,
    northwesternSpectrum: {
      MRSA: 0,
      VRE_faecium: 0,
      anaerobes: 0,
      atypicals: 2,
      pseudomonas: 0,
      gramNegative: 1,
      MSSA: 1,
      enterococcus_faecalis: 0
    }
  }
];

/**
 * Demo Control Panel Component
 */
const DemoControlPanel = ({
  currentDemo,
  onDemoChange,
  emergencyMode,
  onEmergencyToggle,
  educationLevel,
  onEducationLevelChange,
  animationSequence,
  onAnimationSequenceChange,
  performanceMode,
  onPerformanceModeChange,
  reducedMotion,
  onReducedMotionToggle
}) => (
  <div className="demo-controls bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
    <h3 className="font-bold text-gray-900 mb-3">Animation Demo Controls</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Demo Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Demo Antibiotic
        </label>
        <select 
          value={currentDemo} 
          onChange={(e) => onDemoChange(parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          {DEMO_ANTIBIOTICS.map((antibiotic, index) => (
            <option key={antibiotic.id} value={index}>
              {antibiotic.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Emergency Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Clinical Mode
        </label>
        <button
          onClick={onEmergencyToggle}
          className={`w-full p-2 rounded text-sm font-medium transition-colors ${
            emergencyMode 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {emergencyMode ? 'EMERGENCY MODE' : 'Standard Mode'}
        </button>
      </div>
      
      {/* Education Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Education Level
        </label>
        <select 
          value={educationLevel} 
          onChange={(e) => onEducationLevelChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          <option value="student">Medical Student</option>
          <option value="resident">Resident</option>
          <option value="attending">Attending</option>
        </select>
      </div>
      
      {/* Animation Sequence */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Animation Style
        </label>
        <select 
          value={animationSequence} 
          onChange={(e) => onAnimationSequenceChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          <option value="educational">Educational (Slow)</option>
          <option value="clinical">Clinical (Fast)</option>
          <option value="emergency">Emergency (Instant)</option>
        </select>
      </div>
      
      {/* Performance Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Performance Mode
        </label>
        <select 
          value={performanceMode} 
          onChange={(e) => onPerformanceModeChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          <option value="standard">Standard</option>
          <option value="performance">Performance</option>
          <option value="battery">Battery Saver</option>
        </select>
      </div>
      
      {/* Accessibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Motion Preference
        </label>
        <button
          onClick={onReducedMotionToggle}
          className={`w-full p-2 rounded text-sm font-medium transition-colors ${
            reducedMotion 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {reducedMotion ? 'Reduced Motion' : 'Full Animations'}
        </button>
      </div>
    </div>
  </div>
);

/**
 * Animation Metrics Display Component
 */
const AnimationMetrics = ({ metrics, performanceReport }) => (
  <div className="animation-metrics bg-blue-50 border border-blue-200 rounded-lg p-4">
    <h4 className="font-bold text-blue-900 mb-2">Animation Performance Metrics</h4>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <div className="text-blue-700 font-medium">Animations</div>
        <div className="text-blue-900">{metrics.totalAnimations || 0}</div>
      </div>
      
      <div>
        <div className="text-blue-700 font-medium">Avg Frame Rate</div>
        <div className="text-blue-900">
          {performanceReport?.averageFrameRate ? 
            `${Math.round(performanceReport.averageFrameRate)} fps` : 'N/A'}
        </div>
      </div>
      
      <div>
        <div className="text-blue-700 font-medium">Dropped Frames</div>
        <div className="text-blue-900">
          {performanceReport?.frameDropPercentage ? 
            `${Math.round(performanceReport.frameDropPercentage)}%` : '0%'}
        </div>
      </div>
      
      <div>
        <div className="text-blue-700 font-medium">Emergency Overrides</div>
        <div className="text-blue-900">{metrics.emergencyOverrides || 0}</div>
      </div>
    </div>
  </div>
);

/**
 * Main Demo Component
 */
const NorthwesternAnimationDemo = ({
  onDemoComplete,
  className = ''
}) => {
  // Demo state
  const [currentDemo, setCurrentDemo] = useState(0);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [educationLevel, setEducationLevel] = useState('resident');
  const [animationSequence, setAnimationSequence] = useState('educational');
  const [performanceMode, setPerformanceMode] = useState('standard');
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Animation tracking
  const [currentPhase, setCurrentPhase] = useState(null);
  const [animationLog, setAnimationLog] = useState([]);
  const [animationMetrics, setAnimationMetrics] = useState({});
  
  // Performance monitoring
  const performanceMonitorRef = useRef(null);
  const [performanceReport, setPerformanceReport] = useState(null);
  
  // Initialize performance monitor
  useEffect(() => {
    performanceMonitorRef.current = new AnimationPerformanceMonitor();
    performanceMonitorRef.current.startMonitoring();
    
    return () => {
      if (performanceMonitorRef.current) {
        const report = performanceMonitorRef.current.getReport();
        setPerformanceReport(report);
        onDemoComplete?.(report);
      }
    };
  }, [onDemoComplete]);
  
  // Handle demo change with animation reset
  const handleDemoChange = useCallback((demoIndex) => {
    setCurrentDemo(demoIndex);
    setAnimationLog([]);
    setCurrentPhase(null);
    
    // Log demo change
    setAnimationLog(prev => [...prev, {
      timestamp: new Date(),
      event: 'demo_changed',
      antibiotic: DEMO_ANTIBIOTICS[demoIndex].name
    }]);
  }, []);
  
  // Animation event handlers
  const handleAnimationStart = useCallback((phase) => {
    const logEntry = {
      timestamp: new Date(),
      event: 'animation_start',
      phase,
      antibiotic: DEMO_ANTIBIOTICS[currentDemo].name
    };
    
    setAnimationLog(prev => [...prev.slice(-19), logEntry]);
    
    if (performanceMonitorRef.current) {
      performanceMonitorRef.current.recordAnimation(0, performance.now());
    }
  }, [currentDemo]);
  
  const handleAnimationComplete = useCallback((phase) => {
    const logEntry = {
      timestamp: new Date(),
      event: 'animation_complete', 
      phase,
      antibiotic: DEMO_ANTIBIOTICS[currentDemo].name
    };
    
    setAnimationLog(prev => [...prev.slice(-19), logEntry]);
    
    // Update metrics
    setAnimationMetrics(prev => ({
      ...prev,
      totalAnimations: (prev.totalAnimations || 0) + 1,
      lastCompletedPhase: phase
    }));
  }, [currentDemo]);
  
  const handleAnimationPhaseChange = useCallback((phase) => {
    setCurrentPhase(phase);
    
    const logEntry = {
      timestamp: new Date(),
      event: 'phase_change',
      phase,
      antibiotic: DEMO_ANTIBIOTICS[currentDemo].name
    };
    
    setAnimationLog(prev => [...prev.slice(-19), logEntry]);
  }, [currentDemo]);
  
  // Handle emergency mode with metrics
  const handleEmergencyToggle = useCallback(() => {
    const newEmergencyMode = !emergencyMode;
    
    // Use flushSync for emergency mode - ensures immediate state update for clinical urgency
    flushSync(() => {
      setEmergencyMode(newEmergencyMode);
      setAnimationLog(prev => [...prev.slice(-19), {
        timestamp: new Date(),
        event: 'emergency_mode_toggle',
        enabled: newEmergencyMode
      }]);
    });
    
    // Performance monitoring happens after state update
    if (newEmergencyMode && performanceMonitorRef.current) {
      performanceMonitorRef.current.recordEmergencyOverride();
    }
  }, [emergencyMode]);
  
  // Clinical insight handler
  const handleClinicalInsight = useCallback((insight) => {
    setAnimationLog(prev => [...prev.slice(-19), {
      timestamp: new Date(),
      event: 'clinical_insight',
      insight: insight.clinicalNote
    }]);
  }, []);
  
  // Current antibiotic
  const currentAntibiotic = DEMO_ANTIBIOTICS[currentDemo];
  
  return (
    <div className={`northwestern-animation-demo ${className}`}>
      {/* Demo Header */}
      <div className="demo-header mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Northwestern Animation System Demo
        </h2>
        <p className="text-gray-600">
          Experience the clinical animation framework with interactive controls and performance monitoring.
        </p>
      </div>
      
      {/* Demo Controls */}
      <DemoControlPanel
        currentDemo={currentDemo}
        onDemoChange={handleDemoChange}
        emergencyMode={emergencyMode}
        onEmergencyToggle={handleEmergencyToggle}
        educationLevel={educationLevel}
        onEducationLevelChange={setEducationLevel}
        animationSequence={animationSequence}
        onAnimationSequenceChange={setAnimationSequence}
        performanceMode={performanceMode}
        onPerformanceModeChange={setPerformanceMode}
        reducedMotion={reducedMotion}
        onReducedMotionToggle={() => setReducedMotion(!reducedMotion)}
      />
      
      {/* Main Demo Area */}
      <div className="demo-main grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Animated Pie Chart */}
        <div className="demo-chart-container">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">
                {currentAntibiotic.name}
              </h3>
              {currentPhase && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  currentPhase === ANIMATION_PHASES.EMERGENCY ? 'bg-red-100 text-red-800' :
                  currentPhase === ANIMATION_PHASES.COMPLETE ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {currentPhase.toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex justify-center">
              <NorthwesternInteractionSystem
                antibiotic={currentAntibiotic}
                educationLevel={educationLevel}
                onClinicalInsight={handleClinicalInsight}
                showAdvancedFeatures={true}
              >
                <AnimatedNorthwesternPieChart
                  antibiotic={currentAntibiotic}
                  size="large"
                  educationLevel={educationLevel}
                  emergencyMode={emergencyMode}
                  animationSequence={animationSequence}
                  performanceMode={performanceMode}
                  reducedMotion={reducedMotion}
                  learningProgressVisible={educationLevel !== 'attending'}
                  animateOnMount={true}
                  onAnimationStart={handleAnimationStart}
                  onAnimationComplete={handleAnimationComplete}
                  onAnimationPhaseChange={handleAnimationPhaseChange}
                />
              </NorthwesternInteractionSystem>
            </div>
          </div>
          
          {/* Animation Metrics */}
          <div className="mt-4">
            <AnimationMetrics 
              metrics={animationMetrics}
              performanceReport={performanceReport}
            />
          </div>
        </div>
        
        {/* Animation Log */}
        <div className="demo-log-container">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3">Animation Event Log</h4>
            <div className="animation-log max-h-96 overflow-y-auto space-y-2">
              {animationLog.slice(-20).reverse().map((entry, index) => (
                <div 
                  key={`${entry.timestamp.getTime()}-${index}`}
                  className="log-entry bg-gray-50 rounded p-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className={`font-medium ${
                      entry.event === 'emergency_mode_toggle' ? 'text-red-600' :
                      entry.event === 'animation_complete' ? 'text-green-600' :
                      'text-blue-600'
                    }`}>
                      {entry.event.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-gray-500">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {entry.phase && (
                    <div className="text-gray-600 mt-1">Phase: {entry.phase}</div>
                  )}
                  {entry.antibiotic && (
                    <div className="text-gray-600 mt-1">Drug: {entry.antibiotic}</div>
                  )}
                  {entry.insight && (
                    <div className="text-gray-600 mt-1 italic">"{entry.insight}"</div>
                  )}
                </div>
              ))}
              
              {animationLog.length === 0 && (
                <div className="text-gray-500 text-center py-8">
                  Interact with the pie chart to see animation events...
                </div>
              )}
            </div>
          </div>
          
          {/* Demo Information */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-bold text-amber-900 mb-2">Demo Features</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Emergency mode: Instant transitions for patient safety</li>
              <li>• Education levels: Customized animation timing</li>
              <li>• Performance modes: Adaptive animation complexity</li>
              <li>• Accessibility: Reduced motion support</li>
              <li>• Clinical workflow: Professional medical animations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes
DemoControlPanel.propTypes = {
  currentDemo: PropTypes.number.isRequired,
  onDemoChange: PropTypes.func.isRequired,
  emergencyMode: PropTypes.bool.isRequired,
  onEmergencyToggle: PropTypes.func.isRequired,
  educationLevel: PropTypes.string.isRequired,
  onEducationLevelChange: PropTypes.func.isRequired,
  animationSequence: PropTypes.string.isRequired,
  onAnimationSequenceChange: PropTypes.func.isRequired,
  performanceMode: PropTypes.string.isRequired,
  onPerformanceModeChange: PropTypes.func.isRequired,
  reducedMotion: PropTypes.bool.isRequired,
  onReducedMotionToggle: PropTypes.func.isRequired
};

AnimationMetrics.propTypes = {
  metrics: PropTypes.object.isRequired,
  performanceReport: PropTypes.object
};

NorthwesternAnimationDemo.propTypes = {
  onDemoComplete: PropTypes.func,
  className: PropTypes.string
};

export default NorthwesternAnimationDemo;

// Export demo antibiotics for testing
export { DEMO_ANTIBIOTICS };