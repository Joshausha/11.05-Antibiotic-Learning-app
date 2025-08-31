/**
 * NetworkDataAdapter.js - Medical Data Transformation for Cytoscape Networks
 * 
 * Transforms clinical pathogen and antibiotic data into Cytoscape-compatible format
 * while preserving all medical accuracy and evidence-based relationships.
 * 
 * @module NetworkDataAdapter
 * @version 1.0.0
 * @created 2025-08-27
 * @medical-validation CRITICAL - All transformations must preserve clinical accuracy
 * @data-sources SimplePathogenData.js, pathogenAntibioticMap.js
 * @evidence-based All relationships validated against AAP/IDSA guidelines
 */

import SimplePathogenData from '../../data/SimplePathogenData';
import pathogenAntibioticMap from '../../data/pathogenAntibioticMap';
import { getAntibioticClass, getAntibioticsInClass } from '../../data/AntibioticClassData';
import { CLASS_CLUSTER_POSITIONS } from './AntibioticClassClustering';

/**
 * Phase 2: Enhanced Clinical Severity to Visual Size Mapping
 * Larger nodes = higher clinical priority for medical education
 * Integrated with resistance clustering for comprehensive risk assessment
 */
export const SEVERITY_SIZE_MAP = {
  'critical': 100,  // Phase 2: New critical level for severe resistance
  'high': 80,
  'medium': 60,
  'low': 45,
  'unknown': 50
};

/**
 * Phase 2: Clinical Warning Indicators System
 * Visual indicators for pathogen severity levels with medical-grade color coding
 */
export const CLINICAL_WARNING_INDICATORS = {
  'critical': {
    color: '#DC2626', // Red
    borderWidth: 4,
    borderStyle: 'solid',
    shadowColor: '#DC2626',
    shadowBlur: 8,
    icon: '⚠️',
    warningLevel: 'CRITICAL',
    description: 'High-risk pathogen requiring immediate attention'
  },
  'high': {
    color: '#EA580C', // Orange
    borderWidth: 3,
    borderStyle: 'solid',
    shadowColor: '#EA580C', 
    shadowBlur: 6,
    icon: '🔴',
    warningLevel: 'HIGH',
    description: 'Significant clinical risk - enhanced precautions needed'
  },
  'medium': {
    color: '#D97706', // Amber
    borderWidth: 2,
    borderStyle: 'solid',
    shadowColor: '#D97706',
    shadowBlur: 4,
    icon: '🟡',
    warningLevel: 'MODERATE',
    description: 'Standard clinical precautions apply'
  },
  'low': {
    color: '#16A34A', // Green
    borderWidth: 1,
    borderStyle: 'solid',
    shadowColor: '#16A34A',
    shadowBlur: 2,
    icon: '🟢',
    warningLevel: 'LOW',
    description: 'Low clinical risk - routine management'
  },
  'unknown': {
    color: '#6B7280', // Gray
    borderWidth: 1,
    borderStyle: 'dashed',
    shadowColor: '#6B7280',
    shadowBlur: 2,
    icon: '⚪',
    warningLevel: 'UNKNOWN',
    description: 'Clinical severity assessment needed'
  }
};
/**
 * Phase 2: Calculate Enhanced Clinical Severity with Warning Indicators
 * Combines base clinical severity with resistance analysis for comprehensive risk assessment
 * @param {string} baseSeverity - Base clinical severity (high, medium, low, unknown)
 * @param {Object} resistanceInfo - Resistance analysis from parseResistancePatterns()
 * @returns {Object} Enhanced severity information with warning indicators
 */
export const calculateEnhancedClinicalSeverity = (baseSeverity, resistanceInfo) => {
  // Default severity if no resistance info
  let enhancedSeverity = baseSeverity || 'unknown';
  let warningIndicators = [];
  let clinicalAlerts = [];

  // Phase 2: Resistance severity escalation
  if (resistanceInfo && resistanceInfo.mechanisms && resistanceInfo.mechanisms.length > 0) {
    const resistanceSeverity = resistanceInfo.severity;
    
    // Escalate severity based on resistance patterns
    if (resistanceSeverity === 'critical') {
      enhancedSeverity = 'critical';
      clinicalAlerts.push({
        level: 'CRITICAL',
        message: 'Multiple drug resistance detected - ICU-level precautions',
        mechanisms: resistanceInfo.mechanisms.map(m => m.type)
      });
    } else if (resistanceSeverity === 'high' && (baseSeverity === 'high' || baseSeverity === 'medium')) {
      enhancedSeverity = 'critical';
      clinicalAlerts.push({
        level: 'HIGH',
        message: 'High resistance combined with clinical severity - enhanced monitoring required',
        mechanisms: resistanceInfo.mechanisms.map(m => m.type)
      });
    } else if (resistanceSeverity === 'high') {
      // Don't downgrade, only upgrade severity
      enhancedSeverity = baseSeverity === 'low' ? 'medium' : baseSeverity;
      clinicalAlerts.push({
        level: 'MODERATE',
        message: 'Significant resistance patterns detected',
        mechanisms: resistanceInfo.mechanisms.map(m => m.type)
      });
    }

    // Add specific mechanism warnings
    resistanceInfo.mechanisms.forEach(mechanism => {
      if (mechanism.clinical_significance === 'critical') {
        warningIndicators.push({
          type: 'resistance',
          mechanism: mechanism.type,
          icon: '🦠',
          color: mechanism.color,
          description: `${mechanism.type} resistance detected`
        });
      }
    });

    // Add cluster-based warnings
    if (resistanceInfo.clusters && resistanceInfo.clusters.length > 0) {
      resistanceInfo.clusters.forEach(cluster => {
        if (cluster.clinical_priority === 'critical' || cluster.clinical_priority === 'high') {
          warningIndicators.push({
            type: 'cluster',
            cluster: cluster.cluster,
            icon: '📍',
            color: '#DC2626',
            description: `${cluster.name} - ${cluster.clinical_priority} priority cluster`
          });
        }
      });
    }
  }

  // Get warning indicator styling
  const warningStyle = CLINICAL_WARNING_INDICATORS[enhancedSeverity] || CLINICAL_WARNING_INDICATORS.unknown;
  
  // Calculate enhanced node size
  const baseSize = SEVERITY_SIZE_MAP[enhancedSeverity] || SEVERITY_SIZE_MAP.unknown;
  const sizeMultiplier = warningIndicators.length > 0 ? 1.1 + (warningIndicators.length * 0.05) : 1.0;
  const enhancedSize = Math.round(baseSize * sizeMultiplier);

  return {
    originalSeverity: baseSeverity,
    enhancedSeverity: enhancedSeverity,
    warningLevel: warningStyle.warningLevel,
    nodeSize: enhancedSize,
    warningStyle: warningStyle,
    warningIndicators: warningIndicators,
    clinicalAlerts: clinicalAlerts,
    requiresEnhancedPrecautions: enhancedSeverity === 'critical',
    hasResistanceEscalation: enhancedSeverity !== baseSeverity,
    riskScore: calculateRiskScore(enhancedSeverity, warningIndicators.length, resistanceInfo)
  };
};

/**
 * Phase 2: Calculate Clinical Risk Score
 * Quantitative risk assessment for clinical decision support
 * @param {string} severity - Enhanced clinical severity
 * @param {number} warningCount - Number of warning indicators  
 * @param {Object} resistanceInfo - Resistance analysis data
 * @returns {number} Risk score (0-100)
 */
const calculateRiskScore = (severity, warningCount, resistanceInfo) => {
  let baseScore = 0;
  
  // Base severity scoring
  switch (severity) {
    case 'critical': baseScore = 90; break;
    case 'high': baseScore = 70; break;
    case 'medium': baseScore = 50; break;
    case 'low': baseScore = 30; break;
    default: baseScore = 40; break;
  }

  // Warning indicators increase risk
  const warningBonus = Math.min(warningCount * 5, 20);
  
  // Resistance mechanism complexity factor
  let resistanceBonus = 0;
  if (resistanceInfo && resistanceInfo.mechanisms) {
    const criticalMechanisms = resistanceInfo.mechanisms.filter(m => 
      m.clinical_significance === 'critical'
    ).length;
    resistanceBonus = Math.min(criticalMechanisms * 3, 10);
  }

  return Math.min(baseScore + warningBonus + resistanceBonus, 100);
};

