/**
 * Antibiotic Class Clustering System
 * 
 * Northwestern Coverage Wheel Implementation - Day 6 Morning Session 1
 * Provides spatial clustering of antibiotics by pharmacological class
 * 
 * Educational Focus:
 * - Groups beta-lactams together (penicillins, cephalosporins, carbapenems)
 * - Clusters aminoglycosides for spectrum comparison
 * - Positions macrolides/lincosamides in logical groupings
 * - Separates fluoroquinolones as distinct class
 * 
 * Medical Accuracy: Uses existing ANTIBIOTIC_CLASSES data from AntibioticClassData.js
 */

import { ANTIBIOTIC_CLASSES, getAntibioticClass, getAntibioticsInClass } from '../../data/AntibioticClassData';

/**
 * Spatial positioning for antibiotic class clusters
 * Positions optimized for Northwestern-style medical education
 */
export const CLASS_CLUSTER_POSITIONS = {
  'beta-lactams': {
    x: -300,
    y: -200,
    color: '#4A90E2',
    radius: 120,
    label: 'β-Lactams',
    mechanism: 'Cell Wall Synthesis',
    educationalNote: 'Penicillins, Cephalosporins, Carbapenems - disrupts peptidoglycan synthesis'
  },
  'aminoglycosides': {
    x: 300,
    y: -200,
    color: '#50C878',
    radius: 100,
    label: 'Aminoglycosides',
    mechanism: 'Protein Synthesis (30S)',
    educationalNote: 'Gentamicin, Tobramycin, Amikacin - bactericidal protein synthesis inhibitors'
  },
  'macrolides': {
    x: -300,
    y: 200,
    color: '#FF6B6B',
    radius: 100,
    label: 'Macrolides',
    mechanism: 'Protein Synthesis (50S)',
    educationalNote: 'Azithromycin, Erythromycin, Clindamycin - bacteriostatic'
  },
  'fluoroquinolones': {
    x: 300,
    y: 200,
    color: '#FFD700',
    radius: 100,
    label: 'Fluoroquinolones',
    mechanism: 'DNA Synthesis',
    educationalNote: 'Ciprofloxacin, Levofloxacin - DNA gyrase/topoisomerase inhibitors'
  },
  'glycopeptides': {
    x: 0,
    y: -300,
    color: '#9B59B6',
    radius: 80,
    label: 'Glycopeptides',
    mechanism: 'Cell Wall Synthesis',
    educationalNote: 'Vancomycin, Teicoplanin - large molecules, MRSA coverage'
  },
  'tetracyclines': {
    x: 0,
    y: 300,
    color: '#FF9F40',
    radius: 80,
    label: 'Tetracyclines',
    mechanism: 'Protein Synthesis (30S)',
    educationalNote: 'Doxycycline, Minocycline - broad spectrum, atypical coverage'
  },
  'sulfonamides': {
    x: -450,
    y: 0,
    color: '#8E44AD',
    radius: 70,
    label: 'Sulfonamides',
    mechanism: 'Folate Synthesis',
    educationalNote: 'Trimethoprim-sulfamethoxazole - folate pathway inhibition'
  },
  'lincosamides': {
    x: 450,
    y: 0,
    color: '#E67E22',
    radius: 70,
    label: 'Lincosamides',
    mechanism: 'Protein Synthesis (50S)',
    educationalNote: 'Clindamycin - anaerobic coverage, similar to macrolides'
  }
};

/**
 * Applies spatial clustering to antibiotic nodes based on their pharmacological class
 * Uses force-directed positioning within each cluster for natural distribution
 * 
 * @param {Object} cy - Cytoscape instance
 * @returns {Object} - Clustering results with statistics
 */
