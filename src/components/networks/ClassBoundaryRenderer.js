/**
 * ClassBoundaryRenderer.js - Visual Class Boundary System
 * 
 * Northwestern Coverage Wheel Implementation - Day 6 Afternoon Session 1
 * Creates visual boundaries around antibiotic class clusters for enhanced medical education
 * 
 * Educational Focus:
 * - Clear visual groupings of antibiotic classes
 * - Northwestern-style medical education design principles
 * - Non-intrusive boundaries that enhance rather than distract
 * - Accessibility-compliant color contrast and labeling
 * 
 * Medical Accuracy: Uses class data from AntibioticClassData.js
 * Performance: Lightweight rendering with minimal visual impact
 */

import { CLASS_CLUSTER_POSITIONS } from './AntibioticClassClustering';

/**
 * Style configuration for class boundaries
 * Northwestern medical education optimized design
 */
const BOUNDARY_STYLES = {
  default: {
    shape: 'round-rectangle',
    backgroundOpacity: 0.05,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderOpacity: 0.3,
    textValign: 'top',
    textMarginY: -15,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
    zIndex: -1,
    selectable: false,
    grabbable: false
  },
  hover: {
    backgroundOpacity: 0.08,
    borderOpacity: 0.5,
    borderWidth: 3,
    color: '#333'
  },
  highlighted: {
    backgroundOpacity: 0.12,
    borderOpacity: 0.7,
    borderWidth: 4,
    shadowBlur: 8,
    shadowOpacity: 0.3
  }
};

/**
 * Renders visual boundaries around antibiotic class clusters
 * Creates dashed boundary boxes with educational labels
 * 
 * @param {Object} cy - Cytoscape instance
 * @param {Object} options - Rendering options
 * @returns {Object} - Rendering results with statistics
 */
export const renderClassBoundaries = (cy, options = {}) => {
  const {
    showLabels = true,
    interactive = true,
    fadeUnselected = false,
    customStyles = {}
  } = options;

  if (!cy) {
    console.warn('Cytoscape instance not provided to renderClassBoundaries');
    return { success: false, error: 'No Cytoscape instance' };
  }

  const renderingStats = {
    boundariesCreated: 0,
    visibleClasses: [],
    totalClasses: Object.keys(CLASS_CLUSTER_POSITIONS).length,
    renderingTime: 0
  };

  const startTime = performance.now();

  try {
    // Remove existing boundaries
    cy.remove('.class-boundary');

    // Get all antibiotic nodes to determine which classes are present
    const antibioticNodes = cy.nodes('[type="antibiotic"]');
    const presentClasses = new Set();
    
    antibioticNodes.forEach(node => {
      const antibioticClass = node.data('antibioticClass');
      if (antibioticClass && antibioticClass !== 'unknown') {
        presentClasses.add(antibioticClass);
      }
    });

    // Create boundaries only for present classes
    presentClasses.forEach(className => {
      const clusterPos = CLASS_CLUSTER_POSITIONS[className];
      if (!clusterPos) return;

      // Calculate optimal boundary size based on nodes in cluster
      const classNodes = cy.nodes(`[antibioticClass = "${className}"]`);
      const nodeCount = classNodes.length;
      const optimalSize = calculateBoundarySize(nodeCount, clusterPos.radius);

      // Create boundary node
      const boundaryId = `boundary-${className}`;
      cy.add({
        group: 'nodes',
        data: {
          id: boundaryId,
          type: 'class-boundary',
          label: showLabels ? clusterPos.label : '',
          className: className,
          educationalNote: clusterPos.educationalNote || '',
          mechanismDescription: clusterPos.mechanism || '',
          nodeCount: nodeCount
        },
        position: {
          x: clusterPos.x,
          y: clusterPos.y
        },
        classes: ['class-boundary', `boundary-${className}`]
      });

      renderingStats.boundariesCreated++;
      renderingStats.visibleClasses.push(className);
    });

    // Apply styles to all boundaries
    applyBoundaryStyles(cy, customStyles);

    // Add interactive behaviors if enabled
    if (interactive) {
      setupBoundaryInteractions(cy, fadeUnselected);
    }

    renderingStats.renderingTime = performance.now() - startTime;

    console.log('Class boundaries rendered successfully:', renderingStats);
    return { success: true, stats: renderingStats };

  } catch (error) {
    console.error('Error rendering class boundaries:', error);
    renderingStats.renderingTime = performance.now() - startTime;
    return { success: false, error: error.message, stats: renderingStats };
  }
};

