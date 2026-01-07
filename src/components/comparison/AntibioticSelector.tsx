/**
 * Antibiotic Selector Component
 *
 * Multi-select checkbox interface for choosing antibiotics to compare.
 * Groups antibiotics by class with expand/collapse functionality.
 * Enforces maximum selection limit to prevent cognitive overload.
 */

import React, { useState } from "react";
import { Antibiotic } from "../../types";

// ==========================================
// PROPS INTERFACE
// ==========================================

export interface AntibioticSelectorProps {
  /** Array of all available antibiotics */
  antibiotics: Antibiotic[];

  /** Array of currently selected antibiotic IDs */
  selectedIds: string[];

  /** Callback when selection changes - receives updated array of IDs */
  onSelectionChange: (selectedIds: string[]) => void;

  /** Maximum number of antibiotics that can be selected (default: 5) */
  maxSelections?: number;
}

// ==========================================
// COMPONENT
// ==========================================

/**
 * AntibioticSelector
 *
 * Checkbox-based multi-select interface for antibiotic comparison.
 * Groups by antibiotic class for easy navigation. Enforces selection limits
 * to maintain comparison usability.
 *
 * @example
 * <AntibioticSelector
 *   antibiotics={enhancedAntibiotics}
 *   selectedIds={["Vancomycin", "Linezolid"]}
 *   onSelectionChange={(ids) => setSelectedIds(ids)}
 *   maxSelections={5}
 * />
 */
export const AntibioticSelector: React.FC<AntibioticSelectorProps> = ({
  antibiotics,
  selectedIds,
  onSelectionChange,
  maxSelections = 5
}) => {
  // Track which class groups are expanded
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());

  // Group antibiotics by class
  const groupedByClass = antibiotics.reduce((groups, antibiotic) => {
    const className = antibiotic.class;
    if (!groups[className]) {
      groups[className] = [];
    }
    groups[className].push(antibiotic);
    return groups;
  }, {} as Record<string, Antibiotic[]>);

  // Sort class names for consistent display
  const sortedClasses = Object.keys(groupedByClass).sort();

  // Toggle expand/collapse for a class
  const toggleClass = (className: string) => {
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(className)) {
      newExpanded.delete(className);
    } else {
      newExpanded.add(className);
    }
    setExpandedClasses(newExpanded);
  };

  // Handle checkbox change for an antibiotic
  const handleCheckboxChange = (antibioticName: string, isChecked: boolean) => {
    let updatedIds: string[];

    if (isChecked) {
      // Add to selection
      updatedIds = [...selectedIds, antibioticName];
    } else {
      // Remove from selection
      updatedIds = selectedIds.filter(id => id !== antibioticName);
    }

    onSelectionChange(updatedIds);
  };

  // Check if selection limit is reached (for disabling checkboxes)
  const isMaxReached = selectedIds.length >= maxSelections;

  return (
    <div className="antibiotic-selector">
      <div className="selector-header">
        <h3>Select Antibiotics to Compare</h3>
        <div className="selection-count">
          {selectedIds.length} / {maxSelections} selected
        </div>
      </div>

      <div className="class-groups">
        {sortedClasses.map((className) => {
          const antibioticsInClass = groupedByClass[className];
          const isExpanded = expandedClasses.has(className);

          return (
            <div key={className} className="class-group">
              <button
                className="class-header"
                onClick={() => toggleClass(className)}
                type="button"
              >
                <span className="expand-icon">
                  {isExpanded ? "▼" : "▶"}
                </span>
                <span className="class-name">
                  {className} ({antibioticsInClass.length})
                </span>
              </button>

              {isExpanded && (
                <div className="antibiotic-list">
                  {antibioticsInClass.map((antibiotic) => {
                    const isSelected = selectedIds.includes(antibiotic.name);
                    const isDisabled = !isSelected && isMaxReached;

                    return (
                      <label
                        key={antibiotic.id}
                        className={`antibiotic-item ${isDisabled ? "disabled" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isDisabled}
                          onChange={(e) => handleCheckboxChange(antibiotic.name, e.target.checked)}
                        />
                        <span className="antibiotic-name">
                          {antibiotic.name}
                        </span>
                        <span className="antibiotic-class-label">
                          {antibiotic.category}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .antibiotic-selector {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          background: white;
        }

        .selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .selector-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .selection-count {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .class-groups {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .class-group {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
        }

        .class-header {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #f9fafb;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          transition: background 0.15s;
        }

        .class-header:hover {
          background: #f3f4f6;
        }

        .expand-icon {
          font-size: 10px;
          color: #6b7280;
        }

        .class-name {
          flex: 1;
          text-align: left;
        }

        .antibiotic-list {
          display: flex;
          flex-direction: column;
          padding: 8px;
          background: white;
        }

        .antibiotic-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.15s;
        }

        .antibiotic-item:hover:not(.disabled) {
          background: #f9fafb;
        }

        .antibiotic-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .antibiotic-item input[type="checkbox"] {
          cursor: pointer;
        }

        .antibiotic-item.disabled input[type="checkbox"] {
          cursor: not-allowed;
        }

        .antibiotic-name {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
          color: #111827;
        }

        .antibiotic-class-label {
          font-size: 12px;
          color: #6b7280;
          padding: 2px 8px;
          background: #f3f4f6;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};