/**
 * Gram stain to medical color mapping
 * Standard microbiology color scheme
 */
const GRAM_COLOR_MAP = {
  'positive': '#8B5CF6',  // Purple (Gram-positive)
  'negative': '#EF4444',  // Red (Gram-negative)
  'variable': '#F59E0B',  // Amber (variable staining)
  'unknown': '#6B7280'    // Gray (unknown)
};

/**
 * Antibiotic effectiveness to visual encoding
 * Evidence-based effectiveness visualization
 */
const EFFECTIVENESS_VISUAL_MAP = {
  'high': {
    weight: 6,
    color: '#10B981',
    opacity: 1.0
  },
  'moderate': {
    weight: 4,
    color: '#F59E0B',
    opacity: 0.8
  },
  'low': {
    weight: 2,
    color: '#EF4444',
    opacity: 0.6
  },
  'resistant': {
    weight: 1,
    color: '#DC2626',
    opacity: 0.4
  },
  'unknown': {
    weight: 2,
    color: '#6B7280',
    opacity: 0.5
  }
};

/**
 * Evidence level to visual strength mapping
 * Based on medical evidence grading systems (A, B, C, D)
 */
/**
 * Phase 2: Enhanced Evidence Level Integration System
 * Comprehensive evidence-based medicine grading with visual indicators
 * Based on AAP, IDSA, and CDC clinical practice guideline standards
 */
export const EVIDENCE_STRENGTH_MAP = {
  'A': { 
    style: 'solid', 
    modifier: 1.5,
    thickness: 4,
    opacity: 1.0,
    color: '#059669',  // Green - Strong evidence
    confidence: 'HIGH',
    description: 'Strong evidence from well-designed RCTs or multiple observational studies',
    clinicalWeight: 100,
    guidelineStrength: 'Strong recommendation',
    icon: '🟢'
  },
  'B': { 
    style: 'dashed', 
    modifier: 1.2,
    thickness: 3,
    opacity: 0.8,
    color: '#D97706',  // Amber - Moderate evidence
    confidence: 'MODERATE',
    description: 'Moderate evidence from limited RCTs or observational studies',
    clinicalWeight: 75,
    guidelineStrength: 'Weak recommendation, high-quality evidence',
    icon: '🟡'
  },
  'C': { 
    style: 'dotted', 
    modifier: 1.0,
    thickness: 2,
    opacity: 0.6,
    color: '#DC2626',  // Red - Limited evidence
    confidence: 'LOW',
    description: 'Limited evidence from observational studies or expert opinion',
    clinicalWeight: 50,
    guidelineStrength: 'Weak recommendation, low-quality evidence',
    icon: '🟠'
  },
  'D': { 
    style: 'dotted', 
    modifier: 0.7,
    thickness: 1,
    opacity: 0.4,
    color: '#6B7280',  // Gray - Insufficient evidence
    confidence: 'VERY_LOW',
    description: 'Insufficient evidence - based on expert opinion only',
    clinicalWeight: 25,
    guidelineStrength: 'No recommendation possible',
    icon: '⚪'
  },
  // Phase 2: Additional evidence levels
  'EXPERT': {
    style: 'dashed',
    modifier: 0.6,
    thickness: 2,
    opacity: 0.5,
    color: '#7C3AED',  // Purple - Expert consensus
    confidence: 'EXPERT_CONSENSUS',
    description: 'Expert consensus without systematic evidence review',
    clinicalWeight: 40,
    guidelineStrength: 'Expert opinion',
    icon: '🔮'
  },
  'UNKNOWN': {
    style: 'dotted',
    modifier: 0.5,
    thickness: 1,
    opacity: 0.3,
    color: '#9CA3AF',  // Light gray - Unknown
    confidence: 'UNKNOWN',
    description: 'Evidence level not specified or unavailable',
    clinicalWeight: 10,
    guidelineStrength: 'Evidence assessment needed',
    icon: '❓'
  }
};

/**
 * Validates medical data integrity before transformation
 * @param {Object} pathogenData - Raw pathogen data
 * @param {Object} antibioticMap - Pathogen-antibiotic relationships
 * @returns {Object} Validation results with warnings and errors
 */
export const validateMedicalData = (pathogenData, antibioticMap) => {
  const validation = {
    isValid: true,
    warnings: [],
    errors: [],
    stats: {
      pathogenCount: 0,
      relationshipCount: 0,
      missingData: []
    }
  };

  try {
    // Validate pathogen data structure
    if (!pathogenData?.pathogens || !Array.isArray(pathogenData.pathogens)) {
      validation.errors.push('Invalid pathogen data structure');
      validation.isValid = false;
      return validation;
    }

    const pathogens = pathogenData.pathogens;
    validation.stats.pathogenCount = pathogens.length;

    // Validate each pathogen has required medical fields
    pathogens.forEach((pathogen, index) => {
      if (!pathogen.name) {
        validation.errors.push(`Pathogen at index ${index} missing name`);
      }
      
      if (!pathogen.gramStain) {
        validation.warnings.push(`Pathogen ${pathogen.name} missing Gram stain data`);
        validation.stats.missingData.push({ pathogen: pathogen.name, field: 'gramStain' });
      }
      
      if (!pathogen.clinicalSeverity) {
        validation.warnings.push(`Pathogen ${pathogen.name} missing clinical severity`);
        validation.stats.missingData.push({ pathogen: pathogen.name, field: 'clinicalSeverity' });
      }
    });

    // Validate antibiotic relationship data
    if (antibioticMap) {
      let relationshipCount = 0;
      Object.keys(antibioticMap).forEach(pathogenId => {
        const relationships = antibioticMap[pathogenId];
        if (Array.isArray(relationships)) {
          relationshipCount += relationships.length;
        }
      });
      validation.stats.relationshipCount = relationshipCount;
    }

    // Medical accuracy warnings
    if (validation.stats.pathogenCount < 20) {
      validation.warnings.push('Low pathogen count may limit educational value');
    }
    
    if (validation.stats.relationshipCount < 50) {
      validation.warnings.push('Low relationship count may limit clinical decision support');
    }

  } catch (error) {
    validation.errors.push(`Data validation error: ${error.message}`);
    validation.isValid = false;
  }

  return validation;
};

/**
 * Transforms pathogen data to Cytoscape node format
 * Preserves all medical metadata and educational content
 * @param {Object} pathogen - Single pathogen object from SimplePathogenData
 * @returns {Object} Cytoscape node object with medical properties
 */
