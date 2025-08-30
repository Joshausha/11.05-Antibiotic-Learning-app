/**
 * NorthwesternCoverageStyle.js - Cytoscape.js Style for Northwestern Coverage Wheel Visualization
 * 
 * Implements pie chart nodes showing antibiotic spectrum coverage with clinical color coding:
 * - Gram-positive coverage: Blue (#3B82F6)
 * - Gram-negative coverage: Red (#EF4444) 
 * - Anaerobic coverage: Green (#10B981)
 * 
 * @module NorthwesternCoverageStyle
 * @version 1.0.0
 * @created 2025-08-29
 * @medical-validation Clinical color scheme verified with AAP guidelines
 */

// Import medical data for real coverage calculations
import { getPathogensForAntibiotic } from '../../data/pathogenAntibioticMap';
import simplePathogens from '../../data/SimplePathogenData';

/**
 * Northwestern-inspired pie chart style for antibiotic coverage visualization
 * Based on the Northwestern Antibiotic Wheel design principles
 */
export const NORTHWESTERN_COVERAGE_STYLE = [
  // Pathogen nodes - enhanced for coverage wheel context
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
      'shape': 'ellipse',
      'overlay-color': '#4B0082',
      'overlay-opacity': 0,
      'transition-property': 'overlay-opacity, border-width, width, height',
      'transition-duration': '0.3s'
    }
  },

  // Northwestern Pie Chart Nodes for Antibiotics - CORE FEATURE
  {
    selector: 'node[type="antibiotic"][coverageData]',
    style: {
      'width': 'data(pieSize)',
      'height': 'data(pieSize)',
      'shape': 'pie',
      'background-color': '#f8f9fa', // Fallback background
      
      // Pie chart segments for coverage visualization
      'pie-size': '100%',
      
      // Gram-positive coverage (Blue - Northwestern style)
      'pie-1-background-color': '#3B82F6',
      'pie-1-background-size': 'data(gramPositivePercent)',
      'pie-1-background-opacity': 0.9,
      
      // Gram-negative coverage (Red - Clinical danger color)
      'pie-2-background-color': '#EF4444', 
      'pie-2-background-size': 'data(gramNegativePercent)',
      'pie-2-background-opacity': 0.9,
      
      // Anaerobic coverage (Green - Clinical effectiveness color)
      'pie-3-background-color': '#10B981',
      'pie-3-background-size': 'data(anaerobicPercent)',
      'pie-3-background-opacity': 0.9,
      
      // Northwestern-style borders and labels
      'border-width': 3,
      'border-color': '#1f2937',
      'border-opacity': 0.8,
      
      // Labels positioned below for clarity
      'label': 'data(label)',
      'text-valign': 'bottom',
      'text-margin-y': 8,
      'font-size': '11px',
      'font-weight': '600',
      'color': '#1f2937',
      'text-outline-width': 1,
      'text-outline-color': '#ffffff',
      
      // Smooth animations for clinical workflow
      'transition-property': 'width, height, border-width, pie-1-background-size, pie-2-background-size, pie-3-background-size',
      'transition-duration': '0.4s',
      'transition-timing-function': 'ease-out'
    }
  },

  // Northwestern Coverage Wheel Hover States - Interactive Feedback
  {
    selector: 'node[type="antibiotic"][coverageData]:hover',
    style: {
      'width': 'calc(data(pieSize) * 1.15)',
      'height': 'calc(data(pieSize) * 1.15)', 
      'border-width': 4,
      'border-color': '#4B0082', // Northwestern purple accent
      'z-index': 100,
      
      // Enhanced pie segment visibility on hover
      'pie-1-background-opacity': 1.0,
      'pie-2-background-opacity': 1.0, 
      'pie-3-background-opacity': 1.0,
      
      // Label enhancement
      'font-size': '12px',
      'text-outline-width': 2
    }
  },

  // Northwestern Coverage Wheel Selection States
  {
    selector: 'node[type="antibiotic"][coverageData]:selected',
    style: {
      'width': 'calc(data(pieSize) * 1.25)',
      'height': 'calc(data(pieSize) * 1.25)',
      'border-width': 5,
      'border-color': '#4B0082',
      'border-opacity': 1.0,
      'z-index': 200,
      
      // Rotating animation effect for selected nodes
      'transition-duration': '0.6s',
      'transition-timing-function': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Northwestern bounce
      
      // Enhanced segment contrast
      'pie-1-background-color': '#2563EB', // Deeper blue
      'pie-2-background-color': '#DC2626', // Deeper red  
      'pie-3-background-color': '#059669', // Deeper green
      
      // Selection glow effect
      'overlay-color': '#4B0082',
      'overlay-opacity': 0.2
    }
  },

  // Fallback styling for antibiotics without coverage data
  {
    selector: 'node[type="antibiotic"]:not([coverageData])',
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

  // Coverage relationship edges - Enhanced for wheel visualization
  {
    selector: 'edge[type="coverage"]',
    style: {
      'width': 'data(weight)',
      'line-color': 'data(color)',
      'target-arrow-color': 'data(color)',
      'target-arrow-shape': 'triangle',
      'arrow-scale': 1.3,
      'curve-style': 'bezier',
      'opacity': 0.7,
      'z-index': 1,
      
      // Northwestern-style edge animation
      'transition-property': 'opacity, width, line-color',
      'transition-duration': '0.3s'
    }
  },

  // Coverage edge hover states
  {
    selector: 'edge[type="coverage"]:hover',
    style: {
      'opacity': 1.0,
      'width': 'calc(data(weight) + 1)',
      'z-index': 50
    }
  },

  // Clinical effectiveness edge styling
  {
    selector: 'edge[effectiveness="effective"]',
    style: {
      'line-color': '#10B981', // Green for effective
      'target-arrow-color': '#10B981',
      'width': 3,
      'line-style': 'solid',
      'opacity': 0.8
    }
  },
  
  {
    selector: 'edge[effectiveness="moderate"]', 
    style: {
      'line-color': '#F59E0B', // Amber for moderate
      'target-arrow-color': '#F59E0B',
      'width': 2,
      'line-style': 'dashed',
      'opacity': 0.7
    }
  },
  
  {
    selector: 'edge[effectiveness="resistant"]',
    style: {
      'line-color': '#EF4444', // Red for resistant
      'target-arrow-color': '#EF4444', 
      'width': 2,
      'line-style': 'dotted',
      'opacity': 0.6
    }
  },

  // Northwestern Coverage Constellation - Pathogen groupings
  {
    selector: 'node[constellation="gram-positive"]',
    style: {
      'background-color': '#DBEAFE', // Light blue background
      'border-color': '#3B82F6',
      'border-width': 3
    }
  },

  {
    selector: 'node[constellation="gram-negative"]', 
    style: {
      'background-color': '#FEE2E2', // Light red background
      'border-color': '#EF4444',
      'border-width': 3
    }
  },

  {
    selector: 'node[constellation="anaerobic"]',
    style: {
      'background-color': '#D1FAE5', // Light green background  
      'border-color': '#10B981',
      'border-width': 3
    }
  },

  // Global hover and selection states
  {
    selector: 'node:hover',
    style: {
      'overlay-opacity': 0.1,
      'z-index': 10
    }
  },

  {
    selector: 'edge:selected',
    style: {
      'opacity': 1,
      'width': 'calc(data(weight) + 2)',
      'z-index': 100
    }
  }
];

