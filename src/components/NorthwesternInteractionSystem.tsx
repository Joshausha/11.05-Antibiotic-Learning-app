/**
 * Northwestern Interaction System Component (TypeScript)
 *
 * Enhanced medical education interaction system for Northwestern pie chart component.
 * Provides sophisticated hover, click, and touch interactions for clinical learning.
 *
 * Performance Target: <100ms interaction response, 60fps animations
 *
 * Features:
 * - Rich clinical context tooltips
 * - Progressive disclosure learning mode
 * - Multi-segment comparison system
 * - Emergency clinical access patterns
 * - Mobile-optimized touch interactions
 */

import React, { useState, useCallback, useRef, useEffect, FC, ReactNode, CSSProperties } from 'react';

/**
 * Type Definitions
 */

type EducationLevel = 'student' | 'resident' | 'attending';
type CoverageLevel = 0 | 1 | 2;

interface ClinicalContextData {
  MRSA: SegmentContext;
  VRE_faecium: SegmentContext;
  anaerobes: SegmentContext;
  atypicals: SegmentContext;
  pseudomonas: SegmentContext;
  gramNegative: SegmentContext;
  MSSA: SegmentContext;
  enterococcus_faecalis: SegmentContext;
  [key: string]: SegmentContext;
}

interface SegmentContext {
  description: string;
  clinicalSignificance: string;
  resistancePatterns: string[];
  commonInfections: string[];
  emergencyInfo: string;
  prevalence: string;
  mortality: string;
}

interface CoverageInterpretation {
  text: string;
  clinical: string;
  recommendation: string;
  color: string;
}

interface CoverageInterpretations {
  0: CoverageInterpretation;
  1: CoverageInterpretation;
  2: CoverageInterpretation;
}

interface EducationConfig {
  focusAreas: string[];
  complexity: 'basic' | 'intermediate' | 'advanced';
  terminology: 'simplified' | 'clinical' | 'technical';
}

interface Antibiotic {
  id: string | number;
  name: string;
  class?: string;
  northwesternSpectrum?: Record<string, number>;
  mechanism?: string;
  [key: string]: any;
}

interface TooltipData {
  segment: string;
  context: any;
  position: {
    x: number;
    y: number;
  };
}

interface LearningInsight {
  timestamp: Date;
  action: string;
  segment: string;
  antibiotic?: string;
  coverage?: any;
  clinicalNote?: string;
}

interface InteractionStateReturn {
  hoveredSegment: string | null;
  selectedSegments: Set<string>;
  tooltipData: TooltipData | null;
  comparisonMode: boolean;
  learningInsights: LearningInsight[];
  handlers: {
    onSegmentHover: (segment: string, event: any) => void;
    onSegmentClick: (segment: string, event: any) => void;
    onMouseLeave: () => void;
    onComparisonToggle: () => void;
  };
  utils: {
    getSegmentContext: (segment: string) => any;
    isSelected: (segment: string) => boolean;
    getSelectedContexts: () => any[];
  };
}

interface ClinicalTooltipProps {
  tooltipData: TooltipData | null;
  educationLevel: EducationLevel;
}

interface NorthwesternInteractionSystemProps {
  children: ReactNode;
  antibiotic?: Antibiotic;
  educationLevel?: EducationLevel;
  onClinicalInsight?: (insight: LearningInsight) => void;
  onLearningProgress?: (progress: any) => void;
  showAdvancedFeatures?: boolean;
  className?: string;
}

/**
 * Clinical significance data for each Northwestern segment
 */
