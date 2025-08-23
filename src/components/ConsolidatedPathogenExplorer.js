/**
 * ConsolidatedPathogenExplorer Component
 * Consolidates PathogenExplorer and SimplePathogenExplorer into single interface
 * Provides both simple and advanced pathogen exploration features
 */

import React, { useState, useMemo, useContext } from 'react';
import { Search, Filter, BarChart3, Network, ChevronDown, ChevronUp, Info, AlertTriangle, Clock, ShieldCheck, X } from 'lucide-react';
import PathogenList from './PathogenList';
import PathogenCard from './PathogenCard';
import AntibioticList from './AntibioticList';
import SimpleNetworkView from './SimpleNetworkView';
import simplePathogens, { searchPathogens, getPathogensByGramStatus } from '../data/SimplePathogenData';
import pathogenAntibioticMap from '../data/pathogenAntibioticMap';

const ConsolidatedPathogenExplorer = ({ 
  pathogenData, 
  onPathogenSelect, 
  selectedPathogen: propSelectedPathogen, 
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gramFilter, setGramFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('list');
  const [internalSelectedPathogen, setInternalSelectedPathogen] = useState(null);
  const [selectedAntibiotic, setSelectedAntibiotic] = useState(null);

  // Use controlled prop if provided, otherwise use internal state
  const selectedPathogen = propSelectedPathogen !== undefined ? propSelectedPathogen : internalSelectedPathogen;

  // Comprehensive search function that works with both prop data and imported data
  const searchPathogensConditionally = (searchTerm, filters = {}) => {
    if (pathogenData) {
      // Use prop data - apply manual filtering since searchPathogens expects imported data
      let filtered = pathogenData;
      
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
          p.name?.toLowerCase().includes(lowerSearch) ||
          p.commonName?.toLowerCase().includes(lowerSearch) ||
          p.category?.toLowerCase().includes(lowerSearch)
        );
      }
      
      if (filters.gramStatus && filters.gramStatus !== 'all') {
        filtered = filtered.filter(p => p.gramStatus === filters.gramStatus);
      }
      
      return filtered;
    } else {
      // Use imported data with existing search utility
      return searchPathogens(searchTerm, filters);
    }
  };

  // Updated filteredPathogens to use pathogenData prop if provided
  const filteredPathogens = useMemo(() => {
    // Use pathogenData prop if provided, otherwise fall back to imported data
    let pathogens = pathogenData || simplePathogens || [];
    
    // If we have prop data, use conditional search, otherwise use utility function
    if (pathogenData) {
      pathogens = searchPathogensConditionally(searchTerm, {
        gramStatus: gramFilter !== 'all' ? gramFilter : undefined
      });
    } else {
      pathogens = searchPathogens(searchTerm, {
        gramStatus: gramFilter !== 'all' ? gramFilter : undefined
      });
    }

    // Apply additional filters (same logic for both data sources)
    if (severityFilter !== 'all') {
      pathogens = pathogens.filter(p => p && p.severity === severityFilter);
    }

    if (durationFilter !== 'all') {
      pathogens = pathogens.filter(p => {
        if (!p || !p.treatmentDuration) return false;
        const days = parseInt(p.treatmentDuration);
        if (durationFilter === 'short') return days <= 7;
        if (durationFilter === 'medium') return days > 7 && days <= 14;
        if (durationFilter === 'long') return days > 14;
        return true;
      });
    }

    return pathogens || [];
  }, [pathogenData, searchTerm, gramFilter, severityFilter, durationFilter]);

  // Updated to use pathogenData prop for defensive programming
  const safePathogens = pathogenData || simplePathogens || [];

  // Helper function for gram status counting that works with both prop and import data
  const getGramStatusCount = (status) => {
    const source = pathogenData || simplePathogens || [];
    if (pathogenData) {
      // Use prop data directly
      return source.filter(p => p && p.gramStatus === status).length;
    } else {
      // Use utility function for imported data
      return (getPathogensByGramStatus(status) || []).length;
    }
  };

  const gramPositiveCount = getGramStatusCount('positive');
  const gramNegativeCount = getGramStatusCount('negative');
  
  const severityStats = {
    mild: safePathogens.filter(p => p && p.severity === 'mild').length,
    moderate: safePathogens.filter(p => p && p.severity === 'moderate').length,
    severe: safePathogens.filter(p => p && p.severity === 'severe').length
  };

  const durationStats = {
    short: safePathogens.filter(p => {
      if (!p || !p.treatmentDuration) return false;
      const days = parseInt(p.treatmentDuration);
      return days <= 7;
    }).length,
    medium: safePathogens.filter(p => {
      if (!p || !p.treatmentDuration) return false;
      const days = parseInt(p.treatmentDuration);
      return days > 7 && days <= 14;
    }).length,
    long: safePathogens.filter(p => {
      if (!p || !p.treatmentDuration) return false;
      const days = parseInt(p.treatmentDuration);
      return days > 14;
    }).length
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setGramFilter('all');
    setSeverityFilter('all');
    setDurationFilter('all');
  };

  // Handler for pathogen selection - supports both controlled and uncontrolled usage
  const handlePathogenSelect = (pathogen) => {
    // Update internal state if not controlled
    if (propSelectedPathogen === undefined) {
      setInternalSelectedPathogen(pathogen);
    }
    
    // Clear antibiotic selection when pathogen changes
    setSelectedAntibiotic(null);
    
    // Call parent callback if provided
    if (onPathogenSelect) {
      onPathogenSelect(pathogen);
    }
  };

  // Handler for antibiotic selection
  const handleAntibioticSelect = (antibiotic) => {
    setSelectedAntibiotic(antibiotic);
  };

  const hasActiveFilters = searchTerm || gramFilter !== 'all' || severityFilter !== 'all' || durationFilter !== 'all';

  // Get antibiotics for selected pathogen
  const selectedPathogenAntibiotics = useMemo(() => {
    if (!selectedPathogen) return [];
    const pathogenMap = pathogenAntibioticMap[selectedPathogen.id];
    return pathogenMap ? pathogenMap.antibiotics : [];
  }, [selectedPathogen]);

  return (
    <div className={`h-full flex flex-col bg-white ${className}`}>
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
                  {[searchTerm, gramFilter !== 'all', severityFilter !== 'all', durationFilter !== 'all'].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-2 text-sm transition-colors ${
                  view === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView('network')}
                className={`px-3 py-2 text-sm transition-colors border-l border-gray-300 flex items-center gap-2 ${
                  view === 'network' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Network className="w-4 h-4" />
                Network
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Gram Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gram Status
                </label>
                <select
                  value={gramFilter}
                  onChange={(e) => setGramFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All ({safePathogens.length})</option>
                  <option value="positive">Gram Positive ({getGramStatusCount('positive')})</option>
                  <option value="negative">Gram Negative ({getGramStatusCount('negative')})</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity
                </label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Severities</option>
                  <option value="mild">Mild ({severityStats.mild})</option>
                  <option value="moderate">Moderate ({severityStats.moderate})</option>
                  <option value="severe">Severe ({severityStats.severe})</option>
                </select>
              </div>

              {/* Duration Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment Duration
                </label>
                <select
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Durations</option>
                  <option value="short">Short ≤7 days ({durationStats.short})</option>
                  <option value="medium">Medium 8-14 days ({durationStats.medium})</option>
                  <option value="long">Long >14 days ({durationStats.long})</option>
                </select>
              </div>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Summary Statistics */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{safePathogens.length}</div>
            <div className="text-sm text-gray-600">Pathogens</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">2</div>
            <div className="text-sm text-gray-600">Antibiotics</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">Duration Guidelines</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
        </div>

        {/* Treatment Duration Overview */}
        <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Treatment Duration Overview</h3>
          <div data-testid="duration-legend" className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span>Short ≤7 days ({durationStats.short})</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span>Medium 8-14 days ({durationStats.medium})</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span>Long >14 days ({durationStats.long})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resistance Alert Banner */}
      {selectedPathogen && selectedPathogen.resistance && (
        <div className="flex-shrink-0 bg-red-50 border-l-4 border-red-400 p-4" data-testid="resistance-alert">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Resistance Pattern Alert
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {selectedPathogen.resistance}
              </p>
              <div className="mt-2">
                <div className="text-sm text-red-800 font-medium mb-1">Clinical Caution Required</div>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Verify susceptibility testing</li>
                  <li>• Consider alternative agents</li>
                  <li>• Monitor treatment response</li>
                </ul>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                type="button"
                title="Dismiss alert"
                onClick={() => onPathogenSelect && onPathogenSelect(null)}
                className="inline-flex text-red-400 hover:text-red-600 focus:outline-none focus:text-red-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - List or Network View */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {view === 'list' ? (
            <PathogenList 
              pathogens={filteredPathogens}
              onSelectPathogen={handlePathogenSelect}
              selectedPathogen={selectedPathogen}
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
              gramFilter={gramFilter}
              onGramFilter={setGramFilter}
              severityFilter={severityFilter}
              onSeverityFilter={setSeverityFilter}
              durationFilter={durationFilter}
              onDurationFilter={setDurationFilter}
            />
          ) : (
            <SimpleNetworkView 
              pathogens={filteredPathogens}
              onSelectPathogen={handlePathogenSelect}
              selectedPathogen={selectedPathogen}
            />
          )}
        </div>

        {/* Right Panel - Details */}
        {selectedPathogen ? (
          <div className="w-1/3 border-l border-gray-200 bg-gray-50 overflow-hidden flex flex-col">
            {/* Panel Header with Clear Selection */}
            <div className="flex-shrink-0 p-3 border-b border-gray-200 bg-white flex justify-between items-center">
              <h3 className="font-medium text-gray-900">Selected Details</h3>
              <button
                onClick={() => onPathogenSelect && onPathogenSelect(null)}
                className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
              >
                Clear Selection
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div>
                <PathogenCard pathogen={selectedPathogen} />
              </div>
              <div className="p-4">
                <AntibioticList 
                  pathogen={selectedPathogen} 
                  antibiotics={selectedPathogenAntibiotics}
                  onSelectAntibiotic={handleAntibioticSelect}
                  selectedAntibiotic={selectedAntibiotic}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-1/3 border-l border-gray-200 bg-gray-50 overflow-hidden flex flex-col">
            <div data-testid="pathogen-card-empty" className="p-4 text-center text-gray-500">
              Select a pathogen to view details
            </div>
            <div data-testid="antibiotic-list-empty" className="p-4 text-center text-gray-500">
              No pathogen selected
            </div>
          </div>
        )}
      </div>

      {/* Footer with Summary Stats */}
      <div className="flex-shrink-0 px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>📊 {safePathogens.length} total pathogens</span>
          <span>🦠 {getGramStatusCount('positive')} gram-positive</span>
          <span>🔬 {getGramStatusCount('negative')} gram-negative</span>
          {hasActiveFilters && <span>🔍 {filteredPathogens.length} filtered results</span>}
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedPathogenExplorer;
