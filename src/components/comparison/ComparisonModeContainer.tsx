/**
 * Comparison Mode Container - Multi-Mode Interface
 *
 * Tabbed interface supporting three comparison approaches:
 * - Pair Comparison: Two antibiotics head-to-head
 * - Reference Mode (PRIMARY): Compare unfamiliar antibiotics against a known reference
 * - Grid View: Overview of 3-6 antibiotics simultaneously
 *
 * Created: Phase 3 Plan 7 - Comparison Mode Container
 * Purpose: Support different comparison learning approaches per user preference
 *
 * Pattern: Follows NetworkVisualizationContainer from Phase 2
 */

import React, { useState, useMemo, useEffect } from 'react';
import { ComparisonMode } from '../../types/comparison.types';
import { Antibiotic } from '../../types/medical.types';
import enhancedAntibiotics, { getAntibioticByName, EnhancedAntibiotic } from '../../data/EnhancedAntibioticData';
import { AntibioticSelector } from './AntibioticSelector';
import { PairComparison } from './PairComparison';
import { ReferenceComparison } from './ReferenceComparison';
import { GridComparison } from './GridComparison';
import { useSharedSelection } from '../../contexts/SharedSelectionContext';

interface ComparisonModeContainerProps {
  /** Optional initial mode (defaults to 'reference' as PRIMARY mode) */
  initialMode?: ComparisonMode;
  /** Optional callback when navigating to network selection */
  onSelectFromNetwork?: () => void;
}

