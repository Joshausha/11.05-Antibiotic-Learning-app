/**
 * CytoscapeWrapper.js - Medical-Grade Network Visualization Component
 * 
 * Advanced React wrapper for Cytoscape.js optimized for medical education networks.
 * Handles biological layout algorithms, clinical data visualization, and accessibility.
 * 
 * @module CytoscapeWrapper
 * @version 1.0.0
 * @created 2025-08-27
 * @medical-validation Required - All pathogen relationships must be clinically accurate
 * @performance-target <2s load time, 60fps interactions
 * @accessibility WCAG 2.1 AA compliant
 */

import React, { useRef, useEffect, useState, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import PropTypes from 'prop-types';

// Import biological layout algorithms
import fcose from 'cytoscape-fcose';
import cola from 'cytoscape-cola';  
import dagre from 'cytoscape-dagre';
import coseBilkent from 'cytoscape-cose-bilkent';

// Register layout algorithms with Cytoscape
cytoscape.use(fcose);
cytoscape.use(cola);
cytoscape.use(dagre);
cytoscape.use(coseBilkent);

/**
 * Default biological network styling optimized for medical education
 */
const DEFAULT_MEDICAL_STYLE = [
  {
    selector: 'node[type="pathogen"]',
    style: {
      'width': 'data(size)',
      'height': 'data(size)',
      'background-color': 'data(color)',
      'border-width': 2,
      'border-color': '#333',
      'label': 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '12px',
      'font-weight': 'bold',
      'font-family': 'system-ui, -apple-system, sans-serif',
      'color': '#000',
      'text-outline-width': 2,
      'text-outline-color': '#fff',
      'overlay-color': '#4B0082',
      'overlay-opacity': 0,
      'transition-property': 'overlay-opacity, border-width',
      'transition-duration': '0.2s'
    }
  },
  {
    selector: 'node[type="antibiotic"]',
    style: {
      'width': 40,
      'height': 40,
      'background-color': '#10B981',
      'border-width': 2,
      'border-color': '#059669',
      'label': 'data(label)',
      'text-valign': 'bottom',
      'text-margin-y': 5,
      'font-size': '10px',
      'font-weight': '500',
      'color': '#059669',
      'shape': 'rectangle'
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 'data(weight)',
      'line-color': 'data(color)',
      'target-arrow-color': 'data(color)',
      'target-arrow-shape': 'triangle',
      'arrow-scale': 1.2,
      'curve-style': 'bezier',
      'opacity': 0.8,
      'transition-property': 'opacity, width',
      'transition-duration': '0.2s'
    }
  },
  // Evidence Level Visual Indicators
  {
    selector: 'edge[evidenceLevel = "A"]',
    style: {
      'line-color': '#10b981', // Strong green for Grade A evidence (RCTs)
      'target-arrow-color': '#10b981',
      'width': 4,
      'line-style': 'solid',
      'opacity': 0.9,
      'z-index': 10
    }
  },
  {
    selector: 'edge[evidenceLevel = "B"]',
    style: {
      'line-color': '#3b82f6', // Blue for Grade B evidence (moderate)
      'target-arrow-color': '#3b82f6',
      'width': 3,
      'line-style': 'solid',
      'opacity': 0.8,
      'z-index': 9
    }
  },
  {
    selector: 'edge[evidenceLevel = "C"]',
    style: {
      'line-color': '#f59e0b', // Amber for Grade C evidence (limited)
      'target-arrow-color': '#f59e0b',
      'width': 2,
      'line-style': 'dashed',
      'opacity': 0.7,
      'z-index': 8
    }
  },
  {
    selector: 'edge[evidenceLevel = "D"], edge[evidenceLevel = "EXPERT"]',
    style: {
      'line-color': '#ef4444', // Red for Grade D/Expert opinion
      'target-arrow-color': '#ef4444',
      'width': 2,
      'line-style': 'dotted',
      'opacity': 0.6,
      'z-index': 7
    }
  },
  {
    selector: 'edge[evidenceLevel = "UNKNOWN"]',
    style: {
      'line-color': '#6b7280', // Gray for unknown evidence level
      'target-arrow-color': '#6b7280',
      'width': 1.5,
      'line-style': 'dashed',
      'opacity': 0.5,
      'z-index': 6
    }
  },
  {
    selector: 'node:selected',
    style: {
      'overlay-opacity': 0.2,
      'border-width': 4,
      'border-color': '#4B0082'
    }
  },
  {
    selector: 'node:hover',
    style: {
      'overlay-opacity': 0.1,
      'border-width': 3
    }
  },
  {
    selector: 'edge:selected',
    style: {
      'opacity': 1,
      'width': 'calc(data(weight) + 2)'
    }
  }
];

/**
 * Biological layout configuration optimized for pathogen-antibiotic networks
 */
const DEFAULT_BIOLOGICAL_LAYOUT = {
  name: 'fcose',
  quality: 'proof',
  randomize: false,
  animate: true,
  animationDuration: 1000,
  fit: true,
  padding: 30,
  nodeDimensionsIncludeLabels: true,
  uniformNodeDimensions: false,
  packComponents: true,
  // Medical clustering parameters
  idealEdgeLength: 100,
  nodeRepulsion: 4500,
  edgeElasticity: 0.45,
  nestingFactor: 0.1,
  gravity: 0.25,
  numIter: 2500,
  // Biological network optimization
  tile: true,
  tilingPaddingVertical: 10,
  tilingPaddingHorizontal: 10
};

/**
 * Error Boundary for Cytoscape network failures
 */
class NetworkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Cytoscape Network Error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="network-error-fallback p-8 text-center bg-red-50 border border-red-200 rounded-lg"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-red-800 text-lg font-semibold mb-2">
            Network Visualization Error
          </div>
          <div className="text-red-600 text-sm mb-4">
            Unable to render the pathogen-antibiotic network. Please refresh and try again.
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            aria-label="Retry network visualization"
          >
            Retry Visualization
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-red-700 font-medium">
                Error Details (Development)
              </summary>
              <pre className="mt-2 p-4 bg-red-100 rounded text-xs text-red-800 overflow-auto">
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Performance monitoring hook for clinical environments
 */
const useNetworkPerformance = (cyRef, isReady) => {
  const [performance, setPerformance] = useState({
    renderTime: 0,
    nodeCount: 0,
    edgeCount: 0,
    fps: 60,
    memoryUsage: 0
  });

  useEffect(() => {
    if (!isReady || !cyRef.current) return;

    const cy = cyRef.current;
    const startTime = performance.now();

    // Monitor rendering performance
    cy.ready(() => {
      const renderTime = performance.now() - startTime;
      setPerformance(prev => ({
        ...prev,
        renderTime,
        nodeCount: cy.nodes().length,
        edgeCount: cy.edges().length
      }));
    });

    // Monitor frame rate during interactions
    let frameCount = 0;
    let lastTime = performance.now();

    const monitorFPS = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        setPerformance(prev => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (currentTime - lastTime))
        }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitorFPS);
    };

    const rafId = requestAnimationFrame(monitorFPS);
    return () => cancelAnimationFrame(rafId);
  }, [isReady]);

  return performance;
};

