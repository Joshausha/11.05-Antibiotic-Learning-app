/**
 * UserProgress Component
 * Displays user's learning progress, quiz statistics, and bookmarked conditions
 * 
 * Props:
 * - userProgress: object - user progress data from useQuizProgress hook
 * - bookmarkedConditions: array - list of bookmarked medical conditions
 * - onViewCondition: function - callback to view a specific condition
 * - onClearProgress: function - callback to clear all progress data
 */

import React, { memo } from 'react';
import { Award, TrendingUp, Star, Clock, Target, BookOpen } from 'lucide-react';
import { LearningProgress, ProgressBar } from './ProgressIndicator';

const UserProgress = ({ 
  userProgress, 
  bookmarkedConditions = [], 
  onViewCondition,
  onClearProgress 
}) => {
  // Safe destructuring with fallbacks
  const stats = userProgress?.stats || {
    totalQuizzes: 0,
    averageScore: 0,
    improvementTrend: 'insufficient',
    strongestCategory: 'None',
    weakestCategory: 'None',
    streakLength: 0
  };
  
  const recentQuizzes = userProgress?.recentQuizzes || [];

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = () => {
    switch (stats.improvementTrend) {
      case 'improving':
        return <TrendingUp className="text-green-600" size={16} />;
      case 'declining':
        return <TrendingUp className="text-red-600 rotate-180" size={16} />;
      default:
        return <Target className="text-gray-600" size={16} />;
    }
  };

  const getTrendText = () => {
    switch (stats.improvementTrend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Needs attention';
      case 'stable':
        return 'Stable performance';
      default:
        return 'Not enough data';
    }
  };

  // Mock section data for learning progress
  const learningSections = [
    { name: 'Bacterial Infections', completed: stats.totalQuizzes > 0 },
    { name: 'Viral Infections', completed: stats.totalQuizzes > 2 },
    { name: 'Fungal Infections', completed: stats.totalQuizzes > 5 },
    { name: 'Parasitic Infections', completed: stats.totalQuizzes > 8 },
    { name: 'Antibiotic Resistance', completed: stats.totalQuizzes > 10 },
    { name: 'Clinical Guidelines', completed: stats.totalQuizzes > 15 }
  ];

  return (
    <div className="space-y-6">
      {/* Learning Progress Overview */}
      <LearningProgress 
        sections={learningSections}
        className="mb-6"
      />

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Award className="text-blue-600" size={24} />
          Quiz Statistics
        </h2>

        {/* Key Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalQuizzes}</div>
            <div className="text-sm text-gray-600">Quizzes Completed</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.bestScore}%</div>
            <div className="text-sm text-gray-600">Best Score</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.streakCount}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          {getTrendIcon()}
          <span className="font-medium text-gray-700">{getTrendText()}</span>
        </div>
      </div>

      {/* Recent Quiz History */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="text-blue-600" size={20} />
          Recent Quizzes
        </h3>

        {recentQuizzes.length > 0 ? (
          <div className="space-y-3">
            {recentQuizzes.map((quiz, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="text-sm text-gray-500">
                    {new Date(quiz.completedAt).toLocaleDateString()}
                  </div>
                  <div className="font-medium text-gray-900">
                    {quiz.correctAnswers}/{quiz.totalQuestions} correct
                  </div>
                  <div className="text-sm text-gray-600">
                    Duration: {quiz.duration}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(quiz.scorePercentage)}`}>
                  {quiz.scorePercentage}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No quizzes completed yet</p>
            <p className="text-sm">Start your first quiz to track your progress!</p>
          </div>
        )}
      </div>

      {/* Weak Areas */}
      {stats.weakAreas && stats.weakAreas.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="text-orange-600" size={20} />
            Areas for Improvement
          </h3>
          
          <div className="space-y-3">
            {stats.weakAreas.map((area, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 capitalize">{area.topic}</div>
                  <div className="text-sm text-gray-600">
                    {area.totalQuestions} questions answered
                  </div>
                </div>
                <div className="text-orange-600 font-medium">
                  {area.accuracy}% accuracy
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookmarked Conditions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="text-yellow-600" size={20} />
          Bookmarked Conditions
        </h3>

        {bookmarkedConditions.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-3">
            {bookmarkedConditions.map((condition, index) => (
              <button
                key={index}
                onClick={() => onViewCondition(condition)}
                className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{condition.name}</div>
                <div className="text-sm text-gray-600">{condition.category}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {condition.firstLineAntibiotics?.join(', ')}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Star size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No bookmarked conditions yet</p>
            <p className="text-sm">Bookmark conditions while browsing to save them here!</p>
          </div>
        )}
      </div>

      {/* Clear Progress Button */}
      {stats.totalQuizzes > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Reset Progress</h3>
          <p className="text-gray-600 mb-4">
            Clear all quiz history and progress data. This action cannot be undone.
          </p>
          <button
            onClick={onClearProgress}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear All Progress
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(UserProgress);