interface ModeValidation {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Mode descriptions explaining each comparison approach
 */
const MODE_DESCRIPTIONS: Record<ComparisonMode, string> = {
  pair: "Compare two antibiotics head-to-head",
  reference: "Compare unfamiliar antibiotics against a known reference",
  grid: "Overview of 3-6 antibiotics simultaneously"
};

/**
 * Validate mode selection based on current antibiotic selection
 */
const validateModeSelection = (
  mode: ComparisonMode,
  selectedCount: number,
  hasReference: boolean
): ModeValidation => {
  switch (mode) {
    case 'pair':
      if (selectedCount !== 2) {
        return {
          isValid: false,
          errorMessage: `Pair mode requires exactly 2 antibiotics (currently ${selectedCount} selected)`
        };
      }
      return { isValid: true, errorMessage: null };

    case 'reference':
      if (!hasReference) {
        return {
          isValid: false,
          errorMessage: "Reference mode requires selecting a reference antibiotic"
        };
      }
      if (selectedCount < 2) {
        return {
          isValid: false,
          errorMessage: "Reference mode requires at least 1 reference + 1 comparison antibiotic"
        };
      }
      return { isValid: true, errorMessage: null };

    case 'grid':
      if (selectedCount < 3) {
        return {
          isValid: false,
          errorMessage: `Grid mode requires 3-6 antibiotics (currently ${selectedCount} selected)`
        };
      }
      if (selectedCount > 6) {
        return {
          isValid: false,
          errorMessage: `Grid mode works best with 3-6 antibiotics (currently ${selectedCount} selected)`
        };
      }
      return { isValid: true, errorMessage: null };

    default:
      return { isValid: true, errorMessage: null };
  }
};

/**
 * Multi-mode comparison container with tabbed interface
 *
 * Supports three comparison modes:
 * 1. pair - Side-by-side comparison of exactly 2 antibiotics
 * 2. reference - Compare multiple against one reference (PRIMARY mode)
 * 3. grid - Overview grid of 3-6 antibiotics
 */
export const ComparisonModeContainer: React.FC<ComparisonModeContainerProps> = ({
  initialMode = 'reference',
  onSelectFromNetwork
}) => {
  // Shared selection context for cross-mode persistence (Phase 6-02)
  const { selection, setAntibiotics: setSharedAntibiotics } = useSharedSelection();

  // State: comparison mode (default to 'reference' as PRIMARY per Phase 03-CONTEXT)
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>(initialMode);

  // State: selected antibiotic names
  const [selectedAntibiotics, setSelectedAntibiotics] = useState<string[]>([]);

  // State: reference antibiotic name (for reference mode)
  const [referenceAntibiotic, setReferenceAntibiotic] = useState<string | null>(null);

  // State: validation error message
  const [validationError, setValidationError] = useState<string | null>(null);

  // Track if we've initialized from shared context
  const [initializedFromShared, setInitializedFromShared] = useState(false);

  // Initialize from shared selection on mount (Phase 6-02: inherit selections from other modes)
  useEffect(() => {
    if (!initializedFromShared && selection.selectedAntibiotics.length > 0) {
      setSelectedAntibiotics(selection.selectedAntibiotics);
      setInitializedFromShared(true);
    }
  }, [selection.selectedAntibiotics, initializedFromShared]);

  // Sync local selections to shared context when they change (Phase 6-02: propagate to other modes)
  useEffect(() => {
    // Only sync if we have selections and they differ from shared
    if (initializedFromShared || selectedAntibiotics.length > 0) {
      const sharedSet = new Set(selection.selectedAntibiotics);
      const localSet = new Set(selectedAntibiotics);
      const areDifferent = selectedAntibiotics.length !== selection.selectedAntibiotics.length ||
        selectedAntibiotics.some(ab => !sharedSet.has(ab));

      if (areDifferent) {
        setSharedAntibiotics(selectedAntibiotics);
      }
    }
  }, [selectedAntibiotics, selection.selectedAntibiotics, setSharedAntibiotics, initializedFromShared]);

  // Convert selected names to Antibiotic objects
  const selectedAntibioticObjects = useMemo(() => {
    return selectedAntibiotics
      .map(name => getAntibioticByName(name))
      .filter((ab): ab is EnhancedAntibiotic => ab !== undefined);
  }, [selectedAntibiotics]);

  // Get reference antibiotic object
  const referenceAntibioticObject = useMemo(() => {
    return referenceAntibiotic ? getAntibioticByName(referenceAntibiotic) || null : null;
  }, [referenceAntibiotic]);

  // Get comparison antibiotics (all selected except reference)
  const comparisonAntibioticObjects = useMemo(() => {
    return selectedAntibioticObjects.filter(ab => ab.name !== referenceAntibiotic);
  }, [selectedAntibioticObjects, referenceAntibiotic]);

  // Handle mode switching with validation
  const handleModeSwitch = (newMode: ComparisonMode) => {
    const validation = validateModeSelection(
      newMode,
      selectedAntibiotics.length,
      referenceAntibiotic !== null
    );

    if (!validation.isValid) {
      setValidationError(validation.errorMessage);
      // Still allow mode switch but show warning
    } else {
      setValidationError(null);
    }

    setComparisonMode(newMode);
  };

  // Handle selection change from AntibioticSelector
  const handleSelectionChange = (newSelectedIds: string[]) => {
    setSelectedAntibiotics(newSelectedIds);

    // Clear reference if it's no longer selected
    if (referenceAntibiotic && !newSelectedIds.includes(referenceAntibiotic)) {
      setReferenceAntibiotic(null);
    }

    // Clear validation error when selection changes
    setValidationError(null);
  };

  // Handle setting reference antibiotic
  const handleSetReference = (antibioticName: string) => {
    if (selectedAntibiotics.includes(antibioticName)) {
      setReferenceAntibiotic(antibioticName);
      setValidationError(null);
    }
  };

  // Handle removing comparison antibiotic
  const handleRemoveComparison = (antibioticName: string) => {
    setSelectedAntibiotics(prev => prev.filter(name => name !== antibioticName));
  };

  // Handle removing antibiotic from grid (by ID)
  const handleRemoveFromGrid = (antibioticId: number) => {
    const antibiotic = selectedAntibioticObjects.find(ab => ab.id === antibioticId);
    if (antibiotic) {
      setSelectedAntibiotics(prev => prev.filter(name => name !== antibiotic.name));
    }
  };

  // Clear all selections
  const handleClearAll = () => {
    setSelectedAntibiotics([]);
    setReferenceAntibiotic(null);
    setValidationError(null);
  };

  // Close comparison view (for individual components)
  const handleClose = () => {
    // Currently just clears - could navigate away in future
    handleClearAll();
  };

  // Get mode-specific guidance text
  const getModeGuidance = (): string => {
    switch (comparisonMode) {
      case 'pair':
        return `Select exactly 2 antibiotics (${selectedAntibiotics.length}/2 selected)`;
      case 'reference':
        if (!referenceAntibiotic) {
          return "Select antibiotics, then click one to set as reference";
        }
        return `Reference: ${referenceAntibiotic} | Comparing: ${comparisonAntibioticObjects.length} antibiotic(s)`;
      case 'grid':
        return `Select 3-6 antibiotics for grid view (${selectedAntibiotics.length}/6 selected)`;
      default:
        return "";
    }
  };

  // Get max selections based on mode
  const getMaxSelections = (): number => {
    switch (comparisonMode) {
      case 'pair':
        return 2;
      case 'grid':
        return 6;
      case 'reference':
      default:
        return 5;
    }
  };

  return (
    <div className="comparison-container">
      {/* Tab Bar */}
      <div className="tab-bar border-b border-gray-200 mb-4">
        <div className="flex space-x-1">
          {/* Pair Comparison Tab */}
          <button
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              comparisonMode === 'pair'
                ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleModeSwitch('pair')}
          >
            <span>Pair Comparison</span>
          </button>

          {/* Reference Mode Tab (PRIMARY) */}
          <button
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors flex items-center gap-2 ${
              comparisonMode === 'reference'
                ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleModeSwitch('reference')}
          >
            <span>Reference Mode</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              comparisonMode === 'reference'
                ? 'bg-blue-400 text-white'
                : 'bg-blue-100 text-blue-700'
            }`}>
              Primary
            </span>
          </button>

          {/* Grid View Tab */}
          <button
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              comparisonMode === 'grid'
                ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleModeSwitch('grid')}
          >
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {/* Mode Description */}
      <div className="mode-description mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>{comparisonMode === 'pair' ? 'Pair Comparison' : comparisonMode === 'reference' ? 'Reference Mode' : 'Grid View'}:</strong>{' '}
          {MODE_DESCRIPTIONS[comparisonMode]}
        </p>
      </div>

      {/* Mode-Specific Guidance */}
      <div className="guidance mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">{getModeGuidance()}</p>
        <div className="flex gap-2">
          {/* Clear All Button */}
          {selectedAntibiotics.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1 text-sm text-gray-600 hover:text-red-600 border border-gray-300 rounded-md hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          )}
          {/* Select from Network Button (Phase 6 integration point) */}
          {onSelectFromNetwork && (
            <button
              onClick={onSelectFromNetwork}
              className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
            >
              Select from Network
            </button>
          )}
        </div>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="validation-error mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-800">
            <strong>Note:</strong> {validationError}
          </p>
        </div>
      )}

      {/* Antibiotic Selector */}
      <div className="selector-section mb-6">
        <AntibioticSelector
          antibiotics={enhancedAntibiotics as unknown as Antibiotic[]}
          selectedIds={selectedAntibiotics}
          onSelectionChange={handleSelectionChange}
          maxSelections={getMaxSelections()}
        />

        {/* Reference Selection Helper (for reference mode) */}
        {comparisonMode === 'reference' && selectedAntibiotics.length > 0 && (
          <div className="reference-selector mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Set Reference Antibiotic:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedAntibiotics.map((name) => (
                <button
                  key={name}
                  onClick={() => handleSetReference(name)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    referenceAntibiotic === name
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50'
                  }`}
                >
                  {name}
                  {referenceAntibiotic === name && ' (Reference)'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Content - preserve state with display:none instead of unmounting */}
      <div className="comparison-content">
        {/* Mode 1: Pair Comparison */}
        <div style={{ display: comparisonMode === 'pair' ? 'block' : 'none' }}>
          <PairComparison
            leftAntibiotic={(selectedAntibioticObjects[0] || null) as any}
            rightAntibiotic={(selectedAntibioticObjects[1] || null) as any}
            onClose={handleClose}
          />
        </div>

        {/* Mode 2: Reference Comparison (PRIMARY) */}
        <div style={{ display: comparisonMode === 'reference' ? 'block' : 'none' }}>
          <ReferenceComparison
            referenceAntibiotic={referenceAntibioticObject as any}
            comparisonAntibiotics={comparisonAntibioticObjects as any}
            onRemoveComparison={handleRemoveComparison}
            onClose={handleClose}
          />
        </div>

        {/* Mode 3: Grid Comparison */}
        <div style={{ display: comparisonMode === 'grid' ? 'block' : 'none' }}>
          <GridComparison
            antibiotics={selectedAntibioticObjects as any}
            onRemove={handleRemoveFromGrid}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ComparisonModeContainer;
