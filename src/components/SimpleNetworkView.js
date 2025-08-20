/**
 * SimpleNetworkView Component
 * Basic SVG network visualization for pathogen-antibiotic relationships
 * Sophomore-level React component using simple SVG graphics
 */

import React, { useState, useMemo } from 'react';
import { Network, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';

const SimpleNetworkView = ({ 
  pathogens, 
  selectedPathogen, 
  onSelectPathogen,
  relationships 
}) => {
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Network dimensions
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate node positions in a circle
  const nodePositions = useMemo(() => {
    if (!pathogens || pathogens.length === 0) return {};
    
    const positions = {};
    const radius = Math.min(width, height) * 0.3;
    
    pathogens.forEach((pathogen, index) => {
      const angle = (index / pathogens.length) * 2 * Math.PI;
      positions[pathogen.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    
    return positions;
  }, [pathogens]);

  // Calculate connections based on shared antibiotics
  const connections = useMemo(() => {
    if (!pathogens || !relationships) return [];
    
    const conn = [];
    
    for (let i = 0; i < pathogens.length; i++) {
      for (let j = i + 1; j < pathogens.length; j++) {
        const pathogen1 = pathogens[i];
        const pathogen2 = pathogens[j];
        
        const antibiotics1 = relationships[pathogen1.id]?.antibiotics || [];
        const antibiotics2 = relationships[pathogen2.id]?.antibiotics || [];
        
        // Find shared effective antibiotics
        const shared = antibiotics1.filter(ab1 => 
          ab1.effectiveness === 'high' &&
          antibiotics2.some(ab2 => 
            ab2.antibioticId === ab1.antibioticId && ab2.effectiveness === 'high'
          )
        );
        
        if (shared.length > 0) {
          conn.push({
            source: pathogen1.id,
            target: pathogen2.id,
            weight: shared.length,
            sharedAntibiotics: shared.length
          });
        }
      }
    }
    
    return conn;
  }, [pathogens, relationships]);

  // Get node color based on gram status
  const getNodeColor = (pathogen) => {
    if (selectedPathogen?.id === pathogen.id) {
      return '#2563eb'; // blue for selected
    }
    
    switch (pathogen.gramStatus) {
      case 'positive':
        return '#9333ea'; // purple
      case 'negative':
        return '#dc2626'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  // Get node radius based on severity
  const getNodeRadius = (pathogen) => {
    const baseRadius = 8;
    switch (pathogen.severity) {
      case 'high':
        return baseRadius + 4;
      case 'medium':
        return baseRadius + 2;
      case 'low':
        return baseRadius;
      default:
        return baseRadius;
    }
  };

  // Handle node click
  const handleNodeClick = (pathogen) => {
    if (onSelectPathogen) {
      onSelectPathogen(pathogen);
    }
  };

  // Handle zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  if (!pathogens || pathogens.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 text-center text-gray-500">
        <Network className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No pathogen data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Network className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pathogen Network
              </h2>
              <p className="text-sm text-gray-600">
                {pathogens.length} pathogens, {connections.length} connections
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`p-2 rounded text-xs ${showLabels ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            >
              Labels
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Gram Positive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Gram Negative</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-8 h-0.5 bg-gray-400"></div>
            <span>Shared antibiotics</span>
          </div>
        </div>
      </div>

      {/* SVG Network */}
      <div className="p-4">
        <div className="border rounded-lg overflow-hidden bg-gray-50">
          <svg 
            width={width} 
            height={height}
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          >
            {/* Grid background */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Connections */}
            {connections.map((connection, index) => {
              const sourcePos = nodePositions[connection.source];
              const targetPos = nodePositions[connection.target];
              
              if (!sourcePos || !targetPos) return null;
              
              return (
                <line
                  key={index}
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke="#9ca3af"
                  strokeWidth={Math.max(1, connection.weight)}
                  opacity={0.6}
                />
              );
            })}

            {/* Nodes */}
            {pathogens.map((pathogen) => {
              const position = nodePositions[pathogen.id];
              if (!position) return null;
              
              const radius = getNodeRadius(pathogen);
              const color = getNodeColor(pathogen);
              const isHovered = hoveredNode?.id === pathogen.id;
              const isSelected = selectedPathogen?.id === pathogen.id;
              
              return (
                <g key={pathogen.id}>
                  {/* Node circle */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={radius}
                    fill={color}
                    stroke={isSelected ? '#1f2937' : '#ffffff'}
                    strokeWidth={isSelected ? 3 : 2}
                    opacity={isHovered ? 0.9 : 0.8}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNodeClick(pathogen)}
                    onMouseEnter={() => setHoveredNode(pathogen)}
                    onMouseLeave={() => setHoveredNode(null)}
                  />
                  
                  {/* Node label */}
                  {showLabels && (
                    <text
                      x={position.x}
                      y={position.y + radius + 15}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#374151"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleNodeClick(pathogen)}
                    >
                      {pathogen.commonName}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover info */}
        {hoveredNode && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  {hoveredNode.name}
                </h4>
                <p className="text-xs text-blue-700">
                  {hoveredNode.description}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {hoveredNode.gramStatus === 'positive' ? 'Gram Positive' : 'Gram Negative'} • 
                  {hoveredNode.severity} severity • 
                  {hoveredNode.shape}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t rounded-b-lg">
        <p className="text-xs text-gray-500 text-center">
          Click nodes to explore pathogen details • Lines show shared antibiotic coverage
        </p>
      </div>
    </div>
  );
};

export default SimpleNetworkView;