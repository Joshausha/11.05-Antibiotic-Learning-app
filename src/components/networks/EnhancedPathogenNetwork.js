/**
 * EnhancedPathogenNetwork.js - Medical Education Network Visualization Component
 * 
 * Interactive pathogen-antibiotic relationship network using Cytoscape.js with
 * medical-grade accuracy, accessibility, and educational features.
 * 
 * @module EnhancedPathogenNetwork
 * @version 1.0.0
 * @created 2025-08-27
 * @medical-validation CRITICAL - All pathogen relationships must be clinically accurate
 * @accessibility WCAG 2.1 AA compliant with screen reader support
 * @performance-target <2s load time, 60fps interactions
 */

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, Filter, Download, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';

// Core network components
import CytoscapeWrapper from './CytoscapeWrapper';
import { 
  transformMedicalDataToCytoscape, 
  getNetworkStatistics,
  // Phase 2: Resistance Clustering Functions
  parseResistancePatterns,
  createMedicalClusteredLayout,
  transformPathogenWithResistanceClustering,
  RESISTANCE_MECHANISMS,
  CLINICAL_RESISTANCE_CLUSTERS,
  // Phase 2: Enhanced Clinical Severity Functions
  calculateEnhancedClinicalSeverity,
  CLINICAL_WARNING_INDICATORS
} from './NetworkDataAdapter';
import NetworkControls from './NetworkControls';
import { MEDICAL_LAYOUTS, getRecommendedLayout, applyPerformanceProfile } from './NetworkLayout';

// Data sources
import SimplePathogenData from '../../data/SimplePathogenData';
import pathogenAntibioticMap from '../../data/pathogenAntibioticMap';

// Phase 2: Northwestern Coverage Wheel Styling
import { 
  NORTHWESTERN_COVERAGE_STYLE, 
  applyNorthwesternCoverageTransform,
  calculateCoverageSegments 
} from './NorthwesternCoverageStyle';

// Northwestern Coverage Wheel - Day 6-7: Complete Integration System
import { 
  applyClassClustering, 
  updateClusterPositions, 
  getClusterInfo,
  CLASS_CLUSTER_POSITIONS 
} from './AntibioticClassClustering';
import { 
  renderClassBoundaries, 
  updateBoundaryPositions, 
  removeClassBoundaries 
} from './ClassBoundaryRenderer';
import { 
  applyMechanismBias, 
  removeMechanismBias,
  highlightMechanismGroup,
  clearMechanismHighlight,
  MECHANISM_GROUPS 
} from './MechanismClustering';
import InteractiveCoverageWheel from './InteractiveCoverageWheel';
import { 
  applyConstellationPatterns, 
  removeConstellationPatterns,
  highlightConstellationPattern,
  clearConstellationHighlight,
  CONSTELLATION_PATTERNS 
} from './ConstellationPatterns';

/**
 * Filter options for network visualization
 */
const FILTER_OPTIONS = {
  gramStain: [
    { value: 'all', label: 'All Pathogens' },
    { value: 'positive', label: 'Gram-Positive' },
    { value: 'negative', label: 'Gram-Negative' },
    { value: 'variable', label: 'Variable Staining' }
  ],
  severity: [
    { value: 'all', label: 'All Severities' },
    { value: 'high', label: 'High Severity' },
    { value: 'medium', label: 'Medium Severity' },
    { value: 'low', label: 'Low Severity' }
  ],
  resistance: [
    { value: 'all', label: 'All Resistance Patterns' },
    { value: 'show-resistant', label: 'Show Resistant Only' },
    { value: 'hide-resistant', label: 'Hide Resistant' },
    // Phase 2: Enhanced resistance filtering
    { value: 'high-resistance', label: 'High-Risk Resistance (MRSA, ESBL, VRE, CRE)' }
  ],
  // Phase 2: Evidence Level Filtering
  evidenceLevel: [
    { value: 'all', label: 'All Evidence Levels' },
    { value: 'A', label: 'Grade A - Strong Evidence (RCTs)' },
    { value: 'B', label: 'Grade B - Moderate Evidence' },
    { value: 'C', label: 'Grade C - Limited Evidence' },
    { value: 'D', label: 'Grade D - Expert Opinion' },
    { value: 'EXPERT', label: 'Expert Consensus' },
    { value: 'UNKNOWN', label: 'Evidence Level Unknown' },
    { value: 'high-quality', label: 'High Quality (A+B)' },
    { value: 'low-quality', label: 'Low Quality (C+D)' }
  ]
};

