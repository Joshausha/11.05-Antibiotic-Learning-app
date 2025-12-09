/**
 * Mechanism of Action Clustering System
 * 
 * Northwestern Coverage Wheel Implementation - Day 7 Morning Session 1
 * Provides mechanism-based positioning bias for enhanced educational clustering
 * 
 * Educational Focus:
 * - Groups by mechanism of action (cell wall synthesis, protein synthesis, etc.)
 * - Applies subtle position bias while preserving class clustering
 * - Creates visual mechanism indicators for educational insights
 * - Supports mechanism-based filtering and highlighting
 * 
 * Medical Accuracy: Uses mechanism data from existing antibiotic class system
 * Performance: Lightweight bias application without layout conflicts
 */

import { ANTIBIOTIC_CLASSES, getAntibioticClass } from '../../data/AntibioticClassData';
import { CLASS_CLUSTER_POSITIONS } from './AntibioticClassClustering';

/**
 * Mechanism of action groupings with spatial bias positions
 * Organized by primary mechanism targets in bacterial cells
 */
export const MECHANISM_GROUPS = {
  'cell-wall-synthesis': {
    name: 'Cell Wall Synthesis',
    shortName: 'Cell Wall',
    biasVector: { x: -150, y: 0 }, // Left side bias
    color: '#4A90E2',
    icon: '🧱',
    description: 'Disrupts peptidoglycan synthesis and cell wall formation',
    educationalNote: 'Bactericidal - cell lysis occurs rapidly',
    resistance: 'β-lactamase production, altered PBPs',
    classes: ['beta-lactams', 'glycopeptides'],
    priority: 1 // Highest educational priority
  },
  'protein-synthesis-30s': {
    name: 'Protein Synthesis (30S)',
    shortName: '30S Ribosome',
    biasVector: { x: 150, y: -100 }, // Upper right bias
    color: '#50C878',
    icon: '🧬',
    description: 'Binds 30S ribosomal subunit, blocks protein translation',
    educationalNote: 'Bactericidal - irreversible binding',
    resistance: 'Enzymatic modification, efflux pumps',
    classes: ['aminoglycosides', 'tetracyclines'],
    priority: 2
  },
  'protein-synthesis-50s': {
    name: 'Protein Synthesis (50S)',
    shortName: '50S Ribosome',
    biasVector: { x: -100, y: 150 }, // Lower left bias
    color: '#FF6B6B',
    icon: '🔗',
    description: 'Binds 50S ribosomal subunit, inhibits protein elongation',
    educationalNote: 'Usually bacteriostatic - reversible binding',
    resistance: 'Methylation of binding site, efflux',
    classes: ['macrolides', 'lincosamides'],
    priority: 2
  },
  'dna-rna-synthesis': {
    name: 'DNA/RNA Synthesis',
    shortName: 'DNA/RNA',
    biasVector: { x: 100, y: 100 }, // Lower right bias
    color: '#FFD700',
    icon: '🧭',
    description: 'Inhibits DNA gyrase and topoisomerase IV',
    educationalNote: 'Bactericidal - rapid DNA damage',
    resistance: 'Target mutations, efflux pumps',
    classes: ['fluoroquinolones'],
    priority: 2
  },
  'folate-synthesis': {
    name: 'Folate Synthesis',
    shortName: 'Folate',
    biasVector: { x: -50, y: -150 }, // Upper left bias
    color: '#9B59B6',
    icon: '🍃',
    description: 'Inhibits folate synthesis pathway',
    educationalNote: 'Bacteriostatic - metabolic disruption',
    resistance: 'Altered enzymes, plasmid resistance',
    classes: ['sulfonamides'],
    priority: 3
  },
  'membrane-disruption': {
    name: 'Membrane Disruption',
    shortName: 'Membrane',
    biasVector: { x: 0, y: -100 }, // Upper center bias
    color: '#E67E22',
    icon: '💥',
    description: 'Disrupts bacterial cell membrane integrity',
    educationalNote: 'Bactericidal - rapid membrane damage',
    resistance: 'Altered membrane composition',
    classes: ['polymyxins'],
    priority: 4 // Lower priority, less common
  }
};

