/**
 * VisualizationsTab Component
 * Comprehensive data visualization dashboard for the antibiotic learning app
 *
 * REFACTORED: Phase 4 - Extracted modules:
 * - useVisualizationState hook (state management)
 * - visualizationConfig (configuration)
 * - OverviewDashboard component
 * - PathogenNetworkPanel component
 * - AntibioticAnalysisPanel component
 */

import React, { memo, useEffect } from 'react';
import {
  BarChart3,
  Network,
  PieChart,
  Microscope,
  TrendingUp,
  Grid,
  Filter
} from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

// Extracted components
import OverviewDashboard from './visualizations/OverviewDashboard';
import PathogenNetworkPanel from './visualizations/PathogenNetworkPanel';
import AntibioticAnalysisPanel from './visualizations/AntibioticAnalysisPanel';

// Extracted hook and config
import useVisualizationState from '../hooks/useVisualizationState';
import {
  overviewOption,
  exploreOptions,
  analyzeOptions,
  filterOptions
} from '../config/visualizationConfig';

// Import Phase 7 comparison components
import NorthwesternComparisonView from './NorthwesternComparisonView';
import ComparisonControlPanel from './ComparisonControlPanel';

// Import Clinical Decision Tree for pathogen context navigation
import ClinicalDecisionTree from './ClinicalDecision/ClinicalDecisionTree';

// Import Guideline Comparison Panel for evidence-based recommendations
import GuidelineComparisonPanel from './ClinicalDecision/GuidelineComparisonPanel';

// Import guideline data
import {
  getGuidelinesForCondition,
  getGuidelinesForPathogen,
  guidelineDisclaimer
} from '../data/ClinicalGuidelineData';

// Import Northwestern Animation System
import { useNorthwesternAnimations } from '../animations/NorthwesternAnimations';

