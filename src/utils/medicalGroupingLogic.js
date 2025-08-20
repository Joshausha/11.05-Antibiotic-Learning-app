/**
 * Medical Grouping Logic System
 * 
 * Advanced drug class grouping algorithms and medical accuracy validation
 * for Northwestern antibiotic organization with clinical classification.
 * 
 * Created by: Agent 3.2 - Group Organization Designer
 * Phase: 3 - Spatial Organization System
 * Integration: Medical logic for Northwestern group organization
 * 
 * Features:
 * - Drug class grouping algorithms (Beta-lactams, Fluoroquinolones, etc.)
 * - Generation-based clustering within drug classes
 * - Route-based organization (oral, IV, both)
 * - Cell wall activity groupings and specializations
 * - Medical accuracy validation against clinical guidelines
 * - Coverage pattern analysis and statistics
 * - Northwestern methodology compliance checking
 * 
 * @module medicalGroupingLogic
 */

/**
 * Generation ordering system for drug classes
 * Based on clinical progression and development chronology
 */
export const GENERATION_ORDER = {
  cephalosporins: {
    '1st generation': { 
      order: 1, 
      clinicalFocus: 'Gram-positive, skin/soft tissue',
      examples: ['Cefazolin', 'Cephalexin'],
      coverage: 'Staphylococcus, Streptococcus'
    },
    '2nd generation': { 
      order: 2, 
      clinicalFocus: 'Enhanced gram-negative, respiratory',
      examples: ['Cefuroxime', 'Cefoxitin'],
      coverage: 'H. influenzae, some anaerobes'
    },
    '3rd generation': { 
      order: 3, 
      clinicalFocus: 'Broad spectrum, CNS penetration',
      examples: ['Ceftriaxone', 'Ceftazidime', 'Cefotaxime'],
      coverage: 'Enterobacteriaceae, some Pseudomonas'
    },
    '4th generation': { 
      order: 4, 
      clinicalFocus: 'Anti-pseudomonal, ICU infections',
      examples: ['Cefepime'],
      coverage: 'Pseudomonas, enhanced gram-positive'
    },
    '5th generation': { 
      order: 5, 
      clinicalFocus: 'MRSA coverage, advanced spectrum',
      examples: ['Ceftaroline'],
      coverage: 'MRSA, broad gram-negative'
    }
  },
  penicillins: {
    'Natural': { 
      order: 1, 
      clinicalFocus: 'Streptococcus, spirochetes',
      examples: ['Penicillin G', 'Penicillin V'],
      coverage: 'Strep, syphilis, some anaerobes'
    },
    'Penicillinase-resistant': { 
      order: 2, 
      clinicalFocus: 'Staphylococcus aureus',
      examples: ['Nafcillin', 'Oxacillin'],
      coverage: 'MSSA, beta-lactamase producing Staph'
    },
    'Extended-spectrum': { 
      order: 3, 
      clinicalFocus: 'Gram-negative coverage',
      examples: ['Ampicillin', 'Amoxicillin', 'Piperacillin'],
      coverage: 'Enterobacteriaceae, some Pseudomonas'
    }
  },
  fluoroquinolones: {
    '2nd generation': {
      order: 1,
      clinicalFocus: 'Gram-negative, urinary',
      examples: ['Ciprofloxacin', 'Ofloxacin'],
      coverage: 'Enterobacteriaceae, Pseudomonas'
    },
    '3rd generation': {
      order: 2,
      clinicalFocus: 'Enhanced gram-positive',
      examples: ['Levofloxacin'],
      coverage: 'Streptococcus, atypicals'
    },
    '4th generation': {
      order: 3,
      clinicalFocus: 'Enhanced gram-positive, anaerobes',
      examples: ['Moxifloxacin'],
      coverage: 'MRSA, anaerobes'
    }
  }
};

/**
 * Route classification system
 * Clinical route preferences and availability
 */
