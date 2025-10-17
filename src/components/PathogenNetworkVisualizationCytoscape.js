import React, { useState, useEffect } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { nodes, edges } from '../data/PathogenRelationshipData';
import { cytoscapeStylesheet } from '../styles/cytoscapeStylesheet';

const PathogenNetworkVisualizationCytoscape = () => {
  const [layout, setLayout] = useState({ name: 'cose' });
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // Combine nodes and edges for Cytoscape
    setElements([...nodes, ...edges]);
  }, []);

  const handleLayoutChange = (event) => {
    setLayout({ name: event.target.value });
  };

  // TODO: Implement filter logic

  return (
    <div className="w-full" style={{ height: '600px' }}>
      {/* TODO: Build Control Panel UI */}
      <div className="p-4 bg-gray-100 border-b border-gray-300">
        <h3 className="text-lg font-bold">Cytoscape Controls</h3>
        <div className="mt-2">
          <label htmlFor="layout-select" className="mr-2">Layout:</label>
          <select id="layout-select" onChange={handleLayoutChange} defaultValue="cose" className="p-1 border rounded">
            <option value="cose">Force-Directed (CoSE)</option>
            <option value="concentric">Concentric</option>
            <option value="grid">Grid</option>
            <option value="circle">Circle</option>
            <option value="dagre">Hierarchical (Dagre)</option>
          </select>
        </div>
        {/* Placeholder for filters */}
        <div className="mt-4">
            <h4 className="font-semibold">Filters (Placeholder)</h4>
            {/* Filters will be implemented here */}
        </div>
      </div>

      <CytoscapeComponent
        elements={CytoscapeComponent.normalizeElements(elements)}
        stylesheet={cytoscapeStylesheet}
        style={{ width: '100%', height: '480px' }} // Fixed height for Cytoscape to render properly
        layout={layout}
        // TODO: Add event handlers (onselect, onmouseover)
      />
    </div>
  );
};

export default PathogenNetworkVisualizationCytoscape;