/**
 * Maps antibiotic classes to their primary mechanism of action
 */
export const CLASS_TO_MECHANISM_MAP = {
  'beta-lactams': 'cell-wall-synthesis',
  'glycopeptides': 'cell-wall-synthesis',
  'aminoglycosides': 'protein-synthesis-30s',
  'tetracyclines': 'protein-synthesis-30s',
  'macrolides': 'protein-synthesis-50s',
  'lincosamides': 'protein-synthesis-50s',
  'fluoroquinolones': 'dna-rna-synthesis',
  'sulfonamides': 'folate-synthesis',
  'polymyxins': 'membrane-disruption'
};

/**
 * Applies mechanism-based positioning bias to antibiotic nodes
 * Works alongside class clustering to provide educational groupings
 * 
 * @param {Object} cy - Cytoscape instance
 * @param {Object} options - Mechanism clustering options
 * @returns {Object} - Clustering results with mechanism statistics
 */
export const applyMechanismBias = (cy, options = {}) => {
  const {
    biasStrength = 0.3, // How strongly to bias toward mechanism position
    preserveClassClusters = true,
    highlightMechanisms = true,
    educationalMode = true
  } = options;

  if (!cy) {
    console.warn('Cytoscape instance not provided to applyMechanismBias');
    return { success: false, error: 'No Cytoscape instance' };
  }

  const mechanismStats = {
    totalAntibiotics: 0,
    mechanismGroups: {},
    biasesApplied: 0,
    educationalInsights: []
  };

  try {
    // Get all antibiotic nodes
    const antibioticNodes = cy.nodes('[type="antibiotic"]');
    mechanismStats.totalAntibiotics = antibioticNodes.length;

    if (antibioticNodes.length === 0) {
      console.log('No antibiotic nodes found for mechanism bias');
      return { success: true, stats: mechanismStats };
    }

    // Group nodes by mechanism of action
    const mechanismGroups = {};
    
    antibioticNodes.forEach(node => {
      const antibioticId = node.data('id')?.replace('antibiotic-', '') || node.data('name');
      const classData = getAntibioticClass(antibioticId);
      const className = classData?.className || 'unknown';
      const mechanismId = CLASS_TO_MECHANISM_MAP[className] || 'unknown';
      
      if (mechanismId === 'unknown') {
        return;
      }

      if (!mechanismGroups[mechanismId]) {
        mechanismGroups[mechanismId] = [];
      }
      mechanismGroups[mechanismId].push(node);
    });

    // Apply mechanism bias to each group
    Object.entries(mechanismGroups).forEach(([mechanismId, nodes]) => {
      const mechanism = MECHANISM_GROUPS[mechanismId];
      if (!mechanism) return;

      mechanismStats.mechanismGroups[mechanismId] = {
        name: mechanism.name,
        count: nodes.length,
        classes: [...new Set(nodes.map(node => {
          const antibioticId = node.data('id')?.replace('antibiotic-', '') || node.data('name');
          const classData = getAntibioticClass(antibioticId);
          return classData?.className || 'unknown';
        }))]
      };

      nodes.forEach(node => {
        const currentPos = node.position();
        const biasVector = mechanism.biasVector;
        
        // Calculate bias position (weighted between current and bias position)
        const biasedPos = {
          x: currentPos.x + (biasVector.x * biasStrength),
          y: currentPos.y + (biasVector.y * biasStrength)
        };

        // Apply position if preserving class clusters (subtle bias)
        // or full bias if not preserving clusters
        if (preserveClassClusters) {
          node.animate({
            position: biasedPos,
            duration: 800,
            easing: 'ease-out'
          });
        } else {
          // Stronger bias when not preserving class clusters
          const strongBiasPos = {
            x: currentPos.x + (biasVector.x * biasStrength * 2),
            y: currentPos.y + (biasVector.y * biasStrength * 2)
          };
          node.animate({
            position: strongBiasPos,
            duration: 800,
            easing: 'ease-out'
          });
        }

        // Add mechanism information to node data
        node.data('mechanismOfAction', mechanism.name);
        node.data('mechanismGroup', mechanismId);
        node.data('mechanismColor', mechanism.color);
        node.data('mechanismIcon', mechanism.icon);
        node.data('mechanismDescription', mechanism.description);
        node.addClass(`mechanism-${mechanismId}`);

        mechanismStats.biasesApplied++;
      });

      // Add educational insights for each mechanism
      if (educationalMode && nodes.length > 0) {
        mechanismStats.educationalInsights.push({
          mechanism: mechanism.name,
          count: nodes.length,
          priority: mechanism.priority,
          insight: `${nodes.length} antibiotic${nodes.length !== 1 ? 's' : ''} target ${mechanism.shortName}`,
          clinicalNote: mechanism.educationalNote,
          resistance: mechanism.resistance
        });
      }
    });

    // Apply visual mechanism indicators if requested
    if (highlightMechanisms) {
      applyMechanismVisualIndicators(cy, mechanismGroups);
    }

    // Sort insights by priority for educational display
    mechanismStats.educationalInsights.sort((a, b) => a.priority - b.priority);

    console.log('Mechanism bias applied successfully:', mechanismStats);
    return { success: true, stats: mechanismStats, groups: mechanismGroups };

  } catch (error) {
    console.error('Error applying mechanism bias:', error);
    return { success: false, error: error.message, stats: mechanismStats };
  }
};

