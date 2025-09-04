/**
 * Interactive Coverage Wheel System
 * 
 * Northwestern Coverage Wheel Implementation - Day 7 Morning Session 2
 * Provides click/hover interactions with clinical insights and coverage analysis
 * 
 * Educational Focus:
 * - Interactive pathogen-antibiotic relationship exploration
 * - Coverage pie charts with Gram staining visualization
 * - Clinical decision support with resistance patterns
 * - Real-time coverage analysis and recommendations
 * 
 * Medical Accuracy: Uses coverage data from existing pathogen-antibiotic relationships
 * Performance: Efficient interaction handling with clinical context
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Coverage analysis categories with clinical significance
 */
export const const COVERAGE_CATEGORIES = {
  'gram-positive': {
    name: 'Gram-Positive',
    shortName: 'G+',
    color: '#4A90E2', // Blue
    description: 'Thick peptidoglycan cell wall, retains crystal violet stain',
    clinicalNote: 'Often susceptible to β-lactams and glycopeptides',
    commonPathogens: ['Staphylococcus aureus', 'Streptococcus pneumoniae', 'Enterococcus'],
    resistancePatterns: ['MRSA', 'VRE', 'Penicillin-resistant pneumococcus']
  },
  'gram-negative': {
    name: 'Gram-Negative',
    shortName: 'G-',
    color: '#E74C3C', // Red
    description: 'Thin peptidoglycan with outer membrane, decolorizes easily',
    clinicalNote: 'Often require broader spectrum agents, aminoglycosides effective',
    commonPathogens: ['Escherichia coli', 'Pseudomonas aeruginosa', 'Klebsiella'],
    resistancePatterns: ['ESBL', 'Carbapenem resistance', 'MDR Pseudomonas']
  },
  'anaerobic': {
    name: 'Anaerobic',
    shortName: 'Anaer',
    color: '#27AE60', // Green
    description: 'Organisms that grow without oxygen',
    clinicalNote: 'Often require metronidazole, clindamycin, or β-lactam/β-lactamase inhibitor combinations',
    commonPathogens: ['Bacteroides fragilis', 'Clostridium difficile', 'Peptostreptococcus'],
    resistancePatterns: ['Metronidazole resistance', 'β-lactamase production']
  },
  'atypical': {
    name: 'Atypical',
    shortName: 'Atyp',
    color: '#9B59B6', // Purple
    description: 'Organisms without cell walls or with unique characteristics',
    clinicalNote: 'Require macrolides, fluoroquinolones, or tetracyclines',
    commonPathogens: ['Mycoplasma pneumoniae', 'Chlamydia', 'Legionella'],
    resistancePatterns: ['Macrolide resistance', 'Fluoroquinolone resistance']
  }
};;

/**
 * Interactive wheel state management
 */
const useWheelInteractions = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [coverageData, setCoverageData] = useState(null);
  const [interactionMode, setInteractionMode] = useState('explore'); // explore, analyze, compare
  const [clinicalContext, setClinicalContext] = useState(null);
  
  return {
    selectedElement,
    setSelectedElement,
    hoveredElement,
    setHoveredElement,
    coverageData,
    setCoverageData,
    interactionMode,
    setInteractionMode,
    clinicalContext,
    setClinicalContext
  };
};

/**
 * Interactive Coverage Wheel Component
 * Provides comprehensive interaction layer for the network visualization
 */
