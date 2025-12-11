/**
 * Chart Helper Functions
 * Utility functions for processing and formatting chart data
 */

import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

/**
 * Format date for chart labels
 * @param date - Date to format
 * @param formatType - Type of format (short, medium, long)
 * @returns Formatted date string
 */
export const formatChartDate = (date: Date | string, formatType: string = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  switch (formatType) {
    case 'short':
      return format(dateObj, 'MM/dd');
    case 'medium':
      return format(dateObj, 'MMM dd');
    case 'long':
      return format(dateObj, 'MMM dd, yyyy');
    case 'time':
      return format(dateObj, 'HH:mm');
    default:
      return format(dateObj, 'MM/dd');
  }
};

/**
 * Filter data by time period
 * @param data - Array of data objects with timestamp/date fields
 * @param period - Time period ('today', 'week', 'month', 'quarter', 'all')
 * @param dateField - Name of the date field in data objects
 * @returns Filtered data array
 */
export const filterDataByPeriod = (
  data: any[],
  period: string,
  dateField: string = 'timestamp'
): any[] => {
  if (period === 'all' || !data.length) return data;

  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = startOfDay(now);
      break;
    case 'week':
      startDate = subDays(now, 7);
      break;
    case 'month':
      startDate = subDays(now, 30);
      break;
    case 'quarter':
      startDate = subDays(now, 90);
      break;
    default:
      return data;
  }

  return data.filter((item) => {
    const itemDate = new Date(item[dateField]);
    return isWithinInterval(itemDate, { start: startDate, end: now });
  });
};

/**
 * Calculate moving average for chart smoothing
 * @param data - Array of numeric values
 * @param windowSize - Size of moving average window
 * @returns Array of moving averages
 */
export const calculateMovingAverage = (data: number[], windowSize: number = 3): number[] => {
  if (data.length < windowSize) return data;

  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, start + windowSize);
    const slice = data.slice(start, end);
    const average = slice.reduce((sum, val) => sum + val, 0) / slice.length;
    result.push(Math.round(average * 100) / 100);
  }

  return result;
};

interface QuizGrouping {
  [date: string]: any[];
}

/**
 * Group quiz history by date
 * @param quizHistory - Array of quiz objects
 * @returns Object with dates as keys and quiz arrays as values
 */
export const groupQuizzesByDate = (quizHistory: any[]): QuizGrouping => {
  return quizHistory.reduce<QuizGrouping>((groups, quiz) => {
    const date = format(new Date(quiz.endTime || quiz.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(quiz);
    return groups;
  }, {});
};

interface PerformanceMetrics {
  averageScore: number;
  improvementTrend: number;
  consistencyScore: number;
  totalQuizzes: number;
}

/**
 * Calculate performance metrics for chart display
 * @param quizHistory - Array of quiz objects
 * @returns Performance metrics object
 */
export const calculatePerformanceMetrics = (quizHistory: any[]): PerformanceMetrics => {
  if (!quizHistory.length) {
    return {
      averageScore: 0,
      improvementTrend: 0,
      consistencyScore: 0,
      totalQuizzes: 0,
    };
  }

  const scores = quizHistory.map((quiz) => quiz.scorePercentage || 0);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  // Calculate improvement trend (comparing first half to second half)
  const halfPoint = Math.floor(scores.length / 2);
  const firstHalf = scores.slice(0, halfPoint);
  const secondHalf = scores.slice(halfPoint);

  const firstHalfAvg =
    firstHalf.length ? firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length : 0;
  const secondHalfAvg =
    secondHalf.length ? secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length : 0;
  const improvementTrend = secondHalfAvg - firstHalfAvg;

  // Calculate consistency (lower standard deviation = higher consistency)
  const variance =
    scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);
  const consistencyScore = Math.max(0, 100 - standardDeviation);

  return {
    averageScore: Math.round(averageScore),
    improvementTrend: Math.round(improvementTrend * 10) / 10,
    consistencyScore: Math.round(consistencyScore),
    totalQuizzes: quizHistory.length,
  };
};

interface StudyStreakEntry {
  date: string;
  hasActivity: boolean;
  quizCount: number;
  averageScore: number;
}

/**
 * Generate study streak data for calendar heatmap
 * @param quizHistory - Array of quiz objects
 * @param days - Number of days to include (default: 90)
 * @returns Array of date objects with study activity
 */
export const generateStudyStreakData = (quizHistory: any[], days: number = 90): StudyStreakEntry[] => {
  const streakData: StudyStreakEntry[] = [];
  const quizDates = new Set(
    quizHistory.map((quiz) => format(new Date(quiz.endTime || quiz.timestamp), 'yyyy-MM-dd'))
  );

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasActivity = quizDates.has(dateStr);
    const quizzesForDay = quizHistory.filter(
      (quiz) => format(new Date(quiz.endTime || quiz.timestamp), 'yyyy-MM-dd') === dateStr
    );

    streakData.push({
      date: dateStr,
      hasActivity,
      quizCount: quizzesForDay.length,
      averageScore:
        quizzesForDay.length > 0
          ? Math.round(
              quizzesForDay.reduce((sum, quiz) => sum + quiz.scorePercentage, 0) / quizzesForDay.length
            )
          : 0,
    });
  }

  return streakData;
};

