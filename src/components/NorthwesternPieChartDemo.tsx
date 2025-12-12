/**
 * Northwestern Pie Chart Demo Component
 *
 * Demonstrates the NorthwesternPieChart component with real antibiotic data
 * from EnhancedAntibioticData.ts. Shows responsive sizes and interactivity.
 *
 * Created by: Agent 2.1 - Phase 2 Northwestern Foundation
 * Purpose: Integration demonstration and testing
 */

import React, { useState, FC } from 'react';
import NorthwesternPieChart from './NorthwesternPieChart';
import enhancedAntibiotics from '../data/EnhancedAntibioticData';
import { Antibiotic } from '../types/medical.types';

type SizeOption = 'small' | 'medium' | 'large';

const NorthwesternPieChartDemo: FC = () => {
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<Antibiotic>(enhancedAntibiotics[0]);
  const [selectedSize, setSelectedSize] = useState<SizeOption>('medium');
  const [showLabels, setShowLabels] = useState<boolean>(false);
  const [interactive, setInteractive] = useState<boolean>(true);
  const [hoverInfo, setHoverInfo] = useState<string>('');

  const handleSegmentHover = (segment: string, coverage: number, clinicalContext: string) => {
    setHoverInfo(`${segment}: ${clinicalContext}`);
  };

  const handleSegmentClick = (segment: string, antibiotic: Antibiotic) => {
    console.log(`Clicked ${segment} for ${antibiotic.name}`);
    setHoverInfo(`Clicked: ${segment} for ${antibiotic.name}`);
  };

  return (
    <div className="northwestern-pie-chart-demo p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Northwestern Pie Chart Demo
        </h1>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-6 bg-white rounded-lg shadow">
          {/* Antibiotic Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antibiotic
            </label>
            <select
              value={selectedAntibiotic.id}
              onChange={(e) => {
                const antibiotic = enhancedAntibiotics.find(ab => ab.id === parseInt(e.target.value));
                if (antibiotic) setSelectedAntibiotic(antibiotic);
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {enhancedAntibiotics.slice(0, 10).map(antibiotic => (
                <option key={antibiotic.id} value={antibiotic.id}>
                  {antibiotic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as SizeOption)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="small">Small (120px)</option>
              <option value="medium">Medium (200px)</option>
              <option value="large">Large (280px)</option>
            </select>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="mr-2"
                />
                Show Labels
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={interactive}
                  onChange={(e) => setInteractive(e.target.checked)}
                  className="mr-2"
                />
                Interactive
              </label>
            </div>
          </div>

          {/* Hover Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hover Info
            </label>
            <div className="p-2 bg-gray-100 rounded-md min-h-[60px] text-sm">
              {hoverInfo || 'Hover over chart segments to see information'}
            </div>
          </div>
        </div>

        {/* Chart Display */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex justify-center">
            <NorthwesternPieChart
              antibiotic={selectedAntibiotic}
              size={selectedSize}
              showLabels={showLabels}
              interactive={interactive}
              onSegmentHover={handleSegmentHover}
              onSegmentClick={handleSegmentClick}
              className="border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        {/* Antibiotic Information */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {selectedAntibiotic.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Basic Information</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>Class:</strong> {selectedAntibiotic.class}</li>
                <li><strong>Route:</strong> {Array.isArray(selectedAntibiotic.route)
                  ? selectedAntibiotic.route.join(', ') : selectedAntibiotic.route}</li>
                <li><strong>Cell Wall Active:</strong> {selectedAntibiotic.cellWallActive ? 'Yes' : 'No'}</li>
                <li><strong>Generation:</strong> {selectedAntibiotic.generation}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Northwestern Spectrum</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {Object.entries(selectedAntibiotic.northwesternSpectrum || {}).map(([pathogen, coverage]) => (
                  <li key={pathogen}>
                    <strong>{pathogen}:</strong> {coverage}/2
                    <span className="ml-2 text-xs">
                      ({coverage === 0 ? 'No coverage' : coverage === 1 ? 'Some coverage' : 'Good coverage'})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm text-gray-600">{selectedAntibiotic.description}</p>
          </div>
        </div>

        {/* Multiple Chart Comparison */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Comparison View
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {enhancedAntibiotics.slice(0, 8).map(antibiotic => (
              <div key={antibiotic.id} className="text-center">
                <NorthwesternPieChart
                  antibiotic={antibiotic}
                  size="small"
                  interactive={true}
                  onSegmentClick={() => setSelectedAntibiotic(antibiotic)}
                  className="mx-auto mb-2 cursor-pointer hover:shadow-md transition-shadow"
                />
                <h4 className="text-sm font-medium text-gray-700">
                  {antibiotic.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {typeof antibiotic.route === 'string' ? antibiotic.route : Array.isArray(antibiotic.route) ? antibiotic.route[0] : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NorthwesternPieChartDemo;
