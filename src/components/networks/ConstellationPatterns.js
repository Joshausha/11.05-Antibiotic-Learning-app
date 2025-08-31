/**
 * Constellation Patterns Visualization System
 * 
 * Northwestern Coverage Wheel Implementation - Day 7 Afternoon Session 1
 * Creates constellation-like patterns to visualize complex antibiotic-pathogen relationships
 * 
 * Educational Focus:
 * - Visual representation of resistance networks
 * - Treatment pathway constellations
 * - Multi-drug resistant organism (MDR) patterns
 * - First-line vs. alternative therapy relationships
 * 
 * Medical Accuracy: Uses clinical effectiveness data and resistance patterns
 * Performance: Dynamic pattern generation with smooth animations
 */

import { getAntibioticClass } from '../../data/AntibioticClassData';
import { CLASS_CLUSTER_POSITIONS } from './AntibioticClassClustering';
import { MECHANISM_GROUPS } from './MechanismClustering';

/**
 * Constellation pattern definitions based on clinical relationships
 */
export const CONSTELLATION_PATTERNS = {
  'first-line-therapy': {
    name: 'First-Line Therapy',
    description: 'Primary treatment choices for common infections',
    pattern: 'star', // Central pathogen with radiating first-line antibiotics
    color: '#27AE60',
    opacity: 0.8,
    lineStyle: 'solid',
    thickness: 3,
    educationalNote: 'These are the go-to antibiotics for empiric therapy',
    clinicalContext: 'Evidence-based first choices with good efficacy and safety profiles'
  },
  'alternative-therapy': {
    name: 'Alternative Therapy',
    description: 'Alternative choices when first-line fails or is contraindicated',
    pattern: 'ring', // Surrounding ring of alternatives
    color: '#F39C12',
    opacity: 0.6,
    lineStyle: 'dashed',
    thickness: 2,
    educationalNote: 'Consider these when first-line therapy is inappropriate',
    clinicalContext: 'Allergies, resistance, or specific patient factors'
  },
  'resistance-network': {
    name: 'Resistance Network',
    description: 'Pathogens with shared resistance mechanisms',
    pattern: 'cluster', // Tight clustering with resistance links
    color: '#E74C3C',
    opacity: 0.7,
    lineStyle: 'dotted',
    thickness: 2,
    educationalNote: 'These organisms share resistance mechanisms',
    clinicalContext: 'Consider combination therapy or alternative classes'
  },
  'synergy-constellation': {
    name: 'Synergy Constellation',
    description: 'Antibiotics that work synergistically',
    pattern: 'triangle', // Triangular relationships
    color: '#8E44AD',
    opacity: 0.6,
    lineStyle: 'solid',
    thickness: 2,
    educationalNote: 'These combinations provide enhanced activity',
    clinicalContext: 'Beta-lactam + aminoglycoside synergy, TMP-SMX'
  },
  'spectrum-bridge': {
    name: 'Spectrum Bridge',
    description: 'Antibiotics bridging different organism types',
    pattern: 'bridge', // Linear connections between different groups
    color: '#3498DB',
    opacity: 0.5,
    lineStyle: 'solid',
    thickness: 1,
    educationalNote: 'Broad-spectrum agents covering multiple organism types',
    clinicalContext: 'Useful for polymicrobial infections or unknown pathogens'
  },
  'resistance-escape': {
    name: 'Resistance Escape',
    description: 'Antibiotics that overcome specific resistance mechanisms',
    pattern: 'bypass', // Curved paths around resistance
    color: '#16A085',
    opacity: 0.8,
    lineStyle: 'solid',
    thickness: 3,
    educationalNote: 'These agents circumvent common resistance mechanisms',
    clinicalContext: 'Carbapenems for ESBL, vancomycin for MRSA'
  }
};

/**
 * Resistance pattern definitions for constellation mapping
 */
export const RESISTANCE_PATTERNS = {
  'beta-lactamase': {
    name: 'β-Lactamase Production',
    mechanism: 'Enzymatic degradation of β-lactam ring',
    prevalence: 'high',
    affectedClasses: ['penicillins', 'some-cephalosporins'],
    solutions: ['β-lactamase inhibitors', 'carbapenems'],
    constellation: 'resistance-network'
  },
  'mrsa': {
    name: 'Methicillin Resistance (MRSA)',
    mechanism: 'Altered penicillin-binding proteins (mecA gene)',
    prevalence: 'high',
    affectedClasses: ['all-beta-lactams'],
    solutions: ['vancomycin', 'linezolid', 'daptomycin'],
    constellation: 'resistance-escape'
  },
  'esbl': {
    name: 'Extended-Spectrum β-Lactamase (ESBL)',
    mechanism: 'Enhanced β-lactamase activity',
    prevalence: 'increasing',
    affectedClasses: ['penicillins', 'cephalosporins'],
    solutions: ['carbapenems'],
    constellation: 'resistance-network'
  },
  'carbapenem-resistance': {
    name: 'Carbapenem Resistance',
    mechanism: 'Carbapenemase production or porin loss',
    prevalence: 'emerging',
    affectedClasses: ['carbapenems'],
    solutions: ['colistin', 'combination-therapy'],
    constellation: 'resistance-network'
  }
};