export const applyClassClustering = (cy) => {
  if (!cy) {
    console.warn('Cytoscape instance not provided to applyClassClustering');
    return { success: false, error: 'No Cytoscape instance' };
  }

  const clusteringStats = {
    totalAntibiotics: 0,
    clusteredAntibiotics: 0,
    clusterCount: 0,
    uncategorized: []
  };

  try {
    // Get all antibiotic nodes
    const antibioticNodes = cy.nodes('[type="antibiotic"]');
    clusteringStats.totalAntibiotics = antibioticNodes.length;

    if (antibioticNodes.length === 0) {
      console.log('No antibiotic nodes found for clustering');
      return { success: true, stats: clusteringStats };
    }

    // Group nodes by antibiotic class
    const classClusters = {};
    
    antibioticNodes.forEach(node => {
      const antibioticId = node.data('id')?.replace('antibiotic-', '') || node.data('name');
      const classData = getAntibioticClass(antibioticId);
      const className = classData?.className || 'unknown';
      
      if (className === 'unknown') {
        clusteringStats.uncategorized.push(antibioticId);
        return;
      }

      if (!classClusters[className]) {
        classClusters[className] = [];
      }
      classClusters[className].push(node);
    });

    clusteringStats.clusterCount = Object.keys(classClusters).length;

    // Apply positioning for each cluster
    Object.entries(classClusters).forEach(([className, nodes]) => {
      const clusterPos = CLASS_CLUSTER_POSITIONS[className];
      
      if (!clusterPos) {
        console.warn(`No cluster position defined for class: ${className}`);
        clusteringStats.uncategorized.push(...nodes.map(n => n.data('id')));
        return;
      }

      // Apply force-directed layout within cluster
      nodes.forEach((node, index) => {
        // Calculate position within cluster using golden angle spiral
        const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians
        const angle = index * goldenAngle;
        const radiusFromCenter = Math.sqrt(index) * (clusterPos.radius / Math.sqrt(nodes.length));
        
        // Add some randomness to avoid perfect patterns
        const randomOffset = {
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 20
        };

        const position = {
          x: clusterPos.x + radiusFromCenter * Math.cos(angle) + randomOffset.x,
          y: clusterPos.y + radiusFromCenter * Math.sin(angle) + randomOffset.y
        };

        // Set position and add class information
        node.position(position);
        node.addClass(`class-${className}`);
        
        // Store cluster information in node scratch
        node.scratch({
          ...node.scratch(),
          _classCluster: className,
          _clusterPosition: clusterPos,
          _clusterIndex: index
        });

        clusteringStats.clusteredAntibiotics++;
      });
    });

    console.log('Class clustering applied successfully:', clusteringStats);
    return { success: true, stats: clusteringStats, clusters: classClusters };

  } catch (error) {
    console.error('Error applying class clustering:', error);
    return { success: false, error: error.message, stats: clusteringStats };
  }
};

/**
 * Gets cluster information for a specific antibiotic class
 * 
 * @param {string} className - The antibiotic class name
 * @returns {Object|null} - Cluster position and metadata
 */
export const getClusterInfo = (className) => {
  return CLASS_CLUSTER_POSITIONS[className] || null;
};

/**
 * Gets all antibiotics that should be in the same cluster
 * 
 * @param {string} antibioticId - ID of the antibiotic
 * @returns {Array} - Array of related antibiotic IDs in the same class
 */
export const getClusterMembers = (antibioticId) => {
  try {
    const classData = getAntibioticClass(antibioticId);
    if (!classData) return [];
    
    return getAntibioticsInClass(classData.className) || [];
  } catch (error) {
    console.error('Error getting cluster members:', error);
    return [];
  }
};

/**
 * Calculates optimal cluster radius based on number of members
 * 
 * @param {number} memberCount - Number of antibiotics in cluster
 * @param {number} baseRadius - Base radius for the cluster
 * @returns {number} - Optimized radius
 */
export const calculateOptimalRadius = (memberCount, baseRadius = 100) => {
  if (memberCount <= 1) return baseRadius * 0.5;
  if (memberCount <= 3) return baseRadius * 0.7;
  if (memberCount <= 6) return baseRadius;
  if (memberCount <= 10) return baseRadius * 1.2;
  return baseRadius * 1.5; // For very large clusters
};

/**
 * Updates cluster positions dynamically (useful for layout changes)
 * 
 * @param {Object} cy - Cytoscape instance
 * @param {string} className - Specific class to update, or null for all
 * @returns {boolean} - Success status
 */
export const updateClusterPositions = (cy, className = null) => {
  try {
    const classesToUpdate = className ? [className] : Object.keys(CLASS_CLUSTER_POSITIONS);
    
    classesToUpdate.forEach(clsName => {
      const clusterNodes = cy.nodes(`[type="antibiotic"].class-${clsName}`);
      const clusterPos = CLASS_CLUSTER_POSITIONS[clsName];
      
      if (!clusterPos || clusterNodes.length === 0) return;
      
      // Animate to new positions
      clusterNodes.forEach((node, index) => {
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const angle = index * goldenAngle;
        const radiusFromCenter = Math.sqrt(index) * (clusterPos.radius / Math.sqrt(clusterNodes.length));
        
        node.animate({
          position: {
            x: clusterPos.x + radiusFromCenter * Math.cos(angle),
            y: clusterPos.y + radiusFromCenter * Math.sin(angle)
          },
          duration: 500,
          easing: 'ease-in-out'
        });
      });
    });
    
    return true;
  } catch (error) {
    console.error('Error updating cluster positions:', error);
    return false;
  }
};

export default {
  CLASS_CLUSTER_POSITIONS,
  applyClassClustering,
  getClusterInfo,
  getClusterMembers,
  calculateOptimalRadius,
  updateClusterPositions
};