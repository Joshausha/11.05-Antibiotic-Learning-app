/**
 * Medical Domain Type Definitions
 * Covers all data structures for infectious disease and antibiotic information
 */

// ==========================================
// PATHOGEN TYPES
// ==========================================

export type GramStainType = 'positive' | 'negative' | 'variable' | 'not_applicable';

export type PathogenType =
  | 'bacteria'
  | 'virus'
  | 'fungus'
  | 'parasite'
  | 'other';

/**
 * Pathogen Entity
 *
 * Represents a disease-causing microorganism with complete medical metadata.
 * Enhanced to support Northwestern 8-segment mapping and clinical decision support.
 *
 * @example
 * const mrsa: Pathogen = {
 *   id: 1,
 *   name: "Methicillin-resistant Staphylococcus aureus",
 *   gramStain: "positive",
 *   type: "bacteria",
 *   clinicalRelevance: "Major cause of skin/soft tissue infections and bacteremia",
 *   commonConditions: ["Cellulitis", "Endocarditis", "Pneumonia"],
 *   northwestern8SegmentCategory: "MRSA",
 *   commonAntibiotics: ["Vancomycin", "Linezolid", "Daptomycin"]
 * }
 */
export interface Pathogen {
  id: number;
  name: string;
  gramStain: GramStainType;
  type: PathogenType;
  clinicalRelevance: string;
  commonConditions?: string[];

  /**
   * Northwestern 8-segment category this pathogen belongs to
   * Maps to keys in NorthwesternSpectrum interface
   */
  northwestern8SegmentCategory?: keyof NorthwesternSpectrum;

  /** Common antibiotics used to treat this pathogen */
  commonAntibiotics?: string[];

  /** Detailed relationship data (conditions, strength of association) */
  relationshipData?: PathogenRelationship;

  [key: string]: any;
}

export interface PathogenClassification {
  gramPositive: string[];
  gramNegative: string[];
  atypical: string[];
  fungal: string[];
  [key: string]: any;
}

export interface PathogenRelationship {
  pathogenId: number;
  pathogenName: string;
  conditionId: string;
  conditionName: string;
  strength: 'primary' | 'secondary' | 'rare';
  [key: string]: any;
}

// ==========================================
// ANTIBIOTIC TYPES
// ==========================================

export type AntibioticClass =
  | 'Beta-Lactam'
  | 'Fluoroquinolone'
  | 'Glycopeptide'
  | 'Macrolide'
  | 'Aminoglycoside'
  | 'Other';

export type SpectrumType = 'narrow' | 'broad' | 'very-broad';

export type DrugStrength = 'first-line' | 'alternative' | 'avoid';

/**
 * Northwestern 8-Segment Coverage Model
 *
 * Coverage levels for 8 critical pathogen categories:
 * - MRSA: Methicillin-resistant Staphylococcus aureus
 * - VRE_faecium: Vancomycin-resistant Enterococcus faecium
 * - anaerobes: Bacteroides, C. difficile, mixed anaerobes
 * - atypicals: Legionella, Mycoplasma, Chlamydophila
 * - pseudomonas: Pseudomonas aeruginosa
 * - gramNegative: Gram-negative organisms
 * - MSSA: Methicillin-sensitive Staphylococcus aureus
 * - enterococcus_faecalis: Enterococcus faecalis
 *
 * @example
 * // Vancomycin coverage:
 * const vanco: NorthwesternSpectrum = {
 *   MRSA: 2,              // Excellent coverage
 *   MSSA: 2,              // Excellent coverage
 *   VRE_faecium: 0,       // No coverage (resistance)
 *   enterococcus_faecalis: 2, // Good coverage
 *   gramNegative: 0,      // No gram-negative coverage
 *   pseudomonas: 0,       // No pseudomonal coverage
 *   anaerobes: 1,         // Some anaerobic coverage (C. diff)
 *   atypicals: 0          // No atypical coverage
 * }
 */
export type CoverageLevel = 0 | 1 | 2; // 0=none, 1=poor/moderate, 2=good
export type Coverage = CoverageLevel; // Alias for backwards compatibility

export interface NorthwesternSpectrum {
  MRSA: CoverageLevel;
  VRE_faecium: CoverageLevel;
  anaerobes: CoverageLevel;
  atypicals: CoverageLevel;
  pseudomonas: CoverageLevel;
  gramNegative: CoverageLevel;
  MSSA: CoverageLevel;
  enterococcus_faecalis: CoverageLevel;
  [key: string]: CoverageLevel; // Allow string key access for dynamic segment lookups
}

