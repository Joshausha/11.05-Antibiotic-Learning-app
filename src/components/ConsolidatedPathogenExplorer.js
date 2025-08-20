/**
 * ConsolidatedPathogenExplorer Component
 * Consolidates PathogenExplorer and SimplePathogenExplorer into single interface
 * Provides both simple and advanced pathogen exploration features
 */

import React, { useState, useMemo } from 'react';
import { Grid, Network, List, Eye, Microscope, Search, RotateCcw, Clock, Filter, AlertTriangle, ShieldAlert, ShieldOff } from 'lucide-react';

// Import components from SimplePathogenExplorer
import PathogenList from './PathogenList';
import PathogenCard from './PathogenCard';
import AntibioticList from './AntibioticList';
import SimpleNetworkView from './SimpleNetworkView';

// Import data from SimplePathogenExplorer
import simplePathogens, { searchPathogens, getPathogensByGramStatus, getPathogensBySeverity } from '../data/SimplePathogenData';
import simpleAntibiotics, { getAntibioticById } from '../data/SimpleAntibioticData';
import pathogenAntibioticMap, { getAntibioticsForPathogen } from '../data/pathogenAntibioticMap';

// Import duration functionality
import { DurationLegend } from './DurationIndicator';
import { 
  enhancedPathogenAntibioticMap, 
  getDurationStatistics, 
  searchConditionsByDuration 
} from '../data/durationMappings';

