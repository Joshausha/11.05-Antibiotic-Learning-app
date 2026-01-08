/**
 * Northwestern Quiz Component
 * Visual quiz component that integrates Northwestern pie charts into quiz questions
 * Supports interactive visual learning with pie chart-based questions
 *
 * Created by: Agent 2.5 - Component Integration Guardian
 * Date: 2025-08-18
 */

import React, { useState, useMemo, useCallback, FC } from 'react';
import { PieChart, Target, Brain, CheckCircle, X } from 'lucide-react';
import NorthwesternPieChart from './NorthwesternPieChart';
import AntibioticCard from './AntibioticCard';
import { getAntibioticByName } from '../data/EnhancedAntibioticData';

// Types
interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  visualComponent?: boolean;
  targetSegment?: string;
}

interface Antibiotic {
  id?: string | number;
  name: string;
  northwesternSpectrum?: Record<string, number>;
  [key: string]: any;
}

interface NorthwesternQuizComponentProps {
  question: Question;
  currentAnswer?: number | null;
  onAnswerSelect?: (index: number) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}

const NorthwesternQuizComponent: FC<NorthwesternQuizComponentProps> = ({
  question,
  currentAnswer,
  onAnswerSelect,
  showResult = false,
  isCorrect = false,
}) => {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Find relevant antibiotic for visualization
  const relevantAntibiotic = useMemo((): any => {
    if (!question.visualComponent) return null;

    // Try to extract antibiotic name from question or options
    const questionText = question.question.toLowerCase();
    const optionsText = question.options.join(' ').toLowerCase();
    const combinedText = `${questionText} ${optionsText}`;

    // Common antibiotic names to search for
    const antibioticNames = [
      'vancomycin',
      'ceftriaxone',
      'azithromycin',
      'ciprofloxacin',
      'piperacillin-tazobactam',
      'piperacillin',
      'meropenem',
      'ceftazidime',
      'linezolid',
      'daptomycin',
      'penicillin',
      'amoxicillin',
      'cefazolin',
    ];

    for (const name of antibioticNames) {
      if (combinedText.includes(name)) {
        const antibiotic = getAntibioticByName(name);
        if (antibiotic) return antibiotic;
      }
    }

    // If no specific antibiotic found, return a representative one based on target segment
    if (question.targetSegment === 'MRSA') {
      return getAntibioticByName('vancomycin');
    } else if (question.targetSegment === 'pseudomonas') {
      return getAntibioticByName('piperacillin-tazobactam');
    } else if (question.targetSegment === 'atypicals') {
      return getAntibioticByName('azithromycin');
    }

    return getAntibioticByName('ceftriaxone'); // Default fallback
  }, [question]);

  // Handle segment interactions
  const handleSegmentHover = useCallback(
    (segmentKey: string, event: React.MouseEvent, context?: any): void => {
      setSelectedSegment(segmentKey);
    },
    []
  );

  const handleSegmentClick = useCallback(
    (segmentKey: string, event: React.MouseEvent, context?: any): void => {
      if (question.targetSegment === segmentKey) {
        // Provide visual feedback for correct segment
        setShowDetailedView(true);
      }
    },
    [question.targetSegment]
  );

  // Render visual component based on question type
  const renderVisualComponent = (): JSX.Element | null => {
    if (!question.visualComponent || !relevantAntibiotic) {
      return null;
    }

    return (
      <div className="my-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieChart size={20} className="text-blue-600" />
            <h4 className="font-medium text-blue-800">Northwestern Coverage Analysis</h4>
          </div>
          <button
            onClick={() => setShowDetailedView(!showDetailedView)}
            className="text-xs text-blue-600 hover:text-blue-800 bg-blue-100 px-2 py-1 rounded-full"
          >
            {showDetailedView ? 'Simple' : 'Detailed'} View
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <NorthwesternPieChart
            antibiotic={relevantAntibiotic as any}
            size="large"
            interactive={true}
            showLabels={showDetailedView}
            onSegmentHover={handleSegmentHover as any}
            onSegmentClick={handleSegmentClick as any}
            selectedSegments={
              selectedSegment
                ? [selectedSegment]
                : question.targetSegment && question.targetSegment !== 'multiple'
                  ? [question.targetSegment]
                  : []
            }
            educationLevel="resident"
            emergencyMode={false}
            className="cursor-pointer"
          />
        </div>

        {/* Visual hints and feedback */}
        {selectedSegment && (
          <div className="p-3 bg-white rounded-lg border border-blue-200 mb-3">
            <div className="text-sm">
              <span className="font-medium text-blue-900">{selectedSegment.replace('_', ' ')} Coverage:</span>
              <span className="ml-2">
                {relevantAntibiotic.northwesternSpectrum?.[selectedSegment] === 0 && (
                  <span className="text-red-600 font-medium">No coverage</span>
                )}
                {relevantAntibiotic.northwesternSpectrum?.[selectedSegment] === 1 && (
                  <span className="text-yellow-600 font-medium">Moderate coverage</span>
                )}
                {relevantAntibiotic.northwesternSpectrum?.[selectedSegment] === 2 && (
                  <span className="text-green-600 font-medium">Good coverage</span>
                )}
              </span>
            </div>

            {/* Segment description */}
            <div className="text-xs text-gray-600 mt-1">
              {selectedSegment === 'MRSA' && 'Methicillin-resistant Staph aureus - Major healthcare concern'}
              {selectedSegment === 'VRE_faecium' && 'Vancomycin-resistant Enterococcus - Challenging to treat'}
              {selectedSegment === 'anaerobes' && 'Anaerobic bacteria - Common in abdominal infections'}
              {selectedSegment === 'atypicals' && 'Atypical pathogens - Respiratory infections'}
              {selectedSegment === 'pseudomonas' && 'P. aeruginosa - Opportunistic gram-negative'}
              {selectedSegment === 'gramNegative' && 'Gram-negative bacteria - Broad category'}
              {selectedSegment === 'MSSA' && 'Methicillin-sensitive Staph aureus'}
              {selectedSegment === 'enterococcus_faecalis' && 'Enterococcus faecalis - UTIs and bacteremia'}
            </div>
          </div>
        )}

        {/* Interactive hint for target segment */}
        {question.targetSegment &&
          question.targetSegment !== 'multiple' &&
          question.targetSegment !== 'visual' &&
          !showResult && (
            <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded-lg">
              <Target size={12} className="inline mr-1" />
              Hint: Focus on the <span className="font-medium">{question.targetSegment.replace('_', ' ')}</span> segment
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="northwestern-quiz-component">
      {/* Question */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain size={20} className="text-purple-600" />
          <span className="text-sm font-medium text-purple-800">Northwestern Learning Question</span>
          {question.visualComponent && (
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Visual</span>
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{question.question}</h3>
      </div>

      {/* Visual Component */}
      {renderVisualComponent()}

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect?.(index)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              currentAnswer === index
                ? showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-red-500 bg-red-50 text-red-800'
                  : 'border-blue-500 bg-blue-50 text-blue-800'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex-1">{option}</span>
              {showResult && (
                <div className="ml-2">
                  {currentAnswer === index &&
                    (isCorrect ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <X size={20} className="text-red-600" />
                    ))}
                  {index === question.correct && currentAnswer !== index && (
                    <CheckCircle size={20} className="text-green-600" />
                  )}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showResult && (
        <div
          className={`p-4 rounded-lg border ${
            isCorrect ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'
          }`}
        >
          <div className="flex items-start gap-2">
            <div className={`p-1 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-orange-100'}`}>
              {isCorrect ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <Brain size={16} className="text-orange-600" />
              )}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium mb-2 ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                {isCorrect ? 'Correct!' : 'Learning Opportunity'}
              </h4>
              <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NorthwesternQuizComponent;