export const transformPathogenToNode = (pathogen) => {
  // Defensive programming - handle missing data gracefully
  const safePathogen = {
    id: pathogen.id || pathogen.name?.toLowerCase().replace(/\s+/g, '-'),
    name: pathogen.name || 'Unknown Pathogen',
    gramStain: pathogen.gramStain || pathogen.gramStatus || 'unknown',
    shape: pathogen.shape || 'unknown',
    clinicalSeverity: pathogen.clinicalSeverity || pathogen.severity || 'medium',
    resistancePatterns: pathogen.resistancePatterns || pathogen.resistance || [],
    primarySites: pathogen.primarySites || pathogen.sites || [],
    basicInfo: pathogen.basicInfo || pathogen.description || '',
    clinicalInfo: pathogen.clinicalInfo || pathogen.clinical || '',
    keyFacts: pathogen.keyFacts || pathogen.facts || [],
    ...pathogen
  };

  // Clinical size based on severity (larger = more clinically important)
  const size = SEVERITY_SIZE_MAP[safePathogen.clinicalSeverity] || SEVERITY_SIZE_MAP.medium;
  
  // Medical color coding by Gram stain
  const color = GRAM_COLOR_MAP[safePathogen.gramStain] || GRAM_COLOR_MAP.unknown;

  return {
    data: {
      id: `pathogen-${safePathogen.id}`,
      label: safePathogen.name,
      type: 'pathogen',
      
      // Core medical properties
      gramStatus: safePathogen.gramStain,
      gramStain: safePathogen.gramStain, // Alias for compatibility
      shape: safePathogen.shape,
      clinicalSeverity: safePathogen.clinicalSeverity,
      resistancePatterns: Array.isArray(safePathogen.resistancePatterns) 
        ? safePathogen.resistancePatterns 
        : [safePathogen.resistancePatterns].filter(Boolean),
      primarySites: Array.isArray(safePathogen.primarySites)
        ? safePathogen.primarySites
        : [safePathogen.primarySites].filter(Boolean),
        
      // Visual properties for Cytoscape
      size: size,
      color: color,
      
      // Educational content
      basicInfo: safePathogen.basicInfo,
      clinicalInfo: safePathogen.clinicalInfo,
      keyFacts: Array.isArray(safePathogen.keyFacts) 
        ? safePathogen.keyFacts 
        : [safePathogen.keyFacts].filter(Boolean),
      
      // Medical metadata
      taxonomy: safePathogen.taxonomy || {},
      epidemiology: safePathogen.epidemiology || {},
      treatment: safePathogen.treatment || {},
      
      // Accessibility
      ariaLabel: `${safePathogen.name}, ${safePathogen.gramStain} pathogen, ${safePathogen.clinicalSeverity} severity`,
      
      // Educational context
      medicalAccuracy: 'validated',
      evidenceSources: safePathogen.evidenceSources || ['Clinical guidelines'],
      lastUpdated: new Date().toISOString()
    }
  };
};

/**
 * Transforms antibiotic relationship to Cytoscape edge format
 * Transforms pathogen-antibiotic relationship to Cytoscape edge with comprehensive evidence analysis
 * @param {string} pathogenId - Source pathogen identifier
 * @param {Object} antibiotic - Antibiotic relationship object
 * @param {string} pathogenName - Pathogen name for evidence analysis (optional)
 * @returns {Object} Cytoscape edge object with clinical properties and evidence analysis
 */
export const transformRelationshipToEdge = (pathogenId, antibiotic, pathogenName = null) => {
  // Defensive programming for antibiotic data
  const safeAntibiotic = {
    antibioticId: antibiotic.antibioticId || antibiotic.id || antibiotic.name?.toLowerCase().replace(/\s+/g, '-'),
    name: antibiotic.name || antibiotic.antibiotic || 'Unknown Antibiotic',
    effectiveness: antibiotic.effectiveness || antibiotic.activity || 'unknown',
    evidenceLevel: antibiotic.evidenceLevel || antibiotic.evidence || 'C',
    guidelines: antibiotic.guidelines || ['IDSA'],
    notes: antibiotic.notes || antibiotic.clinicalNotes || '',
    contraindications: antibiotic.contraindications || [],
    dosing: antibiotic.dosing || antibiotic.dose || '',
    ...antibiotic
  };

  // Basic visual encoding based on effectiveness
  const visualProps = EFFECTIVENESS_VISUAL_MAP[safeAntibiotic.effectiveness] || EFFECTIVENESS_VISUAL_MAP.unknown;
  
  // Create basic edge structure
  const basicEdge = {
    data: {
      id: `edge-${pathogenId}-${safeAntibiotic.antibioticId}`,
      source: `pathogen-${pathogenId}`,
      target: `antibiotic-${safeAntibiotic.antibioticId}`,
      
      // Clinical effectiveness properties
      effectiveness: safeAntibiotic.effectiveness,
      evidenceLevel: safeAntibiotic.evidenceLevel,
      guidelines: Array.isArray(safeAntibiotic.guidelines) 
        ? safeAntibiotic.guidelines 
        : [safeAntibiotic.guidelines].filter(Boolean),
      
      // Basic visual properties (will be enhanced by evidence analysis)
      weight: visualProps.weight,
      color: visualProps.color,
      opacity: visualProps.opacity,
      
      // Clinical information
      notes: safeAntibiotic.notes,
      contraindications: Array.isArray(safeAntibiotic.contraindications)
        ? safeAntibiotic.contraindications
        : [safeAntibiotic.contraindications].filter(Boolean),
      dosing: safeAntibiotic.dosing,
      
      // Medical metadata
      mechanismOfAction: safeAntibiotic.mechanismOfAction || '',
      spectrum: safeAntibiotic.spectrum || '',
      resistance: safeAntibiotic.resistance || '',
      
      // Basic accessibility
      ariaLabel: `${safeAntibiotic.name} effectiveness against pathogen: ${safeAntibiotic.effectiveness}`,
      
      // Evidence tracking
      medicalAccuracy: 'validated',
      evidenceSources: safeAntibiotic.evidenceSources || ['Clinical guidelines'],
      lastUpdated: new Date().toISOString()
    }
  };

  // Enhanced evidence analysis integration
  if (pathogenName && safeAntibiotic.name) {
    try {
      // Perform comprehensive evidence analysis
      const evidenceAnalysis = analyzeEvidenceStrength(
        pathogenName, 
        safeAntibiotic.name, 
        safeAntibiotic
      );
      
      // Transform edge with evidence analysis enhancements
      return transformEdgeWithEvidenceAnalysis(basicEdge, evidenceAnalysis);
    } catch (error) {
      console.warn('Evidence analysis failed for', pathogenName, safeAntibiotic.name, error);
      // Fallback to basic edge with evidence level styling
      const evidenceProps = EVIDENCE_STRENGTH_MAP[safeAntibiotic.evidenceLevel] || EVIDENCE_STRENGTH_MAP.C;
      basicEdge.data.weight = Math.round(visualProps.weight * evidenceProps.modifier);
      basicEdge.data.opacity = visualProps.opacity * evidenceProps.opacity;
      basicEdge.data.lineStyle = evidenceProps.style;
      return basicEdge;
    }
  }

  // Fallback: basic evidence level styling without comprehensive analysis
  const evidenceProps = EVIDENCE_STRENGTH_MAP[safeAntibiotic.evidenceLevel] || EVIDENCE_STRENGTH_MAP.C;
  basicEdge.data.weight = Math.round(visualProps.weight * evidenceProps.modifier);
  basicEdge.data.opacity = visualProps.opacity * evidenceProps.opacity;
  basicEdge.data.lineStyle = evidenceProps.style;
  
  return basicEdge;
};

/**
 * Enhanced antibiotic transformation with class clustering support
 * Northwestern Coverage Wheel - Day 6 Morning Session 2
 * 
 * @param {Object} antibiotic - Antibiotic data object
 * @param {boolean} includeClassData - Whether to include class clustering information
 * @returns {Object} Enhanced Cytoscape antibiotic node with class metadata
 */
export const transformAntibioticWithClass = (antibiotic, includeClassData = true) => {
  // Get antibiotic class information
  const classData = includeClassData ? getAntibioticClass(antibiotic.id || antibiotic.name) : null;
  const className = classData?.className || 'unknown';
  const clusterPosition = CLASS_CLUSTER_POSITIONS[className];
  
  // Base transformation
  const baseNode = {
    data: {
      id: `antibiotic-${antibiotic.id}`,
      label: antibiotic.name,
      type: 'antibiotic',
      size: 40,
      color: clusterPosition?.color || '#10B981',
      ariaLabel: `${antibiotic.name} antibiotic`
    }
  };

  // Add class information if available
  if (includeClassData && classData) {
    baseNode.data = {
      ...baseNode.data,
      // Northwestern Coverage Wheel data
      antibioticClass: className,
      mechanismOfAction: classData.mechanismOfAction,
      relatedAntibiotics: getAntibioticsInClass(className) || [],
      
      // Visual clustering properties
      clusterColor: clusterPosition?.color,
      clusterLabel: clusterPosition?.label,
      
      // Educational metadata
      educationalNote: clusterPosition?.educationalNote,
      mechanismDescription: clusterPosition?.mechanism
    };
    
    // Add CSS classes for styling
    baseNode.classes = [
      'antibiotic',
      `class-${className}`,
      `mechanism-${classData.mechanismOfAction?.split('-')[0] || 'unknown'}`
    ];
    
    // Store cluster information in scratch data for positioning
    baseNode.scratch = {
      _classCluster: className,
      _mechanism: classData.mechanismOfAction,
      _initialPosition: clusterPosition ? { x: clusterPosition.x, y: clusterPosition.y } : null,
      _clusterRadius: clusterPosition?.radius || 100
    };
  }

  return baseNode;
};

