/**
 * Chart Configuration and Theme Settings
 * Shared configuration for all analytics charts
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Medical education color palette
export const chartColors = {
  primary: 'rgb(59, 130, 246)', // Blue - primary actions
  secondary: 'rgb(107, 114, 128)', // Gray - secondary info
  success: 'rgb(34, 197, 94)', // Green - correct/good performance
  warning: 'rgb(251, 146, 60)', // Orange - needs attention
  danger: 'rgb(239, 68, 68)', // Red - incorrect/poor performance
  purple: 'rgb(147, 51, 234)', // Purple - FSRS/spaced repetition
  teal: 'rgb(20, 184, 166)', // Teal - analytics/insights
  pink: 'rgb(236, 72, 153)', // Pink - highlights

  // Transparency variants
  primaryAlpha: 'rgba(59, 130, 246, 0.1)',
  successAlpha: 'rgba(34, 197, 94, 0.1)',
  warningAlpha: 'rgba(251, 146, 60, 0.1)',
  dangerAlpha: 'rgba(239, 68, 68, 0.1)',
  purpleAlpha: 'rgba(147, 51, 234, 0.1)',

  // Gradient definitions
  gradients: {
    primary: ['rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.1)'],
    success: ['rgba(34, 197, 94, 0.8)', 'rgba(34, 197, 94, 0.1)'],
    purple: ['rgba(147, 51, 234, 0.8)', 'rgba(147, 51, 234, 0.1)'],
  },
};

// Common chart options
export const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12,
          family: '"Inter", sans-serif',
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: chartColors.primary,
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      usePointStyle: true,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(156, 163, 175, 0.1)',
        drawBorder: false,
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 11,
          family: '"Inter", sans-serif',
        },
      },
    },
    y: {
      grid: {
        color: 'rgba(156, 163, 175, 0.1)',
        drawBorder: false,
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 11,
          family: '"Inter", sans-serif',
        },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  animation: {
    duration: 750,
    easing: 'easeInOutQuart' as const,
  },
};

// Medical category color mapping
export const categoryColors: Record<string, string> = {
  'Bloodstream Infection in Nonneonates': chartColors.danger,
  'Bone/Joint': chartColors.warning,
  'Central Nervous System': chartColors.purple,
  'Ear, Nose, and Throat': chartColors.teal,
  Genitourinary: chartColors.primary,
  'Intra-abdominal': chartColors.success,
  'Neonatal Fever (Term Neonates)': chartColors.pink,
  Ophthalmologic: chartColors.secondary,
  Respiratory: chartColors.primary,
  'Skin and Soft Tissue Infections': chartColors.warning,
  General: chartColors.secondary,
};

// Difficulty level colors
export const difficultyColors: Record<string, string> = {
  beginner: chartColors.success,
  intermediate: chartColors.warning,
  advanced: chartColors.danger,
};

// Performance grade colors
export const performanceColors = {
  excellent: chartColors.success, // 90-100%
  good: chartColors.primary, // 70-89%
  fair: chartColors.warning, // 50-69%
  poor: chartColors.danger, // <50%
};

// Utility function to get performance color based on percentage
export const getPerformanceColor = (percentage: number): string => {
  if (percentage >= 90) return performanceColors.excellent;
  if (percentage >= 70) return performanceColors.good;
  if (percentage >= 50) return performanceColors.fair;
  return performanceColors.poor;
};

// Create gradient for canvas context
export const createGradient = (
  ctx: CanvasRenderingContext2D,
  colorStops: string[],
  direction: 'vertical' | 'horizontal' = 'vertical'
): CanvasGradient => {
  const gradient =
    direction === 'vertical'
      ? ctx.createLinearGradient(0, 0, 0, 400)
      : ctx.createLinearGradient(0, 0, 400, 0);

  colorStops.forEach((color, index) => {
    gradient.addColorStop(index / (colorStops.length - 1), color);
  });

  return gradient;
};

// Time period options for analytics
export interface TimePeriod {
  value: string;
  label: string;
}

export const timePeriods: TimePeriod[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'all', label: 'All Time' },
];

// Chart size presets
export const chartSizes = {
  small: { width: 300, height: 200 },
  medium: { width: 400, height: 300 },
  large: { width: 600, height: 400 },
  xlarge: { width: 800, height: 500 },
};

export default {
  chartColors,
  commonOptions,
  categoryColors,
  difficultyColors,
  performanceColors,
  getPerformanceColor,
  createGradient,
  timePeriods,
  chartSizes,
};
