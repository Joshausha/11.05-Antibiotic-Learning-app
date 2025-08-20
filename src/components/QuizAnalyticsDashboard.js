/**
 * QuizAnalyticsDashboard Component
 * 
 * A comprehensive analytics dashboard that provides real-time insights into quiz performance
 * Features stunning visualizations and interactive elements to track learning progress
 * 
 * Key Features:
 * - Real-time performance charts
 * - Category-based radar charts
 * - Difficulty progression analysis
 * - Learning streak visualization
 * - Interactive timeline
 * - Weak areas identification
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award, 
  AlertCircle, 
  BarChart3, 
  PieChart, 
  Activity,
  Brain,
  Clock,
  BookOpen,
  Trophy,
  Zap,
  Users,
  Filter
} from 'lucide-react';

const QuizAnalyticsDashboard = ({ quizProgress, quizQuestions = [] }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [activeChart, setActiveChart] = useState('performance');
  const [animationEnabled, setAnimationEnabled] = useState(true);

  // Process quiz data for analytics
  const analytics = useMemo(() => {
    if (!quizProgress || !quizProgress.quizHistory) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        improvementTrend: 'insufficient_data',
        categoryPerformance: {},
        difficultyBreakdown: {},
        recentActivity: [],
        weeklyProgress: [],
        topicStrengths: [],
        topicWeaknesses: []
      };
    }

    const history = quizProgress.quizHistory;
    const stats = quizProgress.stats;
    
    // Filter by time range
    const filteredHistory = filterByTimeRange(history, selectedTimeRange);
    
    // Calculate category performance
    const categoryPerformance = calculateCategoryPerformance(filteredHistory, quizQuestions);
    
    // Calculate difficulty breakdown
    const difficultyBreakdown = calculateDifficultyBreakdown(filteredHistory);
    
    // Calculate weekly progress
    const weeklyProgress = calculateWeeklyProgress(filteredHistory);
    
    // Identify topic strengths and weaknesses
    const topicAnalysis = calculateTopicAnalysis(filteredHistory);
    
    return {
      totalQuizzes: filteredHistory.length,
      averageScore: stats.averageScore,
      bestScore: stats.bestScore,
      improvementTrend: stats.improvementTrend,
      categoryPerformance,
      difficultyBreakdown,
      recentActivity: filteredHistory.slice(-10).reverse(),
      weeklyProgress,
      topicStrengths: topicAnalysis.strengths,
      topicWeaknesses: topicAnalysis.weaknesses,
      streakCount: stats.streakCount
    };
  }, [quizProgress, selectedTimeRange, quizQuestions]);

  // Animation effect
  useEffect(() => {
    if (animationEnabled) {
      const timer = setTimeout(() => setAnimationEnabled(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [animationEnabled]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Learning Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time insights into your antibiotic knowledge mastery
          </p>
        </div>
        
        {/* Time Range Filter */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Filter size={20} className="text-gray-500" />
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={Trophy}
          title="Total Quizzes"
          value={analytics.totalQuizzes}
          subtitle="completed"
          color="blue"
          animated={animationEnabled}
        />
        <MetricCard
          icon={Target}
          title="Average Score"
          value={`${analytics.averageScore}%`}
          subtitle="accuracy"
          color="green"
          animated={animationEnabled}
        />
        <MetricCard
          icon={Award}
          title="Best Score"
          value={`${analytics.bestScore}%`}
          subtitle="personal best"
          color="purple"
          animated={animationEnabled}
        />
        <MetricCard
          icon={Zap}
          title="Current Streak"
          value={analytics.streakCount}
          subtitle="consecutive good scores"
          color="yellow"
          animated={animationEnabled}
        />
      </div>

      {/* Performance Trend Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={24} />
            Performance Trends
          </h2>
          <div className="flex gap-2">
            {['performance', 'difficulty', 'category'].map((chart) => (
              <button
                key={chart}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeChart === chart
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveChart(chart)}
              >
                {chart.charAt(0).toUpperCase() + chart.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {activeChart === 'performance' && (
          <PerformanceChart 
            data={analytics.weeklyProgress} 
            animated={animationEnabled}
          />
        )}
        {activeChart === 'difficulty' && (
          <DifficultyChart 
            data={analytics.difficultyBreakdown} 
            animated={animationEnabled}
          />
        )}
        {activeChart === 'category' && (
          <CategoryRadarChart 
            data={analytics.categoryPerformance} 
            animated={animationEnabled}
          />
        )}
      </div>

      {/* Two-column layout for detailed analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="text-purple-600" size={20} />
            Knowledge Areas
          </h3>
          
          <div className="space-y-4">
            {/* Strengths */}
            <div>
              <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                <Trophy size={16} />
                Top Strengths
              </h4>
              <div className="space-y-2">
                {analytics.topicStrengths.slice(0, 3).map((topic, index) => (
                  <TopicBar
                    key={topic.topic}
                    topic={topic.topic}
                    percentage={topic.accuracy}
                    color="green"
                    animated={animationEnabled}
                    delay={index * 100}
                  />
                ))}
              </div>
            </div>
            
            {/* Weaknesses */}
            <div>
              <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                <AlertCircle size={16} />
                Areas for Improvement
              </h4>
              <div className="space-y-2">
                {analytics.topicWeaknesses.slice(0, 3).map((topic, index) => (
                  <TopicBar
                    key={topic.topic}
                    topic={topic.topic}
                    percentage={topic.accuracy}
                    color="red"
                    animated={animationEnabled}
                    delay={index * 100}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="text-blue-600" size={20} />
            Recent Activity
          </h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {analytics.recentActivity.map((quiz, index) => (
              <RecentQuizCard
                key={index}
                quiz={quiz}
                animated={animationEnabled}
                delay={index * 50}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="text-blue-600" size={20} />
          Personalized Learning Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generateRecommendations(analytics).map((recommendation, index) => (
            <RecommendationCard
              key={index}
              recommendation={recommendation}
              animated={animationEnabled}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const MetricCard = ({ icon: Icon, title, value, subtitle, color, animated }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${color}-500 transition-all hover:shadow-xl ${
      animated ? 'animate-pulse' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

const PerformanceChart = ({ data, animated }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto mb-2 text-gray-400" />
          <p>No performance data available</p>
          <p className="text-sm">Complete more quizzes to see trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 flex items-end justify-between gap-2 p-4 bg-gray-50 rounded-lg">
      {data.map((point, index) => (
        <div
          key={index}
          className="flex-1 flex flex-col items-center"
        >
          <div
            className={`w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-1000 ${
              animated ? 'animate-pulse' : ''
            }`}
            style={{
              height: `${(point.score / 100) * 200}px`,
              animationDelay: `${index * 100}ms`
            }}
          />
          <div className="mt-2 text-xs text-gray-600 text-center">
            <p className="font-medium">{point.score}%</p>
            <p>{point.week}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const DifficultyChart = ({ data, animated }) => {
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const colors = ['bg-green-500', 'bg-yellow-500', 'bg-red-500'];
  
  return (
    <div className="space-y-4">
      {difficulties.map((difficulty, index) => {
        const value = data[difficulty] || 0;
        return (
          <div key={difficulty} className="flex items-center gap-4">
            <div className="w-20 text-sm font-medium text-gray-700 capitalize">
              {difficulty}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6">
              <div
                className={`h-6 rounded-full transition-all duration-1000 ${colors[index]} ${
                  animated ? 'animate-pulse' : ''
                }`}
                style={{
                  width: `${value}%`,
                  animationDelay: `${index * 200}ms`
                }}
              />
            </div>
            <div className="w-12 text-sm font-semibold text-gray-700">
              {value}%
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CategoryRadarChart = ({ data, animated }) => {
  const categories = Object.keys(data);
  
  if (categories.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <PieChart size={48} className="mx-auto mb-2 text-gray-400" />
          <p>No category data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {categories.map((category, index) => (
        <div key={category} className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="#e5e7eb"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="#3b82f6"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${(data[category] / 100) * 220} 220`}
                className={`transition-all duration-1000 ${
                  animated ? 'animate-pulse' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700">
                {data[category]}%
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-600 font-medium">{category}</p>
        </div>
      ))}
    </div>
  );
};

const TopicBar = ({ topic, percentage, color, animated, delay }) => {
  const colorClasses = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-sm text-gray-700 font-medium capitalize">
        {topic}
      </div>
      <div className="flex-1 bg-gray-200 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all duration-1000 ${colorClasses[color]} ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{
            width: `${percentage}%`,
            animationDelay: `${delay}ms`
          }}
        />
      </div>
      <div className="w-12 text-sm font-semibold text-gray-700">
        {percentage}%
      </div>
    </div>
  );
};

const RecentQuizCard = ({ quiz, animated, delay }) => {
  const scoreColor = quiz.scorePercentage >= 80 ? 'text-green-600' : 
                    quiz.scorePercentage >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className={`border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md ${
      animated ? 'animate-pulse' : ''
    }`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            quiz.scorePercentage >= 80 ? 'bg-green-100' : 
            quiz.scorePercentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <span className={`font-bold text-sm ${scoreColor}`}>
              {quiz.scorePercentage}%
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {quiz.correctAnswers}/{quiz.totalQuestions} correct
            </p>
            <p className="text-xs text-gray-500">
              {new Date(quiz.completedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock size={14} />
          <span className="text-sm">{quiz.duration}</span>
        </div>
      </div>
    </div>
  );
};

const RecommendationCard = ({ recommendation, animated, delay }) => {
  return (
    <div className={`bg-white rounded-lg p-4 border border-blue-200 transition-all hover:shadow-md ${
      animated ? 'animate-pulse' : ''
    }`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <recommendation.icon size={16} className="text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-1">{recommendation.title}</h4>
          <p className="text-sm text-gray-600">{recommendation.description}</p>
        </div>
      </div>
    </div>
  );
};

// Helper Functions
function filterByTimeRange(history, timeRange) {
  if (timeRange === 'all') return history;
  
  const now = new Date();
  const cutoffDate = new Date();
  
  switch (timeRange) {
    case 'week':
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      cutoffDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      cutoffDate.setMonth(now.getMonth() - 3);
      break;
    default:
      return history;
  }
  
  return history.filter(quiz => new Date(quiz.completedAt) >= cutoffDate);
}

function calculateCategoryPerformance(history, quizQuestions) {
  const categoryData = {};
  
  // Map questions to categories
  const questionCategories = {};
  quizQuestions.forEach(q => {
    if (q.category) {
      questionCategories[q.question] = q.category;
    }
  });
  
  history.forEach(quiz => {
    quiz.answers.forEach(answer => {
      const category = questionCategories[answer.questionText] || 'General';
      
      if (!categoryData[category]) {
        categoryData[category] = { correct: 0, total: 0 };
      }
      
      categoryData[category].total++;
      if (answer.isCorrect) {
        categoryData[category].correct++;
      }
    });
  });
  
  const result = {};
  Object.keys(categoryData).forEach(category => {
    result[category] = Math.round((categoryData[category].correct / categoryData[category].total) * 100);
  });
  
  return result;
}

function calculateDifficultyBreakdown(history) {
  const difficultyData = { beginner: 0, intermediate: 0, advanced: 0 };
  let total = 0;
  
  history.forEach(quiz => {
    // This is simplified - in a real app, you'd track difficulty per question
    const avgScore = quiz.scorePercentage;
    total++;
    
    if (avgScore >= 80) difficultyData.beginner++;
    else if (avgScore >= 60) difficultyData.intermediate++;
    else difficultyData.advanced++;
  });
  
  Object.keys(difficultyData).forEach(key => {
    difficultyData[key] = total > 0 ? Math.round((difficultyData[key] / total) * 100) : 0;
  });
  
  return difficultyData;
}

function calculateWeeklyProgress(history) {
  const weeklyData = [];
  const now = new Date();
  
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (i * 7));
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekQuizzes = history.filter(quiz => {
      const quizDate = new Date(quiz.completedAt);
      return quizDate >= weekStart && quizDate <= weekEnd;
    });
    
    const avgScore = weekQuizzes.length > 0 
      ? Math.round(weekQuizzes.reduce((sum, q) => sum + q.scorePercentage, 0) / weekQuizzes.length)
      : 0;
    
    weeklyData.push({
      week: `Week ${8 - i}`,
      score: avgScore,
      quizzes: weekQuizzes.length
    });
  }
  
  return weeklyData;
}

function calculateTopicAnalysis(history) {
  const topicData = {};
  
  history.forEach(quiz => {
    quiz.answers.forEach(answer => {
      const topics = extractTopicsFromQuestion(answer.questionText);
      
      topics.forEach(topic => {
        if (!topicData[topic]) {
          topicData[topic] = { correct: 0, total: 0 };
        }
        
        topicData[topic].total++;
        if (answer.isCorrect) {
          topicData[topic].correct++;
        }
      });
    });
  });
  
  const topics = Object.keys(topicData).map(topic => ({
    topic,
    accuracy: Math.round((topicData[topic].correct / topicData[topic].total) * 100),
    totalQuestions: topicData[topic].total
  }));
  
  return {
    strengths: topics.filter(t => t.accuracy >= 80 && t.totalQuestions >= 3).sort((a, b) => b.accuracy - a.accuracy),
    weaknesses: topics.filter(t => t.accuracy < 70 && t.totalQuestions >= 3).sort((a, b) => a.accuracy - b.accuracy)
  };
}

function extractTopicsFromQuestion(questionText) {
  const topics = [];
  const text = questionText.toLowerCase();
  
  // Enhanced topic extraction
  if (text.includes('pneumonia')) topics.push('pneumonia');
  if (text.includes('uti') || text.includes('urinary')) topics.push('urinary infections');
  if (text.includes('sepsis') || text.includes('bloodstream')) topics.push('sepsis');
  if (text.includes('meningitis')) topics.push('meningitis');
  if (text.includes('cellulitis')) topics.push('skin infections');
  if (text.includes('osteomyelitis')) topics.push('bone infections');
  if (text.includes('antibiotic') || text.includes('antimicrobial')) topics.push('antibiotic therapy');
  if (text.includes('resistance')) topics.push('antibiotic resistance');
  
  return topics.length > 0 ? topics : ['general medicine'];
}

function generateRecommendations(analytics) {
  const recommendations = [];
  
  if (analytics.averageScore < 70) {
    recommendations.push({
      icon: BookOpen,
      title: 'Review Core Concepts',
      description: 'Focus on fundamental antibiotic principles to improve your overall understanding.'
    });
  }
  
  if (analytics.topicWeaknesses.length > 0) {
    recommendations.push({
      icon: Target,
      title: `Study ${analytics.topicWeaknesses[0].topic}`,
      description: `You scored ${analytics.topicWeaknesses[0].accuracy}% in this area. Consider reviewing related materials.`
    });
  }
  
  if (analytics.streakCount >= 3) {
    recommendations.push({
      icon: Trophy,
      title: 'Keep Up the Momentum!',
      description: `You're on a ${analytics.streakCount}-quiz streak. Try advanced questions to challenge yourself.`
    });
  }
  
  if (analytics.totalQuizzes < 5) {
    recommendations.push({
      icon: Users,
      title: 'Take More Quizzes',
      description: 'Complete more quizzes to get better analytics and identify your learning patterns.'
    });
  }
  
  return recommendations;
}

export default QuizAnalyticsDashboard;