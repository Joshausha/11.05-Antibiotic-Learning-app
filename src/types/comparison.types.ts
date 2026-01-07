/**
 * Comparison Interface Type Definitions
 * Supports side-by-side, reference, and grid comparison modes for antibiotics
 */

// ==========================================
// COMPARISON MODE TYPES
// ==========================================

/**
 * Comparison display mode
 * - pair: Side-by-side comparison of exactly 2 antibiotics
 * - reference: Compare multiple antibiotics against one reference antibiotic
 * - grid: Compare multiple antibiotics in a grid layout
 */
export type ComparisonMode = 'pair' | 'reference' | 'grid';

// ==========================================
// COMPARISON STATE
// ==========================================

/**
 * Comparison State Management
 *
 * Centralized state for all comparison modes. Follows Phase 02-02 pattern:
 * single object for related state prevents state combination bugs.
 *
 * Reference mode is PRIMARY - optimize for this workflow (per Phase 03-CONTEXT).
 *
 * @example
 * // Reference comparison (primary mode)
 * const state: ComparisonState = {
 *   selectedAntibiotics: ["Ceftriaxone", "Cefepime", "Cefotaxime"],
 *   referenceAntibiotic: "Ceftriaxone",
 *   comparisonMode: "reference"
 * }
 *
 * @example
 * // Pair comparison
 * const state: ComparisonState = {
 *   selectedAntibiotics: ["Vancomycin", "Linezolid"],
 *   referenceAntibiotic: null,
 *   comparisonMode: "pair"
 * }
 *
 * @example
 * // Grid comparison
 * const state: ComparisonState = {
 *   selectedAntibiotics: ["Vancomycin", "Linezolid", "Daptomycin", "Tigecycline"],
 *   referenceAntibiotic: null,
 *   comparisonMode: "grid"
 * }
 */
export interface ComparisonState {
  /** Array of antibiotic names selected for comparison (max 5 per plan spec) */
  selectedAntibiotics: string[];

  /**
   * Reference antibiotic name for reference comparison mode
   * null for pair and grid modes
   */
  referenceAntibiotic: string | null;

  /** Active comparison display mode */
  comparisonMode: ComparisonMode;
}

// ==========================================
// ANTIBIOTIC DETAILS FOR COMPARISON
// ==========================================

/**
 * Selected Antibiotic Details
 *
 * Subset of Antibiotic interface with key properties for comparison UI.
 * Optimized for display in comparison components.
 *
 * @example
 * const details: SelectedAntibioticDetails = {
 *   id: 1,
 *   name: "Ceftriaxone",
 *   class: "Beta-Lactam",
 *   mechanism: "Inhibits bacterial cell wall synthesis by binding to PBPs",
 *   formulation: ["IV", "IM"],
 *   coverageSpectrum: {
 *     MRSA: 0,
 *     MSSA: 2,
 *     gramNegative: 2,
 *     pseudomonas: 0,
 *     anaerobes: 1,
 *     atypicals: 0,
 *     VRE_faecium: 0,
 *     enterococcus_faecalis: 0
 *   }
 * }
 */
export interface SelectedAntibioticDetails {
  /** Unique antibiotic identifier */
  id: number;

  /** Antibiotic name (e.g., "Vancomycin", "Ceftriaxone") */
  name: string;

  /** Antibiotic class (e.g., "Glycopeptide", "Beta-Lactam") */
  class: string;

  /** Mechanism of action - how the antibiotic works */
  mechanism: string;

  /** Available formulations (e.g., ["oral"], ["IV", "IM"]) */
  formulation: string[];

  /** Northwestern 8-segment coverage spectrum (0=none, 1=moderate, 2=good) */
  coverageSpectrum: {
    MRSA: 0 | 1 | 2;
    MSSA: 0 | 1 | 2;
    VRE_faecium: 0 | 1 | 2;
    enterococcus_faecalis: 0 | 1 | 2;
    gramNegative: 0 | 1 | 2;
    pseudomonas: 0 | 1 | 2;
    anaerobes: 0 | 1 | 2;
    atypicals: 0 | 1 | 2;
  };
}

// ==========================================
// COMPARISON DIFF HIGHLIGHTING
// ==========================================

/**
 * Comparison Property Difference
 *
 * Represents a single property comparison across multiple antibiotics
 * with difference detection for visual highlighting.
 *
 * @example
 * // Property with differences (highlight in UI)
 * const diff: ComparisonDiff = {
 *   propertyName: "class",
 *   values: ["Beta-Lactam", "Glycopeptide", "Beta-Lactam"],
 *   isDifferent: true
 * }
 *
 * @example
 * // Property with all same values (no highlight)
 * const diff: ComparisonDiff = {
 *   propertyName: "formulation",
 *   values: [["IV"], ["IV"], ["IV"]],
 *   isDifferent: false
 * }
 */
export interface ComparisonDiff {
  /** Property name being compared (e.g., "class", "mechanism", "formulation") */
  propertyName: string;

  /**
   * Array of property values for each selected antibiotic
   * Order matches selectedAntibiotics array in ComparisonState
   * Can be any type (string, string[], number, object)
   */
  values: any[];

  /**
   * Whether values differ across antibiotics
   * true = highlight differences in UI
   * false = all values are the same
   */
  isDifferent: boolean;
}
