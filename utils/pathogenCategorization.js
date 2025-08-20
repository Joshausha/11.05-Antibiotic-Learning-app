/**
 * Pathogen Categorization Logic for Venn Diagram Visualization
 * Transforms pathogen and antibiotic data into categories for visual comparison
 */

import simplePathogens from '../data/SimplePathogenData.js';
import pathogenAntibioticMap from '../data/pathogenAntibioticMap.js';

/**
 * Categorize pathogens by gram status and infection type
 * @returns {Object} Categories for Venn diagram visualization
 */
export const categorizePathogens = () => {
  const categories = {
    gramPositive: {
      name: 'Gram-Positive',
      pathogens: simplePathogens.filter(p => p.gramStatus === 'positive'),
      color: '#3B82F6', // Blue
      description: 'Bacteria with thick peptidoglycan cell walls'
    },
    gramNegative: {
      name: 'Gram-Negative', 
      pathogens: simplePathogens.filter(p => p.gramStatus === 'negative'),
      color: '#EF4444', // Red
      description: 'Bacteria with thin peptidoglycan walls and outer membrane'
    },
    atypical: {
      name: 'Atypical',
      pathogens: [], // Will be populated based on antibiotic effectiveness patterns
      color: '#10B981', // Green
      description: 'Organisms requiring special consideration (intracellular, unusual cell walls)'
    }
  };

  // Add atypical coverage inference based on macrolide/tetracycline effectiveness
  // This represents organisms like Mycoplasma, Chlamydia, Legionella
  categories.atypical.pathogens = inferAtypicalCoverage();

  return categories;
};

/**
 * Infer atypical pathogen coverage based on antibiotic effectiveness patterns
 * @returns {Array} Inferred atypical organisms
 */
const inferAtypicalCoverage = () => {
  // Atypical organisms are typically covered by macrolides, tetracyclines, fluoroquinolones
  // For educational purposes, we'll create conceptual atypical coverage
  return [
    {
      id: 'atypical-1',
      name: 'Mycoplasma pneumoniae',
      commonName: 'Mycoplasma',
      gramStatus: 'atypical',
      description: 'Lacks cell wall, causes atypical pneumonia',
      commonSites: ['Lungs', 'Upper respiratory tract']
    },
    {
      id: 'atypical-2', 
      name: 'Chlamydia pneumoniae',
      commonName: 'Chlamydia',
      gramStatus: 'atypical',
      description: 'Obligate intracellular pathogen',
      commonSites: ['Lungs', 'Upper respiratory tract']
    },
    {
      id: 'atypical-3',
      name: 'Legionella pneumophila',
      commonName: 'Legionella',
      gramStatus: 'atypical',
      description: 'Intracellular pathogen, requires special media',
      commonSites: ['Lungs']
    }
  ];
};

/**
 * Calculate antibiotic effectiveness scores for each pathogen category
 * @param {number} antibioticId - ID of the antibiotic to analyze
 * @returns {Object} Effectiveness scores for each category
 */
export const calculateCategoryEffectiveness = (antibioticId) => {
  const categories = categorizePathogens();
  const effectiveness = {
    gramPositive: 0,
    gramNegative: 0,
    atypical: 0
  };

  // Calculate gram-positive effectiveness
  const gramPosPathogens = categories.gramPositive.pathogens;
  let gramPosScore = 0;
  let gramPosCount = 0;

  gramPosPathogens.forEach(pathogen => {
    const pathogenData = pathogenAntibioticMap[pathogen.id];
    if (pathogenData) {
      const antibiotic = pathogenData.antibiotics.find(ab => ab.antibioticId === antibioticId);
      if (antibiotic) {
        gramPosScore += getEffectivenessScore(antibiotic.effectiveness);
        gramPosCount++;
      }
    }
  });

  effectiveness.gramPositive = gramPosCount > 0 ? gramPosScore / gramPosCount : 0;

  // Calculate gram-negative effectiveness
  const gramNegPathogens = categories.gramNegative.pathogens;
  let gramNegScore = 0;
  let gramNegCount = 0;

  gramNegPathogens.forEach(pathogen => {
    const pathogenData = pathogenAntibioticMap[pathogen.id];
    if (pathogenData) {
      const antibiotic = pathogenData.antibiotics.find(ab => ab.antibioticId === antibioticId);
      if (antibiotic) {
        gramNegScore += getEffectivenessScore(antibiotic.effectiveness);
        gramNegCount++;
      }
    }
  });

  effectiveness.gramNegative = gramNegCount > 0 ? gramNegScore / gramNegCount : 0;

  // Calculate atypical effectiveness (inferred from drug class)
  effectiveness.atypical = calculateAtypicalEffectiveness(antibioticId);

  return effectiveness;
};

