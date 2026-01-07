import { Antibiotic, NorthwesternSpectrum, CoverageLevel } from "../types/medical.types";

/**
 * Significance level for differences - determines visual encoding
 */
export type DifferenceSignificance = 'high' | 'medium' | 'low';

/**
 * Represents a differing property between two antibiotics
 */
export interface DifferentProperty {
  /** Property name (e.g., "mechanism", "class") */
  propertyName: string;

  /** Display label for the property */
  displayLabel: string;

  /** Reference antibiotic's value */
  referenceValue: string;

  /** Comparison antibiotic's value */
  comparisonValue: string;

  /** Significance level for visual encoding */
  significance: DifferenceSignificance;
}

/**
 * Represents a shared property between two antibiotics
 */
export interface SimilarProperty {
  /** Property name (e.g., "class", "mechanism") */
  propertyName: string;

  /** Display label for the property */
  displayLabel: string;

  /** Shared value as formatted string */
  sharedValue: string;
}

/**
 * Find similarities between reference and comparison antibiotics
 *
 * Compares key properties and identifies shared characteristics.
 * Follows "similarities first" learning approach (per Phase 03-CONTEXT).
 *
 * Properties compared:
 * - Antibiotic class
 * - Mechanism of action
 * - Formulations (array intersection)
 * - Gram coverage (Northwestern spectrum positive/negative segments)
 *
 * @param reference - Reference antibiotic
 * @param comparison - Comparison antibiotic
 * @returns Array of shared properties
 *
 * @example
 * const similarities = findSimilarities(ceftriaxone, cefepime);
 * // Returns: [
 * //   { propertyName: "class", displayLabel: "Both are", sharedValue: "Beta-Lactam" },
 * //   { propertyName: "formulation", displayLabel: "Both available as", sharedValue: "IV" }
 * // ]
 */
export function findSimilarities(
  reference: Antibiotic,
  comparison: Antibiotic
): SimilarProperty[] {
  const similarities: SimilarProperty[] = [];

  // Check if same antibiotic class
  if (reference.class === comparison.class) {
    similarities.push({
      propertyName: "class",
      displayLabel: "Both are",
      sharedValue: reference.class
    });
  }

  // Check if same mechanism of action
  if (reference.mechanism === comparison.mechanism) {
    similarities.push({
      propertyName: "mechanism",
      displayLabel: "Same mechanism",
      sharedValue: reference.mechanism
    });
  }

  // Check for shared formulations (array intersection)
  const sharedFormulations = arrayIntersection(
    reference.formulations,
    comparison.formulations
  );
  if (sharedFormulations.length > 0) {
    similarities.push({
      propertyName: "formulations",
      displayLabel: "Both available as",
      sharedValue: sharedFormulations.join(", ")
    });
  }

  // Check for shared gram coverage (Northwestern spectrum)
  const gramCoverage = findSharedGramCoverage(
    reference.northwesternSpectrum,
    comparison.northwesternSpectrum
  );
  if (gramCoverage.length > 0) {
    similarities.push({
      propertyName: "gramCoverage",
      displayLabel: "Both cover",
      sharedValue: gramCoverage.join(" and ")
    });
  }

  return similarities;
}

/**
 * Find array intersection - elements present in both arrays
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Array of shared elements
 */
function arrayIntersection<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(item => arr2.includes(item));
}

/**
 * Find shared gram coverage between two Northwestern spectrums
 *
 * Analyzes 8-segment coverage to identify shared positive/negative coverage.
 * Only reports coverage >= 1 (moderate or good).
 *
 * @param spectrum1 - Reference antibiotic spectrum
 * @param spectrum2 - Comparison antibiotic spectrum
 * @returns Array of shared coverage descriptions
 */
