/**
 * VisualizationsTab Component
 * Comprehensive data visualization dashboard for the antibiotic learning app
 * Provides multiple visualization types for exploring medical data relationships
 */

import React, { memo, useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Network, 
  PieChart, 
  Activity, 
  Target, 
  Microscope,
  TrendingUp,
  Grid,
  Filter,
  Download
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

// Import sophisticated network visualization
import PathogenNetworkVisualization from './PathogenNetworkVisualization';
import PathogenNetworkVisualizationCytoscape from './PathogenNetworkVisualizationCytoscape';
import NetworkVisualizationD3 from './NetworkVisualizationD3';

// Import Northwestern pie chart components
import AnimatedNorthwesternPieChart from './AnimatedNorthwesternPieChart';
import NorthwesternPieChart from './NorthwesternPieChart';

// Import Northwestern spatial layout system
import NorthwesternSpatialLayout from './NorthwesternSpatialLayout';

// Import Northwestern animation system - the crown jewel (875 lines)
import { useNorthwesternAnimations } from '../animations/NorthwesternAnimations';

// Import Phase 7: Northwestern Comparison components
import NorthwesternComparisonView from './NorthwesternComparisonView';
import ComparisonControlPanel from './ComparisonControlPanel';

// Import Clinical Decision Tree for pathogen context navigation
import ClinicalDecisionTree from './ClinicalDecision/ClinicalDecisionTree';

// Import Guideline Comparison Panel for evidence-based recommendations
import GuidelineComparisonPanel from './ClinicalDecision/GuidelineComparisonPanel';

// Import guideline data and helper functions (Priority 2.2)
import {
  getGuidelinesForCondition,
  getGuidelinesForPathogen,
  guidelineDisclaimer
} from '../data/ClinicalGuidelineData';

import {
  getConditionsForPathogen,
  getConditionKeys
} from '../data/PathogenConditionMapping';

const VisualizationsTab = ({
  pathogenData,
  antibioticData,
  medicalConditions,
  onSelectCondition,
  onSelectPathogen 
}) => {
  const [activeVisualization, setActiveVisualization] = useState('overview');
  const [selectedFilter, setSelectedFilter] = useState('all');
  // New state for spatial layout switching
  const [networkLayoutMode, setNetworkLayoutMode] = useState('d3');
  const [spatialViewMode, setSpatialViewMode] = useState('clustered');

  // State for pathogen context navigation (Priority 2.1: ClinicalDecisionTree integration)
  const [selectedPathogen, setSelectedPathogen] = useState(null);

  // State for guideline display (Priority 2.2: GuidelineComparisonPanel integration)
  const [selectedConditionForGuidelines, setSelectedConditionForGuidelines] = useState('community-acquired-pneumonia');
  const [displayedGuidelines, setDisplayedGuidelines] = useState([]);

  // Northwestern Animation System integration
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(false); // TEMPORARILY DISABLED: Animations causing content to disappear
  const visualizationRef = useRef(null);

  // Phase 7: Comparison Mode State
  const [selectedComparisonAntibiotics, setSelectedComparisonAntibiotics] = useState([]);

  // Progressive Disclosure State (Phase 1.1: UI/UX Clutter Reduction)
  const [expandedSections, setExpandedSections] = useState({
    explore: false,
    analyze: false,
    settings: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Initialize Northwestern Animation System
  const {
    animationManager,
    createCoverageRevealAnimation,
    createHoverAnimation,
    createSelectionAnimation,
    createLearningProgressAnimation,
    createScenarioTransitionAnimation,
    CLINICAL_TIMING,
    MEDICAL_EASING
  } = useNorthwesternAnimations({
    emergencyMode,
    performanceMode: 'standard'
  });

  // Calculate overview statistics
  const overviewStats = {
    totalConditions: medicalConditions?.length || 0,
    totalPathogens: pathogenData?.pathogens?.length || 0,
    totalAntibiotics: antibioticData?.antibiotics?.length || 0,
    gramPositive: pathogenData?.pathogens?.filter(p => p.gramStatus === 'Positive').length || 0,
    gramNegative: pathogenData?.pathogens?.filter(p => p.gramStatus === 'Negative').length || 0
  };

  // Generate category distribution data
  const categoryDistribution = medicalConditions?.reduce((acc, condition) => {
    acc[condition.category] = (acc[condition.category] || 0) + 1;
    return acc;
  }, {}) || {};

  // Generate drug class distribution
  const drugClassDistribution = antibioticData?.antibiotics?.reduce((acc, antibiotic) => {
    acc[antibiotic.class] = (acc[antibiotic.class] || 0) + 1;
    return acc;
  }, {}) || {};

  // Progressive Disclosure: Grouped visualization options (Phase 1.1: Clutter Reduction)
  const overviewOption = {
    id: 'overview',
    title: 'Overview Dashboard',
    icon: Grid,
    description: 'High-level statistics and key metrics',
    group: 'default'
  };

  const exploreOptions = [
    {
      id: 'pathogen-network',
      title: 'Pathogen Network',
      icon: Network,
      description: 'Interactive network of pathogen relationships',
      group: 'explore'
    },
    {
      id: 'antibiotic-comparison',
      title: 'Antibiotic Comparison',
      icon: PieChart,
      description: 'Side-by-side Northwestern coverage comparison',
      group: 'explore'
    }
  ];

  const analyzeOptions = [
    {
      id: 'category-distribution',
      title: 'Category Distribution',
      icon: PieChart,
      description: 'Distribution of medical conditions by category',
      group: 'analyze'
    },
    {
      id: 'antibiotic-analysis',
      title: 'Antibiotic Analysis',
      icon: Activity,
      description: 'Drug class distribution and usage patterns',
      group: 'analyze'
    },
    {
      id: 'pathogen-analysis',
      title: 'Pathogen Analysis',
      icon: Microscope,
      description: 'Gram status and morphology analysis',
      group: 'analyze'
    }
  ];

  // Northwestern Animation Effects
  useEffect(() => {
    if (!animationEnabled || !visualizationRef.current) return;

    // Animate visualization transition with clinical timing
    // createScenarioTransitionAnimation expects an array, so wrap single element
    const transitionAnimations = createScenarioTransitionAnimation(
      [visualizationRef.current],
      activeVisualization,
      {
        educationLevel: 'resident',
        emergencyMode
      }
    );

    if (animationManager && transitionAnimations && transitionAnimations.length > 0) {
      const firstAnimation = transitionAnimations[0];
      animationManager.animate(
        firstAnimation.element,
        firstAnimation.config
      ).catch(console.warn);
    }

    return () => {
      if (animationManager) {
        animationManager.cleanup();
      }
    };
  }, [activeVisualization, animationManager, animationEnabled, emergencyMode, createScenarioTransitionAnimation]);

  // Enhanced visualization selection with animation
  const handleVisualizationChange = async (visualizationId) => {
    if (!animationEnabled) {
      setActiveVisualization(visualizationId);
      return;
    }
    
    // Create selection animation using Northwestern system
    const selectionElement = document.querySelector(`[data-visualization="${visualizationId}"]`);
    if (selectionElement && animationManager) {
      const selectionAnimation = createSelectionAnimation(
        selectionElement,
        'visualization',
        {
          educationLevel: 'resident',
          emergencyMode
        }
      );
      
      try {
        await animationManager.animate(
          selectionAnimation.element,
          selectionAnimation.config
        );
      } catch (error) {
        console.warn('Animation failed:', error);
      }
    }
    
    setActiveVisualization(visualizationId);
  };

  // Emergency mode toggle for clinical workflows
  const toggleEmergencyMode = () => {
    const newEmergencyMode = !emergencyMode;
    setEmergencyMode(newEmergencyMode);

    if (animationManager) {
      animationManager.setEmergencyMode(newEmergencyMode);
    }
  };

  // Priority 2.1: Handle network node click for ClinicalDecisionTree navigation
  const handleNetworkNodeClick = (pathogenNode) => {
    // Store pathogen context for ClinicalDecisionTree
    setSelectedPathogen(pathogenNode);
    // Switch to Clinical Decision Tree view
    setActiveVisualization('clinical-decision-tree');
  };

  const renderOverviewDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3">
            <Target className="text-blue-600" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-900">{overviewStats.totalConditions}</div>
              <div className="text-sm text-gray-600">Medical Conditions</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3">
            <Microscope className="text-green-600" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-900">{overviewStats.totalPathogens}</div>
              <div className="text-sm text-gray-600">Pathogens</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3">
            <Activity className="text-purple-600" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-900">{overviewStats.totalAntibiotics}</div>
              <div className="text-sm text-gray-600">Antibiotics</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-orange-600" size={24} />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Object.keys(categoryDistribution).length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Microscope size={20} className="text-green-600" />
            Gram Status Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Gram-Positive</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ 
                      width: `${(overviewStats.gramPositive / overviewStats.totalPathogens) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{overviewStats.gramPositive}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Gram-Negative</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ 
                      width: `${(overviewStats.gramNegative / overviewStats.totalPathogens) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{overviewStats.gramNegative}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart size={20} className="text-blue-600" />
            Top Categories
          </h3>
          <div className="space-y-2">
            {Object.entries(categoryDistribution)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">{category}</span>
                  <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategoryDistribution = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <PieChart size={24} className="text-blue-600" />
        Medical Conditions by Category
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {Object.entries(categoryDistribution)
            .sort(([,a], [,b]) => b - a)
            .map(([category, count]) => {
              const percentage = ((count / overviewStats.totalConditions) * 100).toFixed(1);
              return (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{category}</div>
                    <div className="text-sm text-gray-600">{count} conditions ({percentage}%)</div>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <PieChart size={64} className="mx-auto mb-4 opacity-50" />
            <p>Interactive chart visualization</p>
            <p className="text-sm">Would be implemented with D3.js or Chart.js</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAntibioticAnalysis = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Activity size={24} className="text-purple-600" />
        Interactive Antibiotic Coverage Analysis
      </h3>
      
      {/* Northwestern Pie Charts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {antibioticData && antibioticData.antibiotics && antibioticData.antibiotics.slice(0, 6).map((antibiotic, index) => (
          <div key={antibiotic.name || index} className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 mb-3 text-center">
              {antibiotic.name || `Antibiotic ${index + 1}`}
            </h4>
            <div className="flex justify-center">
              <ErrorBoundary>
                <AnimatedNorthwesternPieChart
                  antibiotic={antibiotic}
                  size="small"
                  interactive={true}
                  showTooltips={true}
                  onSegmentHover={(segment) => {
                    console.log('Hovered segment:', segment);
                  }}
                />
              </ErrorBoundary>
            </div>
            <div className="mt-2 text-sm text-gray-600 text-center">
              {antibiotic.class || 'Unknown class'}
            </div>
          </div>
        ))}
      </div>
      
      {/* Fallback for missing data */}
      {(!antibioticData || !antibioticData.antibiotics || antibioticData.antibiotics.length === 0) && (
        <div className="text-center py-8">
          <Activity size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Antibiotic data loading...</p>
          <p className="text-sm text-gray-400 mt-2">Interactive Northwestern pie charts will display when data is available</p>
        </div>
      )}
      
      {/* Drug Class Distribution Summary */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Drug Class Distribution</h4>
        <div className="space-y-3">
          {Object.entries(drugClassDistribution)
            .sort(([,a], [,b]) => b - a)
            .map(([drugClass, count]) => {
              const percentage = ((count / overviewStats.totalAntibiotics) * 100).toFixed(1);
              const colorClass = {
                'Penicillins': 'bg-blue-500',
                'Cephalosporins': 'bg-green-500',
                'Fluoroquinolones': 'bg-orange-500',
                'Macrolides': 'bg-pink-500',
                'Aminoglycosides': 'bg-indigo-500',
                'Glycopeptides': 'bg-purple-500'
              }[drugClass] || 'bg-gray-500';
              
              return (
                <div key={drugClass} className="flex items-center justify-between p-2 rounded">
                  <span className="font-medium text-gray-900">{drugClass}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{count} drugs ({percentage}%)</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colorClass}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  const renderPathogenAnalysis = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Microscope size={24} className="text-green-600" />
        Pathogen Analysis Dashboard
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Gram Status Distribution</h4>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-green-800">Gram-Positive</span>
                <span className="text-green-600 font-bold">{overviewStats.gramPositive}</span>
              </div>
              <div className="mt-2 text-sm text-green-700">
                Cell wall rich in peptidoglycan
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-red-800">Gram-Negative</span>
                <span className="text-red-600 font-bold">{overviewStats.gramNegative}</span>
              </div>
              <div className="mt-2 text-sm text-red-700">
                Thin peptidoglycan layer, outer membrane
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <Microscope size={64} className="mx-auto mb-4 opacity-50" />
            <p>Morphology visualization</p>
            <p className="text-sm">Interactive pathogen shapes and characteristics</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPathogenNetwork = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Network size={24} className="text-indigo-600" />
          Pathogen Relationship Network
        </h3>
        
        {/* Layout Switching Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Layout:</span>
            <select
              value={networkLayoutMode}
              onChange={(e) => setNetworkLayoutMode(e.target.value)}
              className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="d3">D3 Force-Directed</option>
              <option value="d3-pro">D3 Multi-Layout (New)</option>
              <option value="cytoscape">Cytoscape Network</option>
              <option value="spatial">Northwestern Spatial</option>
            </select>
          </div>
          
          {networkLayoutMode === 'spatial' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <select
                value={spatialViewMode}
                onChange={(e) => setSpatialViewMode(e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="clustered">Clustered</option>
                <option value="grid">Grid Layout</option>
                <option value="radial">Radial</option>
              </select>
            </div>
          )}
        </div>
      </div>
      
      <ErrorBoundary>
        {networkLayoutMode === 'd3' ? (
          <PathogenNetworkVisualization
            selectedPathogen={null}
            onSelectPathogen={onSelectPathogen}
            onShowPathDetails={(pathogen) => {
              if (onSelectPathogen) onSelectPathogen(pathogen);
            }}
          />
        ) : networkLayoutMode === 'd3-pro' ? (
          <NetworkVisualizationD3
            layoutType="force"
            showMetrics={true}
            width={1000}
            height={600}
            onNodeClick={handleNetworkNodeClick}
          />
        ) : networkLayoutMode === 'cytoscape' ? (
          <PathogenNetworkVisualizationCytoscape />
        ) : (
          <NorthwesternSpatialLayout
            antibiotics={antibioticData?.antibiotics || []}
            viewMode={spatialViewMode}
            showConnections={true}
            onAntibioticSelect={(antibiotic) => {
              console.log('Selected antibiotic from spatial layout:', antibiotic);

              // Northwestern Animation: Selection feedback
              if (animationEnabled && animationManager) {
                const selectionAnimation = createSelectionAnimation(
                  document.querySelector(`[data-antibiotic-id="${antibiotic.id}"]`),
                  'antibiotic',
                  { educationLevel: 'resident', emergencyMode }
                );

                if (selectionAnimation) {
                  animationManager.animate(
                    selectionAnimation.element,
                    selectionAnimation.config
                  ).catch(console.warn);
                }
              }
            }}
            onGroupSelect={(groupKey, antibiotics) => {
              console.log('Selected group from spatial layout:', groupKey, antibiotics);

              // Northwestern Animation: Group selection feedback
              if (animationEnabled && animationManager) {
                const groupElements = document.querySelectorAll(`[data-spatial-group="${groupKey}"]`);
                groupElements.forEach(element => {
                  const groupAnimation = createSelectionAnimation(
                    element,
                    'group',
                    { educationLevel: 'resident', emergencyMode }
                  );

                  if (groupAnimation) {
                    animationManager.animate(
                      groupAnimation.element,
                      groupAnimation.config
                    ).catch(console.warn);
                  }
                });
              }
            }}
            emergencyMode={emergencyMode}
            clinicalContext="education"
          />
        )}
      </ErrorBoundary>
      
      {/* Layout Information */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          {networkLayoutMode === 'd3' ? (
            <span>Force-directed layout showing pathogen relationships through dynamic positioning</span>
          ) : networkLayoutMode === 'd3-pro' ? (
            <span>Professional D3.js multi-layout visualization: Switch between Force-Directed (similarity clustering), Hierarchical (clinical severity), and Circular (Gram stain classification) layouts. Click nodes for details and zoom/pan with mouse.</span>
          ) : networkLayoutMode === 'cytoscape' ? (
            <span>Cytoscape-powered network visualization.</span>
          ) : (
            <span>
              Northwestern spatial layout organizing {antibioticData?.antibiotics?.length || 0} antibiotics
              using {spatialViewMode} methodology with clinical workflow optimization
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // Phase 7: Render Comparison View
  const renderAntibioticComparison = () => (
    <div className="space-y-6">
      {/* Antibiotic Selection Control Panel */}
      <ComparisonControlPanel
        allAntibiotics={antibioticData?.antibiotics || []}
        selectedAntibiotics={selectedComparisonAntibiotics}
        onSelectionChange={setSelectedComparisonAntibiotics}
        maxSelection={4}
      />

      {/* Northwestern Comparison View */}
      <NorthwesternComparisonView
        selectedAntibiotics={selectedComparisonAntibiotics}
        onAntibioticDeselect={(id) => {
          setSelectedComparisonAntibiotics(
            selectedComparisonAntibiotics.filter(ab => ab.id !== id)
          );
        }}
        emergencyMode={emergencyMode}
        educationLevel="resident"
      />
    </div>
  );

  // Priority 2.2: Handle guideline display request from network node
  const handleShowGuidelinesForPathogen = (pathogenName, condition = null) => {
    const effectiveCondition = condition || selectedConditionForGuidelines;

    // Get guidelines for this pathogen and condition combination
    const guidelinesForPathogen = getGuidelinesForPathogen(pathogenName, effectiveCondition);
    const guidelinesForCondition = guidelinesForPathogen.length > 0
      ? guidelinesForPathogen
      : getGuidelinesForCondition(effectiveCondition);

    setSelectedConditionForGuidelines(effectiveCondition);
    setDisplayedGuidelines(guidelinesForCondition);
    setActiveVisualization('guidelines');
  };

  // Priority 2.2: Render guidelines panel
  const renderGuidelinesPanel = () => (
    <div className="space-y-6">
      {/* Back to Network Navigation */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <button
          onClick={() => {
            setActiveVisualization('pathogen-network');
            setDisplayedGuidelines([]);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          ← Back to Network
        </button>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800 font-semibold">⚠️ Educational Use Only</p>
        <p className="text-xs text-red-700 mt-2">{guidelineDisclaimer}</p>
      </div>

      {/* Guidelines Display */}
      {displayedGuidelines.length > 0 ? (
        <ErrorBoundary>
          <GuidelineComparisonPanel
            condition={selectedConditionForGuidelines}
            guidelines={displayedGuidelines}
            emergencyMode={emergencyMode}
            onGuidelineSelect={(guideline) => {
              console.log('Guideline selected:', guideline);
            }}
            onExpandDetails={(guidelineId) => {
              console.log('Guideline expanded:', guidelineId);
            }}
          />
        </ErrorBoundary>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-blue-800">
            Loading guidelines for {selectedConditionForGuidelines.replace(/-/g, ' ')}...
          </p>
        </div>
      )}
    </div>
  );

  // Priority 2.1: Render Clinical Decision Tree with pathogen context
  const renderClinicalDecisionTree = () => (
    <div className="space-y-6">
      {/* Back to Network Navigation */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <button
          onClick={() => {
            setActiveVisualization('pathogen-network');
            setSelectedPathogen(null);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          ← Back to Network
        </button>
      </div>

      {/* Clinical Decision Tree Component */}
      {selectedPathogen ? (
        <ErrorBoundary>
          <ClinicalDecisionTree
            condition="community-acquired-pneumonia"
            patientAge={null}
            emergencyMode={emergencyMode}
            selectedPathogen={selectedPathogen}
            onDecisionPathChange={(path) => {
              console.log('Decision path changed:', path);
            }}
            onRecommendationComplete={(recommendation) => {
              console.log('Recommendation completed:', recommendation);
            }}
            antibioticData={antibioticData}
            pathogenData={pathogenData}
          />
        </ErrorBoundary>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <p className="text-yellow-800">
            Please select a pathogen from the network visualization to view its clinical decision tree.
          </p>
        </div>
      )}
    </div>
  );

  const renderVisualizationContent = () => {
    switch (activeVisualization) {
      case 'overview':
        return renderOverviewDashboard();
      case 'antibiotic-comparison':
        return renderAntibioticComparison();
      case 'pathogen-network':
        return renderPathogenNetwork();
      case 'category-distribution':
        return renderCategoryDistribution();
      case 'antibiotic-analysis':
        return renderAntibioticAnalysis();
      case 'pathogen-analysis':
        return renderPathogenAnalysis();
      case 'clinical-decision-tree':
        return renderClinicalDecisionTree();
      case 'guidelines':
        return renderGuidelinesPanel();
      default:
        return renderOverviewDashboard();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="text-indigo-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Data Visualizations</h1>
        </div>
        <p className="text-gray-600">
          Explore medical data through interactive visualizations and analytics dashboards.
        </p>
      </div>

      {/* Visualization Selector with Progressive Disclosure (Phase 1.1: 60% Clutter Reduction) */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-6">📊 Data Visualizations</h2>

        {/* Default: Overview Dashboard (always visible) */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Default View</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              key={overviewOption.id}
              data-visualization={overviewOption.id}
              onClick={() => handleVisualizationChange(overviewOption.id)}
              className={`p-4 border rounded-lg text-left transition-colors ${
                activeVisualization === overviewOption.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Grid size={20} className={`mb-2 ${
                activeVisualization === overviewOption.id ? 'text-indigo-600' : 'text-gray-600'
              }`} />
              <div className="text-sm font-medium">{overviewOption.title}</div>
              <div className="text-xs text-gray-500 mt-1">{overviewOption.description}</div>
            </button>
          </div>
        </div>

        {/* Collapsible Section: Explore Relationships */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('explore')}
            className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors mb-3"
          >
            <span className={`transition-transform ${expandedSections.explore ? 'rotate-90' : ''}`}>▶</span>
            <Network size={16} />
            Explore Relationships {expandedSections.explore ? '(show less)' : '(show more)'}
          </button>
          {expandedSections.explore && (
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 ml-6 pl-4 border-l-2 border-indigo-200">
              {exploreOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    data-visualization={option.id}
                    onClick={() => handleVisualizationChange(option.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      activeVisualization === option.id
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} className={`mb-2 ${
                      activeVisualization === option.id ? 'text-indigo-600' : 'text-gray-600'
                    }`} />
                    <div className="text-sm font-medium">{option.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Collapsible Section: Analyze Patterns */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('analyze')}
            className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors mb-3"
          >
            <span className={`transition-transform ${expandedSections.analyze ? 'rotate-90' : ''}`}>▶</span>
            <TrendingUp size={16} />
            Analyze Patterns {expandedSections.analyze ? '(show less)' : '(show more)'}
          </button>
          {expandedSections.analyze && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ml-6 pl-4 border-l-2 border-indigo-200">
              {analyzeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    data-visualization={option.id}
                    onClick={() => handleVisualizationChange(option.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      activeVisualization === option.id
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} className={`mb-2 ${
                      activeVisualization === option.id ? 'text-indigo-600' : 'text-gray-600'
                    }`} />
                    <div className="text-sm font-medium">{option.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Collapsible Section: Settings */}
        <div>
          <button
            onClick={() => toggleSection('settings')}
            className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors mb-3"
          >
            <span className={`transition-transform ${expandedSections.settings ? 'rotate-90' : ''}`}>▶</span>
            <span className="text-base">⚙️</span>
            Display Settings {expandedSections.settings ? '(hide)' : '(show)'}
          </button>
          {expandedSections.settings && (
            <div className="ml-6 pl-4 border-l-2 border-gray-200 space-y-4">
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase">Animation & Display</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleEmergencyMode}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      emergencyMode
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                    title="Emergency Mode: Disables animations for critical clinical workflows"
                  >
                    {emergencyMode ? '🚨 Emergency Mode' : '⚡ Normal Mode'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAnimationEnabled(!animationEnabled)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      animationEnabled
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                    title="Toggle Northwestern animations on/off"
                  >
                    {animationEnabled ? '🎬 Animations On' : '📊 Animations Off'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase">Data Filters</h4>
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-400" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Data</option>
                    <option value="gram-positive">Gram-Positive Only</option>
                    <option value="gram-negative">Gram-Negative Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Visualization */}
      <div ref={visualizationRef}>
        <ErrorBoundary>
          {renderVisualizationContent()}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default memo(VisualizationsTab);