/**
 * EnhancedPathogenNetwork - Main network visualization component
 */
const EnhancedPathogenNetwork = ({
  width = '100%',
  height = '600px',
  className = '',
  showControls = true,
  showStatistics = true,
  enableFilters = true,
  onPathogenSelect,
  onAntibioticSelect,
  onNetworkReady,
  customLayout,
  customStyle,
  loadingComponent = null,
  ...props
}) => {
  // Component state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkData, setNetworkData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  
  // Layout and performance state
  const [currentLayout, setCurrentLayout] = useState('fcose');
  const [performanceProfile, setPerformanceProfile] = useState('clinical');
  const [clusterOptions, setClusterOptions] = useState({
    clusterByGramStain: false,
    clusterBySeverity: false,
    clusterByResistance: false
  });
  
  // Filter states
  const [gramFilter, setGramFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [resistanceFilter, setResistanceFilter] = useState('all');
  const [evidenceFilter, setEvidenceFilter] = useState('all'); // Phase 2: Evidence filtering
  const [includeAntibiotics, setIncludeAntibiotics] = useState(true);
  const [showResistance, setShowResistance] = useState(true);

  // Refs
  const cytoscapeRef = useRef(null);

  // Northwestern Coverage Wheel state
  const shouldApplyClustering = customLayout === 'fcose' || includeAntibiotics;

  /**
   * Transform and filter medical data based on current filter settings
   */
  const transformedData = useMemo(() => {
    try {
      setError(null);
      
      // Apply pathogen filters - SimplePathogenData is directly an array (with defensive check)
      let filteredPathogens = Array.isArray(SimplePathogenData) ? SimplePathogenData : [];
      
      if (gramFilter !== 'all') {
        filteredPathogens = filteredPathogens.filter(p => 
          (p.gramStain || p.gramStatus) === gramFilter
        );
      }
      
      if (severityFilter !== 'all') {
        filteredPathogens = filteredPathogens.filter(p => 
          (p.clinicalSeverity || p.severity) === severityFilter
        );
      }

      // Create filtered pathogen IDs for relationship filtering
      const filteredPathogenIds = filteredPathogens.map(p => p.id || p.name);
      
      // Phase 2: Enhanced pathogen transformation with resistance clustering
      let transformedPathogens = filteredPathogens;
      
      if (clusterOptions.clusterByResistance) {
        // Use the new Phase 2 resistance clustering transformation
        transformedPathogens = filteredPathogens.map(pathogen => 
          transformPathogenWithResistanceClustering(pathogen)
        );
        console.log('🔬 Phase 2: Applied resistance clustering to pathogens:', transformedPathogens.length);
      }
      
      // Transform medical data to Cytoscape format
      const result = transformMedicalDataToCytoscape({
        pathogenData: { pathogens: transformedPathogens },
        antibioticMap: pathogenAntibioticMap,
        includeAntibiotics,
        filterPathogens: filteredPathogenIds,
        validateData: true
      });

      // Phase 2: Enhanced resistance filtering with new resistance analysis
      if (resistanceFilter !== 'all' && result.elements) {
        const edges = result.elements.filter(el => el.data.source && el.data.target);
        
        if (resistanceFilter === 'show-resistant') {
          result.elements = [
            ...result.elements.filter(el => !el.data.source && !el.data.target), // Keep nodes
            ...edges.filter(edge => edge.data.effectiveness === 'resistant')
          ];
        } else if (resistanceFilter === 'hide-resistant') {
          result.elements = [
            ...result.elements.filter(el => !el.data.source && !el.data.target), // Keep nodes
            ...edges.filter(edge => edge.data.effectiveness !== 'resistant')
          ];
        }
        
        // Phase 2: New resistance pattern filtering
        else if (resistanceFilter === 'high-resistance') {
          // Filter to show only high-resistance pathogens (MRSA, ESBL, VRE, CRE)
          const highResistanceNodes = result.elements.filter(el => {
            if (el.data.type === 'pathogen' && el.data.resistanceInfo) {
              const severityLevel = el.data.resistanceInfo.severity;
              return severityLevel === 'high' || severityLevel === 'critical';
            }
            return el.data.type === 'antibiotic'; // Keep all antibiotics
          });
          
          // Keep edges connected to high-resistance pathogens
          const highResistancePathogenIds = new Set(
            highResistanceNodes.filter(el => el.data.type === 'pathogen').map(el => el.data.id)
          );
          
          const filteredEdges = edges.filter(edge => 
            highResistancePathogenIds.has(edge.data.source)
          );
          
          result.elements = [...highResistanceNodes, ...filteredEdges];
        }
      }

      // Phase 2: Evidence Level Filtering
      if (evidenceFilter !== 'all' && result.elements) {
        const edges = result.elements.filter(el => el.data.source && el.data.target);
        const nodes = result.elements.filter(el => !el.data.source && !el.data.target);
        
        let filteredEdges = edges;
        
        if (['A', 'B', 'C', 'D', 'EXPERT', 'UNKNOWN'].includes(evidenceFilter)) {
          // Filter by specific evidence level
          filteredEdges = edges.filter(edge => 
            edge.data.evidenceLevel === evidenceFilter
          );
        } else if (evidenceFilter === 'high-quality') {
          // Show only high-quality evidence (A and B)
          filteredEdges = edges.filter(edge => 
            ['A', 'B'].includes(edge.data.evidenceLevel)
          );
        } else if (evidenceFilter === 'low-quality') {
          // Show only low-quality evidence (C and D)
          filteredEdges = edges.filter(edge => 
            ['C', 'D', 'EXPERT', 'UNKNOWN'].includes(edge.data.evidenceLevel)
          );
        }
        
        result.elements = [...nodes, ...filteredEdges];
        console.log(`🔬 Phase 2: Evidence filtering applied - showing ${filteredEdges.length} edges with evidence level: ${evidenceFilter}`);
      }

      // Phase 2: Add resistance clustering metadata to result
      if (clusterOptions.clusterByResistance && result.elements) {
        const pathogenNodes = result.elements.filter(el => el.data.type === 'pathogen');
        const resistanceStats = {
          totalPathogens: pathogenNodes.length,
          pathogensWithResistance: pathogenNodes.filter(node => 
            node.data.resistanceInfo && node.data.resistanceInfo.mechanisms.length > 0
          ).length,
          detectedMechanisms: {}
        };
        
        // Count detected resistance mechanisms
        pathogenNodes.forEach(node => {
          if (node.data.resistanceInfo && node.data.resistanceInfo.mechanisms) {
            node.data.resistanceInfo.mechanisms.forEach(mechanism => {
              resistanceStats.detectedMechanisms[mechanism.type] = 
                (resistanceStats.detectedMechanisms[mechanism.type] || 0) + 1;
            });
          }
        });
        
        result.metadata.resistanceClustering = resistanceStats;
        console.log('📊 Phase 2: Resistance clustering stats:', resistanceStats);
      }

      // Phase 2: Apply Northwestern Coverage Wheel transformation if in coverage mode
      if (customLayout === 'fcose' && result.elements) {
        console.log('🎯 Phase 2: Applying Northwestern Coverage Wheel transformation');
        result.elements = applyNorthwesternCoverageTransform(result.elements);
        result.metadata.northwesternCoverage = true;
      }

      return result;
    } catch (err) {
      console.error('Data transformation error:', err);
      setError(err);
      return { elements: [], metadata: { pathogenCount: 0, antibioticCount: 0, relationshipCount: 0 } };
    }
  }, [gramFilter, severityFilter, resistanceFilter, evidenceFilter, includeAntibiotics, clusterOptions.clusterByResistance, customLayout]);

  /**
   * Memoized layout configuration with clustering and performance optimizations
   */
  const memoizedLayout = useMemo(() => {
    // Start with base layout or custom layout
    let baseLayout = customLayout || MEDICAL_LAYOUTS[currentLayout];
    
    // Phase 2: Apply medical resistance clustering if enabled
    if (clusterOptions.clusterByResistance && transformedData?.elements) {
      console.log('🔬 Phase 2: Applying medical resistance clustering layout');
      
      // Extract pathogen nodes for clustering
      const pathogenNodes = transformedData.elements.filter(el => el.data.type === 'pathogen');
      
      // Use the new Phase 2 clustering layout function
      const clusteredLayout = createMedicalClusteredLayout(pathogenNodes);
      
      if (clusteredLayout) {
        console.log('✅ Phase 2: Medical clustering layout created:', clusteredLayout.clusterInfo);
        baseLayout = clusteredLayout;
      } else {
        console.warn('⚠️ Phase 2: Medical clustering failed, falling back to default layout');
      }
    }
    // Apply other clustering options
    else if (clusterOptions.clusterByGramStain || clusterOptions.clusterBySeverity) {
      // Use traditional clustering approach for non-resistance clustering
      console.log('📊 Applying traditional clustering for Gram stain/severity');
      
      // For traditional clustering, we can still use a modified approach
      if (MEDICAL_LAYOUTS[currentLayout]) {
        baseLayout = {
          ...MEDICAL_LAYOUTS[currentLayout],
          // Add clustering-aware parameters
          nodeRepulsion: clusterOptions.clusterByGramStain ? 6000 : 4500,
          idealEdgeLength: clusterOptions.clusterBySeverity ? 120 : 100,
          componentSpacing: 150,
          // Enable component packing for clustering
          packComponents: true
        };
      }
    }
    
    // Apply performance profile optimizations
    if (performanceProfile !== 'clinical') {
      baseLayout = applyPerformanceProfile(baseLayout, performanceProfile);
    }
    
    return baseLayout;
  }, [customLayout, currentLayout, clusterOptions, performanceProfile, transformedData]);;

  /**
   * Memoized style with Northwestern Coverage Wheel support
   * Switches to Northwestern pie chart style when in coverage-wheel mode
   */
  const memoizedStyle = useMemo(() => {
    // Use Northwestern Coverage Style when in coverage-wheel mode
    if (customLayout === 'fcose') {
      console.log('🎨 Phase 2: Using Northwestern Coverage Wheel styling');
      return customStyle || NORTHWESTERN_COVERAGE_STYLE;
    }
    
    // Use default or custom style for other modes
    return customStyle;
  }, [customStyle, customLayout]);

  /**
   * Layout change handler with recommendations
   */
  const handleLayoutChange = useCallback((layoutName, layoutConfig) => {
    setCurrentLayout(layoutName);
    console.log(`Layout changed to ${layoutName}:`, layoutConfig);
  }, []);

  /**
   * Cluster options change handler
   */
  const handleClusterChange = useCallback((newClusterOptions) => {
    setClusterOptions(newClusterOptions);
  }, []);

  /**
   * Filter consolidation for NetworkControls
   */
  const consolidatedFilters = useMemo(() => ({
    gramStain: gramFilter,
    severity: severityFilter,
    resistance: resistanceFilter,
    evidenceLevel: evidenceFilter // Phase 2: Evidence filter
  }), [gramFilter, severityFilter, resistanceFilter, evidenceFilter]);

  /**
   * Handle filter changes from NetworkControls
   */
  const handleFilterChange = useCallback((newFilters) => {
    if (newFilters.gramStain !== undefined) setGramFilter(newFilters.gramStain);
    if (newFilters.severity !== undefined) setSeverityFilter(newFilters.severity);
    if (newFilters.resistance !== undefined) setResistanceFilter(newFilters.resistance);
    if (newFilters.evidenceLevel !== undefined) setEvidenceFilter(newFilters.evidenceLevel);
  }, []);

  /**
   * Auto-select recommended layout based on network statistics
   */
  useEffect(() => {
    if (statistics && !customLayout) {
      const recommended = getRecommendedLayout(statistics);
      if (recommended !== currentLayout) {
        console.log(`Recommending layout change from ${currentLayout} to ${recommended} based on network statistics:`, statistics);
        // Optionally auto-change: setCurrentLayout(recommended);
      }
    }
  }, [statistics, currentLayout, customLayout]);

  /**
   * Initialize network data and statistics
   */
  useEffect(() => {
    if (transformedData && transformedData.elements) {
      setNetworkData(transformedData);
      setStatistics(getNetworkStatistics(transformedData.elements));
      setIsLoading(false);
      
      // Notify parent component
      onNetworkReady?.(transformedData, getNetworkStatistics(transformedData.elements));
    }
  }, [transformedData, onNetworkReady]);

  /**
   * Northwestern Coverage Wheel - Day 6-7: Complete Integration
   * Applies full Northwestern Coverage Wheel visualization system
   */
  useEffect(() => {
    if (!cytoscapeRef.current || !networkData?.elements?.length) return;

    const cy = cytoscapeRef.current.getCytoscape();
    if (!cy) return;

    // Northwestern Coverage Wheel is enabled based on component state
    
    if (shouldApplyClustering) {
      // Small delay to ensure layout is ready
      const timeoutId = setTimeout(() => {
        try {
          console.log('🎯 Northwestern Coverage Wheel: Applying complete visualization system');
          
          // Phase 1: Apply antibiotic class clustering
          const clusteringResult = applyClassClustering(cy);
          if (clusteringResult.success) {
            console.log('✅ Class clustering applied:', clusteringResult.stats);
            
            // Phase 2: Render class boundaries
            const boundaryResult = renderClassBoundaries(cy, {
              showLabels: true,
              interactive: true,
              fadeUnselected: false
            });
            
            if (boundaryResult.success) {
              console.log('✅ Class boundaries rendered:', boundaryResult.stats);
            } else {
              console.warn('⚠️ Class boundary rendering failed:', boundaryResult.error);
            }

            // Phase 3: Apply mechanism-based positioning bias
            const mechanismResult = applyMechanismBias(cy, {
              biasStrength: 0.2, // Subtle bias to preserve class clustering
              preserveClassClusters: true,
              highlightMechanisms: true,
              educationalMode: true
            });
            
            if (mechanismResult.success) {
              console.log('✅ Mechanism bias applied:', mechanismResult.stats);
            } else {
              console.warn('⚠️ Mechanism bias failed:', mechanismResult.error);
            }

            // Phase 4: Apply constellation patterns for clinical relationships
            const constellationResult = applyConstellationPatterns(cy, {
              enableFirstLine: true,
              enableAlternatives: true,
              enableResistanceNetworks: true,
              enableSynergies: false, // Keep it simple initially
              enableSpectrumBridges: false,
              animationDuration: 800,
              educationalMode: true
            });
            
            if (constellationResult.success) {
              console.log('✅ Constellation patterns applied:', constellationResult.stats);
            } else {
              console.warn('⚠️ Constellation patterns failed:', constellationResult.error);
            }

          } else {
            console.warn('⚠️ Class clustering failed:', clusteringResult.error);
          }
          
        } catch (error) {
          console.error('❌ Northwestern Coverage Wheel integration error:', error);
        }
      }, 1000); // 1 second delay to ensure layout completion

      return () => clearTimeout(timeoutId);
    } else {
      // Remove all Northwestern Coverage Wheel components if not needed
      try {
        removeClassBoundaries(cy);
        removeMechanismBias(cy);
        removeConstellationPatterns(cy);
      } catch (error) {
        console.warn('Northwestern Coverage Wheel removal error:', error);
      }
    }
  }, [cytoscapeRef.current, networkData, customLayout, includeAntibiotics]);

  /**
   * Handle node selection with medical data extraction
   */
  const handleNodeSelect = useCallback((nodeData, event) => {
    setSelectedNode(nodeData);
    setIsInfoPanelOpen(true);
    
    if (nodeData.type === 'pathogen') {
      onPathogenSelect?.(nodeData, event);
    } else if (nodeData.type === 'antibiotic') {
      onAntibioticSelect?.(nodeData, event);
    }
  }, [onPathogenSelect, onAntibioticSelect]);

  /**
   * Handle edge selection for relationship details with evidence display
   */
  const handleEdgeSelect = useCallback((edgeData, event) => {
    console.log('Relationship selected:', edgeData);
    // Phase 2: Set selected edge for evidence info panel
    setSelectedNode({
      type: 'relationship',
      ...edgeData,
      label: `${edgeData.sourceName || edgeData.source} → ${edgeData.targetName || edgeData.target}`,
      effectiveness: edgeData.effectiveness,
      evidenceLevel: edgeData.evidenceLevel,
      evidenceDescription: edgeData.evidenceDescription,
      clinicalWeight: edgeData.clinicalWeight,
      recommendations: edgeData.recommendations
    });
    setIsInfoPanelOpen(true);
  }, []);

  /**
   * Network control functions
   */
  const resetView = useCallback(() => {
    cytoscapeRef.current?.fit();
  }, []);

  const zoomIn = useCallback(() => {
    const cy = cytoscapeRef.current?.getCytoscape();
    if (cy) {
      cy.zoom(cy.zoom() * 1.2);
      cy.center();
    }
  }, []);

  const zoomOut = useCallback(() => {
    const cy = cytoscapeRef.current?.getCytoscape();
    if (cy) {
      cy.zoom(cy.zoom() * 0.8);
      cy.center();
    }
  }, []);

  /**
   * Export network as image
   */
  const exportImage = useCallback((format = 'png') => {
    const cy = cytoscapeRef.current?.getCytoscape();
    if (!cy) return;
    
    try {
      const imageData = format === 'jpg' ? cy.jpg() : cy.png();
      const link = document.createElement('a');
      link.download = `pathogen-network.${format}`;
      link.href = imageData;
      link.click();
    } catch (err) {
      console.error('Image export error:', err);
      setError(new Error(`Failed to export ${format.toUpperCase()} image`));
    }
  }, []);

  /**
   * Layout completion handler
   */
  const handleLayoutComplete = useCallback((performanceMetrics) => {
    console.log('Network layout completed:', performanceMetrics);
  }, []);

  // Error state
  if (error && !transformedData) {
    return (
      <div 
        className={`enhanced-pathogen-network ${className} flex items-center justify-center`}
        style={{ width, height }}
        role="alert"
      >
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Network Visualization Error
          </h3>
          <p className="text-sm text-red-600 mb-4">
            {error.message || 'Unable to load pathogen-antibiotic network data'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`enhanced-pathogen-network ${className} relative`}
      style={{ width, height }}
      data-testid="enhanced-pathogen-network"
    >
      {/* Advanced Network Controls */}
      {showControls && (
        <div className="absolute top-4 left-4 z-10">
          <NetworkControls
            currentLayout={currentLayout}
            onLayoutChange={handleLayoutChange}
            networkStats={statistics}
            filters={consolidatedFilters}
            onFilterChange={handleFilterChange}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onResetView={resetView}
            onExportPNG={() => exportImage('png')}
            onExportJPG={() => exportImage('jpg')}
            showFilters={enableFilters}
            enableClustering={true}
            clusterOptions={clusterOptions}
            onClusterChange={handleClusterChange}
            performanceProfile={performanceProfile}
            onPerformanceChange={setPerformanceProfile}
            showAntibiotics={includeAntibiotics}
            onToggleAntibiotics={setIncludeAntibiotics}
            showResistance={showResistance}
            onToggleResistance={setShowResistance}
            compact={false}
          />
        </div>
      )}

      {/* Network Statistics */}
      {showStatistics && statistics && (
        <div className="absolute top-4 right-4 z-10 bg-white shadow-lg rounded-lg p-4 border max-w-sm">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Network Statistics</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Pathogens: {statistics.pathogenCount}</div>
            <div>Antibiotics: {statistics.antibioticCount}</div>
            <div>Relationships: {statistics.edgeCount}</div>
            <div>Gram+: {statistics.gramPositive}</div>
            <div>Gram-: {statistics.gramNegative}</div>
            <div>Effective: {statistics.effectiveConnections}</div>
            <div>Resistant: {statistics.resistantConnections}</div>
            
            {/* Phase 2: Evidence Level Statistics */}
            {statistics.evidenceLevels && Object.keys(statistics.evidenceLevels).length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-200">
                <div className="font-semibold text-blue-700 mb-1">📊 Evidence Levels</div>
                {Object.entries(statistics.evidenceLevels).map(([level, count]) => (
                  <div key={level} className="flex justify-between text-xs">
                    <span className={`font-medium ${
                      level === 'A' ? 'text-green-600' :
                      level === 'B' ? 'text-blue-600' :
                      level === 'C' ? 'text-orange-600' :
                      level === 'D' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      Grade {level}:
                    </span>
                    <span>{count}</span>
                  </div>
                ))}
                <div className="text-xs mt-1 text-gray-500">
                  Quality: {Math.round(((statistics.evidenceLevels.A || 0) + (statistics.evidenceLevels.B || 0)) / statistics.edgeCount * 100)}% high-grade
                </div>
              </div>
            )}
            
            {/* Phase 2: Resistance clustering statistics */}
            {networkData?.metadata?.resistanceClustering && (
              <div className="mt-3 pt-2 border-t border-gray-200">
                <div className="font-semibold text-red-700 mb-1">🔬 Resistance Analysis</div>
                <div>Total Analyzed: {networkData.metadata.resistanceClustering.totalPathogens}</div>
                <div>With Resistance: {networkData.metadata.resistanceClustering.pathogensWithResistance}</div>
                <div className="text-xs">
                  Rate: {Math.round((networkData.metadata.resistanceClustering.pathogensWithResistance / networkData.metadata.resistanceClustering.totalPathogens) * 100)}%
                </div>
                
                {Object.keys(networkData.metadata.resistanceClustering.detectedMechanisms).length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium">Mechanisms:</div>
                    <div className="text-xs max-h-20 overflow-y-auto">
                      {Object.entries(networkData.metadata.resistanceClustering.detectedMechanisms).map(([mechanism, count]) => (
                        <div key={mechanism} className="flex justify-between">
                          <span className="truncate mr-1">{mechanism}:</span>
                          <span>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Network Visualization */}
      <CytoscapeWrapper
        ref={cytoscapeRef}
        elements={networkData?.elements || []}
        layout={memoizedLayout}
        style={memoizedStyle}
        width="100%"
        height="100%"
        onNodeSelect={handleNodeSelect}
        onEdgeSelect={handleEdgeSelect}
        onLayoutComplete={handleLayoutComplete}
        onError={setError}
        accessibilityLabel="Pathogen-antibiotic relationship network"
        loadingComponent={loadingComponent}
        {...props}
      />

      {/* Interactive Coverage Wheel Layer - Only enabled when clustering is active */}
      {shouldApplyClustering && (
        <InteractiveCoverageWheel
          cytoscapeRef={cytoscapeRef}
          networkData={networkData}
          onElementSelect={handleNodeSelect}
          onCoverageAnalysis={(analysisData) => {
            console.log('📊 Coverage Analysis:', analysisData);
            // Could integrate with info panel or other UI components
          }}
          clinicalMode={true}
          educationalLevel="resident"
        />
      )}

      {/* Selected Node Information Panel */}
      {isInfoPanelOpen && selectedNode && (
        <div className="absolute bottom-4 left-4 z-10 bg-white shadow-lg rounded-lg p-4 border max-w-md">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-semibold text-gray-800">
              {selectedNode.type === 'pathogen' ? 'Pathogen Details' :
               selectedNode.type === 'antibiotic' ? 'Antibiotic Details' :
               selectedNode.type === 'relationship' ? 'Relationship Evidence' : 'Node Details'}
            </h4>
            <button
              onClick={() => setIsInfoPanelOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="text-xs text-gray-600">
            <div className="font-medium">{selectedNode.label}</div>
            
            {/* Phase 2: Evidence-Based Relationship Details */}
            {selectedNode.type === 'relationship' && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Effectiveness:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedNode.effectiveness === 'high' ? 'bg-green-100 text-green-800' :
                    selectedNode.effectiveness === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    selectedNode.effectiveness === 'low' ? 'bg-orange-100 text-orange-800' :
                    selectedNode.effectiveness === 'resistant' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedNode.effectiveness?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
                
                {selectedNode.evidenceLevel && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded mb-2">
                    <div className="flex items-center mb-1">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        selectedNode.evidenceLevel === 'A' ? 'bg-green-500' :
                        selectedNode.evidenceLevel === 'B' ? 'bg-blue-500' :
                        selectedNode.evidenceLevel === 'C' ? 'bg-orange-500' :
                        selectedNode.evidenceLevel === 'D' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}></span>
                      <span className="font-semibold text-blue-800">
                        Evidence Grade: {selectedNode.evidenceLevel}
                      </span>
                    </div>
                    
                    {selectedNode.evidenceDescription && (
                      <div className="text-blue-700 text-xs mt-1">
                        {selectedNode.evidenceDescription}
                      </div>
                    )}
                    
                    {selectedNode.clinicalWeight && (
                      <div className="text-blue-600 text-xs mt-1">
                        Clinical Weight: {selectedNode.clinicalWeight}/100
                      </div>
                    )}
                    
                    {selectedNode.recommendations && selectedNode.recommendations.length > 0 && (
                      <div className="mt-2">
                        <div className="font-medium text-blue-800 text-xs">Clinical Recommendations:</div>
                        <ul className="text-blue-700 text-xs mt-1 ml-2">
                          {selectedNode.recommendations.slice(0, 2).map((rec, index) => (
                            <li key={index} className="mb-1">• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {selectedNode.type === 'pathogen' && (
              <>
                <div>Gram Stain: {selectedNode.gramStatus}</div>
                <div>Severity: {selectedNode.clinicalSeverity}</div>
                
                {/* Phase 2: Resistance clustering information */}
                {selectedNode.resistanceInfo && selectedNode.resistanceInfo.mechanisms.length > 0 && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <div className="font-medium text-red-700">🦠 Resistance Profile:</div>
                    <div className="text-xs text-red-600">
                      <div>Severity: {selectedNode.resistanceInfo.severity.toUpperCase()}</div>
                      <div className="mt-1">
                        <div className="font-medium">Mechanisms:</div>
                        {selectedNode.resistanceInfo.mechanisms.map((mechanism, index) => (
                          <div key={index} className="ml-2 flex items-center">
                            <span 
                              className="inline-block w-2 h-2 rounded-full mr-1" 
                              style={{ backgroundColor: mechanism.color }}
                            ></span>
                            {mechanism.type} ({mechanism.clinical_significance})
                          </div>
                        ))}
                      </div>
                      {selectedNode.resistanceInfo.clusters.length > 0 && (
                        <div className="mt-1">
                          <div className="font-medium">Clinical Clusters:</div>
                          {selectedNode.resistanceInfo.clusters.map((cluster, index) => (
                            <div key={index} className="ml-2 text-xs">
                              📍 {cluster.name} ({cluster.clinical_priority} priority)
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedNode.basicInfo && (
                  <div className="mt-2">
                    <div className="font-medium">Basic Info:</div>
                    <div className="text-xs">{selectedNode.basicInfo}</div>
                  </div>
                )}
              </>
            )}
            
            {selectedNode.type === 'antibiotic' && (
              <>
                <div>Class: {selectedNode.class || 'Unknown'}</div>
                <div>Mechanism: {selectedNode.mechanism || 'Unknown'}</div>
                {selectedNode.sideEffects && (
                  <div className="mt-1">
                    <div className="font-medium">Common Side Effects:</div>
                    <div className="text-xs">{selectedNode.sideEffects}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
          {loadingComponent || (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-600">Loading pathogen network...</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

EnhancedPathogenNetwork.displayName = 'EnhancedPathogenNetwork';

/**
 * PropTypes for comprehensive type checking
 */
EnhancedPathogenNetwork.propTypes = {
  /** Container width */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Container height */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** CSS class name */
  className: PropTypes.string,
  /** Show network control panel */
  showControls: PropTypes.bool,
  /** Show network statistics */
  showStatistics: PropTypes.bool,
  /** Enable filter controls */
  enableFilters: PropTypes.bool,
  /** Pathogen selection callback */
  onPathogenSelect: PropTypes.func,
  /** Antibiotic selection callback */
  onAntibioticSelect: PropTypes.func,
  /** Network ready callback */
  onNetworkReady: PropTypes.func,
  /** Custom Cytoscape layout configuration */
  customLayout: PropTypes.object,
  /** Custom Cytoscape style configuration */
  customStyle: PropTypes.array,
  /** Custom loading component */
  loadingComponent: PropTypes.node
};

export default EnhancedPathogenNetwork;