function findSharedGramCoverage(
  spectrum1: NorthwesternSpectrum,
  spectrum2: NorthwesternSpectrum
): string[] {
  const sharedCoverage: string[] = [];

  // Check gram-positive coverage (MRSA, MSSA, enterococcus)
  const gramPositiveSegments = [
    'MRSA',
    'MSSA',
    'VRE_faecium',
    'enterococcus_faecalis'
  ] as const;

  const hasSharedGramPositive = gramPositiveSegments.some(segment => {
    const key = segment as keyof NorthwesternSpectrum;
    return spectrum1[key] >= 1 && spectrum2[key] >= 1;
  });

  if (hasSharedGramPositive) {
    sharedCoverage.push("gram-positive bacteria");
  }

  // Check gram-negative coverage
  const hasSharedGramNegative =
    spectrum1.gramNegative >= 1 && spectrum2.gramNegative >= 1;

  if (hasSharedGramNegative) {
    sharedCoverage.push("gram-negative bacteria");
  }

  // Check pseudomonas coverage (important subset)
  const hasSharedPseudomonas =
    spectrum1.pseudomonas >= 1 && spectrum2.pseudomonas >= 1;

  if (hasSharedPseudomonas) {
    sharedCoverage.push("Pseudomonas");
  }

  // Check anaerobic coverage
  const hasSharedAnaerobes =
    spectrum1.anaerobes >= 1 && spectrum2.anaerobes >= 1;

  if (hasSharedAnaerobes) {
    sharedCoverage.push("anaerobes");
  }

  // Check atypical coverage
  const hasSharedAtypicals =
    spectrum1.atypicals >= 1 && spectrum2.atypicals >= 1;

  if (hasSharedAtypicals) {
    sharedCoverage.push("atypical bacteria");
  }

  return sharedCoverage;
}

/**
 * Find differences between reference and comparison antibiotics
 *
 * Compares key properties and identifies differing characteristics.
 * Significance levels determine visual encoding (red/orange/gray).
 *
 * Significance rules:
 * - HIGH: Mechanism differences (most clinically important)
 * - MEDIUM: Class/formulation differences (affects prescribing)
 * - LOW: Route/minor differences (least critical)
 *
 * @param reference - Reference antibiotic
 * @param comparison - Comparison antibiotic
 * @returns Array of differing properties with significance
 *
 * @example
 * const differences = findDifferences(vancomycin, ceftriaxone);
 * // Returns: [
 * //   { propertyName: "mechanism", displayLabel: "Different mechanism", ... , significance: "high" },
 * //   { propertyName: "class", displayLabel: "Different class", ... , significance: "medium" }
 * // ]
 */
export function findDifferences(
  reference: Antibiotic,
  comparison: Antibiotic
): DifferentProperty[] {
  const differences: DifferentProperty[] = [];

  // Check mechanism of action - HIGH significance
  if (reference.mechanism !== comparison.mechanism) {
    differences.push({
      propertyName: "mechanism",
      displayLabel: "Different mechanism",
      referenceValue: reference.mechanism,
      comparisonValue: comparison.mechanism,
      significance: "high"
    });
  }

  // Check antibiotic class - MEDIUM significance
  if (reference.class !== comparison.class) {
    differences.push({
      propertyName: "class",
      displayLabel: "Different class",
      referenceValue: reference.class,
      comparisonValue: comparison.class,
      significance: "medium"
    });
  }

  // Check formulations - MEDIUM significance
  const refFormulations = reference.formulations.sort().join(", ");
  const compFormulations = comparison.formulations.sort().join(", ");
  if (refFormulations !== compFormulations) {
    // Find additional formulations in comparison
    const additionalForms = comparison.formulations.filter(
      f => !reference.formulations.includes(f)
    );
    const missingForms = reference.formulations.filter(
      f => !comparison.formulations.includes(f)
    );

    let displayValue = "";
    if (additionalForms.length > 0 && missingForms.length > 0) {
      displayValue = `+${additionalForms.join(", ")}; -${missingForms.join(", ")}`;
    } else if (additionalForms.length > 0) {
      displayValue = `Also available as: ${additionalForms.join(", ")}`;
    } else if (missingForms.length > 0) {
      displayValue = `Not available as: ${missingForms.join(", ")}`;
    }

    differences.push({
      propertyName: "formulations",
      displayLabel: "Different formulations",
      referenceValue: refFormulations,
      comparisonValue: displayValue || compFormulations,
      significance: "medium"
    });
  }

  // Check category - LOW significance
  if (reference.category !== comparison.category) {
    differences.push({
      propertyName: "category",
      displayLabel: "Different category",
      referenceValue: reference.category,
      comparisonValue: comparison.category,
      significance: "low"
    });
  }

  // Check Northwestern coverage differences - MEDIUM significance
  const coverageDiff = findCoverageDifferences(
    reference.northwesternSpectrum,
    comparison.northwesternSpectrum
  );
  if (coverageDiff) {
    differences.push({
      propertyName: "coverage",
      displayLabel: "Different coverage",
      referenceValue: coverageDiff.referenceDescription,
      comparisonValue: coverageDiff.comparisonDescription,
      significance: "medium"
    });
  }

  return differences;
}

/**
 * Find significant coverage differences between two Northwestern spectrums
 */
