/**
 * Northwestern Spatial Layout Demo Component (TypeScript)
 *
 * Comprehensive demonstration component showcasing spatial layout system
 * with interactive controls and real-time Northwestern methodology validation.
 *
 * Features:
 * - Live spatial layout with 30 antibiotics
 * - Interactive view mode switching (grid/clustered/class)
 * - Real-time responsive breakpoint demonstration
 * - Northwestern methodology compliance validation
 * - Performance metrics monitoring
 * - Emergency mode simulation
 */

import React, { useState, useEffect, useMemo, useCallback, FC } from 'react';
import NorthwesternSpatialLayout from './NorthwesternSpatialLayout';
import enhancedAntibiotics from '../data/EnhancedAntibioticData';
import { SPATIAL_GROUPS } from '../utils/northwesternSpatialAlgorithms';

type ViewMode = 'grid' | 'clustered' | 'class';
type ScreenSize = 'mobile' | 'tablet' | 'desktop';

interface PerformanceMetrics {
  lastRenderTime?: number;
  averageRenderTime?: number;
}

interface ClinicalScenario {
  description: string;
  highlightedClasses: string[];
  emergencyMode: boolean;
  focusGroups: string[];
}

/**
 * Northwestern Spatial Layout Demo Component
 */
const NorthwesternSpatialLayoutDemo: FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('clustered');
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');
  const [showConnections, setShowConnections] = useState<boolean>(true);
  const [highlightedClasses, setHighlightedClasses] = useState<string[]>([]);
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);

  const [renderStart, setRenderStart] = useState<number | null>(null);

  const drugClasses = useMemo((): string[] => {
    const classes = [...new Set(enhancedAntibiotics.map((ab: any) => ab.class))];
    return classes.sort();
  }, []);

  useEffect(() => {
    setRenderStart(Date.now());
  }, [viewMode, screenSize, showConnections]);

  const clinicalScenarios: Record<string, ClinicalScenario> = {
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

  const handleAntibioticSelect = useCallback((antibiotic: any): void => {
    setSelectedAntibiotic(antibiotic);
    console.log('Selected antibiotic:', antibiotic.name, antibiotic.class);
  }, []);

  const handleGroupSelect = useCallback((groupKey: string, antibiotics: any[]): void => {
    setSelectedGroup(groupKey);
    console.log('Selected group:', groupKey, 'with', antibiotics.length, 'antibiotics');
  }, []);

  const handleClassHighlight = useCallback((drugClass: string): void => {
    setHighlightedClasses(prev =>
      prev.includes(drugClass)
        ? prev.filter(c => c !== drugClass)
        : [...prev, drugClass]
    );
  }, []);

  const applyClinicalScenario = useCallback((scenarioName: string): void => {
    const scenario = clinicalScenarios[scenarioName];
    if (scenario) {
      setHighlightedClasses(scenario.highlightedClasses);
      setEmergencyMode(scenario.emergencyMode);
      setSelectedGroup(null);
      setSelectedAntibiotic(null);
    }
  }, []);

  const resetDemo = useCallback((): void => {
    setViewMode('clustered');
    setScreenSize('desktop');
    setShowConnections(true);
    setHighlightedClasses([]);
    setEmergencyMode(false);
    setSelectedAntibiotic(null);
    setSelectedGroup(null);
  }, []);

  useEffect(() => {
    if (renderStart) {
      const timer = setTimeout(() => {
        const renderTime = Date.now() - renderStart;
        setPerformanceMetrics(prev => ({
          lastRenderTime: renderTime,
          averageRenderTime: prev ? (prev.averageRenderTime! + renderTime) / 2 : renderTime
        }));
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [renderStart]);

  return (
    <div className="northwestern-spatial-demo p-6">
      {/* Demo Header */}
      <div className="demo-header mb-6">
        <h2 className="text-2xl font-bold mb-2">Northwestern Spatial Layout System</h2>
        <p className="demo-description text-gray-600 mb-4">
          Interactive demonstration of spatial organization system for 30 antibiotics
          using Northwestern methodology with clinical workflow integration.
        </p>

        {performanceMetrics && (
          <div className="performance-display flex gap-4 text-sm">
            <span className="performance-metric">
              Last Render: {performanceMetrics.lastRenderTime}ms
            </span>
            <span className="performance-metric text-gray-600">
              Target: &lt;1000ms
            </span>
            <span className={`performance-status ${performanceMetrics.lastRenderTime! < 1000 ? 'text-green-600' : 'text-yellow-600'}`}>
              {performanceMetrics.lastRenderTime! < 1000 ? '✅' : '⚠️'}
            </span>
          </div>
        )}
      </div>

      {/* Demo Controls */}
      <div className="demo-controls grid grid-cols-3 gap-6 mb-6">
        <div className="control-section">
          <h3 className="font-semibold mb-3">Layout Controls</h3>

          <div className="control-group mb-3">
            <label className="block text-sm mb-1">View Mode:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="grid">Grid</option>
              <option value="clustered">Clustered</option>
              <option value="class">By Class</option>
            </select>
          </div>

          <div className="control-group mb-3">
            <label className="block text-sm mb-1">Screen Size:</label>
            <select
              value={screenSize}
              onChange={(e) => setScreenSize(e.target.value as ScreenSize)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="mobile">Mobile (3×10)</option>
              <option value="tablet">Tablet (5×6)</option>
              <option value="desktop">Desktop (6×5)</option>
            </select>
          </div>

          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={showConnections}
              onChange={(e) => setShowConnections(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Show Group Boundaries</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={emergencyMode}
              onChange={(e) => setEmergencyMode(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Emergency Mode (&lt;30s access)</span>
          </label>
        </div>

        <div className="control-section">
          <h3 className="font-semibold mb-3">Clinical Scenarios</h3>
          {Object.entries(clinicalScenarios).map(([name, scenario]) => (
            <button
              key={name}
              className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded mb-2 text-sm"
              onClick={() => applyClinicalScenario(name)}
              title={scenario.description}
            >
              {name}
            </button>
          ))}
          <button
            className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
            onClick={resetDemo}
          >
            Reset Demo
          </button>
        </div>

        <div className="control-section">
          <h3 className="font-semibold mb-3">Drug Class Highlighting</h3>
          <div className="grid grid-cols-2 gap-2">
            {drugClasses.map(drugClass => (
              <label key={drugClass} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={highlightedClasses.includes(drugClass)}
                  onChange={() => handleClassHighlight(drugClass)}
                  className="mr-2"
                />
                <span className={highlightedClasses.includes(drugClass) ? 'font-bold' : ''}>
                  {drugClass}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Northwestern Spatial Layout */}
      <div className="border rounded-lg p-4 bg-white">
        <NorthwesternSpatialLayout
          antibiotics={enhancedAntibiotics}
          viewMode={viewMode}
          screenSize={screenSize}
          highlightedClasses={highlightedClasses}
          emergencyMode={emergencyMode}
          showGroupBoundaries={showConnections}
          onAntibioticSelect={handleAntibioticSelect}
          onGroupSelect={handleGroupSelect}
        />
      </div>
    </div>
  );
};

export default NorthwesternSpatialLayoutDemo;