export const ROUTE_CLASSIFICATIONS = {
  'oral': {
    indicator: 'PO',
    clinicalContext: 'Outpatient therapy, step-down therapy',
    advantages: 'Patient convenience, cost-effective',
    limitations: 'Absorption variability, compliance issues'
  },
  'intravenous': {
    indicator: 'IV', 
    clinicalContext: 'Inpatient therapy, severe infections',
    advantages: '100% bioavailability, rapid onset',
    limitations: 'Requires vascular access, higher cost'
  },
  'intramuscular': {
    indicator: 'IM',
    clinicalContext: 'Single-dose therapy, depot formulations',
    advantages: 'Sustained levels, outpatient option',
    limitations: 'Injection site reactions, limited volume'
  },
  'topical': {
    indicator: 'TOP',
    clinicalContext: 'Localized infections, skin conditions',
    advantages: 'Minimal systemic exposure',
    limitations: 'Limited penetration, resistance development'
  }
};

/**
 * Mechanism of action classifications
 * Primary mechanisms and clinical implications
 */
export const MECHANISM_CLASSIFICATIONS = {
  cellWall: {
    name: 'Cell Wall Synthesis Inhibition',
    target: 'Peptidoglycan synthesis',
    killing: 'Bactericidal',
    classes: ['Penicillins', 'Cephalosporins', 'Carbapenems', 'Monobactams', 'Glycopeptides'],
    resistance: 'Beta-lactamases, altered PBPs, efflux pumps'
  },
  proteinSynthesis30S: {
    name: 'Protein Synthesis Inhibition (30S)',
    target: '30S ribosomal subunit',
    killing: 'Bactericidal',
    classes: ['Aminoglycosides'],
    resistance: 'Enzymatic modification, ribosomal mutations'
  },
  proteinSynthesis50S: {
    name: 'Protein Synthesis Inhibition (50S)',
    target: '50S ribosomal subunit',
    killing: 'Bacteriostatic (usually)',
    classes: ['Macrolides', 'Lincosamides', 'Chloramphenicol', 'Oxazolidinones'],
    resistance: 'Ribosomal methylation, efflux pumps'
  },
  dnaSynthesis: {
    name: 'DNA Synthesis Inhibition',
    target: 'DNA gyrase, topoisomerase IV',
    killing: 'Bactericidal',
    classes: ['Fluoroquinolones'],
    resistance: 'Target mutations, efflux pumps'
  },
  cellMembrane: {
    name: 'Cell Membrane Disruption',
    target: 'Cytoplasmic membrane',
    killing: 'Bactericidal',
    classes: ['Lipopeptides', 'Polymyxins'],
    resistance: 'Membrane modifications'
  },
  metabolic: {
    name: 'Metabolic Pathway Inhibition',
    target: 'Folate synthesis, other pathways',
    killing: 'Bacteriostatic',
    classes: ['Sulfonamides', 'Trimethoprim'],
    resistance: 'Alternative pathways, target overproduction'
  }
};

/**
 * Group antibiotics by drug class with medical accuracy validation
 * @param {Array} antibiotics - Array of antibiotic objects
 * @returns {Object} Antibiotics grouped by drug class
 */
export const classifyByDrugClass = (antibiotics) => {
  const grouped = {};
  
  antibiotics.forEach(antibiotic => {
    const drugClass = antibiotic.class || 'Other';
    if (!grouped[drugClass]) {
      grouped[drugClass] = [];
    }
    grouped[drugClass].push(antibiotic);
  });
  
  // Sort within each class by generation and name
  Object.keys(grouped).forEach(drugClass => {
    grouped[drugClass].sort((a, b) => {
      // First sort by generation if available
      if (a.generation && b.generation) {
        const classGenerations = GENERATION_ORDER[drugClass.toLowerCase()] || {};
        const aOrder = classGenerations[a.generation]?.order || 999;
        const bOrder = classGenerations[b.generation]?.order || 999;
        if (aOrder !== bOrder) return aOrder - bOrder;
      }
      
      // Then sort by name
      return a.name.localeCompare(b.name);
    });
  });
  
  return grouped;
};

/**
 * Classify antibiotics by mechanism of action
 * @param {Array} antibiotics - Array of antibiotic objects
 * @returns {Object} Antibiotics grouped by mechanism
 */
