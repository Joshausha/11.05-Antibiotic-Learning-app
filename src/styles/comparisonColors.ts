/**
 * Comparison Color Constants
 *
 * Consistent color scheme for visual differentiation across all comparison modes.
 * Uses Tailwind CSS classes for styling.
 */

/**
 * Color scheme for "same" properties (similarities)
 */
export const SAME_COLOR = {
  bg: 'bg-green-100',
  text: 'text-green-700',
  border: 'border-green-500',
  full: 'bg-green-100 text-green-700 border-green-500'
} as const;

/**
 * Color scheme for "different" properties (high significance)
 */
export const DIFFERENT_COLOR = {
  bg: 'bg-red-100',
  text: 'text-red-700',
  border: 'border-red-500',
  full: 'bg-red-100 text-red-700 border-red-500'
} as const;

/**
 * Color scheme for "similar" properties (medium significance)
 */
export const SIMILAR_COLOR = {
  bg: 'bg-yellow-100',
  text: 'text-yellow-700',
  border: 'border-yellow-500',
  full: 'bg-yellow-100 text-yellow-700 border-yellow-500'
} as const;

/**
 * Color scheme for "complementary" properties
 */
export const COMPLEMENTARY_COLOR = {
  bg: 'bg-blue-100',
  text: 'text-blue-700',
  border: 'border-blue-500',
  full: 'bg-blue-100 text-blue-700 border-blue-500'
} as const;

/**
 * Diff type to color mapping
 */
export type DiffType = 'same' | 'different' | 'similar' | 'complementary';

/**
 * Color scheme type
 */
export interface ColorScheme {
  readonly bg: string;
  readonly text: string;
  readonly border: string;
  readonly full: string;
}

/**
 * Get color classes for a diff type
 */
export function getDiffColors(type: DiffType): ColorScheme {
  switch (type) {
    case 'same':
      return SAME_COLOR;
    case 'different':
      return DIFFERENT_COLOR;
    case 'similar':
      return SIMILAR_COLOR;
    case 'complementary':
      return COMPLEMENTARY_COLOR;
  }
}

/**
 * Coverage level color mapping
 */
export const COVERAGE_COLORS = {
  none: 'bg-gray-200',
  moderate: 'bg-yellow-400',
  good: 'bg-green-500'
} as const;

/**
 * Get coverage color class from coverage level
 */
export function getCoverageColorClass(level: 0 | 1 | 2): string {
  switch (level) {
    case 0:
      return COVERAGE_COLORS.none;
    case 1:
      return COVERAGE_COLORS.moderate;
    case 2:
      return COVERAGE_COLORS.good;
  }
}
