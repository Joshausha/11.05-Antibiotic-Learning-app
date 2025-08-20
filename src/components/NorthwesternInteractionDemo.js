/**
 * Northwestern Interaction Demo Component
 * 
 * Demonstration component showcasing the enhanced Northwestern pie chart
 * interactions created by Agent 2.2. Integrates all interaction components
 * including tooltips, detail panels, and learning progress tracking.
 * 
 * Created by: Agent 2.2 - Segment Interaction Specialist
 * Medical Accuracy: Validated against clinical guidelines
 * Performance: Optimized for clinical workflow demonstration
 * 
 * Features:
 * - Complete interaction system demonstration
 * - Education level switching
 * - Emergency mode simulation
 * - Learning progress tracking
 * - Mobile touch interaction preview
 * 
 * @component
 * @example
 * <NorthwesternInteractionDemo />
 */

import React, { useState } from 'react';
import NorthwesternPieChart from './NorthwesternPieChart';
import NorthwesternInteractionSystem from './NorthwesternInteractionSystem';
import ClinicalTooltip from './ClinicalTooltip';
import DetailPanel from './DetailPanel';
import useInteractionState from '../hooks/useInteractionState';

// Sample antibiotic data for demonstration
const DEMO_ANTIBIOTIC = {
  id: 'demo-vancomycin',
  name: 'Vancomycin',
  class: 'Glycopeptide',
  mechanism: 'Cell wall synthesis inhibition',
  route: ['IV'],
  routeColor: 'blue',
  cellWallActive: true,
  northwesternSpectrum: {
    MRSA: 2,           // Good coverage
    VRE_faecium: 0,    // No coverage (VRE)
    anaerobes: 1,      // Moderate coverage
    atypicals: 0,      // No coverage
    pseudomonas: 0,    // No coverage
    gramNegative: 0,   // No coverage
    MSSA: 2,           // Good coverage (but not preferred)
    enterococcus_faecalis: 1  // Variable coverage
  }
};

/**
 * Control Panel Component
 * Interface for adjusting demo parameters
 */