export const classifyByMechanism = (antibiotics) => {
  const mechanismGroups = {
    cellWall: [],
    proteinSynthesis30S: [],
    proteinSynthesis50S: [],
    dnaSynthesis: [],
    cellMembrane: [],
    metabolic: [],
    other: []
  };
  
  antibiotics.forEach(antibiotic => {
    const drugClass = antibiotic.class;
    
    if (antibiotic.cellWallActive || 
        ['Penicillins', 'Cephalosporins', 'Carbapenems', 'Monobactams', 'Glycopeptides'].includes(drugClass)) {
      mechanismGroups.cellWall.push(antibiotic);
    } else if (['Aminoglycosides'].includes(drugClass)) {
      mechanismGroups.proteinSynthesis30S.push(antibiotic);
    } else if (['Macrolides', 'Lincosamides', 'Chloramphenicol', 'Oxazolidinones'].includes(drugClass)) {
      mechanismGroups.proteinSynthesis50S.push(antibiotic);
    } else if (['Fluoroquinolones', 'Quinolones'].includes(drugClass)) {
      mechanismGroups.dnaSynthesis.push(antibiotic);
    } else if (['Lipopeptides', 'Polymyxins'].includes(drugClass)) {
      mechanismGroups.cellMembrane.push(antibiotic);
    } else if (['Sulfonamides', 'Trimethoprim'].includes(drugClass)) {
      mechanismGroups.metabolic.push(antibiotic);
    } else {
      mechanismGroups.other.push(antibiotic);
    }
  });
  
  return mechanismGroups;
};

/**
 * Classify antibiotics by generation within drug class
 * @param {Array} antibiotics - Array of antibiotics from same class
 * @param {string} drugClass - Drug class name
 * @returns {Object} Antibiotics grouped by generation
 */
export const classifyByGeneration = (antibiotics, drugClass) => {
  const generations = {};
  const classKey = drugClass.toLowerCase().replace(/\s+/g, '');
  const generationOrder = GENERATION_ORDER[classKey] || {};
  
  antibiotics.forEach(antibiotic => {
    const generation = antibiotic.generation || 'Unspecified';
    if (!generations[generation]) {
      generations[generation] = [];
    }
    generations[generation].push(antibiotic);
  });
  
  // Sort generations by order
  const sortedGenerations = {};
  Object.keys(generations)
    .sort((a, b) => {
      const aOrder = generationOrder[a]?.order || 999;
      const bOrder = generationOrder[b]?.order || 999;
      return aOrder - bOrder;
    })
    .forEach(generation => {
      sortedGenerations[generation] = generations[generation].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
    });
  
  return sortedGenerations;
};

/**
 * Classify antibiotics by route of administration
 * @param {Array} antibiotics - Array of antibiotic objects
 * @returns {Object} Antibiotics grouped by route
 */
export const classifyByRoute = (antibiotics) => {
  const routeGroups = {
    oral: [],
    intravenous: [],
    both: [],
    other: []
  };
  
  antibiotics.forEach(antibiotic => {
    const route = antibiotic.route || '';
    
    if (route.includes('PO') && (route.includes('IV') || route.includes('IM'))) {
      routeGroups.both.push(antibiotic);
    } else if (route.includes('PO')) {
      routeGroups.oral.push(antibiotic);
    } else if (route.includes('IV') || route.includes('IM')) {
      routeGroups.intravenous.push(antibiotic);
    } else {
      routeGroups.other.push(antibiotic);
    }
  });
  
  return routeGroups;
};

/**
 * Calculate comprehensive group statistics
 * @param {Array} groupAntibiotics - Antibiotics in the group
 * @returns {Object} Statistical analysis of the group
 */
