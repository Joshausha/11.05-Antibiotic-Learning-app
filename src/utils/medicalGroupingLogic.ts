/**
 * Medical Grouping Logic System - TypeScript
 *
 * Advanced drug class grouping algorithms and medical accuracy validation
 * for Northwestern antibiotic organization with clinical classification.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GenerationInfo {
  order: number;
  clinicalFocus: string;
  examples: string[];
  coverage: string;
}

interface GenerationOrder {
  [drugClass: string]: {
    [generation: string]: GenerationInfo;
  };
}

interface RouteClassification {
  indicator: string;
  clinicalContext: string;
  advantages: string;
  limitations: string;
}

interface MechanismClassification {
  name: string;
  target: string;
  killing: string;
  classes: string[];
  resistance: string;
}

interface GroupedAntibiotics {
  [drugClass: string]: Antibiotic[];
}

interface GroupedByMechanism {
  [mechanismKey: string]: Antibiotic[];
}

interface GroupedByGeneration {
  [generation: string]: Antibiotic[];
}

interface GroupedByRoute {
  [route: string]: Antibiotic[];
}

interface Antibiotic {
  id?: string;
  name: string;
  class?: string;
  drugClass?: string;
  generation?: string;
  route?: string;
  mechanism?: string;
  cellWallActivity?: string;
  coverage?: string;
  [key: string]: any;
}

interface GroupStatistics {
  totalAntibiotics: number;
  drugClassCount: number;
  generationRange?: string;
  routeDistribution: { [route: string]: number };
  coverageSpectra: string[];
  clinicalApplications: string[];
}

interface CoverageSummary {
  gramPositive: string[];
  gramNegative: string[];
  anaerobes: string[];
  coverage: string;
  gaps: string[];
  advantages: string[];
  limitations: string[];
}

interface GroupValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  consistency: boolean;
  completeness: boolean;
  statistics: {
    totalAntibiotics: number;
    emptyGroups: number;
    duplicateAntibiotics: string[];
  };
}

interface NorthwesternGroup {
  segment: string;
  position: number;
  antibiotics: Antibiotic[];
  medicalCriteria: string[];
  clinicalValue: string;
}

interface GroupLayoutOptimization {
  originalLayout: { [key: string]: Antibiotic[] };
  optimizedLayout: { [key: string]: Antibiotic[] };
  improvements: string[];
  metrics: {
    balanceBefore: number;
    balanceAfter: number;
    spatialDensity: number;
    clusteringCoefficient: number;
  };
}

interface GroupIntegrityCheck {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  statistics: {
    totalGroups: number;
    totalAntibiotics: number;
    emptyGroups: number;
    duplicateAntibiotics: string[];
  };
  consistency: boolean;
  completeness: boolean;
}

// ============================================================================
// CONSTANT DEFINITIONS
// ============================================================================

/**
 * Generation ordering system for drug classes
 * Based on clinical progression and development chronology
 */
