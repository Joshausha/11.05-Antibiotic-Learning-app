/**
 * HomeTab Component
 * Displays the landing page with app overview and feature highlights
 * 
 * Props:
 * - setActiveTab: function - function to change the active tab
 */

import React, { memo } from 'react';
import { BookOpen, Target, Brain, TrendingUp, Award, Microscope, Pill, Shield } from 'lucide-react';
import { ProgressBar, CircularProgress, LearningProgress, MedicalTopicProgress } from './ProgressIndicator';

const HomeTab = ({ setActiveTab = () => {} }) => {
  // Mock user progress data for demonstration
  const userProgress = {
    totalQuizzes: 3,
    averageScore: 85,
    sectionsCompleted: 2,
    totalSections: 6,
    weeklyGoal: 5,
    weeklyProgress: 3
  };

  // Medical topic progress data
  const medicalTopics = {
    pathogenMastery: 75,
    antibioticKnowledge: 82,
    clinicalScenarios: 68,
    resistancePatterns: 54
  };

  // Learning sections with medical context
  const learningSections = [
    { name: "Pathogens", type: "pathogen", completed: true, score: 88 },
    { name: "Antibiotics", type: "antibiotic", completed: true, score: 78 },
    { name: "Clinical Cases", type: "clinical", completed: false, score: 65 },
    { name: "Resistance Patterns", type: "resistance", completed: false, score: 45 },
    { name: "Quiz Mastery", type: "quiz", completed: false, score: 72 }
  ];
  const handleNavigation = (tabName) => {
    try {
      setActiveTab(tabName);
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  const handleKeyDown = (event, tabName) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(tabName);
    }
  };

  return (
    <main role="main">
      {/* Hero Section */}
      <section className="text-center mb-12" aria-labelledby="hero-heading">
        <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Medical Learning App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Master infectious diseases and antimicrobial therapy with evidence-based clinical guidelines
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            type="button"
            className="btn-primary px-8 py-3 text-lg"
            onClick={() => handleNavigation('quiz')}
            onKeyDown={(e) => handleKeyDown(e, 'quiz')}
            aria-label="Take a quiz to test your medical knowledge"
          >
            Take a Quiz
          </button>
          <button 
            type="button"
            className="btn-secondary px-8 py-3 text-lg"
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

      {/* Quick Actions Section */}
      <section className="bg-white rounded-xl shadow-sm border p-8 mb-12" aria-labelledby="quick-actions-heading">
        <h3 id="quick-actions-heading" className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" role="group" aria-labelledby="quick-actions-heading">
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

          <button
            type="button"
            className="flex flex-col items-center gap-3 p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('pathogen-explorer')}
            onKeyDown={(e) => handleKeyDown(e, 'pathogen-explorer')}
            aria-label="Explore Pathogens - Study bacterial characteristics and identification"
          >
            <div className="p-3 bg-purple-100 rounded-full">
              <Microscope size={24} className="text-purple-600" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-gray-900">Explore Pathogens</h3>
            <p className="text-sm text-gray-600 text-center">Study bacterial characteristics and identification</p>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-3 p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('antibiotic-explorer')}
            onKeyDown={(e) => handleKeyDown(e, 'antibiotic-explorer')}
            aria-label="Antibiotic Database - Browse drug mechanisms and clinical uses"
          >
            <div className="p-3 bg-green-100 rounded-full">
              <Pill size={24} className="text-green-600" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-gray-900">Antibiotic Database</h3>
            <p className="text-sm text-gray-600 text-center">Browse drug mechanisms and clinical uses</p>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-3 p-6 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('resistance')}
            onKeyDown={(e) => handleKeyDown(e, 'resistance')}
            aria-label="Resistance Patterns - Learn about antimicrobial resistance mechanisms"
          >
            <div className="p-3 bg-red-100 rounded-full">
              <Shield size={24} className="text-red-600" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-gray-900">Resistance Patterns</h3>
            <p className="text-sm text-gray-600 text-center">Learn about antimicrobial resistance mechanisms</p>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-3 p-6 border-2 border-yellow-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('analytics')}
            onKeyDown={(e) => handleKeyDown(e, 'analytics')}
            aria-label="Learning Analytics - Track your progress and performance trends"
          >
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp size={24} className="text-yellow-600" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-gray-900">Learning Analytics</h3>
            <p className="text-sm text-gray-600 text-center">Track your progress and performance trends</p>
          </button>
          
          <button
            type="button"
            className="flex flex-col items-center gap-3 p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('reference')}
            onKeyDown={(e) => handleKeyDown(e, 'reference')}
            aria-label="Pathogen Explorer - Discover pathogens and antibiotics"
          >
            <div className="p-3 bg-purple-100 rounded-full">
              <Target size={24} className="text-purple-600" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-gray-900">Pathogen Explorer</h3>
            <p className="text-sm text-gray-600 text-center">Discover pathogens and antibiotics</p>
          </button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-3 gap-8" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">Key Features</h2>
        
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border" role="region" aria-labelledby="clinical-guidelines-heading">
          <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
            <BookOpen size={24} className="text-blue-600" aria-hidden="true" />
          </div>
          <h2 id="clinical-guidelines-heading" className="text-xl font-semibold mb-2">Clinical Guidelines</h2>
          <p className="text-gray-600">
            Evidence-based treatment protocols from leading medical societies and pediatric infectious disease experts.
          </p>
        </div>
        
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border" role="region" aria-labelledby="targeted-learning-heading">
          <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
            <Target size={24} className="text-blue-600" aria-hidden="true" />
          </div>
          <h2 id="targeted-learning-heading" className="text-xl font-semibold mb-2">Targeted Learning</h2>
          <p className="text-gray-600">
            Focus on high-yield infectious disease conditions commonly encountered in clinical practice.
          </p>
        </div>
        
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border" role="region" aria-labelledby="interactive-quizzes-heading">
          <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
            <Brain size={24} className="text-blue-600" aria-hidden="true" />
          </div>
          <h2 id="interactive-quizzes-heading" className="text-xl font-semibold mb-2">Interactive Quizzes</h2>
          <p className="text-gray-600">
            Test your knowledge with case-based questions and detailed explanations for each answer.
          </p>
        </div>
      </section>

      {/* Enhanced Progress Indicators Section */}
      <section className="mt-12 grid md:grid-cols-2 gap-8" aria-labelledby="detailed-progress-heading">
        <h2 id="detailed-progress-heading" className="sr-only">Detailed Learning Progress</h2>
        
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
      </section>
    </main>
  );
};

export default HomeTab;