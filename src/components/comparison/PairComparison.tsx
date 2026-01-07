import React from "react";
import { Antibiotic } from "../../types/medical.types";
import { PropertyComparisonRow } from "./PropertyComparisonRow";

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

  // Count Northwestern coverage for summary display
  const countCoverage = (antibiotic: Antibiotic): number => {
    return Object.values(antibiotic.northwesternSpectrum).filter(level => level >= 1).length;
  };

  const leftCoverageCount = countCoverage(leftAntibiotic);
  const rightCoverageCount = countCoverage(rightAntibiotic);

  return (
    <div className="relative border rounded-lg p-6 bg-white">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
        aria-label="Close comparison"
      >
        ×
      </button>

      {/* Headers showing antibiotic names */}
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div></div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{leftAntibiotic.name}</h2>
            <h3 className="text-lg text-gray-600">{leftAntibiotic.class}</h3>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{rightAntibiotic.name}</h2>
            <h3 className="text-lg text-gray-600">{rightAntibiotic.class}</h3>
          </div>
        </div>
      </div>

      {/* Property comparison rows */}
      <div className="space-y-0">
        <PropertyComparisonRow
          propertyName="Mechanism"
          leftValue={leftAntibiotic.mechanism}
          rightValue={rightAntibiotic.mechanism}
          isDifferent={leftAntibiotic.mechanism !== rightAntibiotic.mechanism}
        />

        <PropertyComparisonRow
          propertyName="Class"
          leftValue={leftAntibiotic.class}
          rightValue={rightAntibiotic.class}
          isDifferent={leftAntibiotic.class !== rightAntibiotic.class}
        />

        <PropertyComparisonRow
          propertyName="Formulations"
          leftValue={leftAntibiotic.formulations}
          rightValue={rightAntibiotic.formulations}
          isDifferent={JSON.stringify(leftAntibiotic.formulations) !== JSON.stringify(rightAntibiotic.formulations)}
        />

        <PropertyComparisonRow
          propertyName="Coverage"
          leftValue={`${leftCoverageCount} segments covered`}
          rightValue={`${rightCoverageCount} segments covered`}
          isDifferent={leftCoverageCount !== rightCoverageCount}
        />
      </div>
    </div>
  );
};
