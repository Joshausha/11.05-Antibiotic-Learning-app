import React from "react";

interface MechanismComparisonWidgetProps {
  /** Reference antibiotic's mechanism of action */
  referenceMechanism: string;

  /** Comparison antibiotic's mechanism of action */
  comparisonMechanism: string;

  /** Reference antibiotic name for display */
  referenceName: string;

  /** Comparison antibiotic name for display */
  comparisonName: string;
}

/**
 * Mechanism Comparison Widget
 *
 * Prominent side-by-side comparison of mechanism of action - the most
 * clinically important differentiating property between antibiotics.
 *
 * Visual encoding:
 * - Same mechanism: Green background, checkmark, "Same" label
 * - Different mechanism: Red background, X mark, "Different" label
 *
 * Layout:
 * - Left card: Reference mechanism (blue background)
 * - Arrow/indicator in middle showing relationship
 * - Right card: Comparison mechanism (green if same, red if different)
 *
 * Placed at TOP of each comparison card for immediate visibility
 * (per Phase 03-CONTEXT: mechanism is essential property).
 *
 * @example
 * <MechanismComparisonWidget
 *   referenceMechanism="Cell wall synthesis inhibition"
 *   comparisonMechanism="Cell wall synthesis inhibition"
 *   referenceName="Ceftriaxone"
 *   comparisonName="Cefepime"
 * />
 */
export const MechanismComparisonWidget: React.FC<MechanismComparisonWidgetProps> = ({
  referenceMechanism,
  comparisonMechanism,
  referenceName,
  comparisonName
}) => {
  const isSameMechanism = referenceMechanism === comparisonMechanism;

  // Truncate long mechanisms for display
  const truncate = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="mb-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Mechanism of Action
        </h5>
        {/* Same/Different Badge */}
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            isSameMechanism
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isSameMechanism ? (
            <>
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Same
            </>
          ) : (
            <>
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Different
            </>
          )}
        </span>
      </div>

      {/* Mechanism Cards */}
      <div className="flex gap-2 items-stretch">
        {/* Reference Mechanism Card */}
        <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="text-xs text-blue-600 font-medium mb-1">
            {referenceName}
          </div>
          <div className="text-xs text-gray-700" title={referenceMechanism}>
            {truncate(referenceMechanism)}
          </div>
        </div>

        {/* Arrow Indicator */}
        <div className="flex items-center px-1">
          <span
            className={`text-lg ${
              isSameMechanism ? "text-green-500" : "text-red-500"
            }`}
          >
            {isSameMechanism ? "=" : "≠"}
          </span>
        </div>

        {/* Comparison Mechanism Card */}
        <div
          className={`flex-1 rounded-lg p-2 border ${
            isSameMechanism
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div
            className={`text-xs font-medium mb-1 ${
              isSameMechanism ? "text-green-600" : "text-red-600"
            }`}
          >
            {comparisonName}
          </div>
          <div className="text-xs text-gray-700" title={comparisonMechanism}>
            {truncate(comparisonMechanism)}
          </div>
        </div>
      </div>

      {/* Explanation Text */}
      <div className="mt-2 text-xs text-gray-500 italic">
        {isSameMechanism ? (
          <>Both inhibit: {truncate(referenceMechanism, 50)}</>
        ) : (
          <>
            {referenceName} and {comparisonName} have different mechanisms
          </>
        )}
      </div>
    </div>
  );
};
