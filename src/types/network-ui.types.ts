/**
 * Network UI Component Type Definitions
 * Type definitions for network visualization controls, legends, and pathogen info panels
 */

import React from 'react';

// ==========================================
// FILTER TYPES
// ==========================================

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterOptions {
  gram: FilterOption[];
  severity: FilterOption[];
  shape: FilterOption[];
  resistance: FilterOption[];
  connection: FilterOption[];
}

// Centralized filter state for network visualization
// Single source of truth for all filter criteria
export interface NetworkFilters {
  gramStain: 'all' | 'positive' | 'negative';
  antibioticClasses: string[];  // Multiple selection
  formulation: 'all' | 'oral' | 'IV' | 'topical';
  mechanismOfAction: string[];  // Multiple selection
  coverageThreshold: 'all' | 'high' | 'medium' | 'low';
  showResistance: boolean;
}

export const initialFilters: NetworkFilters = {
  gramStain: 'all',
  antibioticClasses: [],
  formulation: 'all',
  mechanismOfAction: [],
  coverageThreshold: 'all',
  showResistance: true
};

// ==========================================
// VISUALIZATION MODE TYPES
// ==========================================

// Multi-mode visualization support for different learning approaches
export type VisualizationMode = 'network' | 'filtered' | 'northwestern';

// ==========================================
// ANTIBIOTIC TYPES
// ==========================================

export interface AntibioticBasic {
  id: number | string;
  name: string;
  class: string;
  routes?: string[];
  notes?: string;
}

export interface AntibioticEffectiveness {
  high: AntibioticBasic[];
  medium: AntibioticBasic[];
  low: AntibioticBasic[];
  resistant: AntibioticBasic[];
}

// ==========================================
// PATHOGEN TYPES
// ==========================================

export interface PathogenBasic {
  id: string;
  pathogenId?: number;
  gramStatus?: string;
  shape?: string;
  severity?: 'high' | 'medium' | 'low';
  description?: string;
  commonSites?: string[];
  resistance?: string;
  resistanceInfo?: {
    resistancePercentage: number;
  };
}

// ==========================================
// COMPONENT PROPS TYPES
// ==========================================

export interface FilterDropdownProps {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export interface NetworkFilterControlsProps {
  filters: NetworkFilters;
  onFilterChange: (filterName: string, value: string) => void;
  onClearFilters: () => void;
  onResetLayout: () => void;
  showLabels: boolean;
  onToggleLabels: (checked: boolean) => void;
  isLayoutStable: boolean;
}

export interface LegendSectionProps {
  title: string;
  children: React.ReactNode;
}

export interface LegendItemProps {
  indicator: React.ReactNode;
  label: string;
}

export interface NetworkLegendProps {
  // No required props
}

export interface StatItemProps {
  label: string;
  value: string | number;
  valueClassName?: string;
}

export interface EffectivenessSectionProps {
  title: string;
  antibiotics: AntibioticBasic[];
  colorScheme: EffectivenessColorScheme;
}

export interface EffectivenessColorScheme {
  dot: string;
  text: string;
  bg: string;
  border: string;
  textDark: string;
  textLight: string;
}

export interface PathogenInfoPanelProps {
  pathogen?: PathogenBasic;
  isVisible: boolean;
  onClose: () => void;
}

// ==========================================
// NORTHWESTERN INTERFACE TYPES
// ==========================================

export interface ClinicalDecisionPayload {
  type: string;
  antibiotic?: AntibioticBasic;
  [key: string]: any;
}

export interface ClinicalDecisionContext {
  interface: 'fallback' | 'loading';
  [key: string]: any;
}

export interface NorthwesternFallbackInterfaceProps {
  antibiotics: AntibioticBasic[];
  onClinicalDecision?: (payload: ClinicalDecisionPayload, context: ClinicalDecisionContext) => void;
}

export interface PriorityItemProps {
  component: string;
  index: number;
  isLoaded: boolean;
}

export interface ProgressBarProps {
  progress: number;
}

export interface NorthwesternLoadingInterfaceProps {
  loadedComponents: Set<string>;
  loadingPriority: string[];
  emergencyMode?: boolean;
  clinicalContext?: string;
  performanceTarget?: string;
}

// ==========================================
// EFFECTIVENESS COLOR SCHEMES
// ==========================================

export const EFFECTIVENESS_COLORS: Record<string, EffectivenessColorScheme> = {
  high: {
    dot: 'bg-green-500',
    text: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-400',
    textDark: 'text-green-900',
    textLight: 'text-green-700'
  },
  medium: {
    dot: 'bg-yellow-500',
    text: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    textDark: 'text-yellow-900',
    textLight: 'text-yellow-700'
  },
  low: {
    dot: 'bg-orange-500',
    text: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-400',
    textDark: 'text-orange-900',
    textLight: 'text-orange-700'
  },
  resistant: {
    dot: 'bg-red-500',
    text: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-400',
    textDark: 'text-red-900',
    textLight: 'text-red-700'
  }
};
