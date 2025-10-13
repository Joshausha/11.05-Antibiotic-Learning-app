/**
 * Cytoscape Browser Verification Component
 *
 * Purpose: Verify that react-cytoscapejs works correctly in the browser/webpack environment.
 * This component can be temporarily added to the app to verify the integration.
 *
 * Usage: Import and render this component in App.js to test Cytoscape functionality
 */

import React, { useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

const CytoscapeVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState({
    imported: false,
    rendered: false,
    interactive: false
  });

  // Simple test network
  const testElements = [
    { data: { id: 'node1', label: 'Node 1' } },
    { data: { id: 'node2', label: 'Node 2' } },
    { data: { id: 'node3', label: 'Node 3' } },
    { data: { id: 'edge1', source: 'node1', target: 'node2', label: 'Edge 1-2' } },
    { data: { id: 'edge2', source: 'node2', target: 'node3', label: 'Edge 2-3' } }
  ];

  // Cytoscape layout configuration
  const layout = {
    name: 'circle',
    animate: true,
    animationDuration: 500
  };

  // Cytoscape stylesheet
  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': '#3b82f6',
        'label': 'data(label)',
        'color': '#1e40af',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '12px',
        'width': '50px',
        'height': '50px'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#94a3b8',
        'target-arrow-color': '#94a3b8',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'font-size': '10px',
        'color': '#64748b'
      }
    },
    {
      selector: 'node:selected',
      style: {
        'background-color': '#ef4444',
        'border-width': 3,
        'border-color': '#dc2626'
      }
    }
  ];

  // Handle Cytoscape mount
  const handleCytoscapeMount = (cy) => {
    console.log('✓ Cytoscape instance mounted successfully');
    setVerificationStatus(prev => ({
      ...prev,
      imported: true,
      rendered: true
    }));

    // Add interaction handler
    cy.on('tap', 'node', function(evt) {
      const node = evt.target;
      console.log('✓ Node clicked:', node.id());
      setVerificationStatus(prev => ({
        ...prev,
        interactive: true
      }));
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Cytoscape.js Verification Component
      </h2>

      {/* Verification Status */}
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Verification Status:</h3>
        <ul className="space-y-1">
          <li className={verificationStatus.imported ? 'text-green-600' : 'text-gray-400'}>
            {verificationStatus.imported ? '✓' : '○'} react-cytoscapejs imported successfully
          </li>
          <li className={verificationStatus.rendered ? 'text-green-600' : 'text-gray-400'}>
            {verificationStatus.rendered ? '✓' : '○'} Cytoscape component rendered
          </li>
          <li className={verificationStatus.interactive ? 'text-green-600' : 'text-gray-400'}>
            {verificationStatus.interactive ? '✓' : '○'} Interactive (click a node to verify)
          </li>
        </ul>
      </div>

      {/* Instructions */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          <strong>Instructions:</strong> Click on any node in the graph below to verify interactivity.
          All three checkmarks should turn green for complete verification.
        </p>
      </div>

      {/* Cytoscape Visualization */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        <CytoscapeComponent
          elements={testElements}
          style={{ width: '100%', height: '400px' }}
          layout={layout}
          stylesheet={stylesheet}
          cy={handleCytoscapeMount}
        />
      </div>

      {/* Success Message */}
      {verificationStatus.imported && verificationStatus.rendered && verificationStatus.interactive && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800 font-semibold">
            ✓ All verification checks passed! Cytoscape.js is ready for use.
          </p>
        </div>
      )}

      {/* Technical Details */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <h4 className="font-semibold mb-2">Technical Details:</h4>
        <ul className="space-y-1 text-gray-700">
          <li>• <strong>Package:</strong> react-cytoscapejs v2.0.0</li>
          <li>• <strong>Core Library:</strong> cytoscape v3.33.1</li>
          <li>• <strong>TypeScript Definitions:</strong> @types/cytoscape v3.21.9</li>
          <li>• <strong>React Version:</strong> 18.2.0 (compatible)</li>
          <li>• <strong>Webpack:</strong> 5.64.4 (compatible)</li>
        </ul>
      </div>
    </div>
  );
};

export default CytoscapeVerification;