/**
 * Comprehensive Antibiotic Interface
 *
 * Represents a single antibiotic medication with complete medical metadata.
 * Supports visual exploration, comparison modes, and clinical decision support.
 *
 * @example
 * const ceftriaxone: Antibiotic = {
 *   id: 1,
 *   name: "Ceftriaxone",
 *   category: "Cephalosporins",
 *   class: "Beta-Lactam",
 *   mechanism: "Inhibits bacterial cell wall synthesis by binding to PBPs",
 *   description: "Third-generation cephalosporin with broad gram-negative coverage",
 *   northwesternSpectrum: { MRSA: 0, MSSA: 2, gramNegative: 2, ... },
 *   formulations: ["IV", "IM"],
 *   commonUses: ["Meningitis", "Pneumonia", "Sepsis"],
 *   adverseEffects: ["Diarrhea", "Rash", "Cholestatic jaundice"],
 *   contraindications: ["Neonates with hyperbilirubinemia"]
 * }
 */
export interface Antibiotic {
  id: number;
  name: string;
  category: string;
  class: AntibioticClass;

  /** Mechanism of action - how the antibiotic works */
  mechanism: string;

  /** Clinical description and key characteristics */
  description: string;

  /** Northwestern 8-segment coverage model - CRITICAL for visual exploration */
  northwesternSpectrum: NorthwesternSpectrum;

  /** Available formulations (e.g., "oral", "IV", "topical", "IM") */
  formulations: string[];

  /** Common clinical uses and indications */
  commonUses: string[];

  /** Common adverse effects and side effects */
  adverseEffects?: string[];

  /** CRITICAL: Contraindications and precautions for patient safety */
  contraindications?: string[];

  /** Legacy spectrum field - kept for backward compatibility */
  spectrum?: SpectrumType;

  /** Legacy coverage field - kept for backward compatibility */
  coverage?: string[];

  [key: string]: any;
}

export interface AntibioticRecommendation {
  pathogenId?: number;
  pathogenName?: string;
  antibioticId?: number;
  antibioticName: string;
  strength: DrugStrength;
  dosing?: string;
  duration?: string;
  notes?: string;
  [key: string]: any;
}

// ==========================================
// CLINICAL CONDITION TYPES
// ==========================================

export type SeverityLevel = 'mild' | 'moderate' | 'severe' | 'critical';

export type AgeGroup = 'neonate' | 'infant' | 'child' | 'adolescent' | 'adult';

export interface MedicalCondition {
  id: string;
  name: string;
  category: string;
  description: string;
  commonPathogens: string[];
  empiricTherapy: Record<string, string>;
  duration: string;
  keyPoints?: string[];
  clinicalPearls?: string[];
  ageGroup?: AgeGroup;
  severity?: SeverityLevel;
  [key: string]: any;
}

export interface ClinicalGuideline {
  conditionId: string;
  conditionName: string;
  recommendations: AntibioticRecommendation[];
  evidenceLevel: 'A' | 'B' | 'C';
  source: string;
  lastUpdated: string;
  [key: string]: any;
}

// ==========================================
// QUIZ TYPES
// ==========================================

export type QuestionType = 'multiple-choice' | 'true-false' | 'matching' | 'fill-blank';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Legacy difficulty type for backward compatibility
export type QuestionDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'easy' | 'medium' | 'hard';

/**
 * Quiz Question Entity
 *
 * Represents a single quiz question with complete metadata for spaced repetition
 * and multi-modal learning (visual, comparison, and quiz modes).
 *
 * @example
 * const question: QuizQuestion = {
 *   id: "mrsa-coverage-001",
 *   question: "Which antibiotic provides excellent coverage for MRSA?",
 *   type: "multiple-choice",
 *   difficulty: "beginner",
 *   options: ["Ceftriaxone", "Vancomycin", "Azithromycin", "Ciprofloxacin"],
 *   correctAnswer: "Vancomycin",
 *   explanation: "Vancomycin is a glycopeptide with excellent MRSA coverage...",
 *   tags: ["gram-positive", "MRSA", "glycopeptide"],
 *   relatedAntibiotics: ["Vancomycin", "Linezolid"],
 *   medicalAccuracyVerified: true,
 *   lastUpdated: "2026-01-06"
 * }
 */
export interface QuizQuestion {
  id: string | number;
  question: string;

