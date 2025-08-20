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

const HomeTab = ({ setActiveTab }) => {
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
    { name: "Pathogens", type: "pathogen", completed: true, score: 85 },
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
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Medical Learning App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Master infectious diseases and antimicrobial therapy with evidence-based clinical guidelines
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="btn-primary px-8 py-3 text-lg"
            onClick={() => handleNavigation('quiz')}
            onKeyDown={(e) => handleKeyDown(e, 'quiz')}
          >
            Take a Quiz
          </button>
          <button 
            className="btn-secondary px-8 py-3 text-lg"
            onClick={() => handleNavigation('reference')}
            onKeyDown={(e) => handleKeyDown(e, 'reference')}
          >
            Browse Reference
          </button>
        </div>
      </div>

      {/* Progress Dashboard */}
      {userProgress.totalQuizzes > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <div className="flex items-center justify-center mb-4">
              <CircularProgress 
                progress={userProgress.sectionsCompleted}
                total={userProgress.totalSections}
                size="lg"
                color="green"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">Learning Progress</h3>
            <p className="text-gray-600">
              {userProgress.sectionsCompleted} of {userProgress.totalSections} sections completed
            </p>
          </div>

          <div className="card text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Average Score</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">{userProgress.averageScore}%</p>
            <p className="text-gray-600">Based on {userProgress.totalQuizzes} quizzes</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Weekly Goal</h3>
              <Award className="text-yellow-600" size={20} />
            </div>
            <ProgressBar 
              progress={userProgress.weeklyProgress}
              total={userProgress.weeklyGoal}
              showStats={true}
              color="yellow"
            />
            <p className="text-sm text-gray-600 mt-2">
              {userProgress.weeklyProgress} of {userProgress.weeklyGoal} quizzes this week
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl shadow-sm border p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            className="flex flex-col items-center gap-3 p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('quiz')}
            onKeyDown={(e) => handleKeyDown(e, 'quiz')}
          >
            <div className="p-3 bg-blue-100 rounded-full">
              <Brain size={24} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Take a Quiz</h3>
            <p className="text-sm text-gray-600 text-center">Test your knowledge with clinical cases</p>
          </button>
          
          <button
            className="flex flex-col items-center gap-3 p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('reference')}
            onKeyDown={(e) => handleKeyDown(e, 'reference')}
          >
            <div className="p-3 bg-green-100 rounded-full">
              <BookOpen size={24} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Browse Conditions</h3>
            <p className="text-sm text-gray-600 text-center">Explore medical conditions and treatments</p>
          </button>

          <button
            className="flex flex-col items-center gap-3 p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('pathogen-explorer')}
            onKeyDown={(e) => handleKeyDown(e, 'pathogen-explorer')}
          >
            <div className="p-3 bg-purple-100 rounded-full">
              <Microscope size={24} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Explore Pathogens</h3>
            <p className="text-sm text-gray-600 text-center">Study bacterial characteristics and identification</p>
          </button>

          <button
            className="flex flex-col items-center gap-3 p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('antibiotic-explorer')}
            onKeyDown={(e) => handleKeyDown(e, 'antibiotic-explorer')}
          >
            <div className="p-3 bg-green-100 rounded-full">
              <Pill size={24} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Antibiotic Database</h3>
            <p className="text-sm text-gray-600 text-center">Browse drug mechanisms and clinical uses</p>
          </button>

          <button
            className="flex flex-col items-center gap-3 p-6 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('resistance')}
            onKeyDown={(e) => handleKeyDown(e, 'resistance')}
          >
            <div className="p-3 bg-red-100 rounded-full">
              <Shield size={24} className="text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Resistance Patterns</h3>
            <p className="text-sm text-gray-600 text-center">Learn about antimicrobial resistance mechanisms</p>
          </button>

          <button
            className="flex flex-col items-center gap-3 p-6 border-2 border-yellow-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('analytics')}
            onKeyDown={(e) => handleKeyDown(e, 'analytics')}
          >
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Learning Analytics</h3>
            <p className="text-sm text-gray-600 text-center">Track your progress and performance trends</p>
          </button>
          
          <button
            className="flex flex-col items-center gap-3 p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 touch-manipulation"
            onClick={() => handleNavigation('reference')}
            onKeyDown={(e) => handleKeyDown(e, 'reference')}
          >
            <div className="p-3 bg-purple-100 rounded-full">
              <Target size={24} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Pathogen Explorer</h3>
            <p className="text-sm text-gray-600 text-center">Discover pathogens and antibiotics</p>
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border">
          <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
            <BookOpen size={24} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Clinical Guidelines</h2>
          <p className="text-gray-600">
            Evidence-based treatment protocols from leading medical societies and pediatric infectious disease experts.
          </p>
        </div>
        
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border">
          <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
            <Target size={24} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Targeted Learning</h2>
          <p className="text-gray-600">
            Focus on high-yield infectious disease conditions commonly encountered in clinical practice.
          </p>
        </div>
        
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border">
          <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
            <Brain size={24} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Interactive Quizzes</h2>
          <p className="text-gray-600">
            Test your knowledge with case-based questions and detailed explanations for each answer.
          </p>
        </div>
      </div>

      {/* Enhanced Progress Indicators Section */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <LearningProgress 
          sections={learningSections}
          className="h-fit"
        />
        
        <MedicalTopicProgress 
          topicData={medicalTopics}
          className="h-fit"
        />
      </div>
    </main>
  );
};

export default HomeTab;