const ConsolidatedPathogenExplorer = ({ 
  pathogenData = null,
  onSelectCondition = () => {}
}) => {
  // State for pathogen selection and filtering
  const [selectedPathogen, setSelectedPathogen] = useState(null);
  const [selectedAntibiotic, setSelectedAntibiotic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gramFilter, setGramFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all'); // 'all', 'short', 'medium', 'long', 'complex'
  const [viewMode, setViewMode] = useState('list'); // 'list', 'network'
  const [explorerMode, setExplorerMode] = useState('simple'); // 'simple', 'advanced'

  // Filter pathogens based on search and filters
  const filteredPathogens = useMemo(() => {
    let pathogens = simplePathogens;

    // Apply search filter
    if (searchTerm) {
      pathogens = searchPathogens(searchTerm);
    }

    // Apply gram status filter
    if (gramFilter !== 'all') {
      pathogens = pathogens.filter(pathogen => pathogen.gramStatus === gramFilter);
    }

    // Apply severity filter
    if (severityFilter !== 'all') {
      pathogens = pathogens.filter(pathogen => pathogen.severity === severityFilter);
    }

    // Apply duration filter
    if (durationFilter !== 'all') {
      pathogens = pathogens.filter(pathogen => {
        const pathogenKey = pathogen.id?.toString();
        const enhancedData = enhancedPathogenAntibioticMap[pathogenKey];
        
        if (!enhancedData || !enhancedData.allDurations) return false;
        
        // Check if pathogen has any durations matching the filter
        return enhancedData.allDurations.some(duration => {
          if (durationFilter === 'complex') {
            return duration.parsedDuration?.isComplex;
          }
          return duration.parsedDuration?.category === durationFilter;
        });
      });
    }

    return pathogens;
  }, [searchTerm, gramFilter, severityFilter, durationFilter]);

  // Get antibiotics for selected pathogen
  const selectedPathogenAntibiotics = useMemo(() => {
    if (!selectedPathogen) return [];

    const antibiotics = getAntibioticsForPathogen(selectedPathogen.id);
    
    // Add full antibiotic details
    return antibiotics.map(antibiotic => {
      const fullAntibiotic = getAntibioticById(antibiotic.antibioticId);
      return {
        ...antibiotic,
        ...fullAntibiotic
      };
    });
  }, [selectedPathogen]);

  // Handle pathogen selection
  const handlePathogenSelect = (pathogen) => {
    setSelectedPathogen(pathogen);
    setSelectedAntibiotic(null); // Clear antibiotic selection when changing pathogen
  };

  // Handle antibiotic selection
  const handleAntibioticSelect = (antibiotic) => {
    setSelectedAntibiotic(antibiotic);
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedPathogen(null);
    setSelectedAntibiotic(null);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setGramFilter('all');
    setSeverityFilter('all');
    setDurationFilter('all');
  };

  // Duration statistics for display
  const durationStats = useMemo(() => {
    return getDurationStatistics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Microscope className="text-blue-600" size={24} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pathogen & Antibiotic Explorer
              </h1>
              <p className="text-gray-600">
                Explore pathogens, antibiotics, and their relationships
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode('network')}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  viewMode === 'network'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Network className="w-4 h-4" />
                Network
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{simplePathogens.length}</div>
            <div className="text-sm text-gray-600">Total Pathogens</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">{simpleAntibiotics.length}</div>
            <div className="text-sm text-gray-600">Antibiotics</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-600">
              {getPathogensByGramStatus('positive').length}
            </div>
            <div className="text-sm text-gray-600">Gram Positive</div>
          </div>
          <div className="text-center p-3 bg-pink-50 rounded-lg">
            <div className="text-xl font-bold text-pink-600">
              {getPathogensByGramStatus('negative').length}
            </div>
            <div className="text-sm text-gray-600">Gram Negative</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-xl font-bold text-orange-600 flex items-center justify-center gap-1">
              <Clock className="w-5 h-5" />
              {durationStats.totalConditions}
            </div>
            <div className="text-sm text-gray-600">Duration Guidelines</div>
          </div>
        </div>

        {/* Duration Statistics */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Treatment Duration Overview</span>
          </div>
          <DurationLegend />
          <div className="mt-2 text-xs text-gray-500 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>Simple: {durationStats.durationTypes.simple} conditions</div>
            <div>Complex: {durationStats.durationTypes.complex} conditions</div>
            <div>Average: {durationStats.averageDurationDays} days</div>
            <div>Range: {durationStats.durationRange.min}-{durationStats.durationRange.max} days</div>
          </div>
        </div>

        {/* Quick Actions */}
        {(selectedPathogen || searchTerm || gramFilter !== 'all' || severityFilter !== 'all' || durationFilter !== 'all') && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            {selectedPathogen && (
              <button
                onClick={clearSelections}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded-lg hover:bg-gray-50"
              >
                <RotateCcw size={14} />
                Clear Selection
              </button>
            )}
            {(searchTerm || gramFilter !== 'all' || severityFilter !== 'all' || durationFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border rounded-lg hover:bg-gray-50"
              >
                <Filter size={14} />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Resistance Alert Banner */}
      {selectedPathogen && selectedPathogen.resistance && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-1">
              <ShieldAlert className="w-6 h-6 text-red-600" />
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-red-800">
                  🛡️ Resistance Pattern Alert - {selectedPathogen.commonName}
                </h3>
                <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full border border-red-200">
                  Clinical Caution Required
                </span>
              </div>
              <p className="text-sm text-gray-800 mb-2">
                <span className="font-medium text-red-700">Resistance Pattern:</span> {selectedPathogen.resistance}
              </p>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-orange-700">
                  <ShieldOff className="w-3 h-3" />
                  <span>Verify susceptibility testing</span>
                </div>
                <div className="flex items-center gap-1 text-red-700">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Consider alternative agents</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>Monitor treatment response</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedPathogen(null)}
              className="text-gray-400 hover:text-gray-600 text-sm px-2 py-1 rounded hover:bg-gray-100"
              title="Dismiss alert"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Pathogen List */}
          <div className="lg:col-span-1">
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
          </div>

          {/* Pathogen Details */}
          <div className="lg:col-span-1">
            <PathogenCard
              pathogen={selectedPathogen}
              onClose={() => setSelectedPathogen(null)}
            />
          </div>

          {/* Antibiotic List */}
          <div className="lg:col-span-1 xl:col-span-1">
            <AntibioticList
              pathogen={selectedPathogen}
              antibiotics={selectedPathogenAntibiotics}
              onSelectAntibiotic={handleAntibioticSelect}
              selectedAntibiotic={selectedAntibiotic}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Network View */}
          <div className="xl:col-span-2">
            <SimpleNetworkView
              pathogens={filteredPathogens}
              selectedPathogen={selectedPathogen}
              onSelectPathogen={handlePathogenSelect}
              relationships={pathogenAntibioticMap}
            />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <PathogenCard
              pathogen={selectedPathogen}
              onClose={() => setSelectedPathogen(null)}
            />
            
            {selectedPathogen && (
              <AntibioticList
                pathogen={selectedPathogen}
                antibiotics={selectedPathogenAntibiotics}
                onSelectAntibiotic={handleAntibioticSelect}
                selectedAntibiotic={selectedAntibiotic}
              />
            )}
          </div>
        </div>
      )}

      {/* Selected Antibiotic Information Panel */}
      {selectedAntibiotic && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Selected Antibiotic: {selectedAntibiotic.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Class:</span>
                  <p className="font-medium">{selectedAntibiotic.class}</p>
                </div>
                <div>
                  <span className="text-gray-500">Mechanism:</span>
                  <p className="font-medium">{selectedAntibiotic.mechanism}</p>
                </div>
                <div>
                  <span className="text-gray-500">Route:</span>
                  <p className="font-medium">{selectedAntibiotic.route}</p>
                </div>
              </div>
              {selectedAntibiotic.description && (
                <p className="text-gray-600 mt-3">{selectedAntibiotic.description}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedAntibiotic(null)}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-600">
        <p>
          Consolidated Pathogen & Antibiotic Explorer • {filteredPathogens.length} of {simplePathogens.length} pathogens shown
        </p>
        <p className="text-xs mt-1">
          Educational tool for learning pathogen-antibiotic relationships
        </p>
      </div>
    </div>
  );
};

export default ConsolidatedPathogenExplorer;