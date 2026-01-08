/**
 * PathogenNetworkVisualizationEnhanced Component
 *
 * A visually striking network visualization with a "Clinical Microbiology Lab" aesthetic.
 * Features dynamic edge generation, fluorescent microscopy-inspired colors, and smooth animations.
 *
 * Design: Dark theme with luminous nodes, representing pathogens under UV microscopy
 */

import React, { useState, useEffect, useRef, useCallback, FC, useMemo } from 'react';
import {
  Network, AlertTriangle, Zap, ZoomIn, ZoomOut,
  RotateCcw, Eye, EyeOff, Maximize2, Filter
} from 'lucide-react';
import simplePathogens from '../data/SimplePathogenData';

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
  antibiotics?: string[];
}

interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
  sharedAntibiotics: string[];
}

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface PathogenNetworkVisualizationEnhancedProps {
  onSelectPathogen?: (pathogen: Pathogen) => void;
  className?: string;
}

// Color palette - Fluorescent microscopy inspired
const COLORS = {
  // Background
  bgPrimary: '#0a0a0f',
  bgSecondary: '#12121a',
  bgTertiary: '#1a1a24',
  grid: 'rgba(59, 130, 246, 0.05)',
  gridAccent: 'rgba(59, 130, 246, 0.1)',

  // Gram status - luminous colors
  gramPositive: '#a855f7',      // Purple - traditional gram+ stain
  gramPositiveGlow: 'rgba(168, 85, 247, 0.4)',
  gramNegative: '#f43f5e',      // Rose/Red - traditional gram- stain
  gramNegativeGlow: 'rgba(244, 63, 94, 0.4)',
  gramOther: '#06b6d4',         // Cyan for atypical
  gramOtherGlow: 'rgba(6, 182, 212, 0.4)',

  // Severity
  severityHigh: '#ef4444',
  severityMedium: '#f59e0b',
  severityLow: '#22c55e',

  // Edges
  edgeStrong: 'rgba(59, 130, 246, 0.8)',
  edgeMedium: 'rgba(59, 130, 246, 0.5)',
  edgeWeak: 'rgba(59, 130, 246, 0.25)',

  // Text
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  // Accents
  accent: '#3b82f6',
  accentGlow: 'rgba(59, 130, 246, 0.3)',
};

// Generate edges based on shared antibiotics
const generateEdges = (pathogens: Pathogen[]): NetworkEdge[] => {
  const edges: NetworkEdge[] = [];

  // Create a map of pathogen -> antibiotics from simplePathogens data
  const pathogenAntibiotics: Record<string, string[]> = {};

  pathogens.forEach(p => {
    // Use common treatment antibiotics based on gram status and severity
    const antibiotics: string[] = [];

    if (p.gramStatus === 'positive') {
      antibiotics.push('Vancomycin', 'Penicillin', 'Cephalosporins');
      if (p.severity === 'high') antibiotics.push('Linezolid', 'Daptomycin');
    } else if (p.gramStatus === 'negative') {
      antibiotics.push('Ceftriaxone', 'Fluoroquinolones', 'Aminoglycosides');
      if (p.severity === 'high') antibiotics.push('Carbapenems', 'Piperacillin-Tazobactam');
    } else {
      antibiotics.push('Azithromycin', 'Doxycycline', 'Fluoroquinolones');
    }

    pathogenAntibiotics[p.id] = antibiotics;
  });

  // Generate edges for pathogens that share antibiotics
  for (let i = 0; i < pathogens.length; i++) {
    for (let j = i + 1; j < pathogens.length; j++) {
      const p1 = pathogens[i];
      const p2 = pathogens[j];

      const antibiotics1 = pathogenAntibiotics[p1.id] || [];
      const antibiotics2 = pathogenAntibiotics[p2.id] || [];

      const shared = antibiotics1.filter(a => antibiotics2.includes(a));

      if (shared.length > 0) {
        // Calculate weight based on shared count and same gram status
        let weight = shared.length / Math.max(antibiotics1.length, antibiotics2.length);
        if (p1.gramStatus === p2.gramStatus) weight *= 1.5;
        weight = Math.min(weight, 1);

        edges.push({
          source: p1.id,
          target: p2.id,
          weight,
          sharedAntibiotics: shared,
        });
      }
    }
  }

  // Limit to top edges by weight for cleaner visualization
  return edges
    .sort((a, b) => b.weight - a.weight)
    .slice(0, Math.min(edges.length, 80));
};