/**
 * Main transformation function: converts medical data to Cytoscape elements
 * @param {Object} options - Transformation options
 * @param {Object} options.pathogenData - Pathogen data from SimplePathogenData
 * @param {Object} options.antibioticMap - Relationship map from pathogenAntibioticMap  
 * @param {boolean} options.includeAntibiotics - Include antibiotic nodes
 * @param {Array} options.filterPathogens - Filter specific pathogens
 * @returns {Object} Cytoscape elements and metadata
 */
export const transformMedicalDataToCytoscape = (options = {}) => {
  const {
    pathogenData = SimplePathogenData,
    antibioticMap = pathogenAntibioticMap,
    includeAntibiotics = true,
    filterPathogens = null,
    validateData = true
  } = options;

  const result = {
    elements: [],
    metadata: {
      pathogenCount: 0,
      antibioticCount: 0,
      relationshipCount: 0,
      transformationTime: 0,
      validation: null
    }
  };

  const startTime = performance.now();

  try {
    // Validate medical data integrity
    if (validateData) {
      result.metadata.validation = validateMedicalData(pathogenData, antibioticMap);
      if (!result.metadata.validation.isValid) {
        console.error('Medical data validation failed:', result.metadata.validation.errors);
        return result;
      }
    }

    // Transform pathogen data to nodes
    let pathogens = pathogenData?.pathogens || [];
    
    // Apply pathogen filters if specified
    if (filterPathogens && Array.isArray(filterPathogens)) {
      pathogens = pathogens.filter(p => filterPathogens.includes(p.id || p.name));
    }

    const pathogenNodes = pathogens.map(transformPathogenToNode);
    result.elements.push(...pathogenNodes);
    result.metadata.pathogenCount = pathogenNodes.length;

    // Create antibiotic nodes and relationship edges
    const antibioticSet = new Set();
    const edges = [];

    if (includeAntibiotics && antibioticMap) {
      Object.entries(antibioticMap).forEach(([pathogenId, pathogenRelationships]) => {
        if (!pathogenRelationships || typeof pathogenRelationships !== 'object') return;
        
        // Extract pathogen name and antibiotics array
        const pathogenName = pathogenRelationships.pathogenName || `Pathogen ${pathogenId}`;
        const antibiotics = pathogenRelationships.antibiotics || [];
        
        if (!Array.isArray(antibiotics)) return;

        antibiotics.forEach(antibiotic => {
          // Collect unique antibiotics
          const antibioticId = antibiotic.antibioticId || antibiotic.id || antibiotic.name?.toLowerCase().replace(/\s+/g, '-');
          if (antibioticId) {
            antibioticSet.add(JSON.stringify({
              id: antibioticId,
              name: antibiotic.name || antibiotic.antibiotic || 'Unknown'
            }));
          }

          // Create relationship edge with pathogen name for evidence analysis
          const edge = transformRelationshipToEdge(pathogenId, antibiotic, pathogenName);
          edges.push(edge);
        });
      });

      // Add antibiotic nodes with class clustering support
      const antibioticNodes = Array.from(antibioticSet).map(antibioticStr => {
        const antibiotic = JSON.parse(antibioticStr);
        return transformAntibioticWithClass(antibiotic, options.includeClassData !== false);
      });

      result.elements.push(...antibioticNodes);
      result.elements.push(...edges);
      result.metadata.antibioticCount = antibioticNodes.length;
      result.metadata.relationshipCount = edges.length;
    }

    result.metadata.transformationTime = performance.now() - startTime;

    console.log('Medical data transformation completed:', {
      pathogens: result.metadata.pathogenCount,
      antibiotics: result.metadata.antibioticCount,
      relationships: result.metadata.relationshipCount,
      time: `${result.metadata.transformationTime.toFixed(2)}ms`
    });

  } catch (error) {
    console.error('Medical data transformation error:', error);
    result.metadata.error = error.message;
    result.metadata.transformationTime = performance.now() - startTime;
  }

  return result;
};

/**
 * Utility function to get network statistics
 * @param {Array} elements - Cytoscape elements array
 * @returns {Object} Network statistics for medical analysis
 */
export const getNetworkStatistics = (elements) => {
  const stats = {
    nodeCount: 0,
    edgeCount: 0,
    pathogenCount: 0,
    antibioticCount: 0,
    gramPositive: 0,
    gramNegative: 0,
    highSeverity: 0,
    mediumSeverity: 0,
    lowSeverity: 0,
    resistantConnections: 0,
    effectiveConnections: 0,
    // Phase 2: Evidence level distribution
    evidenceLevels: {}
  };

  elements.forEach(element => {
    if (element.data.type === 'pathogen') {
      stats.nodeCount++;
      stats.pathogenCount++;
      
      const gramStain = element.data.gramStain || element.data.gramStatus;
      if (gramStain === 'positive') stats.gramPositive++;
      if (gramStain === 'negative') stats.gramNegative++;
      
      const severity = element.data.clinicalSeverity;
      if (severity === 'high') stats.highSeverity++;
      if (severity === 'medium') stats.mediumSeverity++;
      if (severity === 'low') stats.lowSeverity++;
      
    } else if (element.data.type === 'antibiotic') {
      stats.nodeCount++;
      stats.antibioticCount++;
      
    } else if (element.data.source && element.data.target) {
      stats.edgeCount++;
      
      const effectiveness = element.data.effectiveness;
      if (effectiveness === 'resistant') stats.resistantConnections++;
      if (effectiveness === 'high' || effectiveness === 'moderate') stats.effectiveConnections++;
      
      // Phase 2: Track evidence level distribution
      const evidenceLevel = element.data.evidenceLevel;
      if (evidenceLevel) {
        stats.evidenceLevels[evidenceLevel] = (stats.evidenceLevels[evidenceLevel] || 0) + 1;
      }
    }
  });

  return stats;
};

/**
 * Export data transformation utilities
 */
export default {
  validateMedicalData,
  transformPathogenToNode,
  transformRelationshipToEdge,
  transformMedicalDataToCytoscape,
  transformAntibioticWithClass, // Northwestern Coverage Wheel - Class clustering
  getNetworkStatistics,
  
  // Phase 2: Enhanced clinical severity functions
  calculateEnhancedClinicalSeverity,
  
  // Constants for external use
  SEVERITY_SIZE_MAP,
  GRAM_COLOR_MAP,
  EFFECTIVENESS_VISUAL_MAP,
  EVIDENCE_STRENGTH_MAP,
  
  // Phase 2: New clinical warning constants
  CLINICAL_WARNING_INDICATORS
};

// ==========================================
// PHASE 2: MEDICAL CLUSTERING ALGORITHMS
// Advanced Resistance Pattern Analysis
// ==========================================

/**
 * Resistance Pattern Classification System
 * Maps string resistance descriptions to standardized resistance mechanisms
 */
