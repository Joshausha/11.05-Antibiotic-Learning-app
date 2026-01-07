/**
 * SharedSelectionContext - Cross-Mode Selection Persistence
 *
 * Maintains shared selection state that persists across mode switches.
 * When exploring Vancomycin in the network visualization and switching to
 * Compare mode, Vancomycin stays selected - the modes feel connected, not siloed.
 *
 * Created: Phase 6 Plan 2 - Context Preservation
 *
 * Pattern: Single state object (per Phase 02-02 NetworkFilters pattern)
 * Separation: This context handles learning state, AppContext handles UI/navigation state
 */

import React, { createContext, useContext, useState, useCallback, FC, ReactNode } from 'react';
import { SharedSelection } from '../types/app.types';

/**
 * Initial empty selection state
 */
const initialSelection: SharedSelection = {
  selectedAntibiotics: [],
  selectedPathogens: [],
  lastSelectedAntibiotic: null,
  lastSelectedPathogen: null
};

/**
 * Context value interface with state and actions
 */
interface SharedSelectionContextValue {
  // State
  selection: SharedSelection;

  // Antibiotic actions
  addAntibiotic: (name: string) => void;
  removeAntibiotic: (name: string) => void;
  setAntibiotics: (names: string[]) => void;
  clearAntibiotics: () => void;

  // Pathogen actions
  addPathogen: (name: string) => void;
  removePathogen: (name: string) => void;
  setPathogens: (names: string[]) => void;
  clearPathogens: () => void;

  // Clear all
  clearAll: () => void;
}

/**
 * Create the context with undefined default
 */
const SharedSelectionContext = createContext<SharedSelectionContextValue | undefined>(undefined);

/**
 * Provider props
 */
interface SharedSelectionProviderProps {
  children: ReactNode;
}

/**
 * SharedSelectionProvider - Wraps app to provide cross-mode selection state
 */
export const SharedSelectionProvider: FC<SharedSelectionProviderProps> = ({ children }) => {
  const [selection, setSelection] = useState<SharedSelection>(initialSelection);

  // Antibiotic actions
  const addAntibiotic = useCallback((name: string) => {
    setSelection(prev => {
      if (prev.selectedAntibiotics.includes(name)) {
        return prev; // Already selected
      }
      return {
        ...prev,
        selectedAntibiotics: [...prev.selectedAntibiotics, name],
        lastSelectedAntibiotic: name
      };
    });
  }, []);

  const removeAntibiotic = useCallback((name: string) => {
    setSelection(prev => {
      const newSelected = prev.selectedAntibiotics.filter(n => n !== name);
      return {
        ...prev,
        selectedAntibiotics: newSelected,
        lastSelectedAntibiotic: prev.lastSelectedAntibiotic === name
          ? (newSelected[newSelected.length - 1] || null)
          : prev.lastSelectedAntibiotic
      };
    });
  }, []);

  const setAntibiotics = useCallback((names: string[]) => {
    setSelection(prev => ({
      ...prev,
      selectedAntibiotics: names,
      lastSelectedAntibiotic: names[names.length - 1] || null
    }));
  }, []);

  const clearAntibiotics = useCallback(() => {
    setSelection(prev => ({
      ...prev,
      selectedAntibiotics: [],
      lastSelectedAntibiotic: null
    }));
  }, []);

  // Pathogen actions
  const addPathogen = useCallback((name: string) => {
    setSelection(prev => {
      if (prev.selectedPathogens.includes(name)) {
        return prev; // Already selected
      }
      return {
        ...prev,
        selectedPathogens: [...prev.selectedPathogens, name],
        lastSelectedPathogen: name
      };
    });
  }, []);

  const removePathogen = useCallback((name: string) => {
    setSelection(prev => {
      const newSelected = prev.selectedPathogens.filter(n => n !== name);
      return {
        ...prev,
        selectedPathogens: newSelected,
        lastSelectedPathogen: prev.lastSelectedPathogen === name
          ? (newSelected[newSelected.length - 1] || null)
          : prev.lastSelectedPathogen
      };
    });
  }, []);

  const setPathogens = useCallback((names: string[]) => {
    setSelection(prev => ({
      ...prev,
      selectedPathogens: names,
      lastSelectedPathogen: names[names.length - 1] || null
    }));
  }, []);

  const clearPathogens = useCallback(() => {
    setSelection(prev => ({
      ...prev,
      selectedPathogens: [],
      lastSelectedPathogen: null
    }));
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setSelection(initialSelection);
  }, []);

  const contextValue: SharedSelectionContextValue = {
    selection,
    addAntibiotic,
    removeAntibiotic,
    setAntibiotics,
    clearAntibiotics,
    addPathogen,
    removePathogen,
    setPathogens,
    clearPathogens,
    clearAll
  };

  return (
    <SharedSelectionContext.Provider value={contextValue}>
      {children}
    </SharedSelectionContext.Provider>
  );
};

/**
 * useSharedSelection - Hook to access shared selection context
 * @throws Error if used outside SharedSelectionProvider
 */
export const useSharedSelection = (): SharedSelectionContextValue => {
  const context = useContext(SharedSelectionContext);

  if (!context) {
    throw new Error('useSharedSelection must be used within a SharedSelectionProvider');
  }

  return context;
};

export default SharedSelectionContext;
