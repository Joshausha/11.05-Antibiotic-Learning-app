import { Antibiotic, NorthwesternSpectrum } from "../types/medical.types";

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
