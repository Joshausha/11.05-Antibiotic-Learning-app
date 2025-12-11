/**
 * PathogenNetworkVisualizationCytoscape Component
 * Interactive network visualization using Cytoscape.js library
 * Provides comprehensive filtering and layout controls for pathogen-antibiotic relationships
 */

import React, { useState, useEffect, useRef, FC, ReactElement } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { nodes, edges } from '../data/PathogenRelationshipData';
import { cytoscapeStylesheet } from '../styles/cytoscapeStylesheet';
import { formatAllNodeLabels } from '../utils/textFormatting';
import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react';

// Types
interface CytoscapeElement {
  data: {
    id: string;
    label?: string;
    source?: string;
    target?: string;
    type?: string;
    gramStain?: string;
    class?: string;
    [key: string]: any;
  };
}

interface CytoscapeLayout {
  name: 'cose' | 'concentric' | 'grid' | 'circle' | 'dagre';
  animate?: boolean;
  animationDuration?: number;
}

interface GramStainFilters {
  [key: string]: boolean;
}

interface AntibioticClassFilters {
  [key: string]: boolean;
}

interface EdgeTypeFilters {
  [key: string]: boolean;
}

interface AllFilters {
  showPathogens: boolean;
  showAntibiotics: boolean;
  gramStain: GramStainFilters;
  antibioticClasses: AntibioticClassFilters;
  edgeTypes: EdgeTypeFilters;
}

interface CytoscapeInstance {
  elements: () => any;
  nodes: (selector: string) => any;
  edges: (selector?: string | ((edge: any) => boolean)) => any;
  on: (event: string, handler: (evt: any) => void) => void;
}

interface PathogenNetworkVisualizationCytoscapeProps {
  [key: string]: any;
}

