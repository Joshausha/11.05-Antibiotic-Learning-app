/**
 * Retention Curve Chart Component
 * Shows learning retention over time with quiz performance trend
 */

import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';
import { chartColors, commonOptions } from './chartConfig';
import { formatChartDate, calculateMovingAverage, groupQuizzesByDate } from './chartHelpers';

// Types
interface QuizHistoryItem {
  scorePercentage: number;
  endTime?: string;
  timestamp?: string;
}

interface RetentionHistoryItem {
  retentionRate: number;
}

interface SpacedRepetitionData {
  retentionHistory?: RetentionHistoryItem[];
}

interface RetentionCurveChartProps {
  quizHistory?: QuizHistoryItem[];
  spacedRepetitionData?: SpacedRepetitionData;
  timePeriod?: string;
  className?: string;
}

interface ChartStats {
  average: number;
  recent: number;
  trend: number;
  total: number;
}

const RetentionCurveChart: React.FC<RetentionCurveChartProps> = ({
  quizHistory = [],
  spacedRepetitionData = {},
  timePeriod = 'month',
  className = '',
}) => {
  const chartData = useMemo(() => {
    // Return empty chart data if no quiz history
    if (!quizHistory || quizHistory.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Group quizzes by date and calculate daily averages
    const quizzesByDate = groupQuizzesByDate(quizHistory);
    const dates = Object.keys(quizzesByDate).sort();

    // If no dates after grouping, return empty data
    if (dates.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const dailyScores = dates.map((date) => {
      const dayQuizzes = quizzesByDate[date];
      return dayQuizzes.reduce((sum, quiz) => sum + (quiz.scorePercentage || 0), 0) / dayQuizzes.length;
    });

    // Apply smoothing to reduce noise
    const smoothedScores = calculateMovingAverage(dailyScores, 3);

    // Format labels
    const labels = dates.map((date) => formatChartDate(new Date(date), 'short'));

    // Target retention line (90% from FSRS config)
    const targetLine = new Array(labels.length).fill(90);

    // FSRS retention trend (if available)
    const fsrsRetention = spacedRepetitionData.retentionHistory || [];
    const fsrsData = labels.map((_, index) => {
      const corresponding = fsrsRetention[index];
      return corresponding ? corresponding.retentionRate : null;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Quiz Performance',
          data: smoothedScores,
          borderColor: chartColors.primary,
          backgroundColor: chartColors.primaryAlpha,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: chartColors.primary,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
        {
          label: 'FSRS Retention',
          data: fsrsData,
          borderColor: chartColors.purple,
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: chartColors.purple,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        },
        {
          label: 'Target (90%)',
          data: targetLine,
          borderColor: chartColors.success,
          backgroundColor: 'transparent',
          borderDash: [10, 5],
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    };
  }, [quizHistory, spacedRepetitionData, timePeriod]);

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: 'Learning Retention Curve',
        font: {
          size: 16,
          weight: 'bold',
          family: '"Inter", sans-serif',
        },
        color: '#1F2937',
        padding: 20,
      },
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: function (context: any) {
            const value = Math.round(context.parsed.y * 10) / 10;
            return `${context.dataset.label}: ${value}%`;
          },
          afterBody: function (tooltipItems: any[]) {
            const item = tooltipItems[0];
            if (item.datasetIndex === 0) {
              // Quiz performance
              const performance = item.parsed.y;
              let advice = '';

              if (performance >= 90) {
                advice = '🎉 Excellent retention! Keep up the great work.';
              } else if (performance >= 70) {
                advice = '👍 Good progress. Consider reviewing weak areas.';
              } else {
                advice = '📚 Focus on reviewing previously studied material.';
              }

              return advice;
            }
            return '';
          },
        },
      },
    },
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        beginAtZero: false,
        min: 0,
        max: 100,
        ticks: {
          ...commonOptions.scales.y.ticks,
          callback: function (value: any) {
            return value + '%';
          },
        },
        title: {
          display: true,
          text: 'Retention Rate (%)',
          font: {
            size: 12,
            family: '"Inter", sans-serif',
          },
          color: '#6B7280',
        },
      },
      x: {
        ...commonOptions.scales.x,
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 12,
            family: '"Inter", sans-serif',
          },
          color: '#6B7280',
        },
      },
    },
  };

  const stats: ChartStats | null = useMemo(() => {
    const scores = quizHistory.map((q) => q.scorePercentage || 0);
    if (scores.length === 0) return null;

    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const recent = scores.slice(-5);
    const recentAverage = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    const trend = recentAverage - average;

    return {
      average: Math.round(average),
      recent: Math.round(recentAverage),
      trend: Math.round(trend * 10) / 10,
      total: scores.length,
    };
  }, [quizHistory]);

  if (quizHistory.length === 0) {
    return (
      <div className={`bg-white rounded-lg p-8 text-center border border-gray-200 ${className}`}>
        <div className="text-gray-500 mb-4">
          <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
          <p>No quiz data available yet.</p>
          <p className="text-sm">Complete some quizzes to see your retention curve!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-6 border border-gray-200 ${className}`}>
      <div className="mb-6">
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{stats.average}%</div>
            <div className="text-xs text-gray-500">Overall Average</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{stats.recent}%</div>
            <div className="text-xs text-gray-500">Recent Average</div>
          </div>
          <div className="text-center">
            <div
              className={`text-lg font-semibold ${
                stats.trend > 0
                  ? 'text-green-600'
                  : stats.trend < 0
                    ? 'text-red-600'
                    : 'text-gray-900'
              }`}
            >
              {stats.trend > 0 ? '+' : ''}
              {stats.trend}%
            </div>
            <div className="text-xs text-gray-500">Trend</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500">Total Quizzes</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetentionCurveChart;