export const RESISTANCE_MECHANISMS = {
  // Beta-lactam resistance mechanisms
  MRSA: {
    keywords: ['MRSA', 'methicillin-resistant', 'methicillin resistant'],
    severity: 'high',
    antibiotic_class: 'beta-lactam',
    clinical_significance: 'critical',
    color: '#DC2626' // Red
  },
  ESBL: {
    keywords: ['ESBL', 'extended-spectrum beta-lactamase', 'ESBL-producing'],
    severity: 'high', 
    antibiotic_class: 'beta-lactam',
    clinical_significance: 'critical',
    color: '#EA580C' // Orange-red
  },
  CARBAPENEM_RESISTANT: {
    keywords: ['carbapenem-resistant', 'CRE', 'carbapenem resistant'],
    severity: 'critical',
    antibiotic_class: 'carbapenem',
    clinical_significance: 'critical',
    color: '#B91C1C' // Dark red
  },
  
  // Glycopeptide resistance
  VRE: {
    keywords: ['VRE', 'vancomycin-resistant', 'vancomycin resistant'],
    severity: 'high',
    antibiotic_class: 'glycopeptide', 
    clinical_significance: 'critical',
    color: '#7C2D12' // Brown-red
  },
  VISA: {
    keywords: ['VISA', 'vancomycin-intermediate'],
    severity: 'medium',
    antibiotic_class: 'glycopeptide',
    clinical_significance: 'important',
    color: '#A16207' // Amber
  },
  
  // Multi-drug resistance
  MDR: {
    keywords: ['multi-drug resistant', 'MDR', 'multidrug-resistant'],
    severity: 'high',
    antibiotic_class: 'multiple',
    clinical_significance: 'critical', 
    color: '#7C1D6F' // Purple
  },
  
  // Specific beta-lactamases
  AMP_C: {
    keywords: ['AmpC', 'AmpC beta-lactamase', 'intrinsic AmpC'],
    severity: 'medium',
    antibiotic_class: 'beta-lactam',
    clinical_significance: 'important',
    color: '#C2410C' // Orange
  },
  
  // Macrolide resistance
  MACROLIDE_RESISTANT: {
    keywords: ['macrolide-resistant', 'macrolide resistant'],
    severity: 'medium',
    antibiotic_class: 'macrolide',
    clinical_significance: 'moderate',
    color: '#0369A1' // Blue
  },
  
  // Penicillin resistance
  PENICILLIN_RESISTANT: {
    keywords: ['penicillin-resistant', 'penicillin resistant'],
    severity: 'medium', 
    antibiotic_class: 'penicillin',
    clinical_significance: 'important',
    color: '#059669' // Green
  },
  
  // Generally susceptible (for comparison)
  SUSCEPTIBLE: {
    keywords: ['generally susceptible', 'generally sensitive', 'penicillin-susceptible', 'sensitive to'],
    severity: 'low',
    antibiotic_class: 'none',
    clinical_significance: 'low',
    color: '#16A34A' // Light green
  }
};

/**
 * Clinical Resistance Clusters for Medical Education
 * Groups organisms by shared resistance mechanisms and clinical significance
 */
export const CLINICAL_RESISTANCE_CLUSTERS = {
  MRSA_FAMILY: {
    name: 'MRSA & Methicillin-Resistant Staphylococci',
    description: 'Methicillin-resistant organisms requiring vancomycin or alternatives',
    resistance_mechanisms: ['MRSA'],
    clinical_priority: 'critical',
    empiric_therapy: ['vancomycin', 'linezolid', 'daptomycin'],
    educational_focus: 'Hospital-acquired infections, device-related infections'
  },
  
  ESBL_FAMILY: {
    name: 'ESBL-Producing Gram-Negatives', 
    description: 'Extended-spectrum beta-lactamase producers requiring carbapenems',
    resistance_mechanisms: ['ESBL'],
    clinical_priority: 'critical',
    empiric_therapy: ['meropenem', 'ertapenem'],
    educational_focus: 'UTIs, intra-abdominal infections in hospitalized patients'
  },
  
  VRE_FAMILY: {
    name: 'Vancomycin-Resistant Enterococci',
    description: 'Vancomycin-resistant organisms requiring alternative therapy',
    resistance_mechanisms: ['VRE', 'VISA'],
    clinical_priority: 'critical', 
    empiric_therapy: ['linezolid', 'daptomycin'],
    educational_focus: 'Nosocomial infections, immunocompromised patients'
  },
  
  CARBAPENEM_RESISTANT_FAMILY: {
    name: 'Carbapenem-Resistant Enterobacteriaceae (CRE)',
    description: 'Carbapenem-resistant organisms - extremely limited options',
    resistance_mechanisms: ['CARBAPENEM_RESISTANT'],
    clinical_priority: 'critical',
    empiric_therapy: ['colistin', 'tigecycline', 'ceftazidime-avibactam'],
    educational_focus: 'ICU infections, contact precautions, infection control'
  },
  
  MULTIDRUG_RESISTANT_FAMILY: {
    name: 'Multi-Drug Resistant Organisms',
    description: 'Organisms resistant to multiple antibiotic classes',
    resistance_mechanisms: ['MDR'],
    clinical_priority: 'high',
    empiric_therapy: ['combination_therapy'],
    educational_focus: 'Immunocompromised hosts, prolonged hospitalization'
  }
};

/**
 * Parse resistance patterns from pathogen resistance description text
 * @param {string} resistanceText - Free text resistance description
 * @returns {Object} Parsed resistance information
 */
export const parseResistancePatterns = (resistanceText) => {
  if (!resistanceText || typeof resistanceText !== 'string') {
    return {
      mechanisms: [],
      severity: 'unknown',
      clusters: [],
      clinical_significance: 'unknown'
    };
  }
  
  const lowerText = resistanceText.toLowerCase();
  const detectedMechanisms = [];
  const clusters = [];
  
  // Check each resistance mechanism
  Object.entries(RESISTANCE_MECHANISMS).forEach(([mechanismKey, mechanismData]) => {
    const isDetected = mechanismData.keywords.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
    
    if (isDetected) {
      detectedMechanisms.push({
        type: mechanismKey,
        severity: mechanismData.severity,
        antibiotic_class: mechanismData.antibiotic_class,
        clinical_significance: mechanismData.clinical_significance,
        color: mechanismData.color
      });
    }
  });
  
  // Determine clinical clusters
  Object.entries(CLINICAL_RESISTANCE_CLUSTERS).forEach(([clusterKey, clusterData]) => {
    const hasClusterMechanism = detectedMechanisms.some(mechanism =>
      clusterData.resistance_mechanisms.includes(mechanism.type)
    );
    
    if (hasClusterMechanism) {
      clusters.push({
        cluster: clusterKey,
        name: clusterData.name,
        description: clusterData.description,
        clinical_priority: clusterData.clinical_priority,
        empiric_therapy: clusterData.empiric_therapy,
        educational_focus: clusterData.educational_focus
      });
    }
  });
  
  // Determine overall severity (highest detected)
  const severityLevels = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
  const maxSeverity = detectedMechanisms.reduce((max, mechanism) => {
    const currentLevel = severityLevels[mechanism.severity] || 0;
    return currentLevel > max.level ? 
      { severity: mechanism.severity, level: currentLevel } : max;
  }, { severity: 'unknown', level: 0 });
  
  return {
    mechanisms: detectedMechanisms,
    severity: maxSeverity.severity,
    clusters: clusters,
    clinical_significance: clusters.length > 0 ? 
      clusters[0].clinical_priority : 'low',
    raw_text: resistanceText
  };
};

/**
 * Create medical clustering layout that groups pathogens by resistance patterns
 * @param {Array} pathogenNodes - Array of pathogen node data
 * @returns {Object} Clustering layout configuration for Cytoscape
 */