/**
 * Apply constellation patterns to visualize clinical relationships
 * 
 * @param {Object} cy - Cytoscape instance
 * @param {Object} options - Constellation options
 * @returns {Object} - Pattern application results
 */
export const applyConstellationPatterns = (cy, options = {}) => {
  const {
    enableFirstLine = true,
    enableAlternatives = true,
    enableResistanceNetworks = true,
    enableSynergies = false,
    enableSpectrumBridges = false,
    animationDuration = 1000,
    educationalMode = true
  } = options;

  if (!cy) {
    console.warn('Cytoscape instance not provided to applyConstellationPatterns');
    return { success: false, error: 'No Cytoscape instance' };
  }

  const patternStats = {
    patternsCreated: 0,
    constellationsActive: [],
    educationalInsights: [],
    clinicalRelationships: 0
  };

  try {
    // Remove existing constellation elements
    cy.remove('.constellation-element');

    // Apply different constellation patterns based on options
    if (enableFirstLine) {
      const firstLineResult = createFirstLineConstellations(cy, animationDuration);
      patternStats.patternsCreated += firstLineResult.count;
      patternStats.constellationsActive.push('first-line-therapy');
    }

    if (enableAlternatives) {
      const alternativeResult = createAlternativeTherapyConstellations(cy, animationDuration);
      patternStats.patternsCreated += alternativeResult.count;
      patternStats.constellationsActive.push('alternative-therapy');
    }

    if (enableResistanceNetworks) {
      const resistanceResult = createResistanceNetworks(cy, animationDuration);
      patternStats.patternsCreated += resistanceResult.count;
      patternStats.constellationsActive.push('resistance-network');
    }

    if (enableSynergies) {
      const synergyResult = createSynergyConstellations(cy, animationDuration);
      patternStats.patternsCreated += synergyResult.count;
      patternStats.constellationsActive.push('synergy-constellation');
    }

    if (enableSpectrumBridges) {
      const bridgeResult = createSpectrumBridges(cy, animationDuration);
      patternStats.patternsCreated += bridgeResult.count;
      patternStats.constellationsActive.push('spectrum-bridge');
    }

    // Generate educational insights
    if (educationalMode) {
      patternStats.educationalInsights = generateConstellationInsights(patternStats);
    }

    // Apply constellation styling
    applyConstellationStyles(cy);

    console.log('Constellation patterns applied successfully:', patternStats);
    return { success: true, stats: patternStats };

  } catch (error) {
    console.error('Error applying constellation patterns:', error);
    return { success: false, error: error.message, stats: patternStats };
  }
};

/**
 * Create first-line therapy constellations
 * Central pathogen with radiating primary treatment choices
 */
const createFirstLineConstellations = (cy, animationDuration) => {
  let count = 0;
  
  // Define first-line relationships based on clinical guidelines
  const firstLineRelationships = {
    'Streptococcus pneumoniae': ['amoxicillin', 'azithromycin'],
    'Staphylococcus aureus': ['nafcillin', 'cephalexin'],
    'Escherichia coli': ['ciprofloxacin', 'trimethoprim-sulfamethoxazole'],
    'Haemophilus influenzae': ['amoxicillin-clavulanate', 'azithromycin']
  };

  Object.entries(firstLineRelationships).forEach(([pathogenName, antibiotics]) => {
    const pathogenNode = cy.nodes(`[name="${pathogenName}"]`).first();
    if (!pathogenNode.length) return;

    const pathogenPos = pathogenNode.position();
    const radius = 80; // Distance from center pathogen

    antibiotics.forEach((antibioticName, index) => {
      const antibioticNode = cy.nodes().filter(node => {
        const nodeName = node.data('name') || '';
        return nodeName.toLowerCase().includes(antibioticName.toLowerCase());
      }).first();

      if (!antibioticNode.length) return;

      // Create constellation connection
      const connectionId = `first-line-${pathogenNode.id()}-${antibioticNode.id()}`;
      
      // Calculate position for star pattern
      const angle = (index / antibiotics.length) * 2 * Math.PI;
      const targetPos = {
        x: pathogenPos.x + radius * Math.cos(angle),
        y: pathogenPos.y + radius * Math.sin(angle)
      };

      // Animate antibiotic to constellation position
      antibioticNode.animate({
        position: targetPos,
        duration: animationDuration,
        easing: 'ease-out'
      });

      // Create visual connection
      cy.add({
        group: 'edges',
        data: {
          id: connectionId,
          source: pathogenNode.id(),
          target: antibioticNode.id(),
          type: 'constellation-connection',
          constellationType: 'first-line-therapy',
          strength: 'high',
          clinicalNote: 'First-line empiric therapy'
        },
        classes: ['constellation-element', 'first-line-connection']
      });

      count++;
    });
  });

  return { count };
};

