/**
 * AntibioticExplorer Component - Northwestern Integration Enhanced
 * Provides comprehensive antibiotic exploration functionality with Northwestern pie chart visualization
 * Allows users to search, filter, and explore antibiotics with Northwestern coverage analysis
 *
 * Enhanced by: Agent 2.5 - Component Integration Guardian
 * Date: 2025-08-18
 */

import React, { memo, useState, useMemo, FC, ReactNode } from 'react';
import {
  Search,
  Pill,
  Target,
  ArrowRight,
  TrendingUp,
  Shield,
  Users,
  Grid,
  List,
  PieChart,
} from 'lucide-react';
import NorthwesternPieChart from './NorthwesternPieChart';
import { getAntibioticById } from '../data/EnhancedAntibioticData';

// Types
interface Condition {
  name: string;
  category: string;
  relevantTherapies?: Record<string, string>;
}

interface Antibiotic {
  id: string;
  name: string;
  class: string;
  conditions: Condition[];
  count?: number;
  northwesternSpectrum?: Record<string, number>;
}

interface AntibioticStats {
  total: number;
  drugClassCount: number;
  avgConditions: number;
  maxConditions: number;
  topAntibiotics?: Array<{
    name: string;
    class: string;
    count: number;
  }>;
}

interface DrugClassStat {
  drugClass: string;
  antibiotics: number;
  conditions: number;
}

interface AntibioticDataContextType {
  antibiotics: Antibiotic[];
  selectedAntibiotic: Antibiotic | null;
  selectedAntibioticConditions: Condition[];
  drugClassStats: DrugClassStat[];
  availableDrugClasses: string[];
  antibioticStats: AntibioticStats | null;
  filteredStats: any;
  searchQuery: string;
  drugClassFilter: string;
  sortBy: string;
  searchAntibiotics: (query: string) => void;
  filterByDrugClass: (drugClass: string) => void;
  setSortOrder: (order: string) => void;
  selectAntibiotic: (antibiotic: Antibiotic) => void;
  clearSelection: () => void;
  clearFilters: () => void;
  findAlternativeAntibiotics: (antibiotic: Antibiotic) => Antibiotic[];
  findCombinationTherapies: (antibiotic: Antibiotic) => any[];
  getResistanceInfo: (antibiotic: Antibiotic) => string[] | null;
  isLoading: boolean;
}

interface AntibioticExplorerProps {
  antibioticData?: AntibioticDataContextType | null;
  onSelectCondition?: (condition: Condition) => void;
}

