/**
 * PathogenNetworkPanel Component
 * Renders the pathogen network visualization with layout switching controls
 * Extracted from VisualizationsTab.tsx during Phase 4 refactoring
 */

import React, { memo, FC } from 'react';
import { Network } from 'lucide-react';
import ErrorBoundary from '../ErrorBoundary';
import PathogenNetworkVisualization from '../PathogenNetworkVisualization';
import PathogenNetworkVisualizationCytoscape from '../PathogenNetworkVisualizationCytoscape';
import NetworkVisualizationD3 from '../NetworkVisualizationD3';
import NorthwesternSpatialLayout from '../NorthwesternSpatialLayout';
import { networkLayoutOptions, spatialViewOptions } from '../../config/visualizationConfig';
import { Antibiotic, Pathogen } from '../../types/medical.types';

interface PathogenNetworkPanelProps {
  networkLayoutMode?: string;
  setNetworkLayoutMode?: (mode: string) => void;
  spatialViewMode?: string;
  setSpatialViewMode?: (mode: string) => void;
  antibioticData?: {
    antibiotics?: Antibiotic[];
    [key: string]: any;
  };
  onSelectPathogen?: (pathogen: Pathogen) => void;
  onNetworkNodeClick?: (node: any) => void;
  emergencyMode?: boolean;
  animationEnabled?: boolean;
  animationManager?: any;
  createSelectionAnimation?: (element: Element | null, type: string, options: any) => any;
}

const PathogenNetworkPanel: FC<PathogenNetworkPanelProps> = memo(({
  networkLayoutMode = 'd3',
  setNetworkLayoutMode = () => {},
  spatialViewMode = 'clinical',
  setSpatialViewMode = () => {},
  antibioticData,
  onSelectPathogen,
  onNetworkNodeClick,
  emergencyMode = false,
  animationEnabled = false,
  animationManager,
  createSelectionAnimation
}) => {
  // Handle antibiotic selection from spatial layout with animation
  const handleSpatialAntibioticSelect = (antibiotic: Antibiotic) => {
    console.log('Selected antibiotic from spatial layout:', antibiotic);

    if (animationEnabled && animationManager && createSelectionAnimation) {
      const element = document.querySelector(`[data-antibiotic-id="${antibiotic.id}"]`);
      const selectionAnimation = createSelectionAnimation(
        element,
        'antibiotic',
        { educationLevel: 'resident', emergencyMode }
      );

      if (selectionAnimation) {
        animationManager.animate(
          selectionAnimation.element,
          selectionAnimation.config
        ).catch((err: Error) => console.warn(err));
      }
    }
  };

  // Handle group selection from spatial layout with animation
  const handleGroupSelect = (groupKey: string, antibiotics: Antibiotic[]) => {
    console.log('Selected group from spatial layout:', groupKey, antibiotics);

    if (animationEnabled && animationManager && createSelectionAnimation) {
      const groupElements = document.querySelectorAll(`[data-spatial-group="${groupKey}"]`);
      groupElements.forEach(element => {
        const groupAnimation = createSelectionAnimation(
          element,
          'group',
          { educationLevel: 'resident', emergencyMode }
        );

        if (groupAnimation) {
          animationManager.animate(
            groupAnimation.element,
            groupAnimation.config
          ).catch((err: Error) => console.warn(err));
        }
      });
    }
  };

  // Get layout description text
  const getLayoutDescription = (): string => {
    switch (networkLayoutMode) {
      case 'd3':
        return 'Force-directed layout showing pathogen relationships through dynamic positioning';
      case 'd3-pro':
        return 'Professional D3.js multi-layout visualization: Switch between Force-Directed (similarity clustering), Hierarchical (clinical severity), and Circular (Gram stain classification) layouts. Click nodes for details and zoom/pan with mouse.';
      case 'cytoscape':
        return 'Cytoscape-powered network visualization.';
      case 'spatial':
        return `Northwestern spatial layout organizing ${antibioticData?.antibiotics?.length || 0} antibiotics using ${spatialViewMode} methodology with clinical workflow optimization`;
      default:
        return '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Network size={24} className="text-indigo-600" />
          Pathogen Relationship Network
        </h3>

        {/* Layout Switching Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Layout:</span>
            <select
              value={networkLayoutMode}
              onChange={(e) => setNetworkLayoutMode(e.target.value)}
              className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {networkLayoutOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {networkLayoutMode === 'spatial' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <select
                value={spatialViewMode}
                onChange={(e) => setSpatialViewMode(e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {spatialViewOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <ErrorBoundary>
        {networkLayoutMode === 'd3' ? (
          <PathogenNetworkVisualization
            selectedPathogen={null}
            onSelectPathogen={onSelectPathogen}
            onShowPathDetails={(pathogen) => {
              if (onSelectPathogen) onSelectPathogen(pathogen);
            }}
          />
        ) : networkLayoutMode === 'd3-pro' ? (
          <NetworkVisualizationD3
            layoutType="force"
            showMetrics={true}
            width={1000}
            height={600}
            onNodeClick={onNetworkNodeClick}
          />
        ) : networkLayoutMode === 'cytoscape' ? (
          <PathogenNetworkVisualizationCytoscape />
        ) : (
          <NorthwesternSpatialLayout
            antibiotics={antibioticData?.antibiotics || []}
            viewMode={spatialViewMode}
            showConnections={true}
            onAntibioticSelect={handleSpatialAntibioticSelect}
            onGroupSelect={handleGroupSelect}
            emergencyMode={emergencyMode}
            clinicalContext="education"
          />
        )}
      </ErrorBoundary>

      {/* Layout Information */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          {getLayoutDescription()}
        </div>
      </div>
    </div>
  );
});

PathogenNetworkPanel.displayName = 'PathogenNetworkPanel';

export default PathogenNetworkPanel;
