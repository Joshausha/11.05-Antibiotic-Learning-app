/**
 * Pathogen Similarity Analysis Utility
 *
 * Calculates antibiotic similarity between pathogens using Jaccard coefficient
 * to generate medically accurate relationship data for network visualization.
 *
 * Medical Rationale:
 * Jaccard similarity measures the overlap of effective antibiotics between pathogens.
 * Pathogens with high antibiotic overlap (>50%) typically share biological characteristics:
 * - Similar cell wall structures
 * - Common resistance mechanisms
 * - Related taxonomic classifications
 * - Shared infection sites
 *
 * @see {@link https://academic.oup.com/cid/article/76/3/e1/6696391|IDSA AST Guidelines 2023}
 * @see {@link https://publications.aap.org/redbook|AAP Red Book 2024}
 * @see {@link https://pubs.aspen.org/nelson-pediatrics|Nelson's Pediatric AT 2024}
 */

import pathogenAntibioticMap from '../data/pathogenAntibioticMap';
import simplePathogens from '../data/SimplePathogenData';

/**
 * Calculate Jaccard similarity coefficient between two pathogens
 *
 * Jaccard Coefficient = |Intersection| / |Union|
 *
 * Only considers antibiotics with 'high' or 'medium' effectiveness to focus
 * on clinically relevant antibiotic overlap.
 *
 * @param {number} pathogenId1 - ID of first pathogen
 * @param {number} pathogenId2 - ID of second pathogen
 * @param {string} effectivenessThreshold - Minimum effectiveness ('high', 'medium', 'low', 'resistant')
 * @returns {number} Similarity score from 0 to 1
 *
 * @example
 * const similarity = calculateJaccardSimilarity(2, 6); // E. coli vs Klebsiella
 * console.log(similarity); // ~0.68 (68% overlap)
 */
export const calculateJaccardSimilarity = (
  pathogenId1,
  pathogenId2,
  effectivenessThreshold = 'medium'
) => {
  // Validity check
  if (!pathogenAntibioticMap[pathogenId1] || !pathogenAntibioticMap[pathogenId2]) {
    return 0;
  }

  // Extract effective antibiotics for both pathogens
  const antibiotics1 = getEffectiveAntibiotics(pathogenId1, effectivenessThreshold);
  const antibiotics2 = getEffectiveAntibiotics(pathogenId2, effectivenessThreshold);

  // Convert to Sets for intersection/union calculation
  const set1 = new Set(antibiotics1);
  const set2 = new Set(antibiotics2);

  // Calculate intersection and union
  const intersection = new Set(
    [...set1].filter(ab => set2.has(ab))
  );
  const union = new Set([...set1, ...set2]);

  // Handle edge case: both have no effective antibiotics
  if (union.size === 0) {
    return 0;
  }

  // Return Jaccard coefficient
  return intersection.size / union.size;
};

/**
 * Get effective antibiotics for a pathogen above effectiveness threshold
 *
 * @param {number} pathogenId - Pathogen ID
 * @param {string} threshold - Minimum effectiveness ('high', 'medium', 'low', 'resistant')
 * @returns {number[]} Array of antibiotic IDs with sufficient effectiveness
 */
export const getEffectiveAntibiotics = (pathogenId, threshold = 'medium') => {
  const pathogen = pathogenAntibioticMap[pathogenId];
  if (!pathogen) return [];

  const thresholdLevels = {
    high: ['high'],
    medium: ['high', 'medium'],
    low: ['high', 'medium', 'low'],
    resistant: ['high', 'medium', 'low', 'resistant']
  };

  const acceptableLevels = thresholdLevels[threshold] || thresholdLevels.medium;

  return pathogen.antibiotics
    .filter(ab => acceptableLevels.includes(ab.effectiveness))
    .map(ab => ab.antibioticId);
};

/**
 * Classify relationship strength based on similarity coefficient
 *
 * Classification thresholds (based on clinical patterns):
 * - Strong (>0.5): Similar antibiotic profiles, likely shared resistance mechanisms
 * - Medium (0.35-0.5): Partial overlap, some shared characteristics
 * - Weak (0.2-0.35): Minimal overlap, different resistance profiles
 * - None (<0.2): Very different antibiotic susceptibility
 *
 * @param {number} similarity - Jaccard coefficient (0-1)
 * @returns {string} Relationship type: 'strong', 'medium', 'weak', or 'none'
 */
export const classifyRelationshipType = (similarity) => {
  if (similarity > 0.5) return 'strong';
  if (similarity > 0.35) return 'medium';
  if (similarity > 0.2) return 'weak';
  return 'none';
};

