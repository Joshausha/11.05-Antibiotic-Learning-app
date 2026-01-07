import React, { FC } from 'react';
import { Network, GitCompare, Brain, ArrowRight } from 'lucide-react';
import type { TabType } from '../types/app.types';

/**
 * LearningHub - Central dashboard for the Antibiotic Learning App
 *
 * Implements the "hub & spoke" navigation model where users start here
 * and navigate to specific learning modes (Explore, Compare, Quiz).
 *
 * Phase 6 Plan 1: Multi-Modal Learning Flow foundation
 */

interface LearningHubProps {
  onNavigate: (tab: TabType) => void;
}

interface ModeCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  bgColor: string;
  targetTab: TabType;
}

const LearningHub: FC<LearningHubProps> = ({ onNavigate }) => {
  const modeCards: ModeCard[] = [
    {
      id: 'explore',
      title: 'Explore',
      description: 'See how antibiotics connect to pathogens. Discover coverage patterns through interactive network visualization.',
      icon: <Network className="w-12 h-12" />,
      color: 'text-blue-600',
      hoverColor: 'hover:border-blue-400 hover:shadow-blue-100',
      bgColor: 'bg-blue-50',
      targetTab: 'visualizations',
    },
    {
      id: 'compare',
      title: 'Compare',
      description: 'Put antibiotics side-by-side to understand similarities and differences in coverage, formulation, and mechanism.',
      icon: <GitCompare className="w-12 h-12" />,
      color: 'text-green-600',
      hoverColor: 'hover:border-green-400 hover:shadow-green-100',
      bgColor: 'bg-green-50',
      targetTab: 'comparison',
    },
    {
      id: 'quiz',
      title: 'Quiz',
      description: 'Test your antibiotic knowledge with board-prep style questions. Get detailed explanations for every answer.',
      icon: <Brain className="w-12 h-12" />,
      color: 'text-purple-600',
      hoverColor: 'hover:border-purple-400 hover:shadow-purple-100',
      bgColor: 'bg-purple-50',
      targetTab: 'quiz',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Antibiotic Learning Hub
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose a learning mode to build your antibiotic knowledge. Each mode offers a different approach to mastering pathogen coverage.
        </p>
      </div>

      {/* Mode Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modeCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.targetTab)}
            className={`
              group relative bg-white rounded-xl border-2 border-gray-200 p-6
              transition-all duration-200 ease-in-out
              ${card.hoverColor}
              hover:shadow-lg hover:-translate-y-1
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              text-left
            `}
          >
            {/* Icon */}
            <div className={`${card.bgColor} ${card.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
              {card.icon}
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {card.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {card.description}
            </p>

            {/* Start Button */}
            <div className={`
              inline-flex items-center gap-2 ${card.color} font-medium text-sm
              group-hover:gap-3 transition-all duration-200
            `}>
              Start
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>

      {/* Optional: Quick tip or guidance */}
      <div className="text-center text-sm text-gray-500 mt-8">
        <p>
          <strong>Tip:</strong> Start with <span className="text-blue-600">Explore</span> to visualize relationships,
          then <span className="text-green-600">Compare</span> similar antibiotics,
          and test yourself with the <span className="text-purple-600">Quiz</span>.
        </p>
      </div>
    </div>
  );
};

export default LearningHub;