const PathogenNetworkVisualizationCytoscape: FC<PathogenNetworkVisualizationCytoscapeProps> = () => {
  const [layout, setLayout] = useState<CytoscapeLayout>({ name: 'cose' });
  const [elements, setElements] = useState<CytoscapeElement[]>([]);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const cyRef = useRef<CytoscapeInstance | null>(null);

  // Filter states
  const [filters, setFilters] = useState<AllFilters>({
    showPathogens: true,
    showAntibiotics: true,
    gramStain: {
      positive: true,
      negative: true,
      atypical: true,
      'acid-fast': true,
      virus: true,
      mixed: true,
    },
    antibioticClasses: {
      Penicillins: true,
      Cephalosporins: true,
      Carbapenems: true,
      Aminoglycosides: true,
      Fluoroquinolones: true,
      Macrolides: true,
      Glycopeptides: true,
      Lincosamides: true,
      Oxazolidinones: true,
      Nitroimidazoles: true,
      Sulfonamides: true,
      Tetracyclines: true,
      Lipopeptides: true,
      Antivirals: true,
    },
    edgeTypes: {
      susceptible: true,
      resistant: true,
      pathogenRelationships: true,
    },
  });

  useEffect(() => {
    // Format node labels with intelligent syllable-based line breaking
    const formattedNodes = formatAllNodeLabels(nodes);

    // Combine formatted nodes and edges for Cytoscape
    const allElements = [...formattedNodes, ...edges];
    console.log('Cytoscape elements loaded:', allElements.length, 'elements');
    console.log('Nodes:', nodes.length, 'Edges:', edges.length);
    setElements(allElements);
  }, []);

  // Apply filters to Cytoscape
  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;

      // Show all elements first
      cy.elements().show();

      // Filter pathogen nodes
      if (!filters.showPathogens) {
        cy.nodes('[type = "pathogen"]').hide();
      } else {
        // Filter by gram stain
        Object.keys(filters.gramStain).forEach((stain) => {
          if (!filters.gramStain[stain]) {
            cy.nodes(`[gramStain = "${stain}"]`).hide();
          }
        });
      }

      // Filter antibiotic nodes
      if (!filters.showAntibiotics) {
        cy.nodes('[type = "antibiotic"]').hide();
      } else {
        // Filter by antibiotic class
        Object.keys(filters.antibioticClasses).forEach((className) => {
          if (!filters.antibioticClasses[className]) {
            cy.nodes(`[class = "${className}"]`).hide();
          }
        });
      }

      // Filter edges
      if (!filters.edgeTypes.susceptible) {
        cy.edges('[label = "susceptible"]').hide();
      }
      if (!filters.edgeTypes.resistant) {
        cy.edges('[label = "resistant"]').hide();
      }
      if (!filters.edgeTypes.pathogenRelationships) {
        cy.edges()
          .filter((edge: any) => {
            const label = edge.data('label');
            return label !== 'susceptible' && label !== 'resistant';
          })
          .hide();
      }

      // Hide edges connected to hidden nodes
      cy.nodes(':hidden').connectedEdges().hide();
    }
  }, [filters]);

  const handleLayoutChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setLayout({ name: event.target.value as any });
  };

  const handleFilterChange = (
    category: string,
    subcategory: string | null,
    value: boolean
  ): void => {
    setFilters((prev) => {
      if (subcategory) {
        return {
          ...prev,
          [category]: {
            ...prev[category as keyof AllFilters],
            [subcategory]: value,
          },
        };
      } else {
        return {
          ...prev,
          [category]: value,
        };
      }
    });
  };

  const resetFilters = (): void => {
    setFilters({
      showPathogens: true,
      showAntibiotics: true,
      gramStain: {
        positive: true,
        negative: true,
        atypical: true,
        'acid-fast': true,
        virus: true,
        mixed: true,
      },
      antibioticClasses: {
        Penicillins: true,
        Cephalosporins: true,
        Carbapenems: true,
        Aminoglycosides: true,
        Fluoroquinolones: true,
        Macrolides: true,
        Glycopeptides: true,
        Lincosamides: true,
        Oxazolidinones: true,
        Nitroimidazoles: true,
        Sulfonamides: true,
        Tetracyclines: true,
        Lipopeptides: true,
        Antivirals: true,
      },
      edgeTypes: {
        susceptible: true,
        resistant: true,
        pathogenRelationships: true,
      },
    });
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Keyboard accessibility - ESC to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSidebarOpen]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Minimal Header - 40px */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gray-100 border-b border-gray-300 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Title */}
          <h3 className="text-base font-bold">Pathogen-Antibiotic Network</h3>
        </div>

        {/* Quick Layout Selector */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Layout:</span>
          <select
            onChange={handleLayoutChange}
            defaultValue="cose"
            className="p-1 text-xs border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select network layout"
          >
            <option value="cose">Force-Directed</option>
            <option value="concentric">Concentric</option>
            <option value="grid">Grid</option>
            <option value="circle">Circle</option>
            <option value="dagre">Hierarchical</option>
          </select>
        </div>
      </div>

      {/* Backdrop Overlay - Semi-transparent when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Floating Sidebar - 280px width */}
      <div
        className={`
          fixed top-10 left-0 bottom-0 w-70 bg-white border-r border-gray-300 shadow-xl
          transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ width: '280px' }}
        aria-hidden={!isSidebarOpen}
      >
        <div className="p-4">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300">
            <h4 className="text-lg font-bold">Controls</h4>
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Filters Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-semibold text-sm">Filters</h5>
              <button
                onClick={resetFilters}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
              >
                Reset All
              </button>
            </div>

            {/* Node Type Filters */}
            <div className="mb-3">
              <h6 className="font-medium text-xs mb-2 text-gray-700">Node Types</h6>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.showPathogens}
                  onChange={(e) => handleFilterChange('showPathogens', null, e.target.checked)}
                  className="rounded"
                />
                Pathogens
              </label>
              <label className="flex items-center gap-2 text-sm mt-1">
                <input
                  type="checkbox"
                  checked={filters.showAntibiotics}
                  onChange={(e) =>
                    handleFilterChange('showAntibiotics', null, e.target.checked)
                  }
                  className="rounded"
                />
                Antibiotics
              </label>
            </div>

            {/* Gram Stain Filter */}
            <div className="mb-3">
              <h6 className="font-medium text-xs mb-2 text-gray-700">Gram Stain</h6>
              {Object.keys(filters.gramStain).map((stain) => (
                <label key={stain} className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={filters.gramStain[stain]}
                    onChange={(e) =>
                      handleFilterChange('gramStain', stain, e.target.checked)
                    }
                    disabled={!filters.showPathogens}
                    className="rounded"
                  />
                  {stain.charAt(0).toUpperCase() + stain.slice(1)}
                </label>
              ))}
            </div>

            {/* Edge Type Filters */}
            <div className="mb-3">
              <h6 className="font-medium text-xs mb-2 text-gray-700">Relationships</h6>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={filters.edgeTypes.susceptible}
                  onChange={(e) =>
                    handleFilterChange('edgeTypes', 'susceptible', e.target.checked)
                  }
                  className="rounded"
                />
                Susceptible (Green)
              </label>
              <label className="flex items-center gap-2 text-xs mt-1">
                <input
                  type="checkbox"
                  checked={filters.edgeTypes.resistant}
                  onChange={(e) =>
                    handleFilterChange('edgeTypes', 'resistant', e.target.checked)
                  }
                  className="rounded"
                />
                Resistant (Red)
              </label>
              <label className="flex items-center gap-2 text-xs mt-1">
                <input
                  type="checkbox"
                  checked={filters.edgeTypes.pathogenRelationships}
                  onChange={(e) =>
                    handleFilterChange(
                      'edgeTypes',
                      'pathogenRelationships',
                      e.target.checked
                    )
                  }
                  className="rounded"
                />
                Pathogen Relationships
              </label>
            </div>

            {/* Antibiotic Classes - Scrollable */}
            <div className="mb-3">
              <h6 className="font-medium text-xs mb-2 text-gray-700">
                Antibiotic Classes
              </h6>
              <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded">
                {Object.keys(filters.antibioticClasses).map((className) => (
                  <label key={className} className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={filters.antibioticClasses[className]}
                      onChange={(e) =>
                        handleFilterChange(
                          'antibioticClasses',
                          className,
                          e.target.checked
                        )
                      }
                      disabled={!filters.showAntibiotics}
                      className="rounded"
                    />
                    {className}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Legend Section - Collapsible */}
          <div className="border-t border-gray-300 pt-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowLegend(!showLegend)}
            >
              <h5 className="font-semibold text-sm">Legend</h5>
              {showLegend ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {showLegend && (
              <div className="mt-3 text-xs space-y-3">
                {/* Node Types */}
                <div>
                  <h6 className="font-medium mb-2 text-gray-700">Node Types</h6>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-purple-700 border-2 border-gray-800"></div>
                    <span>Pathogens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-blue-500 border-2 border-blue-700"></div>
                    <span>Antibiotics</span>
                  </div>
                </div>

                {/* Gram Stain Colors */}
                <div>
                  <h6 className="font-medium mb-2 text-gray-700">Gram Stain</h6>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: '#6a0dad' }}
                      ></div>
                      <span>Gram-positive</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: '#d9534f' }}
                      ></div>
                      <span>Gram-negative</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: '#5bc0de' }}
                      ></div>
                      <span>Atypical</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: '#f0ad4e' }}
                      ></div>
                      <span>Acid-fast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: '#5cb85c' }}
                      ></div>
                      <span>Virus</span>
                    </div>
                  </div>
                </div>

                {/* Relationships */}
                <div>
                  <h6 className="font-medium mb-2 text-gray-700">Relationships</h6>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-green-600"></div>
                      <span>Susceptible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-red-500 border-dashed border-t-2 border-red-500"></div>
                      <span>Resistant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-blue-400"></div>
                      <span>Pathogen relationships</span>
                    </div>
                  </div>
                </div>

                {/* Antibiotic Classes Sample */}
                <div>
                  <h6 className="font-medium mb-2 text-gray-700">
                    Antibiotic Classes (Sample)
                  </h6>
                  <div className="grid grid-cols-1 gap-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: '#16a085' }}
                      ></div>
                      <span>Penicillins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: '#27ae60' }}
                      ></div>
                      <span>Cephalosporins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: '#c0392b' }}
                      ></div>
                      <span>Glycopeptides</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: '#e74c3c' }}
                      ></div>
                      <span>Fluoroquinolones</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-Screen Cytoscape Visualization */}
      <div className="absolute inset-0 top-10">
        {elements.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-gray-500 mb-2">Loading network data...</div>
              <div className="text-sm text-gray-400">
                {nodes.length} nodes, {edges.length} edges
              </div>
            </div>
          </div>
        ) : (
          <CytoscapeComponent
            elements={CytoscapeComponent.normalizeElements(elements)}
            stylesheet={cytoscapeStylesheet}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f9fafb',
            }}
            layout={layout}
            cy={(cy: CytoscapeInstance) => {
              cyRef.current = cy;
              console.log('Cytoscape instance initialized');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PathogenNetworkVisualizationCytoscape;
