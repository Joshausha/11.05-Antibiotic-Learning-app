/**
 * PathogenConnectionExplorer Component
 * Interactive pathogen connection exploration with pathway tracing
 * Allows users to trace connections between pathogens and explore learning paths
 */

import React, { useState, useEffect, useMemo, FC } from 'react';
import {
  Map,
  Navigation,
  ArrowRight,
  Target,
  Zap,
  MapPin,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  Star,
  TrendingUp,
} from 'lucide-react';
import { findPathogenPaths, getPathogenRecommendations } from '../utils/dataIndexer';

// Types
interface Pathogen {
  id?: string;
  name: string;
  conditions?: any[];
  connections?: number;
}

interface Indexes {
  pathogens: Pathogen[];
  [key: string]: any;
}

interface ExplorationHistoryEntry {
  pathogen: Pathogen;
  timestamp: number;
  step: number;
  reason: string;
  similarity?: number | null;
}

interface ExplorationStats {
  pathogensExplored: number;
  stepsTotal: number;
  averageSimilarity: number;
  explorationTime: number;
}

interface PathData {
  path: string[];
  length: number;
  score?: number;
}

interface RecommendationData {
  pathogen: string;
  reasoning: string;
  weight: number;
}

interface PathogenConnectionExplorerProps {
  indexes?: Indexes;
  selectedPathogen?: Pathogen | null;
  targetPathogen?: Pathogen | null;
  onSelectPathogen?: (pathogen: Pathogen) => void;
  onShowPathDetails?: () => void;
  recentlyViewed?: string[];
  userPreferences?: Record<string, any>;
  className?: string;
}