/**
 * Validate relationship medically using clinical rules
 *
 * Medical validation ensures biologically sensible relationships:
 * 1. Gram-positive/negative separation - cross-gram high similarity is rare
 * 2. Virus-bacteria separation - fundamentally different organisms
 * 3. Intrinsic resistance patterns - documented resistance mechanisms
 * 4. Taxonomic relationships - related organisms cluster
 *
 * @param {number} pathogenId1 - First pathogen ID
 * @param {number} pathogenId2 - Second pathogen ID
 * @param {number} similarity - Calculated Jaccard similarity
 * @returns {Object} { valid: boolean, reason: string }
 */
export const validateRelationshipMedically = (pathogenId1, pathogenId2, similarity) => {
  const pathogen1 = simplePathogens.find(p => p.id === pathogenId1);
  const pathogen2 = simplePathogens.find(p => p.id === pathogenId2);

  if (!pathogen1 || !pathogen2) {
    return { valid: false, reason: 'Pathogen not found' };
  }

  // Rule 1: Gram-positive and Gram-negative shouldn't have very high similarity
  // (unless both have intrinsic resistance mechanisms)
  const isGramMismatch =
    (pathogen1.gramStain === 'positive' && pathogen2.gramStain === 'negative') ||
    (pathogen1.gramStain === 'negative' && pathogen2.gramStain === 'positive');

  if (isGramMismatch && similarity > 0.6) {
    return {
      valid: false,
      reason: `Cross-Gram similarity too high (${(similarity * 100).toFixed(0)}%)`
    };
  }

  // Rule 2: Viruses shouldn't cluster with bacteria
  const isViralusBacterial =
    (pathogen1.gramStain === 'virus') !== (pathogen2.gramStain === 'virus');

  if (isViralusBacterial) {
    return { valid: false, reason: 'Virus-bacteria relationship invalid' };
  }

  // Rule 3: Acid-fast organisms are special cases
  const isAcidFastMismatch =
    (pathogen1.gramStain === 'acid-fast' && pathogen2.gramStain !== 'acid-fast') ||
    (pathogen1.gramStain !== 'acid-fast' && pathogen2.gramStain === 'acid-fast');

  if (isAcidFastMismatch && similarity > 0.4) {
    return {
      valid: false,
      reason: 'Acid-fast organisms have unique resistance patterns'
    };
  }

  // Rule 4: Atypical organisms without cell walls are special
  const isAtypicalMismatch =
    (pathogen1.gramStain === 'atypical' && pathogen2.gramStain !== 'atypical') ||
    (pathogen1.gramStain !== 'atypical' && pathogen2.gramStain === 'atypical');

  if (isAtypicalMismatch && similarity > 0.45) {
    return {
      valid: false,
      reason: 'Atypical organisms (no cell wall) have different antibiotic requirements'
    };
  }

  // Rule 5: Same species should cluster
  if (pathogen1.name.split(' ')[0] === pathogen2.name.split(' ')[0] && similarity < 0.3) {
    return {
      valid: false,
      reason: 'Same species should have higher similarity'
    };
  }

  return { valid: true, reason: 'Relationship passes medical validation' };
};

/**
 * Generate all pathogen relationships above similarity threshold
 *
 * Creates all pairwise comparisons and filters by threshold, then validates
 * each relationship medically. Returns only valid relationships.
 *
 * @param {number} threshold - Minimum similarity score (0-1), default 0.3
 * @param {boolean} includeMedical - Include medical validation, default true
 * @returns {Array} Array of relationship objects
 *
 * @example
 * const relationships = generatePathogenRelationships(0.3);
 * console.log(relationships.length); // ~45-60 relationships
 *
 * // Typical result:
 * // {
 * //   sourceId: 2,
 * //   source: 'Escherichia coli',
 * //   targetId: 6,
 * //   target: 'Klebsiella pneumoniae',
 * //   similarity: 0.68,
 * //   relationshipType: 'strong',
 * //   sharedAntibiotics: [4, 8, 3, 7],
 * //   sharedAntibioticNames: ['Ceftriaxone', 'Meropenem', 'Ciprofloxacin', 'Gentamicin']
 * // }
 */
