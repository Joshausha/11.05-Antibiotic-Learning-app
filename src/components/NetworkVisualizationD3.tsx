/**
 * Network Visualization D3.js Component
 *
 * Renders pathogen relationship networks using D3.js with three layout options:
 * 1. Force-Directed - Natural clustering based on antibiotic similarity
 * 2. Hierarchical - Arranged by clinical severity tiers
 * 3. Circular - Organized by Gram stain classification
 *
 * Features:
 * - Real-time layout switching
 * - Interactive node hover and selection
 * - Medical color-coding by severity and classification
 * - Performance metrics display
 * - Responsive canvas sizing
 *
 * Medical Integration:
 * - Node color reflects severity (high=red, medium=yellow, low=green)
 * - Node size reflects relationship count
 * - Edge width reflects similarity coefficient
 * - Gram stain grouping supports pattern recognition learning
 */

import React, { useState, useEffect, useRef, FC, ReactElement } from 'react';
import * as d3 from 'd3';
import { NetworkLayoutEngine } from '../utils/NetworkLayoutEngine';
import { getPathogenRelationships } from '../data/PathogenRelationshipData';
import simplePathogens from '../data/SimplePathogenData';
import '../styles/NetworkVisualizationD3.css';

// Types
interface Pathogen {
  id: string;
  name: string;
  gramStain: string;
  severity: 'high' | 'medium' | 'low';
  tier?: string;
  sector?: string;
  x?: number;
  y?: number;
}

interface Edge {
  source: string | Pathogen;
  sourceId?: string;
  target: string | Pathogen;
  targetId?: string;
  similarity?: number;
  strength?: number;
  relationshipType: 'strong' | 'medium' | 'weak';
  sharedAntibiotics?: string[];
  clinicalRationale?: string;
  medicalSource?: string;
}

interface Layout {
  nodes: Pathogen[];
  edges: Edge[];
}

interface PerformanceMetrics {
  forceDirected?: number;
  hierarchical?: number;
  circular?: number;
  summary?: {
    averageTime?: number;
    fastestLayout?: string;
  };
}

interface Tooltip {
  x: number;
  y: number;
  content: ReactElement;
  type: 'node' | 'edge';
  edge?: Edge;
  source?: Pathogen;
  target?: Pathogen;
}

interface SeverityFilters {
  [key: string]: boolean;
}

interface GramStainFilters {
  [key: string]: boolean;
}

interface NetworkVisualizationD3Props {
  layoutType?: 'force' | 'hierarchical' | 'circular';
  showMetrics?: boolean;
  width?: number;
  height?: number;
  onNodeClick?: (node: Pathogen) => void;
}

