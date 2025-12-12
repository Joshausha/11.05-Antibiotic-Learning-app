/**
 * Clinical Decision Tree Type Definitions
 * Comprehensive type system for clinical decision support components
 */

import type { Pathogen, Antibiotic, AntibioticRecommendation } from './medical.types';

// ==========================================
// NODE TYPES & TREE STRUCTURES
// ==========================================

export type NodeType = 'root' | 'decision' | 'input' | 'outcome' | 'evidence' | 'warning';

export interface TreeNode {
  id: string;
  type: NodeType;
  label: string;
  children?: TreeNode[];
  data?: Record<string, unknown>;
}

export interface TreeBranch {
  condition: {
    field: string;
    operator: string;
    value?: unknown;
    operator2?: string;
    value2?: unknown;
  };
  label: string;
  next: string;
  rationale: string;
}

export interface DecisionNode {
  id: string;
  type: NodeType;
  title: string;
  description?: string;
  question?: string;
  medicalContext?: string;
  branches?: TreeBranch[];
  next?: string;
}

// ==========================================
// CLINICAL INPUT TYPES
// ==========================================

export type AgeGroupType = 'neonate' | 'infant' | 'child' | 'adolescent' | 'adult';

export type SeverityType = 'mild' | 'moderate' | 'severe' | 'critical';

export type EducationLevel = 'student' | 'resident' | 'attending';

export interface ClinicalInputData {
  age?: number;
  ageGroup?: AgeGroupType;
  weight?: number;
  gender?: 'male' | 'female' | 'other';
  allergies?: string[];
  severity?: SeverityType;
  condition?: string;
  recentAntibiotics?: string[];
  comorbidities?: string[];
  localResistance?: string;
  additionalNotes?: string;
  presentation?: string;
  bacterial_likely?: boolean;
  aom_confirmed?: boolean;
  outpatient_suitable?: boolean;
  observation_appropriate?: boolean;
  [key: string]: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

// ==========================================
// COMPONENT PROPS
// ==========================================

export interface ClinicalInputPanelProps {
  initialData?: Partial<ClinicalInputData>;
  onInputChange?: (input: ClinicalInputData) => void;
  onInputComplete?: (input: ClinicalInputData) => void;
  educationLevel?: EducationLevel;
  emergencyMode?: boolean;
  condition?: string;
  className?: string;
  autoFocus?: boolean;
  showValidationErrors?: boolean;
}

export interface DecisionPathwayRendererProps {
  treeData?: TreeNode | null;
  currentNode?: string;
  completedNodes?: string[];
  availableNodes?: string[];
  onNodeClick?: (nodeId: string) => void;
  onNodeHover?: (nodeId: string | null) => void;
  width?: number;
  height?: number;
  className?: string;
  emergencyMode?: boolean;
  accessibilityMode?: boolean;
}

export interface ClinicalDecisionEngineProps {
  inputData: ClinicalInputData;
  condition?: string;
  selectedPathogen?: Pathogen | null;
  antibioticData?: Antibiotic[];
  onRecommendation?: (rec: AntibioticRecommendation[]) => void;
}

export interface GuidelineComparisonPanelProps {
  condition?: string;
  recommendations?: AntibioticRecommendation[];
  educationLevel?: EducationLevel;
  showEvidence?: boolean;
  className?: string;
}

export interface ClinicalDecisionTreeProps {
  condition?: string;
  patientAge?: number | null;
  emergencyMode?: boolean;
  onRecommendationComplete?: (rec: AntibioticRecommendation | AntibioticRecommendation[] | null) => void;
  onDecisionPathChange?: (nodeId: string) => void;
  className?: string;
  antibioticData?: Antibiotic[];
  pathogenData?: Pathogen[];
  selectedPathogen?: Pathogen | null;
}

// ==========================================
// DECISION ENGINE TYPES
// ==========================================

export interface ScoringConstants {
  EVIDENCE_WEIGHTS: Record<string, number>;
  AGE_FACTORS: Record<AgeGroupType, { safety_multiplier: number; dosing_complexity: string }>;
  SEVERITY_ADJUSTMENTS: Record<SeverityType, { iv_preference: number; broad_spectrum: number; urgent_timing: number }>;
  ROUTE_PREFERENCES: Record<string, Record<string, number>>;
  CONFIDENCE_THRESHOLDS: Record<string, number>;
}

export interface DosingReference {
  mgPerKg?: number;
  frequency?: string;
  maxDose?: number;
  duration?: string;
  [key: string]: unknown;
}

export interface RecommendationWithRationale extends AntibioticRecommendation {
  confidence: number;
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  rationale?: string;
  contraindications?: string[];
  monitoringParameters?: string[];
}

// ==========================================
// GUIDELINE TYPES
// ==========================================

export interface EvidenceLevel {
  level: 'A' | 'B' | 'C' | 'D';
  label: string;
  description: string;
  color: string;
  priority: number;
}

export interface GuidelineOrganization {
  name: string;
  abbreviation: string;
  color: string;
  specialty: string;
}

export interface GuidelineComparison {
  condition: string;
  organizations: Record<string, GuidelineOrganization>;
  recommendations: Record<string, AntibioticRecommendation[]>;
  conflicts: string[];
  evidenceLevels: Record<string, EvidenceLevel>;
}

// ==========================================
// STATE MANAGEMENT TYPES
// ==========================================

export interface DecisionState {
  currentNode: string;
  clinicalInputs: ClinicalInputData;
  completedNodes: string[];
  availableNodes: string[];
  recommendations: RecommendationWithRationale[];
  decisionHistory: Array<{
    nodeId: string;
    timestamp: number;
    inputsSnapshot: ClinicalInputData;
  }>;
  isProcessing: boolean;
  error: string | null;
}

export interface DecisionContextType {
  state: DecisionState;
  updateInputs: (inputs: ClinicalInputData) => void;
  selectNode: (nodeId: string) => void;
  getRecommendations: () => Promise<RecommendationWithRationale[]>;
  reset: () => void;
}