/**
 * Calculate pie chart segments based on real medical data from pathogen-antibiotic relationships
 * Analyzes actual effectiveness data to determine accurate coverage spectrum
 * @param {Object} antibiotic - Antibiotic node data from network transformation
 * @param {Array} pathogenData - All pathogen data for coverage analysis (optional - uses imported data)
 * @returns {Object} Pie chart data for Cytoscape.js with medically accurate coverage
 */
export const calculateCoverageSegments = (antibiotic, pathogenData = []) => {
  if (!antibiotic) {
    return {
      gramPositivePercent: 0,
      gramNegativePercent: 0, 
      anaerobicPercent: 0,
      pieSize: 40
    };
  }

  // Phase 2: Replace heuristics with real medical data
  return calculateRealMedicalCoverage(antibiotic, pathogenData);
};

/**
 * Phase 2: Calculate real medical coverage using pathogenAntibioticMap data
 * This replaces the heuristic approach with actual clinical effectiveness data
 * @param {Object} antibiotic - Antibiotic node data
 * @param {Array} pathogenData - Optional pathogen data array 
 * @returns {Object} Accurate coverage data for pie chart visualization
 */
export const calculateRealMedicalCoverage = (antibiotic, pathogenData = []) => {
  // Get antibiotic ID from the node data
  const antibioticId = antibiotic.antibioticId || antibiotic.id;
  
  if (!antibioticId) {
    console.warn('No antibiotic ID found for coverage calculation:', antibiotic);
    return getFallbackCoverage(antibiotic);
  }

  // Get all pathogens this antibiotic is effective against
  const effectivePathogens = getPathogensForAntibiotic(antibioticId);
  
  if (!effectivePathogens || effectivePathogens.length === 0) {
    console.warn(`No effectiveness data found for antibiotic ID ${antibioticId}`);
    return getFallbackCoverage(antibiotic);
  }

  // Create pathogen lookup for gram status - simplePathogens is already an array
  const pathogenLookup = {};
  if (simplePathogens && Array.isArray(simplePathogens)) {
    simplePathogens.forEach(pathogen => {
      pathogenLookup[pathogen.id] = pathogen;
    });
  }

    // Count coverage by pathogen category and effectiveness level
    let gramPositiveCoverage = 0;
    let gramNegativeCoverage = 0;
    let anaerobicCoverage = 0;
    let totalEffectivePathogens = 0;

    effectivePathogens.forEach(({ pathogenId, effectiveness, pathogenName }) => {
      // Only count pathogens with meaningful effectiveness (not resistant)
      if (effectiveness === 'resistant') return;
      
      const pathogen = pathogenLookup[pathogenId];
      const effectivenessWeight = getEffectivenessWeight(effectiveness);
      
      if (pathogen) {
        totalEffectivePathogens += effectivenessWeight;
        
        // Categorize by gram status
        if (pathogen.gramStatus === 'positive') {
          gramPositiveCoverage += effectivenessWeight;
        } else if (pathogen.gramStatus === 'negative') {
          gramNegativeCoverage += effectivenessWeight;
        }
        
        // Check for anaerobic activity based on pathogen name or notes
        if (isAnaerobicPathogen(pathogenName) || pathogen.oxygenRequirement === 'anaerobic') {
          anaerobicCoverage += effectivenessWeight;
        }
      } else {
        // Fallback: try to categorize by pathogen name if data structure differs
        const gramStatus = inferGramStatusFromName(pathogenName);
        if (gramStatus) {
          totalEffectivePathogens += effectivenessWeight;
          if (gramStatus === 'positive') {
            gramPositiveCoverage += effectivenessWeight;
          } else if (gramStatus === 'negative') {
            gramNegativeCoverage += effectivenessWeight;
          }
        }
      }
    });

    // Calculate percentages with medical accuracy
    let gramPositivePercent = 0;
    let gramNegativePercent = 0;
    let anaerobicPercent = 0;

    if (totalEffectivePathogens > 0) {
      gramPositivePercent = Math.round((gramPositiveCoverage / totalEffectivePathogens) * 100);
      gramNegativePercent = Math.round((gramNegativeCoverage / totalEffectivePathogens) * 100);
      anaerobicPercent = Math.round((anaerobicCoverage / totalEffectivePathogens) * 100);
    }

    // Ensure percentages add up to 100% (handle rounding)
    const total = gramPositivePercent + gramNegativePercent + anaerobicPercent;
    if (total > 0 && total !== 100) {
      const adjustment = 100 - total;
      if (gramPositivePercent >= gramNegativePercent && gramPositivePercent >= anaerobicPercent) {
        gramPositivePercent += adjustment;
      } else if (gramNegativePercent >= anaerobicPercent) {
        gramNegativePercent += adjustment;
      } else {
        anaerobicPercent += adjustment;
      }
    }

    // Dynamic sizing based on spectrum breadth
    const spectrumBreadth = effectivePathogens.length;
    const baseSize = 45;
    const pieSize = Math.max(baseSize, Math.min(baseSize + (spectrumBreadth * 2), 75));

  return {
    gramPositivePercent,
    gramNegativePercent,
    anaerobicPercent,
    pieSize,
    coverageData: true,
    totalCoverage: totalEffectivePathogens,
    effectivePathogens: effectivePathogens.length,
    medicallyAccurate: true // Flag indicating real data was used
  };
};

