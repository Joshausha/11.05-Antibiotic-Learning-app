import React from 'react';
import { CheckCircle, Circle, Clock, Award, Star, Shield, Target, Brain, Activity, Microscope, Pill } from 'lucide-react';

/**
 * ProgressBar Component
 * Displays progress as a bar with percentage
 */
export const ProgressBar = ({ 
  progress = 0, 
  total = 100, 
  showPercentage = true,
  showStats = false,
  className = "",
  color = "blue"
}) => {
  const percentage = Math.round((progress / total) * 100);
  
  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    yellow: "bg-yellow-600",
    red: "bg-red-600",
    purple: "bg-purple-600"
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">
            {percentage}% Complete
          </span>
        )}
        {showStats && (
          <span className="text-sm text-gray-500">
            {progress}/{total}
          </span>
        )}
      </div>
      <div className="progress-bar">
        <div 
          className={`progress-fill ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/**
 * StepProgress Component
 * Shows progress through multiple steps
 */
export const StepProgress = ({ 
  currentStep = 1, 
  totalSteps = 5,
  steps = [],
  className = ""
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const stepLabel = steps[index] || `Step ${stepNumber}`;
        
        return (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isCompleted 
                  ? 'bg-green-600 text-white' 
                  : isCurrent 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  stepNumber
                )}
              </div>
              <span className="text-xs text-gray-600 mt-1 text-center max-w-16">
                {stepLabel}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${
                stepNumber < currentStep ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/**
 * CircularProgress Component
 * Displays circular progress indicator
 */
export const CircularProgress = ({ 
  progress = 0, 
  total = 100,
  size = "md",
  showPercentage = true,
  color = "blue",
  className = ""
}) => {
  const percentage = Math.round((progress / total) * 100);
  const strokeWidth = 4;
  
  const sizes = {
    sm: { width: 40, height: 40, radius: 18 },
    md: { width: 60, height: 60, radius: 28 },
    lg: { width: 80, height: 80, radius: 38 }
  };
  
  const { width, height, radius } = sizes[size];
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const colors = {
    blue: "stroke-blue-600",
    green: "stroke-green-600",
    yellow: "stroke-yellow-600",
    red: "stroke-red-600",
    purple: "stroke-purple-600"
  };

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="transform -rotate-90">
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="rgb(229, 231, 235)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          className={colors[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * QuizProgress Component
 * Specialized progress indicator for quiz with medical context
 */
export const QuizProgress = ({ 
  currentQuestion = 1,
  totalQuestions = 10,
  correctAnswers = 0,
  showStats = true,
  quizType = "general",
  className = ""
}) => {
  const percentage = Math.round((currentQuestion / totalQuestions) * 100);
  const accuracy = currentQuestion > 1 ? Math.round((correctAnswers / (currentQuestion - 1)) * 100) : 0;
  
  // Get medical context icon based on quiz type
  const getQuizTypeIcon = (type) => {
    switch (type) {
      case 'pathogen':
        return <Microscope className="w-4 h-4 text-blue-600" />;
      case 'antibiotic':
        return <Pill className="w-4 h-4 text-green-600" />;
      case 'clinical':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'resistance':
        return <Shield className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  // Get accuracy color based on performance
  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 80) return "text-blue-600";
    if (accuracy >= 70) return "text-yellow-600";
    return "text-red-600";
  };
  
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getQuizTypeIcon(quizType)}
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion} of {totalQuestions}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {percentage}% Complete
        </span>
      </div>
      
      <ProgressBar 
        progress={currentQuestion} 
        total={totalQuestions} 
        showPercentage={false}
        color="blue"
      />
      
      {showStats && currentQuestion > 1 && (
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Correct: {correctAnswers}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-600" />
            <span className={getAccuracyColor(accuracy)}>
              Accuracy: {accuracy}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-4 h-4 text-gray-500" />
            <span>Performance: {accuracy >= 80 ? 'Excellent' : accuracy >= 70 ? 'Good' : 'Needs Review'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * LearningProgress Component
 * Shows overall learning progress across sections with medical context
 */
export const LearningProgress = ({ 
  sections = [],
  className = ""
}) => {
  const totalSections = sections.length;
  const completedSections = sections.filter(s => s.completed).length;
  const overallProgress = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;
  
  // Get medical context icon for each section type
  const getSectionIcon = (sectionType) => {
    switch (sectionType) {
      case 'pathogen':
      case 'pathogens':
        return <Microscope className="w-4 h-4 text-blue-600" />;
      case 'antibiotic':
      case 'antibiotics':
        return <Pill className="w-4 h-4 text-green-600" />;
      case 'clinical':
      case 'conditions':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'resistance':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'quiz':
        return <Target className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  // Get achievement level based on progress
  const getAchievementLevel = (progress) => {
    if (progress >= 90) return { text: "Expert Level", color: "text-green-600", icon: <Award className="w-5 h-5 text-green-600" /> };
    if (progress >= 75) return { text: "Advanced", color: "text-blue-600", icon: <Star className="w-5 h-5 text-blue-600" /> };
    if (progress >= 50) return { text: "Intermediate", color: "text-yellow-600", icon: <Target className="w-5 h-5 text-yellow-600" /> };
    if (progress >= 25) return { text: "Beginner", color: "text-orange-600", icon: <Activity className="w-5 h-5 text-orange-600" /> };
    return { text: "Getting Started", color: "text-gray-600", icon: <Clock className="w-5 h-5 text-gray-600" /> };
  };

  const achievement = getAchievementLevel(overallProgress);
  
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Medical Learning Progress</h3>
        {achievement.icon}
      </div>
      
      <div className="mb-4 text-center">
        <CircularProgress 
          progress={overallProgress} 
          total={100}
          size="lg"
          color="green"
        />
        <div className="mt-2">
          <span className={`text-sm font-medium ${achievement.color}`}>
            {achievement.text}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            {completedSections} of {totalSections} sections completed
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-2">
              {getSectionIcon(section.type || section.name.toLowerCase())}
              <span className="text-sm text-gray-700 font-medium">{section.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {section.completed ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Complete</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">In Progress</span>
                </>
              )}
              {section.score && (
                <span className="text-xs text-gray-400 ml-1">
                  ({section.score}%)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * MedicalTopicProgress Component
 * Shows progress across medical topics with specialized icons
 */
export const MedicalTopicProgress = ({ 
  topicData = {},
  className = ""
}) => {
  const {
    pathogenMastery = 0,
    antibioticKnowledge = 0,
    clinicalScenarios = 0,
    resistancePatterns = 0
  } = topicData;

  const topics = [
    {
      name: "Pathogen Identification",
      progress: pathogenMastery,
      icon: <Microscope className="w-5 h-5 text-blue-600" />,
      color: "blue",
      description: "Bacterial identification and characteristics"
    },
    {
      name: "Antibiotic Selection",
      progress: antibioticKnowledge,
      icon: <Pill className="w-5 h-5 text-green-600" />,
      color: "green",
      description: "Drug mechanisms and spectrum coverage"
    },
    {
      name: "Clinical Decision Making",
      progress: clinicalScenarios,
      icon: <Brain className="w-5 h-5 text-purple-600" />,
      color: "purple",
      description: "Evidence-based treatment protocols"
    },
    {
      name: "Resistance Patterns",
      progress: resistancePatterns,
      icon: <Shield className="w-5 h-5 text-red-600" />,
      color: "red",
      description: "Understanding antimicrobial resistance"
    }
  ];

  const averageProgress = topics.reduce((sum, topic) => sum + topic.progress, 0) / topics.length;

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold">Medical Topic Mastery</h3>
        <span className="text-sm text-gray-500 ml-auto">
          {Math.round(averageProgress)}% Overall
        </span>
      </div>
      
      <div className="space-y-4">
        {topics.map((topic, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {topic.icon}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{topic.name}</h4>
                  <p className="text-xs text-gray-500">{topic.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(topic.progress)}%
                </span>
              </div>
            </div>
            <ProgressBar 
              progress={topic.progress} 
              total={100} 
              showPercentage={false}
              color={topic.color}
            />
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              {topic.progress >= 90 && (
                <>
                  <Award className="w-3 h-3 text-yellow-600" />
                  <span className="text-yellow-600">Expert Level</span>
                </>
              )}
              {topic.progress >= 75 && topic.progress < 90 && (
                <>
                  <Star className="w-3 h-3 text-blue-600" />
                  <span className="text-blue-600">Proficient</span>
                </>
              )}
              {topic.progress >= 50 && topic.progress < 75 && (
                <>
                  <Activity className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">Developing</span>
                </>
              )}
              {topic.progress < 50 && (
                <>
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-400">Needs Practice</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;