/**
 * Convert effectiveness rating to numerical score
 * @param {string} effectiveness - Effectiveness rating (high, medium, low, resistant)
 * @returns {number} Numerical score (0-100)
 */
const getEffectivenessScore = (effectiveness) => {
  const scoreMap = {
    'high': 100,
    'medium': 60,
    'low': 30,
    'resistant': 0
  };
  return scoreMap[effectiveness] || 0;
};

/**
 * Calculate atypical effectiveness based on antibiotic class
 * @param {number} antibioticId - ID of the antibiotic
 * @returns {number} Atypical effectiveness score (0-100)
 */
const calculateAtypicalEffectiveness = (antibioticId) => {
  // Define atypical coverage by antibiotic class
  const atypicalCoverage = {
    // Macrolides - excellent atypical coverage
    5: 100,   // Azithromycin
    
    // Tetracyclines - good atypical coverage
    9: 90,    // Doxycycline
    
    // Fluoroquinolones - good atypical coverage
    3: 85,    // Ciprofloxacin
    
    // Beta-lactams - poor atypical coverage
    1: 0,     // Penicillin
    4: 0,     // Ceftriaxone
    8: 0,     // Meropenem
    13: 0,    // Cefazolin
    14: 0,    // Piperacillin-Tazobactam
    15: 0,    // Ampicillin
    
    // Glycopeptides - no atypical coverage
    2: 0,     // Vancomycin
    
    // Lincosamides - limited atypical coverage
    6: 20,    // Clindamycin
    
    // Aminoglycosides - no atypical coverage
    7: 0,     // Gentamicin
    
    // Oxazolidinones - limited atypical coverage
    11: 30,   // Linezolid
    
    // Nitroimidazoles - no atypical coverage
    12: 0,    // Metronidazole
    
    // Folate antagonists - limited atypical coverage
    10: 40    // Trimethoprim-Sulfamethoxazole
  };

  return atypicalCoverage[antibioticId] || 0;
};

/**
 * Determine Venn diagram placement for an antibiotic
 * @param {number} antibioticId - ID of the antibiotic
 * @returns {Object} Placement coordinates and coverage data
 */
export const calculateVennPlacement = (antibioticId) => {
  const effectiveness = calculateCategoryEffectiveness(antibioticId);
  const threshold = 50; // Effectiveness threshold for inclusion in a category
  
  // Determine which circles the antibiotic belongs to
  const inGramPositive = effectiveness.gramPositive >= threshold;
  const inGramNegative = effectiveness.gramNegative >= threshold;
  const inAtypical = effectiveness.atypical >= threshold;

  // Calculate placement coordinates (will be used for SVG positioning)
  let placement = {
    x: 0,
    y: 0,
    region: 'none',
    coverage: effectiveness,
    description: generateCoverageDescription(effectiveness)
  };

  // Determine region and coordinates
  if (inGramPositive && inGramNegative && inAtypical) {
    placement.region = 'all';
    placement.x = 0;
    placement.y = 0;
    placement.description = 'Broad-spectrum coverage';
  } else if (inGramPositive && inGramNegative) {
    placement.region = 'gram-pos-neg';
    placement.x = -20;
    placement.y = 20;
    placement.description = 'Gram-positive and gram-negative coverage';
  } else if (inGramPositive && inAtypical) {
    placement.region = 'gram-pos-atypical';
    placement.x = -40;
    placement.y = -20;
    placement.description = 'Gram-positive and atypical coverage';
  } else if (inGramNegative && inAtypical) {
    placement.region = 'gram-neg-atypical';
    placement.x = 20;
    placement.y = -20;
    placement.description = 'Gram-negative and atypical coverage';
  } else if (inGramPositive) {
    placement.region = 'gram-positive';
    placement.x = -60;
    placement.y = 0;
    placement.description = 'Primarily gram-positive coverage';
  } else if (inGramNegative) {
    placement.region = 'gram-negative';
    placement.x = 60;
    placement.y = 0;
    placement.description = 'Primarily gram-negative coverage';
  } else if (inAtypical) {
    placement.region = 'atypical';
    placement.x = 0;
    placement.y = -60;
    placement.description = 'Primarily atypical coverage';
  } else {
    placement.region = 'limited';
    placement.x = 0;
    placement.y = 80;
    placement.description = 'Limited spectrum coverage';
  }

  return placement;
};

