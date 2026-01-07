import React, { useMemo } from "react";
import { Antibiotic } from "../../types/medical.types";
import { findSimilarities, SimilarProperty } from "../../utils/comparisonUtils";

interface SimilaritiesSectionProps {
  /** Reference antibiotic for comparison */
  referenceAntibiotic: Antibiotic;

  /** Antibiotic being compared to reference */
  comparisonAntibiotic: Antibiotic;
}

/**
 * Similarities Section Component
 *
 * Displays shared properties between reference and comparison antibiotics.
 * Emphasizes "similarities first" approach to build on existing knowledge
 * (per Phase 03-CONTEXT learning strategy).
 *
 * Visual encoding:
 * - Green checkmarks (✓) for each similarity
 * - Green text color (text-green-700) for positive reinforcement
 * - Clear formatting: "Both are [value]" pattern
 *
 * Performance:
 * - useMemo caches similarity calculations
 * - Only recalculates when antibiotics change
 *
 * @example
 * <SimilaritiesSection
 *   referenceAntibiotic={ceftriaxone}
 *   comparisonAntibiotic={cefepime}
 * />
 */
export const SimilaritiesSection: React.FC<SimilaritiesSectionProps> = ({
  referenceAntibiotic,
  comparisonAntibiotic
}) => {
  // Memoize similarity calculations for performance
  const similarities = useMemo(
    () => findSimilarities(referenceAntibiotic, comparisonAntibiotic),
    [referenceAntibiotic, comparisonAntibiotic]
  );

  // Handle case with no similarities
  if (similarities.length === 0) {
    return (
      <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
        <p className="text-sm text-gray-600 italic">
          No major similarities found with {referenceAntibiotic.name}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {/* Section Header */}
      <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Similarities with {referenceAntibiotic.name}
      </h4>

      {/* Similarities List */}
      <ul className="space-y-2">
        {similarities.map((similarity: SimilarProperty) => (
          <li
            key={similarity.propertyName}
            className="flex items-start text-sm text-gray-700"
          >
            {/* Green checkmark icon */}
            <span className="text-green-600 font-bold mr-2 flex-shrink-0">✓</span>

            {/* Similarity description */}
            <span>
              <span className="font-medium">{similarity.displayLabel}:</span>{" "}
              {similarity.sharedValue}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
