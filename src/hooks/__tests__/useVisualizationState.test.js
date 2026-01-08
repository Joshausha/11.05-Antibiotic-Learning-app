/**
 * useVisualizationState Hook Tests
 * Tests for the visualization state management hook
 * @created 2025-01-08
 */

import { renderHook, act } from '@testing-library/react';
import useVisualizationState from '../useVisualizationState';

// Mock data for testing
const mockPathogenData = {
  pathogens: [
    { id: 'staph-1', name: 'Staph aureus', gramStatus: 'positive' },
    { id: 'ecoli-1', name: 'E. coli', gramStatus: 'negative' },
    { id: 'pseudo-1', name: 'Pseudomonas', gramStatus: 'negative' },
  ],
};

const mockAntibioticData = {
  antibiotics: [
    { id: 'amp-1', name: 'Ampicillin', class: 'beta-lactam' },
    { id: 'vanco-1', name: 'Vancomycin', class: 'glycopeptide' },
    { id: 'cipro-1', name: 'Ciprofloxacin', class: 'fluoroquinolone' },
  ],
};

const mockMedicalConditions = [
  { id: 'pna-1', name: 'Pneumonia', category: 'Respiratory' },
  { id: 'uti-1', name: 'UTI', category: 'Genitourinary' },
  { id: 'ssti-1', name: 'SSTI', category: 'Skin' },
  { id: 'bronch-1', name: 'Bronchitis', category: 'Respiratory' },
];