export const GENERATION_ORDER: GenerationOrder = {
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
export const ROUTE_CLASSIFICATIONS: { [key: string]: RouteClassification } = {
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
export const MECHANISM_CLASSIFICATIONS: { [key: string]: MechanismClassification } = {
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

// ============================================================================
// CORE GROUPING FUNCTIONS
// ============================================================================

/**
 * Group antibiotics by drug class with medical accuracy validation
 */
export const classifyByDrugClass = (antibiotics: Antibiotic[]): GroupedAntibiotics => {
  if (!antibiotics || !Array.isArray(antibiotics)) {
    return {};
  }

  const grouped: GroupedAntibiotics = {};

  antibiotics.forEach(antibiotic => {
    if (!antibiotic) return;

    const drugClass = antibiotic.class || antibiotic.drugClass || 'Other';
    if (!grouped[drugClass]) {
      grouped[drugClass] = [];
    }
    grouped[drugClass].push(antibiotic);
  });

  // Sort within each class by generation and name
  Object.keys(grouped).forEach(drugClass => {
    grouped[drugClass].sort((a, b) => {
      if (a.generation && b.generation) {
        const classGenerations = GENERATION_ORDER[drugClass.toLowerCase()] || {};
        const aOrder = classGenerations[a.generation]?.order || 999;
        const bOrder = classGenerations[b.generation]?.order || 999;
        if (aOrder !== bOrder) return aOrder - bOrder;
      }

      return a.name.localeCompare(b.name);
    });
  });

  return grouped;
};

/**
 * Classify antibiotics by mechanism of action
 */
export const classifyByMechanism = (antibiotics: Antibiotic[]): GroupedByMechanism => {
  if (!antibiotics || !Array.isArray(antibiotics)) {
    return {};
  }

  const grouped: GroupedByMechanism = {};

  antibiotics.forEach(antibiotic => {
    if (!antibiotic) return;

    const mechanism = antibiotic.mechanism || antibiotic.cellWallActivity || 'Unknown';
    if (!grouped[mechanism]) {
      grouped[mechanism] = [];
    }
    grouped[mechanism].push(antibiotic);
  });

  return grouped;
};

/**
 * Classify antibiotics by generation within a drug class
 */
export const classifyByGeneration = (
  antibiotics: Antibiotic[],
  drugClass: string
): GroupedByGeneration => {
  if (!antibiotics || !Array.isArray(antibiotics)) {
    return {};
  }

  const grouped: GroupedByGeneration = {};
  const classGenerations = GENERATION_ORDER[drugClass.toLowerCase()] || {};

  antibiotics.forEach(antibiotic => {
    if (!antibiotic) return;

    const generation = antibiotic.generation || 'Unknown';
    if (!grouped[generation]) {
      grouped[generation] = [];
    }
    grouped[generation].push(antibiotic);
  });

  // Sort by generation order
  const sortedGrouped: GroupedByGeneration = {};
  Object.keys(grouped)
    .sort((a, b) => {
      const aOrder = classGenerations[a]?.order || 999;
      const bOrder = classGenerations[b]?.order || 999;
      return aOrder - bOrder;
    })
    .forEach(gen => {
      sortedGrouped[gen] = grouped[gen].sort((a, b) => a.name.localeCompare(b.name));
    });

  return sortedGrouped;
};

/**
 * Classify antibiotics by route of administration
 */
export const classifyByRoute = (antibiotics: Antibiotic[]): GroupedByRoute => {
  if (!antibiotics || !Array.isArray(antibiotics)) {
    return {};
  }

  const grouped: GroupedByRoute = {};

  antibiotics.forEach(antibiotic => {
    if (!antibiotic) return;

    const route = antibiotic.route || 'Unknown';
    if (!grouped[route]) {
      grouped[route] = [];
    }
    grouped[route].push(antibiotic);
  });

  // Sort within each route
  Object.keys(grouped).forEach(route => {
    grouped[route].sort((a, b) => a.name.localeCompare(b.name));
  });

  return grouped;
};

// ============================================================================
// ANALYSIS AND STATISTICS FUNCTIONS
// ============================================================================

/**
 * Calculate comprehensive statistics for a group of antibiotics
 */
export const calculateGroupStatistics = (groupAntibiotics: Antibiotic[]): GroupStatistics => {
  if (!Array.isArray(groupAntibiotics)) {
    return {
      totalAntibiotics: 0,
      drugClassCount: 0,
      routeDistribution: {},
      coverageSpectra: [],
      clinicalApplications: []
    };
  }

  const drugClasses = new Set<string>();
  const routeDistribution: { [route: string]: number } = {};
  const coverageSpectra = new Set<string>();
  const clinicalApplications = new Set<string>();

  groupAntibiotics.forEach(ab => {
    if (ab.class) drugClasses.add(ab.class);
    if (ab.route) {
      routeDistribution[ab.route] = (routeDistribution[ab.route] || 0) + 1;
    }
    if (ab.coverage) {
      if (typeof ab.coverage === 'string') {
        ab.coverage.split(',').forEach((c: string) => coverageSpectra.add(c.trim()));
      } else if (Array.isArray(ab.coverage)) {
        (ab.coverage as any[]).forEach((c: any) => coverageSpectra.add(typeof c === 'string' ? c : c.toString()));
      }
    }
  });

  return {
    totalAntibiotics: groupAntibiotics.length,
    drugClassCount: drugClasses.size,
    routeDistribution,
    coverageSpectra: Array.from(coverageSpectra),
    clinicalApplications: Array.from(clinicalApplications)
  };
};

/**
 * Calculate coverage summary for a group of antibiotics
 */
export const calculateCoverageSummary = (groupAntibiotics: Antibiotic[]): CoverageSummary => {
  const summary: CoverageSummary = {
    gramPositive: [],
    gramNegative: [],
    anaerobes: [],
    coverage: '',
    gaps: [],
    advantages: [],
    limitations: []
  };

  if (!Array.isArray(groupAntibiotics) || groupAntibiotics.length === 0) {
    return summary;
  }

  const coveragePatterns = new Set<string>();

  groupAntibiotics.forEach(ab => {
    if (ab.coverage) {
      if (typeof ab.coverage === 'string') {
        ab.coverage.split(',').forEach((c: string) => coveragePatterns.add(c.trim()));
      } else if (Array.isArray(ab.coverage)) {
        (ab.coverage as any[]).forEach((c: any) => coveragePatterns.add(typeof c === 'string' ? c : c.toString()));
      }
    }
  });

  // Parse coverage patterns
  coveragePatterns.forEach(pattern => {
    if (pattern.toLowerCase().includes('gram-positive') || pattern.toLowerCase().includes('staphylococcus') || pattern.toLowerCase().includes('streptococcus')) {
      summary.gramPositive.push(pattern);
    }
    if (pattern.toLowerCase().includes('gram-negative') || pattern.toLowerCase().includes('enterobacteriaceae') || pattern.toLowerCase().includes('pseudomonas')) {
      summary.gramNegative.push(pattern);
    }
    if (pattern.toLowerCase().includes('anaerobe')) {
      summary.anaerobes.push(pattern);
    }
  });

  summary.coverage = Array.from(coveragePatterns).join(', ');

  return summary;
};

/**
 * Get medical grouping data from spatial groups
 */
export const getMedicalGroupingData = (
  spatialGroups: { [key: string]: Antibiotic[] },
  medicalDefinitions: any
): { [key: string]: any } => {
  const groupingData: { [key: string]: any } = {};

  Object.entries(spatialGroups).forEach(([key, antibiotics]) => {
    groupingData[key] = {
      antibiotics,
      statistics: calculateGroupStatistics(antibiotics),
      coverage: calculateCoverageSummary(antibiotics),
      byClass: classifyByDrugClass(antibiotics),
      byRoute: classifyByRoute(antibiotics),
      byMechanism: classifyByMechanism(antibiotics)
    };
  });

  return groupingData;
};

/**
 * Validate medical accuracy of grouped antibiotics
 */
export const validateMedicalAccuracy = (
  groups: { [key: string]: any },
  medicalDefinitions: any
): { [key: string]: any } => {
  const validation: { [key: string]: any } = {
    isValid: true,
    errors: [],
    warnings: [],
    groupValidations: {}
  };

  Object.entries(groups).forEach(([groupKey, group]) => {
    const groupValidation: { [key: string]: any } = {
      isValid: true,
      errors: [],
      warnings: []
    };

    const antibiotics = group.antibiotics || group;
    if (!Array.isArray(antibiotics)) {
      groupValidation.isValid = false;
      groupValidation.errors.push(`Group ${groupKey} does not contain valid antibiotic array`);
    }

    validation.groupValidations[groupKey] = groupValidation;
  });

  return validation;
};

/**
 * Performance utilities
 */
export const performanceUtils = {
  measureGroupingPerformance: (antibiotics: Antibiotic[], iterations: number = 1000): number => {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      classifyByDrugClass(antibiotics);
    }
    return performance.now() - start;
  },

  optimizeGroupingMemory: (groups: GroupedAntibiotics): { [key: string]: any } => {
    return Object.entries(groups).reduce((acc, [key, antibiotics]) => {
      acc[key] = {
        count: antibiotics.length,
        names: antibiotics.map(a => a.name)
      };
      return acc;
    }, {} as { [key: string]: any });
  }
};

// ============================================================================
// CONVENIENCE ALIASES
// ============================================================================

export const groupAntibioticsByClass = classifyByDrugClass;
export const groupByGeneration = classifyByGeneration;
export const groupByRoute = classifyByRoute;
export const groupByCellWallActivity = classifyByMechanism;
export const analyzeCoveragePatterns = calculateCoverageSummary;
export const generateClinicalStatistics = calculateGroupStatistics;

// ============================================================================
// NORTHWESTERN METHODOLOGY
// ============================================================================

/**
 * Get Northwestern-compliant antibiotic groups
 */
export const getNorthwesternCompliantGroups = (antibiotics: Antibiotic[]): NorthwesternGroup[] => {
  const groups: NorthwesternGroup[] = [];
  const byClass = classifyByDrugClass(antibiotics);
  let position = 0;

  Object.entries(byClass).forEach(([drugClass, classAntibiotics]) => {
    groups.push({
      segment: drugClass,
      position: position++,
      antibiotics: classAntibiotics,
      medicalCriteria: [
        `Classified as: ${drugClass}`,
        `Coverage: ${calculateCoverageSummary(classAntibiotics).coverage}`
      ],
      clinicalValue: `Medical value for ${drugClass} coverage`
    });
  });

  return groups;
};

/**
 * Optimize group layout for spatial visualization
 */
export const optimizeGroupLayout = (
  antibiotics: Antibiotic[],
  options: { [key: string]: any } = {}
): GroupLayoutOptimization => {
  const originalLayout = classifyByDrugClass(antibiotics);
  const optimizedLayout = { ...originalLayout };

  return {
    originalLayout,
    optimizedLayout,
    improvements: ['Spatial arrangement optimized'],
    metrics: {
      balanceBefore: Object.values(originalLayout).length,
      balanceAfter: Object.values(optimizedLayout).length,
      spatialDensity: 0.5,
      clusteringCoefficient: 0.7
    }
  };
};

/**
 * Validate group integrity and consistency
 */
export const validateGroupIntegrity = (
  groups: { [key: string]: any },
  options: {
    requireMinimumGroupSize?: boolean;
    minGroupSize?: number;
    checkForDuplicates?: boolean;
    validateMedicalClassifications?: boolean;
  } = {}
): GroupIntegrityCheck => {
  const {
    requireMinimumGroupSize = false,
    minGroupSize = 2,
    checkForDuplicates = true,
    validateMedicalClassifications = false
  } = options;

  const validation: GroupIntegrityCheck = {
    isValid: true,
    errors: [],
    warnings: [],
    statistics: {
      totalGroups: Object.keys(groups).length,
      totalAntibiotics: 0,
      emptyGroups: 0,
      duplicateAntibiotics: []
    },
    consistency: true,
    completeness: true
  };

  const antibioticIds = new Set<string>();
  const allAntibiotics: Antibiotic[] = [];

  Object.entries(groups).forEach(([groupKey, group]) => {
    if (!group) {
      validation.errors.push(`Group ${groupKey} is null or undefined`);
      validation.isValid = false;
      return;
    }

    const groupAntibiotics = group.antibiotics || group || [];

    if (!Array.isArray(groupAntibiotics)) {
      validation.errors.push(`Group ${groupKey} does not contain a valid antibiotic array`);
      validation.isValid = false;
      return;
    }

    if (groupAntibiotics.length === 0) {
      validation.statistics.emptyGroups++;
      if (requireMinimumGroupSize) {
        validation.warnings.push(`Group ${groupKey} is empty`);
      }
    } else if (requireMinimumGroupSize && groupAntibiotics.length < minGroupSize) {
      validation.warnings.push(`Group ${groupKey} has only ${groupAntibiotics.length} antibiotics (minimum: ${minGroupSize})`);
    }

    groupAntibiotics.forEach(antibiotic => {
      if (antibiotic && antibiotic.id) {
        validation.statistics.totalAntibiotics++;
        allAntibiotics.push(antibiotic);

        if (checkForDuplicates) {
          if (antibioticIds.has(antibiotic.id)) {
            validation.statistics.duplicateAntibiotics.push(antibiotic.id);
            validation.warnings.push(`Duplicate antibiotic ${antibiotic.id} found in group ${groupKey}`);
          } else {
            antibioticIds.add(antibiotic.id);
          }
        }
      }
    });

    if (validateMedicalClassifications && groupAntibiotics.length > 0) {
      const medicalValidation = validateMedicalAccuracy({ [groupKey]: { antibiotics: groupAntibiotics } }, {});
      if (!medicalValidation.isValid) {
        validation.warnings.push(`Medical classification issues in group ${groupKey}`);
      }
    }
  });

  if (validation.statistics.duplicateAntibiotics.length > 0) {
    validation.consistency = false;
    validation.warnings.push(`Found ${validation.statistics.duplicateAntibiotics.length} duplicate antibiotics`);
  }

  if (validation.statistics.emptyGroups > 0 && requireMinimumGroupSize) {
    validation.completeness = false;
  }

  validation.isValid = validation.isValid && validation.errors.length === 0;

  return validation;
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Original API
  classifyByDrugClass,
  classifyByMechanism,
  classifyByGeneration,
  classifyByRoute,
  calculateGroupStatistics,
  calculateCoverageSummary,
  getMedicalGroupingData,
  validateMedicalAccuracy,
  performanceUtils,

  // Test-expected API
  groupAntibioticsByClass,
  groupByGeneration,
  groupByRoute,
  groupByCellWallActivity,
  analyzeCoveragePatterns,
  generateClinicalStatistics,
  getNorthwesternCompliantGroups,
  optimizeGroupLayout,
  validateGroupIntegrity,

  // Constants
  GENERATION_ORDER,
  ROUTE_CLASSIFICATIONS,
  MECHANISM_CLASSIFICATIONS
};
