import React from "react";
import { DiffType, getDiffColors } from "../../styles/comparisonColors";

type DiffIndicatorSize = 'sm' | 'md' | 'lg';

interface DiffIndicatorProps {
  /** Type of difference to display */
  type: DiffType;

  /** Size variant */
  size?: DiffIndicatorSize;

  /** Optional label to display next to icon */
  label?: string;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Get icon for diff type
 */
function getDiffIcon(type: DiffType): string {
  switch (type) {
    case 'same':
      return '✓';
    case 'different':
      return '✗';
    case 'similar':
      return '~';
    case 'complementary':
      return '⟷';
  }
}

/**
 * Get size classes for indicator
 */
function getSizeClasses(size: DiffIndicatorSize): {
  text: string;
  padding: string;
  iconSize: string;
} {
  switch (size) {
    case 'sm':
      return {
        text: 'text-xs',
        padding: 'px-1.5 py-0.5',
        iconSize: 'text-xs'
      };
    case 'md':
      return {
        text: 'text-sm',
        padding: 'px-2 py-1',
        iconSize: 'text-sm'
      };
    case 'lg':
      return {
        text: 'text-base',
        padding: 'px-3 py-1.5',
        iconSize: 'text-base'
      };
  }
}

/**
 * Diff Indicator Component
 *
 * Visual indicator for difference types in comparison views.
 * Uses consistent color coding across all comparison modes.
 *
 * Types:
 * - same (green ✓): Properties that match
 * - different (red ✗): Properties that differ significantly
 * - similar (yellow ~): Properties that are close but not identical
 * - complementary (blue ⟷): Properties that complement each other
 *
 * Sizes:
 * - sm: Small badges for inline use
 * - md: Medium badges for lists
 * - lg: Large badges for headers
 *
 * @example
 * <DiffIndicator type="same" size="md" label="Matching" />
 * <DiffIndicator type="different" size="sm" />
 */
export const DiffIndicator: React.FC<DiffIndicatorProps> = ({
  type,
  size = 'md',
  label,
  className = ''
}) => {
  const colors = getDiffColors(type);
  const sizeClasses = getSizeClasses(size);
  const icon = getDiffIcon(type);

  return (
    <span
      className={`
        inline-flex items-center gap-1
        rounded-full border
        font-medium
        ${colors.bg} ${colors.text} ${colors.border}
        ${sizeClasses.padding} ${sizeClasses.text}
        ${className}
      `}
    >
      <span className={sizeClasses.iconSize}>{icon}</span>
      {label && <span>{label}</span>}
    </span>
  );
};

/**
 * Legend component showing all diff types
 *
 * Use to explain color coding to users.
 *
 * @example
 * <DiffLegend size="sm" />
 */
export const DiffLegend: React.FC<{ size?: DiffIndicatorSize }> = ({
  size = 'sm'
}) => {
  return (
    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
      <span className="text-gray-500 mr-1">Legend:</span>
      <DiffIndicator type="same" size={size} label="Same" />
      <DiffIndicator type="different" size={size} label="Different" />
      <DiffIndicator type="similar" size={size} label="Similar" />
      <DiffIndicator type="complementary" size={size} label="Complementary" />
    </div>
  );
};