const VisualizationsTab = ({
  pathogenData,
  antibioticData,
  medicalConditions,
  onSelectCondition,
  onSelectPathogen
}) => {
  // Use extracted state management hook
  const {
    activeVisualization,
    setActiveVisualization,
    selectedFilter,
    setSelectedFilter,
    networkLayoutMode,
    setNetworkLayoutMode,
    spatialViewMode,
    setSpatialViewMode,
    selectedPathogen,
    setSelectedPathogen,
    selectedConditionForGuidelines,
    setSelectedConditionForGuidelines,
    displayedGuidelines,
    setDisplayedGuidelines,
    emergencyMode,
    setEmergencyMode,
    animationEnabled,
    setAnimationEnabled,
    visualizationRef,
    toggleEmergencyMode,
    toggleAnimation,
    selectedComparisonAntibiotics,
    setSelectedComparisonAntibiotics,
    handleComparisonDeselect,
    expandedSections,
    toggleSection,
    overviewStats,
    categoryDistribution,
    drugClassDistribution,
    handleNetworkNodeClick,
    returnToNetwork
  } = useVisualizationState({ pathogenData, antibioticData, medicalConditions });

  // Initialize Northwestern Animation System
  const {
    animationManager,
    createSelectionAnimation,
    createScenarioTransitionAnimation
  } = useNorthwesternAnimations({
    emergencyMode,
    performanceMode: 'standard'
  });

  // Northwestern Animation Effects
  useEffect(() => {
    if (!animationEnabled || !visualizationRef.current) return;

    const transitionAnimations = createScenarioTransitionAnimation(
      [visualizationRef.current],
      activeVisualization,
      { educationLevel: 'resident', emergencyMode }
    );

    if (animationManager && transitionAnimations?.length > 0) {
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
  }, [activeVisualization, animationManager, animationEnabled, emergencyMode, createScenarioTransitionAnimation, visualizationRef]);

  // Update emergency mode in animation manager
  useEffect(() => {
    if (animationManager?.setEmergencyMode) {
      animationManager.setEmergencyMode(emergencyMode);
    }
  }, [emergencyMode, animationManager]);

  // Enhanced visualization selection with animation
  const handleVisualizationChange = async (visualizationId) => {
    if (!animationEnabled) {
      setActiveVisualization(visualizationId);
      return;
    }

    const selectionElement = document.querySelector(`[data-visualization="${visualizationId}"]`);
    if (selectionElement && animationManager) {
      const selectionAnimation = createSelectionAnimation(
        selectionElement,
        'visualization',
        { educationLevel: 'resident', emergencyMode }
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

  // Handle guideline display request
  const handleShowGuidelinesForPathogen = (pathogenName, condition = null) => {
    const effectiveCondition = condition || selectedConditionForGuidelines;
    const guidelinesForPathogen = getGuidelinesForPathogen(pathogenName, effectiveCondition);
    const guidelinesForCondition = guidelinesForPathogen.length > 0
      ? guidelinesForPathogen
      : getGuidelinesForCondition(effectiveCondition);

    setSelectedConditionForGuidelines(effectiveCondition);
    setDisplayedGuidelines(guidelinesForCondition);
    setActiveVisualization('guidelines');
  };

  // Render category distribution
  const renderCategoryDistribution = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <PieChart size={24} className="text-blue-600" />
        Medical Conditions by Category
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {Object.entries(categoryDistribution)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => {
              const percentage = ((count / overviewStats.totalConditions) * 100).toFixed(1);
              return (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{category}</div>
                    <div className="text-sm text-gray-600">{count} conditions ({percentage}%)</div>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
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

  // Render pathogen analysis
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
              <div className="mt-2 text-sm text-green-700">Cell wall rich in peptidoglycan</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-red-800">Gram-Negative</span>
                <span className="text-red-600 font-bold">{overviewStats.gramNegative}</span>
              </div>
              <div className="mt-2 text-sm text-red-700">Thin peptidoglycan layer, outer membrane</div>
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

  // Render antibiotic comparison
  const renderAntibioticComparison = () => (
    <div className="space-y-6">
      <ComparisonControlPanel
        allAntibiotics={antibioticData?.antibiotics || []}
        selectedAntibiotics={selectedComparisonAntibiotics}
        onSelectionChange={setSelectedComparisonAntibiotics}
        maxSelection={4}
      />
      <NorthwesternComparisonView
        selectedAntibiotics={selectedComparisonAntibiotics}
        onAntibioticDeselect={handleComparisonDeselect}
        emergencyMode={emergencyMode}
        educationLevel="resident"
      />
    </div>
  );

  // Render guidelines panel
  const renderGuidelinesPanel = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <button
          onClick={returnToNetwork}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          ← Back to Network
        </button>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800 font-semibold">⚠️ Educational Use Only</p>
        <p className="text-xs text-red-700 mt-2">{guidelineDisclaimer}</p>
      </div>
      {displayedGuidelines.length > 0 ? (
        <ErrorBoundary>
          <GuidelineComparisonPanel
            condition={selectedConditionForGuidelines}
            guidelines={displayedGuidelines}
            emergencyMode={emergencyMode}
            onGuidelineSelect={(guideline) => console.log('Guideline selected:', guideline)}
            onExpandDetails={(guidelineId) => console.log('Guideline expanded:', guidelineId)}
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

  // Render clinical decision tree
  const renderClinicalDecisionTree = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <button
          onClick={returnToNetwork}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          ← Back to Network
        </button>
      </div>
      {selectedPathogen ? (
        <ErrorBoundary>
          <ClinicalDecisionTree
            condition="community-acquired-pneumonia"
            patientAge={null}
            emergencyMode={emergencyMode}
            selectedPathogen={selectedPathogen}
            onDecisionPathChange={(path) => console.log('Decision path changed:', path)}
            onRecommendationComplete={(recommendation) => console.log('Recommendation completed:', recommendation)}
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

  // Main visualization content router
  const renderVisualizationContent = () => {
    switch (activeVisualization) {
      case 'overview':
        return (
          <OverviewDashboard
            overviewStats={overviewStats}
            categoryDistribution={categoryDistribution}
          />
        );
      case 'antibiotic-comparison':
        return renderAntibioticComparison();
      case 'pathogen-network':
        return (
          <PathogenNetworkPanel
            networkLayoutMode={networkLayoutMode}
            setNetworkLayoutMode={setNetworkLayoutMode}
            spatialViewMode={spatialViewMode}
            setSpatialViewMode={setSpatialViewMode}
            antibioticData={antibioticData}
            onSelectPathogen={onSelectPathogen}
            onNetworkNodeClick={handleNetworkNodeClick}
            emergencyMode={emergencyMode}
            animationEnabled={animationEnabled}
            animationManager={animationManager}
            createSelectionAnimation={createSelectionAnimation}
          />
        );
      case 'category-distribution':
        return renderCategoryDistribution();
      case 'antibiotic-analysis':
        return (
          <AntibioticAnalysisPanel
            antibioticData={antibioticData}
            drugClassDistribution={drugClassDistribution}
            overviewStats={overviewStats}
          />
        );
      case 'pathogen-analysis':
        return renderPathogenAnalysis();
      case 'clinical-decision-tree':
        return renderClinicalDecisionTree();
      case 'guidelines':
        return renderGuidelinesPanel();
      default:
        return (
          <OverviewDashboard
            overviewStats={overviewStats}
            categoryDistribution={categoryDistribution}
          />
        );
    }
  };

  // Render visualization option button
  const renderOptionButton = (option) => {
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

      {/* Visualization Selector with Progressive Disclosure */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-6">📊 Data Visualizations</h2>

        {/* Default: Overview Dashboard (always visible) */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Default View</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {renderOptionButton(overviewOption)}
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
              {exploreOptions.map(renderOptionButton)}
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
              {analyzeOptions.map(renderOptionButton)}
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
                    onClick={toggleAnimation}
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
                    {filterOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
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
