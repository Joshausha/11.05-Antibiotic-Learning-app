/**
 * PathogenNetworkVisualization Component
 * Simplified version for Visualizations tab
 * Interactive network visualization showing pathogen relationships
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Network, Filter, RotateCcw, AlertTriangle, Shield, Zap } from 'lucide-react';
import simplePathogens from '../data/SimplePathogenData';
import pathogenAntibioticMap from '../data/pathogenAntibioticMap';

const PathogenNetworkVisualization = ({
  network,
  selectedPathogen,
  onSelectPathogen,
  onShowPathDetails,
  className = ''
}) => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [connectionFilter, setConnectionFilter] = useState('all');
  const [showLabels, setShowLabels] = useState(true);
  const [nodePositions, setNodePositions] = useState({});
  const [isLayoutStable, setIsLayoutStable] = useState(false);
  const animationRef = useRef(null);
  const layoutIterations = useRef(0);
  
  // Enhanced filtering states
  const [gramFilter, setGramFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [resistanceFilter, setResistanceFilter] = useState('all');
  const [shapeFilter, setShapeFilter] = useState('all');
  const [selectedNodeDetails, setSelectedNodeDetails] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(600, rect?.width || 800),
          height: Math.max(400, rect?.height || 600)
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to get pathogen resistance info
  const getPathogenResistanceInfo = (pathogenId) => {
    const antibiotics = pathogenAntibioticMap[pathogenId]?.antibiotics || [];
    const resistant = antibiotics.filter(ab => ab.effectiveness === 'resistant').length;
    const total = antibiotics.length;
    const resistancePercentage = total > 0 ? (resistant / total) * 100 : 0;
    
    return {
      resistant,
      total,
      resistancePercentage,
      highEffective: antibiotics.filter(ab => ab.effectiveness === 'high').length
    };
  };

  // Enhanced network data with real pathogen information
  const allNetworkData = network || {
    nodes: (simplePathogens || []).map(pathogen => ({
      id: pathogen.commonName,
      pathogenId: pathogen.id,
      gramStatus: pathogen.gramStatus,
      shape: pathogen.shape,
      severity: pathogen.severity,
      resistance: pathogen.resistance,
      commonSites: pathogen.commonSites,
      description: pathogen.description,
      connections: 5, // Mock connection count
      centralityScore: 0.8, // Mock centrality
      resistanceInfo: getPathogenResistanceInfo(pathogen.id)
    })),
    edges: [
      { source: 'Staph aureus', target: 'Pneumococcus', weight: 0.7, type: 'strong' },
      { source: 'E. coli', target: 'Pseudomonas', weight: 0.6, type: 'medium' },
      { source: 'Staph aureus', target: 'E. coli', weight: 0.3, type: 'weak' },
      { source: 'Group A Strep', target: 'Pneumococcus', weight: 0.8, type: 'strong' },
      { source: 'Klebsiella', target: 'E. coli', weight: 0.5, type: 'medium' }
    ]
  };

  // Apply node filters
  const getFilteredNodes = () => {
    return (allNetworkData.nodes || []).filter(node => {
      // Gram status filter
      if (gramFilter !== 'all' && node.gramStatus !== gramFilter) return false;
      
      // Severity filter  
      if (severityFilter !== 'all' && node.severity !== severityFilter) return false;
      
      // Shape filter
      if (shapeFilter !== 'all' && node.shape !== shapeFilter) return false;
      
      // Resistance filter
      if (resistanceFilter !== 'all') {
        const resistancePercentage = node.resistanceInfo?.resistancePercentage || 0;
        if (resistanceFilter === 'high' && resistancePercentage <= 50) return false;
        if (resistanceFilter === 'medium' && (resistancePercentage <= 25 || resistancePercentage > 50)) return false;
        if (resistanceFilter === 'low' && resistancePercentage > 25) return false;
      }
      
      return true;
    });
  };

  // Apply edge filters (only show edges between visible nodes)
  const getFilteredEdges = () => {
    const visibleNodes = getFilteredNodes();
    const visibleNodeIds = new Set(visibleNodes.map(node => node.id));
    
    let edges = (allNetworkData.edges || []).filter(edge => 
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
    
    // Apply connection strength filter
    if (connectionFilter !== 'all') {
      edges = edges.filter(edge => edge.type === connectionFilter);
    }
    
    return edges;
  };

  // Create filtered network data
  const networkData = {
    nodes: getFilteredNodes(),
    edges: getFilteredEdges()
  };

  // Clear filters function
  const clearAllFilters = () => {
    setGramFilter('all');
    setSeverityFilter('all');
    setResistanceFilter('all');
    setShapeFilter('all');
    setConnectionFilter('all');
  };

  // Initialize node positions randomly
  const initializeNodePositions = useCallback(() => {
    const positions = {};
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.2;
    
    networkData.nodes.forEach((node, index) => {
      // Start with random positions around center
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * maxRadius;
      
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        vx: 0, // velocity x
        vy: 0  // velocity y
      };
    });
    
    return positions;
  }, [dimensions, networkData.nodes]);

  // Force-directed layout simulation
  const simulateForces = useCallback((positions) => {
    const newPositions = { ...positions };
    const nodes = networkData.nodes;
    const edges = networkData.edges;
    
    // Physics parameters
    const repulsionStrength = 1000;
    const attractionStrength = 0.1;
    const centeringStrength = 0.02;
    const damping = 0.8;
    const minDistance = 50;
    
    // Clear forces
    Object.keys(newPositions).forEach(nodeId => {
      newPositions[nodeId].fx = 0;
      newPositions[nodeId].fy = 0;
    });
    
    // Repulsion forces (nodes push away from each other)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        const posA = newPositions[nodeA.id];
        const posB = newPositions[nodeB.id];
        
        const dx = posA.x - posB.x;
        const dy = posA.y - posB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0 && distance < 150) {
          const force = repulsionStrength / (distance * distance);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          posA.fx += fx;
          posA.fy += fy;
          posB.fx -= fx;
          posB.fy -= fy;
        }
      }
    }
    
    // Attraction forces (connected nodes pull toward each other)
    edges.forEach(edge => {
      const posA = newPositions[edge.source];
      const posB = newPositions[edge.target];
      
      if (posA && posB) {
        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > minDistance) {
          const force = attractionStrength * (distance - minDistance);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          posA.fx += fx;
          posA.fy += fy;
          posB.fx -= fx;
          posB.fy -= fy;
        }
      }
    });
    
    // Centering force (pull toward center)
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    Object.keys(newPositions).forEach(nodeId => {
      const pos = newPositions[nodeId];
      const dx = centerX - pos.x;
      const dy = centerY - pos.y;
      
      pos.fx += dx * centeringStrength;
      pos.fy += dy * centeringStrength;
    });
    
    // Apply forces and update positions
    let totalMovement = 0;
    Object.keys(newPositions).forEach(nodeId => {
      const pos = newPositions[nodeId];
      
      // Update velocity
      pos.vx = (pos.vx + pos.fx) * damping;
      pos.vy = (pos.vy + pos.fy) * damping;
      
      // Update position
      pos.x += pos.vx;
      pos.y += pos.vy;
      
      // Keep within bounds
      const margin = 50;
      pos.x = Math.max(margin, Math.min(dimensions.width - margin, pos.x));
      pos.y = Math.max(margin, Math.min(dimensions.height - margin, pos.y));
      
      // Track movement for stability detection
      totalMovement += Math.abs(pos.vx) + Math.abs(pos.vy);
    });
    
    return { newPositions, totalMovement };
  }, [dimensions, networkData.nodes, networkData.edges]);

  // Animation loop for force-directed layout
  useEffect(() => {
    if (!isLayoutStable && Object.keys(nodePositions).length > 0) {
      const animate = () => {
        const { newPositions, totalMovement } = simulateForces(nodePositions);
        setNodePositions(newPositions);
        
        layoutIterations.current++;
        
        // Check if layout is stable
        if (totalMovement < 0.1 || layoutIterations.current > 300) {
          setIsLayoutStable(true);
        } else {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodePositions, isLayoutStable, simulateForces]);

  // Initialize positions when dimensions or network data changes
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setNodePositions(initializeNodePositions());
      setIsLayoutStable(false);
      layoutIterations.current = 0;
    }
  }, [dimensions.width, dimensions.height, networkData.nodes.length]);

  // Get node position (now using force-directed positions)
  const getNodePosition = (nodeId) => {
    return nodePositions[nodeId] || { x: dimensions.width / 2, y: dimensions.height / 2 };
  };

  // Enhanced node styling with resistance indicators
  const getNodeStyle = (node) => {
    const isSelected = selectedPathogen && selectedPathogen.id === node.id;
    const isHovered = hoveredNode && hoveredNode.id === node.id;
    
    // Base colors with better gradients
    const baseColors = {
      'positive': {
        light: '#e9d5ff',
        main: '#a855f7',
        dark: '#7c3aed'
      },
      'negative': {
        light: '#fecaca',
        main: '#ef4444',
        dark: '#dc2626'
      }
    };
    
    const colorScheme = baseColors[node.gramStatus] || baseColors.negative;
    
    // Severity-based color intensity
    const severityIntensity = {
      'high': colorScheme.dark,
      'medium': colorScheme.main,
      'low': colorScheme.light
    };
    
    // Resistance-based border styling
    const resistancePercentage = node.resistanceInfo?.resistancePercentage || 0;
    const getBorderColor = () => {
      if (resistancePercentage > 50) return '#dc2626'; // Red for high resistance
      if (resistancePercentage > 25) return '#f59e0b'; // Orange for medium resistance
      return '#10b981'; // Green for low resistance
    };
    
    const getBorderWidth = () => {
      if (isSelected) return 4;
      if (resistancePercentage > 50) return 3;
      if (resistancePercentage > 25) return 2;
      return 1;
    };
    
    return {
      fill: severityIntensity[node.severity] || colorScheme.main,
      stroke: getBorderColor(),
      strokeWidth: getBorderWidth(),
      opacity: isHovered ? 0.95 : 0.85,
      filter: isSelected ? 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none'
    };
  };

  // Severity-based node radius
  const getNodeRadius = (node) => {
    const severityRadius = {
      'high': 22,
      'medium': 16,
      'low': 12
    };
    
    return severityRadius[node.severity] || 16;
  };

  // Get node shape based on pathogen morphology
  const getNodeShape = (node) => {
    return node.shape === 'rod' ? 'rect' : 'circle';
  };


  // Handle node click
  const handleNodeClick = (node) => {
    // Set detailed node information for info panel
    setSelectedNodeDetails(node);
    setShowInfoPanel(true);
    
    // Call parent callback if provided
    if (onSelectPathogen) {
      onSelectPathogen(node);
    }
  };

  // Handle node hover for tooltips
  const handleNodeMouseEnter = (node, event) => {
    setHoveredNode(node);
    setTooltipData({
      pathogen: node.id,
      gramStatus: node.gramStatus,
      severity: node.severity,
      resistance: node.resistance
    });
    
    // Get SVG coordinates for tooltip positioning
    if (svgRef.current && event && event.clientX && event.clientY) {
      const svgRect = svgRef.current.getBoundingClientRect();
      if (svgRect && typeof svgRect.left === 'number' && typeof svgRect.top === 'number') {
        setTooltipPosition({
          x: event.clientX - svgRect.left,
          y: event.clientY - svgRect.top
        });
      }
    }
  };

  const handleNodeMouseLeave = () => {
    setHoveredNode(null);
    setTooltipData(null);
  };

  // Get detailed antibiotic information for selected pathogen
  const getDetailedAntibioticInfo = (pathogenId) => {
    const antibiotics = pathogenAntibioticMap[pathogenId]?.antibiotics || [];
    
    const categorized = {
      high: antibiotics.filter(ab => ab.effectiveness === 'high'),
      medium: antibiotics.filter(ab => ab.effectiveness === 'medium'),
      low: antibiotics.filter(ab => ab.effectiveness === 'low'),
      resistant: antibiotics.filter(ab => ab.effectiveness === 'resistant')
    };
    
    return categorized;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className} relative`}>
      {/* Header with controls */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Network className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold">Pathogen Network</h3>
            <span className="text-sm text-gray-500">
              ({networkData.nodes.length} pathogens, {networkData.edges.length} connections)
            </span>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="space-y-3">
          {/* Filter Controls */}
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-600" />
              <span className="font-medium text-gray-700">Filters:</span>
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="gram-filter" className="text-gray-600">Gram:</label>
              <select
                id="gram-filter"
                value={gramFilter}
                onChange={(e) => setGramFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="severity-filter" className="text-gray-600">Severity:</label>
              <select
                id="severity-filter"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="shape-filter" className="text-gray-600">Shape:</label>
              <select
                id="shape-filter"
                value={shapeFilter}
                onChange={(e) => setShapeFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="cocci">Cocci</option>
                <option value="rod">Rod</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="resistance-filter" className="text-gray-600">Resistance:</label>
              <select
                id="resistance-filter"
                value={resistanceFilter}
                onChange={(e) => setResistanceFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="high">High (&gt;50%)</option>
                <option value="medium">Medium (25-50%)</option>
                <option value="low">Low (&lt;25%)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="connection-filter" className="text-gray-600">Connections:</label>
              <select
                id="connection-filter"
                value={connectionFilter}
                onChange={(e) => setConnectionFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="strong">Strong</option>
                <option value="medium">Medium</option>
                <option value="weak">Weak</option>
              </select>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="rounded"
              />
              Show Labels
            </label>

            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer"
            >
              Clear Filters
            </button>

            <button
              onClick={() => {
                setNodePositions(initializeNodePositions());
                setIsLayoutStable(false);
                layoutIterations.current = 0;
              }}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              Reset Layout
            </button>

            {!isLayoutStable && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Stabilizing...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="p-4">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="border rounded-lg bg-gray-50"
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Enhanced Edges */}
          <g className="edges">
            {networkData.edges.map((edge, index) => {
              const sourcePos = getNodePosition(edge.source);
              const targetPos = getNodePosition(edge.target);
              
              if (!sourcePos || !targetPos) return null;
              
              // Enhanced color scheme for connection strength
              const strokeColors = {
                strong: '#10b981',   // Emerald green for strong connections
                medium: '#f59e0b',   // Amber for medium connections
                weak: '#94a3b8'      // Slate gray for weak connections
              };
              
              // Enhanced stroke width based on connection strength
              const strokeWidths = {
                strong: 4,
                medium: 2.5,
                weak: 1.5
              };
              
              // Calculate hover states for enhanced interactivity
              const isHovered = hoveredNode && 
                (hoveredNode.id === edge.source || hoveredNode.id === edge.target);
              
              return (
                <g key={index}>
                  {/* Connection shadow for depth */}
                  <line
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth={strokeWidths[edge.type] + 1}
                    opacity={isHovered ? 0.3 : 0.1}
                    className="transition-all duration-200"
                  />
                  
                  {/* Main connection line */}
                  <line
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={strokeColors[edge.type] || strokeColors.weak}
                    strokeWidth={strokeWidths[edge.type]}
                    opacity={isHovered ? 0.9 : 0.7}
                    strokeDasharray={edge.type === 'weak' ? '5,5' : 'none'}
                    className="transition-all duration-200 hover:opacity-100"
                    style={{
                      filter: isHovered ? 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' : 'none'
                    }}
                  />
                  
                  {/* Connection strength indicator (midpoint) */}
                  {edge.type === 'strong' && (
                    <circle
                      cx={(sourcePos.x + targetPos.x) / 2}
                      cy={(sourcePos.y + targetPos.y) / 2}
                      r="3"
                      fill={strokeColors.strong}
                      opacity={isHovered ? 0.9 : 0.7}
                      className="transition-all duration-200"
                    />
                  )}
                  
                  {/* Animated flow indicator for strong connections */}
                  {edge.type === 'strong' && isHovered && (
                    <circle
                      cx={(sourcePos.x + targetPos.x) / 2}
                      cy={(sourcePos.y + targetPos.y) / 2}
                      r="5"
                      fill="none"
                      stroke={strokeColors.strong}
                      strokeWidth="1"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {networkData.nodes.map((node, index) => {
              const pos = getNodePosition(node.id);
              const style = getNodeStyle(node);
              const radius = getNodeRadius(node);
              const shape = getNodeShape(node);
              const isSelected = selectedPathogen && selectedPathogen.id === node.id;
              const isHovered = hoveredNode && hoveredNode.id === node.id;
              const resistanceInfo = node.resistanceInfo || {};
              
              if (!pos) return null;
              
              return (
                <g key={node.id}>
                  {/* Node shape - circle for cocci, rectangle for rods */}
                  {shape === 'circle' ? (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={radius}
                      fill={style.fill}
                      stroke={style.stroke}
                      strokeWidth={style.strokeWidth}
                      opacity={style.opacity}
                      style={{ filter: style.filter }}
                      className={`cursor-pointer transition-all duration-300 hover:scale-110 ${
                        isSelected ? 'animate-pulse' : ''
                      }`}
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={(e) => handleNodeMouseEnter(node, e)}
                      onMouseLeave={handleNodeMouseLeave}
                    />
                  ) : (
                    <rect
                      x={pos.x - radius}
                      y={pos.y - radius * 0.6}
                      width={radius * 2}
                      height={radius * 1.2}
                      rx="4"
                      fill={style.fill}
                      stroke={style.stroke}
                      strokeWidth={style.strokeWidth}
                      opacity={style.opacity}
                      style={{ filter: style.filter }}
                      className={`cursor-pointer transition-all duration-300 hover:scale-110 ${
                        isSelected ? 'animate-pulse' : ''
                      }`}
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={(e) => handleNodeMouseEnter(node, e)}
                      onMouseLeave={handleNodeMouseLeave}
                    />
                  )}
                  
                  {/* Resistance warning indicator */}
                  {resistanceInfo.resistancePercentage > 50 && (
                    <g transform={`translate(${pos.x + radius - 8}, ${pos.y - radius + 8})`}>
                      <circle r="8" fill="#dc2626" className="pointer-events-none" />
                      <AlertTriangle 
                        size={10} 
                        className="text-white pointer-events-none"
                        style={{ transform: 'translate(-5px, -5px)' }}
                      />
                    </g>
                  )}
                  
                  {/* Severity indicator */}
                  {node.severity === 'high' && (
                    <g transform={`translate(${pos.x - radius + 8}, ${pos.y - radius + 8})`}>
                      <circle r="6" fill="#f59e0b" className="pointer-events-none" />
                      <Zap 
                        size={8} 
                        className="text-white pointer-events-none"
                        style={{ transform: 'translate(-4px, -4px)' }}
                      />
                    </g>
                  )}
                  
                  {/* Node labels */}
                  {showLabels && (
                    <text
                      x={pos.x}
                      y={pos.y + radius + 12}
                      textAnchor="middle"
                      className="fill-gray-700 text-xs font-medium pointer-events-none"
                      style={{ fontSize: '11px' }}
                    >
                      {node.id}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Enhanced hover tooltip */}
        {hoveredNode && (
          <div className="absolute bg-white border rounded-lg shadow-lg p-4 pointer-events-none z-10 min-w-64"
               style={{
                 left: 20,
                 top: 20
               }}>
            <div className="font-semibold text-gray-900 mb-2">{hoveredNode.id}</div>
            
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div className="text-gray-600">
                <span className="font-medium">Gram:</span> {hoveredNode.gramStatus}
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Shape:</span> {hoveredNode.shape}
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Severity:</span> 
                <span className={`ml-1 font-medium ${
                  hoveredNode.severity === 'high' ? 'text-red-600' : 
                  hoveredNode.severity === 'medium' ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {hoveredNode.severity}
                </span>
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Resistance:</span> 
                <span className={`ml-1 font-medium ${
                  hoveredNode.resistanceInfo.resistancePercentage > 50 ? 'text-red-600' : 
                  hoveredNode.resistanceInfo.resistancePercentage > 25 ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {hoveredNode.resistanceInfo.resistancePercentage.toFixed(0)}%
                </span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mb-2">
              <div className="font-medium">Common sites:</div>
              <div>{hoveredNode.commonSites?.join(', ')}</div>
            </div>
            
            <div className="text-xs text-gray-500 mb-2">
              <div className="font-medium">Effective antibiotics:</div>
              <div>{hoveredNode.resistanceInfo.highEffective} highly effective</div>
            </div>
            
            <div className="text-xs text-gray-400 pt-2 border-t">
              {hoveredNode.description}
            </div>
          </div>
        )}
      </div>

      {/* Information Panel */}
      {showInfoPanel && selectedNodeDetails && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l z-50 transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Pathogen Details</h3>
            <button
              onClick={() => setShowInfoPanel(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-full">
            {/* Pathogen Overview */}
            <div className="mb-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedNodeDetails.id}</h4>
              <p className="text-gray-600 mb-4">{selectedNodeDetails.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Gram Status</div>
                  <div className="font-medium capitalize">{selectedNodeDetails.gramStatus}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Shape</div>
                  <div className="font-medium capitalize">{selectedNodeDetails.shape}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Severity</div>
                  <div className={`font-medium capitalize ${
                    selectedNodeDetails.severity === 'high' ? 'text-red-600' :
                    selectedNodeDetails.severity === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {selectedNodeDetails.severity}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Resistance</div>
                  <div className={`font-medium ${
                    selectedNodeDetails.resistanceInfo.resistancePercentage > 50 ? 'text-red-600' :
                    selectedNodeDetails.resistanceInfo.resistancePercentage > 25 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {selectedNodeDetails.resistanceInfo.resistancePercentage.toFixed(0)}%
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Common Infection Sites</div>
                <div className="flex flex-wrap gap-2">
                  {selectedNodeDetails.commonSites?.map((site, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {site}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Resistance Notes</div>
                <div className="text-sm bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                  {selectedNodeDetails.resistance}
                </div>
              </div>
            </div>

            {/* Antibiotic Effectiveness */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Antibiotic Effectiveness</h4>
              {(() => {
                const antibiotics = getDetailedAntibioticInfo(selectedNodeDetails.pathogenId);
                return (
                  <div className="space-y-4">
                    {/* High Effectiveness */}
                    {antibiotics.high.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-green-700">High Effectiveness</span>
                        </div>
                        <div className="space-y-2">
                          {antibiotics.high.map((antibiotic, index) => (
                            <div key={index} className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                              <div className="font-medium text-green-900">{antibiotic.name}</div>
                              <div className="text-sm text-green-700">{antibiotic.notes}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Medium Effectiveness */}
                    {antibiotics.medium.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="font-medium text-yellow-700">Medium Effectiveness</span>
                        </div>
                        <div className="space-y-2">
                          {antibiotics.medium.map((antibiotic, index) => (
                            <div key={index} className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                              <div className="font-medium text-yellow-900">{antibiotic.name}</div>
                              <div className="text-sm text-yellow-700">{antibiotic.notes}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Low Effectiveness */}
                    {antibiotics.low.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="font-medium text-orange-700">Low Effectiveness</span>
                        </div>
                        <div className="space-y-2">
                          {antibiotics.low.map((antibiotic, index) => (
                            <div key={index} className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                              <div className="font-medium text-orange-900">{antibiotic.name}</div>
                              <div className="text-sm text-orange-700">{antibiotic.notes}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Resistant */}
                    {antibiotics.resistant.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-medium text-red-700">Resistant</span>
                        </div>
                        <div className="space-y-2">
                          {antibiotics.resistant.map((antibiotic, index) => (
                            <div key={index} className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                              <div className="font-medium text-red-900">{antibiotic.name}</div>
                              <div className="text-sm text-red-700">{antibiotic.notes}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Legend */}
      <div className="p-4 border-t bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
          {/* Gram Status */}
          <div className="space-y-1">
            <div className="font-semibold text-gray-700">Gram Status</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Gram Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Gram Negative</span>
            </div>
          </div>
          
          {/* Severity */}
          <div className="space-y-1">
            <div className="font-semibold text-gray-700">Severity</div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-800"></div>
              <span>High (large)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-300"></div>
              <span>Low (small)</span>
            </div>
          </div>
          
          {/* Resistance */}
          <div className="space-y-1">
            <div className="font-semibold text-gray-700">Resistance</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-red-600"></div>
              <span>High (&gt;50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-yellow-500"></div>
              <span>Medium (25-50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-green-600"></div>
              <span>Low (&lt;25%)</span>
            </div>
          </div>
          
          {/* Connections */}
          <div className="space-y-1">
            <div className="font-semibold text-gray-700">Connections</div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 bg-emerald-500 rounded-full"></div>
              <span>Strong</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-amber-500 rounded-full"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-slate-400 rounded-full" style={{borderTop: '1px dashed #94a3b8', backgroundColor: 'transparent'}}></div>
              <span>Weak</span>
            </div>
          </div>
          
          {/* Indicators */}
          <div className="space-y-1">
            <div className="font-semibold text-gray-700">Indicators</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle size={8} className="text-white" />
              </div>
              <span>High Resistance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                <Zap size={8} className="text-white" />
              </div>
              <span>High Severity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 bg-gray-400 rounded-sm"></div>
              <span>Rod-shaped</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathogenNetworkVisualization;