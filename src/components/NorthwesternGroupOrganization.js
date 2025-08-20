/**
 * Northwestern Group Organization Component
 * 
 * Sophisticated group organization system providing visual boundaries, medical context,
 * and interactive group-level features for the Northwestern spatial antibiotic layout.
 * 
 * Created by: Agent 3.2 - Group Organization Designer
 * Phase: 3 - Spatial Organization System
 * Integration: Builds on Agent 3.1's spatial layout foundation
 * 
 * Features:
 * - Visual group headers with medical context and antibiotic counts
 * - Group boundary visualization with responsive design
 * - Group-level statistics and coverage summaries
 * - Expandable/collapsible group controls for clinical workflow
 * - Integration with Phase 2 pie chart components
 * - <100ms group calculations for real-time filtering
 * - Medical emergency <30 second access compliance
 * 
 * @component
 * @example
 * <NorthwesternGroupOrganization
 *   spatialLayout={spatialLayout}
 *   screenSize="tablet"
 *   showGroupHeaders={true}
 *   showGroupStats={true}
 *   expandedGroups={['betaLactams']}
 *   onGroupSelect={(groupKey, antibiotics) => console.log(groupKey, antibiotics)}
 * />
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { 
  calculateGroupStatistics,
  calculateCoverageSummary,
  classifyByMechanism,
  classifyByGeneration,
  classifyByRoute,
  getMedicalGroupingData,
  validateMedicalAccuracy 
} from '../utils/medicalGroupingLogic.js';
import GroupVisualElements from './GroupVisualElements.js';
import '../styles/NorthwesternGroupOrganization.css';

/**
 * Medical group definitions with clinical context
 * Based on Northwestern teaching methodology
 */
const MEDICAL_GROUP_DEFINITIONS = {
  betaLactams: {
    name: 'β-Lactams',
    medicalContext: 'Cell Wall Synthesis Inhibitors',
    position: 'top-left',
    priority: 1,
    color: {
      background: '#e3f2fd',
      border: '#1976d2',
      accent: '#0d47a1'
    },
    classes: ['Penicillins', 'Cephalosporins', 'Carbapenems', 'Monobactams'],
    mechanism: 'Inhibit peptidoglycan cross-linking in bacterial cell walls',
    clinicalContext: 'First-line agents for most bacterial infections, broad spectrum availability',
    resistanceMechanism: 'Beta-lactamases (ESBLs, carbapenemases)',
    emergencyUse: 'Severe sepsis, pneumonia, meningitis'
  },
  proteinSynthesis: {
    name: 'Protein Synthesis Inhibitors',
    medicalContext: 'Ribosome-Targeting Antibiotics',
    position: 'top-right',
    priority: 2,
    color: {
      background: '#f3e5f5',
      border: '#7b1fa2',
      accent: '#4a148c'
    },
    classes: ['Aminoglycosides', 'Macrolides', 'Lincosamides', 'Chloramphenicol'],
    mechanism: 'Target 30S or 50S ribosomal subunits to disrupt protein synthesis',
    clinicalContext: 'Bacteriostatic/bactericidal depending on class, good tissue penetration',
    resistanceMechanism: 'Ribosomal modifications, enzymatic inactivation',
    emergencyUse: 'Atypical pneumonia, endocarditis, anaerobic infections'
  },
  dnaGyrase: {
    name: 'DNA/RNA Synthesis Inhibitors',
    medicalContext: 'DNA Gyrase & Topoisomerase Inhibitors',
    position: 'middle-left',
    priority: 3,
    color: {
      background: '#e8f5e8',
      border: '#388e3c',
      accent: '#1b5e20'
    },
    classes: ['Fluoroquinolones', 'Metronidazole'],
    mechanism: 'Inhibit DNA gyrase and topoisomerase IV, preventing DNA replication',
    clinicalContext: 'Broad-spectrum with concentration-dependent killing, unique resistance patterns',
    resistanceMechanism: 'Chromosomal mutations in target enzymes',
    emergencyUse: 'Complicated UTI, healthcare-associated pneumonia, anaerobic infections'
  },
  specialized: {
    name: 'Specialized Agents',
    medicalContext: 'Reserve & Targeted Therapy Antibiotics',
    position: 'bottom',
    priority: 4,
    color: {
      background: '#fff3e0',
      border: '#f57c00',
      accent: '#e65100'
    },
    classes: ['Glycopeptides', 'Lipopeptides', 'Oxazolidinones', 'Others'],
    mechanism: 'Various specialized mechanisms for resistant organisms',
    clinicalContext: 'Last-resort and targeted therapy for multidrug-resistant infections',
    resistanceMechanism: 'Emerging resistance patterns, mechanism-specific',
    emergencyUse: 'MRSA bacteremia, VRE infections, carbapenem-resistant organisms'
  }
};