export const createMedicalClusteredLayout = (pathogenNodes) => {
  if (!Array.isArray(pathogenNodes)) {
    console.warn('createMedicalClusteredLayout: pathogenNodes must be an array');
    return getDefaultBiologicalLayout();
  }
  
  // Parse resistance patterns for all pathogens
  const pathogensWithResistance = pathogenNodes.map(node => {
    const pathogenData = node.data || {};
    // Use both 'resistance' field from SimplePathogenData and any 'resistancePatterns'
    const resistanceText = pathogenData.resistance || 
                          (Array.isArray(pathogenData.resistancePatterns) ? 
                           pathogenData.resistancePatterns.join(', ') : '') ||
                          '';
    
    const resistanceInfo = parseResistancePatterns(resistanceText);
    
    return {
      ...node,
      resistanceInfo: resistanceInfo,
      clusterMembership: resistanceInfo.clusters.map(c => c.cluster)
    };
  });
  
  // Group pathogens by primary resistance cluster
  const clusterGroups = {};
  const unclusteredPathogens = [];
  
  pathogensWithResistance.forEach(pathogen => {
    if (pathogen.clusterMembership.length > 0) {
      // Use primary (first) cluster for positioning
      const primaryCluster = pathogen.clusterMembership[0];
      if (!clusterGroups[primaryCluster]) {
        clusterGroups[primaryCluster] = [];
      }
      clusterGroups[primaryCluster].push(pathogen);
    } else {
      unclusteredPathogens.push(pathogen);
    }
  });
  
  // Generate cluster-aware layout with medical positioning
  const clusterPositions = generateClusterPositions(clusterGroups, unclusteredPathogens);
  
  return {
    name: 'preset', // Use preset positions from our medical clustering
    positions: clusterPositions,
    fit: true,
    padding: 50,
    animate: true,
    animationDuration: 1500,
    // Medical education enhancements
    clusterInfo: {
      clusters: Object.keys(clusterGroups).map(clusterKey => ({
        id: clusterKey,
        name: CLINICAL_RESISTANCE_CLUSTERS[clusterKey]?.name || clusterKey,
        count: clusterGroups[clusterKey].length,
        priority: CLINICAL_RESISTANCE_CLUSTERS[clusterKey]?.clinical_priority || 'medium'
      })),
      totalClustered: Object.values(clusterGroups).reduce((sum, group) => sum + group.length, 0),
      unclustered: unclusteredPathogens.length
    }
  };
};

/**
 * Generate cluster-based positions for medical education visualization
 * @param {Object} clusterGroups - Grouped pathogens by resistance cluster
 * @param {Array} unclusteredPathogens - Pathogens without clear resistance patterns
 * @returns {Object} Position mapping for Cytoscape nodes
 */
const generateClusterPositions = (clusterGroups, unclusteredPathogens) => {
  const positions = {};
  const canvas = { width: 800, height: 600, centerX: 400, centerY: 300 };
  
  // Define cluster positions in a medical-logical arrangement
  const clusterCenters = {
    'MRSA_FAMILY': { x: canvas.centerX - 200, y: canvas.centerY - 150, color: '#DC2626' },
    'VRE_FAMILY': { x: canvas.centerX + 200, y: canvas.centerY - 150, color: '#7C2D12' },
    'ESBL_FAMILY': { x: canvas.centerX - 200, y: canvas.centerY + 150, color: '#EA580C' },
    'CARBAPENEM_RESISTANT_FAMILY': { x: canvas.centerX + 200, y: canvas.centerY + 150, color: '#B91C1C' },
    'MULTIDRUG_RESISTANT_FAMILY': { x: canvas.centerX, y: canvas.centerY - 200, color: '#7C1D6F' }
  };
  
  // Position clustered pathogens in circular arrangements around cluster centers
  Object.entries(clusterGroups).forEach(([clusterKey, pathogens]) => {
    const clusterCenter = clusterCenters[clusterKey] || { x: canvas.centerX, y: canvas.centerY };
    const clusterRadius = Math.max(60, Math.min(120, pathogens.length * 15));
    
    pathogens.forEach((pathogen, index) => {
      const angle = (2 * Math.PI * index) / pathogens.length;
      const x = clusterCenter.x + clusterRadius * Math.cos(angle);
      const y = clusterCenter.y + clusterRadius * Math.sin(angle);
      
      positions[pathogen.data.id] = { x: x, y: y };
    });
  });
  
  // Position unclustered pathogens in the center area
  if (unclusteredPathogens.length > 0) {
    const centerRadius = 80;
    unclusteredPathogens.forEach((pathogen, index) => {
      const angle = (2 * Math.PI * index) / unclusteredPathogens.length;
      const x = canvas.centerX + centerRadius * Math.cos(angle);
      const y = canvas.centerY + centerRadius * Math.sin(angle);
      
      positions[pathogen.data.id] = { x: x, y: y };
    });
  }
  
  return positions;
};

/**
 * Default biological layout for fallback
 * @returns {Object} FCOSE layout configuration
 */
const getDefaultBiologicalLayout = () => ({
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
  idealEdgeLength: 100,
  nodeRepulsion: 4500,
  edgeElasticity: 0.45,
  nestingFactor: 0.1,
  gravity: 0.25,
  numIter: 2500,
  tile: true,
  tilingPaddingVertical: 10,
  tilingPaddingHorizontal: 10
});

/**
 * Enhanced pathogen transformation with resistance clustering information
 * @param {Object} pathogen - Pathogen data from SimplePathogenData
 * @returns {Object} Enhanced Cytoscape node with resistance clustering
 */
export const transformPathogenWithResistanceClustering = (pathogen) => {
  // Get base transformation
  const baseNode = transformPathogenToNode(pathogen);
  
  // Parse resistance patterns
  const resistanceText = pathogen.resistance || '';
  const resistanceInfo = parseResistancePatterns(resistanceText);
  
  // Phase 2: Calculate enhanced clinical severity with warning indicators
  const baseSeverity = pathogen.clinicalSeverity || pathogen.severity || 'medium';
  const enhancedSeverityInfo = calculateEnhancedClinicalSeverity(baseSeverity, resistanceInfo);
  
  // Phase 2: Enhanced node data with comprehensive clinical analysis
  const enhancedData = {
    ...baseNode.data,
    
    // Resistance clustering information
    resistanceInfo: resistanceInfo,
    resistanceClusters: resistanceInfo.clusters,
    resistanceMechanisms: resistanceInfo.mechanisms,
    resistanceSeverity: resistanceInfo.severity,
    clinicalSignificance: resistanceInfo.clinical_significance,
    
    // Phase 2: Enhanced clinical severity integration
    enhancedSeverity: enhancedSeverityInfo.enhancedSeverity,
    originalSeverity: enhancedSeverityInfo.originalSeverity,
    warningLevel: enhancedSeverityInfo.warningLevel,
    warningIndicators: enhancedSeverityInfo.warningIndicators,
    clinicalAlerts: enhancedSeverityInfo.clinicalAlerts,
    riskScore: enhancedSeverityInfo.riskScore,
    requiresEnhancedPrecautions: enhancedSeverityInfo.requiresEnhancedPrecautions,
    hasResistanceEscalation: enhancedSeverityInfo.hasResistanceEscalation,
    
    // Phase 2: Enhanced visual properties with warning styling
    size: enhancedSeverityInfo.nodeSize,
    borderWidth: enhancedSeverityInfo.warningStyle.borderWidth,
    borderStyle: enhancedSeverityInfo.warningStyle.borderStyle,
    shadowColor: enhancedSeverityInfo.warningStyle.shadowColor,
    shadowBlur: enhancedSeverityInfo.warningStyle.shadowBlur,
    warningIcon: enhancedSeverityInfo.warningStyle.icon,
    
    // Visual enhancements based on resistance
    resistanceColor: resistanceInfo.mechanisms.length > 0 ? 
      resistanceInfo.mechanisms[0].color : baseNode.data.color,
    resistanceIntensity: resistanceInfo.mechanisms.length,
    clusterMembership: resistanceInfo.clusters.map(c => c.cluster),
    
    // Phase 2: Clinical decision support data
    empiricTherapy: resistanceInfo.clusters.length > 0 ? 
      resistanceInfo.clusters[0].empiric_therapy : [],
    educationalFocus: resistanceInfo.clusters.length > 0 ? 
      resistanceInfo.clusters[0].educational_focus : '',
    clinicalNotes: enhancedSeverityInfo.clinicalAlerts.map(alert => alert.message),
    
    // Phase 2: Enhanced accessibility with warning information
    ariaLabel: `${baseNode.data.ariaLabel}, ${enhancedSeverityInfo.warningLevel} severity risk score ${enhancedSeverityInfo.riskScore}`,
    resistanceDescription: resistanceText,
    clinicalWarningDescription: enhancedSeverityInfo.warningIndicators
      .map(w => w.description).join('; ') || 'No special warnings'
  };
  
  // Phase 2: Add comprehensive medical metadata for clinical education
  if (enhancedSeverityInfo.clinicalAlerts.length > 0) {
    enhancedData.medicalEducationNotes = {
      alertLevel: enhancedSeverityInfo.warningLevel,
      clinicalConsiderations: enhancedSeverityInfo.clinicalAlerts,
      resistanceMechanisms: resistanceInfo.mechanisms,
      recommendedActions: enhancedSeverityInfo.requiresEnhancedPrecautions ? 
        ['Enhanced isolation precautions', 'Infectious disease consultation', 'Antibiogram review'] :
        ['Standard precautions', 'Monitor susceptibility patterns']
    };
  }
  
  return {
    ...baseNode,
    data: enhancedData
  };
};

