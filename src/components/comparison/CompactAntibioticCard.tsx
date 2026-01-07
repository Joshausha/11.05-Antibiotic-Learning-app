import React from "react";
import { Antibiotic, CoverageLevel } from "../../types/medical.types";
import useResponsive from "../../hooks/useResponsive";

interface CompactAntibioticCardProps {
  /** Antibiotic to display */
  antibiotic: Antibiotic;

  /** Callback when removing this antibiotic from grid */
  onRemove?: () => void;

  /** Whether this card is highlighted (e.g., selected for detailed view) */
  isHighlighted?: boolean;
}

/**
 * Coverage level to color mapping
 */
function getCoverageColor(level: CoverageLevel): string {
  switch (level) {
    case 0:
      return "bg-gray-200";
    case 1:
      return "bg-yellow-400";
    case 2:
      return "bg-green-500";
  }
}

/**
 * Compact Antibiotic Card Component
 *
 * Compact vertical layout for grid comparison view.
 * Shows key properties in dense format suitable for 3-6 item comparison.
 *
 * Features:
 * - Compact property list (mechanism, class, formulations, route)
 * - Northwestern coverage visualization (8 colored circles)
 * - Remove button for grid management
 * - Highlight state for selection
 * - Mobile-optimized with abbreviated labels
 *
 * @example
 * <CompactAntibioticCard
 *   antibiotic={ceftriaxone}
 *   onRemove={() => handleRemove(ceftriaxone.id)}
 *   isHighlighted={selectedId === ceftriaxone.id}
 * />
 */
export const CompactAntibioticCard: React.FC<CompactAntibioticCardProps> = ({
  antibiotic,
  onRemove,
  isHighlighted = false
}) => {
  const isMobile = useResponsive();

  // Defensive: early return if antibiotic is undefined/null
  if (!antibiotic) {
    return null;
  }

  // Format labels based on screen size
  const labels = isMobile
    ? { mechanism: "Mech:", class: "Class:", forms: "Forms:", route: "Route:" }
    : { mechanism: "Mechanism:", class: "Class:", forms: "Formulations:", route: "Route:" };

  // Get primary route (first formulation) with defensive access
  const formulations = antibiotic.formulations || [];
  const primaryRoute = formulations[0] || "N/A";

  return (
    <div
      className={`
        border rounded-lg shadow-sm
        p-2 md:p-4
        ${isHighlighted ? "border-2 border-blue-500 bg-blue-50" : "border border-gray-200 bg-white"}
        transition-all duration-200 hover:shadow-md
      `}
    >
      {/* Header with name and remove button */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm lg:text-base font-bold text-gray-900 leading-tight">
          {antibiotic.name}
        </h3>

        {onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-600 transition-colors p-1"
            aria-label={`Remove ${antibiotic.name}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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

      {/* Property List */}
      <div className="space-y-1 text-xs lg:text-sm">
        {/* Mechanism */}
        <div className="flex">
          <span className="text-gray-500 w-16 lg:w-24 flex-shrink-0">{labels.mechanism}</span>
          <span className="text-gray-700 truncate" title={antibiotic.mechanism || ""}>
            {(antibiotic.mechanism || "").length > 40
              ? (antibiotic.mechanism || "").substring(0, 40) + "..."
              : antibiotic.mechanism || "N/A"}
          </span>
        </div>

        {/* Class */}
        <div className="flex">
          <span className="text-gray-500 w-16 lg:w-24 flex-shrink-0">{labels.class}</span>
          <span className="text-gray-700">{antibiotic.class || "N/A"}</span>
        </div>

        {/* Formulations */}
        <div className="flex">
          <span className="text-gray-500 w-16 lg:w-24 flex-shrink-0">{labels.forms}</span>
          <span className="text-gray-700">{formulations.join(", ") || "N/A"}</span>
        </div>

        {/* Route (just first formulation for compact view) */}
        <div className="flex">
          <span className="text-gray-500 w-16 lg:w-24 flex-shrink-0">{labels.route}</span>
          <span className="text-gray-700">{primaryRoute}</span>
        </div>
      </div>

      {/* Northwestern Coverage Visualization - hidden on mobile */}
      {!isMobile && antibiotic.northwesternSpectrum && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Coverage</div>
          <div className="flex gap-1" title="Northwestern 8-segment coverage">
            {/* MRSA */}
            <div
              className={`w-3 h-3 rounded-full ${getCoverageColor(antibiotic.northwesternSpectrum.MRSA)}`}
              title={`MRSA: ${antibiotic.northwesternSpectrum.MRSA === 2 ? "Good" : antibiotic.northwesternSpectrum.MRSA === 1 ? "Moderate" : "None"}`}
            />
            {/* MSSA */}
            <div
              className={`w-3 h-3 rounded-full ${getCoverageColor(antibiotic.northwesternSpectrum.MSSA)}`}
              title={`MSSA: ${antibiotic.northwesternSpectrum.MSSA === 2 ? "Good" : antibiotic.northwesternSpectrum.MSSA === 1 ? "Moderate" : "None"}`}
            />
            {/* VRE */}
            <div
              className={`w-3 h-3 rounded-full ${getCoverageColor(antibiotic.northwesternSpectrum.VRE_faecium)}`}
              title={`VRE: ${antibiotic.northwesternSpectrum.VRE_faecium === 2 ? "Good" : antibiotic.northwesternSpectrum.VRE_faecium === 1 ? "Moderate" : "None"}`}
            />
            {/* E. faecalis */}
            <div
              className={`w-3 h-3 rounded-full ${getCoverageColor(antibiotic.northwesternSpectrum.enterococcus_faecalis)}`}
              title={`E. faecalis: ${antibiotic.northwesternSpectrum.enterococcus_faecalis === 2 ? "Good" : antibiotic.northwesternSpectrum.enterococcus_faecalis === 1 ? "Moderate" : "None"}`}
            />
            {/* Gram-negative */}
            <div
              className={`w-3 h-3 rounded-full ${getCoverageColor(antibiotic.northwesternSpectrum.gramNegative)}`}
              title={`Gram-negative: ${antibiotic.northwesternSpectrum.gramNegative === 2 ? "Good" : antibiotic.northwesternSpectrum.gramNegative === 1 ? "Moderate" : "None"}`}
            />
            {/* Pseudomonas */}
            <div
              className={`w-3 h-3 rounded-full ${getCoverageColor(antibiotic.northwesternSpectrum.pseudomonas)}`}
              title={`Pseudomonas: ${antibiotic.northwesternSpectrum.pseudomonas === 2 ? "Good" : antibiotic.northwesternSpectrum.pseudomonas === 1 ? "Moderate" : "None"}`}
            />
            {/* Anaerobes */}
            <div
              className={`w-3 h-3 rounded-full ${getCoverageColor(antibiotic.northwesternSpectrum.anaerobes)}`}
              title={`Anaerobes: ${antibiotic.northwesternSpectrum.anaerobes === 2 ? "Good" : antibiotic.northwesternSpectrum.anaerobes === 1 ? "Moderate" : "None"}`}
            />
            {/* Atypicals */}
            <div
              className={`w-3 h-3 rounded-full ${getCoverageColor(antibiotic.northwesternSpectrum.atypicals)}`}
              title={`Atypicals: ${antibiotic.northwesternSpectrum.atypicals === 2 ? "Good" : antibiotic.northwesternSpectrum.atypicals === 1 ? "Moderate" : "None"}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