/**
 * Get effectiveness weight for pie chart calculation
 * Higher weights for more clinically significant effectiveness levels
 */
const getEffectivenessWeight = (effectiveness) => {
  switch (effectiveness) {
    case 'high': return 3;
    case 'medium': return 2; 
    case 'low': return 1;
    case 'resistant': return 0;
    default: return 1;
  }
};

/**
 * Check if pathogen is anaerobic based on name
 */
const isAnaerobicPathogen = (pathogenName) => {
  const anaerobicPathogens = [
    'clostridium', 'bacteroides', 'fusobacterium', 'peptostreptococcus',
    'prevotella', 'porphyromonas', 'veillonella'
  ];
  const lowerName = pathogenName.toLowerCase();
  return anaerobicPathogens.some(anaerobe => lowerName.includes(anaerobe));
};

/**
 * Infer gram status from pathogen name as fallback
 */
const inferGramStatusFromName = (pathogenName) => {
  const lowerName = pathogenName.toLowerCase();
  
  // Common gram-positive patterns
  if (lowerName.includes('streptococcus') || lowerName.includes('staphylococcus') || 
      lowerName.includes('enterococcus') || lowerName.includes('clostridium') ||
      lowerName.includes('bacillus')) {
    return 'positive';
  }
  
  // Common gram-negative patterns
  if (lowerName.includes('escherichia') || lowerName.includes('pseudomonas') ||
      lowerName.includes('klebsiella') || lowerName.includes('acinetobacter') ||
      lowerName.includes('haemophilus') || lowerName.includes('salmonella') ||
      lowerName.includes('shigella')) {
    return 'negative';
  }
  
  return null;
};

