/**
 * PathogenNetworkVisualization Component
 * Interactive network visualization showing pathogen relationships
 * Refactored to use extracted modules with TypeScript support
 */

import React, { useState, useEffect, useRef, useCallback, FC } from 'react';
import { Network, AlertTriangle, Zap } from 'lucide-react';
import simplePathogens from '../data/SimplePathogenData';
import {
  getPathogenResistanceInfo,
  filterNodes,
  filterEdges,
  DEFAULT_FILTERS,
} from '../utils/networkFilterUtils';
import {
  getNodeStyle,
  getNodeRadius,
  getNodeShape,
  EDGE_STROKE_COLORS,
  EDGE_STROKE_WIDTHS,
  shouldShowResistanceWarning,
  shouldShowSeverityIndicator,
} from '../utils/networkNodeStyles';
import NetworkFilterControls from './network/NetworkFilterControls';
import NetworkLegend from './network/NetworkLegend';
import PathogenInfoPanel from './network/PathogenInfoPanel';

// Types
interface Pathogen {
  id: string;
  commonName: string;
  name: string;
  gramStatus: 'positive' | 'negative' | 'other';
  shape: 'circle' | 'rectangle';
  severity: 'high' | 'medium' | 'low';
  resistance?: string;
  commonSites?: string[];
  description?: string;
  pathogenId?: string | number;
  connections?: number;
  centralityScore?: number;
  resistanceInfo?: {
    resistancePercentage: number;
    highEffective: number;
  };
}

interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
  type: 'strong' | 'medium' | 'weak';
}

interface NetworkData {
  nodes: Pathogen[];
  edges: NetworkEdge[];
}

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number;
  fy?: number;
}

interface NodeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  filter?: string;
}

interface Filters {
  [key: string]: any;
}

interface PathogenNetworkVisualizationProps {
  network?: NetworkData;
  selectedPathogen?: Pathogen | null;
  onSelectPathogen?: (pathogen: Pathogen) => void;
  onShowPathDetails?: (pathogen: Pathogen) => void;
  className?: string;
}