/**
 * Applies visual indicators for mechanism groups
 * 
 * @param {Object} cy - Cytoscape instance
 * @param {Object} mechanismGroups - Grouped nodes by mechanism
 */
const applyMechanismVisualIndicators = (cy, mechanismGroups) => {
  // Remove existing mechanism indicators
  cy.remove('.mechanism-indicator');

  Object.entries(mechanismGroups).forEach(([mechanismId, nodes]) => {
    const mechanism = MECHANISM_GROUPS[mechanismId];
    if (!mechanism || nodes.length === 0) return;

    // Calculate center position for this mechanism group
    const avgPos = nodes.reduce((acc, node) => {
      const pos = node.position();
      acc.x += pos.x;
      acc.y += pos.y;
      return acc;
    }, { x: 0, y: 0 });

    avgPos.x /= nodes.length;
    avgPos.y /= nodes.length;

    // Create subtle mechanism indicator
    const indicatorId = `mechanism-indicator-${mechanismId}`;
    cy.add({
      group: 'nodes',
      data: {
        id: indicatorId,
        type: 'mechanism-indicator',
        label: mechanism.icon,
        mechanismName: mechanism.name,
        mechanismId: mechanismId,
        nodeCount: nodes.length
      },
      position: avgPos,
      classes: ['mechanism-indicator', `indicator-${mechanismId}`]
    });
  });

  // Style mechanism indicators
  cy.style()
    .selector('.mechanism-indicator')
    .style({
      'shape': 'ellipse',
      'width': 20,
      'height': 20,
      'background-opacity': 0.1,
      'background-color': node => {
        const mechanismId = node.data('mechanismId');
        return MECHANISM_GROUPS[mechanismId]?.color || '#999';
      },
      'border-width': 1,
      'border-color': node => {
        const mechanismId = node.data('mechanismId');
        return MECHANISM_GROUPS[mechanismId]?.color || '#999';
      },
      'border-opacity': 0.4,
      'font-size': 12,
      'text-valign': 'center',
      'text-halign': 'center',
      'z-index': 5,
      'selectable': false,
      'grabbable': false,
      'opacity': 0.8
    })
    .update();
};

/**
 * Gets mechanism information for a specific antibiotic
 * 
 * @param {string} antibioticId - ID of the antibiotic
 * @returns {Object|null} - Mechanism information or null
 */