const CLINICAL_CONTEXT: ClinicalContextData = {
  MRSA: {
    description: 'Methicillin-resistant Staphylococcus aureus',
    clinicalSignificance: 'Major cause of healthcare-associated infections, skin/soft tissue infections',
    resistancePatterns: ['Methicillin resistance via mecA gene', 'Often multi-drug resistant'],
    commonInfections: ['Pneumonia', 'Bacteremia', 'Skin/soft tissue infections', 'Endocarditis'],
    emergencyInfo: 'Vancomycin first-line for severe infections; consider linezolid for pneumonia',
    prevalence: 'Hospital: 15-50%, Community: 1-5%',
    mortality: 'Bacteremia: 15-30% mortality rate'
  },
  VRE_faecium: {
    description: 'Vancomycin-resistant Enterococcus faecium',
    clinicalSignificance: 'Multi-drug resistant pathogen, limited treatment options',
    resistancePatterns: ['Vancomycin resistance via vanA/vanB genes', 'Ampicillin resistance'],
    commonInfections: ['Bacteremia', 'Endocarditis', 'UTI', 'Intra-abdominal infections'],
    emergencyInfo: 'Linezolid or daptomycin for serious infections; check susceptibilities',
    prevalence: 'ICU: 5-15%, Oncology units: up to 25%',
    mortality: 'Bacteremia: 20-40% mortality rate'
  },
  anaerobes: {
    description: 'Anaerobic bacteria including Bacteroides, C. difficile',
    clinicalSignificance: 'Important in polymicrobial infections, GI flora',
    resistancePatterns: ['Beta-lactamase production', 'Clindamycin resistance'],
    commonInfections: ['Intra-abdominal infections', 'Aspiration pneumonia', 'Dental infections'],
    emergencyInfo: 'Metronidazole or clindamycin; consider B. fragilis in abdominal sepsis',
    prevalence: 'Normal GI flora, pathogenic in anaerobic conditions',
    mortality: 'Variable based on infection site and polymicrobial nature'
  },
  atypicals: {
    description: 'Atypical bacteria: Legionella, Mycoplasma, Chlamydophila',
    clinicalSignificance: 'Cannot be cultured on standard media, require special antibiotics',
    resistancePatterns: ['Naturally resistant to beta-lactams', 'Cell wall-deficient organisms'],
    commonInfections: ['Community-acquired pneumonia', 'Upper respiratory infections'],
    emergencyInfo: 'Macrolides, fluoroquinolones, or doxycycline; consider in severe CAP',
    prevalence: 'CAP: 10-20% of cases',
    mortality: 'Generally low mortality with appropriate treatment'
  },
  pseudomonas: {
    description: 'Pseudomonas aeruginosa',
    clinicalSignificance: 'Opportunistic pathogen, inherently resistant to many antibiotics',
    resistancePatterns: ['Efflux pumps', 'Beta-lactamases', 'Biofilm formation'],
    commonInfections: ['Ventilator-associated pneumonia', 'Bacteremia', 'UTI', 'Wound infections'],
    emergencyInfo: 'Anti-pseudomonal beta-lactam + aminoglycoside or fluoroquinolone',
    prevalence: 'ICU: 10-15% of isolates',
    mortality: 'Bacteremia: 20-50% mortality rate'
  },
  gramNegative: {
    description: 'Gram-negative bacteria including Enterobacteriaceae',
    clinicalSignificance: 'Major cause of hospital-acquired infections, UTIs',
    resistancePatterns: ['ESBL production', 'Carbapenemases', 'AmpC beta-lactamases'],
    commonInfections: ['UTI', 'Pneumonia', 'Bacteremia', 'Intra-abdominal infections'],
    emergencyInfo: 'Broad spectrum required; consider carbapenem for ESBL producers',
    prevalence: 'Most common cause of gram-negative bacteremia',
    mortality: 'Variable: 5-30% depending on organism and infection site'
  },
  MSSA: {
    description: 'Methicillin-sensitive Staphylococcus aureus',
    clinicalSignificance: 'Most common cause of skin/soft tissue infections',
    resistancePatterns: ['Susceptible to methicillin and nafcillin'],
    commonInfections: ['Skin/soft tissue infections', 'Pneumonia', 'Bacteremia', 'Endocarditis'],
    emergencyInfo: 'Nafcillin or cefazolin preferred; avoid vancomycin for MSSA',
    prevalence: 'Most common staphylococcal pathogen',
    mortality: 'Bacteremia: 10-20% mortality rate'
  },
  enterococcus_faecalis: {
    description: 'Enterococcus faecalis',
    clinicalSignificance: 'Normal GI flora, opportunistic pathogen',
    resistancePatterns: ['Intrinsic ampicillin susceptibility', 'Vancomycin may be resistant'],
    commonInfections: ['UTI', 'Endocarditis', 'Bacteremia', 'Intra-abdominal infections'],
    emergencyInfo: 'Ampicillin preferred if susceptible; avoid cephalosporins',
    prevalence: 'Most common enterococcal species (85-90%)',
    mortality: 'Generally lower mortality than E. faecium'
  }
};