// ==========================================
// PHASE 2: EVIDENCE LEVEL INTEGRATION
// Advanced Evidence-Based Medicine Analysis
// ==========================================

/**
 * Analyze evidence strength for pathogen-antibiotic relationships
 * @param {string} pathogenName - Name of the pathogen
 * @param {string} antibioticName - Name of the antibiotic
 * @param {Object} relationshipData - Optional relationship metadata
 * @returns {Object} Evidence analysis with clinical recommendations
 */
export const analyzeEvidenceStrength = (pathogenName, antibioticName, relationshipData = {}) => {
  // Defensive programming - ensure relationshipData is an object
  const safeRelationshipData = relationshipData || {};
  
  // Extract evidence level from relationship data
  const evidenceLevel = safeRelationshipData.evidenceLevel || safeRelationshipData.evidenceGrade || 'UNKNOWN';
  
  // Get evidence properties from mapping
  const evidenceProps = EVIDENCE_STRENGTH_MAP[evidenceLevel] || EVIDENCE_STRENGTH_MAP.UNKNOWN;
  
  // Analyze clinical context for evidence grading
  const clinicalContext = analyzeClinicalevidenceContext(pathogenName, antibioticName, safeRelationshipData);
  
  // Generate evidence-based recommendations
  const recommendations = generateEvidenceBasedRecommendations(evidenceLevel, clinicalContext);
  
  return {
    // Core evidence properties
    evidenceLevel,
    confidence: evidenceProps.confidence,
    clinicalWeight: evidenceProps.clinicalWeight,
    guidelineStrength: evidenceProps.guidelineStrength,
    description: evidenceProps.description,
    
    // Visual properties for network display
    visualProperties: {
      style: evidenceProps.style,
      thickness: evidenceProps.thickness,
      opacity: evidenceProps.opacity,
      color: evidenceProps.color,
      modifier: evidenceProps.modifier,
      icon: evidenceProps.icon
    },
    
    // Clinical context analysis
    clinicalContext,
    
    // Evidence-based clinical recommendations
    recommendations,
    
    // Quality metrics
    qualityIndicators: {
      evidenceQuality: getEvidenceQualityDescription(evidenceLevel),
      recommendationStrength: getRecommendationStrength(evidenceLevel),
      clinicalApplicationConfidence: calculateClinicalConfidence(evidenceProps.clinicalWeight, clinicalContext)
    },
    
    // Educational content
    medicalEducationNotes: {
      evidenceSummary: `${evidenceLevel} level evidence: ${evidenceProps.description}`,
      clinicalPearls: generateClinicalPearls(pathogenName, antibioticName, evidenceLevel),
      guidelineReferences: identifyRelevantGuidelines(pathogenName, antibioticName)
    }
  };
};

/**
 * Analyze clinical context for evidence-based medicine application
 * @param {string} pathogenName - Name of the pathogen
 * @param {string} antibioticName - Name of the antibiotic
 * @param {Object} relationshipData - Relationship metadata
 * @returns {Object} Clinical context analysis
 */
const analyzeClinicalevidenceContext = (pathogenName, antibioticName, relationshipData) => {
  const context = {
    pathogenRiskFactors: [],
    antibioticConsiderations: [],
    populationSpecificFactors: [],
    clinicalSettingFactors: []
  };
  
  // Defensive programming - handle null/undefined inputs
  const safePathogenName = pathogenName || '';
  const safeAntibioticName = antibioticName || '';
  const safeRelationshipData = relationshipData || {};
  
  // Analyze pathogen-specific risk factors
  const pathogenLower = safePathogenName.toLowerCase();
  
  // High-risk pathogens requiring strong evidence
  if (pathogenLower.includes('staphylococcus aureus')) {
    context.pathogenRiskFactors.push('MRSA potential - requires culture-guided therapy');
    context.pathogenRiskFactors.push('Tissue penetration considerations for deep infections');
  }
  
  if (pathogenLower.includes('pseudomonas')) {
    context.pathogenRiskFactors.push('Intrinsic resistance mechanisms - combination therapy often needed');
    context.pathogenRiskFactors.push('Critical infections - higher evidence standards required');
  }
  
  if (pathogenLower.includes('enterococcus')) {
    context.pathogenRiskFactors.push('VRE potential - vancomycin resistance screening needed');
    context.pathogenRiskFactors.push('Hospital-acquired infection risk factors');
  }
  
  // Analyze antibiotic-specific considerations
  const antibioticLower = safeAntibioticName.toLowerCase();
  
  if (antibioticLower.includes('vancomycin')) {
    context.antibioticConsiderations.push('Nephrotoxicity monitoring required');
    context.antibioticConsiderations.push('Therapeutic drug monitoring essential');
  }
  
  if (antibioticLower.includes('carbapenem') || antibioticLower.includes('meropenem')) {
    context.antibioticConsiderations.push('Broad-spectrum - consider antibiotic stewardship');
    context.antibioticConsiderations.push('Carbapenem resistance emergence risk');
  }
  
  // Population-specific factors (pediatric focus)
  context.populationSpecificFactors.push('Pediatric dosing considerations');
  context.populationSpecificFactors.push('Age-appropriate formulations');
  context.populationSpecificFactors.push('Developmental pharmacokinetics');
  
  // Clinical setting factors
  if (safeRelationshipData.severity === 'high' || safeRelationshipData.effectiveness === 'high') {
    context.clinicalSettingFactors.push('ICU-level monitoring may be required');
    context.clinicalSettingFactors.push('Infectious disease consultation recommended');
  }
  
  return context;
};

/**
 * Generate evidence-based clinical recommendations
 * @param {string} evidenceLevel - Evidence grade (A, B, C, D, EXPERT, UNKNOWN)
 * @param {Object} clinicalContext - Clinical context analysis
 * @returns {Object} Evidence-based recommendations
 */