describe('useVisualizationState', () => {
  describe('Core State Management', () => {
    test('initializes with default state values', () => {
      const { result } = renderHook(() => useVisualizationState());

      expect(result.current.activeVisualization).toBe('overview');
      expect(result.current.selectedFilter).toBe('all');
      expect(result.current.networkLayoutMode).toBe('d3');
      expect(result.current.spatialViewMode).toBe('clustered');
    });

    test('setActiveVisualization updates visualization type', () => {
      const { result } = renderHook(() => useVisualizationState());

      act(() => {
        result.current.setActiveVisualization('pathogen-network');
      });

      expect(result.current.activeVisualization).toBe('pathogen-network');
    });

    test('setSelectedFilter updates filter selection', () => {
      const { result } = renderHook(() => useVisualizationState());

      act(() => {
        result.current.setSelectedFilter('gram-positive');
      });

      expect(result.current.selectedFilter).toBe('gram-positive');
    });
  });

  describe('Network Layout State', () => {
    test('setNetworkLayoutMode updates layout mode', () => {
      const { result } = renderHook(() => useVisualizationState());

      act(() => {
        result.current.setNetworkLayoutMode('cytoscape');
      });

      expect(result.current.networkLayoutMode).toBe('cytoscape');
    });

    test('setSpatialViewMode updates spatial view mode', () => {
      const { result } = renderHook(() => useVisualizationState());

      act(() => {
        result.current.setSpatialViewMode('grid');
      });

      expect(result.current.spatialViewMode).toBe('grid');
    });
  });

  describe('Pathogen Context Navigation', () => {
    test('selectedPathogen initializes as null', () => {
      const { result } = renderHook(() => useVisualizationState());

      expect(result.current.selectedPathogen).toBeNull();
    });

    test('setSelectedPathogen updates selected pathogen', () => {
      const { result } = renderHook(() => useVisualizationState());

      const testPathogen = { id: 'test-1', name: 'Test Pathogen' };

      act(() => {
        result.current.setSelectedPathogen(testPathogen);
      });

      expect(result.current.selectedPathogen).toEqual(testPathogen);
    });

    test('handleNetworkNodeClick sets pathogen and switches visualization', () => {
      const { result } = renderHook(() => useVisualizationState());

      const pathogenNode = { id: 'staph-1', name: 'Staph aureus' };

      act(() => {
        result.current.handleNetworkNodeClick(pathogenNode);
      });

      expect(result.current.selectedPathogen).toEqual(pathogenNode);
      expect(result.current.activeVisualization).toBe('clinical-decision-tree');
    });

    test('returnToNetwork clears pathogen and returns to network view', () => {
      const { result } = renderHook(() => useVisualizationState());

      // First set up some state
      act(() => {
        result.current.handleNetworkNodeClick({ id: 'test', name: 'Test' });
        result.current.setDisplayedGuidelines([{ id: 'guideline-1' }]);
      });

      // Then return to network
      act(() => {
        result.current.returnToNetwork();
      });

      expect(result.current.activeVisualization).toBe('pathogen-network');
      expect(result.current.selectedPathogen).toBeNull();
      expect(result.current.displayedGuidelines).toEqual([]);
    });
  });

  describe('Guideline Display State', () => {
    test('selectedConditionForGuidelines defaults to CAP', () => {
      const { result } = renderHook(() => useVisualizationState());

      expect(result.current.selectedConditionForGuidelines).toBe('community-acquired-pneumonia');
    });

    test('setSelectedConditionForGuidelines updates condition', () => {
      const { result } = renderHook(() => useVisualizationState());

      act(() => {
        result.current.setSelectedConditionForGuidelines('urinary-tract-infection');
      });

      expect(result.current.selectedConditionForGuidelines).toBe('urinary-tract-infection');
    });

    test('displayedGuidelines initializes empty and can be updated', () => {
      const { result } = renderHook(() => useVisualizationState());

      expect(result.current.displayedGuidelines).toEqual([]);

      act(() => {
        result.current.setDisplayedGuidelines([
          { id: 'g1', name: 'CAP Guidelines' },
          { id: 'g2', name: 'UTI Guidelines' },
        ]);
      });

      expect(result.current.displayedGuidelines).toHaveLength(2);
    });
  });

  describe('Animation State', () => {
    test('emergency and animation modes initialize as false', () => {
      const { result } = renderHook(() => useVisualizationState());

      expect(result.current.emergencyMode).toBe(false);
      expect(result.current.animationEnabled).toBe(false);
    });

    test('toggleEmergencyMode toggles emergency mode', () => {
      const { result } = renderHook(() => useVisualizationState());

      act(() => {
        result.current.toggleEmergencyMode();
      });

      expect(result.current.emergencyMode).toBe(true);

      act(() => {
        result.current.toggleEmergencyMode();
      });

      expect(result.current.emergencyMode).toBe(false);
    });

    test('toggleAnimation toggles animation enabled', () => {
      const { result } = renderHook(() => useVisualizationState());

      act(() => {
        result.current.toggleAnimation();
      });

      expect(result.current.animationEnabled).toBe(true);

      act(() => {
        result.current.toggleAnimation();
      });

      expect(result.current.animationEnabled).toBe(false);
    });

    test('setEmergencyMode directly sets mode', () => {
      const { result } = renderHook(() => useVisualizationState());

      act(() => {
        result.current.setEmergencyMode(true);
      });

      expect(result.current.emergencyMode).toBe(true);
    });

    test('visualizationRef is available', () => {
      const { result } = renderHook(() => useVisualizationState());

      expect(result.current.visualizationRef).toBeDefined();
      expect(result.current.visualizationRef.current).toBeNull();
    });
  });

  describe('Comparison Mode', () => {
    test('selectedComparisonAntibiotics initializes empty', () => {
      const { result } = renderHook(() => useVisualizationState());

      expect(result.current.selectedComparisonAntibiotics).toEqual([]);
    });

    test('setSelectedComparisonAntibiotics updates selection', () => {
      const { result } = renderHook(() => useVisualizationState());

      const antibiotics = [
        { id: 'amp', name: 'Ampicillin' },
        { id: 'vanco', name: 'Vancomycin' },
      ];

      act(() => {
        result.current.setSelectedComparisonAntibiotics(antibiotics);
      });

      expect(result.current.selectedComparisonAntibiotics).toEqual(antibiotics);
    });

    test('handleComparisonDeselect removes antibiotic by id', () => {
      const { result } = renderHook(() => useVisualizationState());

      const antibiotics = [
        { id: 'amp', name: 'Ampicillin' },
        { id: 'vanco', name: 'Vancomycin' },
        { id: 'cipro', name: 'Ciprofloxacin' },
      ];

      act(() => {
        result.current.setSelectedComparisonAntibiotics(antibiotics);
      });

      act(() => {
        result.current.handleComparisonDeselect('vanco');
      });

      expect(result.current.selectedComparisonAntibiotics).toHaveLength(2);
      expect(result.current.selectedComparisonAntibiotics.find(a => a.id === 'vanco')).toBeUndefined();
    });
  });

  describe('Progressive Disclosure', () => {
    test('expandedSections initialize all as false', () => {
      const { result } = renderHook(() => useVisualizationState());

      expect(result.current.expandedSections.explore).toBe(false);
      expect(result.current.expandedSections.analyze).toBe(false);
      expect(result.current.expandedSections.settings).toBe(false);
    });

    test('toggleSection toggles specific section', () => {
      const { result } = renderHook(() => useVisualizationState());

      act(() => {
        result.current.toggleSection('explore');
      });

      expect(result.current.expandedSections.explore).toBe(true);
      expect(result.current.expandedSections.analyze).toBe(false);

      act(() => {
        result.current.toggleSection('explore');
      });

      expect(result.current.expandedSections.explore).toBe(false);
    });

    test('toggleSection can toggle multiple sections independently', () => {
      const { result } = renderHook(() => useVisualizationState());

      act(() => {
        result.current.toggleSection('explore');
        result.current.toggleSection('settings');
      });

      expect(result.current.expandedSections.explore).toBe(true);
      expect(result.current.expandedSections.analyze).toBe(false);
      expect(result.current.expandedSections.settings).toBe(true);
    });
  });

  describe('Computed Values', () => {
    test('overviewStats computes correctly with data', () => {
      const { result } = renderHook(() =>
        useVisualizationState({
          pathogenData: mockPathogenData,
          antibioticData: mockAntibioticData,
          medicalConditions: mockMedicalConditions,
        })
      );

      expect(result.current.overviewStats.totalConditions).toBe(4);
      expect(result.current.overviewStats.totalPathogens).toBe(3);
      expect(result.current.overviewStats.totalAntibiotics).toBe(3);
      expect(result.current.overviewStats.gramPositive).toBe(1);
      expect(result.current.overviewStats.gramNegative).toBe(2);
    });

    test('overviewStats handles empty data gracefully', () => {
      const { result } = renderHook(() => useVisualizationState());

      expect(result.current.overviewStats.totalConditions).toBe(0);
      expect(result.current.overviewStats.totalPathogens).toBe(0);
      expect(result.current.overviewStats.totalAntibiotics).toBe(0);
    });

    test('categoryDistribution computes correctly', () => {
      const { result } = renderHook(() =>
        useVisualizationState({
          medicalConditions: mockMedicalConditions,
        })
      );

      expect(result.current.categoryDistribution.Respiratory).toBe(2);
      expect(result.current.categoryDistribution.Genitourinary).toBe(1);
      expect(result.current.categoryDistribution.Skin).toBe(1);
    });

    test('drugClassDistribution computes correctly', () => {
      const { result } = renderHook(() =>
        useVisualizationState({
          antibioticData: mockAntibioticData,
        })
      );

      expect(result.current.drugClassDistribution['beta-lactam']).toBe(1);
      expect(result.current.drugClassDistribution.glycopeptide).toBe(1);
      expect(result.current.drugClassDistribution.fluoroquinolone).toBe(1);
    });
  });

  describe('Memoization and Performance', () => {
    test('overviewStats memoizes correctly (referential equality)', () => {
      const { result, rerender } = renderHook(() =>
        useVisualizationState({
          pathogenData: mockPathogenData,
          antibioticData: mockAntibioticData,
          medicalConditions: mockMedicalConditions,
        })
      );

      const firstStats = result.current.overviewStats;

      // Rerender without changing data
      rerender();

      const secondStats = result.current.overviewStats;

      // Should be the same reference (memoized)
      expect(firstStats).toBe(secondStats);
    });

    test('callback functions are stable across rerenders', () => {
      const { result, rerender } = renderHook(() => useVisualizationState());

      const firstToggleEmergency = result.current.toggleEmergencyMode;
      const firstToggleSection = result.current.toggleSection;

      rerender();

      // Callbacks should be stable due to useCallback
      expect(result.current.toggleEmergencyMode).toBe(firstToggleEmergency);
      expect(result.current.toggleSection).toBe(firstToggleSection);
    });
  });
});