export const calculateGroupStatistics = (groupAntibiotics) => {
  if (!groupAntibiotics || groupAntibiotics.length === 0) {
    return null;
  }

  const stats = {
    totalCount: groupAntibiotics.length,
    routeDistribution: {},
    generationDistribution: {},
    mechanismDistribution: {},
    resistancePatterns: [],
    commonUses: [],
    sideEffects: []
  };
  
  // Calculate route distribution
  const routeGroups = classifyByRoute(groupAntibiotics);
  stats.routeDistribution = {
    oral: routeGroups.oral.length,
    intravenous: routeGroups.intravenous.length,
    both: routeGroups.both.length,
    other: routeGroups.other.length
  };
  
  // Calculate generation distribution
  groupAntibiotics.forEach(antibiotic => {
    if (antibiotic.generation) {
      stats.generationDistribution[antibiotic.generation] = 
        (stats.generationDistribution[antibiotic.generation] || 0) + 1;
    }
  });
  
  // Calculate mechanism distribution
  const mechanismGroups = classifyByMechanism(groupAntibiotics);
  Object.keys(mechanismGroups).forEach(mechanism => {
    if (mechanismGroups[mechanism].length > 0) {
      stats.mechanismDistribution[mechanism] = mechanismGroups[mechanism].length;
    }
  });
  
  // Collect resistance patterns
  stats.resistancePatterns = groupAntibiotics
    .map(ab => ab.resistance)
    .filter(Boolean)
    .reduce((acc, pattern) => {
      acc[pattern] = (acc[pattern] || 0) + 1;
      return acc;
    }, {});
  
  // Collect common uses
  groupAntibiotics.forEach(antibiotic => {
    if (antibiotic.commonUses && Array.isArray(antibiotic.commonUses)) {
      stats.commonUses.push(...antibiotic.commonUses);
    }
  });
  stats.commonUses = [...new Set(stats.commonUses)]; // Remove duplicates
  
  // Collect side effects
  groupAntibiotics.forEach(antibiotic => {
    if (antibiotic.sideEffects && Array.isArray(antibiotic.sideEffects)) {
      stats.sideEffects.push(...antibiotic.sideEffects);
    }
  });
  stats.sideEffects = [...new Set(stats.sideEffects)]; // Remove duplicates
  
  return stats;
};

/**
 * Calculate coverage summary for group
 * @param {Array} groupAntibiotics - Antibiotics in the group
 * @returns {Object} Coverage analysis across Northwestern 8-segment model
 */
export const calculateCoverageSummary = (groupAntibiotics) => {
  if (!groupAntibiotics || groupAntibiotics.length === 0) {
    return null;
  }

  const coverageStats = {
    MRSA: 0, VRE_faecium: 0, anaerobes: 0, atypicals: 0,
    pseudomonas: 0, gramNegative: 0, MSSA: 0, enterococcus_faecalis: 0
  };

  const coverageDetails = {};
  
  groupAntibiotics.forEach(antibiotic => {
    if (antibiotic.northwesternSpectrum) {
      Object.keys(antibiotic.northwesternSpectrum).forEach(pathogen => {
        const coverage = antibiotic.northwesternSpectrum[pathogen];
        coverageStats[pathogen] += coverage;
        
        if (!coverageDetails[pathogen]) {
          coverageDetails[pathogen] = { good: 0, moderate: 0, poor: 0 };
        }
        
        if (coverage >= 2) coverageDetails[pathogen].good++;
        else if (coverage >= 1) coverageDetails[pathogen].moderate++;
        else coverageDetails[pathogen].poor++;
      });
    }
  });

  // Calculate averages and ratings
  const summary = {};
  Object.keys(coverageStats).forEach(pathogen => {
    const avgCoverage = coverageStats[pathogen] / groupAntibiotics.length;
    const details = coverageDetails[pathogen] || { good: 0, moderate: 0, poor: 0 };
    
    summary[pathogen] = {
      average: avgCoverage,
      rating: avgCoverage >= 1.5 ? 'Good' : avgCoverage >= 0.5 ? 'Moderate' : 'Poor',
      distribution: details,
      percentage: {
        good: (details.good / groupAntibiotics.length) * 100,
        moderate: (details.moderate / groupAntibiotics.length) * 100,
        poor: (details.poor / groupAntibiotics.length) * 100
      }
    };
  });

  return summary;
};

/**
 * Get enhanced medical grouping data
 * @param {Object} spatialGroups - Groups from spatial layout
 * @param {Object} medicalDefinitions - Medical group definitions
 * @returns {Object} Enhanced medical grouping data
 */
export const getMedicalGroupingData = (spatialGroups, medicalDefinitions) => {
  const enhancedGroups = {};
  
  Object.keys(spatialGroups).forEach(groupKey => {
    const spatialGroup = spatialGroups[groupKey];
    const medicalDefinition = medicalDefinitions[groupKey];
    
    if (spatialGroup && medicalDefinition) {
      enhancedGroups[groupKey] = {
        ...spatialGroup,
        ...medicalDefinition,
        // Add medical context and validation
        medicalContext: medicalDefinition.medicalContext,
        mechanism: medicalDefinition.mechanism,
        clinicalContext: medicalDefinition.clinicalContext,
        resistanceMechanism: medicalDefinition.resistanceMechanism,
        emergencyUse: medicalDefinition.emergencyUse
      };
    }
  });
  
  return { groups: enhancedGroups };
};