export const InteractiveCoverageWheel = ({ 
  cytoscapeRef,
  networkData,
  onElementSelect,
  onCoverageAnalysis,
  clinicalMode = true,
  educationalLevel = 'resident' // student, resident, attending
}) => {
  const {
    selectedElement,
    setSelectedElement,
    hoveredElement,
    setHoveredElement,
    coverageData,
    setCoverageData,
    interactionMode,
    setInteractionMode,
    clinicalContext,
    setClinicalContext
  } = useWheelInteractions();

  const tooltipRef = useRef(null);
  const coveragePanelRef = useRef(null);

  /**
   * Initialize interaction handlers when Cytoscape is ready
   */
  useEffect(() => {
    if (!cytoscapeRef.current) return;

    const cy = cytoscapeRef.current.getCytoscape();
    if (!cy) return;

    // Setup interaction handlers
    setupNodeInteractions(cy);
    setupEdgeInteractions(cy);
    setupBackgroundInteractions(cy);
    setupKeyboardShortcuts(cy);

    // Cleanup function
    return () => {
      removeInteractionHandlers(cy);
    };
  }, [cytoscapeRef.current, interactionMode]);

  /**
   * Setup node interaction handlers
   */
  const setupNodeInteractions = useCallback((cy) => {
    // Node hover events
    cy.on('mouseover', 'node', (event) => {
      const node = event.target;
      const nodeData = node.data();
      
      setHoveredElement({
        id: nodeData.id,
        type: nodeData.type,
        data: nodeData,
        position: event.renderedPosition || event.position
      });

      // Show hover tooltip
      showHoverTooltip(node, event.renderedPosition || event.position);
      
      // Apply hover highlighting
      applyHoverEffects(cy, node);
    });

    cy.on('mouseout', 'node', () => {
      setHoveredElement(null);
      hideHoverTooltip();
      clearHoverEffects(cy);
    });

    // Node click events
    cy.on('tap', 'node', (event) => {
      const node = event.target;
      const nodeData = node.data();
      
      setSelectedElement({
        id: nodeData.id,
        type: nodeData.type,
        data: nodeData,
        node: node
      });

      // Trigger coverage analysis
      if (nodeData.type === 'antibiotic') {
        performAntibioticAnalysis(cy, node);
      } else if (nodeData.type === 'pathogen') {
        performPathogenAnalysis(cy, node);
      }

      // Notify parent component
      onElementSelect?.(nodeData);
    });

    // Double-click for detailed analysis
    cy.on('dbltap', 'node', (event) => {
      const node = event.target;
      setInteractionMode('analyze');
      showDetailedAnalysis(node);
    });

  }, [onElementSelect, setSelectedElement, setHoveredElement]);

  /**
   * Setup edge interaction handlers
   */
  const setupEdgeInteractions = useCallback((cy) => {
    cy.on('mouseover', 'edge', (event) => {
      const edge = event.target;
      const edgeData = edge.data();
      
      setHoveredElement({
        id: edgeData.id,
        type: 'relationship',
        data: edgeData,
        position: event.renderedPosition || event.position
      });

      showRelationshipTooltip(edge, event.renderedPosition || event.position);
      highlightRelationship(cy, edge);
    });

    cy.on('mouseout', 'edge', () => {
      setHoveredElement(null);
      hideHoverTooltip();
      clearRelationshipHighlight(cy);
    });

    cy.on('tap', 'edge', (event) => {
      const edge = event.target;
      const edgeData = edge.data();
      
      // Show coverage relationship analysis
      showCoverageRelationship(edge);
    });

  }, [setHoveredElement]);

  /**
   * Setup background and general interactions
   */
  const setupBackgroundInteractions = useCallback((cy) => {
    // Background click clears selection
    cy.on('tap', (event) => {
      if (event.target === cy) {
        setSelectedElement(null);
        setCoverageData(null);
        setInteractionMode('explore');
        clearAllHighlights(cy);
      }
    });

    // Right-click context menu
    cy.on('cxttap', 'node', (event) => {
      event.preventDefault();
      showContextMenu(event.target, event.renderedPosition || event.position);
    });

  }, [setSelectedElement, setCoverageData, setInteractionMode]);

  /**
   * Setup keyboard shortcuts
   */
  const setupKeyboardShortcuts = useCallback((cy) => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'c':
          setInteractionMode(interactionMode === 'compare' ? 'explore' : 'compare');
          break;
        case 'a':
          setInteractionMode(interactionMode === 'analyze' ? 'explore' : 'analyze');
          break;
        case 'Escape':
          setSelectedElement(null);
          setInteractionMode('explore');
          clearAllHighlights(cy);
          break;
        case 'h':
          toggleHelpOverlay();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [interactionMode, setSelectedElement, setInteractionMode]);

  /**
   * Perform antibiotic coverage analysis
   */
  const performAntibioticAnalysis = useCallback(async (cy, antibioticNode) => {
    const antibioticData = antibioticNode.data();
    
    try {
      // Get all connected pathogens
      const connectedEdges = antibioticNode.connectedEdges();
      const connectedPathogens = connectedEdges.targets('[type="pathogen"]');
      
      // Analyze coverage patterns
      const coverageAnalysis = analyzeCoveragePatterns(connectedPathogens);
      
      // Generate clinical recommendations
      const clinicalRecommendations = generateClinicalRecommendations(
        antibioticData, 
        coverageAnalysis,
        educationalLevel
      );

      const analysisResult = {
        antibiotic: antibioticData,
        coverage: coverageAnalysis,
        recommendations: clinicalRecommendations,
        timestamp: new Date().toISOString()
      };

      setCoverageData(analysisResult);
      onCoverageAnalysis?.(analysisResult);

      // Visual feedback
      highlightAntibioticCoverage(cy, antibioticNode, connectedPathogens);
      showCoveragePanel(analysisResult);

    } catch (error) {
      console.error('Error performing antibiotic analysis:', error);
    }
  }, [setCoverageData, onCoverageAnalysis, educationalLevel]);

  /**
   * Perform pathogen susceptibility analysis
   */
  const performPathogenAnalysis = useCallback(async (cy, pathogenNode) => {
    const pathogenData = pathogenNode.data();
    
    try {
      // Get all connected antibiotics
      const connectedEdges = pathogenNode.connectedEdges();
      const connectedAntibiotics = connectedEdges.targets('[type="antibiotic"]');
      
      // Analyze susceptibility patterns
      const susceptibilityAnalysis = analyzeSusceptibilityPatterns(connectedAntibiotics);
      
      // Generate treatment recommendations
      const treatmentRecommendations = generateTreatmentRecommendations(
        pathogenData,
        susceptibilityAnalysis,
        educationalLevel
      );

      const analysisResult = {
        pathogen: pathogenData,
        susceptibility: susceptibilityAnalysis,
        recommendations: treatmentRecommendations,
        timestamp: new Date().toISOString()
      };

      setCoverageData(analysisResult);
      onCoverageAnalysis?.(analysisResult);

      // Visual feedback
      highlightPathogenSusceptibility(cy, pathogenNode, connectedAntibiotics);
      showSusceptibilityPanel(analysisResult);

    } catch (error) {
      console.error('Error performing pathogen analysis:', error);
    }
  }, [setCoverageData, onCoverageAnalysis, educationalLevel]);

  /**
   * Show hover tooltip with clinical information
   */
  const showHoverTooltip = useCallback((node, position) => {
    if (tooltipRef.current) {
      tooltipRef.current.remove();
    }

    const nodeData = node.data();
    const tooltip = createTooltipElement(nodeData, position);
    document.body.appendChild(tooltip);
    tooltipRef.current = tooltip;
  }, []);

  /**
   * Hide hover tooltip
   */
  const hideHoverTooltip = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.remove();
      tooltipRef.current = null;
    }
  }, []);

  /**
   * Apply hover effects to related elements
   */
  const applyHoverEffects = useCallback((cy, node) => {
    // Highlight the hovered node
    node.addClass('hovered');
    
    // Highlight connected elements
    const connectedElements = node.connectedEdges().union(
      node.connectedEdges().connectedNodes()
    );
    connectedElements.addClass('connected-highlighted');
    
    // Fade unrelated elements
    cy.elements().difference(node.union(connectedElements)).addClass('faded');
  }, []);

  /**
   * Clear hover effects
   */
  const clearHoverEffects = useCallback((cy) => {
    cy.elements().removeClass('hovered connected-highlighted faded');
  }, []);

  /**
   * Remove all interaction handlers
   */
  const removeInteractionHandlers = useCallback((cy) => {
    cy.removeAllListeners();
    hideHoverTooltip();
    if (coveragePanelRef.current) {
      coveragePanelRef.current.remove();
      coveragePanelRef.current = null;
    }
  }, [hideHoverTooltip]);

  // This component is primarily a hook-based system
  // It doesn't render UI directly, but manages interactions
  return null;
};

