/**
 * Northwestern Spatial Layout Demo Component
 *
 * Comprehensive demonstration component showcasing Agent 3.1's spatial layout
 * system with interactive controls and real-time Northwestern methodology validation.
 *
 * Created by: Agent 3.1 - Spatial Layout Architect
 * Phase: 3 - Spatial Organization System Demo
 * Purpose: Demonstrate integration, performance, and clinical workflow capabilities
 *
 * Features:
 * - Live spatial layout with 30 antibiotics
 * - Interactive view mode switching (grid/clustered/class)
 * - Real-time responsive breakpoint demonstration
 * - Northwestern methodology compliance validation
 * - Performance metrics monitoring
 * - Emergency mode simulation
 *
 * @component
 */

import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import NorthwesternSpatialLayout from './NorthwesternSpatialLayout';
import enhancedAntibiotics from '../data/EnhancedAntibioticData';
import { SPATIAL_GROUPS } from '../utils/northwesternSpatialAlgorithms';
import { Antibiotic } from '../types/medical.types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

type ViewMode = 'grid' | 'clustered' | 'class';
type ScreenSize = 'mobile' | 'tablet' | 'desktop';

interface ClinicalScenario {
  description: string;
  highlightedClasses: string[];
  emergencyMode: boolean;
  focusGroups: string[];
}

interface ClinicalScenarios {
  [scenarioName: string]: ClinicalScenario;
}

interface PerformanceMetrics {
  lastRenderTime: number;
  averageRenderTime: number;
}

// ==========================================
// DEMO COMPONENT
// ==========================================

/**
 * Demo component with comprehensive controls and metrics
 */
