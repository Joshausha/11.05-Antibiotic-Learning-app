/**
 * Network Visualization Container - Multi-Mode Interface
 *
 * Tabbed interface supporting multiple visualization approaches:
 * - Interactive Network: D3 force-directed graph with organic layout
 * - Filter-Driven View: Focused filtering interface for scenario-based exploration
 * - Northwestern Charts: 8-segment coverage visualization
 *
 * Created: Phase 2 Plan 4 - Northwestern Integration & Multi-Mode UI
 * Purpose: Support different learning approaches per user preference
 */

import React, { useState } from 'react';
import { Pathogen, Antibiotic } from '../../types/medical.types';
import { VisualizationMode } from '../../types/network-ui.types';
import D3NetworkGraph from './D3NetworkGraph';
import NorthwesternSpatialLayout from '../NorthwesternSpatialLayout';

interface NetworkVisualizationContainerProps {
  pathogens: Pathogen[];
  antibiotics: Antibiotic[];
  width?: number;
  height?: number;
}

/**
 * Multi-mode visualization container with tabbed interface
 *
 * Supports three visualization modes:
 * 1. network - Interactive force-directed graph
 * 2. filtered - Filter-driven exploration (uses D3NetworkGraph with filters prominent)
 * 3. northwestern - 8-segment pie chart coverage visualization
 */
export const NetworkVisualizationContainer: React.FC<NetworkVisualizationContainerProps> = ({
  pathogens,
  antibiotics,
  width = 800,
  height = 600
}) => {
  const [mode, setMode] = useState<VisualizationMode>('network');

  return (
    <div className="visualization-container">
      {/* Tab Bar */}
      <div className="tab-bar border-b border-gray-200 mb-4">
        <div className="flex space-x-1">
          <button
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              mode === 'network'
                ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setMode('network')}
          >
            Interactive Network
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              mode === 'filtered'
                ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setMode('filtered')}
          >
            Filter-Driven View
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              mode === 'northwestern'
                ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setMode('northwestern')}
          >
            Northwestern Charts
          </button>
        </div>
      </div>

      {/* Visualization Content - preserve state with display:none instead of unmounting */}
      <div className="visualization-content">
        {/* Mode 1: Interactive Network */}
        <div style={{ display: mode === 'network' ? 'block' : 'none' }}>
          <div className="mode-description mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Interactive Network:</strong> Force-directed graph showing organic relationships between antibiotics and pathogens.
              Hover over nodes for details, use filters to explore coverage patterns.
            </p>
          </div>
          <D3NetworkGraph
            pathogens={pathogens}
            antibiotics={antibiotics}
            width={width}
            height={height}
          />
        </div>

        {/* Mode 2: Filter-Driven View */}
        <div style={{ display: mode === 'filtered' ? 'block' : 'none' }}>
          <div className="mode-description mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-900">
              <strong>Filter-Driven View:</strong> Scenario-based exploration with prominent filtering controls.
              Ideal for clinical decision-making and coverage analysis by pathogen characteristics.
            </p>
          </div>
          <D3NetworkGraph
            pathogens={pathogens}
            antibiotics={antibiotics}
            width={width}
            height={height}
          />
        </div>

        {/* Mode 3: Northwestern Charts */}
        <div style={{ display: mode === 'northwestern' ? 'block' : 'none' }}>
          <div className="mode-description mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-900">
              <strong>Northwestern Charts:</strong> 8-segment coverage visualization showing antibiotic spectrum
              across key pathogen categories (MRSA, VRE, anaerobes, atypicals, pseudomonas, gram-negative, MSSA, enterococcus).
              Organized by drug class with spatial grouping.
            </p>
          </div>
          <NorthwesternSpatialLayout
            antibiotics={antibiotics}
            viewMode="comparison"
            groupingMode="drugClass"
          />
        </div>
      </div>
    </div>
  );
};

export default NetworkVisualizationContainer;