const PathogenConnectionExplorer: FC<PathogenConnectionExplorerProps> = ({
  indexes,
  selectedPathogen,
  targetPathogen,
  onSelectPathogen,
  onShowPathDetails,
  recentlyViewed = [],
  userPreferences = {},
  className = '',
}) => {
  const [explorationMode, setExplorationMode] = useState<'guided' | 'freeform' | 'recommendations'>('guided');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [explorationHistory, setExplorationHistory] = useState<ExplorationHistoryEntry[]>([]);
  const [availablePaths, setAvailablePaths] = useState<PathData[]>([]);
  const [isExploring, setIsExploring] = useState(false);
  const [explorationStep, setExplorationStep] = useState(0);
  const [pathFilter, setPathFilter] = useState<'shortest' | 'strongest' | 'most_diverse'>('shortest');
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  // Calculate available paths when target changes
  useEffect(() => {
    if (selectedPathogen && targetPathogen && indexes) {
      const paths = findPathogenPaths(indexes as any, selectedPathogen.name, targetPathogen.name, 4);
      setAvailablePaths(paths);

      if (paths.length > 0) {
        // Select best path based on filter
        let selectedPath: PathData;
        switch (pathFilter) {
          case 'strongest':
            selectedPath = paths.reduce((best, current) => (current.score! > best.score! ? current : best));
            break;
          case 'most_diverse':
            selectedPath = paths.reduce((best, current) => (current.length > best.length ? current : best));
            break;
          case 'shortest':
          default:
            selectedPath = paths.reduce((best, current) => (current.length < best.length ? current : best));
        }
        setCurrentPath(selectedPath.path);
      }
    }
  }, [selectedPathogen, targetPathogen, indexes, pathFilter]);

  // Update recommendations when pathogen changes
  useEffect(() => {
    if (selectedPathogen && indexes) {
      const recs = getPathogenRecommendations(indexes as any, selectedPathogen.name, recentlyViewed, userPreferences);
      setRecommendations(recs);
    }
  }, [selectedPathogen, indexes, recentlyViewed, userPreferences]);

  // Calculate exploration statistics
  const explorationStats: ExplorationStats | null = useMemo(() => {
    if (!explorationHistory.length) return null;

    const uniquePathogens = new Set(explorationHistory.map((h) => h.pathogen.name));
    const totalSimilarity = explorationHistory.reduce((sum, h) => sum + (h.similarity || 0), 0);
    const avgSimilarity = totalSimilarity / explorationHistory.length;

    return {
      pathogensExplored: uniquePathogens.size,
      stepsTotal: explorationHistory.length,
      averageSimilarity: avgSimilarity,
      explorationTime: Date.now() - (explorationHistory[0]?.timestamp || Date.now()),
    };
  }, [explorationHistory]);

  const startExploration = (mode: 'guided' | 'freeform' | 'recommendations' = 'guided'): void => {
    setExplorationMode(mode);
    setIsExploring(true);
    setExplorationStep(0);

    if (selectedPathogen) {
      const newHistory: ExplorationHistoryEntry[] = [
        {
          pathogen: selectedPathogen,
          timestamp: Date.now(),
          step: 0,
          reason: 'Starting pathogen',
        },
      ];
      setExplorationHistory(newHistory);
      setBreadcrumbs([selectedPathogen.name]);
    }
  };

  const addToExploration = (pathogen: Pathogen, reason: string = '', similarity: number | null = null): void => {
    const newStep: ExplorationHistoryEntry = {
      pathogen,
      timestamp: Date.now(),
      step: explorationHistory.length,
      reason,
      similarity,
    };

    setExplorationHistory((prev) => [...prev, newStep]);
    setBreadcrumbs((prev) => [...prev, pathogen.name]);
    setExplorationStep((prev) => prev + 1);

    onSelectPathogen?.(pathogen);
  };

  const resetExploration = (): void => {
    setIsExploring(false);
    setExplorationHistory([]);
    setCurrentPath([]);
    setExplorationStep(0);
    setBreadcrumbs([]);
  };

  const navigateToStep = (stepIndex: number): void => {
    if (stepIndex < explorationHistory.length) {
      const targetStep = explorationHistory[stepIndex];
      setExplorationStep(stepIndex);
      onSelectPathogen?.(targetStep.pathogen);
      setBreadcrumbs(explorationHistory.slice(0, stepIndex + 1).map((h) => h.pathogen.name));
    }
  };

  const renderPathVisualization = (): JSX.Element | null => {
    if (!currentPath || currentPath.length === 0) return null;

    return (
      <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Map size={18} className="text-blue-600" />
          Exploration Path ({currentPath.length} steps)
        </h4>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {currentPath.map((pathogenName, index) => {
            const pathogenInIndex = indexes?.pathogens?.find((p) => p.name === pathogenName);
            return (
              <React.Fragment key={pathogenName}>
                <button
                  onClick={() => {
                    if (pathogenInIndex) {
                      addToExploration(pathogenInIndex, `Path step ${index + 1}`);
                    }
                  }}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg border font-medium text-sm transition-colors ${
                    explorationHistory.some((h) => h.pathogen.name === pathogenName)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {explorationHistory.some((h) => h.pathogen.name === pathogenName) && (
                      <Star size={12} className="text-blue-600" />
                    )}
                    {pathogenName.split(' ').slice(0, 2).join(' ')}
                  </div>
                </button>

                {index < currentPath.length - 1 && (
                  <ArrowRight size={16} className="text-gray-400 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {availablePaths.length > 1 && (
          <div className="mt-3 text-xs text-gray-600">{availablePaths.length - 1} alternative paths available</div>
        )}
      </div>
    );
  };

  const renderExplorationHistory = (): JSX.Element | null => {
    if (!isExploring || explorationHistory.length === 0) return null;

    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Navigation size={18} className="text-green-600" />
            Exploration History
          </h4>
          <button
            onClick={resetExploration}
            className="p-1 text-gray-500 hover:text-gray-700"
            title="Reset exploration"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {explorationHistory.map((step, index) => (
            <div
              key={index}
              onClick={() => navigateToStep(index)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                index === explorationStep
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {step.step + 1}. {step.pathogen.name}
                  </div>
                  <div className="text-sm text-gray-600">{step.reason}</div>
                  {step.similarity && (
                    <div className="text-xs text-blue-600 mt-1">
                      Similarity: {(step.similarity * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {explorationStats && (
          <div className="mt-4 pt-3 border-t bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-900">{explorationStats.pathogensExplored}</div>
                <div className="text-gray-600">Pathogens Explored</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">{explorationStats.stepsTotal}</div>
                <div className="text-gray-600">Total Steps</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRecommendations = (): JSX.Element | null => {
    if (recommendations.length === 0) return null;

    return (
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp size={18} className="text-purple-600" />
          Recommended Next Steps
        </h4>

        <div className="space-y-2">
          {recommendations.slice(0, 5).map((rec, index) => {
            const pathogen = indexes?.pathogens?.find((p) => p.name === rec.pathogen);
            if (!pathogen) return null;

            return (
              <button
                key={index}
                onClick={() => addToExploration(pathogen, rec.reasoning, rec.weight)}
                className="w-full p-3 text-left border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{pathogen.name}</div>
                    <div className="text-sm text-gray-600">{rec.reasoning}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-blue-600">{(rec.weight * 100).toFixed(0)}%</div>
                    <ArrowRight size={14} className="text-gray-400" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!selectedPathogen) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Navigation size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Select a pathogen to start exploring connections</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Navigation className="text-blue-600" size={20} />
              Connection Explorer
            </h3>
            <p className="text-gray-600 mt-1">Discover pathogen relationships and learning pathways</p>
          </div>

          <div className="flex items-center gap-2">
            {!isExploring ? (
              <button
                onClick={() => startExploration('guided')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play size={16} />
                Start Exploring
              </button>
            ) : (
              <button
                onClick={() => setIsExploring(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Pause size={16} />
                Pause
              </button>
            )}
          </div>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
            <MapPin size={14} />
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <button
                  onClick={() => navigateToStep(index)}
                  className="hover:text-blue-600 transition-colors"
                >
                  {crumb.split(' ').slice(0, 2).join(' ')}
                </button>
                {index < breadcrumbs.length - 1 && <ChevronRight size={12} className="text-gray-400" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Mode selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Mode:</span>
          {(['guided', 'freeform', 'recommendations'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setExplorationMode(mode)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                explorationMode === mode
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Current pathogen info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Currently Exploring</h4>
              <div className="text-lg font-bold text-blue-600">{selectedPathogen.name}</div>
              <div className="text-sm text-gray-600">
                Step {explorationStep + 1} • {selectedPathogen.conditions?.length || 0} conditions
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl">🔬</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
          </div>
        </div>

        {/* Path visualization */}
        {explorationMode === 'guided' && targetPathogen && renderPathVisualization()}

        {/* Recommendations */}
        {explorationMode === 'recommendations' && renderRecommendations()}

        {/* Exploration history */}
        {renderExplorationHistory()}

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              if (recommendations.length > 0) {
                const randomRec = recommendations[Math.floor(Math.random() * recommendations.length)];
                const pathogen = indexes?.pathogens?.find((p) => p.name === randomRec.pathogen);
                if (pathogen) {
                  addToExploration(pathogen, 'Random discovery', randomRec.weight);
                }
              }
            }}
            className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            <Zap size={14} className="inline mr-1" />
            Random Discovery
          </button>

          <button
            onClick={() => {
              // Find the most connected pathogen not yet explored
              const unexplored = (indexes?.pathogens || []).filter(
                (p) => !explorationHistory.some((h) => h.pathogen.name === p.name)
              );
              const mostConnected = unexplored.reduce((best, current) => {
                const bestConnections = best?.connections || 0;
                const currentConnections = current?.connections || 0;
                return currentConnections > bestConnections ? current : best;
              }, null as Pathogen | null);

              if (mostConnected) {
                addToExploration(mostConnected, 'High connectivity target');
              }
            }}
            className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            <Target size={14} className="inline mr-1" />
            Find Hub
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathogenConnectionExplorer;
