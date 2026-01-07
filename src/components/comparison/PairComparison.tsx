import React, { useMemo } from "react";
import { Antibiotic } from "../../types/medical.types";
import { PropertyComparisonRow } from "./PropertyComparisonRow";

interface PairComparisonProps {
  leftAntibiotic: Antibiotic | null;
  rightAntibiotic: Antibiotic | null;
  onClose: () => void;
}

interface PropertyDiff {
  propertyName: string;
  leftValue: string | string[];
  rightValue: string | string[];
  isDifferent: boolean;
}

/**
 * Compare two antibiotics and return property differences
 */
const compareProperties = (left: Antibiotic, right: Antibiotic): PropertyDiff[] => {
  // Count Northwestern coverage for summary display
  const countCoverage = (antibiotic: Antibiotic): number => {
    return Object.values(antibiotic.northwesternSpectrum).filter(level => level >= 1).length;
  };

  const leftCoverageCount = countCoverage(left);
  const rightCoverageCount = countCoverage(right);

  // Compare Northwestern spectrum segments
  const spectrumDifferent = Object.keys(left.northwesternSpectrum).some(
    (segment) => {
      const key = segment as keyof typeof left.northwesternSpectrum;
      return left.northwesternSpectrum[key] !== right.northwesternSpectrum[key];
    }
  );

  return [
    {
      propertyName: "Mechanism",
      leftValue: left.mechanism,
      rightValue: right.mechanism,
      isDifferent: left.mechanism !== right.mechanism
    },
    {
      propertyName: "Class",
      leftValue: left.class,
      rightValue: right.class,
      isDifferent: left.class !== right.class
    },
    {
      propertyName: "Formulations",
      leftValue: left.formulations,
      rightValue: right.formulations,
      isDifferent: JSON.stringify(left.formulations) !== JSON.stringify(right.formulations)
    },
    {
      propertyName: "Coverage",
      leftValue: `${leftCoverageCount} segments covered`,
      rightValue: `${rightCoverageCount} segments covered`,
      isDifferent: spectrumDifferent
    }
  ];
};

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

  // Memoize comparison results - only recalculate when antibiotics change
  const propertyDiffs = useMemo(
    () => compareProperties(leftAntibiotic, rightAntibiotic),
    [leftAntibiotic, rightAntibiotic]
  );

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

      {/* Visual legend */}
      <div className="mb-4 flex items-center gap-4 text-sm">
        <span className="font-semibold text-gray-700">Legend:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-50 border border-gray-300 rounded"></div>
          <span className="text-gray-600">Same</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-50 border border-yellow-300 rounded"></div>
          <span className="text-gray-600">Different</span>
        </div>
      </div>

      {/* Property comparison rows */}
      <div className="space-y-0">
        {propertyDiffs.map((diff) => (
          <PropertyComparisonRow
            key={diff.propertyName}
            propertyName={diff.propertyName}
            leftValue={diff.leftValue}
            rightValue={diff.rightValue}
            isDifferent={diff.isDifferent}
          />
        ))}
      </div>
    </div>
  );
};