export const generatePathogenRelationships = (threshold = 0.3, includeMedical = true) => {
  const relationships = [];
  const processed = new Set(); // Avoid duplicate pairs

  // Get list of all pathogen IDs
  const pathogenIds = Object.keys(pathogenAntibioticMap).map(Number);

  // Compare each pair of pathogens
  for (let i = 0; i < pathogenIds.length; i++) {
    for (let j = i + 1; j < pathogenIds.length; j++) {
      const id1 = pathogenIds[i];
      const id2 = pathogenIds[j];
      const pairKey = `${Math.min(id1, id2)}-${Math.max(id1, id2)}`;

      // Skip if already processed
      if (processed.has(pairKey)) continue;
      processed.add(pairKey);

      // Calculate similarity
      const similarity = calculateJaccardSimilarity(id1, id2);

      // Skip if below threshold
      if (similarity < threshold) continue;

      // Validate medically
      if (includeMedical) {
        const validation = validateRelationshipMedically(id1, id2, similarity);
        if (!validation.valid) continue;
      }

      // Get shared antibiotics
      const antibiotics1 = getEffectiveAntibiotics(id1);
      const antibiotics2 = getEffectiveAntibiotics(id2);
      const shared = [...new Set([...antibiotics1].filter(ab => antibiotics2.includes(ab)))];

      // Get pathogen names
      const pathogen1 = pathogenAntibioticMap[id1];
      const pathogen2 = pathogenAntibioticMap[id2];

      // Create relationship object
      relationships.push({
        sourceId: id1,
        source: pathogen1.pathogenName,
        targetId: id2,
        target: pathogen2.pathogenName,
        similarity,
        relationshipType: classifyRelationshipType(similarity),
        sharedAntibiotics: shared,
        sharedAntibioticNames: shared
          .map(abId => {
            const ab = pathogen1.antibiotics.find(a => a.antibioticId === abId);
            return ab?.name || `Antibiotic ${abId}`;
          })
          .filter(Boolean),
        clinicalRationale: generateClinicalRationale(id1, id2, similarity),
        medicalSource: 'Phase 7.2 Antibiotic Similarity Analysis'
      });
    }
  }

  return relationships;
};

/**
 * Generate clinical rationale for relationship
 *
 * Creates human-readable explanation of why two pathogens are related
 * based on their characteristics.
 *
 * @param {number} pathogenId1 - First pathogen ID
 * @param {number} pathogenId2 - Second pathogen ID
 * @param {number} similarity - Similarity coefficient
 * @returns {string} Clinical explanation
 */
const generateClinicalRationale = (pathogenId1, pathogenId2, similarity) => {
  const p1 = simplePathogens.find(p => p.id === pathogenId1);
  const p2 = simplePathogens.find(p => p.id === pathogenId2);

  if (!p1 || !p2) return '';

  const similarityPercent = (similarity * 100).toFixed(0);

  // Check for same genus (first word of name)
  const sameGenus = p1.name.split(' ')[0] === p2.name.split(' ')[0];
  if (sameGenus) {
    return `Both ${p1.name.split(' ')[0]} species with ${similarityPercent}% antibiotic overlap`;
  }

  // Check for same Gram stain
  const sameGram = p1.gramStain === p2.gramStain;
  if (sameGram) {
    return `Both Gram-${p1.gramStain} pathogens with ${similarityPercent}% antibiotic overlap`;
  }

  // Check for shared infection sites
  const sharedSites = p1.commonSites.filter(site => p2.commonSites.includes(site));
  if (sharedSites.length > 0) {
    return `Co-infection partners in ${sharedSites.join(', ')} with ${similarityPercent}% antibiotic overlap`;
  }

  // Default rationale
  return `Pathogens with ${similarityPercent}% antibiotic susceptibility overlap`;
};

/**
 * Get statistics about relationship generation
 *
 * @param {Array} relationships - Generated relationships array
 * @returns {Object} Statistics object
 */
export const getRelationshipStatistics = (relationships) => {
  const stats = {
    total: relationships.length,
    strong: relationships.filter(r => r.relationshipType === 'strong').length,
    medium: relationships.filter(r => r.relationshipType === 'medium').length,
    weak: relationships.filter(r => r.relationshipType === 'weak').length,
    averageSimilarity: relationships.length > 0
      ? (relationships.reduce((sum, r) => sum + r.similarity, 0) / relationships.length).toFixed(3)
      : 0,
    minSimilarity: relationships.length > 0
      ? Math.min(...relationships.map(r => r.similarity)).toFixed(3)
      : 0,
    maxSimilarity: relationships.length > 0
      ? Math.max(...relationships.map(r => r.similarity)).toFixed(3)
      : 0
  };

  return stats;
};

export default {
  calculateJaccardSimilarity,
  getEffectiveAntibiotics,
  classifyRelationshipType,
  validateRelationshipMedically,
  generatePathogenRelationships,
  getRelationshipStatistics
};
