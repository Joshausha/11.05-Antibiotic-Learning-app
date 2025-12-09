/**
 * useVisualizationState Hook
 * Manages all state for the VisualizationsTab component
 * Extracted from VisualizationsTab.js during Phase 4 refactoring
 */

import { useState, useRef, useCallback, useMemo } from 'react';

/**
 * Custom hook for visualization state management
 * @param {Object} options - Configuration options
 * @param {Object} options.pathogenData - Pathogen data from context
 * @param {Object} options.antibioticData - Antibiotic data from context
 * @param {Array} options.medicalConditions - Medical conditions array
 * @returns {Object} State values and handlers
 */
const useVisualizationState = ({ pathogenData, antibioticData, medicalConditions }) => {
  // Core visualization state
  const [activeVisualization, setActiveVisualization] = useState('overview');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Network layout state
  const [networkLayoutMode, setNetworkLayoutMode] = useState('d3');
  const [spatialViewMode, setSpatialViewMode] = useState('clustered');

  // Pathogen context navigation (Priority 2.1)
  const [selectedPathogen, setSelectedPathogen] = useState(null);

  // Guideline display state (Priority 2.2)
  const [selectedConditionForGuidelines, setSelectedConditionForGuidelines] = useState('community-acquired-pneumonia');
  const [displayedGuidelines, setDisplayedGuidelines] = useState([]);

  // Animation state
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(false);
  const visualizationRef = useRef(null);

  // Phase 7: Comparison Mode State
  const [selectedComparisonAntibiotics, setSelectedComparisonAntibiotics] = useState([]);

  // Progressive Disclosure State (Phase 1.1)
  const [expandedSections, setExpandedSections] = useState({
    explore: false,
    analyze: false,
    settings: false
  });

  // Toggle section expansion
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Toggle emergency mode
  const toggleEmergencyMode = useCallback(() => {
    setEmergencyMode(prev => !prev);
  }, []);

  // Toggle animation
  const toggleAnimation = useCallback(() => {
    setAnimationEnabled(prev => !prev);
  }, []);

  // Calculate overview statistics (memoized)
  const overviewStats = useMemo(() => ({
    totalConditions: medicalConditions?.length || 0,
    totalPathogens: pathogenData?.pathogens?.length || 0,
    totalAntibiotics: antibioticData?.antibiotics?.length || 0,
    gramPositive: pathogenData?.pathogens?.filter(p => p.gramStatus === 'Positive').length || 0,
    gramNegative: pathogenData?.pathogens?.filter(p => p.gramStatus === 'Negative').length || 0
  }), [medicalConditions, pathogenData, antibioticData]);

  // Generate category distribution (memoized)
  const categoryDistribution = useMemo(() => {
    return medicalConditions?.reduce((acc, condition) => {
      acc[condition.category] = (acc[condition.category] || 0) + 1;
      return acc;
    }, {}) || {};
  }, [medicalConditions]);

  // Generate drug class distribution (memoized)
  const drugClassDistribution = useMemo(() => {
    return antibioticData?.antibiotics?.reduce((acc, antibiotic) => {
      acc[antibiotic.class] = (acc[antibiotic.class] || 0) + 1;
      return acc;
    }, {}) || {};
  }, [antibioticData]);

  // Handle network node click for clinical decision tree
  const handleNetworkNodeClick = useCallback((pathogenNode) => {
    setSelectedPathogen(pathogenNode);
    setActiveVisualization('clinical-decision-tree');
  }, []);

  // Handle returning to network view
  const returnToNetwork = useCallback(() => {
    setActiveVisualization('pathogen-network');
    setSelectedPathogen(null);
    setDisplayedGuidelines([]);
  }, []);

  // Handle comparison antibiotic deselection
  const handleComparisonDeselect = useCallback((id) => {
    setSelectedComparisonAntibiotics(prev =>
      prev.filter(ab => ab.id !== id)
    );
  }, []);

  return {
    // Core state
    activeVisualization,
    setActiveVisualization,
    selectedFilter,
    setSelectedFilter,

    // Network layout
    networkLayoutMode,
    setNetworkLayoutMode,
    spatialViewMode,
    setSpatialViewMode,

    // Pathogen context
    selectedPathogen,
    setSelectedPathogen,

    // Guidelines
    selectedConditionForGuidelines,
    setSelectedConditionForGuidelines,
    displayedGuidelines,
    setDisplayedGuidelines,

    // Animation
    emergencyMode,
    setEmergencyMode,
    animationEnabled,
    setAnimationEnabled,
    visualizationRef,
    toggleEmergencyMode,
    toggleAnimation,

    // Comparison
    selectedComparisonAntibiotics,
    setSelectedComparisonAntibiotics,
    handleComparisonDeselect,

    // Progressive disclosure
    expandedSections,
    toggleSection,

    // Computed values
    overviewStats,
    categoryDistribution,
    drugClassDistribution,

    // Handlers
    handleNetworkNodeClick,
    returnToNetwork
  };
};

export default useVisualizationState;