/**
 * Analyze coverage patterns for antibiotic analysis
 */
const analyzeCoveragePatterns = (pathogenNodes) => {
  const coverage = {
    'gram-positive': 0,
    'gram-negative': 0,
    'anaerobic': 0,
    'atypical': 0,
    total: pathogenNodes.length,
    details: []
  };

  pathogenNodes.forEach(node => {
    const pathogenData = node.data();
    const gramStain = pathogenData.gramStain || 'unknown';
    const oxygenReq = pathogenData.oxygenRequirement || 'aerobic';
    const isAtypical = pathogenData.isAtypical || false;

    let category = 'unknown';
    
    if (isAtypical) {
      category = 'atypical';
    } else if (oxygenReq === 'anaerobic') {
      category = 'anaerobic';
    } else if (gramStain === 'positive') {
      category = 'gram-positive';
    } else if (gramStain === 'negative') {
      category = 'gram-negative';
    }

    if (coverage[category] !== undefined) {
      coverage[category]++;
    }

    coverage.details.push({
      pathogen: pathogenData.name,
      category,
      gramStain,
      oxygenReq,
      resistance: pathogenData.resistancePatterns || []
    });
  });

  // Calculate percentages
  Object.keys(COVERAGE_CATEGORIES).forEach(category => {
    coverage[`${category}Percentage`] = coverage.total > 0 
      ? (coverage[category] / coverage.total * 100).toFixed(1)
      : 0;
  });

  return coverage;
};

/**
 * Generate clinical recommendations based on coverage analysis
 */