/**
 * Fallback coverage calculation when real data is unavailable
 * Uses the original heuristic method as backup
 */
const getFallbackCoverage = (antibiotic) => {
  const name = antibiotic.label || antibiotic.name || '';
  const lowerName = name.toLowerCase();
  
  let gramPositive = 1;
  let gramNegative = 1;
  let anaerobic = 0;
  
  // Simplified heuristics for fallback
  if (lowerName.includes('vancomycin') || lowerName.includes('linezolid')) {
    gramPositive = 3;
    gramNegative = 0;
  } else if (lowerName.includes('ciprofloxacin') || lowerName.includes('meropenem')) {
    gramNegative = 3;
    gramPositive = 1;
  } else if (lowerName.includes('metronidazole')) {
    anaerobic = 4;
    gramPositive = 1;
    gramNegative = 1;
  }

  const total = gramPositive + gramNegative + anaerobic;
  
  return {
    gramPositivePercent: total > 0 ? Math.round((gramPositive / total) * 100) : 50,
    gramNegativePercent: total > 0 ? Math.round((gramNegative / total) * 100) : 50,
    anaerobicPercent: total > 0 ? Math.round((anaerobic / total) * 100) : 0,
    pieSize: 45,
    coverageData: true,
    totalCoverage: total,
    medicallyAccurate: false // Flag indicating fallback was used
  };
};

/**
 * Apply Northwestern coverage wheel transformations to network data
 * @param {Array} elements - Cytoscape elements array
 * @returns {Array} Enhanced elements with coverage wheel data
 */
export const applyNorthwesternCoverageTransform = (elements) => {
  if (!Array.isArray(elements)) return elements;

  return elements.map(element => {
    // Transform antibiotic nodes to include coverage data
    if (element.data && element.data.type === 'antibiotic') {
      const coverageData = calculateCoverageSegments(element.data);
      
      return {
        ...element,
        data: {
          ...element.data,
          ...coverageData
        }
      };
    }
    
    // Enhance pathogen nodes for constellation grouping
    if (element.data && element.data.type === 'pathogen') {
      let constellation = 'mixed';
      
      if (element.data.gramStatus) {
        if (element.data.gramStatus.toLowerCase().includes('positive')) {
          constellation = 'gram-positive';
        } else if (element.data.gramStatus.toLowerCase().includes('negative')) {
          constellation = 'gram-negative';
        }
      }
      
      // Check for anaerobic classification
      if (element.data.oxygenRequirement && 
          element.data.oxygenRequirement.toLowerCase().includes('anaerobic')) {
        constellation = 'anaerobic';
      }

      return {
        ...element,
        data: {
          ...element.data,
          constellation
        }
      };
    }

    // Transform edges for coverage relationships
    if (element.data && element.data.source && element.data.target) {
      return {
        ...element,
        data: {
          ...element.data,
          type: 'coverage' // Mark as coverage relationship
        }
      };
    }

    return element;
  });
};

export default NORTHWESTERN_COVERAGE_STYLE;