/**
 * Validate medical accuracy of group classifications
 * @param {Object} groups - Group classifications to validate
 * @param {Object} medicalDefinitions - Medical group definitions
 * @returns {Object} Validation results
 */
export const validateMedicalAccuracy = (groups, medicalDefinitions) => {
  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
    validationResults: {}
  };
  
  Object.keys(groups).forEach(groupKey => {
    const group = groups[groupKey];
    const definition = medicalDefinitions[groupKey];
    
    if (!definition) {
      validation.errors.push(`No medical definition found for group: ${groupKey}`);
      validation.isValid = false;
      return;
    }
    
    const groupValidation = {
      classificationAccuracy: true,
      mechanismConsistency: true,
      generationOrder: true,
      clinicalContext: true
    };
    
    // Validate drug class assignments
    if (group.antibiotics) {
      group.antibiotics.forEach(antibiotic => {
        if (definition.classes && !definition.classes.includes(antibiotic.class)) {
          validation.warnings.push(
            `${antibiotic.name} (${antibiotic.class}) may not belong in ${group.name} group`
          );
          groupValidation.classificationAccuracy = false;
        }
      });
    }
    
    // Validate mechanism consistency
    if (group.mechanism && group.antibiotics) {
      const mechanismGroups = classifyByMechanism(group.antibiotics);
      const expectedMechanism = group.mechanism.toLowerCase();
      
      if (expectedMechanism.includes('cell wall') && mechanismGroups.cellWall.length !== group.antibiotics.length) {
        validation.warnings.push(`${group.name} group has inconsistent cell wall mechanism classification`);
        groupValidation.mechanismConsistency = false;
      }
    }
    
    // Validate generation ordering within classes
    if (group.generationGroups) {
      Object.keys(group.generationGroups).forEach(className => {
        const generations = group.generationGroups[className];
        const classKey = className.toLowerCase().replace(/\s+/g, '');
        const expectedOrder = GENERATION_ORDER[classKey];
        
        if (expectedOrder) {
          const generationKeys = Object.keys(generations);
          const orderedKeys = generationKeys.sort((a, b) => {
            const aOrder = expectedOrder[a]?.order || 999;
            const bOrder = expectedOrder[b]?.order || 999;
            return aOrder - bOrder;
          });
          
          if (JSON.stringify(generationKeys) !== JSON.stringify(orderedKeys)) {
            validation.warnings.push(`Generation ordering may be incorrect for ${className} in ${group.name}`);
            groupValidation.generationOrder = false;
          }
        }
      });
    }
    
    validation.validationResults[groupKey] = groupValidation;
  });
  
  return validation;
};

/**
 * Performance utility functions for group calculations
 */
export const performanceUtils = {
  /**
   * Get groups visible in current viewport
   * @param {Object} viewport - Viewport information
   * @param {Object} groups - Group data
   * @returns {Object} Visible groups
   */
  getVisibleGroups: (viewport, groups) => {
    // For now, return all groups - viewport culling can be added later
    return groups;
  },
  
  /**
   * Calculate render priority for groups
   * @param {Object} groups - Group data
   * @param {Object} userFocus - User interaction focus
   * @returns {Array} Groups ordered by render priority
   */
  calculateGroupRenderPriority: (groups, userFocus = {}) => {
    const prioritized = Object.keys(groups).map(groupKey => ({
      groupKey,
      group: groups[groupKey],
      priority: groups[groupKey].priority || 999
    }));
    
    // Adjust priority based on user focus
    if (userFocus.selectedGroup) {
      const focusedIndex = prioritized.findIndex(g => g.groupKey === userFocus.selectedGroup);
      if (focusedIndex !== -1) {
        prioritized[focusedIndex].priority = 0;
      }
    }
    
    return prioritized.sort((a, b) => a.priority - b.priority);
  }
};

export default {
  classifyByDrugClass,
  classifyByMechanism,
  classifyByGeneration,
  classifyByRoute,
  calculateGroupStatistics,
  calculateCoverageSummary,
  getMedicalGroupingData,
  validateMedicalAccuracy,
  performanceUtils,
  GENERATION_ORDER,
  ROUTE_CLASSIFICATIONS,
  MECHANISM_CLASSIFICATIONS
};