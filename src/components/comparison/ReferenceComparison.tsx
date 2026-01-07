import React from "react";
import { Antibiotic } from "../../types/medical.types";
import { SimilaritiesSection } from "./SimilaritiesSection";

interface ReferenceComparisonProps {
  /** Reference antibiotic for comparison (left panel) */
  referenceAntibiotic: Antibiotic | null;

  /** Array of antibiotics to compare against reference */
  comparisonAntibiotics: Antibiotic[];

  /** Callback when removing a comparison antibiotic */
  onRemoveComparison?: (antibioticName: string) => void;

  /** Callback when closing the comparison view */
  onClose?: () => void;
}

/**
 * Reference Comparison Layout
 *
 * PRIMARY learning mode - asymmetric layout emphasizing the reference antibiotic
 * as the foundation for comparison. Follows "similarities first" approach to
 * build on existing knowledge (per Phase 03-CONTEXT).
 *
 * Layout:
 * - Left: Reference antibiotic (30% width, fixed, blue background)
 * - Right: Comparison antibiotics (70% width, scrollable 2-column grid)
 *
 * @example
 * <ReferenceComparison
 *   referenceAntibiotic={ceftriaxone}
 *   comparisonAntibiotics={[cefepime, cefotaxime]}
 *   onRemoveComparison={(name) => handleRemove(name)}
 * />
 */
export const ReferenceComparison: React.FC<ReferenceComparisonProps> = ({
  referenceAntibiotic,
  comparisonAntibiotics,
  onRemoveComparison,
  onClose
}) => {
  // Handle case where no reference antibiotic is selected
  if (!referenceAntibiotic) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">No reference antibiotic selected</p>
          <p className="text-sm text-gray-500">Select a reference antibiotic to begin comparison</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-full">
      {/* Left Panel: Reference Antibiotic (30% width, fixed) */}
      <div className="w-[30%] bg-blue-50 border-2 border-blue-500 rounded-lg p-4 flex-shrink-0">
        {/* Reference Label */}
        <div className="mb-4">
          <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Reference
          </span>
        </div>

        {/* Antibiotic Name */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {referenceAntibiotic.name}
        </h2>

        {/* Antibiotic Class */}
        <h3 className="text-lg text-blue-700 font-semibold mb-4">
          {referenceAntibiotic.class}
        </h3>

        {/* Key Properties */}
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase mb-1">
              Category
            </div>
            <div className="text-sm text-gray-900">
              {referenceAntibiotic.category}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase mb-1">
              Mechanism
            </div>
            <div className="text-sm text-gray-900">
              {referenceAntibiotic.mechanism}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase mb-1">
              Formulations
            </div>
            <div className="text-sm text-gray-900">
              {referenceAntibiotic.formulations.join(", ")}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase mb-1">
              Common Uses
            </div>
            <div className="text-sm text-gray-900">
              {referenceAntibiotic.commonUses.slice(0, 3).join(", ")}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Comparison Antibiotics (70% width, scrollable grid) */}
      <div className="flex-1 overflow-y-auto">
        {comparisonAntibiotics.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-2">No comparison antibiotics selected</p>
              <p className="text-sm text-gray-500">Add antibiotics to compare against {referenceAntibiotic.name}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {comparisonAntibiotics.map((antibiotic) => (
              <div
                key={antibiotic.id}
                className="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
              >
                {/* Comparison Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {antibiotic.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {antibiotic.class}
                    </p>
                  </div>

                  {/* Remove Button */}
                  {onRemoveComparison && (
                    <button
                      onClick={() => onRemoveComparison(antibiotic.name)}
                      className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                      aria-label={`Remove ${antibiotic.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Similarities Section */}
                <div className="border-t pt-3">
                  <SimilaritiesSection
                    referenceAntibiotic={referenceAntibiotic}
                    comparisonAntibiotic={antibiotic}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