/**
 * CytoscapeWrapper - Core medical network visualization component
 */
const CytoscapeWrapper = forwardRef(({
  elements = [],
  layout = DEFAULT_BIOLOGICAL_LAYOUT,
  style = DEFAULT_MEDICAL_STYLE,
  className = '',
  width = '100%',
  height = '600px',
  onNodeSelect,
  onEdgeSelect,
  onLayoutComplete,
  onError,
  enablePerformanceMonitoring = true,
  accessibilityLabel = 'Medical network visualization',
  loadingComponent = null,
  ...props
}, ref) => {
  const cyRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Performance monitoring for clinical environments
  const performanceMetrics = useNetworkPerformance(cyRef, isReady);

  // Memoize style to prevent unnecessary re-renders
  const memoizedStyle = useMemo(() => style, [style]);
  
  // Memoize layout to prevent unnecessary recalculations
  const memoizedLayout = useMemo(() => ({
    ...DEFAULT_BIOLOGICAL_LAYOUT,
    ...layout
  }), [layout]);

  /**
   * Initialize Cytoscape instance with medical optimizations
   */
  const initializeCytoscape = useCallback((cy) => {
    if (!cy) return;

    try {
      cyRef.current = cy;
      
      // Medical interaction handlers
      cy.on('tap', 'node', (evt) => {
        const node = evt.target;
        const medicalData = {
          id: node.data('id'),
          type: node.data('type'),
          label: node.data('label'),
          gramStatus: node.data('gramStatus'),
          clinicalSeverity: node.data('clinicalSeverity'),
          resistancePatterns: node.data('resistancePatterns'),
          basicInfo: node.data('basicInfo'),
          clinicalInfo: node.data('clinicalInfo')
        };
        
        onNodeSelect?.(medicalData, evt);
      });

      cy.on('tap', 'edge', (evt) => {
        const edge = evt.target;
        const relationshipData = {
          id: edge.data('id'),
          source: edge.data('source'),
          target: edge.data('target'),
          effectiveness: edge.data('effectiveness'),
          evidenceLevel: edge.data('evidenceLevel'),
          guidelines: edge.data('guidelines'),
          notes: edge.data('notes'),
          contraindications: edge.data('contraindications')
        };
        
        onEdgeSelect?.(relationshipData, evt);
      });

      // Layout completion handler for medical workflow optimization
      cy.on('layoutstop', () => {
        onLayoutComplete?.(performanceMetrics);
      });

      // Accessibility enhancements
      cy.container().setAttribute('aria-label', accessibilityLabel);
      cy.container().setAttribute('role', 'img');
      cy.container().setAttribute('tabindex', '0');

      setIsReady(true);
      setIsLoading(false);
      
    } catch (err) {
      console.error('Cytoscape initialization error:', err);
      setError(err);
      setIsLoading(false);
      onError?.(err);
    }
  }, [onNodeSelect, onEdgeSelect, onLayoutComplete, onError, accessibilityLabel, performanceMetrics]);

  /**
   * Imperative handle for external control
   */
  useImperativeHandle(ref, () => ({
    getCytoscape: () => cyRef.current,
    getPerformanceMetrics: () => performanceMetrics,
    fit: () => cyRef.current?.fit(),
    center: () => cyRef.current?.center(),
    reset: () => cyRef.current?.reset(),
    png: (options) => cyRef.current?.png(options),
    jpg: (options) => cyRef.current?.jpg(options),
    // Medical-specific methods
    highlightPathogen: (pathogenId) => {
      const cy = cyRef.current;
      if (!cy) return;
      
      cy.nodes().removeClass('highlighted');
      cy.edges().removeClass('highlighted');
      
      const pathogen = cy.getElementById(pathogenId);
      pathogen.addClass('highlighted');
      pathogen.connectedEdges().addClass('highlighted');
    },
    filterByGramStain: (gramStatus) => {
      const cy = cyRef.current;
      if (!cy) return;
      
      cy.nodes().show();
      if (gramStatus !== 'all') {
        cy.nodes(`[gramStatus != "${gramStatus}"]`).hide();
      }
    },
    showResistancePatterns: (enabled) => {
      const cy = cyRef.current;
      if (!cy) return;
      
      if (enabled) {
        cy.edges('[effectiveness = "resistant"]').style('line-color', '#DC2626');
      } else {
        cy.edges().style('line-color', 'data(color)');
      }
    }
  }));

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={`cytoscape-container ${className} flex items-center justify-center`}
        style={{ width, height }}
        data-testid="cytoscape-loading"
      >
        {loadingComponent || (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600">Loading medical network...</div>
          </div>
        )}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className={`cytoscape-container ${className} flex items-center justify-center`}
        style={{ width, height }}
        data-testid="cytoscape-error"
      >
        <NetworkErrorBoundary onError={onError}>
          <div className="text-center text-red-600">
            <div className="text-lg font-semibold mb-2">Network Error</div>
            <div className="text-sm">{error.message}</div>
          </div>
        </NetworkErrorBoundary>
      </div>
    );
  }

  return (
    <NetworkErrorBoundary onError={onError}>
      <div 
        className={`cytoscape-container ${className}`}
        style={{ width, height }}
        data-testid="cytoscape-container"
      >
        <CytoscapeComponent
          elements={elements}
          layout={memoizedLayout}
          style={memoizedStyle}
          cy={initializeCytoscape}
          stylesheet={memoizedStyle}
          {...props}
        />
        {isReady && (
          <div data-testid="network-ready" style={{ display: 'none' }} />
        )}
        
        {/* Performance monitoring overlay for development */}
        {process.env.NODE_ENV === 'development' && enablePerformanceMonitoring && isReady && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
            <div>Render: {performanceMetrics.renderTime.toFixed(1)}ms</div>
            <div>Nodes: {performanceMetrics.nodeCount}</div>
            <div>Edges: {performanceMetrics.edgeCount}</div>
            <div>FPS: {performanceMetrics.fps}</div>
          </div>
        )}
      </div>
    </NetworkErrorBoundary>
  );
});

CytoscapeWrapper.displayName = 'CytoscapeWrapper';

/**
 * Comprehensive PropTypes for medical network visualization
 */
CytoscapeWrapper.propTypes = {
  /** Array of Cytoscape elements (nodes and edges) */
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.object.isRequired,
      group: PropTypes.oneOf(['nodes', 'edges'])
    })
  ),
  /** Cytoscape layout configuration */
  layout: PropTypes.object,
  /** Cytoscape style configuration */
  style: PropTypes.array,
  /** CSS class name */
  className: PropTypes.string,
  /** Container width */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Container height */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Node selection callback */
  onNodeSelect: PropTypes.func,
  /** Edge selection callback */
  onEdgeSelect: PropTypes.func,
  /** Layout completion callback */
  onLayoutComplete: PropTypes.func,
  /** Error handling callback */
  onError: PropTypes.func,
  /** Enable performance monitoring */
  enablePerformanceMonitoring: PropTypes.bool,
  /** Accessibility label */
  accessibilityLabel: PropTypes.string,
  /** Custom loading component */
  loadingComponent: PropTypes.node
};

export default CytoscapeWrapper;