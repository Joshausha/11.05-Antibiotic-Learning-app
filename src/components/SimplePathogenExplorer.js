/**
 * SimplePathogenExplorer Component
 * Main component that brings together all pathogen exploration features
 * Sophomore-level React component with state management
 */

import React, { useState, useMemo } from 'react';
import { Grid, Network, List, Eye } from 'lucide-react';

import PathogenList from './PathogenList';
import PathogenCard from './PathogenCard';
import AntibioticList from './AntibioticList';
import SimpleNetworkView from './SimpleNetworkView';

import simplePathogens, { searchPathogens, getPathogensByGramStatus, getPathogensBySeverity } from '../data/SimplePathogenData';
import simpleAntibiotics, { getAntibioticById } from '../data/SimpleAntibioticData';
import pathogenAntibioticMap, { getAntibioticsForPathogen } from '../data/pathogenAntibioticMap';

const SimplePathogenExplorer = () => {
  // State for pathogen selection and filtering
  const [selectedPathogen, setSelectedPathogen] = useState(null);
  const [selectedAntibiotic, setSelectedAntibiotic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gramFilter, setGramFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'network'

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

    return pathogens;
  }, [searchTerm, gramFilter, severityFilter]);

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
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pathogen Explorer
            </h1>
            <p className="text-gray-600">
              Explore pathogens, antibiotics, and their relationships
            </p>
          </div>

          {/* View Mode Toggle */}
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
              List View
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
              Network View
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{simplePathogens.length}</div>
            <div className="text-sm text-gray-600">Total Pathogens</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{simpleAntibiotics.length}</div>
            <div className="text-sm text-gray-600">Antibiotics</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {getPathogensByGramStatus('positive').length}
            </div>
            <div className="text-sm text-gray-600">Gram Positive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {getPathogensByGramStatus('negative').length}
            </div>
            <div className="text-sm text-gray-600">Gram Negative</div>
          </div>
        </div>

        {/* Action Buttons */}
        {(selectedPathogen || searchTerm || gramFilter !== 'all' || severityFilter !== 'all') && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            {selectedPathogen && (
              <button
                onClick={clearSelections}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Clear Selection
              </button>
            )}
            {(searchTerm || gramFilter !== 'all' || severityFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

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

      {/* Selected Information Panel */}
      {selectedAntibiotic && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
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
          Simple Pathogen Explorer • {filteredPathogens.length} of {simplePathogens.length} pathogens shown
        </p>
        <p className="text-xs mt-1">
          Educational tool for learning pathogen-antibiotic relationships
        </p>
      </div>
    </div>
  );
};

export default SimplePathogenExplorer;