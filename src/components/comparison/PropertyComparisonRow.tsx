import React from "react";

interface PropertyComparisonRowProps {
  propertyName: string;
  leftValue: string | string[];
  rightValue: string | string[];
  isDifferent: boolean;
}

/**
 * Property comparison row for side-by-side antibiotic comparison
 * Displays one property with values from both antibiotics
 * Highlights differences with yellow background
 */
export const PropertyComparisonRow: React.FC<PropertyComparisonRowProps> = ({
  propertyName,
  leftValue,
  rightValue,
  isDifferent
}) => {
  // Format value for display - handle arrays and objects
  const formatValue = (value: string | string[]): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  };

  const backgroundClass = isDifferent ? "bg-yellow-50" : "";

  return (
    <div className={`grid grid-cols-3 border-b py-2 ${backgroundClass}`}>
      {/* Property name (20% width) */}
      <div className="font-semibold text-gray-700 pr-2">
        {propertyName}
      </div>

      {/* Left value (40% width) */}
      <div className="text-gray-900">
        {formatValue(leftValue)}
      </div>

      {/* Right value (40% width) */}
      <div className="text-gray-900">
        {formatValue(rightValue)}
      </div>
    </div>
  );
};
