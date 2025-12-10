/**
 * useVisualizationState Hook
 * Manages all state for the VisualizationsTab component
 * Extracted from VisualizationsTab.js during Phase 4 refactoring
 */

import { useState, useRef, useCallback, useMemo, MutableRefObject } from 'react';

/**
 * Type definitions for visualization state management
 */

interface PathogenData {
  pathogens?: Array<{
    id: string;
    name: string;
    gramStatus: 'Positive' | 'Negative' | 'Variable';
    [key: string]: any;
  }>;
  [key: string]: any;
}

interface AntibioticData {
  antibiotics?: Array<{
    id: string;
    name: string;
    class: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

interface MedicalCondition {
  id: string;
  name: string;
  category: string;
  [key: string]: any;
}

interface PathogenNode {
  id: string;
  name: string;
  [key: string]: any;
}

interface Antibiotic {
  id: string;
  name: string;
  [key: string]: any;
}

interface ExpandedSections {
  explore: boolean;
  analyze: boolean;
  settings: boolean;
}

interface OverviewStats {
  totalConditions: number;
  totalPathogens: number;
  totalAntibiotics: number;
  gramPositive: number;
  gramNegative: number;
}

interface CategoryDistribution {
  [category: string]: number;
}

interface DrugClassDistribution {
  [drugClass: string]: number;
}

interface UseVisualizationStateOptions {
  pathogenData?: PathogenData;
  antibioticData?: AntibioticData;
  medicalConditions?: MedicalCondition[];
}

interface UseVisualizationStateReturn {
  // Core state
  activeVisualization: string;
  setActiveVisualization: (visualization: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;

  // Network layout
  networkLayoutMode: string;
  setNetworkLayoutMode: (mode: string) => void;
  spatialViewMode: string;
  setSpatialViewMode: (mode: string) => void;

  // Pathogen context
  selectedPathogen: PathogenNode | null;
  setSelectedPathogen: (pathogen: PathogenNode | null) => void;

  // Guidelines
  selectedConditionForGuidelines: string;
  setSelectedConditionForGuidelines: (condition: string) => void;
  displayedGuidelines: any[];
  setDisplayedGuidelines: (guidelines: any[]) => void;

  // Animation
  emergencyMode: boolean;
  setEmergencyMode: (mode: boolean) => void;
  animationEnabled: boolean;
  setAnimationEnabled: (enabled: boolean) => void;
  visualizationRef: MutableRefObject<any>;
  toggleEmergencyMode: () => void;
  toggleAnimation: () => void;

  // Comparison
  selectedComparisonAntibiotics: Antibiotic[];
  setSelectedComparisonAntibiotics: (antibiotics: Antibiotic[]) => void;
  handleComparisonDeselect: (id: string) => void;

  // Progressive disclosure
  expandedSections: ExpandedSections;
  toggleSection: (section: keyof ExpandedSections) => void;

  // Computed values
  overviewStats: OverviewStats;
  categoryDistribution: CategoryDistribution;
  drugClassDistribution: DrugClassDistribution;

  // Handlers
  handleNetworkNodeClick: (pathogenNode: PathogenNode) => void;
  returnToNetwork: () => void;
}

/**
 * Custom hook for visualization state management
 * @param options - Configuration options
 * @param options.pathogenData - Pathogen data from context
 * @param options.antibioticData - Antibiotic data from context
 * @param options.medicalConditions - Medical conditions array
 * @returns State values and handlers
 */
const useVisualizationState = ({
  pathogenData,
  antibioticData,
  medicalConditions
}: UseVisualizationStateOptions = {}): UseVisualizationStateReturn => {
  // Core visualization state
  const [activeVisualization, setActiveVisualization] = useState<string>('overview');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Network layout state
  const [networkLayoutMode, setNetworkLayoutMode] = useState<string>('d3');
  const [spatialViewMode, setSpatialViewMode] = useState<string>('clustered');

  // Pathogen context navigation (Priority 2.1)
  const [selectedPathogen, setSelectedPathogen] = useState<PathogenNode | null>(null);

  // Guideline display state (Priority 2.2)
  const [selectedConditionForGuidelines, setSelectedConditionForGuidelines] = useState<string>('community-acquired-pneumonia');
  const [displayedGuidelines, setDisplayedGuidelines] = useState<any[]>([]);

  // Animation state
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [animationEnabled, setAnimationEnabled] = useState<boolean>(false);
  const visualizationRef = useRef<any>(null);

  // Phase 7: Comparison Mode State
  const [selectedComparisonAntibiotics, setSelectedComparisonAntibiotics] = useState<Antibiotic[]>([]);

  // Progressive Disclosure State (Phase 1.1)
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    explore: false,
    analyze: false,
    settings: false
  });

  // Toggle section expansion
  const toggleSection = useCallback((section: keyof ExpandedSections) => {
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
  const overviewStats = useMemo((): OverviewStats => ({
    totalConditions: medicalConditions?.length || 0,
    totalPathogens: pathogenData?.pathogens?.length || 0,
    totalAntibiotics: antibioticData?.antibiotics?.length || 0,
    gramPositive: pathogenData?.pathogens?.filter(p => p.gramStatus === 'Positive').length || 0,
    gramNegative: pathogenData?.pathogens?.filter(p => p.gramStatus === 'Negative').length || 0
  }), [medicalConditions, pathogenData, antibioticData]);

  // Generate category distribution (memoized)
  const categoryDistribution = useMemo((): CategoryDistribution => {
    return medicalConditions?.reduce((acc, condition) => {
      acc[condition.category] = (acc[condition.category] || 0) + 1;
      return acc;
    }, {} as CategoryDistribution) || {};
  }, [medicalConditions]);

  // Generate drug class distribution (memoized)
  const drugClassDistribution = useMemo((): DrugClassDistribution => {
    return antibioticData?.antibiotics?.reduce((acc, antibiotic) => {
      acc[antibiotic.class] = (acc[antibiotic.class] || 0) + 1;
      return acc;
    }, {} as DrugClassDistribution) || {};
  }, [antibioticData]);

  // Handle network node click for clinical decision tree
  const handleNetworkNodeClick = useCallback((pathogenNode: PathogenNode) => {
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
  const handleComparisonDeselect = useCallback((id: string) => {
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
