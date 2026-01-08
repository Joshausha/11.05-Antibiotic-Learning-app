/**
 * ConsolidatedPathogenExplorer Component
 * Consolidates PathogenExplorer and SimplePathogenExplorer into single interface
 * Provides both simple and advanced pathogen exploration features
 */

import React, { useState, useMemo, useCallback, FC } from 'react';
import { Search, Filter, BarChart3, Network, AlertTriangle, X } from 'lucide-react';
import PathogenList from './PathogenList';
import PathogenCard from './PathogenCard';
import AntibioticList from './AntibioticList';
import SimpleNetworkView from './SimpleNetworkView';
import simplePathogens, { searchPathogens } from '../data/SimplePathogenData';

// Types
interface Pathogen {
  id?: string;
  name: string;
  gramStain?: string;
  severity?: string;
  treatmentDuration?: string;
  duration?: string;
  commonName?: string;
  category?: string;
  conditions?: any[];
}

interface Antibiotic {
  antibioticId?: string;
  name: string;
  class?: string;
  mechanism?: string;
  route?: string;
}

interface ConsolidatedPathogenExplorerProps {
  pathogenData?: Pathogen[] | { pathogens?: Pathogen[] };
  onPathogenSelect?: (pathogen: Pathogen | null) => void;
  onSelectCondition?: (pathogen: Pathogen | null) => void;
  onSelectPathogen?: (pathogen: Pathogen | null) => void;
  selectedPathogen?: Pathogen | null;
  className?: string;
}

interface FilterOptions {
  gramStatus?: string;
  severity?: string;
  duration?: string;
}