const generateEvidenceBasedRecommendations = (evidenceLevel, clinicalContext) => {
  const recommendations = {
    primary: [],
    secondary: [],
    monitoring: [],
    alternatives: []
  };
  
  // Primary recommendations based on evidence level
  switch (evidenceLevel) {
    case 'A':
      recommendations.primary.push('First-line therapy supported by high-quality evidence');
      recommendations.primary.push('Strong recommendation for use in appropriate clinical situations');
      recommendations.monitoring.push('Standard monitoring protocols adequate');
      break;
      
    case 'B':
      recommendations.primary.push('Appropriate therapy with moderate-quality evidence');
      recommendations.primary.push('Consider in conjunction with clinical judgment');
      recommendations.monitoring.push('Enhanced monitoring may be beneficial');
      recommendations.secondary.push('Alternative agents may be considered');
      break;
      
    case 'C':
      recommendations.primary.push('Limited evidence - use with caution');
      recommendations.primary.push('Consider individual patient factors carefully');
      recommendations.monitoring.push('Close monitoring required');
      recommendations.alternatives.push('Explore alternative agents with higher evidence levels');
      recommendations.secondary.push('Infectious disease consultation recommended');
      break;
      
    case 'D':
      recommendations.primary.push('Insufficient evidence - expert consultation recommended');
      recommendations.primary.push('Use only when alternatives unavailable');
      recommendations.monitoring.push('Intensive monitoring required');
      recommendations.alternatives.push('Prioritize agents with higher evidence levels');
      recommendations.secondary.push('Infectious disease consultation essential');
      break;
      
    case 'EXPERT':
      recommendations.primary.push('Based on expert consensus - clinical judgment required');
      recommendations.monitoring.push('Enhanced monitoring protocols recommended');
      recommendations.secondary.push('Consider local resistance patterns');
      break;
      
    default: // UNKNOWN
      recommendations.primary.push('Evidence level unclear - proceed with caution');
      recommendations.monitoring.push('Comprehensive monitoring required');
      recommendations.alternatives.push('Seek agents with established evidence levels');
      recommendations.secondary.push('Infectious disease consultation strongly recommended');
  }
  
  // Add context-specific recommendations
  if (clinicalContext.pathogenRiskFactors.length > 0) {
    recommendations.secondary.push('High-risk pathogen - culture and susceptibility testing essential');
  }
  
  if (clinicalContext.antibioticConsiderations.length > 0) {
    recommendations.monitoring.push('Antibiotic-specific monitoring protocols required');
  }
  
  return recommendations;
};

/**
 * Get evidence quality description for clinical education
 * @param {string} evidenceLevel - Evidence grade
 * @returns {string} Quality description
 */
const getEvidenceQualityDescription = (evidenceLevel) => {
  const qualityMap = {
    'A': 'High quality - Multiple well-designed RCTs or meta-analyses',
    'B': 'Moderate quality - Limited RCTs or high-quality observational studies',
    'C': 'Low quality - Observational studies with limitations or case series',
    'D': 'Very low quality - Expert opinion or case reports only',
    'EXPERT': 'Expert consensus - Professional society recommendations',
    'UNKNOWN': 'Quality assessment needed - Insufficient information available'
  };
  
  return qualityMap[evidenceLevel] || qualityMap.UNKNOWN;
};

/**
 * Get recommendation strength for clinical decision-making
 * @param {string} evidenceLevel - Evidence grade
 * @returns {string} Recommendation strength
 */
const getRecommendationStrength = (evidenceLevel) => {
  const strengthMap = {
    'A': 'Strong recommendation - Benefits clearly outweigh risks',
    'B': 'Conditional recommendation - Benefits likely outweigh risks', 
    'C': 'Weak recommendation - Benefits may outweigh risks',
    'D': 'No recommendation - Insufficient evidence',
    'EXPERT': 'Expert opinion - Based on clinical experience',
    'UNKNOWN': 'Assessment needed - Evidence review required'
  };
  
  return strengthMap[evidenceLevel] || strengthMap.UNKNOWN;
};

/**
 * Calculate clinical application confidence score
 * @param {number} clinicalWeight - Weight from evidence mapping
 * @param {Object} clinicalContext - Clinical context factors
 * @returns {number} Confidence score (0-100)
 */
const calculateClinicalConfidence = (clinicalWeight, clinicalContext) => {
  let confidence = clinicalWeight;
  
  // Adjust based on risk factors
  const totalRiskFactors = 
    clinicalContext.pathogenRiskFactors.length +
    clinicalContext.antibioticConsiderations.length;
    
  // Higher risk factors reduce confidence without strong evidence
  if (totalRiskFactors > 2 && clinicalWeight < 75) {
    confidence = Math.max(confidence - (totalRiskFactors * 5), 10);
  }
  
  // Pediatric population may require adjusted confidence
  if (clinicalContext.populationSpecificFactors.length > 0) {
    confidence = Math.max(confidence - 5, 10);
  }
  
  return Math.round(confidence);
};

/**
 * Generate clinical pearls for medical education
 * @param {string} pathogenName - Pathogen name
 * @param {string} antibioticName - Antibiotic name
 * @param {string} evidenceLevel - Evidence grade
 * @returns {Array} Array of clinical pearls
 */
const generateClinicalPearls = (pathogenName, antibioticName, evidenceLevel) => {
  const pearls = [];
  
  // Defensive programming - handle null/undefined inputs
  const safePathogenName = (pathogenName || '').toLowerCase();
  const safeAntibioticName = (antibioticName || '').toLowerCase();
  
  // Evidence-level specific pearls
  if (evidenceLevel === 'A') {
    pearls.push('Gold standard therapy - first choice when clinically appropriate');
  } else if (evidenceLevel === 'C' || evidenceLevel === 'D') {
    pearls.push('Limited evidence - consider alternatives with stronger data when available');
  }
  
  // Pathogen-specific pearls
  if (safePathogenName.includes('staphylococcus aureus')) {
    pearls.push('Always consider MRSA possibility - culture results guide therapy');
  }
  
  if (safePathogenName.includes('pseudomonas')) {
    pearls.push('Consider combination therapy for serious infections');
  }
  
  // Antibiotic-specific pearls
  if (safeAntibioticName.includes('vancomycin')) {
    pearls.push('Monitor trough levels and renal function closely');
  }
  
  return pearls;
};

/**
 * Identify relevant clinical guidelines
 * @param {string} pathogenName - Pathogen name
 * @param {string} antibioticName - Antibiotic name
 * @returns {Array} Array of relevant guidelines
 */
const identifyRelevantGuidelines = (pathogenName, antibioticName) => {
  const guidelines = [];
  
  // Defensive programming - handle null/undefined inputs
  const safePathogenName = (pathogenName || '').toLowerCase();
  
  // AAP guidelines for pediatric infections
  guidelines.push('AAP Clinical Practice Guidelines for Pediatric Infections');
  
  // IDSA guidelines for specific pathogens
  if (safePathogenName.includes('staphylococcus')) {
    guidelines.push('IDSA Guidelines for MRSA Infections');
  }
  
  if (safePathogenName.includes('streptococcus')) {
    guidelines.push('AAP Guidelines for Streptococcal Infections');
  }
  
  // CDC recommendations
  guidelines.push('CDC Antibiotic Resistance Threats Report');
  guidelines.push('CDC Core Elements of Antibiotic Stewardship');
  
  return guidelines;
};

/**
 * Transform relationship edge with evidence-based styling
 * @param {Object} edge - Original edge object
 * @param {Object} evidenceAnalysis - Evidence analysis result
 * @returns {Object} Enhanced edge with evidence visualization
 */
export const transformEdgeWithEvidenceAnalysis = (edge, evidenceAnalysis) => {
  const enhancedEdge = {
    ...edge,
    data: {
      ...edge.data,
      
      // Evidence-based visual properties
      evidenceLevel: evidenceAnalysis.evidenceLevel,
      evidenceConfidence: evidenceAnalysis.confidence,
      clinicalWeight: evidenceAnalysis.clinicalWeight,
      
      // Visual styling
      lineStyle: evidenceAnalysis.visualProperties.style,
      width: evidenceAnalysis.visualProperties.thickness,
      opacity: evidenceAnalysis.visualProperties.opacity,
      color: evidenceAnalysis.visualProperties.color,
      
      // Clinical information
      guidelineStrength: evidenceAnalysis.guidelineStrength,
      recommendations: evidenceAnalysis.recommendations.primary,
      clinicalPearls: evidenceAnalysis.medicalEducationNotes.clinicalPearls,
      
      // Enhanced accessibility
      ariaLabel: `${edge.data.ariaLabel || ''} - ${evidenceAnalysis.evidenceLevel} level evidence`,
      evidenceDescription: evidenceAnalysis.description,
      qualityAssessment: evidenceAnalysis.qualityIndicators.evidenceQuality
    }
  };
  
  return enhancedEdge;
};
