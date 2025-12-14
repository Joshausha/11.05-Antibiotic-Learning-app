/**
 * HomeTab Component
 * Displays the landing page with app overview and feature highlights
 *
 * Props:
 * - setActiveTab: function - function to change the active tab
 */

import React, { memo, useState } from 'react';
import { BookOpen, Target, Brain, TrendingUp, Award, Microscope, Pill, Shield, ChevronDown } from 'lucide-react';
import { ProgressBar, CircularProgress, LearningProgress, MedicalTopicProgress } from './ProgressIndicator';

interface HomeTabProps {
  setActiveTab?: (tab: string) => void;
}

interface ExpandedSections {
  moreTools: boolean;
  detailedProgress: boolean;
}

interface UserProgress {
  totalQuizzes: number;
  averageScore: number;
  sectionsCompleted: number;
  totalSections: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

interface LearningSection {
  name: string;
  type: 'pathogen' | 'antibiotic' | 'clinical' | 'resistance' | 'quiz';
  completed: boolean;
  score: number;
}

interface MedicalTopics {
  pathogenMastery: number;
  antibioticKnowledge: number;
  clinicalScenarios: number;
  resistancePatterns: number;
}

const HomeTab: React.FC<HomeTabProps> = ({ setActiveTab = () => {} }) => {
  // Progressive Disclosure State (Phase 1.2: HomeTab Simplification)
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    moreTools: false,
    detailedProgress: false
  });

  const toggleSection = (section: keyof ExpandedSections): void => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mock user progress data for demonstration
  const userProgress: UserProgress = {
    totalQuizzes: 3,
    averageScore: 85,
    sectionsCompleted: 2,
    totalSections: 6,
    weeklyGoal: 5,
    weeklyProgress: 3
  };

  // Medical topic progress data
  const medicalTopics: MedicalTopics = {
    pathogenMastery: 75,
    antibioticKnowledge: 82,
    clinicalScenarios: 68,
    resistancePatterns: 54
  };

  // Learning sections with medical context
  const learningSections: LearningSection[] = [
    { name: "Pathogens", type: "pathogen", completed: true, score: 88 },
    { name: "Antibiotics", type: "antibiotic", completed: true, score: 78 },
    { name: "Clinical Cases", type: "clinical", completed: false, score: 65 },
    { name: "Resistance Patterns", type: "resistance", completed: false, score: 45 },
    { name: "Quiz Mastery", type: "quiz", completed: false, score: 72 }
  ];

  const handleNavigation = (tabName: string): void => {
    try {
      setActiveTab(tabName);
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, tabName: string): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(tabName);
    }
  };

  return (
    <main role="main">
      {/* Hero Section */}
      <section className="text-center mb-12 py-8 px-4 bg-gradient-to-br from-blue-50 via-white to-slate-50 rounded-2xl" aria-labelledby="hero-heading">
        <h1 id="hero-heading" className="font-display text-display-xl md:text-5xl mb-4 animate-fade-in-up">
          <span className="sr-only">Medical Learning App</span>
          <span aria-hidden="true">
            <span className="text-transparent bg-clip-text bg-gradient-clinical">Medical</span>{' '}
            <span className="text-gray-900">Learning App</span>
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 animate-fade-in-up animation-delay-100">
          Master infectious diseases and antimicrobial therapy with evidence-based clinical guidelines
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-200">
          <button
            type="button"
            className="bg-gradient-clinical text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-clinical-md hover:shadow-clinical-lg active:scale-[0.98] transition-all duration-200"
            onClick={() => handleNavigation('quiz')}
            onKeyDown={(e) => handleKeyDown(e, 'quiz')}
            aria-label="Take a quiz to test your medical knowledge"
          >
            Take a Quiz
          </button>
          <button
            type="button"
            className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-3 text-lg font-semibold rounded-xl shadow-clinical hover:border-blue-300 hover:shadow-clinical-md active:scale-[0.98] transition-all duration-200"
            onClick={() => handleNavigation('reference')}
            onKeyDown={(e) => handleKeyDown(e, 'reference')}
            aria-label="Browse medical reference materials"
          >
            Browse Reference
          </button>
        </div>
      </section>

      {/* Progress Dashboard */}
      {userProgress.totalQuizzes > 0 && (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" aria-labelledby="progress-heading">
          <h2 id="progress-heading" className="sr-only">Learning Progress Dashboard</h2>

          <div className="card text-center" role="region" aria-labelledby="learning-progress-heading">
            <div className="flex items-center justify-center mb-4">
              <CircularProgress
                progress={userProgress.sectionsCompleted}
                total={userProgress.totalSections}
                size="lg"
                color="green"
                aria-label={`Learning progress: ${userProgress.sectionsCompleted} of ${userProgress.totalSections} sections completed`}
              />
            </div>
            <h3 id="learning-progress-heading" className="text-lg font-semibold mb-2">Learning Progress</h3>
            <p className="text-gray-600">
              {userProgress.sectionsCompleted} of {userProgress.totalSections} sections completed
            </p>
          </div>

          <div className="card text-center" role="region" aria-labelledby="average-score-heading">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <TrendingUp className="text-blue-600" size={24} aria-hidden="true" />
              </div>
            </div>
            <h3 id="average-score-heading" className="text-lg font-semibold mb-2">Average Score</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2" aria-label={`Average quiz score: ${userProgress.averageScore} percent`}>
              {userProgress.averageScore}%
            </p>
            <p className="text-gray-600">Based on {userProgress.totalQuizzes} quizzes</p>
          </div>

          <div className="card" role="region" aria-labelledby="weekly-goal-heading">
            <div className="flex items-center justify-between mb-4">
              <h3 id="weekly-goal-heading" className="text-lg font-semibold">Weekly Goal</h3>
              <Award className="text-yellow-600" size={20} aria-hidden="true" />
            </div>
            <ProgressBar
              progress={userProgress.weeklyProgress}
              total={userProgress.weeklyGoal}
              showStats={true}
              color="yellow"
              aria-label={`Weekly goal progress: ${userProgress.weeklyProgress} of ${userProgress.weeklyGoal} quizzes completed`}
            />
            <p className="text-sm text-gray-600 mt-2">
              {userProgress.weeklyProgress} of {userProgress.weeklyGoal} quizzes this week
            </p>
          </div>
        </section>
      )}

      {/* Primary Actions Section (Phase 1.2: Simplified to 2 main CTAs) */}
      <section className="bg-white rounded-xl shadow-sm border p-8 mb-12" aria-labelledby="primary-actions-heading">
        <h2 id="primary-actions-heading" className="text-2xl font-bold text-gray-900 mb-6 text-center">Get Started Learning</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-6" role="group" aria-labelledby="primary-actions-heading">
          <button
            type="button"
            className="flex flex-col items-center gap-3 p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('quiz')}
            onKeyDown={(e) => handleKeyDown(e, 'quiz')}
            aria-label="Take a quiz - Test your knowledge with clinical cases"
          >
            <div className="p-3 bg-blue-100 rounded-full">
              <Brain size={24} className="text-blue-600" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-gray-900">Take a Quiz</h3>
            <p className="text-sm text-gray-600 text-center">Test your knowledge with clinical cases</p>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-3 p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('reference')}
            onKeyDown={(e) => handleKeyDown(e, 'reference')}
            aria-label="Browse Conditions - Explore medical conditions and treatments"
          >
            <div className="p-3 bg-green-100 rounded-full">
              <BookOpen size={24} className="text-green-600" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-gray-900">Browse Conditions</h3>
            <p className="text-sm text-gray-600 text-center">Explore medical conditions and treatments</p>
          </button>
        </div>

        {/* Section Divider */}
        <div className="section-divider"></div>

        {/* Collapsible: More Learning Tools (Phase 1.2: Progressive Disclosure) */}
        <div className="pt-2">
          <button
            onClick={() => toggleSection('moreTools')}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <span className={`transition-transform duration-200 ${expandedSections.moreTools ? 'rotate-180' : ''}`}>
              <ChevronDown size={16} />
            </span>
            {expandedSections.moreTools ? 'Show fewer tools' : 'Explore more learning tools'}
          </button>

          {expandedSections.moreTools && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6" role="group">
              <button
                type="button"
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 touch-manipulation text-sm"
                onClick={() => handleNavigation('pathogen-explorer')}
                onKeyDown={(e) => handleKeyDown(e, 'pathogen-explorer')}
                aria-label="Explore Pathogens - Study bacterial characteristics"
              >
                <Microscope size={20} className="text-purple-600" aria-hidden="true" />
                <h4 className="font-semibold text-gray-900">Explore Pathogens</h4>
                <p className="text-xs text-gray-600 text-center">Bacterial characteristics</p>
              </button>

              <button
                type="button"
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 touch-manipulation text-sm"
                onClick={() => handleNavigation('antibiotic-explorer')}
                onKeyDown={(e) => handleKeyDown(e, 'antibiotic-explorer')}
                aria-label="Antibiotic Database - Browse drug mechanisms"
              >
                <Pill size={20} className="text-green-600" aria-hidden="true" />
                <h4 className="font-semibold text-gray-900">Antibiotic Database</h4>
                <p className="text-xs text-gray-600 text-center">Drug mechanisms</p>
              </button>

              <button
                type="button"
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 touch-manipulation text-sm"
                onClick={() => handleNavigation('resistance')}
                onKeyDown={(e) => handleKeyDown(e, 'resistance')}
                aria-label="Resistance Patterns - Antimicrobial resistance"
              >
                <Shield size={20} className="text-red-600" aria-hidden="true" />
                <h4 className="font-semibold text-gray-900">Resistance Patterns</h4>
                <p className="text-xs text-gray-600 text-center">Resistance mechanisms</p>
              </button>

              <button
                type="button"
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 touch-manipulation text-sm"
                onClick={() => handleNavigation('analytics')}
                onKeyDown={(e) => handleKeyDown(e, 'analytics')}
                aria-label="Learning Analytics - Track progress"
              >
                <TrendingUp size={20} className="text-yellow-600" aria-hidden="true" />
                <h4 className="font-semibold text-gray-900">Learning Analytics</h4>
                <p className="text-xs text-gray-600 text-center">Track your progress</p>
              </button>

              <button
                type="button"
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 touch-manipulation text-sm"
                onClick={() => handleNavigation('reference')}
                onKeyDown={(e) => handleKeyDown(e, 'reference')}
                aria-label="Pathogen Explorer - Discover relationships"
              >
                <Target size={20} className="text-indigo-600" aria-hidden="true" />
                <h4 className="font-semibold text-gray-900">Pathogen Explorer</h4>
                <p className="text-xs text-gray-600 text-center">Discover relationships</p>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Collapsible: Detailed Learning Progress (Phase 1.2: Progressive Disclosure) */}
      <section className="mt-4" aria-labelledby="detailed-progress-heading">
        <h2 id="detailed-progress-heading" className="sr-only">Detailed Learning Progress</h2>

        <button
          onClick={() => toggleSection('detailedProgress')}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all duration-200 mb-4"
        >
          <span className={`transition-transform duration-200 ${expandedSections.detailedProgress ? 'rotate-180' : ''}`}>
            <ChevronDown size={16} />
          </span>
          {expandedSections.detailedProgress ? 'Hide detailed progress' : 'Show detailed progress analytics'}
        </button>

        {expandedSections.detailedProgress && (
          <div className="grid md:grid-cols-2 gap-8">
            <LearningProgress
              sections={learningSections}
              className="h-fit"
              aria-label="Learning sections progress breakdown"
            />

            <MedicalTopicProgress
              topicData={medicalTopics}
              className="h-fit"
              aria-label="Medical topic mastery levels"
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default memo(HomeTab);
