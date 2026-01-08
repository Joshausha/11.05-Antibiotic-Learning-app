/**
 * Central type exports for the entire application
 * Re-exports all types for convenient importing
 *
 * Barrel file pattern allows clean imports:
 * import { Antibiotic, QuizQuestion, NorthwesternSpectrum } from '@/types';
 *
 * Note: Some types are explicitly re-exported to avoid duplicate export errors
 * when the same type name exists in multiple files.
 */

// Application types
export * from './app.types';

// Medical domain types (antibiotics, pathogens, quiz, learning) - primary source for medical types
export * from './medical.types';

// Component-specific types - exclude duplicates that are defined in medical.types
export type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
  LoadingSpinnerProps,
  ErrorMessageProps,
  SkeletonLoaderProps,
  ProgressBarProps,
  ProgressIndicatorProps,
  DurationIndicatorProps,
  DifficultyOption,
  DifficultyStats,
  SelectedAnswersMap,
  SpacedRepetitionResult,
  AdaptiveQuizQuestion,
  QuizTabProps,
  QuizProgressProps,
  PathogenNode,
  PathogenData,
  AntibioticData,
  VisualizationOption,
  FilterOption,
  CategoryDistribution,
  DrugClassDistribution,
  OverviewStats,
  AnimationManager,
  AnimationConfig,
  VisualizationsTabProps
} from './component.types';

// Re-export component.types DifficultyLevel and Antibiotic with different names to avoid conflicts
export type { DifficultyLevel as ComponentDifficultyLevel, Antibiotic as ComponentAntibiotic } from './component.types';

// Clinical decision support types - exclude duplicates
export type {
  EducationLevel as ClinicalEducationLevel
} from './clinical-decision.types';

// Clinical UI types - exclude CoverageLevel and EducationLevel (conflicts with medical.types)
export type {
  ClinicalInfo,
  ClinicalDatabaseKey,
  ClinicalDatabase,
  CoverageClinicalMap,
  TooltipPosition,
  TooltipContext,
  TooltipData,
  ClinicalTooltipProps,
  EmergencyAlertProps,
  TreatmentRecommendationsProps,
  ClinicalPearlsProps
} from './clinical-ui.types';
export type { CoverageLevel as ClinicalCoverageLevel, EducationLevel as ClinicalUIEducationLevel } from './clinical-ui.types';

// Network visualization types
export * from './network-ui.types';

// Comparison interface types
export * from './comparison.types';