const generateClinicalRecommendations = (antibioticData, coverageAnalysis, educationalLevel) => {
  const recommendations = {
    primaryUse: '',
    clinicalPearls: [],
    warnings: [],
    alternatives: [],
    educationalNotes: []
  };

  // Analyze coverage distribution
  const hasGramPositive = coverageAnalysis['gram-positive'] > 0;
  const hasGramNegative = coverageAnalysis['gram-negative'] > 0;
  const hasAnaerobic = coverageAnalysis.anaerobic > 0;
  const hasAtypical = coverageAnalysis.atypical > 0;

  // Generate primary use recommendation
  if (hasGramPositive && hasGramNegative) {
    recommendations.primaryUse = 'Broad-spectrum antibiotic - effective against both Gram-positive and Gram-negative organisms';
  } else if (hasGramPositive) {
    recommendations.primaryUse = 'Gram-positive coverage - excellent for streptococci and staphylococci';
  } else if (hasGramNegative) {
    recommendations.primaryUse = 'Gram-negative coverage - effective against enteric bacteria';
  }

  // Add clinical pearls based on antibiotic class
  const antibioticClass = antibioticData.antibioticClass || 'unknown';
  addClassSpecificRecommendations(recommendations, antibioticClass, educationalLevel);

  // Add resistance warnings
  coverageAnalysis.details.forEach(detail => {
    if (detail.resistance && detail.resistance.length > 0) {
      recommendations.warnings.push(
        `Monitor for ${detail.resistance.join(', ')} in ${detail.pathogen}`
      );
    }
  });

  return recommendations;
};

/**
 * Add class-specific clinical recommendations
 */
const addClassSpecificRecommendations = (recommendations, antibioticClass, educationalLevel) => {
  const classRecommendations = {
    'beta-lactams': {
      pearls: ['Bactericidal mechanism', 'Time-dependent killing', 'Monitor for β-lactamase resistance'],
      warnings: ['Hypersensitivity reactions possible', 'Cross-reactivity within class'],
      student: ['Cell wall synthesis inhibitor', 'Safe in pregnancy'],
      resident: ['Optimize dosing for time above MIC', 'Consider β-lactamase inhibitor combinations'],
      attending: ['PK/PD optimization critical', 'Source control essential']
    },
    'aminoglycosides': {
      pearls: ['Concentration-dependent killing', 'Post-antibiotic effect', 'Synergy with β-lactams'],
      warnings: ['Nephrotoxicity risk', 'Ototoxicity risk', 'Monitor levels closely'],
      student: ['Protein synthesis inhibitor', 'Requires dose adjustment in renal impairment'],
      resident: ['Once-daily dosing preferred', 'Avoid in pregnancy'],
      attending: ['Therapeutic drug monitoring essential', 'Consider inhalational route for Pseudomonas']
    }
    // Add more classes as needed
  };

  const classData = classRecommendations[antibioticClass];
  if (classData) {
    recommendations.clinicalPearls.push(...classData.pearls);
    recommendations.warnings.push(...classData.warnings);
    
    if (classData[educationalLevel]) {
      recommendations.educationalNotes.push(...classData[educationalLevel]);
    }
  }
};

/**
 * Create tooltip element with clinical information
 */
const createTooltipElement = (nodeData, position) => {
  const tooltip = document.createElement('div');
  tooltip.className = 'coverage-wheel-tooltip fixed z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-sm';
  tooltip.style.left = `${position.x + 15}px`;
  tooltip.style.top = `${position.y - 10}px`;
  tooltip.style.pointerEvents = 'none';

  let content = '';
  
  if (nodeData.type === 'antibiotic') {
    content = `
      <div class="font-semibold text-lg mb-2 text-blue-600">${nodeData.name}</div>
      <div class="text-sm text-gray-600 mb-2">
        <strong>Class:</strong> ${nodeData.antibioticClass || 'Unknown'}
      </div>
      <div class="text-sm text-gray-600 mb-2">
        <strong>Mechanism:</strong> ${nodeData.mechanismOfAction || 'Unknown'}
      </div>
      <div class="text-xs text-gray-500">
        Click for coverage analysis
      </div>
    `;
  } else if (nodeData.type === 'pathogen') {
    const gramStain = nodeData.gramStain ? `Gram-${nodeData.gramStain}` : 'Unknown';
    content = `
      <div class="font-semibold text-lg mb-2 text-red-600">${nodeData.name}</div>
      <div class="text-sm text-gray-600 mb-2">
        <strong>Gram Stain:</strong> ${gramStain}
      </div>
      <div class="text-sm text-gray-600 mb-2">
        <strong>Oxygen:</strong> ${nodeData.oxygenRequirement || 'Aerobic'}
      </div>
      <div class="text-xs text-gray-500">
        Click for treatment options
      </div>
    `;
  }

  tooltip.innerHTML = content;
  return tooltip;
};

// Export utility functions for external use
export {
  useWheelInteractions,
  analyzeCoveragePatterns,
  generateClinicalRecommendations,
  COVERAGE_CATEGORIES
};

export default InteractiveCoverageWheel;