function findCoverageDifferences(
  spectrum1: NorthwesternSpectrum,
  spectrum2: NorthwesternSpectrum
): { referenceDescription: string; comparisonDescription: string } | null {
  const segments = [
    'MRSA', 'MSSA', 'VRE_faecium', 'enterococcus_faecalis',
    'gramNegative', 'pseudomonas', 'anaerobes', 'atypicals'
  ] as const;

  const spec1Better: string[] = [];
  const spec2Better: string[] = [];

  for (const segment of segments) {
    const key = segment as keyof NorthwesternSpectrum;
    const val1 = spectrum1[key] as CoverageLevel;
    const val2 = spectrum2[key] as CoverageLevel;

    if (val1 > val2 && val1 >= 1) {
      spec1Better.push(formatSegmentName(segment));
    } else if (val2 > val1 && val2 >= 1) {
      spec2Better.push(formatSegmentName(segment));
    }
  }

  if (spec1Better.length === 0 && spec2Better.length === 0) {
    return null;
  }

  return {
    referenceDescription: spec1Better.length > 0
      ? `Better: ${spec1Better.join(", ")}`
      : "No unique coverage",
    comparisonDescription: spec2Better.length > 0
      ? `Better: ${spec2Better.join(", ")}`
      : "No unique coverage"
  };
}

/**
 * Format segment name for display
 */
function formatSegmentName(segment: string): string {
  const nameMap: Record<string, string> = {
    MRSA: "MRSA",
    MSSA: "MSSA",
    VRE_faecium: "VRE",
    enterococcus_faecalis: "E. faecalis",
    gramNegative: "gram-negative",
    pseudomonas: "Pseudomonas",
    anaerobes: "anaerobes",
    atypicals: "atypicals"
  };
  return nameMap[segment] || segment;
}

// ============================================
// COMPREHENSIVE COMPARISON UTILITIES
// ============================================

/**
 * Result of comparing two antibiotics
 */
export interface ComparisonResult {
  /** Properties that are the same */
  similarities: SimilarProperty[];

  /** Properties that are different */
  differences: DifferentProperty[];

  /** Count of shared properties (higher = more similar) */
  sharedPropertiesCount: number;

  /** Overall similarity score (0-100) */
  similarityScore: number;
}

/**
 * Coverage pattern analysis result
 */
export type CoveragePatternType =
  | 'identical'
  | 'similar-gram-positive'
  | 'similar-gram-negative'
  | 'complementary'
  | 'distinct';

/**
 * Compare all properties between two antibiotics
 *
 * Returns comprehensive comparison including similarities, differences,
 * shared property count, and similarity score.
 *
 * @param antibiotic1 - First antibiotic
 * @param antibiotic2 - Second antibiotic
 * @returns Complete comparison result
 *
 * @example
 * const result = compareAllProperties(ceftriaxone, cefepime);
 * console.log(result.similarityScore); // 75
 */
export function compareAllProperties(
  antibiotic1: Antibiotic,
  antibiotic2: Antibiotic
): ComparisonResult {
  const similarities = findSimilarities(antibiotic1, antibiotic2);
  const differences = findDifferences(antibiotic1, antibiotic2);
  const similarityScore = calculateSimilarityScore(antibiotic1, antibiotic2);

  return {
    similarities,
    differences,
    sharedPropertiesCount: similarities.length,
    similarityScore
  };
}

/**
 * Calculate similarity score between two antibiotics (0-100)
 *
 * Scoring:
 * - Same mechanism: 40 points (most important)
 * - Same class: 30 points
 * - Formulation overlap: up to 20 points (proportional to overlap)
 * - Same route (first formulation): 10 points
 *
 * @param antibiotic1 - First antibiotic
 * @param antibiotic2 - Second antibiotic
 * @returns Score from 0-100
 *
 * @example
 * const score = calculateSimilarityScore(ceftriaxone, cefepime);
 * // Returns ~70 (same class, similar formulations, different mechanism)
 */
export function calculateSimilarityScore(
  antibiotic1: Antibiotic,
  antibiotic2: Antibiotic
): number {
  let score = 0;

  // Mechanism: 40 points
  if (antibiotic1.mechanism === antibiotic2.mechanism) {
    score += 40;
  }

  // Class: 30 points
  if (antibiotic1.class === antibiotic2.class) {
    score += 30;
  }

  // Formulation overlap: up to 20 points
  const sharedFormulations = arrayIntersectionPublic(
    antibiotic1.formulations,
    antibiotic2.formulations
  );
  const totalFormulations = new Set([
    ...antibiotic1.formulations,
    ...antibiotic2.formulations
  ]).size;
  if (totalFormulations > 0) {
    score += Math.round((sharedFormulations.length / totalFormulations) * 20);
  }

  // Route (first formulation): 10 points
  if (antibiotic1.formulations[0] === antibiotic2.formulations[0]) {
    score += 10;
  }

  return Math.min(100, score);
}