// Get node color based on gram status
const getNodeColor = (gramStatus: string): string => {
  switch (gramStatus) {
    case 'positive': return COLORS.gramPositive;
    case 'negative': return COLORS.gramNegative;
    default: return COLORS.gramOther;
  }
};

const getNodeGlow = (gramStatus: string): string => {
  switch (gramStatus) {
    case 'positive': return COLORS.gramPositiveGlow;
    case 'negative': return COLORS.gramNegativeGlow;
    default: return COLORS.gramOtherGlow;
  }
};

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'high': return COLORS.severityHigh;
    case 'medium': return COLORS.severityMedium;
    default: return COLORS.severityLow;
  }
};

const PathogenNetworkVisualizationEnhanced: FC<PathogenNetworkVisualizationEnhancedProps> = ({
  onSelectPathogen,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [hoveredNode, setHoveredNode] = useState<Pathogen | null>(null);
  const [selectedNode, setSelectedNode] = useState<Pathogen | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});
  const [isLayoutStable, setIsLayoutStable] = useState(false);

  const [filterGram, setFilterGram] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [edgeThreshold, setEdgeThreshold] = useState(0.3);

  const animationRef = useRef<number | undefined>(undefined);
  const layoutIterations = useRef(0);

  // Process pathogen data
  const allPathogens: Pathogen[] = useMemo(() => {
    return (simplePathogens || []).map((p: any) => ({
      id: p.commonName,
      commonName: p.commonName,
      name: p.name,
      gramStatus: p.gramStatus,
      shape: p.shape,
      severity: p.severity,
      resistance: p.resistance,
      commonSites: p.commonSites,
      description: p.description,
    }));
  }, []);

  // Generate edges
  const allEdges = useMemo(() => generateEdges(allPathogens), [allPathogens]);

  // Filter pathogens
  const filteredPathogens = useMemo(() => {
    return allPathogens.filter(p => {
      if (filterGram !== 'all' && p.gramStatus !== filterGram) return false;
      if (filterSeverity !== 'all' && p.severity !== filterSeverity) return false;
      return true;
    });
  }, [allPathogens, filterGram, filterSeverity]);

  // Filter edges
  const filteredEdges = useMemo(() => {
    const pathogenIds = new Set(filteredPathogens.map(p => p.id));
    return allEdges.filter(e =>
      pathogenIds.has(e.source) &&
      pathogenIds.has(e.target) &&
      e.weight >= edgeThreshold
    );
  }, [allEdges, filteredPathogens, edgeThreshold]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(600, rect.width - 32),
          height: Math.max(400, Math.min(700, window.innerHeight - 300)),
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize positions
  const initializePositions = useCallback(() => {
    const positions: Record<string, NodePosition> = {};
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.35;

    // Group by gram status for initial clustering
    const gramGroups: Record<string, Pathogen[]> = {
      positive: [],
      negative: [],
      other: [],
    };

    filteredPathogens.forEach(p => {
      gramGroups[p.gramStatus]?.push(p) || gramGroups.other.push(p);
    });

    // Position each group in different areas
    const groupAngles: Record<string, number> = {
      positive: -Math.PI / 3,     // Upper left
      negative: Math.PI / 3,       // Upper right
      other: Math.PI,              // Bottom
    };

    Object.entries(gramGroups).forEach(([gram, pathogens]) => {
      const baseAngle = groupAngles[gram] || 0;
      const spreadAngle = Math.PI / 3;

      pathogens.forEach((p, i) => {
        const angle = baseAngle + (Math.random() - 0.5) * spreadAngle;
        const radius = maxRadius * 0.3 + Math.random() * maxRadius * 0.5;

        positions[p.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          vx: 0,
          vy: 0,
        };
      });
    });

    return positions;
  }, [dimensions, filteredPathogens]);

  // Force simulation
  const simulateForces = useCallback((positions: Record<string, NodePosition>) => {
    const newPositions = { ...positions };

    const repulsion = 800;
    const attraction = 0.05;
    const centering = 0.01;
    const damping = 0.85;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Calculate forces
    filteredPathogens.forEach(nodeA => {
      const posA = newPositions[nodeA.id];
      if (!posA) return;

      let fx = 0, fy = 0;

      // Repulsion from other nodes
      filteredPathogens.forEach(nodeB => {
        if (nodeA.id === nodeB.id) return;
        const posB = newPositions[nodeB.id];
        if (!posB) return;

        const dx = posA.x - posB.x;
        const dy = posA.y - posB.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < 200) {
          const force = repulsion / (dist * dist);
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        }
      });

      // Attraction along edges
      filteredEdges.forEach(edge => {
        let otherId: string | null = null;
        if (edge.source === nodeA.id) otherId = edge.target;
        if (edge.target === nodeA.id) otherId = edge.source;

        if (otherId) {
          const posB = newPositions[otherId];
          if (posB) {
            const dx = posB.x - posA.x;
            const dy = posB.y - posA.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            const idealDist = 100;
            if (dist > idealDist) {
              const force = attraction * (dist - idealDist) * edge.weight;
              fx += (dx / dist) * force;
              fy += (dy / dist) * force;
            }
          }
        }
      });

      // Centering force
      fx += (centerX - posA.x) * centering;
      fy += (centerY - posA.y) * centering;

      // Update velocity and position
      posA.vx = (posA.vx + fx) * damping;
      posA.vy = (posA.vy + fy) * damping;
      posA.x += posA.vx;
      posA.y += posA.vy;

      // Keep in bounds
      const margin = 60;
      posA.x = Math.max(margin, Math.min(dimensions.width - margin, posA.x));
      posA.y = Math.max(margin, Math.min(dimensions.height - margin, posA.y));
    });

    // Calculate total movement
    let totalMovement = 0;
    Object.values(newPositions).forEach(pos => {
      totalMovement += Math.abs(pos.vx) + Math.abs(pos.vy);
    });

    return { newPositions, totalMovement };
  }, [dimensions, filteredPathogens, filteredEdges]);

  // Animation loop
  useEffect(() => {
    if (!isLayoutStable && Object.keys(nodePositions).length > 0) {
      const animate = () => {
        const { newPositions, totalMovement } = simulateForces(nodePositions);
        setNodePositions(newPositions);

        layoutIterations.current++;

        if (totalMovement < 0.5 || layoutIterations.current > 200) {
          setIsLayoutStable(true);
        } else {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [nodePositions, isLayoutStable, simulateForces]);

  // Initialize on data change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setNodePositions(initializePositions());
      setIsLayoutStable(false);
      layoutIterations.current = 0;
    }
  }, [dimensions.width, dimensions.height, filteredPathogens.length, initializePositions]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as Element).tagName === 'rect') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom(z => Math.min(z * 1.2, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z / 1.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setNodePositions(initializePositions());
    setIsLayoutStable(false);
    layoutIterations.current = 0;
  };

  // Node click handler
  const handleNodeClick = (pathogen: Pathogen) => {
    setSelectedNode(pathogen);
    onSelectPathogen?.(pathogen);
  };

  const getPosition = (id: string) => nodePositions[id] || { x: dimensions.width / 2, y: dimensions.height / 2 };

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${COLORS.bgPrimary} 0%, ${COLORS.bgSecondary} 100%)`,
        border: '1px solid rgba(59, 130, 246, 0.2)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b"
        style={{ borderColor: 'rgba(59, 130, 246, 0.15)', background: COLORS.bgTertiary }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ background: COLORS.accentGlow }}
            >
              <Network className="text-blue-400" size={24} />
            </div>
            <div>
              <h2
                className="text-xl font-bold tracking-tight"
                style={{ color: COLORS.textPrimary, fontFamily: "'JetBrains Mono', monospace" }}
              >
                Pathogen Relationship Network
              </h2>
              <p className="text-sm" style={{ color: COLORS.textMuted }}>
                {filteredPathogens.length} pathogens • {filteredEdges.length} connections
              </p>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg transition-all hover:scale-105"
              style={{ background: COLORS.bgSecondary, color: COLORS.textSecondary }}
            >
              <ZoomOut size={18} />
            </button>
            <span
              className="px-3 py-1 rounded text-sm font-mono"
              style={{ background: COLORS.bgSecondary, color: COLORS.textMuted }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg transition-all hover:scale-105"
              style={{ background: COLORS.bgSecondary, color: COLORS.textSecondary }}
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg transition-all hover:scale-105 ml-2"
              style={{ background: COLORS.bgSecondary, color: COLORS.textSecondary }}
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="p-2 rounded-lg transition-all hover:scale-105"
              style={{
                background: showLabels ? COLORS.accent : COLORS.bgSecondary,
                color: showLabels ? COLORS.textPrimary : COLORS.textSecondary
              }}
            >
              {showLabels ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={14} style={{ color: COLORS.textMuted }} />
            <select
              value={filterGram}
              onChange={(e) => setFilterGram(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm outline-none cursor-pointer"
              style={{
                background: COLORS.bgSecondary,
                color: COLORS.textPrimary,
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              <option value="all">All Gram Types</option>
              <option value="positive">Gram Positive</option>
              <option value="negative">Gram Negative</option>
              <option value="other">Atypical/Other</option>
            </select>
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm outline-none cursor-pointer"
            style={{
              background: COLORS.bgSecondary,
              color: COLORS.textPrimary,
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}
          >
            <option value="all">All Severity</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="low">Low Severity</option>
          </select>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs" style={{ color: COLORS.textMuted }}>
              Connection Threshold
            </span>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.1"
              value={edgeThreshold}
              onChange={(e) => setEdgeThreshold(parseFloat(e.target.value))}
              className="w-24 accent-blue-500"
            />
            <span
              className="text-xs font-mono w-8"
              style={{ color: COLORS.textSecondary }}
            >
              {edgeThreshold.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div
        className="px-6 py-3 flex items-center gap-6 text-xs border-b"
        style={{ borderColor: 'rgba(59, 130, 246, 0.1)', background: 'rgba(0,0,0,0.2)' }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: COLORS.gramPositive, boxShadow: `0 0 8px ${COLORS.gramPositiveGlow}` }}
            />
            <span style={{ color: COLORS.textSecondary }}>Gram +</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: COLORS.gramNegative, boxShadow: `0 0 8px ${COLORS.gramNegativeGlow}` }}
            />
            <span style={{ color: COLORS.textSecondary }}>Gram −</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: COLORS.gramOther, boxShadow: `0 0 8px ${COLORS.gramOtherGlow}` }}
            />
            <span style={{ color: COLORS.textSecondary }}>Atypical</span>
          </div>
        </div>
        <div className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <div className="flex items-center gap-2">
          <span style={{ color: COLORS.textMuted }}>Lines = shared antibiotic coverage</span>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: COLORS.severityHigh }} />
            <span style={{ color: COLORS.textMuted }}>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: COLORS.severityMedium }} />
            <span style={{ color: COLORS.textMuted }}>Med</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: COLORS.severityLow }} />
            <span style={{ color: COLORS.textMuted }}>Low</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ display: 'block' }}
        >
          {/* Definitions */}
          <defs>
            {/* Grid pattern */}
            <pattern id="enhancedGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={COLORS.grid} strokeWidth="1" />
            </pattern>
            <pattern id="enhancedGridAccent" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke={COLORS.gridAccent} strokeWidth="1" />
            </pattern>

            {/* Glow filters */}
            <filter id="glowPositive" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor={COLORS.gramPositive} floodOpacity="0.5" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowNegative" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor={COLORS.gramNegative} floodOpacity="0.5" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowOther" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor={COLORS.gramOther} floodOpacity="0.5" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect width="100%" height="100%" fill={COLORS.bgPrimary} />
          <rect width="100%" height="100%" fill="url(#enhancedGrid)" />
          <rect width="100%" height="100%" fill="url(#enhancedGridAccent)" />

          {/* Transform group for zoom/pan */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Edges */}
            <g className="edges">
              {filteredEdges.map((edge, i) => {
                const sourcePos = getPosition(edge.source);
                const targetPos = getPosition(edge.target);

                const isHighlighted = hoveredNode &&
                  (hoveredNode.id === edge.source || hoveredNode.id === edge.target);

                return (
                  <line
                    key={i}
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={isHighlighted ? COLORS.edgeStrong : COLORS.edgeWeak}
                    strokeWidth={isHighlighted ? 2 + edge.weight * 2 : 1 + edge.weight}
                    opacity={isHighlighted ? 0.9 : 0.4}
                    strokeLinecap="round"
                    style={{ transition: 'all 0.2s ease-out' }}
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g className="nodes">
              {filteredPathogens.map((pathogen) => {
                const pos = getPosition(pathogen.id);
                const color = getNodeColor(pathogen.gramStatus);
                const severityColor = getSeverityColor(pathogen.severity);
                const isHovered = hoveredNode?.id === pathogen.id;
                const isSelected = selectedNode?.id === pathogen.id;

                const baseRadius = 18;
                const radius = isHovered ? baseRadius * 1.3 : baseRadius;

                const glowFilter = pathogen.gramStatus === 'positive'
                  ? 'url(#glowPositive)'
                  : pathogen.gramStatus === 'negative'
                    ? 'url(#glowNegative)'
                    : 'url(#glowOther)';

                return (
                  <g
                    key={pathogen.id}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s ease-out' }}
                    onClick={() => handleNodeClick(pathogen)}
                    onMouseEnter={() => setHoveredNode(pathogen)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Outer glow ring */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={radius + 4}
                      fill="none"
                      stroke={color}
                      strokeWidth={isHovered || isSelected ? 2 : 1}
                      opacity={isHovered || isSelected ? 0.6 : 0.2}
                      style={{ transition: 'all 0.2s ease-out' }}
                    />

                    {/* Main node */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={radius}
                      fill={color}
                      filter={isHovered ? glowFilter : undefined}
                      style={{ transition: 'all 0.2s ease-out' }}
                    />

                    {/* Severity indicator ring */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={radius - 3}
                      fill="none"
                      stroke={severityColor}
                      strokeWidth={2}
                      strokeDasharray={pathogen.severity === 'high' ? '0' : '4 2'}
                      opacity={0.8}
                    />

                    {/* Inner highlight */}
                    <circle
                      cx={pos.x - radius * 0.3}
                      cy={pos.y - radius * 0.3}
                      r={radius * 0.25}
                      fill="white"
                      opacity={0.3}
                    />

                    {/* Label */}
                    {showLabels && (
                      <text
                        x={pos.x}
                        y={pos.y + radius + 14}
                        textAnchor="middle"
                        fill={COLORS.textPrimary}
                        fontSize="10"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="500"
                        style={{
                          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                          pointerEvents: 'none',
                        }}
                      >
                        {pathogen.commonName.length > 15
                          ? pathogen.commonName.slice(0, 12) + '...'
                          : pathogen.commonName}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        {/* Hover Tooltip */}
        {hoveredNode && (
          <div
            className="absolute pointer-events-none z-20 rounded-xl overflow-hidden"
            style={{
              left: Math.min(
                (getPosition(hoveredNode.id).x * zoom + pan.x) + 30,
                dimensions.width - 280
              ),
              top: Math.max(
                (getPosition(hoveredNode.id).y * zoom + pan.y) - 100,
                10
              ),
              background: 'linear-gradient(135deg, rgba(26, 26, 36, 0.98) 0%, rgba(10, 10, 15, 0.98) 100%)',
              border: `1px solid ${getNodeColor(hoveredNode.gramStatus)}`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${getNodeGlow(hoveredNode.gramStatus)}`,
              minWidth: '260px',
            }}
          >
            <div
              className="px-4 py-3"
              style={{
                background: `linear-gradient(90deg, ${getNodeGlow(hoveredNode.gramStatus)}, transparent)`,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <h4
                className="font-bold text-sm"
                style={{ color: COLORS.textPrimary, fontFamily: "'JetBrains Mono', monospace" }}
              >
                {hoveredNode.commonName}
              </h4>
              <p className="text-xs italic" style={{ color: COLORS.textMuted }}>
                {hoveredNode.name}
              </p>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span style={{ color: COLORS.textMuted }}>Gram Status</span>
                  <div
                    className="font-medium mt-1 capitalize"
                    style={{ color: getNodeColor(hoveredNode.gramStatus) }}
                  >
                    {hoveredNode.gramStatus}
                  </div>
                </div>
                <div>
                  <span style={{ color: COLORS.textMuted }}>Severity</span>
                  <div
                    className="font-medium mt-1 capitalize"
                    style={{ color: getSeverityColor(hoveredNode.severity) }}
                  >
                    {hoveredNode.severity}
                  </div>
                </div>
              </div>

              {hoveredNode.commonSites && hoveredNode.commonSites.length > 0 && (
                <div className="text-xs">
                  <span style={{ color: COLORS.textMuted }}>Common Sites</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {hoveredNode.commonSites.slice(0, 3).map((site, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: COLORS.textSecondary
                        }}
                      >
                        {site}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hoveredNode.description && (
                <p
                  className="text-xs leading-relaxed pt-2 border-t"
                  style={{
                    color: COLORS.textMuted,
                    borderColor: 'rgba(255,255,255,0.1)'
                  }}
                >
                  {hoveredNode.description.slice(0, 120)}...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {!isLayoutStable && (
          <div
            className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs"
            style={{ background: COLORS.bgTertiary, color: COLORS.textMuted }}
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Optimizing layout...
          </div>
        )}
      </div>

      {/* Footer info */}
      <div
        className="px-6 py-3 text-xs border-t"
        style={{ borderColor: 'rgba(59, 130, 246, 0.1)', color: COLORS.textMuted }}
      >
        <span>Click nodes to select • Drag to pan • Scroll to zoom • </span>
        <span>Lines show shared antibiotic coverage between pathogens</span>
      </div>
    </div>
  );
};

export default PathogenNetworkVisualizationEnhanced;
