/**
 * Multi-Dimensional Scoring System for Radar Chart Visualization
 * Transforms antibiotic properties into normalized scores for spider plot display
 */

import simpleAntibiotics from '../data/SimpleAntibioticData.js';
import pathogenAntibioticMap from '../data/pathogenAntibioticMap.js';
import { calculateCategoryEffectiveness } from './pathogenCategorization.js';

/**
 * Calculate comprehensive radar chart dimensions for an antibiotic
 * @param {number} antibioticId - ID of the antibiotic to analyze
 * @returns {Object} Normalized scores (0-100) for each radar dimension
 */
export const calculateRadarDimensions = (antibioticId) => {
  const antibiotic = simpleAntibiotics.find(ab => ab.id === antibioticId);
  if (!antibiotic) {
    throw new Error(`Antibiotic with ID ${antibioticId} not found`);
  }

  const categoryEffectiveness = calculateCategoryEffectiveness(antibioticId);
  
  return {
    // Pathogen coverage dimensions
    gramPositiveCoverage: Math.round(categoryEffectiveness.gramPositive),
    gramNegativeCoverage: Math.round(categoryEffectiveness.gramNegative),
    atypicalCoverage: Math.round(categoryEffectiveness.atypical),
    
    // Clinical utility dimensions
    resistanceProfile: calculateResistanceScore(antibioticId),
    routeFlexibility: calculateRouteScore(antibiotic),
    safetyProfile: calculateSafetyScore(antibiotic),
    
    // Metadata for display
    antibioticName: antibiotic.name,
    drugClass: antibiotic.class,
    totalPathogens: getTotalPathogenCount(antibioticId)
  };
};

/**
 * Calculate resistance profile score (higher = less resistance issues)
 * @param {number} antibioticId - ID of the antibiotic
 * @returns {number} Resistance score (0-100)
 */
const calculateResistanceScore = (antibioticId) => {
  const pathogenData = Object.values(pathogenAntibioticMap);
  let resistantCount = 0;
  let totalRelationships = 0;

  pathogenData.forEach(pathogen => {
    const antibiotic = pathogen.antibiotics.find(ab => ab.antibioticId === antibioticId);
    if (antibiotic) {
      totalRelationships++;
      if (antibiotic.effectiveness === 'resistant') {
        resistantCount++;
      }
    }
  });

  if (totalRelationships === 0) return 0;

  // Invert resistance percentage to get resistance profile score
  const resistanceRate = (resistantCount / totalRelationships) * 100;
  return Math.round(100 - resistanceRate);
};

/**
 * Calculate route flexibility score based on available administration routes
 * @param {Object} antibiotic - Antibiotic data object
 * @returns {number} Route flexibility score (0-100)
 */
const calculateRouteScore = (antibiotic) => {
  if (!antibiotic.route) return 0;
  
  const route = antibiotic.route.toLowerCase();
  
  // Scoring based on route flexibility
  if (route.includes('po') && route.includes('iv')) {
    return 100; // Both oral and IV - maximum flexibility
  } else if (route.includes('po')) {
    return 80;  // Oral only - good outpatient flexibility
  } else if (route.includes('iv')) {
    return 60;  // IV only - hospital use only
  } else if (route.includes('im')) {
    return 40;  // IM only - limited flexibility
  } else {
    return 20;  // Other routes - minimal flexibility
  }
};

/**
 * Calculate safety profile score (higher = safer)
 * @param {Object} antibiotic - Antibiotic data object
 * @returns {number} Safety score (0-100)
 */
