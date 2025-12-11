/**
 * Detail Panel Component
 *
 * Advanced interactive panel for deep-dive educational content on Northwestern
 * pie chart segments. Provides comprehensive clinical information, learning
 * scenarios, and progressive disclosure based on medical education level.
 *
 * Features:
 * - Progressive disclosure based on education level
 * - Clinical decision support scenarios
 * - Interactive learning modules
 * - Spaced repetition integration hooks
 * - Multi-segment comparison capabilities
 */

import React, { useState, useCallback, useMemo, FC } from 'react';
import { CLINICAL_DATABASE, COVERAGE_CLINICAL } from './ClinicalTooltip';

// Types
interface ClinicalScenarioOption {
  text: string;
  correct?: boolean;
}

interface ClinicalScenario {
  id: string;
  level: 'student' | 'resident' | 'attending';
  title: string;
  patient: string;
  presentation: string;
  question: string;
  options: string[];
  correct: number[];
  rationale: string;
  followUp?: string;
}

interface Antibiotic {
  name: string;
  northwesternSpectrum?: Record<string, number>;
  [key: string]: any;
}

interface ReviewScheduleEntry {
  nextReview: number;
  interval: number;
  difficulty: string;
  performance: string;
  reviewCount: number;
}

interface DetailPanelProps {
  segments?: string[];
  antibiotic?: Antibiotic;
  educationLevel?: 'student' | 'resident' | 'attending';
  onLearningComplete?: (data: any) => void;
  onSegmentFocus?: (segment: string) => void;
  onClose?: () => void;
  className?: string;
}

interface ScenarioCompleteResult {
  scenarioId: string;
  correct: boolean;
  selectedOptions: number[];
  correctOptions: number[];
}

interface LearningProgress {
  completedScenarios: number;
  completedObjectives: number;
  totalObjectives: number;
}

// Clinical scenarios for interactive learning
const CLINICAL_SCENARIOS: Record<string, ClinicalScenario[]> = {
  MRSA: [
    {
      id: 'mrsa_pneumonia',
      level: 'resident',
      title: 'MRSA Healthcare-Associated Pneumonia',
      patient: '68-year-old male, post-operative day 3, ventilated',
      presentation: 'New infiltrate on CXR, purulent secretions, fever 39°C',
      question: 'Patient cultures grow MRSA. What is your treatment approach?',
      options: ['Vancomycin 15mg/kg q12h', 'Linezolid 600mg q12h', 'Ceftriaxone 2g daily', 'Clindamycin 600mg q8h'],
      correct: [0, 1],
      rationale: 'Both vancomycin and linezolid are appropriate for MRSA pneumonia. Linezolid may have better lung penetration.',
      followUp: 'Would you add an aminoglycoside for synergy?',
    },
    {
      id: 'mrsa_bacteremia',
      level: 'attending',
      title: 'MRSA Bacteremia with High Vancomycin MIC',
      patient: '45-year-old female, MRSA bacteremia, vancomycin MIC = 2.0',
      presentation: 'Persistent positive blood cultures after 72h vancomycin',
      question: 'Vancomycin MIC is 2.0 mg/L. What is your next step?',
      options: ['Increase vancomycin dose', 'Switch to linezolid', 'Switch to daptomycin', 'Add rifampin to vancomycin'],
      correct: [2],
      rationale: 'Vancomycin MIC ≥2 is associated with treatment failure. Daptomycin is preferred for MRSA bacteremia.',
      followUp: 'What daptomycin dose would you use for bacteremia?',
    },
  ],

  pseudomonas: [
    {
      id: 'pseudomonas_vap',
      level: 'resident',
      title: 'Pseudomonas VAP in ICU',
      patient: '60-year-old male, ventilated 7 days, new infiltrates',
      presentation: 'BAL grows P. aeruginosa, susceptible to cefepime and tobramycin',
      question: 'What is the optimal treatment regimen?',
      options: ['Cefepime monotherapy', 'Cefepime + tobramycin', 'Meropenem + ciprofloxacin', 'Piperacillin-tazobactam alone'],
      correct: [1, 2],
      rationale: 'Combination therapy is recommended for serious P. aeruginosa infections to prevent resistance.',
      followUp: 'How long should you treat Pseudomonas VAP?',
    },
  ],

  VRE_faecium: [
    {
      id: 'vre_bacteremia',
      level: 'attending',
      title: 'VRE faecium Bacteremia',
      patient: '55-year-old stem cell transplant recipient',
      presentation: 'Blood cultures grow VRE faecium, vanA gene detected',
      question: 'What is the most appropriate first-line treatment?',
      options: ['High-dose ampicillin', 'Linezolid', 'Quinupristin-dalfopristin', 'Tigecycline'],
      correct: [1],
      rationale: 'Linezolid is first-line for VRE faecium bacteremia. Daptomycin is also appropriate.',
      followUp: 'What monitoring is required with linezolid therapy?',
    },
  ],
};

