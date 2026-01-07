import React from "react";
import { Antibiotic } from "../../types/medical.types";
import { CompactAntibioticCard } from "./CompactAntibioticCard";
import useResponsive from "../../hooks/useResponsive";

interface GridComparisonProps {
  /** Array of antibiotics to compare (3-6 items optimal) */
  antibiotics: Antibiotic[];

  /** Callback when removing an antibiotic from grid */
  onRemove?: (antibioticId: number) => void;

  /** Callback when closing the grid view */
  onClose?: () => void;

  /** ID of highlighted antibiotic (optional) */
  highlightedId?: number;
}

/**
 * Grid Comparison Component
 *
 * Responsive grid layout for comparing 3-6 antibiotics simultaneously.
 * Provides overview for pattern recognition across multiple options.
 *
 * Layout:
 * - Mobile: 1 column
 * - Tablet (md): 2 columns
 * - Desktop (lg): 3 columns
 *
 * Validation:
 * - Minimum 3 antibiotics for meaningful grid comparison
 * - Maximum 6 antibiotics to prevent cognitive overload
 *
 * @example
 * <GridComparison
 *   antibiotics={[ceftriaxone, cefepime, cefotaxime, meropenem]}
 *   onRemove={(id) => handleRemove(id)}
 *   onClose={() => setShowGrid(false)}
 * />
 */
export const GridComparison: React.FC<GridComparisonProps> = ({
  antibiotics,
  onRemove,
  onClose,
  highlightedId
}) => {
  const isMobile = useResponsive();

  // Validation: Minimum 3 antibiotics for grid comparison
  if (antibiotics.length < 3) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        <p className="text-lg text-gray-600 mb-2 text-center">
          Select at least 3 antibiotics for grid comparison
        </p>
        <p className="text-sm text-gray-500 text-center">
          Currently selected: {antibiotics.length} of 3 minimum
        </p>
      </div>
    );
  }

  // Validation: Maximum 6 antibiotics warning
  const showMaxWarning = antibiotics.length > 6;

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Comparing {antibiotics.length} Antibiotics
          </h2>
          {showMaxWarning && (
            <p className="text-sm text-orange-600 mt-1">
              ⚠ Maximum 6 antibiotics recommended for grid view
            </p>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close Grid
          </button>
        )}
      </div>

      {/* Mobile simplified header */}
      {isMobile && (
        <p className="text-xs text-gray-500 mb-3">
          Tap card for details. Scroll to see all.
        </p>
      )}

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {antibiotics.map((antibiotic) => (
          <CompactAntibioticCard
            key={antibiotic.id}
            antibiotic={antibiotic}
            onRemove={onRemove ? () => onRemove(antibiotic.id) : undefined}
            isHighlighted={highlightedId === antibiotic.id}
          />
        ))}
      </div>

      {/* Coverage Legend (desktop only) */}
      {!isMobile && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Coverage Legend</div>
          <div className="flex gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Good</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span>None</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