/**
 * Create alternative therapy constellations
 * Ring pattern around first-line choices
 */
const createAlternativeTherapyConstellations = (cy, animationDuration) => {
  let count = 0;
  
  const alternativeRelationships = {
    'Streptococcus pneumoniae': ['levofloxacin', 'clindamycin'],
    'Staphylococcus aureus': ['vancomycin', 'linezolid'],
    'Escherichia coli': ['nitrofurantoin', 'fosfomycin'],
    'Haemophilus influenzae': ['cefuroxime', 'doxycycline']
  };

  Object.entries(alternativeRelationships).forEach(([pathogenName, antibiotics]) => {
    const pathogenNode = cy.nodes(`[name="${pathogenName}"]`).first();
    if (!pathogenNode.length) return;

    const pathogenPos = pathogenNode.position();
    const radius = 120; // Larger radius for alternatives

    antibiotics.forEach((antibioticName, index) => {
      const antibioticNode = cy.nodes().filter(node => {
        const nodeName = node.data('name') || '';
        return nodeName.toLowerCase().includes(antibioticName.toLowerCase());
      }).first();

      if (!antibioticNode.length) return;

      const connectionId = `alternative-${pathogenNode.id()}-${antibioticNode.id()}`;
      
      // Calculate position for ring pattern
      const angle = (index / antibiotics.length) * 2 * Math.PI + Math.PI; // Offset from first-line
      const targetPos = {
        x: pathogenPos.x + radius * Math.cos(angle),
        y: pathogenPos.y + radius * Math.sin(angle)
      };

      // Create visual connection with different styling
      cy.add({
        group: 'edges',
        data: {
          id: connectionId,
          source: pathogenNode.id(),
          target: antibioticNode.id(),
          type: 'constellation-connection',
          constellationType: 'alternative-therapy',
          strength: 'moderate',
          clinicalNote: 'Alternative when first-line inappropriate'
        },
        classes: ['constellation-element', 'alternative-connection']
      });

      count++;
    });
  });

  return { count };
};

/**
 * Create resistance network constellations
 * Links organisms with shared resistance patterns
 */
const createResistanceNetworks = (cy, animationDuration) => {
  let count = 0;
  
  // Group organisms by shared resistance mechanisms
  const resistanceGroups = {
    'beta-lactamase-producers': [
      'Staphylococcus aureus', 
      'Escherichia coli', 
      'Klebsiella pneumoniae'
    ],
    'esbl-producers': [
      'Escherichia coli',
      'Klebsiella pneumoniae',
      'Proteus mirabilis'
    ],
    'mrsa-relatives': [
      'Staphylococcus aureus',
      'Staphylococcus epidermidis'
    ]
  };

  Object.entries(resistanceGroups).forEach(([resistanceType, pathogens]) => {
    const pathogenNodes = pathogens
      .map(name => cy.nodes(`[name="${name}"]`).first())
      .filter(node => node.length > 0);

    if (pathogenNodes.length < 2) return;

    // Create network connections between resistant organisms
    for (let i = 0; i < pathogenNodes.length; i++) {
      for (let j = i + 1; j < pathogenNodes.length; j++) {
        const connectionId = `resistance-${pathogenNodes[i].id()}-${pathogenNodes[j].id()}`;
        
        cy.add({
          group: 'edges',
          data: {
            id: connectionId,
            source: pathogenNodes[i].id(),
            target: pathogenNodes[j].id(),
            type: 'constellation-connection',
            constellationType: 'resistance-network',
            resistanceType: resistanceType,
            strength: 'variable',
            clinicalNote: `Shared resistance: ${resistanceType.replace('-', ' ')}`
          },
          classes: ['constellation-element', 'resistance-connection']
        });

        count++;
      }
    }
  });

  return { count };
};