  /** Type of question (multiple-choice, true-false, matching, fill-blank) */
  type: QuestionType;

  /** Difficulty level for adaptive learning */
  difficulty: DifficultyLevel;

  /** Correct answer (string for text, string[] for multiple answers) */
  correctAnswer: string | string[];

  /** Options for multiple choice questions */
  options?: string[];

  /** Detailed explanation of the correct answer with medical reasoning */
  explanation: string;

  /** Tags for organization and filtering (e.g., ['gram-positive', 'MRSA']) */
  tags: string[];

  /** Related antibiotic names for cross-referencing */
  relatedAntibiotics?: string[];

  /** Related pathogen names for cross-referencing */
  relatedPathogens?: string[];

  /**
   * CRITICAL: Medical accuracy verification flag
   * Must be true for all clinical content before deployment
   */
  medicalAccuracyVerified: boolean;

  /** ISO date string of last content update (YYYY-MM-DD) */
  lastUpdated: string;

  // Legacy fields for backward compatibility
  /** @deprecated Use correctAnswer instead */
  correct?: number;

  /** @deprecated Use difficulty (DifficultyLevel) instead */
  category?: string;

  /** @deprecated Use tags array instead */
  conditionId?: string;

  [key: string]: any;
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface QuizSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  answers: QuizAnswer[];
  score?: number;
  totalQuestions: number;
}

/**
 * User Learning Progress Tracking
 *
 * Tracks individual question performance for spaced repetition algorithms.
 * Supports ts-fsrs or similar spaced repetition systems.
 */
export interface UserProgress {
  questionId: string;
  timesCorrect: number;
  timesIncorrect: number;
  lastAttempted: number; // Unix timestamp
  nextReviewDate: number; // Unix timestamp
  easeFactor?: number; // For spaced repetition (e.g., SuperMemo SM-2)
  interval?: number; // Days until next review
  repetitions?: number; // Number of successful reviews
}

/**
 * Performance Metrics
 *
 * Analytics for tracking learning progress across topics and difficulty levels.
 */
export interface PerformanceMetrics {
  userId?: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageAccuracy: number; // Percentage (0-100)
  byDifficulty: Record<DifficultyLevel, { correct: number; total: number }>;
  byTags: Record<string, { correct: number; total: number }>;
  lastUpdated: number; // Unix timestamp
}

/**
 * Comparison Mode Types
 *
 * Supports side-by-side comparison of antibiotics or pathogens
 * for visual learning and decision support.
 */
export type ComparisonItem = Antibiotic | Pathogen;

export interface ComparisonProperty {
  propertyName: string;
  displayName: string;
  item1Value: any;
  item2Value: any;
  isDifferent: boolean;
}

export interface DiffHighlight {
  propertyName: string;
  highlightLevel: 'critical' | 'important' | 'minor';
  reason: string;
}

// ==========================================
// COVERAGE & MAPPING TYPES
// ==========================================

export interface CoverageMap {
  pathogenId: number;
  pathogenName: string;
  antibioticId: number;
  antibioticName: string;
  coverageType: 'excellent' | 'good' | 'moderate' | 'poor' | 'none';
  notes?: string;
}

export interface DurationMapping {
  conditionId: string;
  conditionName: string;
  duration: string;
  unit: 'days' | 'weeks';
  numericValue: number;
  notes?: string;
  [key: string]: any;
}

export interface InteractionData {
  antibiotic1: string;
  antibiotic2: string;
  interactionType: 'synergy' | 'antagonism' | 'neutral';
  severity: 'mild' | 'moderate' | 'severe';
  evidence: string;
  [key: string]: any;
}

// ==========================================
// RBO (Recommended Biofilm Outcome) TYPES
// ==========================================

export interface RBOMapping {
  pathogenId: number;
  conditionId: string;
  recommendedAntibiotics: string[];
  alternativeAntibiotics?: string[];
  avoidAntibiotics?: string[];
  [key: string]: any;
}

// ==========================================
// COMPOSITE TYPES
// ==========================================

export interface PathogenDataCollection {
  pathogens: Pathogen[];
  classifications: PathogenClassification;
  relationships: PathogenRelationship[];
  recommendations: AntibioticRecommendation[];
  [key: string]: any;
}

export interface AntibioticDataCollection {
  antibiotics: Antibiotic[];
  recommendations: AntibioticRecommendation[];
  interactions: InteractionData[];
  coverageMaps: CoverageMap[];
  [key: string]: any;
}
