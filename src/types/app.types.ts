/**
 * Application-wide type definitions
 * Used across AppContext and related components
 *
 * Note: During TypeScript migration, some types use 'any' where downstream
 * component signatures are not yet fully typed. These will be refined as
 * components are migrated to TypeScript.
 */

import type { MedicalCondition } from './medical.types';

export type TabType = 'hub' | 'learn' | 'quiz' | 'analytics' | 'reference' | 'pathogen-explorer' | 'antibiotic-explorer' | 'visualizations' | 'comparison';

export interface SearchData {
  filteredItems: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// During migration, use flexible types since downstream hooks/components aren't typed yet
export type PathogenDataType = any;

export type AntibioticDataType = any;

export type QuizProgressType = any;

export type BookmarksType = any;

export { MedicalCondition };

/**
 * AppContextValue - The shape of the application context
 * Provides centralized state management for the entire application
 */
export interface AppContextValue {
  // Navigation state
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Condition selection
  selectedCondition: MedicalCondition | null;
  setSelectedCondition: (condition: MedicalCondition | null) => void;

  // Mobile menu state
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;

  // Device detection
  isMobile: boolean;

  // Quiz and learning data
  quizProgress: QuizProgressType;
  bookmarks: BookmarksType;

  // Medical data
  pathogenData: PathogenDataType;
  antibioticData: AntibioticDataType;

  // Search functionality
  searchData: SearchData;

  // Reference data
  medicalConditions: MedicalCondition[];
}

/**
 * AppProviderProps - Props for AppProvider component
 */
export interface AppProviderProps {
  children: React.ReactNode;
}