export const getAntibioticMechanism = (antibioticId) => {
  try {
    const classData = getAntibioticClass(antibioticId);
    if (!classData) return null;

    const mechanismId = CLASS_TO_MECHANISM_MAP[classData.className];
    if (!mechanismId) return null;

    return {
      mechanismId,
      ...MECHANISM_GROUPS[mechanismId]
    };
  } catch (error) {
    console.error('Error getting antibiotic mechanism:', error);
    return null;
  }
};

/**
 * Highlights antibiotics with the same mechanism of action
 * 
 * @param {Object} cy - Cytoscape instance
 * @param {string} mechanismId - Mechanism ID to highlight
 * @param {boolean} exclusive - Whether to fade non-matching elements
 */
export const highlightMechanismGroup = (cy, mechanismId, exclusive = false) => {
  if (!cy || !mechanismId || !MECHANISM_GROUPS[mechanismId]) {
    console.warn('Invalid parameters for highlightMechanismGroup');
    return;
  }

  try {
    if (exclusive) {
      // Fade all elements
      cy.elements().removeClass('mechanism-highlighted').addClass('mechanism-faded');
      
      // Highlight mechanism group
      cy.nodes(`.mechanism-${mechanismId}`).removeClass('mechanism-faded').addClass('mechanism-highlighted');
      cy.nodes(`#mechanism-indicator-${mechanismId}`).removeClass('mechanism-faded').addClass('mechanism-highlighted');
    } else {
      // Just highlight the mechanism group
      cy.nodes(`.mechanism-${mechanismId}`).addClass('mechanism-highlighted');
      cy.nodes(`#mechanism-indicator-${mechanismId}`).addClass('mechanism-highlighted');
    }

    // Trigger custom event
    cy.trigger('mechanismHighlighted', { mechanismId, exclusive });

  } catch (error) {
    console.error('Error highlighting mechanism group:', error);
  }
};

/**
 * Clears mechanism highlighting
 * 
 * @param {Object} cy - Cytoscape instance
 */
export const clearMechanismHighlight = (cy) => {
  if (!cy) return;

  try {
    cy.elements().removeClass('mechanism-highlighted mechanism-faded');
    cy.trigger('mechanismHighlightCleared');
  } catch (error) {
    console.error('Error clearing mechanism highlight:', error);
  }
};

/**
 * Removes mechanism indicators and bias
 * 
 * @param {Object} cy - Cytoscape instance
 * @returns {boolean} - Success status
 */
export const removeMechanismBias = (cy) => {
  try {
    if (!cy) return false;
    
    // Remove visual indicators
    cy.remove('.mechanism-indicator');
    
    // Clear mechanism classes and highlighting
    cy.elements().removeClass('mechanism-highlighted mechanism-faded');
    cy.nodes('[type="antibiotic"]').forEach(node => {
      // Remove mechanism classes
      Object.keys(MECHANISM_GROUPS).forEach(mechanismId => {
        node.removeClass(`mechanism-${mechanismId}`);
      });
    });
    
    return true;
  } catch (error) {
    console.error('Error removing mechanism bias:', error);
    return false;
  }
};

/**
 * Gets educational summary of mechanism distribution
 * 
 * @param {Object} mechanismStats - Statistics from applyMechanismBias
 * @returns {Array} - Educational insights sorted by clinical importance
 */
export const getMechanismEducationalSummary = (mechanismStats) => {
  if (!mechanismStats?.educationalInsights) {
    return [];
  }

  return mechanismStats.educationalInsights.map(insight => ({
    title: insight.mechanism,
    count: insight.count,
    clinical: insight.clinicalNote,
    resistance: insight.resistance,
    priority: insight.priority,
    summary: `${insight.count} antibiotic${insight.count !== 1 ? 's' : ''} - ${insight.clinicalNote}`
  }));
};

export default {
  MECHANISM_GROUPS,
  CLASS_TO_MECHANISM_MAP,
  applyMechanismBias,
  getAntibioticMechanism,
  highlightMechanismGroup,
  clearMechanismHighlight,
  removeMechanismBias,
  getMechanismEducationalSummary
};