const COVERAGE_INTERPRETATIONS: CoverageInterpretations = {
  0: {
    text: 'No Coverage',
    clinical: 'Not effective against this pathogen',
    recommendation: 'Do not use for infections with this organism',
    color: 'text-red-600'
  },
  1: {
    text: 'Moderate Coverage',
    clinical: 'Limited or variable effectiveness',
    recommendation: 'Use with caution, consider alternatives',
    color: 'text-yellow-600'
  },
  2: {
    text: 'Good Coverage',
    clinical: 'Reliably effective against this pathogen',
    recommendation: 'Appropriate choice for confirmed infections',
    color: 'text-green-600'
  }
};

const EDUCATION_LEVELS: Record<EducationLevel, EducationConfig> = {
  student: {
    focusAreas: ['basic_coverage', 'common_infections'],
    complexity: 'basic',
    terminology: 'simplified'
  },
  resident: {
    focusAreas: ['clinical_significance', 'resistance_patterns', 'treatment_guidelines'],
    complexity: 'intermediate',
    terminology: 'clinical'
  },
  attending: {
    focusAreas: ['mortality_data', 'resistance_mechanisms', 'pharmacokinetics'],
    complexity: 'advanced',
    terminology: 'technical'
  }
};

/**
 * Northwestern Interaction State Hook
 */
const useInteractionState = (antibiotic?: Antibiotic, educationLevel: EducationLevel = 'resident'): InteractionStateReturn => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [selectedSegments, setSelectedSegments] = useState<Set<string>>(new Set());
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [learningInsights, setLearningInsights] = useState<LearningInsight[]>([]);

  const getSegmentContext = useCallback((segmentKey: string): any => {
    const baseContext = CLINICAL_CONTEXT[segmentKey as keyof ClinicalContextData];
    const coverage = (antibiotic?.northwesternSpectrum?.[segmentKey] || 0) as CoverageLevel;
    const coverageInfo = COVERAGE_INTERPRETATIONS[coverage];
    const educationConfig = EDUCATION_LEVELS[educationLevel];

    return {
      ...baseContext,
      coverage: {
        value: coverage,
        ...coverageInfo
      },
      antibiotic: {
        name: antibiotic?.name,
        class: antibiotic?.class,
        mechanism: antibiotic?.mechanism
      },
      educationLevel: educationLevel,
      complexity: educationConfig.complexity
    };
  }, [antibiotic, educationLevel]);

  const handleSegmentHover = useCallback((segmentKey: string, event: any): void => {
    const context = getSegmentContext(segmentKey);
    const rect = event.target.getBoundingClientRect();

    setHoveredSegment(segmentKey);
    setTooltipData({
      segment: segmentKey,
      context,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top
      }
    });
  }, [getSegmentContext]);

  const handleSegmentClick = useCallback((segmentKey: string, event: any): void => {
    const newSelected = new Set(selectedSegments);

    if (newSelected.has(segmentKey)) {
      newSelected.delete(segmentKey);
    } else {
      newSelected.add(segmentKey);
    }

    setSelectedSegments(newSelected);

    const context = getSegmentContext(segmentKey);
    const insight: LearningInsight = {
      timestamp: new Date(),
      action: 'segment_selected',
      segment: segmentKey,
      antibiotic: antibiotic?.name,
      coverage: context.coverage,
      clinicalNote: context.emergencyInfo
    };

    setLearningInsights(prev => [...prev.slice(-9), insight]);
  }, [selectedSegments, getSegmentContext, antibiotic]);

  const handleMouseLeave = useCallback((): void => {
    setHoveredSegment(null);
    setTooltipData(null);
  }, []);

  const toggleComparisonMode = useCallback((): void => {
    setComparisonMode(prev => !prev);
    if (!comparisonMode) {
      setSelectedSegments(new Set());
    }
  }, [comparisonMode]);

  return {
    hoveredSegment,
    selectedSegments,
    tooltipData,
    comparisonMode,
    learningInsights,
    handlers: {
      onSegmentHover: handleSegmentHover,
      onSegmentClick: handleSegmentClick,
      onMouseLeave: handleMouseLeave,
      onComparisonToggle: toggleComparisonMode
    },
    utils: {
      getSegmentContext,
      isSelected: (segment: string) => selectedSegments.has(segment),
      getSelectedContexts: () => Array.from(selectedSegments).map(getSegmentContext)
    }
  };
};

/**
 * Clinical Tooltip Component
 */