/**
 * Calculates optimal boundary size based on cluster content
 * 
 * @param {number} nodeCount - Number of nodes in the cluster
 * @param {number} baseRadius - Base radius from cluster configuration
 * @returns {Object} - Width and height for the boundary
 */
const calculateBoundarySize = (nodeCount, baseRadius = 100) => {
  // Base size with padding
  let width = baseRadius * 2.5;
  let height = baseRadius * 2.0;

  // Adjust for node count
  if (nodeCount > 6) {
    width *= 1.3;
    height *= 1.2;
  } else if (nodeCount > 3) {
    width *= 1.1;
    height *= 1.1;
  } else if (nodeCount === 1) {
    width *= 0.8;
    height *= 0.8;
  }

  return { width, height };
};

/**
 * Applies comprehensive styling to class boundaries
 * 
 * @param {Object} cy - Cytoscape instance
 * @param {Object} customStyles - Custom style overrides
 */
const applyBoundaryStyles = (cy, customStyles = {}) => {
  // Merge default styles with custom overrides
  const styles = { ...BOUNDARY_STYLES.default, ...customStyles };

  // Apply styles to all class boundaries
  cy.style()
    .selector('.class-boundary')
    .style({
      'shape': styles.shape,
      'width': node => {
        const className = node.data('className');
        const clusterPos = CLASS_CLUSTER_POSITIONS[className];
        const nodeCount = node.data('nodeCount') || 1;
        return calculateBoundarySize(nodeCount, clusterPos?.radius).width;
      },
      'height': node => {
        const className = node.data('className');
        const clusterPos = CLASS_CLUSTER_POSITIONS[className];
        const nodeCount = node.data('nodeCount') || 1;
        return calculateBoundarySize(nodeCount, clusterPos?.radius).height;
      },
      'background-opacity': styles.backgroundOpacity,
      'background-color': node => {
        const className = node.data('className');
        return CLASS_CLUSTER_POSITIONS[className]?.color || '#999';
      },
      'border-width': styles.borderWidth,
      'border-style': styles.borderStyle,
      'border-color': node => {
        const className = node.data('className');
        return CLASS_CLUSTER_POSITIONS[className]?.color || '#999';
      },
      'border-opacity': styles.borderOpacity,
      'text-valign': styles.textValign,
      'text-margin-y': styles.textMarginY,
      'font-size': styles.fontSize,
      'font-weight': styles.fontWeight,
      'color': styles.color,
      'z-index': styles.zIndex,
      'text-outline-width': 1,
      'text-outline-color': 'white',
      'text-outline-opacity': 0.8
    })
    .update();
};

/**
 * Sets up interactive behaviors for class boundaries
 * 
 * @param {Object} cy - Cytoscape instance
 * @param {boolean} fadeUnselected - Whether to fade unselected boundaries
 */
const setupBoundaryInteractions = (cy, fadeUnselected = false) => {
  // Hover effects
  cy.on('mouseover', '.class-boundary', (evt) => {
    const boundary = evt.target;
    const className = boundary.data('className');
    
    // Highlight boundary
    boundary.animate({
      style: {
        ...BOUNDARY_STYLES.hover,
        'background-color': CLASS_CLUSTER_POSITIONS[className]?.color,
        'border-color': CLASS_CLUSTER_POSITIONS[className]?.color
      },
      duration: 200,
      easing: 'ease-out'
    });

    // Highlight related antibiotics
    cy.nodes(`[antibioticClass = "${className}"]`).addClass('cluster-highlighted');

    // Show educational tooltip
    showBoundaryTooltip(boundary, evt.renderedPosition || evt.position);
  });

  cy.on('mouseout', '.class-boundary', (evt) => {
    const boundary = evt.target;
    const className = boundary.data('className');
    
    // Reset boundary style
    boundary.animate({
      style: BOUNDARY_STYLES.default,
      duration: 200,
      easing: 'ease-in'
    });

    // Remove highlighting
    cy.nodes(`[antibioticClass = "${className}"]`).removeClass('cluster-highlighted');

    // Hide tooltip
    hideBoundaryTooltip();
  });

  // Click to focus on class
  cy.on('tap', '.class-boundary', (evt) => {
    const boundary = evt.target;
    const className = boundary.data('className');
    
    focusOnClass(cy, className, fadeUnselected);
  });
};

