/**
 * Progress Metrics Cards Component
 * Displays key performance indicators with mini charts and animations
 */

import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Brain, Target, TrendingUp, Calendar, Clock, Award, LucideIcon } from 'lucide-react';
import { chartColors, getPerformanceColor } from './chartConfig';
import { calculatePerformanceMetrics, formatChartNumber } from './chartHelpers';

// Types
interface QuizHistoryItem {
  scorePercentage: number;
}

interface SpacedRepetitionAnalytics {
  totalCards: number;
  dueToday: number;
  learned: number;
  mature: number;
  retentionRate: number;
  averageInterval: number;
}

interface SpacedRepetitionData {
  analytics?: SpacedRepetitionAnalytics;
  weakAreas?: string[];
  retentionHistory?: { retentionRate: number }[];
}

interface ProgressMetricsCardsProps {
  quizHistory?: QuizHistoryItem[];
  spacedRepetitionData?: SpacedRepetitionData;
  className?: string;
}

interface FSRSMetrics {
  totalCards: number;
  dueToday: number;
  learned: number;
  mature: number;
  retentionRate: number;
  averageInterval: number;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: number | null;
  showSparkline?: boolean;
  quizHistory?: QuizHistoryItem[];
  sparklineData?: any;
  sparklineOptions?: any;
}

const ProgressMetricsCards: React.FC<ProgressMetricsCardsProps> = ({
  quizHistory = [],
  spacedRepetitionData = {},
  className = '',
}) => {
  const performanceMetrics = useMemo(
    () => calculatePerformanceMetrics(quizHistory),
    [quizHistory]
  );

  const fsrsMetrics: FSRSMetrics = useMemo(() => {
    const analytics = spacedRepetitionData.analytics;
    return {
      totalCards: analytics?.totalCards ?? 0,
      dueToday: analytics?.dueToday ?? 0,
      learned: analytics?.learned ?? 0,
      mature: analytics?.mature ?? 0,
      retentionRate: analytics?.retentionRate ?? 100,
      averageInterval: analytics?.averageInterval ?? 0,
    };
  }, [spacedRepetitionData]);

  // Generate mini sparkline data
  const sparklineData = useMemo(() => {
    const recent = quizHistory.slice(-10);
    return {
      labels: recent.map((_, index) => index + 1),
      datasets: [
        {
          data: recent.map((quiz) => quiz.scorePercentage || 0),
          borderColor: chartColors.primary,
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
        },
      ],
    };
  }, [quizHistory]);

  const sparklineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      point: { radius: 0 },
    },
  };

  const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = chartColors.primary,
    trend = null,
    showSparkline = false,
  }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
            <Icon size={20} style={{ color }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {trend !== null && (
          <div
            className={`flex items-center gap-1 text-xs ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            <TrendingUp size={14} />
            {trend > 0 ? '+' : ''}
            {trend}%
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        </div>

        {showSparkline && quizHistory.length > 1 && (
          <div className="w-16 h-8">
            <Line data={sparklineData} options={sparklineOptions} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Overall Performance */}
      <MetricCard
        title="Average Score"
        value={`${performanceMetrics.averageScore}%`}
        subtitle={`${performanceMetrics.totalQuizzes} quizzes completed`}
        icon={Target}
        color={getPerformanceColor(performanceMetrics.averageScore)}
        trend={performanceMetrics.improvementTrend}
        showSparkline={true}
        quizHistory={quizHistory}
        sparklineData={sparklineData}
        sparklineOptions={sparklineOptions}
      />

      {/* Study Consistency */}
      <MetricCard
        title="Study Consistency"
        value={`${performanceMetrics.consistencyScore}%`}
        subtitle="Performance stability"
        icon={Brain}
        color={chartColors.purple}
      />

      {/* FSRS Cards Total */}
      <MetricCard
        title="Total Cards"
        value={formatChartNumber(fsrsMetrics.totalCards)}
        subtitle="Questions in system"
        icon={Award}
        color={chartColors.teal}
      />

      {/* Due Today */}
      <MetricCard
        title="Due Today"
        value={formatChartNumber(fsrsMetrics.dueToday)}
        subtitle="Cards ready for review"
        icon={Calendar}
        color={fsrsMetrics.dueToday > 0 ? chartColors.warning : chartColors.success}
      />

      {/* Retention Rate */}
      <MetricCard
        title="Retention Rate"
        value={`${fsrsMetrics.retentionRate}%`}
        subtitle="FSRS algorithm tracking"
        icon={TrendingUp}
        color={getPerformanceColor(fsrsMetrics.retentionRate)}
      />

      {/* Average Interval */}
      <MetricCard
        title="Avg Interval"
        value={`${Math.round(fsrsMetrics.averageInterval)}d`}
        subtitle="Days between reviews"
        icon={Clock}
        color={chartColors.secondary}
      />
    </div>
  );
};

export default ProgressMetricsCards;