const ClinicalTooltip: FC<ClinicalTooltipProps> = ({ tooltipData, educationLevel }) => {
  if (!tooltipData) return null;

  const { segment, context, position } = tooltipData;
  const educationConfig = EDUCATION_LEVELS[educationLevel];

  const tooltipStyle: CSSProperties = {
    left: position.x - 150,
    top: position.y - 10,
    transform: 'translateY(-100%)'
  };

  return (
    <div
      className="clinical-tooltip fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm"
      style={tooltipStyle}
    >
      <div className="clinical-tooltip__header mb-2">
        <h3 className="font-bold text-gray-900">{segment.replace('_', ' ')}</h3>
        <p className="text-sm text-gray-600">{context.description}</p>
      </div>

      <div className="clinical-tooltip__coverage mb-3">
        <div className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${context.coverage.color} bg-gray-50`}>
          <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
          {context.coverage.text} ({context.coverage.value}/2)
        </div>
        <p className="text-xs text-gray-600 mt-1">{context.coverage.clinical}</p>
      </div>

      {educationConfig.focusAreas.includes('clinical_significance') && (
        <div className="clinical-tooltip__clinical mb-2">
          <h4 className="text-sm font-medium text-gray-800">Clinical Significance</h4>
          <p className="text-xs text-gray-600">{context.clinicalSignificance}</p>
        </div>
      )}

      {educationConfig.focusAreas.includes('common_infections') && (
        <div className="clinical-tooltip__infections mb-2">
          <h4 className="text-sm font-medium text-gray-800">Common Infections</h4>
          <ul className="text-xs text-gray-600">
            {context.commonInfections.slice(0, 3).map((infection: string, index: number) => (
              <li key={index}>• {infection}</li>
            ))}
          </ul>
        </div>
      )}

      {context.emergencyInfo && (
        <div className="clinical-tooltip__emergency bg-red-50 border border-red-200 rounded p-2 mt-2">
          <h4 className="text-sm font-medium text-red-800">Clinical Note</h4>
          <p className="text-xs text-red-700">{context.emergencyInfo}</p>
        </div>
      )}

      <div className="clinical-tooltip__antibiotic border-t border-gray-200 pt-2 mt-2">
        <p className="text-xs text-gray-500">
          {context.antibiotic.name} ({context.antibiotic.class})
        </p>
      </div>
    </div>
  );
};

/**
 * Northwestern Interaction System Component
 */
const NorthwesternInteractionSystem: FC<NorthwesternInteractionSystemProps> = ({
  children,
  antibiotic,
  educationLevel = 'resident',
  onClinicalInsight,
  onLearningProgress,
  showAdvancedFeatures = true,
  className = ''
}) => {
  const interactionRef = useRef<HTMLDivElement>(null);

  const {
    hoveredSegment,
    selectedSegments,
    tooltipData,
    comparisonMode,
    learningInsights,
    handlers,
    utils
  } = useInteractionState(antibiotic, educationLevel);

  // Report clinical insights to parent components
  useEffect(() => {
    if (onClinicalInsight && learningInsights.length > 0) {
      const latestInsight = learningInsights[learningInsights.length - 1];
      onClinicalInsight(latestInsight);
    }
  }, [learningInsights, onClinicalInsight]);

  // Report learning progress
  useEffect(() => {
    if (onLearningProgress) {
      const progress = {
        segmentsExplored: selectedSegments.size,
        totalSegments: 8,
        completionPercentage: (selectedSegments.size / 8) * 100,
        insights: learningInsights.length,
        educationLevel
      };
      onLearningProgress(progress);
    }
  }, [selectedSegments, learningInsights, educationLevel, onLearningProgress]);

  return (
    <div
      ref={interactionRef}
      className={`northwestern-interaction-system relative ${className}`}
      onMouseLeave={handlers.onMouseLeave}
    >
      {/* Enhanced children with interaction handlers */}
      {React.cloneElement(children as React.ReactElement<any>, {
        onSegmentHover: handlers.onSegmentHover,
        onSegmentClick: handlers.onSegmentClick,
        hoveredSegment,
        selectedSegments: Array.from(selectedSegments),
        interactive: true,
        className: `${(children as React.ReactElement<any>).props.className || ''} ${comparisonMode ? 'comparison-mode' : ''}`
      })}

      {/* Clinical Tooltip */}
      <ClinicalTooltip
        tooltipData={tooltipData}
        educationLevel={educationLevel}
      />
    </div>
  );
};

export default NorthwesternInteractionSystem;
export { useInteractionState, ClinicalTooltip };