/**
 * Create synergy constellations
 * Triangular patterns for synergistic combinations
 */
const createSynergyConstellations = (cy, animationDuration) => {
  let count = 0;
  
  const synergyPairs = [
    {
      antibiotic1: 'ampicillin',
      antibiotic2: 'gentamicin',
      pathogen: 'Enterococcus',
      mechanism: 'Cell wall + protein synthesis'
    },
    {
      antibiotic1: 'trimethoprim',
      antibiotic2: 'sulfamethoxazole',
      pathogen: 'Pneumocystis jirovecii',
      mechanism: 'Sequential folate pathway inhibition'
    }
  ];

  synergyPairs.forEach((synergy, index) => {
    const antibiotic1Node = cy.nodes().filter(node => {
      const nodeName = node.data('name') || '';
      return nodeName.toLowerCase().includes(synergy.antibiotic1.toLowerCase());
    }).first();
    
    const antibiotic2Node = cy.nodes().filter(node => {
      const nodeName = node.data('name') || '';
      return nodeName.toLowerCase().includes(synergy.antibiotic2.toLowerCase());
    }).first();
    
    const pathogenNode = cy.nodes().filter(node => {
      const nodeName = node.data('name') || '';
      return nodeName.toLowerCase().includes(synergy.pathogen.toLowerCase());
    }).first();

    if (antibiotic1Node.length && antibiotic2Node.length && pathogenNode.length) {
      // Create triangular synergy pattern
      const connections = [
        { source: antibiotic1Node, target: antibiotic2Node, type: 'synergy-pair' },
        { source: antibiotic1Node, target: pathogenNode, type: 'synergy-target' },
        { source: antibiotic2Node, target: pathogenNode, type: 'synergy-target' }
      ];

      connections.forEach((conn, connIndex) => {
        const connectionId = `synergy-${index}-${connIndex}`;
        
        cy.add({
          group: 'edges',
          data: {
            id: connectionId,
            source: conn.source.id(),
            target: conn.target.id(),
            type: 'constellation-connection',
            constellationType: 'synergy-constellation',
            synergyMechanism: synergy.mechanism,
            strength: 'high',
            clinicalNote: `Synergistic combination: ${synergy.mechanism}`
          },
          classes: ['constellation-element', 'synergy-connection']
        });

        count++;
      });
    }
  });

  return { count };
};

/**
 * Create spectrum bridge constellations
 * Linear connections between different organism groups
 */
const createSpectrumBridges = (cy, animationDuration) => {
  let count = 0;
  
  const broadSpectrumAntibiotics = [
    'ciprofloxacin',
    'meropenem',
    'piperacillin-tazobactam'
  ];

  broadSpectrumAntibiotics.forEach(antibioticName => {
    const antibioticNode = cy.nodes().filter(node => {
      const nodeName = node.data('name') || '';
      return nodeName.toLowerCase().includes(antibioticName.toLowerCase());
    }).first();

    if (!antibioticNode.length) return;

    // Find connected pathogens across different categories
    const connectedPathogens = antibioticNode.connectedEdges().targets('[type="pathogen"]');
    
    if (connectedPathogens.length >= 3) {
      // Create bridge pattern connecting different organism types
      for (let i = 0; i < connectedPathogens.length - 1; i++) {
        const pathogen1 = connectedPathogens[i];
        const pathogen2 = connectedPathogens[i + 1];
        
        const connectionId = `bridge-${pathogen1.id()}-${pathogen2.id()}`;
        
        cy.add({
          group: 'edges',
          data: {
            id: connectionId,
            source: pathogen1.id(),
            target: pathogen2.id(),
            type: 'constellation-connection',
            constellationType: 'spectrum-bridge',
            bridgeAntibiotic: antibioticName,
            strength: 'moderate',
            clinicalNote: `Broad spectrum coverage via ${antibioticName}`
          },
          classes: ['constellation-element', 'bridge-connection']
        });

        count++;
      }
    }
  });

  return { count };
};

/**
 * Apply constellation-specific styling
 */
