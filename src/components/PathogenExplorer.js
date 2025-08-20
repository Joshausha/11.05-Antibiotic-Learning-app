/**
 * PathogenExplorer Component
 * Enhanced tactile pathogen exploration with interactive network visualization
 * Provides comprehensive pathogen discovery through multiple interconnected views
 */

import React, { memo, useState, useMemo, Suspense, lazy } from 'react';
import { 
  Search, Microscope, ArrowRight,
  Network, RotateCcw, Zap, Grid, Eye
} from 'lucide-react';
import usePathogenRecommendations from '../hooks/usePathogenRecommendations';
import { buildPathogenNetwork, getConditionsForPathogen, getAntibioticsForPathogen } from '../utils/dataIndexer';
import ResearchIntegration from './research/ResearchIntegration';

// Lazy load heavy components
const PathogenNetworkVisualization = lazy(() => import('./PathogenNetworkVisualization'));
const PathogenDetailPanel = lazy(() => import('./PathogenDetailPanel'));
const PathogenConnectionExplorer = lazy(() => import('./PathogenConnectionExplorer'));

const PathogenExplorer = ({ 
  pathogenData, 
  onSelectCondition,
  userBehavior = {}
}) => {
  const {
    pathogens,
    selectedPathogen,
    selectedPathogenConditions,
    selectedPathogenAntibiotics,
    pathogenStats,
    filteredStats,
    searchQuery,
    gramFilter,
    typeFilter,
    sortBy,
    searchPathogens,
    filterByGramStatus,
    filterByType,
    setSortOrder,
    selectPathogen,
    clearSelection,
    clearFilters,
    findSimilarPathogens,
    isLoading,
    indexes
  } = pathogenData;

  // New state for enhanced exploration
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'network', 'explorer'
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [explorationHistory, setExplorationHistory] = useState([]);

  // Enhanced pathogen recommendations
  const recommendations = usePathogenRecommendations(indexes, selectedPathogen, userBehavior);

  // Build network data for visualization
  const networkData = useMemo(() => {
    if (!indexes) return null;
    return buildPathogenNetwork(indexes);
  }, [indexes]);

  // Get enhanced pathogen data for selected pathogen
  const enhancedPathogenData = useMemo(() => {
    if (!selectedPathogen || !indexes) return null;

    const conditions = getConditionsForPathogen(indexes, selectedPathogen.name);
    const antibiotics = getAntibioticsForPathogen(indexes, selectedPathogen.name);
    const similarPathogens = findSimilarPathogens(selectedPathogen).slice(0, 8);

    return {
      pathogen: selectedPathogen,
      associatedConditions: conditions,
      treatmentOptions: antibiotics,
      similarPathogens: similarPathogens.map(similar => ({
        pathogen: similar,
        similarity: indexes ? indexes.pathogens.find(p => p.name === similar.name) : null,
        weight: Math.random() * 0.8 + 0.2, // Placeholder - would be calculated properly
        reasoning: 'Similar pathogen based on shared characteristics'
      }))
    };
  }, [selectedPathogen, indexes, findSimilarPathogens]);

  // Handle pathogen selection with tracking
  const handlePathogenSelect = (pathogen) => {
    selectPathogen(pathogen);
    
    // Track the selection
    setExplorationHistory(prev => [
      ...prev.slice(-9), // Keep last 10 items
      {
        pathogen,
        timestamp: Date.now(),
        fromView: viewMode
      }
    ]);

    // Record interaction for recommendations
    if (recommendations.recordInteraction) {
      recommendations.recordInteraction(pathogen, 'select');
    }
  };

  // Handle view mode changes
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    
    // Auto-select pathogen for network view if none selected
    if (mode === 'network' && !selectedPathogen && pathogens.length > 0) {
      handlePathogenSelect(pathogens[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading pathogen data...</div>
      </div>
    );
  }

  const getGramStatusColor = (gramStatus) => {
    switch (gramStatus) {
      case 'positive': return 'text-purple-600 bg-purple-100';
      case 'negative': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGramStatusLabel = (gramStatus) => {
    switch (gramStatus) {
      case 'positive': return 'Gram(+)';
      case 'negative': return 'Gram(-)';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Microscope className="text-blue-600" size={24} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pathogen Explorer</h1>
              <p className="text-gray-600">
                Interactive exploration of pathogen relationships and connections
              </p>
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'grid', icon: Grid, label: 'Grid View' },
              { id: 'network', icon: Network, label: 'Network View' },
              { id: 'explorer', icon: Eye, label: 'Connection Explorer' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => handleViewModeChange(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={label}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Enhanced Statistics */}
        {pathogenStats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{pathogenStats.total}</div>
              <div className="text-sm text-gray-600">Total Pathogens</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">{pathogenStats.gramPositive}</div>
              <div className="text-sm text-gray-600">Gram Positive</div>
            </div>
            <div className="text-center p-3 bg-pink-50 rounded-lg">
              <div className="text-xl font-bold text-pink-600">{pathogenStats.gramNegative}</div>
              <div className="text-sm text-gray-600">Gram Negative</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">{pathogenStats.avgConditions}</div>
              <div className="text-sm text-gray-600">Avg Conditions</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">{explorationHistory.length}</div>
              <div className="text-sm text-gray-600">Explored</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded-lg hover:bg-gray-50"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          
          {recommendations.recommendations.length > 0 && (
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className={`flex items-center gap-1 px-3 py-1 text-sm border rounded-lg transition-colors ${
                showRecommendations 
                  ? 'bg-blue-100 text-blue-600 border-blue-300' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Zap size={14} />
              Recommendations ({recommendations.recommendations.length})
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Content Based on View Mode */}
      {viewMode === 'grid' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Search and Filter Panel */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Search size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold">Search & Filter</h2>
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search pathogens..."
                value={searchQuery}
                onChange={(e) => searchPathogens(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gram Status
                </label>
                <select
                  value={gramFilter}
                  onChange={(e) => filterByGramStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="positive">Gram Positive</option>
                  <option value="negative">Gram Negative</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pathogen Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => filterByType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="bacteria">Bacteria</option>
                  <option value="virus">Virus</option>
                  <option value="fungus">Fungus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="count">Usage Count</option>
                  <option value="conditions">Condition Count</option>
                </select>
              </div>
            </div>

            {/* Filtered Statistics */}
            {filteredStats && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Filtered Results</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Total: {filteredStats.total} pathogens</div>
                  <div>Gram(+): {filteredStats.gramPositive}</div>
                  <div>Gram(-): {filteredStats.gramNegative}</div>
                  <div>Unknown: {filteredStats.unknown}</div>
                </div>
              </div>
            )}
          </div>

          {/* Pathogen List */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Pathogens</h2>
              <span className="text-sm text-gray-600">{pathogens.length} found</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pathogens.map((pathogen, index) => (
                <div
                  key={index}
                  onClick={() => handlePathogenSelect(pathogen)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                    selectedPathogen?.name === pathogen.name
                      ? 'border-blue-500 bg-blue-50 scale-105 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{pathogen.name}</div>
                      {pathogen.details && (
                        <div className="text-xs text-gray-500 mt-1">{pathogen.details}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGramStatusColor(pathogen.gramStatus)}`}>
                        {getGramStatusLabel(pathogen.gramStatus)}
                      </span>
                      <span className="text-sm text-gray-600">{pathogen.conditions.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Network Visualization View */}
      {viewMode === 'network' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border overflow-hidden">
              <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse flex items-center justify-center">
                <Network className="h-12 w-12 text-gray-400" />
              </div>}>
                <PathogenNetworkVisualization
                  network={indexes ? buildPathogenNetwork(indexes.pathogenIndex, indexes.conditionIndex) : null}
                  selectedPathogen={selectedPathogen}
                  onSelectPathogen={handlePathogenSelect}
                  onShowPathDetails={(pathogen) => {/* Network pathogen details shown */}}
                  className="h-96"
                />
              </Suspense>
            </div>
          </div>
          
          <div>
            <Suspense fallback={<div className="h-64 bg-gray-100 rounded-lg animate-pulse" />}>
              <PathogenDetailPanel
                pathogen={enhancedPathogenData?.pathogen}
                similarPathogens={enhancedPathogenData?.similarPathogens || []}
                treatmentOptions={enhancedPathogenData?.treatmentOptions || []}
                associatedConditions={enhancedPathogenData?.associatedConditions || []}
                onSelectPathogen={handlePathogenSelect}
                onSelectCondition={onSelectCondition}
                className="h-96 overflow-y-auto"
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Connection Explorer View */}
      {viewMode === 'explorer' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Suspense fallback={<div className="h-64 bg-gray-100 rounded-lg animate-pulse" />}>
            <PathogenConnectionExplorer
              indexes={indexes}
              selectedPathogen={selectedPathogen}
              targetPathogen={selectedTarget}
              onSelectPathogen={handlePathogenSelect}
              onShowPathDetails={(details) => {/* Connection details shown */}}
              recentlyViewed={explorationHistory.map(h => h.pathogen.name)}
              userPreferences={recommendations.userPreferences}
              className="h-96"
            />
          </Suspense>
          
          <div>
            <Suspense fallback={<div className="h-64 bg-gray-100 rounded-lg animate-pulse" />}>
              <PathogenDetailPanel
                pathogen={enhancedPathogenData?.pathogen}
                similarPathogens={enhancedPathogenData?.similarPathogens || []}
                treatmentOptions={enhancedPathogenData?.treatmentOptions || []}
                associatedConditions={enhancedPathogenData?.associatedConditions || []}
                onSelectPathogen={handlePathogenSelect}
                onSelectCondition={onSelectCondition}
                className="h-96 overflow-y-auto"
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Recommendations Panel */}
      {showRecommendations && recommendations.recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="text-yellow-600" size={20} />
              Smart Recommendations
            </h3>
            <button
              onClick={() => setShowRecommendations(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.recommendations.slice(0, 6).map((rec, index) => {
              const pathogen = indexes?.pathogens.find(p => p.name === rec.pathogen);
              if (!pathogen) return null;

              return (
                <button
                  key={index}
                  onClick={() => handlePathogenSelect(pathogen)}
                  className="text-left p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                  data-animate="fade-in"
                >
                  <div className="font-medium text-gray-900 mb-1">{pathogen.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{rec.personalizedReasoning || rec.reasoning}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600">
                      {(rec.personalizedScore * 100).toFixed(0)}% match
                    </span>
                    <ArrowRight size={14} className="text-gray-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Research Integration for Selected Pathogen */}
      {selectedPathogen && (
        <ResearchIntegration
          pathogen={selectedPathogen.name}
          topic={selectedPathogen.commonConditions?.[0]}
          className="mt-6"
        />
      )}

    </div>
  );
};

export default memo(PathogenExplorer);