interface CategoryStats {
  total: number;
  correct: number;
  averageTime: number;
  totalTime: number;
  accuracy: number;
  weakness: boolean;
}

interface CategoryPerformanceMap {
  [category: string]: CategoryStats;
}

/**
 * Calculate category performance from quiz history
 * @param quizHistory - Array of quiz objects with category information
 * @returns Category performance data
 */
export const calculateCategoryPerformance = (quizHistory: any[]): CategoryPerformanceMap => {
  const categoryStats: CategoryPerformanceMap = {};

  quizHistory.forEach((quiz) => {
    if (quiz.answers) {
      quiz.answers.forEach((answer: any) => {
        const category = answer.category || 'General';
        if (!categoryStats[category]) {
          categoryStats[category] = {
            total: 0,
            correct: 0,
            averageTime: 0,
            totalTime: 0,
            accuracy: 0,
            weakness: false,
          };
        }

        categoryStats[category].total++;
        if (answer.isCorrect) {
          categoryStats[category].correct++;
        }

        // Add time tracking if available
        if (answer.timeSpent) {
          categoryStats[category].totalTime += answer.timeSpent;
          categoryStats[category].averageTime =
            categoryStats[category].totalTime / categoryStats[category].total;
        }
      });
    }
  });

  // Convert to percentage and add derived metrics
  Object.keys(categoryStats).forEach((category) => {
    const stats = categoryStats[category];
    stats.accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    stats.weakness = stats.accuracy < 70; // Mark as weak area if < 70%
  });

  return categoryStats;
};

interface DifficultyStats {
  [difficulty: string]: {
    total: number;
    correct: number;
    percentage?: number;
  };
}

/**
 * Generate data for difficulty distribution chart
 * @param quizHistory - Array of quiz objects
 * @returns Difficulty distribution data
 */
export const calculateDifficultyDistribution = (quizHistory: any[]): DifficultyStats => {
  const difficultyStats: DifficultyStats = {
    beginner: { total: 0, correct: 0 },
    intermediate: { total: 0, correct: 0 },
    advanced: { total: 0, correct: 0 },
  };

  quizHistory.forEach((quiz) => {
    if (quiz.answers) {
      quiz.answers.forEach((answer: any) => {
        const difficulty = answer.difficulty || 'intermediate';
        if (difficultyStats[difficulty]) {
          difficultyStats[difficulty].total++;
          if (answer.isCorrect) {
            difficultyStats[difficulty].correct++;
          }
        }
      });
    }
  });

  // Calculate percentages
  Object.keys(difficultyStats).forEach((difficulty) => {
    const stats = difficultyStats[difficulty];
    stats.percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  });

  return difficultyStats;
};

/**
 * Format numbers for chart display
 * @param value - Number to format
 * @param type - Format type ('percentage', 'decimal', 'integer', 'time')
 * @returns Formatted number string
 */
export const formatChartNumber = (value: number, type: string = 'integer'): string | number => {
  switch (type) {
    case 'percentage':
      return `${Math.round(value)}%`;
    case 'decimal':
      return Math.round(value * 100) / 100;
    case 'time':
      return `${Math.round(value)}s`;
    default:
      return Math.round(value);
  }
};

export default {
  formatChartDate,
  filterDataByPeriod,
  calculateMovingAverage,
  groupQuizzesByDate,
  calculatePerformanceMetrics,
  generateStudyStreakData,
  calculateCategoryPerformance,
  calculateDifficultyDistribution,
  formatChartNumber,
};