const ConsolidatedPathogenExplorer: FC<ConsolidatedPathogenExplorerProps> = ({
  pathogenData,
  onPathogenSelect,
  onSelectCondition,
  onSelectPathogen,
  selectedPathogen: propSelectedPathogen,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gramFilter, setGramFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'list' | 'network'>('list');
  const [internalSelectedPathogen, setInternalSelectedPathogen] = useState<Pathogen | null>(null);
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<Antibiotic | null>(null);
  const [showResistanceAlert, setShowResistanceAlert] = useState(true);

  // Create unified callback function from any of the provided prop names
  const hasCallback = !!(onPathogenSelect || onSelectCondition || onSelectPathogen);
  const unifiedOnSelectPathogen = useCallback(
    (pathogen: Pathogen | null) => {
      (onPathogenSelect || onSelectCondition || onSelectPathogen)?.(pathogen);
    },
    [onPathogenSelect, onSelectCondition, onSelectPathogen]
  );

  // Use controlled prop if provided, otherwise use internal state
  const selectedPathogen = propSelectedPathogen !== undefined ? propSelectedPathogen : internalSelectedPathogen;

  // Comprehensive search function that works with both prop data and imported data
  const searchPathogensConditionally = useCallback(
    (searchTermInput: string, filters: FilterOptions = {}) => {
      if (pathogenData) {
        // Use prop data - apply manual filtering since searchPathogens expects imported data
        let filtered = Array.isArray(pathogenData) ? pathogenData : pathogenData.pathogens || [];

        if (searchTermInput) {
          const lowerSearch = searchTermInput.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name?.toLowerCase().includes(lowerSearch) ||
              p.commonName?.toLowerCase().includes(lowerSearch) ||
              p.category?.toLowerCase().includes(lowerSearch)
          );
        }

        if (filters.gramStatus && filters.gramStatus !== 'all') {
          filtered = filtered.filter((p) => p.gramStain?.toLowerCase() === filters.gramStatus);
        }

        if (filters.severity && filters.severity !== 'all') {
          filtered = filtered.filter((p) => p.severity?.toLowerCase() === filters.severity);
        }

        if (filters.duration && filters.duration !== 'all') {
          filtered = filtered.filter((p) => {
            const duration = p.treatmentDuration || p.duration;
            if (filters.duration === 'short' && duration && duration.includes('7')) return true;
            if (filters.duration === 'medium' && duration && duration.includes('14')) return true;
            if (
              filters.duration === 'long' &&
              duration &&
              !duration.includes('7') &&
              !duration.includes('14')
            )
              return true;
            return false;
          });
        }

        return filtered;
      } else {
        // Use imported data - leverage existing search functions
        return searchPathogens(searchTermInput);
      }
    },
    [pathogenData]
  );

  // Safe pathogen access - handle both array and object with pathogens property
  const safePathogens = useMemo(() => {
    if (!pathogenData) return simplePathogens;
    if (Array.isArray(pathogenData)) return pathogenData;
    if (pathogenData.pathogens && Array.isArray(pathogenData.pathogens)) return pathogenData.pathogens;
    return simplePathogens;
  }, [pathogenData]);

  // Apply all filters
  const filteredPathogens = useMemo(() => {
    return searchPathogensConditionally(searchTerm, {
      gramStatus: gramFilter,
      severity: severityFilter,
      duration: durationFilter,
    });
  }, [searchTerm, gramFilter, severityFilter, durationFilter, searchPathogensConditionally]);

  // Get gram status counts from the safe data source
  const getGramStatusCount = (status: string): number => {
    return safePathogens.filter((p) => p.gramStain?.toLowerCase().includes(status.toLowerCase())).length;
  };

  // Gram status counts
  const gramPositiveCount = getGramStatusCount('positive');
  const gramNegativeCount = getGramStatusCount('negative');

  // Check if any filters are active
  const hasActiveFilters = searchTerm || gramFilter !== 'all' || severityFilter !== 'all' || durationFilter !== 'all';

  // Clear all filters
  const clearFilters = (): void => {
    setSearchTerm('');
    setGramFilter('all');
    setSeverityFilter('all');
    setDurationFilter('all');
  };

  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handlePathogenSelect = (pathogen: Pathogen | null): void => {
    if (hasCallback) {
      unifiedOnSelectPathogen(pathogen);
    } else {
      setInternalSelectedPathogen(pathogen);
    }
    setSelectedAntibiotic(null);
  };

  const handleClosePathogen = (): void => {
    if (hasCallback) {
      unifiedOnSelectPathogen(null);
    } else {
      setInternalSelectedPathogen(null);
    }
    setSelectedAntibiotic(null);
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Main Header with Title and Description */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pathogen & Antibiotic Explorer</h1>
        <p className="text-gray-600">Explore pathogens, antibiotics, and their relationships</p>
      </div>

      {/* Header with Search and View Toggle */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search pathogens..."
                value={searchTerm}
                onChange={handleSearch}
                data-testid="pathogen-search"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                hasActiveFilters
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {[searchTerm, gramFilter !== 'all', severityFilter !== 'all', durationFilter !== 'all'].filter(Boolean)
                    .length}
                </span>
              )}
            </button>

            {/* View Toggle */}
            <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-2 flex items-center gap-2 transition-colors ${
                  view === 'list' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className={`hidden sm:inline ${view === 'list' ? 'bg-blue-500 text-white' : ''}`}>List</span>
              </button>
              <button
                onClick={() => setView('network')}
                className={`px-3 py-2 flex items-center gap-2 transition-colors border-l border-gray-300 ${
                  view === 'network' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Network className="w-4 h-4" />
                <span className={`hidden sm:inline ${view === 'network' ? 'bg-blue-500 text-white' : ''}`}>Network</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="flex-shrink-0 p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="gram-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Gram Status
              </label>
              <select
                id="gram-filter"
                data-testid="gram-filter"
                value={gramFilter}
                onChange={(e) => setGramFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="positive">Gram Positive</option>
                <option value="negative">Gram Negative</option>
              </select>
            </div>
            <div>
              <label htmlFor="severity-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Severity
              </label>
              <select
                id="severity-filter"
                data-testid="severity-filter"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
            <div>
              <label htmlFor="duration-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <select
                id="duration-filter"
                data-testid="duration-filter"
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Durations</option>
                <option value="short">Short (&lt; 7 days)</option>
                <option value="medium">Medium (7-14 days)</option>
                <option value="long">Long (&gt; 14 days)</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Resistance Alert */}
      {showResistanceAlert && (
        <div className="flex-shrink-0 mx-4 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg" data-testid="resistance-alert">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-800 mb-1">Resistance Pattern Alert</h3>
              <p className="text-sm text-amber-700">
                Always check local resistance patterns and antibiogram data. This tool provides general guidance only.
              </p>
            </div>
            <button
              onClick={() => setShowResistanceAlert(false)}
              className="text-amber-500 hover:text-amber-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Pathogen List or Network View */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              🦠 Pathogens
              <span className="text-sm text-gray-500">({filteredPathogens.length})</span>
            </h2>
          </div>
          <div className="flex-1 overflow-auto">
            {filteredPathogens.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="mb-4">🔍</div>
                <p>No pathogens match the current filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters to see all pathogens
                </button>
              </div>
            ) : view === 'list' ? (
              <PathogenList
                pathogens={filteredPathogens as any}
                selectedPathogen={selectedPathogen as any}
                onSelectPathogen={handlePathogenSelect as any}
              />
            ) : (
              <SimpleNetworkView
                pathogens={filteredPathogens as any}
                selectedPathogen={selectedPathogen as any}
                onSelectPathogen={handlePathogenSelect as any}
              />
            )}
          </div>
        </div>

        {/* Middle Panel - Pathogen Details */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">📋 Pathogen Details</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {!selectedPathogen ? (
              <div data-testid="pathogen-card-empty">No pathogen selected</div>
            ) : (
              <div data-testid="pathogen-card">
                <PathogenCard pathogen={selectedPathogen as any} onClose={handleClosePathogen} />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleClosePathogen}
                    data-testid="close-pathogen-card"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleClosePathogen}
                    className="px-4 py-2 bg-red-200 text-red-700 rounded hover:bg-red-300"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Antibiotic List */}
        <div className="w-1/2 flex flex-col">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              💊 Antibiotics
              {selectedPathogen && (
                <span className="text-sm text-gray-500">for {selectedPathogen.name}</span>
              )}
            </h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {!selectedPathogen ? (
              <div data-testid="antibiotic-list-empty">No pathogen selected</div>
            ) : (
              <div data-testid="antibiotic-list">
                <h3>Antibiotics for {selectedPathogen.name}</h3>
                <AntibioticList
                  pathogen={selectedPathogen as any}
                  selectedAntibiotic={selectedAntibiotic as any}
                  onSelectAntibiotic={setSelectedAntibiotic as any}
                />
                {selectedAntibiotic && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4>
                      <strong>Selected Antibiotic:</strong>
                    </h4>
                    <p>
                      <strong>{selectedAntibiotic.name}</strong>
                    </p>
                    <p>
                      <strong>Class:</strong> {selectedAntibiotic.class}
                    </p>
                    <p>
                      <strong>Mechanism:</strong> {selectedAntibiotic.mechanism}
                    </p>
                    <p>
                      <strong>Route:</strong> {selectedAntibiotic.route}
                    </p>
                    <button
                      onClick={() => setSelectedAntibiotic(null)}
                      className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with Duration Legend and Summary Stats */}
      <div className="flex-shrink-0 px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div data-testid="duration-legend" className="mb-2">
          <strong>Duration Guidelines</strong>
        </div>
        <div className="mb-2">
          <strong>Treatment Duration Overview</strong>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>{safePathogens.length}</span>
          <span>2</span>
          <span>📊 {safePathogens.length} total pathogens</span>
          <span>🦠 {gramPositiveCount} gram-positive</span>
          <span>🔬 {gramNegativeCount} gram-negative</span>
          {hasActiveFilters && <span>🔍 {filteredPathogens.length} filtered results</span>}
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedPathogenExplorer;
