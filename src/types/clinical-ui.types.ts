/**
 * Clinical UI Component Type Definitions
 * Type definitions for clinical tooltip, treatment recommendations, and clinical education components
 */

import React from 'react';

// ==========================================
// CLINICAL DATABASE TYPES
// ==========================================

export interface ClinicalInfo {
  fullName: string;
  clinicalSignificance: string;
  commonPresentations: string[];
  resistanceMechanisms?: string[];
  treatmentOptions: {
    firstLine: string[];
    alternative?: string[];
    avoid?: string[];
    cDiff?: string[];
    combination?: string[];
    esbl?: string[];
    experimental?: string[];
    cre?: string[];
    endocarditis?: string[];
    [key: string]: string[] | undefined;
  };
  emergencyInfo: {
    immediate: string;
    monitoring: string;
    duration: string;
  };
  clinicalPearls?: {
    student?: string;
    resident?: string;
    attending?: string;
    medical_student?: string;
  };
  mortality?: Record<string, string>;
  prevalence?: Record<string, string>;
}

export type ClinicalDatabaseKey =
  | 'MRSA'
  | 'VRE_faecium'
  | 'anaerobes'
  | 'atypicals'
  | 'pseudomonas'
  | 'gramNegative'
  | 'MSSA'
  | 'enterococcus_faecalis';

export type ClinicalDatabase = Record<ClinicalDatabaseKey, ClinicalInfo> & { [key: string]: ClinicalInfo | undefined };

// ==========================================
// COVERAGE CLINICAL TYPES
// ==========================================

export interface CoverageLevel {
  text: string;
  clinical: string;
  recommendation: string;
  urgency: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export type CoverageClinicalMap = Record<number, CoverageLevel>;

// ==========================================
// TOOLTIP DATA TYPES
// ==========================================

export interface TooltipPosition {
  x: number;
  y: number;
}

export interface TooltipContext {
  coverage?: number;
  antibiotic?: {
    name?: string;
    class?: string;
  };
}

export interface TooltipData {
  segment?: string;
  segmentKey?: string;
  context?: TooltipContext;
  position?: TooltipPosition;
  visible?: boolean;
  educationLevel?: EducationLevel;
  emergencyMode?: boolean;
}

// ==========================================
// COMPONENT PROPS TYPES
// ==========================================

export type EducationLevel = 'student' | 'resident' | 'attending' | 'medical_student';

export interface ClinicalTooltipProps {
  tooltipData?: TooltipData;
  educationLevel?: EducationLevel;
  emergencyMode?: boolean;
  className?: string;
  maxWidth?: string;
  onClose?: () => void;
}

export interface EmergencyAlertProps {
  segmentKey: string;
  coverage: number;
  antibiotic?: string;
}

export interface TreatmentRecommendationsProps {
  segmentKey: string;
  coverage: number;
  educationLevel: EducationLevel;
  emergencyMode?: boolean;
}

export interface ClinicalPearlsProps {
  segmentKey: string;
  educationLevel: EducationLevel;
}