/**
 * Generate human-readable coverage description
 * @param {Object} effectiveness - Effectiveness scores for each category
 * @returns {string} Coverage description
 */
const generateCoverageDescription = (effectiveness) => {
  const descriptions = [];
  
  if (effectiveness.gramPositive >= 80) {
    descriptions.push('Excellent gram-positive coverage');
  } else if (effectiveness.gramPositive >= 50) {
    descriptions.push('Good gram-positive coverage');
  } else if (effectiveness.gramPositive >= 30) {
    descriptions.push('Limited gram-positive coverage');
  }

  if (effectiveness.gramNegative >= 80) {
    descriptions.push('Excellent gram-negative coverage');
  } else if (effectiveness.gramNegative >= 50) {
    descriptions.push('Good gram-negative coverage');
  } else if (effectiveness.gramNegative >= 30) {
    descriptions.push('Limited gram-negative coverage');
  }

  if (effectiveness.atypical >= 80) {
    descriptions.push('Excellent atypical coverage');
  } else if (effectiveness.atypical >= 50) {
    descriptions.push('Good atypical coverage');
  } else if (effectiveness.atypical >= 30) {
    descriptions.push('Limited atypical coverage');
  }

  return descriptions.join(', ') || 'Narrow spectrum coverage';
};

/**
 * Get all antibiotics with their Venn diagram data
 * @returns {Array} Array of antibiotics with placement and coverage data
 */
export const getAllAntibioticVennData = () => {
  const antibiotics = [];
  
  // Process each antibiotic (IDs 1-15)
  for (let i = 1; i <= 15; i++) {
    const placement = calculateVennPlacement(i);
    const effectiveness = calculateCategoryEffectiveness(i);
    
    antibiotics.push({
      id: i,
      placement,
      effectiveness,
      region: placement.region
    });
  }

  return antibiotics;
};

/**
 * Data validation for pathogen categorization
 * @returns {Array} Array of validation errors, empty if valid
 */
export const validateCategorizationData = () => {
  const errors = [];
  
  try {
    const categories = categorizePathogens();
    
    // Validate gram-positive pathogens
    if (categories.gramPositive.pathogens.length === 0) {
      errors.push('No gram-positive pathogens found');
    }
    
    // Validate gram-negative pathogens
    if (categories.gramNegative.pathogens.length === 0) {
      errors.push('No gram-negative pathogens found');
    }
    
    // Test effectiveness calculation
    const testEffectiveness = calculateCategoryEffectiveness(1);
    if (typeof testEffectiveness.gramPositive !== 'number') {
      errors.push('Effectiveness calculation failed');
    }
    
    // Test Venn placement
    const testPlacement = calculateVennPlacement(1);
    if (!testPlacement.region) {
      errors.push('Venn placement calculation failed');
    }
    
  } catch (error) {
    errors.push(`Categorization validation error: ${error.message}`);
  }
  
  return errors;
};

export default {
  categorizePathogens,
  calculateCategoryEffectiveness,
  calculateVennPlacement,
  getAllAntibioticVennData,
  validateCategorizationData
};