// Learning objectives by education level
const LEARNING_OBJECTIVES: Record<string, Record<string, string[]>> = {
  student: {
    MRSA: ['Understand mecA gene mechanism of resistance', 'Recognize clinical presentations of MRSA infections', 'Know first-line treatment options'],
    MSSA: ['Differentiate MSSA from MRSA', 'Understand why beta-lactams are preferred over vancomycin', 'Recognize common MSSA infections'],
  },
  resident: {
    MRSA: [
      'Apply vancomycin dosing and monitoring principles',
      'Recognize vancomycin treatment failures',
      'Choose between vancomycin and linezolid appropriately',
      'Understand infection control measures',
    ],
    pseudomonas: [
      'Implement combination therapy strategies',
      'Recognize resistance development patterns',
      'Apply anti-pseudomonal antibiotic selection',
      'Manage biofilm-associated infections',
    ],
  },
  attending: {
    MRSA: [
      'Interpret vancomycin pharmacokinetic parameters',
      'Manage complicated MRSA infections',
      'Apply stewardship principles for MRSA treatment',
      'Evaluate novel anti-MRSA agents',
    ],
    VRE_faecium: [
      'Manage multi-drug resistant VRE infections',
      'Apply combination therapy for severe infections',
      'Understand resistance mechanisms and epidemiology',
      'Implement infection prevention strategies',
    ],
  },
};

// Custom hook for spaced repetition
const useSpacedRepetition = () => {
  const [reviewSchedule, setReviewSchedule] = useState<Record<string, ReviewScheduleEntry>>({});

  const scheduleReview = useCallback((segmentKey: string, difficulty: string, performance: string): void => {
    const now = Date.now();
    let interval: number;

    // SM-2 algorithm adaptation for clinical learning
    switch (performance) {
      case 'easy':
        interval = difficulty === 'hard' ? 1 : 4; // days
        break;
      case 'medium':
        interval = difficulty === 'hard' ? 0.5 : 2;
        break;
      case 'hard':
        interval = 0.25; // hours for immediate review
        break;
      default:
        interval = 1;
    }

    setReviewSchedule((prev) => ({
      ...prev,
      [segmentKey]: {
        nextReview: now + interval * 24 * 60 * 60 * 1000,
        interval,
        difficulty,
        performance,
        reviewCount: (prev[segmentKey]?.reviewCount || 0) + 1,
      },
    }));
  }, []);

  const getNextReview = useCallback((segmentKey: string): number => {
    return reviewSchedule[segmentKey]?.nextReview || 0;
  }, [reviewSchedule]);

  return { scheduleReview, getNextReview, reviewSchedule };
};

/**
 * Comparison Matrix Component
 */
interface ComparisonMatrixProps {
  segments: string[];
  antibiotic?: Antibiotic;
  onSegmentFocus?: (segment: string) => void;
}

