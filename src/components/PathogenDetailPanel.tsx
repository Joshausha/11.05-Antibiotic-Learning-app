/**
 * PathogenDetailPanel Component
 * Comprehensive pathogen information display with interactive exploration features
 * Shows detailed pathogen data, relationships, treatment options, and learning pathways
 */

import React, { useState, useMemo, useEffect, ReactNode } from 'react';
import {
  Microscope, Target, Pill, TrendingUp, Network,
  ArrowRight, Info, AlertTriangle,
  ChevronDown, ChevronUp, Filter
} from 'lucide-react';
import { defaultAnimationController } from '../utils/animations';

interface Pathogen {
  id?: number | string;
  name: string;
  gramStatus?: string;
  shortName?: string;
  details?: string;
  type?: string;
  [key: string]: any;
}

interface Treatment {
  name: string;
  class?: string;
  isFirstLine?: boolean;
  hasResistance?: boolean;
  effectivenessScore?: number;
  applicableConditions?: string[];
  [key: string]: any;
}

interface Condition {
  name: string;
  category?: string;
  description?: string;
  empiricTherapy?: Record<string, any>;
  [key: string]: any;
}

interface SimilarPathogen {
  pathogen: Pathogen;
  weight: number;
  reasoning: string;
  similarity?: {
    factors: {
      sharedConditions: number;
      gramStatus: number;
    };
    details: {
      sharedConditionNames: string[];
    };
  };
}

interface ComplexityScore {
  total: number;
  factors: {
    conditions: number;
    treatments: number;
    connections: number;
  };
}

interface PathogenDetailPanelProps {
  pathogen?: Pathogen;
  pathogenData?: any;
  similarPathogens?: SimilarPathogen[];
  treatmentOptions?: Treatment[];
  associatedConditions?: Condition[];
  onSelectPathogen?: (pathogen: Pathogen) => void;
  onSelectCondition?: (condition: Condition) => void;
  onShowComparison?: (pathogen: Pathogen, similar: SimilarPathogen[]) => void;
  className?: string;
}