const calculateSafetyScore = (antibiotic) => {
  if (!antibiotic.sideEffects || antibiotic.sideEffects.length === 0) {
    return 100; // No documented side effects
  }

  const sideEffects = antibiotic.sideEffects.map(effect => effect.toLowerCase());
  let safetyScore = 100;

  // Deduct points for serious side effects
  const seriousEffects = [
    'kidney toxicity', 'nephrotoxicity', 'renal',
    'hearing loss', 'ototoxicity', 'vestibular',
    'seizures', 'cns effects', 'neuropathy',
    'tendon rupture', 'tendon',
    'qt prolongation', 'cardiac',
    'thrombocytopenia', 'bone marrow',
    'hepatotoxicity', 'liver'
  ];

  const moderateEffects = [
    'diarrhea', 'c. diff', 'colitis',
    'allergic reactions', 'hypersensitivity',
    'rash', 'skin reactions',
    'gi upset', 'nausea', 'vomiting'
  ];

  const mildEffects = [
    'metallic taste', 'taste',
    'photosensitivity', 'sun sensitivity',
    'injection site', 'local reactions'
  ];

  // Check for serious side effects
  sideEffects.forEach(effect => {
    if (seriousEffects.some(serious => effect.includes(serious))) {
      safetyScore -= 30;
    } else if (moderateEffects.some(moderate => effect.includes(moderate))) {
      safetyScore -= 15;
    } else if (mildEffects.some(mild => effect.includes(mild))) {
      safetyScore -= 5;
    }
  });

  return Math.max(0, Math.round(safetyScore));
};

/**
 * Get total number of pathogens with documented relationships
 * @param {number} antibioticId - ID of the antibiotic
 * @returns {number} Total pathogen count
 */
const getTotalPathogenCount = (antibioticId) => {
  const pathogenData = Object.values(pathogenAntibioticMap);
  let count = 0;

  pathogenData.forEach(pathogen => {
    const antibiotic = pathogen.antibiotics.find(ab => ab.antibioticId === antibioticId);
    if (antibiotic) {
      count++;
    }
  });

  return count;
};

/**
 * Generate radar chart data for multiple antibiotics (comparison mode)
 * @param {Array} antibioticIds - Array of antibiotic IDs to compare
 * @returns {Array} Array of radar chart data objects
 */
export const generateMultipleRadarData = (antibioticIds) => {
  return antibioticIds.map(id => {
    const dimensions = calculateRadarDimensions(id);
    return {
      id,
      name: dimensions.antibioticName,
      class: dimensions.drugClass,
      data: [
        { axis: 'Gram+ Coverage', value: dimensions.gramPositiveCoverage },
        { axis: 'Gram- Coverage', value: dimensions.gramNegativeCoverage },
        { axis: 'Atypical Coverage', value: dimensions.atypicalCoverage },
        { axis: 'Resistance Profile', value: dimensions.resistanceProfile },
        { axis: 'Route Flexibility', value: dimensions.routeFlexibility },
        { axis: 'Safety Profile', value: dimensions.safetyProfile }
      ]
    };
  });
};

/**
 * Generate color scheme for radar chart visualization
 * @param {number} antibioticId - ID of the antibiotic
 * @returns {Object} Color scheme object
 */
export const generateRadarColorScheme = (antibioticId) => {
  const antibiotic = simpleAntibiotics.find(ab => ab.id === antibioticId);
  if (!antibiotic) return { primary: '#6B7280', secondary: '#D1D5DB' };

  // Color mapping by drug class
  const classColors = {
    'Penicillin': { primary: '#3B82F6', secondary: '#DBEAFE' },
    'Glycopeptide': { primary: '#8B5CF6', secondary: '#EDE9FE' },
    'Quinolone': { primary: '#F59E0B', secondary: '#FEF3C7' },
    '3rd generation cephalosporin': { primary: '#10B981', secondary: '#D1FAE5' },
    'Macrolide': { primary: '#EC4899', secondary: '#FCE7F3' },
    'Lincosamide': { primary: '#14B8A6', secondary: '#CCFBF1' },
    'Aminoglycoside': { primary: '#6366F1', secondary: '#E0E7FF' },
    'Carbapenem': { primary: '#EF4444', secondary: '#FEE2E2' },
    'Tetracycline': { primary: '#84CC16', secondary: '#ECFCCB' },
    'Sulfonamide combination': { primary: '#F97316', secondary: '#FFEDD5' },
    'Oxazolidinone': { primary: '#06B6D4', secondary: '#CFFAFE' },
    'Nitroimidazole': { primary: '#64748B', secondary: '#F1F5F9' },
    '1st generation cephalosporin': { primary: '#22C55E', secondary: '#DCFCE7' },
    'Penicillin + Beta-lactamase inhibitor': { primary: '#A855F7', secondary: '#F3E8FF' }
  };

  return classColors[antibiotic.class] || { primary: '#6B7280', secondary: '#D1D5DB' };
};