const ComparisonMatrix: FC<ComparisonMatrixProps> = ({ segments, antibiotic, onSegmentFocus }) => {
  if (segments.length < 2) return null;

  return (
    <div className="comparison-matrix mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-3">Coverage Comparison</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border-b border-gray-200">Pathogen</th>
              <th className="text-center p-2 border-b border-gray-200">Coverage</th>
              <th className="text-center p-2 border-b border-gray-200">Clinical Rec.</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((segment) => {
              const coverage = antibiotic?.northwesternSpectrum?.[segment] || 0;
              const coverageData = COVERAGE_CLINICAL[coverage] || {};
              const clinicalData = CLINICAL_DATABASE[segment] || {};

              return (
                <tr
                  key={segment}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSegmentFocus?.(segment)}
                >
                  <td className="p-2 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-sm">{segment.replace('_', ' ')}</div>
                      <div className="text-xs text-gray-600 truncate">{clinicalData.fullName}</div>
                    </div>
                  </td>
                  <td className="p-2 border-b border-gray-100 text-center">
                    <span
                      className={`inline-block w-8 h-8 rounded text-white text-sm font-bold leading-8 ${
                        coverage === 0 ? 'bg-red-500' : coverage === 1 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    >
                      {coverage}
                    </span>
                  </td>
                  <td className="p-2 border-b border-gray-100 text-center">
                    <span className={`text-xs px-2 py-1 rounded ${coverageData.color} ${coverageData.bgColor}`}>
                      {coverageData.urgency}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Clinical Scenario Component
 */
interface ClinicalScenarioProps {
  scenario: ClinicalScenario;
  onComplete?: (result: ScenarioCompleteResult) => void;
}

const ClinicalScenario: FC<ClinicalScenarioProps> = ({ scenario, onComplete }) => {
  const [selectedOptions, setSelectedOptions] = useState(new Set<number>());
  const [showResults, setShowResults] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handleOptionSelect = (index: number): void => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedOptions(newSelected);
  };

  const submitAnswer = (): void => {
    setShowResults(true);

    const correctSet = new Set(scenario.correct);
    const isCorrect =
      selectedOptions.size === correctSet.size && [...selectedOptions].every((option) => correctSet.has(option));

    setTimeout(() => {
      if (isCorrect) {
        setShowFollowUp(true);
      }
    }, 2000);

    onComplete?.({
      scenarioId: scenario.id,
      correct: isCorrect,
      selectedOptions: [...selectedOptions],
      correctOptions: scenario.correct,
    });
  };

  const correctSet = new Set(scenario.correct);

  return (
    <div className="clinical-scenario border border-gray-200 rounded-lg p-4 mb-4">
      <h4 className="font-bold text-lg text-gray-900 mb-2">{scenario.title}</h4>

      {/* Patient Information */}
      <div className="patient-info bg-blue-50 border border-blue-200 rounded p-3 mb-3">
        <h5 className="font-medium text-blue-800 mb-1">Patient:</h5>
        <p className="text-sm text-blue-700">{scenario.patient}</p>
        <h5 className="font-medium text-blue-800 mb-1 mt-2">Presentation:</h5>
        <p className="text-sm text-blue-700">{scenario.presentation}</p>
      </div>

      {/* Question */}
      <div className="question mb-4">
        <h5 className="font-medium text-gray-800 mb-2">Question:</h5>
        <p className="text-sm text-gray-700">{scenario.question}</p>
      </div>

      {/* Options */}
      <div className="options mb-4">
        {scenario.options.map((option, index) => {
          const isSelected = selectedOptions.has(index);
          const isCorrect = correctSet.has(index);

          let optionClass = 'border-2 rounded p-2 mb-2 cursor-pointer transition-all ';

          if (!showResults) {
            optionClass += isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300';
          } else {
            if (isCorrect) {
              optionClass += 'border-green-500 bg-green-50';
            } else if (isSelected && !isCorrect) {
              optionClass += 'border-red-500 bg-red-50';
            } else {
              optionClass += 'border-gray-200 bg-gray-50';
            }
          }

          return (
            <div
              key={index}
              className={optionClass}
              onClick={() => !showResults && handleOptionSelect(index)}
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                </div>
                <span className="text-sm">{option}</span>
                {showResults && isCorrect && <span className="text-green-600">✓</span>}
                {showResults && isSelected && !isCorrect && <span className="text-red-600">✗</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!showResults && (
        <button
          onClick={submitAnswer}
          disabled={selectedOptions.size === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Submit Answer
        </button>
      )}

      {/* Results */}
      {showResults && (
        <div className="results mt-4 p-3 border rounded">
          <h5 className="font-medium text-gray-800 mb-2">Explanation:</h5>
          <p className="text-sm text-gray-700">{scenario.rationale}</p>

          {showFollowUp && scenario.followUp && (
            <div className="follow-up mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <h6 className="font-medium text-yellow-800">Follow-up Question:</h6>
              <p className="text-sm text-yellow-700">{scenario.followUp}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Learning Progress Tracker Component
 */
interface LearningProgressTrackerProps {
  segments: string[];
  educationLevel: string;
  completedObjectives: number;
  totalObjectives: number;
}

const LearningProgressTracker: FC<LearningProgressTrackerProps> = ({
  segments,
  educationLevel,
  completedObjectives,
  totalObjectives,
}) => {
  const progress = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0;

  return (
    <div className="learning-progress bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-800">Learning Progress</h4>
        <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Segment Progress */}
      <div className="segment-progress">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Segments Explored:</h5>
        <div className="flex flex-wrap gap-2">
          {segments.map((segment) => (
            <span key={segment} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              {segment.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Main Detail Panel Component
 */
const DetailPanel: FC<DetailPanelProps> = ({
  segments = [],
  antibiotic,
  educationLevel = 'resident',
  onLearningComplete,
  onSegmentFocus,
  onClose,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'scenarios' | 'objectives'>('overview');
  const [completedScenarios, setCompletedScenarios] = useState(new Set<string>());
  const [completedObjectives, setCompletedObjectives] = useState(0);
  const { scheduleReview, reviewSchedule } = useSpacedRepetition();

  // Calculate total learning objectives
  const totalObjectives = useMemo(() => {
    return segments.reduce((total, segment) => {
      const objectives = LEARNING_OBJECTIVES[educationLevel]?.[segment] || [];
      return total + objectives.length;
    }, 0);
  }, [segments, educationLevel]);

  const handleScenarioComplete = useCallback(
    (result: ScenarioCompleteResult): void => {
      setCompletedScenarios((prev) => new Set([...prev, result.scenarioId]));

      // Schedule spaced repetition review
      const difficulty = result.correct ? 'easy' : 'hard';
      const performance = result.correct ? 'easy' : 'hard';

      segments.forEach((segment) => {
        scheduleReview(segment, difficulty, performance);
      });

      // Update learning progress
      if (result.correct) {
        setCompletedObjectives((prev) => Math.min(prev + 1, totalObjectives));
      }

      // Report to parent component
      onLearningComplete?.({
        type: 'scenario_complete',
        result,
        progress: {
          completedScenarios: completedScenarios.size + 1,
          completedObjectives: result.correct ? completedObjectives + 1 : completedObjectives,
          totalObjectives,
        },
      });
    },
    [segments, scheduleReview, completedScenarios, completedObjectives, totalObjectives, onLearningComplete]
  );

  // Get relevant clinical scenarios
  const relevantScenarios = useMemo(() => {
    return segments.flatMap(
      (segment) =>
        CLINICAL_SCENARIOS[segment]?.filter(
          (scenario) => scenario.level === educationLevel || educationLevel === 'attending'
        ) || []
    );
  }, [segments, educationLevel]);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', count: segments.length },
    { id: 'comparison' as const, label: 'Compare', count: segments.length > 1 ? segments.length : 0 },
    { id: 'scenarios' as const, label: 'Cases', count: relevantScenarios.length },
    { id: 'objectives' as const, label: 'Learning', count: totalObjectives },
  ];

  return (
    <div className={`detail-panel bg-white border border-gray-300 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="panel-header border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{antibiotic?.name} - Clinical Analysis</h2>
            <p className="text-sm text-gray-600">
              {segments.length} segment{segments.length !== 1 ? 's' : ''} selected • {educationLevel} level
            </p>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation border-b border-gray-200">
        <div className="flex">
          {tabs
            .filter((tab) => tab.count > 0)
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content p-4 max-h-96 overflow-y-auto">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            <LearningProgressTracker
              segments={segments}
              educationLevel={educationLevel}
              completedObjectives={completedObjectives}
              totalObjectives={totalObjectives}
            />

            {/* Segment Details */}
            {segments.map((segment) => {
              const coverage = antibiotic?.northwesternSpectrum?.[segment] || 0;
              const coverageData = COVERAGE_CLINICAL[coverage] || {};
              const clinicalData = CLINICAL_DATABASE[segment] || {};

              return (
                <div key={segment} className="segment-detail mb-4 p-3 border border-gray-200 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{segment.replace('_', ' ')}</h4>
                    <span className={`px-2 py-1 rounded text-sm ${coverageData.color} ${coverageData.bgColor}`}>
                      {coverage}/2 - {coverageData.text}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{clinicalData.fullName}</p>
                  <p className="text-xs text-gray-600">{clinicalData.clinicalSignificance}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && segments.length > 1 && (
          <ComparisonMatrix segments={segments} antibiotic={antibiotic} onSegmentFocus={onSegmentFocus} />
        )}

        {/* Clinical Scenarios Tab */}
        {activeTab === 'scenarios' && relevantScenarios.length > 0 && (
          <div className="scenarios-content">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Clinical Cases</h3>
            {relevantScenarios.map((scenario) => (
              <ClinicalScenario
                key={scenario.id}
                scenario={scenario}
                onComplete={handleScenarioComplete}
              />
            ))}
          </div>
        )}

        {/* Learning Objectives Tab */}
        {activeTab === 'objectives' && (
          <div className="objectives-content">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Learning Objectives</h3>
            {segments.map((segment) => {
              const objectives = LEARNING_OBJECTIVES[educationLevel]?.[segment] || [];
              if (objectives.length === 0) return null;

              return (
                <div key={segment} className="segment-objectives mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">{segment.replace('_', ' ')}</h4>
                  <ul className="space-y-1">
                    {objectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-4 h-4 border border-gray-300 rounded mt-0.5"></div>
                        <span className="text-sm text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPanel;

// Export learning components and scenarios for testing
export { ComparisonMatrix, ClinicalScenario, LearningProgressTracker, CLINICAL_SCENARIOS, LEARNING_OBJECTIVES, useSpacedRepetition };