const AntibioticExplorer: FC<AntibioticExplorerProps> = ({
  antibioticData = null,
  onSelectCondition = () => {},
}) => {
  // Defensive programming: Safely extract antibiotic data with comprehensive fallbacks
  const safeAntibioticData: AntibioticDataContextType = antibioticData || {
    antibiotics: [],
    selectedAntibiotic: null,
    selectedAntibioticConditions: [],
    drugClassStats: [],
    availableDrugClasses: [],
    antibioticStats: null,
    filteredStats: null,
    searchQuery: '',
    drugClassFilter: 'all',
    sortBy: 'name',
    searchAntibiotics: () => {},
    filterByDrugClass: () => {},
    setSortOrder: () => {},
    selectAntibiotic: () => {},
    clearSelection: () => {},
    clearFilters: () => {},
    findAlternativeAntibiotics: () => [],
    findCombinationTherapies: () => [],
    getResistanceInfo: () => null,
    isLoading: false,
  };

  const {
    antibiotics = [],
    selectedAntibiotic = null,
    selectedAntibioticConditions = [],
    drugClassStats = [],
    availableDrugClasses = [],
    antibioticStats = null,
    filteredStats = null,
    searchQuery = '',
    drugClassFilter = 'all',
    sortBy = 'name',
    searchAntibiotics = () => {},
    filterByDrugClass = () => {},
    setSortOrder = () => {},
    selectAntibiotic = () => {},
    clearSelection = () => {},
    clearFilters = () => {},
    findAlternativeAntibiotics = () => [],
    findCombinationTherapies = () => [],
    getResistanceInfo = () => null,
    isLoading = false,
  } = safeAntibioticData;

  // Northwestern visualization state
  const [viewMode, setViewMode] = useState<'list' | 'northwestern'>('list');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // Enhanced antibiotics data with Northwestern information
  const enhancedAntibiotics: Antibiotic[] = useMemo(() => {
    return (antibiotics || []).map((antibiotic) => {
      const enhanced = getAntibioticById(antibiotic.id);
      return enhanced || antibiotic;
    });
  }, [antibiotics]);

  // Northwestern interaction handlers
  const handleNorthwesternSegmentHover = (
    segmentKey: string,
    event: React.MouseEvent,
    context: any
  ): void => {
    setSelectedSegment(segmentKey);
  };

  const handleNorthwesternSegmentClick = (
    segmentKey: string,
    event: React.MouseEvent,
    context: any
  ): void => {
    if (context.antibiotic) {
      const antibiotic = enhancedAntibiotics.find((ab) => ab.name === context.antibiotic);
      if (antibiotic) {
        selectAntibiotic(antibiotic);
      }
    }
  };

  // Filter antibiotics by selected segment coverage
  const filteredBySegment: Antibiotic[] = useMemo(() => {
    if (!selectedSegment) return enhancedAntibiotics;

    return (enhancedAntibiotics || []).filter((antibiotic) => {
      return antibiotic.northwesternSpectrum && antibiotic.northwesternSpectrum[selectedSegment] > 0;
    });
  }, [enhancedAntibiotics, selectedSegment]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading antibiotic data...</div>
      </div>
    );
  }

  const getDrugClassColor = (drugClass: string | undefined): string => {
    const colors: Record<string, string> = {
      Penicillins: 'text-blue-600 bg-blue-100',
      Cephalosporins: 'text-green-600 bg-green-100',
      Glycopeptides: 'text-purple-600 bg-purple-100',
      Fluoroquinolones: 'text-orange-600 bg-orange-100',
      Macrolides: 'text-pink-600 bg-pink-100',
      Aminoglycosides: 'text-indigo-600 bg-indigo-100',
      Lincosamides: 'text-teal-600 bg-teal-100',
      Oxazolidinones: 'text-red-600 bg-red-100',
    };
    return colors[drugClass || ''] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Pill className="text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Antibiotic Explorer</h1>
        </div>
        <p className="text-gray-600">
          Explore antimicrobial agents and discover their clinical applications and treatment
          contexts.
        </p>

        {/* Statistics */}
        {antibioticStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{antibioticStats.total}</div>
              <div className="text-sm text-gray-600">Total Antibiotics</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {antibioticStats.drugClassCount}
              </div>
              <div className="text-sm text-gray-600">Drug Classes</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">{antibioticStats.avgConditions}</div>
              <div className="text-sm text-gray-600">Avg Conditions</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">{antibioticStats.maxConditions}</div>
              <div className="text-sm text-gray-600">Max Conditions</div>
            </div>
          </div>
        )}

        {/* Top Antibiotics */}
        {antibioticStats?.topAntibiotics && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Most Frequently Used:</h3>
            <div className="flex flex-wrap gap-2">
              {(antibioticStats?.topAntibiotics || []).map((antibiotic, index) => (
                <button
                  key={index}
                  onClick={() => selectAntibiotic(antibiotic as any)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getDrugClassColor(antibiotic.class)} hover:opacity-80`}
                >
                  {antibiotic.name} ({antibiotic.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Northwestern View Toggle */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">View Mode:</span>
            <div className="flex items-center border rounded-lg p-1 bg-gray-50">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List size={16} />
                List View
              </button>
              <button
                onClick={() => setViewMode('northwestern')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === 'northwestern'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <PieChart size={16} />
                Northwestern Coverage
              </button>
            </div>
          </div>

          {/* Selected Segment Filter */}
          {selectedSegment && viewMode === 'northwestern' && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Filtering by:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                {selectedSegment.replace('_', ' ')}
              </span>
              <button
                onClick={() => setSelectedSegment(null)}
                className="text-gray-400 hover:text-gray-600 ml-1"
                title="Clear filter"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

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
              placeholder="Search antibiotics..."
              value={searchQuery}
              onChange={(e) => searchAntibiotics(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Drug Class</label>
              <select
                value={drugClassFilter}
                onChange={(e) => filterByDrugClass(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Classes</option>
                {(availableDrugClasses || []).map((drugClass) => (
                  <option key={drugClass} value={drugClass}>
                    {drugClass}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name (A-Z)</option>
                <option value="count">Usage Count</option>
                <option value="conditions">Condition Count</option>
                <option value="class">Drug Class</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {/* Drug Class Statistics */}
          {Array.isArray(drugClassStats) && drugClassStats.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Drug Classes</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(drugClassStats || [])
                  .slice(0, 8)
                  .map((stat, index) => (
                    <div
                      key={index}
                      onClick={() => filterByDrugClass(stat.drugClass)}
                      className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDrugClassColor(stat.drugClass)}`}
                      >
                        {stat.drugClass}
                      </span>
                      <div className="text-sm text-gray-600">
                        {stat.antibiotics} drugs, {stat.conditions} conditions
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Antibiotic List/Northwestern View */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {viewMode === 'northwestern' ? 'Northwestern Coverage Analysis' : 'Antibiotics'}
            </h2>
            <span className="text-sm text-gray-600">
              {(selectedSegment ? filteredBySegment : antibiotics).length} found
              {selectedSegment && ` with ${selectedSegment.replace('_', ' ')} coverage`}
            </span>
          </div>

          {viewMode === 'list' ? (
            /* List View */
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(antibiotics || []).map((antibiotic, index) => (
                <div
                  key={index}
                  onClick={() => selectAntibiotic(antibiotic)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAntibiotic?.name === antibiotic.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  data-testid="antibiotic-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{antibiotic.name}</div>
                      <div
                        className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getDrugClassColor(antibiotic.class)}`}
                      >
                        {antibiotic.class}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {antibiotic.conditions.length}
                      </div>
                      <div className="text-xs text-gray-500">conditions</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Northwestern Pie Chart Grid View */
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(selectedSegment ? filteredBySegment : enhancedAntibiotics)
                  .filter((antibiotic) => antibiotic.northwesternSpectrum)
                  .map((antibiotic, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg transition-all duration-200 hover:shadow-md ${
                        selectedAntibiotic?.name === antibiotic.name
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-center mb-2">
                        <div
                          className="font-medium text-sm text-gray-900 truncate"
                          title={antibiotic.name}
                        >
                          {antibiotic.name}
                        </div>
                        <div
                          className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getDrugClassColor(antibiotic.class)}`}
                        >
                          {antibiotic.class}
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <NorthwesternPieChart
                          antibiotic={antibiotic}
                          size="small"
                          interactive={true}
                          onSegmentHover={handleNorthwesternSegmentHover}
                          onSegmentClick={handleNorthwesternSegmentClick}
                          selectedSegments={selectedSegment ? [selectedSegment] : []}
                          className="cursor-pointer"
                          emergencyMode={false}
                          educationLevel="resident"
                        />
                      </div>

                      <div className="text-center mt-2 text-xs text-gray-500">
                        {antibiotic.conditions?.length || 0} conditions
                      </div>
                    </div>
                  ))}
              </div>

              {/* No Northwestern data message */}
              {enhancedAntibiotics.filter((ab) => ab.northwesternSpectrum).length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <PieChart size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Northwestern coverage data is being loaded...</p>
                  <p className="text-sm mt-1">Switch to List View to see all antibiotics</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Antibiotic Details */}
      {selectedAntibiotic && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">{selectedAntibiotic.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getDrugClassColor(selectedAntibiotic.class)}`}
                >
                  {selectedAntibiotic.class}
                </span>
                <span className="text-sm text-gray-600">{selectedAntibiotic.count} uses</span>
              </div>
            </div>
            <button onClick={clearSelection} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {/* Northwestern Coverage Visualization */}
          {(() => {
            const enhancedSelected = getAntibioticById(selectedAntibiotic.id);
            return enhancedSelected?.northwesternSpectrum ? (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PieChart size={20} className="text-blue-600" />
                    <h4 className="font-medium text-blue-800">Northwestern Coverage Analysis</h4>
                  </div>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    Interactive
                  </span>
                </div>

                <div className="flex items-center justify-center">
                  <NorthwesternPieChart
                    antibiotic={enhancedSelected}
                    size="large"
                    interactive={true}
                    showLabels={false}
                    onSegmentHover={(segment: string, event: React.MouseEvent, context: any) => {
                      setSelectedSegment(segment);
                    }}
                    onSegmentClick={(segment: string, event: React.MouseEvent, context: any) => {
                      console.log('Segment analysis:', segment, context);
                    }}
                    selectedSegments={selectedSegment ? [selectedSegment] : []}
                    educationLevel="resident"
                    emergencyMode={false}
                    className="mx-auto"
                  />
                </div>

                {selectedSegment && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="text-sm">
                      <span className="font-medium text-blue-900">
                        {selectedSegment.replace('_', ' ')} Coverage:
                      </span>
                      <span className="ml-2">
                        {enhancedSelected.northwesternSpectrum[selectedSegment] === 0 && 'No coverage'}
                        {enhancedSelected.northwesternSpectrum[selectedSegment] === 1 &&
                          'Moderate coverage'}
                        {enhancedSelected.northwesternSpectrum[selectedSegment] === 2 && 'Good coverage'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : null;
          })()}

          {/* Resistance Information */}
          {(() => {
            const resistanceInfo = getResistanceInfo(selectedAntibiotic);
            return resistanceInfo && resistanceInfo.length > 0 ? (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-yellow-600" />
                  <h4 className="font-medium text-yellow-800">Resistance Considerations</h4>
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {(resistanceInfo || []).map((info, index) => (
                    <li key={index}>• {info}</li>
                  ))}
                </ul>
              </div>
            ) : null;
          })()}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Associated Conditions */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Target size={18} className="text-green-600" />
                Clinical Applications ({selectedAntibioticConditions.length})
              </h3>
              <div className="space-y-2">
                {(selectedAntibioticConditions || []).map((condition, index) => (
                  <div
                    key={index}
                    onClick={() => onSelectCondition(condition)}
                    className="p-3 border rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{condition.name}</div>
                        <div className="text-sm text-gray-600">{condition.category}</div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400" />
                    </div>

                    {/* Show relevant therapy contexts */}
                    {condition.relevantTherapies &&
                      Object.keys(condition.relevantTherapies).length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">Therapy contexts:</div>
                          {Object.entries(condition.relevantTherapies || {}).map(([context, therapy], idx) => (
                            <div key={idx} className="text-xs bg-gray-100 rounded px-2 py-1 mb-1">
                              <span className="font-medium">{context}:</span>{' '}
                              {therapy.length > 100 ? therapy.substring(0, 100) + '...' : therapy}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>

            {/* Alternative Antibiotics */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Users size={18} className="text-purple-600" />
                Alternative Options
              </h3>

              {(() => {
                const alternatives = findAlternativeAntibiotics(selectedAntibiotic);
                return (
                  <div className="space-y-2">
                    {(alternatives || [])
                      .slice(0, 6)
                      .map((alternative, index) => (
                        <div
                          key={index}
                          onClick={() => selectAntibiotic(alternative)}
                          className="p-3 border rounded-lg cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{alternative.name}</div>
                              <div
                                className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getDrugClassColor(alternative.class)}`}
                              >
                                {alternative.class}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">{alternative.conditions.length}</div>
                              <div className="text-xs text-gray-500">shared</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Combination Therapies */}
          {(() => {
            const combinations = findCombinationTherapies(selectedAntibiotic);
            return combinations && combinations.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <TrendingUp size={18} className="text-orange-600" />
                  Combination Therapies
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {combinations.map((combo, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-orange-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{selectedAntibiotic.name}</span>
                        <span className="text-gray-500">+</span>
                        <span className="font-medium text-gray-900">{combo.antibiotic.name}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {(combo.contexts || []).length} context
                        {(combo.contexts || []).length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};

export default memo(AntibioticExplorer);