/**
 * Northwestern Group Organization Component
 * Provides comprehensive group organization for spatial antibiotic layout
 */
const NorthwesternGroupOrganization = ({
  spatialLayout,
  screenSize = 'desktop',
  showGroupHeaders = true,
  showGroupStats = true,
  showGroupConnections = false,
  expandedGroups = [],
  selectedGroup = null,
  onGroupToggle,
  onGroupSelect,
  onGroupFilter,
  className = '',
  // Performance and clinical workflow props
  enableStatistics = true,
  statisticsUpdateInterval = 1000,
  emergencyMode = false,
  clinicalContext = 'education'
}) => {
  // Refs for performance monitoring
  const calculationStartTime = useRef(Date.now());
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  
  // Component state
  const [groupStatistics, setGroupStatistics] = useState({});
  const [coverageSummaries, setCoverageSummaries] = useState({});
  const [medicalAccuracyValidation, setMedicalAccuracyValidation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Extract groups and antibiotics from spatial layout
  const { groups: spatialGroups = {}, positioned: positionedAntibiotics = [] } = spatialLayout;

  // Medical grouping calculations
  const medicalGroupData = useMemo(() => {
    if (!positionedAntibiotics.length) {
      return { groups: {}, validation: null, performance: { calculationTime: 0 } };
    }

    const startTime = performance.now();
    setIsCalculating(true);

    try {
      // Get enhanced medical grouping data
      const medicalData = getMedicalGroupingData(spatialGroups, MEDICAL_GROUP_DEFINITIONS);
      
      // Classify antibiotics by various medical criteria
      const mechanismClassification = classifyByMechanism(positionedAntibiotics);
      const routeClassification = classifyByRoute(positionedAntibiotics);
      
      // Calculate enhanced group data
      const enhancedGroups = {};
      Object.keys(medicalData.groups).forEach(groupKey => {
        const groupAntibiotics = medicalData.groups[groupKey].antibiotics || [];
        
        enhancedGroups[groupKey] = {
          ...medicalData.groups[groupKey],
          ...MEDICAL_GROUP_DEFINITIONS[groupKey],
          antibiotics: groupAntibiotics,
          antibioticCount: groupAntibiotics.length,
          // Generation-based classification within group
          generationGroups: medicalData.groups[groupKey].classes ? 
            Object.keys(medicalData.groups[groupKey].classes).reduce((acc, className) => {
              acc[className] = classifyByGeneration(
                medicalData.groups[groupKey].classes[className], 
                className
              );
              return acc;
            }, {}) : {},
          // Route distribution
          routeDistribution: routeClassification,
          // Mechanism classification
          mechanismType: mechanismClassification[groupKey] || [],
          // Clinical workflow data
          isExpanded: expandedGroups.includes(groupKey),
          isSelected: selectedGroup === groupKey
        };
      });

      // Validate medical accuracy
      const validation = validateMedicalAccuracy(enhancedGroups, MEDICAL_GROUP_DEFINITIONS);
      
      const calculationTime = performance.now() - startTime;
      
      // Performance warning for clinical workflow
      if (calculationTime > 100) {
        console.warn(`Group organization calculation took ${calculationTime.toFixed(2)}ms (target: <100ms)`);
      }

      return {
        groups: enhancedGroups,
        validation,
        performance: {
          calculationTime,
          antibioticCount: positionedAntibiotics.length,
          groupCount: Object.keys(enhancedGroups).length
        }
      };
    } finally {
      setIsCalculating(false);
    }
  }, [spatialGroups, positionedAntibiotics, expandedGroups, selectedGroup]);

  // Group statistics calculations
  const statisticsData = useMemo(() => {
    if (!enableStatistics || !medicalGroupData.groups || isCalculating) {
      return { statistics: {}, summaries: {} };
    }

    const startTime = performance.now();
    const statistics = {};
    const summaries = {};

    Object.keys(medicalGroupData.groups).forEach(groupKey => {
      const group = medicalGroupData.groups[groupKey];
      if (group.antibiotics && group.antibiotics.length > 0) {
        // Calculate comprehensive statistics
        statistics[groupKey] = calculateGroupStatistics(group.antibiotics);
        
        // Calculate coverage summaries
        summaries[groupKey] = calculateCoverageSummary(group.antibiotics);
      }
    });

    const calculationTime = performance.now() - startTime;
    if (calculationTime > 50) {
      console.warn(`Statistics calculation took ${calculationTime.toFixed(2)}ms (target: <50ms)`);
    }

    return { statistics, summaries };
  }, [medicalGroupData.groups, enableStatistics, isCalculating, lastUpdateTime]);

  // Update statistics periodically for real-time data
  useEffect(() => {
    if (!enableStatistics || emergencyMode) return;

    const interval = setInterval(() => {
      setLastUpdateTime(Date.now());
    }, statisticsUpdateInterval);

    return () => clearInterval(interval);
  }, [enableStatistics, statisticsUpdateInterval, emergencyMode]);

  // Update component state with calculated data
  useEffect(() => {
    if (statisticsData.statistics && Object.keys(statisticsData.statistics).length > 0) {
      setGroupStatistics(statisticsData.statistics);
      setCoverageSummaries(statisticsData.summaries);
    }
    
    if (medicalGroupData.validation) {
      setMedicalAccuracyValidation(medicalGroupData.validation);
    }
  }, [statisticsData, medicalGroupData.validation]);

  // Event handlers
  const handleGroupToggle = useCallback((groupKey) => {
    onGroupToggle?.(groupKey);
  }, [onGroupToggle]);

  const handleGroupSelect = useCallback((groupKey) => {
    const group = medicalGroupData.groups[groupKey];
    if (group) {
      onGroupSelect?.(groupKey, group.antibiotics);
    }
  }, [medicalGroupData.groups, onGroupSelect]);

  const handleGroupFilter = useCallback((groupKey, filterType) => {
    const group = medicalGroupData.groups[groupKey];
    if (group) {
      onGroupFilter?.(groupKey, filterType, group.antibiotics);
    }
  }, [medicalGroupData.groups, onGroupFilter]);

  // Emergency mode optimizations
  const emergencyOptimizations = useMemo(() => {
    if (!emergencyMode) return {};

    return {
      showGroupStats: false, // Disable stats in emergency mode
      showGroupConnections: false, // Disable connections
      enableStatistics: false, // Disable real-time statistics
      animationDuration: 0 // Disable animations
    };
  }, [emergencyMode]);

  // Responsive group organization styles
  const containerStyles = useMemo(() => {
    const baseStyles = {
      display: 'grid',
      width: '100%',
      position: 'relative',
      ...emergencyOptimizations
    };

    switch (screenSize) {
      case 'mobile':
        return {
          ...baseStyles,
          gridTemplateColumns: '1fr',
          gap: '8px',
          padding: '8px'
        };
      case 'tablet':
        return {
          ...baseStyles,
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          padding: '12px'
        };
      case 'desktop':
        return {
          ...baseStyles,
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          padding: '16px'
        };
      default:
        return baseStyles;
    }
  }, [screenSize, emergencyOptimizations]);

  // Loading state
  if (isCalculating || !medicalGroupData.groups || Object.keys(medicalGroupData.groups).length === 0) {
    return (
      <div className={`northwestern-group-organization northwestern-group-organization--loading ${className}`}>
        <div className="group-loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            Organizing antibiotic groups using Northwestern methodology...
          </div>
        </div>
      </div>
    );
  }

  // Error state for medical accuracy validation
  if (medicalAccuracyValidation && !medicalAccuracyValidation.isValid) {
    return (
      <div className={`northwestern-group-organization northwestern-group-organization--error ${className}`}>
        <div className="medical-accuracy-error">
          <h3>Medical Accuracy Validation Failed</h3>
          <ul>
            {medicalAccuracyValidation.errors.map((error, index) => (
              <li key={index} className="error-item">{error}</li>
            ))}
          </ul>
          <button onClick={() => window.location.reload()}>
            Retry Group Organization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`northwestern-group-organization northwestern-group-organization--${screenSize} ${emergencyMode ? 'northwestern-group-organization--emergency' : ''} ${className}`}
      style={containerStyles}
      data-group-count={Object.keys(medicalGroupData.groups).length}
      data-screen-size={screenSize}
      data-emergency-mode={emergencyMode}
    >
      {/* Group Headers */}
      {showGroupHeaders && (
        <div className="group-headers">
          {Object.keys(medicalGroupData.groups)
            .sort((a, b) => medicalGroupData.groups[a].priority - medicalGroupData.groups[b].priority)
            .map(groupKey => {
              const group = medicalGroupData.groups[groupKey];
              const statistics = groupStatistics[groupKey];
              const coverageSummary = coverageSummaries[groupKey];
              
              return (
                <GroupVisualElements
                  key={groupKey}
                  type="header"
                  groupKey={groupKey}
                  group={group}
                  statistics={statistics}
                  coverageSummary={coverageSummary}
                  screenSize={screenSize}
                  showStats={showGroupStats && !emergencyMode}
                  isExpanded={group.isExpanded}
                  isSelected={group.isSelected}
                  onToggle={() => handleGroupToggle(groupKey)}
                  onSelect={() => handleGroupSelect(groupKey)}
                  onFilter={(filterType) => handleGroupFilter(groupKey, filterType)}
                />
              );
            })
          }
        </div>
      )}

      {/* Group Statistics Panels */}
      {showGroupStats && !emergencyMode && (
        <div className="group-statistics-panels">
          {Object.keys(medicalGroupData.groups)
            .filter(groupKey => medicalGroupData.groups[groupKey].isExpanded)
            .map(groupKey => {
              const group = medicalGroupData.groups[groupKey];
              const statistics = groupStatistics[groupKey];
              const coverageSummary = coverageSummaries[groupKey];
              
              return (
                <GroupVisualElements
                  key={`stats-${groupKey}`}
                  type="statistics"
                  groupKey={groupKey}
                  group={group}
                  statistics={statistics}
                  coverageSummary={coverageSummary}
                  screenSize={screenSize}
                />
              );
            })
          }
        </div>
      )}

      {/* Group Boundaries Overlay */}
      {spatialLayout.layout && (
        <div className="group-boundaries-overlay">
          {Object.keys(medicalGroupData.groups).map(groupKey => {
            const group = medicalGroupData.groups[groupKey];
            
            return (
              <GroupVisualElements
                key={`boundary-${groupKey}`}
                type="boundary"
                groupKey={groupKey}
                group={group}
                spatialLayout={spatialLayout}
                screenSize={screenSize}
                isSelected={group.isSelected}
                onClick={() => handleGroupSelect(groupKey)}
              />
            );
          })}
        </div>
      )}

      {/* Group Connections */}
      {showGroupConnections && !emergencyMode && (
        <div className="group-connections-container">
          <GroupVisualElements
            type="connections"
            groups={medicalGroupData.groups}
            spatialLayout={spatialLayout}
            screenSize={screenSize}
          />
        </div>
      )}

      {/* Performance and validation info (development mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="group-debug-info">
          <div className="performance-metrics">
            <span>Group Calc: {medicalGroupData.performance.calculationTime.toFixed(2)}ms</span>
            <span>Stats Calc: {statisticsData.calculationTime?.toFixed(2) || 0}ms</span>
            <span>Groups: {medicalGroupData.performance.groupCount}</span>
            <span>Antibiotics: {medicalGroupData.performance.antibioticCount}</span>
            {medicalAccuracyValidation?.warnings.length > 0 && (
              <span className="medical-warnings">
                ⚠️ {medicalAccuracyValidation.warnings.length} medical warnings
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes for type safety
NorthwesternGroupOrganization.propTypes = {
  spatialLayout: PropTypes.shape({
    groups: PropTypes.object.isRequired,
    positioned: PropTypes.arrayOf(PropTypes.object).isRequired,
    layout: PropTypes.object
  }).isRequired,
  screenSize: PropTypes.oneOf(['mobile', 'tablet', 'desktop']),
  showGroupHeaders: PropTypes.bool,
  showGroupStats: PropTypes.bool,
  showGroupConnections: PropTypes.bool,
  expandedGroups: PropTypes.arrayOf(PropTypes.string),
  selectedGroup: PropTypes.string,
  onGroupToggle: PropTypes.func,
  onGroupSelect: PropTypes.func,
  onGroupFilter: PropTypes.func,
  className: PropTypes.string,
  enableStatistics: PropTypes.bool,
  statisticsUpdateInterval: PropTypes.number,
  emergencyMode: PropTypes.bool,
  clinicalContext: PropTypes.oneOf(['education', 'clinical', 'emergency'])
};

export default NorthwesternGroupOrganization;