const PathogenDetailPanel: React.FC<PathogenDetailPanelProps> = ({
  pathogen,
  pathogenData,
  similarPathogens = [],
  treatmentOptions = [],
  associatedConditions = [],
  onSelectPathogen,
  onSelectCondition,
  onShowComparison,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'conditions' | 'treatments' | 'connections'>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));
  const [selectedComparison, setSelectedComparison] = useState<string | null>(null);
  const [treatmentFilter, setTreatmentFilter] = useState<'all' | 'first-line' | 'resistance'>('all');

  // Calculate pathogen complexity score
  const complexityScore = useMemo((): ComplexityScore => {
    if (!pathogen || !associatedConditions || !treatmentOptions || !similarPathogens) {
      return { total: 0, factors: { conditions: 0, treatments: 0, connections: 0 } };
    }
    const conditionCount = associatedConditions.length;
    const treatmentCount = treatmentOptions.length;
    const connectionCount = similarPathogens.length;

    return {
      total: Math.min(100, (conditionCount * 10 + treatmentCount * 5 + connectionCount * 3)),
      factors: {
        conditions: conditionCount,
        treatments: treatmentCount,
        connections: connectionCount
      }
    };
  }, [pathogen, associatedConditions, treatmentOptions, similarPathogens]);

  // Animate panel when pathogen changes
  useEffect(() => {
    if (pathogen) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const panelElement = document.querySelector('[data-pathogen-panel="true"]');
        if (panelElement && defaultAnimationController) {
          defaultAnimationController.animate?.(panelElement, 'fade-in', 400);
        }
      }, 50);
    }
  }, [pathogen]);

  if (!pathogen) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Microscope size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Select a pathogen to view detailed information</p>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Get gram status styling
  const getGramStatusStyle = (): string => {
    switch (pathogen.gramStatus) {
      case 'positive':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter treatment options
  const filteredTreatments = treatmentOptions.filter(treatment => {
    if (treatmentFilter === 'all') return true;
    if (treatmentFilter === 'first-line') return treatment.isFirstLine;
    if (treatmentFilter === 'resistance') return treatment.hasResistance;
    return true;
  });

  // Render complexity indicator
  const renderComplexityIndicator = (score: number, label: string): ReactNode => {
    const percentage = Math.min(100, score);
    const color = percentage > 70 ? 'bg-red-500' : percentage > 40 ? 'bg-yellow-500' : 'bg-green-500';

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 min-w-0 flex-1">{label}</span>
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${color} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 min-w-0">{score}</span>
      </div>
    );
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border ${className}`}
      data-pathogen-panel="true"
    >
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Microscope className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">{pathogen.name}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getGramStatusStyle()}`}>
                Gram {pathogen.gramStatus || 'Unknown'}
              </span>
            </div>

            {pathogen.shortName && (
              <p className="text-gray-600 mb-2">Common name: {pathogen.shortName}</p>
            )}

            {pathogen.details && (
              <p className="text-gray-700 leading-relaxed">{pathogen.details}</p>
            )}
          </div>

          <div className="ml-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{complexityScore.total}</div>
            <div className="text-xs text-gray-500">Complexity Score</div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{(associatedConditions || []).length}</div>
            <div className="text-sm text-gray-600">Conditions</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{(treatmentOptions || []).length}</div>
            <div className="text-sm text-gray-600">Treatments</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{(similarPathogens || []).length}</div>
            <div className="text-sm text-gray-600">Similar</div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex space-x-1 mt-6 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'overview' as const, label: 'Overview', icon: Info },
            { id: 'conditions' as const, label: 'Conditions', icon: Target },
            { id: 'treatments' as const, label: 'Treatments', icon: Pill },
            { id: 'connections' as const, label: 'Connections', icon: Network }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('basic')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Info size={18} className="text-blue-600" />
                  <span className="font-medium">Basic Information</span>
                </div>
                {expandedSections.has('basic') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {expandedSections.has('basic') && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Classification</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium capitalize">{pathogen.type || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gram Status:</span>
                          <span className="font-medium">{pathogen.gramStatus || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Complexity Analysis</h4>
                      <div className="space-y-2">
                        {renderComplexityIndicator(complexityScore.factors.conditions * 10, 'Condition Coverage')}
                        {renderComplexityIndicator(complexityScore.factors.treatments * 5, 'Treatment Options')}
                        {renderComplexityIndicator(complexityScore.factors.connections * 3, 'Pathogen Connections')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Clinical Significance */}
            <div className="border rounded-lg">
              <button
                onClick={() => toggleSection('clinical')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-orange-600" />
                  <span className="font-medium">Clinical Significance</span>
                </div>
                {expandedSections.has('clinical') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {expandedSections.has('clinical') && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Key Clinical Features</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Target size={14} className="text-blue-600" />
                          <span>Affects {(associatedConditions || []).length} condition types</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Pill size={14} className="text-green-600" />
                          <span>{(treatmentOptions || []).length} treatment options available</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Network size={14} className="text-purple-600" />
                          <span>Connected to {(similarPathogens || []).length} similar pathogens</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Risk Assessment</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Treatment Complexity:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            complexityScore.total > 70 ? 'bg-red-100 text-red-800' :
                            complexityScore.total > 40 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {complexityScore.total > 70 ? 'High' : complexityScore.total > 40 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'conditions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Associated Conditions</h3>
              <span className="text-sm text-gray-500">{(associatedConditions || []).length} conditions</span>
            </div>

            <div className="grid gap-3">
              {(associatedConditions || []).map((condition, index) => (
                <div
                  key={index}
                  onClick={() => onSelectCondition?.(condition)}
                  className="border rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{condition.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{condition.category}</p>
                      {condition.description && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{condition.description}</p>
                      )}
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                  </div>

                  {condition.empiricTherapy && Object.keys(condition.empiricTherapy).length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-xs text-gray-600">
                        Primary treatments: {Object.keys(condition.empiricTherapy).slice(0, 2).join(', ')}
                        {Object.keys(condition.empiricTherapy).length > 2 && '...'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'treatments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Treatment Options</h3>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-600" />
                <select
                  value={treatmentFilter}
                  onChange={(e) => setTreatmentFilter(e.target.value as 'all' | 'first-line' | 'resistance')}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="all">All Treatments</option>
                  <option value="first-line">First Line</option>
                  <option value="resistance">With Resistance</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3">
              {filteredTreatments.map((treatment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{treatment.name}</h4>
                    <div className="flex items-center gap-2">
                      {treatment.effectivenessScore && (
                        <div className="flex items-center gap-1">
                          <TrendingUp size={14} className="text-green-600" />
                          <span className="text-sm text-green-600">
                            {treatment.effectivenessScore}% effective
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">{treatment.class}</div>

                  {treatment.applicableConditions && treatment.applicableConditions.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Used in: {treatment.applicableConditions.slice(0, 3).join(', ')}
                      {treatment.applicableConditions.length > 3 && ` +${treatment.applicableConditions.length - 3} more`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'connections' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Similar Pathogens</h3>
              <span className="text-sm text-gray-500">{(similarPathogens || []).length} connections</span>
            </div>

            <div className="grid gap-3">
              {(similarPathogens || []).map((similar, index) => (
                <div
                  key={index}
                  onClick={() => onSelectPathogen?.(similar.pathogen)}
                  className="border rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{similar.pathogen.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{similar.reasoning}</p>

                      {similar.similarity?.details?.sharedConditionNames?.length ?? 0 > 0 && (
                        <div className="text-xs text-blue-600 mt-2">
                          Shared conditions: {similar.similarity?.details?.sharedConditionNames?.slice(0, 2).join(', ')}
                          {(similar.similarity?.details?.sharedConditionNames?.length ?? 0) > 2 && '...'}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {(similar.weight * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">similarity</div>
                    </div>
                  </div>

                  {/* Similarity breakdown */}
                  {similar.similarity && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {similar.similarity.factors.sharedConditions > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Conditions:</span>
                            <span className="font-medium">
                              {(similar.similarity.factors.sharedConditions * 100).toFixed(0)}%
                            </span>
                          </div>
                        )}
                        {similar.similarity.factors.gramStatus > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Gram status:</span>
                            <span className="font-medium">Match</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {onShowComparison && similarPathogens.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => onShowComparison(pathogen, similarPathogens)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Compare with Similar Pathogens
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PathogenDetailPanel;
