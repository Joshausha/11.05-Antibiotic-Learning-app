// Props interfaces for shared UI components

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'refresh' | 'clock';
}

export interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onHome?: () => void;
}

export interface SkeletonLoaderProps {
  type?: 'content' | 'card' | 'list' | 'quiz' | 'table';
  rows?: number;
  columns?: number;
  lines?: number;
  title?: boolean;
}

export interface ProgressBarProps {
  progress?: number;
  total?: number;
  showPercentage?: boolean;
  color?: string;
}

export interface ProgressIndicatorProps {
  current?: number;
  total?: number;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface DurationIndicatorProps {
  duration?: number | string;
  type?: 'spent' | 'remaining' | 'total';
  showIcon?: boolean;
  format?: 'short' | 'long';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

// ==========================================
// QUIZ TAB COMPONENT TYPES
// ==========================================

/**
 * Quiz difficulty level type
 */
export type DifficultyLevel = 'all' | 'northwestern' | 'beginner' | 'intermediate' | 'advanced';

/**
 * Difficulty selection option
 */
export interface DifficultyOption {
  key: DifficultyLevel;
  label: string;
  icon: string;
  color: string;
}

/**
 * Difficulty statistics
 */
export interface DifficultyStats {
  all: number;
  beginner: number;
  intermediate: number;
  advanced: number;
  northwestern: number;
}

/**
 * Selected answers map (question index -> answer index)
 */
export interface SelectedAnswersMap {
  [questionIndex: number]: number;
}

/**
 * Spaced repetition result for a question
 */
export interface SpacedRepetitionResult {
  question: any; // QuizQuestion from medical.types
  isCorrect: boolean;
  cardId: string;
  nextReview?: Date;
  interval?: number;
  reason?: string;
}

/**
 * Enhanced quiz question with spaced repetition metadata
 */
export interface AdaptiveQuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category?: string;
  conditionId?: string;
  difficulty?: string;
  priority?: 'high' | 'medium' | 'low';
  reason?: string;
  northwesternFocus?: boolean;
  [key: string]: any;
}

/**
 * QuizTab component props
 */
export interface QuizTabProps {
  quizQuestions?: any[]; // QuizQuestion[] from medical.types
  setActiveTab?: (tab: string) => void;
}

/**
 * Quiz Progress props (extended from ProgressIndicatorProps)
 */
export interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  correctAnswers: number;
  showStats?: boolean;
  className?: string;
}

// ==========================================
// VISUALIZATIONS TAB COMPONENT TYPES
// ==========================================

/**
 * Pathogen data structure
 */
export interface PathogenNode {
  id: string;
  name: string;
  gramStatus?: 'Positive' | 'Negative' | 'Variable';
  [key: string]: any;
}

export interface PathogenData {
  pathogens?: PathogenNode[];
  [key: string]: any;
}

/**
 * Antibiotic data structure
 */
export interface Antibiotic {
  id: string;
  name: string;
  class: string;
  [key: string]: any;
}

export interface AntibioticData {
  antibiotics?: Antibiotic[];
  [key: string]: any;
}

/**
 * Visualization option configuration
 */
export interface VisualizationOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

/**
 * Filter option configuration
 */
export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Category distribution map
 */
export interface CategoryDistribution {
  [category: string]: number;
}

/**
 * Drug class distribution map
 */
export interface DrugClassDistribution {
  [drugClass: string]: number;
}

/**
 * Overview statistics
 */
export interface OverviewStats {
  totalConditions: number;
  totalPathogens: number;
  totalAntibiotics: number;
  gramPositive: number;
  gramNegative: number;
}

/**
 * Northwestern Animation Manager
 */
export interface AnimationManager {
  animate: (element: HTMLElement, config: any) => Promise<void>;
  cleanup: () => void;
  setEmergencyMode?: (mode: boolean) => void;
}

/**
 * Northwestern Animation Config
 */
export interface AnimationConfig {
  element: HTMLElement;
  config: {
    keyframes: any[];
    duration: number;
    easing?: string;
    [key: string]: any;
  };
}

/**
 * VisualizationsTab component props
 */
export interface VisualizationsTabProps {
  pathogenData?: PathogenData;
  antibioticData?: AntibioticData;
  medicalConditions?: any[]; // MedicalCondition[] from medical.types
  onSelectCondition?: (condition: any) => void;
  onSelectPathogen?: (pathogen: PathogenNode) => void;
}
