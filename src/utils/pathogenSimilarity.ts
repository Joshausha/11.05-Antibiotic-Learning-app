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
 * Type definitions for pathogen similarity analysis
 */

interface Antibiotic {
  antibioticId: number;
  effectiveness: 'high' | 'medium' | 'low' | 'resistant';
  name?: string;
  [key: string]: any;
}

interface PathogenData {
  pathogenName: string;
  antibiotics: Antibiotic[];
  [key: string]: any;
}

interface SimplePathogen {
  id: number;
  name: string;
  gramStain: 'positive' | 'negative' | 'acid-fast' | 'atypical' | 'virus';
  commonSites: string[];
  [key: string]: any;
}

interface ValidationResult {
  valid: boolean;
  reason: string;
}

interface PathogenRelationship {
  sourceId: number;
  source: string;
  targetId: number;
  target: string;
  similarity: number;
  relationshipType: 'strong' | 'medium' | 'weak' | 'none';
  sharedAntibiotics: number[];
  sharedAntibioticNames: string[];
  clinicalRationale: string;
  medicalSource: string;
}

interface RelationshipStatistics {
  total: number;
  strong: number;
  medium: number;
  weak: number;
  averageSimilarity: string | number;
  minSimilarity: string | number;
  maxSimilarity: string | number;
}

/**
 * Calculate Jaccard similarity coefficient between two pathogens
 *
 * Jaccard Coefficient = |Intersection| / |Union|
 *
 * Only considers antibiotics with 'high' or 'medium' effectiveness to focus
 * on clinically relevant antibiotic overlap.
 */
export const calculateJaccardSimilarity = (
  pathogenId1: number | string,
  pathogenId2: number | string,
  effectivenessThreshold: 'high' | 'medium' | 'low' | 'resistant' = 'medium'
): number => {
  const pid1 = Number(pathogenId1);
  const pid2 = Number(pathogenId2);

  if (!pathogenAntibioticMap[pid1] || !pathogenAntibioticMap[pid2]) {
    return 0;
  }

  const antibiotics1 = getEffectiveAntibiotics(pid1, effectivenessThreshold);
  const antibiotics2 = getEffectiveAntibiotics(pid2, effectivenessThreshold);

  const set1 = new Set(antibiotics1);
  const set2 = new Set(antibiotics2);

  const intersection = new Set(
    [...set1].filter(ab => set2.has(ab))
  );
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) {
    return 0;
  }

  return intersection.size / union.size;
};

/**
 * Get effective antibiotics for a pathogen above effectiveness threshold
 */
export const getEffectiveAntibiotics = (
  pathogenId: number | string,
  threshold: 'high' | 'medium' | 'low' | 'resistant' = 'medium'
): number[] => {
  const pid = Number(pathogenId);
  const pathogen = pathogenAntibioticMap[pid];
  if (!pathogen) return [];

  const thresholdLevels: { [key: string]: string[] } = {
    high: ['high'],
    medium: ['high', 'medium'],
    low: ['high', 'medium', 'low'],
    resistant: ['high', 'medium', 'low', 'resistant']
  };

  const acceptableLevels = thresholdLevels[threshold] || thresholdLevels.medium;

  return pathogen.antibiotics
    .filter((ab: Antibiotic) => acceptableLevels.includes(ab.effectiveness))
    .map((ab: Antibiotic) => ab.antibioticId);
};

/**
 * Classify relationship strength based on similarity coefficient
 *
 * Classification thresholds (based on clinical patterns):
 * - Strong (>0.5): Similar antibiotic profiles, likely shared resistance mechanisms
 * - Medium (0.35-0.5): Partial overlap, some shared characteristics
 * - Weak (0.2-0.35): Minimal overlap, different resistance profiles
 * - None (<0.2): Very different antibiotic susceptibility
 */
export const classifyRelationshipType = (
  similarity: number
): 'strong' | 'medium' | 'weak' | 'none' => {
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
 */
export const validateRelationshipMedically = (
  pathogenId1: number | string,
  pathogenId2: number | string,
  similarity: number
): ValidationResult => {
  const pid1 = Number(pathogenId1);
  const pid2 = Number(pathogenId2);

  const pathogen1 = simplePathogens.find((p: SimplePathogen) => p.id === pid1);
  const pathogen2 = simplePathogens.find((p: SimplePathogen) => p.id === pid2);

  if (!pathogen1 || !pathogen2) {
    return { valid: false, reason: 'Pathogen not found' };
  }

  // Rule 1: Gram-positive and Gram-negative shouldn't have very high similarity
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
  const isViralBacterial =
    (pathogen1.gramStain === 'virus') !== (pathogen2.gramStain === 'virus');

  if (isViralBacterial) {
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
 */
export const generatePathogenRelationships = (
  threshold: number = 0.3,
  includeMedical: boolean = true
): PathogenRelationship[] => {
  const relationships: PathogenRelationship[] = [];
  const processed = new Set<string>();

  const pathogenIds = Object.keys(pathogenAntibioticMap).map(Number);

  for (let i = 0; i < pathogenIds.length; i++) {
    for (let j = i + 1; j < pathogenIds.length; j++) {
      const id1 = pathogenIds[i];
      const id2 = pathogenIds[j];
      const pairKey = `${Math.min(id1, id2)}-${Math.max(id1, id2)}`;

      if (processed.has(pairKey)) continue;
      processed.add(pairKey);

      const similarity = calculateJaccardSimilarity(id1, id2);

      if (similarity < threshold) continue;

      if (includeMedical) {
        const validation = validateRelationshipMedically(id1, id2, similarity);
        if (!validation.valid) continue;
      }

      const antibiotics1 = getEffectiveAntibiotics(id1);
      const antibiotics2 = getEffectiveAntibiotics(id2);
      const shared = [...new Set([...antibiotics1].filter(ab => antibiotics2.includes(ab)))];

      const pathogen1 = pathogenAntibioticMap[id1];
      const pathogen2 = pathogenAntibioticMap[id2];

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
            const ab = pathogen1.antibiotics.find((a: Antibiotic) => a.antibioticId === abId);
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
 */
const generateClinicalRationale = (
  pathogenId1: number,
  pathogenId2: number,
  similarity: number
): string => {
  const p1 = simplePathogens.find((p: SimplePathogen) => p.id === pathogenId1);
  const p2 = simplePathogens.find((p: SimplePathogen) => p.id === pathogenId2);

  if (!p1 || !p2) return '';

  const similarityPercent = (similarity * 100).toFixed(0);

  const sameGenus = p1.name.split(' ')[0] === p2.name.split(' ')[0];
  if (sameGenus) {
    return `Both ${p1.name.split(' ')[0]} species with ${similarityPercent}% antibiotic overlap`;
  }

  const sameGram = p1.gramStain === p2.gramStain;
  if (sameGram) {
    return `Both Gram-${p1.gramStain} pathogens with ${similarityPercent}% antibiotic overlap`;
  }

  const sharedSites = p1.commonSites.filter((site: string) => p2.commonSites.includes(site));
  if (sharedSites.length > 0) {
    return `Co-infection partners in ${sharedSites.join(', ')} with ${similarityPercent}% antibiotic overlap`;
  }

  return `Pathogens with ${similarityPercent}% antibiotic susceptibility overlap`;
};

/**
 * Get statistics about relationship generation
 */
export const getRelationshipStatistics = (relationships: PathogenRelationship[]): RelationshipStatistics => {
  const stats: RelationshipStatistics = {
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