const PathogenNetworkVisualization: FC<PathogenNetworkVisualizationProps> = ({
  network,
  selectedPathogen,
  onSelectPathogen,
  onShowPathDetails,
  className = '',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 600,
  });
  const [hoveredNode, setHoveredNode] = useState<Pathogen | null>(null);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});
  const [isLayoutStable, setIsLayoutStable] = useState<boolean>(false);
  const animationRef = useRef<number>();
  const layoutIterations = useRef<number>(0);
  const nodePositionsRef = useRef<Record<string, NodePosition>>({});

  // Filter states
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<Pathogen | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = (): void => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(600, rect?.width || 800),
          height: Math.max(400, rect?.height || 600),
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced network data with real pathogen information
  const allNetworkData: NetworkData = network || {
    nodes: (simplePathogens || []).map((pathogen: any) => ({
      id: pathogen.commonName,
      commonName: pathogen.commonName,
      name: pathogen.name,
      pathogenId: pathogen.id,
      gramStatus: pathogen.gramStatus,
      shape: pathogen.shape,
      severity: pathogen.severity,
      resistance: pathogen.resistance,
      commonSites: pathogen.commonSites,
      description: pathogen.description,
      connections: 5,
      centralityScore: 0.8,
      resistanceInfo: getPathogenResistanceInfo(pathogen.id),
    })),
    edges: [
      { source: 'Staph aureus', target: 'Pneumococcus', weight: 0.7, type: 'strong' },
      { source: 'E. coli', target: 'Pseudomonas', weight: 0.6, type: 'medium' },
      { source: 'Staph aureus', target: 'E. coli', weight: 0.3, type: 'weak' },
      { source: 'Group A Strep', target: 'Pneumococcus', weight: 0.8, type: 'strong' },
      { source: 'Klebsiella', target: 'E. coli', weight: 0.5, type: 'medium' },
    ],
  };

  // Create filtered network data
  const filteredNodes = filterNodes(allNetworkData.nodes, filters);
  const networkData: NetworkData = {
    nodes: filteredNodes,
    edges: filterEdges(
      allNetworkData.edges,
      filteredNodes,
      filters.connectionFilter
    ),
  };

  // Handle filter changes
  const handleFilterChange = useCallback((filterName: string, value: any): void => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  }, []);

  const clearAllFilters = useCallback((): void => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Initialize node positions randomly
  const initializeNodePositions = useCallback((): Record<string, NodePosition> => {
    const positions: Record<string, NodePosition> = {};
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.2;

    networkData.nodes.forEach((node) => {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * maxRadius;

      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
      };
    });

    return positions;
  }, [dimensions.width, dimensions.height, networkData.nodes]);

  // Force-directed layout simulation
  const simulateForces = useCallback(
    (positions: Record<string, NodePosition>): { newPositions: Record<string, NodePosition>; totalMovement: number } => {
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
      Object.keys(newPositions).forEach((nodeId) => {
        newPositions[nodeId].fx = 0;
        newPositions[nodeId].fy = 0;
      });

      // Repulsion forces
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          const posA = newPositions[nodeA.id];
          const posB = newPositions[nodeB.id];

          if (!posA || !posB) continue;

          const dx = posA.x - posB.x;
          const dy = posA.y - posB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0 && distance < 150) {
            const force = repulsionStrength / (distance * distance);
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;

            posA.fx! += fx;
            posA.fy! += fy;
            posB.fx! -= fx;
            posB.fy! -= fy;
          }
        }
      }

      // Attraction forces
      edges.forEach((edge) => {
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

            posA.fx! += fx;
            posA.fy! += fy;
            posB.fx! -= fx;
            posB.fy! -= fy;
          }
        }
      });

      // Centering force
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;

      Object.keys(newPositions).forEach((nodeId) => {
        const pos = newPositions[nodeId];
        pos.fx! += (centerX - pos.x) * centeringStrength;
        pos.fy! += (centerY - pos.y) * centeringStrength;
      });

      // Apply forces and update positions
      let totalMovement = 0;
      Object.keys(newPositions).forEach((nodeId) => {
        const pos = newPositions[nodeId];
        pos.vx = (pos.vx + pos.fx!) * damping;
        pos.vy = (pos.vy + pos.fy!) * damping;
        pos.x += pos.vx;
        pos.y += pos.vy;

        // Keep within bounds
        const margin = 50;
        pos.x = Math.max(margin, Math.min(dimensions.width - margin, pos.x));
        pos.y = Math.max(margin, Math.min(dimensions.height - margin, pos.y));

        totalMovement += Math.abs(pos.vx) + Math.abs(pos.vy);
      });

      return { newPositions, totalMovement };
    },
    [dimensions, networkData.nodes, networkData.edges]
  );

  // Sync ref with state for animation loop
  useEffect(() => {
    nodePositionsRef.current = nodePositions;
  }, [nodePositions]);

  // Animation loop for force-directed layout
  useEffect(() => {
    if (!isLayoutStable && Object.keys(nodePositionsRef.current).length > 0) {
      const animate = (): void => {
        const { newPositions, totalMovement } = simulateForces(nodePositionsRef.current);
        nodePositionsRef.current = newPositions;
        setNodePositions(newPositions);

        layoutIterations.current++;

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
  }, [isLayoutStable, simulateForces]);

  // Initialize positions when dimensions or network data changes
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setNodePositions(initializeNodePositions());
      setIsLayoutStable(false);
      layoutIterations.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions.width, dimensions.height, networkData.nodes.length]);

  // Get node position
  const getNodePosition = (nodeId: string): NodePosition | { x: number; y: number } => {
    return nodePositions[nodeId] || { x: dimensions.width / 2, y: dimensions.height / 2 };
  };

  // Handle node click
  const handleNodeClick = (node: Pathogen): void => {
    setSelectedNodeDetails(node);
    setShowInfoPanel(true);
    if (onSelectPathogen) onSelectPathogen(node);
  };

  // Handle node hover
  const handleNodeMouseEnter = (node: Pathogen): void => {
    setHoveredNode(node);
  };

  const handleNodeMouseLeave = (): void => {
    setHoveredNode(null);
  };

  // Reset layout
  const handleResetLayout = useCallback((): void => {
    setNodePositions(initializeNodePositions());
    setIsLayoutStable(false);
    layoutIterations.current = 0;
  }, [initializeNodePositions]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className} relative`}>
      {/* Header with controls */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Network className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold">Pathogen Network</h3>
            <span className="text-sm text-gray-500">
              ({networkData.nodes.length} pathogens, {networkData.edges.length}{' '}
              connections)
            </span>
          </div>
        </div>

        <NetworkFilterControls
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearAllFilters}
          onResetLayout={handleResetLayout}
          showLabels={showLabels}
          onToggleLabels={setShowLabels}
          isLayoutStable={isLayoutStable}
        />
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
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Edges */}
          <g className="edges">
            {networkData.edges.map((edge, index) => {
              const sourcePos = getNodePosition(edge.source) as NodePosition | { x: number; y: number };
              const targetPos = getNodePosition(edge.target) as NodePosition | { x: number; y: number };

              if (!sourcePos || !targetPos) return null;

              const isHovered =
                hoveredNode &&
                (hoveredNode.id === edge.source || hoveredNode.id === edge.target);

              return (
                <g key={index}>
                  <line
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth={(EDGE_STROKE_WIDTHS[edge.type] || 1.5) + 1}
                    opacity={isHovered ? 0.3 : 0.1}
                    className="transition-all duration-200"
                  />
                  <line
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={EDGE_STROKE_COLORS[edge.type] || EDGE_STROKE_COLORS.weak}
                    strokeWidth={EDGE_STROKE_WIDTHS[edge.type] || 1.5}
                    opacity={isHovered ? 0.9 : 0.7}
                    strokeDasharray={edge.type === 'weak' ? '5,5' : 'none'}
                    className="transition-all duration-200 hover:opacity-100"
                    style={{
                      filter: isHovered ? 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' : 'none',
                    }}
                  />
                  {edge.type === 'strong' && (
                    <circle
                      cx={(sourcePos.x + targetPos.x) / 2}
                      cy={(sourcePos.y + targetPos.y) / 2}
                      r="3"
                      fill={EDGE_STROKE_COLORS.strong}
                      opacity={isHovered ? 0.9 : 0.7}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {networkData.nodes.map((node) => {
              const pos = getNodePosition(node.id) as NodePosition | { x: number; y: number };
              const style = getNodeStyle(node, selectedPathogen, hoveredNode);
              const radius = getNodeRadius(node);
              const shape = getNodeShape(node);
              const isSelected = selectedPathogen && selectedPathogen.id === node.id;

              if (!pos) return null;

              return (
                <g key={node.id}>
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
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={() => handleNodeMouseEnter(node)}
                      onMouseLeave={handleNodeMouseLeave}
                      tabIndex={0}
                      role="button"
                      aria-label={`Select pathogen ${node.id}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleNodeClick(node);
                        }
                      }}
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
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={() => handleNodeMouseEnter(node)}
                      onMouseLeave={handleNodeMouseLeave}
                      tabIndex={0}
                      role="button"
                      aria-label={`Select pathogen ${node.id}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleNodeClick(node);
                        }
                      }}
                    />
                  )}

                  {/* Resistance warning indicator */}
                  {shouldShowResistanceWarning(node) && (
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
                  {shouldShowSeverityIndicator(node) && (
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

        {/* Hover tooltip */}
        {hoveredNode && (
          <div
            className="absolute bg-white border rounded-lg shadow-lg p-4 pointer-events-none z-10 min-w-64"
            style={{ left: 20, top: 20 }}
          >
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
                <span
                  className={`ml-1 font-medium ${
                    hoveredNode.severity === 'high'
                      ? 'text-red-600'
                      : hoveredNode.severity === 'medium'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                  }`}
                >
                  {hoveredNode.severity}
                </span>
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Resistance:</span>
                <span
                  className={`ml-1 font-medium ${
                    (hoveredNode.resistanceInfo?.resistancePercentage || 0) > 50
                      ? 'text-red-600'
                      : (hoveredNode.resistanceInfo?.resistancePercentage || 0) > 25
                        ? 'text-yellow-600'
                        : 'text-green-600'
                  }`}
                >
                  {((hoveredNode.resistanceInfo?.resistancePercentage || 0).toFixed(0))}%
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-2">
              <div className="font-medium">Common sites:</div>
              <div>{hoveredNode.commonSites?.join(', ')}</div>
            </div>

            <div className="text-xs text-gray-500 mb-2">
              <div className="font-medium">Effective antibiotics:</div>
              <div>{hoveredNode.resistanceInfo?.highEffective} highly effective</div>
            </div>

            <div className="text-xs text-gray-400 pt-2 border-t">{hoveredNode.description}</div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <PathogenInfoPanel
        pathogen={selectedNodeDetails}
        isVisible={showInfoPanel}
        onClose={() => setShowInfoPanel(false)}
      />

      {/* Legend */}
      <NetworkLegend />
    </div>
  );
};

export default PathogenNetworkVisualization;