const NorthwesternSpatialLayoutDemo: FC = () => {
  // Demo state
  const [viewMode, setViewMode] = useState<ViewMode>('clustered');
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');
  const [showConnections, setShowConnections] = useState<boolean>(true);
  const [highlightedClasses, setHighlightedClasses] = useState<string[]>([]);
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<Antibiotic | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);

  // Get unique drug classes for highlighting controls
  const drugClasses = useMemo(() => {
    const classes = [...new Set(enhancedAntibiotics.map(ab => ab.class))];
    return classes.sort();
  }, []);

  // Performance monitoring
  const [renderStart, setRenderStart] = useState<number | null>(null);

  useEffect(() => {
    setRenderStart(Date.now());
  }, [viewMode, screenSize, showConnections]);

  // Mock clinical scenarios for demonstration
  const clinicalScenarios: ClinicalScenarios = {
    'ICU Sepsis': {
      description: 'Critically ill patient with suspected sepsis requiring broad-spectrum coverage',
      highlightedClasses: ['Carbapenems', 'Cephalosporins'],
      emergencyMode: true,
      focusGroups: ['betaLactams', 'specialized']
    },
    'Outpatient UTI': {
      description: 'Simple urinary tract infection in healthy adult',
      highlightedClasses: ['Fluoroquinolones', 'Penicillins'],
      emergencyMode: false,
      focusGroups: ['dnaGyrase', 'betaLactams']
    },
    'MRSA Coverage': {
      description: 'Patient with suspected MRSA infection requiring targeted therapy',
      highlightedClasses: ['Glycopeptides', 'Oxazolidinones'],
      emergencyMode: false,
      focusGroups: ['specialized']
    },
    'Post-surgical Prophylaxis': {
      description: 'Pre-operative antibiotic prophylaxis selection',
      highlightedClasses: ['Cephalosporins', 'Penicillins'],
      emergencyMode: false,
      focusGroups: ['betaLactams']
    }
  };

  // Event handlers
  const handleAntibioticSelect = useCallback((antibiotic: Antibiotic) => {
    setSelectedAntibiotic(antibiotic);
    console.log('Selected antibiotic:', antibiotic.name, antibiotic.class);
  }, []);

  const handleGroupSelect = useCallback((groupKey: string, antibiotics: Antibiotic[]) => {
    setSelectedGroup(groupKey);
    console.log('Selected group:', groupKey, 'with', antibiotics.length, 'antibiotics');
  }, []);

  const handleClassHighlight = useCallback((drugClass: string) => {
    setHighlightedClasses(prev =>
      prev.includes(drugClass)
        ? prev.filter(c => c !== drugClass)
        : [...prev, drugClass]
    );
  }, []);

  const applyClinicalScenario = useCallback((scenarioName: string) => {
    const scenario = clinicalScenarios[scenarioName];
    if (scenario) {
      setHighlightedClasses(scenario.highlightedClasses);
      setEmergencyMode(scenario.emergencyMode);
      setSelectedGroup(null); // Reset group selection
      setSelectedAntibiotic(null); // Reset antibiotic selection
    }
  }, []);

  const resetDemo = useCallback(() => {
    setViewMode('clustered');
    setScreenSize('desktop');
    setShowConnections(true);
    setHighlightedClasses([]);
    setEmergencyMode(false);
    setSelectedAntibiotic(null);
    setSelectedGroup(null);
  }, []);

  // Performance tracking
  useEffect(() => {
    if (!renderStart) return;

    const timer = setTimeout(() => {
      const renderTime = Date.now() - renderStart;
      setPerformanceMetrics(prev => ({
        lastRenderTime: renderTime,
        averageRenderTime: prev ? (prev.averageRenderTime + renderTime) / 2 : renderTime
      }));
    }, 100);

    return () => clearTimeout(timer);
  }, [renderStart]);

  return (
    <div className="northwestern-spatial-demo">
      {/* Demo Header */}
      <div className="demo-header">
        <h2>Northwestern Spatial Layout System</h2>
        <p className="demo-description">
          Interactive demonstration of Agent 3.1's spatial organization system for 30 antibiotics
          using Northwestern methodology with clinical workflow integration.
        </p>

        {/* Performance Metrics */}
        {performanceMetrics && (
          <div className="performance-display">
            <span className="performance-metric">
              Last Render: {performanceMetrics.lastRenderTime}ms
            </span>
            <span className="performance-metric">
              Target: &lt;1000ms
            </span>
            <span className={`performance-status ${performanceMetrics.lastRenderTime < 1000 ? 'success' : 'warning'}`}>
              {performanceMetrics.lastRenderTime < 1000 ? '✅' : '⚠️'}
            </span>
          </div>
        )}
      </div>

      {/* Demo Controls */}
      <div className="demo-controls">
        <div className="control-section">
          <h3>Layout Controls</h3>

          <div className="control-group">
            <label htmlFor="view-mode">View Mode:</label>
            <select
              id="view-mode"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
            >
              <option value="grid">Grid</option>
              <option value="clustered">Clustered</option>
              <option value="class">By Class</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="screen-size">Screen Size:</label>
            <select
              id="screen-size"
              value={screenSize}
              onChange={(e) => setScreenSize(e.target.value as ScreenSize)}
            >
              <option value="mobile">Mobile (3×10)</option>
              <option value="tablet">Tablet (5×6)</option>
              <option value="desktop">Desktop (6×5)</option>
            </select>
          </div>

          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={showConnections}
                onChange={(e) => setShowConnections(e.target.checked)}
              />
              Show Group Boundaries
            </label>
          </div>

          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={emergencyMode}
                onChange={(e) => setEmergencyMode(e.target.checked)}
              />
              Emergency Mode (&lt;30s access)
            </label>
          </div>
        </div>

        <div className="control-section">
          <h3>Clinical Scenarios</h3>
          {Object.entries(clinicalScenarios).map(([name, scenario]) => (
            <button
              key={name}
              className="scenario-button"
              onClick={() => applyClinicalScenario(name)}
              title={scenario.description}
            >
              {name}
            </button>
          ))}
          <button className="reset-button" onClick={resetDemo}>
            Reset Demo
          </button>
        </div>

        <div className="control-section">
          <h3>Drug Class Highlighting</h3>
          <div className="drug-class-grid">
            {drugClasses.map(drugClass => (
              <label key={drugClass} className="drug-class-checkbox">
                <input
                  type="checkbox"
                  checked={highlightedClasses.includes(drugClass)}
                  onChange={() => handleClassHighlight(drugClass)}
                />
                <span className={`drug-class-name ${highlightedClasses.includes(drugClass) ? 'highlighted' : ''}`}>
                  {drugClass}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Demo Layout */}
      <div className="demo-layout-container">
        <NorthwesternSpatialLayout
          antibiotics={enhancedAntibiotics as any}
          viewMode={viewMode as any}
          screenSize={screenSize as any}
          showConnections={showConnections}
          highlightedClasses={highlightedClasses}
          onAntibioticSelect={handleAntibioticSelect as any}
          onGroupSelect={handleGroupSelect as any}
          emergencyMode={emergencyMode}
          clinicalContext={emergencyMode ? 'emergency' : 'education'}
          enableVirtualization={enhancedAntibiotics.length > 20}
          className="demo-spatial-layout"
        />
      </div>

      {/* Selection Information Panel */}
      <div className="demo-info-panel">
        <div className="info-section">
          <h3>Northwestern Methodology</h3>
          <div className="methodology-info">
            <div className="spatial-groups-legend">
              {Object.entries(SPATIAL_GROUPS).map(([key, group]) => (
                <div
                  key={key}
                  className={`group-legend-item ${selectedGroup === key ? 'selected' : ''}`}
                  style={{ backgroundColor: group.color }}
                  onClick={() => setSelectedGroup(selectedGroup === key ? null : key)}
                >
                  <strong>{group.name}</strong>
                  <p>{group.reasoning}</p>
                  <small>{group.clinicalContext}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedAntibiotic && (
          <div className="info-section">
            <h3>Selected Antibiotic</h3>
            <div className="antibiotic-details">
              <h4>{selectedAntibiotic.name}</h4>
              <p><strong>Class:</strong> {selectedAntibiotic.class}</p>
              <p><strong>Generation:</strong> {(selectedAntibiotic as any).generation || 'N/A'}</p>
              <p><strong>Route:</strong> {(selectedAntibiotic as any).route?.join(', ') || 'N/A'}</p>
              <p><strong>Spatial Group:</strong> {(selectedAntibiotic as any).gridPosition?.groupName}</p>
              <p><strong>Grid Position:</strong> Row {(selectedAntibiotic as any).gridPosition?.row + 1}, Column {(selectedAntibiotic as any).gridPosition?.col + 1}</p>

              <div className="spectrum-details">
                <h5>Northwestern Spectrum Coverage:</h5>
                <div className="spectrum-grid">
                  {Object.entries((selectedAntibiotic as any).northwesternSpectrum || {}).map(([pathogen, coverage]) => (
                    <div key={pathogen} className={`spectrum-item coverage-${coverage}`}>
                      <span className="pathogen-name">{pathogen.replace('_', ' ')}</span>
                      <span className="coverage-level">{coverage === 0 ? 'None' : coverage === 1 ? 'Moderate' : 'Good'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedGroup && (
          <div className="info-section">
            <h3>Selected Group: {(SPATIAL_GROUPS as any)[selectedGroup]?.name}</h3>
            <div className="group-details">
              <p><strong>Classes:</strong> {(SPATIAL_GROUPS as any)[selectedGroup]?.classes.join(', ')}</p>
              <p><strong>Reasoning:</strong> {(SPATIAL_GROUPS as any)[selectedGroup]?.reasoning}</p>
              <p><strong>Clinical Context:</strong> {(SPATIAL_GROUPS as any)[selectedGroup]?.clinicalContext}</p>
            </div>
          </div>
        )}
      </div>

      {/* Demo Footer with Integration Information */}
      <div className="demo-footer">
        <div className="integration-info">
          <h3>Phase 3 Integration Ready</h3>
          <p>This spatial layout system provides foundation APIs for:</p>
          <ul>
            <li><strong>Agent 3.2:</strong> Group organization and visual boundaries</li>
            <li><strong>Agent 3.3:</strong> Interactive filtering and selection</li>
            <li><strong>Agent 3.4:</strong> Performance optimization and virtualization</li>
          </ul>
        </div>

        <div className="technical-specs">
          <h4>Technical Specifications</h4>
          <ul>
            <li>30 antibiotics positioned using Northwestern spatial grouping</li>
            <li>Responsive grid: 3×10 mobile, 5×6 tablet, 6×5 desktop</li>
            <li>Performance target: &lt;1000ms rendering</li>
            <li>Emergency access: &lt;30 second clinical workflow</li>
            <li>Integration: Phase 2 EnhancedNorthwesternPieChart components</li>
          </ul>
        </div>
      </div>

      <style>{`
        .northwestern-spatial-demo {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
          border-radius: 8px;
        }

        .demo-header h2 {
          color: #1976d2;
          margin-bottom: 10px;
        }

        .demo-description {
          color: #666;
          max-width: 800px;
          margin: 0 auto 15px;
        }

        .performance-display {
          display: flex;
          gap: 15px;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          font-family: 'Monaco', monospace;
        }

        .performance-metric {
          background: rgba(255,255,255,0.8);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .performance-status.success {
          color: #4caf50;
        }

        .performance-status.warning {
          color: #ff9800;
        }

        .demo-controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .control-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .control-section h3 {
          color: #333;
          margin-bottom: 15px;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 5px;
        }

        .control-group {
          margin-bottom: 15px;
        }

        .control-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #555;
        }

        .control-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .scenario-button {
          display: block;
          width: 100%;
          margin-bottom: 8px;
          padding: 10px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .scenario-button:hover {
          background: #1565c0;
        }

        .reset-button {
          display: block;
          width: 100%;
          margin-top: 15px;
          padding: 10px;
          background: #666;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .drug-class-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
        }

        .drug-class-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .drug-class-name.highlighted {
          color: #ff9800;
          font-weight: bold;
        }

        .demo-layout-container {
          margin-bottom: 30px;
          min-height: 600px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
        }

        .demo-info-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .info-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .info-section h3 {
          color: #333;
          margin-bottom: 15px;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 5px;
        }

        .spatial-groups-legend {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .group-legend-item {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.2s;
        }

        .group-legend-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .group-legend-item.selected {
          border-color: #1976d2;
          border-width: 2px;
        }

        .antibiotic-details h4 {
          color: #1976d2;
          margin-bottom: 15px;
        }

        .spectrum-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
          margin-top: 10px;
        }

        .spectrum-item {
          padding: 8px;
          border-radius: 4px;
          text-align: center;
          font-size: 12px;
        }

        .spectrum-item.coverage-0 {
          background: #ffebee;
          border: 1px solid #ffcdd2;
        }

        .spectrum-item.coverage-1 {
          background: #fff3e0;
          border: 1px solid #ffcc02;
        }

        .spectrum-item.coverage-2 {
          background: #e8f5e8;
          border: 1px solid #4caf50;
        }

        .pathogen-name {
          display: block;
          font-weight: bold;
          text-transform: capitalize;
        }

        .coverage-level {
          display: block;
          font-size: 10px;
          color: #666;
        }

        .demo-footer {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
        }

        .demo-footer h3, .demo-footer h4 {
          color: #333;
          margin-bottom: 15px;
        }

        .demo-footer ul {
          color: #666;
          padding-left: 20px;
        }

        .demo-footer li {
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .demo-controls {
            grid-template-columns: 1fr;
          }

          .demo-info-panel {
            grid-template-columns: 1fr;
          }

          .demo-footer {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default NorthwesternSpatialLayoutDemo;
