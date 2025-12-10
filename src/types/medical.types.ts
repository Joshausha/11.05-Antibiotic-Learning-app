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

export interface Pathogen {
  id: number;
  name: string;
  gramStain: GramStainType;
  type: PathogenType;
  clinicalRelevance: string;
  commonConditions?: string[];
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

export interface Antibiotic {
  id: number;
  name: string;
  class: AntibioticClass;
  spectrum: SpectrumType;
  coverage: string[];
  commonUses: string[];
  contraindications?: string[];
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

export type QuestionDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correct: number;
  correctAnswer?: number;
  explanation: string;
  category?: string;
  conditionId?: string;
  difficulty?: QuestionDifficulty;
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