/**
 * Compare Northwestern coverage patterns between two antibiotics
 *
 * Analyzes segment-by-segment differences and categorizes the relationship.
 *
 * @param spectrum1 - First antibiotic's Northwestern spectrum
 * @param spectrum2 - Second antibiotic's Northwestern spectrum
 * @returns Segment-level comparison with coverage differences
 */
export function compareNorthwesternCoverage(
  spectrum1: NorthwesternSpectrum,
  spectrum2: NorthwesternSpectrum
): {
  segmentComparisons: Array<{
    segment: string;
    displayName: string;
    level1: CoverageLevel;
    level2: CoverageLevel;
    difference: number;
  }>;
  identicalSegments: number;
  totalSegments: number;
} {
  const segments = [
    { key: 'MRSA', name: 'MRSA' },
    { key: 'MSSA', name: 'MSSA' },
    { key: 'VRE_faecium', name: 'VRE' },
    { key: 'enterococcus_faecalis', name: 'E. faecalis' },
    { key: 'gramNegative', name: 'Gram-negative' },
    { key: 'pseudomonas', name: 'Pseudomonas' },
    { key: 'anaerobes', name: 'Anaerobes' },
    { key: 'atypicals', name: 'Atypicals' }
  ] as const;

  const segmentComparisons = segments.map(({ key, name }) => {
    const k = key as keyof NorthwesternSpectrum;
    const level1 = spectrum1[k] as CoverageLevel;
    const level2 = spectrum2[k] as CoverageLevel;
    return {
      segment: key,
      displayName: name,
      level1,
      level2,
      difference: level1 - level2
    };
  });

  const identicalSegments = segmentComparisons.filter(
    (s) => s.difference === 0
  ).length;

  return {
    segmentComparisons,
    identicalSegments,
    totalSegments: segments.length
  };
}

/**
 * Analyze coverage pattern relationship between two antibiotics
 *
 * Determines how the coverage patterns relate:
 * - identical: Same coverage across all segments
 * - similar-gram-positive: Both strong gram-positive, differ in gram-negative
 * - similar-gram-negative: Both strong gram-negative, differ in gram-positive
 * - complementary: Cover different organisms (useful combinations)
 * - distinct: Very different coverage patterns
 *
 * @param antibiotic1 - First antibiotic
 * @param antibiotic2 - Second antibiotic
 * @returns Coverage pattern type
 */
export function compareCoveragePattern(
  antibiotic1: Antibiotic,
  antibiotic2: Antibiotic
): CoveragePatternType {
  const spec1 = antibiotic1.northwesternSpectrum;
  const spec2 = antibiotic2.northwesternSpectrum;

  const comparison = compareNorthwesternCoverage(spec1, spec2);

  // Identical: all 8 segments match
  if (comparison.identicalSegments === comparison.totalSegments) {
    return 'identical';
  }

  // Check gram-positive focus (MRSA, MSSA, VRE, E. faecalis)
  const gp1 = spec1.MRSA + spec1.MSSA + spec1.VRE_faecium + spec1.enterococcus_faecalis;
  const gp2 = spec2.MRSA + spec2.MSSA + spec2.VRE_faecium + spec2.enterococcus_faecalis;

  // Check gram-negative focus
  const gn1 = spec1.gramNegative + spec1.pseudomonas;
  const gn2 = spec2.gramNegative + spec2.pseudomonas;

  // Both strong gram-positive (>= 4 points combined)
  if (gp1 >= 4 && gp2 >= 4 && gn1 <= 2 && gn2 <= 2) {
    return 'similar-gram-positive';
  }

  // Both strong gram-negative
  if (gn1 >= 3 && gn2 >= 3 && gp1 <= 2 && gp2 <= 2) {
    return 'similar-gram-negative';
  }

  // Complementary: one strong GP, other strong GN
  if ((gp1 >= 4 && gn2 >= 3) || (gp2 >= 4 && gn1 >= 3)) {
    return 'complementary';
  }

  // Default: distinct
  return 'distinct';
}

/**
 * Check if two arrays are equal (same elements in same order)
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns True if arrays are equal
 */
export function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
}

/**
 * Find intersection of two arrays (public version)
 *
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Array of shared elements
 */
export function arrayIntersectionPublic<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(item => arr2.includes(item));
}