const applyConstellationStyles = (cy) => {
  // Style constellation connections based on type
  cy.style()
    .selector('.first-line-connection')
    .style({
      'line-color': CONSTELLATION_PATTERNS['first-line-therapy'].color,
      'line-style': CONSTELLATION_PATTERNS['first-line-therapy'].lineStyle,
      'width': CONSTELLATION_PATTERNS['first-line-therapy'].thickness,
      'opacity': CONSTELLATION_PATTERNS['first-line-therapy'].opacity,
      'curve-style': 'straight',
      'arrow-scale': 0,
      'z-index': 10
    })
    .selector('.alternative-connection')
    .style({
      'line-color': CONSTELLATION_PATTERNS['alternative-therapy'].color,
      'line-style': CONSTELLATION_PATTERNS['alternative-therapy'].lineStyle,
      'width': CONSTELLATION_PATTERNS['alternative-therapy'].thickness,
      'opacity': CONSTELLATION_PATTERNS['alternative-therapy'].opacity,
      'curve-style': 'bezier',
      'arrow-scale': 0,
      'z-index': 8
    })
    .selector('.resistance-connection')
    .style({
      'line-color': CONSTELLATION_PATTERNS['resistance-network'].color,
      'line-style': CONSTELLATION_PATTERNS['resistance-network'].lineStyle,
      'width': CONSTELLATION_PATTERNS['resistance-network'].thickness,
      'opacity': CONSTELLATION_PATTERNS['resistance-network'].opacity,
      'curve-style': 'unbundled-bezier',
      'arrow-scale': 0,
      'z-index': 6
    })
    .selector('.synergy-connection')
    .style({
      'line-color': CONSTELLATION_PATTERNS['synergy-constellation'].color,
      'line-style': CONSTELLATION_PATTERNS['synergy-constellation'].lineStyle,
      'width': CONSTELLATION_PATTERNS['synergy-constellation'].thickness,
      'opacity': CONSTELLATION_PATTERNS['synergy-constellation'].opacity,
      'curve-style': 'straight',
      'arrow-scale': 0,
      'z-index': 12
    })
    .selector('.bridge-connection')
    .style({
      'line-color': CONSTELLATION_PATTERNS['spectrum-bridge'].color,
      'line-style': CONSTELLATION_PATTERNS['spectrum-bridge'].lineStyle,
      'width': CONSTELLATION_PATTERNS['spectrum-bridge'].thickness,
      'opacity': CONSTELLATION_PATTERNS['spectrum-bridge'].opacity,
      'curve-style': 'haystack',
      'arrow-scale': 0,
      'z-index': 4
    })
    .update();
};

/**
 * Generate educational insights from constellation patterns
 */
const generateConstellationInsights = (patternStats) => {
  const insights = [];
  
  patternStats.constellationsActive.forEach(constellation => {
    const pattern = CONSTELLATION_PATTERNS[constellation];
    if (pattern) {
      insights.push({
        pattern: constellation,
        name: pattern.name,
        educational: pattern.educationalNote,
        clinical: pattern.clinicalContext,
        importance: constellation.includes('first-line') ? 'high' : 
                   constellation.includes('resistance') ? 'critical' : 'moderate'
      });
    }
  });

  return insights.sort((a, b) => {
    const importanceOrder = { 'critical': 0, 'high': 1, 'moderate': 2 };
    return importanceOrder[a.importance] - importanceOrder[b.importance];
  });
};

/**
 * Remove constellation patterns
 */
export const removeConstellationPatterns = (cy) => {
  try {
    if (!cy) return false;
    
    // Remove constellation elements
    cy.remove('.constellation-element');
    
    // Remove constellation classes
    cy.elements().removeClass('constellation-highlighted constellation-faded');
    
    return true;
  } catch (error) {
    console.error('Error removing constellation patterns:', error);
    return false;
  }
};

/**
 * Highlight specific constellation pattern
 */
export const highlightConstellationPattern = (cy, patternType) => {
  if (!cy || !CONSTELLATION_PATTERNS[patternType]) return;

  try {
    // Fade all elements
    cy.elements().addClass('constellation-faded');
    
    // Highlight specific pattern
    cy.elements(`[constellationType="${patternType}"]`)
      .removeClass('constellation-faded')
      .addClass('constellation-highlighted');
    
    // Highlight connected nodes
    cy.edges(`[constellationType="${patternType}"]`)
      .connectedNodes()
      .removeClass('constellation-faded')
      .addClass('constellation-highlighted');
      
  } catch (error) {
    console.error('Error highlighting constellation pattern:', error);
  }
};

/**
 * Clear constellation highlighting
 */
export const clearConstellationHighlight = (cy) => {
  if (!cy) return;
  
  try {
    cy.elements().removeClass('constellation-highlighted constellation-faded');
  } catch (error) {
    console.error('Error clearing constellation highlight:', error);
  }
};

export default {
  CONSTELLATION_PATTERNS,
  RESISTANCE_PATTERNS,
  applyConstellationPatterns,
  removeConstellationPatterns,
  highlightConstellationPattern,
  clearConstellationHighlight
};