/**
 * Shows educational tooltip for class boundary
 * 
 * @param {Object} boundary - Boundary node
 * @param {Object} position - Mouse position
 */
const showBoundaryTooltip = (boundary, position) => {
  // Remove existing tooltip
  hideBoundaryTooltip();

  const className = boundary.data('className');
  const clusterInfo = CLASS_CLUSTER_POSITIONS[className];
  const nodeCount = boundary.data('nodeCount');
  
  if (!clusterInfo) return;

  const tooltip = document.createElement('div');
  tooltip.id = 'class-boundary-tooltip';
  tooltip.className = 'fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-w-xs';
  tooltip.innerHTML = `
    <div class="font-semibold text-sm mb-1 text-gray-800">${clusterInfo.label}</div>
    <div class="text-xs text-gray-600 mb-2">${clusterInfo.mechanism}</div>
    <div class="text-xs text-gray-500 mb-2">${clusterInfo.educationalNote}</div>
    <div class="text-xs text-gray-400">
      ${nodeCount} antibiotic${nodeCount !== 1 ? 's' : ''} in this class
    </div>
  `;

  // Position tooltip
  tooltip.style.left = `${position.x + 15}px`;
  tooltip.style.top = `${position.y - 10}px`;
  tooltip.style.pointerEvents = 'none';

  document.body.appendChild(tooltip);
};

/**
 * Hides the boundary tooltip
 */
const hideBoundaryTooltip = () => {
  const tooltip = document.getElementById('class-boundary-tooltip');
  if (tooltip) {
    tooltip.remove();
  }
};

/**
 * Focuses the view on a specific antibiotic class
 * 
 * @param {Object} cy - Cytoscape instance
 * @param {string} className - Class name to focus on
 * @param {boolean} fadeUnselected - Whether to fade other elements
 */
const focusOnClass = (cy, className, fadeUnselected = false) => {
  const classNodes = cy.nodes(`[antibioticClass = "${className}"]`);
  const boundary = cy.nodes(`#boundary-${className}`);
  
  if (classNodes.length === 0) return;

  // Highlight the class
  if (fadeUnselected) {
    cy.elements().removeClass('focused').addClass('unfocused');
    classNodes.removeClass('unfocused').addClass('focused');
    boundary.removeClass('unfocused').addClass('focused');
  }

  // Fit view to class cluster
  cy.animate({
    fit: {
      eles: classNodes,
      padding: 50
    },
    duration: 500,
    easing: 'ease-in-out'
  });

  // Dispatch custom event for external listeners
  cy.trigger('classSelected', { className, nodes: classNodes });
};

/**
 * Updates boundary positions (useful for layout changes)
 * 
 * @param {Object} cy - Cytoscape instance
 * @param {string} className - Specific class to update, or null for all
 * @returns {boolean} - Success status
 */
export const updateBoundaryPositions = (cy, className = null) => {
  try {
    const classesToUpdate = className ? [className] : Object.keys(CLASS_CLUSTER_POSITIONS);
    
    classesToUpdate.forEach(clsName => {
      const boundary = cy.nodes(`#boundary-${clsName}`);
      const clusterPos = CLASS_CLUSTER_POSITIONS[clsName];
      
      if (!boundary.length || !clusterPos) return;
      
      boundary.animate({
        position: {
          x: clusterPos.x,
          y: clusterPos.y
        },
        duration: 500,
        easing: 'ease-in-out'
      });
    });
    
    return true;
  } catch (error) {
    console.error('Error updating boundary positions:', error);
    return false;
  }
};

/**
 * Removes all class boundaries
 * 
 * @param {Object} cy - Cytoscape instance
 * @returns {boolean} - Success status
 */
export const removeClassBoundaries = (cy) => {
  try {
    if (!cy) return false;
    
    // Remove tooltip if present
    hideBoundaryTooltip();
    
    // Remove boundary nodes
    cy.remove('.class-boundary');
    
    // Remove any highlighting classes
    cy.nodes().removeClass('cluster-highlighted focused unfocused');
    
    return true;
  } catch (error) {
    console.error('Error removing class boundaries:', error);
    return false;
  }
};

export default {
  renderClassBoundaries,
  updateBoundaryPositions,
  removeClassBoundaries,
  showBoundaryTooltip,
  hideBoundaryTooltip,
  focusOnClass,
  BOUNDARY_STYLES
};