const ControlPanel = ({ 
  educationLevel, 
  onEducationLevelChange,
  emergencyMode,
  onEmergencyModeToggle,
  showTooltips,
  onShowTooltipsToggle,
  showDetailPanel,
  onShowDetailPanelToggle
}) => (
  <div className="control-panel bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4">Demo Controls</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Education Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Education Level
        </label>
        <select
          value={educationLevel}
          onChange={(e) => onEducationLevelChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="student">Medical Student</option>
          <option value="resident">Resident</option>
          <option value="attending">Attending</option>
        </select>
        <p className="text-xs text-gray-600 mt-1">
          Adjusts complexity and content detail
        </p>
      </div>

      {/* Emergency Mode */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={emergencyMode}
            onChange={onEmergencyModeToggle}
            className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Emergency Mode
          </span>
        </label>
        <p className="text-xs text-gray-600 mt-1">
          Prioritizes critical clinical information
        </p>
      </div>

      {/* Show Tooltips */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={showTooltips}
            onChange={onShowTooltipsToggle}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Rich Tooltips
          </span>
        </label>
        <p className="text-xs text-gray-600 mt-1">
          Show enhanced clinical context on hover
        </p>
      </div>

      {/* Show Detail Panel */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={showDetailPanel}
            onChange={onShowDetailPanelToggle}
            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Detail Panel
          </span>
        </label>
        <p className="text-xs text-gray-600 mt-1">
          Show advanced learning features
        </p>
      </div>
    </div>
  </div>
);

/**
 * Statistics Panel Component
 * Shows interaction metrics and learning progress
 */
const StatisticsPanel = ({ 
  performanceMetrics, 
  learningSession,
  selectedSegments 
}) => (
  <div className="statistics-panel bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
    <h3 className="text-lg font-bold text-blue-900 mb-4">Interaction Statistics</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Performance Metrics */}
      <div>
        <h4 className="font-medium text-blue-800 mb-2">Performance</h4>
        <div className="space-y-1 text-sm">
          <div>
            <span className="text-blue-600">Response Time:</span>
            <span className="text-blue-800 ml-2 font-medium">
              {performanceMetrics.averageResponseTime.toFixed(1)}ms
            </span>
          </div>
          <div>
            <span className="text-blue-600">Interactions:</span>
            <span className="text-blue-800 ml-2 font-medium">
              {performanceMetrics.interactions}
            </span>
          </div>
          {performanceMetrics.slowInteractions > 0 && (
            <div>
              <span className="text-red-600">Slow Responses:</span>
              <span className="text-red-700 ml-2 font-medium">
                {performanceMetrics.slowInteractions}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Learning Progress */}
      <div>
        <h4 className="font-medium text-blue-800 mb-2">Learning Progress</h4>
        <div className="space-y-1 text-sm">
          <div>
            <span className="text-blue-600">Segments Explored:</span>
            <span className="text-blue-800 ml-2 font-medium">
              {learningSession.segmentsExplored.size}/8
            </span>
          </div>
          <div>
            <span className="text-blue-600">Interactions:</span>
            <span className="text-blue-800 ml-2 font-medium">
              {learningSession.interactions}
            </span>
          </div>
          <div>
            <span className="text-blue-600">Insights:</span>
            <span className="text-blue-800 ml-2 font-medium">
              {learningSession.insights.length}
            </span>
          </div>
        </div>
      </div>

      {/* Current Selection */}
      <div>
        <h4 className="font-medium text-blue-800 mb-2">Current Selection</h4>
        <div className="space-y-1 text-sm">
          <div>
            <span className="text-blue-600">Selected:</span>
            <span className="text-blue-800 ml-2 font-medium">
              {selectedSegments.size} segments
            </span>
          </div>
          {selectedSegments.size > 0 && (
            <div className="mt-2">
              {Array.from(selectedSegments).map(segment => (
                <span 
                  key={segment}
                  className="inline-block px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded mr-1 mb-1"
                >
                  {segment.replace('_', ' ')}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

/**
 * Main Northwestern Interaction Demo Component
 */
const NorthwesternInteractionDemo = () => {
  // Demo control state
  const [educationLevel, setEducationLevel] = useState('resident');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [demoMode, setDemoMode] = useState('integrated'); // integrated, standalone, comparison

  // Use the interaction hook for state management
  const {
    hoveredSegment,
    selectedSegments,
    tooltipData,
    performanceMetrics,
    learningSession,
    handlers,
    utils
  } = useInteractionState(DEMO_ANTIBIOTIC, educationLevel, {
    enableLearningTracking: true,
    enablePerformanceTracking: true,
    enableTouchOptimization: true,
    emergencyAccessMode: emergencyMode
  });

  // Handle clinical insights
  const handleClinicalInsight = (insight) => {
    console.log('Clinical Insight Generated:', insight);
  };

  // Handle learning progress
  const handleLearningProgress = (progress) => {
    console.log('Learning Progress Updated:', progress);
  };

  const modes = [
    { id: 'integrated', label: 'Integrated System', description: 'Full interaction system with tooltips and panels' },
    { id: 'standalone', label: 'Standalone Chart', description: 'Basic chart with enhanced interactions' },
    { id: 'comparison', label: 'Comparison View', description: 'Multiple charts for comparison' }
  ];

  return (
    <div className="northwestern-interaction-demo max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="demo-header mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Northwestern Pie Chart - Enhanced Interactions Demo
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Agent 2.2 Segment Interaction Specialist - Medical Education Enhancements
        </p>
        
        {/* Demo Mode Selection */}
        <div className="demo-modes flex space-x-2 mb-4">
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setDemoMode(mode.id)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                demoMode === mode.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        
        <p className="text-sm text-gray-600">
          {modes.find(m => m.id === demoMode)?.description}
        </p>
      </div>

      {/* Control Panel */}
      <ControlPanel
        educationLevel={educationLevel}
        onEducationLevelChange={setEducationLevel}
        emergencyMode={emergencyMode}
        onEmergencyModeToggle={() => setEmergencyMode(!emergencyMode)}
        showTooltips={showTooltips}
        onShowTooltipsToggle={() => setShowTooltips(!showTooltips)}
        showDetailPanel={showDetailPanel}
        onShowDetailPanelToggle={() => setShowDetailPanel(!showDetailPanel)}
      />

      {/* Main Demo Content */}
      <div className="demo-content">
        {/* Integrated System Mode */}
        {demoMode === 'integrated' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="chart-section">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {DEMO_ANTIBIOTIC.name} Coverage Analysis
              </h2>
              
              {showTooltips ? (
                <NorthwesternInteractionSystem
                  antibiotic={DEMO_ANTIBIOTIC}
                  educationLevel={educationLevel}
                  onClinicalInsight={handleClinicalInsight}
                  onLearningProgress={handleLearningProgress}
                  className="w-full max-w-md mx-auto"
                >
                  <NorthwesternPieChart
                    antibiotic={DEMO_ANTIBIOTIC}
                    size="large"
                    interactive={true}
                    educationLevel={educationLevel}
                    emergencyMode={emergencyMode}
                    enableTouchInteractions={true}
                  />
                </NorthwesternInteractionSystem>
              ) : (
                <NorthwesternPieChart
                  antibiotic={DEMO_ANTIBIOTIC}
                  size="large"
                  interactive={true}
                  educationLevel={educationLevel}
                  emergencyMode={emergencyMode}
                  enableTouchInteractions={true}
                  hoveredSegment={hoveredSegment}
                  selectedSegments={Array.from(selectedSegments)}
                  onSegmentHover={handlers.onSegmentHover}
                  onSegmentClick={handlers.onSegmentClick}
                  className="w-full max-w-md mx-auto"
                />
              )}
            </div>

            {/* Detail Panel */}
            {showDetailPanel && selectedSegments.size > 0 && (
              <div className="detail-section">
                <DetailPanel
                  segments={Array.from(selectedSegments)}
                  antibiotic={DEMO_ANTIBIOTIC}
                  educationLevel={educationLevel}
                  onLearningComplete={handleLearningProgress}
                  onClose={() => utils.clearSelections()}
                />
              </div>
            )}
          </div>
        )}

        {/* Standalone Mode */}
        {demoMode === 'standalone' && (
          <div className="standalone-demo text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Enhanced Standalone Chart
            </h2>
            <div className="inline-block">
              <NorthwesternPieChart
                antibiotic={DEMO_ANTIBIOTIC}
                size="large"
                interactive={true}
                educationLevel={educationLevel}
                emergencyMode={emergencyMode}
                enableTouchInteractions={true}
                hoveredSegment={hoveredSegment}
                selectedSegments={Array.from(selectedSegments)}
                onSegmentHover={handlers.onSegmentHover}
                onSegmentClick={handlers.onSegmentClick}
              />
            </div>
            
            <div className="mt-6 text-left max-w-md mx-auto">
              <h3 className="font-medium text-gray-800 mb-2">Instructions:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hover over segments for basic information</li>
                <li>• Click segments to select/deselect them</li>
                <li>• Selected segments show enhanced visual feedback</li>
                <li>• Touch and hold (mobile) for emergency information</li>
              </ul>
            </div>
          </div>
        )}

        {/* Comparison Mode */}
        {demoMode === 'comparison' && (
          <div className="comparison-demo">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Chart Comparison View
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <h3 className="font-medium text-gray-800 mb-3">Normal Mode</h3>
                <NorthwesternPieChart
                  antibiotic={DEMO_ANTIBIOTIC}
                  size="medium"
                  interactive={true}
                  educationLevel={educationLevel}
                />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-red-800 mb-3">Emergency Mode</h3>
                <NorthwesternPieChart
                  antibiotic={DEMO_ANTIBIOTIC}
                  size="medium"
                  interactive={true}
                  educationLevel={educationLevel}
                  emergencyMode={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Panel */}
      <StatisticsPanel
        performanceMetrics={performanceMetrics}
        learningSession={learningSession}
        selectedSegments={selectedSegments}
      />

      {/* Feature Showcase */}
      <div className="feature-showcase bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Enhanced Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="feature">
            <h4 className="font-medium text-gray-800 mb-2">🎯 Rich Clinical Tooltips</h4>
            <p className="text-sm text-gray-600">
              Comprehensive clinical context including resistance patterns, mortality rates, and treatment recommendations.
            </p>
          </div>
          <div className="feature">
            <h4 className="font-medium text-gray-800 mb-2">📱 Mobile Optimized</h4>
            <p className="text-sm text-gray-600">
              Touch interactions with long-press for emergency access, optimized for clinical workflows.
            </p>
          </div>
          <div className="feature">
            <h4 className="font-medium text-gray-800 mb-2">🎓 Education Levels</h4>
            <p className="text-sm text-gray-600">
              Content adapts to medical student, resident, or attending level with appropriate complexity.
            </p>
          </div>
          <div className="feature">
            <h4 className="font-medium text-gray-800 mb-2">⚡ Performance Tracking</h4>
            <p className="text-sm text-gray-600">
              &lt;100ms response time monitoring with interaction analytics for optimal user experience.
            </p>
          </div>
          <div className="feature">
            <h4 className="font-medium text-gray-800 mb-2">🧠 Learning Analytics</h4>
            <p className="text-sm text-gray-600">
              Spaced repetition integration with progress tracking and clinical scenario-based learning.
            </p>
          </div>
          <div className="feature">
            <h4 className="font-medium text-gray-800 mb-2">🚨 Emergency Mode</h4>
            <p className="text-sm text-gray-600">
              Prioritizes critical clinical information with &lt;30 second access workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NorthwesternInteractionDemo;

// Export components for individual use
export { ControlPanel, StatisticsPanel };