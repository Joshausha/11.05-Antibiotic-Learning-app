import React from "react";
import { Antibiotic } from "../../types/medical.types";

interface PairComparisonProps {
  leftAntibiotic: Antibiotic | null;
  rightAntibiotic: Antibiotic | null;
  onClose: () => void;
}

/**
 * Side-by-side pair comparison for two antibiotics
 * Shows properties in parallel with visual highlighting for differences
 */
export const PairComparison: React.FC<PairComparisonProps> = ({
  leftAntibiotic,
  rightAntibiotic,
  onClose
}) => {
  // Show selection prompt if either antibiotic is missing
  if (!leftAntibiotic || !rightAntibiotic) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p className="text-lg">Select two antibiotics to compare</p>
      </div>
    );
  }

  return (
    <div className="relative border rounded-lg p-4 bg-white">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
        aria-label="Close comparison"
      >
        ×
      </button>

      {/* Two-column grid layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="border-r pr-4">
          <h2 className="text-2xl font-bold mb-1">{leftAntibiotic.name}</h2>
          <h3 className="text-lg text-gray-600 mb-4">{leftAntibiotic.class}</h3>
          <div className="space-y-2">
            {/* Content area for property rows - will be added in Task 2 */}
          </div>
        </div>

        {/* Right column */}
        <div className="pl-4">
          <h2 className="text-2xl font-bold mb-1">{rightAntibiotic.name}</h2>
          <h3 className="text-lg text-gray-600 mb-4">{rightAntibiotic.class}</h3>
          <div className="space-y-2">
            {/* Content area for property rows - will be added in Task 2 */}
          </div>
        </div>
      </div>
    </div>
  );
};
