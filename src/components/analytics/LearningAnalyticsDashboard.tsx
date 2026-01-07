/**
 * Learning Analytics Dashboard
 * Main container for all learning analytics charts and metrics
 */

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import ProgressMetricsCards from './ProgressMetricsCards';
import RetentionCurveChart from './RetentionCurveChart';
import { timePeriods } from './chartConfig';
import { filterDataByPeriod } from './chartHelpers';

// Types
interface QuizHistoryItem {
  scorePercentage: number;
  endTime: string;
  totalQuestions: number;
  correctAnswers: number;
  duration?: string;
}

interface SpacedRepetitionAnalytics {
  totalCards: number;
  learned: number;
  mature: number;
  dueToday: number;
  retentionRate: number;
  averageInterval: number;
}

interface SpacedRepetitionData {
  analytics?: SpacedRepetitionAnalytics;
  weakAreas?: string[];
  retentionHistory?: { retentionRate: number }[];
}

interface LearningAnalyticsDashboardProps {
  quizHistory?: QuizHistoryItem[];
  spacedRepetitionData?: SpacedRepetitionData;
}

interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
}

const LearningAnalyticsDashboard: React.FC<LearningAnalyticsDashboardProps> = ({
  quizHistory = [],
  spacedRepetitionData = {
    analytics: {
      totalCards: 0,
      learned: 0,
      mature: 0,
      dueToday: 0,
      retentionRate: 100,
      averageInterval: 0,
    },
    weakAreas: [],
  },
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate basic quiz statistics from passed-in data
  const quizStats: QuizStats = useMemo(() => {
    const totalQuizzes = quizHistory.length;
    const averageScore =
      totalQuizzes > 0
        ? Math.round(
            quizHistory.reduce((sum, quiz) => sum + quiz.scorePercentage, 0) / totalQuizzes
          )
        : 0;
    return { totalQuizzes, averageScore };
  }, [quizHistory]);

  // Filter quiz history by selected time period
  const filteredQuizHistory = useMemo(() => {
    return filterDataByPeriod(quizHistory || [], selectedPeriod, 'endTime');
  }, [quizHistory, selectedPeriod]);

  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    // Simulate refresh animation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleExport = (): void => {
    // Basic CSV export of quiz data
    const csvData = filteredQuizHistory.map((quiz) => ({
      date: new Date(quiz.endTime).toLocaleDateString(),
      score: quiz.scorePercentage,
      questions: quiz.totalQuestions,
      correct: quiz.correctAnswers,
      duration: quiz.duration || 'N/A',
    }));

    const csvContent = [
      ['Date', 'Score (%)', 'Total Questions', 'Correct', 'Duration'],
      ...csvData.map((row) => [row.date, row.score, row.questions, row.correct, row.duration]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning-analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 size={28} className="text-blue-600" />
              Learning Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Track your progress and optimize your learning with data-driven insights
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Period Filter */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timePeriods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Progress Metrics Cards */}
      <div className="mb-8">
        <ProgressMetricsCards
          quizHistory={filteredQuizHistory}
          spacedRepetitionData={spacedRepetitionData}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Retention Curve */}
        <div className="lg:col-span-2">
          <RetentionCurveChart
            quizHistory={filteredQuizHistory}
            spacedRepetitionData={spacedRepetitionData}
            timePeriod={selectedPeriod}
          />
        </div>
      </div>

      {/* Additional Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spaced Repetition Insights */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-purple-600" />
            Spaced Repetition Insights
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-sm font-medium text-purple-800 mb-2">📚 Cards in System</div>
              <div className="text-2xl font-bold text-purple-900">
                {spacedRepetitionData.analytics?.totalCards || 0}
              </div>
              <div className="text-xs text-purple-600 mt-1">
                {spacedRepetitionData.analytics?.learned || 0} learned,{' '}
                {spacedRepetitionData.analytics?.mature || 0} mature
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-800 mb-2">⏰ Due for Review</div>
              <div className="text-2xl font-bold text-blue-900">
                {spacedRepetitionData.analytics?.dueToday || 0}
              </div>
              <div className="text-xs text-blue-600 mt-1">Cards ready for optimal learning</div>
            </div>

            {(spacedRepetitionData.weakAreas?.length ?? 0) > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-sm font-medium text-yellow-800 mb-2">🎯 Areas for Improvement</div>
                <div className="text-sm text-yellow-700">
                  {spacedRepetitionData.weakAreas?.join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Study Recommendations */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Study Recommendations</h3>

          <div className="space-y-3">
            {(spacedRepetitionData.analytics?.dueToday ?? 0) > 0 ? (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-800 mb-1">Start with Reviews</div>
                <div className="text-xs text-green-700">
                  You have {spacedRepetitionData.analytics?.dueToday} cards due for review.
                  Complete these first for optimal retention.
                </div>
              </div>
            ) : (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-800 mb-1">Learn New Content</div>
                <div className="text-xs text-blue-700">
                  No reviews due! Perfect time to learn new material.
                </div>
              </div>
            )}

            {quizStats.averageScore < 70 && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-sm font-medium text-yellow-800 mb-1">Focus on Fundamentals</div>
                <div className="text-xs text-yellow-700">
                  Consider reviewing basic concepts to strengthen your foundation.
                </div>
              </div>
            )}

            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-sm font-medium text-purple-800 mb-1">
                Retention Rate: {spacedRepetitionData.analytics?.retentionRate || 100}%
              </div>
              <div className="text-xs text-purple-700">
                FSRS algorithm is optimizing your review schedule for 90% retention.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-sm text-gray-600 text-center">
          <p>📊 Analytics powered by FSRS algorithm and medical education best practices</p>
          <p className="mt-1 text-xs">
            Data is stored locally and never shared. Export functionality available for your records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningAnalyticsDashboard;