/**
 * Calculate radar chart statistics for all antibiotics
 * @returns {Object} Statistical summary of radar dimensions
 */
export const calculateRadarStatistics = () => {
  const allData = [];
  
  // Process all antibiotics
  for (let i = 1; i <= 15; i++) {
    try {
      const dimensions = calculateRadarDimensions(i);
      allData.push(dimensions);
    } catch (error) {
      console.warn(`Error calculating radar dimensions for antibiotic ${i}:`, error);
    }
  }

  // Calculate statistics
  const stats = {
    gramPositiveCoverage: calculateDimensionStats(allData, 'gramPositiveCoverage'),
    gramNegativeCoverage: calculateDimensionStats(allData, 'gramNegativeCoverage'),
    atypicalCoverage: calculateDimensionStats(allData, 'atypicalCoverage'),
    resistanceProfile: calculateDimensionStats(allData, 'resistanceProfile'),
    routeFlexibility: calculateDimensionStats(allData, 'routeFlexibility'),
    safetyProfile: calculateDimensionStats(allData, 'safetyProfile'),
    totalAntibiotics: allData.length
  };

  return stats;
};

/**
 * Calculate statistics for a specific dimension
 * @param {Array} data - Array of radar dimension data
 * @param {string} dimension - Dimension name
 * @returns {Object} Statistical summary
 */
const calculateDimensionStats = (data, dimension) => {
  const values = data.map(item => item[dimension]).filter(val => typeof val === 'number');
  
  if (values.length === 0) {
    return { min: 0, max: 0, avg: 0, count: 0 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);

  return { min, max, avg, count: values.length };
};

/**
 * Generate radar chart configuration for Recharts
 * @param {Array} data - Radar chart data
 * @returns {Object} Recharts configuration object
 */
export const generateRechartsConfig = (data) => {
  return {
    data,
    margin: { top: 20, right: 30, bottom: 20, left: 30 },
    outerRadius: 150,
    fill: '#8884d8',
    fillOpacity: 0.6,
    stroke: '#8884d8',
    strokeWidth: 2,
    gridType: 'polygon',
    radialGridType: 'line',
    tickCount: 5,
    tickFormatter: (value) => `${value}%`,
    labelOffset: 15,
    animationDuration: 500,
    animationEasing: 'ease-out'
  };
};

/**
 * Validate radar chart scoring system
 * @returns {Array} Array of validation errors, empty if valid
 */
export const validateRadarScoring = () => {
  const errors = [];
  
  try {
    // Test radar dimension calculation
    const testDimensions = calculateRadarDimensions(1);
    
    // Validate dimension ranges
    const dimensionKeys = ['gramPositiveCoverage', 'gramNegativeCoverage', 'atypicalCoverage', 'resistanceProfile', 'routeFlexibility', 'safetyProfile'];
    
    dimensionKeys.forEach(key => {
      const value = testDimensions[key];
      if (typeof value !== 'number') {
        errors.push(`${key} is not a number`);
      } else if (value < 0 || value > 100) {
        errors.push(`${key} is out of range (0-100): ${value}`);
      }
    });
    
    // Test multi-antibiotic generation
    const multiData = generateMultipleRadarData([1, 2, 3]);
    if (multiData.length !== 3) {
      errors.push('Multi-antibiotic radar data generation failed');
    }
    
    // Test color scheme generation
    const colorScheme = generateRadarColorScheme(1);
    if (!colorScheme.primary || !colorScheme.secondary) {
      errors.push('Color scheme generation failed');
    }
    
  } catch (error) {
    errors.push(`Radar scoring validation error: ${error.message}`);
  }
  
  return errors;
};

export default {
  calculateRadarDimensions,
  generateMultipleRadarData,
  generateRadarColorScheme,
  calculateRadarStatistics,
  generateRechartsConfig,
  validateRadarScoring
};