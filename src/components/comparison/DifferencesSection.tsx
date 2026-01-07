import React, { useMemo } from "react";
import { Antibiotic } from "../../types/medical.types";
import { findDifferences, DifferentProperty, DifferenceSignificance } from "../../utils/comparisonUtils";

interface DifferencesSectionProps {
  /** Reference antibiotic for comparison */
  referenceAntibiotic: Antibiotic;

  /** Antibiotic being compared to reference */
  comparisonAntibiotic: Antibiotic;
}

/**
 * Get Tailwind classes for significance level
 */
function getSignificanceClasses(significance: DifferenceSignificance): {
  textColor: string;
  icon: string;
} {
  switch (significance) {
    case "high":
      return { textColor: "text-red-700", icon: "⚠" };
    case "medium":
      return { textColor: "text-orange-600", icon: "⚡" };
    case "low":
      return { textColor: "text-gray-500", icon: "○" };
  }
}

/**
 * Differences Section Component
 *
 * Displays differing properties between reference and comparison antibiotics.
 * Follows "similarities first, then differences" approach (per Phase 03-CONTEXT).
 *
 * Visual encoding by significance:
 * - HIGH (red): Critical differences like mechanism of action
 * - MEDIUM (orange): Important differences like class/formulation
 * - LOW (gray): Minor differences like category
 *
 * Performance:
 * - useMemo caches difference calculations
 * - Only recalculates when antibiotics change
 *
 * @example
 * <DifferencesSection
 *   referenceAntibiotic={ceftriaxone}
 *   comparisonAntibiotic={vancomycin}
 * />
 */
export const DifferencesSection: React.FC<DifferencesSectionProps> = ({
  referenceAntibiotic,
  comparisonAntibiotic
}) => {
  // Memoize difference calculations for performance
  const differences = useMemo(
    () => findDifferences(referenceAntibiotic, comparisonAntibiotic),
    [referenceAntibiotic, comparisonAntibiotic]
  );

  // Handle case with no differences
  if (differences.length === 0) {
    return (
      <div className="p-3 bg-green-50 rounded border border-green-200">
        <p className="text-sm text-green-700 italic">
          Very similar to {referenceAntibiotic.name} - no major differences
        </p>
      </div>
    );
  }

  // Sort by significance: high → medium → low
  const sortedDifferences = [...differences].sort((a, b) => {
    const order: Record<DifferenceSignificance, number> = { high: 0, medium: 1, low: 2 };
    return order[a.significance] - order[b.significance];
  });

  return (
    <div>
      {/* Section Header */}
      <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Key Differences from {referenceAntibiotic.name}
      </h4>

      {/* Differences List */}
      <ul className="space-y-2">
        {sortedDifferences.map((difference: DifferentProperty) => {
          const { textColor, icon } = getSignificanceClasses(difference.significance);

          return (
            <li
              key={difference.propertyName}
              className={`flex items-start text-sm ${textColor}`}
            >
              {/* Significance icon */}
              <span className="font-bold mr-2 flex-shrink-0">{icon}</span>

              {/* Difference description */}
              <div className="flex-1">
                <span className="font-medium">{difference.displayLabel}:</span>{" "}
                <span className="text-gray-700">{difference.comparisonValue}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