const NetworkVisualizationD3: FC<NetworkVisualizationD3Props> = ({
  layoutType = 'force',
  showMetrics = true,
  width = 800,
  height = 600,
  onNodeClick = null,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentLayout, setCurrentLayout] = useState<'force' | 'hierarchical' | 'circular'>(layoutType);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [selectedNode, setSelectedNode] = useState<Pathogen | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Pathogen | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.3);
  const [severityFilters, setSeverityFilters] = useState<SeverityFilters>({
    high: true,
    medium: true,
    low: true,
  });
  const [gramStainFilters, setGramStainFilters] = useState<GramStainFilters>({
    'Gram+': true,
    'Gram-': true,
    'Atypical': true,
    'Other': true,
  });
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [expandedTooltip, setExpandedTooltip] = useState<{
    edge: Edge;
    source?: Pathogen;
    target?: Pathogen;
  } | null>(null);
  const engineRef = useRef<any>(null);

  /**
   * Initialize layout engine and compute initial layout
   */
  useEffect(() => {
    const relationships = getPathogenRelationships();
    engineRef.current = new NetworkLayoutEngine(relationships, { width, height });

    computeLayout(layoutType);
    setIsLoading(false);
  }, [width, height]);

  /**
   * Compute layout using specified algorithm
   */
  const computeLayout = (type: 'force' | 'hierarchical' | 'circular'): void => {
    if (!engineRef.current) return;

    let newLayout: Layout;
    switch (type) {
      case 'hierarchical':
        newLayout = engineRef.current.hierarchicalLayout();
        break;
      case 'circular':
        newLayout = engineRef.current.circularLayout();
        break;
      case 'force':
      default:
        newLayout = engineRef.current.forceDirectedLayout({
          iterations: 300,
        });
        break;
    }

    setLayout(newLayout);
    setMetrics(engineRef.current.getPerformanceMetrics());
    setCurrentLayout(type);
    setSelectedNode(null);
    setHoveredNode(null);
  };

  /**
   * Handle layout type change
   */
  const handleLayoutChange = (newType: 'force' | 'hierarchical' | 'circular'): void => {
    if (newType !== currentLayout) {
      computeLayout(newType);
    }
  };

  /**
   * Handle severity filter change
   */
  const handleSeverityFilterChange = (severity: string): void => {
    setSeverityFilters((prev) => ({
      ...prev,
      [severity]: !prev[severity],
    }));
  };

  /**
   * Handle Gram stain filter change
   */
  const handleGramStainFilterChange = (gramStain: string): void => {
    setGramStainFilters((prev) => ({
      ...prev,
      [gramStain]: !prev[gramStain],
    }));
  };

  /**
   * Reset all filters to default state
   */
  const resetFilters = (): void => {
    setSeverityFilters({ high: true, medium: true, low: true });
    setGramStainFilters({
      'Gram+': true,
      'Gram-': true,
      'Atypical': true,
      'Other': true,
    });
    setSimilarityThreshold(0.3);
  };

  /**
   * Show node hover tooltip
   */
  const showNodeTooltip = (
    event: React.MouseEvent,
    node: Pathogen,
    layout: Layout,
    filteredEdges: Edge[]
  ): void => {
    const degree = filteredEdges.filter(
      (e) =>
        (e.source === node.id || e.sourceId === node.id) ||
        (e.target === node.id || e.targetId === node.id)
    ).length;

    setTooltip({
      x: event.pageX + 10,
      y: event.pageY + 10,
      content: (
        <div className="tooltip-content">
          <strong>{node.name}</strong>
          <p>Gram Stain: {node.gramStain}</p>
          <p>Severity: {node.severity}</p>
          <p>Relationships: {degree}</p>
        </div>
      ),
      type: 'node',
    });
  };

  /**
   * Show edge hover tooltip
   */
  const showEdgeTooltip = (event: React.MouseEvent, edge: Edge, layout: Layout): void => {
    const source = layout.nodes.find((n) => n.id === (edge.source || edge.sourceId));
    const target = layout.nodes.find((n) => n.id === (edge.target || edge.targetId));
    const similarity = ((edge.similarity || edge.strength || 0) as number).toFixed(2);
    const sharedCount = (edge.sharedAntibiotics || []).length;

    setTooltip({
      x: event.pageX + 10,
      y: event.pageY + 10,
      content: (
        <div className="tooltip-content">
          <strong>
            {source?.name} ↔ {target?.name}
          </strong>
          <p>Similarity: {similarity}</p>
          <p>Type: {edge.relationshipType}</p>
          <p>Shared Antibiotics: {sharedCount}</p>
          {edge.clinicalRationale && (
            <p className="rationale">{edge.clinicalRationale.substring(0, 100)}...</p>
          )}
          <small className="click-hint">Click for full details</small>
        </div>
      ),
      type: 'edge',
      edge: edge,
      source: source,
      target: target,
    });
  };

  /**
   * Hide tooltip
   */
  const hideTooltip = (): void => {
    setTooltip(null);
  };

  /**
   * Render the network visualization
   */
  useEffect(() => {
    if (!layout || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create main group with zoom support
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event: any) => {
      g.attr('transform', event.transform);
    });
    svg.call(zoom);

    // Filter nodes based on severity and Gram stain
    const filteredNodes = layout.nodes.filter((node) => {
      if (!severityFilters[node.severity]) return false;
      if (!gramStainFilters[node.gramStain]) return false;
      return true;
    });

    // Get visible node IDs for edge filtering
    const visibleNodeIds = filteredNodes.map((n) => n.id);

    // Filter edges based on similarity threshold and visible nodes
    const filteredEdges = layout.edges.filter((edge) => {
      if (((edge.similarity || edge.strength || 0) as number) < similarityThreshold)
        return false;
      const sourceId = (edge.source as string) || edge.sourceId;
      const targetId = (edge.target as string) || edge.targetId;
      return visibleNodeIds.includes(sourceId as string) && visibleNodeIds.includes(targetId as string);
    });

    // Draw edges (links)
    g.selectAll('.link')
      .data(filteredEdges)
      .enter()
      .append('line')
      .attr('class', 'network-link')
      .attr('x1', (d) => {
        const source = layout.nodes.find(
          (n) => n.id === (d.source as string) || n.id === d.sourceId
        );
        return source?.x || 0;
      })
      .attr('y1', (d) => {
        const source = layout.nodes.find(
          (n) => n.id === (d.source as string) || n.id === d.sourceId
        );
        return source?.y || 0;
      })
      .attr('x2', (d) => {
        const target = layout.nodes.find(
          (n) => n.id === (d.target as string) || n.id === d.targetId
        );
        return target?.x || 0;
      })
      .attr('y2', (d) => {
        const target = layout.nodes.find(
          (n) => n.id === (d.target as string) || n.id === d.targetId
        );
        return target?.y || 0;
      })
      .attr('stroke-width', (d) => {
        const similarity = (d.similarity || d.strength || 0.5) as number;
        return 1 + similarity * 3;
      })
      .attr('stroke', (d) => {
        if (d.relationshipType === 'strong') return '#c41e3a';
        if (d.relationshipType === 'medium') return '#f39c12';
        return '#95a5a6';
      })
      .attr('opacity', 0.6)
      .style('cursor', 'pointer')
      .on('mouseenter', (event: any, d: Edge) => {
        showEdgeTooltip(event, d, layout);
        d3.select(event.currentTarget).attr('stroke-width', (w: any) => w + 2).attr('opacity', 0.9);
      })
      .on('mouseleave', (event: any, d: Edge) => {
        hideTooltip();
        const similarity = ((d as Edge).similarity || (d as Edge).strength || 0.5) as number;
        d3.select(event.currentTarget)
          .attr('stroke-width', 1 + similarity * 3)
          .attr('opacity', 0.6);
      })
      .on('click', (event: any, d: Edge) => {
        event.stopPropagation();
        const source = layout.nodes.find(
          (n) => n.id === ((d.source as string) || d.sourceId)
        );
        const target = layout.nodes.find(
          (n) => n.id === ((d.target as string) || d.targetId)
        );
        setExpandedTooltip({
          edge: d,
          source: source,
          target: target,
        });
      });

    // Draw nodes
    g.selectAll('.node')
      .data(filteredNodes)
      .enter()
      .append('circle')
      .attr('class', 'network-node')
      .attr('cx', (d) => d.x || 0)
      .attr('cy', (d) => d.y || 0)
      .attr('r', (d) => {
        // Size based on degree (relationship count in filtered edges)
        const degree = filteredEdges.filter(
          (e) =>
            (e.source === d.id || e.sourceId === d.id) ||
            (e.target === d.id || e.targetId === d.id)
        ).length;
        return 8 + degree * 0.5;
      })
      .attr('fill', (d) => {
        if (selectedNode?.id === d.id) return '#2c3e50';
        if (hoveredNode?.id === d.id) return '#3498db';
        if (d.severity === 'high') return '#e74c3c';
        if (d.severity === 'medium') return '#f39c12';
        return '#27ae60';
      })
      .attr('stroke', (d) => {
        if (selectedNode?.id === d.id) return '#2980b9';
        return '#34495e';
      })
      .attr('stroke-width', (d) => (selectedNode?.id === d.id ? 3 : 1.5))
      .style('cursor', 'pointer')
      .on('click', (event: any, d: Pathogen) => {
        event.stopPropagation();
        setSelectedNode(d);
        // Call onNodeClick callback if provided (for ClinicalDecisionTree integration)
        if (onNodeClick) {
          onNodeClick(d);
        }
      })
      .on('mouseenter', (event: any, d: Pathogen) => {
        setHoveredNode(d);
        showNodeTooltip(event, d, layout, filteredEdges);
        d3.select(event.currentTarget)
          .transition()
          .duration(100)
          .attr('r', (current: any) => current + 3);
      })
      .on('mouseleave', (event: any, d: Pathogen) => {
        setHoveredNode(null);
        hideTooltip();
        d3.select(event.currentTarget)
          .transition()
          .duration(100)
          .attr('r', (current: any) => {
            const degree = filteredEdges.filter(
              (e) =>
                (e.source === d.id || e.sourceId === d.id) ||
                (e.target === d.id || e.targetId === d.id)
            ).length;
            return 8 + degree * 0.5;
          });
      });

    // Add node labels
    g.selectAll('.node-label')
      .data(filteredNodes)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('x', (d) => d.x || 0)
      .attr('y', (d) => (d.y || 0) + 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('fill', '#2c3e50')
      .attr('pointer-events', 'none')
      .text((d) => d.name.substring(0, 10))
      .attr('opacity', 0.8);

    // Click to deselect
    svg.on('click', () => {
      setSelectedNode(null);
      hideTooltip();
    });
  }, [
    layout,
    selectedNode,
    hoveredNode,
    similarityThreshold,
    severityFilters,
    gramStainFilters,
    tooltip,
    onNodeClick,
  ]);

  /**
   * Get severity color for consistency
   */
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  if (isLoading) {
    return (
      <div className="network-visualization-loading">
        <p>Loading network visualization...</p>
      </div>
    );
  }

  return (
    <div className="network-visualization-container">
      {/* Control Panel */}
      <div className="network-controls">
        <div className="layout-buttons">
          <button
            className={`layout-btn ${currentLayout === 'force' ? 'active' : ''}`}
            onClick={() => handleLayoutChange('force')}
          >
            Force-Directed
          </button>
          <button
            className={`layout-btn ${currentLayout === 'hierarchical' ? 'active' : ''}`}
            onClick={() => handleLayoutChange('hierarchical')}
          >
            Hierarchical
          </button>
          <button
            className={`layout-btn ${currentLayout === 'circular' ? 'active' : ''}`}
            onClick={() => handleLayoutChange('circular')}
          >
            Circular
          </button>
        </div>

        {/* Similarity Threshold Slider */}
        <div className="similarity-filter">
          <label htmlFor="threshold-slider">
            Similarity Threshold:{' '}
            <span className="threshold-value">{similarityThreshold.toFixed(2)}</span>
          </label>
          <input
            id="threshold-slider"
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={similarityThreshold}
            onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
            className="threshold-slider"
            title="Show relationships with similarity >= this value"
          />
          <div className="threshold-info">
            Showing edges with Jaccard coefficient ≥ {similarityThreshold.toFixed(2)}
          </div>
        </div>

        {/* Node Filters */}
        <div className="node-filters">
          <div className="filter-section">
            <h4>Filter by Severity</h4>
            <div className="filter-checkboxes">
              <label>
                <input
                  type="checkbox"
                  checked={severityFilters.high}
                  onChange={() => handleSeverityFilterChange('high')}
                  className="filter-checkbox"
                />
                <span className="checkbox-label">
                  <span className="severity-dot high"></span>High
                </span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={severityFilters.medium}
                  onChange={() => handleSeverityFilterChange('medium')}
                  className="filter-checkbox"
                />
                <span className="checkbox-label">
                  <span className="severity-dot medium"></span>Medium
                </span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={severityFilters.low}
                  onChange={() => handleSeverityFilterChange('low')}
                  className="filter-checkbox"
                />
                <span className="checkbox-label">
                  <span className="severity-dot low"></span>Low
                </span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h4>Filter by Gram Stain</h4>
            <div className="filter-checkboxes">
              {['Gram+', 'Gram-', 'Atypical', 'Other'].map((gramStain) => (
                <label key={gramStain}>
                  <input
                    type="checkbox"
                    checked={gramStainFilters[gramStain]}
                    onChange={() => handleGramStainFilterChange(gramStain)}
                    className="filter-checkbox"
                  />
                  <span className="checkbox-label">{gramStain}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={resetFilters} className="reset-filters-btn">
            Reset Filters
          </button>
        </div>

        {/* Legend */}
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#e74c3c' }}></div>
            <span>High Severity</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f39c12' }}></div>
            <span>Medium Severity</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#27ae60' }}></div>
            <span>Low Severity</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg ref={svgRef} className="network-svg" width={width} height={height} />

      {/* Selected Node Info Panel */}
      {selectedNode && (
        <div className="node-info-panel">
          <button className="close-btn" onClick={() => setSelectedNode(null)}>
            ✕
          </button>
          <h3>{selectedNode.name}</h3>
          <div className="node-details">
            <p>
              <strong>ID:</strong> {selectedNode.id}
            </p>
            <p>
              <strong>Gram Stain:</strong> {selectedNode.gramStain}
            </p>
            <p>
              <strong>Severity:</strong> {selectedNode.severity}
            </p>
            {selectedNode.tier && (
              <p>
                <strong>Tier:</strong> {selectedNode.tier}
              </p>
            )}
            {selectedNode.sector && (
              <p>
                <strong>Sector:</strong> {selectedNode.sector}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {showMetrics && metrics && (
        <div className="metrics-panel">
          <h4>Performance Metrics</h4>
          <div className="metrics-content">
            <p>Force-Directed: {(metrics.forceDirected || 0).toFixed(1)}ms</p>
            <p>Hierarchical: {(metrics.hierarchical || 0).toFixed(1)}ms</p>
            <p>Circular: {(metrics.circular || 0).toFixed(1)}ms</p>
            {metrics.summary && (
              <>
                <p className="metric-average">Avg: {(metrics.summary.averageTime || 0).toFixed(1)}ms</p>
                <p className="metric-fastest">Fastest: {metrics.summary.fastestLayout}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hover Tooltip */}
      {tooltip && (
        <div
          className="network-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Expanded Tooltip Panel */}
      {expandedTooltip && (
        <div className="expanded-tooltip-panel">
          <button className="close-btn" onClick={() => setExpandedTooltip(null)}>
            ✕
          </button>
          <h3>Pathogen Relationship Details</h3>
          <div className="expanded-tooltip-content">
            <p>
              <strong>Source:</strong> {expandedTooltip.source?.name}
            </p>
            <p>
              <strong>Target:</strong> {expandedTooltip.target?.name}
            </p>
            <p>
              <strong>Similarity Coefficient:</strong>{' '}
              {((expandedTooltip.edge.similarity ||
                expandedTooltip.edge.strength ||
                0) as number).toFixed(3)}
            </p>
            <p>
              <strong>Relationship Type:</strong> {expandedTooltip.edge.relationshipType}
            </p>
            <p>
              <strong>Shared Antibiotics:</strong>{' '}
              {(expandedTooltip.edge.sharedAntibiotics || []).join(', ') || 'None'}
            </p>
            {expandedTooltip.edge.clinicalRationale && (
              <>
                <h4>Clinical Rationale</h4>
                <p>{expandedTooltip.edge.clinicalRationale}</p>
              </>
            )}
            {expandedTooltip.edge.medicalSource && (
              <>
                <h4>Source</h4>
                <p>{expandedTooltip.edge.medicalSource}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkVisualizationD3;
